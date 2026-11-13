<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from './Icon.vue'

defineProps({ title: String, subtitle: String, wide: Boolean, bare: Boolean })
const emit = defineEmits(['close'])
const dialog = ref()

onMounted(() => dialog.value.showModal())
onBeforeUnmount(() => dialog.value?.close())
</script>

<template>
  <dialog ref="dialog" class="dialog" :class="{ 'dialog-wide': wide }" :aria-label="$t(title)"
    @cancel.prevent="emit('close')" @click.self="emit('close')">
    <section class="dialog-inner">
      <header v-if="!bare" class="dialog-head">
        <div><h2>{{ $t(title) }}</h2><p v-if="subtitle">{{ $t(subtitle) }}</p></div>
        <button type="button" class="icon-button" :aria-label='$t("Yopish")' @click="emit('close')"><Icon name="close" :size="19" /></button>
      </header>
      <slot />
    </section>
  </dialog>
</template>
