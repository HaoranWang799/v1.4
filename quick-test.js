/**
 * 快速3步验收
 */
import fs from 'fs'

async function test() {
  const port = 3104
  const output = []
  output.push(`🔍 在 http://localhost:${port} 快速验收\n`)

  try {
    // 1. HomePage
    output.push('1️⃣  测试 HomePage...')
    try {
      let res1 = await fetch(`http://localhost:${port}/api/lover/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRefresh: true }),
        timeout: 5000
      })
      let r1 = await res1.json()
      output.push(r1.ok ? `   ✅ OK (${res1.status})` : `   ❌ 失败 (${res1.status})`)
    } catch (e) {
      output.push(`   ❌ 异常: ${e.message}`)
    }

    // 2. HealthPage
    output.push('\n2️⃣  测试 HealthPage...')
    try {
      let res2 = await fetch(`http://localhost:${port}/api/health/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        timeout: 5000
      })
      let r2 = await res2.json()
      output.push(res2.ok && r2.ok ? `   ✅ OK (${res2.status})` : `   ❌ 失败 (HTTP ${res2.status}, ok=${r2.ok})`)
    } catch (e) {
      output.push(`   ❌ 异常: ${e.message}`)
    }

    // 3. CommunityPage
    output.push('\n3️⃣  测试 CommunityPage...')
    try {
      let res3 = await fetch(`http://localhost:${port}/api/community/posts`, { timeout: 5000 })
      let r3 = await res3.json()
      output.push(r3.data?.posts ? `   ✅ OK (${r3.data.posts.length} 帖子)` : `   ❌ 失败（无posts或data）`)
    } catch (e) {
      output.push(`   ❌ 异常: ${e.message}`)
    }

    output.push('\n' + '='.repeat(50))
    output.push('验收完成')
    output.push('='.repeat(50))
  } catch (e) {
    output.push(`❌ 主异常: ${e.message}`)
  }

  const text = output.join('\n')
  try {
    fs.writeFileSync('ACCEPTANCE_RESULT.txt', text, 'utf8')
  } catch (e) {
    console.log('写入文件失败:', e.message)
  }
  console.log(text)
}

test().finally(() => {
  console.log('\n[完成]')
  process.exit(0)
})
