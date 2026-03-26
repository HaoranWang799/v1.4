/**
 * InteractEnhancements.jsx — 互动页面增量增强组件集合
 *
 * 包含（均为插入式增强，不破坏现有 HomePage 逻辑）：
 *   - HeaderStatusBar      顶部设备状态栏（连接状态 + 电量 + 模式信息）
 *   - SceneTimeline        场景节奏时间轴（节点 + 进度滑杆）
 *   - RhythmModeGrid       节奏模式选择 4 宫格（AI模式下展示）
 *   - AiParameterCards     AI模式下强度 + 频率双卡片
 *   - DeviceStatusFooter   底部设备状态小卡片
 *
 * 数据说明：
 *   - MOCK_DEVICE_STATUS   设备状态 mock（后续接入蓝牙设备 API）
 *   - MOCK_STAGES          场景阶段 mock（后续接入脚本时序 API）
 *   - RHYTHM_MODES         节奏模式列表（后续接入 AI 推荐接口）
 *
 * 后续接口接入点（已在代码中标注 TODO）：
 *   - 蓝牙连接状态：useBluetooth() hook 或 WebBluetooth API
 *   - 设备电量：device.battery
 *   - 当前阶段：由父组件通过 progressValue 计算并下发
 *   - AI推荐模式：/api/ai/recommend-mode
 *   - AI强度/频率：/api/ai/control-params
 */

import { useState } from 'react'
import { Battery } from 'lucide-react'

// ─── Mock 数据（后续接入真实接口）─────────────────────────────────────
// TODO: 接入蓝牙设备状态接口 (getBLEDeviceStatus)
const MOCK_DEVICE_STATUS = {
  connected: true,
  battery: 87,
  mode: 'AI智能模式',
  personality: '温柔型',
  maturity: '成熟型',
  remainingMin: 10,
}

// TODO: 接入脚本时序接口，由父组件 progressValue 自动计算当前阶段
export const STAGE_NODES = [
  { id: 'warmup',  label: '预热阶段',  time: '0:00', startPct: 0  },
  { id: 'going',   label: '进行中',    time: '2:00', startPct: 16 },
  { id: 'climax',  label: '高潮前奏',  time: '4:00', startPct: 32 },
  { id: 'peak',    label: '爆发时刻',  time: '6:00', startPct: 48 },
  { id: 'afterglow', label: '余韵回落', time: '8:00', startPct: 64 },
]

// TODO: 接入 /api/ai/recommend-mode，后端返回推荐的 mode id
const RHYTHM_MODES = [
  { id: 'adaptive', label: '自适应', icon: '〜', aiRecommend: true },
  { id: 'gentle',   label: '温和',   icon: '≈',  aiRecommend: false },
  { id: 'wave',     label: '波浪',   icon: '∿',  aiRecommend: false },
  { id: 'sprint',   label: '冲刺',   icon: '▷▷', aiRecommend: false },
]

// ─── 工具：由进度百分比映射到当前阶段 index ─────────────────────────
export function getStageIndexByProgress(pct) {
  let idx = 0
  for (let i = STAGE_NODES.length - 1; i >= 0; i--) {
    if (pct >= STAGE_NODES[i].startPct) { idx = i; break }
  }
  return idx
}

function ConnectionBatteryPill({ connected, battery }) {
  const level = Math.max(0, Math.min(100, Number(battery) || 0))

  return (
    <div className="flex items-center space-x-3 px-1 py-0.5">
      <div className={`flex items-center text-xs font-medium ${connected ? 'text-emerald-400' : 'text-rose-400'}`}>
        <div className="relative w-4 h-4 mr-1">
          <div
            className={`absolute inset-0 rounded-full ${connected ? 'bg-emerald-400 animate-ping opacity-20' : 'bg-rose-400 opacity-20'}`}
          />
          <div
            className={`absolute inset-1 border rounded-full ${connected ? 'border-emerald-400' : 'border-rose-400'}`}
          />
        </div>
        <span>
          {connected ? '已连接' : '未连接'}
        </span>
      </div>

      <div className="w-px h-3 bg-white/20" />

      <div className="flex items-center text-zinc-300 text-xs">
        <Battery size={14} className="mr-1 text-blue-400" />
        <span className="tabular-nums">
          {level}%
        </span>
      </div>
    </div>
  )
}

// ─── 1. HeaderStatusBar ──────────────────────────────────────────────
/**
 * 顶部设备状态栏
 * props:
 *   - connected: boolean   TODO: 接入 useBluetooth().connected
 *   - battery: number      TODO: 接入 device.battery
 *   - mode: string         TODO: 接入 aiSession.mode
 *   - personality: string  TODO: 接入 activeScript.personality
 *   - remainingMin: number TODO: 接入 session.remainingMinutes
 */
