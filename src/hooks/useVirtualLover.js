import { useCallback, useEffect, useRef, useState } from 'react'
import { clearVirtualLoverMemory, fetchVirtualLoverMessage } from '../api/virtualLover'

const VIRTUAL_LOVER_SESSION_KEY = 'virtual_lover_session_state'

function readStoredLoverState() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(VIRTUAL_LOVER_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function writeStoredLoverState(state) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(VIRTUAL_LOVER_SESSION_KEY, JSON.stringify(state))
  } catch {
    // ignore storage failures
  }
}

/**
 * useVirtualLover — 虚拟恋人 Hook
 *
 * 职责：
 *   • 加载虚拟恋人 AI 消息
 *   • 支持消息刷新和记忆清除
 *   • 自动处理加载状态、淡入淡出动画
 *   • 支持真实 API + mock fallback
 */

function useVirtualLover() {
  const storedState = readStoredLoverState()
  const [text, setText] = useState(() => storedState?.text || '')
  const [mood, setMood] = useState(() => storedState?.mood || '温柔')
  const [provider, setProvider] = useState(() => storedState?.provider || 'fallback')
  const [fallback, setFallback] = useState(() => storedState?.fallback ?? true)
  const [timestamp, setTimestamp] = useState(() => storedState?.timestamp || '')
  const [loading, setLoading] = useState(() => !storedState?.text)
  const [fadeIn, setFadeIn] = useState(() => Boolean(storedState?.text))
  const textRef = useRef('')
  const requestIdRef = useRef(0)
  const inFlightRef = useRef(false)

  useEffect(() => {
    writeStoredLoverState({
      text,
      mood,
      provider,
      fallback,
      timestamp,
    })
  }, [text, mood, provider, fallback, timestamp])

  useEffect(() => {
    textRef.current = text
  }, [text])

  const loadMessage = useCallback(async ({ forceRefresh = false } = {}) => {
    if (inFlightRef.current && forceRefresh) return

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    inFlightRef.current = true
    setLoading(true)
    setFadeIn(false)

    try {
      const data = await fetchVirtualLoverMessage({ forceRefresh })

      // 检查请求是否被新请求覆盖
      if (requestId !== requestIdRef.current) return

      setText(data.text || '今天有点想你…')
      setMood(data.mood || '温柔')
      setProvider(data.provider || 'fallback')
      setFallback(Boolean(data.fallback))
      setTimestamp(data.timestamp || '')
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      if (!textRef.current) {
        setText('暂时无法获取消息')
        setMood('温柔')
      }
      console.error('Loading message failed:', error)
    } finally {
      if (requestId === requestIdRef.current) {
        inFlightRef.current = false
      }
      setLoading(false)
      requestAnimationFrame(() => setFadeIn(true))
    }
  }, [])

  // 初始化时加载消息
  useEffect(() => {
    if (storedState?.text) return
    loadMessage({ forceRefresh: false })
  }, [loadMessage])

  const clearMemory = useCallback(async () => {
    try {
      await clearVirtualLoverMemory()
      setText('')
      setMood('温柔')
      setProvider('fallback')
      setFallback(true)
      setTimestamp('')
      setFadeIn(false)
      writeStoredLoverState({ text: '', mood: '温柔', provider: 'fallback', fallback: true, timestamp: '' })
    } catch (error) {
      console.error('Clear memory failed:', error)
    }
  }, [])

  return {
    clearMemory,
    fadeIn,
    fallback,
    loading,
    provider,
    mood,
    text,
    timestamp,
    refreshMessage: () => loadMessage({ forceRefresh: true }),
  }
}

export { useVirtualLover }