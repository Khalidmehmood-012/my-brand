import { Router } from 'express'
import { z } from 'zod'
import Category from '../models/Category.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { AppError, asyncHandler, slugify, success } from '../utils/api.js'

const router = Router()
const schema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().optional(),
  description: z.string().max(500).optional().default(''),
  image: z.string().optional().default(''),
  label: z.string().max(20).optional().default(''),
  sections: z.array(z.enum(['men', 'women', 'accessories'])).min(1).optional().default(['men', 'women']),
  subcategories: z.array(z.string().trim().min(1).max(80)).optional().default([]),
  subcategoryBadges: z.record(z.string(), z.string().max(20)).optional().default({}),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
})

router.get('/', asyncHandler(async (request, response) => {
  const filter = request.query.includeInactive === 'true' ? {} : { isActive: true }
  return success(response, await Category.find(filter).sort({ sortOrder: 1, name: 1 }))
}))

router.post('/', authenticate, authorize('admin', 'staff'), asyncHandler(async (request, response) => {
  const result = schema.safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Category data is invalid.', result.error.issues)
  const category = await Category.create({ ...result.data, slug: slugify(result.data.slug || result.data.name) })
  return success(response, category, 201)
}))

router.patch('/:id', authenticate, authorize('admin', 'staff'), asyncHandler(async (request, response) => {
  const result = schema.partial().safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Category data is invalid.', result.error.issues)
  if (result.data.slug) result.data.slug = slugify(result.data.slug)
  const category = await Category.findByIdAndUpdate(request.params.id, result.data, { new: true, runValidators: true })
  if (!category) throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category was not found.')
  return success(response, category)
}))

router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (request, response) => {
  if (request.query.permanent === 'true') {
    const category = await Category.findByIdAndDelete(request.params.id)
    if (!category) throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category was not found.')
    return success(response, { id: category.id, permanentlyDeleted: true })
  }
  const category = await Category.findByIdAndUpdate(request.params.id, { isActive: false }, { new: true })
  if (!category) throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Category was not found.')
  return success(response, { id: category.id, deleted: true })
}))

export default router
