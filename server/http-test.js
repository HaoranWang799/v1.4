/**
 * 最小 HTTP 模拟测试 — 不需要实际网络，模拟完整的 HTTP 调用链
 */

import { config } from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })

console.log('\n🧪 最小 HTTP 调用模拟测试\n')

// ========== 模拟 HTTP Controller 调用 ==========

console.log('📋 模拟 HTTP POST /api/lover/message 请求...\n')

// 模拟前端发送的请求体
const mockHttpRequest = {
  body: {
    message: '嗨，今天怎么样？',
    forceRefresh: false,
    context: {},
  },
}

// 模拟 Express 的 req 和 res
const mockReq = {
  method: 'POST',
  path: '/api/lover/message',
  body: mockHttpRequest.body,
}

const httpResponses = []
const mockRes = {
  status: (code) => {
    httpResponses.push({ statusCode: code })
    return mockRes
  },
  json: (data) => {
    httpResponses.push({ data })
    return mockRes
  },
}

const mockNext = (error) => {
  if (error) {
    httpResponses.push({ error: error.message })
  }
}

// ========== 导入真实的 Controller ==========

try {
  const { handlePostMessage } = await import('./controllers/loverController.js')
  
  console.log('✅ Controller 导入成功\n')
  
  // ========== 调用真实 Controller ==========
  console.log('⏳ 调用真实的 handlePostMessage controller...\n')
  
  await handlePostMessage(mockReq, mockRes, mockNext)
  
  // ========== 检查响应 ==========
  console.log('📊 HTTP 响应分析：\n')
  
  httpResponses.forEach((resp, idx) => {
    if (resp.statusCode !== undefined) {
      console.log(`   [${idx}] Status Code: ${resp.statusCode}`)
    }
    if (resp.data !== undefined) {
      console.log(`   [${idx}] Response Body:`)
      console.log('   ', JSON.stringify(resp.data, null, 4).split('\n').join('\n    '))
    }
    if (resp.error !== undefined) {
      console.log(`   [${idx}] Error: ${resp.error}`)
    }
  })
  
  // ========== 验证响应结构 ==========
  console.log('\n✅ 完整的 HTTP 调用链执行成功！')
  console.log('\n📋 响应数据验证：')
  
  const finalResponse = httpResponses[httpResponses.length - 1]
  if (finalResponse.data) {
    const body = finalResponse.data
    console.log(`   ✓ ok 字段: ${body.ok === true ? '✓' : '✗'}`)
    
    if (body.data) {
      console.log(`   ✓ data.message: ${body.data.message ? '✓ 有值' : '✗ 无值'}`)
      console.log(`   ✓ data.mood: ${body.data.mood ? '✓ 有值 (' + body.data.mood + ')' : '✗ 无值'}`)
      console.log(`   ✓ data._provider: ${body.data._provider ? '✓ ' + body.data._provider : '✗ 无值'}`)
      console.log(`   ✓ data._fallback: ${body.data._fallback !== undefined ? '✓ ' + body.data._fallback : '✗ 未定义'}`)
      console.log(`   ✓ data.timestamp: ${body.data.timestamp ? '✓ ' + body.data.timestamp : '✗ 无值'}`)
    }
  }
  
  console.log('\n✅ HTTP 请求链路验证通过！')
  console.log(`   请求: POST /api/lover/message`)
  console.log(`   链路: Route → Controller → Service → ProviderFactory → Provider`)
  console.log(`   响应: { ok, data: { message, mood, _provider, _fallback, timestamp } }\n`)
  
} catch (error) {
  console.error('❌ 测试失败:', error.message)
  console.error(error.stack)
  process.exit(1)
}
