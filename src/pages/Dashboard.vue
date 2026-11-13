<script setup>
import { computed } from 'vue'
import { aiName, dateLabel, money, performance } from '../data.js'
import Icon from '../components/Icon.vue'
import Metrics from '../components/Metrics.vue'
import PeriodSelect from '../components/PeriodSelect.vue'
import Status from '../components/Status.vue'
import TrendChart from '../components/TrendChart.vue'
import { modules } from '../features.js'
import { t, tr } from '../i18n.js'

const props = defineProps({ state: Object, days: Number, approvals: Array })
const emit = defineEmits(['navigate', 'create', 'edit', 'period', 'approvals'])
const report = computed(() => performance(props.state.campaigns, props.days))
const art = import.meta.env.BASE_URL + 'marketlane-orbit.png'
</script>

<template>
  <div class="page-stack dashboard">
    <header class="page-heading">
      <div>
        <div class="eyebrow"><i></i> {{ $t("ISH MAYDONI") }}</div>
        <h1>{{ $t("Marketing paneli") }}</h1>
        <p>{{ $t("Strategiya, kontent va reklama natijalari bir joyda.") }}</p>
      </div>
      <div class="heading-actions">
        <PeriodSelect :model-value="days" @update:model-value="emit('period', $event)" />
        <button class="button button-primary" @click="emit('create', 'campaigns')"><Icon name="plus" :size="18" />{{ $t("Yangi kampaniya") }}</button>
      </div>
    </header>

    <section class="hero">
      <div class="hero-visual" :style="{ backgroundImage: 'url(' + art + ')' }"></div>
      <div class="hero-grid"></div>
      <div class="hero-content">
        <span class="hero-tag"><Icon name="sparkles" :size="15" />{{ $t(aiName.toUpperCase()) }}</span>
        <h2>{{ $t("Marketingingiz") }}<br /><em>{{ $t("bitta platformada.") }}</em></h2>
        <p>{{ $t("Maqsadingizni yozing va strategiya, kontent") }}<br class="desktop-br" /> {{ $t("hamda reklama rejasini tayyorlang.") }}</p>
        <button class="button hero-button" @click="emit('navigate', 'assistant')">{{ $t("AI yordamchini ochish") }}<Icon name="arrowUpRight" :size="17" /></button>
      </div>
      <div class="hero-index" aria-hidden="true"><span></span> {{ $t("MAQSADDAN NATIJAGACHA") }}</div>
    </section>

    <Metrics :report="report" />
    <section class="module-launcher" :aria-label="tr('Tezkor ishlar','Быстрые действия','Quick actions')"><button v-for="module in modules.filter(item=>['research','studio','social','automation'].includes(item.id))" :key="module.id" class="glass launcher-card" @click="emit('navigate',module.id)"><span class="icon-tile" :class="'tone-'+module.color"><Icon :name="module.icon" :size="19"/></span><span><strong>{{t(module.label)}}</strong><small>{{module.tabs.reduce((sum,tab)=>sum+(state.extensions.data[tab.id]?.length||0),0)}} {{tr('yozuv','записей','records')}}</small></span><Icon name="arrowUpRight" :size="15"/></button></section>

    <div class="dashboard-grid">
      <TrendChart :series="report.series" />
      <section class="glass approvals-card">
        <div class="section-head">
          <div><h2>{{ $t("Tasdiqlash navbati") }} <span class="count-badge">{{ $t(approvals.length) }}</span></h2><p>{{ $t("Ko‘rib chiqish kerak bo‘lgan ishlar") }}</p></div>
          <span class="icon-tile tone-amber"><Icon name="clock" :size="18" /></span>
        </div>
        <div v-if="approvals.length" class="approval-list">
          <button v-for="entry in approvals.slice(0, 3)" :key="entry.item.id" class="approval-row" @click="emit('edit', entry.kind, entry.item.id)">
            <span class="icon-tile" :class="entry.kind === 'content' ? 'tone-purple' : 'tone-blue'"><Icon :name="entry.kind === 'content' ? 'image' : 'megaphone'" :size="17" /></span>
            <span class="approval-copy"><strong>{{ $t(entry.item.title) }}</strong><span>{{ $t(entry.item.channel) }} · {{ $t(dateLabel(entry.item.date)) }}</span></span>
            <Icon name="chevronRight" :size="16" class="subtle" />
          </button>
        </div>
        <div v-else class="approval-empty"><Icon name="check" :size="21" /><span>{{ $t("Tasdiqlash navbati bo‘sh.") }}</span></div>
        <button v-if="approvals.length" class="approval-link" @click="emit('approvals')">{{ $t("Barcha tasdiqlar") }}<Icon name="arrowRight" :size="16" /></button>
      </section>
    </div>

    <section class="glass dashboard-campaigns">
      <div class="section-head">
        <div><h2>{{ $t("Kampaniyalar") }}</h2><p>{{ $t("Ish maydonidagi so‘nggi reklamalar") }}</p></div>
        <button class="button button-secondary" @click="emit('navigate', 'campaigns')">{{ $t("Barchasini ko‘rish") }}<Icon name="arrowRight" :size="16" /></button>
      </div>
      <div v-if="state.campaigns.length" class="table-scroll">
        <table><thead><tr><th>{{ $t("Kampaniya") }}</th><th>{{ $t("Kanal") }}</th><th>{{ $t("Holat") }}</th><th>{{ $t("Kunlik budjet") }}</th><th></th></tr></thead>
          <tbody><tr v-for="item in state.campaigns.slice(0, 4)" :key="item.id">
            <td><button class="table-name" @click="emit('edit', 'campaigns', item.id)">{{ $t(item.title) }}</button></td>
            <td>{{ $t(item.channel) }}</td><td><Status :value="item.status" /></td><td>{{ $t(money(item.budget, 2)) }}</td>
            <td><button class="icon-button ghost" :aria-label="t('Ochish') + ': ' + item.title" @click="emit('edit', 'campaigns', item.id)"><Icon name="chevronRight" :size="17" /></button></td>
          </tr></tbody>
        </table>
      </div>
      <p v-else class="subtle">{{ $t("Birinchi kampaniyangizni yarating.") }}</p>
    </section>
  </div>
</template>
