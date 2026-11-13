<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { aiName, allowedStatuses, brandName, collections, dateKey, dateLabel, initialWorkspace, pages, periods, statuses, uid, workflow } from './data.js'
import { createDemoConnection, integrationProviders, normalizeConnections } from './integrations.js'
import { assistantModes, createProposal } from './marketing.js'
import Brand from './components/Brand.vue'
import Dialog from './components/Dialog.vue'
import Icon from './components/Icon.vue'
import RecordEditor from './components/RecordEditor.vue'
import Status from './components/Status.vue'
import Analytics from './pages/Analytics.vue'
import Assistant from './pages/Assistant.vue'
import Dashboard from './pages/Dashboard.vue'
import Leads from './pages/Leads.vue'
import Login from './pages/Login.vue'
import Records from './pages/Records.vue'
import Settings from './pages/Settings.vue'
import Tools from './pages/Tools.vue'
import Workbench from './pages/Workbench.vue'
import LanguageSelect from './components/LanguageSelect.vue'
import { modules } from './features.js'
import { t, tr } from './i18n.js'
import { normalizeWorkspace, saveFeature, featureAction, spendCredits, downloadFile, validateBackup, runRules } from './workspace.js'

const registryKey = 'marketlane-projects-v2'
const workspaceId = ref(read('marketlane-active-project') || 'default')
let workspaceKey = workspaceId.value === 'default' ? 'marketlane-workspace-v1' : 'marketlane-project-' + workspaceId.value
const sessionKey = 'marketlane-session-v1'
const sidebarKey = 'marketlane-sidebar-width-v1'
const sidebarMin = 72
const sidebarExpandedMin = 184
const sidebarMax = 336
const sidebarDefault = 244
const seed = initialWorkspace()
const projects = ref(loadProjects())
if (!projects.value.some(project => project.id === workspaceId.value)) { workspaceId.value='default'; workspaceKey='marketlane-workspace-v1' }
const projectName = ref('')
const restoreFile = ref(null)
const restoreCandidate = ref(null)

function loadProjects() {
  try { const list=JSON.parse(read(registryKey)); if(Array.isArray(list)&&list.some(item=>item.id==='default'))return list.filter(item=>typeof item.id==='string'&&typeof item.name==='string') } catch {}
  return [{id:'default',name:'Marketlane Studio'}]
}

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function loadWorkspace() {
  try {
    const current = read(workspaceKey)
    const saved = JSON.parse(current ?? (workspaceId.value === 'default' ? read('nomu-workspace-v1') : null))
    if (!saved || typeof saved !== 'object') return null
    const workspace = normalizeWorkspace(saved, seed)
    delete workspace.profile.color
    workspace.connections = normalizeConnections(workspace.connections)
    if (current === null) {
      workspace.theme = seed.theme
      if (workspace.profile.name === 'NOMU Studio') workspace.profile.name = seed.profile.name
      write(workspaceKey, JSON.stringify(workspace))
    }
    return workspace
  } catch {
    return null
  }
}

function hashPage() {
  const id = location.hash.slice(1)
  return pages.some((item) => item.id === id) ? id : 'home'
}

const state = shallowRef(loadWorkspace() || normalizeWorkspace(seed, seed))
const savedSession = read(sessionKey)
const signedIn = ref((savedSession ?? read('nomu-session-v1')) === 'demo-admin')
if (savedSession === null && signedIn.value) write(sessionKey, 'demo-admin')
const page = ref(hashPage())
const days = ref(30)
const settingsTab = ref('profile')
const menuOpen = ref(false)
const menuTrigger = ref(null)
const menuDismiss = ref(null)
const profileOpen = ref(false)
const profileAnchor = ref(null)
const profileTrigger = ref(null)
const sidebarWidth = ref(settledSidebarWidth(Number(read(sidebarKey)) || sidebarDefault))
const sidebarCompact = computed(() => sidebarWidth.value < sidebarExpandedMin)
const resizing = ref(false)
const modal = ref(null)
const search = ref('')
const toast = ref('')
const resultDraft = ref(null)
let toastTimer
let automationTimer
let persisted = true
let sidebarDrag
let expandedWidth = sidebarCompact.value ? sidebarDefault : sidebarWidth.value

const sidebarGroups = [
  { title: 'ISH MAYDONI', items: pages.filter((item) => !item.management && !item.extension) },
  { title: {uz:'MARKETING KANALLARI',ru:'МАРКЕТИНГОВЫЕ КАНАЛЫ',en:'MARKETING CHANNELS'}, items: pages.filter((item) => !item.management && item.extension) },
  { title: 'BOSHQARUV', items: pages.filter((item) => item.management) },
]
const currentPage = computed(() => pages.find((item) => item.id === page.value))
const currentModule = computed(() => modules.find(item => item.id === page.value))
const currentRecord = computed(() => {
  const { kind, id } = modal.value || {}
  return kind && id ? state.value[kind].find((record) => record.id === id) : undefined
})
const approvals = computed(() => ['content', 'campaigns'].flatMap((kind) => (
  state.value[kind].filter((item) => item.status === 'review').map((item) => ({ kind, item }))
)).sort((a, b) => a.item.date.localeCompare(b.item.date)))
const unread = computed(() => state.value.notifications.some((item) => !item.read))
const initials = computed(() => state.value.profile.owner.split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase())
const searchResults = computed(() => {
  const term = search.value.trim().toLocaleLowerCase()
  const nav = pages.map((item) => ({ ...item, type: 'page' }))
  if (!term) return nav.slice(0, 6)
  const records = Object.entries(collections).flatMap(([kind, config]) => state.value[kind].map((item) => ({
    id: item.id, label: item.title, icon: config.icon, sub: config.title, type: 'record', kind,
  })))
  return [...nav, ...records].filter((item) => t(item.label).toLocaleLowerCase().includes(term)).slice(0, 12)
})

