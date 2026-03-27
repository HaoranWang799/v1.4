import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import { CreditCard, Trash2, Plus, Shield, Smartphone } from 'lucide-react'

const CARD_BRANDS = { visa: 'Visa', mc: 'Mastercard', apple: 'Apple Pay', google: 'Google Pay' }

const detectBrand = (num) => {
  if (num.startsWith('4')) return 'visa'
  if (num.startsWith('5')) return 'mc'
  return null
}

const CardLogo = ({ brand }) => {
  if (brand === 'visa') return (
    <span className="text-[9px] font-black tracking-widest text-[#1A1F71] bg-white rounded px-1 py-0.5">VISA</span>
  )
  if (brand === 'mc') return (
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-[#EB001B]" />
      <div className="w-4 h-4 rounded-full bg-[#F79E1B] -ml-2 opacity-90" />
    </div>
  )
  if (brand === 'apple') return <Smartphone size={15} className="text-white" />
  return <CreditCard size={16} className="text-[#A87CFF]" />
}

const INIT_CARDS = [
  { id: 1, brand: 'mc',    last4: '0123', expiry: '07/28', isDefault: true,  label: null },
  { id: 2, brand: 'visa',  last4: '8888', expiry: '12/26', isDefault: false, label: null },
  { id: 3, brand: 'apple', last4: null,   expiry: null,    isDefault: false, label: 'Apple Pay' },
]

export default function PaymentPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [cards, setCards] = useState(INIT_CARDS)
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [showForm, setShowForm] = useState(false)

  const detectedBrand = detectBrand(form.number)

  const handleAdd = () => {
    if (!form.name || form.number.length < 4 || !form.expiry || !form.cvv) {
      showToast('主人，信息未填完整呢 💔')
      return
    }
    setCards(prev => [
      ...prev,
      { id: Date.now(), brand: detectedBrand || 'visa', last4: form.number.slice(-4), expiry: form.expiry, isDefault: false, label: null },
    ])
    setForm({ name: '', number: '', expiry: '', cvv: '' })
    setShowForm(false)
    showToast('新的包养通道已绑定 💳✨')
  }

  const setDefault = (id) => {
    setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })))
    showToast('默认支付通道已更新')
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5]">
      <HeaderBar title="私密支付方式" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 no-scrollbar space-y-5">

        {/* 快捷支付 */}
        <div>
          <p className="text-xs font-bold text-[#9B859D] mb-3 tracking-widest">一键包养通道</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => showToast('Apple Pay 已准备好，包养随时到位 🍎')}
              className="bg-[#1C1C1E] border border-white/10 rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-[13px] font-semibold text-white">Apple Pay</span>
            </button>
            <button
              onClick={() => showToast('Google Pay 绑定成功，主人的每笔包养保密到位 🎯')}
              className="bg-[#1C1C1E] border border-white/10 rounded-2xl py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-[13px] font-semibold text-white">Google Pay</span>
            </button>
          </div>
          {/* USDT */}
          <button
            onClick={() => showToast('USDT 地址已复制，匿名包养到位 🔒')}
            className="mt-3 w-full bg-[#0D2A1F] border border-[#26A17B]/30 rounded-2xl py-4 flex items-center justify-center gap-2.5 active:scale-95 transition-transform"
          >
            <div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-black text-white">₮</span>
            </div>
            <span className="text-[13px] font-semibold text-[#26A17B]">USDT 匿名加密支付</span>
            <span className="text-[10px] text-[#26A17B]/60 ml-auto mr-1">TRC20 · ERC20</span>
          </button>
        </div>

        {/* 分割线 */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] text-[#9B859D]">或使用银行卡</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* 已保存的卡 */}
        <div>
          <p className="text-xs font-bold text-[#9B859D] mb-3 tracking-widest">已绑定的包养通道</p>
          <div className="space-y-2">
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => setDefault(card.id)}
                className={`bg-[#1A0E1E] border rounded-2xl px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer ${card.isDefault ? 'border-[#A87CFF]/40 shadow-[0_0_12px_rgba(168,124,255,0.1)]' : 'border-white/5'}`}
              >
                <div className="w-9 h-9 bg-[#A87CFF]/10 rounded-xl flex items-center justify-center shrink-0">
                  <CardLogo brand={card.brand} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#F9EDF5]">
                      {card.label || `${CARD_BRANDS[card.brand]} **** ${card.last4}`}
                    </span>
                    {card.isDefault && (
                      <span className="text-[9px] font-bold bg-[#A87CFF]/20 text-[#A87CFF] px-2 py-0.5 rounded-full shrink-0">默认</span>
                    )}
                  </div>
                  {card.expiry && <p className="text-[11px] text-[#9B859D] mt-0.5">有效期：{card.expiry}</p>}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setCards(prev => prev.filter(c => c.id !== card.id)); showToast('包养通道已解绑') }}
                  className="text-[#FF7DAF]/40 hover:text-[#FF7DAF] transition-colors p-1 shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 添加新卡 */}
        <div>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-[#1A0E1E] border border-dashed border-[#A87CFF]/30 rounded-2xl py-4 text-sm text-[#A87CFF]/70 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Plus size={15} />
              绑定新的包养通道
            </button>
          ) : (
            <div className="bg-[#1A0E1E] border border-white/10 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold text-[#9B859D] tracking-widest">添加银行卡</p>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="持卡人姓名"
                className="w-full bg-[#0A0509] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#F9EDF5] placeholder-[#9B859D]/50 focus:outline-none focus:border-[#A87CFF]/60"
              />
              <div className="relative">
                <input
                  value={form.number}
                  onChange={e => setForm({ ...form, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                  placeholder="卡号（支持 Visa · Mastercard）"
                  className="w-full bg-[#0A0509] border border-white/10 rounded-xl px-4 py-3.5 pr-16 text-sm text-[#F9EDF5] placeholder-[#9B859D]/50 focus:outline-none focus:border-[#A87CFF]/60"
                />
                {detectedBrand && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CardLogo brand={detectedBrand} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.expiry}
                  onChange={e => setForm({ ...form, expiry: e.target.value })}
                  placeholder="有效期 MM/YY"
                  className="w-full bg-[#0A0509] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#F9EDF5] placeholder-[#9B859D]/50 focus:outline-none focus:border-[#A87CFF]/60"
                />
                <input
                  value={form.cvv}
                  onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="CVV"
                  type="password"
                  className="w-full bg-[#0A0509] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-[#F9EDF5] placeholder-[#9B859D]/50 focus:outline-none focus:border-[#A87CFF]/60"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => { setShowForm(false); setForm({ name: '', number: '', expiry: '', cvv: '' }) }}
                  className="py-3.5 rounded-xl text-sm text-[#9B859D] bg-white/5 active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button
                  onClick={handleAdd}
                  className="py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#A87CFF] to-[#FF2A6D] active:scale-95 transition-transform"
                >
                  确认绑定
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 安全提示 */}
        <div className="flex items-start gap-2.5 bg-[#1A0E1E]/60 border border-white/5 rounded-2xl px-4 py-3.5">
          <Shield size={14} className="text-[#66E699] shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#9B859D] leading-relaxed">
            主人的每一笔包养行为均通过 256-bit 银行级加密通道保密传输，与她之间的一切绝对私密，永不外泄。
          </p>
        </div>

      </div>
    </div>
  )
}
