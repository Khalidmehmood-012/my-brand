import 'dotenv/config'

const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET']

if (process.env.NODE_ENV === 'production') {
  for (const key of requiredInProduction) {
    if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`)
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5001),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/komrez',
  jwtSecret: process.env.JWT_SECRET || 'development-only-secret-change-before-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',
  adminName: process.env.ADMIN_NAME || 'Komrez Admin',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@komrez.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  firebaseApiKey: process.env.FIREBASE_API_KEY || '',
}
