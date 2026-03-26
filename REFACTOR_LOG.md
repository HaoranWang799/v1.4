# 系统能力恢复日志

## 概述
从 UI Shell 状态恢复为真实产品架构。过程中禁止删除文件，只改为恢复能力。Mock 仅作为 fallback，不是主流程。

---

## 阶段 1：前端统一请求层 ✅ IN PROGRESS

### 1.1 创建 `src/api/client.js`
统一的 HTTP 客户端，支持：
- 自动添加 baseUrl 和 headers
- Grok API Key 自动注入
- 统一错误处理
- 请求/响应日志
- 超时配置
- Mock fallback 回调

**状态**：待创建

### 1.2 创建 `src/api/virtualLover.js`
虚拟恋人消息 API：
- 真实请求：`fetchVirtualLoverMessage()`
- 清空记忆：`clearVirtualLoverMemory()`
- Mock fallback：请求失败时返回本地 mock 数据

**状态**：待创建

### 1.3 创建 `src/api/healthPlan.js`
健康计划 API：
- 真实请求：`fetchHealthPlan(payload)`
- Mock fallback：请求失败时返回本地 seedPlans

**状态**：待创建

---

## 阶段 2：前端 Hooks 恢复为真实请求

### 2.1 恢复 `src/hooks/useVirtualLover.js`
改为真实 API 调用 + mock fallback
- ✅ 添加 `fetchVirtualLoverMessage` 调用
- ✅ 保留 mock 消息作为 fallback
- ✅ 恢复 `fetchVirtualLoverMemory` 实现

**状态**：待修改

### 2.2 恢复 `src/hooks/usePlanPool.js`
改为真实 API 调用 + mock fallback
- ✅ 添加 `fetchHealthPlan` 调用
- ✅ 保留本地 seedPlans 作为 fallback
- ✅ 恢复倒计时和 AI 结果展示

**状态**：待修改

---

## 阶段 3：后端架构分层

### 3.1 路由层 (`server/routes/`)
- ✅ lover.js - 虚拟恋人相关路由
- ✅ health.js - 健康计划相关路由

### 3.2 控制层 (`server/controllers/`)
- ✅ loverController.js - 消息、记忆清除逻辑分发
- ✅ healthController.js - 计划生成逻辑分发

### 3.3 服务层 (`server/services/`)
- ✅ loverService.js - 业务逻辑（记忆管理、消息编排）
- ✅ healthService.js - 业务逻辑（计划生成、数据整合）

### 3.4 提供者层 (`server/providers/`)
- ✅ grokProvider.js - Grok AI 调用（真实）
- ✅ mockProvider.js - Mock 数据生成（fallback）
- ✅ providerFactory.js - 提供者工厂，支持切换

### 3.5 配置与中间件
- ✅ config/providers.js - 提供者配置
- ✅ config/constants.js - 常量定义
- ✅ config/errors.js - 错误类型定义
- ✅ middleware/errorHandler.js - 统一错误处理
- ✅ middleware/logger.js - 请求日志

**状态**：待创建

---

## 阶段 4：验证与集成

### 4.1 测试路径
- [ ] 前端 useVirtualLover 调用真实 API
- [ ] 前端 usePlanPool 调用真实 API  
- [ ] Mock fallback 工作正常
- [ ] 后端错误处理完整

### 4.2 业务验证
- [ ] 虚拟恋人消息流
- [ ] 健康计划生成流
- [ ] 记忆清除流

---

## 核心原则

1. ⛔ **禁止删除代码** - 只改为真实实现
2. 🎯 **Mock 仅为 fallback** - 失败时才调用
3. 📋 **真实调用为主流程** - 前端 → 后端 → Provider
4. 🔄 **Provider 可切换** - 支持 Grok/Mock 切换
5. 📝 **完整分层** - routes → controllers → services → providers
6. 🛡️ **统一错误处理** - 中间件捕获所有错误
7. 🎨 **UI 不变** - 页面结构、样式、素材完全保留

---

## 进度追踪

| 项 | 状态 | 完成时间 | 
|----|------|---------|
| 前端 client.js | ⏳ | - |
| 前端 virtualLover.js | ⏳ | - |
| 前端 healthPlan.js | ⏳ | - |
| useVirtualLover 修改 | ⏳ | - |
| usePlanPool 修改 | ⏳ | - |
| 后端 routes 重构 | ⏳ | - |
| 后端 controllers | ⏳ | - |
| 后端 services | ⏳ | - |
| 后端 providers | ⏳ | - |
| 错误处理中间件 | ⏳ | - |
| 集成测试验证 | ⏳ | - |

