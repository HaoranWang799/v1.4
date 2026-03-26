/**
 * 社区控制器 - 参数验证和响应格式化
 */

export async function handleGetPosts(req, res, next) {
  try {
    const { tab = '体验分享', page = 1, limit = 5 } = req.query

    // 参数验证
    const validTabs = ['体验分享', '攻略教程', '创作展示']
    if (!validTabs.includes(tab)) {
      return res.status(400).json({
        ok: false,
        error: `Invalid tab. Must be one of: ${validTabs.join(', ')}`
      })
    }

    const pageNum = Math.max(1, parseInt(page) || 1)
    const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 5))

    // 调用服务层
    const { generateCommunityPosts } = await import('../services/communityService.js')
    const result = await generateCommunityPosts(tab, pageNum, limitNum)

    return res.status(200).json({
      ok: true,
      data: result
    })
  } catch (error) {
    console.error('❌ [Community Controller] Error:', error.message)
    next(error)
  }
}
