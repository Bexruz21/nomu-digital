export const aiName = 'Nomu Intellegence'

export const pages = [
  { id: 'home', label: 'Bosh sahifa', icon: 'grid' },
  { id: 'assistant', label: aiName, icon: 'sparkles' },
  { id: 'strategies', label: 'Strategiya', icon: 'target' },
  { id: 'content', label: 'Kontent rejasi', icon: 'calendar' },
  { id: 'campaigns', label: 'Kampaniyalar', icon: 'megaphone' },
  { id: 'leads', label: 'Leadlar', icon: 'users' },
  { id: 'analytics', label: 'Analitika', icon: 'chart' },
  { id: 'tasks', label: 'Vazifalar', icon: 'checkSquare', management: true },
  { id: 'tools', label: 'Marketing vositalari', icon: 'layers', management: true },
  { id: 'settings', label: 'Sozlamalar', icon: 'settings', management: true },
]

export const collections = {
  strategies: { title: 'Strategiya', singular: 'strategiya', newLabel: 'Yangi strategiya', icon: 'target', intro: 'Biznes maqsadlari, auditoriya, reja va KPIlarni bir joyda boshqaring.' },
  content: { title: 'Kontent rejasi', singular: 'kontent', newLabel: 'Yangi kontent', icon: 'calendar', intro: 'G‘oyadan nashrgacha bo‘lgan jarayonni kalendarda rejalashtiring.' },
  campaigns: { title: 'Kampaniyalar', singular: 'kampaniya', newLabel: 'Yangi kampaniya', icon: 'megaphone', intro: 'Reklama qoralamalari, budjet va natijalarni boshqaring.' },
  leads: { title: 'Leadlar', singular: 'lead', newLabel: 'Yangi lead', icon: 'users', intro: 'Murojaatlarni saqlang va har bir mijozning savdo bosqichini kuzating.' },
  tasks: { title: 'Vazifalar', singular: 'vazifa', newLabel: 'Yangi vazifa', icon: 'checkSquare', intro: 'Marketing ishlarini rejalashtiring, mas’ul va muddat belgilang.' },
}

export const statuses = {
  draft: { label: 'Qoralama', color: 'neutral' },
  review: { label: 'Tasdiq kutilmoqda', color: 'amber' },
  approved: { label: 'Tasdiqlangan', color: 'green' },
  scheduled: { label: 'Rejalangan', color: 'blue' },
  published: { label: 'Nashr etilgan', color: 'green' },
  active: { label: 'Faol', color: 'green' },
  paused: { label: 'Pauzada', color: 'amber' },
  done: { label: 'Bajarildi', color: 'green' },
  todo: { label: 'Ochiq', color: 'neutral' },
  progress: { label: 'Jarayonda', color: 'blue' },
  new: { label: 'Yangi', color: 'blue' },
  contacted: { label: 'Bog‘lanildi', color: 'purple' },
  qualified: { label: 'Saralangan', color: 'amber' },
  won: { label: 'Sotuv bo‘ldi', color: 'green' },
  lost: { label: 'Yopildi', color: 'neutral' },
}

export const allowedStatuses = {
  strategies: ['draft', 'active', 'done'],
  content: ['draft', 'review', 'approved', 'scheduled', 'published'],
  campaigns: ['draft', 'review', 'approved', 'active', 'paused'],
  leads: ['new', 'contacted', 'qualified', 'won', 'lost'],
  tasks: ['todo', 'progress', 'done'],
}

export const workflow = {
  content: {
    draft: ['review', 'Tasdiqqa yuborish'],
    review: ['approved', 'Tasdiqlash'],
    approved: ['scheduled', 'Rejalashtirish'],
    scheduled: ['published', 'Demo nashr qilish'],
  },
  campaigns: {
    draft: ['review', 'Tasdiqqa yuborish'],
    review: ['approved', 'Tasdiqlash'],
    approved: ['active', 'Demo ishga tushirish'],
    active: ['paused', 'Pauzaga qo‘yish'],
    paused: ['active', 'Davom ettirish'],
  },
}

export const channels = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'Telegram']
export const adChannels = ['Meta Ads', 'Google Ads', 'TikTok Ads']
export const contentFormats = ['Post', 'Reels', 'Stories', 'Video', 'Karusel']
export const sources = [...adChannels, ...channels, 'Landing sahifa', 'Tavsiya', 'Boshqa']
export const periods = [7, 30, 90]
export const integrations = [
  { name: 'Meta Ads', label: 'Facebook va Instagram reklamalari', short: '∞', color: 'blue' },
  { name: 'Google Ads', label: 'Qidiruv va display reklamalari', short: 'G', color: 'amber' },
  { name: 'TikTok Ads', label: 'Qisqa video kampaniyalari', short: '♪', color: 'purple' },
  { name: 'Instagram', label: 'Kontent va nashr rejalari', short: '◎', color: 'purple' },
  { name: 'Telegram', label: 'Messenjer va aloqa', short: '➤', color: 'blue' },
  { name: 'Google Analytics', label: 'Sayt tashriflari va konversiya', short: '▥', color: 'amber' },
]

