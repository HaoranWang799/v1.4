/**
 * server/providers/providerFactory.js — Provider 工厂
 *
 * 支持 provider 动态切换，实现 Grok/Mock 灵活选择
 */

import { grokProvider } from './grokProvider.js'
import { mockProvider } from './mockProvider.js'
import { ProviderError, TimeoutError } from '../config/errors.js'

const PROVIDERS = {
  grok: grokProvider,
  fallback: mockProvider,
  mock: mockProvider,
}

/**
 * 获取指定 provider
 */
export function getProvider(name) {
  const provider = PROVIDERS[name]
  if (!provider) {
    throw new ProviderError(`Unknown provider: ${name}`, name)
  }
  return provider
}

/**
 * 使用指定 provider 调用，支持超时和错误处理
 */
export async function callProvider(providerName, method, args, timeoutMs = 10000) {
  const provider = getProvider(providerName)

  if (!provider[method]) {
    throw new ProviderError(`Provider ${providerName} does not have method: ${method}`, providerName)
  }

  try {
    // 包装超时
    return await Promise.race([
      provider[method](...args),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new TimeoutError(`Provider ${providerName} timeout after ${timeoutMs}ms`)),
          timeoutMs
        )
      ),
    ])
  } catch (error) {
    if (error instanceof TimeoutError) {
      throw error
    }
    throw new ProviderError(error.message, providerName, error)
  }
}

/**
 * 使用主 provider，失败自动降级到 fallback provider
 */
export async function callProviderWithFallback(primaryName, fallbackName, method, args, options = {}) {
  const { primaryTimeout = 10000, fallbackTimeout = 5000 } = options

  try {
    console.log(`🔄 [Provider] 尝试 ${primaryName}...`)
    const result = await callProvider(primaryName, method, args, primaryTimeout)
    console.log(`✅ [Provider] ${primaryName} 成功`)
    return {
      ...result,
      provider: primaryName,
      fallback: false,
      fallbackError: '',
    }
  } catch (error) {
    console.warn(`⚠️ [Provider] ${primaryName} 失败: ${error.message}，降级到 ${fallbackName}`)

    try {
      const result = await callProvider(fallbackName, method, args, fallbackTimeout)
      console.log(`✅ [Provider] ${fallbackName} fallback 成功`)
      return {
        ...result,
        provider: fallbackName,
        fallback: true,
        fallbackError: error.message,
      }
    } catch (fallbackError) {
      console.error(`❌ [Provider] ${fallbackName} fallback 也失败: ${fallbackError.message}`)
      throw fallbackError
    }
  }
}

export default {
  getProvider,
  callProvider,
  callProviderWithFallback,
}
