import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import { useApp } from '../context/AppContext'
import {
  Crown, Settings, Shield, Flame, Headphones, Smartphone,
  CreditCard, ShoppingBag, Sparkles, ChevronRight, LogOut,
  Moon, Battery, Wifi, Gift,
} from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const menuSections = [
    {
      title: '尊贵特权',
      items: [
        { icon: Crown,    label: '私享订阅管理', value: '极乐版',  onClick: () => navigate('/subscription') },
        { icon: Settings, label: '个人偏好设置',                   onClick: () => navigate('/settings')     },
        { icon: Shield,   label: '私密与安全锁',                   onClick: () => navigate('/privacy')      },
      ],
    },
    {
      title: '专属私宠',
      items: [
        { icon: Flame,      label: '禁忌互动剧本', value: '3部',   onClick: () => navigate('/scripts')   },
        { icon: Headphones, label: '专属魅惑语音', value: '已激活', onClick: () => navigate('/ai-voice') },
      ],
    },
    {
      title: '感官互联',
      items: [
        { icon: Smartphone, label: '伴侣硬件调校', onClick: () => navigate('/devices') },
      ],
    },
    {
      title: '账单',
      items: [
        { icon: CreditCard, label: '私密支付方式', onClick: () => navigate('/payment') },
      ],
    },
    {
      title: '探索',
      items: [
        { icon: ShoppingBag, label: '升级实体私密伴侣', value: '全新发售', onClick: () => navigate('/hardware-store') },
        { icon: Sparkles,    label: '极乐使用指南',                          onClick: () => navigate('/help')          },
      ],
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto pb-8 no-scrollbar relative z-10">

      {/* 头像 */}
      <div className="px-6 pt-12 pb-6 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF7DAF] to-[#A87CFF] flex items-center justify-center text-xl font-bold text-white shadow-[0_0_25px_rgba(255,125,175,0.5)] border-2 border-[#0C060B] shrink-0">
          AR
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#F9EDF5] tracking-wide">Alex Rivera</h1>
          <p className="text-sm text-[#9B859D] flex items-center mt-0.5">
            <Moon size={12} className="mr-1 text-[#FF7DAF]" />
            深夜沉浸中
          </p>
        </div>
      </div>

      {/* 设备状态卡 */}
      <div className="px-4 mb-6">
        <div className="bg-[#1E1324]/80 backdrop-blur-md border border-[#FF7DAF]/15 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#FF7DAF]/10">
            <div className="flex items-center space-x-3 text-sm">
              <div className="p-2 bg-[#FF7DAF]/20 rounded-xl text-[#FF7DAF] shadow-[0_0_10px_rgba(255,125,175,0.2)]">
                <Flame size={18} />
              </div>
              <div>
                <div className="text-[#F9EDF5] font-semibold">已连接: Luna 沉浸伴侣</div>
                <div className="text-xs text-[#FF7DAF] mt-0.5 animate-pulse">状态: 极度敏感 (肌肤恒温中)</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#9B859D]" />
          </div>
          <div className="flex justify-between text-center px-2">
            <div>
              <div className="text-lg font-bold text-[#FF7DAF] mb-1">87%</div>
              <div className="text-xs text-[#9B859D] flex items-center justify-center">
                <Battery size={12} className="mr-1" />伴侣体力
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#80DFFF] mb-1 drop-shadow-[0_0_8px_rgba(128,223,255,0.5)]">极佳</div>
              <div className="text-xs text-[#9B859D] flex items-center justify-center">
                <Wifi size={12} className="mr-1" />感官连接
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-[#F9EDF5] mb-1">刚刚</div>
              <div className="text-xs text-[#9B859D]">高潮同步</div>
            </div>
          </div>
        </div>
      </div>

      {/* 邀请 Banner */}
      <div className="px-4 mb-6" onClick={() => showToast('邀请功能即将上线')}>
        <div className="bg-gradient-to-r from-[#291515] to-[#1A0B0E] border border-[#FFB03A]/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer active:scale-95 transition-transform shadow-[0_5px_25px_rgba(255,107,0,0.2)] relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-[#FFB03A]/10 to-transparent pointer-events-none" />
          <div className="flex items-center space-x-3 relative z-10">
            <div className="p-2.5 bg-gradient-to-br from-[#FFD700] to-[#FF6B00] rounded-xl text-white shadow-[0_0_15px_rgba(255,107,0,0.5)]">
              <Gift size={20} className="fill-current" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#F9EDF5] mb-0.5">
                邀密友同享，解锁<span className="text-[#FFD700]">极乐特权</span>
              </div>
              <div className="text-[10px] text-[#9B859D]">
                送TA <span className="text-[#FFD700]">7天体验</span>，您获 <span className="text-[#FFD700]">$50</span> 私密基金
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FF6B00] text-[#1A0A00] text-xs px-4 py-1.5 rounded-full font-extrabold shrink-0 relative z-10">
            去分享
          </div>
        </div>
      </div>

      {/* 菜单 */}
      <div className="px-4 space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-[#FF7DAF]/70 tracking-wider mb-2 px-2">
              {section.title}
            </h3>
            <div className="bg-[#1E1324]/80 backdrop-blur-md border border-[#FF7DAF]/10 rounded-2xl overflow-hidden shadow-lg">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  onClick={item.onClick ?? (() => showToast('刺激功能即将上线'))}
                  className={`flex items-center justify-between p-4 cursor-pointer active:bg-[#FF7DAF]/10 transition-colors ${
                    i !== section.items.length - 1 ? 'border-b border-[#FF7DAF]/5' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3 text-sm text-[#F9EDF5]">
                    <div className="text-[#FF7DAF]"><item.icon size={18} /></div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.value === '极乐版' && (
                      <span className="bg-gradient-to-r from-[#FF7DAF] to-[#A87CFF] text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-[0_0_8px_rgba(255,125,175,0.5)]">
                        极乐版
                      </span>
                    )}
                    {item.value === '全新发售' && (
                      <span className="bg-gradient-to-r from-[#FFD700] to-[#FF6B00] text-[10px] font-bold px-2 py-0.5 rounded-full text-[#1A0A00] animate-pulse">
                        {item.value}
                      </span>
                    )}
                    {item.value && item.value !== '极乐版' && item.value !== '全新发售' && (
                      <span className="text-[#FF7DAF]/80 text-sm font-medium">{item.value}</span>
                    )}
                    <ChevronRight size={16} className="text-[#9B859D]/50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 升级 Banner */}
      <div className="px-4 mt-8 mb-8">
        <div className="bg-[#1E1324] border border-[#FF7DAF]/20 rounded-2xl p-6 text-center relative overflow-hidden shadow-[0_10px_30px_rgba(255,125,175,0.2)]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF7DAF]/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#A87CFF]/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />
          <Sparkles size={28} className="text-[#FF7DAF] mx-auto mb-3 relative z-10" />
          <h3 className="text-[#F9EDF5] text-lg font-bold mb-1 relative z-10">解锁无尽欢愉</h3>
          <p className="text-xs text-[#9B859D] mb-5 relative z-10">沉浸极乐剧情与专属声优私密定制</p>
          <button
            onClick={() => navigate('/subscription')}
            className="w-full bg-gradient-to-r from-[#FF7DAF] to-[#A87CFF] text-white text-sm font-bold py-3.5 rounded-full active:scale-95 transition-transform shadow-[0_4px_20px_rgba(255,125,175,0.5)] relative z-10"
          >
            开启极乐体验
          </button>
        </div>
      </div>

      {/* 退出 */}
      <div className="px-4 pb-8">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full py-4 text-[#FF4D6D] text-sm font-bold border border-[#FF4D6D]/20 bg-[#FF4D6D]/5 rounded-2xl flex items-center justify-center space-x-2 active:bg-[#FF4D6D]/10 transition-colors"
        >
          <LogOut size={16} />
          <span>退出沉浸空间</span>
        </button>
        <div className="text-center mt-6 text-[#9B859D]/60 text-[10px] leading-relaxed">
          版本 2.5.0 · 绝对私密<br />
          您在深夜的所有探索，均已采用最高级别军工加密。
        </div>
      </div>

      <Modal
        isOpen={showLogoutModal}
        title="离开私密空间？"
        content="退出后将暂停与专属伴侣的感官互联，确定要回到现实吗？"
        confirmText="无情离开"
        cancelText="继续沉浸"
        isDanger={true}
        onConfirm={() => {
          setShowLogoutModal(false)
          showToast('已安全退出，期待您下次光临')
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  )
}
