// ============================================================================
// DOĞRU BÜTÇE DOĞRU KULLANIM — SÜPER FİNANS MERKEZİ MOTORU (fintech-super.js)
// 1. Türkiye Bankaları Kredi Faiz Hesaplama (KKDF + BSMV Dahil) & Banka Karşılaştırma
// 2. Ev mi, Araba mı, Yatırım Sepeti mi? (Kira Çarpanı Simülatörü)
// 3. Canlı Portföy & Varlık Takip Çantası (Benim Portföyüm)
// 4. Hedef Kumbarası & Finansal Özgürlük (FIRE) Geri Sayım Saati
// 5. Merkez Bankası (TCMB / FED / ECB / BoJ) Faiz Kararı Takvimi & Etki Senaryoları
// 6. Ekonomik Kriz & Şok Stres Testi (Bütçem Ne Kadar Dayanıklı?)
// 7. YEK AI Sesli Konuşma (Mikrofon / Speech-to-Text) & Sesli Yanıt Okuma (TTS)
// ============================================================================

(function () {
  const PORTFOLIO_BAG_KEY = 'yek_portfolio_bag_v1';
  const CUSTOM_GOAL_KEY = 'yek_custom_fire_goal_v1';
  const VOICE_TTS_KEY = 'yek_ai_voice_tts_enabled';

  // 12 Önde Gelen Türkiye Bankası Güncel Faiz Veritabanı
  const TURKEY_BANKS = [
    {
      id: 'ziraat',
      name: 'Ziraat Bankası',
      badge: 'Kamu Bankası',
      consumerRate: 3.89,
      housingRate: 2.79,
      vehicleRate: 3.65,
      depositAnnual: 46.0,
      note: 'Kamu konut kampanyalarında en düşük konut kredisi oranı',
    },
    {
      id: 'vakifbank',
      name: 'VakıfBank',
      badge: 'Kamu Bankası',
      consumerRate: 3.95,
      housingRate: 2.89,
      vehicleRate: 3.69,
      depositAnnual: 47.0,
      note: 'Maaş müşterilerine özel esnek taksitli ihtiyaç ve konut paketleri',
    },
    {
      id: 'halkbank',
      name: 'Halkbank',
      badge: 'Kamu Bankası',
      consumerRate: 3.99,
      housingRate: 2.89,
      vehicleRate: 3.72,
      depositAnnual: 46.5,
      note: 'Esnaf, KOBİ ve kamu çalışanlarına avantajlı kredi maliyetleri',
    },
    {
      id: 'isbank',
      name: 'Türkiye İş Bankası',
      badge: 'Özel Banka',
      consumerRate: 4.15,
      housingRate: 3.05,
      vehicleRate: 3.79,
      depositAnnual: 45.5,
      note: 'İşCep üzerinden anında onaylı dijital kredi ve yatırım fonu entegrasyonu',
    },
    {
      id: 'garanti',
      name: 'Garanti BBVA',
      badge: 'Özel Banka',
      consumerRate: 4.19,
      housingRate: 2.99,
      vehicleRate: 3.75,
      depositAnnual: 47.5,
      note: 'Dijital kanallarda hızlı kredi ve yüksek hoş geldin mevduat faizi',
    },
    {
      id: 'akbank',
      name: 'Akbank',
      badge: 'Özel Banka',
      consumerRate: 4.09,
      housingRate: 2.95,
      vehicleRate: 3.69,
      depositAnnual: 48.0,
      note: 'Yeni müşterilere özel kampanya faizi ve serbest artı para avantajı',
    },
    {
      id: 'yapikredi',
      name: 'Yapı Kredi',
      badge: 'Özel Banka',
      consumerRate: 4.25,
      housingRate: 3.09,
      vehicleRate: 3.85,
      depositAnnual: 47.0,
      note: 'Esnek ödeme planlı bireysel kredi ve World ekosistem avantajları',
    },
    {
      id: 'qnb',
      name: 'QNB',
      badge: 'Özel Banka',
      consumerRate: 3.99,
      housingRate: 2.99,
      vehicleRate: 3.75,
      depositAnnual: 49.0,
      note: 'İhtiyaç kredisinde rekabetçi oran ve yüksek tanışma mevduat faizi',
    },
    {
      id: 'enpara',
      name: 'Enpara.com',
      badge: 'Dijital Bankacılık',
      consumerRate: 3.85,
      housingRate: 3.15,
      vehicleRate: 3.69,
      depositAnnual: 48.5,
      note: '₺0 Tahsis ücreti (Dosya masrafsız) dijital ihtiyaç kredisi avantajı',
    },
    {
      id: 'denizbank',
      name: 'DenizBank',
      badge: 'Özel Banka',
      consumerRate: 4.29,
      housingRate: 3.19,
      vehicleRate: 3.89,
      depositAnnual: 49.5,
      note: 'Yüksek vadeli TL mevduat ve tarım/turizm sektörü finansmanı',
    },
    {
      id: 'teb',
      name: 'TEB (Türk Ekonomi Bankası)',
      badge: 'Özel Banka',
      consumerRate: 4.05,
      housingRate: 3.02,
      vehicleRate: 3.74,
      depositAnnual: 50.0,
      note: 'Marifetli Hesap ile günlük yüksek faiz ve uygun bireysel kredi',
    },
    {
      id: 'kuveytturk',
      name: 'Kuveyt Türk (Katılım)',
      badge: 'Katılım Bankası',
      consumerRate: 3.92,
      housingRate: 2.88,
      vehicleRate: 3.59,
      depositAnnual: 44.0,
      note: 'Faizsiz finansman / kâr payı oranlarıyla konut ve araç finansmanı',
    },
  ];

  // Merkez Bankaları Takvimi ve Piyasa Etki Senaryoları
  const CENTRAL_BANKS_CALENDAR = [
    {
      code: 'TCMB',
      flag: '🇹🇷',
      name: 'Türkiye Cumhuriyet Merkez Bankası (PPK)',
      currentRate: '%45,00',
      nextMeeting: 'Her Ayın 3. Perşembesi • Saat 14:00',
      expectation: 'Dezenflasyon süreciyle paralel ölçülü faiz indirimi / sıkı duruşun korunması',
      scenarios: [
        '📉 Faiz İndirimi Gelirse: Borsa İstanbul (Bankacılık ve GYO) pozitif ayrışır, uzun vadeli tahvil fonları değer kazanır.',
        '⚖️ Sabit Tutulursa: TL Para Piyasası Fonları (PPF) ve mevduatta aylık ~%3,8-%4,2 bileşik getiri cazibesi devam eder.',
      ],
    },
    {
      code: 'FED',
      flag: '🇺🇸',
      name: 'ABD Merkez Bankası (FOMC)',
      currentRate: '%4,50',
      nextMeeting: '6 Haftada Bir Çarşamba • Saat 21:00',
      expectation: 'Yıllık 2 adet 25 baz puanlık kademeli faiz indirimi ("Yumuşak İniş")',
      scenarios: [
        '📉 FED Faiz İndirirse: Ons Altın, Gümüş, NASDAQ Teknoloji Fonları ve Bitcoin\'e küresel likidite girişi hızlanır.',
        '📈 Şahin Açıklama Gelirse: Dolar Endeksi (DXY) güçlenir, gelişmekte olan ülke paraları üzerinde kısa vadeli baskı oluşur.',
      ],
    },
    {
      code: 'ECB',
      flag: '🇪🇺',
      name: 'Avrupa Merkez Bankası (ECB)',
      currentRate: '%3,15',
      nextMeeting: '6 Haftada Bir Perşembe • Saat 15:15',
      expectation: 'Avrupa sanayisini canlandırmak için %2,50 seviyesine doğru indirimlerin sürmesi',
      scenarios: [
        '📉 ECB İndirime Devam Ederse: Avrupa ekonomisi canlanır; Türkiye\'nin en büyük ihracat pazarı olduğu için Türk sanayi şirketlerini destekler.',
        '💶 Parite Etkisi: EUR/USD paritesi 1.10-1.12 bandında dengelenir.',
      ],
    },
    {
      code: 'BoJ',
      flag: '🇯🇵',
      name: 'Japonya Merkez Bankası (BoJ)',
      currentRate: '%0,25',
      nextMeeting: 'Çeyreklik Para Politikası Kurulu • Saat 06:00',
      expectation: 'Negatif faizden çıkış sonrası çok kademeli ve temkinli normalleşme',
      scenarios: [
        '⚠️ Japonya Faiz Artırırsa: Küresel "Carry Trade" (ucuz Yen borçlanıp teknoloji hissesi alma) pozisyonlarında kısa süreli dalgalanma görülebilir.',
        '⚖️ Sabit Bırakırsa: Küresel borsalarda risk iştahı yüksek kalmaya devam eder.',
      ],
    },
  ];

  const fmtTRY = (n) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);

  function getSavedBudgetSnapshot() {
    try {
      const raw = localStorage.getItem('yek_dogru_butce_v1');
      const d = raw ? JSON.parse(raw) : {};
      const currentSavings = Number(d.currentSavings ?? 85000);
      const totalIncome =
        Number(d.incSalary ?? 52000) +
        Number(d.incSide ?? 8000) +
        Number(d.incPassive ?? 0) +
        (Array.isArray(d.customIncomes) ? d.customIncomes.reduce((a, b) => a + Number(b.amount || 0), 0) : 0);
      const totalNeeds =
        Number(d.expRent ?? 16000) +
        Number(d.expBills ?? 3800) +
        Number(d.expGroceries ?? 9500) +
        Number(d.expTransport ?? 3200);
      const totalWants = Number(d.expLifestyle ?? 6000);
      const totalDebts = Number(d.expDebt ?? 5500);
      const customExp = Array.isArray(d.customExpenses)
        ? d.customExpenses.reduce((a, b) => a + Number(b.amount || 0), 0)
        : 0;
      const totalExpense = totalNeeds + totalWants + totalDebts + customExp;
      const netMonthly = totalIncome - totalExpense;
      const positiveSavings = Math.max(0, netMonthly);
      return {
        currentSavings,
        totalIncome,
        totalNeeds,
        totalWants,
        totalDebts,
        totalExpense,
        netMonthly,
        positiveSavings,
        minEF: totalNeeds * 3,
        maxEF: totalNeeds * 6,
        fireTarget: totalExpense * 12 * 25,
      };
    } catch (e) {
      return {
        currentSavings: 85000,
        totalIncome: 60000,
        totalNeeds: 32500,
        totalWants: 6000,
        totalDebts: 5500,
        totalExpense: 44000,
        netMonthly: 16000,
        positiveSavings: 16000,
        minEF: 97500,
        maxEF: 195000,
        fireTarget: 13200000,
      };
    }
  }

  // Türkiye Kredi Taksit Hesaplama Formülü (KKDF %15 + BSMV %15 Vergi Çarpanı Dahil)
  function calculateTurkishLoan(principal, months, monthlyBaseRatePercent, loanType) {
    const P = Math.max(1000, Number(principal) || 100000);
    const n = Math.max(1, Number(months) || 12);
    const baseRate = Math.max(0.01, Number(monthlyBaseRatePercent) || 3.5) / 100;

    // Türkiye Vergi Mevzuatı:
    // Konut kredisinde KKDF=%0, BSMV=%0 (Vergi muafiyetli)
    // İhtiyaç ve Taşıt kredisinde KKDF=%15 + BSMV=%15 -> Toplam faiz vergisi +%30 (1.30 çarpanı)
    const taxMultiplier = loanType === 'housing' ? 1.0 : 1.3;
    const effectiveMonthlyRate = baseRate * taxMultiplier;

    const pow = Math.pow(1 + effectiveMonthlyRate, n);
    const monthlyInstallment = P * ((effectiveMonthlyRate * pow) / (pow - 1));
    const totalPayment = monthlyInstallment * n;
    const totalInterestAndTax = totalPayment - P;
    const allocationFee = P * 0.005; // Binde 5 kredi tahsis ücreti

    return {
      principal: P,
      months: n,
      baseRatePercent: (baseRate * 100).toFixed(2),
      effectiveRatePercent: (effectiveMonthlyRate * 100).toFixed(2),
      taxMultiplier,
      monthlyInstallment,
      totalPayment,
      totalInterestAndTax,
      allocationFee,
    };
  }

  // YEK AI İçin Kredi ve Türkiye Bankaları Soru Çözümleyici
  function findBankOrLoanForAI(queryText) {
    if (!queryText) return null;
    const q = queryText.toLowerCase();
    const isBankOrLoanQuery =
      q.includes('kredi') ||
      q.includes('banka') ||
      q.includes('taksit') ||
      q.includes('konut kredisi') ||
      q.includes('ihtiyaç kredisi') ||
      q.includes('taşıt kredisi') ||
      q.includes('ziraat') ||
      q.includes('vakıfbank') ||
      q.includes('iş bankası') ||
      q.includes('garanti') ||
      q.includes('akbank') ||
      q.includes('yapı kredi') ||
      q.includes('enpara') ||
      q.includes('kuveyt türk');

    if (!isBankOrLoanQuery) return null;

    const lowestConsumer = [...TURKEY_BANKS].sort((a, b) => a.consumerRate - b.consumerRate)[0];
    const lowestHousing = [...TURKEY_BANKS].sort((a, b) => a.housingRate - b.housingRate)[0];
    const highestDeposit = [...TURKEY_BANKS].sort((a, b) => b.depositAnnual - a.depositAnnual)[0];

    const sampleConsumer = calculateTurkishLoan(250000, 24, lowestConsumer.consumerRate, 'consumer');
    const sampleHousing = calculateTurkishLoan(2000000, 120, lowestHousing.housingRate, 'housing');

    const rows = TURKEY_BANKS.slice(0, 8)
      .map(
        (b) =>
          `| 🏦 **${b.name}** | %${b.consumerRate} | %${b.housingRate} | %${b.vehicleRate} | **%${b.depositAnnual}** |`
      )
      .join('\n');

    return `### 🏦 Türkiye Bankaları Güncel Kredi & Mevduat Faiz Oranları Analizi

Türkiye'de bireysel kredi çekerken **İhtiyaç ve Taşıt kredilerinde** banka faizinin üzerine **%15 KKDF + %15 BSMV (toplam +%30 vergi yükü)** eklenir. **Konut kredisinde** ise KKDF ve BSMV **%0** olduğu için efektif maliyet çok daha düşüktür.

* **En Uygun İhtiyaç Kredisi:** **${lowestConsumer.name}** (Aylık **%${lowestConsumer.consumerRate}** — *250.000 ₺ 24 Ay vadede aylık taksit: **${fmtTRY(sampleConsumer.monthlyInstallment)}***)
* **En Uygun Konut Kredisi:** **${lowestHousing.name}** (Aylık **%${lowestHousing.housingRate}** — *2.000.000 ₺ 120 Ay vadede aylık taksit: **${fmtTRY(sampleHousing.monthlyInstallment)}***)
* **En Yüksek TL Vadeli Mevduat:** **${highestDeposit.name}** (Yıllık **%${highestDeposit.depositAnnual}**)

| Banka Adı | İhtiyaç Kredisi (Aylık) | Konut Kredisi (Aylık) | Taşıt Kredisi (Aylık) | TL Mevduat (Yıllık) |
| :--- | :--- | :--- | :--- | :--- |
${rows}

> 💡 Kendi kredi tutarınız ve vadenizle tüm bankaları karşılaştırmak için üst menüdeki **Kredi, Bankalar & Portföy** sayfasını kullanabilirsiniz.`;
  }

  // ==========================================================================
  // YEK AI SESLİ KONUŞMA (MİKROFON) VE SESLİ YANIT OKUMA (TTS) ENTEGRASYONU
  // ==========================================================================
  function initVoiceAssistantOnYekAI() {
    const aiForm = document.getElementById('yekAiForm');
    const aiInput = document.getElementById('yekAiInput');
    const sendBtn = document.getElementById('yekAiSendBtn');
    if (!aiForm || !aiInput || !sendBtn || document.getElementById('yekAiMicBtn')) return;

    // Mikrofon Butonu
    const micBtn = document.createElement('button');
    micBtn.type = 'button';
    micBtn.id = 'yekAiMicBtn';
    micBtn.className = 'btn-ai-voice-mic';
    micBtn.title = 'Mikrofonla Sesli Sor (Türkçe Ses Tanıma)';
    micBtn.innerHTML = `🎙️`;

    // Sesli Okuma (TTS) Aç/Kapat Butonu
    const ttsBtn = document.createElement('button');
    ttsBtn.type = 'button';
    ttsBtn.id = 'yekAiTtsToggleBtn';
    const isTtsOn = localStorage.getItem(VOICE_TTS_KEY) === 'true';
    ttsBtn.className = `btn-ai-voice-tts ${isTtsOn ? 'tts-active' : ''}`;
    ttsBtn.title = 'YEK AI Yanıtlarını Sesli Okuma (Aç / Kapat)';
    ttsBtn.innerHTML = isTtsOn ? '🔊 Ses Açık' : '🔈 Ses Kapalı';

    aiForm.insertBefore(micBtn, sendBtn);
    aiForm.insertBefore(ttsBtn, sendBtn);

    ttsBtn.addEventListener('click', () => {
      const current = localStorage.getItem(VOICE_TTS_KEY) === 'true';
      const next = !current;
      localStorage.setItem(VOICE_TTS_KEY, String(next));
      ttsBtn.className = `btn-ai-voice-tts ${next ? 'tts-active' : ''}`;
      ttsBtn.innerHTML = next ? '🔊 Ses Açık' : '🔈 Ses Kapalı';
      if (!next && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    });

    // Web Speech API (SpeechRecognition)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      let isListening = false;

      micBtn.addEventListener('click', () => {
        if (isListening) {
          recognition.stop();
          return;
        }
        try {
          recognition.start();
          isListening = true;
          micBtn.classList.add('listening');
          micBtn.innerHTML = '🔴 Dinliyor...';
          aiInput.placeholder = '🎙️ Sizi dinliyorum, sorunuzu konuşarak söyleyebilirsiniz...';
        } catch (err) {
          // ignore
        }
      });

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          aiInput.value = transcript;
          aiForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      };

      recognition.onend = () => {
        isListening = false;
        micBtn.classList.remove('listening');
        micBtn.innerHTML = '🎙️';
        aiInput.placeholder =
          'YEK AI 4.0 Pro Edition ile ülke ekonomileri, kredi faizleri, piyasa ekonomisi veya günlük her konuda sohbet edin...';
      };

      recognition.onerror = () => {
        isListening = false;
        micBtn.classList.remove('listening');
        micBtn.innerHTML = '🎙️';
      };
    } else {
      micBtn.addEventListener('click', () => {
        aiInput.focus();
        aiInput.placeholder = 'Tarayıcınız ses tanımayı desteklemiyor, klavyeden yazabilirsiniz...';
      });
    }

    // Yeni Bot Mesajı Geldiğinde Sesli Okuma (MutationObserver)
    const messagesBox = document.getElementById('yekAiMessages');
    if (messagesBox && 'speechSynthesis' in window) {
      const observer = new MutationObserver((mutations) => {
        if (localStorage.getItem(VOICE_TTS_KEY) !== 'true') return;
        for (const m of mutations) {
          m.addedNodes.forEach((node) => {
            if (
              node.nodeType === 1 &&
              node.classList.contains('bot-row') &&
              !node.innerHTML.includes('ai-thinking-indicator')
            ) {
              const bubble = node.querySelector('.msg-bubble');
              if (bubble) {
                const clone = bubble.cloneNode(true);
                clone.querySelector('.msg-header-bar')?.remove();
                clone.querySelector('.ai-followups-row')?.remove();
                const cleanText = clone.textContent.replace(/\s+/g, ' ').trim();
                if (cleanText.length > 5) {
                  window.speechSynthesis.cancel();
                  const utter = new SpeechSynthesisUtterance(cleanText.slice(0, 650));
                  utter.lang = 'tr-TR';
                  utter.rate = 1.04;
                  window.speechSynthesis.speak(utter);
                }
              }
            }
          });
        }
      });
      observer.observe(messagesBox, { childList: true });
    }
  }

  // ==========================================================================
  // ANA BAŞLATICI (TÜM SAYFALARDA MENÜ SEKMESİ + SÜPER FİNANS SAYFASI HESAPLAMALARI)
  // ==========================================================================
  function initFintechSuperCenter() {
    // 1. Üst menüye "Kredi, Bankalar & Portföy" sekmesini otomatik ekle
    const navLinksEl = document.querySelector('.nav-links');
    if (navLinksEl && !navLinksEl.querySelector('a[href="kredi-portfoy.html"]')) {
      const isCurrentPage = window.location.pathname.toLowerCase().includes('kredi-portfoy.html');
      const link = document.createElement('a');
      link.href = 'kredi-portfoy.html';
      link.className = `nav-tab ${isCurrentPage ? 'active' : ''}`;
      link.innerHTML = `<img src="logo.svg?v=5" alt="" class="link-mini-logo" /> Kredi, Bankalar & Portföy`;

      const aiTab = navLinksEl.querySelector('a[href="yek-ai.html"]');
      if (aiTab) {
        navLinksEl.insertBefore(link, aiTab);
      } else {
        navLinksEl.appendChild(link);
      }
    }

    // 2. YEK AI sayfasındaysak Mikrofon & Sesli Okuma barını kur
    initVoiceAssistantOnYekAI();

    // 3. Eğer kredi-portfoy.html sayfasındaysak 6 Süper Modülü çalıştır
    const loanTypeSelect = document.getElementById('loanTypeSelect');
    const loanBankSelect = document.getElementById('loanBankSelect');
    const loanPrincipalInput = document.getElementById('loanPrincipalInput');
    const loanTermInput = document.getElementById('loanTermInput');
    const loanRateInput = document.getElementById('loanRateInput');
    const trBanksTableBody = document.getElementById('trBanksTableBody');

    if (!loanBankSelect || loanBankSelect.dataset.initialized === 'true') return;
    loanBankSelect.dataset.initialized = 'true';

    // Banka Seçim Listesini Doldur
    loanBankSelect.innerHTML =
      TURKEY_BANKS.map((b) => `<option value="${b.id}">🏦 ${b.name} (${b.badge})</option>`).join('') +
      `<option value="custom">⚙️ Özel Faiz Oranı Gir</option>`;

    function getBankRateForType(bank, type) {
      if (type === 'housing') return bank.housingRate;
      if (type === 'vehicle') return bank.vehicleRate;
      return bank.consumerRate;
    }

    function syncBankRateToInput() {
      const bankId = loanBankSelect.value;
      const type = loanTypeSelect.value;
      const found = TURKEY_BANKS.find((b) => b.id === bankId);
      if (found) {
        loanRateInput.value = getBankRateForType(found, type);
      }
      if (type === 'housing' && Number(loanPrincipalInput.value) < 500000) {
        loanPrincipalInput.value = 1500000;
        loanTermInput.value = '120';
      }
      renderLoanAndBanks();
    }

    function renderLoanAndBanks() {
      const type = loanTypeSelect.value;
      const bankId = loanBankSelect.value;
      const foundBank = TURKEY_BANKS.find((b) => b.id === bankId);
      const principal = Number(loanPrincipalInput.value) || 250000;
      const months = Number(loanTermInput.value) || 24;
      const rate = Number(loanRateInput.value) || 3.89;

      const res = calculateTurkishLoan(principal, months, rate, type);
      const s = getSavedBudgetSnapshot();

      const typeLabel =
        type === 'housing' ? 'Konut Kredisi' : type === 'vehicle' ? 'Taşıt Kredisi' : 'İhtiyaç Kredisi';
      const badgeEl = document.getElementById('loanSelectedBankBadge');
      if (badgeEl) {
        badgeEl.textContent = `${foundBank ? foundBank.name : 'Özel Oran'} • ${typeLabel} (${months} Ay)`;
      }

      document.getElementById('loanMonthlyInstallment').textContent = fmtTRY(res.monthlyInstallment);
      document.getElementById('loanEffectiveRateNote').textContent =
        type === 'housing'
          ? `Vergi Muafiyetli (%0 KKDF/BSMV) • Aylık Maliyet: %${res.effectiveRatePercent}`
          : `+%15 KKDF ve +%15 BSMV Vergileri Dahil Efektif Aylık Oran: %${res.effectiveRatePercent}`;

      document.getElementById('loanOutPrincipal').textContent = fmtTRY(res.principal);
      document.getElementById('loanOutTotalPay').textContent = fmtTRY(res.totalPayment);
      document.getElementById('loanOutTotalInterest').textContent = fmtTRY(res.totalInterestAndTax);
      document.getElementById('loanOutFee').textContent =
        foundBank?.id === 'enpara' && type === 'consumer' ? '₺0 (Masrafsız)' : fmtTRY(res.allocationFee);

      // Bütçe Etkisi Teşhisi
      const impactEl = document.getElementById('loanBudgetImpactAlert');
      if (impactEl) {
        const dtiRatio = Math.round((res.monthlyInstallment / Math.max(1, s.totalIncome)) * 100);
        const remainingAfterLoan = s.netMonthly - res.monthlyInstallment;
        if (remainingAfterLoan >= 0 && dtiRatio <= 35) {
          impactEl.className = 'loan-budget-impact-alert safe';
          impactEl.innerHTML = `✅ <strong>Bütçenize Uygun:</strong> Bu taksit aylık gelirinizin (${fmtTRY(s.totalIncome)}) <strong>%${dtiRatio}</strong> kadarıdır. Kredi taksitini ödedikten sonra bile her ay <strong>${fmtTRY(remainingAfterLoan)}</strong> net yatırım gücünüz kalıyor.`;
        } else {
          impactEl.className = 'loan-budget-impact-alert danger';
          impactEl.innerHTML = `⚠️ <strong>Yüksek Borç Yükü Uyarısı:</strong> Aylık <strong>${fmtTRY(res.monthlyInstallment)}</strong> taksit, mevcut aylık kalan net bütçenizi (${fmtTRY(s.netMonthly)}) aşıyor ve gelirinizin <strong>%${dtiRatio}</strong>'ini götürüyor. Vadeyi uzatmanız veya kredi tutarını düşürmeniz önerilir.`;
        }
      }

      // 12 Türkiye Bankası Karşılaştırma Tablosu
      if (trBanksTableBody) {
        trBanksTableBody.innerHTML = TURKEY_BANKS.map((b) => {
          const bankTypeRate = getBankRateForType(b, type);
          const bankCalc = calculateTurkishLoan(principal, months, bankTypeRate, type);
          const isSelected = b.id === bankId;
          return `
            <tr class="${isSelected ? 'report-highlight-row' : ''}">
              <td><strong>🏦 ${b.name}</strong><br><small style="color:#94a3b8;">${b.note}</small></td>
              <td><span class="bank-group-tag">${b.badge}</span></td>
              <td><strong>%${b.consumerRate}</strong></td>
              <td><strong class="text-emerald">%${b.housingRate}</strong></td>
              <td>%${b.vehicleRate}</td>
              <td><strong class="text-gold">%${b.depositAnnual}</strong></td>
              <td><strong>${fmtTRY(bankCalc.monthlyInstallment)} / ay</strong><br><small>Toplam: ${fmtTRY(bankCalc.totalPayment)}</small></td>
              <td>
                <button type="button" class="btn-chip select-bank-btn" data-bank="${b.id}">
                  ${isSelected ? '✓ Seçili' : 'Seç & Hesapla'}
                </button>
              </td>
            </tr>
          `;
        }).join('');

        trBanksTableBody.querySelectorAll('.select-bank-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            loanBankSelect.value = btn.dataset.bank;
            syncBankRateToInput();
          });
        });
      }
    }

    loanTypeSelect?.addEventListener('change', syncBankRateToInput);
    loanBankSelect?.addEventListener('change', syncBankRateToInput);
    loanPrincipalInput?.addEventListener('input', renderLoanAndBanks);
    loanTermInput?.addEventListener('change', renderLoanAndBanks);
    loanRateInput?.addEventListener('input', () => {
      loanBankSelect.value = 'custom';
      renderLoanAndBanks();
    });

    renderLoanAndBanks();

    // ========================================================================
    // MODÜL 2: EV Mİ, ARABA MI, YATIRIM SEPETİ Mİ? (KİRA ÇARPANI SİMÜLATÖRÜ)
    // ========================================================================
    const simAssetPrice = document.getElementById('simAssetPrice');
    const simMonthlyRent = document.getElementById('simMonthlyRent');
    const simDownPayment = document.getElementById('simDownPayment');
    const houseVsInvestResultBox = document.getElementById('houseVsInvestResultBox');

    function renderHouseVsInvest() {
      if (!houseVsInvestResultBox) return;
      const price = Math.max(100000, Number(simAssetPrice?.value) || 4500000);
      const rent = Math.max(1000, Number(simMonthlyRent?.value) || 22000);
      const down = Math.max(50000, Number(simDownPayment?.value) || 1500000);

      const rentMultiplierMonths = Math.round(price / rent);
      const rentMultiplierYears = (rentMultiplierMonths / 12).toFixed(1);
      const annualRentYield = (((rent * 12) / price) * 100).toFixed(2);

      // 5 Yıllık YEK Sepeti Bileşik Getiri Projeksiyonu (Yıllık %18 reel dolar/altın/fon sepet büyümesi)
      const fiveYearPortfolio = Math.round(down * Math.pow(1.18, 5));

      const isGoodRealEstate = rentMultiplierMonths <= 210;

      houseVsInvestResultBox.innerHTML = `
        <div class="house-sim-card">
          <div class="house-sim-kpi-row">
            <div class="house-sim-kpi">
              <small>Kira Çarpanı (Amortisman)</small>
              <strong class="${isGoodRealEstate ? 'text-emerald' : 'text-gold'}">${rentMultiplierMonths} Ay (${rentMultiplierYears} Yıl)</strong>
            </div>
            <div class="house-sim-kpi">
              <small>Yıllık Brüt Kira Getirisi</small>
              <strong>%${annualRentYield}</strong>
            </div>
            <div class="house-sim-kpi">
              <small>Peşinatın 5 Yıllık Sepet Değeri</small>
              <strong class="text-emerald">${fmtTRY(fiveYearPortfolio)}</strong>
            </div>
          </div>

          <div class="house-sim-verdict ${isGoodRealEstate ? 'verdict-good' : 'verdict-warn'}">
            <h4>${
              isGoodRealEstate
                ? '✅ Uzman Teşhisi: Gayrimenkul Yatırım Çarpanı Cazip Sınırda!'
                : '⚠️ Uzman Teşhisi: Kira Çarpanı Yüksek — Finansal Sepet Daha Avantajlı!'
            }</h4>
            <p>
              ${
                isGoodRealEstate
                  ? `Bu konut <strong>${rentMultiplierYears} yılda (210 ay sınırının altında)</strong> kendi parasını kira ile amorti ediyor. Uygun sabit taksitli konut kredisi yakalandığında enflasyona karşı güçlü bir kaldıraç sağlar.`
                  : `Bu mülkün kendini kirayla amorti etmesi <strong>${rentMultiplierYears} yıl (${rentMultiplierMonths} ay)</strong> sürüyor (İdeal sınır: 15-17,5 yıl). Elinizdeki <strong>${fmtTRY(down)}</strong> peşinatı Yusuf Efe Karagöz'ün %30 Altın + %30 Hisse Fonu + %25 Yabancı Teknoloji + %10 Eurobond sepetinde değerlendirdiğinizde reel bazda 5 yılda <strong>${fmtTRY(fiveYearPortfolio)}</strong> büyüklüğe ulaşma potansiyeli taşır.`
              }
            </p>
          </div>
        </div>
      `;
    }

    simAssetPrice?.addEventListener('input', renderHouseVsInvest);
    simMonthlyRent?.addEventListener('input', renderHouseVsInvest);
    simDownPayment?.addEventListener('input', renderHouseVsInvest);
    renderHouseVsInvest();

    // ========================================================================
    // MODÜL 3: CANLI PORTFÖY & VARLIK TAKİP ÇANTASI (BENİM PORTFÖYÜM)
    // ========================================================================
    const pfGoldGrams = document.getElementById('pfGoldGrams');
    const pfUsdAmount = document.getElementById('pfUsdAmount');
    const pfEurAmount = document.getElementById('pfEurAmount');
    const pfPpfTry = document.getElementById('pfPpfTry');
    const pfEquityTry = document.getElementById('pfEquityTry');
    const pfCryptoTry = document.getElementById('pfCryptoTry');
    const portfolioBagSummaryBox = document.getElementById('portfolioBagSummaryBox');

    // Kayıtlı portföy çantasını yükle
    try {
      const savedPf = JSON.parse(localStorage.getItem(PORTFOLIO_BAG_KEY) || 'null');
      if (savedPf) {
        if (pfGoldGrams) pfGoldGrams.value = savedPf.gold ?? 15;
        if (pfUsdAmount) pfUsdAmount.value = savedPf.usd ?? 1200;
        if (pfEurAmount) pfEurAmount.value = savedPf.eur ?? 500;
        if (pfPpfTry) pfPpfTry.value = savedPf.ppf ?? 65000;
        if (pfEquityTry) pfEquityTry.value = savedPf.equity ?? 95000;
        if (pfCryptoTry) pfCryptoTry.value = savedPf.crypto ?? 12000;
      }
    } catch (e) {
      // ignore
    }

    function renderPortfolioBag() {
      if (!portfolioBagSummaryBox) return;
      const goldGrams = Math.max(0, Number(pfGoldGrams?.value) || 0);
      const usdAmt = Math.max(0, Number(pfUsdAmount?.value) || 0);
      const eurAmt = Math.max(0, Number(pfEurAmount?.value) || 0);
      const ppfTry = Math.max(0, Number(pfPpfTry?.value) || 0);
      const equityTry = Math.max(0, Number(pfEquityTry?.value) || 0);
      const cryptoTry = Math.max(0, Number(pfCryptoTry?.value) || 0);

      localStorage.setItem(
        PORTFOLIO_BAG_KEY,
        JSON.stringify({ gold: goldGrams, usd: usdAmt, eur: eurAmt, ppf: ppfTry, equity: equityTry, crypto: cryptoTry })
      );

      const RATE_GOLD = 6500;
      const RATE_USD = 49.84;
      const RATE_EUR = 55.5;

      const goldTry = goldGrams * RATE_GOLD;
      const usdTry = usdAmt * RATE_USD;
      const eurTry = eurAmt * RATE_EUR;
      const fxTotalTry = usdTry + eurTry;

      const totalPortfolioTry = goldTry + fxTotalTry + ppfTry + equityTry + cryptoTry;
      const totalPortfolioUsd = totalPortfolioTry / RATE_USD;

      document.getElementById('pfGoldValText').textContent = `Güncel Karşılığı: ${fmtTRY(goldTry)}`;
      document.getElementById('pfUsdValText').textContent = `Güncel Karşılığı: ${fmtTRY(usdTry)}`;
      document.getElementById('pfEurValText').textContent = `Güncel Karşılığı: ${fmtTRY(eurTry)}`;

      const denom = Math.max(1, totalPortfolioTry);
      const goldPct = Math.round((goldTry / denom) * 100);
      const eqPct = Math.round((equityTry / denom) * 100);
      const fxPct = Math.round((fxTotalTry / denom) * 100);
      const ppfPct = Math.round((ppfTry / denom) * 100);
      const cryPct = Math.round((cryptoTry / denom) * 100);

      portfolioBagSummaryBox.innerHTML = `
        <div class="pf-summary-card">
          <span class="loan-bank-pill">CANLI SERVET & SEPET DENGE ANALİZİ</span>
          <div class="pf-total-wealth">
            <small>TOPLAM PORTFÖY DEĞERİNİZ (TL & USD)</small>
            <strong>${fmtTRY(totalPortfolioTry)}</strong>
            <span class="text-emerald">≈ $${Math.round(totalPortfolioUsd).toLocaleString('tr-TR')} USD • ${Math.round(totalPortfolioTry / RATE_GOLD)} Gram Altın</span>
          </div>

          <div class="pf-allocation-bars">
            <div class="pf-bar-item">
              <div class="pf-bar-label"><span>🪙 Altın & Değerli Maden (%${goldPct})</span><small>YEK Hedefi: %30</small></div>
              <div class="pf-progress"><div class="pf-fill gold" style="width:${Math.min(100, goldPct)}%"></div></div>
            </div>
            <div class="pf-bar-item">
              <div class="pf-bar-label"><span>📈 Hisse & Teknoloji Fonları (%${eqPct})</span><small>YEK Hedefi: %30-%55</small></div>
              <div class="pf-progress"><div class="pf-fill emerald" style="width:${Math.min(100, eqPct)}%"></div></div>
            </div>
            <div class="pf-bar-item">
              <div class="pf-bar-label"><span>💵 Döviz & Eurobond (%${fxPct}) + 🛡️ PPF (%${ppfPct})</span><small>Likit & Döviz</small></div>
              <div class="pf-progress"><div class="pf-fill sky" style="width:${Math.min(100, fxPct + ppfPct)}%"></div></div>
            </div>
            <div class="pf-bar-item">
              <div class="pf-bar-label"><span>₿ Kripto / Oyun Parası (%${cryPct})</span><small>Maks. Sınır: %5</small></div>
              <div class="pf-progress"><div class="pf-fill ${cryPct > 5 ? 'rose' : 'emerald'}" style="width:${Math.min(100, cryPct * 4)}%"></div></div>
            </div>
          </div>

          <p class="pf-advisor-note">
            ${
              cryPct > 5
                ? `⚠️ <strong>Risk Uyarısı:</strong> Kripto varlık payınız <strong>%${cryPct}</strong> ile Yusuf Efe Karagöz'ün <strong>Maksimum %5 Oyun Parası</strong> sınırını aşmış durumda. Fazla kısmı Altın veya Hisse Yoğun Fonlara aktarmanız önerilir.`
                : `✅ <strong>Dengeli Portföy:</strong> Kripto payınız (%${cryPct}) güvenli sınırda. Bu portföy büyüklüğünü tek tıkla Bütçe Hesapla sayfasındaki Hazır Birikiminize de eşitleyebilirsiniz.`
            }
          </p>
          <button type="button" id="syncPfToBudgetBtn" class="btn btn-secondary" style="width:100%; margin-top:8px;">
            🔄 Bu Portföy Toplamını (${fmtTRY(totalPortfolioTry)}) Hazır Birikimime Eşitle
          </button>
        </div>
      `;

      document.getElementById('syncPfToBudgetBtn')?.addEventListener('click', () => {
        try {
          const raw = localStorage.getItem('yek_dogru_butce_v1');
          const d = raw ? JSON.parse(raw) : {};
          d.currentSavings = Math.round(totalPortfolioTry);
          localStorage.setItem('yek_dogru_butce_v1', JSON.stringify(d));
          const btn = document.getElementById('syncPfToBudgetBtn');
          if (btn) btn.textContent = `✓ Hazır Birikiminiz ${fmtTRY(totalPortfolioTry)} Olarak Güncellendi!`;
          renderFireGoals();
          renderStressTest();
        } catch (e) {
          // ignore
        }
      });
    }

    [pfGoldGrams, pfUsdAmount, pfEurAmount, pfPpfTry, pfEquityTry, pfCryptoTry].forEach((el) =>
      el?.addEventListener('input', renderPortfolioBag)
    );
    renderPortfolioBag();

    // ========================================================================
    // MODÜL 4: HEDEF KUMBARASI & FİNANSAL ÖZGÜRLÜK (FIRE) GERİ SAYIM SAATİ
    // ========================================================================
    const customGoalName = document.getElementById('customGoalName');
    const customGoalTarget = document.getElementById('customGoalTarget');
    const fireGoalsGrid = document.getElementById('fireGoalsGrid');

    function renderFireGoals() {
      if (!fireGoalsGrid) return;
      const s = getSavedBudgetSnapshot();
      const customTitle = customGoalName?.value || 'Özel Finansal Hedefim';
      const customTargetVal = Math.max(10000, Number(customGoalTarget?.value) || 850000);
      const monthlySpeed = Math.max(1000, s.positiveSavings || 5000);

      const goals = [
        {
          icon: '🛡️',
          title: 'Sıfırıncı Adım: 3 Aylık Acil Durum Fonu',
          target: s.minEF,
          current: s.currentSavings,
        },
        {
          icon: '🏰',
          title: '6 Aylık Tam Güvenlik Kalkanı',
          target: s.maxEF,
          current: s.currentSavings,
        },
        {
          icon: '🎯',
          title: customTitle,
          target: customTargetVal,
          current: s.currentSavings,
        },
        {
          icon: '🔥',
          title: 'FIRE (Finansal Özgürlük — Yıllık Giderin 25 Katı)',
          target: s.fireTarget,
          current: s.currentSavings,
        },
      ];

      fireGoalsGrid.innerHTML = goals
        .map((g) => {
          const pct = Math.min(100, Math.round((g.current / Math.max(1, g.target)) * 100));
          const gap = Math.max(0, g.target - g.current);
          const monthsLeft = gap === 0 ? 0 : Math.ceil(gap / monthlySpeed);
          const fasterMonths = gap === 0 ? 0 : Math.ceil(gap / (monthlySpeed + 5000));
          return `
            <article class="fire-goal-card">
              <div class="fire-goal-top">
                <span class="fire-goal-icon">${g.icon}</span>
                <div>
                  <h4>${g.title}</h4>
                  <small>Hedef: <strong>${fmtTRY(g.target)}</strong> • Mevcut: <strong>${fmtTRY(g.current)}</strong></small>
                </div>
                <span class="fire-pct-badge">%${pct}</span>
              </div>
              <div class="pf-progress"><div class="pf-fill emerald" style="width:${pct}%"></div></div>
              <p class="fire-time-note">
                ${
                  gap === 0
                    ? '🏆 <strong>Tebrikler!</strong> Mevcut hazır birikiminizle bu hedefi tamamen tamamladınız.'
                    : `⏳ Aylık <strong>${fmtTRY(monthlySpeed)}</strong> tasarruf hızıyla <strong>${monthsLeft} ay (${(monthsLeft / 12).toFixed(1)} yıl)</strong> kaldı. <br><small>💡 Tasarrufunuza ayda +5.000 ₺ eklerseniz süre <strong>${fasterMonths} aya</strong> düşer!</small>`
                }
              </p>
            </article>
          `;
        })
        .join('');
    }

    customGoalName?.addEventListener('input', renderFireGoals);
    customGoalTarget?.addEventListener('input', renderFireGoals);
    renderFireGoals();

    // ========================================================================
    // MODÜL 5: MERKEZ BANKASI (TCMB / FED / ECB / BoJ) FAİZ TAKVİMİ
    // ========================================================================
    const centralBanksCalendarGrid = document.getElementById('centralBanksCalendarGrid');
    if (centralBanksCalendarGrid) {
      centralBanksCalendarGrid.innerHTML = CENTRAL_BANKS_CALENDAR.map(
        (cb) => `
          <article class="cb-card">
            <div class="cb-card-head">
              <span class="cb-flag">${cb.flag}</span>
              <div>
                <h4>${cb.name}</h4>
                <small>📅 ${cb.nextMeeting}</small>
              </div>
              <span class="cb-rate-pill">Faiz: ${cb.currentRate}</span>
            </div>
            <p class="cb-expect-text"><strong>🔮 Piyasa Beklentisi:</strong> ${cb.expectation}</p>
            <ul class="cb-scenarios-list">
              ${cb.scenarios.map((sc) => `<li>${sc}</li>`).join('')}
            </ul>
          </article>
        `
      ).join('');
    }

    // ========================================================================
    // MODÜL 6: EKONOMİK KRİZ & ŞOK STRES TESTİ
    // ========================================================================
    const stressButtons = document.querySelectorAll('.stress-btn');
    const stressTestResultBox = document.getElementById('stressTestResultBox');
    let activeScenario = 'job_loss';

    function renderStressTest() {
      if (!stressTestResultBox) return;
      const s = getSavedBudgetSnapshot();

      let title = '';
      let survivalMonths = 0;
      let shockedMonthlyNet = 0;
      let prescription = '';

      if (activeScenario === 'job_loss') {
        title = '🚨 Senaryo 1: 6 Ay Boyunca Tüm Gelirlerin Kesilmesi (İşsizlik Şoku)';
        survivalMonths = +(s.currentSavings / Math.max(1, s.totalNeeds)).toFixed(1);
        shockedMonthlyNet = -s.totalNeeds;
        prescription =
          survivalMonths >= 6
            ? `Mevcut <strong>${fmtTRY(s.currentSavings)}</strong> birikiminiz, zorunlu giderlerinizi (${fmtTRY(s.totalNeeds)}/ay) <strong>${survivalMonths} ay</strong> boyunca hiçbir gelir olmadan karşılayabiliyor. Tam güvenlik kalkanındasınız!`
            : `Mevcut birikiminiz (${fmtTRY(s.currentSavings)}) zorunlu giderlerinizi yalnızca <strong>${survivalMonths} ay</strong> karşılayabiliyor. 6 aylık tam güvence için Para Piyasası Fonu tamponunuzu <strong>${fmtTRY(s.maxEF)}</strong> seviyesine çıkarmalısınız.`;
      } else if (activeScenario === 'inflation_spike') {
        title = '🔥 Senaryo 2: Zorunlu Giderlerde +%35 Ani Enflasyon Şoku';
        const newNeeds = Math.round(s.totalNeeds * 1.35);
        shockedMonthlyNet = s.totalIncome - (newNeeds + s.totalWants + s.totalDebts);
        survivalMonths = +(s.currentSavings / Math.max(1, newNeeds)).toFixed(1);
        prescription =
          shockedMonthlyNet >= 0
            ? `Zorunlu giderleriniz %35 artsa bile (${fmtTRY(newNeeds)}/ay), bütçeniz eksiye düşmüyor ve her ay <strong>${fmtTRY(shockedMonthlyNet)}</strong> artırmaya devam edebiliyorsunuz.`
            : `Zorunlu giderlerdeki %35 artış bütçenizi aylık <strong>${fmtTRY(Math.abs(shockedMonthlyNet))} açık</strong> verir hale getiriyor. Kişisel istek harcamalarınızı (${fmtTRY(s.totalWants)}) %40 kısarak dengeyi koruyabilirsiniz.`;
      } else if (activeScenario === 'fx_jump') {
        title = '💵 Senaryo 3: Döviz ve Altın Kurlarında +%30 Ani Sıçrama';
        const hedgedGain = Math.round(s.currentSavings * 0.65 * 0.3);
        shockedMonthlyNet = s.netMonthly;
        survivalMonths = +(s.currentSavings / Math.max(1, s.totalNeeds)).toFixed(1);
        prescription = `Birikiminizin %65'i Yusuf Efe Karagöz'ün önerdiği gibi Altın (%30), Yabancı Fon (%25) ve Eurobond (%10) sepetindeyse, +%30 kur sıçramasında portföyünüz <strong>+${fmtTRY(hedgedGain)}</strong> değer kazanarak ithal enflasyon şokuna karşı alım gücünüzü korur.`;
      } else {
        title = '⛈️ Senaryo 4: Kusursuz Fırtına (Gelir -%25 Düşerken Gider +%25 Artarsa)';
        const stormIncome = Math.round(s.totalIncome * 0.75);
        const stormExpense = Math.round(s.totalExpense * 1.25);
        shockedMonthlyNet = stormIncome - stormExpense;
        survivalMonths =
          shockedMonthlyNet >= 0
            ? 99
            : +(s.currentSavings / Math.max(1, Math.abs(shockedMonthlyNet))).toFixed(1);
        prescription =
          shockedMonthlyNet >= 0
            ? `En ağır kriz senaryosunda dahi bütçeniz başa baş noktasını koruyor!`
            : `Kusursuz fırtınada bütçeniz ayda <strong>${fmtTRY(Math.abs(shockedMonthlyNet))}</strong> açık veriyor; hazır birikiminiz bu açığı <strong>${survivalMonths} ay</strong> boyunca finanse edebilir.`;
      }

      stressTestResultBox.innerHTML = `
        <div class="stress-result-card">
          <h4>${title}</h4>
          <div class="stress-metrics-row">
            <div class="stress-metric">
              <small>Hazır Birikim Dayanma Süresi</small>
              <strong class="text-gold">${survivalMonths >= 36 ? '36+ Ay (Tam Kalkan)' : `${survivalMonths} Ay`}</strong>
            </div>
            <div class="stress-metric">
              <small>Şok Sonrası Aylık Net Nakit Akışı</small>
              <strong class="${shockedMonthlyNet >= 0 ? 'text-emerald' : 'text-rose'}">${fmtTRY(shockedMonthlyNet)} / ay</strong>
            </div>
            <div class="stress-metric">
              <small>6 Aylık Tam Kalkan Hedefi</small>
              <strong>${fmtTRY(s.maxEF)}</strong>
            </div>
          </div>
          <p class="stress-prescription-text">🩺 <strong>Yusuf Efe Karagöz Kriz Reçetesi:</strong> ${prescription}</p>
        </div>
      `;
    }

    stressButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        stressButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeScenario = btn.dataset.scenario || 'job_loss';
        renderStressTest();
      });
    });

    renderStressTest();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFintechSuperCenter);
  } else {
    initFintechSuperCenter();
  }

  window.YEK_FINTECH_SUPER = {
    TURKEY_BANKS,
    calculateTurkishLoan,
    findBankOrLoanForAI,
  };
})();
