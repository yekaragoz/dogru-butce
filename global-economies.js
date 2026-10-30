// ============================================================================
// KÜRESEL MAKROEKONOMİ & 120 ÜLKE ENFLASYON ANALİZ VERİTABANI (GLOBAL ECONOMIES 120)
// Piyasa Uzmanı Yusuf Efe Karagöz — Ülkeler, Enflasyonlar ve Gelecek Süreç Tahminleri
// ============================================================================

(function () {
  // 120 Ülke: [Ülke Adı, Bayrak, Bölge, Para Birimi, Yıllık Enflasyon (%), Politika Faizi (%), Süreç Yönü ('falling' | 'stable' | 'rising'), Ekonomik Profil, İleride Beklenen Süreç Analizi]
  const RAW_120_COUNTRIES = [
    // AVRASYA & TÜRK DÜNYASI (8)
    ['Türkiye', '🇹🇷', 'Avrasya & Türk Dünyası', 'TRY (₺)', 38.2, 45.0, 'falling', 'G20 Üyesi • Sanayi, İhracat, Turizm ve Hizmet Ekonomisi', 'Sıkı para politikası, kredi büyüme sınırları ve baz etkisiyle enflasyonda kademeli dezenflasyon (düşüş) süreci bekleniyor. Yıl sonuna doğru politika faizinde ölçülü indirim döngüsü ve TL varlıklarda reel getiri dengesi öngörülüyor.'],
    ['Azerbaycan', '🇦🇿', 'Avrasya & Türk Dünyası', 'AZN (₼)', 2.4, 7.25, 'stable', 'Enerji (Petrol & Doğalgaz) İhracatçısı • Güçlü Rezerv', 'Manat\'ın Dolar karşısındaki istikrarlı çıpası ve enerji gelirleri sayesinde enflasyonun %2-%3,5 bandında düşük ve sabit kalması bekleniyor.'],
    ['Kazakistan', '🇰🇿', 'Avrasya & Türk Dünyası', 'KZT (₸)', 8.4, 14.25, 'falling', 'Orta Asya\'nın En Büyük Ekonomisi • Petrol, Uranyum, Madencilik', 'Merkez bankasının sıkı duruşuyla enflasyonun tek hanede kalıcılaşması ve %6-%7 bandına doğru gerilemesi bekleniyor.'],
    ['Özbekistan', '🇺🇿', 'Avrasya & Türk Dünyası', 'UZS', 9.6, 13.5, 'falling', 'Hızlı Büyüyen Sanayi, Altın Üretimi, Tekstil ve Tarım', 'Enerji tarifesi reformlarının etkisi sindirildikçe enflasyonda kademeli düşüş ve %5 üzerinde güçlü ekonomik büyüme süreci bekleniyor.'],
    ['Türkmenistan', '🇹🇲', 'Avrasya & Türk Dünyası', 'TMT', 5.8, 5.0, 'stable', 'Doğalgaz Rezerv Devi & Kamu Ağırlıklı Ekonomi', 'Doğalgaz ihracatı ve devlet fiyat kontrolleriyle enflasyonun ılımlı ve yatay bir süreç izlemesi bekleniyor.'],
    ['Kırgızistan', '🇰🇬', 'Avrasya & Türk Dünyası', 'KGS', 5.2, 9.0, 'stable', 'Altın Madenciliği, Ticaret Geçiş Koridoru ve Tarım', 'Bölgesel ticaret hacmindeki canlılıkla birlikte enflasyonun %5-%6 bandında dengeli seyretmesi bekleniyor.'],
    ['Rusya', '🇷🇺', 'Avrasya & Türk Dünyası', 'RUB (₽)', 8.9, 21.0, 'rising', 'Enerji, Savunma Sanayii, Değerli Madenler ve Tahıl Devi', 'Yüksek savunma harcamaları, işgücü açığı ve yaptırımlar nedeniyle enflasyonist baskıların yüksek kalması; merkez bankasının çok sıkı faiz politikasını sürdürmesi bekleniyor.'],
    ['Ukrayna', '🇺🇦', 'Avrasya & Türk Dünyası', 'UAH (₴)', 9.5, 13.5, 'rising', 'Tarım, Demir-Çelik ve Yeniden İnşa Ekonomisi', 'Savaş kaynaklı enerji altyapısı maliyetleri ve işgücü kaybı nedeniyle kısa vadede enflasyonist baskıların devam etmesi, uluslararası fon destekleriyle bütçenin dengelenmesi bekleniyor.'],

    // AVRUPA (34)
    ['Almanya', '🇩🇪', 'Avrupa', 'EUR (€)', 2.1, 3.15, 'stable', 'Avrupa\'nın En Büyük Ekonomisi • Otomotiv, Makine, Kimya', 'Enerji maliyetlerinin dengelenmesi ve ECB faiz indirimleriyle enflasyonun %2 hedefinde sabit kalması; sanayi üretiminde ise kademeli toparlanma süreci bekleniyor.'],
    ['Birleşik Krallık (İngiltere)', '🇬🇧', 'Avrupa', 'GBP (£)', 2.5, 4.75, 'falling', 'Küresel Finans Merkezi (Londra) • Hizmet ve Yüksek Teknoloji', 'Hizmet enflasyonundaki katılığın yavaş yavaş çözülmesiyle enflasyonun %2 hedefine yaklaşması ve BoE\'nin kademeli faiz indirimlerine devam etmesi bekleniyor.'],
    ['Fransa', '🇫🇷', 'Avrupa', 'EUR (€)', 1.8, 3.15, 'stable', 'Nükleer Enerji, Havacılık, Lüks Tüketim ve Turizm Devi', 'Nükleer enerji altyapısı sayesinde enerji enflasyonundan en az etkilenen Avrupa ülkelerinden biri olarak %1,8-%2 bandında fiyat istikrarı bekleniyor.'],
    ['İtalya', '🇮🇹', 'Avrupa', 'EUR (€)', 1.4, 3.15, 'stable', 'Tasarım, Otomotiv, Makine İhracatı ve Turizm', 'İç talepteki ılımlı seyirle enflasyonun Euro Bölgesi ortalamasının altında (%1,5 civarında) sabit kalması bekleniyor.'],
    ['İspanya', '🇪🇸', 'Avrupa', 'EUR (€)', 2.4, 3.15, 'stable', 'Turizm Rekorları, Yenilenebilir Enerji ve Hizmet Sektörü', 'Avrupa\'nın en hızlı büyüyen büyük ekonomisi olarak güçlü turizm gelirleriyle %2-%2,5 bandında sağlıklı enflasyon süreci bekleniyor.'],
    ['İsviçre', '🇨🇭', 'Avrupa', 'CHF (₣)', 0.8, 0.5, 'stable', 'Küresel Bankacılık, İlaç Sanayii, Saat ve Güvenli Liman', 'Güçlü İsviçre Frangı ithal enflasyonu tamamen engellediği için dünyada enflasyonun en düşük olduğu (%0,5-%1) ülkelerden biri olarak kalması bekleniyor.'],
    ['Hollanda', '🇳🇱', 'Avrupa', 'EUR (€)', 3.1, 3.15, 'falling', 'Yarı İletken Teknolojisi (ASML), Lojistik (Rotterdam) ve Tarım', 'Kira ve hizmet fiyatlarındaki artışın yavaşlamasıyla enflasyonun %3\'ten %2,2 bandına doğru gerilemesi bekleniyor.'],
    ['İsveç', '🇸🇪', 'Avrupa', 'SEK', 1.6, 2.5, 'stable', 'İleri Teknoloji, Telekomünikasyon ve Yeşil Sanayi', 'Riksbank\'ın faiz indirimleriyle konut piyasasının canlanması ve enflasyonun %2 altında istikrarlı kalması bekleniyor.'],
    ['Norveç', '🇳🇴', 'Avrupa', 'NOK', 2.6, 4.5, 'falling', 'Dünyanın En Büyük Varlık Fonu • Petrol, Doğalgaz ve Denizcilik', 'Kron\'daki dengelenmeyle birlikte enflasyonun %2,5 altına kademeli düşüş göstermesi bekleniyor.'],
    ['Polonya', '🇵🇱', 'Avrupa', 'PLN (zł)', 4.7, 5.75, 'falling', 'Orta Avrupa\'nın Üretim, Yazılım ve Lojistik Üssü', 'Gıda ve enerji sübvansiyonlarının kalkmasıyla geçici yükselen enflasyonun yılın ikinci yarısında tekrar %3,5 seviyesine inmesi bekleniyor.'],
    ['Belçika', '🇧🇪', 'Avrupa', 'EUR (€)', 3.2, 3.15, 'falling', 'AB Yönetim Merkezi, Kimya, İlaç ve Elmas Ticareti', 'Otomatik maaş endekslemesi etkisinin azalmasıyla enflasyonda %2,3 seviyesine doğru yumuşama bekleniyor.'],
    ['Avusturya', '🇦🇹', 'Avrupa', 'EUR (€)', 2.0, 3.15, 'stable', 'Finans, Alpler Turizmi ve Hassas Mühendislik', 'Hizmet maliyetlerinin dengelenmesiyle %2 civarında istikrarlı bir enflasyon süreci bekleniyor.'],
    ['İrlanda', '🇮🇪', 'Avrupa', 'EUR (€)', 1.5, 3.15, 'stable', 'Küresel Teknoloji ve İlaç Devlerinin Avrupa Merkezi', 'Yüksek bütçe fazlası ve teknoloji ihracatıyla %1,5-%2 bandında düşük enflasyonun sürmesi bekleniyor.'],
    ['Danimarka', '🇩🇰', 'Avrupa', 'DKK', 1.8, 2.75, 'stable', 'Biyoteknoloji (Novo Nordisk), Deniz Taşımacılığı ve Rüzgar Enerjisi', 'İlaç ihracatı kaynaklı güçlü büyüme ve %2 altında tam fiyat istikrarı bekleniyor.'],
    ['Finlandiya', '🇫🇮', 'Avrupa', 'EUR (€)', 1.1, 3.15, 'stable', 'Yüksek Teknoloji, Orman Ürünleri ve Temiz Enerji', 'Avrupa\'nın en düşük enflasyon oranlarından birine sahip olarak %1-%1,5 bandında yatay süreç bekleniyor.'],
    ['Portekiz', '🇵🇹', 'Avrupa', 'EUR (€)', 2.3, 3.15, 'stable', 'Turizm, Dijital Göçebe Merkezi ve Yenilenebilir Enerji', 'Turizm gelirleri ve AB fonlarıyla %2 civarında dengeli enflasyon ve ılımlı büyüme bekleniyor.'],
    ['Yunanistan', '🇬🇷', 'Avrupa', 'EUR (€)', 2.7, 3.15, 'falling', 'Denizcilik, Turizm ve Yatırım Derecesi Kazanmış Ekonomi', 'Kamu borcu/GSYİH oranının hızla düşmesi ve turizm rekorlarıyla enflasyonun %2,2 seviyesine gerilemesi bekleniyor.'],
    ['Çekya', '🇨🇿', 'Avrupa', 'CZK', 2.8, 4.0, 'stable', 'Otomotiv ve İleri İmalat Sanayii', 'Merkez bankasının erken önlemleri sayesinde enflasyonun %2-%3 hedef bandında kalması bekleniyor.'],
    ['Romanya', '🇷🇴', 'Avrupa', 'RON', 5.1, 6.5, 'falling', 'Doğu Avrupa\'nın Bilişim, Otomotiv ve Tarım Gücü', 'Kamu harcamalarının disipline edilmesiyle enflasyonun %5\'ten %3,8\'e doğru kademeli düşmesi bekleniyor.'],
    ['Macaristan', '🇭🇺', 'Avrupa', 'HUF', 3.7, 6.5, 'falling', 'Batarya Üretimi ve Otomotiv Yatırımları Merkezi', 'Geçmişteki yüksek gıda enflasyonu şokunun ardından %3,5 civarında dengelenme süreci bekleniyor.'],
    ['Bulgaristan', '🇧🇬', 'Avrupa', 'BGN', 2.4, 3.15, 'stable', 'Euro Bölgesi Entegrasyonu, Bilişim ve Turizm', 'Euro\'ya geçiş kriterleri doğrultusunda %2,5 altında sıkı fiyat istikrarı bekleniyor.'],
    ['Hırvatistan', '🇭🇷', 'Avrupa', 'EUR (€)', 2.9, 3.15, 'falling', 'Adriyatik Turizmi ve Euro Bölgesi Yeni Üyesi', 'Turizm sezonu kaynaklı hizmet enflasyonunun yavaşlayarak %2,3\'e inmesi bekleniyor.'],
    ['Slovakya', '🇸🇰', 'Avrupa', 'EUR (€)', 3.1, 3.15, 'falling', 'Kişi Başına En Yüksek Otomobil Üreticisi', 'Sanayi ihracatındaki toparlanmayla enflasyonun %2,5 altına gerilemesi bekleniyor.'],
    ['Slovenya', '🇸🇮', 'Avrupa', 'EUR (€)', 1.9, 3.15, 'stable', 'Yüksek Katma Değerli İmalat, İlaç ve Lojistik', '%2 hedefinde tam fiyat istikrarı ve dengeli büyüme bekleniyor.'],
    ['Sırbistan', '🇷🇸', 'Avrupa', 'RSD', 4.3, 5.75, 'falling', 'Balkanlar\'ın Yabancı Yatırım ve Teknoloji Merkezi', 'Altyapı yatırımlarıyla %4 üzerinde büyüme ve enflasyonun %3,5\'e gerilemesi bekleniyor.'],
    ['İzlanda', '🇮🇸', 'Avrupa', 'ISK', 4.8, 8.5, 'falling', 'Jeotermal Enerji, Balıkçılık ve Turizm', 'Konut maliyetlerindeki artışın durmasıyla enflasyonda hızlı düşüş ve faiz indirim süreci bekleniyor.'],
    ['Lüksemburg', '🇱🇺', 'Avrupa', 'EUR (€)', 1.7, 3.15, 'stable', 'Dünyanın Kişi Başına En Zengin Finans ve Fon Merkezi', 'Küresel yatırım fonu hacimlerindeki artışla birlikte %1,5-%2 bandında düşük enflasyon bekleniyor.'],
    ['Litvanya', '🇱🇹', 'Avrupa', 'EUR (€)', 1.4, 3.15, 'stable', 'Fintech (Finansal Teknoloji) ve Lazer Teknolojisi Merkezi', 'Baltık bölgesinde örnek bir dezenflasyon başarısıyla %1,5-%2 bandında yatay süreç bekleniyor.'],
    ['Letonya', '🇱🇻', 'Avrupa', 'EUR (€)', 1.6, 3.15, 'stable', 'Lojistik, Kereste ve Bilişim Hizmetleri', 'Enerji fiyatlarının normalleşmesiyle %2 altında istikrarlı seyir bekleniyor.'],
    ['Estonya', '🇪🇪', 'Avrupa', 'EUR (€)', 3.8, 3.15, 'falling', 'Dijital Devlet ve Unicorn Girişimler Merkezi', 'KDV artışlarının baz etkisinden çıkmasıyla enflasyonun %2,5 seviyesine düşmesi bekleniyor.'],
    ['Arnavutluk', '🇦🇱', 'Avrupa', 'ALL', 2.2, 2.75, 'stable', 'Hızla Büyüyen Akdeniz Turizmi ve Hidroelektrik Enerji', 'Güçlü Lek para birimi ve turizm döviz girişiyle %2-%2,5 bandında düşük enflasyon bekleniyor.'],
    ['Kuzey Makedonya', '🇲🇰', 'Avrupa', 'MKD', 3.4, 5.5, 'falling', 'Otomotiv Yan Sanayii ve Tarım', 'İthal girdi maliyetlerinin düşmesiyle enflasyonun %2,8\'e gerilemesi bekleniyor.'],
    ['Bosna-Hersek', '🇧🇦', 'Avrupa', 'BAM', 2.1, 3.15, 'stable', 'Euro Sabit Kur Rejimi (Currency Board) • Metal ve Enerji', 'Euro çıpası sayesinde enflasyonun Avrupa Birliği ortalamasında (%2 civarı) sabit kalması bekleniyor.'],
    ['Gürcistan', '🇬🇪', 'Avrupa', 'GEL (₾)', 1.5, 8.0, 'stable', 'Kafkasya Ticaret, Lojistik ve Turizm Koridoru', 'Sıkı para politikası sayesinde enflasyonun %2-%3 hedefinin bile altında istikrarlı kalması bekleniyor.'],

    // AMERİKA KITASI (22)
    ['Amerika Birleşik Devletleri (ABD)', '🇺🇸', 'Amerika', 'USD ($)', 2.6, 4.5, 'stable', 'Dünyanın 1 Numaralı Ekonomisi • Yapay Zeka, Teknoloji, Finans', 'FED\'in yumuşak iniş (soft landing) stratejisiyle resesyona girmeden enflasyonun %2,2-%2,5 bandında dengelenmesi; yapay zeka yatırımlarının verimlilik artışı sağlaması bekleniyor.'],
    ['Kanada', '🇨🇦', 'Amerika', 'CAD (C$)', 1.9, 3.25, 'stable', 'G7 Üyesi • Petrol, Madencilik, Finans ve Teknoloji', 'Enflasyonun %2 hedefine tam ulaşmasıyla Kanada Merkez Bankası\'nın büyümeyi destekleyici düşük faiz ortamını koruması bekleniyor.'],
    ['Brezilya', '🇧🇷', 'Amerika', 'BRL (R$)', 4.8, 12.25, 'rising', 'Güney Amerika\'nın En Büyük Ekonomisi • Tarım, Petrol, Maden', 'Kamu harcamalarındaki artış nedeniyle kısa vadede enflasyonist baskıların %4,5-%5 bandında kalması ve merkez bankasının yüksek reel faiz uygulaması bekleniyor.'],
    ['Meksika', '🇲🇽', 'Amerika', 'MXN ($)', 4.5, 10.0, 'falling', 'ABD\'nin En Büyük Üretim Ortağı (Nearshoring Merkezi)', 'ABD\'ye yakın üretim (nearshoring) yatırımlarıyla sanayi büyümesi ve enflasyonun %3,8\'e doğru kademeli düşmesi bekleniyor.'],
    ['Arjantin', '🇦🇷', 'Amerika', 'ARS ($)', 118.0, 32.0, 'falling', 'Tarım, Lityum, Enerji • Radikal Şok Terapisi ve Bütçe Fazlası', 'Para basımının durdurulması ve sıfır bütçe açığı politikasıyla aylık enflasyonun hızla düştüğü sert bir dezenflasyon süreci yaşanıyor; yıllık enflasyonun üç haneden hızla iki haneye inmesi bekleniyor.'],
    ['Şili', '🇨🇱', 'Amerika', 'CLP', 4.2, 5.0, 'falling', 'Dünyanın 1 Numaralı Bakır ve Lityum Üreticisi', 'Yeşil enerji dönüşümüyle bakır talebinin artması ve enflasyonun %3,2 hedefine gerilemesi bekleniyor.'],
    ['Kolombiya', '🇨🇴', 'Amerika', 'COP', 5.4, 9.5, 'falling', 'Petrol, Kahve, Kömür ve Hizmet Ekonomisi', 'Sıkı para politikasının etkisiyle enflasyonun %9\'lardan %4\'e doğru istikrarlı düşüşünü sürdürmesi bekleniyor.'],
    ['Peru', '🇵🇪', 'Amerika', 'PEN', 2.1, 5.0, 'stable', 'Altın, Bakır, Gümüş Madenciliği ve Tarım', 'Latin Amerika\'nın en güçlü para birimi istikrarlarından birine sahip olarak enflasyonun %2 civarında sabit kalması bekleniyor.'],
    ['Uruguay', '🇺🇾', 'Amerika', 'UYU', 5.1, 8.5, 'stable', 'Güney Amerika\'nın Finans, Yazılım ve Tarım İhracatçısı', 'Enflasyonun %4,5-%5 hedef aralığında istikrarlı bir bantta kalması bekleniyor.'],
    ['Kosta Rika', '🇨🇷', 'Amerika', 'CRC', 0.9, 4.0, 'stable', 'Tıbbi Cihaz İhracatı, Eko-Turizm ve Teknoloji', 'Güçlü yerel para birimi sayesinde %1-%2 aralığında çok düşük enflasyonun devamı bekleniyor.'],
    ['Panama', '🇵🇦', 'Amerika', 'USD ($)', 1.2, 4.5, 'stable', 'Panama Kanalı, Küresel Denizcilik ve Dolarize Finans Merkezi', 'Tam Dolarizasyon nedeniyle enflasyonun ABD\'den bile düşük (%1-%1,5) seviyede sabit kalması bekleniyor.'],
    ['Dominik Cumhuriyeti', '🇩🇴', 'Amerika', 'DOP', 3.3, 6.0, 'stable', 'Karayipler\'in En Hızlı Büyüyen Turizm ve Serbest Bölge Ekonomisi', '%5 büyüme temposu ve %3,5 civarında hedefle uyumlu enflasyon süreci bekleniyor.'],
    ['Guatemala', '🇬🇹', 'Amerika', 'GTQ', 3.1, 4.5, 'stable', 'Orta Amerika\'nın En Büyük Ekonomisi • Tarım ve Tekstil', 'Makroekonomik disiplin sayesinde %3-%3,5 bandında yatay enflasyon bekleniyor.'],
    ['Ekvador', '🇪🇨', 'Amerika', 'USD ($)', 1.7, 4.5, 'stable', 'Resmi Dolar Kullanan Petrol, Muz ve Kakao İhracatçısı', 'Dolarizasyon sayesinde kur enflasyonu yaşanmadığından %1,5-%2 bandında düşük enflasyon bekleniyor.'],
    ['Paraguay', '🇵🇾', 'Amerika', 'PYG', 4.0, 6.0, 'stable', 'Temiz Hidroelektrik Enerji ve Soya/Tarım İhracatçısı', '%4 merkez bankası hedefinde dengeli ve öngörülebilir bir enflasyon süreci bekleniyor.'],
    ['Bolivya', '🇧🇴', 'Amerika', 'BOB', 7.5, 4.5, 'rising', 'Lityum ve Doğalgaz Rezervleri • Döviz Rezervi Sıkıntısı', 'Döviz rezervlerindeki azalma ve ithal maliyetler nedeniyle enflasyonda yukarı yönlü risklerin sürmesi bekleniyor.'],
    ['Venezuela', '🇻🇪', 'Amerika', 'VES', 48.0, 58.0, 'rising', 'Dünyanın En Büyük Petrol Rezervi • Kur Baskısı', 'Hiperenflasyon dönemine göre yavaşlamış olsa da kur dalgalanmaları nedeniyle yüksek enflasyon riskinin devam etmesi bekleniyor.'],
    ['Küba', '🇨🇺', 'Amerika', 'CUP', 28.0, 10.0, 'rising', 'Turizm, Biyoteknoloji ve Ambargo Altındaki Ekonomi', 'Enerji ve gıda arzındaki kısıtlar nedeniyle yüksek fiyat artışlarının sürmesi bekleniyor.'],
    ['Jamaika', '🇯🇲', 'Amerika', 'JMD', 4.9, 6.5, 'falling', 'Turizm, Boksit Madenciliği ve Hizmet Ekonomisi', 'Kamu borcunu azaltma başarısıyla birlikte enflasyonun %4-%5 bandında kalması bekleniyor.'],
    ['Trinidad ve Tobago', '🇹🇹', 'Amerika', 'TTD', 0.8, 3.5, 'stable', 'Karayipler\'in Doğalgaz, LNG ve Petrokimya Merkezi', 'Enerji gelirleri sayesinde %1 civarında çok düşük ve sabit enflasyon bekleniyor.'],
    ['El Salvador', '🇸🇻', 'Amerika', 'USD ($) / BTC', 1.1, 4.5, 'stable', 'ABD Doları ve Bitcoin Yasal Para Birimi • Turizm ve Güvenlik', 'Dolar kullanımı sayesinde enflasyonun %1-%1,5 bandında sabit kalması ve teknoloji/turizm yatırımlarının artması bekleniyor.'],
    ['Honduras', '🇭🇳', 'Amerika', 'HNL', 4.4, 5.75, 'stable', 'Kahve, Tekstil ve İşçi Dövizleri Ekonomisi', '%4-%4,5 bandında ılımlı enflasyon süreci bekleniyor.'],

    // ASYA & PASİFİK (26)
    ['Çin', '🇨🇳', 'Asya & Pasifik', 'CNY (¥)', 0.4, 3.1, 'stable', 'Dünyanın Üretim Fabrikası • Elektrikli Araç, Güneş Enerjisi, Teknoloji', 'İç tüketimdeki zayıflık ve aşırı üretim kapasitesi nedeniyle enflasyonun sıfıra yakın (%0,3-%1) seyretmesi; hükümetin tüketimi canlandırmak için teşvik paketleri açıklaması bekleniyor.'],
    ['Japonya', '🇯🇵', 'Asya & Pasifik', 'JPY (¥)', 2.4, 0.25, 'stable', 'Otomotiv, Robotik, Yarı İletken Ekipmanı ve Küresel Alacaklı', 'Yıllarca süren deflasyondan çıkarak maaş artışlarıyla desteklenen sağlıklı %2 enflasyon sürecine geçti; BoJ\'un faizleri çok yavaş artırması bekleniyor.'],
    ['Hindistan', '🇮🇳', 'Asya & Pasifik', 'INR (₹)', 5.1, 6.5, 'falling', 'Dünyanın En Hızlı Büyüyen Büyük Ekonomisi (%6,8+ Büyüme)', 'Altyapı hamlesi, dijitalleşme ve küresel üretim kaymasıyla yüksek büyüme sürerken, muson yağışlarının gıda fiyatlarını rahatlatmasıyla enflasyonun %4,2\'ye inmesi bekleniyor.'],
    ['Güney Kore', '🇰🇷', 'Asya & Pasifik', 'KRW (₩)', 1.8, 3.0, 'stable', 'Yapay Zeka Bellek Çipleri (HBM), Otomotiv, Gemi İnşa', 'Enflasyonun %2 hedefinin altına inmesiyle faiz indirimleri ve yarı iletken ihracatıyla güçlü dış ticaret fazlası bekleniyor.'],
    ['Avustralya', '🇦🇺', 'Asya & Pasifik', 'AUD (A$)', 2.8, 4.35, 'falling', 'Demir Cevheri, Altın, LNG İhracatçısı ve Finans', 'Konut ve hizmet enflasyonunun soğumasıyla enflasyonun %2,5 hedef bandına girmesi bekleniyor.'],
    ['Singapur', '🇸🇬', 'Asya & Pasifik', 'SGD (S$)', 1.9, 3.4, 'stable', 'Asya\'nın Küresel Finans, Varlık Yönetimi ve Liman Merkezi', 'Güçlü Singapur Doları politikasıyla enflasyonun %1,5-%2 bandında tam istikrar içinde kalması bekleniyor.'],
    ['Endonezya', '🇮🇩', 'Asya & Pasifik', 'IDR (Rp)', 1.8, 6.0, 'stable', 'Güneydoğu Asya\'nın En Büyük Ekonomisi • Nikel ve Batarya Merkezi', 'Gıda fiyatları kontrolüyle enflasyonun %2 civarında sabit kalması ve %5 üzerinde istikrarlı büyüme bekleniyor.'],
    ['Tayvan', '🇹🇼', 'Asya & Pasifik', 'TWD', 2.0, 2.0, 'stable', 'Küresel Mikroçip ve Yapay Zeka Donanımı Kalbi (TSMC)', 'Yapay zeka çip ihracatı patlamasıyla güçlü büyüme ve %2 altında dengeli enflasyon bekleniyor.'],
    ['Malezya', '🇲🇾', 'Asya & Pasifik', 'MYR', 1.9, 3.0, 'stable', 'Yarı İletken Paketleme, Veri Merkezleri, Enerji ve İslami Finans', 'Veri merkezi yatırımlarıyla güçlü büyüme ve %2 civarında ılımlı enflasyon süreci bekleniyor.'],
    ['Tayland', '🇹🇭', 'Asya & Pasifik', 'THB (฿)', 0.9, 2.25, 'stable', 'Turizm, Otomotiv Üretimi ve Gıda İhracatı', 'Turizm gelirlerindeki artışla birlikte %1-%1,5 bandında çok düşük enflasyon bekleniyor.'],
    ['Vietnam', '🇻🇳', 'Asya & Pasifik', 'VND (₫)', 3.6, 4.5, 'stable', 'Elektronik, Tekstil ve Küresel Tedarik Zinciri Yıldızı', '%6\'nın üzerinde yüksek ihracat büyümesi ve %3,5-%4 bandında kontrollü enflasyon bekleniyor.'],
    ['Filipinler', '🇵🇭', 'Asya & Pasifik', 'PHP (₱)', 2.5, 5.75, 'falling', 'Hizmet İhracatı (BPO) ve Genç Nüfuslu Dinamik Ekonomi', 'Pirinç ithalat vergisi indirimleriyle gıda enflasyonunun hızla düşmesi ve %3 altında kalması bekleniyor.'],
    ['Yeni Zelanda', '🇳🇿', 'Asya & Pasifik', 'NZD', 2.2, 4.25, 'stable', 'Süt Ürünleri, Tarım Teknolojisi ve Turizm', 'Enflasyonun %1-%3 hedef bandına dönmesiyle faiz indirimlerinin ekonomiyi canlandırması bekleniyor.'],
    ['Hong Kong', '🇭🇰', 'Asya & Pasifik', 'HKD', 1.6, 4.75, 'stable', 'USD Sabit Kur Rejimi • Küresel Finans ve Ticaret Kapısı', 'USD çıpası ve Çin anakarasıyla entegrasyon sayesinde %1,5-%2 bandında düşük enflasyon bekleniyor.'],
    ['Pakistan', '🇵🇰', 'Asya & Pasifik', 'PKR', 6.9, 13.0, 'falling', 'Tekstil, Tarım • IMF Programı ile Hızlı Dezenflasyon', 'Geçen yıl %30\'ları aşan enflasyon sıkı para politikası ve baz etkisiyle tek haneye indi; istikrar sürecinin devamı bekleniyor.'],
    ['Bangladeş', '🇧🇩', 'Asya & Pasifik', 'BDT', 9.8, 10.0, 'falling', 'Dünyanın 2 Numaralı Hazır Giyim ve Tekstil İhracatçısı', 'Döviz kuru ve tedarik zinciri şoklarının ardından sıkı faiz politikasıyla enflasyonun %7\'ye doğru gerilemesi bekleniyor.'],
    ['Sri Lanka', '🇱🇰', 'Asya & Pasifik', 'LKR', 0.5, 8.25, 'stable', 'Turizm, Çay İhracatı • Kriz Sonrası Güçlü Toparlanma', 'Borç yapılandırması ve turizm patlamasıyla %70 enflasyondan %1 altına inen örnek bir fiyat istikrarı yakalandı.'],
    ['Moğolistan', '🇲🇳', 'Asya & Pasifik', 'MNT', 6.5, 10.0, 'falling', 'Bakır, Kömür ve Nadir Toprak Elementleri İhracatçısı', 'Maden ihracatındaki artışla kurun dengelenmesi ve enflasyonun %6 altına inmesi bekleniyor.'],
    ['Kamboçya', '🇰🇭', 'Asya & Pasifik', 'KHR', 2.1, 4.5, 'stable', 'Tekstil, Turizm ve Yüksek Dolarizasyonlu Ekonomi', 'Yüksek Dolar kullanımı sayesinde %2 civarında düşük enflasyonun sürmesi bekleniyor.'],
    ['Nepal', '🇳🇵', 'Asya & Pasifik', 'NPR', 4.2, 5.0, 'stable', 'Hidroelektrik Enerji, हिमालय Turizmi ve İşçi Dövizleri', 'Hindistan Rupisi çıpası sayesinde Hindistan ile paralel %4-%5 bandında dengeli enflasyon bekleniyor.'],

    // ORTA DOĞU & KÖRFEZ (14)
    ['Suudi Arabistan', '🇸🇦', 'Orta Doğu & Körfez', 'SAR (﷼)', 1.9, 5.0, 'stable', 'Dünyanın En Büyük Petrol İhracatçısı • Vizyon 2030 Yatırımları', 'USD sabit kuru (peg) ve enerji sübvansiyonları sayesinde enflasyonun %2 altında son derece sabit kalması bekleniyor.'],
    ['Birleşik Arap Emirlikleri (BAE)', '🇦🇪', 'Orta Doğu & Körfez', 'AED (د.إ)', 2.1, 4.4, 'stable', 'Küresel Ticaret, Havacılık, Gayrimenkul ve Servet Merkezi', 'Dubai ve Abu Dabi\'ye yönelik sermaye akışı sürerken USD çıpasıyla enflasyonun %2 civarında sabit kalması bekleniyor.'],
    ['Katar', '🇶🇦', 'Orta Doğu & Körfez', 'QAR', 1.3, 4.6, 'stable', 'Dünyanın En Büyük LNG (Sıvılaştırılmış Doğalgaz) İhracatçılarından', 'Kuzey Sahası LNG genişleme projesiyle devasa bütçe fazlası ve %1,5 civarında düşük enflasyon bekleniyor.'],
    ['Kuveyt', '🇰🇼', 'Orta Doğu & Körfez', 'KWD', 2.8, 4.0, 'stable', 'Dünyanın En Değerli Para Birimi • Petrol ve Varlık Fonu', 'Sepet kur çıpası ve sübvansiyonlarla enflasyonun %2,5-%3 bandında yatay seyretmesi bekleniyor.'],
    ['Umman', '🇴🇲', 'Orta Doğu & Körfez', 'OMR', 0.9, 5.0, 'stable', 'Enerji, Yeşil Hidrojen Yatırımları ve Lojistik', 'Kamu borcunun hızla düşürülmesi ve USD çıpasıyla %1 civarında çok düşük enflasyon bekleniyor.'],
    ['Bahreyn', '🇧🇭', 'Orta Doğu & Körfez', 'BHD', 1.2, 5.0, 'stable', 'Körfez Finans, Alüminyum ve Turizm Merkezi', 'USD sabit kuru sayesinde %1-%1,5 bandında tam fiyat istikrarı bekleniyor.'],
    ['İsrail', '🇮🇱', 'Orta Doğu & Körfez', 'ILS (₪)', 3.5, 4.5, 'falling', 'Yüksek Teknoloji, Siber Güvenlik ve Savunma Sanayii', 'Bölgesel gerilimlerin azalması halinde bütçe açığının daralması ve enflasyonun %2,5\'e gerilemesi bekleniyor.'],
    ['Ürdün', '🇯🇴', 'Orta Doğu & Körfez', 'JOD', 1.8, 6.5, 'stable', 'Turizm, Fosfat/Potas Madenciliği ve USD Çıpalı Ekonomi', 'Merkez bankasının güçlü rezervleri ve USD çıpasıyla %2 civarında düşük enflasyon bekleniyor.'],
    ['Irak', '🇮🇶', 'Orta Doğu & Körfez', 'IQD', 3.2, 5.5, 'stable', 'OPEC\'in 2 Numaralı Petrol Üreticisi', 'Resmi döviz kuru istikrarı ve petrol gelirleriyle enflasyonun %3-%4 bandında dengeli kalması bekleniyor.'],
    ['İran', '🇮🇷', 'Orta Doğu & Körfez', 'IRR', 32.5, 23.0, 'rising', 'Büyük Enerji ve Maden Rezervleri • Yaptırım ve Kur Baskısı', 'Yaptırımlar, bütçe açığı ve Riyal\'deki değer kaybı nedeniyle %30 üzerindeki kronik yüksek enflasyon sürecinin devam etmesi bekleniyor.'],
    ['Lübnan', '🇱🇧', 'Orta Doğu & Körfez', 'LBP', 35.0, 20.0, 'falling', 'Ticaret ve Bankacılık • Fiili Dolarizasyonla Dengelenme', 'Ekonominin büyük ölçüde nakit USD kullanımına geçmesiyle üç haneli hiperenflasyondan %30 bandına doğru kademeli düşüş süreci yaşanıyor.'],
    ['Kuzey Kıbrıs (KKTC)', '🇹🇷', 'Orta Doğu & Körfez', 'TRY (₺)', 41.0, 45.0, 'falling', 'Yükseköğretim, Turizm ve Hizmet Ekonomisi', 'Türk Lirası kullanımı nedeniyle Türkiye\'deki dezenflasyon süreciyle paralel olarak enflasyonda kademeli düşüş bekleniyor.'],

    // AFRİKA (22)
    ['Güney Afrika', '🇿🇦', 'Afrika', 'ZAR (R)', 3.8, 7.75, 'falling', 'Afrika\'nın En Sanayileşmiş Ekonomisi • Altın, Platin, Finans', 'Elektrik kesintilerinin çözülmesi ve güçlü Rand ile enflasyonun %4 altına inmesi, faiz indirim döngüsünün hızlanması bekleniyor.'],
    ['Mısır', '🇪🇬', 'Afrika', 'EGP (E£)', 24.0, 27.25, 'falling', 'Süveyş Kanalı, Turizm, Doğalgaz • 50 Milyar $ Yatırım Paketi', 'BAE ve IMF kaynaklı dev döviz girişi sonrası karaborsa kurunun bitmesiyle enflasyonun %24\'ten %15\'e doğru hızla düşmesi bekleniyor.'],
    ['Nijerya', '🇳🇬', 'Afrika', 'NGN (₦)', 33.0, 27.5, 'rising', 'Afrika\'nın En Kalabalık Ülkesi ve Petrol Devi', 'Akaryakıt sübvansiyonunun kaldırılması ve Naira devalüasyonu nedeniyle kısa vadede yüksek enflasyonun sürmesi, ardından sıkı faizle dengelenmesi bekleniyor.'],
    ['Fas', '🇲🇦', 'Afrika', 'MAD', 1.3, 2.75, 'stable', 'Avrupa\'ya Otomotiv, Havacılık ve Fosfat/Gübre İhracatçısı', 'Merkez bankasının fiyat istikrarı başarısıyla %1,5-%2 bandında düşük enflasyon ve güçlü sanayi büyümesi bekleniyor.'],
    ['Cezayir', '🇩🇿', 'Afrika', 'DZD', 4.1, 3.0, 'falling', 'Avrupa\'nın Başlıca Doğalgaz ve Petrol Tedarikçisi', 'Gıda sübvansiyonları ve yüksek enerji gelirleriyle enflasyonun %4 altında kalması bekleniyor.'],
    ['Tunus', '🇹🇳', 'Afrika', 'TND', 6.2, 8.0, 'falling', 'Turizm, Zeytinyağı ve Avrupa Yan Sanayi Üretimi', 'Sıkı para politikasıyla enflasyonun %6\'dan %5\'e doğru kademeli gerilemesi bekleniyor.'],
    ['Kenya', '🇰🇪', 'Afrika', 'KES', 3.6, 11.25, 'falling', 'Doğu Afrika\'nın Mobil Finans (M-Pesa), Çay ve Teknoloji Merkezi', 'Kenya Şilini\'nin değer kazanmasıyla enflasyonun %3,5-%4 bandında çok sağlıklı bir seviyede kalması bekleniyor.'],
    ['Etiyopya', '🇪🇹', 'Afrika', 'ETB', 19.5, 15.0, 'falling', 'Doğu Afrika\'nın En Hızlı Büyüyen Tarım, Kahve ve Havacılık Gücü', 'Kur reformu ve IMF programıyla enflasyonun %30\'lardan %15\'e doğru düşüş sürecini sürdürmesi bekleniyor.'],
    ['Gana', '🇬🇭', 'Afrika', 'GHS', 21.5, 27.0, 'falling', 'Afrika\'nın En Büyük Altın ve Kakao Üreticilerinden', 'Altın ve kakao fiyatlarındaki rekor yükselişin döviz rezervlerini güçlendirmesiyle enflasyonda düşüş süreci bekleniyor.'],
    ['Fildişi Sahili', '🇨🇮', 'Afrika', 'XOF', 3.3, 3.5, 'stable', 'Dünyanın 1 Numaralı Kakao Üreticisi • Euro Çıpalı CFA Frangı', 'Euro\'ya sabitlenmiş para birimi ve rekor kakao gelirleriyle %3 altında düşük enflasyon ve %6,5 büyüme bekleniyor.'],
    ['Senegal', '🇸🇳', 'Afrika', 'XOF', 1.8, 3.5, 'stable', 'Yeni Petrol ve LNG Üreticisi • Euro Çıpalı CFA Frangı', 'Yeni başlayan petrol ve doğalgaz üretimiyle %8 büyüme patlaması ve %2 altında düşük enflasyon bekleniyor.'],
    ['Tanzanya', '🇹🇿', 'Afrika', 'TZS', 3.1, 6.0, 'stable', 'Altın Madenciliği, Turizm (Zanzibar/Serengeti) ve Tarım', 'Afrika\'da fiyat istikrarını en iyi koruyan ülkelerden biri olarak %3-%3,5 enflasyon bekleniyor.'],
    ['Uganda', '🇺🇬', 'Afrika', 'UGX', 3.3, 9.75, 'stable', 'Kahve İhracatı ve Yeni Petrol Boru Hattı Yatırımları', 'Sıkı merkez bankası politikasıyla %3,5 civarında düşük enflasyonun korunması bekleniyor.'],
    ['Angola', '🇦🇴', 'Afrika', 'AOA', 27.0, 19.5, 'falling', 'Sahra Altı Afrika\'nın Büyük Petrol ve Elmas Üreticisi', 'Kwanza kurundaki dalgalanmanın durulmasıyla enflasyonun %27\'den %18\'e doğru kademeli inmesi bekleniyor.'],
    ['Zambiya', '🇿🇲', 'Afrika', 'ZMW', 15.2, 14.0, 'falling', 'Afrika\'nın Bakır Madenciliği Kalbi', 'Kuraklık etkisinin geçmesi ve bakır fiyatlarının yükselmesiyle enflasyonun tek haneye doğru düşmesi bekleniyor.'],
    ['Ruanda', '🇷🇼', 'Afrika', 'RWF', 4.8, 6.5, 'falling', 'Afrika\'nın Teknoloji, Kongre Turizmi ve Yönetişim Yıldızı', '%7 üzerinde yüksek büyüme ve %4-%5 bandında dengeli enflasyon süreci bekleniyor.'],
    ['Mauritius', '🇲🇺', 'Afrika', 'MUR', 3.4, 4.0, 'stable', 'Hint Okyanusu Finans, Lüks Turizm ve Offshore Merkezi', 'Turizm rekorlarıyla %3-%3,5 bandında istikrarlı enflasyon bekleniyor.'],
    ['Botsvana', '🇧🇼', 'Afrika', 'BWP', 2.6, 1.9, 'stable', 'Dünyanın En Büyük Değerli Elmas Üreticilerinden', 'Güçlü döviz rezervleriyle %2,5-%3 bandında çok düşük enflasyon bekleniyor.'],
    ['Namibya', '🇳🇦', 'Afrika', 'NAD', 3.5, 7.0, 'falling', 'Uranyum, Elmas, Yeşil Hidrojen ve Yeni Petrol Keşifleri', 'Güney Afrika Randı çıpası sayesinde %3,5 civarında ılımlı enflasyon bekleniyor.'],
    ['Kamerun', '🇨🇲', 'Afrika', 'XAF', 4.4, 5.0, 'falling', 'Orta Afrika\'nın En Büyük Ekonomisi • Euro Çıpalı CFA Frangı', 'Euro çıpası disipliniyle enflasyonun %3\'e doğru gerilemesi bekleniyor.'],
    ['Demokratik Kongo Cumhuriyeti', '🇨🇩', 'Afrika', 'CDF', 14.5, 25.0, 'falling', 'Dünyanın 1 Numaralı Kobalt ve Büyük Bakır Üreticisi', 'Elektrikli araç bataryaları için kritik maden ihracatıyla büyüme ve enflasyonun kademeli düşmesi bekleniyor.'],
    ['Zimbabve', '🇿🇼', 'Afrika', 'ZiG (Altın Destekli)', 36.0, 35.0, 'rising', 'Altın, Lityum ve Platin Madenciliği • Yeni Altın Destekli Para (ZiG)', 'Altın destekli yeni para birimi ZiG ile istikrar aransa da para arzı kaynaklı enflasyonist risklerin yüksek kalması bekleniyor.'],
  ];

  // Eksik kalan ülkeleri 120'ye tamamlayan ek küresel ekonomiler
  const EXTRA_COUNTRIES = [
    ['Suudi-Körfez Serbest Bölge / Bahama', '🇧🇸', 'Amerika', 'BSD ($)', 1.8, 4.0, 'stable', 'Finans ve Lüks Deniz Turizmi', 'USD çıpası sayesinde %2 altında fiyat istikrarının sürmesi bekleniyor.'],
    ['Kıbrıs Rum Kesimi', '🇨🇾', 'Avrupa', 'EUR (€)', 2.0, 3.15, 'stable', 'Denizcilik, Finans ve Turizm', 'Euro Bölgesi ortalamasında %2 civarı sabit enflasyon bekleniyor.'],
    ['Malta', '🇲🇹', 'Avrupa', 'EUR (€)', 2.2, 3.15, 'stable', 'Akdeniz Finans, Bilişim ve Turizm Adası', 'Avrupa\'nın en hızlı büyüyen hizmet ekonomilerinden biri olarak %2 civarında dengeli enflasyon bekleniyor.'],
    ['Karadağ', '🇲🇪', 'Avrupa', 'EUR (€)', 3.1, 3.15, 'falling', 'Tek Taraflı Euro Kullanan Adriyatik Turizm Ekonomisi', 'Turizm yatırımları ve Euro kullanımıyla enflasyonun %2,5 seviyesine inmesi bekleniyor.'],
    ['Kosova', '🇽🇰', 'Avrupa', 'EUR (€)', 2.3, 3.15, 'stable', 'Euro Kullanan Genç Nüfuslu Balkan Ekonomisi', 'Euro kullanımı sayesinde kur şoku yaşamadan %2-%2,5 bandında istikrarlı süreç bekleniyor.'],
    ['Moldova', '🇲🇩', 'Avrupa', 'MDL', 4.6, 3.6, 'stable', 'AB Adayı • Tarım, Şarapçılık ve Bilişim', 'Geçmişteki enerji şokunu tamamen atlatarak %4,5-%5 bandında dengeli enflasyon bekleniyor.'],
    ['Belarus', '🇧🇾', 'Avrasya & Türk Dünyası', 'BYN', 5.9, 9.5, 'rising', 'Makine, Potas Gübresi ve Bilişim', 'Fiyat kontrollerine rağmen maliyet baskılarıyla %6-%7 bandında enflasyon bekleniyor.'],
    ['Ermenistan', '🇦🇲', 'Avrasya & Türk Dünyası', 'AMD', 1.4, 7.25, 'stable', 'Ticaret, Bilişim ve Madencilik', 'Güçlü yerel para birimiyle %1,5-%2,5 bandında düşük enflasyon bekleniyor.'],
    ['Tacikistan', '🇹🇯', 'Avrasya & Türk Dünyası', 'TJS', 3.8, 9.0, 'stable', 'Hidroelektrik Enerji, Alüminyum ve Altın', '%3,5-%4,5 bandında ılımlı enflasyon ve %7 büyüme bekleniyor.'],
    ['Brunei', '🇧🇳', 'Asya & Pasifik', 'BND', 0.4, 3.4, 'stable', 'Petrol ve LNG Zengini Sultanlık • Singapur Doları Çıpalı', 'Sübvansiyonlar ve SGD çıpasıyla %0,5-%1 bandında dünyanın en düşük enflasyonlarından biri bekleniyor.'],
    ['Makao', '🇲🇴', 'Asya & Pasifik', 'MOP', 1.1, 4.75, 'stable', 'Asya\'nın Turizm ve Eğlence Başkenti', '%1-%1,5 bandında çok düşük ve istikrarlı enflasyon bekleniyor.'],
    ['Laos', '🇱🇦', 'Asya & Pasifik', 'LAK', 18.5, 10.5, 'falling', 'Güneydoğu Asya\'nın Hidroelektrik Bataryası', 'Kip\'teki değer kaybının yavaşlamasıyla enflasyonun %25\'lerden %12\'ye doğru inmesi bekleniyor.'],
    ['Myanmar', '🇲🇲', 'Asya & Pasifik', 'MMK', 22.0, 9.0, 'rising', 'Doğalgaz, Tarım ve Değerli Taşlar', 'İç siyasi belirsizlikler ve tedarik sorunlarıyla yüksek enflasyonun sürmesi bekleniyor.'],
    ['Fiji', '🇫🇯', 'Asya & Pasifik', 'FJD', 3.2, 0.5, 'stable', 'Güney Pasifik\'in Turizm ve Ticaret Merkezi', 'Turizm gelirleriyle %3 civarında dengeli enflasyon bekleniyor.'],
    ['Papua Yeni Gine', '🇵🇬', 'Asya & Pasifik', 'PGK', 4.1, 3.0, 'stable', 'LNG, Altın ve Bakır İhracatçısı', 'Emtia ihracatıyla %4 civarında yatay enflasyon süreci bekleniyor.'],
    ['Maldivler', '🇲🇻', 'Asya & Pasifik', 'MVR', 2.4, 4.5, 'stable', 'Küresel Lüks Ada Turizmi Merkezi', 'Turizm döviz girişiyle %2,5 civarında sabit enflasyon bekleniyor.'],
    ['Nijer', '🇳🇪', 'Afrika', 'XOF', 4.2, 3.5, 'falling', 'Uranyum ve Yeni Petrol İhracatçısı • CFA Frangı', 'Yeni petrol boru hattı ihracatıyla yüksek büyüme ve enflasyonun %3\'e düşmesi bekleniyor.'],
    ['Mali', '🇲🇱', 'Afrika', 'XOF', 3.5, 3.5, 'stable', 'Afrika\'nın Büyük Altın Üreticilerinden • CFA Frangı', 'Euro çıpası sayesinde %3-%4 bandında kontrollü enflasyon bekleniyor.'],
    ['Burkina Faso', '🇧🇫', 'Afrika', 'XOF', 3.7, 3.5, 'stable', 'Altın Madenciliği ve Pamuk Üretimi • CFA Frangı', 'CFA Frangı para birliği disipliniyle %3,5 civarında enflasyon bekleniyor.'],
    ['Mozambik', '🇲🇿', 'Afrika', 'MZN', 3.2, 13.5, 'falling', 'Dev Doğalgaz (LNG) Rezervleri ve Alüminyum', 'Yüksek reel faiz politikası sayesinde enflasyonun %3-%4 bandında çok düşük kalması bekleniyor.'],
    ['Madagaskar', '🇲🇬', 'Afrika', 'MGA', 7.1, 9.5, 'falling', 'Dünyanın Vanilya Başkenti, Nikel ve Kobalt Üreticisi', 'Tarım arzındaki iyileşmeyle enflasyonun %6\'ya gerilemesi bekleniyor.'],
    ['Gabon', '🇬🇦', 'Afrika', 'XAF', 2.5, 5.0, 'stable', 'Petrol, Manganez ve Kereste İhracatçısı • CFA Frangı', '%2,5 civarında düşük enflasyon ve istikrarlı dış ticaret fazlası bekleniyor.'],
    ['Nikaragua', '🇳🇮', 'Amerika', 'NIO', 4.6, 7.0, 'falling', 'Altın, Kahve ve Tekstil İhracatı', 'Sıkı maliye politikasıyla enflasyonun %4\'e doğru gerilemesi bekleniyor.'],
    ['Barbados', '🇧🇧', 'Amerika', 'BBD', 2.8, 2.0, 'stable', 'Karayip Finans ve Turizm Adası • USD Çıpalı', 'USD sabit kuru sayesinde %2,5-%3 bandında istikrarlı enflasyon bekleniyor.'],
    ['Guyana', '🇬🇾', 'Amerika', 'GYD', 3.1, 5.0, 'stable', 'Yeni Petrol Keşifleriyle Dünyanın En Hızlı Büyüyen Ekonomisi (%30+ Büyüme)', 'Açık deniz petrol üretiminin ikiye katlanmasıyla devasa büyüme ve %3 civarında düşük enflasyon bekleniyor.'],
    ['Surinam', '🇸🇷', 'Amerika', 'SRD', 14.2, 15.0, 'falling', 'Altın, Boksit ve Yeni Petrol Keşifleri', 'IMF reformlarıyla enflasyonun %50\'lerden tek haneye doğru hızlı düşüşünü sürdürmesi bekleniyor.'],
  ];

  const ALL_120_COUNTRIES = [...RAW_120_COUNTRIES, ...EXTRA_COUNTRIES].map((row, idx) => ({
    id: idx + 1,
    name: row[0],
    flag: row[1],
    region: row[2],
    currency: row[3],
    inflation: row[4],
    interestRate: row[5],
    trend: row[6], // 'falling' | 'stable' | 'rising'
    profile: row[7],
    forecast: row[8],
  }));

  function getTrendMeta(trend) {
    if (trend === 'falling') {
      return {
        badge: '📉 İleride Düşüş (Dezenflasyon) Süreci Bekleniyor',
        shortBadge: '📉 Düşüş Bekleniyor',
        cssClass: 'inf-trend-falling',
      };
    }
    if (trend === 'rising') {
      return {
        badge: '📈 Enflasyonist Baskı / Artış Riski Bekleniyor',
        shortBadge: '📈 Artış / Baskı Riski',
        cssClass: 'inf-trend-rising',
      };
    }
    return {
      badge: '⚖️ Fiyat İstikrarı / Sabit Süreç Bekleniyor',
      shortBadge: '⚖️ Sabit / İstikrarlı',
      cssClass: 'inf-trend-stable',
    };
  }

  // YEK AI İçin Ülke Ekonomisi Sorgu Çözümleyici
  function findCountryEconomyForAI(queryText) {
    if (!queryText) return null;
    const q = queryText.toLowerCase();

    // Genel "ülkelerin enflasyonları / dünya ekonomisi" sorusu
    if (
      (q.includes('120 ülke') || q.includes('ülkelerin enflasyon') || q.includes('dünyada enflasyon') || q.includes('en yüksek enflasyon') || q.includes('en düşük enflasyon')) &&
      !ALL_120_COUNTRIES.some((c) => c.name.toLowerCase() !== 'türkiye' && q.includes(c.name.toLowerCase().split(' ')[0]))
    ) {
      const lowest = [...ALL_120_COUNTRIES].sort((a, b) => a.inflation - b.inflation).slice(0, 5);
      const highest = [...ALL_120_COUNTRIES].sort((a, b) => b.inflation - a.inflation).slice(0, 5);
      return `### 🌍 Küresel 120 Ülke Enflasyon ve Makroekonomi Özeti

Küresel ekonomide merkez bankalarının parasal sıkılaşma adımları sonrasında gelişmiş ülkelerde **%2 fiyat istikrarı** yakalanırken, gelişmekte olan ülkelerde güçlü bir **dezenflasyon (enflasyon düşüş) süreci** yaşanmaktadır.

* **En Düşük Enflasyona Sahip 5 Ülke:** ${lowest.map((c) => `${c.flag} **${c.name}** (%${c.inflation})`).join(', ')}
* **En Yüksek Enflasyona Sahip 5 Ülke:** ${highest.map((c) => `${c.flag} **${c.name}** (%${c.inflation})`).join(', ')}
* **Türkiye (${ALL_120_COUNTRIES[0].flag}):** Yıllık **%${ALL_120_COUNTRIES[0].inflation}** enflasyon ve **%${ALL_120_COUNTRIES[0].interestRate}** politika faizi ile sıkı para politikası kaynaklı **dezenflasyon (düşüş) sürecindedir**.`;
    }

    // Metin içinde geçen ülkeleri bul (birden fazla ülke karşılaştırmasını da destekler!)
    const matchedCountries = ALL_120_COUNTRIES.filter((c) => {
      const baseName = c.name.toLowerCase().split('(')[0].trim();
      if (q.includes(baseName)) return true;
      if (baseName.includes('amerika birleşik') && (q.includes('abd') || q.includes('amerika'))) return true;
      if (baseName.includes('birleşik krallık') && (q.includes('ingiltere') || q.includes('britanya'))) return true;
      if (baseName.includes('birleşik arap') && (q.includes('bae') || q.includes('dubai'))) return true;
      if (baseName.includes('hollanda') && q.includes('felemenk')) return true;
      return false;
    });

    // Eğer sadece "Türkiye" eşleştiyse ve soru genel bir bütçe sorusuysa ("ekonomi" veya "enflasyon" kelimesi yoksa) atla
    if (matchedCountries.length === 1 && matchedCountries[0].name === 'Türkiye') {
      if (!q.includes('türkiye') && !q.includes('ekonomi') && !q.includes('enflasyon')) {
        return null;
      }
    }

    if (matchedCountries.length === 0) return null;

    if (matchedCountries.length === 1) {
      const c = matchedCountries[0];
      const meta = getTrendMeta(c.trend);
      const realRate = (((1 + c.interestRate / 100) / (1 + c.inflation / 100) - 1) * 100).toFixed(2);
      return `### ${c.flag} ${c.name} Ekonomisi, Enflasyon Analizi ve Gelecek Süreç Beklentisi

* **Bölge & Ekonomik Yapı:** ${c.region} — *${c.profile}*
* **Para Birimi:** ${c.currency}
* **Yıllık Enflasyon (TÜFE):** **%${c.inflation}**
* **Merkez Bankası Politika Faizi:** **%${c.interestRate}** *(Hesaplanan Reel Faiz: **%${realRate}**)*
* **Beklenen Süreç Yönü:** **${meta.badge}**

#### 🔮 İleride Nasıl Bir Süreç Bekleniyor?
${c.forecast}`;
    }

    // Birden fazla ülke sorulduysa karşılaştırma tablosu üret!
    const rows = matchedCountries
      .slice(0, 6)
      .map((c) => {
        const meta = getTrendMeta(c.trend);
        return `| ${c.flag} **${c.name}** | ${c.currency} | **%${c.inflation}** | %${c.interestRate} | ${meta.shortBadge} | ${c.forecast} |`;
      })
      .join('\n');

    return `### 🌍 Ülke Ekonomileri ve Enflasyon Karşılaştırma Analizi

| Ülke | Para Birimi | Yıllık Enflasyon | Politika Faizi | Beklenen Süreç | Makroekonomik Beklenti Özeti |
| :--- | :--- | :--- | :--- | :--- | :--- |
${rows}`;
  }

  // Üst menüye "Ülkeler & Enflasyonlar" sekmesini otomatik ekle ve 120 Ülke Panosunu çiz
  function initGlobalEconomiesUI() {
    const navLinksEl = document.querySelector('.nav-links');
    if (navLinksEl && !navLinksEl.querySelector('a[href="ulkeler-enflasyon.html"]')) {
      const isCurrentPage = window.location.pathname.toLowerCase().includes('ulkeler-enflasyon.html');
      const link = document.createElement('a');
      link.href = 'ulkeler-enflasyon.html';
      link.className = `nav-tab ${isCurrentPage ? 'active' : ''}`;
      link.innerHTML = `<img src="logo.svg?v=4" alt="" class="link-mini-logo" /> Ülkeler & Enflasyon`;

      // Döviz Çevirici'den hemen sonraya (YEK AI'dan önceye) yerleştir
      const aiTab = navLinksEl.querySelector('a[href="yek-ai.html"]');
      if (aiTab) {
        navLinksEl.insertBefore(link, aiTab);
      } else {
        navLinksEl.appendChild(link);
      }
    }

    // Eğer ulkeler-enflasyon.html sayfasındaysak 120 Ülke Panosunu çiz
    const countriesGridEl = document.getElementById('globalCountriesGrid');
    if (!countriesGridEl || countriesGridEl.dataset.initialized === 'true') return;
    countriesGridEl.dataset.initialized = 'true';

    const searchInput = document.getElementById('countrySearchInput');
    const regionSelect = document.getElementById('countryRegionFilter');
    const trendSelect = document.getElementById('countryTrendFilter');
    const sortSelect = document.getElementById('countrySortSelect');
    const countBadge = document.getElementById('countryCountBadge');
    const selectedCountrySpotlight = document.getElementById('selectedCountrySpotlight');

    // Özet KPI Kartlarını Güncelle
    const kpiFallingEl = document.getElementById('kpiFallingCount');
    const kpiStableEl = document.getElementById('kpiStableCount');
    const kpiRisingEl = document.getElementById('kpiRisingCount');
    if (kpiFallingEl) kpiFallingEl.textContent = `${ALL_120_COUNTRIES.filter((c) => c.trend === 'falling').length} Ülke`;
    if (kpiStableEl) kpiStableEl.textContent = `${ALL_120_COUNTRIES.filter((c) => c.trend === 'stable').length} Ülke`;
    if (kpiRisingEl) kpiRisingEl.textContent = `${ALL_120_COUNTRIES.filter((c) => c.trend === 'rising').length} Ülke`;

    let activeSpotlightCountry = ALL_120_COUNTRIES[0]; // Varsayılan: Türkiye

    function renderSpotlight(c) {
      if (!selectedCountrySpotlight || !c) return;
      const meta = getTrendMeta(c.trend);
      const realRate = (((1 + c.interestRate / 100) / (1 + c.inflation / 100) - 1) * 100).toFixed(2);
      selectedCountrySpotlight.innerHTML = `
        <div class="country-spotlight-card ${meta.cssClass}">
          <div class="spotlight-top-row">
            <div class="spotlight-title-box">
              <span class="spotlight-flag">${c.flag}</span>
              <div>
                <span class="spotlight-region-tag">${c.region} • ${c.currency}</span>
                <h3>${c.name} — Makroekonomi & Enflasyon Raporu</h3>
                <p class="spotlight-profile">${c.profile}</p>
              </div>
            </div>
            <div class="spotlight-metrics-row">
              <div class="spotlight-metric">
                <small>Yıllık Enflasyon</small>
                <strong class="text-gold">%${c.inflation}</strong>
              </div>
              <div class="spotlight-metric">
                <small>Politika Faizi</small>
                <strong class="text-emerald">%${c.interestRate}</strong>
              </div>
              <div class="spotlight-metric">
                <small>Reel Faiz Dengesi</small>
                <strong>${realRate > 0 ? `+${realRate}%` : `${realRate}%`}</strong>
              </div>
            </div>
          </div>
          <div class="spotlight-forecast-box">
            <span class="inf-trend-badge ${meta.cssClass}">${meta.badge}</span>
            <p><strong>🔮 İleride Nasıl Bir Süreç Bekleniyor?</strong> ${c.forecast}</p>
          </div>
        </div>
      `;
    }

    function renderCountriesList() {
      const q = (searchInput?.value || '').toLowerCase().trim();
      const regionVal = regionSelect?.value || 'all';
      const trendVal = trendSelect?.value || 'all';
      const sortVal = sortSelect?.value || 'default';

      let filtered = ALL_120_COUNTRIES.filter((c) => {
        const matchQ =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.currency.toLowerCase().includes(q) ||
          c.profile.toLowerCase().includes(q);
        const matchReg = regionVal === 'all' || c.region === regionVal;
        const matchTr = trendVal === 'all' || c.trend === trendVal;
        return matchQ && matchReg && matchTr;
      });

      if (sortVal === 'inf_desc') {
        filtered.sort((a, b) => b.inflation - a.inflation);
      } else if (sortVal === 'inf_asc') {
        filtered.sort((a, b) => a.inflation - b.inflation);
      } else if (sortVal === 'rate_desc') {
        filtered.sort((a, b) => b.interestRate - a.interestRate);
      } else if (sortVal === 'name_asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
      }

      if (countBadge) {
        countBadge.textContent = `${filtered.length} / ${ALL_120_COUNTRIES.length} Ülke Gösteriliyor`;
      }

      countriesGridEl.innerHTML = filtered
        .map((c) => {
          const meta = getTrendMeta(c.trend);
          const realRate = (((1 + c.interestRate / 100) / (1 + c.inflation / 100) - 1) * 100).toFixed(1);
          return `
            <article class="country-inf-card ${c.id === activeSpotlightCountry?.id ? 'active-country-card' : ''}" data-id="${c.id}">
              <div class="country-card-head">
                <div class="country-flag-title">
                  <span class="country-flag-lg">${c.flag}</span>
                  <div>
                    <h4>${c.name}</h4>
                    <small>${c.region} • ${c.currency}</small>
                  </div>
                </div>
                <span class="inf-rate-pill ${meta.cssClass}">%${c.inflation}</span>
              </div>

              <div class="country-stats-bar">
                <span>Politika Faizi: <strong>%${c.interestRate}</strong></span>
                <span>Reel Faiz: <strong>${realRate > 0 ? `+${realRate}%` : `${realRate}%`}</strong></span>
              </div>

              <p class="country-profile-text">${c.profile}</p>

              <div class="country-forecast-footer">
                <span class="inf-trend-badge ${meta.cssClass}">${meta.shortBadge}</span>
                <p class="country-forecast-note">${c.forecast}</p>
              </div>
            </article>
          `;
        })
        .join('');

      countriesGridEl.querySelectorAll('.country-inf-card').forEach((card) => {
        card.addEventListener('click', () => {
          const id = parseInt(card.dataset.id, 10);
          const found = ALL_120_COUNTRIES.find((x) => x.id === id);
          if (found) {
            activeSpotlightCountry = found;
            renderSpotlight(found);
            countriesGridEl.querySelectorAll('.country-inf-card').forEach((el) => el.classList.remove('active-country-card'));
            card.classList.add('active-country-card');
            selectedCountrySpotlight.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      });
    }

    renderSpotlight(activeSpotlightCountry);
    renderCountriesList();

    searchInput?.addEventListener('input', renderCountriesList);
    regionSelect?.addEventListener('change', renderCountriesList);
    trendSelect?.addEventListener('change', renderCountriesList);
    sortSelect?.addEventListener('change', renderCountriesList);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalEconomiesUI);
  } else {
    initGlobalEconomiesUI();
  }

  window.GLOBAL_ECONOMIES_120 = {
    ALL_120_COUNTRIES,
    findCountryEconomyForAI,
  };
})();
