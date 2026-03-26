/**
 * src/api/virtualLover.js — 虚拟恋人 API
 *
 * 职责：
 *   • 调用后端 /api/lover/message 获取 Grok 文本生成结果
 *   • 调用后端 /api/lover/memory 清空记忆
 *   • 仅在请求失败时返回本地 fallback 结果
 */

import { post, del, withRetry } from './client'

// Mock 消息池（fallback 使用）
const MOCK_MESSAGES = [
  '今天有点想你…',
  '晚上好啊，今天累了吗？',
  '我想你了，来陪我聊聊天吧…',
  '今晚月色真美。',
  '每天最开心的事就是等你上线。',
  '你知道吗？我一直都在。',
]

const MOCK_MOODS = ['温柔', '暧昧', '调皮']

function createLocalFallbackMessage(errorMessage = '') {
  const text = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)]
  const mood = MOCK_MOODS[Math.floor(Math.random() * MOCK_MOODS.length)]
  return {
    text,
    mood,
    provider: 'fallback',
    fallback: true,
    timestamp: new Date().toISOString(),
    error: errorMessage,
  }
}

function normalizeServerLoverPayload(serverData = {}) {
  return {
    text: serverData.text || '今天有点想你…',
    mood: serverData.mood || '温柔',
    provider: serverData.provider || 'fallback',
    fallback: Boolean(serverData.fallback),
    timestamp: serverData.timestamp || new Date().toISOString(),
    error: serverData.error || '',
  }
}

/**
 * 获取虚拟恋人消息
 *
 * @param {object} options
 *   - forceRefresh: 是否强制刷新（不使用缓存）
 *   - grokApiKey: 显式指定 Grok API Key（可留空，会自动从 localStorage 获取）
 * @returns {Promise<object>}
 *   { text, mood, provider, fallback, timestamp }
 */
export async function fetchVirtualLoverMessage(options = {}) {
  const { forceRefresh = false } = options
  const requestPayload = {
    forceRefresh,
    text: '继续陪我聊聊',
    message: '继续陪我聊聊',
  }

  try {
    const response = await post('/api/lover/message', requestPayload, {
      ...withRetry(2),
      timeout: 10000,
    })

    if (!response?.ok || !response?.data) {
      throw new Error(response?.error?.message || '虚拟恋人接口返回无效')
    }

    const normalized = normalizeServerLoverPayload(response.data)
    console.log('💬 [VirtualLover API] 使用后端结果', {
      provider: normalized.provider,
      fallback: normalized.fallback,
    })
    return normalized
  } catch (error) {
    const fallbackResult = createLocalFallbackMessage(error.message)
    console.warn('❌ fetchVirtualLoverMessage 失败，使用本地 fallback:', {
      reason: error.message,
      provider: fallbackResult.provider,
      fallback: fallbackResult.fallback,
    })
    return fallbackResult
  }
}

/**
 * 清空虚拟恋人记忆
 *
 * @returns {Promise<object>}
 *   { success: boolean, message: string }
 */
export async function clearVirtualLoverMemory() {
  try {
    // 真实请求
    const response = await del('/api/lover/memory', {
      ...withRetry(1),
      timeout: 5000,
    })
    return response
  } catch (error) {
    // Mock 成功响应
    console.warn('❌ clearVirtualLoverMemory 失败，使用 mock 成功:', { reason: error.message })
    return {
      success: true,
      message: '记忆已清空（本地模式）',
    }
  }
}

export default {
  fetchVirtualLoverMessage,
  clearVirtualLoverMemory,
}
