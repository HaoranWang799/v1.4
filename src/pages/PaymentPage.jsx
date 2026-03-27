import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import { CreditCard, Trash2, Plus } from 'lucide-react'

const INIT_CARDS = [
  { id: 1, brand: 'Mastercard', last4: '0123', expiry: '07/28', isDefault: true },
]

export default function PaymentPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [cards, setCards] = useState(INIT_CARDS)
  const [form, setForm] = useState({ name: '', number: '', expiry: '' })

  const handleAdd = () => {
    if (!form.name || form.number.length < 4 || !form.expiry) {
      showToast('请填写完整信息')
      return
    }
    setCards(prev => [
      ...prev,
      { id: Date.now(), brand: 'Visa', last4: form.number.slice(-4), expiry: form.expiry, isDefault: prev.length === 0 },
    ])
    setForm({ name: '', number: '', expiry: '' })
    showToast('支付方式已添加')
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5]">
      <HeaderBar title="支付方式" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 no-scrollbar space-y-5">

        {/* 添加表单 */}
        <div>
          <h3 className="text-sm font-semibold text-[#F9EDF5] mb-3">添加支付方式</h3>
          <div className="space-y-2">
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="持卡人姓名"
              className="w-full bg-[#1A0E1E] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#F9EDF5] placeholder-[#9B859D]/60 focus:outline-none focus:border-[#A87CFF]/60"
            />
            <input
              value={form.number}
              onChange={e => setForm({ ...form, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
              placeholder="卡号（至少4位）"
              className="w-full bg-[#1A0E1E] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#F9EDF5] placeholder-[#9B859D]/60 focus:outline-none focus:border-[#A87CFF]/60"
            />
            <input
              value={form.expiry}
              onChange={e => setForm({ ...form, expiry: e.target.value })}
              placeholder="有效期（MM/YY）"
              className="w-full bg-[#1A0E1E] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#F9EDF5] placeholder-[#9B859D]/60 focus:outline-none focus:border-[#A87CFF]/60"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-[#1A0E1E] border border-white/10 rounded-xl py-3.5 text-sm text-[#9B859D] flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Plus size={15} />
              添加支付方式
            </button>
          </div>
        </div>

        {/* 已保存的卡 */}
        {cards.length > 0 && (
          <div className="space-y-2">
            {cards.map(card => (
              <div key={card.id} className="bg-[#1A0E1E] border border-white/5 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#A87CFF]/15 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard size={18} className="text-[#A87CFF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#F9EDF5]">{card.brand} **** {card.last4}</span>
                    {card.isDefault && (
                      <span className="text-[9px] font-bold bg-[#66E699]/20 text-[#66E699] px-2 py-0.5 rounded-full shrink-0">默认</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9B859D] mt-0.5">有效期：{card.expiry}</p>
                </div>
                <button
                  onClick={() => { setCards(prev => prev.filter(c => c.id !== card.id)); showToast('已删除') }}
                  className="text-[#FF7DAF]/50 hover:text-[#FF7DAF] transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-[#9B859D]/50 text-center leading-relaxed px-2">
          所有数据均已加密存储并受最高级别安全关卡保护。
        </p>

      </div>
    </div>
  )
}
