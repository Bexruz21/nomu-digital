<script setup>
import Icon from './Icon.vue'

defineProps({ provider: { type: Object, required: true } })
</script>

<template>
  <span class="provider-mark icon-tile" :class="'tone-' + provider.color" aria-hidden="true">
    <Icon v-if="provider.icon" :name="provider.icon" :size="22" />
    <span v-else>{{ $t(provider.mark) }}</span>
  </span>
</template>

<style scoped>
.provider-mark {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--tone) 18%, transparent);
  background: linear-gradient(150deg, color-mix(in srgb, var(--tone) 18%, var(--tone-bg)), var(--tone-bg));
  font-size: 25px;
  line-height: 1;
  font-weight: 740;
}
</style>
