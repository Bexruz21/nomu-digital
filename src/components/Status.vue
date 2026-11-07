<script setup>
import { computed } from 'vue'
import { statuses } from '../data.js'

const props = defineProps({ value: { type: String, required: true } })
const status = computed(() => statuses[props.value] || statuses.draft)
</script>

<template>
  <span class="status-chip" :class="'tone-' + status.color"><i />{{ status.label }}</span>
</template>