export const monthNames = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']

export function dateKey(offset = 0, from = new Date()) {
  const date = new Date(from)
  date.setDate(date.getDate() + offset)
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-')
}

export function dateLabel(value) {
  if (!value) return '—'
  const [, month, day] = value.split('-').map(Number)
  return day + ' ' + monthNames[month - 1]
}

export const number = (value, digits = 0) => new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: digits }).format(value)
export const money = (value, digits = 0) => '$' + number(value, digits)
export const uid = () => globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)

export function compact(value) {
  if (value >= 1_000_000) return number(value / 1_000_000, 1) + ' mln'
  if (value >= 1000) return number(value / 1000, 1) + ' ming'
  return number(value)
}

const curve = [11, 12, 11, 16, 19, 18, 22, 21, 18, 18, 19, 23, 31, 33, 31, 27, 25, 25, 28, 32, 39, 36, 34, 38, 34, 35, 43, 47, 45, 48]

function history(totals) {
  const factors = [0.71, 0.86, 1]
  const divisor = curve.reduce((sum, weight) => sum + weight, 0)
  return factors.flatMap((factor, period) => {
    let cumulative = 0
    return curve.map((weight, day) => {
      const row = { date: dateKey(period * 30 + day - 89) }
      Object.entries(totals).forEach(([key, value]) => {
        const cents = key === 'spend' || key === 'revenue' ? 100 : 1
        const target = value * (period === 1 && key === 'spend' ? 0.94 : factor) * cents
        row[key] = (Math.round(target * (cumulative + weight) / divisor) - Math.round(target * cumulative / divisor)) / cents
      })
      cumulative += weight
      return row
    })
  })
}

