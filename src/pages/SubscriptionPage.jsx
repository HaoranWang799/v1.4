import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import { SUBSCRIPTION_PLANS as PLANS } from '../data/subscriptionPlans'
import { Check } from 'lucide-react'

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar title="私享订阅管理" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-6 no-scrollbar">
        {PLANS.map((plan, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${plan.bg} border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden`}
          >
            {plan.hot && (
              <div className="absolute top-0 right-0 bg-[#FFC266] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                最受欢迎
              </div>
            )}
            <h3 className="text-xl font-bold mb-1" style={{ color: plan.color }}>
              {plan.name}
            </h3>
            <div className="text-3xl font-bold text-white mb-6">
              {plan.price}{' '}
              <span className="text-xs text-[#9B859D] font-normal">/ 月</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center text-xs text-[#F9EDF5]">
                  <Check size={14} className="mr-2 shrink-0" style={{ color: plan.color }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="w-full py-4 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform"
              style={{ backgroundColor: plan.color, color: plan.labelColor }}
              onClick={() => {
                showToast(`成功升级至 ${plan.name}`)
                navigate(-1)
              }}
            >
              开启极乐
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
