'use client'

import { useEffect, useState } from 'react'
import { API_URL, normalizeProduct } from './backend'

let productCache = null
let productPromise = null
function loadProducts() {
  if (productCache) return Promise.resolve(productCache)
  if (!productPromise) productPromise = fetch(`${API_URL}/products?limit=100`).then((response) => { if (!response.ok) throw new Error('Products request failed'); return response.json() }).then((payload) => { productCache = payload.data.map(normalizeProduct); return productCache }).finally(() => { productPromise = null })
  return productPromise
}

export default function useProducts() {
  const [products, setProducts] = useState(productCache || [])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    loadProducts()
      .then((payload) => {
        if (active) setProducts(payload)
      })
      .catch(() => { if (active) setError('Products are temporarily unavailable.') })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  return { products, loading, error }
}
