import { ChevronRight, X } from 'lucide-react'
import { THINKING_STEPS } from '../../data/healthData'

export function GrokApiConfigModal({ open, value, onChange, hasSavedKey, onClose, onSave, onClear }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center overscroll-contain"
      style={{ background: 'rgba(5,3,5,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] rounded-t-3xl p-5 pb-[max(env(safe-area-inset-bottom),16px)] max-h-[86vh] overflow-y-auto overscroll-contain"
        style={{ background: 'linear-gradient(160deg, #1e1228, #251840)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[rgba(255,255,255,0.15)] mx-auto mb-5" />

        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-sm font-semibold text-[rgba(245,240,242,0.95)]">接口密钥配置</h3>
            <p className="text-[10px] text-[rgba(245,240,242,0.4)] mt-0.5">用于 AI 分析和虚拟恋人请求</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.08)] flex items-center justify-center flex-shrink-0 ml-3"
          >
            <X size={13} className="text-[rgba(245,240,242,0.5)]" />
          </button>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.06)] my-3" />

        <label className="block text-[10px] text-[rgba(245,240,242,0.45)] mb-2 tracking-wider">API_KEY</label>
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="xai-..."
          className="w-full rounded-xl px-3 py-2.5 text-[12px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] text-[rgba(245,240,242,0.9)] outline-none focus:border-[rgba(179,128,255,0.5)]"
        />

        <p className="mt-2 text-[10px] text-[rgba(245,240,242,0.35)] leading-relaxed">
          当前仅保存在本机浏览器，不会直接显示在页面上。
        </p>

        {hasSavedKey ? (
          <p className="mt-2 text-[10px] text-[rgba(100,255,150,0.72)]">已检测到本地已保存 Key</p>
        ) : (
          <p className="mt-2 text-[10px] text-[rgba(245,240,242,0.35)]">本地尚未保存 Key</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onSave}
            className="py-2.5 rounded-2xl text-[12px] font-semibold active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(90deg, #FF9ACB, #B380FF)', color: '#1a0a12' }}
          >
            保存并启用
          </button>
          <button
            onClick={onClear}
            className="py-2.5 rounded-2xl text-[12px] font-medium text-[rgba(245,240,242,0.6)] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] active:scale-[0.98] transition-transform"
          >
            清除本地 Key
          </button>
        </div>
      </div>
    </div>
  )
}

export function ScoreRing({ score }) {
  const R    = 46
  const CIRC = 2 * Math.PI * R
  const offset = CIRC * (1 - score / 100)

  return (
    <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
        <circle cx="56" cy="56" r={R} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="56" cy="56" r={R} fill="none"
          stroke="url(#scoreGrad)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FF9ACB" />
            <stop offset="100%" stopColor="#B380FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[rgba(245,240,242,0.95)]">{score}</span>
        <span className="text-[9px] text-[rgba(245,240,242,0.45)] tracking-wider">综合评分</span>
      </div>
    </div>
  )
}

export function MetricCell({ label, value, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl p-2.5 bg-[rgba(255,255,255,0.04)] text-center cursor-pointer
                 active:scale-95 transition-transform hover:bg-[rgba(255,255,255,0.07)] w-full"
    >
      <p className="text-[9px] text-[rgba(245,240,242,0.4)] mb-1">{label}</p>
      <p className={`text-xs font-bold ${color ?? 'text-[rgba(245,240,242,0.85)]'}`}>{value}</p>
      {sub && <p className="text-[9px] text-[rgba(245,240,242,0.35)] mt-0.5">{sub}</p>}
      <p className="text-[8px] text-[rgba(179,128,255,0.45)] mt-1">详情 ›</p>
    </button>
  )
}

export function PlanRow({ icon: Icon, title, sub, onDetail }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0">
      <div className="w-8 h-8 rounded-xl bg-[rgba(255,154,203,0.1)] flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-[#FF9ACB]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-[rgba(245,240,242,0.85)] truncate">{title}</p>
        <p className="text-[10px] text-[rgba(245,240,242,0.45)] leading-relaxed">{sub}</p>
      </div>
      <button
        onClick={onDetail}
        className="flex-shrink-0 flex items-center gap-0.5 text-[10px] text-[rgba(179,128,255,0.6)] hover:text-[#B380FF] transition-colors"
      >
        详情 <ChevronRight size={11} />
      </button>
    </div>
  )
}

export function ThinkingState({ step }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-4 animate-fadeUp">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border-2 border-[rgba(179,128,255,0.15)] border-t-[#B380FF]"
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <span className="text-2xl select-none">🤖</span>
      </div>
      <div className="text-center space-y-1">
        <p
          key={step}
          className="text-[12px] text-[#B380FF] font-medium animate-fadeUp"
        >
          {THINKING_STEPS[step]}
        </p>
        <div className="flex gap-1.5 justify-center mt-2">
          {THINKING_STEPS.map((_, i) => (
            <span
              key={i}
              className="inline-block h-1 rounded-full transition-all duration-300"
              style={{
                width: i === step ? '12px' : '4px',
                background: i <= step ? '#B380FF' : 'rgba(179,128,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
