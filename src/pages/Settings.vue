<script setup>
import BusinessProfile from '../components/BusinessProfile.vue'
import Icon from '../components/Icon.vue'
import IntegrationCatalog from '../components/IntegrationCatalog.vue'

defineProps({ state: { type: Object, required: true }, tab: { type: String, required: true } })
const emit = defineEmits(['save', 'connect', 'disconnect', 'tab'])
const tabs = [
  { id: 'profile', label: 'Biznes profili', icon: 'building' },
  { id: 'integrations', label: 'Integratsiyalar', icon: 'link' },
]
</script>

<template>
  <div class="page-stack">
    <header class="page-heading">
      <div><div class="eyebrow"><i></i> {{ $t("BOSHQARUV") }}</div><h1>{{ $t("Sozlamalar") }}</h1><p>{{ $t("Biznes ma’lumotlari va ulangan xizmatlarni boshqaring.") }}</p></div>
    </header>
    <div class="settings-tabs segmented" :aria-label='$t("Sozlamalar bo‘limi")'>
      <button v-for="item in tabs" :key="item.id" :aria-pressed="tab === item.id" @click="emit('tab', item.id)"><Icon :name="item.icon" :size="16" />{{ $t(item.label) }}</button>
    </div>
    <BusinessProfile v-show="tab === 'profile'" :profile="state.profile" @save="emit('save', $event)" />
    <IntegrationCatalog v-if="tab === 'integrations'" :connections="state.connections"
      @connect="emit('connect', $event)" @disconnect="emit('disconnect', $event)" />
  </div>
</template>

<style scoped>
.settings-tabs { width: fit-content; max-width: 100%; }
.settings-tabs button { min-height: 32px; padding-inline: 11px; font-size: 12px; }
</style>
