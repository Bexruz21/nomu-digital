<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { aiName, collections, money } from '../data.js'
import { assistantModes, copyText } from '../marketing.js'
import Icon from '../components/Icon.vue'

const props = defineProps({ state: Object })
const emit = defineEmits(['send', 'apply', 'navigate', 'clear', 'notify'])
const prompt = ref('')
const mode = ref('plan')
const composer = ref()
const thread = ref()
const messages = computed(() => props.state.messages)
const latestId = computed(() => messages.value.at(-1)?.id)

watch(latestId, async (id, previous) => {
  if (!id || id === previous) return
  await nextTick()
  thread.value?.lastElementChild?.scrollIntoView({ block: 'nearest' })
})

function choose(item) {
  mode.value = item.id
  prompt.value = item.prompt
  composer.value?.focus()
}

function send() {
  if (!prompt.value.trim()) return
  emit('send', prompt.value.trim(), mode.value)
  prompt.value = ''
}

async function copy(reply) {
  try {
    await copyText(reply.blocks.map((block) => block.title + '\n' + block.lines.join('\n')).join('\n\n'))
    emit('notify', 'Natija nusxalandi.')
  } catch {
    emit('notify', 'Nusxalash uchun matnni belgilang.')
  }
}
</script>

<template>
  <div class="page-stack">
    <header class="page-heading">
      <div><div class="eyebrow"><i></i> AI YORDAMCHI</div><h1>{{ aiName }}</h1><p>Maqsadingizni yozing va ish maydoniga qo‘shiladigan reja oling.</p></div>
      <button v-if="messages.length" class="button button-secondary" @click="emit('clear')"><Icon name="plus" :size="17" />Yangi suhbat</button>
    </header>

    <div class="assistant-layout">
      <section class="glass assistant-card">
        <div class="assistant-top">
          <span class="icon-tile tone-purple"><Icon name="sparkles" :size="20" /></span>
          <div><strong>Marketing yordamchisi</strong><small>Biznes profilingiz asosida</small></div>
          <span class="status-chip tone-green"><i></i> Demo AI</span>
        </div>
        <div v-if="!messages.length" class="assistant-welcome">
          <span class="assistant-orb"><Icon name="sparkles" :size="33" /></span>
          <h2>Bugun nimani rejalashtiramiz?</h2>
          <p>Vazifa turini tanlang yoki o‘z topshirig‘ingizni yozing.</p>
          <div class="prompt-grid">
            <button v-for="item in assistantModes" :key="item.id" class="prompt-card" @click="choose(item)">
              <Icon :name="item.icon" :size="18" /><span>{{ item.label }}</span><Icon name="arrowUpRight" :size="15" />
            </button>
          </div>
        </div>
        <div v-else ref="thread" class="assistant-thread" aria-live="polite">
          <article v-for="reply in messages" :key="reply.id" class="assistant-exchange">
            <p class="user-prompt">{{ reply.prompt }}</p>
            <div class="reply">
              <div class="reply-title"><span class="icon-tile tone-purple"><Icon name="sparkles" :size="16" /></span><strong>{{ reply.title }}</strong></div>
              <p>{{ reply.intro }}</p>
              <section v-for="block in reply.blocks" :key="block.title" class="reply-block">
                <h3><Icon :name="block.icon" :size="17" />{{ block.title }}</h3>
                <ul><li v-for="(line, index) in block.lines" :key="index">{{ line }}</li></ul>
              </section>
              <div class="reply-actions">
                <button v-if="Object.keys(reply.bundle).length && !reply.applied" class="button button-primary" @click="emit('apply', reply.id)"><Icon name="plus" :size="17" />Ish maydoniga qo‘shish</button>
                <template v-if="reply.applied">
                  <span class="status-chip tone-green"><Icon name="check" :size="14" />Qo‘shildi</span>
                  <button v-for="kind in Object.keys(reply.bundle)" :key="kind" class="button button-secondary button-compact" @click="emit('navigate', kind)">{{ collections[kind].title }}<Icon name="arrowRight" :size="14" /></button>
                </template>
                <button class="button button-secondary button-compact" @click="copy(reply)"><Icon name="copy" :size="15" />Nusxalash</button>
              </div>
            </div>
          </article>
        </div>
        <form class="composer" @submit.prevent="send">
          <label class="sr-only" for="assistant-prompt">Marketing topshirig‘i</label>
          <textarea id="assistant-prompt" ref="composer" v-model="prompt" placeholder="Masalan, keyingi oy savdoni oshirish rejasini tuz…" rows="3" maxlength="1500"
            @keydown.ctrl.enter.prevent="send" @keydown.meta.enter.prevent="send"></textarea>
          <div class="composer-controls">
            <label class="filter-select"><Icon name="sparkles" :size="16" /><select v-model="mode" aria-label="Vazifa turi"><option v-for="item in assistantModes" :key="item.id" :value="item.id">{{ item.label }}</option></select></label>
            <button class="button button-primary" type="submit" :disabled="!prompt.trim()"><Icon name="send" :size="17" />Yuborish</button>
          </div>
        </form>
        <p class="composer-note"><Icon name="info" :size="14" /> Demo yordamchi javoblarni mahalliy shablonlar va ish maydoni ma’lumotlaridan tuzadi.</p>
      </section>

      <aside class="assistant-side">
        <section class="glass side-card">
          <div class="section-head"><div><h2>Biznes konteksti</h2><p>Yordamchi ishlatadigan profil</p></div><span class="icon-tile tone-green"><Icon name="building" :size="19" /></span></div>
          <dl class="context-list">
            <div><dt>Kompaniya</dt><dd>{{ state.profile.name }}</dd></div>
            <div><dt>Soha</dt><dd>{{ state.profile.industry }}</dd></div>
            <div><dt>Auditoriya</dt><dd>{{ state.profile.audience }}</dd></div>
            <div><dt>Oylik budjet</dt><dd>{{ money(state.profile.budget, 2) }}</dd></div>
          </dl>
          <button class="approval-link" @click="emit('navigate', 'settings')">Profilni tahrirlash<Icon name="arrowRight" :size="16" /></button>
        </section>
        <section class="glass side-card">
          <div class="section-head"><div><h2>Ish jarayoni</h2></div></div>
          <ol class="flow-list">
            <li><span>01</span> Biznes maqsadini yozing</li>
            <li><span>02</span> Qoralamalarni ish maydoniga qo‘shing</li>
            <li><span>03</span> Kontent va reklamani tasdiqlang</li>
            <li><span>04</span> Natijalarni analitikada kuzating</li>
          </ol>
        </section>
      </aside>
    </div>
  </div>
</template>
