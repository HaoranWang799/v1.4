import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import Switch from '../components/ui/Switch'
import { useApp } from '../context/AppContext'
import { EyeOff } from 'lucide-react'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [stealth, setStealth] = useState(false)

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar title="个人偏好设置" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-6 no-scrollbar">
        <div className="bg-[#1E1324] rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <EyeOff size={18} className="text-[#FF7DAF]" />
              <span className="text-sm font-medium">隐蔽伪装模式</span>
            </div>
            <Switch checked={stealth} onChange={setStealth} />
          </div>
          <p className="text-[10px] text-[#9B859D] mt-2">
            应用图标将伪装成系统天气，推送将隐藏敏感词汇。
          </p>
        </div>
      </div>
    </div>
  )
}
