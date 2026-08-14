import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import User from '../models/User.js'
import { env } from '../config/env.js'
import { authenticate } from '../middleware/auth.js'
import { AppError, asyncHandler, success } from '../utils/api.js'

const router = Router()

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
})

const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2).max(100),
})

const firebaseSchema = z.object({ idToken: z.string().min(100) })

function validate(schema, input) {
  const result = schema.safeParse(input)
  if (!result.success) {
    throw new AppError(422, 'VALIDATION_ERROR', 'Submitted data is invalid.', result.error.issues.map((issue) => ({
      field: issue.path.join('.'), message: issue.message,
    })))
  }
  return result.data
}

function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
}

router.post('/register', asyncHandler(async (request, response) => {
  const input = validate(registerSchema, request.body)
  const exists = await User.exists({ email: input.email.toLowerCase() })
  if (exists) throw new AppError(409, 'EMAIL_EXISTS', 'An account with this email already exists.')

  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash: await bcrypt.hash(input.password, 12),
    role: 'customer',
  })

  return success(response, { user, token: createToken(user) }, 201)
}))

router.post('/login', asyncHandler(async (request, response) => {
  const input = validate(loginSchema, request.body)
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordHash')
  if (!user?.passwordHash || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.')
  }
  if (!user.isActive) throw new AppError(403, 'ACCOUNT_DISABLED', 'This account has been disabled.')

  user.lastLoginAt = new Date()
  await user.save()
  user.passwordHash = undefined
  return success(response, { user, token: createToken(user) })
}))

router.post('/firebase', asyncHandler(async (request, response) => {
  const { idToken } = validate(firebaseSchema, request.body)
  if (!env.firebaseApiKey) throw new AppError(503, 'FIREBASE_NOT_CONFIGURED', 'Firebase login is not configured on the backend.')
  const verification = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.firebaseApiKey)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }),
  })
  const payload = await verification.json().catch(() => ({}))
  const identity = payload.users?.[0]
  if (!verification.ok || !identity?.localId || !identity?.email) throw new AppError(401, 'INVALID_FIREBASE_TOKEN', 'Google authentication could not be verified.')
  let user = await User.findOne({ $or: [{ firebaseUid: identity.localId }, { email: identity.email.toLowerCase() }] })
  if (user && !user.isActive) throw new AppError(403, 'ACCOUNT_DISABLED', 'This account has been disabled.')
  const provider = identity.providerUserInfo?.[0] || {}
  if (!user) user = new User({ email: identity.email, name: identity.displayName || provider.displayName || identity.email.split('@')[0], role: 'customer' })
  user.firebaseUid = identity.localId
  user.photo = identity.photoUrl || provider.photoUrl || user.photo
  user.lastLoginAt = new Date()
  await user.save()
  return success(response, { user, token: createToken(user) })
}))

router.get('/me', authenticate, asyncHandler(async (request, response) => success(response, request.user)))

router.patch('/profile', authenticate, asyncHandler(async (request, response) => {
  const input = validate(z.object({ name: z.string().trim().min(2).max(100), phone: z.string().trim().max(30).optional().default(''), photo: z.string().url().or(z.literal('')).optional() }), request.body)
  request.user.name = input.name
  request.user.phone = input.phone
  if (input.photo !== undefined) request.user.photo = input.photo
  await request.user.save()
  return success(response, request.user)
}))

router.patch('/password', authenticate, asyncHandler(async (request, response) => {
  const input = validate(z.object({ currentPassword: z.string().max(128).optional().default(''), newPassword: z.string().min(8).max(128) }), request.body)
  const user = await User.findById(request.user.id).select('+passwordHash')
  if (user.passwordHash && (!input.currentPassword || !(await bcrypt.compare(input.currentPassword, user.passwordHash)))) {
    throw new AppError(401, 'CURRENT_PASSWORD_INCORRECT', 'Your current password is incorrect.')
  }
  if (user.passwordHash && await bcrypt.compare(input.newPassword, user.passwordHash)) throw new AppError(422, 'PASSWORD_UNCHANGED', 'Choose a new password that is different from your current password.')
  user.passwordHash = await bcrypt.hash(input.newPassword, 12)
  await user.save()
  return success(response, { updated: true })
}))

router.post('/addresses', authenticate, asyncHandler(async (request, response) => {
  const result = z.object({ label: z.string().max(50).optional().default('Home'), name: z.string().min(2), phone: z.string().min(7), address: z.string().min(5), province: z.string().min(2), city: z.string().min(2), isDefault: z.boolean().optional().default(false) }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Address data is invalid.', result.error.issues)
  if (result.data.isDefault) request.user.addresses.forEach((address) => { address.isDefault = false })
  request.user.addresses.push({ ...result.data, isDefault: result.data.isDefault || request.user.addresses.length === 0 })
  await request.user.save()
  return success(response, request.user.addresses, 201)
}))

router.patch('/addresses/:id', authenticate, asyncHandler(async (request, response) => {
  const result = z.object({ label: z.string().max(50).optional(), name: z.string().min(2).optional(), phone: z.string().min(7).optional(), address: z.string().min(5).optional(), province: z.string().min(2).optional(), city: z.string().min(2).optional(), isDefault: z.boolean().optional() }).safeParse(request.body)
  if (!result.success) throw new AppError(422, 'VALIDATION_ERROR', 'Address data is invalid.', result.error.issues)
  const address = request.user.addresses.id(request.params.id)
  if (!address) throw new AppError(404, 'ADDRESS_NOT_FOUND', 'Saved address was not found.')
  if (result.data.isDefault) request.user.addresses.forEach((item) => { item.isDefault = false })
  Object.assign(address, result.data)
  await request.user.save()
  return success(response, request.user)
}))

router.delete('/addresses/:id', authenticate, asyncHandler(async (request, response) => {
  const address = request.user.addresses.id(request.params.id)
  if (!address) throw new AppError(404, 'ADDRESS_NOT_FOUND', 'Saved address was not found.')
  const wasDefault = address.isDefault
  address.deleteOne()
  if (wasDefault && request.user.addresses[0]) request.user.addresses[0].isDefault = true
  await request.user.save()
  return success(response, request.user)
}))

export default router
