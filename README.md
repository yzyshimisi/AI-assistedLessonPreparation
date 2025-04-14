# AI辅助的教师备课系统

## 项目概述

**AI辅助的教师备课系统** 是一个基于现代 Web 技术开发的智能教学辅助平台，旨在帮助教师高效完成备课工作。系统结合人工智能技术，提供智能教案生成、教学资源推荐、知识点图谱构建等功能，显著提升教师备课效率。

- **技术栈**：Vue3 + Vite + TypeScript + Pinia + axios + tailwindcss + element-plus + echarts + vue-hooks-plus + relation-graph-vue3 ...

- **项目类型**：2025年服务外包参赛项目

- **项目状态**：持续开发中

## 技术架构

```md
├── public/                  # 静态资源
├── src/
│   ├── apis/                # 接口文件
│   ├── assets/              # 静态资源
│   ├── components/          # 公共组件
│   ├── echarts/             # 公共组件
│   ├── interface/           # 接口类型
│   ├── router/              # 路由配置
│   ├── stores/              # Pinia状态管理
│   ├── themes/              # 全局样式
│   ├── views/               # 页面组件
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── vite.config.ts           # Vite配置
├── tsconfig.json            
├── tailwind.config.js       # tailwindcss配置文件
├── postcss.config.js        # tailwindcss配置文件
└── package.json             # 项目依赖
```

## 项目特点

1. **现代化前端架构**：
   
   - 基于 Vue3 的 Composition API 开发
   
   - 使用 Vite 实现极速开发体验
   
   - TypeScript 类型安全保证

2. **AI深度集成**：
   
   - 对接多种AI服务接口
   
   - 本地模型与云端服务混合部署
   
   - 智能缓存机制优化响应速度

3. **极致用户体验**：
   
   - 响应式设计适配多端
   
   - 交互细节精心打磨
   
   - 无障碍访问支持

## 安装与运行

```bash
# 克隆项目
git clone https://github.com/yzyshimisi/AI-assistedLessonPreparation.git

# 进入项目目录
cd AI-assistedLessonPreparation

# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build
```
