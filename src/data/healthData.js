/**
 * 健康页面静态数据 — 从 HealthPage.jsx 提取
 * TODO: 各数据项替换为真实 API
 */

export const TODAY_STATS = {
  score:      85,
  duration:   '00:23:45',
  status:     '兴奋',
  intensity:  '激烈',
  softSecs:   12,
  hardMin:    8,
  hardSec:    20,
  hardScore:  'A-',
}

export const BAR_DATA = [
  { day: '周一', heightPct: 40,  label: '18m' },
  { day: '周二', heightPct: 65,  label: '28m' },
  { day: '周三', heightPct: 28,  label: '12m' },
  { day: '周四', heightPct: 82,  label: '35m' },
  { day: '周五', heightPct: 55,  label: '24m' },
  { day: '周六', heightPct: 92,  label: '39m' },
  { day: '今天', heightPct: 53,  label: '23m', isToday: true },
]

export const DURATION_DETAIL = {
  days: [
    { day: '周一', duration: '18:20', secs: 1100 },
    { day: '周二', duration: '28:05', secs: 1685 },
    { day: '周三', duration: '12:42', secs: 762 },
    { day: '周四', duration: '35:10', secs: 2110 },
    { day: '周五', duration: '24:33', secs: 1473 },
    { day: '周六', duration: '39:08', secs: 2348 },
    { day: '今天', duration: '23:45', secs: 1425, isToday: true },
  ],
  avgDisplay: '25:49',
  targetDisplay: '20:00',
  targetNote: '每次 20 分钟以内，有助于保持高质量体验',
}

export const STATUS_DETAIL = {
  days: [
    { day: '周一', status: '良好',  color: 'text-[#7fcb9a]' },
    { day: '周二', status: '兴奋',  color: 'text-[#FF9ACB]' },
    { day: '周三', status: '疲劳',  color: 'text-[#ffa07a]' },
    { day: '周四', status: '兴奋',  color: 'text-[#FF9ACB]' },
    { day: '周五', status: '良好',  color: 'text-[#7fcb9a]' },
    { day: '周六', status: '兴奋',  color: 'text-[#FF9ACB]' },
    { day: '今天', status: '兴奋',  color: 'text-[#FF9ACB]', isToday: true },
  ],
  distribution: [
    { label: '兴奋', count: 4, pct: 57, color: '#FF9ACB' },
    { label: '良好', count: 2, pct: 29, color: '#7fcb9a' },
    { label: '疲劳', count: 1, pct: 14, color: '#ffa07a' },
  ],
}

export const INTENSITY_DETAIL = {
  days: [
    { day: '周一', score: 3, label: '中等' },
    { day: '周二', score: 4, label: '激烈' },
    { day: '周三', score: 2, label: '温和' },
    { day: '周四', score: 5, label: '极烈' },
    { day: '周五', score: 4, label: '激烈' },
    { day: '周六', score: 5, label: '极烈' },
    { day: '今天', score: 4, label: '激烈', isToday: true },
  ],
  myAvg: 3.9,
  platformAvg: 3.1,
  note: '你的内容偏好明显高于平台均值，建议偶尔尝试中低强度内容放松身心',
}

export const HARD_DETAIL = {
  days: [
    { day: '周一', softSecs: 18, hardMin: 6, hardSec: 30, grade: 'B+' },
    { day: '周二', softSecs: 10, hardMin: 9, hardSec: 10, grade: 'A-' },
    { day: '周三', softSecs: 25, hardMin: 4, hardSec: 55, grade: 'B'  },
    { day: '周四', softSecs:  8, hardMin: 11, hardSec: 0, grade: 'A'  },
    { day: '周五', softSecs: 14, hardMin: 7, hardSec: 45, grade: 'B+' },
    { day: '周六', softSecs:  6, hardMin: 12, hardSec: 20, grade: 'A+' },
    { day: '今天', softSecs: 12, hardMin: 8, hardSec: 20, grade: 'A-', isToday: true },
  ],
  trend: '本周整体呈上升趋势，强硬度时间增长 32%，疲软期缩短 15%',
}