watch(() => state.value.theme, (theme) => {
  document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light'
  document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#090b1b' : '#f4f3fc')
}, { immediate: true })

function clampSidebarWidth(width) {
  return Math.min(sidebarMax, Math.max(sidebarMin, Math.round(width)))
}

function settledSidebarWidth(width) {
  const clamped = clampSidebarWidth(width)
  return clamped < sidebarExpandedMin ? sidebarMin : clamped
}

function saveSidebarWidth(width) {
  sidebarWidth.value = settledSidebarWidth(width)
  if (!sidebarCompact.value) expandedWidth = sidebarWidth.value
  write(sidebarKey, String(sidebarWidth.value))
}

function toggleSidebarWidth() {
  saveSidebarWidth(sidebarCompact.value ? expandedWidth : sidebarMin)
}

function startSidebarResize(event) {
  if (event.button !== 0 || sidebarDrag) return
  event.preventDefault()
  event.currentTarget.focus({ preventScroll: true })
  event.currentTarget.setPointerCapture(event.pointerId)
  sidebarDrag = { pointer: event.pointerId, x: event.clientX, width: sidebarWidth.value }
  resizing.value = true
}

function moveSidebarResize(event) {
  if (sidebarDrag?.pointer !== event.pointerId) return
  sidebarWidth.value = clampSidebarWidth(sidebarDrag.width + event.clientX - sidebarDrag.x)
}

function finishSidebarResize(event) {
  if (sidebarDrag?.pointer !== event.pointerId) return
  sidebarDrag = null
  resizing.value = false
  saveSidebarWidth(sidebarWidth.value)
}

function resizeSidebarWithKeyboard(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    toggleSidebarWidth()
    return
  }
  const target = {
    ArrowLeft: sidebarWidth.value - 16,
    ArrowRight: sidebarCompact.value ? sidebarExpandedMin : sidebarWidth.value + 16,
    Home: sidebarMin, End: sidebarMax,
  }[event.key]
  if (target === undefined) return
  event.preventDefault()
  saveSidebarWidth(target)
}

function dismissProfileOutside(event) {
  if (profileOpen.value && !profileAnchor.value?.contains(event.target)) profileOpen.value = false
}

function closeMenu() {
  if (!menuOpen.value) return
  menuOpen.value = false
  menuTrigger.value?.focus({ preventScroll: true })
}

async function toggleMenu() {
  if (menuOpen.value) {
    closeMenu()
    return
  }
  menuOpen.value = true
  await nextTick()
  menuDismiss.value?.focus({ preventScroll: true })
}

function notify(message) {
  clearTimeout(toastTimer)
  toast.value = t(message)
  toastTimer = setTimeout(() => { toast.value = '' }, 3800)
}

function commit(update) {
  const next = structuredClone(persisted ? loadWorkspace() || state.value : state.value)
  try { if (update(next) === false) return false } catch(error) {notify(error.message);return false}
  persisted = write(workspaceKey, JSON.stringify(next))
  state.value = next
  return true
}

function saved(message) {
  notify(persisted ? t(message) : t(message) + tr(' Brauzer saqlamadi: xotira to‘lgan bo‘lishi mumkin. Zaxira nusxa yuklang.', ' Браузер не сохранил данные: возможно, хранилище заполнено. Скачайте копию.', ' Browser storage failed; it may be full. Download a backup.'))
}

function addNotification(next, message) {
  next.notifications = [{ id: uid(), text: message, date: dateKey(), read: false }, ...next.notifications].slice(0, 30)
}

function navigate(id) {
  if (!pages.some((item) => item.id === id)) return
  if (id === 'settings') settingsTab.value = 'profile'
  const changed = page.value !== id
  page.value = id
  if (location.hash !== '#' + id) location.hash = id
  modal.value = null
  profileOpen.value = false
  closeMenu()
  if (changed) window.scrollTo({ top: 0 })
}

function syncRoute() {
  const id = hashPage()
  if (id === page.value) return
  page.value = id
  modal.value = null
  profileOpen.value = false
  closeMenu()
  window.scrollTo({ top: 0 })
}

function login() {
  if (!loadWorkspace()) write(workspaceKey, JSON.stringify(state.value))
  write(sessionKey, 'demo-admin')
  signedIn.value = true
  navigate(page.value)
}

