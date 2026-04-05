# 任务看板

## 当前阶段

- 当前阶段：前端第四阶段 UI 视觉与体验收口
- 阶段目标：完成五个主页面的用户态收口，重点解决首页对齐与横向滚动、按钮位置与主次层级、页面中暴露给用户的内部技术信息
- 基线分支：`yan`
- 建议 Agent 分支：
  - `feature/agent-1-front-stage4-home-budget-polish`
  - `feature/agent-2-front-stage4-flow-rule-polish`
- 建议 Agent 工作树：
  - `F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-1-stage4`
  - `F:\Smart-Finance-Dashboard-front\.worktrees\front-agent-2-stage4`
- 当前仓库范围：仅前端
- 本阶段约束：
  - 延续双 Agent 并行方式，由架构师统一冻结共享视觉边界并做最终集成
  - 本阶段不新增业务功能，不改后端接口语义，不扩展新页面
  - 优先修复用户可见问题，不把“技术上能跑”当成交付标准
  - 一切文案、布局、按钮、表格、提示信息都以“用户态可见性”作为判断标准
  - 不允许页面暴露任务编号、Agent 信息、query 字段、接口字段解释等内部实现细节

## 当前前端基线

- 五个主页面已接通后端接口：
  - `/dashboard`
  - `/imports`
  - `/transactions`
  - `/budgets`
  - `/rules`
- 生产构建已通过：`npm run build`
- 当前主要剩余问题集中在：
  - 首页下方横向滚动条
  - 页面模块左右边界与按钮位置不一致
  - 页面上存在内部信息、联调说明、字段说明、任务编号等不该暴露给用户的内容

## 前端第四阶段全局任务看板

| ID | 模块 | 任务 | 负责人 | 分支 | 状态 | 依赖 | 预计耗时 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ARC-51 | 共享视觉契约 | 冻结本轮视觉收口边界，统一页面标题、按钮层级、用户文案和技术信息隐藏规则 | Architect | `yan` | todo | none | 0.25d |
| ARC-52 | 共享壳层收口 | 维护主布局、侧边栏、共享组件、全局样式和全局文案策略，兜底页面对齐与按钮规则 | Architect | `yan` | todo | ARC-51 | 0.5d |
| ARC-53 | 最终验收 | 合并双分支，执行构建与手工验收，确认无横向滚动、无内部信息泄漏、无明显按钮错位 | Architect | `yan` | todo | A1-55, A2-55 | 0.5d |
| A1-51 | 首页对齐与滚动条 | 解决 dashboard 首页模块左右边界不齐、图表区与表格区对齐问题，以及首页底部横向滚动条问题 | Agent-1 | `feature/agent-1-front-stage4-home-budget-polish` | todo | ARC-51 | 1.0d |
| A1-52 | 看板与预算按钮收口 | 统一 dashboard / budgets 页按钮位置、主次层级、移动端堆叠规则和操作区间距 | Agent-1 | `feature/agent-1-front-stage4-home-budget-polish` | todo | A1-51 | 0.75d |
| A1-53 | 用户文案清理 | 清理 dashboard / budgets 范围内的 Agent 标识、任务编号、query/字段说明、联调语气与技术表述 | Agent-1 | `feature/agent-1-front-stage4-home-budget-polish` | todo | ARC-51 | 0.75d |
| A1-54 | 页面局部视觉收口 | 优化 dashboard / budgets 私有组件中的卡片密度、留白、表格容器、空态和信息层级 | Agent-1 | `feature/agent-1-front-stage4-home-budget-polish` | todo | A1-52, A1-53 | 0.75d |
| A1-55 | 提交收口 | 自查 diff、确认本分支仅包含 Agent-1 范围文件、完成提交并上报哈希与风险 | Agent-1 | `feature/agent-1-front-stage4-home-budget-polish` | todo | A1-54 | 0.25d |
| A2-51 | 导入/流水/规则文案清理 | 清理 imports / transactions / rules 范围内的 Agent 标识、任务编号、接口字段解释、联调说明与技术文案 | Agent-2 | `feature/agent-2-front-stage4-flow-rule-polish` | todo | ARC-51 | 0.75d |
| A2-52 | 按钮与工具条收口 | 统一 imports / transactions / rules 页 Hero 按钮、筛选区、列表工具条和弹窗按钮位置 | Agent-2 | `feature/agent-2-front-stage4-flow-rule-polish` | todo | A2-51 | 0.75d |
| A2-53 | 列表与溢出修复 | 修复 imports / transactions / rules 页表格区、分页区、卡片区的对齐和潜在横向溢出问题 | Agent-2 | `feature/agent-2-front-stage4-flow-rule-polish` | todo | ARC-51 | 0.75d |
| A2-54 | 页面局部视觉收口 | 收敛 imports / transactions / rules 私有组件中的信息层级、标签密度、用户态提示与空态表现 | Agent-2 | `feature/agent-2-front-stage4-flow-rule-polish` | todo | A2-52, A2-53 | 0.75d |
| A2-55 | 提交收口 | 自查 diff、确认本分支仅包含 Agent-2 范围文件、完成提交并上报哈希与风险 | Agent-2 | `feature/agent-2-front-stage4-flow-rule-polish` | todo | A2-54 | 0.25d |

