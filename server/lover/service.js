import { generateLoverMessage } from '../ai/grok.js'
import {
  getCachedLoverMessage,
  getLatestLoverMessage,
  isLoverRefreshRunning,
  setCachedLoverMessage,
  setLoverRefreshRunning,
} from './cache.js'
import { getRandomFallbackMessage } from './constants.js'
import { getLoverMemoryContext, rememberLoverMessage } from './memory.js'

const MODEL_NAME = process.env.GROK_MODEL || 'grok-4-fast-non-reasoning'

function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('AI_TIMEOUT')), ms)
    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((error) => {
        clearTimeout(timer)
        reject(error)
      })
  })
}

async function refreshLoverMessageInBackground(context, options = {}) {
  if (isLoverRefreshRunning()) return

  setLoverRefreshRunning(true)
  try {
    const result = await generateLoverMessage({
      ...context,
      memory: await getLoverMemoryContext(),
    }, {
      apiKeyOverride: options.apiKeyOverride,
    })
    setCachedLoverMessage(result)
  } catch (error) {
    console.error('[Grok Refresh Error]', error.message)
  } finally {
    setLoverRefreshRunning(false)
  }
}

async function createLoverMessageResponse({ context, forceRefresh, cacheTtlMs, maxWaitMs, forceWaitMs, apiKeyOverride }) {
  const cachedMessage = getCachedLoverMessage(cacheTtlMs)
  const latestMessage = getLatestLoverMessage()
  if (cachedMessage && !forceRefresh) {
    await rememberLoverMessage(cachedMessage, { userName: context.userName })
    return { ...cachedMessage, source: 'cache', model: MODEL_NAME, aiError: '' }
  }

  try {
    const waitMs = forceRefresh ? forceWaitMs : maxWaitMs
    let liveMessage = await withTimeout(generateLoverMessage({
      ...context,
      memory: await getLoverMemoryContext(),
    }, {
      apiKeyOverride,
    }), waitMs)

    if (
      forceRefresh &&
      latestMessage?.text &&
      normalizeText(liveMessage?.text) &&
      normalizeText(liveMessage.text) === normalizeText(latestMessage.text)
    ) {
      liveMessage = await withTimeout(generateLoverMessage({
        ...context,
        memory: await getLoverMemoryContext(),
      }, {
        apiKeyOverride,
        disallowText: latestMessage.text,
      }), waitMs)
    }

    setCachedLoverMessage(liveMessage)
    await rememberLoverMessage(liveMessage, { userName: context.userName })
    return { ...liveMessage, source: forceRefresh ? 'live-forced' : 'live', model: MODEL_NAME, aiError: '' }
  } catch (error) {
    if (forceRefresh) {
      refreshLoverMessageInBackground(context, { apiKeyOverride })
      return {
        text: '',
        mood: '温柔',
        source: 'error',
        model: MODEL_NAME,
        aiError: error.message,
      }
    }

    if (latestMessage) {
      refreshLoverMessageInBackground(context, { apiKeyOverride })
      await rememberLoverMessage(latestMessage, { userName: context.userName })
      return {
        ...latestMessage,
        source: forceRefresh ? 'stale-cache-forced' : 'stale-cache',
        model: MODEL_NAME,
        aiError: error.message,
      }
    }

    refreshLoverMessageInBackground(context, { apiKeyOverride })
    const fallbackMessage = getRandomFallbackMessage()
    await rememberLoverMessage(fallbackMessage, { userName: context.userName })
    return { ...fallbackMessage, source: 'fallback', model: MODEL_NAME, aiError: error.message }
  }
}

export { createLoverMessageResponse }