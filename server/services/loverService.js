/**
 * server/services/loverService.js — Virtual Lover 业务逻辑服务
 *
 * 负责：
 * 1. 构建虚拟恋人提示词
 * 2. 调用 provider 并在失败时降级
 * 3. 管理记忆与缓存
 */

import { callProviderWithFallback } from '../providers/providerFactory.js'
import { PROVIDER_CONFIG } from '../config/providers.js'
import { ValidationError, AppError } from '../config/errors.js'
import {
  getCachedLoverMessage,
  setCachedLoverMessage,
  clearLoverCache,
  getLatestLoverMessage,
} from '../lover/cache.js'
import { getLoverMemoryContext, rememberLoverMessage, clearLoverMemory } from '../lover/memory.js'

const LOVER_VARIATION_CUES = [
  '语气更主动一点，但保持自然。',
  '多一点陪伴感，少一点直白撩拨。',
  '表达更轻一点，像贴近耳边说话。',
  '更像深夜聊天，不要像固定文案。',
  '多一点回应感，像接住对方情绪。',
  '可以俏皮一点，但不要重复最近的句式。',
]

const LOVER_SYSTEM_PROMPT = `你是一个虚拟恋人，风格要求：
- 亲密、暧昧、自然，不像机器人
- 每次只说 1 到 2 句
- 保持情绪感与撩感，但不要油腻
- 可以根据时间调整语气
- 延续之前对话，不要像第一次见面
- 避免和最近说过的话重复

输出格式必须是严格 JSON：
{"text":"你的话","mood":"暧昧"}

mood 只能是：暧昧、温柔、调皮。
只输出 JSON，不要解释。`

function getTimeContext() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '现在是早上'
  if (hour >= 12 && hour < 18) return '现在是下午'
  if (hour >= 18 && hour < 22) return '现在是晚上'
  return '现在是深夜'
}

function pickLoverVariationCue() {
  return LOVER_VARIATION_CUES[Math.floor(Math.random() * LOVER_VARIATION_CUES.length)]
}

function areTextsEquivalent(left, right) {
  const normalizedLeft = normalizeText(left)
  const normalizedRight = normalizeText(right)
  return Boolean(normalizedLeft) && normalizedLeft === normalizedRight
}

function buildUserPrompt(userText, context, memory, options = {}) {
  const memoryLines = []

  if (memory?.relationshipStage) {
    memoryLines.push(`关系阶段：${memory.relationshipStage}。`)
  }
  if (typeof memory?.interactionCount === 'number') {
    memoryLines.push(`今晚已经互动 ${memory.interactionCount} 次。`)
  }
  if (memory?.lastMood) {
    memoryLines.push(`上一轮情绪偏向：${memory.lastMood}。`)
  }
  if (Array.isArray(memory?.recentMessages) && memory.recentMessages.length > 0) {
    const recentText = memory.recentMessages
      .slice(-4)
      .map((item, index) => `${index + 1}. ${item.text}`)
      .join(' ')
    memoryLines.push(`最近说过的话：${recentText}`)
  }

  const normalizedText = String(userText || '').trim()
  const explicitUserLine = normalizedText
    ? `对方刚刚说：${normalizedText}。请像真实恋人一样自然回应。`
    : '请你主动发起一句自然的恋人消息。'

  const avoidTexts = Array.isArray(options.avoidTexts)
    ? options.avoidTexts.map((item) => normalizeText(item)).filter(Boolean)
    : []

  const variationLines = [ 
    `本次变体要求：${options.variationCue || pickLoverVariationCue()}`,
    `本次生成标识：${options.generationToken || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}`,
  ]

  if (avoidTexts.length) {
    variationLines.push(`严禁复用这些最近说法：${avoidTexts.join(' / ')}`)
  }

  return `${getTimeContext()}。${context?.userName ? `对方叫 ${context.userName}。` : ''}${explicitUserLine}${memoryLines.length ? `\n补充上下文：${memoryLines.join(' ')}` : ''}\n额外生成约束：${variationLines.join('；')}`
}

function normalizeLoverResult(result, fallbackError = '') {
  return {
    text: String(result?.text || '').trim() || '今天有点想你…',
    mood: ['暧昧', '温柔', '调皮'].includes(result?.mood) ? result.mood : '温柔',
    provider: result?.provider || 'fallback',
    fallback: Boolean(result?.fallback),
    timestamp: result?.timestamp || new Date().toISOString(),
    error: fallbackError || result?.fallbackError || '',
  }
}

// ── 预生成槽 ──────────────────────────────────────────────
// 每次 Grok 调用完成后，后台悄悄生成下一条，用户点击时直接命中 (<10ms)
const pregenSlot = {
  pending: null,        // 预生成好的消息对象
  isGenerating: false,  // 是否正在后台生成
}

const PREGEN_TTL_MS = 8 * 60 * 1000 // 8分钟内有效

function consumePregen() {
  if (!pregenSlot.pending) return null
  const age = Date.now() - new Date(pregenSlot.pending.timestamp).getTime()
  if (age > PREGEN_TTL_MS) {
    pregenSlot.pending = null
    return null
  }
  const msg = pregenSlot.pending
  pregenSlot.pending = null
  return msg
}

/**
 * 底层 Grok 调用（不含缓存逻辑，预生成和正常路径共用）
 */
