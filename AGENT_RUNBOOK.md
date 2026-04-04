# Frontend Agent 工作手册

## 目标

本轮目标是在前端仓库 `F:\Smart-Finance-Dashboard-front` 中，按与后端相同的双 Agent 协作模式，并行完成五个主页面的前端实现和后端接口联调准备。

## 工作目录与分支

### Agent-1

- 工作目录：`F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-1`
- 分支：`feature/agent-1-front-dashboard-budget`
- 任务范围：
  - `src/views/DashboardView.vue`
  - `src/views/BudgetsView.vue`
  - `src/views/dashboard/**`
  - `src/views/budgets/**`

### Agent-2

- 工作目录：`F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-2`
- 分支：`feature/agent-2-front-imports-transactions-rules`
- 任务范围：
  - `src/views/ImportsView.vue`
  - `src/views/TransactionsView.vue`
  - `src/views/RulesView.vue`
  - `src/views/imports/**`
  - `src/views/transactions/**`
  - `src/views/rules/**`

## 默认禁止修改

除非架构师明确授权，否则两个 Agent 都不得修改：

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
- `TASKS.md`
- `FILE_OWNERSHIP.md`
- `AGENT_RUNBOOK.md`

## 输出要求

每次回报必须包含以下内容：

1. 当前目录
2. 当前分支
3. 当前任务编号
4. 已修改文件列表
5. 是否完成当前任务
6. 是否触发 `CONTRACT_CHANGE`
7. `git status --short` 原始输出

完成本轮后必须补充：

1. 最终任务完成列表
2. 最终修改文件列表
3. 当前分支名
4. 提交哈希
5. 是否还有未上报风险

## 消息模板

```text
[TYPE] From: <Agent-1|Agent-2>
Branch: <branch-name>
Module: <module-name>
Need: <需要什么 / 改了什么>
Impact: <影响哪些文件、模块或契约>
Requested By: <date-time>
```

## 启动文案

### 发给 Agent-1

```text
你在前端仓库工作，不是后端仓库。

当前目录固定为：F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-1
当前分支固定为：feature/agent-1-front-dashboard-budget

先读取以下文件并严格遵守：
- F:\Smart-Finance-Dashboard-front\TASKS.md
- F:\Smart-Finance-Dashboard-front\FILE_OWNERSHIP.md
- F:\Smart-Finance-Dashboard-front\AGENT_RUNBOOK.md

你本轮只负责前端第一阶段中的 Agent-1 任务：
- A1-41 看板页面
- A1-42 预算页面
- A1-43 页面局部组件
- A1-44 查询态同步
- A1-45 提交收口

你的允许修改范围仅限：
- src/views/DashboardView.vue
- src/views/BudgetsView.vue
- src/views/dashboard/**
- src/views/budgets/**

默认禁止修改任何共享文件，尤其是：
- src/api/**
- src/types/**
- src/router/**
- src/layouts/**
- src/components/**
- src/style.css

如果你认为必须调整共享 API、共享类型、共享组件、共享样式、路由或布局，先不要改代码，先按以下模板发 CONTRACT_CHANGE：

[CONTRACT_CHANGE] From: Agent-1
Branch: feature/agent-1-front-dashboard-budget
Module: <module-name>
Need: <需要什么 / 改了什么>
Impact: <影响哪些文件、模块或契约>
Requested By: <date-time>

先汇报：
1. 当前目录
2. 当前分支
3. 当前任务编号
4. 你准备修改的文件列表

然后开始开发。
完成后按 runbook 的输出要求做最终汇报，并给出提交哈希。
```

### 发给 Agent-2

```text
你在前端仓库工作，不是后端仓库。

当前目录固定为：F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-2
当前分支固定为：feature/agent-2-front-imports-transactions-rules

先读取以下文件并严格遵守：
- F:\Smart-Finance-Dashboard-front\TASKS.md
- F:\Smart-Finance-Dashboard-front\FILE_OWNERSHIP.md
- F:\Smart-Finance-Dashboard-front\AGENT_RUNBOOK.md

你本轮只负责前端第一阶段中的 Agent-2 任务：
- A2-41 导入页面
- A2-42 流水页面
- A2-43 规则页面
- A2-44 页面局部组件
- A2-45 提交收口

你的允许修改范围仅限：
- src/views/ImportsView.vue
- src/views/TransactionsView.vue
- src/views/RulesView.vue
- src/views/imports/**
- src/views/transactions/**
- src/views/rules/**

默认禁止修改任何共享文件，尤其是：
- src/api/**
- src/types/**
- src/router/**
- src/layouts/**
- src/components/**
- src/style.css

如果你认为必须调整共享 API、共享类型、共享组件、共享样式、路由或布局，先不要改代码，先按以下模板发 CONTRACT_CHANGE：

[CONTRACT_CHANGE] From: Agent-2
Branch: feature/agent-2-front-imports-transactions-rules
Module: <module-name>
Need: <需要什么 / 改了什么>
Impact: <影响哪些文件、模块或契约>
Requested By: <date-time>

先汇报：
1. 当前目录
2. 当前分支
3. 当前任务编号
4. 你准备修改的文件列表

然后开始开发。
完成后按 runbook 的输出要求做最终汇报，并给出提交哈希。
```
