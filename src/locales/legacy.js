// Stable Uzbek source keys keep existing saved records compatible.
const rows = `
AI YORDAMCHI|AI-ПОМОЩНИК|AI ASSISTANT
· Namunaviy ulanish|· Демо-подключение|· Sample connection
uchun mavjud demo resurslari.|— доступные демо-ресурсы.|— available demo resources.
” mahalliy ish maydonidan o‘chiriladi.|” будет удалено из локального пространства.|” will be deleted from the local workspace.
Kenglik uchun sudrang yoki ixcham holatga o‘tish uchun ikki marta bosing|Перетащите для изменения ширины или дважды нажмите для сворачивания|Drag to resize or double-click to collapse
Demo AI|Демо AI|Demo AI
Bosh sahifa|Главная|Overview
AI yordamchi|AI-помощник|AI assistant
Strategiya|Стратегия|Strategy
Kontent rejasi|Контент-план|Content calendar
Kampaniyalar|Кампании|Campaigns
Leadlar|Лиды|Leads
Analitika|Аналитика|Analytics
Vazifalar|Задачи|Tasks
Marketing vositalari|Инструменты маркетинга|Marketing tools
Sozlamalar|Настройки|Settings
ISH MAYDONI|РАБОЧЕЕ ПРОСТРАНСТВО|WORKSPACE
BOSHQARUV|УПРАВЛЕНИЕ|MANAGEMENT
Ish maydoni|Рабочее пространство|Workspace
Ish maydonini qidiring…|Поиск в пространстве…|Search workspace…
Qidirish|Поиск|Search
Menyu|Меню|Menu
Profil menyusi|Меню профиля|Profile menu
Hisob|Аккаунт|Account
Chiqish|Выйти|Sign out
Bildirishnomalar|Уведомления|Notifications
Ma’lumotlar shu brauzerda saqlanadi|Данные хранятся в этом браузере|Data is saved in this browser
Yangi strategiya|Новая стратегия|New strategy
Yangi kontent|Новый контент|New content
Yangi kampaniya|Новая кампания|New campaign
Yangi lead|Новый лид|New lead
Yangi vazifa|Новая задача|New task
Qoralama|Черновик|Draft
Tasdiq kutilmoqda|Ожидает согласования|Awaiting approval
Tasdiqlangan|Согласовано|Approved
Rejalangan|Запланировано|Scheduled
Nashr etilgan|Опубликовано|Published
Faol|Активно|Active
Pauzada|На паузе|Paused
Bajarildi|Завершено|Done
Ochiq|Открыто|Open
Jarayonda|В работе|In progress
Yangi|Новый|New
Bog‘lanildi|Связались|Contacted
Saralangan|Квалифицирован|Qualified
Sotuv bo‘ldi|Продажа|Won
Yopildi|Закрыто|Lost
Tasdiqqa yuborish|На согласование|Request approval
Tasdiqlash|Согласовать|Approve
Rejalashtirish|Запланировать|Schedule
Demo nashr qilish|Демо-публикация|Publish demo
Demo ishga tushirish|Демо-запуск|Launch demo
Pauzaga qo‘yish|Приостановить|Pause
Davom ettirish|Возобновить|Resume
Saqlash|Сохранить|Save
Bekor qilish|Отмена|Cancel
Ortga|Назад|Back
Yopish|Закрыть|Close
O‘chirish|Удалить|Delete
Nusxalash|Копировать|Copy
Tahrirlash|Редактировать|Edit
Nomi|Название|Name
Izoh|Примечание|Notes
Sana|Дата|Date
Vaqt|Время|Time
Holat|Статус|Status
Kanal|Канал|Channel
Format|Формат|Format
Budjet|Бюджет|Budget
Kunlik budjet|Дневной бюджет|Daily budget
Muddat|Срок|Due date
Mas’ul|Ответственный|Assignee
Ustuvorlik|Приоритет|Priority
Yuqori|Высокий|High
O‘rta|Средний|Medium
Past|Низкий|Low
Qamrov|Охват|Reach
Yangi leadlar|Новые лиды|New leads
Reklama xarajati|Расходы на рекламу|Ad spend
oldingi davrga nisbatan|к предыдущему периоду|vs. previous period
Tanlangan davr|Выбранный период|Selected period
Marketing paneli|Маркетинговая панель|Marketing overview
Strategiya, kontent va reklama natijalari bir joyda.|Стратегия, контент и результаты рекламы в одном месте.|Strategy, content and advertising results in one place.
Marketingingiz|Ваш маркетинг|Your marketing
bitta platformada.|на одной платформе.|in one platform.
Maqsadingizni yozing va strategiya, kontent|Опишите цель и подготовьте стратегию, контент|Describe your goal and prepare strategy, content
hamda reklama rejasini tayyorlang.|и рекламный план.|and an advertising plan.
AI yordamchini ochish|Открыть AI-помощника|Open AI assistant
MAQSADDAN NATIJAGACHA|ОТ ЦЕЛИ К РЕЗУЛЬТАТУ|FROM GOAL TO RESULTS
Tasdiqlash navbati|Очередь согласования|Approval queue
Ko‘rib chiqish kerak bo‘lgan ishlar|Работы, ожидающие проверки|Work awaiting review
Tasdiqlash navbati bo‘sh.|Очередь согласования пуста.|No pending approvals.
Barcha tasdiqlar|Все согласования|All approvals
Ish maydonidagi so‘nggi reklamalar|Последние рекламные кампании|Recent workspace campaigns
Barchasini ko‘rish|Посмотреть все|View all
Kampaniya|Кампания|Campaign
Birinchi kampaniyangizni yarating.|Создайте первую кампанию.|Create your first campaign.
Marketing samaradorligi|Эффективность маркетинга|Marketing performance
Tanlangan davrdagi natijalar|Результаты за выбранный период|Results for the selected period
Demo va kiritilgan natijalar|Демо и введённые результаты|Demo and entered results
Hisobot davri|Период отчёта|Report period
So‘nggi|Последние|Last
kun|дней|days
Kanal, xarajat va biznes natijalarini solishtiring.|Сравнивайте каналы, расходы и бизнес-результаты.|Compare channels, costs and business results.
Hisobotni yuklash|Скачать отчёт|Download report
Marketing moliyasi|Финансы маркетинга|Marketing finances
Tanlangan davr bo‘yicha|За выбранный период|For the selected period
Reklamadan daromad|Доход от рекламы|Advertising revenue
Bir lead narxi (CPL)|Стоимость лида (CPL)|Cost per lead (CPL)
CRM’da qayd etilgan sotuv|Продажи в CRM|Sales recorded in CRM
Leadlarni ko‘rish|Посмотреть лиды|View leads
Kanal bo‘yicha natijalar|Результаты по каналам|Results by channel
Demo va qo‘lda kiritilgan kampaniya ma’lumotlari|Демо и вручную введённые данные кампаний|Demo and manually entered campaign data
Xarajat|Расходы|Spend
Daromad|Доход|Revenue
Marketing yordamchisi|Маркетинговый помощник|Marketing assistant
Biznes profilingiz asosida|На основе профиля бизнеса|Based on your business profile
Maqsadingizni yozing va ish maydoniga qo‘shiladigan reja oling.|Опишите цель и получите план для рабочего пространства.|Describe your goal and get a plan for your workspace.
Yangi suhbat|Новый диалог|New conversation
Bugun nimani rejalashtiramiz?|Что планируем сегодня?|What shall we plan today?
Vazifa turini tanlang yoki o‘z topshirig‘ingizni yozing.|Выберите тип задачи или напишите свой запрос.|Choose a task type or write your own brief.
Ish maydoniga qo‘shish|Добавить в пространство|Add to workspace
Qo‘shildi|Добавлено|Added
Marketing topshirig‘i|Маркетинговый запрос|Marketing brief
Masalan, keyingi oy savdoni oshirish rejasini tuz…|Например, составь план роста продаж на следующий месяц…|For example, plan how to grow sales next month…
Vazifa turi|Тип задачи|Task type
Yuborish|Отправить|Send
Demo yordamchi javoblarni mahalliy shablonlar va ish maydoni ma’lumotlaridan tuzadi.|Демо-помощник использует локальные шаблоны и данные пространства.|The demo assistant uses local templates and workspace data.
Biznes konteksti|Контекст бизнеса|Business context
Yordamchi ishlatadigan profil|Профиль для помощника|Profile used by the assistant
Kompaniya|Компания|Company
Soha|Отрасль|Industry
Auditoriya|Аудитория|Audience
Oylik budjet|Месячный бюджет|Monthly budget
Profilni tahrirlash|Редактировать профиль|Edit profile
Ish jarayoni|Рабочий процесс|Workflow
Biznes maqsadini yozing|Опишите бизнес-цель|Describe your business goal
Qoralamalarni ish maydoniga qo‘shing|Добавьте черновики в пространство|Add drafts to your workspace
Kontent va reklamani tasdiqlang|Согласуйте контент и рекламу|Approve content and ads
Natijalarni analitikada kuzating|Следите за результатами в аналитике|Track results in analytics
Marketing rejasi|Маркетинговый план|Marketing plan
Kontent g‘oyalari|Идеи контента|Content ideas
Reklama kampaniyasi|Рекламная кампания|Ad campaign
Natijalar tahlili|Анализ результатов|Results analysis
AI bilan rejalash|Планировать с AI|Plan with AI
Faol strategiyalar|Активные стратегии|Active strategies
Qoralamalar|Черновики|Drafts
Tasdiq navbati|На согласовании|Pending approval
Faol kampaniyalar|Активные кампании|Active campaigns
Ochiq vazifalar|Открытые задачи|Open tasks
Bajarilgan|Завершено|Completed
Qidirish…|Поиск…|Search…
Holat bo‘yicha filtrlash|Фильтр по статусу|Filter by status
Barcha holatlar|Все статусы|All statuses
Kontent ko‘rinishi|Вид контента|Content view
Ro‘yxat|Список|List
Kalendar|Календарь|Calendar
Bugun|Сегодня|Today
Oldingi oy|Предыдущий месяц|Previous month
Keyingi oy|Следующий месяц|Next month
Du|Пн|Mon
Se|Вт|Tue
Cho|Ср|Wed
Pa|Чт|Thu
Ju|Пт|Fri
Sha|Сб|Sat
Ya|Вс|Sun
Mos yozuv topilmadi|Ничего не найдено|No matching records
Hozircha yozuvlar yo‘q|Пока нет записей|No records yet
Qidiruv yoki filtrni o‘zgartiring.|Измените поиск или фильтр.|Try changing your search or filter.
Birinchi yozuvni qo‘shib, ishni boshlang.|Добавьте первую запись, чтобы начать.|Add your first record to get started.
Filtrlarni tozalash|Сбросить фильтры|Clear filters
Rejani ochish|Открыть план|Open plan
Ochish|Открыть|Open
ta yozuv|записей|records
tadan|всего|total
Jami leadlar|Всего лидов|Total leads
Yangi murojaatlar|Новые обращения|New inquiries
Sotuvga aylandi|Конвертированы в продажу|Converted to sales
CRM · SAVDO VORONKASI|CRM · ВОРОНКА ПРОДАЖ|CRM · SALES PIPELINE
Leadlar ko‘rsatkichlari|Показатели лидов|Lead metrics
Leadlar doskasi|Доска лидов|Lead board
Leadlar bo‘yicha qidirish|Поиск лидов|Search leads
Ism, email yoki kampaniya…|Имя, email или кампания…|Name, email or campaign…
Manba bo‘yicha filtrlash|Фильтр по источнику|Filter by source
Barcha manbalar|Все источники|All sources
Tozalash|Очистить|Clear
ta|шт.|items
Kartani boshqa bosqichga sudrang|Перетащите карточку на другой этап|Drag a card to another stage
Mos lead yo‘q|Нет подходящих лидов|No matching leads
Bu bosqichda lead yo‘q|На этом этапе нет лидов|No leads in this stage
Ism va familiya|Имя и фамилия|Full name
Kontent matni yoki ssenariy|Текст или сценарий|Content copy or script
Taklif, auditoriya va kreativlar|Предложение, аудитория и креативы|Offer, audience and creatives
Nomini kiriting.|Введите название.|Enter a name.
Majburiy maydonlarni to‘ldiring.|Заполните обязательные поля.|Complete the required fields.
Email yoki telefon raqamini kiriting.|Введите email или телефон.|Enter an email or phone number.
Holatni o‘zgartirishdan oldin tahrirni saqlang.|Сохраните изменения перед сменой статуса.|Save your edits before changing the status.
Biznes maqsadi|Бизнес-цель|Business goal
Asosiy KPI|Основной KPI|Primary KPI
Umumiy budjet ($)|Общий бюджет ($)|Total budget ($)
Kunlik budjet ($)|Дневной бюджет ($)|Daily budget ($)
Maqsad|Цель|Goal
Telefon|Телефон|Phone
Manba|Источник|Source
Tanlanmagan|Не выбрано|Not selected
Tafsilotlarni yozing…|Добавьте подробности…|Add details…
Qoralamaga qaytarish|Вернуть в черновик|Return to draft
Natija kiritish|Ввести результаты|Enter results
Biznes profili|Профиль бизнеса|Business profile
Integratsiyalar|Интеграции|Integrations
Biznes ma’lumotlari va ulangan xizmatlarni boshqaring.|Управляйте данными бизнеса и подключёнными сервисами.|Manage business information and connected services.
Sozlamalar bo‘limi|Раздел настроек|Settings section
Kompaniya ma’lumotlari|Информация о компании|Company information
Ish maydonidagi biznes va profil ma’lumotlari.|Данные бизнеса и профиля в пространстве.|Business and profile information for this workspace.
Kompaniya nomi|Название компании|Company name
Faoliyat sohasi|Отрасль|Business sector
Profil ismi|Имя профиля|Profile name
Sayt|Сайт|Website
(ixtiyoriy)|(необязательно)|(optional)
Taklif va auditoriya|Предложение и аудитория|Offer and audience
Nimani taklif qilishingiz va kim bilan muloqot qilishingizni yozing.|Опишите предложение и вашу аудиторию.|Describe your offer and who you want to reach.
Mahsulot yoki xizmat|Продукт или услуга|Product or service
Maqsadli auditoriya|Целевая аудитория|Target audience
Brend ohangi|Тон бренда|Brand voice
Maqsad va budjet|Цель и бюджет|Goal and budget
reja tuzishda shu chegaralarni hisobga oladi.|учитывает эти ограничения при планировании.|uses these limits when planning.
Oylik budjet ($)|Месячный бюджет ($)|Monthly budget ($)
Saqlanmagan o‘zgarishlar|Несохранённые изменения|Unsaved changes
Profil saqlangan|Профиль сохранён|Profile saved
Tiklash|Восстановить|Reset
Profilni saqlash|Сохранить профиль|Save profile
AI KONTEKSTI|КОНТЕКСТ AI|AI CONTEXT
AI konteksti|Контекст AI|AI context
Biznes nomi|Название бизнеса|Business name
profilni saqlaganingizdan keyin shu kontekstdan foydalanadi.|использует этот контекст после сохранения профиля.|uses this context after you save the profile.
MAHALLIY DEMO|ЛОКАЛЬНОЕ ДЕМО|LOCAL DEMO
Kanallar va xizmatlar|Каналы и сервисы|Channels and services
Namunaviy hisobni tanlang, ruxsatlarni ko‘rib chiqing va ulanishni tasdiqlang.|Выберите демо-аккаунт, проверьте разрешения и подтвердите подключение.|Choose a sample account, review permissions and confirm the connection.
Demo ulangan|Демо подключено|Demo connected
Ulanmagan|Не подключено|Not connected
Boshqarish|Управлять|Manage
Demo ulash|Подключить демо|Connect demo
Demo ulanish|Демо-подключение|Demo connection
Namunaviy ulanish|Демонстрационное подключение|Sample connection
Ulanish bosqichlari|Этапы подключения|Connection steps
Bot|Бот|Bot
Resurs|Ресурс|Resource
Ruxsatlar|Разрешения|Permissions
Demo botni tanlang|Выберите демо-бота|Choose a demo bot
Demo hisobni tanlang|Выберите демо-аккаунт|Choose a demo account
Ulanishda kanalga biriktiriladigan botni tanlang.|Выберите бота для подключения канала.|Choose the bot to connect to the channel.
Demo botlar|Демо-боты|Demo bots
Demo hisoblar|Демо-аккаунты|Demo accounts
Davom etish|Продолжить|Continue
Ulanadigan resursni tanlang|Выберите ресурс|Choose a resource
Ruxsatlarni ko‘rish|Посмотреть разрешения|Review permissions
Ruxsatlarni ko‘rib chiqing|Проверьте разрешения|Review permissions
Bu ekranda namunaviy ruxsatlar tasdiqlanadi.|Здесь подтверждаются демонстрационные разрешения.|This screen confirms sample permissions.
Tasdiqlash va ulash|Подтвердить и подключить|Confirm and connect
Demo ulanish tayyor|Демо-подключение готово|Demo connection ready
integratsiyalar ro‘yxatiga qo‘shildi.|добавлен в список интеграций.|was added to integrations.
Tayyor|Готово|Done
Ulanish tafsilotlari|Детали подключения|Connection details
Ulangan vaqt|Время подключения|Connected at
Demo ruxsatlari|Демо-разрешения|Demo permissions
Uzish|Отключить|Disconnect
Demo ulanishni uzish|Отключить демо|Disconnect demo
integratsiyalar ro‘yxatidan uziladi.|будет отключён от интеграций.|will be disconnected from integrations.
Oldindan ulangan demo|Предустановленное демо|Preconnected demo
Ish maydoniga kiring.|Войдите в пространство.|Sign in to your workspace.
Marketing rejalaringiz va natijalaringizni boshqaring.|Управляйте маркетинговыми планами и результатами.|Manage your marketing plans and results.
Login|Логин|Username
Parol|Пароль|Password
Loginni kiriting|Введите логин|Enter username
Parolni kiriting|Введите пароль|Enter password
Parolni yashirish|Скрыть пароль|Hide password
Parolni ko‘rsatish|Показать пароль|Show password
Kirish|Войти|Sign in
Demo ma’lumotlarini kiritish|Заполнить демо-данные|Fill demo credentials
MVP · Demo rejimi|MVP · Демо-режим|MVP · Demo mode
Maqsaddan natijagacha bo‘lgan har bir qadamni bir joyda boshqaring.|Управляйте каждым шагом от цели до результата в одном месте.|Manage every step from goal to results in one place.
Kontent|Контент|Content
Login yoki parol xato. Demo uchun admin / admin kiriting.|Неверный логин или пароль. Демо: admin / admin.|Incorrect username or password. Demo: admin / admin.
SEO, xabarlar, kreativ briflar va landing sahifalarni sinab ko‘ring.|Попробуйте SEO, сообщения, креативные брифы и лендинги.|Explore SEO, messages, creative briefs and landing pages.
Variant|Вариант|Variant
Auditoriya (ixtiyoriy)|Аудитория (необязательно)|Audience (optional)
Qoralama tayyorlash|Создать черновик|Create draft
Saqlangan qoralamalar|Сохранённые черновики|Saved drafts
Natija|Результат|Result
Qoralamani shu yerda ko‘rasiz|Здесь появится черновик|Your draft will appear here
LANDING · JONLI MAHALLIY MAKET|ЛЕНДИНГ · ЛОКАЛЬНЫЙ МАКЕТ|LANDING · LOCAL LIVE PREVIEW
Ism|Имя|Name
Ismingiz|Ваше имя|Your name
Murojaat CRM’ga qo‘shildi.|Обращение добавлено в CRM.|Inquiry added to CRM.
Leadlarni ochish|Открыть лиды|Open leads
Saqlangan|Сохранено|Saved
Saqlangan qoralamani o‘chirish|Удалить черновик|Delete saved draft
Qoralamaga tayyor|Готово к созданию|Ready to draft
Mavzuni kiriting va variantni tanlang.|Введите тему и выберите вариант.|Enter a topic and choose a variant.
SEO va qidiruv|SEO и поиск|SEO and search
Email va messenjer|Email и мессенджеры|Email and messaging
Landing sahifa|Лендинг|Landing page
Brend, PR va hamkorlik|Бренд, PR и партнёрства|Brand, PR and partnerships
SMM javoblari|Ответы в соцсетях|Social replies
Kreativ studiya|Креативная студия|Creative studio
Kalit so‘zlar|Ключевые слова|Keywords
Audit rejasi|План аудита|Audit plan
Brend xabari|Сообщение бренда|Brand message
PR brifi|PR-бриф|PR brief
Hamkorlik taklifi|Предложение партнёрства|Partnership proposal
Shaxsiy xabar|Личное сообщение|Direct message
Video ssenariy|Видеосценарий|Video script
Banner brifi|Бриф баннера|Banner brief
A · Taklif|A · Предложение|A · Offer
B · Natija|B · Результат|B · Result
Ariza qoldirish|Оставить заявку|Submit inquiry
Tavsiya|Рекомендация|Referral
Boshqa|Другое|Other
Karusel|Карусель|Carousel
Savdoni oshirish|Рост продаж|Grow sales
Qamrovni oshirish|Рост охвата|Grow reach
Lead yig‘ish|Сбор лидов|Generate leads
Yozuv saqlandi.|Запись сохранена.|Record saved.
Yozuv o‘chirildi.|Запись удалена.|Record deleted.
Yozuv boshqa oynada o‘chirilgan.|Запись удалена в другой вкладке.|Record was deleted in another tab.
Yozuv boshqa oynada yangilangan.|Запись обновлена в другой вкладке.|Record was updated in another tab.
Kunlik natija saqlandi.|Дневные результаты сохранены.|Daily results saved.
Kampaniya holati o‘zgargan. Qayta oching.|Статус кампании изменился. Откройте её снова.|Campaign status changed. Reopen it.
Javob tayyor.|Ответ готов.|Response ready.
Qoralamalar ish maydoniga qo‘shildi.|Черновики добавлены в пространство.|Drafts added to workspace.
Yangi suhbatga tayyor.|Готово к новому диалогу.|Ready for a new conversation.
Biznes profilidagi majburiy maydonlarni to‘ldiring.|Заполните обязательные поля профиля.|Complete required business profile fields.
Biznes profili saqlandi.|Профиль бизнеса сохранён.|Business profile saved.
Qoralama saqlandi.|Черновик сохранён.|Draft saved.
Saqlangan qoralama o‘chirildi.|Черновик удалён.|Saved draft deleted.
Natija nusxalandi.|Результат скопирован.|Result copied.
Nusxalash uchun matnni belgilang.|Выделите текст для копирования.|Select the text to copy it.
Qoralama nusxalandi.|Черновик скопирован.|Draft copied.
Hisobot CSV faylga chiqarildi.|Отчёт экспортирован в CSV.|Report exported to CSV.
Leadlar CSV faylga chiqarildi.|Лиды экспортированы в CSV.|Leads exported to CSV.
Kunlik natija kiritish|Дневные результаты|Enter daily results
Xarajat ($)|Расходы ($)|Spend ($)
Daromad ($)|Доход ($)|Revenue ($)
Shu sana uchun qiymatlar saqlanadi va analitikaga qo‘shiladi.|Данные за эту дату будут сохранены и добавлены в аналитику.|Values for this date will be saved and included in analytics.
Natijani saqlash|Сохранить результаты|Save results
Ish maydonini qidirish|Поиск по пространству|Search workspace
Sahifa yoki yozuv nomi…|Название страницы или записи…|Page or record name…
Qidiruvni yopish|Закрыть поиск|Close search
NATIJALAR|РЕЗУЛЬТАТЫ|RESULTS
TEZKOR HAVOLALAR|БЫСТРЫЕ ССЫЛКИ|QUICK LINKS
Mos natija topilmadi.|Результаты не найдены.|No results found.
Kontent va reklama qoralamalarini ko‘rib chiqing.|Проверьте черновики контента и рекламы.|Review content and campaign drafts.
ta ish tasdiq kutmoqda|работ ожидают согласования|items awaiting approval
Tasdiqlash navbatini ochish|Открыть очередь согласования|Open approval queue
Barchasini o‘qildi deb belgilash|Отметить всё прочитанным|Mark all as read
Yangi suhbat boshlash|Начать новый диалог|Start a new conversation
Avvalgi suhbat tarixi o‘chiriladi. Ish maydoniga qo‘shilgan qoralamalar saqlanadi.|История диалога будет удалена. Добавленные черновики сохранятся.|Conversation history will be deleted. Drafts added to the workspace will remain.
Xabarni yopish|Закрыть уведомление|Dismiss notification
Biznes maqsadlari, auditoriya, reja va KPIlarni bir joyda boshqaring.|Управляйте целями, аудиторией, планами и KPI в одном месте.|Manage goals, audience, plans and KPIs in one place.
G‘oyadan nashrgacha bo‘lgan jarayonni kalendarda rejalashtiring.|Планируйте путь от идеи до публикации в календаре.|Plan every step from idea to publication in the calendar.
Reklama qoralamalari, budjet va natijalarni boshqaring.|Управляйте черновиками рекламы, бюджетом и результатами.|Manage ad drafts, budgets and results.
Murojaatlarni birinchi aloqadan sotuvgacha kuzating.|Отслеживайте обращения от первого контакта до продажи.|Track inquiries from first contact to sale.
Marketing ishlarini rejalashtiring, mas’ul va muddat belgilang.|Планируйте задачи, назначайте ответственных и сроки.|Plan marketing tasks, assign owners and set deadlines.
Kalit so‘zlar, meta-matn va sayt auditi rejasi.|Ключевые слова, метатексты и план аудита сайта.|Keywords, metadata and a website audit plan.
Segmentga mos email, SMS yoki follow-up yozing.|Подготовьте email, SMS или повторное сообщение для сегмента.|Draft email, SMS or follow-ups for a segment.
Taklif va lead formasiga ega sahifa maketi.|Макет страницы с предложением и формой заявки.|A page mockup with an offer and lead form.
Brend xabari, PR brifi va hamkorlik taklifi.|Сообщение бренда, PR-бриф и предложение партнёрства.|Brand message, PR brief and partnership proposal.
Izoh va mijoz xabarlariga javob qoralamasi.|Черновики ответов на комментарии и сообщения.|Draft replies to comments and customer messages.
Banner brifi yoki qisqa video ssenariysi.|Бриф баннера или сценарий короткого видео.|A banner brief or short video script.
Sahifa manzili yoki mavzu|Адрес страницы или тема|Page URL or topic
Taklif yoki xabar maqsadi|Предложение или цель сообщения|Offer or message goal
Mahsulot yoki taklif nomi|Название продукта или предложения|Product or offer name
Tadbir, mahsulot yoki hamkor nomi|Событие, продукт или партнёр|Event, product or partner name
Mijoz izohi yoki savoli|Комментарий или вопрос клиента|Customer comment or question
Kreativ mavzusi|Тема креатива|Creative topic
Toshkentda marketing agentligi|Маркетинговое агентство в Ташкенте|Marketing agency in Tashkent
Bepul maslahat uchun qayta bog‘lanish|Повторный контакт для бесплатной консультации|Follow up for a free consultation
Bepul marketing auditi|Бесплатный маркетинговый аудит|Free marketing audit
Mahsulot taqdimoti|Презентация продукта|Product launch
Xizmat narxi qancha?|Сколько стоит услуга?|How much does the service cost?
Yangi xizmatni tanishtirish|Представление новой услуги|Introducing a new service
Reklama|Реклама|Advertising
Ijtimoiy tarmoq|Социальная сеть|Social network
Messenjer|Мессенджер|Messaging
Reklama hisobi|Рекламный аккаунт|Ad account
Professional profil|Профессиональный профиль|Professional profile
Reklama beruvchi hisobi|Аккаунт рекламодателя|Advertiser account
GA4 resursi|Ресурс GA4|GA4 property
Biznes egasi|Владелец бизнеса|Business owner
Marketing jamoasi|Маркетинговая команда|Marketing team
Kampaniyalarni ko‘rish|Просмотр кампаний|View campaigns
Hisobotlarni o‘qish|Чтение отчётов|Read reports
Tanlangan reklama hisobidagi kampaniyalar ro‘yxati va holatlari.|Список и статусы кампаний выбранного аккаунта.|Campaigns and statuses in the selected ad account.
Qamrov, xarajat, bosishlar va konversiya ko‘rsatkichlari.|Охват, расходы, клики и конверсии.|Reach, spend, clicks and conversion metrics.
Facebook va Instagram reklama kampaniyalari hamda hisobotlari.|Кампании и отчёты Facebook и Instagram.|Facebook and Instagram ad campaigns and reports.
Qidiruv va display kampaniyalarining natijalari.|Результаты поисковых и медийных кампаний.|Search and display campaign results.
Qisqa video reklamalari va reklama beruvchi hisobotlari.|Короткие видеорекламы и отчёты рекламодателя.|Short video ads and advertiser reports.
Professional profil, kontent va auditoriya ko‘rsatkichlari.|Профессиональный профиль, контент и показатели аудитории.|Professional profile, content and audience metrics.
Demo bot orqali kanal bilan ishlash jarayoni.|Работа с каналом через демо-бота.|Channel workflow using a demo bot.
Sayt tashriflari, trafik manbalari va konversiyalar.|Посещения сайта, источники трафика и конверсии.|Website visits, traffic sources and conversions.
Profil va kontentni ko‘rish|Просмотр профиля и контента|View profile and content
Kontent statistikasini o‘qish|Чтение статистики контента|Read content analytics
Kanal ma’lumotlarini ko‘rish|Просмотр данных канала|View channel details
Kanalda nashr qilish|Публикация в канале|Publish to channel
GA4 resursini ko‘rish|Просмотр ресурса GA4|View GA4 property
Analitika hisobotlarini o‘qish|Чтение аналитических отчётов|Read analytics reports
Brend reklama hisobi|Рекламный аккаунт бренда|Brand ad account
Sinov reklama hisobi|Тестовый рекламный аккаунт|Test ad account
Qidiruv kampaniyalari|Поисковые кампании|Search campaigns
Sinov kampaniyalari|Тестовые кампании|Test campaigns
Brend reklama beruvchisi|Рекламодатель бренда|Brand advertiser
Sinov reklama beruvchisi|Тестовый рекламодатель|Test advertiser
Brend yangiliklari|Новости бренда|Brand updates
Sinov kanali|Тестовый канал|Test channel
Brend sayti · GA4|Сайт бренда · GA4|Brand website · GA4
Sinov sayti · GA4|Тестовый сайт · GA4|Test website · GA4
Tanlangan professional profil ma’lumotlari va nashrlari.|Данные и публикации выбранного профиля.|Selected professional profile details and posts.
Qamrov, faollik va auditoriya ko‘rsatkichlari.|Охват, вовлечённость и показатели аудитории.|Reach, engagement and audience metrics.
Tanlangan kanal va unga biriktirilgan bot haqidagi ma’lumotlar.|Информация о выбранном канале и его боте.|Details of the selected channel and its bot.
Botga kanal xabarlarini joylash uchun beriladigan ruxsat namunasi.|Пример разрешения боту публиковать сообщения.|Sample permission for a bot to publish channel messages.
Tanlangan resursning nomi va umumiy sozlamalari.|Название и общие настройки выбранного ресурса.|Selected property name and general settings.
Tashriflar, trafik manbalari va asosiy hodisalar.|Посещения, источники трафика и ключевые события.|Visits, traffic sources and key events.
Menyuni yopish|Закрыть меню|Close menu
Yon menyuni yopish|Закрыть боковое меню|Close sidebar
Yon menyu kengligi|Ширина бокового меню|Sidebar width
Asosiy navigatsiya|Основная навигация|Main navigation
Qorong‘i mavzuga o‘tish|Тёмная тема|Switch to dark theme
Yorug‘ mavzuga o‘tish|Светлая тема|Switch to light theme
Leadni tahrirlash|Редактировать лид|Edit lead
Mahalliy ish maydonidagi demo yozuv|Демо-запись в локальном пространстве|Demo record in the local workspace
Asosiy ko‘rsatkichlar|Основные показатели|Key metrics
Grafik ko‘rsatkichi|Показатель графика|Chart metric
Davrlar bo‘yicha marketing natijalari|Маркетинговые результаты по периодам|Marketing results by period
MARKETLANE ISH MAYDONI|ПРОСТРАНСТВО MARKETLANE|MARKETLANE WORKSPACE
Demo AI|Демо AI|Demo AI
Demo|Демо|Demo
Masalan, malakali leadlarni 20% ko‘paytirish|Например, увеличить квалифицированные лиды на 20%|For example, increase qualified leads by 20%
Masalan, 50 ta lead|Например, 50 лидов|For example, 50 leads
strategiya|стратегия|strategy
kontent|контент|content
kampaniya|кампания|campaign
lead|лид|lead
vazifa|задача|task
Strategiya tafsilotlari|Детали стратегии|Strategy details
Kontent tafsilotlari|Детали контента|Content details
Kampaniya tafsilotlari|Детали кампании|Campaign details
Vazifa tafsilotlari|Детали задачи|Task details
Jami|Итого|Total
Davr boshi|Начало периода|Period start
Davr oxiri|Конец периода|Period end
Xarajat (USD)|Расходы (USD)|Spend (USD)
Daromad (USD)|Доход (USD)|Revenue (USD)
Ism|Имя|Name
Demo ish maydoningiz tayyor.|Ваше демо-пространство готово.|Your demo workspace is ready.
Landing sahifadan yangi demo lead qo‘shildi.|Добавлен демо-лид с лендинга.|New demo lead added from landing page.
`.trim().split('\n')
export const legacy = Object.fromEntries(rows.map(row => { const [uz, ru, en] = row.split('|'); return [uz, { uz, ru, en }] }))
