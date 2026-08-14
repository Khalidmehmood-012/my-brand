import { Router } from 'express'
import { z } from 'zod'
import Claim from '../models/Claim.js'
import Order from '../models/Order.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { AppError, asyncHandler, success } from '../utils/api.js'
import { createNotification } from '../services/notifications.js'

const router = Router()
router.use(authenticate)

router.post('/', asyncHandler(async (request, response) => {
  const result = z.object({ orderId: z.string().min(1), itemIndex: z.coerce.number().int().min(0), reason: z.string().trim().min(10).max(1000), images: z.array(z.string().url()).max(5).optional().default([]) }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Claim data is invalid.', result.error.issues)
  const order = await Order.findOne({ _id: result.data.orderId, user: request.user.id, status: 'delivered' })
  if (!order) throw new AppError(404, 'ORDER_NOT_ELIGIBLE', 'Only your delivered order can be claimed.')
  const item = order.items[result.data.itemIndex]
  if (!item) throw new AppError(422, 'ITEM_NOT_FOUND', 'Order item was not found.')
  const claim = await Claim.create({ ...result.data, order: order.id, user: request.user.id, orderNumber: order.orderNumber, itemName: item.name })
  await createNotification({ recipientRole: 'admin', title: 'Damage claim submitted', message: `${order.orderNumber}: ${item.name}`, type: 'order', link: '/claims' })
  return success(response, claim, 201)
}))

router.get('/mine', asyncHandler(async (request, response) => success(response, await Claim.find({ user: request.user.id }).sort({ createdAt: -1 }))))

router.get('/', authorize('admin', 'staff'), asyncHandler(async (_request, response) => success(response, await Claim.find({}).populate('user', 'name email').sort({ createdAt: -1 }))))

router.patch('/:id', authorize('admin', 'staff'), asyncHandler(async (request, response) => {
  const result = z.object({ status: z.enum(['submitted', 'reviewing', 'approved', 'rejected', 'resolved']), adminNote: z.string().max(1000).optional().default('') }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Claim review is invalid.', result.error.issues)
  const claim = await Claim.findByIdAndUpdate(request.params.id, result.data, { new: true })
  if (!claim) throw new AppError(404, 'CLAIM_NOT_FOUND', 'Claim was not found.')
  await createNotification({ user: claim.user, recipientRole: 'customer', title: 'Damage claim updated', message: `${claim.orderNumber} claim is now ${claim.status}.`, type: 'order', link: '/profile' })
  return success(response, claim)
}))

export default router
