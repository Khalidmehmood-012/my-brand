import { Router } from 'express'
import { z } from 'zod'
import Review from '../models/Review.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { authenticate } from '../middleware/auth.js'
import { AppError, asyncHandler, success } from '../utils/api.js'

const router = Router()

router.get('/product/:productId', asyncHandler(async (request, response) => {
  const product = await Product.findOne({ $or: [{ _id: /^[a-f\d]{24}$/i.test(request.params.productId) ? request.params.productId : undefined }, { legacyId: request.params.productId }, { slug: request.params.productId }] })
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product was not found.')
  const items = await Review.find({ product: product.id, isApproved: true }).sort({ createdAt: -1 }).limit(50).select('-user -order')
  const average = items.length ? items.reduce((sum, item) => sum + item.rating, 0) / items.length : 0
  return success(response, items, 200, { total: items.length, average: Number(average.toFixed(1)) })
}))

router.post('/', authenticate, asyncHandler(async (request, response) => {
  const result = z.object({ orderId: z.string().min(1), itemIndex: z.coerce.number().int().min(0), rating: z.coerce.number().int().min(1).max(5), comment: z.string().trim().min(5).max(1000) }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Review data is invalid.', result.error.issues)
  const order = await Order.findOne({ _id: result.data.orderId, user: request.user.id, status: 'delivered' })
  const item = order?.items?.[result.data.itemIndex]
  if (!order || !item?.product) throw new AppError(404, 'REVIEW_NOT_ALLOWED', 'Only delivered products can be reviewed.')
  const exists = await Review.exists({ order: order.id, itemIndex: result.data.itemIndex, user: request.user.id })
  if (exists) throw new AppError(409, 'REVIEW_EXISTS', 'You have already reviewed this product from this order.')
  const review = await Review.create({ ...result.data, order: order.id, product: item.product, user: request.user.id, customerName: request.user.name })
  return success(response, review, 201)
}))

export default router
