<script setup>
import { computed, reactive, watch } from 'vue'
import { aiName, money } from '../data.js'
import Icon from './Icon.vue'

const props = defineProps({ profile: { type: Object, required: true } })
const emit = defineEmits(['save'])
const draft = reactive({ ...props.profile })
const dirty = computed(() => Object.keys(draft).some((key) => draft[key] !== props.profile[key]))
const initials = computed(() => draft.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || 'M')

watch(() => props.profile, (profile, previous) => {
  for (const key in profile) {
    if (profile[key] !== previous[key]) draft[key] = profile[key]
  }
})
</script>

<template>
  <div class="profile-layout">
    <form class="profile-form" @submit.prevent="emit('save', { ...draft })">
      <section class="glass profile-section" aria-labelledby="profile-company">
        <div class="profile-section-head">
          <span class="icon-tile tone-purple"><Icon name="building" :size="19" /></span>
          <div><h2 id="profile-company">{{ $t("Kompaniya ma’lumotlari") }}</h2><p>{{ $t("Ish maydonidagi biznes va profil ma’lumotlari.") }}</p></div>
        </div>
        <div class="form-grid">
          <label class="field"><span>{{ $t("Kompaniya nomi") }}</span><input v-model.trim="draft.name" maxlength="60" required /></label>
          <label class="field"><span>{{ $t("Faoliyat sohasi") }}</span><input v-model.trim="draft.industry" maxlength="100" required /></label>
          <label class="field"><span>{{ $t("Profil ismi") }}</span><input v-model.trim="draft.owner" maxlength="60" required /></label>
          <label class="field"><span>{{ $t("Sayt") }} <small>{{ $t("(ixtiyoriy)") }}</small></span><input v-model.trim="draft.website" type="url" maxlength="200" :placeholder='$t("https://example.com")' /></label>
        </div>
      </section>

      <section class="glass profile-section" aria-labelledby="profile-audience">
        <div class="profile-section-head">
          <span class="icon-tile tone-blue"><Icon name="users" :size="19" /></span>
          <div><h2 id="profile-audience">{{ $t("Taklif va auditoriya") }}</h2><p>{{ $t("Nimani taklif qilishingiz va kim bilan muloqot qilishingizni yozing.") }}</p></div>
        </div>
        <div class="form-grid">
          <label class="field"><span>{{ $t("Mahsulot yoki xizmat") }}</span><textarea v-model.trim="draft.offer" maxlength="180" rows="2" required /></label>
          <label class="field"><span>{{ $t("Maqsadli auditoriya") }}</span><textarea v-model.trim="draft.audience" maxlength="220" rows="2" required /></label>
          <label class="field span-2"><span>{{ $t("Brend ohangi") }}</span><input v-model.trim="draft.voice" maxlength="140" required /></label>
        </div>
      </section>

      <section class="glass profile-section" aria-labelledby="profile-goal">
        <div class="profile-section-head">
          <span class="icon-tile tone-pink"><Icon name="target" :size="19" /></span>
          <div><h2 id="profile-goal">{{ $t("Maqsad va budjet") }}</h2><p>{{ $t(aiName) }} {{ $t("reja tuzishda shu chegaralarni hisobga oladi.") }}</p></div>
        </div>
        <div class="form-grid">
          <label class="field"><span>{{ $t("Biznes maqsadi") }}</span><textarea v-model.trim="draft.objective" maxlength="180" rows="2" required /></label>
          <label class="field"><span>{{ $t("Oylik budjet ($)") }}</span><input v-model.number="draft.budget" type="number" min="0" max="30000000" step="0.01" required /></label>
        </div>
      </section>

      <div class="glass profile-actions">
        <span class="profile-save-state" :class="{ 'is-dirty': dirty }" aria-live="polite"><i></i>{{ $t(dirty ? $t('Saqlanmagan o‘zgarishlar') : $t('Profil saqlangan')) }}</span>
        <div class="heading-actions">
          <button v-if="dirty" type="button" class="button button-secondary" @click="Object.assign(draft, profile)">{{ $t("Tiklash") }}</button>
          <button type="submit" class="button button-primary" :disabled="!dirty"><Icon name="check" :size="17" />{{ $t("Profilni saqlash") }}</button>
        </div>
      </div>
    </form>

    <aside class="glass profile-preview" :aria-label='$t("AI konteksti")'>
      <span class="eyebrow"><Icon name="sparkles" :size="14" /> {{ $t("AI KONTEKSTI") }}</span>
      <div class="profile-preview-identity">
        <span class="profile-preview-mark">{{ $t(initials) }}</span>
        <div><h2>{{ $t(draft.name || $t('Biznes nomi')) }}</h2><p>{{ $t(draft.industry || $t('Faoliyat sohasi')) }}</p></div>
      </div>
      <dl>
        <div><dt>{{ $t("Maqsad") }}</dt><dd>{{ $t(draft.objective || '—') }}</dd></div>
        <div><dt>{{ $t("Auditoriya") }}</dt><dd>{{ $t(draft.audience || '—') }}</dd></div>
        <div><dt>{{ $t("Brend ohangi") }}</dt><dd>{{ $t(draft.voice || '—') }}</dd></div>
        <div><dt>{{ $t("Oylik budjet") }}</dt><dd>{{ $t(draft.budget === '' ? '—' : money(draft.budget, 2)) }}</dd></div>
      </dl>
      <p class="profile-preview-note"><Icon name="info" :size="16" /> {{ $t(aiName) }} {{ $t("profilni saqlaganingizdan keyin shu kontekstdan foydalanadi.") }}</p>
    </aside>
  </div>