export const DIET_PLANS = [
  [
    { name: '牡蛎',   benefit: '富含锌，直接提升雄激素水平' },
    { name: '南瓜子', benefit: '高锌高镁，保护前列腺健康' },
    { name: '菠菜',   benefit: '富含镁，促进骨盆血液循环' },
    { name: '黑巧克力', benefit: '含苯乙胺，提升情绪与活力' },
  ],
  [
    { name: '深海鱼', benefit: 'Omega-3，改善血管弹性与血流' },
    { name: '蓝莓',   benefit: '强抗氧化，保护生殖系统细胞' },
    { name: '鳄梨',   benefit: '健康脂肪，平衡激素分泌' },
    { name: '芦笋',   benefit: '含天冬氨酸，提升耐力与精力' },
  ],
  [
    { name: '鸡蛋',   benefit: '优质蛋白与卵磷脂，强化神经反应' },
    { name: '石榴汁', benefit: '抗氧化，改善动脉血流量' },
    { name: '核桃',   benefit: '含精氨酸，促进氧化氮生成' },
    { name: '生姜',   benefit: '提升体温与代谢，增强活力' },
  ],
]

export const EXERCISE_PLANS = [
  [
    { name: '凯格尔运动',   plan: '每日 3 组，每组 10 次，每次收缩 5 秒' },
    { name: '平板支撑',     plan: '每日 2 组，每组 60 秒，强化核心' },
    { name: '慢跑',         plan: '每周 4 次，每次 30 分钟，中等强度' },
  ],
  [
    { name: '深蹲',         plan: '每日 3 组，每组 15 次，激活骨盆底肌' },
    { name: '游泳',         plan: '每周 3 次，每次 40 分钟，全身有氧' },
    { name: '瑜伽',         plan: '每日 15 分钟，改善骨盆灵活性' },
  ],
  [
    { name: '凯格尔+逆凯格尔', plan: '交替进行，每日 4 组，精准控制训练' },
    { name: '有氧单车',     plan: '每周 5 次，每次 25 分钟，中等强度' },
    { name: '核心卷腹',     plan: '每日 3 组 × 20 次，强化下腹区域' },
  ],
]

export const VIBRATION_MODES = [
  { mode: '低频渐进模式',  desc: '从 2Hz 开始，每 2 分钟递增 1Hz，最高至 8Hz' },
  { mode: '脉冲间歇模式',  desc: '强度 3Hz 持续 10s，停止 5s，循环 8 轮' },
  { mode: '波浪呼吸模式',  desc: '随呼吸节奏缓慢起伏，频率 1–5Hz' },
]

export const HEALTH_TIPS = [
  '深度放松有助于提高硬度与持久度',
  '规律作息对性功能有显著正向影响',
  '适量有氧运动可提升体内睾酮水平',
  '保持水分摄入充足，有助于改善整体状态',
  '减少久坐时间，每小时起身活动 5 分钟',
  '高质量睡眠是最好的自然恢复方式',
]

export const THINKING_STEPS = [
  '分析你的使用数据中...',
  '检测到近期时长下降 15%...',
  '评估激素水平与训练状态...',
  '生成个性化训练方案...',
]

/**
 * 构建健康计划生成请求的 payload
 * 用于调用 POST /api/health/plan
 */
export function buildHealthPlanPayload() {
  return {
    todayStats: TODAY_STATS,
    weeklyTrend: BAR_DATA,
    detailSummary: {
      avgDuration: DURATION_DETAIL.avgDisplay,
      statusDistribution: STATUS_DETAIL.distribution
        .map((item) => `${item.label}${item.pct}%`)
        .join('、'),
      myAvgIntensity: INTENSITY_DETAIL.myAvg,
      platformAvgIntensity: INTENSITY_DETAIL.platformAvg,
      hardTrend: HARD_DETAIL.trend,
    },
  }
}
