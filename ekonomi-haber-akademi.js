// ============================================================================
// DOĞRU BÜTÇE DOĞRU KULLANIM — DÜNYA EKONOMİ HABERLERİ, BIST 30 TEMETTÜ,
// MAAŞ BORDROSU, KREDİ KARTI ASGARİ ÖDEME TUZAĞI, FİNANSAL IQ & SÖZLÜK MOTORU
// (ekonomi-haber-akademi.js)
// ============================================================================

(function () {
  const fmtTRY = (n) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);

  // ==========================================================================
  // 1. DÜNYADAN VE TÜRKİYE'DEN GÜNCEL EKONOMİ HABERLERİ VERİTABANI (12 HABER)
  // ==========================================================================
  const WORLD_ECONOMY_NEWS = [
    {
      id: 1,
      category: 'Küresel Merkez Bankaları',
      regionFlag: '🇺🇸',
      timeTag: 'SON DAKİKA • KÜRESEL PARA POLİTİKASI',
      title: 'ABD Merkez Bankası (FED) "Yumuşak İniş" Rotasında: Küresel Likidite ve Gelişen Piyasalar İçin Yeni Dönem',
      summary:
        'ABD\'de çekirdek PCE enflasyonunun %2,5 bandına doğru dengelenmesiyle FED, ekonomiyi resesyona sokmadan kademeli faiz indirimi patikasını koruyor.',
      fullAnalysis:
        'FED\'in sıkı para politikasından kademeli normalleşmeye geçmesi, Dolar Endeksi (DXY) üzerindeki aşırı baskıyı azaltırken gelişmekte olan ülke borsalarına ve Eurobond piyasasına sermaye akışını hızlandırıyor. Piyasa Uzmanı Yusuf Efe Karagöz\'e göre bu döngüde portföylerdeki %25 Yabancı Teknoloji Fonu ve %30 Altın/Gümüş ağırlığı hem Dolar bazlı büyümeden hem de faiz indirimlerinden çift yönlü kazanç sağlar.',
      impactBadge: '📈 Altın, Eurobond ve Teknoloji Fonları İçin Pozitif',
      impactType: 'positive',
    },
    {
      id: 2,
      category: 'Türkiye Ekonomisi',
      regionFlag: '🇹🇷',
      timeTag: 'GÜNDEM • TCMB & MAKROEKONOMİ',
      title: 'TCMB Rezervlerinde Tarihi Güçlenme ve Dezenflasyon Süreci: TL Varlıklarda Reel Faiz Dönemi',
      summary:
        'Türkiye Cumhuriyet Merkez Bankası\'nın sıkı para politikası ve kredi büyüme sınırlarıyla yıllık enflasyonda baz etkili dezenflasyon (düşüş) süreci belirginleşti.',
      fullAnalysis:
        'TL mevduat ve Para Piyasası Fonlarının (PPF) beklenen enflasyonun üzerinde pozitif reel getiri sunmasıyla Kur Korumalı Mevduat\'tan (KKM) standart TL varlıklara geçiş hızlandı. Ülke kredi risk priminin (CDS) 250 baz puan seviyelerine gerilemesi Türk şirketlerinin ve bankalarının dış borçlanma maliyetini düşürüyor.',
      impactBadge: '🛡️ TL Para Piyasası Fonları (PPF) ve BIST Bankacılık İçin Pozitif',
      impactType: 'positive',
    },
    {
      id: 3,
      category: 'Altın & Emtia',
      regionFlag: '🏆',
      timeTag: 'EMTİA RAPORU • MERKEZ BANKASI ALIMLARI',
      title: 'Dünya Merkez Bankalarından Rekor Fiziki Altın Talebi: Ons ve Gram Altında Yapısal Yükseliş Trendi',
      summary:
        'Başta Çin, Hindistan, Polonya ve Türkiye olmak üzere merkez bankaları rezervlerini çeşitlendirmek için son 50 yılın en yüksek fiziki altın alım temposunu sürdürüyor.',
      fullAnalysis:
        'Jeopolitik belirsizlikler ve küresel borç stokunun 315 trilyon Doları aşması, altını "karşı taraf riski olmayan tek rezerv varlık" konumuna taşıdı. Türkiye\'deki yatırımcılar için Gram Altın hem küresel Ons yükselişinden hem de Dolar/TL çarpanından beslendiği için portföyün %30\'luk sarsılmaz sigortası olmaya devam ediyor.',
      impactBadge: '🚀 Gram Altın (GAU), ALTINS1 ve Kıymetli Maden Fonları İçin Güçlü Pozitif',
      impactType: 'positive',
    },
    {
      id: 4,
      category: 'Küresel Merkez Bankaları',
      regionFlag: '🇪🇺',
      timeTag: 'AVRUPA EKONOMİSİ • ECB KARARI',
      title: 'Avrupa Merkez Bankası (ECB) Faiz İndirimleriyle Sanayi ve İhracatı Canlandırmayı Hedefliyor',
      summary:
        'Euro Bölgesi\'nde enflasyonun %2 hedefine gerilemesiyle ECB, Almanya ve Fransa başta olmak üzere imalat sanayisini desteklemek için kredi maliyetlerini düşürüyor.',
      fullAnalysis:
        'Türkiye\'nin dış ticaretinde ihracatın yaklaşık %50\'si Avrupa kıtasına yapılmaktadır. Avrupa\'da faizlerin düşmesi ve tüketim talebinin canlanması; Borsa İstanbul\'daki otomotiv (FROTO, TOASO), beyaz eşya (ARCLK, VESBE) ve demir-çelik/sanayi ihracatçısı şirketlerin cirolarını doğrudan yukarı taşır.',
      impactBadge: '📈 Türk İhracatçı Sanayi Hisseleri ve EUR/TRY İçin Destekleyici',
      impactType: 'positive',
    },
    {
      id: 5,
      category: 'Teknoloji & Asya',
      regionFlag: '🤖',
      timeTag: 'TEKNOLOJİ EKONOMİSİ • WALL STREET & ASYA',
      title: 'Yapay Zeka Altyapı Yatırımları 1 Trilyon Doları Aştı: Yarı İletken ve Veri Merkezi Şirketlerinde Bilanço Patlaması',
      summary:
        'Küresel teknoloji devlerinin bulut bilişim ve yapay zeka çiplerine yaptığı sermaye harcamaları (CapEx) NASDAQ ve Tayvan/Güney Kore borsalarını yeni zirvelere taşıyor.',
      fullAnalysis:
        'Yapay zeka devrimi, 1990\'lardaki internet balonundan farklı olarak dev nakit akışı ve gerçek kârlılık üreten şirketler (NVIDIA, Microsoft, TSMC, ASML, Alphabet) üzerinden büyüyor. TEFAS üzerinden alınıp satılabilen Yabancı Teknoloji Sektörü Fonları, Türk yatırımcısına küçük tutarlarla bu devrime ortak olma fırsatı sunuyor.',
      impactBadge: '🚀 Yabancı Teknoloji & Yapay Zeka Fonları (%25 Sepet Payı) İçin Pozitif',
      impactType: 'positive',
    },
    {
      id: 6,
      category: 'Teknoloji & Asya',
      regionFlag: '🇨🇳',
      timeTag: 'ASYA PİYASALARI • PEKİN & TOKYO',
      title: 'Çin\'den İç Tüketimi Canlandıracak Dev Mali Teşvik Paketi, Japonya\'da 30 Yıl Sonra Pozitif Faiz Dönemi',
      summary:
        'Çin hükümeti gayrimenkul sektörünü ve iç talebi desteklemek için yeni tahvil ihracı açıklarken, Japonya Merkez Bankası (BoJ) ılımlı faiz artışlarıyla Yen\'i dengeliyor.',
      fullAnalysis:
        'Çin\'in teşvik paketleri küresel bakır, demir cevheri, gümüş ve petrol talebini canlandırarak emtia fiyatlarına taban oluşturuyor. Japonya\'daki faiz normalleşmesi ise küresel piyasalarda aşırı kaldıraçlı spekülatif işlemleri dizginleyerek temel bilançosu güçlü şirketleri öne çıkarıyor.',
      impactBadge: '⚖️ Küresel Emtia (Gümüş/Bakır) Pozitif • Kaldıraçlı Piyasalar Temkinli',
      impactType: 'neutral',
    },
    {
      id: 7,
      category: 'Türkiye Ekonomisi',
      regionFlag: '🇹🇷',
      timeTag: 'VERGİ & FON DÜZENLEMELERİ • TEFAS',
      title: 'Yerli Hisse Senedi Yoğun Fonlarda %0 Stopaj Avantajı Uzun Vadeli Yatırımcıyı Enflasyona Karşı Koruyor',
      summary:
        'Mevduat ve para piyasası fonlarında stopaj kesintisi uygulanırken, Borsa İstanbul hisse senedi yoğun yatırım fonlarındaki %0 stopaj (vergi muafiyeti) bileşik getiriyi hızlandırıyor.',
      fullAnalysis:
        'Bir yatırım aracında elde edilen kârdan vergi kesilmemesi, 5-10 yıllık bileşik getiri hesabında toplam serveti %15 ila %25 oranında artırır. Piyasa Uzmanı Yusuf Efe Karagöz\'ün sepetinde %30 Yerli Hisse Yoğun Fon bulunmasının en önemli matematiksel sebebi bu vergi kalkanıdır.',
      impactBadge: '🏆 TEFAS Hisse Senedi Yoğun Fonlar İçin Güçlü Avantaj',
      impactType: 'positive',
    },
    {
      id: 8,
      category: 'Altın & Emtia',
      regionFlag: '⚡',
      timeTag: 'ENERJİ & ENDÜSTRİYEL METAL',
      title: 'Güneş Enerjisi ve Elektrikli Araç Üretiminde Gümüş Talebi Arzı Aştı: Gümüş/Altın Rasyosunda Dikkat Çeken Fırsat',
      summary:
        'Gümüş hem değerli bir parasal maden hem de güneş panelleri ve elektronik çiplerin vazgeçilmez iletkeni olduğu için küresel gümüş piyasasında 4 yıldır üst üste arz açığı yaşanıyor.',
      fullAnalysis:
        'Tarihsel olarak Altın/Gümüş rasyosu 60-65 bandında dengelenirken rasyonun yüksek kaldığı dönemlerde gümüş, altına kıyasla daha hızlı yüzdesel atak yapma potansiyeli taşır. Değerli maden sepetinin (%30) içinde %20 Altın + %10 Gümüş fonu taşımak portföy dinamiğini güçlendirir.',
      impactBadge: '📈 Gümüş Fonları ve Değerli Maden Sepeti İçin Pozitif',
      impactType: 'positive',
    },
  ];

  // ==========================================================================
  // 2. BIST 30 DEV ŞİRKETLERİ & TEFAS FONLARI TEMETTÜ VERİTABANI
  // ==========================================================================
  const BIST_DIVIDEND_ASSETS = [
    {
      code: 'YEK_SEPET',
      name: '🏆 Yusuf Efe Karagöz Dengeli Temettü & Fon Sepeti',
      sector: 'Karma Sepet (%30 Altın, %30 BIST, %25 Teknoloji, %15 Eurobond/Temettü)',
      divYield: 7.5,
      annualRealGrowth: 18.0,
    },
    {
      code: 'TUPRS',
      name: '🏭 TÜPRAŞ (TUPRS) — Türkiye Petrol Rafinerileri',
      sector: 'Enerji & Rafineri • Yüksek Nakit Akışı ve Geleneksel Temettü Devi',
      divYield: 10.5,
      annualRealGrowth: 17.5,
    },
    {
      code: 'FROTO',
      name: '🚐 Ford Otosan (FROTO)',
      sector: 'Otomotiv & Avrupa İhracat Şampiyonu • Düzenli Yılda 2 Kez Temettü',
      divYield: 8.2,
      annualRealGrowth: 19.0,
    },
    {
      code: 'THYAO',
      name: '✈️ Türk Hava Yolları (THYAO)',
      sector: 'Küresel Havacılık & Döviz Gelirli İhracat Şampiyonu',
      divYield: 5.5,
      annualRealGrowth: 20.0,
    },
    {
      code: 'ASELS',
      name: '🛡️ ASELSAN (ASELS)',
      sector: 'Savunma Sanayii & Yüksek Teknoloji İhracatı',
      divYield: 3.5,
      annualRealGrowth: 21.5,
    },
    {
      code: 'BIMAS',
      name: '🛒 BİM Birleşik Mağazalar (BIMAS)',
      sector: 'Gıda Perakende • Enflasyon Geçişkenliğine En Dayanıklı Defansif Büyüme',
      divYield: 4.8,
      annualRealGrowth: 18.5,
    },
    {
      code: 'KCHOL',
      name: '🏛️ Koç Holding (KCHOL)',
      sector: 'Holding (Enerji, Otomotiv, Finans, Dayanıklı Tüketim)',
      divYield: 5.2,
      annualRealGrowth: 18.0,
    },
    {
      code: 'EREGL',
      name: '🔩 Erdemir (EREGL) — Ereğli Demir Çelik',
      sector: 'Demir-Çelik & Sanayi • USD Bazlı Bilanço ve Temettü Geleneği',
      divYield: 7.8,
      annualRealGrowth: 15.5,
    },
    {
      code: 'ISCTR',
      name: '🏦 Türkiye İş Bankası (ISCTR)',
      sector: 'Bankacılık & Sanayi İştirakleri (Şişecam Grubu)',
      divYield: 6.0,
      annualRealGrowth: 17.0,
    },
    {
      code: 'TEFAS_HISSE',
      name: '📈 TEFAS Hisse Senedi Yoğun Fon Sepeti (%0 Stopaj)',
      sector: 'Kurumsal Yönetilen BIST 100/30 Fonları • Vergi Muafiyetli',
      divYield: 8.0,
      annualRealGrowth: 19.5,
    },
  ];

  // ==========================================================================
  // 3. FİNANSAL IQ & YATIRIMCI KARAKTER TESTİ SORULARI (5 SORU)
  // ==========================================================================
  const FINANCIAL_IQ_QUESTIONS = [
    {
      id: 1,
      question: '1. Yıllık enflasyonun %38 olduğu bir ekonomide, bankadan yıllık net %38 faiz alırsanız paranızın reel (gerçek) kazancı yüzde kaçtır?',
      options: [
        { text: '%0 (Alım gücüm sadece korunmuş olur, reel kazanç sıfırdır)', points: 20, profile: 'rational' },
        { text: '%38 net kâr etmiş olurum', points: 5, profile: 'beginner' },
        { text: '%19 reel kazanç sağlamış olurum', points: 10, profile: 'moderate' },
      ],
    },
    {
      id: 2,
      question: '2. Maaşınız yattığında yatırım yapmak için en doğru strateji (Yusuf Efe Karagöz 1. Ayın Kuralı) hangisidir?',
      options: [
        { text: 'Maaş yattığı gün (ayın 1\'inde) piyasa fiyatına bakmadan otomatik olarak sepete dağıtmak (DCA)', points: 20, profile: 'rational' },
        { text: 'Ay sonunda harcamalardan para kalırsa kalanla altın veya dolar almak', points: 10, profile: 'moderate' },
        { text: 'Sosyal medyada en çok konuşulan hisse veya kripto paranın düşmesini beklemek', points: 5, profile: 'speculative' },
      ],
    },
    {
      id: 3,
      question: '3. Yatırım portföyünüz bir hafta içinde küresel bir haberle %12 gerilediğinde ilk tepkiniz ne olur?',
      options: [
        { text: 'Acil durum fonum ayrı olduğu için panik yapmam; ucuzlayan varlıklardan kademeli ekleme yaparım', points: 20, profile: 'rational' },
        { text: 'Hiçbir işlem yapmadan ekranı kapatır ve toparlanmasını beklerim', points: 15, profile: 'moderate' },
        { text: 'Daha fazla düşer korkusuyla zararına satıp nakde geçerim', points: 5, profile: 'beginner' },
      ],
    },
    {
      id: 4,
      question: '4. Türkiye\'de İhtiyaç Kredisi çekerken bankanın açıkladığı aylık %4,00 faiz oranının üzerine hangi vergiler eklenir?',
      options: [
        { text: '%15 KKDF + %15 BSMV eklenir; efektif aylık faiz maliyeti %5,20 olur', points: 20, profile: 'rational' },
        { text: 'Sadece %10 stopaj vergisi eklenir', points: 10, profile: 'moderate' },
        { text: 'Hiçbir vergi eklenmez, tam %4,00 ödenir', points: 5, profile: 'beginner' },
      ],
    },
    {
      id: 5,
      question: '5. Kripto paralar ve yüksek riskli "tüyo" hisseler toplam portföyün en fazla yüzde kaçını oluşturmalıdır?',
      options: [
        { text: 'Maksimum %5 ("Oyun Parası" sınırı — tamamı kaybedilse bile hayat standardını bozmayacak oran)', points: 20, profile: 'rational' },
        { text: 'Portföyün %25 - %30\'u ayrılabilir', points: 10, profile: 'speculative' },
        { text: 'Kısa sürede zengin olmak için birikimin tamamı yatırılabilir', points: 0, profile: 'speculative' },
      ],
    },
  ];

  // ==========================================================================
  // 4. A'DAN Z'YE FİNANS VE EKONOMİ SÖZLÜĞÜ (18 TEMEL KAVRAM)
  // ==========================================================================
  const FINANCIAL_GLOSSARY = [
    {
      term: 'Para Piyasası Fonu (PPF)',
      cat: 'Yatırım Fonları',
      desc: 'Vadesiz hesap gibi istediğiniz gün nakde çevrilebilen, içindeki parayı her gün gecelik mevduat/ters repo faiziyle bileşik olarak nemalandıran en güvenli likit fondur. Acil durum fonu için 1 numaralı araçtır.',
    },
    {
      term: 'Stopaj (Kaynakta Vergi Kesintisi)',
      cat: 'Vergi & Mevzuat',
      desc: 'Mevduat faizi veya fon kârından devletin otomatik kestiği vergidir. Yerli Hisse Senedi Yoğun Fonlarda stopaj %0 (vergisiz) olduğu için uzun vadede büyük avantaj sağlar.',
    },
    {
      term: 'KKDF ve BSMV (Kredi Vergileri)',
      cat: 'Bankacılık & Kredi',
      desc: 'İhtiyaç, taşıt ve kredi kartı faizlerinin üzerine eklenen %15 Kaynak Kullanımını Destekleme Fonu (KKDF) ve %15 Banka Sigorta Muameleleri Vergisi (BSMV) olmak üzere toplam +%30 vergi yüküdür. Konut kredisinde %0\'dır.',
    },
    {
      term: 'Reel Faiz (Gerçek Getiri)',
      cat: 'Makroekonomi',
      desc: 'Nominal faiz getirisinden enflasyonun arındırılmasıyla kalan gerçek alım gücü artışıdır. Formülü: [(1 + Nominal Faiz) / (1 + Enflasyon)] - 1.',
    },
    {
      term: 'Dezenflasyon',
      cat: 'Makroekonomi',
      desc: 'Fiyatların ucuzlaması değil, fiyat artış hızının (enflasyon oranının) zaman içinde düşmesidir. Örneğin yıllık enflasyonun %65\'ten %38\'e inmesi bir dezenflasyon sürecidir.',
    },
    {
      term: 'Stagflasyon',
      cat: 'Makroekonomi',
      desc: 'Bir ekonomide hem durgunluk/işsizlik (stagnasyon) hem de yüksek enflasyonun aynı anda yaşanmasıdır. Merkez bankaları için çözümü en zor ekonomik kriz türüdür.',
    },
    {
      term: 'CDS (Ülke Kredi Risk Primi)',
      cat: 'Küresel Piyasalar',
      desc: 'Credit Default Swap; bir ülkenin dış borçlarını ödeyememe riskine karşı yapılan sigorta poliçesi maliyetidir. CDS düştükçe ülkeye yabancı yatırım girişi artar ve Eurobond değerleri yükselir.',
    },
    {
      term: 'Eurobond (Döviz Cinsi Tahvil)',
      cat: 'Sabit Getirili Varlıklar',
      desc: 'Devletin veya büyük şirketlerin uluslararası piyasalarda USD veya EUR cinsinden ihraç ettiği uzun vadeli tahvillerdir. Yatırımcısına döviz bazında 6 ayda bir kupon faizi öder.',
    },
    {
      term: 'DCA (Maliyet Ortalaması Stratejisi)',
      cat: 'Portföy Yönetimi',
      desc: 'Dollar Cost Averaging; fiyatın tepede mi dipte mi olduğuna bakmaksızın her ay düzenli (örneğin maaş günü) sabit tutarla alım yaparak ortalama maliyeti dengeleme stratejisidir.',
    },
    {
      term: '72 Kuralı (Bileşik Getiri)',
      cat: 'Finansal Matematik',
      desc: '72 sayısını yıllık reel getiri yüzdesine böldüğünüzde paranızın alım gücünün kaç yılda 2 katına çıkacağını veren pratik formüldür (Örn: %18 reel getiriyle 72/18 = 4 yılda 2\'ye katlanır).',
    },
    {
      term: 'FIRE (Finansal Özgürlük ve Erken Emeklilik)',
      cat: 'Servet Yönetimi',
      desc: 'Yıllık toplam giderinizin 25 katı (veya aylık giderinizin 300 katı) büyüklüğünde bir yatırım portföyüne ulaşarak, portföyün yıllık %4 reel getirisiyle ömür boyu çalışmadan yaşayabilme eşiğidir.',
    },
    {
      term: 'F/K (Fiyat / Kazanç Oranı)',
      cat: 'Borsa & Değerleme',
      desc: 'Bir şirketin borsa piyasa değerinin, son 12 aylık net kârına bölünmesiyle bulunur. Şirketin mevcut kârıyla kendi piyasa değerini kaç yılda amorti ettiğini gösterir.',
    },
    {
      term: 'PD/DD (Piyasa Değeri / Defter Değeri)',
      cat: 'Borsa & Değerleme',
      desc: 'Şirketin borsadaki toplam değerinin, özsermayesine (varlıklarından borçları çıkarıldığında kalan net değerine) oranıdır.',
    },
    {
      term: 'ALTINS1 (Darphane Altın Sertifikası)',
      cat: 'Değerli Madenler',
      desc: 'Darphane tarafından Borsa İstanbul\'da ihraç edilen, her 1 adedi 0,01 gram (100 adedi 1 gram) 24 ayar altına karşılık gelen, banka makası olmadan alınıp satılabilen sertifikadır.',
    },
    {
      term: 'Kira Çarpanı (Gayrimenkul Amortismanı)',
      cat: 'Gayrimenkul',
      desc: 'Satın alınacak konutun fiyatının aylık brüt kira gelirine bölünmesiyle bulunur. 180 - 210 ay (15 - 17,5 yıl) ve altındaki konutlar yatırım açısından cazip kabul edilir.',
    },
    {
      term: 'Çığ (Avalanche) Borç Kapatma Yöntemi',
      cat: 'Borç Yönetimi',
      desc: 'Birden fazla kredi/kart borcu varken tüm borçların asgarisini ödeyip, kalan tüm ekstra parayı en yüksek faiz oranlı borca yönlendirerek toplam faiz maliyetini en aza indiren matematiksel yöntemdir.',
    },
  ];

  // ==========================================================================
  // ANA BAŞLATICI (TÜM SAYFALARDA MENÜ SEKMESİ + MODÜL HESAPLAMALARI)
  // ==========================================================================
  function initEconomyNewsAndAcademy() {
    // 1. Üst menüye "Dünya Haberleri, Borsa & Maaş" sekmesini otomatik ekle
    const navLinksEl = document.querySelector('.nav-links');
    if (navLinksEl && !navLinksEl.querySelector('a[href="ekonomi-haber-akademi.html"]')) {
      const isCurrentPage = window.location.pathname.toLowerCase().includes('ekonomi-haber-akademi.html');
      const link = document.createElement('a');
      link.href = 'ekonomi-haber-akademi.html';
      link.className = `nav-tab ${isCurrentPage ? 'active' : ''}`;
      link.innerHTML = `<img src="logo.svg?v=6" alt="" class="link-mini-logo" /> Dünya Haberleri, Borsa & Maaş`;

      const aiTab = navLinksEl.querySelector('a[href="yek-ai.html"]');
      if (aiTab) {
        navLinksEl.insertBefore(link, aiTab);
      } else {
        navLinksEl.appendChild(link);
      }
    }

    // Eğer ekonomi-haber-akademi.html sayfasında değilsek burada dur
    const newsGridEl = document.getElementById('worldEconomyNewsGrid');
    if (!newsGridEl || newsGridEl.dataset.initialized === 'true') return;
    newsGridEl.dataset.initialized = 'true';

    // ========================================================================
    // MODÜL 1: DÜNYADAN VE TÜRKİYE'DEN EKONOMİ HABERLERİ
    // ========================================================================
    const newsSpotlightBox = document.getElementById('newsSpotlightBox');
    const newsCatBtns = document.querySelectorAll('.news-cat-btn');
    let activeNewsCat = 'all';
    let selectedNewsItem = WORLD_ECONOMY_NEWS[0];

    function renderNewsSpotlight(item) {
      if (!newsSpotlightBox || !item) return;
      newsSpotlightBox.innerHTML = `
        <div class="news-spotlight-card">
          <div class="news-spot-meta">
            <span class="news-flag-badge">${item.regionFlag} ${item.category}</span>
            <span class="news-time-tag">⚡ ${item.timeTag}</span>
          </div>
          <h3>${item.title}</h3>
          <p class="news-spot-summary">${item.summary}</p>
          <div class="news-spot-expert-box">
            <strong>🎙️ Piyasa Uzmanı Yusuf Efe Karagöz Analizi:</strong>
            <p>${item.fullAnalysis}</p>
            <span class="news-impact-pill">${item.impactBadge}</span>
          </div>
        </div>
      `;
    }

    function renderNewsGrid() {
      const filtered =
        activeNewsCat === 'all'
          ? WORLD_ECONOMY_NEWS
          : WORLD_ECONOMY_NEWS.filter((n) => n.category === activeNewsCat);

      newsGridEl.innerHTML = filtered
        .map(
          (n) => `
          <article class="world-news-card ${n.id === selectedNewsItem?.id ? 'active-news-card' : ''}" data-id="${n.id}">
            <div class="world-news-card-top">
              <span>${n.regionFlag} ${n.category}</span>
              <small>${n.timeTag.split('•')[0]}</small>
            </div>
            <h4>${n.title}</h4>
            <p>${n.summary}</p>
            <div class="world-news-card-foot">
              <span class="news-impact-mini">${n.impactBadge}</span>
              <button type="button" class="btn-chip">Analizi Oku →</button>
            </div>
          </article>
        `
        )
        .join('');

      newsGridEl.querySelectorAll('.world-news-card').forEach((card) => {
        card.addEventListener('click', () => {
          const id = parseInt(card.dataset.id, 10);
          const found = WORLD_ECONOMY_NEWS.find((x) => x.id === id);
          if (found) {
            selectedNewsItem = found;
            renderNewsSpotlight(found);
            newsGridEl.querySelectorAll('.world-news-card').forEach((el) => el.classList.remove('active-news-card'));
            card.classList.add('active-news-card');
            newsSpotlightBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      });
    }

    newsCatBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        newsCatBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeNewsCat = btn.dataset.cat || 'all';
        renderNewsGrid();
      });
    });

    renderNewsSpotlight(selectedNewsItem);
    renderNewsGrid();

    // ========================================================================
    // MODÜL 2: BIST 30 & TEFAS TEMETTÜ EMEKLİLİĞİ SİMÜLATÖRÜ
    // ========================================================================
    const divStockSelect = document.getElementById('divStockSelect');
    const divInitialInput = document.getElementById('divInitialInput');
    const divMonthlyInput = document.getElementById('divMonthlyInput');
    const divYearsInput = document.getElementById('divYearsInput');
    const dividendResultBox = document.getElementById('dividendResultBox');
    const bistStocksTableBody = document.getElementById('bistStocksTableBody');

    if (divStockSelect) {
      divStockSelect.innerHTML = BIST_DIVIDEND_ASSETS.map(
        (a) => `<option value="${a.code}">${a.name} (Temettü: %${a.divYield})</option>`
      ).join('');
    }

    function calcDividendProjection(initial, monthly, years, totalRealReturnPct, divYieldPct) {
      const r = totalRealReturnPct / 100 / 12;
      const n = years * 12;
      const finalPortfolio = Math.round(initial * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r));
      const annualDividendIncome = Math.round(finalPortfolio * (divYieldPct / 100));
      const monthlyPassiveIncome = Math.round(annualDividendIncome / 12);
      const totalPrincipalPaid = initial + monthly * n;
      return { finalPortfolio, annualDividendIncome, monthlyPassiveIncome, totalPrincipalPaid };
    }

    function renderDividendSimulator() {
      if (!dividendResultBox) return;
      const code = divStockSelect?.value || 'YEK_SEPET';
      const asset = BIST_DIVIDEND_ASSETS.find((a) => a.code === code) || BIST_DIVIDEND_ASSETS[0];
      const initial = Math.max(0, Number(divInitialInput?.value) || 100000);
      const monthly = Math.max(500, Number(divMonthlyInput?.value) || 15000);
      const years = Math.max(1, Number(divYearsInput?.value) || 10);

      const res = calcDividendProjection(initial, monthly, years, asset.annualRealGrowth, asset.divYield);

      dividendResultBox.innerHTML = `
        <div class="loan-summary-box">
          <span class="loan-bank-pill">${asset.name} • ${years} Yıllık Projeksiyon</span>
          <div class="loan-main-payment">
            <small>${years}. YIL SONUNDA AYLIK PASİF TEMETTÜ MAAŞINIZ (REEL)</small>
            <strong>${fmtTRY(res.monthlyPassiveIncome)} / ay</strong>
            <span>Yıllık Toplam Nakit Temettü: <strong>${fmtTRY(res.annualDividendIncome)} / yıl</strong></span>
          </div>

          <div class="loan-metrics-mini-grid">
            <div class="loan-mini-stat">
              <small>Cebinizden Çıkan Ana Para</small>
              <strong>${fmtTRY(res.totalPrincipalPaid)}</strong>
            </div>
            <div class="loan-mini-stat">
              <small>Ulaşılan Reel Portföy Değeri</small>
              <strong class="text-emerald">${fmtTRY(res.finalPortfolio)}</strong>
            </div>
            <div class="loan-mini-stat">
              <small>Ortalama Temettü Verimi</small>
              <strong class="text-gold">%${asset.divYield}</strong>
            </div>
            <div class="loan-mini-stat">
              <small>Bileşik Kâr Çarpanı</small>
              <strong>${(res.finalPortfolio / Math.max(1, res.totalPrincipalPaid)).toFixed(1)}x Kat</strong>
            </div>
          </div>
          <p class="form-hint" style="color:#cbd5e1;">
            💡 Temettü gelirlerinizi harcamayıp aynı hisseye/fona geri yatırdığınızda (Temettü Geri Yatırımı) bileşik getiri kartopu etkisiyle her yıl katlanarak büyür.
          </p>
        </div>
      `;

      if (bistStocksTableBody) {
        bistStocksTableBody.innerHTML = BIST_DIVIDEND_ASSETS.map((a) => {
          const p = calcDividendProjection(initial, monthly, 10, a.annualRealGrowth, a.divYield);
          const isSelected = a.code === code;
          return `
            <tr class="${isSelected ? 'report-highlight-row' : ''}">
              <td><strong>${a.name}</strong></td>
              <td><small>${a.sector}</small></td>
              <td><strong class="text-gold">%${a.divYield}</strong></td>
              <td><strong class="text-emerald">%${a.annualRealGrowth} (Reel)</strong></td>
              <td><strong>${fmtTRY(p.monthlyPassiveIncome)} / ay</strong><br><small>Portföy: ${fmtTRY(p.finalPortfolio)}</small></td>
              <td>
                <button type="button" class="btn-chip select-bist-btn" data-code="${a.code}">
                  ${isSelected ? '✓ Seçili' : 'Seç & Simüle Et'}
                </button>
              </td>
            </tr>
          `;
        }).join('');

        bistStocksTableBody.querySelectorAll('.select-bist-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            divStockSelect.value = btn.dataset.code;
            renderDividendSimulator();
          });
        });
      }
    }

    [divStockSelect, divInitialInput, divMonthlyInput, divYearsInput].forEach((el) =>
      el?.addEventListener('input', renderDividendSimulator)
    );
    divYearsInput?.addEventListener('change', renderDividendSimulator);
    divStockSelect?.addEventListener('change', renderDividendSimulator);
    renderDividendSimulator();

    // ========================================================================
    // MODÜL 3: MAAŞ BORDROSU (BRÜTTEN NETE) & KIDEM TAZMİNATI HESAPLAYICI
    // ========================================================================
    const payrollGrossInput = document.getElementById('payrollGrossInput');
    const severanceYearsInput = document.getElementById('severanceYearsInput');
    const severanceBonusInput = document.getElementById('severanceBonusInput');
    const payrollSeveranceResultBox = document.getElementById('payrollSeveranceResultBox');

    function renderPayrollAndSeverance() {
      if (!payrollSeveranceResultBox) return;
      const gross = Math.max(25000, Number(payrollGrossInput?.value) || 75000);
      const years = Math.max(1, Number(severanceYearsInput?.value) || 4);
      const bonus = Math.max(0, Number(severanceBonusInput?.value) || 6500);

      // SGK İşçi Payı %14 + İşsizlik Sigortası %1 = %15
      const sgkAndUnemp = Math.round(gross * 0.15);
      const taxBase = gross - sgkAndUnemp;

      // Yılın İlk Ayı (%15 Vergi Dilimi + İstisna) ve Yılın Son Çeyreği (%27 Vergi Dilimi) Net Maaş Karşılaştırması
      const janIncomeTax = Math.max(0, Math.round(taxBase * 0.15 - 3800));
      const janStampTax = Math.max(0, Math.round(gross * 0.00759 - 200));
      const netSalaryJan = gross - sgkAndUnemp - janIncomeTax - janStampTax;

      const octIncomeTax = Math.max(0, Math.round(taxBase * 0.27 - 3800));
      const netSalaryOct = gross - sgkAndUnemp - octIncomeTax - janStampTax;
      const avgMonthlyNet = Math.round((netSalaryJan * 6 + netSalaryOct * 6) / 12);

      // Kıdem Tazminatı Hesabı (Giydirilmiş Brüt Ücret = Brüt Maaş + Yan Haklar; Damga Vergisi Binde 7,59 kesilir)
      const dressedGross = gross + bonus;
      const grossSeverance = dressedGross * years;
      const severanceStampTax = Math.round(grossSeverance * 0.00759);
      const netSeverance = grossSeverance - severanceStampTax;

      payrollSeveranceResultBox.innerHTML = `
        <div class="loan-summary-box">
          <span class="loan-bank-pill">MAAŞ BORDROSU & KIDEM TAZMİNATI BİLANÇOSU</span>
          <div class="loan-main-payment">
            <small>YILLIK ORTALAMA ELE GEÇEN NET MAAŞINIZ</small>
            <strong>${fmtTRY(avgMonthlyNet)} / ay</strong>
            <span>Ocak Net (%15 Dilim): <strong>${fmtTRY(netSalaryJan)}</strong> • Ekim Net (%27 Dilim): <strong>${fmtTRY(netSalaryOct)}</strong></span>
          </div>

          <div class="loan-metrics-mini-grid">
            <div class="loan-mini-stat">
              <small>SGK (%14) + İşsizlik (%1) Kesintisi</small>
              <strong>${fmtTRY(sgkAndUnemp)} / ay</strong>
            </div>
            <div class="loan-mini-stat">
              <small>Vergi Dilimi Maaş Erimesi</small>
              <strong class="text-rose">-${fmtTRY(netSalaryJan - netSalaryOct)} / ay</strong>
            </div>
            <div class="loan-mini-stat">
              <small>Giydirilmiş Brüt Ücret</small>
              <strong>${fmtTRY(dressedGross)}</strong>
            </div>
            <div class="loan-mini-stat">
              <small>${years} Yıllık Net Kıdem Tazminatı</small>
              <strong class="text-gold">${fmtTRY(netSeverance)}</strong>
            </div>
          </div>
          <button type="button" id="syncNetSalaryToBudgetBtn" class="btn btn-secondary" style="width:100%;">
            🔄 Bu Net Maaşı (${fmtTRY(avgMonthlyNet)}) Bütçe Hesapla Sayfasına Aktar
          </button>
        </div>
      `;

      document.getElementById('syncNetSalaryToBudgetBtn')?.addEventListener('click', () => {
        try {
          const raw = localStorage.getItem('yek_dogru_butce_v1');
          const d = raw ? JSON.parse(raw) : {};
          d.incSalary = avgMonthlyNet;
          localStorage.setItem('yek_dogru_butce_v1', JSON.stringify(d));
          const btn = document.getElementById('syncNetSalaryToBudgetBtn');
          if (btn) btn.textContent = `✓ Maaşınız ${fmtTRY(avgMonthlyNet)} Olarak Bütçenize Kaydedildi!`;
        } catch (e) {
          // ignore
        }
      });
    }

    [payrollGrossInput, severanceYearsInput, severanceBonusInput].forEach((el) =>
      el?.addEventListener('input', renderPayrollAndSeverance)
    );
    renderPayrollAndSeverance();

    // ========================================================================
    // MODÜL 4: KREDİ KARTI "ASGARİ ÖDEME TUZAĞI" SİMÜLATÖRÜ
    // ========================================================================
    const ccDebtInput = document.getElementById('ccDebtInput');
    const ccMinRateSelect = document.getElementById('ccMinRateSelect');
    const ccExtraPaymentInput = document.getElementById('ccExtraPaymentInput');
    const ccTrapResultBox = document.getElementById('ccTrapResultBox');

    function renderCcTrapSimulator() {
      if (!ccTrapResultBox) return;
      const debt = Math.max(5000, Number(ccDebtInput?.value) || 85000);
      const minRatio = Number(ccMinRateSelect?.value) || 0.4;
      const extraPay = Math.max(1000, Number(ccExtraPaymentInput?.value) || 12000);

      // Kredi kartı akdi faizi (~%4.25) + %15 KKDF + %15 BSMV = ~%5.525 aylık efektif maliyet
      const effectiveMonthlyRate = 0.0425 * 1.3;

      // Senaryo A: Sadece Asgari Ödenirse
      let balA = debt;
      let totalPaidA = 0;
      let monthsA = 0;
      while (balA > 500 && monthsA < 60) {
        monthsA++;
        const minPay = Math.max(1500, balA * minRatio);
        const pay = Math.min(balA, minPay);
        totalPaidA += pay;
        const remaining = balA - pay;
        balA = remaining * (1 + effectiveMonthlyRate);
      }
      const totalInterestA = Math.max(0, Math.round(totalPaidA + balA - debt));

      // Senaryo B: Çığ Yöntemi (Asgari + Ekstra Ödeme Sabit Disiplin)
      let balB = debt;
      let totalPaidB = 0;
      let monthsB = 0;
      const fixedTargetPay = Math.max(debt * minRatio, debt * 0.25) + extraPay;
      while (balB > 100 && monthsB < 60) {
        monthsB++;
        const pay = Math.min(balB, fixedTargetPay);
        totalPaidB += pay;
        const remaining = balB - pay;
        balB = remaining * (1 + effectiveMonthlyRate);
      }
      const totalInterestB = Math.max(0, Math.round(totalPaidB - debt));
      const savedInterest = Math.max(0, totalInterestA - totalInterestB);

      ccTrapResultBox.innerHTML = `
        <div class="house-sim-card">
          <div class="house-sim-kpi-row">
            <div class="house-sim-kpi">
              <small>Sadece Asgari Ödenirse Faiz Yükü</small>
              <strong class="text-rose">+${fmtTRY(totalInterestA)} (${monthsA} Ay)</strong>
            </div>
            <div class="house-sim-kpi">
              <small>Çığ Yöntemiyle Kapanış Süresi</small>
              <strong class="text-emerald">${monthsB} Ay (Faiz: ${fmtTRY(totalInterestB)})</strong>
            </div>
            <div class="house-sim-kpi">
              <small>Kurtarılan Net Para (Tasarruf)</small>
              <strong class="text-gold">+${fmtTRY(savedInterest)}</strong>
            </div>
          </div>

          <div class="house-sim-verdict verdict-warn">
            <h4>🚨 Asgari Ödeme Tuzağı Analizi (Efektif Aylık Maliyet: %${(effectiveMonthlyRate * 100).toFixed(2)})</h4>
            <p>
              <strong>${fmtTRY(debt)}</strong> kart borcunun sadece <strong>%${minRatio * 100} asgarisini (${fmtTRY(debt * minRatio)})</strong> ödediğinizde, kalan <strong>${fmtTRY(debt * (1 - minRatio))}</strong> borca her ay KKDF ve BSMV vergileri dahil <strong>%${(effectiveMonthlyRate * 100).toFixed(2)}</strong> bileşik faiz işler. Bütçenizden her ay <strong>+${fmtTRY(extraPay)}</strong> ekstra ödeme ekleyerek borcu <strong>${monthsB} ayda</strong> kapatır ve bankaya fazladan <strong>${fmtTRY(savedInterest)}</strong> faiz ödemekten kurtulursunuz!
            </p>
          </div>
        </div>
      `;
    }

    [ccDebtInput, ccMinRateSelect, ccExtraPaymentInput].forEach((el) =>
      el?.addEventListener('input', renderCcTrapSimulator)
    );
    ccMinRateSelect?.addEventListener('change', renderCcTrapSimulator);
    renderCcTrapSimulator();

    // ========================================================================
    // MODÜL 5: FİNANSAL IQ & YATIRIMCI KARAKTER TESTİ
    // ========================================================================
    const quizContainer = document.getElementById('financialIqQuizContainer');
    const quizResultBox = document.getElementById('financialIqResultBox');
    const userAnswers = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    function renderQuiz() {
      if (!quizContainer) return;
      quizContainer.innerHTML = FINANCIAL_IQ_QUESTIONS.map(
        (q) => `
          <div class="fin-iq-question-card">
            <h4>${q.question}</h4>
            <div class="fin-iq-options">
              ${q.options
                .map(
                  (opt, idx) => `
                <label class="fin-iq-opt-label ${userAnswers[q.id] === idx ? 'selected-opt' : ''}">
                  <input type="radio" name="fin_iq_q_${q.id}" value="${idx}" ${userAnswers[q.id] === idx ? 'checked' : ''} />
                  <span>${opt.text}</span>
                </label>
              `
                )
                .join('')}
            </div>
          </div>
        `
      ).join('');

      quizContainer.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
          const qId = parseInt(e.target.name.replace('fin_iq_q_', ''), 10);
          userAnswers[qId] = parseInt(e.target.value, 10);
          renderQuiz();
          renderQuizResult();
        });
      });
    }

    function renderQuizResult() {
      if (!quizResultBox) return;
      let totalScore = 0;
      FINANCIAL_IQ_QUESTIONS.forEach((q) => {
        const chosenIdx = userAnswers[q.id] ?? 0;
        totalScore += q.options[chosenIdx]?.points || 0;
      });

      let badgeTitle = '🏆 Stratejik Portföy Mimarı (YEK Ustası)';
      let badgeDesc =
        'Enflasyon muhasebesi, reel faiz, vergi çarpanları ve DCA (Maliyet Ortalaması) konularında üst düzey finansal okuryazarlığa sahipsiniz. %30 Altın + %30 Hisse Yoğun Fon + %25 Yabancı Teknoloji + %10 Eurobond + %5 Kripto sepetini kusursuz yönetebilirsiniz.';

      if (totalScore < 55) {
        badgeTitle = '🌱 Gelişmekte Olan Yatırımcı (Temel Koruma Odaklı)';
        badgeDesc =
          'Nominal faiz yanılsaması ve kredi vergileri konusunda dikkatli olmalısınız. İlk adım olarak 3 aylık Acil Durum Fonunuzu Para Piyasası Fonunda (PPF) tamamlamanız ve kredi kartı asgari ödeme tuzağından kaçınmanız önerilir.';
      } else if (totalScore < 85) {
        badgeTitle = '⚖️ Dengeli Piyasa Analisti';
        badgeDesc =
          'Sağlam bir finansal temele sahipsiniz. Tasarruflarınızı ay sonunda kalan parayla değil, maaş yattığı gün (ayın 1\'inde) otomatik DCA talimatıyla sepete dağıtarak 100 tam puana ulaşabilirsiniz.';
      }

      quizResultBox.innerHTML = `
        <div class="fin-iq-score-banner">
          <div class="fin-iq-circle">
            <small>FİNANSAL IQ</small>
            <strong>${totalScore} / 100</strong>
          </div>
          <div class="fin-iq-verdict">
            <h4>${badgeTitle}</h4>
            <p>${badgeDesc}</p>
          </div>
        </div>
      `;
    }

    renderQuiz();
    renderQuizResult();

    // ========================================================================
    // MODÜL 6: A'DAN Z'YE FİNANS SÖZLÜĞÜ
    // ========================================================================
    const glossarySearchInput = document.getElementById('glossarySearchInput');
    const glossaryTermsGrid = document.getElementById('glossaryTermsGrid');

    function renderGlossary() {
      if (!glossaryTermsGrid) return;
      const q = (glossarySearchInput?.value || '').toLowerCase().trim();
      const filtered = FINANCIAL_GLOSSARY.filter(
        (item) =>
          !q ||
          item.term.toLowerCase().includes(q) ||
          item.cat.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q)
      );

      glossaryTermsGrid.innerHTML = filtered
        .map(
          (item) => `
          <article class="glossary-card">
            <span class="glossary-cat-pill">${item.cat}</span>
            <h4>📘 ${item.term}</h4>
            <p>${item.desc}</p>
          </article>
        `
        )
        .join('');
    }

    glossarySearchInput?.addEventListener('input', renderGlossary);
    renderGlossary();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEconomyNewsAndAcademy);
  } else {
    initEconomyNewsAndAcademy();
  }

  window.YEK_ECONOMY_NEWS_ACADEMY = {
    WORLD_ECONOMY_NEWS,
    BIST_DIVIDEND_ASSETS,
    FINANCIAL_GLOSSARY,
  };
})();
