import { adChannels, dateKey, money, number, performance, uid } from './data.js'

export const assistantModes = [
  { id: 'plan', label: 'Marketing rejasi', icon: 'target', prompt: 'Keyingi 30 kunda savdoni oshirish uchun strategiya, kontent va kuniga $50 budjetli Meta Ads rejasini tuz.' },
  { id: 'content', label: 'Kontent g‘oyalari', icon: 'calendar', prompt: 'Brendimiz uchun Instagram’da bir haftalik kontent g‘oyalarini tayyorla.' },
  { id: 'campaign', label: 'Reklama kampaniyasi', icon: 'megaphone', prompt: 'Kuniga $30 budjet bilan yangi leadlar uchun Meta Ads kampaniyasi yoz.' },
  { id: 'analysis', label: 'Natijalar tahlili', icon: 'chart', prompt: 'So‘nggi 30 kun natijalarini tahlil qil va nimalarni yaxshilashni ayt.' },
]

function campaignBudget(prompt, profileBudget) {
  const match = prompt.match(/\$\s*(\d+(?:[.,]\d+)?)(?!\d)|(\d+(?:[.,]\d+)?)\s*(?:USD|dollar)/i)
  const amount = match ? Number((match[1] ?? match[2]).replace(',', '.')) : profileBudget
  const daily = match && /kuniga|kunlik|\/\s*kun/i.test(prompt)
  return Math.min(1_000_000, Math.round((daily ? amount : amount / 30) * 100) / 100)
}

export function createProposal(prompt, mode, state) {
  const { profile, campaigns } = state
  const request = prompt.toLocaleLowerCase()
  const date = dateKey()
  const name = profile.name
  const daily = campaignBudget(prompt, profile.budget)
  const adChannel = adChannels.find((channel) => request.includes(channel.split(' ')[0].toLowerCase())) || 'Meta Ads'
  const channel = ['Instagram', 'Telegram', 'TikTok', 'LinkedIn', 'Facebook', 'YouTube'].find((item) => request.includes(item.toLowerCase())) || 'Instagram'
  const goal = /savdo|sotuv|xarid/.test(request) ? 'Savdoni oshirish' : /qamrov|tanilish/.test(request) ? 'Qamrovni oshirish' : 'Lead yig‘ish'
  const objective = /savdo|sotuv|xarid|qamrov|tanilish|lead|murojaat/.test(request) ? goal : profile.objective
  const kpi = { 'Savdoni oshirish': 'Konversiya va ROAS', 'Qamrovni oshirish': 'Qamrov va CPM', 'Lead yig‘ish': 'Malakali leadlar va CPL' }[goal]
  const offer = profile.offer || profile.industry
  const blocks = []
  const bundle = {}

  if (mode === 'plan') {
    const lines = [
      '1-hafta · Auditoriyani segmentlang va “' + offer + '” taklifini sinovga tayyorlang.',
      '2-hafta · ' + channel + ' uchun foydali post, qisqa video va savol-javob chiqaring.',
      '3-hafta · ' + adChannel + ' orqali ikkita kreativni bir xil budjetda solishtiring.',
      '4-hafta · ' + kpi + ' asosida natijalarni baholang va eng yaxshi variantni kengaytiring.',
    ]
    blocks.push({ icon: 'target', title: '30 kunlik strategiya', lines })
    bundle.strategies = [{ title: name + ' · 30 kunlik reja', objective, audience: profile.audience, kpi, budget: Math.round(daily * 3000) / 100, status: 'draft', date: dateKey(30), notes: 'Brif: ' + prompt + '\n\n' + lines.join('\n') }]
    bundle.tasks = [
      { title: 'Taklif va auditoriyani tasdiqlash', owner: profile.owner, priority: 'Yuqori', date: dateKey(1), status: 'todo', notes: profile.audience + '\n' + offer },
      { title: 'Birinchi haftaning natijalarini tahlil qilish', owner: profile.owner, priority: 'O‘rta', date: dateKey(7), status: 'todo', notes: kpi + ' ko‘rsatkichlarini solishtiring.' },
    ]
  }

  if (mode === 'plan' || mode === 'content') {
    bundle.content = [
      { title: offer.slice(0, 74) + ' · Tanishtiruv', format: 'Reels', date: dateKey(1), time: '18:00', notes: 'Ilk kadrda auditoriyaning asosiy muammosini ayting. Keyingi ikki kadrda yechim va foydani ko‘rsating. Yakunda savol bilan izohga chorlang.' },
      { title: 'Mijoz uchun amaliy qo‘llanma', format: 'Karusel', date: dateKey(3), time: '12:00', notes: '1. Muammoni aniqlash. 2. Yechimni tanlash. 3. Natijani o‘lchash. Har slaydda bittadan sodda tavsiya bering.' },
      { title: name + ' bilan savol-javob', format: 'Stories', date: dateKey(5), time: '17:30', notes: 'So‘rovnoma oching, eng ko‘p berilgan savolga javob bering va qiziqqanlarni xabar yozishga chaqiring.' },
    ].map((item) => ({ ...item, channel, status: 'draft', notes: item.notes + '\n\nBrend ohangi: ' + profile.voice + '\nBrif: ' + prompt }))
    blocks.push({ icon: 'calendar', title: channel + ' uchun kontent', lines: bundle.content.map((item) => item.format + ' · ' + item.title) })
  }

  if (mode === 'plan' || mode === 'campaign') {
    const lines = [
      'Maqsad · ' + goal + '. Asosiy auditoriya · ' + profile.audience + '.',
      'Kunlik budjet · ' + money(daily, 2) + '. Ikkita kreativ variant bilan boshlang.',
      'A varianti · Mijoz muammosini ko‘rsating va “' + offer + '” taklifini bering.',
      'B varianti · Natijani misolda ko‘rsating. CTA · Batafsil ma’lumot olish.',
    ]
    blocks.push({ icon: 'megaphone', title: adChannel + ' kampaniyasi', lines })
    bundle.campaigns = [{ title: name + ' · ' + goal, channel: adChannel, goal, budget: daily, date: dateKey(3), status: 'draft', notes: 'Brif: ' + prompt + '\n\n' + lines.join('\n'), results: [] }]
  }

  if (mode === 'analysis') {
    const days = request.match(/\b(7|30|90)\s*kun/)?.[1] || 30
    const { total, byChannel } = performance(campaigns, Number(days))
    const best = byChannel.filter((row) => row.leads > 0).sort((a, b) => a.spend / a.leads - b.spend / b.leads)[0]
    const lines = [
      number(total.reach) + ' qamrov · ' + number(total.leads) + ' lead · ' + money(total.spend, 2) + ' xarajat.',
      'Bir lead narxi · ' + (total.leads ? money(total.spend / total.leads, 2) : '—') + '. ROAS · ' + (total.spend ? number(total.revenue / total.spend, 2) + '×' : '—') + '.',
      best
        ? 'Eng past CPL ' + best.channel + ' kanalida (' + money(best.spend / best.leads, 2) + '). Budjetni o‘zgartirishdan oldin leadlar sifatini CRM’da tekshiring.'
        : 'Kanal bo‘yicha xulosa qilish uchun kampaniyalarga lead va xarajat ma’lumotlarini kiriting.',
    ]
    blocks.push({ icon: 'chart', title: 'So‘nggi ' + days + ' kun tahlili', lines })
  }

  const label = assistantModes.find((item) => item.id === mode).label
  return {
    id: uid(), prompt, mode, date, title: label,
    intro: name + ' uchun “' + profile.industry + '” sohasi va biznes profilingiz asosida demo natija tayyorladim.',
    blocks, bundle, applied: false,
  }
}

