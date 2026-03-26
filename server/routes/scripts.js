/**
 * server/routes/scripts.js — 脚本生成路由
 */

import { Router } from 'express'
import { generateScriptHandler } from '../controllers/scriptController.js'

const router = Router()

router.post('/generate', generateScriptHandler)

export default router
