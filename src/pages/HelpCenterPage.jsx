import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import {
  ChevronRight, ChevronDown, MessageCircleHeart, Search, Sparkles,
} from 'lucide-react'
import {
  HELP_CATEGORIES as CATEGORIES,
  HELP_ARTICLES as ARTICLES_DATA,
  HELP_FAQS as FAQS,
} from '../data/helpData'

export default function HelpCenterPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [openArticle, setOpenArticle] = useState(null)

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar
        title={activeCategory ? '极乐秘籍' : '帮助中心'}
        onBack={() => (activeCategory ? setActiveCategory(null) : navigate(-1))}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-10 no-scrollbar">
        {!activeCategory ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* 管家入口 */}
            <div
              className="bg-gradient-to-r from-[#1E1324] to-[#150C19] border border-[#FF7DAF]/20 rounded-2xl p-4 flex items-center justify-between mb-6 shadow-lg cursor-pointer active:scale-95 transition-transform"
              onClick={() => navigate('/chat')}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#FF7DAF]/20 rounded-xl text-[#FF7DAF]">
                  <MessageCircleHeart size={20} className="fill-current" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#F9EDF5]">专属私密管家</div>
                  <div className="text-[10px] text-[#9B859D]">7×24h 随时解答您的感官难题</div>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#9B859D]" />
            </div>

            {/* 搜索 */}
            <div className="relative mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B859D]" />
              <input
                type="text"
                placeholder="搜索帮助内容..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1E1324] border border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm text-[#F9EDF5] focus:border-[#FF7DAF]/50 outline-none transition-all"
              />
            </div>

            {/* 分类网格 */}
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-[#9B859D] mb-4 px-1 uppercase tracking-widest">
                按类别浏览
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map((cat, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1E1324] border border-white/5 rounded-2xl p-5 cursor-pointer active:scale-95 transition-all hover:border-[#FF7DAF]/30"
                    onClick={() => { setActiveCategory(cat.label); setOpenArticle(null) }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                      style={{ backgroundColor: cat.bg, color: cat.color }}
                    >
                      <cat.icon size={20} />
                    </div>
                    <div className="text-sm font-bold text-[#F9EDF5] mb-1">{cat.label}</div>
                    <div className="text-[10px] text-[#9B859D]">{cat.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="text-xs font-semibold text-[#9B859D] mb-4 px-1 uppercase tracking-widest">
                常见问题
              </h3>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="bg-[#1E1324] border border-white/5 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left active:bg-white/5 transition-colors"
                    >
                      <span className={`text-sm font-medium pr-4 ${openFaq === idx ? 'text-[#FF7DAF]' : 'text-[#F9EDF5]'}`}>
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[#9B859D] transition-transform shrink-0 ${openFaq === idx ? 'rotate-180 text-[#FF7DAF]' : ''}`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4 pt-1 text-xs text-[#9B859D] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 文章列表 */
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-2 mb-6 mt-2">
              <Sparkles size={18} className="text-[#FF7DAF]" />
              <h2 className="text-lg font-bold text-[#F9EDF5]">{activeCategory}</h2>
            </div>
            <div className="space-y-4">
              {(ARTICLES_DATA[activeCategory] ?? []).map((article, idx) => (
                <div key={idx} className="bg-[#1E1324] border border-white/5 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenArticle(openArticle === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left active:bg-white/5 transition-colors"
                  >
                    <span className={`text-sm font-semibold pr-4 ${openArticle === idx ? 'text-[#FF7DAF]' : 'text-[#F9EDF5]'}`}>
                      {article.title}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#9B859D] transition-transform shrink-0 ${openArticle === idx ? 'rotate-180 text-[#FF7DAF]' : ''}`}
                    />
                  </button>
                  {openArticle === idx && (
                    <div className="px-4 pb-5 pt-2 text-xs text-[#9B859D] leading-relaxed border-t border-white/5 bg-black/10">
                      {article.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveCategory(null)}
              className="w-full mt-10 py-3 text-sm font-medium text-[#9B859D] border border-white/10 rounded-xl active:scale-95 transition-transform"
            >
              返回全部分类
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
