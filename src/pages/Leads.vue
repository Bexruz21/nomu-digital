<script setup>
import { computed, ref } from 'vue'
import { allowedStatuses, collections, dateLabel, downloadCsv, number, sources, statuses } from '../data.js'
import Icon from '../components/Icon.vue'
import { t, tr } from '../i18n.js'

const props = defineProps({ state: { type: Object, required: true } })
const emit = defineEmits(['create', 'edit', 'status', 'notify'])
const query = ref('')
const filter = ref('all')
const source = ref('all')
const dragging = ref(null)
const target = ref(null)
const config = collections.leads
const stages = allowedStatuses.leads
const specs = [
  { id: 'all', label: 'Jami leadlar', icon: 'users', color: 'purple' },
  { id: 'new', label: 'Yangi murojaatlar', icon: 'inbox', color: 'blue' },
  { id: 'qualified', label: 'Saralangan', icon: 'target', color: 'amber' },
  { id: 'won', label: 'Sotuvga aylandi', icon: 'trend', color: 'green' },
]

const campaigns = computed(() => new Map(props.state.campaigns.map((row) => [row.id, row.title])))
const stats = computed(() => specs.map((spec) => ({
  ...spec,
  count: spec.id === 'all' ? props.state.leads.length : props.state.leads.filter((lead) => lead.status === spec.id).length,
})))
const visible = computed(() => {
  const term = query.value.trim().toLocaleLowerCase()
  return props.state.leads.filter((lead) => (
    (filter.value === 'all' || lead.status === filter.value) &&
    (source.value === 'all' || lead.source === source.value) &&
    [lead.title, lead.email, lead.phone, lead.notes, lead.tags, t(lead.source), campaigns.value.get(lead.campaignId)]
      .some((value) => String(value ?? '').toLocaleLowerCase().includes(term))
  ))
})
const lanes = computed(() => (filter.value === 'all' ? stages : [filter.value]).map((id) => ({
  id, ...statuses[id], cards: visible.value.filter((lead) => lead.status === id),
})))
const filtered = computed(() => Boolean(query.value.trim()) || filter.value !== 'all' || source.value !== 'all')

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase()
}

function clearFilters() {
  query.value = ''
  filter.value = 'all'
  source.value = 'all'
}

function moveLead(lead, status) {
  if (lead.status !== status) emit('status', 'leads', lead.id, status)
}

function startDrag(event, lead) {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('application/x-marketlane-lead', lead.id)
  dragging.value = lead.id
}

function dragOver(event, lane) {
  if (!dragging.value) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  target.value = lane
}

function dragLeave(event, lane) {
  if (target.value === lane && !event.currentTarget.contains(event.relatedTarget)) target.value = null
}

function endDrag() {
  dragging.value = null
  target.value = null
}

function dropLead(event, lane) {
  if (!dragging.value) return
  event.preventDefault()
  const lead = props.state.leads.find((item) => item.id === dragging.value)
  endDrag()
  if (lead) moveLead(lead, lane)
}

function exportLeads() {
  downloadCsv('marketlane-leadlar.csv', [
    ['Ism', 'Email', 'Telefon', 'Manba', 'Kampaniya', 'Holat', 'Sana', 'Izoh'],
    ...visible.value.map((lead) => [
      lead.title, lead.email, lead.phone, lead.source, campaigns.value.get(lead.campaignId),
      statuses[lead.status]?.label, lead.date, lead.notes,
    ]),
  ])
  emit('notify', 'Leadlar CSV faylga chiqarildi.')
}
</script>

