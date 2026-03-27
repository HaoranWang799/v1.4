/**
 * AppContext.jsx — 全局应用状态
 *
 * 提供：
 *   • coins / setCoins       金币余额
 *   • diamonds / setDiamonds 钻石余额
 *   • userLevel / setUserLevel 会员等级（'心动会员' | '热恋会员' | '灵魂伴侣'）
 *
 * 使用：
 *   - Layout 读取后通过 <Outlet context> 下发给子页面
 *   - RechargePage（在 Layout 路由外）直接通过 useApp() 读取
 *
 * TODO: 替换为后端用户账户 API 同步（/api/user/wallet、/api/user/membership）
 */
import { createContext, useContext, useState } from 'react'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  // TODO: 接入 /api/user/wallet 获取真实余额
  const [coins,    setCoins]    = useState(1288)
  const [diamonds, setDiamonds] = useState(320)

  // TODO: 接入 /api/user/membership 获取真实会员等级
  const [userLevel, setUserLevel] = useState('心动会员')

  // 全局 Toast
  const [toastMessage, setToastMessage] = useState(null)
  const showToast  = (msg) => setToastMessage(msg)
  const clearToast = ()    => setToastMessage(null)

  return (
    <AppContext.Provider value={{
      coins, setCoins,
      diamonds, setDiamonds,
      userLevel, setUserLevel,
      toastMessage, showToast, clearToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

/** 快捷 Hook */
export function useApp() {
  return useContext(AppContext)
}
