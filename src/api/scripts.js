/**
 * src/api/scripts.js — AI 剧本生成前端 API 封装
 */

import { buildApiUrl } from './baseUrl'

/**
 * 根据用户描述生成角色 + TTS 音频
 * @param {string} prompt - 用户输入的描述文字
 * @returns {{ character: { name, personalityTag, openingLine, gradient }, audioBase64: string|null }}
 */
export async function generateScript(prompt) {
  const url = buildApiUrl('/api/scripts/generate')

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `生成失败 (${res.status})`)
  }

  return res.json()
}