function logout() {
  write(sessionKey, '')
  modal.value = null
  profileOpen.value = false
  menuOpen.value = false
  signedIn.value = false
  toast.value = ''
  history.replaceState(null, '', location.pathname + location.search)
  page.value = 'home'
  window.scrollTo({ top: 0 })
}

function syncStorage(event) {
  if (event.key === workspaceKey && persisted) state.value = loadWorkspace() || normalizeWorkspace(seed,seed)
  if (event.key === registryKey) projects.value = loadProjects()
  if (event.key === sessionKey) {
    signedIn.value = read(sessionKey) === 'demo-admin'
    if (!signedIn.value) {
      modal.value = null
      profileOpen.value = false
    }
  }
}

function openSearch() {
  search.value = ''
  modal.value = { type: 'search' }
  profileOpen.value = false
  closeMenu()
}

function hotkeys(event) {
  if (!signedIn.value) return
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
  }
  if (event.key !== 'Escape' || modal.value) return
  if (profileOpen.value) {
    profileOpen.value = false
    profileTrigger.value?.focus({ preventScroll: true })
  } else {
    closeMenu()
  }
}

onMounted(() => {
  automationTimer = setInterval(checkBackgroundWork, 60000)
  window.addEventListener('hashchange', syncRoute)
  window.addEventListener('storage', syncStorage)
  window.addEventListener('keydown', hotkeys)
  document.addEventListener('pointerdown', dismissProfileOutside)
  document.addEventListener('focusin', dismissProfileOutside)
})
onUnmounted(() => {
  clearInterval(automationTimer)
  clearTimeout(toastTimer)
  window.removeEventListener('hashchange', syncRoute)
  window.removeEventListener('storage', syncStorage)
  window.removeEventListener('keydown', hotkeys)
  document.removeEventListener('pointerdown', dismissProfileOutside)
  document.removeEventListener('focusin', dismissProfileOutside)
})

function selectResult(item) {
  if (!item) return
  if (item.type === 'page') {
    navigate(item.id)
    return
  }
  navigate(item.kind)
  editRecord(item.kind, item.id)
}

function createRecord(kind, date) {
  modal.value = { type: 'record', kind, date }
}

function createLead(status = 'new') {
  modal.value = { type: 'record', kind: 'leads', status }
}

function editRecord(kind, id) {
  modal.value = { type: 'record', kind, id }
}

function saveRecord(fields) {
  const { kind, id } = modal.value
  const ok = commit((next) => {
    const previous = next[kind].find((item) => item.id === id)
    if (id && !previous) return false
    const item = { ...fields, id: id || uid() }
    if (workflow[kind] && previous) {
      const changed = Object.keys(fields).some((key) => !['id', 'status', 'results'].includes(key) && fields[key] !== previous[key])
      item.status = changed && ['review', 'approved', 'scheduled', 'published'].includes(previous.status) ? 'draft' : previous.status
    }
    if (kind === 'campaigns') {
      item.results = previous?.results || []
      if (item.results.length) item.channel = previous.channel
      if (previous && item.channel !== previous.channel) {
        next.leads = next.leads.map((lead) => lead.campaignId === id ? { ...lead, source: item.channel } : lead)
      }
    }
    if (kind === 'leads' && item.campaignId) {
      const campaign = next.campaigns.find((entry) => entry.id === item.campaignId)
      item.campaignId = campaign?.id || ''
      if (campaign) item.source = campaign.channel
    }
    next[kind] = previous ? next[kind].map((entry) => entry.id === id ? item : entry) : [item, ...next[kind]]
  })
  modal.value = null
  if (ok) saved('Yozuv saqlandi.')
  else notify('Yozuv boshqa oynada o‘chirilgan.')
}

function removeRecord() {
  const { kind, id } = modal.value
  commit((next) => {
    next[kind] = next[kind].filter((item) => item.id !== id)
    if (kind === 'campaigns') next.leads = next.leads.map((lead) => lead.campaignId === id ? { ...lead, campaignId: '' } : lead)
  })
  modal.value = null
  saved('Yozuv o‘chirildi.')
}

function updateStatus(kind, id, status, previousStatus) {
  if (!allowedStatuses[kind].includes(status)) return
  const ok = commit((next) => {
    const item = next[kind].find((entry) => entry.id === id)
    if (!item || (previousStatus && item.status !== previousStatus)) return false
    next[kind] = next[kind].map((entry) => entry.id === id ? { ...entry, status } : entry)
    if (workflow[kind]) addNotification(next, item.title + ' · ' + statuses[status].label)
  })
  if (ok) saved(statuses[status].label)
  else notify('Yozuv boshqa oynada yangilangan.')
}

function advance(revise = false) {
  const { kind, id } = modal.value
  const status = currentRecord.value?.status
  const next = revise && status === 'review' ? 'draft' : workflow[kind]?.[status]?.[0]
  if (next) updateStatus(kind, id, next, status)
}

function resultAt(date) {
  const previous = currentRecord.value?.results.find((row) => row.date === date)
  resultDraft.value = { date, reach: 0, leads: 0, spend: 0, revenue: 0, impressions:0, clicks:0, conversions:0, customers:0, ...previous }
}

function openResults() {
  modal.value = { ...modal.value, type: 'result' }
  resultAt(dateKey())
}

