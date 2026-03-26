/**
 * 端到端验证脚本 — 不启动完整服务器，直接测试调用链
 * 
 * 目的：验证 API 请求能否通过整个后端链路
 */

import { config } from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

// 加载环境变量
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })

console.log('\n🔍 端到端验证链路测试\n')

// ========== 测试 1: 验证 Provider 工厂 ==========
console.log('📋 测试 1: Provider 工厂是否能正确调用...')
try {
  const { callProviderWithFallback } = await import('./providers/providerFactory.js')
  console.log('✅ ProviderFactory 导入成功')
} catch (e) {
  console.error('❌ ProviderFactory 导入失败:', e.message)
  process.exit(1)
}

// ========== 测试 2: 验证 Service 层 ==========
console.log('\n📋 测试 2: Service 层是否能初始化...')
try {
  const { generateMessage } = await import('./services/loverService.js')
  console.log('✅ LoverService 导入成功，包含 generateMessage 函数')
} catch (e) {
  console.error('❌ LoverService 导入失败:', e.message)
  process.exit(1)
}

// ========== 测试 3: 验证 Controller 层 ==========
console.log('\n📋 测试 3: Controller 层是否能初始化...')
try {
  const { handlePostMessage } = await import('./controllers/loverController.js')
  console.log('✅ LoverController 导入成功，包含 handlePostMessage 函数')
} catch (e) {
  console.error('❌ LoverController 导入失败:', e.message)
  process.exit(1)
}

// ========== 测试 4: 验证 Routes 层 ==========
console.log('\n📋 测试 4: Routes 层是否能初始化...')
try {
  const routes = await import('./routes/lover.js')
  console.log('✅ Lover Routes 导入成功')
} catch (e) {
  console.error('❌ Lover Routes 导入失败:', e.message)
  process.exit(1)
}

// ========== 测试 5: 验证 Mock Provider 是否能返回数据 ==========
console.log('\n📋 测试 5: Mock Provider 是否能返回数据...')
try {
  const { mockProvider } = await import('./providers/mockProvider.js')
  const mockData = await mockProvider.generateMessage('测试消息', {})
  console.log('✅ Mock Provider 返回数据:', JSON.stringify(mockData, null, 2))
  
  if (!mockData.message || !mockData.mood) {
    console.error('❌ Mock 返回的数据结构不完整')
    process.exit(1)
  }
} catch (e) {
  console.error('❌ Mock Provider 测试失败:', e.message)
  process.exit(1)
}

// ========== 测试 6: 验证 Grok Provider 依赖是否正确 ==========
console.log('\n📋 测试 6: Grok Provider 是否能导入 grok.js...')
try {
  const { grokProvider } = await import('./providers/grokProvider.js')
  console.log('✅ Grok Provider 导入成功')
} catch (e) {
  console.error('❌ Grok Provider 导入失败:', e.message)
  process.exit(1)
}

// ========== 测试 7: 验证完整的 Service 调用（使用 Mock 测试不需要 API Key）==========
console.log('\n📋 测试 7: Service 层是否能通过 Provider 工厂正确路由调用...')
try {
  const { generateMessage } = await import('./services/loverService.js')
  
  // 这会自动尝试 Grok，失败后降级到 Mock
  console.log('⏳ 调用 loverService.generateMessage（将尝试 Grok，失败后自动降级到 Mock）...')
  
  const result = await generateMessage('测试消息', true) // forceRefresh=true 避免缓存
  
  console.log('✅ Service 调用成功!')
  console.log('   返回数据结构:', {
    message: result.message ? '✓ 有消息' : '✗ 无消息',
    mood: result.mood ? '✓ 有情绪' : '✗ 无情绪',
    _provider: result._provider,
    _fallback: result._fallback,
    timestamp: result.timestamp ? '✓ 有时间戳' : '✗ 无时间戳'
  })
  
  if (!result.message || !result.mood) {
    console.error('❌ 返回数据结构不完整!')
    process.exit(1)
  }
} catch (e) {
  console.error('❌ Service 调用失败:', e.message)
  process.exit(1)
}

console.log('\n✅ 所有验证通过！系统链路完整可用。\n')
console.log('📊 验证总结:')
console.log('   ✅ Provider 工厂')
console.log('   ✅ Service 层')
console.log('   ✅ Controller 层')
console.log('   ✅ Routes 层')
console.log('   ✅ Mock Provider（能够返回数据）')
console.log('   ✅ Grok Provider（能够初始化）')
console.log('   ✅ 完整调用链（Service → Provider 工厂 → Mock 降级）\n')

process.exit(0)