export function initialWorkspace() {
  const campaigns = [
    { id: 'c1', title: 'Marketing auditi · Lead Ads', channel: 'Meta Ads', goal: 'Lead yig‘ish', budget: 40, status: 'active', date: dateKey(-89), notes: 'Bepul marketing auditi uchun murojaatlar.', results: history({ reach: 73500, leads: 212, spend: 720, revenue: 3210 }) },
    { id: 'c2', title: 'Brend strategiyasi', channel: 'Google Ads', goal: 'Savdoni oshirish', budget: 20, status: 'active', date: dateKey(-89), notes: 'Qidiruvdagi yuqori niyatli so‘rovlar.', results: history({ reach: 36900, leads: 108, spend: 328, revenue: 1456 }) },
    { id: 'c3', title: 'Xizmatlar bilan tanishing', channel: 'TikTok Ads', goal: 'Qamrovni oshirish', budget: 15, status: 'paused', date: dateKey(-89), notes: '15 soniyalik tanishtiruv videosi.', results: history({ reach: 18000, leads: 66, spend: 200, revenue: 576 }) },
    { id: 'c4', title: 'Qishki taklif · Retargeting', channel: 'Meta Ads', goal: 'Savdoni oshirish', budget: 30, status: 'review', date: dateKey(2), notes: 'Saytga avval tashrif buyurgan auditoriya uchun ikki kreativ variant.', results: [] },
  ]

  return {
    profile: {
      name: 'NOMU Studio', owner: 'Admin', industry: 'Marketing agentligi',
      offer: 'Strategiya, reklama va kontent xizmatlari',
      audience: 'Toshkentdagi kichik va o‘rta biznes egalari',
      objective: 'Sifatli murojaatlarni ko‘paytirish',
      voice: 'Samimiy, lo‘nda va professional', website: '', budget: 1500, color: '#00f7a9',
    },
    theme: 'light',
    campaigns,
    strategies: [
      { id: 's1', title: '30 kunlik o‘sish strategiyasi', objective: 'Malakali murojaatlarni 20% ko‘paytirish', audience: 'Toshkentdagi xizmat ko‘rsatish bizneslari', kpi: '100 ta yangi lead', budget: 1500, status: 'active', date: dateKey(21), notes: '1. Auditoriyani segmentlash va taklifni aniqlash.\n2. Instagram’da mijoz natijalari bilan tanishtirish.\n3. Meta Ads’da ikki kreativni solishtirish.\n4. Har hafta CPL va malakali lead ulushini ko‘rib chiqish.' },
      { id: 's2', title: 'Qishki savdo rejasi', objective: 'Mavsumiy taklif orqali qayta murojaatlarni oshirish', audience: 'Mavjud va avval qiziqish bildirgan mijozlar', kpi: '25 ta takroriy murojaat', budget: 900, status: 'draft', date: dateKey(33), notes: 'Mavjud mijozlarni segmentlash va xizmat paketi bo‘yicha alohida taklif tayyorlash.' },
    ],
    content: [
      { id: 'p1', title: 'Biznesingizga marketing auditi', channel: 'Instagram', format: 'Reels', status: 'review', date: dateKey(1), time: '18:00', notes: 'Ilk kadr: “Reklamaga pul sarflayapsiz, lekin natija qayerda?”\n15 soniyada auditning uch bosqichini ko‘rsating.\nCTA: DM orqali “AUDIT” deb yozing.' },
      { id: 'p2', title: 'Mijoz tajribasi · 3 natija', channel: 'LinkedIn', format: 'Karusel', status: 'scheduled', date: dateKey(3), time: '12:00', notes: 'Har bir slaydda muammo, bajarilgan ish va o‘lchangan natijani ko‘rsating.' },
      { id: 'p3', title: 'Sotuvni oshiradigan 5 savol', channel: 'Telegram', format: 'Post', status: 'draft', date: dateKey(5), time: '10:00', notes: 'Maqsad, auditoriya, taklif, kanal va natija bo‘yicha beshta savol.' },
      { id: 'p4', title: 'Jamoa bilan tanishing', channel: 'Instagram', format: 'Stories', status: 'review', date: dateKey(6), time: '17:30', notes: 'Jamoaning ish jarayoni va bir kunlik lavhalar.' },
    ],
    leads: [
      { id: 'l1', title: 'Aziza Karimova', email: 'aziza@example.com', phone: '', source: 'Meta Ads', campaignId: 'c1', status: 'new', date: dateKey(), notes: 'Bepul auditga qiziqdi.' },
      { id: 'l2', title: 'Javohir Salimov', email: 'javohir@example.com', phone: '', source: 'Google Ads', campaignId: 'c2', status: 'qualified', date: dateKey(-1), notes: 'Tijoriy taklif tayyorlash.' },
      { id: 'l3', title: 'Madina Usmonova', email: 'madina@example.com', phone: '', source: 'Instagram', campaignId: '', status: 'contacted', date: dateKey(-2), notes: 'Kontent xizmatlari haqida so‘radi.' },
      { id: 'l4', title: 'Sardor Alimov', email: 'sardor@example.com', phone: '', source: 'Tavsiya', campaignId: '', status: 'won', date: dateKey(-4), notes: 'Strategiya paketi tanlandi.' },
    ],
    tasks: [
      { id: 't1', title: 'Reels ssenariysini ko‘rib chiqish', owner: 'Admin', priority: 'Yuqori', date: dateKey(1), status: 'todo', notes: 'Kirish kadri, taklif va CTAni tekshiring.' },
      { id: 't2', title: 'Retargeting auditoriyasini tayyorlash', owner: 'Admin', priority: 'O‘rta', date: dateKey(2), status: 'progress', notes: 'Avval saytga tashrif buyurgan auditoriya uchun.' },
      { id: 't3', title: 'Haftalik hisobotni ko‘rib chiqish', owner: 'Admin', priority: 'O‘rta', date: dateKey(-1), status: 'done', notes: 'CPL va ROAS ko‘rsatkichlari.' },
    ],
    messages: [],
    savedTools: [],
    connections: ['Meta Ads', 'Instagram'],
    notifications: [{ id: 'n1', text: 'Demo ish maydoningiz tayyor.', date: dateKey(), read: false }],
  }
}

export function sumResults(rows) {
  return rows.reduce((total, row) => {
    for (const key in total) total[key] += Number(row[key]) || 0
    return total
  }, { reach: 0, leads: 0, spend: 0, revenue: 0 })
}

export function performance(campaigns, days) {
  const today = dateKey()
  const first = dateKey(1 - days)
  const priorStart = dateKey(1 - 2 * days)
  const rows = campaigns.flatMap((campaign) => campaign.results)
  const current = rows.filter((row) => row.date >= first && row.date <= today)
  const previous = rows.filter((row) => row.date >= priorStart && row.date < first)
  const series = Array.from({ length: 7 }, (_, i) => {
    const start = dateKey(1 - days + Math.floor(i * days / 7))
    const end = dateKey(-days + Math.floor((i + 1) * days / 7))
    return { start, date: end, ...sumResults(current.filter((row) => row.date >= start && row.date <= end)) }
  })
  const byChannel = adChannels.map((channel) => {
    const data = campaigns.filter((item) => item.channel === channel).flatMap((item) => item.results)
    return { channel, ...sumResults(data.filter((row) => row.date >= first && row.date <= today)) }
  })
  return { total: sumResults(current), prior: sumResults(previous), series, byChannel }
}

export function downloadCsv(filename, rows) {
  const escape = (value) => {
    let text = String(value ?? '')
    if (typeof value === 'string' && /^[\s]*[=+\-@]/.test(text)) text = "'" + text
    return '"' + text.replaceAll('"', '""') + '"'
  }
  const csv = rows.map((row) => row.map(escape).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
