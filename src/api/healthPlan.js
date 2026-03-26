/**
 * src/api/healthPlan.js — 健康计划 API
 *
 * 职责：
 *   • 调用后端 /api/health/plan 生成 AI 智能训练计划
 *   • 仅在请求失败时回退到本地模板
 */

import { seedPlans } from '../data/seedPlans'
import { post, withRetry } from './client'

function buildCompatibleHealthPayload(payload = {}) {
  const todayStats = payload.todayStats || {}
  const weeklyTrend = Array.isArray(payload.weeklyTrend) ? payload.weeklyTrend : []
  const detailSummary = payload.detailSummary || {}

  return {
    ...payload,
    todayStats,
    weeklyTrend,
    detailSummary,
    // 兼容旧后端字段
    barData: weeklyTrend,
    durationDetail: {
      avgDuration: detailSummary.avgDuration || todayStats.duration || '',
    },
    statusDetail: {
      distribution: detailSummary.statusDistribution || '',
    },
    intensityDetail: {
      myAvgIntensity: detailSummary.myAvgIntensity || '',
      platformAvgIntensity: detailSummary.platformAvgIntensity || '',
    },
    hardDetail: {
      trend: detailSummary.hardTrend || '',
    },
  }
}

function buildLocalFallbackPlan(errorMessage = '') {
  const sourcePlan = seedPlans[Math.floor(Math.random() * seedPlans.length)] || seedPlans[0]

  return {
    summary: sourcePlan.summary,
    dietFocus: sourcePlan.dietFocus || '恢复优先',
    dietSuggestions: sourcePlan.dietSuggestions || [],
    exerciseSuggestions: sourcePlan.exerciseSuggestions || [],
    nextVibrationMode: {
      mode: sourcePlan.vibrationSuggestion?.mode || '稳定节奏',
      desc: sourcePlan.vibrationSuggestion?.freq ? `${sourcePlan.vibrationSuggestion.freq}Hz 附近，逐步推进` : '中低频起步，逐步加速',
      reason: sourcePlan.vibrationSuggestion?.reason || '当前更适合先稳定节奏与感受',
    },
    provider: 'fallback',
    fallback: true,
    timestamp: new Date().toISOString(),
    error: errorMessage,
  }
}

function normalizeServerPlan(serverData = {}) {
  const resolvedDietSuggestions = serverData.dietSuggestions || serverData.diet?.tips || []
  const resolvedExerciseSuggestions = serverData.exerciseSuggestions || serverData.exercise?.tips || []
  const resolvedNextVibrationMode = serverData.nextVibrationMode || {
    mode: serverData.vibrationMode || '稳定节奏',
    desc: serverData.vibrationModeDesc || '中低频起步，逐步加速',
    reason: serverData.vibrationModeReason || '当前更适合先稳定节奏与感受',
  }

  return {
    summary: serverData.summary || '根据当前数据建议先稳住节奏，优先恢复与轻量训练。',
    dietFocus: serverData.dietFocus || '恢复优先',
    dietSuggestions: resolvedDietSuggestions,
    exerciseSuggestions: resolvedExerciseSuggestions,
    nextVibrationMode: resolvedNextVibrationMode,
    provider: serverData.provider || serverData._provider || (serverData.source === 'grok' ? 'grok' : 'fallback'),
    fallback: Boolean(serverData.fallback ?? serverData._fallback ?? serverData.source === 'fallback'),
    timestamp: serverData.timestamp || new Date().toISOString(),
    error: serverData.error || serverData.aiError || '',
  }
}

/**
 * 生成健康训练计划
 *
 * @param {object} payload - 生成计划所需的上下文数据
 *   {
 *     todayStats: object,        // 今日统计
 *     weeklyTrend: array,        // 近 7 天趋势
 *     detailSummary: object,     // 详细摘要
 *   }
 * @returns {Promise<object>}
 *   { summary, dietSuggestions, exerciseSuggestions, nextVibrationMode, provider, fallback, timestamp }
 */
export async function fetchHealthPlan(payload = {}) {
  try {
    const response = await post('/api/health/plan', buildCompatibleHealthPayload(payload), {
      ...withRetry(2),
      timeout: 15000,
    })

    const responseData = response?.data || response

    if (!response?.ok || !responseData) {
      throw new Error(response?.error?.message || '健康计划接口返回无效')
    }

    return normalizeServerPlan(responseData)
  } catch (error) {
    console.warn('❌ fetchHealthPlan 失败，使用本地 fallback:', error.message)
    return buildLocalFallbackPlan(error.message)
  }
}

export default {
  fetchHealthPlan,
}
