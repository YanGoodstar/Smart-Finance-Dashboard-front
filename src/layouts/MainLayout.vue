<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Fold, RefreshRight } from '@element-plus/icons-vue'
import AppSidebar from '@/components/AppSidebar.vue'
import StatusTag from '@/components/StatusTag.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const shellClass = computed(() => ({
  'is-collapsed': appStore.sidebarCollapsed,
}))

onMounted(() => {
  void appStore.loadHealth()
})
</script>

<template>
  <div class="layout-shell" :class="shellClass">
    <aside class="layout-shell__sidebar">
      <AppSidebar />
    </aside>

    <section class="layout-shell__main">
      <header class="layout-shell__header sf-card">
        <div>
          <div class="layout-shell__eyebrow">Smart Finance Dashboard</div>
          <h1 class="layout-shell__title">个人财务智能语义看板</h1>
        </div>

        <div class="layout-shell__actions">
          <StatusTag mode="health" :value="appStore.healthStatus" />
          <el-button circle plain :icon="RefreshRight" @click="appStore.loadHealth" />
          <el-button circle plain :icon="Fold" @click="appStore.toggleSidebar" />
        </div>
      </header>

      <main class="layout-shell__content">
        <RouterView />
      </main>
    </section>
  </div>
</template>

<style scoped>
.layout-shell {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  padding: 24px;
}

.layout-shell.is-collapsed {
  grid-template-columns: 108px minmax(0, 1fr);
}

.layout-shell__sidebar {
  position: sticky;
  top: 24px;
  height: calc(100vh - 48px);
  padding: 18px;
  border: 1px solid var(--sf-line);
  border-radius: 30px;
  background: rgba(255, 252, 247, 0.68);
  box-shadow: var(--sf-shadow);
  backdrop-filter: blur(20px);
}

.layout-shell__main {
  min-width: 0;
}

.layout-shell__header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  padding: 22px 24px;
  border-radius: 26px;
}

.layout-shell__eyebrow {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sf-text-muted);
}

.layout-shell__title {
  margin: 8px 0 0;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.1;
  color: var(--sf-primary);
}

.layout-shell__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.layout-shell__content {
  margin-top: 24px;
}

@media (max-width: 1100px) {
  .layout-shell {
    grid-template-columns: 1fr;
  }

  .layout-shell__sidebar {
    position: static;
    height: auto;
  }
}

@media (max-width: 720px) {
  .layout-shell {
    padding: 14px;
  }

  .layout-shell__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
