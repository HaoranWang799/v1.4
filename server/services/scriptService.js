/**
 * server/services/scriptService.js — AI 角色生成服务
 *
 * 链路：用户 prompt → Grok 生成角色 JSON → Fish Audio TTS → base64 音频
 *
 * 环境变量：
 *   GROK_API_KEY          — Grok API Key（已有）
 *   FISH_AUDIO_API_KEY    — Fish Audio API Key（新增）
 *   SCRIPT_GEN_SYSTEM_PROMPT — LLM 系统提示词（由用户自己配置，可在 Railway 设置）
 */

import { generateStructuredJson } from '../ai/grok.js'
import { textToSpeech } from '../providers/fishAudioProvider.js'

// ── 系统提示词从环境变量读取，由用户自己编写 ──────────────────
// 请在 Railway 变量中设置 SCRIPT_GEN_SYSTEM_PROMPT
// 返回 JSON 必须包含：name / personalityTag / openingLine / gradient
const SYSTEM_PROMPT = process.env.SCRIPT_GEN_SYSTEM_PROMPT ||
  '你是一个角色设计师。根据用户描述生成一个有吸引力的女性角色。' +
  '只返回 JSON，格式如下，不要有其他内容：' +
  '{"name":"角色名(2-5字)","personalityTag":"标签1 / 标签2","openingLine":"第一人称台词10-20字","gradient":"from-[#1a0a30] to-[#3a1060]"}'

function sanitizeCharacter(raw) {
  return {
    name:           String(raw?.name            || '神秘角色').trim().slice(0, 10),
    personalityTag: String(raw?.personalityTag  || '神秘 / 诱惑').trim().slice(0, 20),
    openingLine:    String(raw?.openingLine      || '等你来找我…').trim().slice(0, 50),
    gradient:       String(raw?.gradient        || 'from-[#1a0a30] to-[#3a1060]').trim(),
  }
}

/**
 * 根据用户 prompt 生成角色 + TTS 音频
 * @param {string} prompt - 用户输入的描述文字
 * @param {string} [apiKeyOverride] - 可选 Grok API Key 覆盖
 * @returns {{ character: object, audioBase64: string|null }}
 */
export async function generateScript(prompt, apiKeyOverride = '') {
  console.log(`🎭 [ScriptService] 开始生成，prompt: "${prompt.slice(0, 30)}…"`)

  // ── Step 1: Grok 生成角色数据 ────────────────────────────
  let rawCharacter
  try {
    rawCharacter = await generateStructuredJson({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: prompt,
      temperature: 0.9,
      maxTokens: 200,
      timeoutMs: 10000,
      apiKeyOverride,
    })
  } catch (err) {
    throw new Error(`角色生成失败: ${err.message}`)
  }

  const character = sanitizeCharacter(rawCharacter)
  console.log(`✅ [ScriptService] 角色生成完成: ${character.name} / "${character.openingLine}"`)

  // ── Step 2: Fish Audio TTS（失败时降级，不影响角色卡片展示）─
  let audioBase64 = null
  try {
    audioBase64 = await textToSpeech(character.openingLine)
  } catch (err) {
    console.warn(`⚠️ [ScriptService] TTS 失败，降级无音频: ${err.message}`)
  }

  return { character, audioBase64 }
}
