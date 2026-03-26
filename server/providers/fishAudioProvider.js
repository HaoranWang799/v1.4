/**
 * server/providers/fishAudioProvider.js — Fish Audio S2-Pro TTS 提供者
 *
 * 将文本转化为 MP3 语音，返回 base64 字符串
 * 声音 ID: fb43143e46f44cc6ad7d06230215bab6 (S2-Pro)
 */

const FISH_AUDIO_TTS_URL = 'https://api.fish.audio/v1/tts'
const VOICE_ID = 'fb43143e46f44cc6ad7d06230215bab6'
const TTS_TIMEOUT_MS = 12000

/**
 * 文本转语音
 * @param {string} text - 要合成的文本（建议 10-30 字）
 * @param {string} [apiKeyOverride] - 可选的 API Key 覆盖
 * @returns {Promise<string>} base64 编码的 MP3 音频
 */
export async function textToSpeech(text, apiKeyOverride = '') {
  const apiKey = (typeof apiKeyOverride === 'string' && apiKeyOverride.trim())
    ? apiKeyOverride.trim()
    : process.env.FISH_AUDIO_API_KEY

  if (!apiKey) throw new Error('FISH_AUDIO_API_KEY is not set')

  // 截断防止超长请求
  const truncated = String(text || '').trim().slice(0, 80)
  if (!truncated) throw new Error('TTS 文本不能为空')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TTS_TIMEOUT_MS)

  try {
    console.log(`🔊 [FishAudio] TTS 请求: "${truncated.slice(0, 20)}…" (${truncated.length}字)`)

    const res = await fetch(FISH_AUDIO_TTS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: truncated,
        reference_id: VOICE_ID,
        format: 'mp3',
        latency: 'normal',
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Fish Audio API ${res.status}: ${body}`)
    }

    const arrayBuffer = await res.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    console.log(`✅ [FishAudio] TTS 完成，音频大小: ${Math.round(arrayBuffer.byteLength / 1024)}KB`)
    return base64
  } finally {
    clearTimeout(timeout)
  }
}
