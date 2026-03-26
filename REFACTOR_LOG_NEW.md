# 🚀 REFACTOR_LOG — 架构恢复进度追踪

当前状态：**Phase 3.6 完成！** 后端分层架构已建成

---

## 📋 Progress Summary

| Phase | Task | Status | Files |
|-------|------|--------|-------|
| 1 | Frontend 统一 HTTP 客户端 | ✅ | src/api/client.js |
| 2 | Frontend API 合约层 | ✅ | src/api/virtualLover.js, healthPlan.js |
| 2.5 | Frontend Hooks 恢复真实调用 | ✅ | src/hooks/useVirtualLover.js, usePlanPool.js |
| 3 | Frontend Pages 连接 Real Hooks | ✅ | src/pages/HealthPage.jsx, healthData.js |
| 3.1 | Backend Config & Middleware | ✅ | server/config/errors.js, providers.js, middleware/errorHandler.js |
| 3.2 | Backend Providers 工厂 | ✅ | server/providers/providerFactory.js |
| 3.3 | Backend Services 业务逻辑 | ✅ | server/services/loverService.js, healthService.js |
| 3.4 | Backend Controllers 请求处理 | ✅ | server/controllers/loverController.js, healthController.js |
| 3.5 | Backend Routes 路由定义 | ✅ | server/routes/lover.js, health.js |
| 3.6 | Backend 主入口整合 | ✅ | server/index.js 重写 |
| 4 | 构建验证 & 集成测试 | 🟨 | - |

---

## 📦 Completed Phases

### Phase 1: Frontend HTTP 客户端
**目标**: 统一的 HTTP 请求层，支持重试/超时/降级  
**完成状态**: ✅ 完成

- ✅ `src/api/client.js` - 自动注入 Grok API Key，支持重试策略，15s 默认超时

### Phase 2: Frontend API 合约
**目标**: 真实 API 调用 + Mock 自动降级  
**完成状态**: ✅ 完成

- ✅ `src/api/virtualLover.js` - POST /api/lover/message 调用 + Mock 降级
- ✅ `src/api/healthPlan.js` - POST /api/health/plan 调用 + Mock 降级

### Phase 2.5: Frontend Hooks 恢复
**目标**: Hooks 从纯 Mock 恢复到真实 API 调用  
**完成状态**: ✅ 完成

- ✅ `src/hooks/useVirtualLover.js` - 真实 API + Mock 降级 + 加载状态
- ✅ `src/hooks/usePlanPool.js` - 真实 API + 并行加载策略 + Mock 降级

### Phase 3: Frontend Pages 集成
**目标**: Pages 连接到恢复的真实 Hooks  
**完成状态**: ✅ 完成

- ✅ `src/pages/HealthPage.jsx` - 支持真实 API 调用
- ✅ `src/data/healthData.js` - 恢复 buildHealthPlanPayload()

### Phase 3.1: Backend 基础配置
**目标**: 错误类、Provider 配置、中间件  
**完成状态**: ✅ 完成

- ✅ `server/config/errors.js` - 6 个自定义错误类 (AppError, ValidationError, NotFoundError, AuthError, ProviderError, TimeoutError)
- ✅ `server/config/providers.js` - Provider 策略配置、超时管理
- ✅ `server/middleware/errorHandler.js` - 全局错误处理、asyncHandler 包装

### Phase 3.2: Backend Provider 工厂
**目标**: Provider 工厂模式，支持 Grok/Mock 切换  
**完成状态**: ✅ 完成

- ✅ `server/providers/providerFactory.js`
  - `getProvider(name)` - 获取指定 provider
  - `callProvider(name, method, args, timeout)` - 调用 provider + 超时处理
  - `callProviderWithFallback(primaryName, fallbackName, ...)` - 自动降级

### Phase 3.3: Backend 服务层
**目标**: 业务逻辑分离，调用 Provider  
**完成状态**: ✅ 完成

- ✅ `server/services/loverService.js`
  - `generateMessage(userMessage, forceRefresh, context)` - 调用 provider 生成消息
  - `clearMemory()` - 清空缓存记忆
  - `getMemoryStats()` - 获取记忆统计

- ✅ `server/services/healthService.js`
  - `generateHealthPlan(payload)` - 调用 provider 生成计划
  - `getTodayHealthScore(stats)` - 计算今日健康评分

### Phase 3.4: Backend 控制器层
**目标**: HTTP 请求处理，不写业务逻辑  
**完成状态**: ✅ 完成

- ✅ `server/controllers/loverController.js`
  - `handlePostMessage(req, res, next)` - POST /api/lover/message
  - `handleDeleteMemory(req, res, next)` - DELETE /api/lover/memory

- ✅ `server/controllers/healthController.js`
  - `handlePostPlan(req, res, next)` - POST /api/health/plan
  - `handlePostScore(req, res, next)` - POST /api/health/score

### Phase 3.5: Backend 路由层
**目标**: 路由定义，分发到 Controller  
**完成状态**: ✅ 完成

- ✅ `server/routes/lover.js` - POST /message, DELETE /memory
- ✅ `server/routes/health.js` - POST /plan, POST /score

### Phase 3.6: Backend 主入口整合
**目标**: 整合所有层级，重写 server/index.js  
**完成状态**: ✅ 完成