function saveResult() {
  const { id } = modal.value
  const row = { ...resultDraft.value }
  const ok = commit((next) => {
    const campaign = next.campaigns.find((item) => item.id === id)
    if (!campaign || !['active', 'paused'].includes(campaign.status)) return false
    const results = [...campaign.results.filter((item) => item.date !== row.date), row]
    next.campaigns = next.campaigns.map((item) => item.id === id ? { ...item, results } : item)
  })
  if (ok) {
    editRecord('campaigns', id)
    saved('Kunlik natija saqlandi.')
  } else notify('Kampaniya holati o‘zgargan. Qayta oching.')
}

function sendPrompt(prompt, mode) {
  if (!assistantModes.some((item) => item.id === mode)) return
  commit((next) => { spendCredits(next, mode==='plan'?5:2, t(assistantModes.find(item=>item.id===mode).label), mode==='analysis'?'analysis':'text');next.messages = [...next.messages, createProposal(prompt, mode, next)] })
  if (!persisted) saved('Javob tayyor.')
}

function applyProposal(id) {
  const ok = commit((next) => {
    const reply = next.messages.find((item) => item.id === id)
    if (!reply || reply.applied) return false
    for (const [kind, records] of Object.entries(reply.bundle)) {
      next[kind] = [...records.map((item) => ({ ...item, id: uid() })), ...next[kind]]
    }
    next.messages = next.messages.map((item) => item.id === id ? { ...item, applied: true } : item)
    addNotification(next, tr('{name} qoralamalari ish maydoniga qo‘shildi.','Черновики {name} добавлены в пространство.','{name} drafts added to the workspace.',{name:aiName}))
  })
  if (ok) saved('Qoralamalar ish maydoniga qo‘shildi.')
}

function clearMessages() {
  commit((next) => { next.messages = [] })
  modal.value = null
  saved('Yangi suhbatga tayyor.')
}

function setPeriod(value) {
  if (periods.includes(value)) days.value = value
}

function setTheme(theme) {
  commit((next) => { next.theme = theme })
}

function saveProfile(profile) {
  if (['name', 'owner', 'industry', 'offer', 'audience', 'objective', 'voice'].some((key) => !profile[key].trim())) {
    notify('Biznes profilidagi majburiy maydonlarni to‘ldiring.')
    return
  }
  commit((next) => { next.profile = profile })
  projects.value=projects.value.map(project=>project.id===workspaceId.value?{...project,name:profile.name}:project)
  write(registryKey,JSON.stringify(projects.value))
  saved('Biznes profili saqlandi.')
}

function connectIntegration(selection) {
  const connection = createDemoConnection(selection)
  if (!connection) return
  const provider = integrationProviders.find((item) => item.id === connection.providerId)
  commit((next) => {
    next.connections = [...next.connections.filter((item) => item.providerId !== connection.providerId), connection]
  })
  saved(tr('{name} demo rejimida ulandi.','{name} подключён в демо-режиме.','{name} connected in demo mode.',{name:provider.name}))
}

function disconnectIntegration(providerId) {
  const provider = integrationProviders.find((item) => item.id === providerId)
  if (!provider) return
  commit((next) => { next.connections = next.connections.filter((item) => item.providerId !== providerId) })
  saved(tr('{name} demo ulanishi uzildi.','Демо-подключение {name} отключено.','{name} demo connection disconnected.',{name:provider.name}))
}

function saveTool(result) {
  if (commit((next) => {
    if (next.savedTools.some((item) => item.id === result.id)) return false
    next.savedTools = [result, ...next.savedTools]
  })) saved('Qoralama saqlandi.')
}

function removeTool(id) {
  commit((next) => { next.savedTools = next.savedTools.filter((item) => item.id !== id) })
  saved('Saqlangan qoralama o‘chirildi.')
}

function captureLead(fields) {
  commit((next) => {
    next.leads = [{ ...fields, id: uid(), phone: '', source: 'Landing sahifa', campaignId: '', status: 'new', date: dateKey() }, ...next.leads]
    addNotification(next, 'Landing sahifadan yangi demo lead qo‘shildi.')
  })
  saved('Murojaat CRM’ga qo‘shildi.')
}

function readNotifications() {
  commit((next) => { next.notifications = next.notifications.map((item) => ({ ...item, read: true })) })
}

