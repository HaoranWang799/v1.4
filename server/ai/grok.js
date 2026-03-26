/**
 * server/ai/grok.js — Grok 通用调用封装
 *
 * 仅负责：
 * 1. 读取模型 / key / timeout 配置
 * 2. 调用 Grok 文本生成接口
 * 3. 将模型输出解析为 JSON
 */

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions'
const DEFAULT_GROK_MODEL = 'grok-4-fast-non-reasoning'
const DEFAULT_MODEL_CANDIDATES = [DEFAULT_GROK_MODEL]

export { generateStructuredJson }

function getGrokConfig(apiKeyOverride) {
  const apiKey = typeof apiKeyOverride === 'string' && apiKeyOverride.trim()
    ? apiKeyOverride.trim()
    : process.env.GROK_API_KEY
  const primaryModel = process.env.GROK_MODEL || DEFAULT_GROK_MODEL
  const requestTimeoutMs = Number(process.env.GROK_TIMEOUT_MS || 12000)

  if (!apiKey) throw new Error('GROK_API_KEY is not set')

  return {
    apiKey,
    primaryModel,
    requestTimeoutMs,
    modelCandidates: [primaryModel, ...DEFAULT_MODEL_CANDIDATES].filter(
      (model, index, models) => model && models.indexOf(model) === index
    ),
  }
}

function isMissingModelError(message) {
  return /model not found/i.test(message)
}

function extractJsonPayload(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(raw.slice(start, end + 1))
    }
    throw new Error('Invalid JSON response from Grok')
  }
}

async function callGrok({ systemPrompt, userPrompt, temperature, maxTokens, timeoutMs, apiKeyOverride }) {
  const { apiKey, requestTimeoutMs, modelCandidates } = getGrokConfig(apiKeyOverride)
  const effectiveTimeoutMs = Number(timeoutMs || requestTimeoutMs)

  const requestPayload = {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  }

  const callModel = async (model) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), effectiveTimeoutMs)
    try {
      const res = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ ...requestPayload, model }),
        signal: controller.signal,
      })
      return res
    } finally {
      clearTimeout(timeout)
    }
  }

  let lastError = null

  for (const model of modelCandidates) {
    const res = await callModel(model)
    if (res.ok) {
      const data = await res.json()
      return data.choices?.[0]?.message?.content?.trim() ?? ''
    }

    const body = await res.text()
    const error = new Error(`Grok API ${res.status}: ${body}`)
    lastError = error

    if (!isMissingModelError(body)) {
      throw error
    }
  }

  throw lastError || new Error('Grok request failed')
}

async function generateStructuredJson(options = {}) {
  const raw = await callGrok(options)
  return extractJsonPayload(raw)
}


