import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ArrowLeft, Send } from 'lucide-react'

export default function ChatPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#FF7DAF]/20 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 text-[#9B859D]">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-base font-bold text-[#F9EDF5]">Luna 专属管家</h1>
        <div className="w-10" />
      </div>

      {/* 消息区 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <div className="flex items-end space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7DAF] to-[#A87CFF] flex items-center justify-center text-xs text-white shrink-0">
            L
          </div>
          <div className="bg-[#1E1324] text-sm p-3 rounded-2xl text-[#F9EDF5] max-w-[80%] leading-relaxed">
            主人，今晚需要我为您做些什么？关于 Luna 的使用疑问我都能为您解答。
          </div>
        </div>
      </div>

      {/* 输入栏 */}
      <div className="shrink-0 p-4 bg-[#0C060B]">
        <div className="flex bg-[#1E1324] rounded-full p-2 pl-4 items-center">
          <input
            type="text"
            placeholder="发送指令..."
            className="flex-1 bg-transparent outline-none text-sm text-[#F9EDF5] placeholder:text-[#9B859D]"
          />
          <button
            onClick={() => showToast('消息已发送')}
            className="bg-[#FF7DAF] p-2 rounded-full text-white active:scale-90 transition-transform"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
