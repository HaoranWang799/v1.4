/**
 * HomePage.jsx — 互动主场景 v7 (重构版)
 *
 * v7 变更：
 *   • 数据常量提取到 src/data/ (characters, scenes, scripts, interactData)
 *   • 子组件提取到 src/components/home/ (ScriptCards, SelectCards, InteractWidgets)
 *   • 本文件仅保留主逻辑 + 视图编排
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { Sparkles, Pause, Play } from 'lucide-react'
import {
  HeaderStatusBar,
  SceneTimeline,
  RhythmModeGrid,
  AiParameterCards,
  DeviceStatusFooter,
  getStageIndexByProgress,
} from '../components/InteractEnhancements'
import { ScriptCard, GeneratedScriptCard } from '../components/home/ScriptCards'
import { CharSelectCard, SceneSelectCard } from '../components/home/SelectCards'
import { Waveform, HeartRain, SliderControl } from '../components/home/InteractWidgets'
import { CHARACTERS } from '../data/characters'
import { SCENES } from '../data/scenes'
import { SCRIPTS, SCRIPT_DESCRIPTIONS, BG_VIDEO_IDS } from '../data/scripts'
import { PRESETS, TOTAL_SECONDS, pick, formatTime, generateHearts } from '../data/interactData'
import { generateScript as generateScriptApi } from '../api/scripts'

export default function HomePage() {

  // ── 视图状态（'select' | 'interact'）──────────────────────
  const [view, setView] = useState('select')

  // ── 自定义剧本 ───────────────────────────────────────────
  const [customPrompt,     setCustomPrompt]     = useState('')
  // generatedScripts: AI 接口返回的角色数组
  const [generatedScripts, setGeneratedScripts] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  // ── 定制剧本选择状态 ─────────────────────────────────────
  // TODO: 接入后端后，selectedCharId / selectedSceneId 可持久化到用户偏好
  const [selectedCharId,  setSelectedCharId]  = useState(null)
  const [selectedSceneId, setSelectedSceneId] = useState(null)

  // ── 当前激活剧本 ─────────────────────────────────────────
  const [activeScript, setActiveScript] = useState(null)

  // ── 互动状态 ─────────────────────────────────────────────
  const [temperature,     setTemperature]     = useState(0)
  const [displayedText,   setDisplayedText]   = useState('')
  const [isTyping,        setIsTyping]        = useState(false)
  const [showDeviceNotif, setShowDeviceNotif] = useState(false)
  const [isVoiceActive,   setIsVoiceActive]   = useState(false)
  const [showHearts,      setShowHearts]      = useState(false)
  const [hearts,          setHearts]          = useState([])
  const [avatarPop,       setAvatarPop]       = useState(false)

  // ── 剧本详情弹窗 ─────────────────────────────────────────
  const [showScriptDetail, setShowScriptDetail] = useState(false)

  // ── 播放暂停状态 ─────────────────────────────────────────
  const [isPaused, setIsPaused] = useState(false)

  // ── 交互模式背景类型（video → image → emoji 链式回退）──
  const [bgType, setBgType] = useState('video')

  // ── 震动模式（保留供将来扩展） ──────────────────────────
  const [vibMode, setVibMode] = useState('slow')

  // ── 设备控制滑块（频率 / 强度 / 紧度，1-10）────────────
  // TODO: 接入真实蓝牙设备控制接口 (setDeviceParam)
  const [freq,   setFreq]   = useState(5)
  const [intens, setIntens] = useState(5)
  const [tight,  setTight]  = useState(5)

  // ── 剧本进度（0-100，初始 35）────────────────────────────
  const [progressValue, setProgressValue] = useState(35)

  // ── TTS 音频总时长（秒），AI 模式下动态更新 ──────────────
  const [audioDuration, setAudioDuration] = useState(TOTAL_SECONDS)

  // ── 新增：控制模式切换（'ai' | 'manual'）────────────────
  // TODO: 接入后端后可持久化用户偏好到 /api/user/preferences
  const [controlMode, setControlMode] = useState('ai')

  // ── 新增：AI节奏模式选择 ─────────────────────────────────
  // TODO: 接入 /api/ai/set-rhythm-mode 后传递实际模式参数
  const [rhythmMode, setRhythmMode] = useState('adaptive')

  // ── 新增：AI参数（独立于旧手动 slider，0-100 范围）────────
  // TODO: 接入 /api/ai/set-param 后传递 aiIntens / aiFreq
  const [aiIntens, setAiIntens] = useState(50)
  const [aiFreq,   setAiFreq]   = useState(36.8)

  // ── Refs ─────────────────────────────────────────────────
  const typingTimerRef = useRef(null)
  const heartsTimerRef = useRef(null)
  const autoTextCbRef  = useRef(null)
  const temperatureRef = useRef(0)
  const dragScrollStateRef = useRef({
    pointerId: null,
    container: null,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    moved: false,
    axis: null,
  })
  const suppressHorizontalClickRef = useRef(false)
  // TODO: 替换 /audio/demo.mp3 为真实场景配乐（后续可按 activeScript.id 动态切换音频）
  const audioRef = useRef(null)
  const openingAudioRef = useRef(null)
  const pendingOpeningLineRef = useRef(null)

  // 同步 temperature 到 ref（供 interval 回调读取最新值）
  useEffect(() => { temperatureRef.current = temperature }, [temperature])

  // ── 衍生数据 ─────────────────────────────────────────────
  const activeChar  = activeScript ? CHARACTERS.find(c => c.id === activeScript.charId) : null
  const activeScene = activeScript ? SCENES.find(s => s.id === activeScript.sceneId)    : null
  // AI 生成模式用 TTS 实际时长，其他模式用固定会话时长
  const displayTotalSeconds = activeScript?.isAIGenerated ? audioDuration : TOTAL_SECONDS
  const isIntimate  = temperature >= 60
  const tempFull    = temperature >= 100

  // 交互模式显示：自定义剧本用 customDisplayName / customTag，默认用角色字段
  const displayEmoji = activeScript?.isCustom ? activeScript.cover              : activeChar?.emoji
  const displayName  = activeScript?.isCustom ? activeScript.customDisplayName  : activeChar?.name
  const displayTag   = activeScript?.isCustom ? activeScript.customTag          : activeChar?.tag

  // 场景氛围叠加色（随温度变深）
  const overlayStyle = activeScene
    ? { background: `rgba(${activeScene.overlayRgb}, ${(temperature / 100) * 0.35})`, transition: 'background 0.8s ease' }
    : {}

  // 场景氛围文字（三阶段）
  const ambianceText = activeScene
    ? (temperature >= 60 ? activeScene.ambiance.hot  :
       temperature >= 20 ? activeScene.ambiance.warm :
                           activeScene.ambiance.idle)
    : ''

  // 主按钮文字
  const buttonLabel = temperature === 0 ? '轻触开始' : isIntimate ? '继续靠近' : '继续触碰'

  // 定制剧本"开始互动"按钮是否可用
  const canStartCustom = !!selectedCharId && !!selectedSceneId

  const handleHorizontalDragStart = useCallback((event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragScrollStateRef.current = {
      pointerId: event.pointerId,
      container: event.currentTarget,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: event.currentTarget.scrollLeft,
      moved: false,
      axis: null,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }, [])

  const handleHorizontalDragMove = useCallback((event) => {
    const dragState = dragScrollStateRef.current
    if (dragState.pointerId !== event.pointerId) return

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY

    if (!dragState.axis) {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return
      dragState.axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'
    }

    if (dragState.axis !== 'x') return

    if (!dragState.moved && Math.abs(deltaX) > 6) {
      dragState.moved = true
      suppressHorizontalClickRef.current = true
    }

    if (!dragState.moved) return

    event.preventDefault()
    event.currentTarget.scrollLeft = dragState.startScrollLeft - deltaX
  }, [])

  const handleHorizontalDragEnd = useCallback((event) => {
    const dragState = dragScrollStateRef.current
    if (dragState.pointerId !== event.pointerId) return
    event.currentTarget.releasePointerCapture?.(event.pointerId)

    dragScrollStateRef.current = {
      pointerId: null,
      container: null,
      startX: 0,
      startY: 0,
      startScrollLeft: 0,
      moved: false,
      axis: null,
    }
    if (suppressHorizontalClickRef.current) {
      window.setTimeout(() => {
        suppressHorizontalClickRef.current = false
      }, 0)
    }
  }, [])

  const handleHorizontalClickCapture = useCallback((event) => {
    if (!suppressHorizontalClickRef.current) return
    event.preventDefault()
    event.stopPropagation()
    suppressHorizontalClickRef.current = false
  }, [])

  const handleHorizontalWheel = useCallback((event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    event.preventDefault()
    event.currentTarget.scrollLeft += event.deltaY
  }, [])

  // ── 打字机效果 ───────────────────────────────────────────
  const typeText = useCallback((text) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current)
    setIsTyping(true)
    setDisplayedText('')
    let i = 0
    typingTimerRef.current = setInterval(() => {
      i++
      setDisplayedText(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(typingTimerRef.current)
        setIsTyping(false)
      }
    }, 50)
  }, [])

  // ── 设备响应通知（气泡）──────────────────────────────────
  // TODO: 替换为真实蓝牙设备强度控制 (setIntensity)
  const triggerDeviceNotif = useCallback(() => {
    setShowDeviceNotif(true)
    setTimeout(() => setShowDeviceNotif(false), 1200)
  }, [])

  // ── 头像弹跳动画 ─────────────────────────────────────────
  const triggerAvatarPop = useCallback(() => {
    setAvatarPop(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setAvatarPop(true)))
    setTimeout(() => setAvatarPop(false), 400)
  }, [])

  // ── 增加情绪温度 ─────────────────────────────────────────
  const increaseTemp = useCallback((delta) => {
    setTemperature((prev) => {
      const next = Math.min(prev + delta, 100)
      if (next >= 100) {
        const hs = generateHearts(35)
        setHearts(hs)
        setShowHearts(true)
        if (heartsTimerRef.current) clearTimeout(heartsTimerRef.current)
        heartsTimerRef.current = setTimeout(() => setShowHearts(false), 4500)
      }
      return next
    })
  }, [])

  // ── 随机选取角色回应句 ───────────────────────────────────
  // TODO: 替换为真实 LLM 接口 (getAIResponse)
  const pickResponse = useCallback((isIntimateMode) => {
    if (!activeChar) return ''
    const pool = isIntimateMode ? activeChar.responses.intimate : activeChar.responses.normal
    return pick(pool)
  }, [activeChar])

  // ── 自动文案更新（每 3 秒换一句）────────────────────────
  useEffect(() => {
    autoTextCbRef.current = () => {
      if (!activeChar) return
      typeText(pickResponse(temperatureRef.current >= 60))
    }
  })

  useEffect(() => {
    if (view !== 'interact') return
    if (pendingOpeningLineRef.current) {
      typeText(pendingOpeningLineRef.current)
      pendingOpeningLineRef.current = null
    } else {
      autoTextCbRef.current?.()
    }
    const id = setInterval(() => autoTextCbRef.current?.(), 3000)
    return () => clearInterval(id)
  }, [view, typeText])

  // ── 进入交互模式 ─────────────────────────────────────────
  const enterInteract = useCallback((script) => {
    // charId 或 sceneId 在 BG_VIDEO_IDS 中时才尝试视频背景，否则直接走图片
    const useBgVideo = BG_VIDEO_IDS.includes(script.charId) || BG_VIDEO_IDS.includes(script.sceneId)
    setBgType(useBgVideo ? 'video' : 'image')
    setActiveScript(script)
    setTemperature(0)
    setDisplayedText('')
    setIsTyping(false)
    setShowHearts(false)
    setVibMode('slow')
    setFreq(5)
    setIntens(5)
    setTight(5)
    setProgressValue(35)
    // 进入时重置新增 state
    setControlMode('ai')
    setRhythmMode('adaptive')
    setAiIntens(50)
    setAiFreq(36.8)
    setIsPaused(false)
    // AI 生成的剧本：进入时用开场白作为首屏文字
    if (script.openingLine && script.isAIGenerated) {
      pendingOpeningLineRef.current = script.openingLine
    }
    setView('interact')
  }, [])

  // ── 返回选择视图 ─────────────────────────────────────────
  const exitInteract = useCallback(() => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current)
    setView('select')
    setActiveScript(null)
    setTemperature(0)
    setDisplayedText('')
    setShowHearts(false)
    setIsPaused(false)
    setShowScriptDetail(false)
  }, [])

  // ── 暂停/继续播放（同步控制背景音频）──────────────────────
  const togglePause = useCallback(() => {
    const nextPaused = !isPaused
    setIsPaused(nextPaused)
    // 背景音乐（非 AI 剧本）
    if (audioRef.current) {
      if (nextPaused) audioRef.current.pause()
      else audioRef.current.play().catch(() => setIsPaused(true))
    }
    // TTS 开场白（AI 生成剧本）
    if (openingAudioRef.current) {
      if (nextPaused) openingAudioRef.current.pause()
      else openingAudioRef.current.play().catch(() => setIsPaused(true))
    }
  }, [isPaused])

  // ── 主按钮点击 ───────────────────────────────────────────
  const handleMainClick = useCallback(() => {
    if (tempFull) return
    increaseTemp(10)
    triggerDeviceNotif()
    triggerAvatarPop()
    // TODO: 替换为真实 LLM 接口
    typeText(pickResponse(isIntimate || temperature + 10 >= 60))
  }, [tempFull, isIntimate, temperature, increaseTemp, triggerDeviceNotif, triggerAvatarPop, typeText, pickResponse])

  // ── 语音按钮点击 ─────────────────────────────────────────
  // TODO: 替换为真实语音识别 STT 与 TTS 接口
  const handleVoiceClick = useCallback(() => {
    if (isVoiceActive) return
    setIsVoiceActive(true)
    setDisplayedText('AI 情绪识别中…')
    setIsTyping(false)
    setTimeout(() => {
      setIsVoiceActive(false)
      increaseTemp(5)
      triggerDeviceNotif()
      triggerAvatarPop()
      typeText(pickResponse(temperatureRef.current + 5 >= 60))
    }, 1500)
  }, [isVoiceActive, increaseTemp, triggerDeviceNotif, triggerAvatarPop, typeText, pickResponse])

  // ── 自定义剧本生成（接入 Grok + Fish Audio TTS）────────────
  const handleGenerate = useCallback(async () => {
    if (!customPrompt.trim()) {
      alert('✨ 请先描述你的幻想场景和角色，让 AI 为你创造专属剧本。')
      return
    }
    setIsGenerating(true)
    setGeneratedScripts([])
    try {
      const { character, audioBase64 } = await generateScriptApi(customPrompt.trim())
      const ts = Date.now()
      const witchChar  = CHARACTERS.find(c => c.id === 'witch')
      const knightChar = CHARACTERS.find(c => c.id === 'knight')
      setGeneratedScripts([
        {
          id:             `ai-${ts}-a`,
          charId:         'witch',
          isAIGenerated:  true,
          sceneId:        'balcony',
          cover:          witchChar.emoji,
          coverEmoji:     witchChar.emoji,
          tag:            'AI 生成',
          downloads:      'AI 生成',
          rating:         null,
          name:           witchChar.name,
          personalityTag: witchChar.tag,
          openingLine:    character.openingLine,
          gradient:       'from-[#1a0a30] to-[#3a1060]',
          audioBase64:    audioBase64 || null,
        },
        {
          id:             `ai-${ts}-b`,
          charId:         'knight',
          isAIGenerated:  true,
          sceneId:        'balcony',
          cover:          knightChar.emoji,
          coverEmoji:     knightChar.emoji,
          tag:            'AI 生成',
          downloads:      'AI 生成',
          rating:         null,
          name:           knightChar.name,
          personalityTag: knightChar.tag,
          openingLine:    character.openingLine,
          gradient:       'from-[#0d1a3a] to-[#1a3860]',
          audioBase64:    audioBase64 || null,
        },
      ])
    } catch (err) {
      alert(`✨ 生成失败：${err.message}`)
    } finally {
      setIsGenerating(false)
    }
  }, [customPrompt])

  // ── 定制剧本：点击"开始互动" ──────────────────────────────
  // 根据已选角色 + 场景动态构造脚本对象，复用 enterInteract 逻辑
  // TODO: 接入后端后可在此处调用 /api/scripts/generate?charId=&sceneId=
  const handleStartCustom = useCallback(() => {
    if (!selectedCharId || !selectedSceneId) return
    const char  = CHARACTERS.find(c => c.id === selectedCharId)
    const scene = SCENES.find(s => s.id === selectedSceneId)
    const script = {
      id:             `custom-${selectedCharId}-${selectedSceneId}`,
      charId:         selectedCharId,
      sceneId:        selectedSceneId,
      cover:          char.emoji,
      name:           `${scene.name}·${char.name}`,
      tag:            '定制',
      personalityTag: char.tag,
      openingLine:    char.intro,
      downloads:      null,
      rating:         null,
      gradient:       'from-[#1a1028] to-[#251840]',
      isCustom:       false,
    }
    enterInteract(script)
  }, [selectedCharId, selectedSceneId, enterInteract])

  // ── 交互模式背景音乐（演示版，文件路径：public/audio/demo.mp3）────
  // AI 生成的剧本不播放背景音，只播 TTS 开场白语音
  useEffect(() => {
    if (view === 'interact' && !activeScript?.isAIGenerated) {
      // 进入交互模式：创建音频实例并循环播放
      audioRef.current = new Audio('/audio/demo.mp3')
      audioRef.current.loop = true
      audioRef.current.play().catch(() => {
        // 浏览器自动播放策略可能拦截，静默忽略错误
      })
    } else {
      // 离开交互模式：停止并释放音频资源
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
    return () => {
      // 视图切换 / 组件卸载时清理
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [view])

  // ── TTS 开场白音频（AI 生成剧本进入互动时播放一次）────────
  useEffect(() => {
    if (openingAudioRef.current) {
      openingAudioRef.current.pause()
      openingAudioRef.current = null
    }
    if (view === 'interact' && activeScript?.audioBase64) {
      const audio = new Audio(`data:audio/mp3;base64,${activeScript.audioBase64}`)
      openingAudioRef.current = audio
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(Math.ceil(audio.duration))
        setProgressValue(0)
      })
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          setProgressValue(Math.round(audio.currentTime / audio.duration * 100))
        }
      })
      audio.addEventListener('ended', () => {
        setProgressValue(100)
        setIsPaused(true)
      })
      audio.play().catch(() => {})
    } else {
      setAudioDuration(TOTAL_SECONDS)
    }
    return () => {
      if (openingAudioRef.current) {
        openingAudioRef.current.pause()
        openingAudioRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, activeScript?.id])

  // ── 清理定时器 ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current)
      if (heartsTimerRef.current) clearTimeout(heartsTimerRef.current)
    }
  }, [])

  // ═════════════════════════════════════════════════════════
  //  渲染
  // ═════════════════════════════════════════════════════════
  return (
    <div className="relative min-h-full overflow-hidden bg-app-bg">

      {/* 场景氛围叠加层（仅 interact 模式生效） */}
      <div
        className="scene-overlay absolute inset-0 pointer-events-none z-0"
        style={view === 'interact' ? overlayStyle : {}}
      />

      <div className="relative z-10 px-4 pt-5 pb-6">

        {/* ══════════════════════════════════════════════════
            视图 A：剧本选择
        ══════════════════════════════════════════════════ */}
        {view === 'select' && (
          <div className="space-y-8 animate-fadeUp">

            {/* ── 🔥 激励横幅 ── */}
            <div
              className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #FF4E6A 0%, #FF9ACB 55%, #B380FF 100%)' }}
            >
              <span className="text-2xl flex-shrink-0 select-none">🔥</span>
              <div>
                <p className="text-[13px] font-bold text-white leading-snug">
                  你昨天的记录是亚洲第 888 名，实在是 🍌 猛男！
                </p>
                <p className="text-[11px] font-medium text-white/75 mt-0.5">
                  今天继续冲刺，冲进 Top 500～
                </p>
              </div>
            </div>

            {/* ── ① 生成你的专属（输入框 + AI生成按钮）── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[#FF9ACB]" />
                <h2 className="text-sm font-semibold text-[rgba(245,240,242,0.85)] tracking-wide">
                  生成你的专属
                </h2>
                <span className="text-[9px] text-[rgba(245,240,242,0.35)] ml-auto">AI Beta</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
                  disabled={isGenerating}
                  placeholder="描述你心中的幻想场景和角色…"
                  className="
                    flex-1 min-w-0 rounded-xl px-3 py-2.5 text-xs
                    bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]
                    text-[rgba(245,240,242,0.85)] placeholder-[rgba(245,240,242,0.3)]
                    focus:outline-none focus:border-[rgba(255,154,203,0.4)]
                    transition-colors disabled:opacity-60
                  "
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex-shrink-0 flex items-center gap-1.5 btn-main rounded-xl px-3 py-2.5 text-white text-xs font-medium whitespace-nowrap disabled:opacity-60"
                >
                  {isGenerating
                    ? <span className="flex items-center gap-1">⏳ 生成中…</span>
                    : <><Sparkles size={13} />✨ 生成</>
                  }
                </button>
              </div>
            </section>

            {/* ── ② 为你定制（生成后出现，两个并排定制卡片供选择）── */}
            {/* TODO: 替换为 AI 接口返回的真实角色数据 */}
            {generatedScripts.length > 0 && (
              <section className="animate-fadeUp">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">✨</span>
                  <h2 className="text-sm font-semibold text-[rgba(245,240,242,0.85)] tracking-wide">
                    为你定制
                  </h2>
                  <span
                    className="text-[9px] rounded-full px-2 py-0.5 ml-auto text-white font-medium"
                    style={{ background: 'linear-gradient(135deg, #FF9ACB, #B380FF)' }}
                  >
                    专属生成
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {generatedScripts.map((script) => (
                    <GeneratedScriptCard
                      key={script.id}
                      script={script}
                      onClick={() => enterInteract(script)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── ③ 今夜为你推荐（双列网格，竖向卡片）── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🌙</span>
                <h2 className="text-sm font-semibold text-[rgba(245,240,242,0.85)] tracking-wide">
                  今夜为你推荐
                </h2>
                <span className="text-[9px] text-[rgba(245,240,242,0.35)] ml-auto">点击进入</span>
              </div>

              {/* grid-cols-2：双列等宽网格 */}
              <div className="grid grid-cols-2 gap-4">
                {SCRIPTS.map((script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    onClick={() => enterInteract(script)}
                  />
                ))}
              </div>
            </section>

            {/* ── ④ 定制你的剧本（角色 + 场景选择 + 开始互动）── */}
            {/* TODO: 角色/场景数据接入 /api/characters 与 /api/scenes */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">🎨</span>
                <h2 className="text-[15px] font-semibold text-[rgba(245,240,242,0.9)] tracking-wide">
                  定制你的剧本
                </h2>
                <span
                  className="text-[9px] rounded-full px-2 py-0.5 ml-auto"
                  style={{
                    background: 'rgba(179,128,255,0.15)',
                    color: '#B380FF',
                  }}
                >
                  自由组合
                </span>
              </div>

              {/* 角色选择行（横向滚动，单选） */}
              <div className="mb-2">
                <p className="text-[10px] text-[rgba(245,240,242,0.4)] tracking-wider mb-2">
                  选择角色
                  {selectedCharId && (
                    <span className="text-[#FF9ACB] ml-1.5">
                      · {CHARACTERS.find(c => c.id === selectedCharId)?.name}
                    </span>
                  )}
                </p>
                <div
                  className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 pr-4 cursor-grab select-none"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y',
                    overscrollBehaviorX: 'contain',
                  }}
                  onPointerDown={handleHorizontalDragStart}
                  onPointerMove={handleHorizontalDragMove}
                  onPointerUp={handleHorizontalDragEnd}
                  onPointerCancel={handleHorizontalDragEnd}
                  onClickCapture={handleHorizontalClickCapture}
                  onWheel={handleHorizontalWheel}
                >
                  {CHARACTERS.map((char) => (
                    <CharSelectCard
                      key={char.id}
                      char={char}
                      selected={selectedCharId === char.id}
                      onSelect={() => setSelectedCharId(
                        selectedCharId === char.id ? null : char.id
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* 场景选择行（横向滚动，单选） */}
              <div className="mb-5 mt-4">
                <p className="text-[10px] text-[rgba(245,240,242,0.4)] tracking-wider mb-2">
                  选择场景
                  {selectedSceneId && (
                    <span className="text-[#B380FF] ml-1.5">
                      · {SCENES.find(s => s.id === selectedSceneId)?.name}
                    </span>
                  )}
                </p>
                <div
                  className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 pr-4 cursor-grab select-none"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    touchAction: 'pan-y',
                    overscrollBehaviorX: 'contain',
                  }}
                  onPointerDown={handleHorizontalDragStart}
                  onPointerMove={handleHorizontalDragMove}
                  onPointerUp={handleHorizontalDragEnd}
                  onPointerCancel={handleHorizontalDragEnd}
                  onClickCapture={handleHorizontalClickCapture}
                  onWheel={handleHorizontalWheel}
                >
                  {SCENES.map((scene) => (
                    <SceneSelectCard
                      key={scene.id}
                      scene={scene}
                      selected={selectedSceneId === scene.id}
                      onSelect={() => setSelectedSceneId(
                        selectedSceneId === scene.id ? null : scene.id
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* 开始互动按钮（角色 + 场景均已选中时激活） */}
              <button
                onClick={handleStartCustom}
                disabled={!canStartCustom}
                className={`
                  w-full py-3.5 rounded-2xl flex items-center justify-center gap-2
                  text-sm font-semibold tracking-wide transition-all duration-200
                  ${canStartCustom
                    ? 'btn-main text-white active:scale-[0.98] shadow-lg'
                    : 'bg-[rgba(255,255,255,0.06)] text-[rgba(245,240,242,0.3)] cursor-not-allowed border border-[rgba(255,255,255,0.08)]'
                  }
                `}
              >
                <Sparkles size={15} className={canStartCustom ? 'opacity-100' : 'opacity-30'} />
                {canStartCustom ? '✨ 开始互动' : '请先选择角色和场景'}
              </button>
            </section>

          </div>
        )}

        {/* ══════════════════════════════════════════════════
            视图 B：交互模式（新设计）
        ══════════════════════════════════════════════════ */}
        {view === 'interact' && activeScript && (
          <div className="relative flex flex-col gap-3 animate-fadeUp">

            {/* ── 交互模式背景（video → image → emoji 链式回退）── */}
            {/* 视频路径：/videos/{charId}.mp4 · 图片路径：/images/covers/{charId}.jpg */}
            <div
              className="absolute inset-0 pointer-events-none select-none overflow-hidden"
              style={{ zIndex: 0 }}
            >
              {/* 第一优先：视频背景 */}
              {bgType === 'video' && (
                <video
                  src={`/videos/${activeScript.charId}.mp4`}
                  autoPlay loop muted playsInline
                  onError={() => setBgType('image')}
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
              )}
              {/* 第二优先：图片背景（视频加载失败时，jpg → png → emoji 链式回退） */}
              {bgType === 'image' && (
                <img
                  src={`/images/covers/${activeScript.charId}.jpg`}
                  alt=""
                  onError={(e) => {
                    if (e.target.src.endsWith('.jpg')) {
                      e.target.src = `/images/covers/${activeScript.charId}.png`
                    } else {
                      setBgType('emoji')
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
              )}
              {/* 最终回退：大 emoji 水印（图片也失败时） */}
              {bgType === 'emoji' && (
                <div className="absolute inset-0 flex items-center justify-center text-[30vw] opacity-20">
                  {displayEmoji}
                </div>
              )}
            </div>

            {/* 背景深色渐变遮罩（降低人物图对前景文字的干扰） */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 1, background: 'linear-gradient(180deg, rgba(8,4,10,0.36) 0%, rgba(8,4,10,0.12) 30%, rgba(8,4,10,0.36) 72%, rgba(8,4,10,0.62) 100%)' }}
            />

            {/* ── ① 顶部：左侧返回按钮 + 右侧剧本详情按钮 ──────── */}
            <div className="relative z-10 flex justify-between items-center">
              <button
                onClick={exitInteract}
                className="flex items-center gap-1.5 text-[11px] font-medium text-[rgba(245,240,242,0.75)] bg-[rgba(255,255,255,0.1)] rounded-full px-3 py-1.5 active:scale-95 transition-all"
              >
                ← 全部剧本
              </button>
              <button
                onClick={() => setShowScriptDetail(true)}
                className="flex items-center gap-1.5 text-[11px] font-medium text-[rgba(245,240,242,0.75)] bg-[rgba(255,255,255,0.1)] rounded-full px-3 py-1.5 active:scale-95 transition-all"
              >
                ℹ️ 剧本详情
              </button>
            </div>

            {/* ── ② [新增] 顶部设备状态栏 ─────────────────────────
                TODO: connected/battery 由蓝牙Hook下发；mode/remainingMin 由 session 下发 */}
            <HeaderStatusBar />

            {/* ── ④ 场景氛围文字（弱化，辅助氛围） */}
            <p className="relative z-10 text-[10px] text-center text-[rgba(245,240,242,0.35)] italic leading-relaxed">
              {ambianceText}
            </p>

            {/* ── ⑤-⑧ 主播放卡：对白 + 音波 + 进度条 + 场景节点（四区合一） */}
            <div className="relative z-10 rounded-2xl px-4 pt-4 pb-4 bg-[rgba(10,5,12,0.62)] border border-[rgba(255,255,255,0.08)] flex flex-col gap-3">
              {/* 对白区 */}
              <div className="min-h-[52px] flex items-center justify-center text-center">
                {displayedText ? (
                  <p className={`text-sm font-light text-[#f5f0f2] leading-relaxed tracking-wide ${isTyping ? 'typewriter-cursor' : ''}`}>
                    {displayedText}
                  </p>
                ) : (
                  <p className="text-xs text-[rgba(245,240,242,0.2)] italic">等待回应…</p>
                )}
              </div>

              <div className="h-px bg-[rgba(255,255,255,0.06)]" />

              {/* 音波 */}
              <Waveform freq={isPaused ? 1 : freq} />

              {/* 播放进度 */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={togglePause}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 flex-shrink-0"
                  style={
                    isPaused
                      ? {
                          background: 'rgba(179,128,255,0.18)',
                          border: '1px solid rgba(179,128,255,0.45)',
                          boxShadow: '0 0 12px rgba(179,128,255,0.2)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.16)',
                        }
                  }
                  aria-label={isPaused ? '继续播放' : '暂停播放'}
                  title={isPaused ? '继续播放' : '暂停播放'}
                >
                  {isPaused
                    ? <Play size={13} className="text-[#f5f0f2] ml-0.5" />
                    : <Pause size={13} className="text-[rgba(245,240,242,0.72)]" />}
                </button>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-[rgba(245,240,242,0.55)] tabular-nums font-medium">
                      {formatTime(Math.round(progressValue / 100 * displayTotalSeconds))}
                    </span>
                    <span className="text-[10px] text-[rgba(245,240,242,0.22)] tabular-nums">
                      {formatTime(displayTotalSeconds)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressValue}
                    onChange={e => {
                      const val = Number(e.target.value)
                      setProgressValue(val)
                      if (openingAudioRef.current && openingAudioRef.current.duration) {
                        openingAudioRef.current.currentTime = val / 100 * openingAudioRef.current.duration
                      }
                    }}
                    className="w-full h-1 rounded-full outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{ background: `linear-gradient(90deg, #FF9ACB ${progressValue}%, rgba(255,255,255,0.12) ${progressValue}%)` }}
                  />
                </div>
              </div>

              <div className="h-px bg-[rgba(255,255,255,0.05)]" />

              {/* 场景节点（嵌入主卡，不再独立卦块）
                  TODO: onStageChange 后续触发 /api/session/jump-to-stage */}
              <SceneTimeline
                stageIndex={getStageIndexByProgress(progressValue)}
                onStageChange={(idx) => {
                  const stagePcts = [0, 16, 32, 48, 64]
                  if (stagePcts[idx] !== undefined) setProgressValue(stagePcts[idx])
                }}
              />
            </div>

            {/* ── 控制区 ─────────────────────────────────────────────── */}

            {/* AI 智能 — 点击开启，preset点击后自动退出 */}
            <button
              onClick={() => setControlMode('ai')}
              className="relative z-10 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]"
              style={
                controlMode === 'ai'
                  ? { background: 'linear-gradient(135deg, #FF9ACB, #B380FF)', color: '#fff', boxShadow: '0 2px 16px rgba(255,154,203,0.3)' }
                  : { background: 'rgba(255,255,255,0.07)', color: 'rgba(245,240,242,0.45)', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              <span className="text-base select-none">✦</span>
              AI 智能
              {controlMode === 'ai' && <span className="text-[10px] font-normal opacity-80">· 开启中</span>}
            </button>

            {/* 节奏模式（始终显示） */}
            <RhythmModeGrid selectedMode={rhythmMode} onChange={(v) => { setRhythmMode(v); setControlMode('manual'); }} />

            {/* 统一参数卡 */}
            <div className="relative z-10 rounded-2xl p-4 bg-[rgba(10,5,12,0.62)] border border-[rgba(255,255,255,0.08)] flex flex-col gap-4">

              {/* AI 参数区（始终显示） */}
              <>
                <AiParameterCards
                  aiIntens={aiIntens}
                  onAiIntensChange={(value) => { setAiIntens(value); setControlMode('manual'); }}
                  aiFreq={aiFreq}
                  onAiFreqChange={(value) => { setAiFreq(value); setControlMode('manual'); }}
                />
                <div className="h-px bg-[rgba(255,255,255,0.07)]" />
              </>

              {/* 手动调节滑杆（始终可见） */}
              <SliderControl icon="📶" label="频率" value={freq}   onChange={(v) => { setFreq(v);   setControlMode('manual'); }} />
              <SliderControl icon="💪" label="强度" value={intens} onChange={(v) => { setIntens(v); setControlMode('manual'); }} />
              <SliderControl icon="🔒" label="紧度" value={tight}  onChange={(v) => { setTight(v);  setControlMode('manual'); }} />
            </div>

            {/* 快捷预设（点击自动退出 AI 模式） */}
            <div className="relative z-10 grid grid-cols-3 gap-2">
              {PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => { setControlMode('manual'); setFreq(preset.freq); setIntens(preset.intens); setTight(preset.tight); }}
                  className="py-2.5 rounded-2xl text-center text-[11px] font-medium transition-all active:scale-95 bg-[rgba(20,12,18,0.62)] border border-[rgba(255,255,255,0.08)] text-[rgba(245,240,242,0.65)] hover:bg-[rgba(40,24,32,0.62)]"
                >
                  <span className="block text-lg mb-0.5 select-none">{preset.emoji}</span>
                  {preset.label}
                </button>
              ))}
            </div>

            {/* ── 底部设备状态卡片 */}
            <DeviceStatusFooter />

          </div>
        )}

      </div>

      {/* ── 剧本详情弹窗 ──────────────────────────────────────── */}
      {showScriptDetail && activeScript && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.65)' }}
          onClick={() => setShowScriptDetail(false)}
        >
          <div
            className="w-full max-w-[430px] max-h-[calc(100vh-1rem)] overflow-y-auto rounded-t-3xl px-5 pt-5 pb-24 animate-fadeUp"
            style={{ background: 'linear-gradient(180deg, #1e0f1a 0%, #120a18 100%)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* 顶部把手 */}
            <div className="w-10 h-1 rounded-full bg-[rgba(255,255,255,0.15)] mx-auto mb-5" />

            {/* 剧本名称 */}
            <div className="flex items-start gap-3 mb-5">
              <span className="text-4xl select-none leading-none">{displayEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[rgba(245,240,242,0.95)] leading-snug mb-0.5">
                  {activeScript.name}
                </p>
                <span className="text-[10px] bg-[rgba(255,154,203,0.15)] text-[#FF9ACB] rounded-full px-2 py-0.5">
                  {activeScript.tag}
                </span>
              </div>
            </div>

            {/* 剧本简介长文案 */}
            {activeChar && SCRIPT_DESCRIPTIONS[activeChar.id] && (
              <div className="rounded-2xl p-4 mb-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)]">
                <p className="text-[9px] text-[rgba(245,240,242,0.35)] tracking-widest mb-2">剧本简介</p>
                <p className="text-[11px] text-[rgba(245,240,242,0.72)] leading-relaxed">
                  {SCRIPT_DESCRIPTIONS[activeChar.id]}
                </p>
              </div>
            )}

            {/* 角色信息 */}
            {activeChar && (
              <div className="rounded-2xl p-4 mb-3 bg-[rgba(255,154,203,0.06)] border border-[rgba(255,154,203,0.1)]">
                <p className="text-[9px] text-[rgba(245,240,242,0.35)] tracking-widest mb-2">角色</p>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl select-none">{activeChar.emoji}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[rgba(245,240,242,0.9)]">{activeChar.name}</p>
                    <p className="text-[10px] text-[rgba(179,128,255,0.8)]">{activeChar.tag}</p>
                  </div>
                </div>
                <p className="text-[11px] text-[rgba(245,240,242,0.55)] italic leading-relaxed">
                  "{activeChar.intro}"
                </p>
              </div>
            )}

            {/* 场景信息 */}
            {activeScene && (
              <div className="rounded-2xl p-4 mb-5 bg-[rgba(179,128,255,0.06)] border border-[rgba(179,128,255,0.1)]">
                <p className="text-[9px] text-[rgba(245,240,242,0.35)] tracking-widest mb-2">场景</p>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-2xl select-none">{activeScene.emoji}</span>
                  <p className="text-[13px] font-semibold text-[rgba(245,240,242,0.9)]">{activeScene.name}</p>
                </div>
                <p className="text-[11px] text-[rgba(245,240,242,0.55)] italic leading-relaxed">
                  {activeScene.ambiance.idle}
                </p>
              </div>
            )}

            {/* 关闭按钮 */}
            <button
              onClick={() => setShowScriptDetail(false)}
              className="w-full py-3 rounded-2xl text-[13px] font-medium text-[rgba(245,240,242,0.6)] bg-[rgba(255,255,255,0.07)] active:scale-[0.98] transition-all"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 满屏心形飘落 */}
      {showHearts && <HeartRain hearts={hearts} />}
    </div>
  )
}
