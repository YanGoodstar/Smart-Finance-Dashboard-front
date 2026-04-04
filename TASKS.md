# 任务看板

## 当前阶段

- 当前阶段：前端第一阶段主界面接后端接口
- 阶段目标：打通“看板、导入、流水、预算、规则”五个前端页面，与既有后端接口形成可联调的 Web 主界面闭环
- 基线分支：`yan`
- Agent 分支：
  - `feature/agent-1-front-dashboard-budget`
  - `feature/agent-2-front-imports-transactions-rules`
- Agent 工作树：
  - `F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-1`
  - `F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-2`
- 当前仓库范围：仅前端
- 本阶段约束：
  - 延续后端双 Agent 协作方式，由架构师统一调度、冻结共享边界并最终集成
  - 本阶段优先完成页面主链路、接口联通、交互闭环和基础视觉，不把测试作为首批阻塞项
  - 不允许本阶段 Agent 擅自修改后端契约；若发现后端接口与前端实现不匹配，先发 `BLOCKER` 或 `CONTRACT_CHANGE`
  - `postman/` 不在本仓库范围内，本阶段不维护任何 Postman 文件

## 当前前端基线

- 已完成 `Vue 3 + Vite + TypeScript` 前端工程初始化
- 已完成 `Element Plus`、`Pinia`、`Axios`、`Vue Router`、`ECharts` 依赖接入
- 已完成 Vite 开发代理：`/api -> http://localhost:8080`
- 已完成全局样式基线、主布局、侧边栏、API 请求层、类型层和图表基础组件
- 已冻结首批页面路由：
  - `/dashboard`
  - `/imports`
  - `/transactions`
  - `/budgets`
  - `/rules`

## 前端第一阶段全局任务看板

| ID | 模块 | 任务 | 负责人 | 分支 | 状态 | 依赖 | 预计耗时 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ARC-41 | 共享契约 | 冻结前端页面范围、路由入口、共享 API / type / layout 边界以及页面交互口径 | Architect | `yan` | todo | none | 0.25d |
| ARC-42 | 集成验证 | 合并双分支、解决共享样式与路由冲突、执行前端构建验证与联调收口 | Architect | `yan` | todo | A1-45, A2-45 | 0.5d |
| ARC-43 | 共享壳层 | 维护主布局、共享组件、共享工具、API 层、router 和全局样式，处理跨页面收口 | Architect | `yan` | todo | ARC-41 | 0.5d |
| A1-41 | 看板页面 | 实现 `DashboardView.vue`，打通筛选表单、概览卡片、趋势图、分类图、预算提醒、未分类摘要、最近流水 | Agent-1 | `feature/agent-1-front-dashboard-budget` | todo | ARC-41 | 1.0d |
| A1-42 | 预算页面 | 实现 `BudgetsView.vue`，打通预算创建、预算列表、预算进度、预警等级和分类预算展示 | Agent-1 | `feature/agent-1-front-dashboard-budget` | todo | ARC-41 | 1.0d |
| A1-43 | 页面局部组件 | 若 dashboard / budgets 需要新增局部组件，只能放到页面私有目录中，不得直接修改共享组件 | Agent-1 | `feature/agent-1-front-dashboard-budget` | todo | A1-41, A1-42 | 0.5d |
| A1-44 | 查询态同步 | 为 dashboard / budgets 页面补齐默认时间范围、路由 query 同步、空态和错误态 | Agent-1 | `feature/agent-1-front-dashboard-budget` | todo | A1-41, A1-42 | 0.5d |
| A1-45 | 提交收口 | 自查 `git diff`，完成本分支提交并上报状态、文件列表和提交哈希 | Agent-1 | `feature/agent-1-front-dashboard-budget` | todo | A1-43, A1-44 | 0.25d |
| A2-41 | 导入页面 | 实现 `ImportsView.vue`，打通文件上传、来源类型选择、导入任务列表和任务详情展示 | Agent-2 | `feature/agent-2-front-imports-transactions-rules` | todo | ARC-41 | 0.75d |
| A2-42 | 流水页面 | 实现 `TransactionsView.vue`，打通交易筛选、分页、分类来源显示、疑似重复提示和分类修正对话框 | Agent-2 | `feature/agent-2-front-imports-transactions-rules` | todo | ARC-41 | 1.0d |
| A2-43 | 规则页面 | 实现 `RulesView.vue`，打通规则列表、启用过滤、新增、编辑和删除交互 | Agent-2 | `feature/agent-2-front-imports-transactions-rules` | todo | ARC-41 | 0.75d |
| A2-44 | 页面局部组件 | 若 imports / transactions / rules 需要新增局部组件，只能放到页面私有目录中，不得直接修改共享组件 | Agent-2 | `feature/agent-2-front-imports-transactions-rules` | todo | A2-41, A2-42, A2-43 | 0.5d |
| A2-45 | 提交收口 | 自查 `git diff`，完成本分支提交并上报状态、文件列表和提交哈希 | Agent-2 | `feature/agent-2-front-imports-transactions-rules` | todo | A2-44 | 0.25d |

