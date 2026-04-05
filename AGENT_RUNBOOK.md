# Frontend Agent 工作手册

## 目标

本轮目标是在前端仓库 `F:\Smart-Finance-Dashboard-front` 中，以双 Agent 模式完成第四阶段 UI 视觉与体验收口，重点解决三类问题：

1. 页面视觉对齐与首页横向滚动条
2. 按钮位置、主次层级与操作密度
3. 用户不该看到的内部信息、联调说明与技术术语

## 建议工作目录与分支

### Agent-1

- 工作目录：`F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-1-stage4`
- 分支：`feature/agent-1-front-stage4-home-budget-polish`
- 任务范围：
  - `src/views/DashboardView.vue`
  - `src/views/BudgetsView.vue`
  - `src/views/dashboard/**`
  - `src/views/budgets/**`

### Agent-2

- 工作目录：`F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-2-stage4`
- 分支：`feature/agent-2-front-stage4-flow-rule-polish`
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
- `src/utils/**`
- `TASKS.md`
- `FILE_OWNERSHIP.md`
- `AGENT_RUNBOOK.md`

## 本轮设计收口标准

- 不暴露任务编号、Agent 标识、接口术语、字段解释和联调说明
- 页面文案要面向最终用户，不解释实现细节
- 任何页面不得出现整页横向滚动条
- Hero、筛选区、卡片区、表格区左右边界要统一
- 按钮主次分明，提交按钮唯一主焦点

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

当前目录固定为：F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-1-stage4
当前分支固定为：feature/agent-1-front-stage4-home-budget-polish

先读取以下文件并严格遵守：
- F:\Smart-Finance-Dashboard-front\TASKS.md
- F:\Smart-Finance-Dashboard-front\FILE_OWNERSHIP.md
- F:\Smart-Finance-Dashboard-front\AGENT_RUNBOOK.md

你本轮只负责前端第四阶段中的 Agent-1 任务：
- A1-51 首页对齐与滚动条
- A1-52 看板与预算按钮收口
- A1-53 用户文案清理
- A1-54 页面局部视觉收口
- A1-55 提交收口

你的允许修改范围仅限：
- src/views/DashboardView.vue
- src/views/BudgetsView.vue
- src/views/dashboard/**
- src/views/budgets/**

默认禁止修改任何共享文件，尤其是：
- src/layouts/**
- src/components/**
- src/style.css
- src/api/**
- src/types/**
- src/router/**
- src/utils/**

本轮重点目标：
- 修掉首页底部横向滚动条
- 统一 dashboard / budgets 页按钮位置和主次层级
- 删除用户可见的 Agent 标识、任务编号、query/字段说明、联调说明

如果你认为必须调整共享布局、共享样式、共享组件或共享文案，先不要改代码，先按以下模板发 CONTRACT_CHANGE：

[CONTRACT_CHANGE] From: Agent-1
Branch: feature/agent-1-front-stage4-home-budget-polish
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

当前目录固定为：F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-2-stage4
当前分支固定为：feature/agent-2-front-stage4-flow-rule-polish

先读取以下文件并严格遵守：
- F:\Smart-Finance-Dashboard-front\TASKS.md
- F:\Smart-Finance-Dashboard-front\FILE_OWNERSHIP.md
- F:\Smart-Finance-Dashboard-front\AGENT_RUNBOOK.md

你本轮只负责前端第四阶段中的 Agent-2 任务：
- A2-51 导入/流水/规则文案清理
- A2-52 按钮与工具条收口
- A2-53 列表与溢出修复
- A2-54 页面局部视觉收口
- A2-55 提交收口

你的允许修改范围仅限：
- src/views/ImportsView.vue
- src/views/TransactionsView.vue
- src/views/RulesView.vue
- src/views/imports/**
- src/views/transactions/**
- src/views/rules/**

默认禁止修改任何共享文件，尤其是：
- src/layouts/**
- src/components/**
- src/style.css
- src/api/**
- src/types/**
- src/router/**
- src/utils/**

本轮重点目标：
- 删除 imports / transactions / rules 页面的内部技术信息与联调文案
- 优化 Hero、筛选区、列表工具条、弹窗按钮位置
- 修复列表区和分页区的潜在横向溢出与信息拥挤问题

如果你认为必须调整共享布局、共享样式、共享组件或共享文案，先不要改代码，先按以下模板发 CONTRACT_CHANGE：

[CONTRACT_CHANGE] From: Agent-2
Branch: feature/agent-2-front-stage4-flow-rule-polish
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
