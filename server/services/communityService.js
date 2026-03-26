/**
 * 社区服务层 - 业务逻辑和提供者调用
 */

import { getPostsByTab } from '../data/communityData.js'
import { callProviderWithFallback } from '../providers/providerFactory.js'

export async function generateCommunityPosts(tab, page, limit) {
  try {
    console.log(`🔄 [Community Service] Generating posts for tab: ${tab}, page: ${page}`)

    // 调用提供者工厂（支持 Grok 真实推荐 + Mock 降级）
    const result = await callProviderWithFallback(
      'grok',
      'mock',
      'getCommunityPosts',
      [tab, page, limit],
      {
        primaryTimeout: 15000,
        fallbackTimeout: 5000,
      }
    )

    console.log(`✅ [Community Service] Generated posts: _provider=${result._provider}`)
    return result
  } catch (error) {
    console.error('❌ [Community Service] Error:', error.message)

    // 降级到 Mock
    console.log('⚠️ [Community Service] Falling back to mock')
    return getPostsByTab(tab, page, limit)
  }
}
