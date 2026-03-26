# 波波Nice - 情绪陪伴 Demo

情趣用品配套的情感陪伴 APP 概念 Demo。通过【角色 + 场景】的选择，营造情绪陪伴与互动体验。

## 说明

- **仅做 Demo 展示**：所有与硬件/情趣玩具的交互为模拟
- 无真实蓝牙、后端、语音模型
- 重点在沉浸感与可感知反馈
- 代码结构便于未来接入真实接口

## 技术栈

- React 18 + Vite 5
- React Router 6
- 纯 CSS 动画（无复杂依赖）

## 快速开始

```bash
npm install
npm run dev
```

## 真实 API 部署

当前仓库包含两部分：

- 前端：Vite 静态站点
- 后端：Express API，入口在 `server/index.js`

如果你把前端直接发到 GitHub Pages、Netlify、Vercel 静态托管，而没有单独部署 `server/`，那么以下请求一定会失败：

- `POST /api/lover/message`
- `POST /api/health/plan`
- `GET /api/community/posts`

这类场景下出现 `405` 不是前端代码坏了，而是静态站点本身没有后端路由。

### 推荐部署方式

1. 把前端部署到 GitHub Pages / Netlify / Vercel 中任意一个
2. 把 `server/` 单独部署到 Railway / Render / Fly.io 等支持 Node.js 的平台
3. 在前端构建环境变量中设置：

`VITE_API_BASE_URL=https://你的后端域名`

4. 在后端环境变量中设置：

`GROK_API_KEY=你的xAI密钥`

`PORT=3102`

`CORS_ALLOW_ORIGINS=https://你的前端域名`

说明：

- `CORS_ALLOW_ORIGINS` 支持逗号分隔多个来源，示例：`https://a.app,https://b.app`
- 若前端未设置 `VITE_API_BASE_URL`，默认只适用于本地开发时的相对路径 `/api` + Vite 代理
- GitHub Pages 不能直接运行 `server/index.js`

### GitHub Pages 接真实 API

如果前端发布在 GitHub Pages，例如：

`https://haoranwang799.github.io/your-s-her-1.1/`

那么后端必须是单独域名，例如：

`https://your-s-her-api-production.up.railway.app`

此时前端生产环境变量必须设置为：

`VITE_API_BASE_URL=https://your-s-her-11-production.up.railway.app`

后端的 `CORS_ALLOW_ORIGINS` 必须包含你的 GitHub Pages 域名：

`CORS_ALLOW_ORIGINS=https://haoranwang799.github.io`

注意：如果后端只允许主域名，而前端运行在 GitHub Pages 子路径下，`origin` 仍然是 `https://haoranwang799.github.io`，不是完整路径。

### 当前仓库默认生产配置

当前仓库已经内置生产环境 API 基地址：

`VITE_API_BASE_URL=https://your-s-her-11-production.up.railway.app`

因此重新构建前端后，生产环境请求会直接发往：

- `https://your-s-her-11-production.up.railway.app/api/lover/message`
- `https://your-s-her-11-production.up.railway.app/api/health/plan`
- `https://your-s-her-11-production.up.railway.app/api/community/posts`

本地开发仍然保留相对路径 `/api/...`，由 Vite 代理转发。

## 页面流程

1. **欢迎页** → 2. **角色选择** → 3. **场景选择** → 4. **互动页**

未选择角色与场景不可进入互动页。

## 扩展预留

代码中已预留以下 TODO 注释，便于后续接入：

- `// TODO: Replace with real LLM API`
- `// TODO: Replace with real Bluetooth API`
- `// TODO: Replace with real Speech-to-Text API`
- `// TODO: Add user account & intimacy persistence`

## 项目结构

```
src/
├── api/mock.js          # 模拟接口（语音、LLM、蓝牙）
├── data/
│   ├── characters.js    # 角色配置
│   ├── scenes.js        # 场景配置
│   └── constants.js     # 常量
├── components/          # 通用组件
├── pages/               # 页面
└── styles/              # 样式
```
