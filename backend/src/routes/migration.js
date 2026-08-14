import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { AppError, asyncHandler, success } from '../utils/api.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import User from '../models/User.js'
import Order from '../models/Order.js'
import Setting from '../models/Setting.js'
import Cart from '../models/Cart.js'
import Expense from '../models/Expense.js'
import Notification from '../models/Notification.js'
import Claim from '../models/Claim.js'
import Review from '../models/Review.js'

const router = Router()
router.use(authenticate, authorize('admin'))
const collections = { products: Product, categories: Category, users: User, orders: Order, settings: Setting, carts: Cart, expenses: Expense, notifications: Notification, claims: Claim, reviews: Review }

router.get('/export', asyncHandler(async (_request, response) => {
  const entries = await Promise.all(Object.entries(collections).map(async ([key, model]) => [key, key === 'users' ? await model.find({}).select('+passwordHash').lean() : await model.find({}).lean()]))
  return success(response, { format: 'komrez-backup-v1', exportedAt: new Date().toISOString(), collections: Object.fromEntries(entries) })
}))

router.post('/import', asyncHandler(async (request, response) => {
  if (request.body?.format !== 'komrez-backup-v1' || !request.body.collections) throw new AppError(422, 'INVALID_BACKUP', 'This is not a valid Komrez backup file.')
  const result = {}
  for (const [key, model] of Object.entries(collections)) {
    const documents = request.body.collections[key]
    if (!Array.isArray(documents) || !documents.length) { result[key] = 0; continue }
    const operations = documents.map((document) => ({ replaceOne: { filter: { _id: document._id }, replacement: document, upsert: true } }))
    await model.bulkWrite(operations, { ordered: false })
    result[key] = documents.length
  }
  return success(response, result)
}))

export default router
