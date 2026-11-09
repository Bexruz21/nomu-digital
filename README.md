# Marketlane.ai

Vue 3 va Vite’da yozilgan mahalliy marketing MVP. Demo logini va paroli `admin`.

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

## Statik build

```powershell
npm.cmd run build
npm.cmd run preview
```

`dist/` papkasi statik HTTP server orqali ochiladi. Ilova brauzerning `localStorage` xotirasidan foydalanadi. Login demo darvozasi, Marketlane AI mahalliy shablon yordamchisi, nashr, reklama va integratsiyalar esa simulyatsiya. Brauzer, port yoki domen o‘zgarsa, mahalliy ma’lumotlar alohida saqlanadi.
