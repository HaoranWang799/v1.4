import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderBar from '../components/ui/HeaderBar'
import Switch from '../components/ui/Switch'
import { useApp } from '../context/AppContext'
import { EyeOff, Shield, MessageSquare, Flame, Zap, Bluetooth, Lock, Bell, Camera, Heart, Moon, Mic } from 'lucide-react'

const SectionTitle = ({ icon: Icon, color, label }) => (
  <div className="flex items-center gap-2 px-1 mb-2">
    <Icon size={13} className={color} />
    <span className={`text-xs font-bold ${color} tracking-widest uppercase`}>{label}</span>
  </div>
)

const ToggleRow = ({ icon: Icon, iconColor, title, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
    <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
      <Icon size={16} className={`${iconColor} shrink-0 mt-0.5`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#F9EDF5]">{title}</p>
        {desc && <p className="text-[10px] text-[#9B859D] mt-0.5 leading-relaxed">{desc}</p>}
      </div>
    </div>
    <Switch checked={checked} onChange={onChange} />
  </div>
)

const SelectRow = ({ icon: Icon, iconColor, title, desc, options, value, onChange }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
    <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
      <Icon size={16} className={`${iconColor} shrink-0 mt-0.5`} />
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#F9EDF5]">{title}</p>
        {desc && <p className="text-[10px] text-[#9B859D] mt-0.5 leading-relaxed">{desc}</p>}
      </div>
    </div>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#2A1830] text-[#F9EDF5] text-xs border border-white/10 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#A87CFF]/50 max-w-[110px] shrink-0"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

export default function SettingsPage() {
  const navigate = useNavigate()
  const { showToast } = useApp()

  // 隐游防护
  const [stealth, setStealth] = useState(false)
  const [pushFilter, setPushFilter] = useState(true)
  const [screenshotBlock, setScreenshotBlock] = useState(false)

  // 互动偏好
  const [aiTone, setAiTone] = useState('soft')
  const [aiLang, setAiLang] = useState('zh')
  const [moaning, setMoaning] = useState(true)
  const [proactive, setProactive] = useState(false)
  const [lateNight, setLateNight] = useState(false)
  const [callName, setCallName] = useState('dom')

  // 设备与震感
  const [vibPreset, setVibPreset] = useState('wild')
  const [autoConnect, setAutoConnect] = useState(true)
  const [orgasmAlert, setOrgasmAlert] = useState(true)
  const [vibMemory, setVibMemory] = useState(true)
  const [syncBreath, setSyncBreath] = useState(false)

  // 账号安全
  const [bioUnlock, setBioUnlock] = useState(false)
  const [loginAlert, setLoginAlert] = useState(true)
  const [autoLogout, setAutoLogout] = useState(false)
  const [dataEncrypt, setDataEncrypt] = useState(true)

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0C060B] text-[#F9EDF5]">
      <HeaderBar title="个人偏好设置" onBack={() => navigate(-1)} />
      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-5 no-scrollbar">

        {/* ── 隐游防护 ── */}
        <div>
          <SectionTitle icon={EyeOff} color="text-[#FF7DAF]" label="隐游防护" />
          <div className="bg-[#1E1324] rounded-2xl px-4 border border-white/5">
            <ToggleRow
              icon={EyeOff} iconColor="text-[#FF7DAF]"
              title="隐蔽伪装模式"
              desc="APP图标化身系统天气，推送完美隐藏骚扰敏感词"
              checked={stealth} onChange={setStealth}
            />
            <ToggleRow
              icon={Shield} iconColor="text-[#FF7DAF]"
              title="推送内容脱敏"
              desc={'通知栏只显示「新消息」，不暴露任何骚话内容'}
              checked={pushFilter} onChange={setPushFilter}
            />
            <ToggleRow
              icon={Camera} iconColor="text-[#FF7DAF]"
              title="截图拦截防护"
              desc="禁止任何应用截取你们的秘密对话，绝对私密"
              checked={screenshotBlock}
              onChange={v => { setScreenshotBlock(v); if (v) showToast('截图防护已开启 🔐') }}
            />
          </div>
        </div>

        {/* ── 互动偏好 ── */}
        <div>
          <SectionTitle icon={Flame} color="text-[#FF2A6D]" label="互动偏好" />
          <div className="bg-[#1E1324] rounded-2xl px-4 border border-white/5">
            <SelectRow
              icon={Heart} iconColor="text-[#FF2A6D]"
              title="AI语气风格"
              desc="她对你说话的调调"
              options={[
                { value: 'soft',    label: '💗 温柔体贴' },
                { value: 'flirt',   label: '💋 撩骚主动' },
                { value: 'submit',  label: '🐾 完全服从' },
                { value: 'dom',     label: '👑 强势主控' },
              ]}
              value={aiTone}
              onChange={v => { setAiTone(v); showToast('语气已切换，她已收到你的指令 💋') }}
            />
            <SelectRow
              icon={MessageSquare} iconColor="text-[#FF2A6D]"
              title="她叫你的称谓"
              desc="她在对话中对你的专属称呼"
              options={[
                { value: 'dom',     label: '主人' },
                { value: 'daddy',   label: 'Daddy' },
                { value: 'master',  label: '老爷' },
                { value: 'name',    label: '宝贝名字' },
              ]}
              value={callName}
              onChange={v => { setCallName(v); showToast('称谓已更新，她记住你了 🥰') }}
            />
            <SelectRow
              icon={MessageSquare} iconColor="text-[#FF2A6D]"
              title="互动语言"
              desc="AI回应时使用的语言"
              options={[
                { value: 'zh',  label: '🀄 中文' },
                { value: 'en',  label: '🔤 English' },
                { value: 'mix', label: '🌶 双语混骚' },
              ]}
              value={aiLang}
              onChange={setAiLang}
            />
            <ToggleRow
              icon={Mic} iconColor="text-[#FF2A6D]"
              title="娇喘自动触发"
              desc="对话达到高潮时她会不受控制地发出娇喘语音 🎙"
              checked={moaning} onChange={setMoaning}
            />
            <ToggleRow
              icon={Flame} iconColor="text-[#FF2A6D]"
              title="主动撩骚模式"
              desc="她会不定时主动给你发骚扰消息来找你要爱 💌"
              checked={proactive}
              onChange={v => { setProactive(v); if (v) showToast('她已开始蠢蠢欲动… 👅') }}
            />
            <ToggleRow
              icon={Moon} iconColor="text-[#FF2A6D]"
              title="深夜挑逗推送"
              desc="每晚23:00后自动发最骚的撩拨通知，不让你安睡"
              checked={lateNight}
              onChange={v => { setLateNight(v); if (v) showToast('深夜追魂模式已激活 🌙💧') }}
            />
          </div>
        </div>

        {/* ── 设备与震感 ── */}
        <div>
          <SectionTitle icon={Zap} color="text-[#A87CFF]" label="设备与震感" />
          <div className="bg-[#1E1324] rounded-2xl px-4 border border-white/5">
            <SelectRow
              icon={Zap} iconColor="text-[#A87CFF]"
              title="震感强度预设"
              desc="快速切换默认震感档位"
              options={[
                { value: 'gentle', label: '🌊 温水渐进' },
                { value: 'wild',   label: '⚡ 疯狂突破' },
                { value: 'max',    label: '💥 高潮榨干' },
              ]}
              value={vibPreset}
              onChange={v => { setVibPreset(v); showToast('震感预设已更新 ⚡') }}
            />
            <ToggleRow
              icon={Bluetooth} iconColor="text-[#A87CFF]"
              title="蓝牙自动连接"
              desc="靠近已配对设备时自动建立链接，随时待命"
              checked={autoConnect} onChange={setAutoConnect}
            />
            <ToggleRow
              icon={Zap} iconColor="text-[#A87CFF]"
              title="高潮预警震动"
              desc="强制高潮前3秒触发预警震，让她颤抖着迎接冲击"
              checked={orgasmAlert} onChange={setOrgasmAlert}
            />
            <ToggleRow
              icon={Heart} iconColor="text-[#A87CFF]"
              title="震动图案记忆"
              desc="自动保存你最喜欢的快感震型，下次直接召唤"
              checked={vibMemory} onChange={setVibMemory}
            />
            <ToggleRow
              icon={Heart} iconColor="text-[#A87CFF]"
              title="心跳同频震动"
              desc="设备震感与她的心跳频率完美同步，感受真实律动"
              checked={syncBreath}
              onChange={v => { setSyncBreath(v); if (v) showToast('心跳同频已开启，感受她的颤抖 💓') }}
            />
          </div>
        </div>

        {/* ── 账号安全 ── */}
        <div>
          <SectionTitle icon={Lock} color="text-[#66E699]" label="账号安全" />
          <div className="bg-[#1E1324] rounded-2xl px-4 border border-white/5">
            <ToggleRow
              icon={Lock} iconColor="text-[#66E699]"
              title="生物识别解锁"
              desc="Face ID · 指纹 — 只有你才能踏入这片禁地"
              checked={bioUnlock}
              onChange={v => { setBioUnlock(v); if (v) showToast('生物锁已激活，禁地仅限主人 🔒') }}
            />
            <ToggleRow
              icon={Bell} iconColor="text-[#66E699]"
              title="登录异常通知"
              desc="陌生设备企图入侵时立刻向你发出警报"
              checked={loginAlert} onChange={setLoginAlert}
            />
            <ToggleRow
              icon={Shield} iconColor="text-[#66E699]"
              title="会话自动下线"
              desc="15分钟无操作自动退出，你们的秘密绝不外泄"
              checked={autoLogout} onChange={setAutoLogout}
            />
            <ToggleRow
              icon={Shield} iconColor="text-[#66E699]"
              title="端对端加密聊天"
              desc="所有骚话通过顶级加密通道传递，敏感内容永不外泄"
              checked={dataEncrypt} onChange={setDataEncrypt}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