export function HeaderStatusBar({
  connected = MOCK_DEVICE_STATUS.connected,
  battery   = MOCK_DEVICE_STATUS.battery,
  mode      = MOCK_DEVICE_STATUS.mode,
  personality = MOCK_DEVICE_STATUS.personality,
  maturity  = MOCK_DEVICE_STATUS.maturity,
}) {
  return (
    <div className="relative z-10 rounded-2xl px-3.5 py-2.5 card-glow bg-[rgba(15,8,15,0.72)] border border-[rgba(179,128,255,0.18)] flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
        {/* TODO: 后续由 aiSession.mode 动态驱动 */}
        <span
          className="text-[9px] font-medium rounded-full px-2 py-0.5"
          style={{ background: 'linear-gradient(135deg, rgba(179,128,255,0.25), rgba(255,154,203,0.15))', color: '#B380FF', border: '1px solid rgba(179,128,255,0.3)' }}
        >
          ✦ {mode}
        </span>
        <span className="text-[9px] text-[rgba(245,240,242,0.45)]">·</span>
        <span className="text-[9px] text-[rgba(245,240,242,0.55)]">{personality}</span>
        <span className="text-[9px] text-[rgba(245,240,242,0.45)]">·</span>
        <span className="text-[9px] text-[rgba(245,240,242,0.55)]">{maturity}</span>
      </div>

      <ConnectionBatteryPill connected={connected} battery={battery} />
    </div>
  )
}

// ─── 3. SceneTimeline ────────────────────────────────────────────────
/**
 * 场景节奏时间轴（节点 + 总进度滑杆）
 * props:
 *   - progressValue: number      当前进度 0-100（与父组件 progressValue 共用）
 *   - onProgressChange: fn       父组件传入的进度 setter
 *   - stageIndex: number         当前高亮阶段 index
 *   - onStageChange: fn          点击节点时切换阶段（仅更新前端状态）
 * TODO: onProgressChange 后续连接到真实音频 currentTime seek
 * TODO: onStageChange 后续触发脚本段落切换接口 /api/session/jump-to-stage
 */