<template>
  <div class="page-stack leads-page">
    <header class="page-heading">
      <div><div class="eyebrow"><i></i> {{ $t("CRM · SAVDO VORONKASI") }}</div><h1>{{ $t(config.title) }}</h1><p>{{ $t(config.intro) }}</p></div>
      <div class="heading-actions">
        <button class="button button-secondary" :disabled="!visible.length" @click="exportLeads"><Icon name="download" :size="17" />{{ $t("CSV") }}</button>
        <button class="button button-primary" @click="emit('create', 'new')"><Icon name="plus" :size="18" />{{ $t(config.newLabel) }}</button>
      </div>
    </header>

    <div class="lead-stats" :aria-label='$t("Leadlar ko‘rsatkichlari")'>
      <button v-for="stat in stats" :key="stat.id" class="glass summary-card lead-stat" :aria-pressed="filter === stat.id"
        @click="filter = filter === stat.id ? 'all' : stat.id">
        <span class="icon-tile" :class="'tone-' + stat.color"><Icon :name="stat.icon" :size="19" /></span>
        <span><strong>{{ $t(number(stat.count)) }}</strong><span>{{ $t(stat.label) }}</span></span>
        <Icon name="chevronRight" :size="15" />
      </button>
    </div>

    <section class="lead-workspace" :aria-label='$t("Leadlar doskasi")'>
      <div class="glass lead-toolbar">
        <label class="inline-search"><Icon name="search" :size="17" /><input v-model="query" type="search" :aria-label='$t("Leadlar bo‘yicha qidirish")' :placeholder='$t("Ism, email yoki kampaniya…")' /></label>
        <div class="lead-filters">
          <label class="filter-select"><Icon name="filter" :size="16" /><select v-model="filter" :aria-label='$t("Holat bo‘yicha filtrlash")'>
            <option value="all">{{ $t("Barcha holatlar") }}</option><option v-for="stage in stages" :key="stage" :value="stage">{{ $t(statuses[stage].label) }}</option>
          </select></label>
          <label class="filter-select"><Icon name="layers" :size="16" /><select v-model="source" :aria-label='$t("Manba bo‘yicha filtrlash")'>
            <option value="all">{{ $t("Barcha manbalar") }}</option><option :value='item' v-for="item in sources" :key="item">{{ $t(item) }}</option>
          </select></label>
          <button v-if="filtered" class="button button-text button-compact" @click="clearFilters"><Icon name="close" :size="14" />{{ $t("Tozalash") }}</button>
        </div>
      </div>

      <div class="lead-board-header">
        <h2>{{ $t("Leadlar doskasi") }} <span>{{ $t(number(visible.length)) }} {{ $t("ta") }}</span></h2>
        <p class="lead-drag-hint"><Icon name="grip" :size="15" /> {{ $t("Kartani boshqa bosqichga sudrang") }}</p>
      </div>
      <div class="lead-board" :class="{ 'single-lane': filter !== 'all' }">
        <section v-for="lane in lanes" :key="lane.id" class="lead-lane" :class="['tone-' + lane.color, { 'is-target': target === lane.id }]"
          :aria-labelledby="'lead-stage-' + lane.id" @dragenter="dragOver($event, lane.id)" @dragover="dragOver($event, lane.id)"
          @dragleave="dragLeave($event, lane.id)" @drop="dropLead($event, lane.id)">
          <header class="lane-header">
            <span class="lane-dot" aria-hidden="true"></span>
            <h3 :id="'lead-stage-' + lane.id">{{ $t(lane.label) }}</h3>
            <span class="lane-count">{{ $t(number(lane.cards.length)) }}</span>
            <button class="icon-button ghost" :aria-label="$t(lane.label + ' bosqichiga lead qo‘shish')" :title='$t("Lead qo‘shish")' @click="emit('create', lane.id)"><Icon name="plus" :size="17" /></button>
          </header>
          <div v-if="lane.cards.length" class="lane-cards">
            <article v-for="lead in lane.cards" :key="lead.id" class="lead-card" :class="{ 'is-dragging': dragging === lead.id }"
              draggable="true" :aria-labelledby="'lead-name-' + lead.id" @dragstart="startDrag($event, lead)" @dragend="endDrag">
              <div class="lead-card-head">
                <span class="lead-avatar" aria-hidden="true">{{ $t(initials(lead.title)) }}</span>
                <div>
                  <button :id="'lead-name-' + lead.id" class="lead-name" :title="$t(lead.title)" @click="emit('edit', 'leads', lead.id)">{{ $t(lead.title) }}</button>
                  <span v-if="lead.email" class="lead-contact" :title="$t(lead.email)">{{ $t(lead.email) }}</span>
                  <span v-if="lead.phone" class="lead-contact" :title="$t(lead.phone)">{{ $t(lead.phone) }}</span>
                </div>
                <Icon class="lead-grip" name="grip" :size="17" />
              </div>
              <p v-if="lead.notes" class="lead-notes" :title="$t(lead.notes)">{{ $t(lead.notes) }}</p>
              <p v-if="campaigns.has(lead.campaignId)" class="lead-campaign" :title="$t(campaigns.get(lead.campaignId))"><Icon name="megaphone" :size="13" /><span>{{ $t(campaigns.get(lead.campaignId)) }}</span></p>
              <div class="lead-meta">
                <span v-if="lead.score" class="lead-quality">{{tr('Sifat','Качество','Quality')}} {{lead.score}}/100</span>
                <span v-if="lead.tags" class="lead-source">{{lead.tags}}</span>
                <span class="lead-source">{{ $t(lead.source) }}</span>
                <span class="lead-date"><Icon name="calendar" :size="13" />{{ $t(dateLabel(lead.date)) }}</span>
              </div>
              <div class="lead-card-footer">
                <select class="lead-status" :value="lead.status" :aria-label="t('Holat') + ': ' + lead.title" @change="moveLead(lead, $event.target.value)">
                  <option v-for="stage in stages" :key="stage" :value="stage">{{ $t(statuses[stage].label) }}</option>
                </select>
                <button class="icon-button ghost" :aria-label="t('Tahrirlash') + ': ' + lead.title" :title='$t("Tahrirlash")' @click="emit('edit', 'leads', lead.id)"><Icon name="pencil" :size="15" /></button>
              </div>
            </article>
          </div>
          <div v-else class="lane-empty"><Icon name="inbox" :size="19" />{{ $t(filtered ? $t('Mos lead yo‘q') : $t('Bu bosqichda lead yo‘q')) }}</div>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.lead-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.lead-stat {
  flex-direction: row;
  align-items: center;
  padding: 13px;
}

