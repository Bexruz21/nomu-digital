import { allowedStatuses, dateKey, performance, uid, sumResults } from './data.js'
import { featureTabs, initialExtensions, plans } from './features.js'
import { tr, t } from './i18n.js'

export function normalizeWorkspace(saved, seed) {
  const state = { ...seed, ...saved, profile: { ...seed.profile, ...saved?.profile } }
  for (const key of ['strategies','content','campaigns','leads','tasks','messages','savedTools','notifications']) {
    if (!Array.isArray(state[key])) state[key] = seed[key]
  }
  state.campaigns = state.campaigns.map(item => ({ ...item, results: Array.isArray(item.results) ? item.results : [] }))
  const defaults = initialExtensions(state.profile, dateKey())
  const stored = saved?.extensions || {}
  state.extensions = { ...defaults, ...stored, data: { ...defaults.data, ...stored.data } }
  for (const tab of featureTabs) if (!Array.isArray(state.extensions.data[tab.id])) state.extensions.data[tab.id] = defaults.data[tab.id]
  for (const key of ['activity','usage']) if (!Array.isArray(state.extensions[key])) state.extensions[key] = []
  if (!Number.isFinite(state.extensions.credits) || state.extensions.credits < 0) state.extensions.credits = 500
  if (!plans.some(item=>item.id===state.extensions.plan)) state.extensions.plan = 'growth'
  return state
}

export function validateFeature(tabId, item) {
  const tab = featureTabs.find(tab=>tab.id===tabId)
  if (!tab || !tab.fields.length || !item || typeof item !== 'object') throw new Error(tr('Noto‘g‘ri yozuv.', 'Некорректная запись.', 'Invalid record.'))
  if (!String(item.title || '').trim()) throw new Error(tr('Nomini kiriting.', 'Введите название.', 'Enter a name.'))
  for (const field of tab.fields) {
    const value = item[field.key]
    if (field.type === 'number' && (!Number.isFinite(Number(value)) || Number(value)<0 || Number(value)>1e9)) throw new Error(tr('Son 0 va 1 milliard orasida bo‘lishi kerak.', 'Число должно быть от 0 до 1 миллиарда.', 'Numbers must be between 0 and 1 billion.'))
    if (field.options && !field.options.includes(value)) throw new Error(tr('Variantni tanlang.', 'Выберите вариант.', 'Choose an option.'))
    if (field.type==='url' && value && !/^https?:\/\/[^\s]+$/i.test(value)) throw new Error(tr('HTTP yoki HTTPS manzil kiriting.', 'Введите HTTP или HTTPS адрес.', 'Enter an HTTP or HTTPS URL.'))
    if (field.type==='image' && value && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) throw new Error(tr('Rasm formati noto‘g‘ri.','Неверный формат изображения.','Invalid image format.'))
    if (field.type==='date' && !/^\d{4}-\d{2}-\d{2}$/.test(value||'')) throw new Error(tr('Sanani kiriting.','Укажите дату.','Enter a date.'))
    if (typeof value==='string' && value.length>(field.type==='image'?1500000:field.key==='html'?50000:12000)) throw new Error(tr('Matn yoki fayl juda katta.', 'Текст или файл слишком большой.', 'Text or file is too large.'))
  }
  if (tabId==='experiments' && (Number(item.conversionsA)>Number(item.visitsA)||Number(item.conversionsB)>Number(item.visitsB))) throw new Error(tr('Konversiya tashrifdan ko‘p bo‘la olmaydi.', 'Конверсий не может быть больше посещений.', 'Conversions cannot exceed visits.'))
  if (tabId==='rules' && !validRule(item)) throw new Error(tr('Amal tanlangan shartga mos emas.', 'Действие не соответствует условию.', 'The action does not match this trigger.'))
  return true
}

