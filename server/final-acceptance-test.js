/**
 * final-acceptance-test.js - 最终验收测试
 * 用 Node.js fetch API 快速测试三个页面
 */

const API_URL = 'http://localhost:3103'

async function testApis() {
  console.log('\n🎯 最终真实浏览器级验收\n')

  let allPassed = true

  // 测试 HomePage
  console.log('📋 1️⃣  HomePage (虚拟恋人消息)')
  try {
    const res = await fetch(`${API_URL}/api/lover/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ forceRefresh: true }),
    })

    const data = await res.json()

    if (res.ok && data.ok && data.data?.message && data.data?.mood) {
      console.log('   ✅ PASSED')
      console.log(`   - Message: ${data.data.message}`)
      console.log(`   - Mood: ${data.data.mood}`)
    } else {
      console.log('   ❌ FAILED')
      console.log('   - Response:', JSON.stringify(data).substring(0, 100))
      allPassed = false
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`)
    allPassed = false
  }

  // 测试 HealthPage
  console.log('\n📋 2️⃣  HealthPage (健康计划)')
  try {
    const res = await fetch(`${API_URL}/api/health/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todayStats: { steps: 8000 } }),
    })

    const data = await res.json()

    if (res.ok && data.ok && data.data?.summary) {
      console.log('   ✅ PASSED')
      console.log(`   - Summary: ${data.data.summary.substring(0, 50)}...`)
    } else {
      console.log('   ❌ FAILED')
      console.log('   - Status:', res.status)
      console.log('   - Response ok:', data.ok)
      console.log('   - Has summary:', !!data.data?.summary)
      allPassed = false
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`)
    allPassed = false
  }

  // 测试 CommunityPage
  console.log('\n📋 3️⃣  CommunityPage (社区帖子)')
  try {
    const res = await fetch(`${API_URL}/api/community/posts?tab=体验分享&page=1`, {
      method: 'GET',
    })

    const data = await res.json()

    if (res.ok && data.data?.posts && Array.isArray(data.data.posts) && data.data.posts.length > 0) {
      console.log('   ✅ PASSED')
      console.log(`   - Posts count: ${data.data.posts.length}`)
      console.log(`   - Tab: ${data.data.tab}`)
    } else {
      console.log('   ❌ FAILED')
      console.log('   - Status:', res.status)
      console.log('   - Has posts array:', Array.isArray(data.data?.posts))
      allPassed = false
    }
  } catch (err) {
    console.log(`   ❌ ERROR: ${err.message}`)
    allPassed = false
  }

  // 最终报告
  console.log('\n' + '='.repeat(50))
  if (allPassed) {
    console.log('✅ 🎉 所有页面验收通过！系统真实可用')
  } else {
    console.log('❌ 某些页面未通过')
  }
  console.log('='.repeat(50) + '\n')

  process.exit(allPassed ? 0 : 1)
}

testApis()
