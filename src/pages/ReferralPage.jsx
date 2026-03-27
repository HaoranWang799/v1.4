import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import { Gift, Droplet, Users } from 'lucide-react'

const REFERRAL_CODE = 'LUNA2024'
const REFERRAL_LINK = 'https://app.luna.com/ref/LUNA2024'

const RECENT_INVITES = [
  { name: 'Emma W.', time: '2天前',   reward: '$50', status: '已入局', statusColor: 'text-[#FF2A6D]' },
  { name: 'Chris Z.', time: '5天前',  reward: '$50', status: '已入局', statusColor: 'text-[#FF2A6D]' },
  { name: 'Alex K.',  time: '1周前',  reward: '$50', status: '调教中', statusColor: 'text-[#A87CFF]' },
]

const RULES = [
  '成功引诱一位新主人入局并完成首次契约签订',
  '您将获得 $50 【私密包养金】，可直接用于高潮解锁',
  '没有人数上限，引诱越多快感越强',
  '满足10人即可解锁隐藏【多人乱交】终极剧本',
]

export default function ReferralPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [copiedCode, setCopiedCode] = useState(false)
  
  // 模拟进度
  const invitedCount = 4
  const targetCount = 10
  const progressPercent = (invitedCount / targetCount) * 100

  const copy = (text, type) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
    // 娇喘弹窗
    showToast('💦 啊... 主人的专属引诱码已沾满体液复制成功~', 'liquid')
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5]">
      <HeaderBar title="引诱与同享" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">

        {/* 英雄卡片 */}
        <div className="mx-4 mt-2 relative rounded-3xl overflow-hidden bg-[#1E0914] border border-[#FF2A6D]/30 shadow-[0_8px_40px_rgba(255,42,109,0.2)]">
          {/* 背景动画特效 */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF2A6D]/30 rounded-full blur-3xl pointer-events-none" 
          />

          <div className="relative z-10 p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-[#FF2A6D]/20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_#FF2A6D]">
              <Droplet size={28} className="text-[#FF2A6D] fill-current animate-pulse" />
            </div>
            <h2 className="text-xl font-black text-[#F9EDF5] tracking-widest drop-shadow-[0_0_5px_#FF2A6D]">极乐引诱计划</h2>
            <p className="text-sm text-[#FF2A6D]/80 mt-2 font-medium">每成功拖延一位新主子堕入深渊</p>

            <div className="bg-[#0C060B]/80 backdrop-blur-sm rounded-2xl px-8 py-5 mt-6 w-full border border-[#FF2A6D]/20">
              <p className="text-xs text-[#9B859D] mb-1">即可获得私密包养金</p>
              <p className="text-5xl font-black text-[#FF2A6D] drop-shadow-[0_0_15px_rgba(255,42,109,0.5)]">$50</p>
            </div>
          </div>
        </div>

        {/* 欲望蓄水槽 */}
        <div className="mx-4 mt-6">
          <div className="flex justify-between items-end mb-2 px-1">
            <span className="text-xs font-bold text-[#FF2A6D]">强制高潮解锁进度</span>
            <span className="text-[10px] text-[#9B859D]"><span className="text-[#FF2A6D] font-bold text-sm">{invitedCount}</span> / {targetCount} 人</span>
          </div>
          <div className="relative h-6 bg-[#1A0E1E] rounded-full border border-white/5 overflow-hidden">
            {/* 动态水波纹进度条 */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#A87CFF] to-[#FF2A6D] rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-20" />
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </motion.div>
          </div>
          <p className="text-[10px] text-[#A87CFF] mt-2 text-center">水槽满溢时，立即解锁【极乐群P】限时禁忌剧本 💧</p>
        </div>
        <div className="mx-4 mt-4 bg-[#1A0E1E] border border-white/5 rounded-2xl px-5 py-4 grid grid-cols-3 divide-x divide-white/5">
          {[
            { label: '已邀请好友',  value: '12',     color: 'text-white' },
            { label: '获得奖励',    value: '$600',   color: 'text-[#66E699]' },
            { label: '待领取',      value: '$150',   color: 'text-[#FFC266]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center px-3">
              <span className={`text-xl font-black ${color}`}>{value}</span>
              <span className="text-[10px] text-[#9B859D] mt-0.5">{label}</span>
            </div>
          ))}
        </div>

        {/* 专属邀请码 */}
        <div className="mx-4 mt-4 bg-[#1A0E1E] border border-white/5 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Gift size={13} className="text-[#A87CFF]" />
            <span className="text-xs font-semibold text-[#A87CFF]">您的专属邀请码</span>
          </div>

          <div>
            <p className="text-[10px] text-[#9B859D] mb-1.5">邀请码</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#0A0509] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white tracking-widest">
                {REFERRAL_CODE}
              </div>
              <button
                onClick={() => copy(REFERRAL_CODE, 'code')}
                className="w-10 h-10 bg-[#A87CFF]/15 border border-[#A87CFF]/30 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-transform"
              >
                {copiedCode ? <Check size={16} className="text-[#66E699]" /> : <Copy size={16} className="text-[#A87CFF]" />}
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#9B859D] mb-1.5">邀请链接</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#0A0509] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#9B859D] truncate">
                {REFERRAL_LINK}
              </div>
              <button
                onClick={() => copy(REFERRAL_LINK, 'link')}
                className="w-10 h-10 bg-[#A87CFF]/15 border border-[#A87CFF]/30 rounded-xl flex items-center justify-center shrink-0 active:scale-90 transition-transform"
              >
                {copiedLink ? <Check size={16} className="text-[#66E699]" /> : <Copy size={16} className="text-[#A87CFF]" />}
              </button>
            </div>
          </div>
        </div>

        {/* 活动规则 */}
        <div className="mx-4 mt-4 bg-[#1A0E1E] border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#F9EDF5] mb-3">活动规则</h3>
          <ul className="space-y-2">
            {RULES.map((rule, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[#9B859D] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A87CFF]/60 mt-1.5 shrink-0" />
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* 最近邀请 */}
        <div className="mx-4 mt-4 bg-[#1A0E1E] border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#F9EDF5] mb-3">最近邀请</h3>
          <div className="space-y-3">
            {RECENT_INVITES.map((inv) => (
              <div key={inv.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#F9EDF5]">{inv.name}</p>
                  <p className="text-[11px] text-[#9B859D] mt-0.5">{inv.time}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold text-[#66E699]`}>{inv.reward}</p>
                  <p className={`text-[11px] mt-0.5 ${inv.statusColor}`}>{inv.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 底部固定按钮 */}
      <div className="shrink-0 px-4 py-4 bg-gradient-to-t from-[#0A0509] via-[#0A0509]/95 to-transparent">
        <button
          onClick={() => showToast('已唤起系统分享')}
          className="w-full bg-gradient-to-r from-[#8B1CF5] to-[#A87CFF] text-white py-4 rounded-2xl text-sm font-bold shadow-[0_4px_24px_rgba(139,28,245,0.5)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Share2 size={16} />
          一键分享好友
        </button>
      </div>
    </div>
  )
}
