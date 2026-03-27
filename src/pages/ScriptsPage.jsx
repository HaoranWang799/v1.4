import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { SCRIPTS } from '../data/scriptsData'
import { Flame, Play } from 'lucide-react'

export default function ScriptsPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar title="禁忌互动剧本" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-5 no-scrollbar">
        {SCRIPTS.map((script) => (
          <div
            key={script.id}
            className={`bg-gradient-to-br ${script.color} border border-white/10 rounded-3xl p-5 shadow-lg relative overflow-hidden active:scale-95 transition-transform cursor-pointer`}
            onClick={() => navigate('/player')}
          >
            <div className="flex justify-between items-start mb-3 relative z-10">
              <h4 className="text-lg font-bold text-[#F9EDF5] drop-shadow-md pr-4">
                {script.title}
              </h4>
              <div className="flex space-x-0.5 shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Flame
                    key={i}
                    size={14}
                    className={i < script.flames ? 'text-[#FF4D6D] fill-current' : 'text-white/20'}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#9B859D] mb-4 leading-relaxed relative z-10">
              {script.desc}
            </p>
            <div className="flex space-x-2 mb-4 relative z-10">
              {script.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-black/40 px-2 py-1 rounded text-white/60 border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button className="w-full bg-white/10 backdrop-blur-md text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center space-x-2 relative z-10 shadow-inner hover:bg-white/20">
              <Play size={16} />
              <span>注入频段，立即沉浸</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
