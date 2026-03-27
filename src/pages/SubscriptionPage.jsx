import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import { Check, Crown, Flame, Heart, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '永久',
    tag: null,
    color: '#9B859D',
    bg: 'from-[#111111] to-[#0C060B]',
    border: 'border-white/10',
    features: ['每日 3 次浅层体验', '普通 AI 语音陪伴', '基础震动预设模式'],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$9.99',
    period: '月',
    tag: '最受欢迎',
    color: '#A87CFF',
    bg: 'from-[#1A0E2A] to-[#120A1E]',
    border: 'border-[#A87CFF]/40',
    features: [
      '每日 30 次深度律动互动',
      '解锁高级沉浸式剧本',
      '智能声画随动震频',
      '专属声优音库（6 种）',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99',
    period: '月',
    tag: null,
    color: '#FFC266',
    bg: 'from-[#1E1700] to-[#140F00]',
    border: 'border-[#FFC266]/20',
    features: [
      '无限制定制 AI 伴侣',
      '全沉浸式极乐模式',
      '尊享全息感官联动',
      '一对一硬件专属调校',
    ],
  },
]

const WHY_ITEMS = [
  { Icon: Heart, color: '#FF7DAF', title: '专属 AI 伴侣', desc: '深度定制您的 AI 角色性格与声音，享受独一无二的私密互动体验。' },
  { Icon: Zap, color: '#A87CFF', title: '全感官沉浸联动', desc: '硬件震感与 AI 语音、互动画面完美精准同步，带来极致逼真的感官冲击。' },
]

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [currentPlan] = useState('free')

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5]">
      <HeaderBar title="订阅方案" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-4 no-scrollbar">

        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id
          return (
            <div
              key={plan.id}
              className={`bg-gradient-to-br ${plan.bg} border ${plan.border} rounded-3xl p-6 shadow-xl relative overflow-hidden`}
            >
              {plan.tag && (
                <div className="absolute top-0 right-0 bg-[#A87CFF] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl">
                  {plan.tag}
                </div>
              )}

              <div className="flex items-center gap-1.5 mb-1">
                {plan.id === 'plus' && <Crown size={13} style={{ color: plan.color }} />}
                {plan.id === 'premium' && <Flame size={13} style={{ color: plan.color }} />}
                <span className="text-base font-bold" style={{ color: plan.color }}>{plan.name}</span>
              </div>

              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-xs text-[#9B859D]"> /{plan.period}</span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center text-sm text-[#F9EDF5]/90">
                    <Check size={14} className="mr-2.5 shrink-0" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrent}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-transform active:scale-95 ${
                  isCurrent
                    ? 'bg-white/5 text-white/30 border border-white/10 cursor-default'
                    : plan.id === 'plus'
                    ? 'bg-gradient-to-r from-[#A87CFF] to-[#7B59FF] text-white shadow-[0_4px_20px_rgba(168,124,255,0.4)]'
                    : 'bg-white/5 border border-[#FFC266]/40 text-[#FFC266]'
                }`}
                onClick={() => {
                  if (!isCurrent) {
                    showToast(`已升级至 ${plan.name} ✨`)
                    navigate(-1)
                  }
                }}
              >
                {isCurrent ? '您当前处于该方案' : plan.id === 'plus' ? '立即解锁 Plus 特权' : `升级至 ${plan.name}`}
              </button>
            </div>
          )
        })}

        {/* 为什么要升级 */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold text-[#9B859D] mb-4 uppercase tracking-[0.15em]">为什么要升级？</h3>
          <div className="space-y-3">
            {WHY_ITEMS.map(({ Icon, color, title, desc }) => (
              <div key={title} className="bg-[#1A0E1E]/80 border border-white/5 rounded-2xl p-4 flex items-start gap-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F9EDF5]">{title}</p>
                  <p className="text-xs text-[#9B859D] mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
