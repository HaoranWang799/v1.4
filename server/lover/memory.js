import { mkdir, readFile, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const MAX_MEMORY_ITEMS = 6
const __dirname = dirname(fileURLToPath(import.meta.url))

function resolveStorePath() {
  const customPath = String(process.env.VIRTUAL_LOVER_STORE_PATH || '').trim()
  if (customPath) return customPath

  if (process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT) {
    return join(tmpdir(), 'virtual-lover-store.json')
  }

  return join(__dirname, '../data/virtual-lover-store.json')
}

const STORE_PATH = resolveStorePath()

const DEFAULT_MEMORY = {
  interactionCount: 0,
  lastMood: '温柔',
  recentMessages: [],
  lastUserName: undefined,
}

let loverMemory = { ...DEFAULT_MEMORY }
let isLoaded = false
let persistenceAvailable = true

async function safePersistMemory() {
  if (!persistenceAvailable) return false

  try {
    await mkdir(dirname(STORE_PATH), { recursive: true })
    await writeFile(STORE_PATH, JSON.stringify(loverMemory, null, 2), 'utf8')
    return true
  } catch (error) {
    persistenceAvailable = false
    console.warn('⚠️ [LoverMemory] 持久化不可用，已退回进程内存模式:', error.message)
    return false
  }
}

async function ensureMemoryLoaded() {
  if (isLoaded) return

  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    loverMemory = {
      interactionCount: typeof parsed.interactionCount === 'number' ? parsed.interactionCount : 0,
      lastMood: typeof parsed.lastMood === 'string' ? parsed.lastMood : '温柔',
      recentMessages: Array.isArray(parsed.recentMessages) ? parsed.recentMessages : [],
      lastUserName: typeof parsed.lastUserName === 'string' ? parsed.lastUserName : undefined,
    }
  } catch (error) {
    console.warn('⚠️ [LoverMemory] 读取持久化记忆失败，使用默认内存状态:', error.message)
    await safePersistMemory()
  }

  isLoaded = true
}

function getRelationshipStage(interactionCount) {
  if (interactionCount >= 12) return '亲密稳定期'
  if (interactionCount >= 6) return '暧昧升温期'
  if (interactionCount >= 3) return '逐渐熟悉期'
  return '刚开始心动期'
}

async function getLoverMemoryContext() {
  await ensureMemoryLoaded()
  return {
    interactionCount: loverMemory.interactionCount,
    lastMood: loverMemory.lastMood,
    lastUserName: loverMemory.lastUserName,
    recentMessages: [...loverMemory.recentMessages],
    relationshipStage: getRelationshipStage(loverMemory.interactionCount),
  }
}

async function rememberLoverMessage(message, { userName } = {}) {
  await ensureMemoryLoaded()
  if (!message?.text) return

  const lastMessage = loverMemory.recentMessages[loverMemory.recentMessages.length - 1]
  if (lastMessage?.text === message.text) {
    loverMemory.lastMood = message.mood || loverMemory.lastMood
    if (userName) loverMemory.lastUserName = userName
    await safePersistMemory()
    return
  }

  loverMemory.interactionCount += 1
  loverMemory.lastMood = message.mood || loverMemory.lastMood
  if (userName) loverMemory.lastUserName = userName

  loverMemory.recentMessages.push({
    text: message.text,
    mood: message.mood || '温柔',
    at: Date.now(),
  })

  if (loverMemory.recentMessages.length > MAX_MEMORY_ITEMS) {
    loverMemory.recentMessages = loverMemory.recentMessages.slice(-MAX_MEMORY_ITEMS)
  }

  await safePersistMemory()
}

async function clearLoverMemory() {
  await ensureMemoryLoaded()
  loverMemory = { ...DEFAULT_MEMORY }
  await safePersistMemory()
}

export { clearLoverMemory, getLoverMemoryContext, rememberLoverMessage }