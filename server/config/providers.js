/**
 * server/config/providers.js — AI Provider 策略配置
 */

export const PROVIDER_CONFIG = {
  lover: {
    primary: process.env.LOVER_PROVIDER || 'grok',
    fallback: 'fallback',
    timeouts: {
      primary: Number(process.env.LOVER_GROK_TIMEOUT || 6000),
      fallback: Number(process.env.LOVER_FALLBACK_TIMEOUT || 1500),
    },
  },

  health: {
    primary: process.env.HEALTH_PROVIDER || 'grok',
    fallback: 'fallback',
    timeouts: {
      primary: Number(process.env.HEALTH_GROK_TIMEOUT || 15000),
      fallback: Number(process.env.HEALTH_FALLBACK_TIMEOUT || 2000),
    },
  },

  grok: {
    apiEndpoint: process.env.GROK_API_ENDPOINT || 'https://api.x.ai/v1',
    model: process.env.GROK_MODEL || 'grok-4-fast-non-reasoning',
    apiKeyEnv: process.env.GROK_API_KEY || '',
  },
}

/**
 * 获取指定服务的最优 Provider
 */
export function getOptimalProvider(serviceName) {
  const config = PROVIDER_CONFIG[serviceName]
  if (!config) {
    throw new Error(`Unknown service: ${serviceName}`)
  }
  return config.primary
}

/**
 * 获取指定 provider 的超时时间
 */
export function getProviderTimeout(serviceName, providerName) {
  const config = PROVIDER_CONFIG[serviceName]
  if (!config) {
    throw new Error(`Unknown service: ${serviceName}`)
  }
  if (providerName === config.primary) return config.timeouts.primary
  if (providerName === config.fallback) return config.timeouts.fallback
  return 10000
}

export default {
  PROVIDER_CONFIG,
  getOptimalProvider,
  getProviderTimeout,
}
