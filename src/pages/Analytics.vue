<script setup>
import { computed } from 'vue'
import { dateKey, downloadCsv, money, number, performance } from '../data.js'
import Icon from '../components/Icon.vue'
import Metrics from '../components/Metrics.vue'
import PeriodSelect from '../components/PeriodSelect.vue'
import TrendChart from '../components/TrendChart.vue'
import GrowthInsights from '../components/GrowthInsights.vue'
import { t } from '../i18n.js'

const props = defineProps({ state: Object, days: Number })
const emit = defineEmits(['period', 'notify', 'navigate', 'action'])
const report = computed(() => performance(props.state.campaigns, props.days))
const leads = computed(() => props.state.leads.filter((row) => row.date >= dateKey(1 - props.days) && row.date <= dateKey()))
const won = computed(() => leads.value.filter((row) => row.status === 'won').length)
const cpl = (row) => row.leads ? row.spend / row.leads : null
const roas = (row) => row.spend ? row.revenue / row.spend : null

function exportReport() {
  downloadCsv('marketlane-hisobot-' + props.days + '-kun.csv', [
    ['Kanal', 'Davr boshi', 'Davr oxiri', 'Qamrov', 'Leadlar', 'Xarajat (USD)', 'Daromad (USD)', 'CPL (USD)', 'ROAS'].map(t),
    ...[...report.value.byChannel, { channel: 'Jami', ...report.value.total }].map((row) => [
      t(row.channel), dateKey(1 - props.days), dateKey(), row.reach, row.leads, Number(row.spend.toFixed(2)), Number(row.revenue.toFixed(2)),
      cpl(row)?.toFixed(2), roas(row)?.toFixed(2),
    ]),
  ])
  emit('notify', 'Hisobot CSV faylga chiqarildi.')
}
</script>

<template>
  <div class="page-stack">
    <header class="page-heading">
      <div><div class="eyebrow"><i></i> {{ $t("ISH MAYDONI") }}</div><h1>{{ $t("Analitika") }}</h1><p>{{ $t("Kanal, xarajat va biznes natijalarini solishtiring.") }}</p></div>
      <div class="heading-actions">
        <PeriodSelect :model-value="days" @update:model-value="emit('period', $event)" />
        <button class="button button-primary" @click="exportReport"><Icon name="download" :size="17" />{{ $t("Hisobotni yuklash") }}</button>
      </div>
    </header>
    <Metrics :report="report" />
    <div class="dashboard-grid">
      <TrendChart :series="report.series" />
      <section class="glass finance-card">
        <div class="section-head"><div><h2>{{ $t("Marketing moliyasi") }}</h2><p>{{ $t("Tanlangan davr bo‘yicha") }}</p></div><span class="icon-tile tone-green"><Icon name="wallet" :size="19" /></span></div>
        <dl class="finance-list">
          <div><dt>{{ $t("Reklamadan daromad") }}</dt><dd>{{ $t(money(report.total.revenue, 2)) }}</dd></div>
          <div><dt>{{ $t("Bir lead narxi (CPL)") }}</dt><dd>{{ $t(cpl(report.total) === null ? '—' : money(cpl(report.total), 2)) }}</dd></div>
          <div><dt>{{ $t("CRM’da qayd etilgan sotuv") }}</dt><dd>{{ $t(won) }} / {{ $t(leads.length) }}</dd></div>
        </dl>
        <button class="approval-link" @click="emit('navigate', 'leads')">{{ $t("Leadlarni ko‘rish") }}<Icon name="arrowRight" :size="16" /></button>
      </section>
    </div>
    <section class="glass dashboard-campaigns">
      <div class="section-head"><div><h2>{{ $t("Kanal bo‘yicha natijalar") }}</h2><p>{{ $t("Demo va qo‘lda kiritilgan kampaniya ma’lumotlari") }}</p></div></div>
      <div class="table-scroll">
        <table><thead><tr><th>{{ $t("Kanal") }}</th><th>{{ $t("Qamrov") }}</th><th>{{ $t("Leadlar") }}</th><th>{{ $t("Xarajat") }}</th><th>{{ $t("CPL") }}</th><th>{{ $t("Daromad") }}</th><th>{{ $t("ROAS") }}</th></tr></thead>
          <tbody><tr v-for="row in report.byChannel" :key="row.channel">
            <td><strong>{{ $t(row.channel) }}</strong></td><td>{{ $t(number(row.reach)) }}</td><td>{{ $t(number(row.leads)) }}</td><td>{{ $t(money(row.spend, 2)) }}</td>
            <td>{{ $t(cpl(row) === null ? '—' : money(cpl(row), 2)) }}</td><td>{{ $t(money(row.revenue, 2)) }}</td><td>{{ $t(roas(row) === null ? '—' : number(roas(row), 2) + '×') }}</td>
          </tr></tbody>
        </table>
      </div>
    </section>
    <GrowthInsights :state="state" :report="report" :days="days" @navigate="emit('navigate',$event)" @action="emit('action',$event)"/>
  </div>
</template>
