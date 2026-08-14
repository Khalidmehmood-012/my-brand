import test from 'node:test'
import assert from 'node:assert/strict'
import { shippingFor } from '../../data/pakistan-locations.js'

test('shipping is charged below threshold using province rate', () => {
  assert.equal(shippingFor('Punjab', 500, { freeShippingThreshold: 2000 }), 220)
  assert.equal(shippingFor('Balochistan', 500, { freeShippingThreshold: 2000 }), 350)
})

test('shipping is free only at or above configured threshold', () => {
  assert.equal(shippingFor('Punjab', 1999, { freeShippingThreshold: 2000 }), 220)
  assert.equal(shippingFor('Punjab', 2000, { freeShippingThreshold: 2000 }), 0)
})
