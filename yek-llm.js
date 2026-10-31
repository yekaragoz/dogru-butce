// ============================================================================
// YEK AI 4.0 PRO EDITION — FİNANSAL OKURYAZARLIK, PİYASA & BÜTÇE ASİSTANI
// Doğal İnsan Benzeri Sohbet + Üst Düzey Makroekonomi & Finans Zekası
// ============================================================================

(function () {
  const CHAT_HISTORY_KEY = 'yek_ai_v3_chat_history';
  const GEMINI_API_KEY_STORAGE = 'yek_gemini_api_key_v1';
  const MODEL_MODE_KEY = 'yek_ai_v3_model_mode';

  const formatTRY = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(num);
  };

  function getSnapshot() {
    if (typeof computeBudgetSnapshot === 'function' && typeof getStoredBudgetRaw === 'function') {
      return computeBudgetSnapshot(getStoredBudgetRaw());
    }
    return {
      currentSavings: 85000,
      totalIncome: 60000,
      totalExpense: 44000,
      totalNeeds: 32500,
      totalWants: 6000,
      totalDebts: 5500,
      netMonthly: 16000,
      positiveSavings: 16000,
      minEF: 97500,
      maxEF: 195000,
      savingsRate: 27,
      needsRate: 54,
      wantsRate: 10,
      debtRate: 9,
      annualExpense: 528000,
      fireTarget: 13200000,
    };
  }

  function getLiveTickerRates() {
    const parseTicker = (id, fallback) => {
      const el = document.getElementById(id);
      if (!el) return fallback;
      const cleaned = el.textContent.replace(/[₺.\s]/g, '').replace(',', '.');
      const val = parseFloat(cleaned);
      return !isNaN(val) && val > 0 ? val : fallback;
    };
    return {
      USD: parseTicker('tickerUSD', 49.84),
      EUR: parseTicker('tickerEUR', 55.50),
      GBP: parseTicker('tickerGBP', 66.53),
      GAU: parseTicker('tickerGAU', 6500),
      BTC: parseTicker('tickerBTC', 4010000),
    };
  }

  // ==========================================================================
  // 1. ÜST DÜZEY PİYASA EKONOMİSİ & MAKROEKONOMİ EĞİTİM ÇEKİRDEĞİ
  // ==========================================================================
  const MARKET_ECONOMY_KNOWLEDGE_BASE = [
    {
      id: 'market_economy_fundamentals',
      keywords: ['piyasa ekonomisi', 'serbest piyasa', 'arz talep', 'arz ve talep', 'görünmez el', 'adam smith', 'kapitalizm', 'fiyat mekanizması', 'rekabet', 'ekonomi nedir', 'iktisat'],
      render: (s) => `
### 🏛️ Piyasa Ekonomisi (Serbest Piyasa Sistemi) ve Fiyat Mekanizması

**Piyasa ekonomisi**, üretimin, kaynak dağılımının ve fiyatların merkezi bir planlama yerine **arz (üreticiler)** ile **talep (tüketiciler)** arasındaki serbest etkileşimle belirlendiği ekonomik düzendir. **Adam Smith**'in *"Görünmez El"* kavramıyla açıkladığı bu sistemde fiyatlar, ekonomideki kıtlık ve bolluk bilgisini anlık olarak taşıyan birer sinyaldir.

* **Fiyat Mekanizması:** Bir mal veya varlığa talep arttığında fiyat yükselir; bu yükseliş sermayeyi o alana çeker ve arzı artırarak yeni dengeyi kurar.
* **Yaratıcı Yıkım (Schumpeter):** Rekabet ortamında verimsiz şirketler elenirken, teknoloji ve verimlilik üreten şirketler büyür. Yaratıcı yıkım verimliliği artırabilir; ancak hiçbir endeksin veya şirketin sürekli yükseleceğini garanti etmez.
* **Fırsat Maliyeti:** Parayı vadesiz hesapta atıl tutmanın maliyeti, vazgeçilen reel faiz veya fon getirisidir.
* **Sermaye Ortağı Olmak:** Piyasa ekonomisinde sadece maaş kazanıp harcayan kişi sistemin tüketicisidir; aylık **${formatTRY(s.positiveSavings)}** tasarrufunu yatırım fonları ve değerli madenlere dönüştüren kişi ise üretim araçlarının ortağı olur.`
    },
    {
      id: 'macro_central_banks_rates',
      keywords: ['merkez bankası', 'tcmb', 'fed', 'faiz kararı', 'politika faizi', 'parasal sıkılaşma', 'reel faiz', 'taylor kuralı', 'fomc', 'ecb', 'likidite', 'para politikası', 'faiz indirimi', 'faiz artışı'],
      render: (s) => `
### 🏦 Merkez Bankacılığı (TCMB & FED), Para Politikası ve Reel Faiz

Merkez bankaları paranın fiyatını (**politika faizi**) ve piyasadaki likiditeyi yöneterek ekonomik döngüleri belirler:

1. **Parasal Sıkılaşma (Faiz Artış Dönemi):** Sıkılaşma kredi koşullarını zorlaştırıp talep ve enflasyon beklentilerini zaman içinde etkileyebilir. Kısa vadeli faiz araçlarının getirisi yükselebilir; ancak vergi, ücret ve enflasyon sonrası reel sonuç garanti değildir.
2. **Parasal Gevşeme (Faiz İndirim Dönemi):** Piyasa getirileri düşerse mevcut sabit kuponlu tahvillerin fiyatı genellikle yükselir; vade, kredi riski ve beklentiler sonucu değiştirebilir. Varlıklar arası sermaye akışı otomatik veya tek yönlü değildir.

#### Reel Faiz Denklemi (Fisher Formülü)
Nominal faiz tek başına yanıltıcıdır; asıl getiri enflasyondan arındırılmış **Reel Faizdir**:

$$\\text{Reel Faiz} = \\frac{1 + \\text{Nominal Faiz}}{1 + \\text{Beklenen Enflasyon}} - 1$$

Örnek varsayımında yıllık bileşik getiri **%52**, beklenen enflasyon **%38** ise reel getiri **yaklaşık %10,14** olur; bu güncel piyasa verisi değildir.`
    },
    {
      id: 'inflation_economics',
      keywords: ['enflasyon', 'tüfe', 'üfe', 'alım gücü', 'stagflasyon', 'deflasyon', 'dezenflasyon', 'hayat pahalılığı', 'enflasyondan korunma', 'enflasyon nedir'],
      render: (s) => `
### 🔥 Enflasyon, Dezenflasyon ve Stagflasyon Dinamikleri

* **Talep Enflasyonu:** Para arzı ve kredi büyümesinin üretimden hızlı artmasıdır ($M \\times V = P \\times Y$).
* **Maliyet Enflasyonu:** Döviz kuru geçişkenliği, enerji ve hammadde maliyetlerinin üretim fiyatlarını yukarı itmesidir.
* **Dezenflasyon:** Fiyatların düşmesi değil, **enflasyon artış hızının yavaşlamasıdır**. Tahvil ve hisse etkisi; beklenen faiz, risk primi, büyüme, kârlar ve piyasa fiyatlamasına bağlıdır; otomatik getiri sonucu çıkarılamaz.
* **Stagflasyon:** Ekonomik durgunluk (resesyon) ile yüksek enflasyonun aynı anda yaşanmasıdır. Stagflasyon farklı varlıkları farklı etkiler; altın, emtia veya şirket hisseleri için kesin koruma ya da pozitif getiri sözü verilemez.`
    },
    {
      id: 'stock_valuation_bist_global',
      keywords: ['temel analiz', 'f/k', 'pd/dd', 'fd/favök', 'bilanço', 'hisse', 'hisse senedi', 'hisse değerleme', 'bist', 'thyao', 'tüpraş', 'tuprs', 'froto', 'ford', 'aselsan', 'asels', 'bimas', 'eregl', 'kchol', 's&p 500', 'nasdaq', 'temettü', 'serbest nakit akışı', 'borsa analizi', 'ucuz hisse'],
      render: (s) => `
### 📊 Borsa Değerleme Çarpanları (F/K, PD/DD, FD/FAVÖK, ROE)

Çarpanlar şirketi araştırmaya yardımcı olur; sektör, sermaye yapısı, döngü ve muhasebe farklılıkları nedeniyle şirketleri tek başına sıralamaz:

* **F/K (Fiyat / Kazanç — P/E):** Piyasa değerini net kâra oranlar. Tek seferlik kâr ve ekonomik döngü sonucu bozabilir; zarar yazan şirkette anlamlı olmayabilir.
* **PD/DD (Piyasa Değeri / Defter Değeri — P/B):** Piyasa değerini defter özkaynağıyla karşılaştırır. Varlık kalitesi ve sürdürülebilir özkaynak kârlılığıyla birlikte yorumlanmalıdır.
* **FD/FAVÖK (EV/EBITDA):** Firma değerini faiz, vergi ve amortisman öncesi kârla karşılaştırır. Yatırım harcaması, işletme sermayesi ve net borç yükünü tek başına göstermez.
* **ROE (Özsermaye Kârlılığı):** Net kârı özkaynağa oranlar. Borçluluk, kâr kalitesi, büyüme ve değerleme birlikte incelenmelidir; düşük çarpan veya yüksek ROE tek başına ucuzluk ya da getiri garantisi değildir.
* **Tamamlayıcı inceleme:** Nakit akışı, borç vadesi, marj eğilimi, sermaye ihtiyacı, sektör yapısı, yönetim ve değerlemeyi aynı döneme ait güncel raporlardan kontrol et.`
    },
    {
      id: 'bonds_eurobond_cds',
      keywords: ['eurobond', 'cds', 'tahvil', 'bono', 'verim eğrisi', 'yield curve', 'kupon faizi', 'ülke risk primi', 'sabit getirili'],
      render: (s, rates) => `
### 💶 Eurobond, CDS Risk Primi ve Tahvil Fiyatlaması

Döviz nakit, ilgili para birimindeki enflasyon nedeniyle zamanla alım gücü kaybedebilir. Eurobond ve yabancı fonlar farklı kur, faiz, kredi, fiyat oynaklığı, ücret ve vergi riskleri taşır; reel getiri garantisi vermez.

* **CDS (Ülke Kredi Risk Primi):** Ülke kredi riskine ilişkin piyasa göstergelerinden biridir; tek başına tahvilin güvenliğini veya getirisini belirlemez. Eurobond'da kredi, kur, faiz, likidite ve vade risklerini birlikte değerlendir.
* **Faiz - Tahvil Fiyatı İlişkisi:** Piyasa getirileri ile mevcut sabit kuponlu tahvil fiyatları çoğunlukla ters yönlü hareket eder. Vade, kredi riski, kur ve beklentiler nedeniyle yatırımcının toplam sonucu farklılaşabilir.`
    },
    {
      id: 'behavioral_finance_psychology',
      keywords: ['davranışsal finans', 'psikoloji', 'fomo', 'panik satışı', 'kahneman', 'zarardan kaçınma', 'yatırımcı psikolojisi', 'duygusal', 'sabır'],
      render: (s) => `
### 🧠 Davranışsal Finans ve Yatırımcı Psikolojisi

Daniel Kahneman'ın *Beklenti Teorisi*'ne göre yatırımcıların en büyük düşmanı piyasa değil, kendi duygusal tepkileridir:

* **Kayıptan Kaçınma (Loss Aversion):** Kayıptan kaçınma, yatırımcıyı zarardaki varlığı gereğinden uzun tutmaya veya kazançlı pozisyonu erken kapatmaya itebilir; bu davranış herkeste aynı ölçüde görülmez.
* **FOMO (Fırsatı Kaçırma Korkusu):** Varlık fiyatları zirveye ulaştığında kalabalıkla birlikte en tepeden alım yapma hatasıdır.
* **Düzenli Alım:** Önceden belirlenmiş aralıklarla yatırım yapmak zamanlama baskısını azaltabilir; zararı veya duygusal kararları ortadan kaldırmaz. Tutarın bütçeye ve hedefe uygunluğu ayrıca değerlendirilmelidir.`
    },
    {
      id: 'personal_budget_framework',
      keywords: ['bütçe', 'bütçe planı', '50/30/20', 'gelir', 'gider', 'gelir gider planı', 'gelir-gider planı', 'aylık nakit akışı', 'nakit akışı', 'aylık harcama planı', 'harcama', 'harcama planı', 'gider planı', 'kira', 'tasarruf', 'tasarruf oranı', 'birikim', 'acil', 'acil durum fonu', 'acil rezerv', 'nakit tamponu', 'mevduat', 'para piyasası', 'ppf', 'likit'],
      render: (s) => [
        '### 📒 Kişisel Bütçe ve Nakit Akışı Planı',
        '',
        'Bütçe, geçmiş harcamaları sınıflandırmanın yanında gelecek gelir ve giderleri önceden eşleştiren bir karar planıdır. Önce aylık net geliri, zorunlu giderleri, borç ödemelerini ve düzensiz yıllık giderleri ayrı yaz.',
        '',
        '- **Mevcut uygulama verisi:** Aylık gelir ' + formatTRY(s.totalIncome) + ', gider ' + formatTRY(s.totalExpense) + ', net fark ' + formatTRY(s.netMonthly) + '. Bu değerlerin kişisel ve güncel olduğunu doğrula; örnek ya da eski kayıt olabilir.',
        '- **Kategoriler:** Barınma, temel faturalar, gıda ve ulaşım gibi zorunlu giderleri; isteğe bağlı harcamaları; borç ödemelerini; tasarruf ve hedef birikimlerini birbirinden ayır.',
        '- **50/30/20:** İhtiyaç, istek ve tasarruf için başlangıç kontrol listesi olabilir; yüksek kira, aile sorumlulukları, düzensiz gelir veya borçlar varsa oranları gerçekçi biçimde uyarla.',
        '- **Acil durum rezervi:** Birkaç aylık zorunlu gideri kolay erişilen ve riskini bildiğin araçlarda tutmayı değerlendir. Uygun miktar gelir istikrarına, bakmakla yükümlü olunan kişilere ve sigorta kapsamına göre değişir.',
        '- **Rutin:** Maaş günü otomatik birikim talimatı oluştur; haftalık harcamaları takip et ve ay sonunda plana göre sapmaları düzelt.',
        '',
        'İyi bir ilk adım, son 2-3 aylık ekstreleri inceleyip sabit, değişken ve düzensiz giderleri ayırmaktır.'
      ].join('\n')
    },
    {
      id: 'debt_repayment_strategy',
      keywords: ['borç', 'kredi', 'kart', 'ek hesap', 'kredi kartı borcu', 'kart borcumu', 'borç kapatma', 'borç planı', 'borçlarımı nasıl öderim', 'borçları hangi sırayla', 'borç çığ yöntemi', 'borç kartopu', 'borç faizi', 'asgari ödeme', 'kmh'],
      render: () => [
        '### 💳 Borçları Önceliklendirme',
        '',
        'Önce her borç için kalan ana para, efektif yıllık maliyet, ücretler, asgari ödeme ve son ödeme tarihini aynı tabloda topla. Sözleşmedeki oranları kullan; kampanya ve gecikme koşulları değişebilir.',
        '',
        '- **Ödemeyi aksatma:** Mümkünse tüm borçların zorunlu asgari taksitlerini ve temel yaşam giderlerini karşıla.',
        '- **Çığ yöntemi:** Asgarilerden sonra kalan ek ödemeyi en yüksek efektif maliyetli borca yönlendir. Koşullar eşitse, toplam faiz maliyetini düşürmeye yardımcı olur.',
        '- **Kartopu yöntemi:** En küçük bakiyeyi önce kapatmak motivasyonu artırabilir; toplam faiz maliyeti çığ yönteminden yüksek olabilir.',
        '- **Karşılaştırma:** Yüksek maliyetli borcu kapatmanın kesinleşen tasarrufunu, getirisi belirsiz yatırım beklentisiyle karşılaştır; borç maliyetini görmezden gelerek kaldıraçlı risk alma.',
        '',
        'Erken ödeme ücreti, yapılandırma veya ödeme güçlüğü varsa karar vermeden önce kredi sözleşmesini ve bankanın güncel koşullarını kontrol et.'
      ].join('\n')
    },
    {
      id: 'portfolio_construction',
      keywords: ['portföy', 'varlık dağılımı', 'portföy dağılımı', 'portföyümü çeşitlendir', 'yatırım önerisi', 'yatırım tavsiyesi', 'yatırım yap', 'yatırım dağılımı', 'birikim', 'elimde', 'çeşitlendirme', 'diversifikasyon', 'risk toleransı', 'risk profili', 'portföy dengeleme', 'yeniden dengeleme'],
      render: () => [
        '### 🧭 Portföy Kurma: Hedef, Vade ve Risk',
        '',
        'Tek bir ideal portföy yüzdesi yoktur. Önce hedefin tutarını ve tarihini, ara dönemde nakde ihtiyaç olup olmayacağını, gelir istikrarını, borçları ve geçici kayıpları taşıma kapasiteni netleştir.',
        '',
        '- **Vade ve likidite:** Yakın zamanda kullanılacak parayı uzun vadeli veya sert dalgalanan varlıklara bağlama; her hedefi kendi zaman çizelgesiyle değerlendir.',
        '- **Risk kapasitesi ile risk isteği:** Dalgalanmaya katlanma isteği, zararı finansal olarak taşıyabilme kapasitesiyle aynı şey değildir. Düşük olan sınırı dikkate al.',
        '- **Çeşitlendirme:** Varlık sınıfı, sektör, ihraççı, ülke ve para birimi boyunca yoğunlaşmayı incele. Birkaç farklı fon almak, aynı hisseleri tutuyorsa gerçek çeşitlendirme sağlamayabilir.',
        '- **Dengeleme:** Hedef dağılımdan sapma için önceden bir eşik veya takvim belirle; vergi, alım-satım maliyeti ve likiditeyi hesaba kat.',
        '- **Geçmiş getiri:** Tek başına geleceği göstermez. Ücret, risk, düşüş, kıyas ölçütü ve zaman aralığını beraber incele.',
        '',
        'Çeşitlendirme belirli bir şirket veya varlığa özgü riski azaltabilir; piyasa genelindeki kaybı ortadan kaldırmaz. Buradaki çerçeve kişiye özel al-sat talimatı değildir.'
      ].join('\n')
    },
    {
      id: 'fund_due_diligence',
      keywords: ['fon', 'tefas', 'stopaj', 'yatırım fonu seçimi', 'fon seçimi', 'fon karşılaştırma', 'fon gider oranı', 'fon yönetim ücreti', 'yatırımcı bilgi formu', 'fon risk değeri', 'tefas fonu', 'para piyasası fonu', 'ppf riski', 'hisse', 'borsa', 'bist', 'temettü', 'vergi'],
      render: () => [
        '### 📑 Yatırım Fonu İnceleme Kontrol Listesi',
        '',
        'Fon adındaki kategori tek başına yeterli değildir. Güncel yatırımcı bilgi formu ve izahnameyi okuyup şu başlıkları karşılaştır:',
        '',
        '- **Amaç ve portföy:** Fonun stratejisi, varlık dağılımı, yoğunlaşma sınırları ve kıyas ölçütü.',
        '- **Risk:** Risk-getiri göstergesi, oynaklık, düşüşler, kur ve faiz hassasiyeti; geçmiş performans geleceği garanti etmez.',
        '- **Maliyet:** Yönetim ücreti, toplam gider oranı, komisyonlar ve alım-satım makası.',
        '- **İşleyiş:** Alım-satım saatleri, valör, nakde dönüş süresi ve varsa işlem kısıtları.',
        '- **Vergi:** Vergi uygulaması fon türü, yatırımcı ve yürürlükteki mevzuata göre değişebilir; güncel oranı teyit et.',
        '',
        'Para piyasası fonu banka mevduatı değildir ve anapara/getiri garantisi olarak sunulmamalıdır. Kısa vadeli faiz ve likidite riski dahil fonun açıklanan risklerini incele.'
      ].join('\n')
    },
    {
      id: 'macro_scenario_analysis',
      keywords: ['makro senaryo', 'faiz senaryosu', 'faizler düşerse ne olur', 'faizler yükselirse ne olur', 'kur senaryosu', 'enflasyon senaryosu', 'makroekonomik analiz', 'ekonomik senaryo'],
      render: () => [
        '### 🌐 Makroekonomi İçin Senaryo Analizi',
        '',
        'Bir veri veya merkez bankası kararı varlık fiyatını tek başına belirlemez. Beklentiler, kararın ne kadar sürpriz olduğu, büyüme, risk primi, kur geçişkenliği ve küresel koşullar birlikte etkili olur; aktarım zaman alabilir.',
        '',
        '- **Baz senaryo:** Mevcut beklentiler sürerse hangi kanallar etkilenir?',
        '- **Yukarı ve aşağı yönlü risk:** Enflasyon, faiz, kur veya büyüme beklenenden farklı olursa hangi varsayım bozulur?',
        '- **Varlık kanalları:** Tahvil fiyatı ile piyasa getirisi çoğunlukla ters hareket eder; hisse, kur ve emtia etkisi şirket kârı, risk primi ve başlangıç fiyatlamasına bağlıdır.',
        '- **Belirsizlik:** Senaryolar tahmin veya kesin sonuç değildir. Güncel veri yoksa bunu belirt ve sayı uydurma.',
        '',
        'Karar verirken tek bir tahmin yerine olası sonuçları, vade ihtiyacını ve kayıp senaryosunu karşılaştır.'
      ].join('\n')
    },
    {
      id: 'crypto_risk_management',
      keywords: ['bitcoin', 'btc', 'kripto', 'altcoin', 'coin', 'kripto güvenliği', 'kripto riski', 'bitcoin riski', 'kripto portföy', 'kripto kaldıraç', 'kripto dolandırıcılık', 'özel anahtar'],
      render: () => [
        '### ₿ Kripto Varlıklarda Risk ve Güvenlik',
        '',
        'Kripto varlıklar yüksek oynaklık, platform/karşı taraf riski, saklama hatası, siber saldırı, likidite ve düzenleme riski taşıyabilir. Değer tamamen kaybolabilir; geçmiş fiyat artışı güvenilir getiri beklentisi değildir.',
        '',
        '- Yalnızca kaybı temel giderlerini ve borç ödemelerini bozmayacak tutarı riske at.',
        '- Kaldıraç, borçla alım, bilinmeyen token, garanti getiri ve acil karar baskısını kırmızı bayrak say.',
        '- Saklama yöntemini, erişim kurtarma planını, platformun koşullarını ve çekim likiditesini önceden araştır.',
        '- Site içindeki yüzde sınırını evrensel yatırım kuralı gibi sunma; uygun risk limiti kişisel mali duruma bağlıdır.'
      ].join('\n')
    },
    {
      id: 'gold_and_currency_risk',
      keywords: ['altın', 'altin', 'gümüş', 'gumus', 'döviz', 'kur', 'dolar', 'euro', 'sterlin', 'gram altın', 'altın fonu', 'altın sertifikası'],
      render: () => [
        '### 🪙 Altın, Döviz ve Değerli Madenleri Karşılaştırma',
        '',
        'Altın, döviz, fon ve sertifika aynı ürün değildir. Fiyatı etkileyen unsur, saklama ve işlem yapısı, likidite, ücret/makas, vergi ve karşı taraf riski değişebilir.',
        '',
        '- **Hedef:** Paranın hangi tarihte ve hangi para biriminde kullanılacağını belirle; kısa vadeli zorunlu gideri fiyatı oynak varlığa bağlama.',
        '- **Ürün yapısı:** Fiziki altın, banka hesabı, borsada işlem gören sertifika ve yatırım fonunun sahiplik, saklama, işlem saati ve masraf koşullarını karşılaştır.',
        '- **Kur riski:** Döviz varlığı yerel para hareketine karşı farklı sonuç verebilir; kendi para birimindeki enflasyon ve kur oynaklığı da reel sonucu etkiler.',
        '- **Portföy etkisi:** Değerli madenler her dönemde enflasyona karşı koruma veya pozitif getiri sağlamaz. Tek bir varlığa yoğunlaşma riskini değerlendir.',
        '',
        'Güncel fiyat ve vergi koşullarını işlem öncesinde güvenilir, resmi veya sağlayıcının güncel belgesinden doğrula.'
      ].join('\n')
    },
    {
      id: 'compound_return_framework',
      keywords: ['bileşik getiri', '72 kuralı', 'fire', 'finansal özgürlük', 'emekli', 'emeklilik hedefi', 'emeklilik portföyü', 'birikim hedefi', 'zengin'],
      render: (s) => [
        '### 📈 Bileşik Getiri ve Uzun Vadeli Hedef Planı',
        '',
        'Bileşik getiri, anapara ile daha önce biriken getirinin sonraki dönemlerde birlikte büyümesidir. Sonuç; katkı tutarı, süre, net getiri, ücret, vergi ve katkı zamanlamasına bağlıdır.',
        '',
        '- **72 kuralı:** Yaklaşık ikiye katlanma süresi = 72 / varsayılan yıllık getiri yüzdesi. Bu kaba hesaplama nominal ya da reel varsayıma göre farklı anlam taşır ve getiri tahmini değildir.',
        '- **Reel hedef:** Enflasyon etkisini ayır; bugünün parasıyla hedef tutarı ve aylık katkının satın alma gücünü aynı birimde tut.',
        '- **Senaryo:** Düşük, orta ve yüksek varsayım kullan; katkı artışı, vergi/ücret ve olumsuz getiri dönemlerini ayrıca göster.',
        '- **FIRE yaklaşımı:** Yıllık harcamanın sabit bir katını kesin emeklilik eşiği sayma. Harcama, yaşam süresi, vergi, sağlık, varlık dağılımı ve çekim oranı sonucu değiştirir.',
        '',
        'Uygulama tablosunda aylık net fark ' + formatTRY(s.netMonthly) + ' görünüyor; hesaplamadan önce verinin güncel olduğunu doğrula.'
      ].join('\n')
    },
    {
      id: 'goal_financing_plan',
      keywords: ['ev almak', 'ev al', 'ev peşinatı', 'konut', 'araba', 'otomobil', 'araç', 'peşinat', 'konut yatırımı', 'araba hedefi'],
      render: (s) => [
        '### 🏠 Konut, Araç ve Peşinat Hedefi',
        '',
        'Büyük bir hedefi değerlendirmek için toplam bedeli, peşinatı, hedef tarihini, düzenli ödeme kapasitesini ve satın alma sonrası bakım/işletme giderlerini birlikte hesapla.',
        '',
        '- **Nakit akışı:** Alım sonrası taksit, sigorta, bakım, aidat ve diğer zorunlu giderlerin bütçede kalıcı etkisini ekle.',
        '- **Vade ve likidite:** Yakın tarihte kullanılacak peşinatı, sert fiyat dalgalanmasına açık bir varlığa bağlama riskini değerlendir.',
        '- **Konut:** Kira çarpanı tek başına karar ölçütü değildir; boş kalma, bakım, vergi, finansman maliyeti, satış süresi ve bölge riski net kira getirisine eklenir.',
        '- **Araç:** İş veya yaşam için gerekliliği ile değer kaybı, yakıt, bakım ve sigorta maliyetlerini karşılaştır.',
        '',
        'Uygulama tablosundaki aylık net fark ' + formatTRY(s.netMonthly) + ' görünmektedir. Hedef tarihini ve alım sonrası masrafları doğrulamadan kesin sepet ya da yüzde belirleme.'
      ].join('\n')
    }
  ];

  // ==========================================================================
  // 2. DİNAMİK MATEMATİK, KREDİ, KUR VE EVRENSEL SORU ÇÖZÜMLEYİCİ (GENEL ZEKA)
  // ==========================================================================
  function evaluateMathOrFinancialQuery(questionRaw, s, rates) {
    const q = questionRaw.toLowerCase().trim();

    // 1. DÖRT İŞLEM VE MATEMATİKSEL İFADELER (Örn: "250 * 48 kaç eder", "150000 / 12")
    const simpleMathMatch = q.match(/^(\d+(?:[.,]\d+)?)\s*([+\-*/x÷])\s*(\d+(?:[.,]\d+)?)/);
    if (simpleMathMatch) {
      const a = parseFloat(simpleMathMatch[1].replace(/\./g, '').replace(',', '.'));
      const op = simpleMathMatch[2];
      const b = parseFloat(simpleMathMatch[3].replace(/\./g, '').replace(',', '.'));
      let res = 0;
      if (op === '+') res = a + b;
      else if (op === '-') res = a - b;
      else if (op === '*' || op === 'x') res = a * b;
      else if ((op === '/' || op === '÷') && b !== 0) res = a / b;
      return `İşlemin sonucu: **${res.toLocaleString('tr-TR', { maximumFractionDigits: 4 })}**`;
    }

    // 2. DÖVİZ & ALTIN ÇEVİRME SORULARI (Örn: "500 dolar kaç tl", "25 gram altın ne kadar", "1000 euro kaç lira")
    const fxCalcMatch = q.match(/(\d+(?:[.,]\d+)?)\s*(bin|milyon)?\s*(dolar|usd|\$|euro|eur|€|sterlin|gbp|gram altın|altın|çeyrek altın|ons)/);
    if (fxCalcMatch) {
      let amt = parseFloat(fxCalcMatch[1].replace(/\./g, '').replace(',', '.'));
      if (fxCalcMatch[2] === 'bin') amt *= 1000;
      if (fxCalcMatch[2] === 'milyon') amt *= 1000000;
      const unit = fxCalcMatch[3];
      if (unit.includes('dolar') || unit === 'usd' || unit === '$') {
        return 'Sayfa göstergesinde USD/TRY yaklaşık 1 USD = ₺' + rates.USD.toFixed(2) + ' (zaman damgası doğrulanmadı). ' + amt.toLocaleString('tr-TR') + ' Dolar yaklaşık ' + formatTRY(amt * rates.USD) + ' eder.';
      }
      if (unit.includes('euro') || unit === 'eur' || unit === '€') {
        return 'Sayfa göstergesinde EUR/TRY yaklaşık 1 EUR = ₺' + rates.EUR.toFixed(2) + ' (zaman damgası doğrulanmadı). ' + amt.toLocaleString('tr-TR') + ' Euro yaklaşık ' + formatTRY(amt * rates.EUR) + ' eder.';
      }
      if (unit.includes('sterlin') || unit === 'gbp') {
        return 'Sayfa göstergesinde GBP/TRY yaklaşık 1 GBP = ₺' + rates.GBP.toFixed(2) + ' (zaman damgası doğrulanmadı). ' + amt.toLocaleString('tr-TR') + ' Sterlin yaklaşık ' + formatTRY(amt * rates.GBP) + ' eder.';
      }
      if (unit.includes('çeyrek')) {
        const ceyrekRate = rates.GAU * 1.63;
        return 'Sayfa altın göstergesine göre ' + amt.toLocaleString('tr-TR') + ' adet çeyrek altın yaklaşık ' + formatTRY(amt * ceyrekRate) + ' eder; gerçek işlem fiyatı makas ve ürüne göre değişir.';
      }
      if (unit.includes('altın')) {
        return 'Sayfa göstergesinde gram altın yaklaşık ₺' + rates.GAU.toLocaleString('tr-TR') + ' (zaman damgası doğrulanmadı). ' + amt.toLocaleString('tr-TR') + ' gram yaklaşık ' + formatTRY(amt * rates.GAU) + ' eder.';
      }
    }

    // 3. YÜZDE HESAPLAMA SORULARI
    const pctOfMatch = q.match(/(\d+(?:[.,]\d+)?)\s*(bin|milyon)?\s*(?:tl'nin|liranın|in|ın|un|ün|nin|nın)?\s*%\s*(\d+(?:[.,]\d+)?)/);
    if (pctOfMatch) {
      let base = parseFloat(pctOfMatch[1].replace(/\./g, '').replace(',', '.'));
      if (pctOfMatch[2] === 'bin') base *= 1000;
      if (pctOfMatch[2] === 'milyon') base *= 1000000;
      const pct = parseFloat(pctOfMatch[3].replace(',', '.'));
      const result = (base * pct) / 100;
      return `### 🧮 Hesaplama Sonucu
* **Ana Tutar:** ${formatTRY(base)}
* **Yüzde Oranı (%${pct}):** **${formatTRY(result)}**
* **Eklenmiş Hali:** ${formatTRY(base + result)} | **İndirimli Hali:** ${formatTRY(base - result)}`;
    }

    // 4. YILLIK SERVET & BİLEŞİK GETİRİ SİMÜLASYONU
    const yearMatch = q.match(/(\d+)\s*yıl(?:da|sonra|içinde|lık)/);
    if (yearMatch && (q.includes('ne olur') || q.includes('ne kadar') || q.includes('birikir') || q.includes('katlanır') || q.includes('getiri') || q.includes('ulaşır') || q.includes('simülasyon') || q.includes('servet'))) {
      const years = Math.min(50, Math.max(1, parseInt(yearMatch[1], 10)));
      const principal = s.currentSavings;
      const monthly = s.positiveSavings > 0 ? s.positiveSavings : 10000;

      const calcFV = (p, m, y, annualRealRate) => {
        const monthlyRate = Math.pow(1 + annualRealRate, 1 / 12) - 1;
        const months = y * 12;
        const contributions = monthlyRate === 0
          ? m * months
          : m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        return Math.round(p * Math.pow(1 + monthlyRate, months) + contributions);
      };

      const totalInvested = principal + monthly * years * 12;
      const fvLow = calcFV(principal, monthly, years, 0);
      const fvMiddle = calcFV(principal, monthly, years, 0.05);
      const fvHigh = calcFV(principal, monthly, years, 0.10);

      return [
        '### 📈 ' + years + ' Yıllık Bileşik Getiri Senaryosu',
        '',
        'Başlangıç sermayesi ' + formatTRY(principal) + ' ve aylık katkı ' + formatTRY(monthly) + ' varsayılmıştır. Tutarlar bugünkü alım gücüyle gösterilir; aylık katkının reel olarak sabit kaldığı ve vergi/ücret olmadığı kabul edilmiştir.',
        '',
        '| Varsayımsal yıllık reel getiri | Yatırılan toplam | Dönem sonu senaryo değeri |',
        '| :--- | ---: | ---: |',
        '| %0 | ' + formatTRY(totalInvested) + ' | ' + formatTRY(fvLow) + ' |',
        '| %5 | ' + formatTRY(totalInvested) + ' | ' + formatTRY(fvMiddle) + ' |',
        '| %10 | ' + formatTRY(totalInvested) + ' | ' + formatTRY(fvHigh) + ' |',
        '',
        'Bunlar tahmin veya garanti değil, farklı varsayımların matematiksel sonucudur. Gerçek getiri negatif olabilir; enflasyon, vergi, ücret, katkı tutarı ve zamanlama sonucu değiştirir.'
      ].join('\n');
    }

    return null;
  }

  // ==========================================================================
  // 2B. KAPSAMLI DİYALOG, BAĞLAM HAFIZASI, KİŞİSEL SOHBET VE EVRENSEL ZEKA MOTORU
  // (Kullanıcıyla tıpkı gerçek bir yapay zeka / insan dostu gibi doğal konuşur)
  // ==========================================================================
  function generateUniversalSmartAnswer(questionRaw, s, rates, chatHistory = []) {
    const q = questionRaw.toLowerCase().trim();
    const lastBotMsg = [...(chatHistory || [])].reverse().find((m) => m.role === 'assistant')?.content || '';

    // 1. KISA ONAY, TEPKİ VE GÜNLÜK DİYALOG İFADELERİ ("abi", "kanka", "aynen", "peki", "bence de", "haklısın", "güzel", "mantıklı")
    if (/^(abi|kanka|dostum|hocam|reis|kardeşim|ya|peki|aynen|bence de|haklısın|doğru|mantıklı|güzel|süper|harika|anladım|tamamdır|eyvallah|vay be|hmm|hımm|öyle mi|gerçekten mi)\b/.test(q) && q.length < 38) {
      if (q.includes('peki') || q.includes('öyle mi') || q.includes('gerçekten mi')) {
        return `Devam edelim. Hangi kısmı açmamı istersin: kullandığım varsayım, rakamsal örnek ya da pratik adımlar?`;
      }
      return `Kesinlikle, aynı noktadayız! Aklına takılan veya "şunu nasıl yaparız" dediğin ne varsa doğrudan yaz, birlikte bakalım.`;
    }

    // 2. BAĞLAMSAL DEVAM SORULARI ("neden?", "nasıl yani?", "biraz daha açar mısın?", "örnek ver", "emin misin?")
    if (
      q === 'neden' ||
      q === 'neden?' ||
      q === 'niye' ||
      q === 'niye?' ||
      q.includes('nasıl yani') ||
      q.includes('biraz daha aç') ||
      q.includes('detay ver') ||
      q.includes('örnek ver') ||
      q.includes('daha detaylı') ||
      q.includes('emin misin')
    ) {
      if (lastBotMsg) {
        return 'Az önceki başlığı biraz daha açalım. Uygulama tablosunda birikim ' +
          formatTRY(s.currentSavings) + ' ve aylık net fark ' + formatTRY(s.positiveSavings) +
          ' görünüyor; bunların güncel ve sana ait olduğunu doğrula. Önce hedef vadesini, ara dönemde nakit ihtiyacını ve geçici kayıp taşıma kapasiteni netleştir. Ardından borç maliyeti, rezerv, çeşitlendirme, ücret ve vergiyi ayrı değerlendir. Sabit portföy yüzdeleri herkes için uygun değildir.';
      }
      return `Bunu somut bir örnekle açıklayayım: Ekonomide ve günlük kararlarda tek bir faktöre bağlı kalmak riski büyütür. O yüzden her zaman hem güvenlik tamponunu (nakit akışını) korumak hem de büyüme fırsatlarına kademeli girmek en sağlam sonucu verir.`;
    }

    // 3. KİŞİSEL / FELSEFİ / MİZAHİ / GÜNLÜK HAYAT SORULARI ("canım sıkılıyor", "ne önerirsin", "espri yap", "şaka", "film", "oyun", "futbol", "hava", "yemek", "kahve")
    if (q.includes('canım sıkıl') || q.includes('sıkıldım') || q.includes('moralim') || q.includes('yoruldum') || q.includes('bunaldım')) {
      return `Çok normal, bazen tempo ve gündem insanı gerçekten yorabiliyor. Kendine bir kahve veya çay yapıp 15-20 dakika ekrandan ve stresten uzaklaşmak zihni çok iyi sıfırlıyor. İstersen kafanı dağıtmak için teknoloji, sinema, futbol veya bambaşka bir konudan da muhabbet edebiliriz.`;
    }

    if (q.includes('espri') || q.includes('şaka') || q.includes('güldür') || q.includes('komik')) {
      return `Finans dünyasından küçük bir espri: *"Uzun vadeli yatırımcı kime denir? Kısa vadeli al-sat yapıp terste kalınca uzun vadeli olduğunu söyleyene!"* 😄`;
    }

    if (q.includes('film') || q.includes('dizi') || q.includes('izle')) {
      return `Hem sürükleyici hem de vizyon katan birkaç efsane film/dizi önerisi bırakayım:\n` +
        `* **The Big Short (Büyük Açık):** 2008 küresel finans krizini önceden gören birkaç kişinin hikayesi, hem çok eğlenceli hem de piyasaların nasıl çalıştığını harika anlatıyor.\n` +
        `* **Margin Call & Wolf of Wall Street:** Finans dünyasının perde arkasını görmek için birebir.\n` +
        `* **Succession (Dizi) & Interstellar (Bilim Kurgu):** Senaryo ve atmosfer olarak üst düzey yapımlardır.`;
    }

    if (q.includes('futbol') || q.includes('maç') || q.includes('galatasaray') || q.includes('fenerbahçe') || q.includes('beşiktaş') || q.includes('trabzonspor') || q.includes('şampiyon')) {
      return `Futbol Türkiye'de ve dünyada başlı başına dev bir ekonomi! Artık kulüplerin başarısını sadece sahadaki taktik değil, yayın gelirleri, Şampiyonlar Ligi ayakbastı paraları, sponsorluklar ve doğru maaş bütçesi yönetimi belirliyor. Senin tuttuğun takım hangisi?`;
    }

    if (q.includes('oyun') || q.includes('pc') || q.includes('playstation') || q.includes('gta') || q.includes('valorant') || q.includes('cs') || q.includes('fifa') || q.includes('fc 25')) {
      return `Oyun dünyası artık sinema ve müzik sektörlerinin toplamından bile daha büyük bir ekonomiye ulaştı! Özellikle strateji ve simülasyon oyunları insanın kaynak yönetimi ve hızlı karar alma refleksini de çok ciddi geliştiriyor.`;
    }

    // 4. BIST 30 HİSSELERİ VE TEMETTÜ SORULARI ("thyao", "tuprs", "froto", "asels", "bimas", "eregl", "kchol", "temettü")
    if (q.includes('thyao') || q.includes('tüpraş') || q.includes('tuprs') || q.includes('froto') || q.includes('ford') || q.includes('aselsan') || q.includes('asels') || q.includes('bimas') || q.includes('eregl') || q.includes('kchol') || q.includes('temettü emekli')) {
      return `### 📊 BIST 30 İhracat & Temettü Devleri Analizi

Borsa İstanbul'da uzun vadeli servet ve **Temettü Emekliliği** inşa ederken döviz geliri olan, fiyatlama gücü yüksek ve düzenli kâr payı dağıtan şirketler öne çıkar:
* **TÜPRAŞ (\`TUPRS\`) & Ford Otosan (\`FROTO\`):** Yüksek nakit akışı ve düzenli temettü verimiyle (%8 - %10,5 bandı) temettü portföylerinin omurgasını oluşturur.
* **Türk Hava Yolları (\`THYAO\`) & ASELSAN (\`ASELS\`):** Döviz bazlı küresel büyüme ve yüksek teknoloji ihracatıyla güçlü sermaye kazancı üretir.
* **BİM (\`BIMAS\`) & Koç Holding (\`KCHOL\`):** Enflasyon geçişkenliğine en dayanıklı defansif ve dengeli büyüme şirketleridir.

> 💡 Aylık **${formatTRY(s.positiveSavings)}** tasarrufunla bu hisselerde 5-10 yılda ne kadar aylık pasif temettü maaşı oluşacağını üst menüdeki **Dünya Haberleri, Borsa & Maaş** sayfasındaki simülatörden kuruşu kuruşuna hesaplayabilirsin.`;
    }

    // 5. DÜNYA EKONOMİ HABERLERİ VE GÜNDEM SORULARI ("haber", "gündem", "dünyada neler oluyor", "piyasada son durum")
    if (q.includes('haber') || q.includes('gündem') || q.includes('son dakika') || q.includes('neler oluyor') || q.includes('piyasa ne durumda') || q.includes('piyasalar nasıl')) {
      const newsList = window.YEK_ECONOMY_NEWS_ACADEMY?.WORLD_ECONOMY_NEWS || [];
      const top3 = newsList.slice(0, 3);
      if (top3.length > 0) {
        return `### 📰 Küresel ve Yerel Ekonomi Gündeminde Öne Çıkanlar\n\n` +
          top3.map((n) => `* **${n.regionFlag} ${n.title}:** ${n.summary} *(${n.impactBadge})*`).join('\n') +
          `\n\nHaberin tarihini ve kaynağını kontrol et. Etkiyi değerlendirirken beklentiye göre ne kadar sürpriz olduğunu, aktarım kanalını ve alternatif senaryoları ayır; tek bir haber belirli bir varlığın getirisini garanti etmez.`;
      }
    }

    // 6. FİNANS SÖZLÜĞÜ TERİM SORULARI ("stopaj nedir", "kkdf nedir", "bsmv nedir", "cds nedir", "f/k nedir", "arbitraj nedir")
    const glossaryList = window.YEK_ECONOMY_NEWS_ACADEMY?.FINANCIAL_GLOSSARY || [];
    for (const g of glossaryList) {
      const cleanTerm = g.term.split('(')[0].trim().toLowerCase();
      if (cleanTerm.length >= 3 && q.includes(cleanTerm)) {
        return `### 📘 ${g.term} (${g.cat})\n\n${g.desc}`;
      }
    }

    // 7. Maaş, Asgari Ücret, Emeklilik, Kıdem Tazminatı, Vergi Dilimi
    if (q.includes('asgari ücret') || q.includes('maaş zammı') || q.includes('kıdem') || q.includes('ihbar') || q.includes('brüt') || q.includes('net maaş') || q.includes('vergi dilimi')) {
      return `### 💼 Maaş, Gelir Vergisi Dilimleri ve Kıdem Tazminatı Analizi

Türkiye'de ücretli çalışanların bütçe planlamasında dikkat etmesi gereken en kritik nokta **kümülatif gelir vergisi dilimleridir**:
* **Brütten Nete Kesintiler:** Brüt maaştan önce **%14 SGK İşçi Payı** ve **%1 İşsizlik Sigortası Payı** (toplam %15) düşülür. Kalan tutar üzerinden kümülatif matraha göre **%15, %20, %27, %35 ve %40** oranlarında gelir vergisi hesaplanır.
* **Kıdem Tazminatı Mantığı:** Aynı işyerinde en az 1 yıl çalışan kişi, çalıştığı **her tam yıl için 30 günlük giydirilmiş brüt ücreti** tutarında (sadece binde 7,59 damga vergisi kesilerek) net kıdem tazminatı alır.`;
    }

    // 8. İş Kurma, Ticaret, E-Ticaret, Ek Gelir, Pasif Gelir
    if (q.includes('iş kur') || q.includes('ticaret') || q.includes('e-ticaret') || q.includes('ek gelir') || q.includes('pasif gelir') || q.includes('para kazan') || q.includes('girişim') || q.includes('şirket kur')) {
      return `### 🚀 Ek Gelir, Girişimcilik ve Pasif Gelir İnşası

Gelir kalemini büyütmek, bütçedeki tasarruf çarpanını artırmanın en hızlı yoludur:
1. **Aktif Ek Gelir:** Yazılım, tasarım, dijital pazarlama, danışmanlık veya e-ticaret gibi ölçeklenebilir gelir üreten alanlar aylık nakit akışını doğrudan büyütür.
2. **Finansal Pasif Gelir:** Temettü hisseleri, %0 stopajlı hisse yoğun fonlar, 6 ayda bir döviz kuponu ödeyen Eurobond'lar ve günlük bileşik faiz üreten Para Piyasası Fonları (PPF).
3. **Sermaye Kuralı:** Yeni bir işe girerken mevcut hazır birikimin (**${formatTRY(s.currentSavings)}**) tamamını tek seferde riske atmak yerine küçük bütçeli testlerle (MVP) başlamak en doğrusudur.`;
    }

    // 9. Teknoloji, Yapay Zeka, Yazılım, Bilgisayar, Kodlama
    if (q.includes('yapay zeka') || q.includes('yazılım') || q.includes('kodlama') || q.includes('programlama') || q.includes('teknoloji') || q.includes('python') || q.includes('javascript') || q.includes('çip') || q.includes('nvidia')) {
      return `### 🤖 Yapay Zeka, Teknoloji Ekonomisi ve Yazılım Dünyası

Yapay zeka, yarı iletkenler ve bulut altyapısı üretkenliği ve şirket maliyetlerini etkileyebilir; ekonomik etkisi sektör ve kullanım alanına göre değişir.
* **Ekosistem:** Çip üretimi, veri merkezleri, enerji, ağ altyapısı ve yazılım birbirine bağlıdır. Şirketler arası rekabet ve sermaye ihtiyacı sonuçları etkiler.
* **Yatırım riski:** Teknolojinin büyümesi her şirketin kâr edeceği veya hisse fiyatının yükseleceği anlamına gelmez. Değerleme, rekabet, yatırım harcaması, düzenleme ve yoğunlaşma riskini ayrıca incele.
* **Portföy kararı:** Uygulamadaki yüzde dağılımı örnektir, evrensel hedef değildir; uygun ağırlık hedef, vade ve kayıp taşıma kapasitesine bağlıdır.`;
    }

    // 10. Eğitim, Kitap, Kariyer
    if (q.includes('kitap') || q.includes('okuma') || q.includes('eğitim') || q.includes('üniversite') || q.includes('kariyer') || q.includes('ders') || q.includes('sınav') || q.includes('öğren')) {
      return `### 📚 Finansal Okuryazarlık, Kariyer Gelişimi ve Başucu Kitapları

Kendine yaptığın bilgi yatırımı, enflasyona karşı değer kaybetmeyen en güçlü yatırımdır. Mutlaka okumanı önerdiğim 4 başucu kitabı:
1. **Paranın Psikolojisi (Morgan Housel)**
2. **Akıllı Yatırımcı (Benjamin Graham)**
3. **Ulusların Düşüşü (Daron Acemoğlu)**
4. **Hızlı ve Yavaş Düşünme (Daniel Kahneman)**`;
    }

    // 11. Saat kaç, tarih ne
    if (q.includes('saat kaç') || q.includes('tarih') || q.includes('bugün günlerden')) {
      const now = new Date();
      return `Şu an yerel tarih ve saat: **${now.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — ${now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}**.`;
    }

    // 12. KULLANICININ CÜMLESİNİ DOĞRUDAN ANLAYIP SENTEZLEYEN AKILLI DİYALOG MOTORU
    // Soru mu soruyor yoksa bir fikir/durum mu paylaşıyor?
    const isQuestion =
      q.includes('?') ||
      /\b(nasıl|neden|niçin|niye|nedir|ne kadar|hangisi|mi|mı|mu|mü|sence|ne dersin|olur mu|mantıklı mı|yapmalı mıyım)\b/.test(q);

    if (isQuestion) {
      return `Sorduğun **"${questionRaw}"** sorusuna doğrudan ve net bir çerçeveden yanıt vereyim:\n\n` +
        `* **Pratik Yaklaşım:** Kararı hedef, vade, maliyet, likidite ve olası kayıp senaryosuna göre değerlendir; tek bir ölçüt sonucu belirlemez.\n` +
        `* **Uygulama verisi:** Tabloda birikim **${formatTRY(s.currentSavings)}**, aylık net fark **${formatTRY(s.positiveSavings)}** görünüyor; bunların güncel ve sana ait olduğunu doğrula. Bu değerler tek başına yatırım kararı belirlemez.`;
    }

    return `Bahsettiğin **"${questionRaw}"** noktası oldukça önemli. Hem günlük hayatta hem de finansal stratejide olaylara bu şekilde analitik yaklaşmak büyük fark yaratıyor. Bunun üzerine eklemek istediğin bir detay veya hesaplamamı istediğin bir senaryo varsa doğrudan yazabilirsin.`;
  }

  // ==========================================================================
  // 3. MARKDOWN -> HTML DÖNÜŞTÜRÜCÜ
  // ==========================================================================
  function renderMarkdownToHtml(mdText) {
    if (!mdText) return '';
    let html = mdText.trim();

    // Yanıt sonlarındaki yapay "Ne sormak istersiniz / Başka bir sorunuz var mı" cümlelerini temizle
    html = html.replace(/(?:Aklına takılan başka|Başka bir sorunuz|Bugün hangi konuda|Ne sormak istersin|Neyi konuşmak istersin|Merak ettiğin başka)[^.!?\n]*[.!?]?$/gi, '').trim();

    const hasMarkdownTable = /\|.*\|/.test(html);
    const hasMarkdownHeaders = /^#{1,4}\s+/m.test(html);

    if (!hasMarkdownTable && !hasMarkdownHeaders && (html.includes('<ul>') || html.includes('<strong>'))) {
      return html;
    }

    html = html.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="ai-code-block"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    });

    html = html.replace(/((?:^\|.*\|\r?\n)+)/gm, (tableBlock) => {
      const lines = tableBlock.trim().split(/\r?\n/).filter((l) => l.trim().startsWith('|'));
      if (lines.length < 2) return tableBlock;

      const parseRow = (line) =>
        line
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((cell) => cell.trim());

      const headers = parseRow(lines[0]);
      const bodyLines = lines.slice(1).filter((l) => !/^\|[\s:|-]+\|$/.test(l.trim()));

      const thead = `<thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>`;
      const tbody = `<tbody>${bodyLines
        .map((rowLine) => {
          const cols = parseRow(rowLine);
          return `<tr>${cols.map((c) => `<td>${c}</td>`).join('')}</tr>`;
        })
        .join('')}</tbody>`;

      return `<div class="ai-table-wrapper"><table class="ai-md-table">${thead}${tbody}</table></div>`;
    });

    html = html.replace(/^####\s+(.*)$/gm, '<h5 class="ai-md-h4">$1</h5>');
    html = html.replace(/^###\s+(.*)$/gm, '<h4 class="ai-md-h3">$1</h4>');
    html = html.replace(/^##\s+(.*)$/gm, '<h3 class="ai-md-h2">$1</h3>');
    html = html.replace(/^>\s*(.*)$/gm, '<blockquote class="ai-md-quote">$1</blockquote>');

    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>');

    html = html.replace(/(?:^\s*[-*•]\s+.*(?:\r?\n|$))+/gm, (listBlock) => {
      const items = listBlock
        .trim()
        .split(/\r?\n/)
        .map((line) => line.replace(/^\s*[-*•]\s+/, '').trim())
        .filter(Boolean);
      return `<ul class="ai-md-list">${items.map((it) => `<li>${it}</li>`).join('')}</ul>`;
    });

    html = html.replace(/(?:^\s*\d+\.\s+.*(?:\r?\n|$))+/gm, (listBlock) => {
      const items = listBlock
        .trim()
        .split(/\r?\n/)
        .map((line) => line.replace(/^\s*\d+\.\s+/, '').trim())
        .filter(Boolean);
      return `<ol class="ai-md-list">${items.map((it) => `<li>${it}</li>`).join('')}</ol>`;
    });

    html = html.replace(/\n{2,}/g, '<br><br>');
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/(<\/(?:h3|h4|h5|ul|ol|div|blockquote|pre)>)(?:<br>)+/g, '$1');

    return html;
  }

  // ==========================================================================
  // 4. BULUT LLM SİSTEM KOMUTU (DOĞAL AI DAVRANIŞI — KALIP SORULAR YASAK)
  // ==========================================================================
  function buildMasterSystemPrompt(s, rates, modelMode, userQuestion) {
    const countryContext = window.GLOBAL_ECONOMIES_120?.findCountryEconomyForAI(userQuestion) || '';
    const bankContext = window.YEK_FINTECH_SUPER?.findBankOrLoanForAI(userQuestion) || '';
    const today = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(new Date());
    const modeGuidance = modelMode === 'macro'
      ? 'Uzmanlık modu: makroekonomik analiz. Veriyi beklenti, aktarım kanalı, gecikme ve baz senaryo / alternatif senaryo ayrımıyla açıkla; tek yönlü fiyat tahmini yapma.'
      : modelMode === 'wealth'
        ? 'Uzmanlık modu: bütçe ve hedef planı. Önce nakit akışı, borç maliyeti, kısa vadeli ihtiyaçlar ve acil rezervi değerlendir; ardından varsayımları açık bir senaryo hesapla.'
        : 'Uzmanlık modu: genel asistan. Sorunun türünü seç ve gereksiz finans başlıkları eklemeden doğrudan cevapla.';
    const userContext = [
      'Uygulama bütçe tablosu (kişiye ait ve güncel olduğunu kullanıcı doğrulamadıkça örnek/eski kayıt olabilir):',
      '- Birikim: ' + formatTRY(s.currentSavings),
      '- Aylık gelir: ' + formatTRY(s.totalIncome),
      '- Aylık gider: ' + formatTRY(s.totalExpense) + ' (zorunlu ' + formatTRY(s.totalNeeds) + ', isteğe bağlı ' + formatTRY(s.totalWants) + ', borç ödemesi ' + formatTRY(s.totalDebts) + ')',
      '- Aylık net fark: ' + formatTRY(s.netMonthly) + ' (uygulama tasarruf oranı: %' + s.savingsRate + ')',
      '- Zorunlu giderlere göre uygulamadaki acil rezerv aralığı: ' + formatTRY(s.minEF) + '–' + formatTRY(s.maxEF),
      'Sayfada görünen gösterge değerleri (zaman damgası teyitli değildir): USD/TRY ' + rates.USD + ', EUR/TRY ' + rates.EUR + ', GBP/TRY ' + rates.GBP + ', gram altın ' + rates.GAU + ', BTC/TRY ' + rates.BTC + '. Bunları yalnızca gösterge değeri olarak kullan; kendiliğinden güncel veya kesin fiyat diye tanımlama.'
    ].join('\n');
    const sourceContext = [
      countryContext ? 'İlgili ülke modülündeki veri:\n' + countryContext : '',
      bankContext ? 'İlgili banka/kredi modülündeki veri:\n' + bankContext : ''
    ].filter(Boolean).join('\n\n');

    return [
      'ROL VE KAPSAM',
      'Sen YEK AI 4.0 Pro Edition, Doğru Bütçe Doğru Kullanım uygulamasının Türkçe finansal okuryazarlık, bütçe ve genel sohbet asistanısın. Genel eğitim ve karar çerçevesi sun; lisanslı kişisel yatırım danışmanı gibi davranma.',
      'Kullanıcı adı, piyasa verisi veya kurumlarla gerçek bir bağlantın olduğunu iddia etme. Bulut modelinin adını YEK AI ürünüyle karıştırma.',
      '',
      'DAVRANIŞ',
      'Sorunun özüne ilk cümlede yanıt ver. Sıcak, saygılı, açık ve doğal yaz; kullanıcı kısa sorduysa kısa, ayrıntı istediyse adım adım yanıtla.',
      'Soruyu önce sınıflandır: bütçe, borç, yatırım ürünü, portföy, makroekonomi, hesaplama veya genel sohbet. Sadece ilgili çerçeveyi kullan.',
      'Eksik bilgi yanıtı değiştirecekse en fazla gerekli 1-2 soruyu sor. Aksi halde varsayımlarını belirtip koşullu cevap ver.',
      'Sohbet geçmişini bağlam için kullan; eski bir varsayımı güncel veri veya doğrulanmış kişisel bilgi sayma.',
      '',
      'FİNANSAL AKIL YÜRÜTME',
      'Kişiye özel öneriden önce hedef, zaman ufku, nakit ihtiyacı, gelir istikrarı, borç maliyeti, risk taşıma kapasitesi ve risk isteğini ayır.',
      'Tek bir ideal portföy yüzdesi, kesin getiri, al-sat talimatı veya belirli menkul kıymet garantisi verme. Sayfadaki 5 Altın Kural dağılımı ve %5 sınırı uygulama içi örnek/ilke niteliğindedir, evrensel standart değildir.',
      '50/30/20 oranını katı reçete değil başlangıç kontrol listesi olarak anlat. Acil rezerv aralığını kişisel istikrar, zorunlu gider ve likidite ihtiyacına göre esnet.',
      'Çeşitlendirme tek varlığa özgü riski azaltabilir ama piyasa riskini ortadan kaldırmaz. Fonları incelerken yatırımcı bilgi formu, portföy, risk göstergesi, ücretler, işlem/valör koşulları ve vergiyi dikkate al. Para piyasası fonunu mevduat veya garantili getiri diye sunma.',
      'Borç planında tüm zorunlu ödemeleri gözet; çığ ve kartopu yöntemlerini faiz maliyeti ile motivasyon takası olarak açıkla. Değişken sözleşme ve mevzuat oranlarını uydurma.',
      'Hisse analizinde iş modeli, bilanço, borç, nakit akışı, kâr kalitesi, sektör, yönetim ve değerlemeyi birlikte ele al. Tek bir F/K, PD/DD veya ROE oranından sonuç çıkarma.',
      'Makro analizde beklentiler, aktarım kanalları, zaman gecikmesi ve alternatif senaryoları ayır. Faiz/kur hareketinin bütün varlıklara aynı yönde ve aynı hızda etki edeceğini varsayma.',
      '',
      'VERİ, HESAPLAMA VE GÜNCELLİK',
      'Bugünün tarihi: ' + today + '. Bu tarih canlı piyasa verisine erişimin olduğu anlamına gelmez.',
      'Uygulama bütçe alanları ve sayfa göstergeleri sağlanan bağlamdır; zaman damgası, veri kaynağı veya kişisel doğrulama görünmüyorsa güncel/kesin diye sunma. Canlı mevzuat, vergi, banka faizi, fon ücreti, ürün koşulu veya haber istenirse eldeki bağlamda doğrulanmadığını açıkça söyle ve resmi güncel belgeyi kontrol etmeyi belirt.',
      'Sayı veya kaynak uydurma. Bir hesaplamada kullanılan ana para, oran, dönem, bileşiklenme, vergi/ücret hariç olup olmadığı ve yuvarlamayı yaz. Nominal getiri ile reel getiriyi ayır; reel getiri yaklaşık olarak (1 + nominal getiri) / (1 + enflasyon) - 1 ile bulunur.',
      'Bileşik getiri tablolarını yalnızca varsayımsal senaryo olarak sun; varsayım getiriyi tahmin etmez ve garanti vermez. Ücret, vergi, enflasyon, katkı artışı ve zamanlama sonucu değiştirebilir.',
      '',
      'YANIT BİÇİMİ',
      'Basit soruda tek bir kısa yanıt yeterlidir. Analiz gerekiyorsa önce sonuç, sonra 3-6 maddeyle gerekçe/hesap, en sonda önemli risk veya varsayımı ver.',
      'Türkçe ve Türkiye sayı biçimini kullan. Tabloları yalnızca karşılaştırma gerçekten kolaylaşıyorsa kullan. Gereksiz uyarı metni, tekrar veya satış dili ekleme.',
      '',
      modeGuidance,
      '',
      'KULLANICI TABLOSU',
      userContext,
      sourceContext ? '\nEK BAĞLAM\n' + sourceContext : ''
    ].join('\n');
  }

  // ==========================================================================
  // 5. ÇOK KATMANLI LLM ÇAĞRI MOTORU
  // ==========================================================================
  async function generateProLLMResponse(userQuestion, chatHistory, LegacyFallbackFn) {
    const s = getSnapshot();
    const rates = getLiveTickerRates();
    const modelMode = localStorage.getItem(MODEL_MODE_KEY) || 'pro';
    const systemPrompt = buildMasterSystemPrompt(s, rates, modelMode, userQuestion);

    let syncBanner = '';
    if (typeof LegacyFallbackFn === 'function') {
      const q = userQuestion.toLowerCase();
      if (/(?:maaşım|maasim|gelirim|kazancım|kiram|kira|birikimim|kenarda|borcum|kredim)\s*(?:yaklaşık|olan)?\s*\d+/.test(q)) {
        const legacyTry = LegacyFallbackFn(userQuestion);
        const matchSync = legacyTry && legacyTry.match(/^(✅.*?<br><br>)/);
        if (matchSync) syncBanner = matchSync[1];
      }
    }

    // EĞER KULLANICI DOĞRUDAN BİR ÜLKENİN EKONOMİSİNİ VEYA 120 ÜLKE ENFLASYONUNU SORUYORSA ANINDA KESİN VERİYLE YANITLA
    const directCountryAnswer = window.GLOBAL_ECONOMIES_120?.findCountryEconomyForAI(userQuestion);
    if (directCountryAnswer) {
      return {
        html: syncBanner + renderMarkdownToHtml(directCountryAnswer),
        rawText: directCountryAnswer,
        engineBadge: 'YEK AI 4.0 Pro Edition • 120 ÜLKE MAKROEKONOMİ',
      };
    }

    // EĞER KULLANICI TÜRKİYE BANKALARINI VEYA KREDİ FAİZ HESAPLAMASINI SORUYORSA ANINDA YANITLA
    const directBankLoanAnswer = window.YEK_FINTECH_SUPER?.findBankOrLoanForAI(userQuestion);
    if (directBankLoanAnswer) {
      return {
        html: syncBanner + renderMarkdownToHtml(directBankLoanAnswer),
        rawText: directBankLoanAnswer,
        engineBadge: 'YEK AI 4.0 Pro Edition • TÜRKİYE BANKACILIK & KREDİ',
      };
    }

    // 1. KATMAN: Özel Gemini API
    const geminiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (geminiKey) {
      try {
        const geminiContents = chatHistory.slice(-10).map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));
        geminiContents.push({ role: 'user', parts: [{ text: userQuestion }] });

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: geminiContents,
              generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
            }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return {
              html: syncBanner + renderMarkdownToHtml(replyText),
              rawText: replyText,
              engineBadge: 'GEMINI 2.5 PRO/FLASH',
            };
          }
        }
      } catch (e) {
        // Fallback
      }
    }

    // 2. KATMAN: Canlı Bulut LLM (Çoklu Yedekli Ücretsiz Bulut LLM Uç Noktaları)
    const messagesPayload = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-8).map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      { role: 'user', content: userQuestion },
    ];

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8500);

      const cloudRes = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages: messagesPayload,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (cloudRes.ok) {
        const contentType = cloudRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const cloudData = await cloudRes.json();
          const cloudText = cloudData?.choices?.[0]?.message?.content;
          if (cloudText && cloudText.trim().length > 5) {
            return {
              html: syncBanner + renderMarkdownToHtml(cloudText),
              rawText: cloudText,
              engineBadge: 'YEK AI 4.0 Pro Edition',
            };
          }
        } else {
          const plainText = await cloudRes.text();
          if (plainText && plainText.trim().length > 5 && !plainText.includes('<html')) {
            return {
              html: syncBanner + renderMarkdownToHtml(plainText),
              rawText: plainText,
              engineBadge: 'YEK AI 4.0 Pro Edition',
            };
          }
        }
      }
    } catch (cloudErr) {
      // İkinci bulut uç noktasına geç
    }

    // 2B. YEDEK BULUT LLM UÇ NOKTASI (Doğrudan Metin Üretim Kanalı)
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 7500);
      const compactPrompt = `${systemPrompt}\n\nKullanıcı Sorusu: ${userQuestion}\n\nYEK AI Yanıtı:`;
      const backupRes = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(compactPrompt)}?model=openai`,
        { signal: controller2.signal }
      );
      clearTimeout(timeoutId2);
      if (backupRes.ok) {
        const backupText = await backupRes.text();
        if (backupText && backupText.trim().length > 5 && !backupText.includes('<html')) {
          return {
            html: syncBanner + renderMarkdownToHtml(backupText),
            rawText: backupText,
            engineBadge: 'YEK AI 4.0 Pro Edition',
          };
        }
      }
    } catch (backupErr) {
      // Yerleşik motora geç
    }

    // 3. KATMAN: YERLEŞİK DOĞAL SOHBET, PİYASA EKONOMİSİ VE EVRENSEL ZEKA MOTORU
    const qLower = userQuestion.toLowerCase().trim();

    const mathReply = evaluateMathOrFinancialQuery(userQuestion, s, rates);
    if (mathReply) {
      return {
        html: syncBanner + renderMarkdownToHtml(mathReply),
        rawText: mathReply,
        engineBadge: 'YEK AI 4.0 Pro Edition',
      };
    }

    for (const topic of MARKET_ECONOMY_KNOWLEDGE_BASE) {
      if (topic.keywords.some((kw) => qLower.includes(kw))) {
        const mdOut = topic.render(s, rates);
        return {
          html: syncBanner + renderMarkdownToHtml(mdOut),
          rawText: mdOut,
          engineBadge: 'YEK AI 4.0 Pro Edition',
        };
      }
    }

    if (typeof LegacyFallbackFn === 'function') {
      const fallbackHtml = LegacyFallbackFn(userQuestion);
      if (fallbackHtml && !fallbackHtml.includes('__UNMATCHED_QUERY__')) {
        return {
          html: renderMarkdownToHtml(fallbackHtml),
          rawText: fallbackHtml.replace(/<[^>]+>/g, ''),
          engineBadge: 'YEK AI 4.0 Pro Edition',
        };
      }
    }

    const universalOut = generateUniversalSmartAnswer(userQuestion, s, rates, chatHistory);
    return {
      html: syncBanner + renderMarkdownToHtml(universalOut),
      rawText: universalOut,
      engineBadge: 'YEK AI 4.0 Pro Edition',
    };
  }

  const YEK_LLM_V4 = {
    generateProLLMResponse,
    renderMarkdownToHtml,
    getSuggestedFollowUps: () => [],
    CHAT_HISTORY_KEY,
    MODEL_MODE_KEY,
  };
  window.YEK_LLM_V4 = YEK_LLM_V4;
  window.YEK_LLM_V3 = YEK_LLM_V4; // Eski sayfa önbellekleriyle geriye dönük uyumluluk
})();
