<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { brandName } from '../data.js'
import { integrationAccounts, integrationResources } from '../integrations.js'
import Dialog from './Dialog.vue'
import Icon from './Icon.vue'
import IntegrationMark from './IntegrationMark.vue'
import { localeTag, tr } from '../i18n.js'

const props = defineProps({ provider: { type: Object, required: true }, connection: Object })
const emit = defineEmits(['connect', 'disconnect', 'close'])
const stage = ref(props.connection ? 'details' : 'account')
const accountId = ref('')
const resourceId = ref('')
const stageTitle = ref(null)
const provider = props.provider
const isTelegram = provider.id === 'telegram'
const steps = [
  { id: 'account', label: isTelegram ? 'Bot' : 'Hisob' },
  { id: 'resource', label: isTelegram ? 'Kanal' : 'Resurs' },
  { id: 'consent', label: 'Ruxsatlar' },
]
const activeStep = computed(() => steps.findIndex((step) => step.id === stage.value))
const accounts = integrationAccounts(provider)
const resources = computed(() => integrationResources(provider, accountId.value))
const selected = computed(() => {
  const saved = ['details', 'disconnect'].includes(stage.value) ? props.connection : null
  return {
    account: accounts.find((item) => item.id === (saved?.accountId ?? accountId.value)),
    resource: provider.resources.find((item) => item.id === (saved?.resourceId ?? resourceId.value)),
  }
})
const connectionTime = computed(() => props.connection?.connectedAt
  ? new Intl.DateTimeFormat(localeTag(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(props.connection.connectedAt))
  : 'Oldindan ulangan demo')

watch(stage, async () => {
  await nextTick()
  stageTitle.value?.focus({ preventScroll: true })
})
watch(() => props.connection, (current, previous) => {
  if (previous && !current) emit('close')
})

function confirmConnection() {
  if (!selected.value.account || !resources.value.some((item) => item.id === resourceId.value)) return
  emit('connect', { providerId: provider.id, accountId: accountId.value, resourceId: resourceId.value })
  stage.value = 'success'
}

function disconnect() {
  emit('disconnect', provider.id)
  emit('close')
}
</script>

<template>
  <Dialog wide :title="$t(provider.name)" :subtitle='$t("Demo ulanish")' @close="emit('close')">
    <div class="dialog-body integration-flow">
      <div class="flow-provider">
        <IntegrationMark :provider="provider" />
        <div><strong>{{ $t(provider.name) }} ↔ {{ $t(brandName) }}</strong><span>{{ $t(provider.category) }} {{ $t("· Namunaviy ulanish") }}</span></div>
        <span class="status-chip tone-purple"><i></i>{{ $t("Demo") }}</span>
      </div>

      <ol v-if="activeStep !== -1" class="flow-steps" :aria-label='$t("Ulanish bosqichlari")'>
        <li v-for="(step, index) in steps" :key="step.id" :class="{ 'is-current': index === activeStep, 'is-complete': index < activeStep }"
          :aria-current="index === activeStep ? 'step' : undefined">
          <span><Icon v-if="index < activeStep" name="check" :size="13" /><template v-else>{{ $t(index + 1) }}</template></span>{{ $t(step.label) }}
        </li>
      </ol>

      <template v-if="stage === 'account'">
        <div class="flow-heading">
          <h3 ref="stageTitle" tabindex="-1">{{ $t(isTelegram ? $t('Demo botni tanlang') : $t('Demo hisobni tanlang')) }}</h3>
          <p>{{ isTelegram ? $t('Ulanishda kanalga biriktiriladigan botni tanlang.') : tr('{platform} orqali davom etish uchun demo hisob tanlang.','Выберите демо-аккаунт, чтобы продолжить через {platform}.','Choose a demo account to continue with {platform}.',{platform:provider.platform}) }}</p>
        </div>
        <fieldset class="flow-options" :aria-label="$t(isTelegram ? $t('Demo botlar') : $t('Demo hisoblar'))">
          <label v-for="account in accounts" :key="account.id" class="flow-option" :class="{ selected: accountId === account.id }">
            <span class="icon-tile tone-neutral">{{ $t(account.initials) }}</span>
            <span><strong>{{ $t(account.name) }}</strong><small>{{ $t(account.detail) }}</small></span>
            <input v-model="accountId" type="radio" name="integration-account" :value="account.id" @change="resourceId = ''" />
          </label>
        </fieldset>
        <div class="dialog-actions">
          <button class="button button-secondary" @click="emit('close')">{{ $t("Bekor qilish") }}</button>
          <button class="button button-primary" :disabled="!accountId" @click="stage = 'resource'">{{ $t("Davom etish") }}<Icon name="arrowRight" :size="16" /></button>
        </div>
      </template>

      <template v-else-if="stage === 'resource'">
        <div class="flow-heading">
          <h3 ref="stageTitle" tabindex="-1">{{ $t("Ulanadigan resursni tanlang") }}</h3>
          <p>{{ $t(selected.account?.name) }} {{ $t("uchun mavjud demo resurslari.") }}</p>
        </div>
        <fieldset class="flow-options" :aria-label="$t(provider.resourceLabel)">
          <label v-for="resource in resources" :key="resource.id" class="flow-option" :class="{ selected: resourceId === resource.id }">
            <span class="icon-tile" :class="'tone-' + provider.color"><Icon :name="provider.resourceIcon" :size="18" /></span>
            <span><strong>{{ $t(resource.name) }}</strong><small>{{ $t(provider.resourceLabel) }} · {{ $t(resource.code) }}</small></span>
            <input v-model="resourceId" type="radio" name="integration-resource" :value="resource.id" />
          </label>
        </fieldset>
        <div class="dialog-actions">
          <button class="button button-secondary" @click="stage = 'account'"><Icon name="chevronLeft" :size="16" />{{ $t("Ortga") }}</button>
          <button class="button button-primary" :disabled="!resourceId" @click="stage = 'consent'">{{ $t("Ruxsatlarni ko‘rish") }}<Icon name="arrowRight" :size="16" /></button>
        </div>
      </template>

      <template v-else-if="stage === 'consent'">
        <div class="flow-heading">
          <h3 ref="stageTitle" tabindex="-1">{{ $t("Ruxsatlarni ko‘rib chiqing") }}</h3>
          <p>{{ $t(selected.resource?.name) }} · {{ $t(selected.account?.name) }}</p>
        </div>
        <ul class="flow-permissions">
          <li v-for="permission in provider.permissions" :key="permission.title">
            <span class="icon-tile tone-purple"><Icon name="shield" :size="17" /></span>
            <span><strong>{{ $t(permission.title) }}</strong><small>{{ $t(permission.detail) }}</small></span>
          </li>
        </ul>
        <p class="flow-note"><Icon name="info" :size="16" /> {{ $t("Bu ekranda namunaviy ruxsatlar tasdiqlanadi.") }}</p>
        <div class="dialog-actions">
          <button class="button button-secondary" @click="stage = 'resource'"><Icon name="chevronLeft" :size="16" />{{ $t("Ortga") }}</button>
          <button class="button button-primary" @click="confirmConnection"><Icon name="check" :size="17" />{{ $t("Tasdiqlash va ulash") }}</button>
        </div>
      </template>

      <template v-else-if="stage === 'success'">
        <div class="flow-success">
          <span class="icon-tile tone-green"><Icon name="check" :size="26" /></span>
          <h3 ref="stageTitle" tabindex="-1">{{ $t("Demo ulanish tayyor") }}</h3>
          <p>{{ $t(selected.resource?.name) }} {{ $t("integratsiyalar ro‘yxatiga qo‘shildi.") }}</p>
        </div>
        <div class="dialog-actions"><button class="button button-primary" @click="emit('close')">{{ $t("Tayyor") }}</button></div>
      </template>

      <template v-else-if="stage === 'details'">
        <div class="flow-heading flow-details-heading">
          <h3 ref="stageTitle" tabindex="-1">{{ $t("Ulanish tafsilotlari") }}</h3>
          <span class="status-chip tone-green"><i></i>{{ $t("Demo ulangan") }}</span>
        </div>
        <dl class="flow-details">
          <div><dt>{{ $t(isTelegram ? $t('Bot') : $t('Hisob')) }}</dt><dd>{{ $t(selected.account?.name) }} <small>{{ $t(selected.account?.detail) }}</small></dd></div>
          <div><dt>{{ $t(provider.resourceLabel) }}</dt><dd>{{ $t(selected.resource?.name) }} <small>{{ $t(selected.resource?.code) }}</small></dd></div>
          <div><dt>{{ $t("Ulangan vaqt") }}</dt><dd>{{ $t(connectionTime) }}</dd></div>
          <div><dt>{{ $t("Demo ruxsatlari") }}</dt><dd>{{ $t(provider.permissions.map((item) => item.title).join(', ')) }}</dd></div>
        </dl>
        <div class="dialog-actions">
          <button class="button button-secondary danger-text" @click="stage = 'disconnect'"><Icon name="logout" :size="17" />{{ $t("Uzish") }}</button>
          <button class="button button-primary" @click="emit('close')">{{ $t("Yopish") }}</button>
        </div>
      </template>

      <template v-else>
        <div class="flow-heading">
          <h3 ref="stageTitle" tabindex="-1">{{ $t("Demo ulanishni uzish") }}</h3>
          <p>{{ $t(selected.resource?.name) }} {{ $t("integratsiyalar ro‘yxatidan uziladi.") }}</p>
        </div>
        <div class="dialog-actions">
          <button class="button button-secondary" @click="stage = 'details'">{{ $t("Ortga") }}</button>
          <button class="button button-danger" @click="disconnect">{{ $t("Demo ulanishni uzish") }}</button>
        </div>
      </template>
    </div>
  </Dialog>
</template>

<style scoped>
.integration-flow { display: grid; gap: 13px; }
.flow-provider {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--field);
}
.flow-provider > div { display: grid; gap: 3px; min-width: 0; flex: 1; }
.flow-provider strong { font-size: 13px; overflow-wrap: anywhere; }
.flow-provider > div > span { color: var(--quiet); font-size: 11px; }

