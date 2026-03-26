/**
 * server/index.js — 后端入口
 *
 * 端口：3100（避开 Vite 5173）
 * 
 * 架构分层：
 * Routes (server/routes/) → Controllers (server/controllers/) → Services (server/services/) → Providers (server/providers/)
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import express from 'express'
import { errorHandler } from './middleware/errorHandler.js'
import loverRoutes from './routes/lover.js'
import healthRoutes from './routes/health.js'
import communityRoutes from './routes/community.js'

// dotenv 加载 server/.env
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })

const app = express()

// ── CORS 中间件 ──────────────────────────────────────────
const CORS_ALLOW_ORIGINS = String(process.env.CORS_ALLOW_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

function resolveCorsOrigin(origin) {
  if (CORS_ALLOW_ORIGINS.includes('*')) return '*'
  if (!origin) return CORS_ALLOW_ORIGINS[0] || '*'
  return CORS_ALLOW_ORIGINS.includes(origin) ? origin : ''
}

app.use((req, res, next) => {
  const origin = resolveCorsOrigin(req.headers.origin)
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-grok-api-key')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  next()
})

app.use(express.json())

// ── API 路由 ──────────────────────────────────────────────
app.use('/api/lover', loverRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/community', communityRoutes)

// ── 错误处理中间件（必须在所有路由之后）──────────────────
app.use(errorHandler)

// ── 启动 ──────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || 3100)
app.listen(PORT, () => {
  console.log(`✅ AI Server running at http://localhost:${PORT}`)
})
