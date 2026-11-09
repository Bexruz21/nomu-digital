<script setup>
import { computed, ref } from 'vue'
import { allowedStatuses, collections, dateKey, dateLabel, money, monthNames, number, statuses, sumResults } from '../data.js'
import Icon from '../components/Icon.vue'
import Status from '../components/Status.vue'

const props = defineProps({ kind: String, state: Object })
const emit = defineEmits(['create', 'edit', 'status', 'navigate'])
const query = ref('')
const filter = ref('all')
const view = ref('list')
const month = ref(new Date())
const kind = props.kind
const config = collections[kind]
const rows = computed(() => props.state[kind])
const filters = allowedStatuses[kind]
const visible = computed(() => {
  const q = query.value.trim().toLocaleLowerCase()
  return rows.value.filter((row) => (
    (filter.value === 'all' || row.status === filter.value) &&
    [row.title, row.notes, row.channel, row.owner, row.objective].some((value) => String(value ?? '').toLocaleLowerCase().includes(q))
  )).map((row) => kind === 'campaigns' ? { ...row, metrics: sumResults(row.results) } : row)
})
const highlight = computed(() => {
  const counts = {
    strategies: [['active', 'Faol strategiyalar'], ['draft', 'Qoralamalar'], ['done', 'Bajarildi']],
    content: [['draft', 'Qoralamalar'], ['review', 'Tasdiq navbati'], ['scheduled', 'Rejalangan']],
    campaigns: [['active', 'Faol kampaniyalar'], ['review', 'Tasdiq navbati'], ['paused', 'Pauzada']],
    tasks: [['todo', 'Ochiq vazifalar'], ['progress', 'Jarayonda'], ['done', 'Bajarilgan']],
  }[kind]
  return counts.map(([status, label]) => ({ status, label, count: rows.value.filter((row) => row.status === status).length }))
})
const monthLabel = computed(() => monthNames[month.value.getMonth()] + ' ' + month.value.getFullYear())
const calendar = computed(() => {
  const year = month.value.getFullYear()
  const current = month.value.getMonth()
  const first = new Date(year, current, 1)
  const lead = (first.getDay() + 6) % 7
  const length = new Date(year, current + 1, 0).getDate()
  return Array.from({ length: Math.ceil((lead + length) / 7) * 7 }, (_, i) => {
    const date = new Date(year, current, i - lead + 1)
    const key = dateKey(0, date)
    return {
      key, day: date.getDate(), inMonth: date.getMonth() === current, today: key === dateKey(),
      items: visible.value.filter((row) => row.date === key).sort((a, b) => a.time.localeCompare(b.time)),
    }
  })
})

function moveMonth(offset) {
  month.value = new Date(month.value.getFullYear(), month.value.getMonth() + offset, 1)
}

</script>

