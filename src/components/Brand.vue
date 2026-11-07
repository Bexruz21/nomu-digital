<script setup>
defineProps({ small: Boolean })
const logo = import.meta.env.BASE_URL + 'nomu.svg'
</script>

<template>
  <span class="brand" :class="{ 'brand-small': small }">
    <span class="brand-mark"><img :src="logo" width="27" height="21" alt="" /></span>
    <span class="brand-name">
      <strong>nomu<span>.</span></strong>
      <span class="brand-kicker">MARKETING OS</span>
    </span>
  </span>
</template>
