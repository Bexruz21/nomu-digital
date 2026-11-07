<script setup>
import { computed } from 'vue'
import { aiName, dateLabel, money, performance } from '../data.js'
import Icon from '../components/Icon.vue'
import Metrics from '../components/Metrics.vue'
import PeriodSelect from '../components/PeriodSelect.vue'
import Status from '../components/Status.vue'
import TrendChart from '../components/TrendChart.vue'

const props = defineProps({ state: Object, days: Number, approvals: Array })
const emit = defineEmits(['navigate', 'create', 'edit', 'period', 'approvals'])
const report = computed(() => performance(props.state.campaigns, props.days))
const art = import.meta.env.BASE_URL + 'nomu-glass.png'
</script>

<template>
  <div class="page-stack dashboard">
    <header class="page-heading">
      <div>
        <div class="eyebrow"><i></i> ISH MAYDONI</div>
        <h1>Marketing paneli</h1>
        <p>Strategiya, kontent va reklama natijalari bir joyda.</p>
      </div>
      <div class="heading-actions">
        <PeriodSelect :model-value="days" @update:model-value="emit('period', $event)" />
        <button class="button button-primary" @click="emit('create', 'campaigns')"><Icon name="plus" :size="18" />Yangi kampaniya</button>
      </div>
    </header>

    <section class="hero">
      <div class="hero-visual" :style="{ backgroundImage: 'url(' + art + ')' }"></div>
      <div class="hero-grid"></div>
      <div class="hero-content">
        <span class="hero-tag"><Icon name="sparkles" :size="15" />{{ aiName.toUpperCase() }}</span>
        <h2>Marketingingizga<br />yangi yo‘nalish.</h2>
        <p>Maqsadni ayting. Strategiya, kontent va reklama<br class="desktop-br" /> rejasini birgalikda tayyorlaymiz.</p>
        <button class="button hero-button" @click="emit('navigate', 'assistant')">Yordamchini ochish<Icon name="arrowUpRight" :size="17" /></button>
      </div>
      <div class="hero-index" aria-hidden="true"><span></span> MAQSADDAN NATIJAGACHA</div>
    </section>

    <Metrics :report="report" />

    <div class="dashboard-grid">
      <TrendChart :series="report.series" />
      <section class="glass approvals-card">
        <div class="section-head">
          <div><h2>Tasdiqlash navbati <span class="count-badge">{{ approvals.length }}</span></h2><p>Ko‘rib chiqish kerak bo‘lgan ishlar</p></div>
          <span class="icon-tile tone-amber"><Icon name="clock" :size="18" /></span>
        </div>
        <div v-if="approvals.length" class="approval-list">
          <button v-for="entry in approvals.slice(0, 3)" :key="entry.item.id" class="approval-row" @click="emit('edit', entry.kind, entry.item.id)">
            <span class="icon-tile" :class="entry.kind === 'content' ? 'tone-purple' : 'tone-blue'"><Icon :name="entry.kind === 'content' ? 'image' : 'megaphone'" :size="17" /></span>
            <span class="approval-copy"><strong>{{ entry.item.title }}</strong><span>{{ entry.item.channel }} · {{ dateLabel(entry.item.date) }}</span></span>
            <Icon name="chevronRight" :size="16" class="subtle" />
          </button>
        </div>
        <div v-else class="approval-empty"><Icon name="check" :size="21" /><span>Tasdiqlash navbati bo‘sh.</span></div>
        <button v-if="approvals.length" class="approval-link" @click="emit('approvals')">Barcha tasdiqlar<Icon name="arrowRight" :size="16" /></button>
      </section>
    </div>

    <section class="glass dashboard-campaigns">
      <div class="section-head">
        <div><h2>Kampaniyalar</h2><p>Ish maydonidagi so‘nggi reklamalar</p></div>
        <button class="button button-secondary" @click="emit('navigate', 'campaigns')">Barchasini ko‘rish<Icon name="arrowRight" :size="16" /></button>
      </div>
      <div v-if="state.campaigns.length" class="table-scroll">
        <table><thead><tr><th>Kampaniya</th><th>Kanal</th><th>Holat</th><th>Kunlik budjet</th><th></th></tr></thead>
          <tbody><tr v-for="item in state.campaigns.slice(0, 4)" :key="item.id">
            <td><button class="table-name" @click="emit('edit', 'campaigns', item.id)">{{ item.title }}</button></td>
            <td>{{ item.channel }}</td><td><Status :value="item.status" /></td><td>{{ money(item.budget, 2) }}</td>
            <td><button class="icon-button ghost" :aria-label="item.title + 'ni ochish'" @click="emit('edit', 'campaigns', item.id)"><Icon name="chevronRight" :size="17" /></button></td>
          </tr></tbody>
        </table>
      </div>
      <p v-else class="subtle">Birinchi kampaniyangizni yarating.</p>
    </section>
  </div>
</template>
