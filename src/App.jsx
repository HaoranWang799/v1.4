/**
 * App.jsx — 路由入口 v2
 *
 * 变更（v2）：
 *   • 引入 AppProvider（全局货币 + 会员等级状态）
 *   • 新增 /recharge 路由（位于 Layout 外，无底部导航）
 *
 * TODO: 添加用户账户系统与亲密度持久化（localStorage / 后端 API）
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Toast           from './components/ui/Toast'
import Layout          from './components/Layout'
import HomePage        from './pages/HomePage'
import ShopPage        from './pages/ShopPage'
import CommunityPage   from './pages/CommunityPage'
import HealthPage      from './pages/HealthPage'
import RechargePage    from './pages/RechargePage'
// ── 新增页面（来自 Demo 工程化拆解） ──────────────────────
import ProfilePage       from './pages/ProfilePage'
import DevicePage        from './pages/DevicePage'
import HardwareStorePage from './pages/HardwareStorePage'
import SubscriptionPage  from './pages/SubscriptionPage'
import SettingsPage      from './pages/SettingsPage'
import PrivacyPage       from './pages/PrivacyPage'
import PaymentPage       from './pages/PaymentPage'
import ScriptsPage       from './pages/ScriptsPage'
import AIVoicePage       from './pages/AIVoicePage'
import PlayerPage        from './pages/PlayerPage'
import ChatPage          from './pages/ChatPage'
import HelpCenterPage    from './pages/HelpCenterPage'

/** 全局 Toast 挂载在 AppProvider 内 */
function GlobalToast() {
  const { toastMessage, clearToast } = useApp()
  if (!toastMessage) return null
  return <Toast message={toastMessage} onClose={clearToast} />
}

export default function App() {
  return (
    <AppProvider>
      <GlobalToast />
      <Routes>
        {/* ── 带底部导航的主布局 ── */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home"      element={<HomePage />} />
          <Route path="shop"      element={<ShopPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="health"    element={<HealthPage />} />
          <Route path="profile"   element={<ProfilePage />} />
        </Route>

        {/* ── 全屏独立页面（无底部导航） ── */}
        <Route path="/recharge"       element={<RechargePage />} />
        <Route path="/devices"        element={<DevicePage />} />
        <Route path="/hardware-store" element={<HardwareStorePage />} />
        <Route path="/subscription"   element={<SubscriptionPage />} />
        <Route path="/settings"       element={<SettingsPage />} />
        <Route path="/privacy"        element={<PrivacyPage />} />
        <Route path="/payment"        element={<PaymentPage />} />
        <Route path="/scripts"        element={<ScriptsPage />} />
        <Route path="/ai-voice"       element={<AIVoicePage />} />
        <Route path="/player"         element={<PlayerPage />} />
        <Route path="/chat"           element={<ChatPage />} />
        <Route path="/help"           element={<HelpCenterPage />} />

        {/* 兜底 */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AppProvider>
  )
}
