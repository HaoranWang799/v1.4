/**
 * 互动模式视觉组件（从 HomePage.jsx 提取）
 */
import { BAR_OFFSETS } from '../../data/interactData'

/** 语音波形（麦克风激活时） */
export function VoiceWave() {
  const cls = ['animate-waveBar1','animate-waveBar2','animate-waveBar3','animate-waveBar4','animate-waveBar5']
  return (
    <div className="flex items-center gap-[3px] h-5">
      {cls.map((c, i) => (
        <div key={i} className={`w-[3px] rounded-full bg-[#FF9ACB] origin-bottom ${c}`} style={{ height: '16px' }} />
      ))}
    </div>
  )
}

/** 音波进度条（10 根竖条，速度随频率滑块变化） */
export function Waveform({ freq = 5 }) {
  const dur = 1.2 - (freq - 1) * 0.111
  return (
    <div className="flex items-center justify-center gap-[3px] h-9 px-1">
      {BAR_OFFSETS.map((offset, i) => {
        const h = 30 + ((i * 13 + 7) % 40)
        return (
          <div
            key={i}
            className="rounded-full origin-center"
            style={{
              width: '4px',
              height: `${h}%`,
              animation: `waveBar ${(dur + offset * 0.1).toFixed(2)}s ease-in-out ${offset}s infinite`,
              background: 'linear-gradient(to top, #FF9ACB, #B380FF)',
            }}
          />
        )
      })}
    </div>
  )
}

/** 满屏心形飘落 */
export function HeartRain({ hearts }) {
  return (
    <>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-particle select-none"
          style={{ left: h.left, '--dur': h.dur, animationDelay: h.delay, fontSize: h.size }}
        >
          ❤️
        </span>
      ))}
    </>
  )
}

/** 单个控制滑块（频率 / 强度 / 紧度） */
export function SliderControl({ icon, label, value, onChange }) {
  const pct = ((value - 1) / 9) * 100
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-5 flex-shrink-0 select-none">{icon}</span>
      <span className="text-[11px] font-medium text-[rgba(245,240,242,0.65)] w-8 flex-shrink-0">{label}</span>
      <div className="flex-1">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1 rounded-full outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF9ACB] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ background: `linear-gradient(90deg, #FF9ACB ${pct}%, rgba(255,255,255,0.12) ${pct}%)` }}
        />
      </div>
      <span className="text-xs font-bold text-[#FF9ACB] w-4 text-right tabular-nums flex-shrink-0">{value}</span>
    </div>
  )
}
