import app from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { env } from './config/env.js'
import { createServer } from 'node:http'
import { attachNotificationSocket } from './realtime/notificationSocket.js'

let server
let databaseRetryTimer

async function connectWithRetry() {
  try {
    await connectDatabase()
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed. Retrying in 10 seconds:', error.message)
    databaseRetryTimer = setTimeout(connectWithRetry, 10000)
  }
}

function start() {
  // Start HTTP immediately. On cPanel/Passenger, waiting for MongoDB before
  // listen() makes the entire application appear as a generic 503 page when
  // Atlas networking or credentials need attention.
  server = createServer(app)
  attachNotificationSocket(server)
  server.listen(env.port, () => {
    console.log(`Komrez API running at http://localhost:${env.port}`)
  })
  void connectWithRetry()
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`)
  if (databaseRetryTimer) clearTimeout(databaseRetryTimer)
  if (server) await new Promise((resolve) => server.close(resolve))
  await disconnectDatabase()
  process.exit(0)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

start()
