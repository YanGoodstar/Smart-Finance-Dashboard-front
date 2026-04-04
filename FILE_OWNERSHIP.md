# 文件归属与锁表

## 锁规则

- 锁状态值：`locked`、`shared-by-architect`、`pending-merge`、`frozen`、`free`
- 标记为 `locked` 的文件或目录范围，只能由指定负责人修改
- 标记为 `shared-by-architect` 的文件，必须先获得架构师批准才能修改
- 标记为 `frozen` 的范围，在本阶段默认不允许改动，除非架构师显式解锁
- 在已锁定模块目录下新建的文件，默认继承该模块负责人
- 共享契约文件对非默认负责人只读，除非架构师明确发起锁移交

## 共享文件

| 路径 / 范围 | 负责人 | 锁状态 | 说明 |
| --- | --- | --- | --- |
| `package.json` | Architect | shared-by-architect | 前端依赖与 scripts 基线 |
| `package-lock.json` | Architect | shared-by-architect | 锁定依赖版本 |
| `vite.config.ts` | Architect | shared-by-architect | Vite 代理、alias 和构建配置 |
| `tsconfig.json` | Architect | shared-by-architect | TypeScript 根配置 |
| `tsconfig.app.json` | Architect | shared-by-architect | 应用编译配置 |
| `tsconfig.node.json` | Architect | shared-by-architect | Node / Vite 编译配置 |
| `index.html` | Architect | shared-by-architect | 应用 HTML 壳 |
| `README.md` | Architect | shared-by-architect | 项目说明 |
| `src/main.ts` | Architect | locked | 应用入口、插件挂载 |
| `src/App.vue` | Architect | locked | 根组件入口 |
| `src/router/**` | Architect | locked | 路由入口与页面挂载 |
| `src/api/**` | Architect | locked | 所有后端请求封装 |
| `src/types/**` | Architect | locked | 共享 DTO / 类型约束 |
| `src/layouts/**` | Architect | locked | 布局与公共壳层 |
| `src/stores/**` | Architect | locked | 全局状态 |
| `src/utils/**` | Architect | shared-by-architect | 格式化、日期和 query 工具 |
| `src/constants/**` | Architect | shared-by-architect | 共享下拉选项与常量 |
| `src/components/**` | Architect | shared-by-architect | 共享组件和图表组件 |
| `src/style.css` | Architect | locked | 全局主题和页面公共样式 |
| `TASKS.md` | Architect | locked | 前端第一阶段全局任务看板 |
| `FILE_OWNERSHIP.md` | Architect | locked | 文件锁登记表 |
| `AGENT_RUNBOOK.md` | Architect | locked | Frontend Agent 工作手册与启动文案 |

## Agent-1 归属

| 路径 / 范围 | 负责人 | 锁状态 | 说明 |
| --- | --- | --- | --- |
| `src/views/DashboardView.vue` | Agent-1 | locked | 看板主页面 |
| `src/views/BudgetsView.vue` | Agent-1 | locked | 预算主页面 |
| `src/views/dashboard/**` | Agent-1 | locked | 看板页面私有局部组件 |
| `src/views/budgets/**` | Agent-1 | locked | 预算页面私有局部组件 |

## Agent-2 归属

| 路径 / 范围 | 负责人 | 锁状态 | 说明 |
| --- | --- | --- | --- |
| `src/views/ImportsView.vue` | Agent-2 | locked | 导入主页面 |
| `src/views/TransactionsView.vue` | Agent-2 | locked | 流水主页面 |
| `src/views/RulesView.vue` | Agent-2 | locked | 规则主页面 |
| `src/views/imports/**` | Agent-2 | locked | 导入页面私有局部组件 |
| `src/views/transactions/**` | Agent-2 | locked | 流水页面私有局部组件 |
| `src/views/rules/**` | Agent-2 | locked | 规则页面私有局部组件 |

## 本阶段冻结范围

| 路径 / 范围 | 负责人 | 锁状态 | 说明 |
| --- | --- | --- | --- |
| `node_modules/**` | Architect | frozen | 依赖目录，不作为开发改动范围 |
| `dist/**` | Architect | frozen | 构建产物目录 |
| `.worktrees/**` | Architect | frozen | 工作树目录，不纳入源码改动 |
| `public/**` | Architect | shared-by-architect | 静态资源默认不在本阶段自由改动 |

## 共享契约文件

| 路径 / 范围 | 默认负责人 | 锁状态 | 说明 |
| --- | --- | --- | --- |
| `src/api/client.ts` | Architect | shared-by-architect | 通用请求与错误提示策略 |
| `src/api/dashboard.ts` | Architect | shared-by-architect | 看板 API 契约入口 |
| `src/api/import-jobs.ts` | Architect | shared-by-architect | 导入任务 API 契约入口 |
| `src/api/transactions.ts` | Architect | shared-by-architect | 流水 API 契约入口 |
| `src/api/budgets.ts` | Architect | shared-by-architect | 预算 API 契约入口 |
| `src/api/rules.ts` | Architect | shared-by-architect | 规则 API 契约入口 |
| `src/types/shared.ts` | Architect | shared-by-architect | 交易、预算、分页等共享类型 |
| `src/types/dashboard.ts` | Architect | shared-by-architect | 看板返回结构 |
| `src/types/import-job.ts` | Architect | shared-by-architect | 导入任务结构 |
| `src/types/budget.ts` | Architect | shared-by-architect | 预算结构 |
| `src/types/rule.ts` | Architect | shared-by-architect | 规则结构 |

## 锁移交流程

1. 通过 `CONTRACT_CHANGE` 消息发起锁移交申请。
2. 架构师评估影响范围，决定拒绝还是授予限时锁窗口。
3. 在锁窗口期间，当前负责人暂停对该文件或范围的修改。
4. 变更完成并合并，或申请被驳回后，锁状态回到默认负责人。

## 当前锁状态

- 基线分支：`yan`
- Agent-1 分支：`feature/agent-1-front-dashboard-budget`
- Agent-2 分支：`feature/agent-2-front-imports-transactions-rules`
- 当前没有临时锁移交
