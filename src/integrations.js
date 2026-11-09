const demoAccounts = [
  { id: 'business', name: 'Biznes egasi', detail: 'owner@marketlane.test', initials: 'BE' },
  { id: 'team', name: 'Marketing jamoasi', detail: 'team@marketlane.test', initials: 'MJ' },
]

const demoBots = [
  { id: 'business', name: 'Marketlane demo bot', detail: '@marketlane_demo_bot', initials: 'MB' },
  { id: 'team', name: 'Marketlane sinov bot', detail: '@marketlane_test_bot', initials: 'SB' },
]

const adPermissions = [
  { title: 'Kampaniyalarni ko‘rish', detail: 'Tanlangan reklama hisobidagi kampaniyalar ro‘yxati va holatlari.' },
  { title: 'Hisobotlarni o‘qish', detail: 'Qamrov, xarajat, bosishlar va konversiya ko‘rsatkichlari.' },
]

function demoResources(primary, sandbox, prefix) {
  return [
    { id: 'primary', name: primary, code: 'DEMO-' + prefix + '-101', accountIds: ['business'] },
    { id: 'sandbox', name: sandbox, code: 'DEMO-' + prefix + '-102', accountIds: ['business', 'team'] },
  ]
}

export const integrationProviders = [
  {
    id: 'meta-ads', name: 'Meta Ads', platform: 'Meta', category: 'Reklama', color: 'blue', mark: '∞',
    description: 'Facebook va Instagram reklama kampaniyalari hamda hisobotlari.',
    resourceLabel: 'Reklama hisobi', resourceIcon: 'megaphone',
    resources: demoResources('Brend reklama hisobi', 'Sinov reklama hisobi', 'META'),
    permissions: adPermissions,
  },
  {
    id: 'google-ads', name: 'Google Ads', platform: 'Google', category: 'Reklama', color: 'amber', mark: 'G',
    description: 'Qidiruv va display kampaniyalarining natijalari.',
    resourceLabel: 'Reklama hisobi', resourceIcon: 'megaphone',
    resources: demoResources('Qidiruv kampaniyalari', 'Sinov kampaniyalari', 'GADS'),
    permissions: adPermissions,
  },
  {
    id: 'tiktok-ads', name: 'TikTok Ads', platform: 'TikTok', category: 'Reklama', color: 'purple', mark: '♪',
    description: 'Qisqa video reklamalari va reklama beruvchi hisobotlari.',
    resourceLabel: 'Reklama beruvchi hisobi', resourceIcon: 'megaphone',
    resources: demoResources('Brend reklama beruvchisi', 'Sinov reklama beruvchisi', 'TT'),
    permissions: adPermissions,
  },
  {
    id: 'instagram', name: 'Instagram', platform: 'Instagram', category: 'Ijtimoiy tarmoq', color: 'pink', mark: '◎',
    description: 'Professional profil, kontent va auditoriya ko‘rsatkichlari.',
    resourceLabel: 'Professional profil', resourceIcon: 'image',
    resources: demoResources('@marketlane_demo', '@marketlane_test', 'IG'),
    permissions: [
      { title: 'Profil va kontentni ko‘rish', detail: 'Tanlangan professional profil ma’lumotlari va nashrlari.' },
      { title: 'Kontent statistikasini o‘qish', detail: 'Qamrov, faollik va auditoriya ko‘rsatkichlari.' },
    ],
  },
  {
    id: 'telegram', name: 'Telegram', platform: 'Telegram', category: 'Messenjer', color: 'blue', icon: 'send',
    description: 'Demo bot orqali kanal bilan ishlash jarayoni.',
    accounts: demoBots, resourceLabel: 'Kanal', resourceIcon: 'message',
    resources: demoResources('Brend yangiliklari', 'Sinov kanali', 'TG'),
    permissions: [
      { title: 'Kanal ma’lumotlarini ko‘rish', detail: 'Tanlangan kanal va unga biriktirilgan bot haqidagi ma’lumotlar.' },
      { title: 'Kanalda nashr qilish', detail: 'Botga kanal xabarlarini joylash uchun beriladigan ruxsat namunasi.' },
    ],
  },
  {
    id: 'google-analytics', name: 'Google Analytics', platform: 'Google', category: 'Analitika', color: 'amber', icon: 'chart',
    description: 'Sayt tashriflari, trafik manbalari va konversiyalar.',
    resourceLabel: 'GA4 resursi', resourceIcon: 'chart',
    resources: demoResources('Brend sayti · GA4', 'Sinov sayti · GA4', 'GA4'),
    permissions: [
      { title: 'GA4 resursini ko‘rish', detail: 'Tanlangan resursning nomi va umumiy sozlamalari.' },
      { title: 'Analitika hisobotlarini o‘qish', detail: 'Tashriflar, trafik manbalari va asosiy hodisalar.' },
    ],
  },
]

export function integrationAccounts(provider) {
  return provider.accounts ?? demoAccounts
}

export function integrationResources(provider, accountId) {
  return provider.resources.filter((resource) => resource.accountIds.includes(accountId))
}

export function createDemoConnection({ providerId, accountId, resourceId }, connectedAt = new Date().toISOString()) {
  const provider = integrationProviders.find((item) => item.id === providerId)
  if (!provider || !integrationResources(provider, accountId).some((item) => item.id === resourceId)) return null
  return {
    providerId, accountId, resourceId,
    connectedAt: Number.isFinite(Date.parse(connectedAt)) ? connectedAt : null,
  }
}

export function normalizeConnections(saved) {
  if (!Array.isArray(saved)) return []
  const connections = new Map()
  for (const item of saved) {
    const legacy = typeof item === 'string' ? integrationProviders.find((provider) => provider.name === item) : null
    const selection = legacy ? { providerId: legacy.id, accountId: 'business', resourceId: 'primary' } : item
    if (!selection || typeof selection !== 'object') continue
    const connection = createDemoConnection(selection, selection.connectedAt ?? null)
    if (connection) connections.set(connection.providerId, connection)
  }
  return [...connections.values()]
}
