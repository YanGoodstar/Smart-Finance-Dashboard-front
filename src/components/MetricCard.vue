<script setup lang="ts">
defineProps<{
  title: string
  value: string
  hint?: string
  accent?: 'primary' | 'accent' | 'success' | 'danger'
}>()
</script>

<template>
  <div class="metric-card sf-card" :data-accent="accent ?? 'primary'">
    <div class="metric-card__title">{{ title }}</div>
    <div class="metric-card__value">{{ value }}</div>
    <div class="metric-card__hint">{{ hint ?? ' ' }}</div>
  </div>
</template>

<style scoped>
.metric-card {
  position: relative;
  overflow: hidden;
  padding: 22px;
  border-radius: 24px;
}

.metric-card::after {
  position: absolute;
  inset: auto -24px -24px auto;
  width: 92px;
  height: 92px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.36);
  content: '';
}

.metric-card[data-accent='primary'] {
  background: linear-gradient(135deg, rgba(23, 57, 89, 0.96), rgba(44, 86, 122, 0.96));
  color: #fff;
}

.metric-card[data-accent='accent'] {
  background: linear-gradient(135deg, rgba(183, 138, 77, 0.96), rgba(213, 172, 120, 0.96));
  color: #fff;
}

.metric-card[data-accent='success'] {
  background: linear-gradient(135deg, rgba(47, 125, 91, 0.96), rgba(83, 156, 123, 0.96));
  color: #fff;
}

.metric-card[data-accent='danger'] {
  background: linear-gradient(135deg, rgba(201, 79, 60, 0.96), rgba(220, 116, 99, 0.96));
  color: #fff;
}

.metric-card__title {
  position: relative;
  z-index: 1;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.82;
}

.metric-card__value {
  position: relative;
  z-index: 1;
  margin-top: 12px;
  font-size: 30px;
  font-weight: 700;
}

.metric-card__hint {
  position: relative;
  z-index: 1;
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.9;
}
</style>
