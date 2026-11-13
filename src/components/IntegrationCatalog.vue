<script setup>
import { computed, ref } from 'vue'
import { integrationProviders } from '../integrations.js'
import Icon from './Icon.vue'
import IntegrationFlow from './IntegrationFlow.vue'
import IntegrationMark from './IntegrationMark.vue'

const props = defineProps({ connections: { type: Array, required: true } })
const emit = defineEmits(['connect', 'disconnect'])
const active = ref(null)
const connectionsByProvider = computed(() => new Map(props.connections.map((item) => [item.providerId, item])))
const cards = computed(() => integrationProviders.map((provider) => {
  const connection = connectionsByProvider.value.get(provider.id)
  return { provider, connection, resource: provider.resources.find((item) => item.id === connection?.resourceId) }
}))
</script>

<template>
  <div class="integration-catalog">
    <section class="glass integration-overview">
      <span class="icon-tile tone-purple"><Icon name="link" :size="22" /></span>
      <div class="integration-overview-copy">
        <span class="eyebrow">{{ $t("MAHALLIY DEMO") }}</span>
        <h2>{{ $t("Kanallar va xizmatlar") }}</h2>
        <p>{{ $t("Namunaviy hisobni tanlang, ruxsatlarni ko‘rib chiqing va ulanishni tasdiqlang.") }}</p>
      </div>
      <div class="integration-count"><strong>{{ $t(connections.length) }} <span>/ {{ $t(integrationProviders.length) }}</span></strong><span>{{ $t("Demo ulangan") }}</span></div>
    </section>

    <div class="integration-grid">
      <article v-for="{ provider, connection, resource } in cards" :key="provider.id" class="glass integration-card" :aria-label="$t(provider.name)">
        <div class="integration-card-top">
          <IntegrationMark :provider="provider" />
          <span class="status-chip" :class="connection ? 'tone-green' : 'tone-neutral'"><i></i>{{ $t(connection ? $t('Demo ulangan') : $t('Ulanmagan')) }}</span>
        </div>
        <div class="integration-card-copy">
          <span>{{ $t(provider.category) }}</span>
          <h3>{{ $t(provider.name) }}</h3>
          <p>{{ $t(provider.description) }}</p>
        </div>
        <div class="integration-card-footer">
          <div v-if="resource" class="integration-resource" :title="$t(resource.name)">
            <Icon :name="provider.resourceIcon" :size="15" /><span>{{ $t(resource.name) }}</span>
          </div>
          <div v-else class="integration-resource"><Icon name="link" :size="15" /><span>{{ $t(provider.resourceLabel) }}</span></div>
          <button class="button button-compact" :class="connection ? 'button-secondary' : 'button-soft'"
            :aria-label="$t(provider.name + (connection ? ' ulanishini boshqarish' : ' demo ulash'))" @click="active = provider">
            {{ $t(connection ? $t('Boshqarish') : $t('Demo ulash')) }}<Icon name="arrowUpRight" :size="14" />
          </button>
        </div>
      </article>
    </div>

    <IntegrationFlow v-if="active" :key="active.id" :provider="active" :connection="connectionsByProvider.get(active.id)"
      @close="active = null" @connect="emit('connect', $event)" @disconnect="emit('disconnect', $event)" />
  </div>
</template>

<style scoped>
.integration-catalog { display: grid; gap: 13px; max-width: 1200px; }
.integration-overview {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background: radial-gradient(ellipse at 95% 0%, color-mix(in srgb, var(--accent) 19%, transparent), transparent 62%), var(--panel);
}
.integration-overview > .icon-tile { width: 43px; height: 43px; border-radius: 12px; }
.integration-overview-copy { flex: 1; min-width: min(205px, 100%); }
.integration-overview h2 { margin-top: 3px; font-size: 19px; font-weight: 730; letter-spacing: -.03em; }
.integration-overview p { margin-top: 4px; color: var(--muted); font-size: 12px; line-height: 1.5; }
.integration-count {
  display: grid;
  gap: 3px;
  min-width: 91px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--field);
  text-align: center;
}
.integration-count strong { color: var(--ink); font-size: 19px; line-height: 1; font-variant-numeric: tabular-nums; }
.integration-count strong span { color: var(--quiet); font-size: 13px; }
.integration-count > span { color: var(--quiet); font-size: 10px; }
.integration-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.integration-card { display: flex; flex-direction: column; min-width: 0; gap: 10px; padding: 13px; border-radius: 16px; }
.integration-card-top, .integration-card-footer { display: flex; align-items: center; justify-content: space-between; min-width: 0; gap: 7px; }
.integration-card-copy { flex: 1; min-width: 0; }
.integration-card-copy > span { color: var(--quiet); font-size: 10.5px; }
.integration-card-copy h3 { margin: 3px 0 4px; font-size: 17px; letter-spacing: -.025em; }
.integration-card-copy p { color: var(--muted); font-size: 12px; line-height: 1.5; }
.integration-card-footer { padding-top: 9px; border-top: 1px solid var(--line-soft); }
.integration-resource { display: flex; align-items: center; gap: 5px; min-width: 0; color: var(--quiet); font-size: 11px; }
.integration-resource svg { color: var(--accent-dark); }
.integration-resource > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.integration-card-footer .button { flex: none; gap: 5px; }

@container workspace (max-width: 935px) {
  .integration-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@container workspace (max-width: 545px) {
  .integration-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
