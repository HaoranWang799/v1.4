/**
 * server/controllers/scriptController.js — 脚本生成控制器
 */

import { generateScript } from '../services/scriptService.js'

export async function generateScriptHandler(req, res, next) {
  try {
    const prompt = String(req.body?.prompt || '').trim()

    if (!prompt) {
      return res.status(400).json({ error: '请输入描述' })
    }
    if (prompt.length > 500) {
      return res.status(400).json({ error: '描述太长，请控制在 500 字以内' })
    }

    const apiKeyOverride = String(req.headers['x-grok-api-key'] || '').trim()
    const result = await generateScript(prompt, apiKeyOverride)

    res.json(result)
  } catch (err) {
    next(err)
  }
}
