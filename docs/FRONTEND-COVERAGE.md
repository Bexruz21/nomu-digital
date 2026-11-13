# NOMU konsepsiyasi: frontend qamrovi

Manba: foydalanuvchi bergan 5 sahifali **NOMU AI Introduction-3.pdf**. Hujjat mahsulot konsepsiyasi sifatida o‘rganildi.

| PDF yo‘nalishi | Frontendda amalga oshirilgan | Tashqi API/backend bosqichiga qoladi |
|---|---|---|
| 1. Strategiya va tadqiqot | Reja, KPI, budjet, raqobatchi narx/taklif tarixi, persona, SWOT, USP, CPL asosidagi prognoz | Jonli tadqiqot, avtomatik monitoring, haqiqiy AI |
| 2. Kontent va kreativ | Kalendar, tasdiq, media, banner/SVG, brand kit, storyboard/WebM, ovozli preview | Generativ rasm/video/audio modellari va bulut saqlash |
| 3. SMM | Xabar/izohlar, demo javob, CRMga o‘tkazish, eslatma/sentiment, audience/engagement, demo rejalangan nashr | Kanallardan import, real javob/publishing/social listening |
| 4. Performance | Kampaniya, budjet, KPI, kunlik natija, CPC/CPM/CPL/CPA/ROAS, A/B, pauzani tasdiqlash | Real reklama yaratish, boshqarish va hisobot APIlari |
| 5. SEO va AI qidiruv | Kalit so‘z/maqola rejasi, pasted HTML uchun title/H1/meta/alt/canonical/JSON-LD/viewport tekshiruvi, AI ko‘rinishi gipotezasi | Jonli sayt skaneri, reyting/hajmlar, haqiqiy AI qidiruv ko‘rinishi |
| 6. CRM va leadlar | Kanban, manba/kampaniya, teglar, qo‘lda score, oxirgi aloqa, bitim qiymati, landing/inbox lead capture | Webhooklar, server bazasi, avtomatik scoring/import |
| 7. Email/SMS/messenjer | Segment, shaxsiylashtirish, newsletter/new lead/win-back, cart/repeat-purchase hodisalari, demo tarix/dublikat nazorati | Haqiqiy yetkazish, consent/unsubscribe va ecommerce hodisalari |
| 8. Sayt va konversiya | Landing muharriri, preview, lokal CRM forma, statik HTML, tashrif/konversiya, A/B | Public hosting/backend forma, real trafik tracking |
| 9. Brend/PR/hamkorlik | Brand kit, influencer bazasi, moslik, narx/natija/CPL/ROAS, media reja, eslatmalar | Tashqi discovery, media monitoringi, avtomatik reputatsiya tahlili |
| 10. Analitika va moliya | Davr/kanal/mahsulot, budjet, prognoz, reklama CAC, CRM bitim qiymati, CSV, lokal rejalangan hisobot | Avtomatik ma’lumot importi, to‘liq CAC, cross-channel attribution |
| 11. Jamoa/workflow | Mas’ul/muddat, demo rol/ijrochi, yuklama, tasdiq, bildirishnoma, qoida/log, alohida kompaniya workspacelari | Haqiqiy hisob/taklif/RBAC, real-time hamkorlik, server scheduler |

Qo‘shimcha konsepsiyalar:

- Yordamchi paketi bir amalda strategiya, kontent, kampaniya va vazifalarga qo‘shiladi. AI vositalari sahifasi matn, dizayn, video/audio va analitika uchun mahalliy yo‘nalishlarni ko‘rsatadi.
- Profil, brand kit, oldingi kampaniyalar, natijalar va qoralamalar kompaniyaning lokal ish maydonida saqlanadi.
- SaaS konsepsiyasi: 3 namunaviy tarif, oylik/yillik ko‘rinish, demo kredit va jurnal. To‘lov olinmaydi; reja limitlari majburan qo‘llanmaydi.
- Global foydalanish: UZ/RU/EN interfeys, sana/sonlar va yangi yordamchi natijalari. Saqlangan foydalanuvchi ma’lumotlari asl tilida qoladi.
- JSON backup/restore va eski MVP ma’lumotlarini saqlab qolish.

Hisoblashlar: CPC = spend/clicks; CPM = spend/impressions × 1000; CPL = spend/leads; CPA = spend/conversions; ROAS = revenue/spend. CAC kartasi faqat reklama xarajati/yangi mijozlar nisbatini ko‘rsatadi. CRM leadlari va kampaniya lead hisoblari mustaqil. Prognoz CPL o‘zgarmaydi degan taxmin asosida; A/B esa kuzatilgan nisbat, statistik xulosa emas.

Avtomatlashtirish dublikatlarni tekshiradi va tasdiq vaqtida target holatini qayta baholaydi. Ilova yopilganda avtomatik ishlar bajarilmaydi. Backend talab qiladigan imkoniyatlar interfeysda demo sifatida ko‘rsatilgan.
