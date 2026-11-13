import { dateKey, money, number, performance, uid } from './data.js'
import { locale, tr, t } from './i18n.js'

export function campaignBudget(prompt, profileBudget) {
  const match=prompt.match(/\$\s*(\d+(?:[.,]\d+|\s+\d{3}\b)*)|(\d+(?:[.,]\d+|\s+\d{3}\b)*)\s*(?:USD|dollar|доллар)/i)
  let amount=Number(profileBudget)||0
  if(match){const value=(match[1]||match[2]).replace(/\s/g,'');const fraction=value.match(/[.,](\d{1,2})$/);amount=Number((fraction?value.slice(0,fraction.index):value).replace(/[.,]/g,'')+(fraction?'.'+fraction[1]:''))}
  const daily=match&&/kuniga|kunlik|\/\s*kun|daily|per\s+day|a\s+day|\/\s*day|в\s+день|дневн|ежедневн/i.test(prompt)
  return Math.min(1e6,Math.max(0,Math.round((daily?amount:amount/30)*100)/100))
}
export const promptPresets = {
  plan:()=>tr('Keyingi 30 kunda savdoni oshirish uchun strategiya, kontent va kuniga $50 budjetli Meta Ads rejasini tuz.','Составь стратегию, контент-план и план Meta Ads с бюджетом $50 в день для роста продаж за 30 дней.','Create a strategy, content calendar and Meta Ads plan with $50 per day to grow sales over 30 days.'),
  content:()=>tr('Instagram uchun bir haftalik kontent rejasini tuz.','Подготовь контент-план для Instagram на неделю.','Prepare a week of Instagram content.'),
  campaign:()=>tr('Kuniga $30 bilan Meta Ads orqali lead yig‘ish rejasini tuz.','Подготовь план лидогенерации в Meta Ads с бюджетом $30 в день.','Plan a Meta Ads lead campaign with $30 per day.'),
  analysis:()=>tr('So‘nggi 30 kun natijalarini tahlil qil.','Проанализируй результаты за последние 30 дней.','Analyze the results from the last 30 days.'),
}
export function createProposal(prompt,mode,state) {
  const kit=state.extensions?.data.brandkits.find(item=>item.status==='active')
  const profile={...state.profile,voice:kit?.voice||state.profile.voice},request=prompt.toLowerCase(),daily=campaignBudget(prompt,profile.budget)
  const adChannel=/google/i.test(prompt)?'Google Ads':/tiktok/i.test(prompt)?'TikTok Ads':'Meta Ads'
  const channel=['Instagram','Telegram','TikTok','LinkedIn','Facebook','YouTube'].find(value=>request.includes(value.toLowerCase()))||'Instagram'
  const goal=/lead|лид|murojaat/.test(request)?'Lead yig‘ish':/sales|sale|продаж|savdo|sotuv|xarid/.test(request)?'Savdoni oshirish':/reach|охват|qamrov|tanilish/.test(request)?'Qamrovni oshirish':'Lead yig‘ish'
  const bundle={},blocks=[]
  const kpi=goal==='Savdoni oshirish'?'ROAS':goal==='Qamrovni oshirish'?'CPM':'CPL'
  const labels={plan:tr('Marketing rejasi','Маркетинговый план','Marketing plan'),content:tr('Kontent g‘oyalari','Идеи контента','Content ideas'),campaign:tr('Reklama kampaniyasi','Рекламная кампания','Ad campaign'),analysis:tr('Natijalar tahlili','Анализ результатов','Results analysis')}
  if(!labels[mode])throw new Error('Invalid assistant mode')
  if(mode==='plan'){
    const lines=[tr('1-hafta: taklif va auditoriya segmentlarini tasdiqlang.','Неделя 1: согласуйте предложение и сегменты аудитории.','Week 1: confirm the offer and audience segments.'),tr('2-hafta: foydali kontent va mijoz misollarini tayyorlang.','Неделя 2: подготовьте полезный контент и примеры клиентов.','Week 2: prepare useful content and customer examples.'),tr('3-hafta: ikkita kreativni teng budjetda sinang.','Неделя 3: протестируйте два креатива с равным бюджетом.','Week 3: test two creatives with equal budgets.'),tr('4-hafta: natijalarni tahlil qilib, keyingi qadamni tasdiqlang.','Неделя 4: проанализируйте результаты и согласуйте следующий шаг.','Week 4: analyze results and approve the next step.')]
    bundle.strategies=[{title:profile.name+' · '+tr('30 kunlik reja','План на 30 дней','30-day plan'),objective:profile.objective,audience:profile.audience,kpi,budget:Math.round(daily*3000)/100,status:'draft',date:dateKey(30),notes:prompt+'\n\n'+profile.offer+'\n'+lines.join('\n')}]
    bundle.tasks=[{title:tr('Taklif va auditoriyani tasdiqlash','Согласовать предложение и аудиторию','Approve offer and audience'),owner:profile.owner,priority:'Yuqori',date:dateKey(1),status:'todo',notes:profile.audience},{title:tr('Birinchi hafta natijalarini tekshirish','Проверить результаты первой недели','Review first-week results'),owner:profile.owner,priority:'O‘rta',date:dateKey(7),status:'todo',notes:kpi}]
    blocks.push({icon:'target',title:tr('Strategiya','Стратегия','Strategy'),lines})
  }
  if(['plan','content'].includes(mode)){
    const ideas=[
      [tr('Tanishtiruv','Знакомство','Introduction'),'Reels',tr('Muammoni ko‘rsating, taklifni tushuntiring va bog‘lanishga chaqiring.','Покажите проблему, объясните предложение и пригласите связаться.','Show the problem, explain the offer and invite viewers to get in touch.')],
      [tr('Amaliy qo‘llanma','Практическое руководство','Practical guide'),'Karusel',tr('Uch qadam: muammo, yechim, natijani o‘lchash.','Три шага: проблема, решение, измерение результата.','Three steps: problem, solution, measuring the result.')],
      [tr('Savol-javob','Вопросы и ответы','Questions and answers'),'Stories',tr('Auditoriyadan savollar oling va eng ko‘p takrorlanganiga javob bering.','Соберите вопросы аудитории и ответьте на самый частый.','Collect audience questions and answer the most common one.')],
    ]
    bundle.content=ideas.map(([title,format,notes],index)=>({title:profile.name+' · '+title,channel,format,date:dateKey(index*2+1),time:'18:00',status:'draft',notes:notes+'\n\n'+profile.offer+'\n'+profile.voice+'\n'+prompt}))
    blocks.push({icon:'calendar',title:channel+' · '+tr('Kontent','Контент','Content'),lines:bundle.content.map(item=>t(item.format)+' · '+item.title)})
  }
  if(['plan','campaign'].includes(mode)){
    const lines=[t(goal)+' · '+profile.audience,tr('Kunlik budjet: ','Дневной бюджет: ','Daily budget: ')+money(daily,2),tr('A: mijoz muammosi va yechim. B: aniq foyda va misol.','A: проблема клиента и решение. B: польза и пример.','A: customer problem and solution. B: concrete benefit and example.'),tr('Taklif: ','Предложение: ','Offer: ')+profile.offer]
    bundle.campaigns=[{title:profile.name+' · '+t(goal),channel:adChannel,goal,budget:daily,date:dateKey(3),status:'draft',notes:prompt+'\n\n'+lines.join('\n'),results:[]}]
    blocks.push({icon:'megaphone',title:adChannel,lines})
  }
  if(mode==='analysis'){
    const days=Number(request.match(/(7|30|90)\s*(?:kun|day|дн)/)?.[1]||30)
    const report=performance(state.campaigns,days)
    const best=report.byChannel.filter(row=>row.leads>0&&row.spend>0).sort((a,b)=>a.spend/a.leads-b.spend/b.leads)[0]
    blocks.push({icon:'chart',title:tr('{days} kunlik tahlil','Анализ за {days} дней','{days}-day analysis',{days}),lines:[t('Qamrov')+': '+number(report.total.reach)+' · '+t('Leadlar')+': '+number(report.total.leads),t('Xarajat')+': '+money(report.total.spend,2)+' · ROAS: '+(report.total.spend?number(report.total.revenue/report.total.spend,2)+'×':'—'),best?tr('Eng past CPL: ','Самый низкий CPL: ','Lowest CPL: ')+best.channel+' · '+money(best.spend/best.leads,2):tr('Kanalni solishtirish uchun xarajat va lead ma’lumotlari kerak.','Для сравнения нужны расходы и количество лидов.','Spend and lead data are needed to compare channels.'),tr('Budjetni o‘zgartirishdan oldin CRMdagi lead sifatini tekshiring.','Перед изменением бюджета проверьте качество лидов в CRM.','Review lead quality in CRM before changing budgets.')]})
  }
  return {id:uid(),prompt,mode,date:dateKey(),language:locale.value,title:labels[mode],intro:tr('{name} biznes profili asosida mahalliy demo qoralama.','Локальный демо-черновик на основе профиля {name}.','Local demo draft based on the {name} business profile.',{name:profile.name}),blocks,bundle,applied:false}
}

