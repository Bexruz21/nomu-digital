<script setup>
import { computed, ref, useId } from 'vue'
import { dateLabel, number } from '../data.js'
import Icon from './Icon.vue'

const props = defineProps({ series: { type: Array, required: true } })
const metric = ref('reach')
const hover = ref(null)
const gradient = 'trend-' + useId()
const choices = [{ id: 'reach', label: 'Qamrov' }, { id: 'leads', label: 'Leadlar' }]
const width = 640
const height = 205
const left = 46
const right = 618
const top = 12
const bottom = 166
const labels = computed(() => props.series.map((row) => dateLabel(row.date).split(' ')[0] + ' ' + dateLabel(row.date).split(' ')[1].slice(0, 3)))
const plot = computed(() => {
  const values = props.series.map((row) => row[metric.value])
  const unit = Math.max(...values, 1) / 4
  const magnitude = 10 ** Math.floor(Math.log10(unit))
  const step = Math.max(1, [1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= unit) * magnitude)
  const points = values.map((value, i) => ({
    x: left + i * (right - left) / (values.length - 1),
    y: bottom - value / (4 * step) * (bottom - top),
  }))
  const line = points.reduce((path, point, i) => {
    if (!i) return 'M' + point.x + ',' + point.y
    const previous = points[i - 1]
    const mid = (previous.x + point.x) / 2
    return path + ' C' + mid + ',' + previous.y + ' ' + mid + ',' + point.y + ' ' + point.x + ',' + point.y
  }, '')
  return {
    points, line, area: line + ' L' + right + ',' + bottom + ' L' + left + ',' + bottom + ' Z',
    ticks: Array.from({ length: 5 }, (_, i) => ({
      y: bottom - i * (bottom - top) / 4,
      label: step * i >= 1000 ? number(step * i / 1000, 1) + 'k' : number(step * i),
    })),
  }
})
const active = computed(() => hover.value !== null ? plot.value.points[hover.value] : null)

function move(event) {
  const bounds = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - bounds.left) / bounds.width * width
  hover.value = Math.min(props.series.length - 1, Math.max(0, Math.round((x - left) / (right - left) * (props.series.length - 1))))
}
</script>

<template>
  <section class="glass chart-card">
    <div class="section-head">
      <div><h2>{{ $t("Marketing samaradorligi") }}</h2><p>{{ $t("Tanlangan davrdagi natijalar") }}</p></div>
      <div class="segmented" :aria-label='$t("Grafik ko‘rsatkichi")'>
        <button v-for="choice in choices" :key="choice.id" type="button" :aria-pressed="metric === choice.id"
          @click="metric = choice.id; hover = null">{{ $t(choice.label) }}</button>
      </div>
    </div>
    <div class="chart-wrap" @mouseleave="hover = null">
      <svg :viewBox="'0 0 ' + width + ' ' + height" class="trend-chart" role="group" :aria-label='$t("Davrlar bo‘yicha marketing natijalari")' @pointermove="move">
        <defs>
          <linearGradient :id="gradient" x1="0" x2="0" y1="0" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0%" stop-color="var(--chart-color)" stop-opacity=".32" />
            <stop offset="100%" stop-color="var(--chart-color)" stop-opacity=".015" />
          </linearGradient>
        </defs>
        <g v-for="tick in plot.ticks" :key="tick.y">
          <line :x1="left" :x2="right" :y1="tick.y" :y2="tick.y" class="chart-gridline" />
          <text x="34" :y="tick.y + 4" text-anchor="end">{{ $t(tick.label) }}</text>
        </g>
        <path :d="plot.area" :fill="'url(#' + gradient + ')'" />
        <path :d="plot.line" class="chart-line" />
        <line v-if="active" :x1="active.x" :x2="active.x" :y1="top" :y2="bottom" class="chart-guide" />
        <g v-for="(point, i) in plot.points" :key="i">
          <text :x="point.x" y="191" text-anchor="middle" :class="{ 'chart-label-alternate': i % 2 === 1 }">{{ $t(labels[i]) }}</text>
          <circle v-if="hover === i || (hover === null && i === plot.points.length - 1)" :cx="point.x" :cy="point.y" r="8" class="chart-halo" />
          <circle :cx="point.x" :cy="point.y" :r="hover === i || i === plot.points.length - 1 ? 4 : 2.7" class="chart-dot" />
          <circle :cx="point.x" :cy="point.y" r="12" fill="transparent" tabindex="0" role="img"
            :aria-label="$t(labels[i] + ', ' + number(series[i][metric]))" @focus="hover = i" @blur="hover = null" />
        </g>
      </svg>
      <div v-if="active" class="chart-tooltip" :style="{ left: Math.min(81, Math.max(15, active.x / width * 100)) + '%' }">
        <span>{{ $t(series[hover].start === series[hover].date ? dateLabel(series[hover].date) : dateLabel(series[hover].start) + ' – ' + dateLabel(series[hover].date)) }}</span>
        <strong><i />{{ $t(number(series[hover][metric])) }} {{ $t(choices.find((choice) => choice.id === metric).label.toLowerCase()) }}</strong>
      </div>
    </div>
    <div class="chart-caption"><span><i></i>{{ $t(choices.find((choice) => choice.id === metric).label) }}</span><span><Icon name="info" :size="14" /> {{ $t("Demo va kiritilgan natijalar") }}</span></div>
  </section>
</template>
