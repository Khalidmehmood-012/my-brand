import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import Order, { statusValues } from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { createNotification } from '../services/notifications.js'
import { createSession } from './auth.js'
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js'
import { AppError, asyncHandler, pagination, success } from '../utils/api.js'
import Setting from '../models/Setting.js'
import { pakistanLocations, shippingFor } from '../data/pakistan-locations.js'

const router = Router()

async function ensureOrderUser(order) {
  if (order.user) return order.user
  if (!order.customer?.email) return null
  const user = await User.findOne({ email: order.customer.email.toLowerCase() }).select('_id')
  if (!user) return null
  order.user = user.id
  await order.save()
  return user.id
}

const createSchema = z.object({
  firebaseUid: z.string().optional().default(''),
  password: z.string().min(8).max(128).optional(),
  saveAddress: z.boolean().optional().default(false),
  addressLabel: z.string().max(50).optional().default('Home'),
  customer: z.object({
    name: z.string().trim().min(2),
    email: z.string().email().or(z.literal('')).optional().default(''),
    phone: z.string().trim().min(7),
    address: z.string().trim().min(5),
    province: z.enum(Object.keys(pakistanLocations)),
    city: z.string().trim().min(2),
  }),
  items: z.array(z.object({
    productId: z.string().optional(),
    name: z.string().min(1),
    slug: z.string().optional(),
    image: z.string().optional(),
    price: z.coerce.number().min(0),
    quantity: z.coerce.number().int().min(1).max(99),
    selectedSize: z.string().optional(),
    isCustom: z.boolean().optional().default(false),
    customDetails: z.any().optional(),
  })).min(1),
  paymentMethod: z.enum(['cod', 'easypaisa', 'jazzcash', 'bank']).optional().default('cod'),
  paymentProof: z.string().url().optional().or(z.literal('')).default(''),
  notes: z.string().max(1000).optional().default(''),
})

router.post('/', optionalAuthenticate, asyncHandler(async (request, response) => {
  const result = createSchema.safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Please correct the highlighted checkout fields.', result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })))
  const input = result.data
  if (!pakistanLocations[input.customer.province].includes(input.customer.city)) throw new AppError(422, 'VALIDATION_ERROR', 'Please select a valid Pakistan city.', [{ field: 'customer.city', message: 'Select a city from the selected province.' }])

  const verifiedItems = await Promise.all(input.items.map(async (item) => {
    if (item.isCustom || !item.productId) return item
    const product = await Product.findOne({ $or: [{ _id: /^[a-f\d]{24}$/i.test(item.productId) ? item.productId : undefined }, { legacyId: item.productId }], isActive: true })
    if (!product) throw new AppError(422, 'PRODUCT_UNAVAILABLE', `${item.name} is no longer available.`)
    if (product.stock < item.quantity) throw new AppError(409, 'INSUFFICIENT_STOCK', `Only ${product.stock} units of ${product.name} are available.`)
    const productWithCost = await Product.findById(product.id).select('+purchasePrice')
    return { ...item, product: product.id, productId: product.id, name: product.name, slug: product.slug, image: product.image, price: product.price, purchasePrice: productWithCost.purchasePrice || 0 }
  }))

  const subtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const store = (await Setting.findOne({ key: 'store' }).lean())?.value || {}
  const shipping = shippingFor(input.customer.province, subtotal, store)
  let user = request.user || (input.firebaseUid ? await User.findOne({ firebaseUid: input.firebaseUid }) : null)
  let authToken = ''
  if (!user && input.password) {
    if (!input.customer.email) throw new AppError(422, 'ACCOUNT_DETAILS_REQUIRED', 'Email is required to save your order account.')
    user = await User.findOne({ email: input.customer.email.toLowerCase() }).select('+passwordHash')
    if (user) {
      if (!user.passwordHash || !await bcrypt.compare(input.password, user.passwordHash)) throw new AppError(401, 'INVALID_CREDENTIALS', 'This email already has an account. Enter the correct password or login first.')
    } else {
      user = await User.create({ name: input.customer.name, email: input.customer.email, phone: input.customer.phone, passwordHash: await bcrypt.hash(input.password, 12), role: 'customer' })
    }
    authToken = await createSession(user, request, 'storefront')
  }
  if (input.paymentMethod !== 'cod' && !input.paymentProof) throw new AppError(422, 'PAYMENT_PROOF_REQUIRED', 'Upload a payment screenshot before placing this order.')
  if (input.saveAddress && user) {
    const addressData = { label: input.addressLabel, ...input.customer, email: undefined, isDefault: user.addresses.length === 0 }
    const existingAddress = user.addresses.find((address) => address.address.toLowerCase() === input.customer.address.toLowerCase() && address.city.toLowerCase() === input.customer.city.toLowerCase())
    if (existingAddress) Object.assign(existingAddress, addressData)
    else user.addresses.push(addressData)
    user.phone = input.customer.phone
    await user.save()
  }
  const order = await Order.create({
    ...input,
    user: user?.id || null,
    items: verifiedItems,
    subtotal,
    shipping,
    total: subtotal + shipping,
    paymentStatus: input.paymentMethod === 'cod' ? 'unpaid' : 'pending',
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
  })

  if (user) {
    await User.findByIdAndUpdate(user.id, { $inc: { totalOrders: 1, totalSpent: order.total } })
  }
  const updatedProducts = await Promise.all(verifiedItems.filter((item) => item.product).map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }, { new: true })))
  await Promise.all(updatedProducts.filter((product) => product && product.stock <= 5).map((product) => createNotification({ recipientRole: 'admin', title: 'Low stock alert', message: `${product.name} has only ${product.stock} unit${product.stock === 1 ? '' : 's'} left.`, type: 'inventory', link: '/products' })))

  await createNotification({ recipientRole: 'admin', title: 'New order received', message: `${order.orderNumber} was placed by ${order.customer.name}.`, type: 'order', link: '/orders' })
  if (user) await createNotification({ user: user.id, recipientRole: 'customer', title: 'Order placed successfully', message: `${order.orderNumber} has been received and is currently pending confirmation.`, type: 'order', link: '/profile' })

  return success(response, { ...order.toJSON(), ...(authToken ? { authToken } : {}), ...(user ? { account: user.toJSON() } : {}) }, 201)
}))

