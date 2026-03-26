/**
 * 角色 & 场景选择卡片（从 HomePage.jsx 提取）
 */

/** 角色选择卡片（定制区横向滚动，单选） */
export function CharSelectCard({ char, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative flex-shrink-0 w-32 rounded-2xl p-3 text-left transition-all duration-200
        active:scale-95
        ${selected
          ? 'card-glow-selected bg-[rgba(255,154,203,0.12)] ring-1 ring-[rgba(255,154,203,0.45)]'
          : 'card-glow bg-[rgba(30,20,25,0.7)] hover:bg-[rgba(50,30,40,0.7)]'
        }
      `}
    >
      {selected && (
        <span className="absolute top-1.5 right-1.5 text-[8px] bg-[#FF9ACB] text-[#1a0a12] rounded-full px-1.5 py-0.5 font-bold leading-none">
          ✓ 已选
        </span>
      )}

      <div className="text-3xl mb-1.5 select-none">{char.emoji}</div>

      <p className="text-[11px] font-semibold text-[rgba(245,240,242,0.95)] mb-0.5 pr-6 leading-tight">
        {char.name}
      </p>

      <p className="text-[9px] text-[rgba(179,128,255,0.8)] mb-1.5">{char.tag}</p>

      <p className="text-[9px] text-[rgba(245,240,242,0.45)] italic leading-relaxed line-clamp-2">
        &ldquo;{char.intro}&rdquo;
      </p>
    </button>
  )
}

/** 场景选择卡片（定制区横向滚动，单选） */
export function SceneSelectCard({ scene, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative flex-shrink-0 w-28 rounded-2xl p-3 text-left transition-all duration-200
        active:scale-95
        ${selected
          ? 'card-glow-selected bg-[rgba(179,128,255,0.15)] ring-1 ring-[rgba(179,128,255,0.45)]'
          : 'card-glow bg-[rgba(30,20,25,0.7)] hover:bg-[rgba(50,30,40,0.7)]'
        }
      `}
    >
      {selected && (
        <span className="absolute top-1.5 right-1.5 text-[8px] bg-[#B380FF] text-white rounded-full px-1.5 py-0.5 font-bold leading-none">
          ✓ 已选
        </span>
      )}

      <div className="text-2xl mb-1.5 select-none">{scene.emoji}</div>

      <p className="text-[11px] font-semibold text-[rgba(245,240,242,0.95)] mb-1 pr-6 leading-tight">
        {scene.name}
      </p>

      <p className="text-[9px] text-[rgba(245,240,242,0.45)] leading-relaxed line-clamp-3">
        {scene.ambiance.idle}
      </p>
    </button>
  )
}
