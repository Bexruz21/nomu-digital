<script setup>
import { computed, reactive, ref } from 'vue'
import { allowedStatuses, adChannels, channels, collections, contentFormats, dateKey, sources, statuses, workflow } from '../data.js'
import Icon from './Icon.vue'
import Status from './Status.vue'
import { tr } from '../i18n.js'

const props = defineProps({
  kind: { type: String, required: true },
  record: Object,
  profile: { type: Object, required: true },
  campaigns: { type: Array, default: () => [] },
  defaultDate: String,
  defaultStatus: String,
})
const emit = defineEmits(['save', 'delete', 'close', 'advance', 'revise', 'result'])
const kind = props.kind
const defaults = {
  strategies: { objective: '', audience: props.profile.audience, kpi: '', budget: props.profile.budget, status: 'draft' },
  content: { channel: 'Instagram', format: 'Post', time: '12:00', status: 'draft' },
  campaigns: { channel: 'Meta Ads', goal: 'Lead yig‘ish', product: '', budget: 25, status: 'draft', results: [] },
  leads: { email: '', phone: '', source: 'Boshqa', campaignId: '', score:0, value:0, tags:'', lastContact:'', status: allowedStatuses.leads.includes(props.defaultStatus) ? props.defaultStatus : 'new' },
  tasks: { owner: props.profile.owner, priority: 'O‘rta', status: 'todo' },
}
const initial = { title: '', date: props.defaultDate || dateKey(), notes: '', ...defaults[kind], ...props.record }
const draft = reactive({ ...initial })
const deleting = ref(false)
const error = ref('')
const next = computed(() => workflow[kind]?.[props.record?.status])
const changed = computed(() => Object.keys(initial).some((key) => key !== 'results' && draft[key] !== initial[key]))
const titleLabel = kind === 'leads' ? 'Ism va familiya' : 'Nomi'
const notesLabel = kind === 'content' ? 'Kontent matni yoki ssenariy' : kind === 'campaigns' ? 'Taklif, auditoriya va kreativlar' : 'Izoh'

function save() {
  error.value = ''
  if (!draft.title.trim()) {
    error.value = 'Nomini kiriting.'
    return
  }
  const required = kind === 'strategies' ? ['objective', 'audience', 'kpi'] : kind === 'tasks' ? ['owner'] : []
  if (required.some((key) => !draft[key].trim())) {
    error.value = 'Majburiy maydonlarni to‘ldiring.'
    return
  }
  if (kind === 'leads' && !draft.email && !draft.phone) {
    error.value = 'Email yoki telefon raqamini kiriting.'
    return
  }
  emit('save', { ...draft, title: draft.title.trim() })
}

function selectCampaign() {
  const campaign = props.campaigns.find((item) => item.id === draft.campaignId)
  if (campaign) draft.source = campaign.channel
}
</script>

