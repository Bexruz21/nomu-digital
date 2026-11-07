<script setup>
import { computed, reactive, ref } from 'vue'
import { allowedStatuses, adChannels, channels, collections, contentFormats, dateKey, sources, statuses, workflow } from '../data.js'
import Icon from './Icon.vue'
import Status from './Status.vue'

const props = defineProps({
  kind: { type: String, required: true },
  record: Object,
  profile: { type: Object, required: true },
  campaigns: { type: Array, default: () => [] },
  defaultDate: String,
})
const emit = defineEmits(['save', 'delete', 'close', 'advance', 'revise', 'result'])
const kind = props.kind
const defaults = {
  strategies: { objective: '', audience: props.profile.audience, kpi: '', budget: props.profile.budget, status: 'draft' },
  content: { channel: 'Instagram', format: 'Post', time: '12:00', status: 'draft' },
  campaigns: { channel: 'Meta Ads', goal: 'Lead yig‘ish', budget: 25, status: 'draft', results: [] },
  leads: { email: '', phone: '', source: 'Boshqa', campaignId: '', status: 'new' },
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
    <p class="confirm-copy">“{{ record.title }}” mahalliy ish maydonidan o‘chiriladi.</p>
    <div class="dialog-actions">
      <button type="button" class="button button-secondary" @click="deleting = false">Ortga</button>
      <button type="button" class="button button-danger" @click="emit('delete')">O‘chirish</button>
    </div>
  </div>
  <form v-else class="dialog-body record-form" @submit.prevent="save">
    <div v-if="record" class="record-context">
      <Status :value="record.status" />
      <span v-if="changed && workflow[kind]" class="subtle small">Holatni o‘zgartirishdan oldin tahrirni saqlang.</span>
    </div>
    <label class="field"><span>{{ titleLabel }}</span><input v-model.trim="draft.title" maxlength="110" required autofocus :placeholder="collections[kind].newLabel" /></label>

    <div v-if="kind === 'strategies'" class="form-grid">
      <label class="field span-2"><span>Biznes maqsadi</span><input v-model.trim="draft.objective" maxlength="180" required placeholder="Masalan, malakali leadlarni 20% ko‘paytirish" /></label>
      <label class="field span-2"><span>Auditoriya</span><input v-model.trim="draft.audience" maxlength="220" required /></label>
      <label class="field"><span>Asosiy KPI</span><input v-model.trim="draft.kpi" maxlength="100" required placeholder="Masalan, 50 ta lead" /></label>
      <label class="field"><span>Umumiy budjet ($)</span><input v-model.number="draft.budget" type="number" min="0" max="30000000" step="0.01" required /></label>
    </div>

    <div v-if="kind === 'content'" class="form-grid">
      <label class="field"><span>Kanal</span><select v-model="draft.channel"><option v-for="channel in channels" :key="channel">{{ channel }}</option></select></label>
      <label class="field"><span>Format</span><select v-model="draft.format"><option v-for="format in contentFormats" :key="format">{{ format }}</option></select></label>
    </div>

    <div v-if="kind === 'campaigns'" class="form-grid">
      <label class="field"><span>Kanal</span><select v-model="draft.channel" :disabled="record?.results?.length > 0"><option v-for="channel in adChannels" :key="channel">{{ channel }}</option></select></label>
      <label class="field"><span>Maqsad</span><select v-model="draft.goal"><option>Lead yig‘ish</option><option>Savdoni oshirish</option><option>Qamrovni oshirish</option></select></label>
      <label class="field span-2"><span>Kunlik budjet ($)</span><input v-model.number="draft.budget" type="number" min="0" max="1000000" step="0.01" required /></label>
    </div>

    <div v-if="kind === 'leads'" class="form-grid">
      <label class="field"><span>Email</span><input v-model.trim="draft.email" type="email" maxlength="150" placeholder="ism@example.com" /></label>
      <label class="field"><span>Telefon</span><input v-model.trim="draft.phone" type="tel" maxlength="40" placeholder="+998" /></label>
      <label class="field"><span>Manba</span><select v-model="draft.source" :disabled="!!draft.campaignId"><option v-for="source in sources" :key="source">{{ source }}</option></select></label>
      <label class="field"><span>Kampaniya</span><select v-model="draft.campaignId" @change="selectCampaign"><option value="">Tanlanmagan</option><option v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">{{ campaign.title }}</option></select></label>
    </div>

    <div v-if="kind === 'tasks'" class="form-grid">
      <label class="field"><span>Mas’ul</span><input v-model.trim="draft.owner" maxlength="80" required /></label>
      <label class="field"><span>Ustuvorlik</span><select v-model="draft.priority"><option>Past</option><option>O‘rta</option><option>Yuqori</option></select></label>
    </div>

    <div class="form-grid">
      <label class="field"><span>{{ kind === 'tasks' || kind === 'strategies' ? 'Muddat' : 'Sana' }}</span><input v-model="draft.date" type="date" required /></label>
      <label v-if="kind === 'content'" class="field"><span>Vaqt</span><input v-model="draft.time" type="time" required /></label>
      <label v-if="!workflow[kind]" class="field"><span>Holat</span><select v-model="draft.status"><option v-for="status in allowedStatuses[kind]" :key="status" :value="status">{{ statuses[status].label }}</option></select></label>
    </div>
    <label class="field"><span>{{ notesLabel }}</span><textarea v-model.trim="draft.notes" rows="4" maxlength="4000" placeholder="Tafsilotlarni yozing…"></textarea></label>
    <p v-if="error" class="field-error" role="alert">{{ error }}</p>

    <div v-if="record && workflow[kind]" class="workflow-actions">
      <button v-if="next" type="button" class="button button-soft" :disabled="changed" @click="emit('advance')"><Icon :name="record.status === 'approved' ? 'play' : 'check'" :size="16" />{{ next[1] }}</button>
      <button v-if="record.status === 'review'" type="button" class="button button-secondary" :disabled="changed" @click="emit('revise')">Qoralamaga qaytarish</button>
      <button v-if="kind === 'campaigns' && ['active', 'paused'].includes(record.status)" type="button" class="button button-secondary" :disabled="changed" @click="emit('result')"><Icon name="chart" :size="16" />Natija kiritish</button>
    </div>
    <div class="dialog-actions">
      <button v-if="record" type="button" class="button button-text danger-text" @click="deleting = true"><Icon name="trash" :size="17" />O‘chirish</button>
      <div class="spacer"></div>
      <button type="button" class="button button-secondary" @click="emit('close')">Bekor qilish</button>
      <button type="submit" class="button button-primary"><Icon name="check" :size="17" />Saqlash</button>
    </div>
  </form>
</template>
