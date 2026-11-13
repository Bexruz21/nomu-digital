<script setup>
import { computed, ref } from 'vue'
import { dateLabel } from '../data.js'
import { copyText, toolOutput, toolsCatalog } from '../marketing.js'
import Icon from '../components/Icon.vue'

const props = defineProps({ state: Object })
const emit = defineEmits(['save', 'remove', 'lead', 'notify', 'navigate'])
const selected = ref('seo')
const topic = ref('')
const detail = ref('')
const variant = ref(toolsCatalog[0].variants[0])
const result = ref(null)
const contactName = ref('')
const contactEmail = ref('')
const captured = ref(false)
const tool = computed(() => toolsCatalog.find((item) => item.id === selected.value))
const saved = computed(() => props.state.savedTools.some((item) => item.id === result.value?.id))

function choose(id) {
  selected.value = id
  topic.value = ''
  detail.value = ''
  variant.value = tool.value.variants[0]
  result.value = null
  contactName.value = ''
  contactEmail.value = ''
  captured.value = false
}

function generate() {
  if (!topic.value.trim()) return
  result.value = toolOutput(tool.value, topic.value.trim(), variant.value, detail.value.trim(), props.state.profile)
  captured.value = false
}

function openDraft(item) {
  choose(item.tool)
  topic.value = item.title
  variant.value = item.variant
  result.value = item
}

async function copy() {
  try {
    await copyText(result.value.lines.join('\n\n'))
    emit('notify', 'Qoralama nusxalandi.')
  } catch {
    emit('notify', 'Nusxalash uchun matnni belgilang.')
  }
}

function captureLead() {
  if (!contactName.value.trim() || !contactEmail.value.trim()) return
  emit('lead', { title: contactName.value.trim(), email: contactEmail.value.trim(), notes: result.value.title })
  contactName.value = ''
  contactEmail.value = ''
  captured.value = true
}
</script>

<template>
  <div class="page-stack">
    <header class="page-heading">
      <div><div class="eyebrow"><i></i> {{ $t("BOSHQARUV") }}</div><h1>{{ $t("Marketing vositalari") }}</h1><p>{{ $t("SEO, xabarlar, kreativ briflar va landing sahifalarni sinab ko‘ring.") }}</p></div>
    </header>
    <div class="tools-grid">
      <button v-for="item in toolsCatalog" :key="item.id" class="glass tool-card" :aria-pressed="selected === item.id" @click="choose(item.id)">
        <span class="icon-tile" :class="'tone-' + item.color"><Icon :name="item.icon" :size="22" /></span>
        <span><strong>{{ $t(item.title) }}</strong><small>{{ $t(item.summary) }}</small></span>
        <Icon name="arrowUpRight" :size="17" />
      </button>
    </div>
    <div class="tool-workspace">
      <section class="glass tool-form">
        <div class="section-head"><div><h2>{{ $t(tool.title) }}</h2><p>{{ $t(tool.summary) }}</p></div><span class="icon-tile" :class="'tone-' + tool.color"><Icon :name="tool.icon" :size="19" /></span></div>
        <form class="record-form" @submit.prevent="generate">
          <label class="field"><span>{{ $t(tool.field) }}</span><input v-model.trim="topic" required maxlength="140" :placeholder="$t(tool.id === 'seo' && state.profile.website ? state.profile.website : tool.example)" /></label>
          <label class="field"><span>{{ $t("Variant") }}</span><select v-model="variant"><option :value='option' v-for="option in tool.variants" :key="option">{{ $t(option) }}</option></select></label>
          <label v-if="['landing', 'brand'].includes(tool.id)" class="field"><span>{{ $t("Auditoriya (ixtiyoriy)") }}</span><input v-model.trim="detail" maxlength="220" :placeholder="$t(state.profile.audience)" /></label>
          <button type="submit" class="button button-primary"><Icon name="sparkles" :size="17" />{{ $t("Qoralama tayyorlash") }}</button>
        </form>
        <div v-if="state.savedTools.length" class="saved-tools">
          <h3>{{ $t("Saqlangan qoralamalar") }}</h3>
          <button v-for="item in state.savedTools" :key="item.id" class="approval-row" @click="openDraft(item)">
            <span class="icon-tile tone-neutral"><Icon name="file" :size="17" /></span><span class="approval-copy"><strong>{{ $t(item.title) }}</strong><span>{{ $t(item.variant) }} · {{ $t(dateLabel(item.date)) }}</span></span><Icon name="chevronRight" :size="16" />
          </button>
        </div>
      </section>
      <section class="glass tool-output">
        <div class="section-head"><div><h2>{{ $t("Natija") }}</h2><p>{{ $t(result ? result.variant : $t('Qoralamani shu yerda ko‘rasiz')) }}</p></div><span class="status-chip tone-neutral"><i></i> {{ $t("Demo") }}</span></div>
        <template v-if="result">
          <div v-if="result.landing" class="landing-preview">
            <span class="eyebrow">{{ $t("LANDING · JONLI MAHALLIY MAKET") }}</span>
            <h3>{{ $t(result.landing.heading) }}</h3>
            <p>{{ $t(result.landing.tagline) }}</p>
            <form v-if="!captured" class="record-form" @submit.prevent="captureLead">
              <label class="field"><span>{{ $t("Ism") }}</span><input v-model.trim="contactName" required maxlength="110" :placeholder='$t("Ismingiz")' /></label>
              <label class="field"><span>{{ $t("Email") }}</span><input v-model.trim="contactEmail" type="email" required maxlength="150" :placeholder='$t("ism@example.com")' /></label>
              <button type="submit" class="button button-primary">{{ $t(result.landing.cta) }}<Icon name="arrowRight" :size="16" /></button>
            </form>
            <div v-else class="landing-success">
              <p><Icon name="check" :size="18" />{{ $t("Murojaat CRM’ga qo‘shildi.") }}</p>
              <button class="button button-secondary" @click="emit('navigate', 'leads')">{{ $t("Leadlarni ochish") }}<Icon name="arrowRight" :size="16" /></button>
            </div>
          </div>
          <ul class="tool-lines"><li v-for="(line, i) in result.lines" :key="i">{{ $t(line) }}</li></ul>
          <div class="reply-actions">
            <button class="button button-primary" :disabled="saved" @click="emit('save', result)"><Icon :name="saved ? 'check' : 'plus'" :size="17" />{{ $t(saved ? $t('Saqlangan') : $t('Saqlash')) }}</button>
            <button class="button button-secondary" @click="copy"><Icon name="copy" :size="16" />{{ $t("Nusxalash") }}</button>
            <button v-if="saved" class="icon-button danger-text" :aria-label='$t("Saqlangan qoralamani o‘chirish")' @click="emit('remove', result.id)"><Icon name="trash" :size="17" /></button>
          </div>
        </template>
        <div v-else class="empty-state tool-empty">
          <span class="icon-tile tone-green"><Icon name="file" :size="24" /></span><h2>{{ $t("Qoralamaga tayyor") }}</h2><p>{{ $t("Mavzuni kiriting va variantni tanlang.") }}</p>
        </div>
      </section>
    </div>
  </div>
</template>
