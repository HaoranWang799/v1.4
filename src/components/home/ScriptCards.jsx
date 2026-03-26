/**
 * 剧本卡片组件（从 HomePage.jsx 提取）
 */
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { CARD_VIDEO_IDS } from '../../data/scripts'

/**
 * 推荐剧本卡片（双列网格，竖向布局）
 */
export function ScriptCard({ script, onClick }) {
  const isVideo = CARD_VIDEO_IDS.includes(script.id)
  const [imgSrc, setImgSrc] = useState(`/images/covers/${script.id}.jpg`)

  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden h-48 text-left transition-all duration-200 active:scale-[0.97] card-glow hover:brightness-110 flex flex-col bg-gradient-to-br ${script.gradient}`}
    >
      {isVideo && (
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={`/videos/${script.id}.mp4`} type="video/mp4" />
        </video>
      )}

      {!isVideo && imgSrc && (
        <img
          src={imgSrc}
          alt=""
          onError={() => {
            if (imgSrc.endsWith('.jpg')) setImgSrc(`/images/covers/${script.id}.png`)
            else setImgSrc(null)
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/40" />

      {!isVideo && !imgSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 pointer-events-none select-none">
          {script.coverEmoji || '✨'}
        </div>
      )}

      <div className="relative z-10 p-3.5 flex flex-col justify-end h-full">
        <span className="absolute top-2.5 right-2.5 text-[9px] font-bold bg-[rgba(255,154,203,0.2)] text-[#FF9ACB] rounded-full px-1.5 py-0.5">
          {script.tag}
        </span>

        <p className="text-[11px] font-semibold text-white mb-1 leading-snug pr-6">
          {script.name}
        </p>

        <p className="text-[9px] text-[rgba(179,128,255,0.85)] mb-1">
          {script.personalityTag}
        </p>

        <p className="text-[10px] text-[rgba(245,240,242,0.65)] italic leading-relaxed mb-2 line-clamp-1">
          &ldquo;{script.openingLine}&rdquo;
        </p>

        <div className="flex items-center gap-2 mb-2 pt-1.5 border-t border-[rgba(255,255,255,0.12)]">
          <span className="text-[9px] text-[rgba(245,240,242,0.5)]">↓ {script.downloads}</span>
          {script.rating && (
            <span className="text-[9px] text-[rgba(245,240,242,0.5)]">{script.rating} ★</span>
          )}
        </div>

        <span className="w-full text-center btn-main rounded-xl py-1.5 text-white text-[10px] font-medium">
          开始互动
        </span>
      </div>
    </button>
  )
}

/**
 * AI 定制剧本卡片
 */
export function GeneratedScriptCard({ script, onClick }) {
  const [imgSrc, setImgSrc] = useState(`/images/covers/${script.id}.jpg`)

  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden h-48 text-left transition-all duration-200 active:scale-[0.97] card-glow hover:brightness-110 flex flex-col bg-gradient-to-br ${script.gradient}`}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          onError={() => {
            if (imgSrc.endsWith('.jpg')) setImgSrc(`/images/covers/${script.id}.png`)
            else setImgSrc(null)
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/40" />

      {!imgSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 pointer-events-none select-none">
          {script.coverEmoji || '✨'}
        </div>
      )}

      <div className="relative z-10 p-3.5 flex flex-col justify-end h-full">
        <span
          className="absolute top-2.5 right-2.5 text-[9px] font-bold rounded-full px-1.5 py-0.5 text-white whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)' }}
        >
          ✨ 为你定制
        </span>

        <p className="text-[11px] font-semibold text-white mb-1 leading-snug pr-14">
          {script.name}
        </p>

        <p className="text-[9px] text-[rgba(179,128,255,0.85)] mb-1">
          {script.personalityTag}
        </p>

        <p className="text-[10px] text-[rgba(245,240,242,0.65)] italic leading-relaxed mb-2 line-clamp-1">
          &ldquo;{script.openingLine}&rdquo;
        </p>

        <span
          className="w-full text-center rounded-xl py-1.5 text-white text-[10px] font-bold"
          style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)' }}
        >
          ✨ 体验定制
        </span>
      </div>
    </button>
  )
}

/**
 * "你的幻想"预览卡片（全宽）
 */
export function PreviewScriptCard({ script, onClick }) {
  const [imgSrc, setImgSrc] = useState(`/images/covers/${script.id}.jpg`)

  return (
    <button
      onClick={onClick}
      className="relative w-full rounded-2xl overflow-hidden h-44 text-left transition-all duration-200 active:scale-[0.98] card-glow-selected hover:brightness-110 flex flex-col bg-gradient-to-br from-[#1a0a30] to-[#2a1040]"
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          onError={() => {
            if (imgSrc.endsWith('.jpg')) setImgSrc(`/images/covers/${script.id}.png`)
            else setImgSrc(null)
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/40" />

      {!imgSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 pointer-events-none select-none">
          {script.coverEmoji || '✨'}
        </div>
      )}

      <div className="relative z-10 p-4 flex flex-col justify-end h-full gap-2">
        <span className="absolute top-3 right-3 text-[9px] bg-[rgba(179,128,255,0.25)] text-[#B380FF] rounded-full px-1.5 py-0.5">
          AI 生成
        </span>

        <div>
          <p className="text-sm font-semibold text-white mb-0.5">
            {script.customDisplayName}
          </p>
          <p className="text-[10px] text-[rgba(179,128,255,0.8)]">{script.personalityTag}</p>
        </div>

        <p className="text-[11px] text-[rgba(245,240,242,0.7)] italic leading-relaxed line-clamp-1">
          &ldquo;{script.customIntro}&rdquo;
        </p>

        <span className="w-full flex items-center justify-center gap-1.5 btn-main rounded-xl py-2 text-white text-[11px] font-medium">
          <Sparkles size={11} />
          开始互动
        </span>
      </div>
    </button>
  )
}
