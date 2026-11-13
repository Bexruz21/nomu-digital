<script setup>
const logo = import.meta.env.BASE_URL + 'marketlane.svg'
</script>

<template>
  <span class="brand">
    <span class="brand-mark"><img :src="logo" width="27" height="22" alt="" /></span>
    <strong class="brand-name">{{ $t("Marketlane") }}<span>{{ $t(".ai") }}</span></strong>
  </span>
</template>
