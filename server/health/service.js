import { generateHealthPlan } from '../ai/grok.js'

const DIET_LIBRARY = {
  recovery: [
    { name: '深海鱼', benefit: '补充 Omega-3，帮助恢复血管弹性与循环效率' },
    { name: '菠菜', benefit: '补充镁元素，帮助缓解疲劳并支持骨盆区域供血' },
    { name: '蓝莓', benefit: '抗氧化，减轻高频刺激后的恢复压力' },
    { name: '鸡蛋', benefit: '提供优质蛋白和胆碱，支持神经反应与恢复' },
  ],
  bloodFlow: [
    { name: '石榴汁', benefit: '帮助提升一氧化氮利用率，改善末梢血流表现' },
    { name: '核桃', benefit: '含精氨酸，支持血流与耐力表现' },
    { name: '南瓜子', benefit: '富含锌和镁，兼顾前列腺与激素平衡' },
    { name: '黑巧克力', benefit: '适量摄入可改善情绪和血管舒张表现' },
  ],
  balance: [
    { name: '牡蛎', benefit: '高锌，有助于维持雄激素与恢复状态' },
    { name: '鳄梨', benefit: '健康脂肪帮助激素合成与稳定能量输出' },
    { name: '芦笋', benefit: '支持代谢与耐力，适合训练周搭配' },
    { name: '生姜', benefit: '帮助提升循环和体感活力' },
  ],
}

const EXERCISE_LIBRARY = {
  restore: [
    { name: '凯格尔运动', plan: '每日 3 组，每组 10 次，每次收缩 5 秒', reason: '提升骨盆底控制力，适合恢复期重新建立稳定发力。' },
    { name: '快走', plan: '每周 5 次，每次 25 分钟，保持微微出汗', reason: '低冲击有氧能改善循环，同时不会增加恢复负担。' },
    { name: '拉伸放松', plan: '每天晚间 10 分钟，重点拉伸髋部和下背', reason: '缓解久坐和紧张带来的骨盆区域僵硬。' },
  ],
  strengthen: [
    { name: '凯格尔+逆凯格尔', plan: '每日 4 组，正向与放松交替进行', reason: '同时训练收缩和放松，改善控制与耐受。' },
    { name: '平板支撑', plan: '每日 3 组，每组 45 到 60 秒', reason: '增强核心稳定，减少发力分散。' },
    { name: '慢跑', plan: '每周 4 次，每次 30 分钟，中等强度', reason: '提高心肺和循环能力，帮助整体表现更稳定。' },
  ],
  intensityDown: [
    { name: '瑜伽呼吸训练', plan: '每天 12 分钟，配合缓慢呼吸节奏', reason: '帮助把高刺激后的神经兴奋降下来。' },
    { name: '游泳', plan: '每周 3 次，每次 30 到 40 分钟', reason: '温和有氧带动全身循环，适合从高强度周期过渡。' },
    { name: '深蹲', plan: '每周 3 次，每次 3 组 × 15 次', reason: '提升下肢与骨盆区域血流，但负担可控。' },
  ],
}

const VIBRATION_LIBRARY = {
  recover: {
    mode: '波浪呼吸模式',
    desc: '以 1 到 4Hz 缓慢起伏，每轮 6 分钟，中间休息 2 分钟',
    reason: '当前更适合降低刺激密度，先把节奏放缓，减少额外疲劳。',
  },
  progressive: {
    mode: '低频渐进模式',
    desc: '从 2Hz 起步，每 2 分钟提升 1Hz，最高不超过 8Hz',
    reason: '适合在控制稳定的前提下逐步拉升刺激，观察耐受和恢复。',
  },
  interval: {
    mode: '脉冲间歇模式',
    desc: '3Hz 持续 10 秒，暂停 5 秒，循环 8 到 10 轮',
    reason: '间歇模式更利于建立节奏控制，不会让刺激持续堆高。',
  },
}

function parseMinutes(duration = '00:00:00') {
  const parts = String(duration).split(':').map((part) => Number(part) || 0)
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60
  if (parts.length === 2) return parts[0] + parts[1] / 60
  return 0
}