router.get('/track/:orderNumber', asyncHandler(async (request, response) => {
  const order = await Order.findOne({ orderNumber: request.params.orderNumber }).select('orderNumber status statusHistory customer.city createdAt updatedAt')
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'No order was found with this order number.')
  return success(response, order)
}))

router.get('/mine', authenticate, asyncHandler(async (request, response) => {
  const { page, limit, skip } = pagination(request.query)
  await Order.updateMany(
    { user: null, 'customer.email': request.user.email.toLowerCase() },
    { $set: { user: request.user.id } },
  )
  const filter = { user: request.user.id }
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ])
  return success(response, items, 200, { page, limit, total, pages: Math.ceil(total / limit) })
}))

router.get('/', authenticate, authorize('admin', 'staff'), asyncHandler(async (request, response) => {
  const { page, limit, skip } = pagination(request.query)
  const filter = {}
  if (request.query.status) filter.status = request.query.status
  if (request.query.search) {
    const expression = new RegExp(request.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ orderNumber: expression }, { 'customer.name': expression }, { 'customer.phone': expression }]
  }
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ])
  return success(response, items, 200, { page, limit, total, pages: Math.ceil(total / limit) })
}))

router.patch('/:id/status', authenticate, authorize('admin', 'staff'), asyncHandler(async (request, response) => {
  const result = z.object({ status: z.enum(statusValues), note: z.string().max(500).optional() }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Order status is invalid.', result.error.issues)
  const order = await Order.findById(request.params.id)
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order was not found.')
  const previousStatus = order.status
  const inactiveStatuses = ['cancelled', 'returned']
  const wasInactive = inactiveStatuses.includes(order.status)
  const becomesInactive = inactiveStatuses.includes(result.data.status)
  if (!wasInactive && becomesInactive) {
    await Promise.all(order.items.filter((item) => item.product).map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })))
  } else if (wasInactive && !becomesInactive) {
    for (const item of order.items.filter((entry) => entry.product)) {
      const product = await Product.findById(item.product)
      if (!product || product.stock < item.quantity) throw new AppError(409, 'INSUFFICIENT_STOCK', `Stock is not available to reactivate ${item.name}.`)
      product.stock -= item.quantity
      await product.save()
    }
  }
  order.status = result.data.status
  order.statusHistory.push({ ...result.data, changedBy: request.user.id })
  await order.save()
  const customerUser = await ensureOrderUser(order)
  if (customerUser) await createNotification({ user: customerUser, recipientRole: 'customer', title: 'Order status updated', message: `${order.orderNumber} is now ${result.data.status.replaceAll('-', ' ')}.`, type: 'order', link: '/profile' })
  if (customerUser && result.data.status === 'delivered' && previousStatus !== 'delivered') {
    await createNotification({ user: customerUser, recipientRole: 'customer', title: 'How was your order?', message: `${order.orderNumber} has been delivered. Review your products to help other customers shop confidently.`, type: 'order', link: `/profile?review=${order.id}` })
  }
  return success(response, order)
}))

router.patch('/:id/payment', authenticate, authorize('admin', 'staff'), asyncHandler(async (request, response) => {
  const result = z.object({ paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']), note: z.string().max(500).optional().default('') }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Payment review data is invalid.', result.error.issues)
  const order = await Order.findById(request.params.id)
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order was not found.')
  const wasInactive = ['cancelled', 'returned'].includes(order.status)
  order.paymentStatus = result.data.paymentStatus
  order.paymentReviewNote = result.data.note
  if (result.data.paymentStatus === 'paid' && order.status === 'pending') {
    order.status = 'confirmed'
    order.statusHistory.push({ status: 'confirmed', note: result.data.note || 'Payment approved', changedBy: request.user.id })
  }
  if (['failed', 'refunded'].includes(result.data.paymentStatus) && !wasInactive) {
    order.status = result.data.paymentStatus === 'refunded' ? 'returned' : 'cancelled'
    order.statusHistory.push({ status: order.status, note: result.data.note || `Payment ${result.data.paymentStatus}`, changedBy: request.user.id })
    await Promise.all(order.items.filter((item) => item.product).map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })))
  }
  await order.save()
  const customerUser = await ensureOrderUser(order)
  if (customerUser) await createNotification({ user: customerUser, recipientRole: 'customer', title: 'Payment reviewed', message: `Payment for ${order.orderNumber} was marked ${result.data.paymentStatus}.`, type: 'payment', link: '/profile' })
  return success(response, order)
}))

router.get('/:id', authenticate, authorize('admin', 'staff'), asyncHandler(async (request, response) => {
  const order = await Order.findById(request.params.id).populate('user', 'name email phone')
  if (!order) throw new AppError(404, 'ORDER_NOT_FOUND', 'Order was not found.')
  return success(response, order)
}))

export default router
