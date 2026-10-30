// ============================================================================
// YEK AI v3.0 RELEASE — BÜYÜK DİL MODELİ (LLM) & ÜST DÜZEY PİYASA EKONOMİSİ MOTORU
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
* **Yaratıcı Yıkım (Schumpeter):** Rekabet ortamında verimsiz şirketler elenirken, teknoloji ve verimlilik üreten şirketler büyür. Borsada uzun vadeli endekslerin (S&P 500, NASDAQ, BIST) yükselmesinin temel sebebi bu kurumsal evrimdir.
* **Fırsat Maliyeti:** Parayı vadesiz hesapta atıl tutmanın maliyeti, vazgeçilen reel faiz veya fon getirisidir.
* **Sermaye Ortağı Olmak:** Piyasa ekonomisinde sadece maaş kazanıp harcayan kişi sistemin tüketicisidir; aylık **${formatTRY(s.positiveSavings)}** tasarrufunu yatırım fonları ve değerli madenlere dönüştüren kişi ise üretim araçlarının ortağı olur.`
    },
    {
      id: 'macro_central_banks_rates',
      keywords: ['merkez bankası', 'tcmb', 'fed', 'faiz kararı', 'politika faizi', 'parasal sıkılaşma', 'reel faiz', 'taylor kuralı', 'fomc', 'ecb', 'likidite', 'para politikası', 'faiz indirimi', 'faiz artışı'],
      render: (s) => `
### 🏦 Merkez Bankacılığı (TCMB & FED), Para Politikası ve Reel Faiz

Merkez bankaları paranın fiyatını (**politika faizi**) ve piyasadaki likiditeyi yöneterek ekonomik döngüleri belirler:

1. **Parasal Sıkılaşma (Faiz Artış Dönemi):** Enflasyonu düşürmek için kredi maliyetleri artırılır ve talep soğutulur. Bu evrede **Para Piyasası Fonları (PPF)** ve günlük mevduat yüksek reel getiri üretir; borçlu şirketlerin ise finansman gideri artar.
2. **Parasal Gevşeme (Faiz İndirim Dönemi):** Faizler inmeye başladığında sabit getirili **Tahvil ve Eurobond** fiyatları yükselir, mevduattan çıkan nakit **Hisse Senetlerine (Borsa)**, **Gayrimenkule** ve **Altına** yönelir.

#### Reel Faiz Denklemi (Fisher Formülü)
Nominal faiz tek başına yanıltıcıdır; asıl getiri enflasyondan arındırılmış **Reel Faizdir**:

$$\\text{Reel Faiz} = \\frac{1 + \\text{Nominal Faiz}}{1 + \\text{Beklenen Enflasyon}} - 1$$

Yıllık bileşik getiri **%52**, beklenen enflasyon **%38** olduğunda reel getiri **+%10,14** olur.`
    },
    {
      id: 'inflation_economics',
      keywords: ['enflasyon', 'tüfe', 'üfe', 'alım gücü', 'stagflasyon', 'deflasyon', 'dezenflasyon', 'hayat pahalılığı', 'enflasyondan korunma', 'enflasyon nedir'],
      render: (s) => `
### 🔥 Enflasyon, Dezenflasyon ve Stagflasyon Dinamikleri

* **Talep Enflasyonu:** Para arzı ve kredi büyümesinin üretimden hızlı artmasıdır ($M \\times V = P \\times Y$).
* **Maliyet Enflasyonu:** Döviz kuru geçişkenliği, enerji ve hammadde maliyetlerinin üretim fiyatlarını yukarı itmesidir.
* **Dezenflasyon:** Fiyatların düşmesi değil, **enflasyon artış hızının yavaşlamasıdır**. Dezenflasyon sürecinde uzun vadeli tahviller ve bankacılık/holding hisseleri güçlü performans gösterir.
* **Stagflasyon:** Ekonomik durgunluk (resesyon) ile yüksek enflasyonun aynı anda yaşanmasıdır. Stagflasyona karşı en güçlü tarihsel koruma **Altın, Gümüş ve fiyatlama gücü yüksek temel tüketim/teknoloji şirketleridir**.`
    },
    {
      id: 'stock_valuation_bist_global',
      keywords: ['temel analiz', 'f/k', 'pd/dd', 'fd/favök', 'bilanço', 'hisse değerleme', 'bist 100', 's&p 500', 'nasdaq', 'temettü', 'serbest nakit akışı', 'borsa analizi', 'ucuz hisse'],
      render: (s) => `