- ✅ `server/index.js` 重写为新分层架构
  - 导入新的 errorHandler 中间件
  - 导入新的 /api/lover 和 /api/health 路由
  - 删除旧的内联路由逻辑

---

## 🏗️ Architecture Layers

```
Frontend:
  Pages (react-router)
    ↓
  Hooks (useVirtualLover, usePlanPool) [真实调用]
    ↓
  API Contracts (src/api/virtualLover, healthPlan)
    ↓
  HTTP Client (client.js) [重试+超时+降级]
    ↓
  Backend HTTP

Backend:
  Routes (server/routes/lover, health) [HTTP入口]
    ↓
  Controllers (server/controllers/loverController, healthController) [请求处理]
    ↓
  Services (server/services/loverService, healthService) [业务逻辑]
    ↓
  Providers (server/providers/providerFactory) [Provider工厂]
    ↓
  AI Engines (grokProvider, mockProvider) [真实/降级]
```

---

## 🔑 Key Architecture Principles

1. **真实优先，Mock 降级**
   - 系统主流程使用真实 API 调用
   - 网络失败/超时才自动降级到 Mock
   - 不再以 Mock 为默认实现

2. **分层清晰职责**
   - Routes: 只负责 HTTP 路由定义
   - Controllers: 只负责请求参数验证和响应格式化
   - Services: 负责业务逻辑和 provider 调用
   - Providers: 负责具体实现（Grok API 或 Mock 数据）

3. **Provider 可切换**
   - 支持 'grok' (真实) 和 'mock' (降级)
   - 通过 providerFactory 统一管理
   - 环境变量控制默认 Provider

4. **错误统一处理**
   - 6 个自定义错误类
   - 所有 API 响应格式一致 `{ ok, data/error }`
   - 自动降级到 Mock 而不是直接报错

---

## 📝 Call Chain Example

```
请求链路示例：

1. Frontend React Hook 调用
   useVirtualLover.js → fetchVirtualLoverMessage(message)

2. HTTP 请求到后端
   src/api/client.js → POST /api/lover/message + Grok API Key

3. Backend 路由分发
   server/routes/lover.js → router.post('/message', handlePostMessage)

4. Controller 处理请求
   server/controllers/loverController.js → handlePostMessage()
     ↓
   验证 message 字段

5. Service 业务逻辑
   server/services/loverService.js → generateMessage(message, forceRefresh)
     ↓
   检查缓存 (loverCache)

6. Provider 工厂选择
   server/providers/providerFactory.js → callProviderWithFallback('grok', 'mock', ...)
     ↓
   尝试 Grok Provider (15s 超时)
     ↓
   如果失败，自动降级到 Mock Provider (5s 超时)

7. 返回响应
   { 
     ok: true,
     data: {
       message: "...",
       mood: "...",
       _provider: "grok" | "mock",
       _fallback: false | true,
       timestamp: "2025-..."
     }
   }
```

---

## ✨ Implementation Details

### Provider Factory Pattern
```javascript
// 调用 provider 自动降级
const result = await callProviderWithFallback(
  'grok',           // primary provider
  'mock',           // fallback provider
  'generateMessage', // 方法名
  [userMessage, context], // 参数
  { primaryTimeout: 15000, fallbackTimeout: 5000 }
)

// 返回会包含 _provider 和 _fallback 标记
```

### Service 示例
```javascript
// loverService.js
export async function generateMessage(userMessage, forceRefresh = false, context = {}) {
  // 1. 验证参数
  // 2. 检查缓存
  // 3. 调用 provider（自动降级）
  // 4. 缓存结果
  // 5. 返回结果
}
```

### Error Handling
```javascript
// 所有错误都会被 errorHandler 中间件捕获
// 自动转换为标准格式
{
  ok: false,
  error: {
    message: "...",
    code: "PROVIDER_ERROR" | "VALIDATION_ERROR" | etc,
    statusCode: 400 | 500 | ...,
    timestamp: "2025-..."
  }
}
```

---

## 🎯 Next Steps (Phase 4)

⏳ **Remaining Work:**

1. **创建实际 Provider 实现**（未在此轮实现）
   - `server/providers/grokProvider.js` - 实现真实 Grok API 调用
   - `server/providers/mockProvider.js` - 实现 Mock 数据提供

2. **构建验证**
   - 运行 `npx vite build` 确保前端无错误
   - 启动 `npm run dev` 和 `node server/index.js` 测试

3. **端到端集成测试**
   - 测试完整的前后端调用链
   - 验证 Provider 自动降级
   - 验证错误处理

4. **文档更新**
   - 更新 README.md 说明新的架构
   - 添加 API 请求示例

---

## 📊 Current State

✅ **已完成的工作:**
- 前端统一 HTTP 客户端（request.js）
- 前端 API 合约层（virtualLover.js, healthPlan.js）
- 前端 Hooks 恢复（useVirtualLover.js, usePlanPool.js）
- 前端 Pages 集成（HealthPage.jsx）
- 后端完整分层架构（routes → controllers → services → providers）
- 后端错误处理和中间件
- 后端 Provider 工厂（支持自动降级）

🟨 **尚需完成的工作:**
- 实现 Grok Provider（调用真实 Grok API）
- 实现 Mock Provider（提供 Mock 数据）
- 构建验证和集成测试

🔴 **待决策:**
- 前端是否需要 InteractionPage 等其他页面的 Hook 恢复
- 后端是否需要更多的服务和 API 端点