export const toolsCatalog = [
  { id: 'seo', title: 'SEO va qidiruv', icon: 'globe', color: 'blue', summary: 'Kalit so‘zlar, meta-matn va sayt auditi rejasi.', field: 'Sahifa manzili yoki mavzu', example: 'Toshkentda marketing agentligi', variants: ['Kalit so‘zlar', 'Audit rejasi'] },
  { id: 'outreach', title: 'Email va messenjer', icon: 'mail', color: 'green', summary: 'Segmentga mos email, SMS yoki follow-up yozing.', field: 'Taklif yoki xabar maqsadi', example: 'Bepul maslahat uchun qayta bog‘lanish', variants: ['Email', 'Telegram', 'WhatsApp', 'SMS'] },
  { id: 'landing', title: 'Landing sahifa', icon: 'layout', color: 'purple', summary: 'Taklif va lead formasiga ega sahifa maketi.', field: 'Mahsulot yoki taklif nomi', example: 'Bepul marketing auditi', variants: ['A · Taklif', 'B · Natija'] },
  { id: 'brand', title: 'Brend, PR va hamkorlik', icon: 'target', color: 'amber', summary: 'Brend xabari, PR brifi va hamkorlik taklifi.', field: 'Tadbir, mahsulot yoki hamkor nomi', example: 'Mahsulot taqdimoti', variants: ['Brend xabari', 'PR brifi', 'Hamkorlik taklifi'] },
  { id: 'social', title: 'SMM javoblari', icon: 'message', color: 'blue', summary: 'Izoh va mijoz xabarlariga javob qoralamasi.', field: 'Mijoz izohi yoki savoli', example: 'Xizmat narxi qancha?', variants: ['Izoh', 'Shaxsiy xabar'] },
  { id: 'creative', title: 'Kreativ studiya', icon: 'image', color: 'green', summary: 'Banner brifi yoki qisqa video ssenariysi.', field: 'Kreativ mavzusi', example: 'Yangi xizmatni tanishtirish', variants: ['Video ssenariy', 'Banner brifi'] },
]

