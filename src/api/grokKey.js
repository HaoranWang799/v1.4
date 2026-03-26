const GROK_API_KEY_STORAGE = 'grok_api_key'

export function getStoredGrokApiKey() {
  if (typeof window === 'undefined') return ''
  return (window.localStorage.getItem(GROK_API_KEY_STORAGE) || '').trim()
}

export function setStoredGrokApiKey(value) {
  if (typeof window === 'undefined') return
  const next = String(value || '').trim()
  if (!next) {
    window.localStorage.removeItem(GROK_API_KEY_STORAGE)
    return
  }
  window.localStorage.setItem(GROK_API_KEY_STORAGE, next)
}

export function clearStoredGrokApiKey() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(GROK_API_KEY_STORAGE)
}

export function getGrokApiKeyHeader() {
  const key = getStoredGrokApiKey()
  return key ? { 'x-grok-api-key': key } : {}
}