function chooseFallbackBucket(input) {
  const score = Number(input.todayStats?.score || 0)
  const status = String(input.todayStats?.status || '')
  const intensity = String(input.todayStats?.intensity || '')
  const hardScore = String(input.todayStats?.hardScore || '')
  const avgDuration = parseMinutes(input.detailSummary?.avgDuration || input.todayStats?.duration)

  if (status.includes('疲劳') || score < 75 || hardScore.startsWith('B')) {
    return { diet: 'recovery', exercise: 'restore', vibration: 'recover', focus: '恢复优先，先把疲劳和循环状态稳住' }
  }

  if (intensity.includes('激烈') && avgDuration > 25) {
    return { diet: 'bloodFlow', exercise: 'intensityDown', vibration: 'interval', focus: '降低连续高刺激负荷，兼顾血流和节奏控制' }
  }

  return { diet: 'balance', exercise: 'strengthen', vibration: 'progressive', focus: '维持表现并继续强化控制力与耐力' }
}

function sanitizePlan(plan, fallback) {
  const dietSuggestions = Array.isArray(plan?.dietSuggestions)
    ? plan.dietSuggestions.filter((item) => item?.name && item?.benefit).slice(0, 4)
    : []
  const exerciseSuggestions = Array.isArray(plan?.exerciseSuggestions)
    ? plan.exerciseSuggestions.filter((item) => item?.name && item?.plan).slice(0, 3)
    : []
  const recoveryTips = Array.isArray(plan?.recoveryTips)
    ? plan.recoveryTips.filter(Boolean).slice(0, 3)
    : []

  return {
    summary: typeof plan?.summary === 'string' && plan.summary.trim()
      ? plan.summary.trim().slice(0, 120)
      : fallback.summary,
    dietFocus: typeof plan?.dietFocus === 'string' && plan.dietFocus.trim()
      ? plan.dietFocus.trim().slice(0, 40)
      : fallback.dietFocus,
    dietSuggestions: dietSuggestions.length === 4 ? dietSuggestions : fallback.dietSuggestions,
    exerciseSuggestions: exerciseSuggestions.length === 3 ? exerciseSuggestions : fallback.exerciseSuggestions,
    vibrationSuggestion: plan?.vibrationSuggestion?.mode && plan?.vibrationSuggestion?.desc
      ? {
          mode: String(plan.vibrationSuggestion.mode).slice(0, 30),
          desc: String(plan.vibrationSuggestion.desc).slice(0, 120),
          reason: String(plan.vibrationSuggestion.reason || '').slice(0, 120) || fallback.vibrationSuggestion.reason,
        }
      : fallback.vibrationSuggestion,
    recoveryTips: recoveryTips.length === 3 ? recoveryTips : fallback.recoveryTips,
  }
}

function buildFallbackHealthPlan(input) {
  const bucket = chooseFallbackBucket(input)
  const summary = `根据你当前 ${input.todayStats?.status || '整体'} 状态、${input.todayStats?.hardScore || '当前'} 硬度评分和近 7 天训练趋势，建议这周先走“${bucket.focus}”路线，避免继续无节奏堆刺激。`

  return {
    source: 'fallback',
    summary,
    dietFocus: bucket.focus,
    dietSuggestions: DIET_LIBRARY[bucket.diet],
    exerciseSuggestions: EXERCISE_LIBRARY[bucket.exercise],
    vibrationSuggestion: VIBRATION_LIBRARY[bucket.vibration],
    recoveryTips: [
      '连续两天高强度后，至少安排一天低刺激恢复日。',
      '优先保证 7 小时以上睡眠，再谈训练质量提升。',
      '训练后 30 分钟内补水，并避免立刻继续高频刺激。',
    ],
  }
}

export async function createHealthPlan(input, options = {}) {
  const modelName = process.env.GROK_MODEL || 'grok-4-fast-non-reasoning'
  const fallback = buildFallbackHealthPlan(input)

  try {
    const aiPlan = await generateHealthPlan(input, {
      apiKeyOverride: options.apiKeyOverride,
    })
    return {
      source: 'grok',
      model: modelName,
      aiError: '',
      ...sanitizePlan(aiPlan, fallback),
    }
  } catch (error) {
    console.error('[Health Plan Error]', error.message)
    return {
      ...fallback,
      source: 'fallback',
      model: modelName,
      aiError: error.message,
    }
  }
}