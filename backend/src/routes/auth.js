import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { z } from 'zod'
import User from '../models/User.js'
import { env } from '../config/env.js'
import { authenticate } from '../middleware/auth.js'
import { AppError, asyncHandler, success } from '../utils/api.js'

const router = Router()

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
  context: z.enum(['storefront', 'admin']).optional().default('storefront'),
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

function deviceDetails(request) {
  const ua = request.get('user-agent') || ''
  const browser = /Edg\//.test(ua) ? 'Microsoft Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Unknown browser'
  const device = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android device' : /Macintosh/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows PC' : /Linux/.test(ua) ? 'Linux device' : 'Unknown device'
  return { browser, device, ipAddress: String(request.headers['x-forwarded-for'] || request.ip || '').split(',')[0].trim() }
}

export async function createSession(user, request, context = 'storefront') {
  if (context === 'admin' && !['admin', 'staff'].includes(user.role)) throw new AppError(403, 'ADMIN_ACCESS_REQUIRED', 'Admin access is required.')
  const sessionId = crypto.randomUUID()
  const token = jwt.sign({ sub: user.id, role: user.role, sid: sessionId, context }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
  const { exp } = jwt.decode(token)
  user.sessions.push({ sessionId, context, ...deviceDetails(request), expiresAt: new Date(exp * 1000) })
  if (user.sessions.length > 50) user.sessions = user.sessions.slice(-50)
  user.lastLoginAt = new Date()
  await user.save()
  return token
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

  return success(response, { user, token: await createSession(user, request, input.context) }, 201)
}))

router.post('/login', asyncHandler(async (request, response) => {
  const input = validate(loginSchema, request.body)
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordHash')
  if (!user?.passwordHash || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.')
  }
  if (!user.isActive) throw new AppError(403, 'ACCOUNT_DISABLED', 'This account has been disabled.')

  user.passwordHash = undefined
  return success(response, { user, token: await createSession(user, request, input.context) })
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
  return success(response, { user, token: await createSession(user, request, 'storefront') })
}))

router.get('/me', authenticate, asyncHandler(async (request, response) => success(response, request.user)))

router.get('/sessions', authenticate, asyncHandler(async (request, response) => {
  const now = new Date()
  const sessions = [...(request.user.sessions || [])].sort((a, b) => b.createdAt - a.createdAt).map((session) => ({
    _id: session._id,
    context: session.context,
    device: session.device,
    browser: session.browser,
    ipAddress: session.ipAddress,
    createdAt: session.createdAt,
    lastSeenAt: session.lastSeenAt,
    expiresAt: session.expiresAt,
    loggedOutAt: session.loggedOutAt,
    isCurrent: session.sessionId === request.authTokenPayload?.sid,
    isActive: !session.loggedOutAt && (!session.expiresAt || session.expiresAt > now),
  }))
  return success(response, sessions)
}))

router.delete('/sessions/:id', authenticate, asyncHandler(async (request, response) => {
  const session = request.user.sessions.id(request.params.id)
  if (!session) throw new AppError(404, 'SESSION_NOT_FOUND', 'Login session was not found.')
  if (!session.loggedOutAt) session.loggedOutAt = new Date()
  await request.user.save()
  return success(response, { loggedOut: true, isCurrent: session.sessionId === request.authTokenPayload?.sid })
}))

router.post('/logout', authenticate, asyncHandler(async (request, response) => {
  if (request.authSession && !request.authSession.loggedOutAt) {
    request.authSession.loggedOutAt = new Date()
    await request.user.save()
  }
  return success(response, { loggedOut: true })
}))

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
