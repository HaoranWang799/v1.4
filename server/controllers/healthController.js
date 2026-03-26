/**
 * server/controllers/healthController.js — Health Plan API 控制器
 *
 * 负责：
 * 1. 接收 HTTP 请求
 * 2. 调用 service 处理业务逻辑
 * 3. 返回格式化的响应
 */

import { generateHealthPlan, getTodayHealthScore } from '../services/healthService.js'

/**
 * POST /api/health/plan
 * 生成健康计划
 */
export async function handlePostPlan(req, res, next) {
  try {
    const payload = req.body || {}
    const apiKeyOverride = String(req.headers['x-grok-api-key'] || '').trim()

    const result = await generateHealthPlan(payload, apiKeyOverride)

    res.json({
      ok: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/health/score
 * 获取健康评分
 */
export async function handlePostScore(req, res, next) {
  try {
    const { stats } = req.body

    if (!stats) {
      return res.status(400).json({
        ok: false,
        error: {
          message: '缺少 stats 字段',
          code: 'MISSING_FIELD',
          statusCode: 400,
        },
      })
    }

    const result = await getTodayHealthScore(stats)

    res.json({
      ok: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export default {
  handlePostPlan,
  handlePostScore,
}
