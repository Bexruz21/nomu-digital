<script setup>
import { ref } from 'vue'
import { aiName, brandName } from '../data.js'
import Brand from '../components/Brand.vue'
import Icon from '../components/Icon.vue'
import LanguageSelect from '../components/LanguageSelect.vue'

const emit = defineEmits(['login'])
const login = ref('')
const password = ref('')
const visible = ref(false)
const error = ref('')
const art = import.meta.env.BASE_URL + 'marketlane-orbit.png'

function enter() {
  if (login.value.trim() === 'admin' && password.value === 'admin') {
    emit('login')
    return
  }
  error.value = 'Login yoki parol xato. Demo uchun admin / admin kiriting.'
}

function fill() {
  login.value = 'admin'
  password.value = 'admin'
  error.value = ''
}
</script>

<template>
  <main class="login-layout">
    <div class="login-left">
      <header class="login-header"><Brand /><LanguageSelect /></header>
      <section class="login-form-wrap">
        <span class="eyebrow"><i></i> {{ $t("MARKETLANE ISH MAYDONI") }}</span>
        <h1>{{ $t("Ish maydoniga kiring.") }}</h1>
        <p>{{ $t("Marketing rejalaringiz va natijalaringizni boshqaring.") }}</p>
        <form class="login-form" @submit.prevent="enter">
          <label class="field">
            <span>{{ $t("Login") }}</span>
            <span class="input-icon"><Icon name="user" :size="18" /><input v-model="login" autocomplete="username" :placeholder='$t("Loginni kiriting")' required @input="error = ''" /></span>
          </label>
          <label class="field">
            <span>{{ $t("Parol") }}</span>
            <span class="input-icon password-field">
              <Icon name="lock" :size="18" /><input v-model="password" :type="visible ? 'text' : 'password'" autocomplete="current-password" :placeholder='$t("Parolni kiriting")' required @input="error = ''" />
              <button type="button" class="icon-button ghost" :aria-label="$t(visible ? $t('Parolni yashirish') : $t('Parolni ko‘rsatish'))" @click="visible = !visible"><Icon :name="visible ? 'eyeOff' : 'eye'" :size="18" /></button>
            </span>
          </label>
          <p v-if="error" class="field-error" role="alert">{{ $t(error) }}</p>
          <button type="submit" class="button button-primary login-submit">{{ $t("Kirish") }}<Icon name="arrowRight" :size="18" /></button>
        </form>
        <button type="button" class="demo-login" @click="fill"><span class="icon-tile tone-green"><Icon name="bolt" :size="17" /></span><span><strong>{{ $t("Demo ma’lumotlarini kiritish") }}</strong><small>{{ $t("admin / admin") }}</small></span><Icon name="arrowUpRight" :size="17" /></button>
      </section>
      <footer><span>© {{ $t(brandName) }}</span><span><i></i> {{ $t("MVP · Demo rejimi") }}</span></footer>
    </div>
    <aside class="login-visual">
      <div class="login-art" :style="{ backgroundImage: 'url(' + art + ')' }"></div>
      <div class="hero-grid"></div>
      <span class="hero-tag"><Icon name="sparkles" :size="15" />{{ $t(aiName.toUpperCase()) }}</span>
      <div class="login-visual-copy">
        <h2>{{ $t("Marketingingiz") }}<br /><em>{{ $t("bitta platformada.") }}</em></h2>
        <p>{{ $t("Maqsaddan natijagacha bo‘lgan har bir qadamni bir joyda boshqaring.") }}</p>
        <div class="visual-categories"><span><Icon name="target" :size="16" />{{ $t("Strategiya") }}</span><span><Icon name="calendar" :size="16" />{{ $t("Kontent") }}</span><span><Icon name="chart" :size="16" />{{ $t("Analitika") }}</span></div>
      </div>
    </aside>
  </main>
</template>