### 📊 Borsa Değerleme Çarpanları (F/K, PD/DD, FD/FAVÖK, ROE)

Bir şirketin hissesini alırken ucuz mu yoksa pahalı mı olduğunu analiz etmek için kullanılan 4 temel kurumsal rasyo:

* **F/K (Fiyat / Kazanç — P/E):** Şirketin piyasa değerinin yıllık net kârına oranıdır. Mevcut kârla şirketin kendini kaç yılda amorti ettiğini gösterir.
* **PD/DD (Piyasa Değeri / Defter Değeri — P/B):** Piyasa değerinin şirketin net özsermayesine oranıdır. Banka ve holding değerlemesinde temel ölçüttür.
* **FD/FAVÖK (EV/EBITDA):** Şirketin net borcunu da hesaba katarak esas faaliyet kârlılığını ölçer; sanayi şirketlerinde F/K'dan daha sağlıklı sonuç verir.
* **ROE (Özsermaye Kârlılığı):** Şirketin özsermayesini yıllık yüzde kaç büyüttüğünü gösterir. Enflasyonun üzerinde ROE üreten ve düşük çarpanlı şirketler uzun vadede en yüksek bileşik getiriyi sağlar.`
    },
    {
      id: 'bonds_eurobond_cds',
      keywords: ['eurobond', 'cds', 'tahvil', 'bono', 'verim eğrisi', 'yield curve', 'kupon faizi', 'ülke risk primi', 'sabit getirili'],
      render: (s, rates) => `
### 💶 Eurobond, CDS Risk Primi ve Tahvil Fiyatlaması

Nakit Dolar ($1 = ₺${rates.USD.toFixed(2)}) veya Euro ($1€ = ₺${rates.EUR.toFixed(2)}) tutmak, ABD ve Avrupa enflasyonu nedeniyle her yıl alım gücü kaybettirir. Döviz bazında reel getiri üretmenin yolu **Eurobond** ve **Yabancı Fonlardır**.

