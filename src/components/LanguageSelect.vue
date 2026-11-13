<script setup>
import { languages, locale, setLocale, tr } from '../i18n.js'
</script>
<template>
  <select class="language-select" :value="locale" :title="languages.find(item=>item.id===locale)?.label" :aria-label="tr('Til', 'Язык', 'Language')" @change="setLocale($event.target.value)">
    <option v-for="language in languages" :key="language.id" :value="language.id">{{ language.short }}</option>
  </select>
</template>
