# Marketlane.ai · Frontend MVP 0.3

NOMU AI konsepsiyasi asosidagi Vue 3 + Vite marketing ish maydoni. Backend talab qilmaydi. Interfeys o‘zbek, rus va ingliz tillarida. Demo login va parol: `admin` / `admin`.

## Ishga tushirish

```powershell
npm.cmd install
npm.cmd run dev -- --port 5174
```

Terminalda ko‘rsatilgan mahalliy manzilni brauzerda oching. Windows PowerShell’dan boshqa muhitda `npm.cmd` o‘rniga `npm` ishlating.

## MVPni sinash

1. **Sozlamalar → Biznes profili** bo‘limida kompaniya, taklif, auditoriya va budjetni kiriting.
2. **AI yordamchi** bo‘limida maqsad yozing yoki tayyor topshiriq tanlang. Natijani ish maydoniga qo‘shing.
3. **Kontent rejasi** yoki **Kampaniyalar** bo‘limida qoralamani ochib, tasdiqqa yuboring va tasdiqlang. Keyingi amallar demo nashr yoki ishga tushirishni ko‘rsatadi.
4. Faol kampaniyada kunlik natija kiriting. **Analitika** bo‘limida davrni tanlang va CSV hisobotni yuklang.
5. **Marketing vositalari → Landing sahifa** orqali shaklni to‘ldirib, CRM’da yangi lead paydo bo‘lishini tekshiring.
6. **Leadlar** doskasida kartani yangi status ustuniga sudrang yoki kartadagi holat tanlovidan foydalaning.
7. **Sozlamalar → Integratsiyalar** bo‘limida demo hisob yoki botni tanlang, resursga ruxsat bering va saqlangan ulanishni boshqaring.

Kompyuterda yon menyu chetidagi tutqichni sudrab kenglikni o‘zgartiring. Eng ixcham holatda faqat ikonkalar ko‘rinadi. Tutqichni ikki marta bosish yoki fokusda turganida Enter tugmasini bosish ixcham va keng holatlar orasida almashtiradi.

## Yangi modullar

- **Tadqiqot:** raqobatchilar, narx tarixi, persona, SWOT/USP va kiritilgan HTML uchun SEO tekshiruvlari.
- **Kreativ studiya:** rasm yuklash, banner/SVG, brend kit, storyboard, ovozsiz WebM video maket va brauzer ovozi.
- **Ijtimoiy tarmoqlar:** xabar/izohlar, demo javoblar tarixi, CRMga o‘tkazish, brend eslatmalari, auditoriya ko‘rsatkichlari.
- **Email va messenjer:** segmentlar, `{name}` / `{company}` bilan shaxsiylashtirish, savat/qayta xarid hodisalari, dublikatsiz demo yuborish.
- **Saytlar va testlar:** landing muharriri, lokal CRM forma, statik HTML eksport va A/B konversiya taqqoslash.
- **PR va hamkorlar:** influencer kartalari, auditoriya mosligi, xarajat/natijalar va media reja.
- **Avtomatlashtirish:** shart va amallar, tasdiq navbati, holatni qayta tekshirish, bajarilish tarixi.
- **Jamoa va hisobotlar:** demo rollar, ijrochilar, ish yuklamasi, haftalik/oylik CSV va rejalangan lokal hisobot.
- **Tarif va foydalanish:** namunaviy tariflar, yillik/oylik ko‘rinish, demo kredit va foydalanish jurnali.
- **Kengaygan CRM/analitika:** lead sifati, teglar, bitim qiymati, CPC/CPM/CPA/CAC, budjet, prognoz, mahsulot kesimi va optimallashtirishni tasdiqlash.
- **Ish maydonlari:** kompaniyalarni alohida saqlash, JSON backup va tekshiriladigan restore. Eski lokal MVP ma’lumotlari saqlanadi.

Til kirish ekranida va yuqori panelda tanlanadi, qayta ochilganda saqlanadi. Yangi yordamchi qoralamalari tanlangan tilda yaratiladi; avval kiritilgan biznes ma’lumotlari va qoralamalar asl tilida qoladi.

PDFning 11 yo‘nalishi bo‘yicha xarita: [docs/FRONTEND-COVERAGE.md](docs/FRONTEND-COVERAGE.md).

## Tekshiruvlar

```powershell
npm.cmd test
npm.cmd run build
```

Dev server 5174 portda ishlayotganida, boshqa terminalda:

```powershell
npm.cmd run test:browser
```

Brauzer sinovi o‘rnatilgan Chrome va alohida profil orqali ishlaydi; mavjud foydalanuvchi ma’lumotlarini o‘zgartirmaydi. `TEST_BROWSER` muhit o‘zgaruvchisiga `msedge` berib Edge ishlatish mumkin. Testlar 19 sahifani uch tilda, asosiy ish jarayonlarini, eksport/restore, kompaniya ajratilishini va mobil ekranlarni tekshiradi. Vaqtinchalik natijalar Gitga kiritilmaydigan `.nomu-review/` ichida.

## Demo chegaralari

AI yordamchi mahalliy shablonlardan foydalanadi. Nashr, reklama, xabar yuborish va integratsiyalar tashqi xizmatlarga ulanmaydi. Login va jamoa rollari haqiqiy autentifikatsiya/ruxsat tizimi emas. Tarif narxlari namunaviy, pul olinmaydi va tarif limitlari majburan qo‘llanmaydi.

Qoidalar va rejalangan hisobotlar ilova ochiq va ko‘rinib turganda har 60 soniyada tekshiriladi; ilova yopilganda ishlamaydi. Yangi qoidalar o‘chirilgan holatda yaratiladi. Bir xil hodisa qayta bajarilmaydi, tasdiq paytida o‘zgargan target bekor qilinadi.

Raqobatchi, influencer va natijalar qo‘lda kiritiladi. SEO faqat kiritilgan HTMLni tekshiradi. A/B kartalari statistik g‘olibni e’lon qilmaydi. Landing HTML eksportidagi tugma backend ulanmaguncha o‘chirilgan; ilova ichidagi preview forma lokal CRMga yozadi.

Rasmlar PNG/JPEG/WebP formatida, 1 MBgacha. Xotira to‘lsa ilova ogohlantiradi; joriy holatni backup qilish mumkin. Restore oldidan eski ish maydonining nusxasi yuklanadi. WebM va ovozli preview brauzer imkoniyatiga bog‘liq. Video maket ovozsiz va AI video generatsiyasi emas.

## Asosiy fayllar

`src/features.js` — modul/formalar; `src/workspace.js` — amallar, validatsiya, avtomatlashtirish va backup; `src/assistant-engine.js` — uch tilli shablon yordamchi; `src/i18n.js` va `src/locales/legacy.js` — tarjimalar; `src/pages/Workbench.vue` — yangi modullar; `src/components/GrowthInsights.vue` — kengaygan analitika; `src/components/VideoPreview.vue` — WebM maket.

## Statik build

```powershell
npm.cmd run build
npm.cmd run preview
```

`dist/` papkasi statik HTTP server orqali ochiladi. Ilova brauzerning `localStorage` xotirasidan foydalanadi. Login demo darvozasi, Marketlane AI mahalliy shablon yordamchisi, nashr, reklama va integratsiyalar esa simulyatsiya. Brauzer, port yoki domen o‘zgarsa, mahalliy ma’lumotlar alohida saqlanadi.
