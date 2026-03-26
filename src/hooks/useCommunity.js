import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchCommunityPosts } from '../api/community'

const COMMUNITY_SESSION_KEY = 'community_session_state'

function readStoredCommunityState() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(COMMUNITY_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function writeStoredCommunityState(state) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(COMMUNITY_SESSION_KEY, JSON.stringify(state))
  } catch {
    // ignore storage failures
  }
}

/**
 * useCommunity — 社区 Hook
 *
 * 职责：
 *   • 加载社区帖子列表
 *   • 支持 Tab 切换和分页
 *   • 自动处理加载状态
 *   • 支持真实 API + mock fallback
 */

function useCommunity() {
  const storedState = readStoredCommunityState()
  const [posts, setPosts] = useState(() => storedState?.posts || [])
  const [currentTab, setCurrentTab] = useState(() => storedState?.currentTab || '体验分享')
  const [currentPage, setCurrentPage] = useState(() => storedState?.currentPage || 1)
  const [loading, setLoading] = useState(() => !storedState?.posts?.length)
  const [hasMore, setHasMore] = useState(() => Boolean(storedState?.hasMore))
  const [error, setError] = useState(() => storedState?.error || null)
  const requestIdRef = useRef(0)
  const inFlightRef = useRef(false)

  useEffect(() => {
    writeStoredCommunityState({
      posts,
      currentTab,
      currentPage,
      hasMore,
      error,
    })
  }, [posts, currentTab, currentPage, hasMore, error])

  const loadPosts = useCallback(async ({ tab = currentTab, page = 1, reset = false } = {}) => {
    if (inFlightRef.current) return

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    inFlightRef.current = true
    setLoading(true)
    setError(null)

    try {
      // 调用真实 API（自动支持 mock fallback）
      const data = await fetchCommunityPosts({
        tab,
        page,
        limit: 5,
      })

      // 检查请求是否被新请求覆盖
      if (requestId !== requestIdRef.current) return

      // 处理错误情况
      if (!data.posts) {
        setError('无法加载帖子')
        setPosts([])
        return
      }

      // 成功情况
      setPosts(data.posts || [])
      setCurrentTab(data.tab || tab)
      setCurrentPage(data.page || page)
      setHasMore(data.hasMore || false)
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      setError(error.message || '加载失败')
      setPosts([])
      console.error('Loading community posts failed:', error)
    } finally {
      if (requestId === requestIdRef.current) {
        inFlightRef.current = false
      }
      setLoading(false)
    }
  }, [currentTab, currentPage])

  // 初始化时加载帖子
  useEffect(() => {
    if (storedState?.posts?.length) return
    loadPosts({ tab: currentTab, page: 1, reset: true })
  }, [])

  // 切换 Tab
  const switchTab = useCallback((tab) => {
    setCurrentTab(tab)
    setCurrentPage(1)
    loadPosts({ tab, page: 1, reset: true })
  }, [loadPosts])

  // 加载下一页
  const loadNextPage = useCallback(() => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    loadPosts({ tab: currentTab, page: nextPage })
  }, [currentTab, currentPage, loadPosts])

  // 刷新当前页
  const refresh = useCallback(() => {
    loadPosts({ tab: currentTab, page: currentPage })
  }, [currentTab, currentPage, loadPosts])

  return {
    posts,
    currentTab,
    currentPage,
    loading,
    hasMore,
    error,
    switchTab,
    loadNextPage,
    refresh,
  }
}

export default useCommunity
