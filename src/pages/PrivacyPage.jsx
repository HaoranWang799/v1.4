import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import Switch from '../components/ui/Switch'
import { useApp } from '../context/AppContext'
import { Lock } from 'lucide-react'

const PRIVACY_ITEMS = [
  { key: 'profilePublic',    label: '公开个人资料',   desc: '允许其他用户通过邮箱搜索到您',              default: false },
  { key: 'analytics',       label: '使用分析数据',   desc: '匿名分享使用数据以帮助我们改进应用',        default: true  },
  { key: 'personalization', label: '个性化推荐',     desc: '基于您的使用习惯推荐内容和场景',            default: true  },
  { key: 'emailNotif',      label: '邮件通知',       desc: '接收关于更新、活动和订阅的邮件',            default: true  },
]

export default function PrivacyPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [settings, setSettings] = useState(
    () => Object.fromEntries(PRIVACY_ITEMS.map(i => [i.key, i.default]))
  )

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    showToast('已保存')
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5]">
      <HeaderBar title="隐私与安全" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 no-scrollbar space-y-5">

        {/* 隐私控制 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lock size={13} className="text-[#FF7DAF]" />
            <span className="text-xs font-semibold text-[#FF7DAF]">隐私控制</span>
          </div>
          <div className="bg-[#1A0E1E] border border-white/5 rounded-2xl overflow-hidden">
            {PRIVACY_ITEMS.map((item, i) => (
              <div
                key={item.key}
                className={`flex items-center justify-between px-4 py-4 ${
                  i < PRIVACY_ITEMS.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="flex-1 mr-4">
                  <p className="text-sm font-medium text-[#F9EDF5]">{item.label}</p>
                  <p className="text-[11px] text-[#9B859D] mt-0.5">{item.desc}</p>
                </div>
                <Switch checked={settings[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[#9B859D]/60 text-center leading-relaxed px-4">
          修改后会自动保存到本地及云端，立即生效。您可以随时在此撤销相关授权。
        </p>

      </div>
    </div>
  )
}