export function saveFeature(state, tabId, fields) {
  validateFeature(tabId, fields)
  const rows=state.extensions.data[tabId]
  const old=rows.find(row=>row.id===fields.id)
  if(fields.id&&!old)throw new Error(tr('Yozuv boshqa oynada o‘chirilgan.','Запись удалена в другой вкладке.','This record was deleted in another tab.'))
  const config=featureTabs.find(tab=>tab.id===tabId)
  const values=Object.fromEntries(config.fields.map(field=>[field.key,field.type==='number'?Number(fields[field.key]):fields[field.key]]))
  const item={ ...old, ...values, id: old?.id||uid(), updatedAt: new Date().toISOString() }
  if(tabId==='brandkits' && item.status==='active') state.extensions.data.brandkits=rows.map(row=>({...row,status:'draft'}))
  state.extensions.data[tabId]=old?state.extensions.data[tabId].map(row=>row.id===old.id?item:row):[item,...state.extensions.data[tabId]]
  return item
}

export function track(state, title, detail='') {
  state.extensions.activity=[{id:uid(), title, detail, at:new Date().toISOString()},...state.extensions.activity].slice(0,120)
}
export function spendCredits(state, amount, title, route) {
  if (state.extensions.credits<amount) throw new Error(tr('Demo kredit yetarli emas. Tarif bo‘limida to‘ldiring.', 'Недостаточно демо-кредитов. Пополните в разделе тарифа.', 'Not enough demo credits. Top up in Plan and usage.'))
  state.extensions.credits-=amount
  state.extensions.usage=[{id:uid(),title,route,credits:amount,at:new Date().toISOString()},...state.extensions.usage].slice(0,100)
}
export function recipients(state, campaign) {
  return state.leads.filter(lead=>(campaign.segment==='all'||lead.status===campaign.segment) && (!campaign.trigger||campaign.trigger==='newsletter'||(campaign.trigger==='new-lead'?lead.status==='new':lead.lastEvent===campaign.trigger||(campaign.trigger==='win-back'&&lead.status==='lost'))) && (campaign.channel==='Email'?lead.email:campaign.channel==='SMS'?lead.phone:lead.email||lead.phone))
}
export function personalize(template, lead, profile) {
  return String(template||'').replaceAll('{name}',lead.title).replaceAll('{company}',profile.name)
}

export const validRule = rule => !((rule.action==='pause-campaign'&&rule.trigger!=='high-cpl')||(rule.action==='publish-demo'&&rule.trigger!=='scheduled-content'))
function ruleTargets(state, rule, now) {
  if(rule.trigger==='new-lead') return state.leads.filter(item=>item.status==='new').map(item=>({item,kind:'leads',revision:item.date}))
  if(rule.trigger==='high-cpl') return state.campaigns.filter(item=>item.status==='active').filter(item=>{const total=sumResults(item.results.filter(row=>!rule.days||(row.date>=dateKey(1-rule.days,now)&&row.date<=dateKey(0,now))));return total.leads>0 && total.spend/total.leads>Number(rule.threshold)}).map(item=>({item,kind:'campaigns',revision:item.results.map(row=>row.date+':'+row.spend+':'+row.leads).join('|')}))
  if(rule.trigger==='scheduled-content') return state.content.filter(item=>item.status==='scheduled'&&new Date(item.date+'T'+(item.time||'00:00'))<=now).map(item=>({item,kind:'content',revision:item.date+'T'+item.time}))
  if(rule.trigger==='overdue-task') return state.tasks.filter(item=>item.status!=='done'&&item.date<dateKey(0,now)).map(item=>({item,kind:'tasks',revision:item.date}))
  return []
}
export function runRules(state, now=new Date()) {
  let count=0
  for(const rule of state.extensions.data.rules.filter(item=>item.enabled==='on'&&validRule(item))) {
    for(const {item,kind,revision} of ruleTargets(state,rule,now)) {
      const fingerprint=[rule.id,rule.trigger,rule.action,rule.threshold,item.id,revision].join(':')
      if(state.extensions.data.runs.some(run=>run.fingerprint===fingerprint)) continue
      const run={ id:uid(), title:rule.title, detail:item.title, ruleId:rule.id, fingerprint, kind, targetId:item.id, action:rule.action, trigger:rule.trigger, threshold:rule.threshold, revision, status:'review', at:now.toISOString() }
      state.extensions.data.runs.unshift(run)
      if(rule.approval==='automatic') executeRun(state,run.id,now)
      count++
    }
  }
  return count
}
export function executeRun(state,id,now=new Date()) {
  const run=state.extensions.data.runs.find(item=>item.id===id)
  if(!run||run.status!=='review') return false
  const target=ruleTargets(state,{trigger:run.trigger,threshold:run.threshold,days:run.days},now).find(row=>row.item.id===run.targetId&&row.revision===run.revision)
  if(!target){ run.status='cancelled'; return false }
  if(run.action==='create-task') state.tasks.unshift({id:uid(),title:tr('Kuzatish: ', 'Проверить: ', 'Follow up: ')+target.item.title,owner:state.profile.owner,priority:'Yuqori',date:dateKey(1,now),status:'todo',notes:run.title,automationRun:run.id})
  if(run.action==='pause-campaign') target.item.status='paused'
  if(run.action==='publish-demo') target.item.status='published'
  state.notifications.unshift({id:uid(),text:run.title+' · '+target.item.title,date:dateKey(),read:false})
  state.notifications=state.notifications.slice(0,50)
  run.status='done'
  run.completedAt=now.toISOString()
  track(state,run.title,target.item.title)
  return true
}