</template>

<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(255px, 1fr);
  align-items: start;
  gap: 15px;
  max-width: 1200px;
}

.profile-form { display: grid; min-width: 0; gap: 12px; }
.profile-section { padding: 17px; }
.profile-section-head { display: flex; gap: 9px; align-items: start; margin-bottom: 14px; }
.profile-section-head h2 { color: var(--ink); font-size: 16px; font-weight: 730; letter-spacing: -.02em; }
.profile-section-head p { margin-top: 4px; color: var(--quiet); font-size: 12px; line-height: 1.4; }
.profile-section .form-grid { align-items: start; gap: 12px; }
.profile-section .field small { color: var(--quiet); font-weight: 500; }
.profile-actions { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 9px; padding: 10px 12px; border-radius: 14px; }
.profile-save-state { display: inline-flex; align-items: center; gap: 6px; color: var(--quiet); font-size: 12px; }
.profile-save-state i { width: 7px; height: 7px; border-radius: 50%; background: var(--green-fg); }
.profile-save-state.is-dirty i { background: var(--amber-fg); }

.profile-preview {
  position: sticky;
  top: calc(var(--shell-inset) + 72px);
  padding: 16px;
  background: radial-gradient(ellipse at 80% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 63%), var(--panel);
}

.profile-preview > .eyebrow { color: var(--accent-dark); }
.profile-preview-identity { display: flex; align-items: center; gap: 9px; min-width: 0; margin: 14px 0 12px; }
.profile-preview-mark {
  display: grid;
  place-items: center;
  flex: none;
  width: 43px;
  height: 43px;
  border: 1px solid color-mix(in srgb, var(--focus) 45%, var(--line));
  border-radius: 13px;
  color: var(--accent-dark);
  background: var(--accent-soft);
  font-size: 14px;
  font-weight: 760;
}
.profile-preview-identity h2 { font-size: 18px; letter-spacing: -.035em; overflow-wrap: anywhere; }
.profile-preview-identity p { margin-top: 3px; color: var(--quiet); font-size: 12px; overflow-wrap: anywhere; }
.profile-preview dl { display: grid; }
.profile-preview dl > div { display: grid; gap: 4px; padding: 9px 0; border-top: 1px solid var(--line-soft); }
.profile-preview dt { color: var(--quiet); font-size: 11px; }
.profile-preview dd { font-size: 12px; line-height: 1.45; font-weight: 620; overflow-wrap: anywhere; }
.profile-preview-note { display: flex; align-items: flex-start; gap: 7px; padding: 9px; margin-top: 6px; border: 1px solid var(--line-soft); border-radius: 10px; color: var(--muted); background: var(--field); font-size: 11px; line-height: 1.45; }
.profile-preview-note svg { color: var(--accent-dark); }

@container workspace (max-width: 760px) {
  .profile-layout { grid-template-columns: minmax(0, 1fr); }
  .profile-preview { position: static; }
}

@container workspace (max-width: 450px) {
  .profile-section, .profile-preview { padding: 13px; }
  .profile-section .form-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
