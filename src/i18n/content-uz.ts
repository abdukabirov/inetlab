import type { ContentDict } from './content-en';

export const contentUz: ContentDict = {
  concepts: {
    internet: {
      title: 'Internet nima?',
      tagline: 'Bitta tarmoq emas — bir-birining trafigini tashishga kelishgan oʻn minglab tarmoq.',
      simple: [
        'Internet — bu bitta mashina yoki bitta kompaniya emas. Bu taxminan 75 000 mustaqil tarmoq: universitetlar, aloqa operatorlari, xosting provayderlari, davlat tashkilotlari — ular bir-biriga maʼlumot uzatishga kelishgan.',
        'Hammasini boshqaradigan yagona egasi yoʻq. Tizimni umumiy qoidalar — protokollar ushlab turadi: maʼlumotni qanday manzillash, boʻlaklarga ajratish va keyingi qadamga uzatish haqidagi kelishuvlar.',
      ],
      technical: [
        'Har bir mustaqil tarmoq — oʻz raqami va oʻz marshrutlash siyosatiga ega avtonom tizim (AS). Ular pullik tranzit, bepul piring va umumiy kommutatsiya maydonchalari — trafik almashuv nuqtalari orqali bogʻlanadi.',
        'Umumiy «shartnoma» — IP protokoli: undan yuqoridagi hamma narsa (veb, pochta, video qoʻngʻiroq) va quyidagi hamma narsa (optika, mis, radio) mustaqil oʻzgarishi mumkin, faqat ikkala uch IP tilini tushunsa boʻldi.',
      ],
      example:
        'Bitta sahifani ochganingizda maʼlumotlaringiz soniyaning oʻndan bir qismidan kamroq vaqtda toʻrt-besh xil kompaniya tarmogʻidan oʻtishi mumkin — ularning birortasi sizning mavjudligingizni oldindan bilishi shart emas edi.',
      terms: [
        { t: 'Protokol', d: 'Ikki mashina bir-birini tushunishi uchun kelishilgan qoidalar toʻplami.' },
        { t: 'Paket', d: 'Manzil maʼlumoti biriktirilgan kichik maʼlumot boʻlagi.' },
        { t: 'Avtonom tizim', d: 'Oʻz marshrutlash siyosatiga ega bitta mustaqil boshqariladigan tarmoq.' },
      ],
      takeaway: 'Internet — koʻplab tarmoqlarning umumiy protokollar asosida bir-birining paketlarini uzatish boʻyicha ixtiyoriy kelishuvi.',
    },
    isp: {
      title: 'Internet provayderingiz',
      tagline: 'Koʻchangizni qolgan hammaning koʻchasiga ulaydigan kompaniya.',
      simple: [
        'Internet provayder uyingizga yetib keladigan kabel, optika yoki radio kanalga va uning ortidagi katta tarmoqqa egalik qiladi. Siz trafikni butun dunyoga yetkazishi uchun toʻlaysiz.',
        'Provayderning oʻzi ham boshqa tarmoqlarning mijozi yoki hamkori. Uyingizdan chiqqan trafik uning tarmogʻi orqali koʻtariladi va keyin manzilga yeta oladigan tarmoqqa uzatiladi.',
      ],
      technical: [
        'Odatiy provayder toʻrt qavatdan iborat: kirish (sizgacha boʻlgan oxirgi chaqirim — DOCSIS, GPON, DSL, 5G), agregatsiya (minglab abonentni birlashtirish), yadro (katta sigʻimli magistral kanallar) va chegara, u yerda boshqa tarmoqlar bilan tutashish boʻladi.',
        'Chegarada provayder yirikroq tarmoqlardan tranzit sotib oladi va boshqalari bilan bevosita piring qiladi. Marshrutlash siyosati odatda eng arzon yaroqli yoʻlni afzal koʻradi: avval mijoz marshrutlari, keyin piring, soʻng pullik tranzit.',
      ],
      example:
        'Ommabop video koʻpincha kontent kompaniyasi provayder tarmogʻi ichiga oʻrnatgan keshdan beriladi — bunday trafik qimmat tashqi kanallarga umuman chiqmaydi.',
      terms: [
        { t: 'Oxirgi chaqirim', d: 'Provayder tarmogʻidan binoingizgacha boʻlgan yakuniy fizik uchastka.' },
        { t: 'Tranzit', d: 'Trafikni butun internetga yetkazish uchun yirikroq tarmoqqa toʻlash.' },
        { t: 'Piring', d: 'Ikki tarmoq oʻrtasidagi bevosita trafik almashinuvi, odatda toʻlovsiz.' },
      ],
      takeaway: 'Provayder — bu ierarxiya: kirish, agregatsiya, yadro va boshqa tarmoqlar bilan uchrashadigan chegara.',
    },
    'mac-ethernet': {
      title: 'MAC manzillar, Ethernet va Wi-Fi',
      tagline: 'Bitta kanaldagi qurilmalar bir-birini qanday taniydi.',
      simple: [
        'Maʼlumot biror joyga yoʻl olishidan avval simga yoki radio kanalga tushishi kerak. Shu birinchi uchastkada qurilmalar bir-birini MAC manzillar orqali taniydi — bu tarmoq interfeysiga zavodda berilgan identifikator.',
        'Maʼlumot kadr ichiga oʻraladi: foydali yuk hamda joʻnatuvchi MAC manzili, qabul qiluvchi MAC manzili va buzilishni aniqlash uchun nazorat yigʻindisi.',
      ],
      technical: [
        'MAC manzil 48 bitdan iborat va odatda oʻn ikkita oʻn oltilik raqam bilan yoziladi. U faqat bitta kanal doirasida mazmunga ega: har bir router kiruvchi kadrni yechib tashlaydi va keyingi oʻtish uchun yangi MAC manzillar bilan yangi kadr yigʻadi.',
        'Ethernet (IEEE 802.3) va Wi-Fi (IEEE 802.11) fizik jihatdan farq qiladi — biri misda kuchlanishni, ikkinchisi radio toʻlqinni modulyatsiya qiladi — lekin ikkalasi ham bir xil IP paketlarni tashiydi. Ikkala interfeysga ega qurilmada ikkita MAC manzil boʻladi; zamonaviy telefonlar har bir tarmoq uchun uni almashtirib turadi.',
      ],
      example:
        'Veb-server hech qachon noutbukingizning MAC manzilini bilmaydi. U faqat oʻzidan oldingi soʻnggi routerning MAC manzilini koʻradi — manzillar har bir oʻtishda qayta yoziladi.',
      terms: [
        { t: 'MAC manzil', d: 'Tarmoq interfeysining 48 bitli identifikatori, faqat lokal kanalda amal qiladi.' },
        { t: 'Kadr', d: 'Kanal darajasi birligi: maʼlumot hamda MAC manzillar va nazorat yigʻindisi.' },
        { t: 'MTU', d: 'Kanal bitta kadrda tashiy oladigan eng katta maʼlumot hajmi, odatda 1500 bayt.' },
      ],
      takeaway: 'MAC manzillar lokal: ular maʼlumotni butun internet boʻylab emas, faqat qoʻshni qurilmagacha yetkazadi.',
    },
    switch: {
      title: 'Kommutatorlar',
      tagline: 'Kim qaysi portga ulanganini oʻzi aniqlaydigan qurilma.',
      simple: [
        'Kommutator bitta bino yoki uy ichidagi qurilmalarni bogʻlaydi. Kadr kelganda u qabul qiluvchining MAC manziliga qaraydi va kadrni faqat oʻsha qurilma turgan portga yuboradi.',
        'U shunchaki kuzatib oʻrganadi: har bir kiruvchi kadrda joʻnatuvchi qaysi portdan kelganini eslab qoladi. Buni sozlash shart emas.',
      ],
      technical: [
        'Kommutator MAC manzillar jadvalini yuritadi va manzillarni portlarga moslaydi. Notanish qabul qiluvchiga va keng eshittirish kadrlari kirgan portdan tashqari barcha portlarga tarqatiladi; javob esa kommutatorga qurilma qayerdaligini oʻrgatadi.',
        'Kommutator kanal darajasida ishlaydi va IP manzillarga qaramaydi. Bitta keng eshittirish domenidagi barcha portlar bir-birining eshittirish kadrlarini eshitadi; VLAN esa bitta fizik kommutatorni bir nechta mantiqiyga boʻladi.',
      ],
      example:
        'Noutbuk shu tarmoqdagi printerga fayl yuboradi. Kommutator kadrlarni toʻgʻridan-toʻgʻri printer portiga uzatadi, router bunda umuman ishtirok etmaydi.',
      terms: [
        { t: 'MAC jadvali', d: 'Kommutator oʻrgangan «manzil — port» mosligi.' },
        { t: 'Flooding', d: 'Qabul qiluvchi nomaʼlum boʻlganda kadrni barcha portlarga tarqatish.' },
        { t: 'Keng eshittirish domeni', d: 'Bir-birining eshittirish kadrlarini oladigan qurilmalar toʻplami.' },
      ],
      takeaway: 'Kommutatorlar kadrlarni MAC manzil boʻyicha uzatadi va topologiyani trafikdan oʻzi oʻrganadi.',
    },
    router: {
      title: 'Routerlar',
      tagline: 'Chiqish qaysi tomonda ekanini hal qiladigan qurilma.',
      simple: [
        'Router turli tarmoqlarni bogʻlaydi. U har bir paketdagi qabul qiluvchining IP manziliga qaraydi va qaysi kanali kerakli tomonga olib borishini hal qiladi.',
        'Uydagi «router» aslida bir nechta qurilmani birlashtiradi: kommutator, Wi-Fi kirish nuqtasi, router, manzil beruvchi server, manzil almashtiruvchi va oddiy tarmoqlararo ekran.',
      ],
      technical: [
        'Uzatish eng uzun mos prefiks qoidasi boʻyicha ketadi: manzilga mos keladigan marshrutlar ichidan eng aniqrogʻi tanlanadi. Standart marshrut (0.0.0.0/0) qolganini ushlaydi.',
        'Har bir oʻtishda router TTL hisoblagichini kamaytiradi, sarlavha nazorat yigʻindisini qayta hisoblaydi, kiruvchi kadrni tashlab yuboradi va keyingi tugunning MAC manzili bilan yangisini yigʻadi. IP manzillar esa NAT ularni oʻzgartirmasa, oʻzgarishsiz qoladi.',
      ],
      example:
        'Agar routerda 10.0.0.0/8 va 10.1.0.0/16 marshrutlari boʻlsa, 10.1.5.5 uchun paket /16 orqali ketadi — aniqroq moslik doim ustun.',
      terms: [
        { t: 'Marshrutlash jadvali', d: 'Manzil prefikslari va ularning har biri uchun keyingi tugun roʻyxati.' },
        { t: 'Eng uzun prefiks', d: 'Eng aniq mos marshrutni tanlash qoidasi.' },
        { t: 'TTL', d: 'Har oʻtishda kamayadigan hisoblagich; paketlar abadiy aylanib yurmasligi uchun kerak.' },
      ],
      takeaway: 'Routerlar paketlarni IP prefikslar boʻyicha, doimo eng aniq mos kelgan marshrutni tanlab uzatadi.',
    },
    dhcp: {
      title: 'DHCP: manzil oʻzi keladi',
      tagline: 'Hech nima bilmaydigan qurilma kerakli hamma narsani qanday oladi.',
      simple: [
        'Tarmoqqa ulanganda qurilmada hali manzil yoʻq va u kimdan soʻrashni ham bilmaydi. Shuning uchun u hammaga baqiradi: «kimdadir men uchun manzil bormi?»',
        'Server taklif bilan javob beradi, qurilma rozi boʻladi, server tasdiqlaydi. Toʻrtta xabar — va sozlash tugadi.',
      ],
      technical: [
        'Almashinuv Discover, Offer, Request, Acknowledge xabarlaridan iborat (DORA deb eslab qolinadi). U UDP ustida ishlaydi: mijoz 68-portdan, server 67-portdan foydalanadi. Birinchi xabar keng eshittiriladi, chunki mijozda hali manzil yoʻq.',
        'Javob manzildan koʻra koʻproq narsa beradi: quyi tarmoq maskasi, standart shlyuz manzili va DNS serverlar manzillari. Manzil muddatli ijaraga beriladi va muddatning yarmida yangilanadi. IPv6 da buning oʻrniga router eʼlonlari va/yoki DHCPv6 ishlatiladi.',
      ],
      example:
        'Server javob bermasa, koʻpchilik qurilmalar oʻziga 169.254.x.x koʻrinishidagi manzil beradi. Bunday qurilma kabeldagi qoʻshnilarini koʻradi, ammo undan naridagini emas.',
      terms: [
        { t: 'Ijara', d: 'Muddati tugashidan oldin yangilanishi kerak boʻlgan vaqtinchalik manzil.' },
        { t: 'Standart shlyuz', d: 'Lokal boʻlmagan hamma narsa yuboriladigan router manzili.' },
        { t: 'Keng eshittirish', d: 'Lokal tarmoqdagi barcha qurilmalarga yetkaziladigan kadr.' },
      ],
      takeaway: 'DHCP manzil bilan birga maska, shlyuz va DNS serverlarni muddatli ijara sifatida beradi.',
    },
    ip: {
      title: 'IP manzillar',
      tagline: 'Butun dunyo boʻylab yetkazishni mumkin qiladigan manzillash tizimi.',
      simple: [
        'IP manzil qurilma tarmoqning qaysi nuqtasiga ulanganini koʻrsatadi, shunda paketlar unga yeta oladi. IPv4 manzili — 0 dan 255 gacha boʻlgan toʻrtta son, masalan 192.168.1.10.',
        'Baʼzi diapazonlar maxsus: 192.168, 10 yoki 172.16–31 bilan boshlanadigan manzillar xususiy hisoblanadi va uylar hamda tashkilotlar ichida ishlatiladi. 127.0.0.1 esa doim «aynan shu mashina» degani.',
      ],
      technical: [
        'IPv4 manzili 32 bit boʻlib, taxminan 4,3 milliard manzil beradi — va bu yetmadi. IPv6 128 bit ishlatadi, yozuvi 2001:db8::1 koʻrinishida; taqchillik butunlay yoʻqoladi va manzil almashtirish keraksiz boʻlib qoladi.',
        'Manzillar ierarxik: yuqori bitlar tarmoqni, qolganlari undagi tugunni belgilaydi. Aynan shu ierarxiya routerga har bir qurilma uchun emas, millionlab manzil uchun bitta yozuv saqlash imkonini beradi.',
      ],
      example:
        'Xususiy manzillar «marshrutlab boʻlmaydigan» emas — uy yoki kompaniya ichida ular ajoyib ishlaydi. Ular shunchaki kelishuvga koʻra ommaviy internet chegarasida filtrlanadi.',
      terms: [
        { t: 'IPv4', d: '32 bitli manzillash versiyasi, toʻrtta oʻnlik oktet bilan yoziladi.' },
        { t: 'IPv6', d: '128 bitli versiya, oʻn oltilik guruhlar bilan yoziladi.' },
        { t: 'Loopback', d: '127.0.0.1 (yoki ::1) manzili — mashinaning oʻzi.' },
      ],
      takeaway: 'IP manzillar — ulanish joyining ierarxik identifikatorlari; IPv6 IPv4 manzillari tugagani uchun paydo boʻlgan.',
    },
    packet: {
      title: 'Paketlar va inkapsulyatsiya',
      tagline: 'Har bir daraja yuqoridagisini oʻz konvertiga soladi.',
      simple: [
        'Maʼlumot bitta boʻlak boʻlib ketmaydi. U paketlarga boʻlinadi va har bir paket xizmat maʼlumoti qatlamlariga oʻraladi — xuddi konvertdagi xat pochta qutisi ichida turgandek.',
        'Manzilda oʻramlar teskari tartibda yechiladi va dastlabki maʼlumot butun holicha chiqadi.',
      ],
      technical: [
        'HTTPS soʻrovi TLS yozuviga shifrlanadi, u TCP segmentining tarkibiga aylanadi (portlar va tartib raqamlari qoʻshiladi), u esa IP paket tarkibiga (joʻnatuvchi va qabul qiluvchi manzillari qoʻshiladi), u esa Ethernet kadri tarkibiga (MAC manzillar va nazorat yigʻindisi qoʻshiladi).',
        'Har bir sarlavhada keyin qaysi protokol kelishi koʻrsatilgan: EtherType 0x0800 — IPv4, IP dagi 6-raqamli protokol — TCP, TCP dagi 443-port — HTTPS xizmati. Birliklar nomi darajaga qarab farq qiladi — xabar, segment, paket, kadr — garchi soʻzlashuvda hammasi «paket» deyilsa ham.',
      ],
      example:
        '300 baytlik soʻrov TLS, TCP, IP va Ethernet sarlavhalari qoʻshilgach simda taxminan 390 baytga aylanadi. Routerlar faqat IP qismini oʻqiydi, qolgani ular uchun yopiq.',
      terms: [
        { t: 'Inkapsulyatsiya', d: 'Yuqori daraja maʼlumotini quyi daraja sarlavhasi ichiga joylash.' },
        { t: 'Segment', d: 'TCP birligi; UDP da u datagramma deb ataladi.' },
        { t: 'Sarlavha', d: 'Daraja tashiyotgan maʼlumot oldiga qoʻshadigan xizmat maydonlari.' },
      ],
      takeaway: 'Darajalarga boʻlish har bir protokolga bitta vazifani hal qilish va boshqalardan mustaqil almashish imkonini beradi.',
    },
    subnet: {
      title: 'Quyi tarmoqlar va CIDR',
      tagline: 'Manzilning tarmoq qismi qayerda tugab, tugun qismi qayerdan boshlanadi.',
      simple: [
        'Manzil ikki qismdan iborat: qaysi tarmoq va shu tarmoqdagi qaysi qurilma. Chegarani quyi tarmoq maskasi belgilaydi va u qisqacha /24, /26 kabi yoziladi.',
        '192.168.1.0/24 yozuvida birinchi 24 bit tarmoqni belgilaydi, qurilmalarga 8 bit qoladi: 256 manzil, ulardan 254 tasi yaroqli.',
      ],
      technical: [
        'Yaroqli manzillar soni ikkining tugun bitlari darajasidagi qiymatidan ikki ayirilganiga teng: tarmoq manzili (hammasi nol) va keng eshittirish manzili (hammasi bir) band. Shu sababli /26 da 62 ta manzil qoladi.',
        'Tugun manzil lokal ekanini oʻz manzili va qabul qiluvchi manziliga maska qoʻyib, natijalarni solishtirib aniqlaydi. Mos kelsa — toʻgʻridan-toʻgʻri yetkazadi, mos kelmasa — standart shlyuzga yuboradi.',
      ],
      example:
        '192.168.1.0/24 ni toʻrtta /26 blokka boʻlsangiz, har birida 62 tuguni bor toʻrtta alohida tarmoq hosil boʻladi — boʻlimlarni, mehmon tarmogʻini yoki xavfsizlik zonalarini ajratishga qulay.',
      terms: [
        { t: 'CIDR', d: 'Tarmoqni manzil va prefiks uzunligi bilan yozish, masalan 10.0.0.0/8.' },
        { t: 'Quyi tarmoq maskasi', d: 'Tarmoq va tugun chegarasini belgilovchi birlar va nollar ketma-ketligi.' },
        { t: 'Keng eshittirish manzili', d: 'Quyi tarmoqdagi soʻnggi manzil, barcha tugunlarga murojaat uchun band.' },
      ],
      takeaway: 'Prefiks uzunligi nechta yuqori bit tarmoqqa tegishli ekanini bildiradi; qolganlari tugunlarni manzillaydi.',
    },
    nat: {
      title: 'NAT: bitta ommaviy manzil hammaga',
      tagline: 'Oʻnlab qurilma internetda qanday qilib bittadek koʻrinadi.',
      simple: [
        'Provayder odatda xonadonga bitta ommaviy manzil beradi, qurilmalaringiz esa koʻp. Router chiquvchi paketlarda joʻnatuvchi manzilini oʻzining ommaviy manziliga almashtiradi va har bir suhbat qaysi qurilmaga tegishli ekanini eslab qoladi.',
        'Javob kelganda router yozuvlariga qaraydi va manzilni kerakli qurilmaga qaytaradi.',
      ],
      technical: [
        'Keng tarqalgan variant manzilni ham, portni ham almashtiradi, kalit sifatida beshta qiymat ishlatiladi: protokol, manba manzili va porti, qabul qiluvchi manzili va porti. Nazorat yigʻindilari qayta hisoblanadi, yozuvlar esa harakatsizlikdan soʻng oʻchadi.',
        'Ikkita muhim izoh. NAT — tarmoqlararo ekran emas: soʻralmagan kiruvchi paketlarning tashlanishi bu yerda yon taʼsir, xavfsizlik siyosati emas. Va NAT IPv4 uchun majburiy emas: oʻz ommaviy manziliga ega qurilmaga u kerak emas.',
      ],
      example:
        'Bitta saytni ochgan ikkita noutbuk server uchun bitta manzil boʻlib koʻrinadi va faqat almashtirilgan port raqamlari bilan farqlanadi.',
      terms: [
        { t: 'Translyatsiya jadvali', d: 'Xususiy nuqtalarni ommaviylari bilan bogʻlovchi router yozuvlari.' },
        { t: 'Port yoʻnaltirish', d: 'Qoʻlda yaratilgan doimiy kiruvchi moslik.' },
        { t: 'CGNAT', d: 'Operator darajasidagi NAT: bitta manzilni koʻplab abonent boʻlishadi.' },
      ],
      takeaway: 'NAT tarmoq chegarasida manzil va portlarni almashtiradi hamda teskari amal uchun jadval yuritadi.',
    },
    dns: {
      title: 'DNS: nomlar manzilga aylanadi',
      tagline: 'example.com ni raqamga aylantiradigan taqsimlangan maʼlumotnoma.',
      simple: [
        'Odamlar nomlarni eslaydi, paketlarga esa manzil kerak. DNS — birini ikkinchisiga tarjima qiladigan tizim.',
        'Qurilma rezolverdan soʻraydi. Agar u javobni bilmasa, ildiz serverdan .com ni kim boshqarishini, keyin ulardan example.com ni kim boshqarishini soʻraydi va nihoyat manzilning oʻzini oladi.',
      ],
      technical: [
        'Toʻliq aylanib chiqish kamdan-kam boʻladi. Javoblar brauzerda, operatsion tizimda va rezolverda TTL davomida keshlanadi, shuning uchun aksariyat soʻrovlar ildiz serverlarga umuman yetib bormaydi.',
        'DNS faqat manzillarni emas, koʻproq narsani saqlaydi: IPv4 uchun A, IPv6 uchun AAAA, taxalluslar uchun CNAME, pochta uchun MX, delegatsiya uchun NS, tekshiruvlar uchun TXT. Anʼanaviy ravishda UDP ning 53-portida, shuningdek TLS, HTTPS va QUIC ustidagi shifrlangan variantlarda ishlaydi.',
      ],
      example:
        'Saytni yangi serverga koʻchirishdan oldin administratorlar TTL ni bir kundan bir necha daqiqagacha tushiradi, shunda dunyo boʻylab keshlar oʻzgarishni tez ilib oladi.',
      terms: [
        { t: 'Rezolver', d: 'Qidiruvni siz uchun bajaradigan va natijani keshlaydigan server.' },
        { t: 'Avtoritativ server', d: 'Domenning haqiqiy yozuvlarini saqlaydigan server.' },
        { t: 'TTL', d: 'Kesh javobni qayta soʻramasdan necha soniya saqlashi mumkinligi.' },
      ],
      takeaway: 'DNS — faol keshlanadigan delegatsiyalangan maʼlumotnoma: ierarxiya hech bir server hammasini bilmasligi uchun kerak.',
    },
    ports: {
      title: 'Portlar',
      tagline: 'Bitta manzil — koʻplab parallel suhbat.',
      simple: [
        'IP manzil maʼlumotni kerakli kompyuterga yetkazadi. Ammo unda brauzer ham, pochta ham, oʻyin ham ishlaydi. Port raqami maʼlumot qaysi dasturga tegishli ekanini koʻrsatadi.',
        'Serverlar keng maʼlum portlarni tinglaydi, shunda mijozlar qayerni taqillatishni biladi: HTTPS uchun 443, DNS uchun 53, xavfsiz qobiq uchun 22.',
      ],
      technical: [
        'Port — TCP yoki UDP sarlavhasidagi 16 bitli son. Ulanish toʻrtta qiymat toʻplami bilan aniqlanadi: manba manzili va porti, qabul qiluvchi manzili va porti. Shuning uchun minglab mijoz bir vaqtda serverning bitta porti bilan ishlay oladi.',
        'Mijozlar operatsion tizim tanlaydigan katta raqamli vaqtinchalik portlardan foydalanadi. Keng maʼlum port raqamlari — kelishuv, kafolat emas: istalgan dasturni istalgan portga sozlash mumkin.',
      ],
      example:
        'Brauzerning ikkita varagʻi bitta saytni ochadi. Manzil va qabul qiluvchi porti bir xil, turli manba portlari esa ikki suhbatni ajratib turadi.',
      terms: [
        { t: 'Soket', d: 'Ilova bogʻlanadigan manzil va port birikmasi.' },
        { t: 'Efemer port', d: 'Har bir ulanish uchun tanlanadigan katta raqamli vaqtinchalik manba porti.' },
        { t: 'Keng maʼlum port', d: 'Xizmat uchun kelishilgan raqam, masalan HTTPS uchun 443.' },
      ],
      takeaway: 'Manzil va port ilova nuqtasini belgilaydi, toʻrtlik esa ulanishni aniq koʻrsatadi.',
    },
    tcp: {
      title: 'TCP: ishonchli va tartibli yetkazish',
      tagline: 'Ishonchsiz tarmoqni ishonchli bayt oqimiga aylantirish.',
      simple: [
        'IP hech narsa vaʼda qilmaydi: paketlar yoʻqoladi, takrorlanadi, tartibsiz keladi. TCP buni har bir baytni raqamlab va kelganini tasdiqlab hal qiladi.',
        'Ulanish uch bosqichli qoʻl siqish bilan boshlanadi: mijoz salomlashib boshlangʻich raqamni aytadi, server tasdiqlab oʻzinikini yuboradi, mijoz esa uni tasdiqlaydi.',
      ],
      technical: [
        'Har bir segment oʻzining birinchi bayti tartib raqamini tashiydi. Qabul qiluvchi keyingi kutilayotgan bayt raqami bilan javob beradi. Agar taymer ishlaguncha tasdiq kelmasa yoki takroriy tasdiqlar boʻshliqni koʻrsatsa, joʻnatuvchi qayta uzatadi.',
        'TCP tezlikni ham boshqaradi: oqim boshqaruvi qabul qiluvchi buferini toʻldirib yubormaydi, yuklama boshqaruvi esa tarmoqni. TCP kafolati qabul qiluvchi soketida tugaydi: ilova maʼlumotni qayta ishladimi — bu boshqa masala.',
      ],
      example:
        'Sahifa yuklanayotganda bitta segment yoʻqolsa, undan keyin kelgan hamma narsa qayta uzatishni kutib buferda turadi. QUIC aynan shu kutishdan xalos qiladi.',
      terms: [
        { t: 'Qoʻl siqish', d: 'Ulanishni ochadigan uchta xabar almashinuvi.' },
        { t: 'Tartib raqami', d: 'Segmentning birinchi bayti umumiy oqimdagi oʻrni.' },
        { t: 'Qayta uzatish', d: 'Tasdiq kelmaganda maʼlumotni yana yuborish.' },
      ],
      takeaway: 'TCP baytlarni raqamlab va tasdiqlab, tartibli va tekshirilgan bayt oqimini yetkazadi.',
    },
    udp: {
      title: 'UDP: tez va sodda',
      tagline: 'Na qoʻl siqish, na qayta uzatish — baʼzan aynan shu kerak.',
      simple: [
        'UDP IP ga deyarli hech nima qoʻshmaydi: faqat port raqamlari, uzunlik va nazorat yigʻindisi. Ulanish oʻrnatish ham, qayta uzatish ham yoʻq.',
        'Yomonroqdek tuyuladi, ammo jonli ovoz uchun kechikkan paket baribir foydasiz — uni kutgandan koʻra tashlab yuborgan maʼqul.',
      ],
      technical: [
        'UDP xabarlarga yoʻnaltirilgan: datagramma yo butunlay yetkaziladi, yo umuman yetkazilmaydi, chegaralar saqlanadi. TCP esa oqim bilan ishlaydi va unda xabar chegaralari umuman yoʻq.',
        'UDP da oʻrnatilgan yuklama boshqaruvi yoʻq, shuning uchun sezilarli hajm uzatadigan hamma narsa uni oʻzi amalga oshirishi kerak — QUIC va real vaqt protokollari aynan shunday qiladi.',
      ],
      example:
        'DNS soʻrovlari kichik va ularni takrorlash oson, shuning uchun UDP ishlatiladi. Javob kelmasa, rezolver shunchaki yana soʻraydi.',
      terms: [
        { t: 'Datagramma', d: 'Chegaralari saqlangan mustaqil UDP xabari.' },
        { t: 'Ulanishsiz', d: 'Maʼlumotni oldindan almashinuvsiz yuborish.' },
        { t: 'Nazorat yigʻindisi', d: 'Uzatishda tasodifiy buzilishni aniqlash uchun qiymat.' },
      ],
      takeaway: 'UDP ishonchlilikni kechikishga almashtiradi va yoʻqotishlar bilan nima qilishni ilovaning oʻziga qoldiradi.',
    },
    quic: {
      title: 'QUIC',
      tagline: 'UDP ustidagi zamonaviy transport — «shifrlangan UDP» emas.',
      simple: [
        'QUIC TCP qiladigan hamma ishni bajaradi — yuklama boshqaruvi bilan ishonchli va tartibli yetkazishni — ammo UDP ustida amalga oshirilgan va shifrlashni boshidanoq oʻz ichiga oladi.',
        'U UDP ustiga qurilgan, chunki internet oʻrtasidagi uskunalar UDP ni allaqachon tushunadi, mutlaqo yangi protokol esa hamma joyda bloklanardi.',
      ],
      technical: [
        'QUIC bitta ulanishda bir nechta mustaqil oqim olib boradi, shuning uchun paket yoʻqolsa faqat oʻz oqimini ushlab qoladi, hammasini emas. TLS 1.3 qoʻl siqishga qurilgan, shu bois ulanish bitta aylanma almashinuvda oʻrnatiladi va shifrlanadi.',
        'Ulanish manzillar bilan emas, ulanish identifikatori bilan aniqlanadi, shuning uchun Wi-Fi dan mobil tarmoqqa oʻtayotgan telefon sessiyani saqlab qoladi. HTTP/3 — QUIC ustidagi HTTP semantikasi va u TCP dan hech qachon foydalanmaydi.',
      ],
      example:
        'QUIC orqali video qoʻngʻiroq paytida Wi-Fi hududidan chiqing — sessiya manzil oʻzgarishidan omon qoladi; TCP da esa ulanishni qaytadan qurishga toʻgʻri kelardi.',
      terms: [
        { t: 'Oqim', d: 'Bitta QUIC ulanishi ichidagi mustaqil tartiblangan maʼlumot ketma-ketligi.' },
        { t: 'Ulanish identifikatori', d: 'IP manzil oʻzgarganda ham saqlanadigan belgi.' },
        { t: '0-RTT', d: 'Tanish ulanishni tiklashda maʼlumotni birinchi paketdayoq yuborish.' },
      ],
      takeaway: 'QUIC — TLS 1.3 oʻrnatilgan toʻliq transport boʻlib, UDP ni tashuvchi sifatida ishlatadi; HTTP/3 shunda ishlaydi.',
    },
    http: {
      title: 'HTTP',
      tagline: 'Butun vebning soʻrov va javob tili.',
      simple: [
        'Brauzer soʻrov yuboradi: metod (nima qilish kerak), yoʻl (nima ustida) va sarlavhalar (qoʻshimcha maʼlumot). Server holat kodi va odatda tarkib bilan javob beradi.',
        'GET maʼlumot oladi, POST yuboradi. 200 — muvaffaqiyat, 404 — topilmadi, 500 — server ishlamay qoldi.',
      ],
      technical: [
        'HTTP/1.1 oddiy matn yuboradi va bitta ulanishda bir vaqtda bitta soʻrovni bajaradi. HTTP/2 xuddi shu maʼnoni saqlaydi, ammo ikkilik kadrlar, bitta ulanishdagi koʻplab parallel oqimlar va siqilgan sarlavhalardan foydalanadi.',
        'HTTP/3 yana oʻsha semantikani saqlaydi, lekin QUIC ustida ishlaydi va TCP segmenti yoʻqolganda HTTP/2 duch keladigan transport darajasidagi kechikishni yoʻqotadi.',
      ],
      example:
        'Koʻchirilgan sahifani soʻrasangiz, 301 kodi va Location sarlavhasi qaytadi, brauzer esa soʻrovni yangi manzilda avtomatik takrorlaydi.',
      terms: [
        { t: 'Metod', d: 'Soʻralayotgan amal: GET, POST, PUT, PATCH, DELETE.' },
        { t: 'Holat kodi', d: 'Uch xonali natija: 2xx muvaffaqiyat, 3xx yoʻnaltirish, 4xx mijoz xatosi, 5xx server xatosi.' },
        { t: 'Sarlavha', d: 'Soʻrov yoki javob haqidagi qoʻshimcha maʼlumotni tashuvchi «nom — qiymat» juftligi.' },
      ],
      takeaway: 'HTTP ning uchala versiyasi bir xil maʼnoni bildiradi va faqat kadrlash hamda transport bilan farq qiladi.',
    },
    tls: {
      title: 'TLS va HTTPS',
      tagline: 'Kim bilan gaplashayotganingizni bilish va suhbatni maxfiy saqlash.',
      simple: [
        'HTTPS — bu shifrlangan tunnel ichidagi oʻsha HTTP. Tunnelni TLS quradi va u uch vazifani bajaradi: server oʻzini kim deb atasa, oʻsha ekanini isbotlaydi, tarkibni yashiradi va oʻzgartirishni aniqlaydi.',
        'Server sertifikat taqdim etadi — brauzeringiz allaqachon ishonadigan markaz imzolagan hujjat boʻlib, u serverning nomini kriptografik kalit bilan bogʻlaydi.',
      ],
      technical: [
        'Server sizga shifrlash kalitini hech qachon yubormaydi. Ikkala tomon ochiq almashinuv oʻtkazadi va har biri mustaqil ravishda bir xil umumiy sirni hisoblab oladi, uni tinglovchi esa chiqara olmaydi.',
        'Shu sir asosida maʼlumotning oʻzi tez simmetrik shifr bilan himoyalanadi. Almashinuvda vaqtinchalik kalitlar ishlatilgani sababli bugun trafikni yozib olib, ertaga serverning uzoq muddatli kalitini oʻgʻirlash ham yozishmani ochib bermaydi.',
      ],
      example:
        'Manzil satridagi qulf sertifikat sayt nomiga mos kelishini va tunnel shifrlanganini bildiradi. Sayt egasining halolligi haqida esa hech nima demaydi.',
      terms: [
        { t: 'Sertifikat', d: 'Domen nomini ochiq kalit bilan bogʻlovchi imzolangan hujjat.' },
        { t: 'Kalit almashinuvi', d: 'Ochiq kanal orqali umumiy sirni kelishish usuli.' },
        { t: 'Oldinga maxfiylik', d: 'Uzoq muddatli kalit keyinchalik sizib chiqsa ham oʻtgan sessiyalar himoyalanib qoladi.' },
      ],
      takeaway: 'TLS autentifikatsiya, maxfiylik va yaxlitlikni beradi, maxfiy kalit esa hech qachon uzatilmaydi.',
    },
    routing: {
      title: 'Marshrutlash',
      tagline: 'Har bir router paketni keyin qayerga yuborishni qanday hal qiladi.',
      simple: [
        'Hech bir router butun yoʻlni bilmaydi. Har biri faqat qaysi qoʻshnisi kerakli tomonga qadam ekanini biladi va paketni unga uzatadi.',
        'Bu qaror har bir oʻtishda takrorlanadi — toki paket manzilga yetguncha yoki oʻtishlar hisoblagichi tugab, u tashlab yuborilguncha.',
      ],
      technical: [
        'Routerlar alohida manzillarni emas, prefikslarni saqlaydi. Uzatishda eng aniq mos prefiks tanlanadi, standart marshrut esa oxirgi chora sifatida hammasiga mos keladi.',
        'Marshrutlar uch manbadan keladi: bevosita ulangan kanallar, statik sozlamalar va dinamik protokollar — tarmoq ichida kanal holati protokollari, tarmoqlar orasida BGP.',
      ],
      example:
        'traceroute vositasi oʻtishlar hisoblagichi 1, keyin 2, keyin 3 boʻlgan paketlarni yuboradi va qaysi router hisoblagich tugaganini xabar qilganini yozib boradi.',
      terms: [
        { t: 'Keyingi tugun', d: 'Paket uzatiladigan qoʻshni router.' },
        { t: 'Standart marshrut', d: 'Aniqrogʻi topilmaganda ishlatiladigan «qolgan hammasi» yozuvi.' },
        { t: 'Oʻtish', d: 'Routerdan routergacha boʻlgan bitta bosqich.' },
      ],
      takeaway: 'Marshrutlash — lokal qarorlar zanjiri; butun yoʻlni birorta qurilma saqlamaydi.',
    },
    bgp: {
      title: 'BGP',
      tagline: 'Mustaqil tarmoqlar kimga yeta olishini bir-biriga qanday aytadi.',
      simple: [
        'Tarmoqlar qoʻshnilariga qaysi manzil bloklariga yetkaza olishini eʼlon qiladi. Bu eʼlonlar keyinga uzatiladi va har bir tarmoq yoʻlga oʻz identifikatorini qoʻshadi.',
        'Butun yoʻl koʻringani uchun halqalar hosil boʻlmaydi va har bir tarmoq kimning taklifini qabul qilishni oʻzi hal qiladi.',
      ],
      technical: [
        'BGP — yoʻl vektori protokoli. Eʼlonlar atributlarni tashiydi: oʻtilgan tarmoqlar roʻyxati, keyingi tugun, lokal ustunlik va siyosatni bildiruvchi hamjamiyat belgilari.',
        'Avval siyosat, keyin yoʻl uzunligi ishlaydi. Tarmoq odatda mijoz marshrutlarini pir marshrutlaridan, pirlarni esa pullik tranzitdan ustun qoʻyadi — hatto mijoz yoʻli koʻproq tarmoqdan oʻtsa ham.',
      ],
      example:
        'Ikki qoʻshni davlat trafikni yuzlab kilometr naridagi tugun orqali almashishi mumkin — shunchaki ularning tarmoqlari oʻsha yerda kelishuvga ega boʻlgani uchun.',
      terms: [
        { t: 'Prefiks', d: 'Yetib boriladigan deb eʼlon qilinadigan manzillar bloki, masalan 203.0.113.0/24.' },
        { t: 'AS yoʻli', d: 'Eʼlon oʻtgan tarmoqlarning tartiblangan roʻyxati.' },
        { t: 'Lokal ustunlik', d: 'Raqobatdosh marshrutlar orasidan tanlaydigan tarmoq ichki bahosi.' },
      ],
      takeaway: 'BGP yetib borish maʼlumotini almashadi, yoʻlni esa geografiya emas, biznes siyosati tanlaydi.',
    },
    as: {
      title: 'Avtonom tizimlar',
      tagline: 'Internetdagi mustaqillik birligi.',
      simple: [
        'Avtonom tizim — bitta boshqaruv ostidagi, bitta marshrutlash siyosatiga ega tarmoq. Provayderingiz — avtonom tizim. Yirik bulut provayderi ham. Universitet ham boʻlishi mumkin.',
        'Har birining raqami bor va aynan shu raqamlar tarmoqlar bir-biriga eʼlon qiladigan yoʻllarda koʻrinadi.',
      ],
      technical: [
        'Avtonom tizim ichida tarmoq istagan protokollaridan foydalanadi va oʻzini xohlaganicha tashkil qiladi. Tizimlar orasida faqat BGP eʼlonlari uzatiladi — ichki tuzilma yopiq qoladi.',
        'Aynan shu ajratish masshtablanishni taʼminlaydi: uzoqdagi routerga prefiks maʼlum tarmoqlar ketma-ketligi orqali yetib borishini bilish kifoya, ularning ichki tuzilishini emas.',
      ],
      example:
        'Dunyoda taxminan 75 000 faol avtonom tizim raqami bor, global marshrutlash jadvalida esa qariyb bir million IPv4 prefiksi saqlanadi.',
      terms: [
        { t: 'ASN', d: 'Avtonom tizimni belgilaydigan raqam.' },
        { t: 'Ichki marshrutlash', d: 'Tarmoq oʻz ichida ishlatadigan va tashqaridan koʻrinmaydigan protokollar.' },
        { t: 'Marshrut filtrlash', d: 'Qaysi eʼlonlarni qabul qilish va uzatishni hal qilish.' },
      ],
      takeaway: 'Avtonom tizim ichki tuzilishini yashiradi va faqat yetib borish maʼlumotini koʻrsatadi — internet masshtabi shunga tayanadi.',
    },
    ixp: {
      title: 'Trafik almashuv nuqtalari',
      tagline: 'Yuzlab tarmoq uchrashib, trafikni bevosita almashadigan maydonchalar.',
      simple: [
        'Ikki mahalliy tarmoq oʻrtasidagi trafik uchun uchinchi tomonga toʻlash oʻrniga, ular oʻsha shahardagi umumiy kommutatorga ulanib, trafikni toʻgʻridan-toʻgʻri uzatishi mumkin.',
        'Bu — trafik almashuv nuqtasi: neytral maydoncha, odatda bir yoki bir nechta maʼlumot markazidagi juda quvvatli kommutatorlar toʻplami.',
      ],
      technical: [
        'Ishtirokchilar umumiy kommutatsiya fabrikasiga ulanadi va bir-biri bilan BGP sessiyalarini oʻrnatadi — juftma-juft yoki eʼlonlarni bir vaqtda koʻpchilikka tarqatadigan marshrut serveri orqali.',
        'Gap iqtisodda: piring odatda bepul, tranzit esa pullik. Aynan shuning uchun almashuv nuqtasida olingan marshrutlar odatda tranzit marshrutlaridan ustun qoʻyiladi.',
      ],
      example:
        'Mahalliy almashuv nuqtasi boʻlmasa, bitta shahardagi ikki provayder trafikni boshqa mamlakat orqali haydashi mumkin — bu oʻnlab ortiqcha millisoniya va tranzit hisobi.',
      terms: [
        { t: 'Kommutatsiya fabrikasi', d: 'Ishtirokchilar ulanadigan umumiy kommutatsiya platformasi.' },
        { t: 'Marshrut serveri', d: 'Marshrutlarni bir vaqtning oʻzida koʻplab ishtirokchiga tarqatadigan xizmat.' },
        { t: 'Bepul piring', d: 'Hech bir tomon ikkinchisiga toʻlamaydigan tutashuv.' },
      ],
      takeaway: 'Almashuv nuqtalari mahalliy tutashuvni arzonlashtiradi, shu bois lokal trafik lokal va tez qoladi.',
    },
    cdn: {
      title: 'Kontent yetkazish tarmoqlari',
      tagline: 'Kontent nusxalari sizga yaqin joyda.',
      simple: [
        'Agar saytning yagona serveri boshqa qitʼada boʻlsa, har bir soʻrov okeanni ikki marta kesib oʻtishi kerak. CDN kontent nusxalarini koʻplab shaharga joylashtiradi va sizga eng yaqinidan beradi.',
        'Mintaqangizdagi birinchi soʻrov maʼlumotni asosiy serverdan olib saqlaydi. Keyingilarning hammasi saqlangan nusxani darhol oladi.',
      ],
      technical: [
        'Keshga tushish chekka tugundan beriladi, tushmaslik esa asosiy serverdan olinadi — koʻpincha manbani koʻplab bir vaqtli soʻrovdan himoyalaydigan oraliq qatlam orqali. Yangilikni keshlash sarlavhalari va TTL belgilaydi.',
        'Foydalanuvchilarni eng yaqin tugunga joylashuvini hisobga olgan DNS javoblari yoki anycast yoʻnaltiradi — bunda bir xil manzil koʻp joydan eʼlon qilinadi va marshrutlash eng yaqiniga olib boradi.',
      ],
      example:
        'Yirik kontent tarmoqlari keshlarni bevosita provayder tarmogʻi ichiga oʻrnatadi, shu bois ommabop video almashuv nuqtasiga ham yetib bormaydi.',
      terms: [
        { t: 'Chekka tugun', d: 'Foydalanuvchilarga yaqin keshlash maydonchasi.' },
        { t: 'Keshga tushish va tushmaslik', d: 'Tugunda soʻralgan obyektning yangi nusxasi bor-yoʻqligi.' },
        { t: 'Asosiy server', d: 'Kontent pirovardida olinadigan birlamchi manba.' },
      ],
      takeaway: 'CDN yorugʻlik tezligi chegarasini shunchaki safar qilmaslik bilan yengadi: javob sizga yaqin nusxadan beriladi.',
    },
    datacenter: {
      title: 'Maʼlumot markazlari',
      tagline: 'Serverlar fizik jihatdan joylashgan joy.',
      simple: [
        'Maʼlumot markazi — zaxiralangan elektr taʼminoti, sovitish va aloqa kanallariga ega, serverlarga toʻla bino. Kiruvchi trafik serverga yetguncha routerlar, tarmoqlararo ekran va yuk muvozanatlagichdan oʻtadi.',
        'Hech narsa yagona nusxada boʻlmaydi. Server ishdan chiqsa, muvozanatlagich unga soʻrov yuborishni toʻxtatadi va buni hech kim sezmaydi.',
      ],
      technical: [
        'Zamonaviy maydonchalar leaf-spine sxemasida quriladi: har bir stoyka kommutatori har bir magistral kommutatorga ulanadi, bu esa bashoratli kechikish va teng yoʻllar boʻyicha gorizontal masshtablanishni beradi.',
        'Muvozanatlagichlar ulanishlarni bir xil serverlar orasida taqsimlaydi va holat tekshiruvlari natijasida nosozlarini ishdan chiqaradi. Bitta binodan tashqarida esa foydalanish zonalari butun tizimni takrorlaydi, toki maydonchani butunlay yoʻqotish mumkin boʻlsin.',
      ],
      example:
        'Bulut provayderidagi «mintaqa» odatda yaqin joylashgan bir nechta alohida bino boʻlib, xususiy optika bilan bogʻlangan — bittasidagi yongʻin xizmatni toʻxtatmasligi uchun.',
      terms: [
        { t: 'Yuk muvozanatlagich', d: 'Soʻrovlarni serverlar guruhi boʻylab taqsimlovchi qurilma.' },
        { t: 'Holat tekshiruvi', d: 'Server ishga yaroqliligini hal qiladigan davriy soʻrov.' },
        { t: 'Foydalanish zonasi', d: 'Mintaqa ichidagi mustaqil nosozlik domeni.' },
      ],
      takeaway: 'Maʼlumot markazlari zaxiralash atrofida quriladi: yoʻllar, serverlar, quvvat va binolar takrorlanadi.',
    },
    submarine: {
      title: 'Okean osti kabellari',
      tagline: 'Fizik internet okean tubida yotadi.',
      simple: [
        'Qitʼalar dengiz tubida yotgan kabellar bilan bogʻlangan. Har birida odam sochidan ingichka bir nechta shisha tola bor va ular boʻylab yorugʻlik impulslari yuradi.',
        'Yorugʻlik masofa bilan susayadi, shuning uchun kabelga oʻrnatilgan kuchaytirgichlar har 50–100 kilometrda signalni kuchaytiradi va quvvatni yuqori kuchlanish bilan kabelning oʻzidan oladi.',
      ],
      technical: [
        'Zamonaviy tizim bir juft tolada koʻplab toʻlqin uzunligidan foydalanib sekundiga oʻnlab terabit uzatadi. Kabellar qirgʻoq stansiyalarida quruqlikka chiqadi va u yerdan trafik maʼlumot markazlari hamda almashuv nuqtalariga boradi.',
        'Shishada yorugʻlik taxminan 200 000 km/s tezlikda yuradi. Shu sababli 6000 km lik Atlantika oʻtishi uskuna kechikishisiz ham bir tomonga qariyb 30 millisoniya turadi — buni hech qanday oʻtkazuvchanlik bartaraf eta olmaydi.',
      ],
      example:
        'Kabel shikastlanishlari muntazam yuz beradi — langarlar, baliqchilik anjomlari, zilzilalar — va ularni maxsus kemalar tuzatadi. Tarmoqlar omon qoladi, chunki trafik boshqa kabellarga oʻtadi.',
      terms: [
        { t: 'Kuchaytirgich', d: 'Kabeldagi susaygan signalni tiklaydigan optik kuchaytirgich.' },
        { t: 'Qirgʻoq stansiyasi', d: 'Okean osti kabeli quruqlikdagi tarmoqlar bilan tutashadigan sohil obyekti.' },
        { t: 'Tolalar jufti', d: 'Ikkita tola — har bir uzatish yoʻnalishi uchun bittadan.' },
      ],
      takeaway: 'Qitʼalararo trafikning deyarli hammasi okean osti optikasi orqali oʻtadi va masofa haqiqiy millisoniyalarga tushadi.',
    },
    global: {
      title: 'Umumiy manzara',
      tagline: 'Barcha darajalarni birlashtiramiz.',
      simple: [
        'Endi butun zanjir yigʻiladi. Qurilma router bilan Wi-Fi orqali gaplashadi. Router provayder bilan IP tilida. Provayder almashuv nuqtalarida trafikni boshqa tarmoqlarga uzatadi, ular esa uni maʼlumot markazlari va keshlarga, baʼzan okean osti kabellari orqali yetkazadi.',
        'Har bir qadamda nimadir qoʻshiladi yoki olib tashlanadi: kadr, manzil almashtirish, shifrlash qatlami, marshrut haqidagi qaror.',
      ],
      technical: [
        'Bularning hammasi jahon miqyosida darajalar va delegatsiya tufayli ishlaydi. Darajalar fizik muhitni har oʻtishda ilovaga sezdirmasdan almashtirish imkonini beradi. Delegatsiya esa hech kimga global bilim kerak emasligini anglatadi: routerlar prefikslarni, rezolverlar kimdan soʻrashni, tarmoqlar oʻz qoʻshnilarini biladi.',
        'Va tizim haqiqatan markazlashmagan: birorta tashkilot uni butunligicha koʻra ham, boshqara ham olmaydi. Siz koʻrayotgan uygʻunlik hamma bir xil protokollarga amal qilishidan oʻz-oʻzidan kelib chiqadi.',
      ],
      example:
        'Sahifa yuklanishi lokal keshga tushish, xotiradan olingan DNS javobi va oldingi tashrifdan tiklangan TLS sessiyasi bilan cheklanib, asosiy serverni umuman bezovta qilmasligi mumkin.',
      terms: [
        { t: 'Darajalar', d: 'Har bir protokol bitta vazifani hal qiladi va boshqalarga taʼsir qilmasdan almashtiriladi.' },
        { t: 'Delegatsiya', d: 'Vakolatlarni shunday taqsimlash-ki, hech kimga toʻliq bilim kerak boʻlmasin.' },
        { t: 'Markazlashmaganlik', d: 'Butun tizim ustidan yagona nazorat nuqtasi yoʻqligi.' },
      ],
      takeaway: 'Internet kimdir uni boshqargani uchun emas, darajalar va delegatsiya tufayli masshtablanadi.',
    },
  },
  glossary: {
    ip: { term: 'IP', short: 'Paketlar internetdagi istalgan qurilmani topishiga imkon beruvchi manzillash tizimi.', full: 'Internet Protocol. Har bir ulanish nuqtasiga ierarxik manzil beradi va «imkon qadar» yetkazishni taʼminlaydi. IPv4 da manzil 32 bit, IPv6 da 128 bit.' },
    mac: { term: 'MAC manzil', short: 'Bitta kanal doirasida kadrlarni yetkazish uchun apparat identifikatori.', full: 'Oʻn ikkita oʻn oltilik raqamdan iborat 48 bitli kanal darajasi manzili. Faqat lokal kanalda amal qiladi, har bir routerda qayta yoziladi va internetda marshrutlash uchun ishlatilmaydi.' },
    dns: { term: 'DNS', short: 'Nomlarni manzillarga aylantiruvchi maʼlumotnoma.', full: 'Domain Name System. Serverlarning delegatsiyalangan va keshlanadigan ierarxiyasi: ildiz, yuqori darajali domen va avtoritativ serverlar. Yozuv turlari: A, AAAA, CNAME, MX, NS va TXT.' },
    tcp: { term: 'TCP', short: 'Qoʻl siqishli ishonchli va tartibli transport.', full: 'Transmission Control Protocol. Har bir baytni raqamlaydi, qabulni tasdiqlaydi, yoʻqolganini qayta uzatadi hamda oqim va yuklama boshqaruvi bilan joʻnatuvchi tezligini tartibga soladi.' },
    udp: { term: 'UDP', short: 'Minimal transport: portlar va nazorat yigʻindisi, boshqa hech nima.', full: 'User Datagram Protocol. Xabarlarga yoʻnaltirilgan va ulanishsiz, qayta uzatish hamda tartiblash yoʻq. DNS, real vaqt oqimlari va QUIC tomonidan ishlatiladi.' },
    quic: { term: 'QUIC', short: 'Shifrlash oʻrnatilgan, UDP ustidagi zamonaviy transport.', full: 'Ishonchli multipleks oqimlar, oʻrnatilgan TLS 1.3 va ulanish identifikatorlari orqali migratsiyani beradi. HTTP/3 ni tashiydi. Bu shunchaki «shifrlangan UDP» emas.' },
    tls: { term: 'TLS', short: 'HTTPS ni himoyalangan qiladigan shifrlash darajasi.', full: 'Transport Layer Security. Sertifikatlar orqali autentifikatsiya, simmetrik shifrlash orqali maxfiylik va autentifikatsiya belgilari orqali yaxlitlikni taʼminlaydi. Kalitlar kelishiladi, uzatilmaydi.' },
    http: { term: 'HTTP', short: 'Vebning soʻrov va javob protokoli.', full: 'Metodlar, yoʻllar, sarlavhalar va holat kodlarini belgilaydi. HTTP/1.1 — TCP ustidagi matn, HTTP/2 — TCP ustidagi ikkilik multipleks, HTTP/3 — QUIC ustida.' },
    https: { term: 'HTTPS', short: 'TLS tunneli ichidagi HTTP.', full: 'Xuddi shu HTTP semantikasi, ammo shifrlangan va autentifikatsiyalangan. Kelishuvga koʻra TCP ustida 443-port yoki HTTP/3 uchun QUIC ustida.' },
    nat: { term: 'NAT', short: 'Koʻp qurilma bitta ommaviy manzilni bahom koʻrishi uchun manzil almashtirish.', full: 'Network Address Translation. Chiqishda manba manzili va portini almashtiradi, qaytishda translyatsiya jadvali boʻyicha teskari amalni bajaradi. Tarmoqlararo ekran emas va IPv4 uchun majburiy emas.' },
    dhcp: { term: 'DHCP', short: 'Yangi qurilmalar uchun avtomatik tarmoq sozlash.', full: 'Toʻrtta xabardan iborat almashinuv (Discover, Offer, Request, Acknowledge) manzil, quyi tarmoq maskasi, standart shlyuz va DNS serverlarni muddatli ijara sifatida beradi.' },
    bgp: { term: 'BGP', short: 'Mustaqil tarmoqlar kimga yeta olishini qanday eʼlon qilishi.', full: 'Border Gateway Protocol. AS yoʻli va lokal ustunlik kabi atributlarga ega prefikslarni tashuvchi yoʻl vektori protokoli. Siyosat yoʻl uzunligidan oldin qoʻllanadi.' },
    isp: { term: 'ISP', short: 'Sizni internetga ulaydigan kompaniya.', full: 'Internet provayder. Kirish, agregatsiya va yadro tarmoqlarini boshqaradi, chegarasida esa piring va tranzit orqali boshqa tarmoqlar bilan tutashadi.' },
    cdn: { term: 'CDN', short: 'Foydalanuvchilarga yaqin joylashtirilgan keshlar tarmogʻi.', full: 'Content Delivery Network. Chekka maydonchalardan keshlangan nusxalarni beradi, keshga tushmaganda asosiy serverga murojaat qiladi. Foydalanuvchilar DNS yoki anycast orqali yoʻnaltiriladi.' },
    as: { term: 'AS', short: 'Oʻz siyosatiga ega bitta mustaqil boshqariladigan tarmoq.', full: 'Avtonom tizim. AS raqami bilan belgilanadi, ichki tuzilishini yashiradi va boshqa tarmoqlar bilan BGP orqali faqat yetib borish maʼlumotini almashadi.' },
    ixp: { term: 'IXP', short: 'Koʻplab tarmoq tutashadigan umumiy maydoncha.', full: 'Trafik almashuv nuqtasi. Neytral kanal darajasidagi kommutatsiya fabrikasi boʻlib, ishtirokchilar u yerda odatda oʻzaro toʻlovsiz BGP sessiyalarini oʻrnatadi.' },
    router: { term: 'Router', short: 'Paketlarni IP manzillar boʻyicha tarmoqlar orasida uzatadi.', full: 'Eng uzun mos prefiks boʻyicha chiquvchi kanalni tanlaydi, oʻtishlar hisoblagichini kamaytiradi va keyingi tugun uchun kanal darajasidagi kadrni qaytadan yigʻadi.' },
    switch: { term: 'Kommutator', short: 'Lokal tarmoq ichida kadrlarni MAC manzillar boʻyicha uzatadi.', full: 'Trafikni kuzatib qaysi manzil qaysi portda ekanini oʻrganadi, notanish va keng eshittirish kadrlarini barcha portlarga tarqatadi hamda IP darajasidan pastda ishlaydi.' },
    packet: { term: 'Paket', short: 'Manzil maʼlumoti biriktirilgan maʼlumot boʻlagi.', full: 'Qatʼiy aytganda — tarmoq darajasi birligi. Transport darajasida bu segment (TCP) yoki datagramma (UDP), kanal darajasida esa kadr.' },
    port: { term: 'Port', short: 'Maʼlumot qaysi dasturga tegishli ekanini koʻrsatuvchi son.', full: 'TCP yoki UDP sarlavhasidagi 16 bitli qiymat. IP manzil bilan birga soket manzilini hosil qiladi, toʻrtlik esa ulanishni aniq belgilaydi.' },
    socket: { term: 'Soket', short: 'Ilova maʼlumot oʻqiydigan va yozadigan nuqta.', full: 'Ilovani manzil va portga bogʻlaydigan hamda u orqali maʼlumot yuborish va qabul qilishni taʼminlaydigan operatsion tizim obyekti.' },
    server: { term: 'Server', short: 'Soʻrovlarni kutib, ularga javob beradigan mashina.', full: 'Kiruvchi ulanishlarni kutib portni tinglaydigan jarayon. Amalda unga toʻgʻridan-toʻgʻri emas, tarmoqlararo ekranlar, muvozanatlagichlar va keshlar orqali murojaat qilinadi.' },
    datacenter: { term: 'Maʼlumot markazi', short: 'Zaxiralangan quvvat va tarmoqqa ega serverlar binosi.', full: 'Chegara routerlari, tarmoqlararo ekranlar, muvozanatlagichlar, kommutatsiya fabrikasi, hisoblash va saqlash resurslarini oʻz ichiga oladi; odatda mustaqil foydalanish zonalariga boʻlinadi.' },
    cable: { term: 'Okean osti kabeli', short: 'Qitʼalarni bogʻlaydigan, okean tubidagi optik kabel.', full: 'Qitʼalararo trafikning katta qismini tashiydi. Tolalar juftlari va kabel orqali quvvat oladigan optik kuchaytirgichlarni oʻz ichiga oladi, qirgʻoq stansiyalarida quruqlikka chiqadi.' },
  },
  quiz: {
    q1: { q: 'Noutbuk chet eldagi serverga soʻrov yuboradi. Simga chiqadigan kadrda kimning MAC manzili boʻladi?', a: ['Serverning', 'Routeringizning', 'Provayderingizning', 'Hech kimning — MAC ishlatilmaydi'], correct: 1, explain: 'MAC manzillar faqat kanaldagi keyingi qurilmagacha amal qiladi. Kadr routerga manzillanadi va har oʻtishda yangi MAC manzillar bilan qaytadan yigʻiladi.', concept: 'mac-ethernet' },
    q2: { q: 'Routerda 10.0.0.0/8 va 10.1.0.0/16 marshrutlari bor. 10.1.5.5 uchun paket qayerga ketadi?', a: ['/8 marshruti boʻylab', '/16 marshruti boʻylab', 'Ikkalasiga nusxalanadi', 'Tashlab yuboriladi'], correct: 1, explain: 'Eng uzun prefiks qoidasi: mos marshrutlar ichidan eng aniqrogʻi gʻolib boʻladi, /16 esa /8 dan aniqroq.', concept: 'router' },
    q3: { q: 'DHCP qurilmaga IP manzildan tashqari yana nima beradi?', a: ['Faqat manzil', 'Maska, shlyuz va DNS serverlar', 'Domen nomi', 'Shifrlash kaliti'], correct: 1, explain: 'Tasdiq xabari quyi tarmoq maskasi, standart shlyuz va DNS serverlar manzillarini — tarmoqda ishlash uchun zarur hamma narsani oʻz ichiga oladi.', concept: 'dhcp' },
    q4: { q: 'NAT haqida qaysi fikr toʻgʻri?', a: ['NAT — tarmoqlararo ekran', 'NAT har qanday IPv4 ulanish uchun majburiy', 'NAT manzil va portlarni almashtiradi hamda teskari amal uchun jadval yuritadi', 'NAT trafikni shifrlaydi'], correct: 2, explain: 'NAT manzillash bilan shugʻullanadi. Soʻralmagan kiruvchi trafikning bloklanishi — yon taʼsir; ommaviy manzilga ega tugunga NAT kerak emas.', concept: 'nat' },
    q5: { q: 'Nega aksariyat DNS soʻrovlari ildiz serverlargacha yetib bormaydi?', a: ['Ildiz serverlar oʻchirilgan', 'Javoblar va delegatsiyalar bir necha darajada keshlanadi', 'Brauzerlar darrov manzillardan foydalanadi', 'Ildiz serverlar faqat IPv6 ga xizmat qiladi'], correct: 1, explain: 'Brauzer, operatsion tizim va rezolver javoblar hamda delegatsiyalarni TTL davomida keshlaydi, shuning uchun toʻliq aylanish kam uchraydi.', concept: 'dns' },
    q6: { q: 'Tartib raqami 2000 boʻlgan TCP segmenti 500 bayt tashiydi. Qabul qiluvchi qaysi tasdiqni yuboradi?', a: ['2000', '2500', '500', '1500'], correct: 1, explain: 'Tasdiq keyingi kutilayotgan baytni koʻrsatadi: 2000 + 500 = 2500.', concept: 'tcp' },
    q7: { q: 'Nega UDP jonli ovozli qoʻngʻiroq uchun mos keladi?', a: ['U TCP dan ishonchliroq', 'U ovozni shifrlaydi', 'Kechikkan boʻlakni qayta yuborish foydasiz, kutish yoʻqotishdan koʻra koʻproq zarar qiladi', 'U kamroq port ishlatadi'], correct: 2, explain: 'Real vaqtda toʻliqlikdan koʻra yangilik muhim. Yoʻqolgan 20 ms ni kodek yashiradi, qayta uzatish esa ijro etish uchun juda kech keladi.', concept: 'udp' },
    q8: { q: 'HTTP/3 qaysi transportdan foydalanadi?', a: ['TCP', 'UDP ustidagi QUIC', 'Sof IP', 'Toʻgʻridan-toʻgʻri TLS'], correct: 1, explain: 'HTTP/3 — QUIC ustidagi HTTP semantikasi, QUIC esa UDP ustida ishlaydi. TCP ishtirok etmaydi.', concept: 'quic' },
    q9: { q: 'TLS da mijoz simmetrik kalitni qanday oladi?', a: ['Server uni shifrlangan holda yuboradi', 'U sertifikatda yozilgan', 'Ikkala tomon uni kalit almashinuvidan hisoblaydi, u uzatilmaydi', 'U har bir sayt uchun oʻzgarmas'], correct: 2, explain: 'Kalit almashinuvi ikkala tomonga bir xil sirni mustaqil hisoblash imkonini beradi. Tinglovchi faqat ochiq qismlarni koʻradi.', concept: 'tls' },
    q10: { q: '/26 tarmogʻida nechta yaroqli tugun manzili bor?', a: ['64', '62', '26', '32'], correct: 1, explain: 'Oltita tugun biti 64 manzil beradi; tarmoq va keng eshittirish manzillari band, 62 tasi qoladi.', concept: 'subnet' },
    q11: { q: 'BGP bitta prefiksga ikkita marshrutdan birini tanlayapti. Avval nima hisobga olinadi?', a: ['Eng qisqa fizik masofa', 'Lokal ustunlik (siyosat)', 'Eng tez kanal', 'Tasodifiy tanlov'], correct: 1, explain: 'Lokal ustunlik — biznes munosabatlarini aks ettiruvchi siyosat qiymati — AS yoʻli uzunligidan oldin baholanadi. Geografiya umuman hisobga olinmaydi.', concept: 'bgp' },
    q12: { q: 'CDN chekka tugunida keshga tushmaslik nima degani?', a: ['Foydalanuvchi tarmoqda emas', 'Tugunda yangi nusxa yoʻq va u asosiy serverga murojaat qiladi', 'DNS ishlamadi', 'Sertifikat muddati tugadi'], correct: 1, explain: 'Keshga tushmaganda tugun obyektni asosiy serverdan (koʻpincha oraliq qatlam orqali) oladi, TTL ga muvofiq saqlaydi va mijozga beradi.', concept: 'cdn' },
    q13: { q: 'Bitta TCP ulanishini nima aniq belgilaydi?', a: ['Faqat qabul qiluvchi porti', 'Faqat manba manzili', 'Manba manzili va porti hamda qabul qiluvchi manzili va porti', 'Tartib raqami'], correct: 2, explain: 'Toʻrtta qiymat toʻplami. Aynan shuning uchun serverning bitta porti minglab bir vaqtli mijozga xizmat qiladi.', concept: 'ports' },
    q14: { q: '6000 km lik okean osti kabelida yorugʻlik bir tomonga taxminan qancha vaqt yuradi?', a: ['0,02 ms', '3 ms', '30 ms', '300 ms'], correct: 2, explain: 'Optik tolada yorugʻlik taxminan 200 000 km/s tezlikda yuradi, shuning uchun 6000 km bir tomonga qariyb 30 ms oladi — foydalanuvchiga yaqin keshlar aynan shuning uchun paydo boʻlgan.', concept: 'submarine' },
    q15: { q: 'Avtonom tizim boshqa tarmoqlarga nimani koʻrsatadi?', a: ['Butun ichki topologiyasini', 'Faqat oʻz prefikslariga yetib borish maʼlumotini', 'Mijozlar roʻyxatini', 'Kabel sxemasini'], correct: 1, explain: 'Ichki tuzilma yopiq qoladi. Faqat prefikslar va yoʻl atributlari eʼlon qilinadi — bu internetga masshtablanish imkonini beradi.', concept: 'as' },
    q16: { q: 'Kommutator qabul qiluvchisining MAC manzili notanish boʻlgan kadr bilan nima qiladi?', a: ['Tashlab yuboradi', 'Routerga yuboradi', 'Qolgan barcha portlarga tarqatadi', 'Xato qaytaradi'], correct: 2, explain: 'Tarqatish yetkazishni kafolatlaydi, javob esa kommutatorga bu manzil qaysi portda ekanini oʻrgatadi.', concept: 'switch' },
  },
  journey: {
    request: {
      title: 'Brauzer soʻrov tuzadi',
      what: 'Siz Enter bosdingiz. Brauzer HTTP soʻrovini yigʻadi: GET metodi, yoʻl va nimani qabul qila olishini bildiruvchi sarlavhalar.',
      why: 'Hali hech narsa kompyuteringizdan chiqmadi. Operatsion tizimdan yuborish soʻralmaguncha soʻrov shunchaki xotiradagi baytlar boʻlib qoladi.',
    },
    dns: {
      title: 'DNS nomni manzilga aylantiradi',
      what: 'Brauzer rezolverdan host nomi ortidagi manzilni soʻraydi. Odatda javob keshdan millisoniyalarda keladi.',
      why: 'Paketlarni faqat raqamlarga manzillash mumkin. Bu qadamsiz yuboradigan joyning oʻzi yoʻq.',
    },
    connect: {
      title: 'Ulanish oʻrnatiladi va shifrlanadi',
      what: 'TCP uchta xabardan iborat qoʻl siqishni bajaradi, soʻng TLS serverning haqiqiyligini isbotlaydi va ikkala tomon shifrlash kalitlarini hosil qiladi.',
      why: 'Aynan shu keyingi almashinuvni ishonchli va maxfiy qiladi. Shundan soʻng vositachilar faqat shifrlangan matnni koʻradi.',
    },
    frame: {
      title: 'Paket lokal kanal uchun oʻraladi',
      what: 'Shifrlangan soʻrov TCP segmentiga, soʻng IP paketiga, soʻng routeringizning apparat manziliga yoʻnaltirilgan Wi-Fi kadriga joylanadi.',
      why: 'Har bir daraja faqat keyingi qurilmaga kerak boʻlgan narsani qoʻshadi. Kanal darajasiga serverga emas, routerga yetish kifoya.',
    },
    route: {
      title: 'Router yoʻnalishni tanlaydi',
      what: 'Router manzilni oʻz jadvali bilan solishtiradi, lokal moslik topmaydi va provayder tomon standart marshrut boʻylab yuboradi.',
      why: 'Routerlar alohida manzillarni emas, prefikslarni saqlaydi. Bitta standart yozuv butun qolgan internetni qamrab oladi.',
    },
    nat: {
      title: 'Manzillar almashtiriladi',
      what: 'Xususiy manba manzili va porti xonadonning ommaviy manzili hamda boʻsh portiga almashtiriladi. Javobni qaytarish uchun moslik saqlanadi.',
      why: 'Koʻplab qurilma bitta ommaviy manzilni bahom koʻradi. Jadvalsiz router javob qaysi qurilmaga tegishli ekanini bilmasdi.',
    },
    isp: {
      title: 'Provayder orqali va undan naridan',
      what: 'Paket provayderingizning kirish, agregatsiya va yadro tarmoqlaridan oʻtadi, keyin boshqa tarmoqlarga — birma-bir routerlar orqali.',
      why: 'Har oʻtishda kanal manzillari qayta yoziladi va oʻtishlar hisoblagichi kamayadi. Yoʻlni geografiya emas, siyosat tanlaydi.',
    },
    edge: {
      title: 'Yaqindagi nusxa javob berishi mumkin',
      what: 'Ommabop kontent uchun safar erta tugaydi: mintaqangizdagi CDN chekka tuguni okean oshib oʻtish oʻrniga keshlangan nusxani beradi.',
      why: 'Masofa hech qanday oʻtkazuvchanlik qaytara olmaydigan millisoniyalarga tushadi, shuning uchun kontent foydalanuvchilarga yaqin nusxalanadi.',
    },
    server: {
      title: 'Server javob beradi',
      what: 'Tarmoqlararo ekran va muvozanatlagich ortida server soʻrovni deshifrlaydi, ilovani ishga tushiradi va holat kodi bilan tarkibni qaytaradi.',
      why: 'Muvozanatlagichlar koʻplab bir xil serverni bittadek koʻrsatadi va nosozlarini hech kim sezmasdan chiqarib tashlaydi.',
    },
    render: {
      title: 'Javob qaytadi va chiziladi',
      what: 'Javob yoʻlni qaytadan bosib oʻtadi — koʻpincha aynan oʻshasi emas — NAT teskari amalga oshiriladi, TLS deshifrlanadi, brauzer esa sahifani tahlil qilib chizadi.',
      why: 'Qaytish yoʻllari koʻpincha nosimmetrik. Muhimi — ikkala uch manzillar, portlar va kalitlar boʻyicha kelishgan boʻlishi.',
    },
  },
  viz: {
    dnsTitle: 'Nomni aniqlash',
    dnsLead: 'Soʻrov ierarxiyani qanday aylanib chiqishini koʻring, keyin uni takrorlab kesh ishini kuzating.',
    dnsQuery: 'Soʻrov',
    dnsAnswer: 'Javob',
    dnsCached: 'Javob keshdan',
    dnsFlush: 'Keshni tozalash',
    dnsResolve: 'Aniqlash',
    dnsStub: 'Qurilmangiz',
    dnsResolver: 'Rezolver',
    dnsRoot: 'Ildiz server',
    dnsTld: 'Yuqori darajali domen serveri',
    dnsAuth: 'Avtoritativ server',
    tcpTitle: 'Ulanish oʻrnatish',
    tcpLead: 'Qoʻl siqishni qadamma-qadam bajaring, maʼlumot yuboring va paketni yoʻqotib qayta uzatishni koʻring.',
    tcpClient: 'Mijoz',
    tcpServer: 'Server',
    tcpDropNext: 'Keyingi paketni yoʻqotish',
    tcpState: 'Ulanish holati',
    tcpSend: 'Keyingi segmentni yuborish',
    tlsTitle: 'Himoyalangan kanal yaratish',
    tlsLead: 'Qoʻl siqishning har bir qadami va u nima beradi.',
    tlsProps: 'Erishilgan kafolatlar',
    tlsAuth: 'Autentifikatsiya',
    tlsConf: 'Maxfiylik',
    tlsInt: 'Yaxlitlik',
    httpTitle: 'Soʻrov yuborish',
    httpLead: 'Metod va yoʻlni tanlang, soʻng almashinuvni koʻrib chiqing.',
    httpMethod: 'Metod',
    httpPath: 'Yoʻl',
    httpSend: 'Soʻrov yuborish',
    httpRequest: 'Soʻrov',
    httpResponse: 'Javob',
    natTitle: 'Manzilni almashtirish',
    natLead: 'Bir nechta qurilmadan trafik yuboring va translyatsiya jadvali toʻlishini kuzating.',
    natPrivate: 'Xususiy tomon',
    natPublic: 'Ommaviy tomon',
    natTable: 'Translyatsiya jadvali',
    natSend: 'Yuborish',
    natInbound: 'Soʻralmagan kiruvchi paket',
    subnetTitle: 'Tarmoqni boʻlish',
    subnetLead: 'Prefiks chegarasini suring va diapazon qanday oʻzgarishini koʻring.',
    subnetNetwork: 'Tarmoq manzili',
    subnetBroadcast: 'Keng eshittirish manzili',
    subnetMask: 'Quyi tarmoq maskasi',
    subnetHosts: 'Yaroqli manzillar',
    subnetRange: 'Tugunlar diapazoni',
    subnetNetBits: 'tarmoq biti',
    subnetHostBits: 'tugun biti',
    routingTitle: 'Marshrut tanlash',
    routingLead: 'Manzilni kiriting va qaysi yozuv gʻolib boʻlishini koʻring.',
    routingDest: 'Manzil',
    routingTable: 'Marshrutlash jadvali',
    routingPrefix: 'Prefiks',
    routingNextHop: 'Keyingi tugun',
    routingSelected: 'Tanlandi',
    routingMatches: 'moslik',
    routingWinner: 'Eng aniq moslik gʻolib',
    routingNoRoute: 'Marshrut yoʻq — paket tashlab yuboriladi.',
    bgpTitle: 'Ikki eʼlonni solishtirish',
    bgpLead: 'Qoʻshnilar bilan munosabatni oʻzgartiring va qaysi yoʻl oʻrnatilishini koʻring.',
    bgpVia: 'Kimdan olingan',
    bgpPath: 'AS yoʻli',
    bgpPref: 'Lokal ustunlik',
    bgpCustomer: 'Mijoz',
    bgpPeer: 'Pir',
    bgpProvider: 'Tranzit provayder',
    bgpChosen: 'Oʻrnatilgan marshrut',
    bgpReasonPref: 'Yuqoriroq lokal ustunlik gʻolib — siyosat yoʻl uzunligidan muhimroq.',
    bgpReasonPath: 'Ustunliklar teng, shuning uchun qisqaroq AS yoʻli gʻolib.',
    cdnTitle: 'Chekka tugundan berish',
    cdnLead: 'Bitta obyektni bir mintaqadan ikki marta soʻrang va solishtiring.',
    cdnUser: 'Foydalanuvchi:',
    cdnEdge: 'Chekka kesh',
    cdnOrigin: 'Asosiy server',
    cdnHit: 'Keshga tushdi',
    cdnMiss: 'Keshda yoʻq — asosiy serverdan olinmoqda',
    cdnRequest: 'Soʻrash',
    cdnLatency: 'Aylanma kechikish',
    packetTitle: 'Paketni ochish',
    packetLead: 'Qatlamlarni qoʻshing va oling, har birining hissasini koʻring.',
    packetAdd: 'Keyingi qatlamni qoʻshish',
    packetRemove: 'Tashqi qatlamni olish',
    packetPayload: 'Foydali yuk',
    dhcpTitle: 'Sozlamalarni olish',
    dhcpLead: 'Qurilma ulanayotganda almashadigan toʻrtta xabarni bosqichma-bosqich koʻring.',
    dhcpConfig: 'Qurilma sozlamalari',
    dhcpNone: 'hali sozlanmagan',
    ipTitle: 'Manzilni oʻrganish',
    ipLead: 'Tuzilishi va turini koʻrish uchun manzilni kiriting.',
    ipAddress: 'IP manzil',
    ipCategory: 'Turi',
    ipBinary: 'Ikkilik koʻrinishda',
    ipPrivate: 'Xususiy (lokal tarmoqlarda ishlatiladi)',
    ipPublic: 'Ommaviy (global marshrutlanadi)',
    ipLoopback: 'Loopback (shu mashina)',
    ipLinkLocal: 'Link-local (avtomatik berilgan)',
    ipMulticast: 'Multicast (guruhga yetkazish)',
    ipInvalid: 'Notoʻgʻri IPv4 manzil',
    portsTitle: 'Keng maʼlum portlar',
    portsLead: 'Bular kelishuv, kafolat emas: istalgan dastur istalgan portni tinglashi mumkin.',
    portsPort: 'Port',
    portsService: 'Xizmat',
    portsNote: 'Izohlar',
    frameTitle: 'Kadr yigʻish',
    frameLead: 'Tarmoq interfeysi kanalga aslida nima chiqarishini koʻring.',
    switchTitle: 'Topologiyani oʻrganish',
    switchLead: 'Qurilmalar orasida kadr yuboring va MAC jadvali qanday tuzilishini kuzating.',
    switchTable: 'MAC manzillar jadvali',
    switchPort: 'Port',
    switchFlood: 'Qabul qiluvchi nomaʼlum — barcha portlarga tarqatildi',
    switchDirect: 'Qabul qiluvchi maʼlum — bitta portga yuborildi',
    switchSendFrom: 'Kimdan',
    switchSendTo: 'kimga',
  },
};