export function featureAction(state, { action, tab, id, payload={} }) {
  const rows=state.extensions.data[tab]||[]
  const item=rows.find(row=>row.id===id)
  if(action==='run-rules') return runRules(state)
  if(action==='recommend-pause') {
    const target=ruleTargets(state,{trigger:'high-cpl',threshold:payload.threshold,days:payload.days},new Date()).find(row=>row.item.id===id)
    if(!target)return
    const fingerprint=JSON.stringify(['optimization',id,payload.threshold,payload.days,target.revision])
    if(state.extensions.data.runs.some(run=>run.fingerprint===fingerprint))return
    state.extensions.data.runs.unshift({id:uid(),title:tr('CPL bo‘yicha pauza taklifi','Предложение паузы по CPL','Pause recommendation based on CPL'),detail:target.item.title,targetId:id,kind:'campaigns',action:'pause-campaign',trigger:'high-cpl',threshold:payload.threshold,days:payload.days,revision:target.revision,fingerprint,status:'review',at:new Date().toISOString()})
    return
  }
  if(action==='approve-run') return executeRun(state,id)
  if(action==='reject-run') { if(item?.status==='review') item.status='cancelled'; return }
  if(action==='plan') { const plan=plans.find(plan=>plan.id===id); if(plan) state.extensions.plan=id; return }
  if(action==='credits') { state.extensions.credits+=100; track(state,tr('100 demo kredit qo‘shildi','Добавлено 100 демо-кредитов','100 demo credits added')); return }
  if(action==='cycle') { state.extensions.billingCycle=payload.cycle==='yearly'?'yearly':'monthly'; return }
  if(!item) throw new Error(tr('Yozuv topilmadi.', 'Запись не найдена.', 'Record not found.'))
  if(action==='delete') { state.extensions.data[tab]=rows.filter(row=>row.id!==id); return }
  if(action==='snapshot') item.history=[{id:uid(),price:item.price,offer:item.offer,at:new Date().toISOString()},...(item.history||[])].slice(0,24)
  if(action==='journey'){
    const lead=state.leads.find(lead=>[lead.email,lead.phone].some(value=>value&&value.toLowerCase()===String(item.contact).trim().toLowerCase()))
    if(!lead)throw new Error(tr('CRMda shu kontakt topilmadi.','Контакт не найден в CRM.','This contact was not found in CRM.'))
    lead.lastEvent=item.event;item.appliedAt=new Date().toISOString()
  }
  if(action==='content') {
    if(item.contentId && state.content.some(row=>row.id===item.contentId)) return
    const contentId=uid()
    state.content.unshift({id:contentId,title:item.title,channel:'Instagram',format:tab==='storyboards'?'Video':'Post',status:'draft',date:dateKey(1),time:'18:00',notes:[item.headline,item.body,item.script,item.voiceover,item.captions].filter(Boolean).join('\n'),assetId:item.id})
    item.contentId=contentId
  }
  if(action==='draft-reply') { spendCredits(state,1,item.title,'text'); item.reply=tr('Assalomu alaykum! Qiziqishingiz uchun rahmat. ', 'Здравствуйте! Спасибо за интерес. ', 'Hello! Thank you for your interest. ')+state.profile.offer+tr('. Ehtiyojingiz haqida qisqacha yozing.', '. Расскажите немного о ваших потребностях.', '. Tell us a little about your needs.') }
  if(action==='reply') { if(!String(item.reply||'').trim()) throw new Error(tr('Avval javob yozing.', 'Сначала напишите ответ.', 'Write a reply first.')); item.messages=[...(item.messages||[]),{id:uid(),text:item.reply,at:new Date().toISOString()}];item.status='done';item.reply='' }
  if(action==='lead') {
    if(item.leadId && state.leads.some(row=>row.id===item.leadId)) return
    if(!item.contact?.trim()) throw new Error(tr('Avval kontakt kiriting.', 'Сначала добавьте контакт.', 'Add contact details first.'))
    item.leadId=uid();state.leads.unshift({id:item.leadId,title:item.title,email:item.contact.includes('@')?item.contact:'',phone:item.contact.includes('@')?'':item.contact,source:item.channel,campaignId:'',status:'new',date:dateKey(),notes:item.message})
  }
  if(action==='outreach') {
    if(!item.message?.trim()) throw new Error(tr('Xabar matnini kiriting.', 'Введите текст сообщения.', 'Enter a message.'))
    const selected=recipients(state,item)
    if(!selected.length) throw new Error(tr('Segmentda mos kontakt yo‘q.', 'В сегменте нет подходящих контактов.', 'No eligible contacts in this segment.'))
    for(const lead of selected) {
      const fingerprint=JSON.stringify([id,lead.id,item.channel,item.message])
      if(state.extensions.data.deliveries.some(row=>row.fingerprint===fingerprint)) continue
      state.extensions.data.deliveries.unshift({id:uid(),title:lead.title,campaign:item.title,channel:item.channel,message:personalize(item.message,lead,state.profile),fingerprint,at:new Date().toISOString(),status:'demo'})
    }
    item.status='done'
  }
  if(action==='visit') item.visits=(item.visits||0)+1
  if(action==='capture') {
    if(!payload.name?.trim()||!/^\S+@\S+\.\S+$/.test(payload.email||'')) throw new Error(tr('Ism va to‘g‘ri email kiriting.', 'Введите имя и корректный email.', 'Enter your name and a valid email.'))
    state.leads.unshift({id:uid(),title:payload.name.trim(),email:payload.email.trim(),phone:'',source:'Landing sahifa',campaignId:'',status:'new',date:dateKey(),notes:item.title,landingId:item.id})
    item.conversions=(item.conversions||0)+1
    item.visits=Math.max(item.visits||0,item.conversions)
  }
  if(action==='report') {
    item.snapshot={date:dateKey(),period:Number(item.period),...performance(state.campaigns,Number(item.period)).total}
    item.date=dateKey(item.frequency==='monthly'?30:7)
  }
  if(action==='seo') item.audit=payload.audit
  track(state,item.title,action)
}

