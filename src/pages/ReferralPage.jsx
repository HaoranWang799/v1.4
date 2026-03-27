import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import { Gift, Copy, Share2, Check } from 'lucide-react'

const REFERRAL_CODE = 'LUNA2024'
const REFERRAL_LINK = 'https://app.luna.com/ref/LUNA2024'

const RECENT_INVITES = [
  { name: 'Emma W.', time: '2天前',   reward: '$50', status: '已到账', statusColor: 'text-[#66E699]' },
  { name: 'Chris Z.', time: '5天前',  reward: '$50', status: '已到账', statusColor: 'text-[#66E699]' },
  { name: 'Alex K.',  time: '1周前',  reward: '$50', status: '处理中', statusColor: 'text-[#FFC266]' },
]

const RULES = [
  '好友通过您的邀请码或链接注册并完成首次订阅',
  '您将获得 $50 账户余额，可用于订阅或购买',
  '邀请人数无上限，邀请越多奖励越多',
  '奖励将在好友成功订阅后 24 小时内发放',
]

export default function ReferralPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const copy = (text, type) => {
    navigator.clipboard.writeText(text).catch(() => {})
    if (type === 'code') {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } else {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
    showToast('已复制到剪贴板')
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0A0509] text-[#F9EDF5]">
      <HeaderBar title="邀请好友" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">

        {/* 英雄卡片 */}
        <div className="mx-4 mt-2 bg-gradient-to-br from-[#6B2FD9] to-[#8B1CF5] rounded-3xl p-6 shadow-[0_8px_40px_rgba(107,47,217,0.5)]">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Gift size={24} className="text-white" />
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">邀请好友，赚取奖励</h2>
            <p className="text-sm text-white/70 mt-1">每成功邀请一位好友注册并开通订阅</p>

            <div className="bg-white/15 rounded-2xl px-8 py-4 mt-5 w-full">
              <p className="text-xs text-white/60 mb-1">您将获得</p>
              <p className="text-4xl font-black text-white">$50</p>
              <p className="text-[11px] text-white/50 mt-1">每次成功邀请的奖励</p>
            </div>

            <p className="text-xs text-[#FFC266] mt-4">
              ☆ 邀请满 10 人，额外获得 1 个月 Plus 会员
            </p>
          </div>
        </div>

        {/* 统计 */}
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
