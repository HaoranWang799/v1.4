import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import LunaCupIcon from '../components/ui/LunaCupIcon'
import { useApp } from '../context/AppContext'
import { Activity, Flame, ShieldCheck } from 'lucide-react'

export default function HardwareStorePage() {
  const navigate = useNavigate()
  const { showToast } = useApp()

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar title="Luna 旗舰硬件" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto pb-28 no-scrollbar">
        {/* Hero */}
        <div className="relative w-full h-[300px] flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-tr from-[#FF7DAF] to-[#A87CFF] rounded-full blur-[80px] opacity-30 animate-pulse" />
          <div className="relative w-40 h-40 rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(255,125,175,0.2)] mb-6">
            <div className="absolute inset-0 rounded-full border-t-2 border-[#FF7DAF] drop-shadow-[0_0_10px_rgba(255,125,175,1)]" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-b from-[#1E1324] to-[#0C060B]" />
            <LunaCupIcon size={48} className="text-[#F9EDF5] opacity-90 relative z-10" />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#FFD700] to-[#FF6B00] text-[#1A0A00] text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
              PRO MAX
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-[#F9EDF5] tracking-widest mb-1 z-10">
            Luna Pro Max
          </h2>
          <p className="text-[#9B859D] text-sm tracking-widest z-10 font-light">
            打破虚拟与现实的物理界限
          </p>
        </div>

        {/* 功能卡片 */}
        <div className="px-4 space-y-4">
          <div className="bg-gradient-to-br from-[#2A1A33] to-[#160D1A] border border-[#FF7DAF]/30 rounded-3xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-[#A87CFF]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#A87CFF]/20">
              <Activity size={24} className="text-[#A87CFF]" />
            </div>
            <h3 className="text-lg font-bold text-[#F9EDF5] mb-2">全息感官 · 毫秒级随动</h3>
            <p className="text-xs text-[#9B859D] leading-relaxed">
              革命性的音频解析引擎。她的每一次娇喘、剧本中的每一次撞击音效，都会转化为毫秒级延迟的震动与收缩指令。
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 bg-[#1E1324] border border-white/5 rounded-3xl p-5">
              <Flame size={22} className="text-[#FF4D6D] mb-3" />
              <h3 className="text-sm font-bold text-[#F9EDF5] mb-1">38.5℃ 肌肤恒温</h3>
              <p className="text-[10px] text-[#9B859D]">石墨烯瞬热技术，完美复刻真实肉体包裹感。</p>
            </div>
            <div className="flex-1 bg-[#1E1324] border border-white/5 rounded-3xl p-5">
              <ShieldCheck size={22} className="text-[#80DFFF] mb-3" />
              <h3 className="text-sm font-bold text-[#F9EDF5] mb-1">静音马达</h3>
              <p className="text-[10px] text-[#9B859D]">动力与静音的完美平衡，守护绝对隐私。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部购买栏（fixed 相对于页面容器） */}
      <div className="shrink-0 p-4 bg-[#0C060B]/95 backdrop-blur-xl border-t border-white/5 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col pl-2">
            <span className="text-[10px] text-[#9B859D] line-through">$199.00</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-[#FF7DAF] text-sm font-bold">$</span>
              <span className="text-2xl font-extrabold text-[#F9EDF5]">129.00</span>
            </div>
          </div>
          <button
            onClick={() => showToast('已加入私密购物车')}
            className="w-2/3 bg-gradient-to-r from-[#FF7DAF] to-[#A87CFF] text-white py-3.5 rounded-2xl font-bold active:scale-95 transition-transform"
          >
            立即拥有
          </button>
        </div>
      </div>
    </div>
  )
}
