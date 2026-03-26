/**
 * src/api/community.js — 社区 API
 *
 * 职责：
 *   • 调用后端 /api/community/posts 获取社区帖子
 *   • 支持分页、Tab 切换
 *   • 支持 mock fallback（请求失败时返回本地帖子）
 */

import { get, withMockFallback, withRetry } from './client'

/**
 * 获取社区帖子
 *
 * @param {object} options
 *   - tab: 标签 ('体验分享' | '攻略教程' | '创作展示')
 *   - page: 页码 (默认 1)
 *   - limit: 每页条数 (默认 5)
 * @returns {Promise<object>}
 *   {
 *     posts: Array<PostObject>,  // 帖子列表
 *     tab: string,              // 当前标签
 *     page: number,             // 当前页码
 *     hasMore: boolean,         // 是否有更多数据
 *     total: number,            // 总条数
 *     source: 'live' | 'mock'   // 来源
 *   }
 */
export async function fetchCommunityPosts(options = {}) {
  const {
    tab = '体验分享',
    page = 1,
    limit = 5,
  } = options

  try {
    // 真实请求
    const response = await get(`/api/community/posts`, {
      query: {
        tab,
        page,
        limit,
      },
      ...withRetry(2),
      timeout: 10000,
    })

    // 后端返回 { ok: true, data: { posts, tab, page, hasMore, total, _provider, ... } }
    if (response.ok && response.data) {
      const serverData = response.data
      return {
        posts: serverData.posts || [],
        tab: serverData.tab || tab,
        page: serverData.page || page,
        hasMore: serverData.hasMore || false,
        total: serverData.total || 0,
        source: serverData._provider === 'mock' ? 'mock' : 'live',
        provider: serverData._provider,
      }
    } else if (response.error) {
      console.error('❌ [Community API] 请求失败:', response.error.message)
      throw new Error(response.error.message || '请求失败')
    }

    throw new Error('未知错误')
  } catch (error) {
    console.error('❌ [Community API] 错误:', error.message)

    // Mock fallback - 返回本地数据模拟结果
    console.log('⚠️ [Community API] 降级到 mock')
    return getMockPosts(tab, page, limit)
  }
}

/**
 * Mock 社区帖子数据
 */
function getMockPosts(tab = '体验分享', page = 1, limit = 5) {
  const mockPosts = {
    '体验分享': [
      { id: 1, avatar: '💋', name: '小野猫', content: '声线绝了，我直接升天了😵', likes: 892, tags: ['#好评'] },
      { id: 2, avatar: '🏋️', name: '硬汉柔情', content: '强劲模式一开，太爽了！', likes: 1247, tags: ['#推荐'] },
      { id: 3, avatar: '🌈', name: '彩虹下的他', content: '双人联动太有爱了 🌈', likes: 2134, tags: ['#双人'] },
      { id: 4, avatar: '💑', name: '甜蜜小两口', content: '情侣体验感觉关系升温了', likes: 3458, tags: ['#情侣'] },
      { id: 5, avatar: '🦊', name: '夜行狐', content: '神秘邻居的设定绝了', likes: 518, tags: ['#场景'] },
    ],
    '攻略教程': [
      { id: 7, avatar: '🦁', name: '攻略达人', content: '【新手必看】温度快速提升攻略', likes: 892, tags: ['#教程'] },
      { id: 8, avatar: '🐯', name: '隐藏剧情猎人', content: '已解锁全部隐藏结局！', likes: 1205, tags: ['#隐藏'] },
      { id: 9, avatar: '🦋', name: '蝴蝶效应', content: '冷感女上司触发亲密语句条件', likes: 445, tags: ['#技巧'] },
      { id: 10, avatar: '💑', name: '甜蜜小两口', content: '情侣双人攻略分享', likes: 2876, tags: ['#双人'] },
      { id: 11, avatar: '📊', name: '数据控小明', content: '做了个温度上升速率统计', likes: 678, tags: ['#数据'] },
    ],
    '创作展示': [
      { id: 12, avatar: '🎨', name: '创作家Mia', content: '自制星空海边场景文案', likes: 678, tags: ['#文案'] },
      { id: 13, avatar: '✏️', name: '写字的人', content: '给神秘邻居写了扩展对话', likes: 345, tags: ['#对话'] },
      { id: 14, avatar: '🌈', name: '彩虹糖果', content: '渐进式互动文案搭配方案', likes: 234, tags: ['#方案'] },
      { id: 15, avatar: '🖼️', name: '插画师Leo', content: '角色心境概念插图分享', likes: 1567, tags: ['#插画'] },
      { id: 16, avatar: '🌈', name: '彩虹下的他', content: '男性×男性双人剧本文案', likes: 3212, tags: ['#LGBT'] },
    ],
  }

  const allPosts = mockPosts[tab] || mockPosts['体验分享']
  const startIndex = (page - 1) * limit
  const posts = allPosts.slice(startIndex, startIndex + limit)

  return {
    posts,
    tab,
    page,
    hasMore: startIndex + limit < allPosts.length,
    total: allPosts.length,
    source: 'mock',
  }
}
