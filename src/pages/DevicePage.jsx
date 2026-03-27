import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import Checkbox from '../components/ui/Checkbox'
import { useApp } from '../context/AppContext'
import { Bluetooth, Battery, RefreshCw } from 'lucide-react'

export default function DevicePage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [syncSettings, setSyncSettings] = useState({
    autoConnect: true,
    heating: true,
    aiSync: true,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showToast('已刷新设备列表')
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar
        title="设备连接"
        subtitle="管理您的智能设备"
        onBack={() => navigate(-1)}
        right={
          <button
            onClick={handleRefresh}
            className={`text-white/70 hover:text-[#A87CFF] transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={22} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-8 no-scrollbar">

        {/* 已连接设备 */}
        <div>
          <h3 className="text-xs font-semibold text-[#9B859D] mb-4 px-1 uppercase tracking-[0.15em]">
            已连接设备
          </h3>
          <div className="bg-[#1E1324]/80 border border-[#A87CFF]/40 rounded-[24px] p-6 shadow-[0_10px_30px_rgba(168,124,255,0.1)]">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#A87CFF]/20 flex items-center justify-center text-[#A87CFF] border border-[#A87CFF]/30">
                  <Bluetooth size={24} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#F9EDF5]">Luna AI 互动杯 Pro</h4>
                  <div className="flex items-center text-[10px] text-[#66E699] mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66E699] mr-2 shadow-[0_0_8px_#66E699]" />
                    已连接
                  </div>
                </div>
              </div>
              <button
                onClick={() => showToast('已断开连接')}
                className="text-sm font-medium text-[#A87CFF] hover:text-[#FF7DAF] transition-colors"
              >
                断开连接
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-[#9B859D]">
                  <span>电量</span>
                  <span className="text-[#F9EDF5] font-bold">85%</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#A87CFF] to-[#FF7DAF]" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-[#9B859D]">
                  <span>信号</span>
                  <span className="text-[#F9EDF5] font-bold">95%</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#A87CFF] to-[#80DFFF]" style={{ width: '95%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 可用设备 */}
        <div>
          <h3 className="text-xs font-semibold text-[#9B859D] mb-4 px-1 uppercase tracking-[0.15em]">
            可用设备
          </h3>
          <div className="bg-[#1E1324]/50 border border-white/5 rounded-[20px] p-5 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                <Bluetooth size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F9EDF5]">Nova 智能陪伴环</h4>
                <div className="flex items-center text-[10px] text-[#9B859D] mt-1">
                  <Battery size={10} className="mr-1" />
                  100%
                </div>
              </div>
            </div>
            <button
              onClick={() => showToast('正在尝试连接 Nova...')}
              className="bg-gradient-to-r from-[#A87CFF] to-[#7B59FF] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-lg active:scale-95 transition-transform"
            >
              连接
            </button>
          </div>
        </div>

        {/* 硬件联动设置 */}
        <div>
          <h3 className="text-xs font-semibold text-[#9B859D] mb-4 px-1 uppercase tracking-[0.15em]">
            硬件联动设置
          </h3>
          <div className="bg-[#1E1324]/80 rounded-[24px] p-2 border border-white/5">
            <div className="px-3 py-4 border-b border-white/5">
              <Checkbox
                checked={syncSettings.autoConnect}
                onChange={(v) => setSyncSettings({ ...syncSettings, autoConnect: v })}
                label="启动应用时自动连接设备"
              />
            </div>
            <div className="px-3 py-4 border-b border-white/5">
              <Checkbox
                checked={syncSettings.heating}
                onChange={(v) => setSyncSettings({ ...syncSettings, heating: v })}
                label="开启智能恒温加热 (38°C)"
              />
            </div>
            <div className="px-3 py-4">
              <Checkbox
                checked={syncSettings.aiSync}
                onChange={(v) => setSyncSettings({ ...syncSettings, aiSync: v })}
                label="开启 AI 剧情随动震频"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#A87CFF]/10 border border-[#A87CFF]/20 p-5 rounded-[20px]">
          <p className="text-[11px] leading-relaxed text-[#A87CFF]/80">
            提示：开启恒温加热会增加设备耗电。为获得最佳的随动反馈体验，请保持手机与设备距离在 5 米以内。
          </p>
        </div>
      </div>
    </div>
  )
}