.flow-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.flow-steps li { display: flex; align-items: center; gap: 6px; padding: 6px; border: 1px solid var(--line-soft); border-radius: 9px; color: var(--quiet); font-size: 11px; font-weight: 670; }
.flow-steps li > span { display: grid; place-items: center; flex: none; width: 20px; height: 20px; border-radius: 50%; background: var(--hover); }
.flow-steps .is-current { background: var(--accent-soft); color: var(--accent-dark); border-color: color-mix(in srgb, var(--focus) 30%, var(--line)); }
.flow-steps .is-complete > span { background: var(--green-soft); color: var(--green-fg); }

.flow-heading h3, .flow-success h3 { font-size: 17px; font-weight: 740; letter-spacing: -.025em; }
.flow-heading h3:focus, .flow-success h3:focus { outline: 0; }
.flow-heading p, .flow-success p { margin-top: 4px; color: var(--quiet); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.flow-options, .flow-permissions { display: grid; gap: 7px; min-width: 0; border: 0; margin: 0; padding: 0; }
.flow-option, .flow-permissions li { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 8px; border: 1px solid var(--line); border-radius: 11px; background: var(--field); }
.flow-option { cursor: pointer; }
.flow-option:is(:hover, :focus-within, .selected) { border-color: color-mix(in srgb, var(--focus) 60%, var(--line)); }
.flow-option.selected { background: color-mix(in srgb, var(--accent-soft) 55%, var(--field)); }
.flow-option > span:nth-child(2), .flow-permissions li > span:nth-child(2) { display: grid; gap: 4px; flex: 1; min-width: 0; }
.flow-option strong, .flow-permissions strong { font-size: 12px; overflow-wrap: anywhere; }
.flow-option small, .flow-permissions small { color: var(--quiet); font-size: 11px; line-height: 1.4; overflow-wrap: anywhere; }
.flow-option .icon-tile { font-size: 11px; font-weight: 750; }
.flow-option input { flex: none; width: 16px; height: 16px; margin: 0; accent-color: var(--focus); }
.flow-note { display: flex; align-items: center; gap: 7px; color: var(--quiet); font-size: 11px; }
.flow-note svg { color: var(--accent-dark); }
.flow-success { display: grid; justify-items: center; gap: 7px; padding: 12px 4px 6px; text-align: center; }
.flow-success > .icon-tile { width: 49px; height: 49px; border-radius: 15px; }
.flow-details-heading { display: flex; align-items: center; flex-wrap: wrap; justify-content: space-between; gap: 8px; }
.flow-details { display: grid; gap: 7px; }
.flow-details > div { display: grid; grid-template-columns: minmax(95px, .55fr) minmax(0, 1fr); gap: 10px; padding: 8px; border: 1px solid var(--line-soft); border-radius: 9px; background: var(--field); }
.flow-details dt { color: var(--quiet); font-size: 12px; }
.flow-details dd { display: grid; gap: 4px; font-size: 12px; font-weight: 650; overflow-wrap: anywhere; }
.flow-details small { color: var(--quiet); font-size: 10.5px; font-weight: 500; }

@media (max-width: 380px) {
  .flow-steps li { padding: 5px; gap: 4px; }
  .integration-flow .dialog-actions { display: grid; grid-template-columns: minmax(0, 1fr); }
}
</style>
