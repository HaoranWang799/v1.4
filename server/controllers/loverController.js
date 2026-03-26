/**
 * server/controllers/loverController.js — Virtual Lover API 控制器
 *
 * 负责：
 * 1. 接收 HTTP 请求
 * 2. 调用 service 处理业务逻辑
 * 3. 返回格式化的响应
 */

import { generateMessage, clearMemory } from '../services/loverService.js'

/**
 * POST /api/lover/message
 * 生成虚拟助手消息
 */
export async function handlePostMessage(req, res, next) {
  try {
    const { text, message, forceRefresh, context } = req.body || {}
    const apiKeyOverride = String(req.headers['x-grok-api-key'] || '').trim()

    const result = await generateMessage(typeof text === 'string' ? text : (message || ''), forceRefresh || false, context || {}, apiKeyOverride)

    res.json({
      ok: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * DELETE /api/lover/memory
 * 清空所有对话记忆
 */
export async function handleDeleteMemory(req, res, next) {
  try {
    const result = await clearMemory()

    res.json({
      ok: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export default {
  handlePostMessage,
  handleDeleteMemory,
}
