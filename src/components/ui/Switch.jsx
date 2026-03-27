/** 开关 Toggle */
export default function Switch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-checked={checked}
      role="switch"
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${
        checked
          ? 'bg-gradient-to-r from-[#FF7DAF] to-[#A87CFF] shadow-[0_0_10px_rgba(255,125,175,0.5)]'
          : 'bg-white/10'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
