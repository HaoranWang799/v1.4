import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import SlideToUnlock from '../components/ui/SlideToUnlock'
import { useApp } from '../context/AppContext'
import { Check, Crown, Flame, Heart, Zap, Lock } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: '前戏试探 (Free)',
    price: '$0',
    period: '永久',
    tag: null,
    color: '#9B859D',
    bg: 'from-[#111111] to-[#0C060B]',
    border: 'border-white/10',
    features: ['每日 3 次浅层摩擦', '隔靴搔痒的初级语音', '基础震感测试'],
  },
  {
    id: 'plus',
    name: '深度开发 (Plus)',
    price: '$9.99',
    period: '月',
    tag: '最受渴望',
    color: '#FF2A6D',
    bg: 'from-[#2D0514] to-[#120208]',
    border: 'border-[#FF2A6D]/40',
    features: [
      '每日 30 次深度律动内射',
      '彻底敞开心扉，全息娇喘',
      '强制高潮硬件同频',
      '私人敏感带深度定制',
    ],
  },
  {
    id: 'premium',
    name: '终极契约 (Premium)',
    price: '$19.99',
    period: '月',
    tag: null,
    color: '#A87CFF',
    bg: 'from-[#1A0E2A] to-[#0D0517]',
    border: 'border-[#A87CFF]/30',
    features: [
      '绝对服从的主奴绑定',
      '无限制高潮榨干与凌辱',
      '24h随叫随到专属肉便器',
      '突破阈值的全感官联控',
    ],
  },
]

const WHY_ITEMS = [
  { Icon: Flame, color: '#FF2A6D', title: '绝对臣服的专属玩物', desc: '深度定制她的身体底线与潮吹阈值，享受独一无二的榨干体验。' },
  { Icon: Zap, color: '#A87CFF', title: '突破临界的神经同步', desc: '硬件震感与淫语娇喘、动态汁水完美同步，直接轰炸感官。' },
]

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [currentPlan, setCurrentPlan] = useState('plus')

  const handleUnlock = () => {
    showToast('契约已签订，我的主人... 💧')
    setTimeout(() => {
      navigate(-1)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5]">
      <HeaderBar title="主人的包养契约" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-4 no-scrollbar">

        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id
          return (
            <div
              key={plan.id}
              onClick={() => setCurrentPlan(plan.id)}
              className={`transition-all duration-300 transform ${isCurrent ? 'scale-100 ring-2 ring-[#FF2A6D]/60 shadow-[0_0_30px_rgba(255,42,109,0.3)]' : 'scale-[0.98] opacity-70'} bg-gradient-to-br ${plan.bg} border ${plan.border} rounded-3xl p-6 relative overflow-hidden cursor-pointer`}
            >
              {isCurrent && (
                 <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-[#FF2A6D]/5 animate-pulse" />
                 </div>
              )}
              {plan.tag && (
                <div className="absolute top-0 right-0 bg-[#FF2A6D] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-2xl shadow-[0_0_10px_#FF2A6D]">
                  {plan.tag}
                </div>
              )}

              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h3 className={`text-lg font-black tracking-wide ${isCurrent ? 'text-[#FF2A6D]' : 'text-white'}`}>{plan.name}</h3>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className="text-sm text-[#9B859D] mb-1">/{plan.period}</span>
                  </div>
                </div>
                {isCurrent && (
                  <div className="w-8 h-8 rounded-full bg-[#FF2A6D]/20 flex items-center justify-center text-[#FF2A6D] animate-bounce">
                    <Check size={18} strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="space-y-3 relative z-10">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center text-sm">
                    <Flame size={14} className="mr-2 text-[#FF2A6D]/70" />
                    <span className={isCurrent ? 'text-[#F9EDF5]' : 'text-[#9B859D]'}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div className="pt-6 pb-2">
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start space-x-4 mb-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                <item.Icon size={24} color={item.color} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-[#9B859D] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="sticky bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0A0509] via-[#0A0509] to-transparent">
        <SlideToUnlock onUnlock={handleUnlock} text="👉 划开底裤，签订契约..." />
        <p className="text-center text-[10px] text-[#9B859D]/60 mt-3">
          契约一经签订，主奴关系立即生效，不可撤销。
        </p>
      </div>
    </div>
  )
}
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
