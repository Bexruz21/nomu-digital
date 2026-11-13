import test from 'node:test'
import assert from 'node:assert/strict'
import { initialWorkspace, dateKey, performance, sumResults } from '../src/data.js'
import { normalizeWorkspace, saveFeature, featureAction, runRules, executeRun, spendCredits, validateBackup, bannerSvg, landingHtml, recipients } from '../src/workspace.js'
import { createProposal, campaignBudget, createToolOutput } from '../src/assistant-engine.js'
import { setLocale, t } from '../src/i18n.js'
import { legacy } from '../src/locales/legacy.js'
import { modules } from '../src/features.js'
const fresh=()=>{const seed=initialWorkspace();return normalizeWorkspace(seed,seed)}

test('legacy workspaces retain campaigns and gain complete extension modules',()=>{
  const seed=initialWorkspace(),state=normalizeWorkspace({...seed,profile:{...seed.profile,name:'Original company'}},seed)
  assert.equal(state.profile.name,'Original company')
  assert.equal(state.campaigns.length,seed.campaigns.length)
  for(const module of modules)for(const tab of module.tabs)assert.ok(Array.isArray(state.extensions.data[tab.id]))
  const again=normalizeWorkspace(state,seed);assert.deepEqual(again.extensions,state.extensions)
})
test('translations have three complete nonempty language values',()=>{
  for(const [key,value] of Object.entries(legacy))for(const locale of ['uz','ru','en'])assert.ok(value[locale]?.trim(),`${locale}: ${key}`)
  for(const locale of ['uz','ru','en']){setLocale(locale);assert.ok(t('Bosh sahifa'));assert.ok(t(modules[0].label))}
  setLocale('en');assert.equal(t('Kampaniyalar'),'Campaigns');setLocale('invalid');assert.equal(t('Kampaniyalar'),'Campaigns');setLocale('uz')
})
test('daily budgets and generated text support all three languages',()=>{
  const inputs=[['uz','Kuniga $50 savdo rejasini tuz','Marketing rejasi'],['ru','План продаж $50 в день','Маркетинговый план'],['en','Plan sales at $50 per day','Marketing plan']]
  for(const [locale,prompt,title]of inputs){setLocale(locale);const state=fresh(),result=createProposal(prompt,'plan',state);assert.equal(result.title,title);assert.equal(result.bundle.campaigns[0].budget,50);assert.equal(result.bundle.strategies[0].budget,1500);assert.equal(result.bundle.content.length,3);assert.equal(result.language,locale)}
  assert.equal(campaignBudget('$1,500 per month',100),50);assert.equal(campaignBudget('$30.50 daily',100),30.5);setLocale('uz')
})
test('assistant analysis handles empty workspaces without fabricated results',()=>{
  setLocale('en');const state=fresh();state.campaigns=[];const reply=createProposal('last 7 days','analysis',state)
  assert.match(reply.blocks[0].title,/7-day/);assert.match(reply.blocks[0].lines.join(' '),/needed/);assert.deepEqual(reply.bundle,{});setLocale('uz')
})
test('period buckets and channel totals reconcile, including extended measurements',()=>{
  const state=fresh();state.campaigns[0].results.push({date:dateKey(),reach:10,leads:2,spend:4,revenue:8,impressions:20,clicks:5,conversions:1,customers:1})
  for(const days of [7,30,90]){const report=performance(state.campaigns,days);for(const group of [report.series,report.byChannel]){const sums=sumResults(group);for(const key of Object.keys(report.total))assert.ok(Math.abs(sums[key]-report.total[key])<.000001,key)}}
})
test('new leads create approval requests exactly once, and approval creates one task',()=>{
  const state=fresh(),rule=state.extensions.data.rules[0];rule.enabled='on'
  assert.equal(runRules(state),1);assert.equal(runRules(state),0)
  const run=state.extensions.data.runs[0],before=state.tasks.length
  assert.equal(state.tasks.length,before);assert.equal(executeRun(state,run.id),true);assert.equal(state.tasks.length,before+1);assert.equal(executeRun(state,run.id),false)
})
test('stale approvals do not act on a lead that has already progressed',()=>{
  const state=fresh();state.extensions.data.rules[0].enabled='on';runRules(state);const run=state.extensions.data.runs[0];state.leads.find(lead=>lead.id===run.targetId).status='won'
  assert.equal(executeRun(state,run.id),false);assert.equal(run.status,'cancelled')
})
test('scheduled demo publishing respects the time and is idempotent',()=>{
  const state=fresh(),now=new Date('2026-11-13T12:00:00')
  state.content=[{id:'due',title:'Due',date:'2026-11-13',time:'11:00',status:'scheduled'},{id:'later',title:'Later',date:'2026-11-13',time:'13:00',status:'scheduled'}]
  state.extensions.data.rules=[{id:'publish',title:'Publish',trigger:'scheduled-content',action:'publish-demo',threshold:0,enabled:'on',approval:'automatic'}]
  assert.equal(runRules(state,now),1);assert.equal(state.content[0].status,'published');assert.equal(state.content[1].status,'scheduled');assert.equal(runRules(state,now),0)
})
test('invalid rule/action pairs and impossible experiment counts are rejected',()=>{
  const state=fresh();assert.throws(()=>saveFeature(state,'rules',{...state.extensions.data.rules[0],action:'pause-campaign'}))
  assert.throws(()=>saveFeature(state,'experiments',{title:'Bad',variantA:'A',variantB:'B',visitsA:2,conversionsA:3,visitsB:1,conversionsB:0}))
})
test('optimization requests use selected period and pause only after approval',()=>{
  const state=fresh();featureAction(state,{action:'recommend-pause',id:'c1',payload:{threshold:3,days:30}})
  assert.equal(state.campaigns[0].status,'active');const run=state.extensions.data.runs[0];assert.ok(run);executeRun(state,run.id);assert.equal(state.campaigns[0].status,'paused')
})
test('outreach personalizes eligible contacts and deduplicates sends',()=>{
  const state=fresh(),item=state.extensions.data.outreach[0]
  featureAction(state,{action:'outreach',tab:'outreach',id:item.id});assert.equal(state.extensions.data.deliveries.length,1)
  const delivery=state.extensions.data.deliveries[0];assert.ok(delivery.message.includes('Aziza'));assert.ok(!delivery.message.includes('{name}'))
  featureAction(state,{action:'outreach',tab:'outreach',id:item.id});assert.equal(state.extensions.data.deliveries.length,1)
})
test('landing captures actual local CRM records and records conversion counts',()=>{
  const state=fresh(),id=state.extensions.data.landings[0].id,before=state.leads.length
  assert.throws(()=>featureAction(state,{action:'capture',tab:'landings',id,payload:{name:'Demo',email:'invalid'}}))
  featureAction(state,{action:'visit',tab:'landings',id});featureAction(state,{action:'capture',tab:'landings',id,payload:{name:'Demo',email:'demo@example.com'}})
  assert.equal(state.leads.length,before+1);assert.equal(state.leads[0].landingId,id);assert.equal(state.extensions.data.landings[0].conversions,1)
})
test('credit limits, topups and plan changes preserve the usage ledger',()=>{
  const state=fresh();state.extensions.credits=2;spendCredits(state,2,'Plan','text');assert.equal(state.extensions.credits,0);assert.throws(()=>spendCredits(state,1,'Reply','text'));assert.equal(state.extensions.usage.length,1)
  featureAction(state,{action:'plan',id:'agency'});assert.equal(state.extensions.credits,0);featureAction(state,{action:'credits'});assert.equal(state.extensions.credits,100)
})
test('backup roundtrip and malformed file validation',()=>{
  const state=fresh();const backup=JSON.parse(JSON.stringify({format:'marketlane-workspace',version:2,workspace:state}));assert.deepEqual(validateBackup(backup),state)
  assert.throws(()=>validateBackup({version:2}));backup.workspace.campaigns[0].results='invalid';assert.throws(()=>validateBackup(backup))
})
test('exports escape input and do not enable a disconnected public form',()=>{
  const state=fresh(),item={title:'<script>alert(1)</script>',headline:'<img onerror="bad">',body:'A & B',offer:'<b>unsafe</b>',cta:'Send',format:'1:1',color:'red;bad'}
  const svg=bannerSvg(item,state.profile),html=landingHtml(item,state.profile,'en')
  assert.ok(svg.includes('&lt;img'));assert.ok(!svg.includes('<img onerror'));assert.ok(!html.includes('<script>'));assert.ok(html.includes('button disabled'));assert.ok(!html.includes('red;bad'))
})
test('only one brand kit is active and uploaded images are validated',()=>{
  const state=fresh();saveFeature(state,'brandkits',{title:'Second',color:'#123456',font:'Arial',voice:'Clear',guidelines:'Simple',status:'active'});assert.equal(state.extensions.data.brandkits.filter(row=>row.status==='active').length,1)
  assert.throws(()=>saveFeature(state,'assets',{title:'Image',format:'1:1',color:'#123456',image:'https://example.com/tracker.png'}))
})
test('creative assets add reusable drafts without duplicates',()=>{
  const state=fresh(),item=state.extensions.data.assets[0],before=state.content.length;featureAction(state,{action:'content',tab:'assets',id:item.id});featureAction(state,{action:'content',tab:'assets',id:item.id});assert.equal(state.content.length,before+1);assert.equal(state.content[0].assetId,item.id)
})
test('customer events select the right follow-up audience',()=>{
  const state=fresh(),campaign={...state.extensions.data.outreach[0],segment:'all',trigger:'abandoned-cart'}
  assert.equal(recipients(state,campaign).length,0)
  const event=saveFeature(state,'journeys',{title:'Cart event',contact:state.leads[0].email,event:'abandoned-cart',notes:''})
  featureAction(state,{action:'journey',tab:'journeys',id:event.id})
  assert.equal(recipients(state,campaign).length,1)
  assert.equal(recipients(state,{...campaign,trigger:'repeat-purchase'}).length,0)
})
test('deleted records cannot be recreated by stale editors',()=>{
  const state=fresh(),item=structuredClone(state.extensions.data.competitors[0]);state.extensions.data.competitors=[]
  assert.throws(()=>saveFeature(state,'competitors',item));assert.equal(state.extensions.data.competitors.length,0)
})
test('report snapshots retain measured data and move the next due date',()=>{
  const state=fresh(),report=state.extensions.data.reports[0];featureAction(state,{action:'report',tab:'reports',id:report.id})
  assert.equal(report.snapshot.leads,performance(state.campaigns,7).total.leads);assert.equal(report.date,dateKey(7))
})
