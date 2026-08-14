import app from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { env } from './config/env.js'

let server

async function start() {
  await connectDatabase()
  server = app.listen(env.port, () => {
    console.log(`Komrez API running at http://localhost:${env.port}`)
  })
}

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`)
  if (server) await new Promise((resolve) => server.close(resolve))
  await disconnectDatabase()
  process.exit(0)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

start().catch((error) => {
  console.error('Backend startup failed:', error)
  process.exit(1)
})
