<script setup>
import { periods } from '../data.js'
import Icon from './Icon.vue'
defineProps({ modelValue: Number })
defineEmits(['update:modelValue'])
</script>

<template>
  <label class="period-select">
    <Icon name="calendar" :size="17" />
    <select :value="modelValue" aria-label="Hisobot davri" @change="$emit('update:modelValue', Number($event.target.value))">
      <option v-for="days in periods" :key="days" :value="days">So‘nggi {{ days }} kun</option>
    </select>
    <Icon name="chevronDown" :size="13" class="select-chevron" />
  </label>
</template>
