import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import { ShieldCheck, Hexagon, CreditCard, ChevronRight } from 'lucide-react'

export default function PaymentPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar title="私密支付方式" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 no-scrollbar space-y-6">
        <div className="bg-gradient-to-r from-[#1E1324] to-[#0C060B] border border-[#66E699]/30 rounded-2xl p-4 flex items-start space-x-3 shadow-md">
          <ShieldCheck className="text-[#66E699] shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-bold text-[#F9EDF5]">绝对隐秘账单承诺</h4>
            <p className="text-[10px] text-[#9B859D] mt-1">
              账单仅显示商业服务名称 (Tech-Solution)，无任何应用标识。
            </p>
          </div>
        </div>

        <div className="bg-[#1E1324] rounded-2xl p-5 border border-white/5 space-y-4 shadow-lg">
          <div
            className="flex items-center justify-between text-sm cursor-pointer border-b border-white/5 pb-4"
            onClick={() => showToast('加密货币支付已唤起')}
          >
            <div className="flex items-center space-x-3">
              <Hexagon size={18} className="text-[#A87CFF]" />
              <span>加密货币 (USDT/ETH)</span>
            </div>
            <ChevronRight size={16} className="text-[#9B859D]" />
          </div>
          <div
            className="flex items-center justify-between text-sm cursor-pointer"
            onClick={() => showToast('信用卡绑定安全模组载入中')}
          >
            <div className="flex items-center space-x-3">
              <CreditCard size={18} className="text-[#FF7DAF]" />
              <span>绑定隐秘信用卡</span>
            </div>
            <ChevronRight size={16} className="text-[#9B859D]" />
          </div>
        </div>
      </div>
    </div>
  )
}
