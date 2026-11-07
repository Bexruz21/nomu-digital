<script setup>
import { reactive, watch } from 'vue'
import { integrations } from '../data.js'
import Icon from '../components/Icon.vue'

const props = defineProps({ state: Object, tab: String })
const emit = defineEmits(['save', 'theme', 'connection', 'tab'])
const draft = reactive({ ...props.state.profile })
watch(() => props.state.profile, (profile) => {
  for (const key in profile) {
    if (profile[key] !== draft[key]) draft[key] = profile[key]
  }
}, { deep: true })

const tabs = [{ id: 'profile', label: 'Biznes profili', icon: 'building' }, { id: 'integrations', label: 'Integratsiyalar', icon: 'link' }, { id: 'appearance', label: 'Ko‘rinish', icon: 'sun' }]
</script>

<template>
  <div class="page-stack">
    <header class="page-heading">
      <div><div class="eyebrow"><i></i> BOSHQARUV</div><h1>Sozlamalar</h1><p>Biznes konteksti va ish maydoningizni moslang.</p></div>
    </header>
    <div class="settings-tabs segmented" aria-label="Sozlamalar bo‘limi">
      <button v-for="item in tabs" :key="item.id" :aria-pressed="tab === item.id" @click="emit('tab', item.id)"><Icon :name="item.icon" :size="16" />{{ item.label }}</button>
    </div>
    <section v-if="tab === 'profile'" class="glass settings-panel">
      <div class="section-head"><div><h2>Biznes profili</h2><p>Nomu Intellegence shu ma’lumotlardan foydalanadi.</p></div><span class="icon-tile tone-green"><Icon name="building" :size="21" /></span></div>
      <form class="record-form" @submit.prevent="emit('save', { ...draft })">
        <div class="form-grid">
          <label class="field"><span>Kompaniya nomi</span><input v-model.trim="draft.name" maxlength="60" required /></label>
          <label class="field"><span>Profil ismi</span><input v-model.trim="draft.owner" maxlength="60" required /></label>
          <label class="field"><span>Faoliyat sohasi</span><input v-model.trim="draft.industry" maxlength="100" required /></label>
          <label class="field"><span>Oylik budjet ($)</span><input v-model.number="draft.budget" type="number" min="0" max="30000000" step="0.01" required /></label>
          <label class="field span-2"><span>Mahsulot yoki xizmat</span><input v-model.trim="draft.offer" maxlength="180" required /></label>
          <label class="field span-2"><span>Maqsadli auditoriya</span><input v-model.trim="draft.audience" maxlength="220" required /></label>
          <label class="field span-2"><span>Biznes maqsadi</span><input v-model.trim="draft.objective" maxlength="180" required /></label>
          <label class="field"><span>Brend ohangi</span><input v-model.trim="draft.voice" maxlength="140" required /></label>
          <label class="field"><span>Sayt (ixtiyoriy)</span><input v-model.trim="draft.website" type="url" maxlength="200" placeholder="https://example.com" /></label>
          <label class="field"><span>Brend aksenti</span><span class="color-field"><input v-model="draft.color" type="color" /><code>{{ draft.color.toUpperCase() }}</code></span></label>
        </div>
        <div><button type="submit" class="button button-primary"><Icon name="check" :size="17" />Profilni saqlash</button></div>
      </form>
    </section>
    <section v-else-if="tab === 'integrations'" class="glass settings-panel">
      <div class="section-head"><div><h2>Integratsiyalar</h2><p>Ulanish holatini demo rejimida sinab ko‘ring.</p></div><span class="status-chip tone-neutral"><i></i> Demo</span></div>
      <div class="info-strip"><Icon name="info" :size="18" /> Bu rejimda ulanish holati brauzerda saqlanadi. Akkaunt va API kaliti talab qilinmaydi.</div>
      <div class="integration-list">
        <article v-for="item in integrations" :key="item.name" class="integration-row">
          <span class="icon-tile integration-icon" :class="'tone-' + item.color">{{ item.short }}</span>
          <div><strong>{{ item.name }}</strong><small>{{ item.label }}</small></div>
          <span v-if="state.connections.includes(item.name)" class="status-chip tone-green"><i></i>Demo ulangan</span>
          <button class="button button-secondary" :aria-label="item.name + (state.connections.includes(item.name) ? ' uzish' : ' demo ulash')" @click="emit('connection', item.name)">{{ state.connections.includes(item.name) ? 'Uzish' : 'Demo ulash' }}</button>
        </article>
      </div>
    </section>
    <section v-else class="glass settings-panel">
      <div class="section-head"><div><h2>Ko‘rinish</h2><p>Ish maydoni uchun mavzu tanlang.</p></div><span class="icon-tile tone-green"><Icon name="sun" :size="20" /></span></div>
      <div class="appearance-grid">
        <button v-for="theme in ['light', 'dark']" :key="theme" class="appearance-card" :aria-pressed="state.theme === theme" @click="emit('theme', theme)">
          <span class="appearance-sample" :class="'sample-' + theme"><i></i><i></i><i></i></span>
          <span><Icon :name="theme === 'light' ? 'sun' : 'moon'" :size="18" />{{ theme === 'light' ? 'Yorug‘' : 'Qorong‘i' }}<Icon v-if="state.theme === theme" name="check" :size="17" class="selected-check" /></span>
        </button>
      </div>
    </section>
  </div>
</template>