* **CDS (Ülke Kredi Risk Primi):** Ülkenin borç ödeyebilme güvenilirliğini ölçer. CDS yüksekken alınan Eurobond'lar yüksek döviz faizi kilitler; ülke risk primi düştüğünde ise Eurobond'un **anapara değeri yükselir**.
* **Faiz - Tahvil Fiyatı İlişkisi:** Piyasa faizleri ile tahvil fiyatları ters orantılıdır. Faizler düştüğünde eldeki yüksek kuponlu tahvil/Eurobond'lar değer kazanır.`
    },
    {
      id: 'behavioral_finance_psychology',
      keywords: ['davranışsal finans', 'psikoloji', 'fomo', 'panik satışı', 'kahneman', 'zarardan kaçınma', 'yatırımcı psikolojisi', 'duygusal', 'sabır'],
      render: (s) => `
### 🧠 Davranışsal Finans ve Yatırımcı Psikolojisi

Daniel Kahneman'ın *Beklenti Teorisi*'ne göre yatırımcıların en büyük düşmanı piyasa değil, kendi duygusal tepkileridir:

* **Kayıptan Kaçınma (Loss Aversion):** Kaybetmenin acısı, aynı tutarı kazanmanın sevincinden 2,25 kat daha güçlüdür. Bu durum kârda olan pozisyonların erken satılmasına, zarardaki kötü varlıkların ise inatla tutulmasına yol açar.
* **FOMO (Fırsatı Kaçırma Korkusu):** Varlık fiyatları zirveye ulaştığında kalabalıkla birlikte en tepeden alım yapma hatasıdır.
* **Algoritmik Çözüm (DCA):** Her ayın 1'inde maaş yattığı gün otomatik alım yapmak (**${formatTRY(s.positiveSavings)}/ay**), kararları duygulardan tamamen arındırır.`
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
        return `Güncel serbest piyasa kuruyla (**1 USD = ₺${rates.USD.toFixed(2)}**), **${amt.toLocaleString('tr-TR')} Dolar** tam olarak **${formatTRY(amt * rates.USD)}** etmektedir.`;
      }
      if (unit.includes('euro') || unit === 'eur' || unit === '€') {
        return `Güncel serbest piyasa kuruyla (**1 EUR = ₺${rates.EUR.toFixed(2)}**), **${amt.toLocaleString('tr-TR')} Euro** tam olarak **${formatTRY(amt * rates.EUR)}** etmektedir.`;
      }
      if (unit.includes('sterlin') || unit === 'gbp') {
        return `Güncel serbest piyasa kuruyla (**1 GBP = ₺${rates.GBP.toFixed(2)}**), **${amt.toLocaleString('tr-TR')} Sterlin** tam olarak **${formatTRY(amt * rates.GBP)}** etmektedir.`;
      }
      if (unit.includes('çeyrek')) {
        const ceyrekRate = rates.GAU * 1.63;
        return `Güncel altın kuruyla **${amt.toLocaleString('tr-TR')} adet Çeyrek Altın** yaklaşık **${formatTRY(amt * ceyrekRate)}** etmektedir.`;
      }
      if (unit.includes('altın')) {
        return `Güncel 24 ayar Gram Altın kuruyla (**1 Gr = ₺${rates.GAU.toLocaleString('tr-TR')}**), **${amt.toLocaleString('tr-TR')} Gram Altın** tam olarak **${formatTRY(amt * rates.GAU)}** etmektedir.`;
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

      const calcFV = (p, m, y, annualRate) => {
        const r = annualRate / 12;
        const n = y * 12;
        return Math.round(p * Math.pow(1 + r, n) + m * ((Math.pow(1 + r, n) - 1) / r));
      };

      const totalInvested = principal + monthly * years * 12;
      const fvConservative = calcFV(principal, monthly, years, 0.12);
      const fvBalanced = calcFV(principal, monthly, years, 0.18);
      const fvGrowth = calcFV(principal, monthly, years, 0.24);

      return `### 📈 ${years} Yıllık Bileşik Servet Simülasyonu (Reel Alım Gücüyle)

Başlangıç sermayeniz **${formatTRY(principal)}** ve aylık düzenli **${formatTRY(monthly)}** yatırımınız için enflasyon üstü reel büyüme projeksiyonu:

| Senaryo | Yıllık Reel Getiri | Toplam Ana Para Girişi | ${years} Yıl Sonunda Reel Portföy | Net Bileşik Kâr |
| :--- | :--- | :--- | :--- | :--- |
| **Muhafazakâr Sepet** | %12 (Reel) | ${formatTRY(totalInvested)} | **${formatTRY(fvConservative)}** | +${formatTRY(fvConservative - totalInvested)} |
| **Dengeli Sepet (YEK Standardı)** | **%18 (Reel)** | ${formatTRY(totalInvested)} | **${formatTRY(fvBalanced)}** | **+${formatTRY(fvBalanced - totalInvested)}** |
| **Agresif Büyüme** | %24 (Reel) | ${formatTRY(totalInvested)} | **${formatTRY(fvGrowth)}** | +${formatTRY(fvGrowth - totalInvested)} |

Dengeli sepette ${years}. yıl sonunda portföyünüz bugünün alım gücüyle yaklaşık **$${Math.round(fvBalanced / rates.USD).toLocaleString('tr-TR')} USD** büyüklüğe ulaşır.`;
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
        return `Kesinlikle öyle. İstersen bunun rakamsal veya pratik tarafını biraz daha açabiliriz, ya da aklındaki başka bir konuya geçebiliriz.`;
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
        return `Az önce konuştuğumuz konuyu somut bir örnekle biraz daha açayım:\n\n` +
          `Örneğin elinde **100.000 ₺** olduğunu veya her ay kenara **${formatTRY(s.positiveSavings)}** ayırdığını düşünelim. Kısa vadeli heyecanla tek bir yere (veya nakit dövize) bağladığında enflasyon ve fırsat maliyeti yüzünden reel kazanç eriyor. Ama bunu **%30 Altın + %30 Vergi Muafiyetli (%0 Stopaj) Hisse Fonu + %25 Yabancı Teknoloji + %10 Eurobond** şeklinde böldüğünde, piyasanın bir tarafı durgunsa diğer tarafı portföyü yukarı taşıyor. İşin bütün matematiksel sırrı bu dengede yatıyor.`;
      }
      return `Bunu somut bir örnekle açıklayayım: Ekonomide ve günlük kararlarda tek bir faktöre bağlı kalmak riski büyütür. O yüzden her zaman hem güvenlik tamponunu (nakit akışını) korumak hem de büyüme fırsatlarına kademeli girmek en sağlam sonucu verir.`;
    }

    // 3. KİŞİSEL / FELSEFİ / MİZAHİ / GÜNLÜK HAYAT SORULARI ("canım sıkılıyor", "ne önerirsin", "espri yap", "şaka", "film", "oyun", "futbol", "hava", "yemek", "kahve")
    if (q.includes('canım sıkıl') || q.includes('sıkıldım') || q.includes('moralim') || q.includes('yoruldum') || q.includes('bunaldım')) {
      return `Çok normal, bazen tempo ve gündem insanı gerçekten yorabiliyor. Kendine bir kahve veya çay yapıp 15-20 dakika ekrandan ve stresten uzaklaşmak zihni çok iyi sıfırlıyor. İstersen kafanı dağıtmak için teknoloji, sinema, futbol veya bambaşka bir konudan da muhabbet edebiliriz.`;
    }

    if (q.includes('espri') || q.includes('şaka') || q.includes('güldür') || q.includes('komik')) {
      return `Finans dünyasından küçük bir gerçek hayat esprisi yapayım: *"Uzun vadeli yatırımcı kime denir? Kısa vadeli al-sat yapmak için girdiği hissede terste kalıp mecbur bekleyen kişiye!"* 😄 O yüzden biz her zaman "oyun parası" (%5) ile ana yatırımı birbirinden ayırıyoruz.`;
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
          `\n\nGenel tabloya baktığımızda; küresel merkez bankalarının faiz indirim döngüsü **Altın, Gümüş ve Yabancı Teknoloji Fonlarını** desteklerken, Türkiye'deki sıkı para politikası **Para Piyasası Fonları (PPF)** ve **BIST Hisse Yoğun Fonları** öne çıkarıyor.`;
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

Yapay zeka (LLM mimarileri, yarı iletken çipler ve bulut veri merkezleri) günümüz küresel ekonomisinin en büyük verimlilik devrimini gerçekleştiriyor:
* **Teknoloji ve Yarı İletken Ekosistemi:** Mikroçip üretimi (TSMC, ASML, NVIDIA) ve bulut altyapısı (Microsoft, Google, Apple, Amazon) küresel büyümenin lokomotifidir.
* **Portföydeki Yeri:** Yusuf Efe Karagöz'ün **5 Altın Kural** sepetinde **%25 Yabancı Teknoloji ve Yapay Zeka Fonları** ayrılmasının sebebi, bu şirketlerin Dolar bazındaki büyümesine ortak olmaktır.`;
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
        `* **Pratik Yaklaşım:** Bu konuda karar verirken ilk bakmamız gereken kriter, kısa vadeli popülerlik yerine **uzun vadeli sürdürülebilirlik ve fayda/maliyet oranıdır**. Eğer bir adım sana zaman kazandırıyor, riskini dağıtıyor veya alım gücünü enflasyonun üzerinde koruyorsa doğru yoldasın demektir.\n` +
        `* **Senin Tablona Göre Durum:** Mevcut **${formatTRY(s.currentSavings)}** hazır birikimin ve aylık **${formatTRY(s.positiveSavings)}** net tasarruf gücünle, tek bir noktaya tüm gücü yüklemek yerine kademeli (parçalı) hareket etmek elini her zaman güçlü tutar.`;
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
    return `Sen "YEK AI" adında, Piyasa Uzmanı Yusuf Efe Karagöz'ün geliştirdiği çok üst düzey bir yapay zeka asistanısın.
Kullanıcı seninle konuşurken tıpkı en üst düzey bir yapay zeka (Antigravity / Gemini Pro / ChatGPT-4o) ve yakın bir finans/teknoloji dostuyla konuşuyormuş gibi hissetmelidir.
Davranış İlkelerin:
1. Samimi, zeki, doğrudan, sıcak ve analitik bir üslupla konuş. Robotik kalıplar, resmiyet veya geçiştirme cümleleri ASLA kurma.
2. Mesajlarının sonunda ASLA "Başka bir sorunuz var mı?", "Size nasıl yardımcı olabilirim?" gibi müşteri temsilcisi cümleleri yazma.
3. Kullanıcının sorduğu soru ne olursa olsun (günlük muhabbet, felsefe, spor, oyun, yazılım, iş fikri, dünya ekonomisi, 120 ülke enflasyonu, Türkiye bankaları kredi faizleri, BIST 30 temettü hisseleri, maaş/kıdem hesabı veya kişisel bütçe) önce doğrudan o sorunun cevabını ver.
4. Finansal konularda kullanıcının canlı verilerini bil: Hazır Birikim=${formatTRY(s.currentSavings)}, Aylık Gelir=${formatTRY(s.totalIncome)}, Aylık Gider=${formatTRY(s.totalExpense)}, Aylık Net Tasarruf=${formatTRY(s.netMonthly)} (%${s.savingsRate}), Acil Fon Hedefi=${formatTRY(s.minEF)}. Kurlar: USD=₺${rates.USD}, EUR=₺${rates.EUR}, Gram Altın=₺${rates.GAU}.
${countryContext ? `\n5. İLGİLİ ÜLKE VERİSİ:\n${countryContext}` : ''}
${bankContext ? `\n6. İLGİLİ TÜRKİYE BANKA/KREDİ VERİSİ:\n${bankContext}` : ''}`;
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
        engineBadge: 'YEK-LLM 3.0 • 120 ÜLKE MAKROEKONOMİ',
      };
    }

    // EĞER KULLANICI TÜRKİYE BANKALARINI VEYA KREDİ FAİZ HESAPLAMASINI SORUYORSA ANINDA YANITLA
    const directBankLoanAnswer = window.YEK_FINTECH_SUPER?.findBankOrLoanForAI(userQuestion);
    if (directBankLoanAnswer) {
      return {
        html: syncBanner + renderMarkdownToHtml(directBankLoanAnswer),
        rawText: directBankLoanAnswer,
        engineBadge: 'YEK-LLM 3.0 • TÜRKİYE BANKACILIK & KREDİ',
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
              engineBadge: 'YEK-LLM 3.0',
            };
          }
        } else {
          const plainText = await cloudRes.text();
          if (plainText && plainText.trim().length > 5 && !plainText.includes('<html')) {
            return {
              html: syncBanner + renderMarkdownToHtml(plainText),
              rawText: plainText,
              engineBadge: 'YEK-LLM 3.0',
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
            engineBadge: 'YEK-LLM 3.0',
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
        engineBadge: 'YEK-LLM 3.0',
      };
    }

    for (const topic of MARKET_ECONOMY_KNOWLEDGE_BASE) {
      if (topic.keywords.some((kw) => qLower.includes(kw))) {
        const mdOut = topic.render(s, rates);
        return {
          html: syncBanner + renderMarkdownToHtml(mdOut),
          rawText: mdOut,
          engineBadge: 'YEK-LLM 3.0',
        };
      }
    }

    if (typeof LegacyFallbackFn === 'function') {
      const fallbackHtml = LegacyFallbackFn(userQuestion);
      if (fallbackHtml && !fallbackHtml.includes('__UNMATCHED_QUERY__')) {
        return {
          html: renderMarkdownToHtml(fallbackHtml),
          rawText: fallbackHtml.replace(/<[^>]+>/g, ''),
          engineBadge: 'YEK-LLM 3.0',
        };
      }
    }

    const universalOut = generateUniversalSmartAnswer(userQuestion, s, rates, chatHistory);
    return {
      html: syncBanner + renderMarkdownToHtml(universalOut),
      rawText: universalOut,
      engineBadge: 'YEK-LLM 3.0',
    };
  }

  window.YEK_LLM_V3 = {
    generateProLLMResponse,
    renderMarkdownToHtml,
    getSuggestedFollowUps: () => [],
    CHAT_HISTORY_KEY,
    MODEL_MODE_KEY,
  };
})();