## 冻结的前端第四阶段共享契约

### 用户态可见性契约

- 页面上不得出现以下内部信息：
  - `Agent-1`、`Agent-2`
  - `A1-xx`、`A2-xx`
  - `query`
  - `page/size/dateFrom/dateTo`
  - `categorySource = MANUAL`
  - `API`
  - `total`
  - “联调期”“联调说明”“接口返回”等开发态提示
- 页面标题、说明文案、空态文案必须面向最终用户，不得解释系统实现方式

### 布局与对齐契约

- 五个页面统一使用当前 `MainLayout` 壳层，不新增新的一级布局
- 任何页面不得出现整页级别的横向滚动条
- 如表格确实过宽，只允许在表格局部容器内部横向滚动
- Hero、筛选区、卡片区、内容区左右边界应保持同一视觉线

### 按钮层级契约

- 每个页面只保留一个主按钮焦点，其他操作必须降级为次按钮、浅色按钮或文字按钮
- Hero 区操作遵循：
  - 主操作优先
  - 刷新类操作降级
  - 辅助信息不与按钮争夺视觉焦点
- 弹窗底部按钮遵循：
  - 取消在左
  - 提交在右
  - 提交按钮为唯一主按钮

### 非目标

- 不新增新功能
- 不新增新接口
- 不改后端逻辑
- 不做重设计或换主题
- 不做大规模重构

## 依赖协调规则

1. 架构师先冻结文案隐藏规则、按钮层级规则和全局对齐规则，Agent 再开始编码。
2. Agent-1 只负责 `dashboard`、`budgets` 页面和其私有目录，不得修改 `imports`、`transactions`、`rules` 页面。
3. Agent-2 只负责 `imports`、`transactions`、`rules` 页面和其私有目录，不得修改 `dashboard`、`budgets` 页面。
4. 两个 Agent 默认都不得修改：
   - `src/layouts/**`
   - `src/components/**`
   - `src/style.css`
   - `src/api/**`
   - `src/types/**`
   - `src/router/**`
   - `src/main.ts`
   - `src/App.vue`
5. 如确需修改共享文件，必须先发 `CONTRACT_CHANGE`，由架构师决定是否授权。
6. 页面私有组件优先在各自目录内收口，不得把本轮 UI 修复随意挪进共享层。

## 通信协议

### 消息类型

- `INFO`：非阻塞进度同步
- `BLOCKER`：当前任务无法继续，需要协调
- `CONTRACT_CHANGE`：共享布局、共享样式、共享组件、共享文案或跨页面边界需要变更

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

- Agent-1 负责首页与预算页的对齐、滚动、按钮和用户文案收口。
- Agent-2 负责导入、流水、规则页的对齐、按钮和用户文案收口。
- 架构师负责共享样式、共享组件、主布局、侧边栏、全局词汇和最终集成。
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
