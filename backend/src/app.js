import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import { env } from './config/env.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
import cartRoutes from './routes/cart.js'
import uploadRoutes from './routes/uploads.js'
import migrationRoutes from './routes/migration.js'
import notificationRoutes from './routes/notifications.js'
import publicSettingRoutes from './routes/public-settings.js'
import claimRoutes from './routes/claims.js'
import reviewRoutes from './routes/reviews.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { errorHandler, notFound } from './middleware/error.js'
import { success } from './utils/api.js'

const app = express()
const corsOptions = {
  // Temporary deployment setting: reflect every requesting origin so the
  // storefront and admin can work before their final production domains settle.
  origin: true,
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400,
}

app.disable('x-powered-by')
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors(corsOptions))
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use('/uploads', express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads')))
if (env.nodeEnv !== 'test') app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 500, standardHeaders: 'draft-8', legacyHeaders: false }))
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: 'draft-8', legacyHeaders: false }))

app.get('/', (_request, response) => success(response, {
  service: 'komrez-api',
  status: 'ok',
  health: '/api/health',
}))
app.get('/api', (_request, response) => success(response, {
  service: 'komrez-api',
  status: 'ok',
  health: '/api/health',
}))
app.get('/api/health', (_request, response) => success(response, {
  service: 'komrez-api',
  status: 'ok',
  timestamp: new Date().toISOString(),
}))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/admin/migration', migrationRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/public-settings', publicSettingRoutes)
app.use('/api/claims', claimRoutes)
app.use('/api/reviews', reviewRoutes)
app.use(notFound)
app.use(errorHandler)

export default app
