/**
 * src/api/client.js — 统一 HTTP 客户端
 *
 * 职责：
 *   • 自动添加 baseUrl、headers、API Key
 *   • 统一错误处理与日志
 *   • 支持超时、重试、fallback 机制
 *   • 作为所有请求的唯一入口
 */

import { buildApiUrl, getApiRuntimeInfo } from './baseUrl'
import { getStoredGrokApiKey } from './grokKey'

function isStaticOnlyHost() {
  if (typeof window === 'undefined') return false

  const { isUsingEnvBaseUrl } = getApiRuntimeInfo()
  if (isUsingEnvBaseUrl) return false

  const host = window.location.hostname.toLowerCase()
  return (
    host.endsWith('github.io') ||
    host.endsWith('netlify.app') ||
    host.endsWith('pages.dev') ||
    host.endsWith('vercel.app')
  )
}

// 配置常量
const CONFIG = {
  TIMEOUT: 15000,
  RETRY_COUNT: 2,
}

function createApiError(message, extras = {}) {
  const error = new Error(message)
  Object.assign(error, extras)
  return error
}

function logRequestStart(method, path, requestUrl) {
  const runtime = getApiRuntimeInfo()
  console.log(`🚀 [API] ${method} ${path}`, {
    requestUrl,
    usingEnvBaseUrl: runtime.isUsingEnvBaseUrl,
    configuredBaseUrl: runtime.configuredBaseUrl || '(relative /api)',
    mode: runtime.mode,
  })
}

function extractProviderInfo(responseData) {
  const data = responseData?.data || responseData || {}
  return {
    provider: data?.provider || data?._provider || data?.source || null,
    fallback: Boolean(data?.fallback ?? data?._fallback ?? false),
  }
}

/**
 * 核心请求方法
 * @param {string} path - API 路径（相对于 BASE_URL）
 * @param {object} options - 请求选项
 *   - method: 'GET' | 'POST' | 'DELETE' (默认 'POST')
 *   - body: 请求体
 *   - headers: 附加请求头
 *   - timeout: 超时时间（ms）
 *   - retryCount: 重试次数
 *   - fallback: 失败时的回调处理
 * @returns {Promise<object>} 响应数据
 */
export async function request(path, options = {}) {
  const {
    method = 'POST',
    body,
    query,
    headers = {},
    timeout = CONFIG.TIMEOUT,
    retryCount = 0,
    fallback,
  } = options

  const requestUrl = buildApiUrl(path, query)

  logRequestStart(method, path, requestUrl)

  if (isStaticOnlyHost() && path.startsWith('/api/')) {
    const error = createApiError(
      '当前静态站点未配置真实后端 API。请先部署 server，再在前端设置 VITE_API_BASE_URL=https://your-s-her-11-production.up.railway.app',
      {
        status: 0,
        code: 'API_BASE_URL_MISSING',
        requestUrl,
        usingEnvBaseUrl: false,
      }
    )

    if (fallback) {
      return fallback(error)
    }

    throw error
  }
  // 准备请求头
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // 自动注入 Grok API Key
  const grokKey = getStoredGrokApiKey()
  if (grokKey) {
    defaultHeaders['x-grok-api-key'] = grokKey
  }

  // 准备请求体
  const fetchOptions = {
    method,
    headers: defaultHeaders,
  }

  if (body && (method === 'POST' || method === 'PUT')) {
    fetchOptions.body = JSON.stringify(body)
  }

  try {
    // 创建带超时的 Promise
    const fetchPromise = fetch(requestUrl, fetchOptions)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timeout (${timeout}ms)`)),
        timeout
      )
    )

    const response = await Promise.race([fetchPromise, timeoutPromise])

    // 检查响应状态
    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      let errorData = {}

      if (contentType?.includes('application/json')) {
        errorData = await response.json()
      }

      const backendMessage =
        errorData?.error?.message ||
        errorData?.message ||
        `HTTP ${response.status}`

      const error = createApiError(backendMessage, {
        status: response.status,
        data: errorData,
        requestUrl,
        usingEnvBaseUrl: getApiRuntimeInfo().isUsingEnvBaseUrl,
      })
      throw error
    }

    // 解析响应
    const contentType = response.headers.get('content-type')
    let responseData = {}

    if (contentType?.includes('application/json')) {
      responseData = await response.json()
    }

    // 日志
    const providerInfo = extractProviderInfo(responseData)

    console.log(`✅ [API] ${method} ${path}`, {
      requestUrl,
      usingEnvBaseUrl: getApiRuntimeInfo().isUsingEnvBaseUrl,
      provider: providerInfo.provider,
      fallback: providerInfo.fallback,
      response: responseData,
    })

    return responseData
  } catch (error) {
    // 日志
    console.error(`❌ [API] ${method} ${path}`, {
      error: error.message,
      status: error.status,
      requestUrl,
      usingEnvBaseUrl: getApiRuntimeInfo().isUsingEnvBaseUrl,
      retryCount,
    })

    // 重试逻辑
    if (retryCount > 0 && (!error.status || error.status >= 500 || error.status === 408 || error.status === 429)) {
      console.log(`🔄 [API] 重试 ${CONFIG.RETRY_COUNT - retryCount + 1}/${CONFIG.RETRY_COUNT}`)
      await new Promise(r => setTimeout(r, 500)) // 延迟 500ms 后重试
      return request(path, {
        ...options,
        retryCount: retryCount - 1,
      })
    }

    // Fallback 处理
    if (fallback) {
      console.log(`⚠️ [API] 触发 fallback 处理 for ${path}`)
      return fallback(error)
    }

    // 抛出错误
    throw error
  }
}

/**
 * GET 请求快捷方法
 */
export async function get(path, options = {}) {
  return request(path, { ...options, method: 'GET' })
}

/**
 * POST 请求快捷方法
 */
export async function post(path, body, options = {}) {
  return request(path, { ...options, method: 'POST', body })
}

/**
 * DELETE 请求快捷方法
 */
export async function del(path, options = {}) {
  return request(path, { ...options, method: 'DELETE' })
}

/**
 * 生成重试选项
 */
export function withRetry(count = CONFIG.RETRY_COUNT) {
  return { retryCount: count }
}

/**
 * 生成 Mock Fallback 选项
 */
export function withMockFallback(mockFn) {
  return {
    fallback: (error) => {
      console.log(`📦 [Mock] fallback triggered`, { error: error.message })
      return mockFn()
    },
  }
}

export default {
  request,
  get,
  post,
  del,
  withRetry,
  withMockFallback,
}
