<script setup>
import { ref } from 'vue'
import Brand from '../components/Brand.vue'
import Icon from '../components/Icon.vue'

const emit = defineEmits(['login'])
const login = ref('')
const password = ref('')
const visible = ref(false)
const error = ref('')
const art = import.meta.env.BASE_URL + 'nomu-glass.png'

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
      <header><Brand /></header>
      <section class="login-form-wrap">
        <span class="eyebrow"><i></i> NOMU ISH MAYDONI</span>
        <h1>Ish maydoniga kiring.</h1>
        <p>Marketing rejalaringiz va natijalaringizni boshqaring.</p>
        <form class="login-form" @submit.prevent="enter">
          <label class="field">
            <span>Login</span>
            <span class="input-icon"><Icon name="user" :size="18" /><input v-model="login" autocomplete="username" placeholder="Loginni kiriting" required @input="error = ''" /></span>
          </label>
          <label class="field">
            <span>Parol</span>
            <span class="input-icon password-field">
              <Icon name="lock" :size="18" /><input v-model="password" :type="visible ? 'text' : 'password'" autocomplete="current-password" placeholder="Parolni kiriting" required @input="error = ''" />
              <button type="button" class="icon-button ghost" :aria-label="visible ? 'Parolni yashirish' : 'Parolni ko‘rsatish'" @click="visible = !visible"><Icon :name="visible ? 'eyeOff' : 'eye'" :size="18" /></button>
            </span>
          </label>
          <p v-if="error" class="field-error" role="alert">{{ error }}</p>
          <button type="submit" class="button button-primary login-submit">Kirish<Icon name="arrowRight" :size="18" /></button>
        </form>
        <button type="button" class="demo-login" @click="fill"><span class="icon-tile tone-green"><Icon name="bolt" :size="17" /></span><span><strong>Demo ma’lumotlarini kiritish</strong><small>admin / admin</small></span><Icon name="arrowUpRight" :size="17" /></button>
      </section>
      <footer><span>© NOMU</span><span><i></i> MVP · Demo rejimi</span></footer>
    </div>
    <aside class="login-visual">
      <div class="login-art" :style="{ backgroundImage: 'url(' + art + ')' }"></div>
      <div class="hero-grid"></div>
      <div class="login-visual-top"><span class="hero-tag"><Icon name="sparkles" :size="15" />NOMU INTELLEGENCE</span><span>01 / MARKETING OS</span></div>
      <div class="login-visual-copy">
        <h2>Marketingingiz,<br /><em>bitta ish maydonida.</em></h2>
        <p>Maqsaddan natijagacha bo‘lgan har bir qadamni bir joyda boshqaring.</p>
        <div class="visual-categories"><span><Icon name="target" :size="16" />Strategiya</span><span><Icon name="calendar" :size="16" />Kontent</span><span><Icon name="chart" :size="16" />Analitika</span></div>
      </div>
    </aside>
  </main>
</template>
