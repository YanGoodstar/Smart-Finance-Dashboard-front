<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataAnalysis,
  Files,
  Histogram,
  List,
  Management,
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const items = [
  { name: 'dashboard', label: '智能看板', path: '/dashboard', icon: DataAnalysis },
  { name: 'imports', label: '账单导入', path: '/imports', icon: Files },
  { name: 'transactions', label: '流水明细', path: '/transactions', icon: List },
  { name: 'budgets', label: '预算管理', path: '/budgets', icon: Histogram },
  { name: 'rules', label: '规则管理', path: '/rules', icon: Management },
]

const activePath = computed(() => route.path)

function navigate(path: string) {
  if (path !== route.path) {
    void router.push(path)
  }
}
</script>

<template>
  <aside class="sidebar" :class="{ 'is-collapsed': appStore.sidebarCollapsed }">
    <div class="sidebar__brand">
      <div class="sidebar__badge">SF</div>
      <div v-show="!appStore.sidebarCollapsed">
        <div class="sidebar__eyebrow">Smart Finance</div>
        <div class="sidebar__title">个人财务看板</div>
      </div>
    </div>

    <div class="sidebar__menu">
      <button
        v-for="item in items"
        :key="item.name"
        class="sidebar__menu-item"
        :class="{ 'is-active': activePath === item.path }"
        @click="navigate(item.path)"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </button>
    </div>

    <div v-show="!appStore.sidebarCollapsed" class="sidebar__footer sf-card">
      <div class="sidebar__footer-title">当前范围</div>
      <div class="sidebar__footer-text">前端 V1 核心闭环：导入、流水、预算、规则、看板。</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 24px;
}

.sidebar.is-collapsed {
  align-items: center;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 4px 8px;
}

.sidebar__badge {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #173959, #2d567e);
  color: #fff;
  font-family: 'Georgia', serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.08em;
  box-shadow: 0 12px 24px rgba(23, 57, 89, 0.24);
}

.sidebar__eyebrow {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sf-text-muted);
}

.sidebar__title {
  margin-top: 2px;
  font-size: 17px;
  font-weight: 700;
  color: var(--sf-text);
}

.sidebar__menu {
  display: grid;
  gap: 10px;
  width: 100%;
}

.sidebar__menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid transparent;
  border-radius: 18px;
  background: transparent;
  color: var(--sf-text);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease;
}

.sidebar.is-collapsed .sidebar__menu-item {
  justify-content: center;
  padding-inline: 0;
}

.sidebar.is-collapsed .sidebar__menu-item span {
  display: none;
}

.sidebar__menu-item:hover {
  transform: translateX(2px);
  background: rgba(255, 255, 255, 0.52);
  border-color: rgba(21, 35, 58, 0.08);
}

.sidebar__menu-item.is-active {
  background: linear-gradient(135deg, rgba(23, 57, 89, 0.96), rgba(44, 86, 122, 0.96));
  color: #fff;
  box-shadow: 0 18px 32px rgba(23, 57, 89, 0.18);
}

.sidebar__footer {
  margin-top: auto;
  padding: 18px;
  border-radius: 22px;
}

.sidebar__footer-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--sf-text-muted);
}

.sidebar__footer-text {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
}
</style>
