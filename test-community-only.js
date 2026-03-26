/**
 * 单独测试 CommunityPage 
 */

const API_URL = 'http://localhost:3103'

async function test() {
  console.log('测试 http://localhost:3103/api/community/posts...\n')

  try {
    const res = await fetch(`${API_URL}/api/community/posts?tab=体验分享&page=1`)
    console.log('状态码:', res.status)
    console.log('状态消息:', res.statusText)

    const data = await res.json()
    console.log('响应体 (stringify):', JSON.stringify(data, null, 2))

    if (data.posts && Array.isArray(data.posts)) {
      console.log('✅ posts 是数组，长度:', data.posts.length)
    } else {
      console.log('❌ posts 不是数组或不存在')
    }
  } catch (error) {
    console.error('❌ 错误:', error.message)
  }
}

test()
