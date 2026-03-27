import { useEffect } from 'react'
import { Heart } from 'lucide-react'

/** 2 秒自动消失的气泡提示 */
export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce pointer-events-none">
      <div className="bg-[#1E1324]/90 backdrop-blur-md border border-[#FF7DAF]/30 text-[#F9EDF5] px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(255,125,175,0.3)] flex items-center space-x-2 text-sm whitespace-nowrap">
        <Heart size={16} className="text-[#FF7DAF] fill-current shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  )
}
