import test from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import app from '../src/app.js'

test('GET /api/health returns the standard success envelope', async () => {
  const response = await request(app).get('/api/health')
  assert.equal(response.status, 200)
  assert.equal(response.body.success, true)
  assert.equal(response.body.data.status, 'ok')
})

test('CORS preflight reflects the requesting origin', async () => {
  const response = await request(app).options('/api/products').set('Origin', 'https://store.example.com').set('Access-Control-Request-Method', 'GET')
  assert.equal(response.status, 204)
  assert.equal(response.headers['access-control-allow-origin'], 'https://store.example.com')
  assert.equal(response.headers['access-control-allow-credentials'], 'true')
})

test('unknown routes return the standard error envelope', async () => {
  const response = await request(app).get('/api/does-not-exist')
  assert.equal(response.status, 404)
  assert.equal(response.body.success, false)
  assert.equal(response.body.error.code, 'ROUTE_NOT_FOUND')
})

test('checkout validation returns field names for inline errors', async () => {
  const response = await request(app).post('/api/orders').send({ customer: { name: 'A', email: 'bad', phone: '12', address: '', province: 'Punjab', city: 'Lahore' }, items: [] })
  assert.equal(response.status, 422)
  assert.equal(response.body.error.code, 'VALIDATION_ERROR')
  assert.ok(response.body.error.details.some((detail) => detail.field === 'customer.phone'))
})
