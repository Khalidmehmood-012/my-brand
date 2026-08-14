import { Router } from 'express'
import { z } from 'zod'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Setting from '../models/Setting.js'
import Expense from '../models/Expense.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { AppError, asyncHandler, pagination, success } from '../utils/api.js'

const router = Router()
router.use(authenticate, authorize('admin', 'staff'))

router.get('/dashboard', asyncHandler(async (_request, response) => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const [products, orders, customers, pendingOrders, financeResult, expenseResult, stockValueResult, recentOrders, lowStock] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    User.countDocuments({ role: 'customer', isActive: true }),
    Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'processing'] } }),
    Order.aggregate([
      { $match: { status: { $nin: ['cancelled', 'returned'] }, createdAt: { $gte: startOfMonth } } },
      { $unwind: '$items' },
      { $group: { _id: '$_id', orderTotal: { $first: '$total' }, cost: { $sum: { $multiply: ['$items.purchasePrice', '$items.quantity'] } } } },
      { $group: { _id: null, revenue: { $sum: '$orderTotal' }, cost: { $sum: '$cost' } } },
    ]),
    Expense.aggregate([{ $match: { expenseDate: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Product.aggregate([{ $match: { isActive: true } }, { $group: { _id: null, purchaseValue: { $sum: { $multiply: ['$purchasePrice', '$stock'] } }, retailValue: { $sum: { $multiply: ['$price', '$stock'] } }, units: { $sum: '$stock' } } }]),
    Order.find().sort({ createdAt: -1 }).limit(6).select('orderNumber customer total status createdAt'),
    Product.find({ isActive: true, stock: { $lte: 10 } }).sort({ stock: 1 }).limit(6).select('name slug stock'),
  ])

  return success(response, {
    metrics: {
      products, orders, customers, pendingOrders,
      monthlyRevenue: financeResult[0]?.revenue || 0,
      productCost: financeResult[0]?.cost || 0,
      operatingExpenses: expenseResult[0]?.total || 0,
      grossProfit: (financeResult[0]?.revenue || 0) - (financeResult[0]?.cost || 0),
      netProfit: (financeResult[0]?.revenue || 0) - (financeResult[0]?.cost || 0) - (expenseResult[0]?.total || 0),
      stockUnits: stockValueResult[0]?.units || 0,
      stockPurchaseValue: stockValueResult[0]?.purchaseValue || 0,
      stockRetailValue: stockValueResult[0]?.retailValue || 0,
    },
    recentOrders,
    lowStock,
  })
}))

router.get('/expenses', authorize('admin'), asyncHandler(async (_request, response) => success(response, await Expense.find().sort({ expenseDate: -1 }).limit(200))))

router.post('/expenses', authorize('admin'), asyncHandler(async (request, response) => {
  const result = z.object({ title: z.string().trim().min(2).max(160), category: z.enum(['marketing', 'shipping', 'operations', 'salary', 'rent', 'utilities', 'other']), amount: z.coerce.number().min(0), expenseDate: z.coerce.date(), note: z.string().max(1000).optional().default('') }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Expense data is invalid.', result.error.issues)
  return success(response, await Expense.create({ ...result.data, createdBy: request.user.id }), 201)
}))

router.delete('/expenses/:id', authorize('admin'), asyncHandler(async (request, response) => {
  const expense = await Expense.findByIdAndDelete(request.params.id)
  if (!expense) throw new AppError(404, 'EXPENSE_NOT_FOUND', 'Expense was not found.')
  return success(response, { id: expense.id, deleted: true })
}))

router.get('/users', authorize('admin'), asyncHandler(async (request, response) => {
  const { page, limit, skip } = pagination(request.query)
  const filter = {}
  if (request.query.role) filter.role = request.query.role
  if (request.query.search) {
    const expression = new RegExp(request.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: expression }, { email: expression }, { phone: expression }]
  }
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ])
  return success(response, items, 200, { page, limit, total, pages: Math.ceil(total / limit) })
}))

router.patch('/users/:id', authorize('admin'), asyncHandler(async (request, response) => {
  const result = z.object({
    role: z.enum(['customer', 'admin', 'staff']).optional(),
    isActive: z.boolean().optional(),
    name: z.string().trim().min(2).max(100).optional(),
  }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'User data is invalid.', result.error.issues)
  if (request.user.id === request.params.id && result.data.isActive === false) {
    throw new AppError(409, 'SELF_DISABLE_NOT_ALLOWED', 'You cannot disable your own account.')
  }
  const user = await User.findByIdAndUpdate(request.params.id, result.data, { new: true, runValidators: true })
  if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'User was not found.')
  return success(response, user)
}))

router.get('/settings', asyncHandler(async (_request, response) => success(response, await Setting.find().sort({ key: 1 }))))

router.put('/settings/:key', authorize('admin'), asyncHandler(async (request, response) => {
  if (!Object.prototype.hasOwnProperty.call(request.body, 'value')) {
    throw new AppError(422, 'VALIDATION_ERROR', 'Setting value is required.')
  }
  const setting = await Setting.findOneAndUpdate(
    { key: request.params.key },
    { value: request.body.value, description: request.body.description },
    { new: true, upsert: true, runValidators: true },
  )
  return success(response, setting)
}))

export default router
