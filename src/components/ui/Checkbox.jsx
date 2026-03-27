import { Check } from 'lucide-react'

/** 复选框 */
export default function Checkbox({ checked, onChange, label }) {
  return (
    <div
      className="flex items-center space-x-3 cursor-pointer py-1"
      onClick={() => onChange(!checked)}
    >
      <div
        className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all shrink-0 ${
          checked
            ? 'bg-[#A87CFF] border-[#A87CFF] shadow-[0_0_10px_rgba(168,124,255,0.4)]'
            : 'border-white/20 bg-transparent'
        }`}
      >
        {checked && <Check size={16} className="text-white" />}
      </div>
      {label && (
        <span className="text-[15px] font-medium text-[#F9EDF5] select-none">
          {label}
        </span>
      )}
    </div>
  )
}