export function auditHtml(html, keyword, Parser=globalThis.DOMParser) {
  if(!Parser) return []
  const doc=new Parser().parseFromString(html,'text/html')
  const images=[...doc.querySelectorAll('img')]
  return [
    {key:'Title',pass:!!doc.title && doc.title.length<=60},
    {key:'H1',pass:doc.querySelectorAll('h1').length===1},
    {key:'Meta description',pass:!!doc.querySelector('meta[name="description"]')?.content},
    {key:'Canonical',pass:!!doc.querySelector('link[rel="canonical"]')?.getAttribute('href')},
    {key:'Image alt',pass:images.length>0&&images.every(image=>image.getAttribute('alt')?.trim())},
    {key:'Structured data',pass:[...doc.querySelectorAll('script[type="application/ld+json"]')].some(script=>{try {return typeof JSON.parse(script.textContent)==='object'}catch{return false}})},
    {key:'Keyword',pass:!!keyword&&doc.body.textContent.toLowerCase().includes(keyword.toLowerCase())},
    {key:'Viewport',pass:!!doc.querySelector('meta[name="viewport"]')},
  ]
}

export const escapeHtml = value => String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))
export function bannerSvg(item, profile) {
  const width=item.format==='9:16'?608:1080, height=item.format==='16:9'?608:1080
  const color=/^#[0-9a-f]{6}$/i.test(item.color)?item.color:'#9377ff'
  const lines=String(item.headline||item.title).match(new RegExp(`.{1,${width<800?19:34}}(?:\\s|$)|.{1,${width<800?19:34}}`,'g'))||[]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#101229"/><circle cx="${width}" cy="0" r="${width*.8}" fill="${color}" opacity=".35"/><text x="64" y="100" fill="white" font-family="Arial" font-size="24">${escapeHtml(profile.name)}</text>${lines.slice(0,5).map((line,i)=>`<text x="64" y="${height*.4+i*64}" fill="white" font-family="Arial" font-size="48" font-weight="bold">${escapeHtml(line)}</text>`).join('')}<text x="64" y="${height-90}" fill="white" font-family="Arial" font-size="22">${escapeHtml(String(item.body||'').slice(0,width<800?32:65))}</text></svg>`
}
export function landingHtml(item, profile, lang) {
  const color=/^#[0-9a-f]{6}$/i.test(item.color)?item.color:'#9377ff'
  return `<!doctype html><html lang="${escapeHtml(lang)}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(item.title)}</title><style>body{font:18px system-ui;background:#101229;color:white;margin:0;padding:8vw}main{max-width:760px;margin:auto}h1{font-size:clamp(40px,7vw,80px);line-height:1.05}p{line-height:1.7;color:#ccc}button{background:${color};padding:16px 24px;border:0;border-radius:12px;color:white;font:inherit}small{display:block;margin-top:24px;color:#bbb}</style><main><p>${escapeHtml(profile.name)}</p><h1>${escapeHtml(item.headline)}</h1><p>${escapeHtml(item.offer)}</p><button disabled>${escapeHtml(item.cta)}</button><small>${escapeHtml(tr('Statik maket. Forma uchun backend ulanishi kerak.', 'Статический макет. Для формы нужен сервер.', 'Static mockup. Form submissions require a backend.'))}</small></main></html>`
}
export function downloadFile(name, body, mime) {
  const url=URL.createObjectURL(new Blob([body],{type:mime})),link=document.createElement('a')
  link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}

