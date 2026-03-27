import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import Checkbox from '../components/ui/Checkbox'
import { useApp } from '../context/AppContext'
import { Bluetooth, Battery, RefreshCw, Thermometer, Waves, Zap } from 'lucide-react'

export default function DevicePage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [syncSettings, setSyncSettings] = useState({
    autoConnect: true,
    heating: true,
    aiSync: true,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tempReady, setTempReady] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      showToast('已刷新设备列表')
    }, 1500)
  }

  const handlePreheat = () => {
    setTempReady(true)
    showToast('加热中… 预计 3 分钟后达到 38.5℃')
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5]">
      <HeaderBar
        title="设备连接"
        onBack={() => navigate(-1)}
        right={
          <button
            onClick={handleRefresh}
            className={`text-white/70 hover:text-[#A87CFF] transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        }
      />

      {/* 功能开发中 Badge */}
      <div className="flex justify-center pt-1 pb-2">
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
          <Zap size={11} className="text-[#A87CFF]" />
          <span className="text-[11px] text-white/50">功能开发中</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-6 no-scrollbar">

        {/* 已连接设备 */}
        <div>
          <h3 className="text-xs font-semibold text-[#9B859D] mb-3 px-1 uppercase tracking-[0.15em]">已连接设备</h3>
          <div className="bg-[#1A0E1E]/80 border border-[#A87CFF]/40 rounded-3xl p-5 shadow-[0_8px_30px_rgba(168,124,255,0.12)]">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#A87CFF]/20 flex items-center justify-center text-[#A87CFF] border border-[#A87CFF]/30">
                  <Bluetooth size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F9EDF5]">Luna AI 互动杯 Pro</h4>
                  <div className="flex items-center text-[10px] text-[#66E699] mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#66E699] mr-1.5 shadow-[0_0_6px_#66E699]" />
                    已连接
                  </div>
                </div>
              </div>
              <button
                onClick={() => showToast('已断开连接')}
                className="text-xs font-medium text-[#FF7DAF]/80 hover:text-[#FF7DAF] transition-colors"
              >
                断开连接
              </button>
            </div>

            {/* 电量 + 信号 */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              {[
                { label: '电量', value: 85, color: 'from-[#A87CFF] to-[#FF7DAF]' },
                { label: '信号', value: 95, color: 'from-[#A87CFF] to-[#80DFFF]' },
              ].map(({ label, value, color }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-[#9B859D]">
                    <span>{label}</span>
                    <span className="text-[#F9EDF5] font-bold">{value}%</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* 温度状态 */}
            <div
              onClick={!tempReady ? handlePreheat : undefined}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl border cursor-pointer transition-all active:scale-95 ${
                tempReady
                  ? 'bg-[#FF7DAF]/10 border-[#FF7DAF]/30'
                  : 'bg-white/5 border-white/10 hover:border-[#FF7DAF]/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Thermometer size={16} className={tempReady ? 'text-[#FF7DAF]' : 'text-white/40'} />
                <div>
                  <p className="text-xs font-semibold text-[#F9EDF5]">
                    {tempReady ? '38.5℃ 热机完成 · 可以开始了' : '肌肤恒温 · 点击预热'}
                  </p>
                  <p className="text-[10px] text-[#9B859D] mt-0.5">
                    {tempReady ? '内壁温度与体温完美贴合' : '建议开始前 3 分钟预热至 38.5℃'}
                  </p>
                </div>
              </div>
              {!tempReady && (
                <span className="text-[10px] text-[#FF7DAF] font-bold shrink-0">预热</span>
              )}
            </div>
          </div>
        </div>

        {/* 可用设备 */}
        <div>
          <h3 className="text-xs font-semibold text-[#9B859D] mb-3 px-1 uppercase tracking-[0.15em]">可用设备</h3>
          <div className="bg-[#1A0E1E]/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30">
                <Bluetooth size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F9EDF5]">Nova 智能陪伴环</h4>
                <div className="flex items-center text-[10px] text-[#9B859D] mt-0.5">
                  <Battery size={10} className="mr-1" />
                  100%
                </div>
              </div>
            </div>
            <button
              onClick={() => showToast('正在连接 Nova…')}
              className="bg-gradient-to-r from-[#A87CFF] to-[#7B59FF] text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg active:scale-95 transition-transform"
            >
              连接
            </button>
          </div>
        </div>

        {/* 硬件联动设置 */}
        <div>
          <h3 className="text-xs font-semibold text-[#9B859D] mb-3 px-1 uppercase tracking-[0.15em]">硬件联动设置</h3>
          <div className="bg-[#1A0E1E]/80 rounded-2xl border border-white/5 overflow-hidden">
            {[
              { key: 'autoConnect', label: '启动应用时自动连接设备' },
              { key: 'heating',     label: '开启智能恒温加热 (38℃)' },
              { key: 'aiSync',      label: '开启 AI 剧情随动震频' },
            ].map(({ key, label }, i, arr) => (
              <div key={key} className={`px-4 py-4 ${i < arr.length - 1 ? 'border-b border-white/5' : ''}`}>
                <Checkbox
                  checked={syncSettings[key]}
                  onChange={(v) => setSyncSettings(prev => ({ ...prev, [key]: v }))}
                  label={label}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 提示 */}
        <div className="bg-[#A87CFF]/8 border border-[#A87CFF]/15 p-4 rounded-2xl">
          <div className="flex items-start gap-2">
            <Waves size={13} className="text-[#A87CFF]/60 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed text-[#A87CFF]/70">
              提示：开启恒温加热会增加设备耗电，为获得最佳随动反馈体验，请保持手机与设备距离在 5 米以内。
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
