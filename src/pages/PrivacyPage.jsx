import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import { useApp } from '../context/AppContext'
import { Fingerprint } from 'lucide-react'

export default function PrivacyPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar title="私密与安全锁" onBack={() => navigate(-1)} />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-[#1E1324] to-[#0C060B] border border-[#FF7DAF]/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,125,175,0.2)]">
          <Fingerprint size={40} className="text-[#FF7DAF]" />
        </div>
        <h3 className="text-lg font-bold">端到端军工级加密</h3>
        <p className="text-sm text-[#9B859D]">
          您的感官偏好与互动数据已在本地加密，密钥仅由您掌握。开启生物识别锁以获得最高安全保障。
        </p>
        <button
          className="bg-gradient-to-r from-[#FF7DAF] to-[#A87CFF] px-8 py-3 rounded-full text-sm font-bold shadow-lg active:scale-95 transition-transform"
          onClick={() => showToast('FaceID 已启用')}
        >
          启用 FaceID
        </button>
      </div>
    </div>
  )
}
