import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (id.includes('zrender')) {
            return 'zrender-vendor'
          }

          const echartsModuleMatch = id.match(/echarts\/(?:lib|es)\/([^/]+)/)
          if (echartsModuleMatch) {
            return `echarts-${echartsModuleMatch[1]}`
          }

          if (id.includes('echarts')) {
            return 'echarts-shared'
          }

          if (id.includes('@element-plus/icons-vue')) {
            return 'element-plus-icons'
          }

          const elementPlusComponentMatch = id.match(/element-plus\/es\/components\/([^/]+)/)
          if (elementPlusComponentMatch) {
            return `element-plus-${elementPlusComponentMatch[1]}`
          }

          if (id.includes('element-plus') || id.includes('@element-plus')) {
            return 'element-plus-shared'
          }

          if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
            return 'vue-vendor'
          }

          if (id.includes('axios')) {
            return 'http-vendor'
          }
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
