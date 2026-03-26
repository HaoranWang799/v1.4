/**
 * server/routes/health.js — Health Plan API Routes
 *
 * 路由定义，分发到 controller
 */

import express from 'express'
import { handlePostPlan, handlePostScore } from '../controllers/healthController.js'

const router = express.Router()

/**
 * POST /api/health/plan
 * 生成健康计划
 */
router.post('/plan', handlePostPlan)

/**
 * POST /api/health/score
 * 获取健康评分
 */
router.post('/score', handlePostScore)

export default router
