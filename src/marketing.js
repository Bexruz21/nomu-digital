import { promptPresets } from './assistant-engine.js'

export const assistantModes = [
  { id: 'plan', label: 'Marketing rejasi', icon: 'target', get prompt() { return promptPresets.plan() } },
  { id: 'content', label: 'Kontent g‘oyalari', icon: 'calendar', get prompt() { return promptPresets.content() } },
  { id: 'campaign', label: 'Reklama kampaniyasi', icon: 'megaphone', get prompt() { return promptPresets.campaign() } },
  { id: 'analysis', label: 'Natijalar tahlili', icon: 'chart', get prompt() { return promptPresets.analysis() } },
]

export { createProposal, createToolOutput as toolOutput } from './assistant-engine.js'

export const toolsCatalog = [
  { id: 'seo', title: 'SEO va qidiruv', icon: 'globe', color: 'blue', summary: 'Kalit so‘zlar, meta-matn va sayt auditi rejasi.', field: 'Sahifa manzili yoki mavzu', example: 'Toshkentda marketing agentligi', variants: ['Kalit so‘zlar', 'Audit rejasi'] },
  { id: 'outreach', title: 'Email va messenjer', icon: 'mail', color: 'green', summary: 'Segmentga mos email, SMS yoki follow-up yozing.', field: 'Taklif yoki xabar maqsadi', example: 'Bepul maslahat uchun qayta bog‘lanish', variants: ['Email', 'Telegram', 'WhatsApp', 'SMS'] },
  { id: 'landing', title: 'Landing sahifa', icon: 'layout', color: 'purple', summary: 'Taklif va lead formasiga ega sahifa maketi.', field: 'Mahsulot yoki taklif nomi', example: 'Bepul marketing auditi', variants: ['A · Taklif', 'B · Natija'] },
  { id: 'brand', title: 'Brend, PR va hamkorlik', icon: 'target', color: 'amber', summary: 'Brend xabari, PR brifi va hamkorlik taklifi.', field: 'Tadbir, mahsulot yoki hamkor nomi', example: 'Mahsulot taqdimoti', variants: ['Brend xabari', 'PR brifi', 'Hamkorlik taklifi'] },
  { id: 'social', title: 'SMM javoblari', icon: 'message', color: 'blue', summary: 'Izoh va mijoz xabarlariga javob qoralamasi.', field: 'Mijoz izohi yoki savoli', example: 'Xizmat narxi qancha?', variants: ['Izoh', 'Shaxsiy xabar'] },
  { id: 'creative', title: 'Kreativ studiya', icon: 'image', color: 'green', summary: 'Banner brifi yoki qisqa video ssenariysi.', field: 'Kreativ mavzusi', example: 'Yangi xizmatni tanishtirish', variants: ['Video ssenariy', 'Banner brifi'] },
]

export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Try the browser selection API if clipboard permission is unavailable.
    }
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
