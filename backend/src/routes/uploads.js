import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { authenticate, authorize } from '../middleware/auth.js'
import { AppError, asyncHandler, success } from '../utils/api.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads/products')
fs.mkdirSync(root, { recursive: true })
const storage = multer.diskStorage({
  destination: root,
  filename: (_request, file, done) => done(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
})
const upload = multer({
  storage,
  limits: { files: 8, fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, done) => done(null, ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.mimetype)),
})
const router = Router()

router.post('/products', authenticate, authorize('admin', 'staff'), upload.array('images', 8), asyncHandler(async (request, response) => {
  if (!request.files?.length) throw new AppError(422, 'IMAGE_REQUIRED', 'Select at least one supported image.')
  const baseUrl = `${request.protocol}://${request.get('host')}`
  return success(response, request.files.map((file) => ({
    url: `${baseUrl}/uploads/products/${file.filename}`, name: file.originalname, size: file.size,
  })), 201)
}))

router.post('/payment-proof', upload.single('image'), asyncHandler(async (request, response) => {
  if (!request.file) throw new AppError(422, 'IMAGE_REQUIRED', 'Select a supported payment screenshot.')
  const baseUrl = `${request.protocol}://${request.get('host')}`
  return success(response, { url: `${baseUrl}/uploads/products/${request.file.filename}` }, 201)
}))

router.post('/profile-image', authenticate, upload.single('image'), asyncHandler(async (request, response) => {
  if (!request.file) throw new AppError(422, 'IMAGE_REQUIRED', 'Select a supported profile image.')
  const baseUrl = `${request.protocol}://${request.get('host')}`
  return success(response, { url: `${baseUrl}/uploads/products/${request.file.filename}` }, 201)
}))

export default router
