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

function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim()
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

// ── 消息池（批量预生成）────────────────────────────────────
// 服务启动时发1次 Grok 调用，批量返回10条，存入队列
// 用户点击时 pool.shift() 瞬间返回；剩余5条时后台补充10条

const POOL_SIZE = 10          // 每批生成数量
const REFILL_THRESHOLD = 5    // 剩余几条时触发补充
const POOL_TTL_MS = 30 * 60 * 1000  // 池内消息30分钟内有效

const messagePool = []   // { text, mood, provider, fallback, timestamp }
let isRefilling = false  // 防并发

// 批量生成专用 system prompt
const LOVER_BATCH_SYSTEM_PROMPT = `你是一个虚拟恋人，风格要求：
- 亲密、暧昧、自然，不像机器人
- 每条只说 1 到 2 句
- 情绪多样，不要重复句式或意象
- 可以根据时间调整语气（${new Date().getHours() < 12 ? '早上' : new Date().getHours() < 18 ? '下午' : new Date().getHours() < 22 ? '晚上' : '深夜'}）

一次性生成 ${POOL_SIZE} 条不重复的消息。
输出格式必须是严格 JSON 数组：
[{"text":"你的话","mood":"暧昧"},{"text":"另一句话","mood":"温柔"},...]

mood 只能是：暧昧、温柔、调皮。
只输出 JSON 数组，不要解释，不要任何其他内容。`

function isPoolMessageFresh(msg) {
  return Date.now() - new Date(msg.timestamp).getTime() < POOL_TTL_MS
}

function cleanStalePool() {
  while (messagePool.length > 0 && !isPoolMessageFresh(messagePool[0])) {
    messagePool.shift()
  }
}

/**
 * 批量调用 Grok，返回多条消息数组
 */
async function _callGrokBatch(apiKeyOverride = '') {
  const config = PROVIDER_CONFIG.lover
  const recentTexts = messagePool.slice(-4).map((m) => m.text)

  const avoidLine = recentTexts.length
    ? `\n严禁与这些已有内容重复：${recentTexts.join(' / ')}`
    : ''

  const promptPayload = {
    systemPrompt: LOVER_BATCH_SYSTEM_PROMPT,
    userPrompt: `${getTimeContext()}。请生成 ${POOL_SIZE} 条风格各异的恋人消息，情绪尽量多样。${avoidLine}\n生成标识：${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    temperature: 0.9,
    maxTokens: 500,
    timeoutMs: config.timeouts.primary * 2,  // 批量给更多时间
  }

  const raw = await callProviderWithFallback(
    config.primary,
    config.fallback,
    'generateLoverMessage',
    [promptPayload, apiKeyOverride],
    {
      primaryTimeout: config.timeouts.primary * 2,
      fallbackTimeout: config.timeouts.fallback,
    }
  )

  // 尝试解析为数组
  // grokProvider 返回 { text, mood }，批量时 text 字段里可能是原始数组字符串
  let items = []
  try {
    // 先尝试直接用 raw（如果 provider 直接返回了解析好的结果）
    if (Array.isArray(raw)) {
      items = raw
    } else if (typeof raw?.text === 'string') {
      // text 字段可能是 JSON 字符串
      const cleaned = raw.text.replace(/```json|```/g, '').trim()
      const startIdx = cleaned.indexOf('[')
      const endIdx = cleaned.lastIndexOf(']')
      if (startIdx !== -1 && endIdx !== -1) {
        items = JSON.parse(cleaned.slice(startIdx, endIdx + 1))
      }
    }
  } catch (e) {
    console.warn('⚠️ [LoverService] 批量解析失败，降级单条:', e.message)
    return []
  }

  if (!Array.isArray(items) || items.length < 3) {
    console.warn('⚠️ [LoverService] 批量结果不足3条，降级单条')
    return []
  }

  const now = new Date().toISOString()
  return items
    .filter((item) => item?.text && typeof item.text === 'string' && item.text.trim())
    .map((item) => ({
      text: String(item.text).trim().slice(0, 220),
      mood: ['暧昧', '温柔', '调皮'].includes(item.mood) ? item.mood : '温柔',
      provider: raw?.provider || 'grok',
      fallback: Boolean(raw?.fallback),
      timestamp: now,
    }))
}

/**
 * 后台批量补充消息池（不阻塞用户）
 */
export function refillPool(apiKeyOverride = '') {
  if (isRefilling) return
  if (messagePool.length >= POOL_SIZE) return
  isRefilling = true
  console.log(`🔮 [LoverService] 开始批量预生成（当前池: ${messagePool.length} 条）...`)

  _callGrokBatch(apiKeyOverride)
    .then((items) => {
      if (items.length > 0) {
        messagePool.push(...items)
        console.log(`✅ [LoverService] 批量预生成完成，池新增 ${items.length} 条，共 ${messagePool.length} 条`)
      } else {
        console.warn('⚠️ [LoverService] 批量结果为空，将依赖单条降级')
      }
    })
    .catch((err) => {
      console.warn('⚠️ [LoverService] 批量预生成失败:', err.message)
    })
    .finally(() => {
      isRefilling = false
    })
}

/**
 * 底层 Grok 单条调用（池耗尽时的降级路径）
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
 * 生成虚拟助手消息
 *
 * 参数：
 *   - userText: 用户输入
 *   - forceRefresh: 是否忽略缓存
 *   - context: 上下文信息
 *
 * 返回：{ text, mood, provider, fallback, timestamp }
 */
export async function generateMessage(userText, forceRefresh = false, context = {}, apiKeyOverride = '') {
  if (typeof userText !== 'string') {
    throw new ValidationError('userText 必须是字符串')
  }

  // 普通请求：先查 TTL 短缓存（2分钟内同一用户不重复调用）
  if (!forceRefresh) {
    const cached = getCachedLoverMessage(120000)
    if (cached) {
      console.log('💾 [LoverService] 读取缓存')
      return { ...cached, _cached: true }
    }
  }

  // 清理过期池消息
  cleanStalePool()

  // 优先从池里取（<1ms）
  if (messagePool.length > 0) {
    const msg = messagePool.shift()
    console.log(`⚡ [LoverService] 命中消息池，直接返回（剩余 ${messagePool.length} 条）`)
    setCachedLoverMessage(msg)

    // 剩余不足阈值时后台补充
    if (messagePool.length <= REFILL_THRESHOLD && !isRefilling) {
      setImmediate(() => refillPool(apiKeyOverride))
    }
    return msg
  }

  // 池耗尽，降级为实时单条调用
  console.warn('⚠️ [LoverService] 消息池已空，降级为实时调用')
  try {
    const memory = await getLoverMemoryContext()
    const result = await _callGrokCore(userText, context, memory, apiKeyOverride)
    setCachedLoverMessage(result)
    // 实时调用完成后立即触发补池
    setImmediate(() => refillPool(apiKeyOverride))
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
    // 清空消息池，删除记忆后旧内容作废
    messagePool.length = 0
    isRefilling = false
    await clearLoverMemory()
    console.log('✅ [LoverService] 记忆已清空')
    // 立即开始重新预热消息池
    setImmediate(() => refillPool())
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