.lead-workspace {
  display: grid;
  gap: 13px;
  min-width: 0;
}

.lead-toolbar, .lead-filters, .lead-board-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.lead-toolbar {
  justify-content: space-between;
  padding: 10px;
  border-radius: 16px;
}

.lead-toolbar .inline-search { width: min(100%, 275px); }
.lead-toolbar .inline-search input { width: 100%; }
.lead-board-header { justify-content: space-between; padding: 2px 2px 0; }
.lead-board-header h2 { display: flex; align-items: center; gap: 7px; font-size: 16px; letter-spacing: -.024em; }
.lead-board-header h2 span { padding: 3px 6px; background: var(--hover); border: 1px solid var(--line); border-radius: 7px; color: var(--quiet); font-size: 10px; letter-spacing: 0; }
.lead-drag-hint { display: flex; align-items: center; gap: 5px; color: var(--quiet); font-size: 11px; }

.lead-board {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  align-items: start;
}

.lead-board.single-lane { grid-template-columns: minmax(0, 1fr); }

.lead-lane {
  padding: 8px;
  min-width: 0;
  min-height: 248px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--tone-bg) 36%, var(--panel)), var(--panel) 108px);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .04);
  transition: background .15s, border-color .15s, box-shadow .15s;
}

.lead-lane.is-target {
  border-color: var(--tone);
  box-shadow: inset 0 0 0 1px var(--tone), 0 0 18px color-mix(in srgb, var(--tone) 16%, transparent);
}

