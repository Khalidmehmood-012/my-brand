import { Router } from 'express'
import { z } from 'zod'
import PushSubscription from '../models/PushSubscription.js'
import { authenticate } from '../middleware/auth.js'
import { env } from '../config/env.js'
import { AppError, asyncHandler, success } from '../utils/api.js'

const router = Router()

router.get('/push/public-key', (_request, response) => success(response, { publicKey: env.vapidPublicKey, configured: Boolean(env.vapidPublicKey && env.vapidPrivateKey) }))
router.use(authenticate)

router.post('/push/subscribe', asyncHandler(async (request, response) => {
  const result = z.object({ endpoint: z.string().url(), keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }) }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'INVALID_PUSH_SUBSCRIPTION', 'Browser notification subscription is invalid.')
  const context = request.authContext === 'admin' && ['admin', 'staff'].includes(request.user.role) ? 'admin' : 'storefront'
  const subscription = await PushSubscription.findOneAndUpdate({ endpoint: result.data.endpoint }, { ...result.data, user: request.user.id, context, userAgent: request.get('user-agent') || '' }, { upsert: true, new: true, setDefaultsOnInsert: true })
  return success(response, { subscribed: true, id: subscription.id }, 201)
}))

router.delete('/push/subscribe', asyncHandler(async (request, response) => {
  const endpoint = z.string().url().safeParse(request.body?.endpoint)
  if (endpoint.success) await PushSubscription.deleteOne({ endpoint: endpoint.data, user: request.user.id })
  return success(response, { subscribed: false })
}))

export default router