function saveModule({tab,item},done) {
  if(commit(next=>{saveFeature(next,tab,item)})){saved(tr('Yozuv saqlandi.','Запись сохранена.','Record saved.'));done?.()}
}
function moduleAction(event,done) {
  let result
  if(commit(next=>{result=featureAction(next,event)})){
    saved(event.action==='run-rules'?tr('{count} ta yangi amal aniqlandi.','Найдено новых действий: {count}.','{count} new actions found.',{count:result}):tr('Amal bajarildi.','Действие выполнено.','Action completed.'))
    done?.()
  }
}
function switchProject(id) {
  if(!projects.value.some(project=>project.id===id)||id===workspaceId.value)return
  if(!persisted&&!write(workspaceKey,JSON.stringify(state.value))){notify(tr('Avval zaxira nusxa oling: joriy o‘zgarishlar saqlanmadi.','Сначала скачайте копию: изменения не сохранены.','Download a backup first: current changes are not saved.'));return}
  workspaceId.value=id;workspaceKey=id==='default'?'marketlane-workspace-v1':'marketlane-project-'+id
  write('marketlane-active-project',id);state.value=loadWorkspace()||normalizeWorkspace(seed,seed);persisted=true;modal.value=null;menuOpen.value=false
  navigate('home')
}
function createProject() {
  const name=projectName.value.trim();if(!name)return
  const id=uid(),base=initialWorkspace();base.profile={...base.profile,name}
  for(const key of ['strategies','content','campaigns','leads','tasks','messages','savedTools','notifications','connections'])base[key]=[]
  const workspace=normalizeWorkspace(base,base)
  for(const key of Object.keys(workspace.extensions.data))workspace.extensions.data[key]=[]
  const list=[...projects.value,{id,name}]
  if(!write('marketlane-project-'+id,JSON.stringify(workspace))||!write(registryKey,JSON.stringify(list))){notify(tr('Ish maydoni saqlanmadi.','Не удалось сохранить пространство.','Could not save workspace.'));return}
  projects.value=list;projectName.value='';switchProject(id)
}
function exportWorkspace(){downloadFile('marketlane-backup.json',JSON.stringify({format:'marketlane-workspace',version:2,exportedAt:new Date().toISOString(),workspace:state.value},null,2),'application/json')}
async function inspectBackup(event){
  const file=event.target.files[0];event.target.value='';if(!file)return
  try {if(file.size>15*1024*1024)throw new Error(tr('Fayl 15 MBdan katta.','Файл больше 15 МБ.','File exceeds 15 MB.'));restoreCandidate.value=validateBackup(JSON.parse(await file.text()));modal.value={type:'restore'}}catch(error){notify(error.message)}
}
function restoreWorkspace(){
  if(!restoreCandidate.value)return
  exportWorkspace()
  const restored=normalizeWorkspace(restoreCandidate.value,seed)
  if(!write(workspaceKey,JSON.stringify(restored))){notify(tr('Zaxirani saqlash uchun xotira yetarli emas.','Недостаточно места для восстановления.','Not enough storage to restore this backup.'));return}
  state.value=restored;restoreCandidate.value=null;modal.value=null;persisted=true;navigate('home')
}
function checkBackgroundWork(){
  if(!signedIn.value || document.hidden)return
  commit(next=>{
    let changed=runRules(next)>0
    for(const report of next.extensions.data.reports){
      if(report.date<=dateKey() && report.notifiedDate!==report.date){
        featureAction(next,{action:'report',tab:'reports',id:report.id})
        addNotification(next,tr('Lokal hisobot tayyor: ','Локальный отчёт готов: ','Local report ready: ')+report.title)
        report.notifiedDate=dateKey();changed=true
      }
    }
    return changed
  })
}
</script>

