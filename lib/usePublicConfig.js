'use client'

import { useEffect, useState } from 'react'
import { API_URL } from './backend'

let cachedConfig = null
let configPromise = null
function loadConfig() {
  if (cachedConfig) return Promise.resolve(cachedConfig)
  if (!configPromise) configPromise = fetch(`${API_URL}/public-settings`).then((response) => response.ok ? response.json() : null).then((payload) => { cachedConfig = payload?.data || { settings: {}, categories: [] }; return cachedConfig }).finally(() => { configPromise = null })
  return configPromise
}

export default function usePublicConfig() {
  // The first server and browser render must be identical. Module cache can already
  // contain API data after Fast Refresh, so it must never be used as initial JSX state.
  const [config, setConfig] = useState({ settings: {}, categories: [] })
  useEffect(() => {
    let active = true
    loadConfig().then((payload) => { if (active) setConfig(payload) }).catch(() => {})
    return () => { active = false }
  }, [])
  return config
}
