import { Router } from 'express'
import { z } from 'zod'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { AppError, asyncHandler, pagination, slugify, success } from '../utils/api.js'

const router = Router()

const productSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().optional(),
  description: z.string().max(3000).optional().default(''),
  price: z.coerce.number().min(0),
  purchasePrice: z.coerce.number().min(0).optional().default(0),
  originalPrice: z.coerce.number().min(0).optional().default(0),
  isOnSale: z.boolean().optional().default(false),
  image: z.string().min(1),
  images: z.array(z.string()).optional().default([]),
  category: z.string().trim().min(1),
  subcategory: z.string().optional().default(''),
  gender: z.enum(['men', 'women', 'unisex']).optional().default('unisex'),
  badge: z.string().optional().default(''),
  sizes: z.array(z.string()).optional().default([]),
  stock: z.coerce.number().int().min(0).optional().default(100),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
})

function parseProduct(input, partial = false) {
  const schema = partial ? productSchema.partial() : productSchema
  const result = schema.safeParse(input)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Product data is invalid.', result.error.issues)
  return result.data
}

router.get('/', asyncHandler(async (request, response) => {
  const { page, limit, skip } = pagination(request.query)
  const filter = {}
  if (request.query.includeInactive !== 'true') filter.isActive = true
  if (request.query.category) filter.category = request.query.category.toLowerCase()
  if (request.query.gender) filter.gender = request.query.gender.toLowerCase()
  if (request.query.featured === 'true') filter.isFeatured = true
  if (request.query.sale === 'true') filter.$expr = { $gt: ['$originalPrice', '$price'] }
  if (request.query.search) {
    const expression = new RegExp(request.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ name: expression }, { category: expression }, { subcategory: expression }]
  }

  const [items, total] = await Promise.all([
    Product.find(filter).select(request.query.includeInactive === 'true' ? '+purchasePrice' : '-purchasePrice').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ])
  return success(response, items, 200, { page, limit, total, pages: Math.ceil(total / limit) })
}))

router.get('/:slug', asyncHandler(async (request, response) => {
  const product = await Product.findOne({ slug: request.params.slug, isActive: true })
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product was not found.')
  return success(response, product)
}))

router.post('/', authenticate, authorize('admin', 'staff'), asyncHandler(async (request, response) => {
  const input = parseProduct(request.body)
  if (!await Category.exists({ slug: input.category.toLowerCase(), isActive: true })) throw new AppError(422, 'CATEGORY_NOT_FOUND', 'Select an active category from the catalog.')
  const product = await Product.create({ ...input, slug: input.slug ? slugify(input.slug) : slugify(input.name) })
  return success(response, product, 201)
}))

router.patch('/:id', authenticate, authorize('admin', 'staff'), asyncHandler(async (request, response) => {
  const input = parseProduct(request.body, true)
  if (input.category && !await Category.exists({ slug: input.category.toLowerCase(), isActive: true })) throw new AppError(422, 'CATEGORY_NOT_FOUND', 'Select an active category from the catalog.')
  if (input.slug) input.slug = slugify(input.slug)
  const product = await Product.findByIdAndUpdate(request.params.id, input, { new: true, runValidators: true })
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product was not found.')
  return success(response, product)
}))

router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (request, response) => {
  if (request.query.permanent === 'true') {
    const product = await Product.findByIdAndDelete(request.params.id)
    if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product was not found.')
    return success(response, { id: product.id, permanentlyDeleted: true })
  }
  const product = await Product.findByIdAndUpdate(request.params.id, { isActive: false }, { new: true })
  if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product was not found.')
  return success(response, { id: product.id, deleted: true })
}))

export default router
