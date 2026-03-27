import { ArrowLeft } from 'lucide-react'

/**
 * HeaderBar — 带返回键的顶部导航栏
 *
 * Props:
 *   title      string    显示的标题
 *   subtitle   string?   标题下方的小字
 *   onBack     fn        点击返回箭头的回调
 *   right      ReactNode 右侧自定义按钮（可选）
 */
export default function HeaderBar({ title, subtitle, onBack, right }) {
  return (
    <div className="flex items-center justify-between px-4 py-5 sticky top-0 bg-[#0C060B]/80 backdrop-blur-md z-30">
      <button
        onClick={onBack}
        className="p-2 -ml-2 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="text-center">
        <h1 className="text-xl font-bold text-[#F9EDF5] tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-[10px] text-[#9B859D] uppercase tracking-widest mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* 右侧占位/自定义按钮，保持标题居中 */}
      <div className="p-2 -mr-2 w-10 flex justify-center">
        {right ?? null}
      </div>
    </div>
  )
}
