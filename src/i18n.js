import { ref } from 'vue'
import { legacy } from './locales/legacy.js'

export const languages = [{ id: 'uz', label: 'O‘zbekcha', short: 'UZ' }, { id: 'ru', label: 'Русский', short: 'RU' }, { id: 'en', label: 'English', short: 'EN' }]
let saved = 'uz'
try { if(typeof window!=='undefined') saved = window.localStorage.getItem('marketlane-language') || 'uz' } catch { /* Storage may be unavailable. */ }
export const locale = ref(languages.some(item => item.id === saved) ? saved : 'uz')
export const localeTag = () => ({ uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' })[locale.value]
export const L = (uz, ru, en) => ({ uz, ru, en })
export const tr = (uz, ru, en, values) => t(L(uz, ru, en), values)
export function t(value, values = {}) {
  if (value == null) return ''
  if (typeof value === 'number') return value
  if(typeof value==='boolean')return String(value)
  const source = typeof value === 'object' ? value : legacy[String(value).trim()]
  const translated = source?.[locale.value] ?? (typeof value === 'object' ? value.uz : value)
  return String(translated ?? '').replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)
}
export function setLocale(value) {
  if (!languages.some(item => item.id === value)) return
  locale.value = value
  if (typeof document !== 'undefined') document.documentElement.lang = value
  try { if(typeof window!=='undefined') window.localStorage.setItem('marketlane-language', value) } catch { /* Keep the in-memory selection. */ }
}
export function installI18n(app) {
  app.config.globalProperties.$t = t
  setLocale(locale.value)
}
