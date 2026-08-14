import { Router } from 'express'
import { z } from 'zod'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { authenticate } from '../middleware/auth.js'
import { AppError, asyncHandler, success } from '../utils/api.js'

const router = Router()
router.use(authenticate)

async function populatedCart(userId) {
  return Cart.findOneAndUpdate({ user: userId }, { $setOnInsert: { items: [] } }, { new: true, upsert: true })
    .populate('items.product')
}

router.get('/', asyncHandler(async (request, response) => success(response, await populatedCart(request.user.id))))

router.put('/', asyncHandler(async (request, response) => {
  const parsed = z.object({ items: z.array(z.object({
    productId: z.string().regex(/^[a-f\d]{24}$/i), selectedSize: z.string().max(30).optional().default(''),
    quantity: z.coerce.number().int().min(1).max(99),
  })).max(100) }).safeParse(request.body)
  if (!parsed.success) throw new AppError(422, 'VALIDATION_ERROR', 'Cart data is invalid.', parsed.error.issues)
  const ids = [...new Set(parsed.data.items.map((item) => item.productId))]
  const products = await Product.find({ _id: { $in: ids }, isActive: true }).select('_id stock')
  if (products.length !== ids.length) throw new AppError(422, 'PRODUCT_UNAVAILABLE', 'One or more cart products are unavailable.')
  const available = new Map(products.map((product) => [String(product.id), product.stock]))
  const totals = parsed.data.items.reduce((map, item) => map.set(item.productId, (map.get(item.productId) || 0) + item.quantity), new Map())
  for (const [productId, quantity] of totals) if (quantity > available.get(productId)) throw new AppError(409, 'INSUFFICIENT_STOCK', `Only ${available.get(productId)} unit(s) are available.`)
  await Cart.findOneAndUpdate({ user: request.user.id }, {
    items: parsed.data.items.map((item) => ({ product: item.productId, selectedSize: item.selectedSize, quantity: item.quantity })),
  }, { upsert: true, runValidators: true })
  return success(response, await populatedCart(request.user.id))
}))

router.delete('/', asyncHandler(async (request, response) => {
  await Cart.findOneAndUpdate({ user: request.user.id }, { items: [] }, { upsert: true })
  return success(response, { cleared: true })
}))

export default router
