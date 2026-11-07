<script setup>
import { computed } from 'vue'
import { compact, money, number } from '../data.js'
import Icon from './Icon.vue'

const props = defineProps({ report: { type: Object, required: true } })
const ratio = (row) => row.spend ? row.revenue / row.spend : 0
const specs = [
  { key: 'reach', label: 'Qamrov', icon: 'eye', color: 'green', format: compact },
  { key: 'leads', label: 'Yangi leadlar', icon: 'users', color: 'blue', format: number },
  { key: 'spend', label: 'Reklama xarajati', icon: 'wallet', color: 'purple', format: money },
  { key: 'roas', label: 'ROAS', icon: 'trend', color: 'amber', format: (value) => number(value, 1) + '×' },
]
const metrics = computed(() => specs.map((item) => {
  const value = (row) => item.key === 'roas' ? ratio(row) : row[item.key]
  const current = value(props.report.total)
  const previous = value(props.report.prior)
  const points = props.report.series.map(value)
  const min = Math.min(...points)
  const range = Math.max(...points) - min || 1
  const spark = points.map((point, i) => [i * 10 + 2, 28 - (point - min) / range * 22].join(',')).join(' ')
  return {
    ...item, value: item.format(current), spark,
    delta: previous ? (current / previous - 1) * 100 : null,
  }
}))
</script>

<template>
  <section class="metrics-grid" aria-label="Asosiy ko‘rsatkichlar">
    <article v-for="metric in metrics" :key="metric.key" class="glass metric-card">
      <div class="metric-heading">
        <span class="icon-tile" :class="'tone-' + metric.color"><Icon :name="metric.icon" :size="17" /></span>
        <span>{{ metric.label }}</span>
      </div>
      <div class="metric-reading">
        <strong>{{ metric.value }}</strong>
        <svg class="spark" :class="'tone-' + metric.color" viewBox="0 0 64 32" width="64" height="32" aria-hidden="true">
          <polyline :points="metric.spark" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" />
        </svg>
      </div>
      <div class="metric-comparison">
        <span v-if="metric.delta !== null" class="delta" :class="{ 'delta-down': metric.delta < -0.05 && metric.key !== 'spend', 'delta-neutral': metric.key === 'spend' || Math.abs(metric.delta) < 0.05 }">
          <Icon v-if="Math.abs(metric.delta) >= 0.05" :name="metric.delta > 0 ? 'arrowUp' : 'arrowDown'" :size="12" />{{ number(Math.abs(metric.delta), 1) }}%
        </span>
        <span>{{ metric.delta === null ? 'Tanlangan davr' : 'oldingi davrga nisbatan' }}</span>
      </div>
    </article>
  </section>
</template>