<template>
  <div v-if="deleting" class="dialog-body">
    <p class="confirm-copy">“{{ $t(record.title) }}{{ $t("” mahalliy ish maydonidan o‘chiriladi.") }}</p>
    <div class="dialog-actions">
      <button type="button" class="button button-secondary" @click="deleting = false">{{ $t("Ortga") }}</button>
      <button type="button" class="button button-danger" @click="emit('delete')">{{ $t("O‘chirish") }}</button>
    </div>
  </div>
  <form v-else class="dialog-body record-form" @submit.prevent="save">
    <div v-if="record" class="record-context">
      <Status :value="record.status" />
      <span v-if="changed && workflow[kind]" class="subtle small">{{ $t("Holatni o‘zgartirishdan oldin tahrirni saqlang.") }}</span>
    </div>
    <label class="field"><span>{{ $t(titleLabel) }}</span><input v-model.trim="draft.title" maxlength="110" required autofocus :placeholder="$t(collections[kind].newLabel)" /></label>

    <div v-if="kind === 'strategies'" class="form-grid">
      <label class="field span-2"><span>{{ $t("Biznes maqsadi") }}</span><input v-model.trim="draft.objective" maxlength="180" required :placeholder='$t("Masalan, malakali leadlarni 20% ko‘paytirish")' /></label>
      <label class="field span-2"><span>{{ $t("Auditoriya") }}</span><input v-model.trim="draft.audience" maxlength="220" required /></label>
      <label class="field"><span>{{ $t("Asosiy KPI") }}</span><input v-model.trim="draft.kpi" maxlength="100" required :placeholder='$t("Masalan, 50 ta lead")' /></label>
      <label class="field"><span>{{ $t("Umumiy budjet ($)") }}</span><input v-model.number="draft.budget" type="number" min="0" max="30000000" step="0.01" required /></label>
    </div>

    <div v-if="kind === 'content'" class="form-grid">
      <label class="field"><span>{{ $t("Kanal") }}</span><select v-model="draft.channel"><option :value='channel' v-for="channel in channels" :key="channel">{{ $t(channel) }}</option></select></label>
      <label class="field"><span>{{ $t("Format") }}</span><select v-model="draft.format"><option :value='format' v-for="format in contentFormats" :key="format">{{ $t(format) }}</option></select></label>
    </div>

    <div v-if="kind === 'campaigns'" class="form-grid">
      <label class="field span-2"><span>{{tr('Mahsulot yoki xizmat','Продукт или услуга','Product or service')}}</span><input v-model.trim="draft.product" maxlength="120"/></label>
      <label class="field"><span>{{ $t("Kanal") }}</span><select v-model="draft.channel" :disabled="record?.results?.length > 0"><option :value='channel' v-for="channel in adChannels" :key="channel">{{ $t(channel) }}</option></select></label>
      <label class="field"><span>{{ $t("Maqsad") }}</span><select v-model="draft.goal"><option :value='"Lead yig‘ish"'>{{ $t("Lead yig‘ish") }}</option><option :value='"Savdoni oshirish"'>{{ $t("Savdoni oshirish") }}</option><option :value='"Qamrovni oshirish"'>{{ $t("Qamrovni oshirish") }}</option></select></label>
      <label class="field span-2"><span>{{ $t("Kunlik budjet ($)") }}</span><input v-model.number="draft.budget" type="number" min="0" max="1000000" step="0.01" required /></label>
    </div>

    <div v-if="kind === 'leads'" class="form-grid">
      <label class="field"><span>{{tr('Sifat bahosi (0–100)','Оценка качества (0–100)','Quality score (0–100)')}}</span><input v-model.number="draft.score" type="number" min="0" max="100" required/></label>
      <label class="field"><span>{{tr('Bitim qiymati ($)','Стоимость сделки ($)','Deal value ($)')}}</span><input v-model.number="draft.value" type="number" min="0" max="1000000000" step=".01" required/></label>
      <label class="field"><span>{{tr('Teglar','Метки','Tags')}}</span><input v-model.trim="draft.tags" maxlength="250"/></label>
      <label class="field"><span>{{tr('Oxirgi aloqa','Последний контакт','Last contact')}}</span><input v-model="draft.lastContact" type="date" :max="dateKey()"/></label>
      <label class="field"><span>{{ $t("Email") }}</span><input v-model.trim="draft.email" type="email" maxlength="150" :placeholder='$t("ism@example.com")' /></label>
      <label class="field"><span>{{ $t("Telefon") }}</span><input v-model.trim="draft.phone" type="tel" maxlength="40" :placeholder='$t("+998")' /></label>
      <label class="field"><span>{{ $t("Manba") }}</span><select v-model="draft.source" :disabled="!!draft.campaignId"><option :value='source' v-for="source in sources" :key="source">{{ $t(source) }}</option></select></label>
      <label class="field"><span>{{ $t("Kampaniya") }}</span><select v-model="draft.campaignId" @change="selectCampaign"><option value="">{{ $t("Tanlanmagan") }}</option><option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">{{ $t(campaign.title) }}</option></select></label>
    </div>

    <div v-if="kind === 'tasks'" class="form-grid">
      <label class="field"><span>{{ $t("Mas’ul") }}</span><input v-model.trim="draft.owner" maxlength="80" required /></label>
      <label class="field"><span>{{ $t("Ustuvorlik") }}</span><select v-model="draft.priority"><option :value='"Past"'>{{ $t("Past") }}</option><option :value='"O‘rta"'>{{ $t("O‘rta") }}</option><option :value='"Yuqori"'>{{ $t("Yuqori") }}</option></select></label>
    </div>

    <div class="form-grid">
      <label class="field"><span>{{ $t(kind === 'tasks' || kind === 'strategies' ? $t('Muddat') : $t('Sana')) }}</span><input v-model="draft.date" type="date" required /></label>
      <label v-if="kind === 'content'" class="field"><span>{{ $t("Vaqt") }}</span><input v-model="draft.time" type="time" required /></label>
      <label v-if="!workflow[kind]" class="field"><span>{{ $t("Holat") }}</span><select v-model="draft.status" :aria-label='$t("Holat")'><option v-for="status in allowedStatuses[kind]" :key="status" :value="status">{{ $t(statuses[status].label) }}</option></select></label>
    </div>
    <label class="field"><span>{{ $t(notesLabel) }}</span><textarea v-model.trim="draft.notes" rows="4" maxlength="4000" :placeholder='$t("Tafsilotlarni yozing…")'></textarea></label>
    <p v-if="error" class="field-error" role="alert">{{ $t(error) }}</p>

    <div v-if="record && workflow[kind]" class="workflow-actions">
      <button v-if="next" type="button" class="button button-soft" :disabled="changed" @click="emit('advance')"><Icon :name="record.status === 'approved' ? 'play' : 'check'" :size="16" />{{ $t(next[1]) }}</button>
      <button v-if="record.status === 'review'" type="button" class="button button-secondary" :disabled="changed" @click="emit('revise')">{{ $t("Qoralamaga qaytarish") }}</button>
      <button v-if="kind === 'campaigns' && ['active', 'paused'].includes(record.status)" type="button" class="button button-secondary" :disabled="changed" @click="emit('result')"><Icon name="chart" :size="16" />{{ $t("Natija kiritish") }}</button>
    </div>
    <div class="dialog-actions">
      <button v-if="record" type="button" class="button button-text danger-text" @click="deleting = true"><Icon name="trash" :size="17" />{{ $t("O‘chirish") }}</button>
      <div class="spacer"></div>
      <button type="button" class="button button-secondary" @click="emit('close')">{{ $t("Bekor qilish") }}</button>
      <button type="submit" class="button button-primary"><Icon name="check" :size="17" />{{ $t("Saqlash") }}</button>
    </div>
  </form>
</template>
