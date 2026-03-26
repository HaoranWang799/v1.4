/**
 * usePlanPool.js — 训练计划池 Hook
 *
 * 职责：
 *   • 加载 AI 生成的训练计划
 *   • 保持思考态动画
 *   • 仅消费统一结构的真实 API / fallback 结果
 */
import { useState, useRef, useCallback, useEffect } from 'react'
import { fetchHealthPlan } from '../api/healthPlan'

const SWITCH_DURATION = 1700 // 思考动画时长
const HEALTH_PLAN_SESSION_KEY = 'health_plan_session_state'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function readStoredPlanState() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(HEALTH_PLAN_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function writeStoredPlanState(state) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(HEALTH_PLAN_SESSION_KEY, JSON.stringify(state))
  } catch {
    // ignore storage failures
  }
}

export function usePlanPool(buildPayloadFn) {
  const [currentPlan, setCurrentPlan] = useState(() => readStoredPlanState()?.currentPlan || null)
  const [planVisible, setPlanVisible] = useState(() => Boolean(readStoredPlanState()?.planVisible && readStoredPlanState()?.currentPlan))
  const [isSwitching, setIsSwitching] = useState(false)
  const [isFallbackMode, setIsFallbackMode] = useState(() => Boolean(readStoredPlanState()?.isFallbackMode))
  const [isCurrentPlanUpgrading, setIsCurrentPlanUpgrading] = useState(false)
  const [lastPlanMeta, setLastPlanMeta] = useState(() => readStoredPlanState()?.lastPlanMeta || null)

  const requestIdRef = useRef(0)

  useEffect(() => {
    writeStoredPlanState({
      currentPlan,
      planVisible,
      isFallbackMode,
      lastPlanMeta,
    })
  }, [currentPlan, planVisible, isFallbackMode, lastPlanMeta])

  const handleGeneratePlan = useCallback(async () => {
    if (isSwitching) return

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setIsSwitching(true)
    setIsCurrentPlanUpgrading(true)
    setPlanVisible(false)
    setLastPlanMeta(null)

    try {
      const payload = buildPayloadFn ? buildPayloadFn() : {}
      const [response] = await Promise.all([
        fetchHealthPlan(payload),
        wait(SWITCH_DURATION),
      ])

      if (requestId !== requestIdRef.current) return

      if (response?.summary) {
        setCurrentPlan(response)
        setPlanVisible(true)
        setIsFallbackMode(Boolean(response.fallback))
        setLastPlanMeta(response)
      }
    } catch (error) {
      if (requestId === requestIdRef.current) {
        setIsFallbackMode(true)
        setLastPlanMeta({
          provider: 'fallback',
          fallback: true,
          error: error.message,
        })
      }
      console.error('Failed to generate health plan:', error)
    } finally {
      if (requestId === requestIdRef.current) {
        setIsSwitching(false)
        setIsCurrentPlanUpgrading(false)
      }
    }
  }, [buildPayloadFn, isSwitching])

  return {
    currentPlan,
    planVisible,
    isSwitching,
    isFallbackMode,
    isCurrentPlanUpgrading,
    lastPlanMeta,
    handleGeneratePlan,
  }
}