## 冻结的前端共享契约

### 页面与路由契约

- 本阶段页面入口固定为：
  - `/dashboard`
  - `/imports`
  - `/transactions`
  - `/budgets`
  - `/rules`
- 不新增新的一级页面路由
- 不调整 `MainLayout` 作为五个页面共用壳层的方案

### 后端接口消费边界

- 前端统一复用 `src/api/**` 中的请求封装
- 本阶段不允许 Agent 直接在页面中写裸 `axios` 请求
- 后端通用返回结构固定为：
  - `success`
  - `code`
  - `message`
  - `data`
- Vite 开发代理固定为：
  - `/api -> http://localhost:8080`

### 交易筛选语义

- `dashboard`、`transactions`、`budgets/progress` 继续复用同一套筛选语义：
  - `page`
  - `size`
  - `dateFrom`
  - `dateTo`
  - `finalCategory`
  - `categorySource`
  - `keyword`
- 默认联调日期口径优先使用上月范围，兼容当前样例数据

### 导入与预算展示语义

- 导入来源类型冻结为：
  - `ALIPAY_CSV`
  - `WECHAT_CSV`
- 总预算对外展示语义冻结为：
  - `category = null` 时，页面显示为“总预算”
- 预算预警等级冻结为：
  - `NORMAL`
  - `NEAR_LIMIT`
  - `OVER_BUDGET`

### 本阶段非目标

- 不做登录鉴权页面
- 不做权限系统
- 不做国际化
- 不做 SSR
- 不改后端接口语义

## 依赖协调规则

1. 架构师先冻结页面范围、共享 API / type / layout 边界，Agent 再开始编码。
2. Agent-1 只负责 `dashboard` 和 `budgets` 页面，不得修改 `imports`、`transactions`、`rules` 页面。
3. Agent-2 只负责 `imports`、`transactions`、`rules` 页面，不得修改 `dashboard`、`budgets` 页面。
4. 两个 Agent 默认都不得修改：
   - `src/api/**`
   - `src/types/**`
   - `src/router/**`
   - `src/layouts/**`
   - `src/components/**`
   - `src/style.css`
5. 如果确需改共享文件，必须先发 `CONTRACT_CHANGE`，由架构师决定是否授权。
6. 页面专属组件必须优先放入各自页面私有目录，避免直接占用共享组件目录。

## 通信协议

### 消息类型

- `INFO`：非阻塞进度同步
- `BLOCKER`：当前任务无法继续，需要协调
- `CONTRACT_CHANGE`：共享 API、共享类型、共享样式、共享组件、路由或跨页面边界需要变更

### 消息模板

```text
[TYPE] From: <Agent-1|Agent-2>
Branch: <branch-name>
Module: <module-name>
Need: <需要什么 / 改了什么>
Impact: <影响哪些文件、模块或契约>
Requested By: <date-time>
```

### 路由规则

1. Agent 之间不直接跨模块沟通，统一先发给架构师。
2. 架构师负责判断消息是普通同步、阻塞问题还是共享契约变更。
3. 如果涉及共享契约，架构师必须先更新 `TASKS.md` 和 `FILE_OWNERSHIP.md`，再转发调度指令。
4. `BLOCKER` 优先级高于 `INFO`。

## 执行说明

- Agent-1 负责看板页和预算页主链路，以及仅属于这两个页面的局部组件。
- Agent-2 负责导入页、流水页、规则页主链路，以及仅属于这三个页面的局部组件。
- 架构师负责共享组件、共享样式、请求层、类型层、路由层和最终集成。
- 未经锁移交批准，任何 Agent 不得修改：
  - `package.json`
  - `package-lock.json`
  - `vite.config.ts`
  - `tsconfig*.json`
  - `src/main.ts`
  - `src/App.vue`
  - `src/router/**`
  - `src/api/**`
  - `src/types/**`
  - `src/layouts/**`
  - `src/components/**`
  - `src/style.css`
