function normalizeBaseUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  return raw.replace(/\/+$/, '')
}

function normalizePath(path) {
  const raw = String(path || '').trim()
  if (!raw) return '/'
  return raw.startsWith('/') ? raw : `/${raw}`
}

export function getApiRuntimeInfo() {
  const configuredBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

  return {
    configuredBaseUrl,
    isUsingEnvBaseUrl: Boolean(configuredBaseUrl),
    mode: import.meta.env.MODE,
    isProduction: Boolean(import.meta.env.PROD),
    isDevelopment: Boolean(import.meta.env.DEV),
  }
}

export function buildApiUrl(path, query) {
  const suffix = normalizePath(path)
  const { configuredBaseUrl } = getApiRuntimeInfo()

  if (!configuredBaseUrl) {
    if (!query || typeof query !== 'object' || Object.keys(query).length === 0) {
      return suffix
    }

    const relativeUrl = new URL(suffix, 'http://relative.local')
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      relativeUrl.searchParams.set(key, String(value))
    })
    return `${relativeUrl.pathname}${relativeUrl.search}`
  }

  const url = new URL(suffix, `${configuredBaseUrl}/`)

  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      url.searchParams.set(key, String(value))
    })
  }

  return url.toString()
}

export { normalizeBaseUrl }
