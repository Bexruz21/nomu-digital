<script setup>
const logo = import.meta.env.BASE_URL + 'marketlane.svg'
</script>

<template>
  <span class="brand">
    <span class="brand-mark"><img :src="logo" width="27" height="22" alt="" /></span>
    <strong class="brand-name">Marketlane<span>.ai</span></strong>
  </span>
</template>