.lane-header { display: flex; align-items: center; gap: 6px; margin: 0 1px 8px; min-height: 30px; }
.lane-header h3 { min-width: 0; font-size: 12px; font-weight: 680; overflow-wrap: anywhere; }
.lane-dot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--tone); box-shadow: 0 0 0 3px var(--tone-bg); }
.lane-count { flex: none; color: var(--tone); background: var(--tone-bg); border-radius: 7px; min-width: 19px; padding: 2px 4px; text-align: center; font-size: 10px; font-weight: 730; }
.lane-header .icon-button { width: 27px; height: 27px; margin-left: auto; }
.lane-cards { display: grid; gap: 8px; }
.single-lane .lane-cards { grid-template-columns: repeat(auto-fill, minmax(min(100%, 205px), 1fr)); }

.lead-card {
  display: grid;
  min-width: 0;
  gap: 9px;
  padding: 10px;
  background: var(--solid);
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: var(--shadow);
  transition: border-color .15s, opacity .15s;
}

.lead-card:hover, .lead-card:focus-within { border-color: color-mix(in srgb, var(--tone) 43%, var(--line)); }
.lead-card.is-dragging { opacity: .45; }
.lead-card-head { display: flex; align-items: flex-start; gap: 7px; min-width: 0; }
.lead-card-head > div { flex: 1; min-width: 0; }
.lead-avatar { display: grid; place-items: center; flex: none; width: 29px; height: 29px; border-radius: 9px; background: var(--tone-bg); color: var(--tone); font-size: 10px; font-weight: 760; }
.lead-name { max-width: 100%; display: block; padding: 0; color: var(--ink); text-align: left; font-size: 12.5px; font-weight: 730; line-height: 1.3; overflow-wrap: anywhere; }
.lead-name:hover { color: var(--accent-dark); }
.lead-contact { display: block; margin-top: 3px; color: var(--quiet); font-size: 10.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lead-grip { margin-left: auto; color: var(--quiet); cursor: grab; }
.lead-notes { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; color: var(--muted); font-size: 11px; line-height: 1.45; overflow-wrap: anywhere; }
.lead-campaign, .lead-meta, .lead-date { display: flex; align-items: center; gap: 5px; min-width: 0; }
.lead-campaign { color: var(--accent-dark); font-size: 10.5px; }
.lead-campaign span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lead-meta { flex-wrap: wrap; gap: 5px 7px; }
.lead-source { max-width: 100%; padding: 3px 5px; color: var(--tone); background: var(--tone-bg); border-radius: 6px; font-size: 10px; font-weight: 640; overflow-wrap: anywhere; }
.lead-date { color: var(--quiet); font-size: 10px; white-space: nowrap; }
.lead-card-footer { display: flex; align-items: center; gap: 5px; border-top: 1px solid var(--line-soft); padding-top: 6px; }
.lead-status { min-width: 0; flex: 1; color: var(--muted); background: var(--field); border: 1px solid var(--line); border-radius: 7px; min-height: 28px; padding: 3px 4px; font-size: 10.5px; }
.lead-card-footer .icon-button { width: 27px; height: 27px; }
.lane-empty { display: grid; place-content: center; justify-items: center; gap: 7px; min-height: 102px; padding: 9px; border: 1px dashed var(--line); border-radius: 11px; color: var(--quiet); font-size: 11px; text-align: center; }
.lane-empty svg { color: var(--tone); }

@container workspace (max-width: 930px) {
  .lead-board { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lead-lane { min-height: 220px; }
}

@container workspace (max-width: 650px) {
  .lead-stats, .lead-board { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .lead-stat { padding: 9px; gap: 7px; }
  .lead-toolbar .inline-search { flex-basis: 100%; }
  .lead-lane { min-height: 0; }
  .lead-drag-hint { display: none; }
}

@container workspace (max-width: 475px) {
  .lead-board, .single-lane .lane-cards { grid-template-columns: minmax(0, 1fr); }
  .lead-card { padding: 11px; }
  .lead-name { font-size: 14px; }
  .lead-contact, .lead-notes { font-size: 12px; }
  .lane-empty { min-height: 65px; }
}

@media (pointer: coarse) {
  .lead-grip, .lead-drag-hint { display: none; }
}
</style>
