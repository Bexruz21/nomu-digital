<script setup>
import { computed, ref } from 'vue'
import { allowedStatuses, collections, dateKey, dateLabel, money, monthNames, number, statuses, sumResults } from '../data.js'
import Icon from '../components/Icon.vue'
import Status from '../components/Status.vue'
import { locale, localeTag, t, tr } from '../i18n.js'

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
const monthLabel = computed(() => locale.value === 'uz' ? monthNames[month.value.getMonth()] + ' ' + month.value.getFullYear() : new Intl.DateTimeFormat(localeTag(),{month:'long',year:'numeric'}).format(month.value))
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
      <div><div class="eyebrow"><i></i> {{ $t(kind === 'tasks' ? $t('BOSHQARUV') : $t('ISH MAYDONI')) }}</div><h1>{{ $t(config.title) }}</h1><p>{{ $t(config.intro) }}</p></div>
      <div class="heading-actions">
        <button v-if="kind === 'strategies'" class="button button-secondary" @click="emit('navigate', 'assistant')"><Icon name="sparkles" :size="17" />{{ $t("AI bilan rejalash") }}</button>
        <button class="button button-primary" @click="emit('create', kind)"><Icon name="plus" :size="18" />{{ $t(config.newLabel) }}</button>
      </div>
    </header>

    <div class="summary-grid">
      <button v-for="(stat, i) in highlight" :key="stat.status" class="glass summary-card" :aria-pressed="filter === stat.status" @click="filter = filter === stat.status ? 'all' : stat.status">
        <span class="icon-tile" :class="'tone-' + ['green', 'blue', 'purple'][i]"><Icon :name="['activity', 'clock', 'checkSquare'][i]" :size="18" /></span>
        <span><strong>{{ $t(stat.count) }}</strong><span>{{ $t(stat.label) }}</span></span>
        <Icon name="chevronRight" :size="15" />
      </button>
    </div>

    <section class="glass records-panel">
      <div class="record-toolbar">
        <label class="inline-search"><Icon name="search" :size="17" /><input v-model="query" type="search" :aria-label="t('Qidirish') + ': ' + t(config.title)" :placeholder='$t("Qidirish…")' /></label>
        <div class="record-filters">
          <label class="filter-select"><Icon name="filter" :size="16" /><select v-model="filter" :aria-label='$t("Holat bo‘yicha filtrlash")'>
            <option value="all">{{ $t("Barcha holatlar") }}</option><option v-for="status in filters" :key="status" :value="status">{{ $t(statuses[status].label) }}</option>
          </select></label>
          <div v-if="kind === 'content'" class="segmented view-select" :aria-label='$t("Kontent ko‘rinishi")'>
            <button type="button" :aria-pressed="view === 'list'" @click="view = 'list'"><Icon name="list" :size="17" />{{ $t("Ro‘yxat") }}</button>
            <button type="button" :aria-pressed="view === 'calendar'" @click="view = 'calendar'"><Icon name="calendar" :size="17" />{{ $t("Kalendar") }}</button>
          </div>
        </div>
      </div>

      <template v-if="kind === 'content' && view === 'calendar'">
        <div class="calendar-controls">
          <h2>{{ $t(monthLabel) }}</h2>
          <div class="heading-actions">
            <button class="button button-secondary" @click="month = new Date()">{{ $t("Bugun") }}</button>
            <button class="icon-button" :aria-label='$t("Oldingi oy")' @click="moveMonth(-1)"><Icon name="chevronLeft" :size="18" /></button>
            <button class="icon-button" :aria-label='$t("Keyingi oy")' @click="moveMonth(1)"><Icon name="chevronRight" :size="18" /></button>
          </div>
        </div>
        <div class="calendar-scroll">
          <div class="calendar-grid">
            <div v-for="day in ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']" :key="day" class="calendar-weekday">{{ $t(day) }}</div>
            <div v-for="day in calendar" :key="day.key" class="calendar-day" :class="{ 'other-month': !day.inMonth, 'today': day.today }">
              <button class="calendar-day-number" :aria-label="t('Yangi kontent') + ': ' + dateLabel(day.key)" @click="emit('create', 'content', day.key)">{{ $t(day.day) }}<Icon name="plus" :size="13" /></button>
              <button v-for="item in day.items" :key="item.id" class="calendar-event" :class="'tone-' + statuses[item.status].color" :title="$t(item.title)" @click="emit('edit', kind, item.id)">{{ $t(item.time) }} {{ $t(item.title) }}</button>
            </div>
          </div>
        </div>
      </template>

      <div v-else-if="!visible.length" class="empty-state">
        <span class="icon-tile tone-green"><Icon :name="config.icon" :size="24" /></span>
        <h2>{{ $t(rows.length ? $t('Mos yozuv topilmadi') : $t('Hozircha yozuvlar yo‘q')) }}</h2>
        <p>{{ $t(rows.length ? $t('Qidiruv yoki filtrni o‘zgartiring.') : $t('Birinchi yozuvni qo‘shib, ishni boshlang.')) }}</p>
        <button v-if="rows.length" class="button button-secondary" @click="filter = 'all'; query = ''">{{ $t("Filtrlarni tozalash") }}</button>
        <button v-else class="button button-primary" @click="emit('create', kind)"><Icon name="plus" :size="17" />{{ $t(config.newLabel) }}</button>
      </div>

      <div v-else-if="kind === 'strategies'" class="strategy-grid">
        <article v-for="row in visible" :key="row.id" class="strategy-card">
          <div class="strategy-top"><span class="icon-tile tone-green"><Icon name="target" :size="20" /></span><Status :value="row.status" /></div>
          <button class="table-name" @click="emit('edit', kind, row.id)">{{ $t(row.title) }}</button>
          <p>{{ $t(row.objective) }}</p>
          <dl><div><dt>{{ $t("KPI") }}</dt><dd>{{ $t(row.kpi) }}</dd></div><div><dt>{{ $t("Budjet") }}</dt><dd>{{ $t(money(row.budget, 2)) }}</dd></div><div><dt>{{ $t("Muddat") }}</dt><dd>{{ $t(dateLabel(row.date)) }}</dd></div></dl>
          <button class="button button-secondary" @click="emit('edit', kind, row.id)">{{ $t("Rejani ochish") }}<Icon name="arrowRight" :size="16" /></button>
        </article>
      </div>

      <div v-else class="table-scroll">
        <table class="record-table">
          <thead><tr>
            <th>{{ $t("Nomi") }}</th>
            <template v-if="kind === 'content'"><th>{{ $t("Kanal") }}</th><th>{{ $t("Format") }}</th><th>{{ $t("Vaqt") }}</th></template>
            <template v-if="kind === 'campaigns'"><th>{{ $t("Kanal") }}</th><th>{{ $t("Kunlik budjet") }}</th><th>{{ $t("Leadlar") }}</th><th>{{ $t("ROAS") }}</th></template>
            <template v-if="kind === 'tasks'"><th>{{ $t("Mas’ul") }}</th><th>{{ $t("Ustuvorlik") }}</th><th>{{ $t("Muddat") }}</th></template>
            <th>{{ $t("Holat") }}</th><th><span class="sr-only">{{ $t("Ochish") }}</span></th>
          </tr></thead>
          <tbody><tr v-for="row in visible" :key="row.id">
            <td>
              <div class="table-title-group">
                <input v-if="kind === 'tasks'" class="task-check" type="checkbox" :checked="row.status === 'done'" :aria-label="$t(row.title + ' bajarildi')" @change="emit('status', kind, row.id, $event.target.checked ? 'done' : 'todo')" />
                <button class="table-name" :class="{ 'task-done': kind === 'tasks' && row.status === 'done' }" @click="emit('edit', kind, row.id)">{{ $t(row.title) }}</button>
              </div>
            </td>
            <template v-if="kind === 'content'"><td>{{ $t(row.channel) }}</td><td>{{ $t(row.format) }}</td><td>{{ $t(dateLabel(row.date)) }} · {{ $t(row.time) }}</td></template>
            <template v-if="kind === 'campaigns'"><td>{{ $t(row.channel) }}</td><td>{{ $t(money(row.budget, 2)) }}</td><td>{{ $t(number(row.metrics.leads)) }}</td><td>{{ $t(row.metrics.spend ? number(row.metrics.revenue / row.metrics.spend, 2) + '×' : '—') }}</td></template>
            <template v-if="kind === 'tasks'"><td>{{ $t(row.owner) }}</td><td>{{ $t(row.priority) }}</td><td>{{ $t(dateLabel(row.date)) }}</td></template>
            <td><Status :value="row.status" /></td>
            <td><button class="icon-button ghost" :aria-label="t('Ochish') + ': ' + row.title" @click="emit('edit', kind, row.id)"><Icon name="chevronRight" :size="18" /></button></td>
          </tr></tbody>
        </table>
      </div>
      <footer class="records-footer">{{ $t(visible.length) }} {{ $t("ta yozuv") }} <span v-if="filter !== 'all' || query">· {{ $t(rows.length) }} {{ $t("tadan") }}</span></footer>
    </section>
  </div>
</template>
