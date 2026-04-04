import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getHealth } from '@/api/system'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const healthStatus = ref<'UP' | 'DOWN' | 'UNKNOWN'>('UNKNOWN')
  const loadingHealth = ref(false)

  async function loadHealth() {
    loadingHealth.value = true
    try {
      const response = await getHealth()
      healthStatus.value = response.status === 'UP' ? 'UP' : 'DOWN'
    } catch {
      healthStatus.value = 'DOWN'
    } finally {
      loadingHealth.value = false
    }
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    sidebarCollapsed,
    healthStatus,
    loadingHealth,
    loadHealth,
    toggleSidebar,
  }
})