export function createToolOutput(tool,topic,variant,detail,profile){
  const audience=detail||profile.audience
  const landing={heading:variant.startsWith('B ·')?tr('{topic}: natijaga e’tibor','{topic}: фокус на результате','{topic}: focus on results',{topic}):topic,tagline:profile.offer+' · '+audience,cta:tr('Ariza qoldirish','Оставить заявку','Submit inquiry')}
  const drafts={
    seo:variant==='Audit rejasi'?[topic,tr('Indekslanish: sitemap, robots.txt va canonical.','Индексация: sitemap, robots.txt и canonical.','Indexing: sitemap, robots.txt and canonical.'),tr('Kontent: H1, sarlavha, tavsif, ichki havolalar.','Контент: H1, title, description, внутренние ссылки.','Content: H1, title, description and internal links.'),tr('Tezlik, mobil ko‘rinish va forma konversiyasini tekshiring.','Проверьте скорость, мобильную версию и конверсию формы.','Check speed, mobile layout and form conversion.')]:[tr('Asosiy so‘rov: ','Основной запрос: ','Primary keyword: ')+topic,'Title: '+(topic+' | '+profile.name).slice(0,60),'Description: '+(profile.offer+' · '+topic).slice(0,155),tr('Tuzilma: muammo → yechim → misol → savollar → ariza.','Структура: проблема → решение → пример → вопросы → заявка.','Outline: problem → solution → example → questions → inquiry.')],
    outreach:[tr('Mavzu: ','Тема: ','Subject: ')+topic,tr('Assalomu alaykum! ','Здравствуйте! ','Hello! ')+profile.name+' · '+profile.offer,tr('Qulay vaqtingizni yozing, keyingi qadamni kelishamiz.','Напишите удобное время, и мы согласуем следующий шаг.','Let us know a convenient time to discuss next steps.')],
    landing:[landing.heading,landing.tagline,landing.cta],
    brand:[t(variant)+' · '+topic,profile.name+' · '+audience+' · '+profile.offer,tr('Tarqatish: brend kanallari, hamkorlar va tegishli media.','Распространение: каналы бренда, партнёры и профильные медиа.','Distribution: brand channels, partners and relevant media.'),tr('O‘lchov: murojaatlar, eslatmalar va sotuvlar.','Метрики: заявки, упоминания и продажи.','Measure: inquiries, mentions and sales.'),profile.voice],
    social:[topic,tr('Murojaatingiz uchun rahmat! ','Спасибо за обращение! ','Thank you for reaching out! ')+profile.offer,/narx|qancha|price|cost|цен|стоим/i.test(topic)?tr('Narx ish hajmiga bog‘liq. Qaysi xizmat sizni qiziqtiryapti?','Цена зависит от объёма. Какая услуга вас интересует?','Pricing depends on scope. Which service interests you?'):tr('Ehtiyojingiz haqida qisqacha yozing.','Расскажите немного о ваших потребностях.','Tell us a little about your needs.')],
    creative:variant==='Banner brifi'?[topic,profile.offer,tr('Bitta asosiy kadr, aniq sarlavha, bitta CTA. Format: 1080 × 1080.','Один основной кадр, ясный заголовок, один CTA. Формат: 1080 × 1080.','One key visual, a clear headline and one CTA. Format: 1080 × 1080.')]:[tr('0–3 soniya: ','0–3 секунды: ','0–3 seconds: ')+topic,tr('3–10 soniya: ','3–10 секунд: ','3–10 seconds: ')+profile.offer,tr('10–15 soniya: bog‘lanish chaqirig‘i. Vertikal 9:16, subtitr bilan.','10–15 секунд: призыв связаться. Вертикальный формат 9:16, субтитры.','10–15 seconds: call to get in touch. Vertical 9:16 with captions.')],
  }
  return {id:uid(),tool:tool.id,title:topic,variant,date:dateKey(),language:locale.value,lines:drafts[tool.id],...(tool.id==='landing'?{landing}:{})}
}
