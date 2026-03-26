/**
 * 互动模式数据 — 震动/预设/音波/工具函数
 * HomePage interact 视图使用
 */

// 震动模式
// TODO: 替换为真实蓝牙设备震动频率控制 (setVibMode)
export const VIB_MODES = [
  { id: 'slow',   label: '轻柔触碰', emoji: '🌊', duration: 1.1  },
  { id: 'medium', label: '快速撞击', emoji: '⚡', duration: 0.45 },
  { id: 'fast',   label: '直接高潮', emoji: '🔥', duration: 0.2  },
]

// 预设模式（点击后同时设置频率/强度/紧度）
export const PRESETS = [
  { id: 'gentle',   label: '轻柔', emoji: '🌊', freq: 3, intens: 2, tight: 4 },
  { id: 'standard', label: '标准', emoji: '⚡', freq: 5, intens: 5, tight: 5 },
  { id: 'climax',   label: '高潮', emoji: '🔥', freq: 9, intens: 8, tight: 9 },
]

// 10 根音波条的延迟偏移（秒）
export const BAR_OFFSETS = [0, 0.08, 0.18, 0.12, 0.04, 0.16, 0.06, 0.22, 0.10, 0.02]

// 进度条：演示总时长（秒），对应 12:45
export const TOTAL_SECONDS = 765

// ── 工具函数 ──

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = Math.floor(secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export const generateHearts = (count = 30) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left:  `${Math.random() * 96 + 2}%`,
    dur:   `${2.5 + Math.random() * 2}s`,
    delay: `${Math.random() * 1.5}s`,
    size:  `${1.2 + Math.random() * 1.2}rem`,
  }))
