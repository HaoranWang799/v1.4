import { useState, useRef, useEffect } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'

export default function SlideToUnlock({ onUnlock, text = "划开底裤，签订契约..." }) {
  const [unlocked, setUnlocked] = useState(false)
  const containerRef = useRef(null)
  const x = useMotionValue(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const thumbWidth = 50

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
  }, [])

  const handleDragEnd = (event, info) => {
    if (x.get() > containerWidth - thumbWidth - 10) {
      setUnlocked(true)
      onUnlock && onUnlock()
    } else {
      x.set(0) // snap back
    }
  }

  const bgWidth = useTransform(x, [0, containerWidth - thumbWidth], [thumbWidth, containerWidth])
  const opacityText = useTransform(x, [0, (containerWidth - thumbWidth) / 2], [1, 0])

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-14 rounded-full flex items-center overflow-hidden transition-colors duration-500 ${unlocked ? 'bg-[#FF2A6D]/20 border-[#FF2A6D]' : 'bg-[#1E1324] border-[#FF2A6D]/30'} border`}
    >
      <motion.div 
        style={{ width: bgWidth }}
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#FF2A6D]/20 to-[#FF2A6D]/80 rounded-full"
      />
      
      <motion.div 
        style={{ opacity: opacityText }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-bold text-[#FF2A6D] tracking-widest drop-shadow-[0_0_5px_rgba(255,42,109,0.5)]"
      >
        {unlocked ? '已解锁契约' : text}
      </motion.div>

      <motion.div
        drag={!unlocked ? "x" : false}
        dragConstraints={{ left: 0, right: containerWidth - thumbWidth }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="absolute left-1 top-1 bottom-1 w-12 bg-gradient-to-br from-[#FF2A6D] to-[#A87CFF] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,42,109,0.6)] cursor-grab active:cursor-grabbing z-10"
      >
        {unlocked ? <Unlock size={18} className="text-white" /> : <Lock size={18} className="text-white" />}
      </motion.div>
    </div>
  )
}