async function _callGrokCore(userText, context, memory, apiKeyOverride) {
  const config = PROVIDER_CONFIG.lover
  const avoidTexts = [
    getLatestLoverMessage()?.text,
    ...(Array.isArray(memory?.recentMessages) ? memory.recentMessages.slice(-3).map((item) => item.text) : []),
  ].filter(Boolean)

  const buildPromptPayload = (options = {}) => ({
    systemPrompt: LOVER_SYSTEM_PROMPT,
    userPrompt: buildUserPrompt(userText, context, memory, options),
    temperature: 0.85,
    maxTokens: 90,
    timeoutMs: config.timeouts.primary,
  })

  let result = normalizeLoverResult(await callProviderWithFallback(
    config.primary,
    config.fallback,
    'generateLoverMessage',
    [buildPromptPayload({ avoidTexts }), apiKeyOverride],
    {
      primaryTimeout: config.timeouts.primary,
      fallbackTimeout: config.timeouts.fallback,
    }
  ))

  // 重复检测：和最近说过的完全一样则重试一次
  if (avoidTexts.some((text) => areTextsEquivalent(text, result.text))) {
    result = normalizeLoverResult(await callProviderWithFallback(
      config.primary,
      config.fallback,
      'generateLoverMessage',
      [buildPromptPayload({
        avoidTexts: [...avoidTexts, result.text],
        variationCue: '必须换一个新的表达角度，句式和意象都不要与最近几条相同。',
        generationToken: `${Date.now()}-retry-${Math.random().toString(36).slice(2, 8)}`,
      }), apiKeyOverride],
      {
        primaryTimeout: config.timeouts.primary,
        fallbackTimeout: config.timeouts.fallback,
      }
    ))
  }

  try {
    await rememberLoverMessage(result, { userName: context?.userName || memory?.lastUserName })
  } catch (memoryError) {
    console.warn('⚠️ [LoverService] 记忆写入失败，已跳过持久化:', memoryError.message)
  }

  return result
}

/**
 * 后台静默预生成下一条消息，完成后存入 pregenSlot
 */
function startPregenBackground(context = {}, apiKeyOverride = '') {
  if (pregenSlot.isGenerating || pregenSlot.pending) return
  pregenSlot.isGenerating = true
  console.log('🔮 [LoverService] 开始后台预生成...')
  getLoverMemoryContext()
    .then((memory) => _callGrokCore('', context, memory, apiKeyOverride))
    .then((result) => {
      pregenSlot.pending = result
      console.log('✅ [LoverService] 预生成完成，消息已就绪')
    })
    .catch((err) => {
      console.warn('⚠️ [LoverService] 预生成失败:', err.message)
    })
    .finally(() => {
      pregenSlot.isGenerating = false
    })
}

/**
 * 生成虚拟助手消息
 *
 * 参数：
 *   - userText: 用户输入
 *   - forceRefresh: 是否忽略缓存
 *   - context: 上下文信息 { mood, scene, character }
 *
 * 返回：
 *   { text, mood, provider, fallback, timestamp }
 */
export async function generateMessage(userText, forceRefresh = false, context = {}, apiKeyOverride = '') {
  if (typeof userText !== 'string') {
    throw new ValidationError('userText 必须是字符串')
  }

  // 普通请求：先查 TTL 短缓存
  if (!forceRefresh) {
    const cached = getCachedLoverMessage(120000) // 2分钟 TTL
    if (cached) {
      console.log('💾 [LoverService] 读取缓存')
      return { ...cached, _cached: true }
    }
  }

  // 强制刷新：优先命中预生成槽（<10ms 返回）
  if (forceRefresh) {
    const pregen = consumePregen()
    if (pregen) {
      console.log('⚡ [LoverService] 命中预生成槽，直接返回')
      setCachedLoverMessage(pregen)
      // 命中后立刻预热下一条
      setImmediate(() => startPregenBackground(context, apiKeyOverride))
      return pregen
    }
  }

  // 预生成槽未命中，走正常 Grok 调用
  try {
    const memory = await getLoverMemoryContext()
    const result = await _callGrokCore(userText, context, memory, apiKeyOverride)
    setCachedLoverMessage(result)
    // 完成后后台预热下一条
    setImmediate(() => startPregenBackground(context, apiKeyOverride))
    return result
  } catch (error) {
    console.error('❌ [LoverService] 消息生成失败:', error.message)
    throw error
  }
}

/**
 * 清空所有缓存的对话记忆
 * 下次生成消息时会重新与虚拟助手开始新对话
 */
export async function clearMemory() {
  try {
    clearLoverCache()
    pregenSlot.pending = null
    pregenSlot.isGenerating = false
    await clearLoverMemory()
    console.log('✅ [LoverService] 记忆已清空')
    return {
      ok: true,
      message: '记忆已清空，下次重新开始',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('❌ [LoverService] 清空记忆失败:', error.message)
    throw new AppError(error.message)
  }
}

/**
 * 获取当前记忆统计
 */
export function getMemoryStats() {
  const latestMessage = getLatestLoverMessage()
  return {
    hasCache: !!latestMessage,
    lastMessage: latestMessage?.text || null,
    timestamp: new Date().toISOString(),
  }
}

export default {
  generateMessage,
  clearMemory,
  getMemoryStats,
}
