<script setup>
import { computed } from 'vue'
import { dateKey, downloadCsv, money, number, performance } from '../data.js'
import Icon from '../components/Icon.vue'
import Metrics from '../components/Metrics.vue'
import PeriodSelect from '../components/PeriodSelect.vue'
import TrendChart from '../components/TrendChart.vue'

const props = defineProps({ state: Object, days: Number })
const emit = defineEmits(['period', 'notify', 'navigate'])
const report = computed(() => performance(props.state.campaigns, props.days))
const leads = computed(() => props.state.leads.filter((row) => row.date >= dateKey(1 - props.days) && row.date <= dateKey()))
const won = computed(() => leads.value.filter((row) => row.status === 'won').length)
const cpl = (row) => row.leads ? row.spend / row.leads : null
const roas = (row) => row.spend ? row.revenue / row.spend : null

function exportReport() {
  downloadCsv('nomu-hisobot-' + props.days + '-kun.csv', [
    ['Kanal', 'Davr boshi', 'Davr oxiri', 'Qamrov', 'Leadlar', 'Xarajat (USD)', 'Daromad (USD)', 'CPL (USD)', 'ROAS'],
    ...[...report.value.byChannel, { channel: 'Jami', ...report.value.total }].map((row) => [
      row.channel, dateKey(1 - props.days), dateKey(), row.reach, row.leads, Number(row.spend.toFixed(2)), Number(row.revenue.toFixed(2)),
      cpl(row)?.toFixed(2), roas(row)?.toFixed(2),
    ]),
  ])
  emit('notify', 'Hisobot CSV faylga chiqarildi.')
}
</script>

<template>
  <div class="page-stack">
    <header class="page-heading">
      <div><div class="eyebrow"><i></i> ISH MAYDONI</div><h1>Analitika</h1><p>Kanal, xarajat va biznes natijalarini solishtiring.</p></div>
      <div class="heading-actions">
        <PeriodSelect :model-value="days" @update:model-value="emit('period', $event)" />
        <button class="button button-primary" @click="exportReport"><Icon name="download" :size="17" />Hisobotni yuklash</button>
      </div>
    </header>
    <Metrics :report="report" />
    <div class="dashboard-grid">
      <TrendChart :series="report.series" />
      <section class="glass finance-card">
        <div class="section-head"><div><h2>Marketing moliyasi</h2><p>Tanlangan davr bo‘yicha</p></div><span class="icon-tile tone-green"><Icon name="wallet" :size="19" /></span></div>
        <dl class="finance-list">
          <div><dt>Reklamadan daromad</dt><dd>{{ money(report.total.revenue, 2) }}</dd></div>
          <div><dt>Bir lead narxi (CPL)</dt><dd>{{ cpl(report.total) === null ? '—' : money(cpl(report.total), 2) }}</dd></div>
          <div><dt>CRM’da qayd etilgan sotuv</dt><dd>{{ won }} / {{ leads.length }}</dd></div>
        </dl>
        <button class="approval-link" @click="emit('navigate', 'leads')">Leadlarni ko‘rish<Icon name="arrowRight" :size="16" /></button>
      </section>
    </div>
    <section class="glass dashboard-campaigns">
      <div class="section-head"><div><h2>Kanal bo‘yicha natijalar</h2><p>Demo va qo‘lda kiritilgan kampaniya ma’lumotlari</p></div></div>
      <div class="table-scroll">
        <table><thead><tr><th>Kanal</th><th>Qamrov</th><th>Leadlar</th><th>Xarajat</th><th>CPL</th><th>Daromad</th><th>ROAS</th></tr></thead>
          <tbody><tr v-for="row in report.byChannel" :key="row.channel">
            <td><strong>{{ row.channel }}</strong></td><td>{{ number(row.reach) }}</td><td>{{ number(row.leads) }}</td><td>{{ money(row.spend, 2) }}</td>
            <td>{{ cpl(row) === null ? '—' : money(cpl(row), 2) }}</td><td>{{ money(row.revenue, 2) }}</td><td>{{ roas(row) === null ? '—' : number(roas(row), 2) + '×' }}</td>
          </tr></tbody>
        </table>
      </div>
    </section>
  </div>
</template>