// SceneTimeline：纯内容组件，无独立卡片外壳，嵌入主播放卡内部使用
// 已移除重复的进度滑杆（主播放卡内已有进度条）
export function SceneTimeline({ stageIndex = 0, onStageChange }) {
  return (
    <div className="flex items-start justify-between">
      {STAGE_NODES.map((node, i) => {
        const isActive = i === stageIndex
        const isPassed = i < stageIndex
        return (
          <button
            key={node.id}
            onClick={() => onStageChange?.(i)}
            className="flex flex-col items-center gap-1 flex-1 min-w-0 active:scale-95 transition-transform"
          >
            {/* 节点圆 */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300"
              style={
                isActive
                  ? { background: '#FF9ACB', boxShadow: '0 0 5px rgba(255,154,203,0.8)' }
                  : isPassed
                  ? { background: 'rgba(255,154,203,0.35)' }
                  : { background: 'rgba(255,255,255,0.1)' }
              }
            />
            {/* 标签 */}
            <span
              className="text-[7px] text-center leading-tight"
              style={{
                color: isActive ? 'rgba(255,154,203,0.85)' : 'rgba(245,240,242,0.28)',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {node.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── 5. RhythmModeGrid ───────────────────────────────────────────────
/**
 * 节奏模式 2×2 选择宫格（AI模式下展示）
 * props:
 *   - selectedMode: string     当前选中模式 id
 *   - onChange: fn             切换模式回调
 * TODO: onChange 后续调用 /api/ai/set-rhythm-mode?mode=xxx
 * TODO: aiRecommend 字段后续由 /api/ai/recommend-mode 接口返回
 */
export function RhythmModeGrid({ selectedMode, onChange }) {
  return (
    <div className="relative z-10 rounded-2xl p-4 card-glow bg-[rgba(15,8,15,0.72)]">
      {/* 标题行 */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold text-[rgba(245,240,242,0.8)]">节奏模式</p>
        {/* TODO: 后端返回推荐后动态展示 */}
        <span className="text-[8px] text-[rgba(179,128,255,0.4)]">AI 推荐：自适应</span>
      </div>

      {/* 4 个模式按钮 */}
      <div className="grid grid-cols-4 gap-2">
        {RHYTHM_MODES.map(m => {
          const isSelected = selectedMode === m.id
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className="flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all duration-200 active:scale-95"
              style={
                isSelected
                  ? {
                      background: 'linear-gradient(135deg, rgba(179,128,255,0.3), rgba(255,154,203,0.2))',
                      border: '1.5px solid rgba(179,128,255,0.6)',
                      boxShadow: '0 0 10px rgba(179,128,255,0.2)',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }
              }
            >
              {/* 图标 */}
              <span
                className="text-[15px] font-bold select-none leading-none"
                style={{ color: isSelected ? '#B380FF' : 'rgba(245,240,242,0.5)', fontFamily: 'monospace' }}
              >
                {m.icon}
              </span>
              {/* 标签 */}
              <span
                className="text-[9px] font-medium"
                style={{ color: isSelected ? 'rgba(245,240,242,0.9)' : 'rgba(245,240,242,0.45)' }}
              >
                {m.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── 6. AiParameterCards ─────────────────────────────────────────────
/**
 * AI 模式下强度 + 频率双卡片
 * props:
 *   - aiIntens: number       AI强度 0-100
 *   - onAiIntensChange: fn
 *   - aiFreq: number         温度（36.1-37.5）
 *   - onAiFreqChange: fn
 * TODO: onChange 后续调用 /api/ai/set-param?intens=&freq=
 */
export function AiParameterCards({ aiIntens, onAiIntensChange, aiFreq, onAiFreqChange }) {
  const tempMin = 36.1
  const tempMax = 37.5
  const tempPct = Math.max(0, Math.min(100, ((aiFreq - tempMin) / (tempMax - tempMin)) * 100))

  return (
    <div className="relative z-10 grid grid-cols-2 gap-3">
      {/* 湿度卡片 */}
      <div
        className="rounded-2xl p-3.5 flex flex-col gap-2"
        style={{ background: 'rgba(15,8,15,0.72)', border: '1px solid rgba(255,154,203,0.15)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs select-none">💧</span>
            <span className="text-[10px] font-semibold text-[rgba(245,240,242,0.75)]">湿度</span>
          </div>
          <span className="text-[13px] font-bold tabular-nums text-[#FF9ACB]">{aiIntens}%</span>
        </div>
        <div className="flex items-center gap-1 text-[8px] text-[rgba(245,240,242,0.3)]">
          <span>干燥</span>
          <div className="flex-1" />
          <span>湿润</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={aiIntens}
          onChange={e => onAiIntensChange(Number(e.target.value))}
          className="w-full h-1 rounded-full outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF9ACB] [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ background: `linear-gradient(90deg, #FF9ACB ${aiIntens}%, rgba(255,255,255,0.12) ${aiIntens}%)` }}
        />
      </div>

      {/* 温度卡片 */}
      <div
        className="rounded-2xl p-3.5 flex flex-col gap-2"
        style={{ background: 'rgba(15,8,15,0.72)', border: '1px solid rgba(179,128,255,0.15)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs select-none">🌡️</span>
            <span className="text-[10px] font-semibold text-[rgba(245,240,242,0.75)]">温度</span>
          </div>
          <span className="text-[13px] font-bold tabular-nums text-[#B380FF]">{Number(aiFreq).toFixed(1)}°</span>
        </div>
        <div className="flex items-center gap-1 text-[8px] text-[rgba(245,240,242,0.3)]">
          <span>清凉</span>
          <div className="flex-1" />
          <span>炙热</span>
        </div>
        <input
          type="range"
          min={tempMin}
          max={tempMax}
          step="0.1"
          value={aiFreq}
          onChange={e => onAiFreqChange(Number(e.target.value))}
          className="w-full h-1 rounded-full outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#B380FF] [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ background: `linear-gradient(90deg, #B380FF ${tempPct}%, rgba(255,255,255,0.12) ${tempPct}%)` }}
        />
      </div>
    </div>
  )
}

// ─── 7. DeviceStatusFooter ───────────────────────────────────────────
/**
 * 底部设备状态小卡片（三栏信息）
 * props:
 *   - status: string     设备状态文字，如"正常"
 *   - battery: number    剩余电量
 *   - signal: string     信号评分，如"优秀"
 * TODO: 接入蓝牙设备 API 后，这三项均由 getBLEDeviceStatus() 实时更新
 */
export function DeviceStatusFooter({
  status  = '正常',
  battery = MOCK_DEVICE_STATUS.battery,
  signal  = '优秀',
}) {
  return (
    <div className="relative z-10 grid grid-cols-3 gap-1.5">
      {/* 设备温度 / 状态 */}
      <div
        className="rounded-xl p-2 flex flex-col items-center gap-0.5"
        style={{ background: 'rgba(12,6,12,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-[7px] text-[rgba(245,240,242,0.28)] tracking-wide">设备温度</span>
        <span className="text-[11px] font-semibold text-[rgba(245,240,242,0.65)]">{status}</span>
      </div>

      {/* 剩余电量 */}
      <div
        className="rounded-xl p-2 flex flex-col items-center gap-0.5"
        style={{ background: 'rgba(12,6,12,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-[7px] text-[rgba(245,240,242,0.28)] tracking-wide">剩余电量</span>
        <span className="text-[11px] font-semibold tabular-nums" style={{ color: battery > 30 ? 'rgba(34,197,94,0.75)' : '#ef4444' }}>
          {battery}%
        </span>
      </div>

      {/* 信号评分 */}
      <div
        className="rounded-xl p-2 flex flex-col items-center gap-0.5"
        style={{ background: 'rgba(12,6,12,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-[7px] text-[rgba(245,240,242,0.28)] tracking-wide">信号质量</span>
        <span className="text-[11px] font-semibold text-[rgba(179,128,255,0.7)]">{signal}</span>
      </div>
    </div>
  )
}
