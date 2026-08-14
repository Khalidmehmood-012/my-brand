import { Router } from 'express'
import Setting from '../models/Setting.js'
import Category from '../models/Category.js'
import { asyncHandler, success } from '../utils/api.js'

const router = Router()
router.get('/', asyncHandler(async (_request, response) => {
  const [settings, categories] = await Promise.all([Setting.find({ key: { $in: ['store', 'payments', 'hero'] } }).lean(), Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean()])
  return success(response, { settings: Object.fromEntries(settings.map((item) => [item.key, item.value])), categories })
}))
export default router