<template>
  <div class="page-stack">
    <header class="page-heading">
      <div><div class="eyebrow"><i></i> {{ kind === 'tasks' ? 'BOSHQARUV' : 'ISH MAYDONI' }}</div><h1>{{ config.title }}</h1><p>{{ config.intro }}</p></div>
      <div class="heading-actions">
        <button v-if="kind === 'strategies'" class="button button-secondary" @click="emit('navigate', 'assistant')"><Icon name="sparkles" :size="17" />AI bilan rejalash</button>
        <button class="button button-primary" @click="emit('create', kind)"><Icon name="plus" :size="18" />{{ config.newLabel }}</button>
      </div>
    </header>

    <div class="summary-grid">
      <button v-for="(stat, i) in highlight" :key="stat.status" class="glass summary-card" :aria-pressed="filter === stat.status" @click="filter = filter === stat.status ? 'all' : stat.status">
        <span class="icon-tile" :class="'tone-' + ['green', 'blue', 'purple'][i]"><Icon :name="['activity', 'clock', 'checkSquare'][i]" :size="18" /></span>
        <span><strong>{{ stat.count }}</strong><span>{{ stat.label }}</span></span>
        <Icon name="chevronRight" :size="15" />
      </button>
    </div>

    <section class="glass records-panel">
      <div class="record-toolbar">
        <label class="inline-search"><Icon name="search" :size="17" /><input v-model="query" type="search" :aria-label="config.title + ' bo‘yicha qidirish'" placeholder="Qidirish…" /></label>
        <div class="record-filters">
          <label class="filter-select"><Icon name="filter" :size="16" /><select v-model="filter" aria-label="Holat bo‘yicha filtrlash">
            <option value="all">Barcha holatlar</option><option v-for="status in filters" :key="status" :value="status">{{ statuses[status].label }}</option>
          </select></label>
          <div v-if="kind === 'content'" class="segmented view-select" aria-label="Kontent ko‘rinishi">
            <button type="button" :aria-pressed="view === 'list'" @click="view = 'list'"><Icon name="list" :size="17" />Ro‘yxat</button>
            <button type="button" :aria-pressed="view === 'calendar'" @click="view = 'calendar'"><Icon name="calendar" :size="17" />Kalendar</button>
          </div>
        </div>
      </div>

      <template v-if="kind === 'content' && view === 'calendar'">
        <div class="calendar-controls">
          <h2>{{ monthLabel }}</h2>
          <div class="heading-actions">
            <button class="button button-secondary" @click="month = new Date()">Bugun</button>
            <button class="icon-button" aria-label="Oldingi oy" @click="moveMonth(-1)"><Icon name="chevronLeft" :size="18" /></button>
            <button class="icon-button" aria-label="Keyingi oy" @click="moveMonth(1)"><Icon name="chevronRight" :size="18" /></button>
          </div>
        </div>
        <div class="calendar-scroll">
          <div class="calendar-grid">
            <div v-for="day in ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']" :key="day" class="calendar-weekday">{{ day }}</div>
            <div v-for="day in calendar" :key="day.key" class="calendar-day" :class="{ 'other-month': !day.inMonth, 'today': day.today }">
              <button class="calendar-day-number" :aria-label="dateLabel(day.key) + ' uchun kontent yaratish'" @click="emit('create', 'content', day.key)">{{ day.day }}<Icon name="plus" :size="13" /></button>
              <button v-for="item in day.items" :key="item.id" class="calendar-event" :class="'tone-' + statuses[item.status].color" :title="item.title" @click="emit('edit', kind, item.id)">{{ item.time }} {{ item.title }}</button>
            </div>
          </div>
        </div>
      </template>

      <div v-else-if="!visible.length" class="empty-state">
        <span class="icon-tile tone-green"><Icon :name="config.icon" :size="24" /></span>
        <h2>{{ rows.length ? 'Mos yozuv topilmadi' : 'Hozircha yozuvlar yo‘q' }}</h2>
        <p>{{ rows.length ? 'Qidiruv yoki filtrni o‘zgartiring.' : 'Birinchi yozuvni qo‘shib, ishni boshlang.' }}</p>
        <button v-if="rows.length" class="button button-secondary" @click="filter = 'all'; query = ''">Filtrlarni tozalash</button>
        <button v-else class="button button-primary" @click="emit('create', kind)"><Icon name="plus" :size="17" />{{ config.newLabel }}</button>
      </div>

      <div v-else-if="kind === 'strategies'" class="strategy-grid">
        <article v-for="row in visible" :key="row.id" class="strategy-card">
          <div class="strategy-top"><span class="icon-tile tone-green"><Icon name="target" :size="20" /></span><Status :value="row.status" /></div>
          <button class="table-name" @click="emit('edit', kind, row.id)">{{ row.title }}</button>
          <p>{{ row.objective }}</p>
          <dl><div><dt>KPI</dt><dd>{{ row.kpi }}</dd></div><div><dt>Budjet</dt><dd>{{ money(row.budget, 2) }}</dd></div><div><dt>Muddat</dt><dd>{{ dateLabel(row.date) }}</dd></div></dl>
          <button class="button button-secondary" @click="emit('edit', kind, row.id)">Rejani ochish<Icon name="arrowRight" :size="16" /></button>
        </article>
      </div>

      <div v-else class="table-scroll">
        <table class="record-table">
          <thead><tr>
            <th>Nomi</th>
            <template v-if="kind === 'content'"><th>Kanal</th><th>Format</th><th>Vaqt</th></template>
            <template v-if="kind === 'campaigns'"><th>Kanal</th><th>Kunlik budjet</th><th>Leadlar</th><th>ROAS</th></template>
            <template v-if="kind === 'tasks'"><th>Mas’ul</th><th>Ustuvorlik</th><th>Muddat</th></template>
            <th>Holat</th><th><span class="sr-only">Ochish</span></th>
          </tr></thead>
          <tbody><tr v-for="row in visible" :key="row.id">
            <td>
              <div class="table-title-group">
                <input v-if="kind === 'tasks'" class="task-check" type="checkbox" :checked="row.status === 'done'" :aria-label="row.title + ' bajarildi'" @change="emit('status', kind, row.id, $event.target.checked ? 'done' : 'todo')" />
                <button class="table-name" :class="{ 'task-done': kind === 'tasks' && row.status === 'done' }" @click="emit('edit', kind, row.id)">{{ row.title }}</button>
              </div>
            </td>
            <template v-if="kind === 'content'"><td>{{ row.channel }}</td><td>{{ row.format }}</td><td>{{ dateLabel(row.date) }} · {{ row.time }}</td></template>
            <template v-if="kind === 'campaigns'"><td>{{ row.channel }}</td><td>{{ money(row.budget, 2) }}</td><td>{{ number(row.metrics.leads) }}</td><td>{{ row.metrics.spend ? number(row.metrics.revenue / row.metrics.spend, 2) + '×' : '—' }}</td></template>
            <template v-if="kind === 'tasks'"><td>{{ row.owner }}</td><td>{{ row.priority }}</td><td>{{ dateLabel(row.date) }}</td></template>
            <td><Status :value="row.status" /></td>
            <td><button class="icon-button ghost" :aria-label="row.title + 'ni ochish'" @click="emit('edit', kind, row.id)"><Icon name="chevronRight" :size="18" /></button></td>
          </tr></tbody>
        </table>
      </div>
      <footer class="records-footer">{{ visible.length }} ta yozuv <span v-if="filter !== 'all' || query">· {{ rows.length }} tadan</span></footer>
    </section>
  </div>
</template>