export function toolOutput(tool, topic, variant, detail, profile) {
  const audience = detail || profile.audience
  const brand = profile.name
  const offer = profile.offer
  const heading = variant.startsWith('B ·') ? topic + ' bilan natijani o‘lchang' : topic
  const landing = { heading, tagline: offer + '. ' + audience + ' uchun.', cta: 'Ariza qoldirish' }
  const drafts = {
    seo: variant === 'Audit rejasi'
      ? ['Tekshiruv nishoni: ' + topic, '1. Indekslanish: sitemap, robots.txt va canonical teglarini tekshiring.', '2. Sahifa: yagona H1, meta sarlavha, tavsif va ichki havolalarni ko‘ring.', '3. Mobil tezlik, rasm alt matnlari va aloqa formasini sinang.', '4. Ko‘rinish, bosish va konversiya uchun o‘lchovlarni belgilang.']
      : ['Asosiy ibora: ' + topic, 'Qo‘shimcha so‘rovlar: ' + topic + ' narxi; ' + topic + ' bo‘yicha maslahat; ' + topic + ' misollari.', 'Meta sarlavha: ' + (topic + ' | ' + brand).slice(0, 60), 'Meta tavsif: ' + (brand + ' bilan ' + topic + ' bo‘yicha yechimlarni ko‘ring. ' + offer + '.').slice(0, 155), 'Maqola rejasi: muammo → yechim → misol → savol-javob → murojaat.'],
    outreach: variant === 'SMS'
      ? [brand + ': ' + topic + '. Qiziqsangiz, shu xabarga javob bering.']
      : [
        ...(variant === 'Email' ? ['Mavzu: ' + topic] : []),
        'Assalomu alaykum! Men ' + brand + ' jamoasidanman.',
        'Siz bilan ' + topic + ' bo‘yicha bog‘landik. Biz ' + offer.toLocaleLowerCase() + ' orqali yordam bera olamiz.',
        'Qulay vaqtingizni yozsangiz, keyingi qadamni kelishib olamiz. Rahmat!',
      ],
    landing: [landing.heading, landing.tagline, 'Nimalarni olasiz: dastlabki maslahat, ehtiyoj tahlili va keyingi qadamlar rejasi.', 'Chaqiriq: ' + landing.cta],
    brand: [
      variant + ' · ' + topic,
      'Pozitsiyalash: ' + brand + ' ' + audience + ' uchun ' + offer.toLocaleLowerCase() + ' taklif qiladi.',
      'Asosiy xabar: “' + topic + ' — ehtiyojingizga mos yechim.”',
      variant === 'Hamkorlik taklifi' ? 'Hamkorlik: bitta qo‘shma kontent, o‘lchovli havola va 7 kundan keyin qo‘shma tahlil.' : 'Tarqatish: brend sahifasi, tematik Telegram kanallari va hamkorlar. O‘lchov: murojaatlar va eslatmalar.',
      'Ohang: ' + profile.voice + '.',
    ],
    social: [
      'Mijoz xabari: “' + topic + '”',
      'Assalomu alaykum! ' + brand + 'ga yozganingiz uchun rahmat.',
      /narx|qancha/i.test(topic) ? 'Narx xizmat hajmi va maqsadingizga bog‘liq. Qaysi xizmatga qiziqayotganingizni ayta olasizmi?' : 'Savolingizni oldik. Sizga mos javob berishimiz uchun kerakli xizmat va maqsadingiz haqida qisqacha yozib yuboring.',
      variant === 'Izoh' ? 'Xohlasangiz, tafsilotlarni shaxsiy xabarda muhokama qilamiz.' : 'Siz bilan keyingi qadamni shu yerda kelishamiz.',
    ],
    creative: variant === 'Banner brifi'
      ? ['Sarlavha: ' + topic, 'Vizual: mahsulot yoki xizmat natijasini markazga qo‘ying, fon uchun ' + profile.color + ' aksentdan foydalaning.', 'Matn: ' + offer + '.', 'CTA: Batafsil ma’lumot olish. Format: 1080 × 1080.']
      : ['0–3 soniya · “' + topic + '” orqali e’tiborni jalb qiling.', '3–10 soniya · ' + offer + 'ni jarayon yoki mijoz misolida ko‘rsating.', '10–15 soniya · “' + brand + ' bilan bog‘laning” chaqirig‘i. Vertikal 9:16, subtitrli.'],
  }
  return { id: uid(), tool: tool.id, title: topic, variant, date: dateKey(), lines: drafts[tool.id], ...(tool.id === 'landing' ? { landing } : {}) }
}

export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const field = document.createElement('textarea')
  field.value = text
  field.style.cssText = 'position:fixed;left:-9999px;'
  document.body.append(field)
  field.select()
  const copied = document.execCommand('copy')
  field.remove()
  if (!copied) throw new Error('Clipboard unavailable')
}