<template>
  <Login v-if="!signedIn" @login="login" />
  <div v-else class="app-shell" :class="{ 'is-resizing': resizing }" :style="{ '--sidebar-width': sidebarWidth + 'px' }">
    <button v-if="menuOpen" class="mobile-scrim" :aria-label='$t("Menyuni yopish")' @click="closeMenu"></button>
    <aside id="workspace-sidebar" class="sidebar" :class="{ 'is-open': menuOpen, 'is-compact': sidebarCompact }">
      <div class="sidebar-body">
        <div class="sidebar-header">
          <a href="#home" class="sidebar-brand" :aria-label="brandName + ' · ' + t('Bosh sahifa')" @click.prevent="navigate('home')"><Brand /></a>
          <button ref="menuDismiss" class="icon-button ghost sidebar-close" :aria-label='$t("Yon menyuni yopish")' @click="closeMenu"><Icon name="close" :size="18" /></button>
        </div>
        <div class="workspace-switcher"><select :value="workspaceId" :aria-label="tr('Ish maydoni','Пространство','Workspace')" @change="switchProject($event.target.value)"><option v-for="project in projects" :key="project.id" :value="project.id">{{project.name}}</option></select><button class="icon-button" :aria-label="tr('Yangi ish maydoni','Новое пространство','New workspace')" @click="modal={type:'project'}"><Icon name="plus" :size="16"/></button></div>
        <nav class="sidebar-nav" :aria-label='$t("Asosiy navigatsiya")'>
          <div v-for="group in sidebarGroups" :key="group.title" class="nav-group">
            <h2>{{ $t(group.title) }}</h2>
            <a v-for="item in group.items" :key="item.id" :href="'#' + item.id" class="nav-link"
              :aria-current="page === item.id ? 'page' : undefined" :aria-label="$t(item.label)" :title="$t(sidebarCompact ? item.label : undefined)" @click.prevent="navigate(item.id)">
              <Icon :name="item.icon" :size="18" /><span class="nav-label">{{ $t(item.label) }}</span>
              <span v-if="item.id === 'assistant'" class="ai-badge">{{ $t("AI") }}</span>
            </a>
          </div>
        </nav>
      </div>
      <div class="sidebar-resize" role="separator" tabindex="0" aria-orientation="vertical" :aria-label='$t("Yon menyu kengligi")'
        :aria-valuemin="sidebarMin" :aria-valuemax="sidebarMax" :aria-valuenow="sidebarWidth" :aria-valuetext="sidebarWidth + ' px'"
        :title='$t("Kenglik uchun sudrang yoki ixcham holatga o‘tish uchun ikki marta bosing")' @pointerdown="startSidebarResize" @pointermove="moveSidebarResize"
        @pointerup="finishSidebarResize" @pointercancel="finishSidebarResize" @lostpointercapture="finishSidebarResize"
        @keydown="resizeSidebarWithKeyboard" @dblclick="toggleSidebarWidth"><span></span></div>
    </aside>

    <div class="workspace-main">
      <header class="topbar">
        <div class="breadcrumbs">
          <button ref="menuTrigger" class="icon-button mobile-menu" :aria-label='$t("Menyu")' :aria-expanded="menuOpen" aria-controls="workspace-sidebar" @click="toggleMenu"><Icon name="menu" :size="20" /></button>
          <span class="breadcrumb-icon"><Icon :name="currentPage.icon" :size="17" /></span>
          <span class="crumb-home">{{ $t("Ish maydoni") }}</span><Icon class="crumb-home" name="chevronRight" :size="14" /><strong>{{ $t(currentPage.label) }}</strong>
        </div>
        <div class="topbar-actions">
          <LanguageSelect />
          <button class="top-search" :aria-label='$t("Qidirish")' @click="openSearch"><Icon name="search" :size="17" /><span>{{ $t("Ish maydonini qidiring…") }}</span><kbd>{{ $t("Ctrl K") }}</kbd></button>
          <button class="icon-button top-theme" :aria-label="$t(state.theme === 'light' ? $t('Qorong‘i mavzuga o‘tish') : $t('Yorug‘ mavzuga o‘tish'))" @click="setTheme(state.theme === 'light' ? 'dark' : 'light')"><Icon :name="state.theme === 'light' ? 'moon' : 'sun'" :size="18" /></button>
          <button class="icon-button notification-button" :aria-label='$t("Bildirishnomalar")' @click="modal = { type: 'notifications' }"><Icon name="bell" :size="19" /><i v-if="unread || approvals.length"></i></button>
          <span class="topbar-divider"></span>
          <div ref="profileAnchor" class="profile-anchor">
            <button ref="profileTrigger" type="button" class="avatar-button" :aria-label='$t("Profil menyusi")'
              :aria-expanded="profileOpen" aria-controls="profile-menu" @click="profileOpen = !profileOpen">
              <span>{{ $t(initials) }}</span><Icon name="chevronDown" :size="14" />
            </button>
            <div v-show="profileOpen" id="profile-menu" class="profile-menu">
              <div class="profile-menu-header"><span>{{ $t("Hisob") }}</span><strong>{{ $t(state.profile.owner) }}</strong></div>
              <ul class="profile-menu-list">
                <li><button type="button" @click="navigate('settings')"><Icon name="settings" :size="17" />{{ $t("Sozlamalar") }}</button></li>
                <li><button type="button" class="danger-text" @click="logout"><Icon name="logout" :size="17" />{{ $t("Chiqish") }}</button></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main class="workspace-page" id="main-content" :key="workspaceId">
        <Dashboard v-if="page === 'home'" :state="state" :days="days" :approvals="approvals" @navigate="navigate" @create="createRecord" @edit="editRecord" @period="setPeriod" @approvals="modal = { type: 'approvals' }" />
        <Assistant v-else-if="page === 'assistant'" :state="state" @send="sendPrompt" @apply="applyProposal" @navigate="navigate" @clear="modal = { type: 'clear' }" @notify="notify" />
        <Leads v-else-if="page === 'leads'" :state="state" @create="createLead" @edit="editRecord" @status="updateStatus" @notify="notify" />
        <Records v-else-if="collections[page]" :key="page" :kind="page" :state="state" @create="createRecord" @edit="editRecord" @status="updateStatus" @navigate="navigate" />
        <Analytics v-else-if="page === 'analytics'" :state="state" :days="days" @period="setPeriod" @notify="notify" @navigate="navigate" @action="moduleAction" />
        <Tools v-else-if="page === 'tools'" :state="state" @save="saveTool" @remove="removeTool" @lead="captureLead" @notify="notify" @navigate="navigate" />
        <Workbench v-else-if="currentModule" :key="page" :module="currentModule" :state="state" @save="saveModule" @action="moduleAction" @notify="notify" @navigate="navigate"/>
        <Settings v-else-if="page === 'settings'" :state="state" :tab="settingsTab" @tab="settingsTab = $event" @save="saveProfile"
          @connect="connectIntegration" @disconnect="disconnectIntegration" />
        <section v-if="page==='settings'" class="glass backup-panel"><div><h2>{{tr('Ish maydoni va zaxira','Пространство и резервная копия','Workspace and backup')}}</h2><p>{{tr('Har bir kompaniya ma’lumotlari alohida saqlanadi.','Данные каждой компании хранятся отдельно.','Each company has its own saved workspace.')}}</p></div><div class="heading-actions"><button class="button button-secondary" @click="modal={type:'project'}"><Icon name="plus" :size="16"/>{{tr('Yangi kompaniya','Новая компания','New company')}}</button><button class="button button-secondary" @click="exportWorkspace"><Icon name="download" :size="16"/>{{tr('Zaxira olish','Скачать копию','Export backup')}}</button><button class="button button-secondary" @click="restoreFile.click()">{{tr('Zaxiradan tiklash','Восстановить копию','Restore backup')}}</button><input ref="restoreFile" type="file" accept="application/json,.json" hidden @change="inspectBackup"/></div></section>
        <footer class="workspace-footer"><span>{{ $t(brandName) }}</span><span>{{ $t("Ma’lumotlar shu brauzerda saqlanadi") }}</span></footer>
      </main>
    </div>

    <Dialog v-if="modal?.type === 'record'" :key="'record-' + modal.kind + '-' + modal.id" wide
      :title="$t(currentRecord ? (modal.kind === 'leads' ? $t('Leadni tahrirlash') : collections[modal.kind].singular[0].toUpperCase() + collections[modal.kind].singular.slice(1) + ' tafsilotlari') : collections[modal.kind].newLabel)"
      :subtitle="$t(['content', 'campaigns'].includes(modal.kind) ? $t('Mahalliy ish maydonidagi demo yozuv') : undefined)" @close="modal = null">
      <RecordEditor v-if="!modal.id || currentRecord" :key="currentRecord?.status || modal.status || 'new'" :kind="modal.kind" :record="currentRecord" :default-date="modal.date" :default-status="modal.status" :profile="state.profile" :campaigns="state.campaigns"
        @save="saveRecord" @delete="removeRecord" @close="modal = null" @advance="advance()" @revise="advance(true)" @result="openResults" />
      <p v-else class="dialog-body">{{ $t("Yozuv boshqa oynada o‘chirilgan.") }}</p>
    </Dialog>

    <Dialog v-else-if="modal?.type === 'result'" :title='$t("Kunlik natija kiritish")' :subtitle="$t(currentRecord?.title)" @close="editRecord('campaigns', modal.id)">
      <form v-if="resultDraft" class="dialog-body record-form" @submit.prevent="saveResult">
        <label class="field"><span>{{ $t("Sana") }}</span><input type="date" :value="resultDraft.date" :max="dateKey()" required @change="resultAt($event.target.value)" /></label>
        <div class="form-grid">
          <label class="field"><span>{{ $t("Qamrov") }}</span><input v-model.number="resultDraft.reach" type="number" min="0" max="1000000000" required /></label>
          <label class="field"><span>{{ $t("Leadlar") }}</span><input v-model.number="resultDraft.leads" type="number" min="0" max="1000000000" required /></label>
          <label class="field"><span>{{ $t("Xarajat ($)") }}</span><input v-model.number="resultDraft.spend" type="number" min="0" max="1000000000" step=".01" required /></label>
          <label class="field"><span>{{ $t("Daromad ($)") }}</span><input v-model.number="resultDraft.revenue" type="number" min="0" max="1000000000" step=".01" required /></label>
          <label v-for="metric in [{key:'impressions',label:tr('Ko‘rsatishlar','Показы','Impressions')},{key:'clicks',label:tr('Bosishlar','Клики','Clicks')},{key:'conversions',label:tr('Konversiyalar','Конверсии','Conversions')},{key:'customers',label:tr('Yangi mijozlar','Новые клиенты','New customers')}]" :key="metric.key" class="field"><span>{{metric.label}}</span><input v-model.number="resultDraft[metric.key]" type="number" min="0" max="1000000000" required/></label>
        </div>
        <p class="subtle small">{{ $t("Shu sana uchun qiymatlar saqlanadi va analitikaga qo‘shiladi.") }}</p>
        <div class="dialog-actions"><button type="button" class="button button-secondary" @click="editRecord('campaigns', modal.id)">{{ $t("Ortga") }}</button><button type="submit" class="button button-primary">{{ $t("Natijani saqlash") }}</button></div>
      </form>
    </Dialog>

    <Dialog v-else-if="modal?.type==='project'" :title="tr('Yangi ish maydoni','Новое пространство','New workspace')" @close="modal=null"><form class="dialog-body record-form" @submit.prevent="createProject"><label class="field"><span>{{tr('Kompaniya nomi','Название компании','Company name')}}</span><input v-model.trim="projectName" required maxlength="60" autofocus/></label><p class="subtle">{{tr('Bo‘sh ish maydoni yaratiladi. Joriy kompaniya ma’lumotlari saqlanadi.','Будет создано пустое пространство. Данные текущей компании сохранятся.','A blank workspace will be created. Your current company data remains saved.')}}</p><div class="dialog-actions"><button class="button button-primary">{{tr('Yaratish','Создать','Create')}}</button></div></form></Dialog>
    <Dialog v-else-if="modal?.type==='restore'" :title="tr('Zaxiradan tiklash','Восстановить копию','Restore backup')" @close="modal=null;restoreCandidate=null"><div class="dialog-body"><p>{{tr('Joriy ish maydoni fayldagi ma’lumotlar bilan almashtiriladi. Oldin joriy nusxa avtomatik yuklanadi.','Текущее пространство будет заменено данными файла. Сначала будет скачана текущая копия.','The current workspace will be replaced with the file contents. A backup of the current workspace will be downloaded first.')}}</p><strong>{{restoreCandidate?.profile.name}}</strong><div class="dialog-actions"><button class="button button-secondary" @click="modal=null;restoreCandidate=null">{{tr('Bekor qilish','Отмена','Cancel')}}</button><button class="button button-primary" @click="restoreWorkspace">{{tr('Tiklash','Восстановить','Restore')}}</button></div></div></Dialog>
    <Dialog v-else-if="modal?.type === 'search'" bare :title='$t("Ish maydonini qidirish")' @close="modal = null">
      <form class="search-modal-field" @submit.prevent="selectResult(searchResults[0])"><Icon name="search" :size="22" /><input v-model="search" autofocus :aria-label='$t("Ish maydonini qidirish")' :placeholder='$t("Sahifa yoki yozuv nomi…")' /><button class="icon-button ghost" type="button" :aria-label='$t("Qidiruvni yopish")' @click="modal = null"><Icon name="close" :size="19" /></button></form>
      <div class="search-results">
        <p class="eyebrow">{{ $t(search.trim() ? $t('NATIJALAR') : $t('TEZKOR HAVOLALAR')) }}</p>
        <button v-for="item in searchResults" :key="item.type + item.id" class="approval-row" @click="selectResult(item)">
          <span class="icon-tile tone-neutral"><Icon :name="item.icon" :size="17" /></span><span class="approval-copy"><strong>{{ $t(item.label) }}</strong><span v-if="item.sub">{{ $t(item.sub) }}</span></span><Icon name="chevronRight" :size="16" />
        </button>
        <p v-if="!searchResults.length" class="subtle">{{ $t("Mos natija topilmadi.") }}</p>
      </div>
    </Dialog>

    <Dialog v-else-if="modal?.type === 'approvals'" :title='$t("Tasdiqlash navbati")' :subtitle='$t("Kontent va reklama qoralamalarini ko‘rib chiqing.")' @close="modal = null">
      <div class="dialog-body approval-list">
        <button v-for="entry in approvals" :key="entry.item.id" class="approval-row" @click="editRecord(entry.kind, entry.item.id)">
          <span class="icon-tile tone-green"><Icon :name="collections[entry.kind].icon" :size="18" /></span><span class="approval-copy"><strong>{{ $t(entry.item.title) }}</strong><span>{{ $t(entry.item.channel) }} · {{ $t(dateLabel(entry.item.date)) }}</span></span><Icon name="chevronRight" :size="16" />
        </button>
        <p v-if="!approvals.length" class="subtle">{{ $t("Tasdiqlash navbati bo‘sh.") }}</p>
      </div>
    </Dialog>

    <Dialog v-else-if="modal?.type === 'notifications'" :title='$t("Bildirishnomalar")' @close="modal = null">
      <div class="dialog-body notification-list">
        <button v-if="approvals.length" class="approval-row" @click="modal = { type: 'approvals' }">
          <span class="icon-tile tone-amber"><Icon name="clock" :size="17" /></span><span class="approval-copy"><strong>{{ $t(approvals.length) }} {{ $t("ta ish tasdiq kutmoqda") }}</strong><span>{{ $t("Tasdiqlash navbatini ochish") }}</span></span><Icon name="chevronRight" :size="16" />
        </button>
        <div v-for="item in state.notifications" :key="item.id" class="notification-row">
          <span class="icon-tile" :class="item.read ? 'tone-neutral' : 'tone-green'"><Icon name="bell" :size="16" /></span><span class="approval-copy"><strong>{{ $t(item.text) }}</strong><span>{{ $t(dateLabel(item.date)) }}</span></span><i v-if="!item.read" class="unread-dot"></i>
        </div>
        <div v-if="unread" class="dialog-actions"><button class="button button-secondary" @click="readNotifications">{{ $t("Barchasini o‘qildi deb belgilash") }}</button></div>
      </div>
    </Dialog>

    <Dialog v-else-if="modal?.type === 'clear'" :title='$t("Yangi suhbat boshlash")' @close="modal = null">
      <div class="dialog-body"><p class="confirm-copy">{{ $t("Avvalgi suhbat tarixi o‘chiriladi. Ish maydoniga qo‘shilgan qoralamalar saqlanadi.") }}</p>
        <div class="dialog-actions"><button class="button button-secondary" @click="modal = null">{{ $t("Bekor qilish") }}</button><button class="button button-primary" @click="clearMessages">{{ $t("Yangi suhbat") }}</button></div>
      </div>
    </Dialog>

    <Transition name="toast"><div v-if="toast" class="toast" role="status"><span class="icon-tile tone-green"><Icon name="check" :size="17" /></span>{{ $t(toast) }}<button class="icon-button ghost" :aria-label='$t("Xabarni yopish")' @click="toast = ''"><Icon name="close" :size="16" /></button></div></Transition>
  </div>
</template>
