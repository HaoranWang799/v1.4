/**
 * 社区路由 - GET /api/community/posts
 * 
 * 支持参数：
 *   - tab: 标签名 ('体验分享' | '攻略教程' | '创作展示')
 *   - page: 页码 (默认 1)
 *   - limit: 每页条数 (默认 5)
 */

import express from 'express'
import { handleGetPosts } from '../controllers/communityController.js'

const router = express.Router()

router.get('/posts', handleGetPosts)

export default router
