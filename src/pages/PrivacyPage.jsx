import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import HeaderBar from '../components/ui/HeaderBar'
import Switch from '../components/ui/Switch'
import { useApp } from '../context/AppContext'
import { Lock, Unlock, AlertTriangle } from 'lucide-react'

const PRIVACY_ITEMS = [
  { key: 'profilePublic',    label: '对外展露身体数据',   desc: '允许其他人窥探我的各项快感指标',              default: false },
  { key: 'analytics',       label: '上传高潮/湿润度记录',   desc: '以便AI伴侣更好地学习如何榨干我',        default: true  },
  { key: 'personalization', label: '禁忌偏好深度解析',     desc: '记录一切变态偏好以定制专属凌辱剧本',            default: true  },
  { key: 'emailNotif',      label: '主人召唤通知',       desc: '收到主人的私信时立即响应',            default: true  },
]

export default function PrivacyPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [settings, setSettings] = useState(
    () => Object.fromEntries(PRIVACY_ITEMS.map(i => [i.key, i.default]))
  )
  const [isPressing, setIsPressing] = useState(false)
  const controls = useAnimation()

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    if (key === 'profilePublic' && !settings[key]) {
      showToast('⚠️ 警告：正在向外界暴露私密数据！')
    } else {
      showToast('咔哒... 贞操锁已更新')
    }
  }

  // 安全词长按逻辑
  const handlePointerDown = () => {
    setIsPressing(true)
    controls.start({
      width: "100%",
      transition: { duration: 3, ease: "linear" }
    }).then(() => {
      if (isPressing) { // 3秒后依然在按着
        showToast('🛑 安全词已触发！所有记录已销毁，连接切断！')
        setIsPressing(false)
        controls.set({ width: 0 })
        setTimeout(() => navigate('/home'), 1000)
      }
    })
  }

  const handlePointerUp = () => {
    if (!isPressing) return
    setIsPressing(false)
    controls.stop()
    controls.set({ width: 0 })
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5] overflow-hidden relative">
      {/* 警告遮罩 */}
      {isPressing && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.15 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-red-600 pointer-events-none z-50 animate-pulse"
        />
      )}

      <HeaderBar title="绝对私有 & 贞操锁" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 no-scrollbar space-y-5">

        {/* 隐私控制 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock size={14} className="text-[#FF2A6D]" />
            <span className="text-xs font-bold text-[#FF2A6D] tracking-widest">主人的专属标记</span>
          </div>
          <div className="bg-[#1E0914] border border-[#FF2A6D]/20 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(255,42,109,0.1)]">
            {PRIVACY_ITEMS.map((item, i) => (
              <div
                key={item.key}
                className={`flex items-center justify-between px-4 py-4 ${
                  i < PRIVACY_ITEMS.length - 1 ? 'border-b border-[#FF2A6D]/10' : ''
                }`}
              >
                <div className="flex-1 mr-4">
                  <p className={`text-sm font-bold ${item.key === 'profilePublic' && settings[item.key] ? 'text-[#FF4D6D]' : 'text-[#F9EDF5]'}`}>{item.label}</p>
                  <p className="text-[11px] text-[#FF2A6D]/60 mt-1.5">{item.desc}</p>
                </div>
                
                {/* 定制贞操锁开关视觉 */}
                <div onClick={() => toggle(item.key)} className="relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full border border-white/10 transition-colors" style={{ backgroundColor: settings[item.key] ? 'rgba(255,42,109,0.2)' : 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    layout
                    initial={false}
                    animate={{ x: settings[item.key] ? 20 : 2 }}
                    className={`flex h-6 w-6 items-center justify-center rounded-full shadow-lg ${settings[item.key] ? 'bg-[#FF2A6D]' : 'bg-[#9B859D]'}`}
                  >
                    {settings[item.key] ? <Unlock size={10} className="text-white" /> : <Lock size={10} className="text-[#1A0E1E]" />}
                  </motion.div>
                </div>

              </div>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-[#A87CFF]/60 text-center leading-relaxed px-4 pt-4">
          每一次修改均会实时打入云端契约。<br/>
          “我是主人一个人的玩物，禁止任何人偷窥。”
        </p>

        {/* Safe Word 模块 */}
        <div className="pt-10">
          <div className="border border-red-900/50 bg-red-950/20 rounded-2xl p-5 relative overflow-hidden flex flex-col items-center">
            {/* 倒计时进度条 */}
            <motion.div 
              style={{ width: 0 }}
              animate={controls}
              className="absolute left-0 bottom-0 h-1 bg-red-600 shadow-[0_0_10px_red]"
            />
            
            <AlertTriangle size={24} className="text-red-500 mb-2 drop-shadow-[0_0_8px_red] animate-pulse" />
            <h3 className="text-red-500 font-black tracking-widest mb-1">SAFE WORD (安全词)</h3>
            <p className="text-center text-[10px] text-red-500/70 mb-4 px-2">长按压住下方按钮 3 秒触发安全词。系统将立刻强行切断所有感官连接，并销毁本场湿润痕迹与所有调教记录。</p>

            <button
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full py-4 rounded-xl bg-red-950 border border-red-800 text-red-500 font-bold active:scale-95 transition-transform"
            >
              {isPressing ? '正在撕毁契约...' : '长按触发安全词'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