export function validateBackup(input) {
  if(input?.format!=='marketlane-workspace'||input.version!==2||!input.workspace?.profile) throw new Error(tr('Bu Marketlane zaxira fayli emas.', 'Это не резервная копия Marketlane.', 'This is not a Marketlane backup.'))
  const workspace=input.workspace
  for(const key of ['strategies','content','campaigns','leads','tasks','messages','savedTools','notifications']) if(!Array.isArray(workspace[key])) throw new Error(tr('Zaxira tuzilmasi buzilgan.', 'Структура копии повреждена.', 'Backup structure is invalid.'))
  for(const key of ['strategies','content','campaigns','leads','tasks']){
    const ids=new Set()
    for(const row of workspace[key]){
      if(!row||typeof row.id!=='string'||ids.has(row.id)||typeof row.title!=='string'||!allowedStatuses[key].includes(row.status)||!/^\d{4}-\d{2}-\d{2}$/.test(row.date||''))throw new Error('Invalid record: '+key)
      ids.add(row.id)
      if(key==='content'&&typeof row.time!=='string')throw new Error('Invalid content time')
      if(key==='campaigns'&&(!Array.isArray(row.results)||row.results.some(result=>!result||!/^\d{4}-\d{2}-\d{2}$/.test(result.date)||['reach','leads','spend','revenue'].some(metric=>!Number.isFinite(result[metric])||result[metric]<0))))throw new Error('Invalid campaign results')
    }
  }
  for(const key of ['name','owner','industry','offer','audience','objective','voice']) if(typeof workspace.profile[key]!=='string') throw new Error('Invalid profile: '+key)
  if(!workspace.extensions?.data) throw new Error('Missing workspace modules')
  for(const tab of featureTabs) {
    const rows=workspace.extensions.data[tab.id]
    if(!Array.isArray(rows)) throw new Error('Invalid module: '+tab.id)
    if(rows.some(row=>!row||typeof row.id!=='string'))throw new Error('Invalid module record: '+tab.id)
    if(tab.fields.length) rows.forEach(row=>validateFeature(tab.id,row))
  }
  return workspace
}
