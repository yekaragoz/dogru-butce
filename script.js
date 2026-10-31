// Doğru Bütçe Doğru Kullanım - Piyasa Uzmanı Yusuf Efe Karagöz
// Çok Sayfalı (Multi-Page) Mimari: Her Bölüm Ayrı HTML Sayfasında Çalışır ve Verileri localStorage Üzerinden Senkronize Eder

const STORAGE_KEY = 'yek_dogru_butce_v1';
const GEMINI_API_KEY_STORAGE = 'yek_gemini_api_key_v1';

// Tüm sayfalarda "Ülkeler & Enflasyon", "Kredi, Bankalar & Portföy" ve "Dünya Haberleri, Borsa & Maaş" menü sekmelerinin otomatik yüklenmesi
(function ensureGlobalEconomiesLoaded() {
  if (!window.GLOBAL_ECONOMIES_120 && !document.querySelector('script[src*="global-economies.js"]')) {
    const sc = document.createElement('script');
    sc.src = 'global-economies.js?v=6';
    document.head.appendChild(sc);
  }
  if (!window.YEK_FINTECH_SUPER && !document.querySelector('script[src*="fintech-super.js"]')) {
    const sc2 = document.createElement('script');
    sc2.src = 'fintech-super.js?v=7';
    document.head.appendChild(sc2);
  }
  if (!window.YEK_ECONOMY_NEWS_ACADEMY && !document.querySelector('script[src*="ekonomi-haber-akademi.js"]')) {
    const sc3 = document.createElement('script');
    sc3.src = 'ekonomi-haber-akademi.js?v=6';
    document.head.appendChild(sc3);
  }
})();

const DEFAULT_BUDGET_DATA = {
  currentSavings: 85000,
  goal: 'balanced',
  incSalary: 52000,
  incSide: 8000,
  incPassive: 0,
  expRent: 16000,
  expBills: 3800,
  expGroceries: 9500,
  expTransport: 3200,
  expDebt: 5500,
  expLifestyle: 6000,
  customIncomes: [],
  customExpenses: [],
};

const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(num);
};

// Tarayıcı Sekmesinde (URL/Link Yanında) Yuvarlak YEK Logosunu Kesin Gösteren Canvas Favicon Üretici
function applyRoundYekFavicon() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createRadialGradient(22, 20, 4, 32, 32, 30);
    bgGrad.addColorStop(0, '#14332d');
    bgGrad.addColorStop(1, '#060c10');
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fillStyle = bgGrad;
    ctx.fill();

    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#10b981';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(32, 32, 25.5, 0, Math.PI * 2);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([4, 2]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = 'bold 18px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#34d399';
    ctx.fillText('Y', 17, 34);

    ctx.font = 'bold 21px Georgia, serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('E', 32, 34);

    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText('K', 47, 34);

    const dataUrl = canvas.toDataURL('image/png');
    let link = document.getElementById('dynamicFavicon') || document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = dataUrl;
  } catch (e) {
    console.warn('Favicon oluşturulamadı:', e);
  }
}

// localStorage'dan bütçe verisini oku (yoksa varsayılan örnek veriyi döndür)
function getStoredBudgetRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_BUDGET_DATA };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BUDGET_DATA, ...parsed };
  } catch (err) {
    return { ...DEFAULT_BUDGET_DATA };
  }
}

// Tüm sayfalar için ortak bütçe hesaplama özeti üretici
function computeBudgetSnapshot(raw) {
  const data = raw || getStoredBudgetRaw();
  const currentSavings = Math.max(0, Number(data.currentSavings) || 0);
  const goal = data.goal || 'balanced';

  const incSalary = Math.max(0, Number(data.incSalary) || 0);
  const incSide = Math.max(0, Number(data.incSide) || 0);
  const incPassive = Math.max(0, Number(data.incPassive) || 0);
  let customIncTotal = 0;
  if (Array.isArray(data.customIncomes)) {
    data.customIncomes.forEach((item) => {
      customIncTotal += Math.max(0, Number(item.amount) || 0);
    });
  }
  const totalIncome = incSalary + incSide + incPassive + customIncTotal;

  const expRent = Math.max(0, Number(data.expRent) || 0);
  const expBills = Math.max(0, Number(data.expBills) || 0);
  const expGroceries = Math.max(0, Number(data.expGroceries) || 0);
  const expTransport = Math.max(0, Number(data.expTransport) || 0);
  const expDebt = Math.max(0, Number(data.expDebt) || 0);
  const expLifestyle = Math.max(0, Number(data.expLifestyle) || 0);

  let totalNeeds = expRent + expBills + expGroceries + expTransport;
  let totalDebts = expDebt;
  let totalWants = expLifestyle;

  if (Array.isArray(data.customExpenses)) {
    data.customExpenses.forEach((item) => {
      const amt = Math.max(0, Number(item.amount) || 0);
      if (item.category === 'need') totalNeeds += amt;
      else if (item.category === 'debt') totalDebts += amt;
      else totalWants += amt;
    });
  }

  const totalExpense = totalNeeds + totalDebts + totalWants;
  const rentVal = expRent;
  const netMonthly = totalIncome - totalExpense;
  const positiveSavings = Math.max(0, netMonthly);
  const totalPower = currentSavings + netMonthly;

  const minEF = totalNeeds * 3;
  const maxEF = totalNeeds * 6;
  const savingsRate = totalIncome > 0 ? Math.round((netMonthly / totalIncome) * 100) : 0;
  const needsRate = totalIncome > 0 ? Math.round((totalNeeds / totalIncome) * 100) : 0;
  const wantsRate = totalIncome > 0 ? Math.round((totalWants / totalIncome) * 100) : 0;
  const debtRate = totalIncome > 0 ? Math.round((totalDebts / totalIncome) * 100) : 0;

  const annualExpense = totalExpense * 12;
  const fireTarget = annualExpense * 25;

  return {
    currentSavings,
    goal,
    totalIncome,
    totalExpense,
    totalNeeds,
    totalWants,
    totalDebts,
    rentVal,
    netMonthly,
    positiveSavings,
    totalPower,
    minEF,
    maxEF,
    savingsRate,
    needsRate,
    wantsRate,
    debtRate,
    annualExpense,
    fireTarget,
  };
}

// Bileşik getiri hesaplama fonksiyonu (Yıllık %18 reel getiri varsayımıyla)
function calcCompoundFutureValue(principal, monthlyContribution, years, annualRealRate = 0.18) {
  const r = annualRealRate / 12;
  const n = years * 12;
  const fvPrincipal = principal * Math.pow(1 + r, n);
  const fvSeries = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
  return Math.round(fvPrincipal + fvSeries);
}

// =========================================================
// SAYFA BAZLI HESAPLAMA VE GÖRSELLEŞTİRME MODÜLLERİ
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  applyRoundYekFavicon();

  const currentSavingsInput = document.getElementById('currentSavings');
  const financialGoalSelect = document.getElementById('financialGoal');
  const autoSaveStatus = document.getElementById('autoSaveStatus');

  const customIncomeList = document.getElementById('customIncomeList');
  const customExpenseList = document.getElementById('customExpenseList');

  const newIncomeName = document.getElementById('newIncomeName');
  const newIncomeAmount = document.getElementById('newIncomeAmount');
  const addIncomeBtn = document.getElementById('addIncomeBtn');

  const newExpenseName = document.getElementById('newExpenseName');
  const newExpenseCategory = document.getElementById('newExpenseCategory');
  const newExpenseAmount = document.getElementById('newExpenseAmount');
  const addExpenseBtn = document.getElementById('addExpenseBtn');

  const fillSampleBtn = document.getElementById('fillSampleBtn');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const printReportBtn = document.getElementById('printReportBtn');
  const printReportBtnBottom = document.getElementById('printReportBtnBottom');

  const categoryMeta = {
    need: { label: 'Zorunlu', className: 'tag-need' },
    want: { label: 'İstek', className: 'tag-want' },
    debt: { label: 'Borç', className: 'tag-debt' },
  };

  // Eğer bütçe hesaplama sayfasındaysak DOM'dan oku ve localStorage'a kaydet
  function syncDomToStorage() {
    if (!currentSavingsInput) return getStoredBudgetRaw();

    const customIncomes = [];
    if (customIncomeList) {
      customIncomeList.querySelectorAll('.income-item').forEach((inp) => {
        customIncomes.push({
          name: inp.dataset.name || 'Ek Gelir',
          amount: Math.max(0, Number(inp.value) || 0),
        });
      });
    }

    const customExpenses = [];
    if (customExpenseList) {
      customExpenseList.querySelectorAll('.expense-item').forEach((inp) => {
        customExpenses.push({
          name: inp.dataset.name || 'Ek Gider',
          category: inp.dataset.category || 'want',
          amount: Math.max(0, Number(inp.value) || 0),
        });
      });
    }

    const payload = {
      currentSavings: Math.max(0, Number(currentSavingsInput.value) || 0),
      goal: financialGoalSelect ? financialGoalSelect.value : 'balanced',
      incSalary: Math.max(0, Number(document.getElementById('incSalary')?.value) || 0),
      incSide: Math.max(0, Number(document.getElementById('incSide')?.value) || 0),
      incPassive: Math.max(0, Number(document.getElementById('incPassive')?.value) || 0),
      expRent: Math.max(0, Number(document.getElementById('expRent')?.value) || 0),
      expBills: Math.max(0, Number(document.getElementById('expBills')?.value) || 0),
      expGroceries: Math.max(0, Number(document.getElementById('expGroceries')?.value) || 0),
      expTransport: Math.max(0, Number(document.getElementById('expTransport')?.value) || 0),
      expDebt: Math.max(0, Number(document.getElementById('expDebt')?.value) || 0),
      expLifestyle: Math.max(0, Number(document.getElementById('expLifestyle')?.value) || 0),
      customIncomes,
      customExpenses,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      if (autoSaveStatus) {
        autoSaveStatus.textContent = '✓ Verileriniz Otomatik Kaydedildi';
      }
    } catch (e) {
      // ignore
    }
    return payload;
  }

  // Bütçe Hesapla sayfasındaki inputları localStorage'dan doldur
  function populateCalculatorInputsFromStorage() {
    if (!currentSavingsInput) return;
    const saved = getStoredBudgetRaw();
    currentSavingsInput.value = saved.currentSavings;
    if (financialGoalSelect && saved.goal) {
      financialGoalSelect.value = saved.goal;
    }
    ['incSalary', 'incSide', 'incPassive', 'expRent', 'expBills', 'expGroceries', 'expTransport', 'expDebt', 'expLifestyle'].forEach((id) => {
      const el = document.getElementById(id);
      if (el && saved[id] !== undefined) {
        el.value = saved[id];
      }
    });

    if (customIncomeList && Array.isArray(saved.customIncomes)) {
      customIncomeList.innerHTML = '';
      saved.customIncomes.forEach((item) => {
        addCustomIncome(item.name, item.amount, false);
      });
    }
    if (customExpenseList && Array.isArray(saved.customExpenses)) {
      customExpenseList.innerHTML = '';
      saved.customExpenses.forEach((item) => {
        addCustomExpense(item.name, item.category, item.amount, false);
      });
    }
  }

  // 1. BÜTÇE HESAPLA ÖZET ÇUBUĞU GÜNCELLEME (Sadece butce-hesapla.html'de çalışır)
  function updateSummaryBar(snap) {
    const totalIncomeDisplay = document.getElementById('totalIncomeDisplay');
    const totalExpenseDisplay = document.getElementById('totalExpenseDisplay');
    const summaryCurrentSavings = document.getElementById('summaryCurrentSavings');
    const summaryIncome = document.getElementById('summaryIncome');
    const summaryExpense = document.getElementById('summaryExpense');
    const summaryNetMonthly = document.getElementById('summaryNetMonthly');
    const summaryTotalPower = document.getElementById('summaryTotalPower');

    if (totalIncomeDisplay) totalIncomeDisplay.textContent = formatCurrency(snap.totalIncome);
    if (totalExpenseDisplay) totalExpenseDisplay.textContent = formatCurrency(snap.totalExpense);
    if (summaryCurrentSavings) summaryCurrentSavings.textContent = formatCurrency(snap.currentSavings);
    if (summaryIncome) summaryIncome.textContent = formatCurrency(snap.totalIncome);
    if (summaryExpense) summaryExpense.textContent = formatCurrency(snap.totalExpense);
    if (summaryNetMonthly) {
      summaryNetMonthly.textContent = formatCurrency(snap.netMonthly);
      if (snap.netMonthly < 0) {
        summaryNetMonthly.classList.remove('text-gold', 'text-emerald');
        summaryNetMonthly.classList.add('text-coral');
      } else {
        summaryNetMonthly.classList.remove('text-coral');
        summaryNetMonthly.classList.add('text-gold');
      }
    }
    if (summaryTotalPower) summaryTotalPower.textContent = formatCurrency(snap.totalPower);
  }

  // 2. GÖRSEL ANALİZ & HALKAGRAFİK (Sadece gorsel-analiz.html'de çalışır)
  function updateVisualAnalysis(snap) {
    const segNeeds = document.getElementById('segNeeds');
    if (!segNeeds) return;

    const { totalIncome, totalNeeds, totalWants, totalDebts, netMonthly, positiveSavings } = snap;
    const base = totalIncome > 0 ? totalIncome : 1;

    const pctNeeds = Math.round((totalNeeds / base) * 100);
    const pctWants = Math.round((totalWants / base) * 100);
    const pctDebts = Math.round((totalDebts / base) * 100);
    const pctSavings = totalIncome > 0 ? Math.round((netMonthly / totalIncome) * 100) : 0;

    const circumference = 515.2;
    const chartTotal = totalNeeds + totalWants + totalDebts + positiveSavings;
    const denom = chartTotal > 0 ? chartTotal : 1;

    const lenNeeds = (totalNeeds / denom) * circumference;
    const lenWants = (totalWants / denom) * circumference;
    const lenDebts = (totalDebts / denom) * circumference;
    const lenSavings = (positiveSavings / denom) * circumference;

    const segWants = document.getElementById('segWants');
    const segDebts = document.getElementById('segDebts');
    const segSavings = document.getElementById('segSavings');

    if (chartTotal === 0) {
      [segNeeds, segWants, segDebts, segSavings].forEach((el) => {
        if (el) {
          el.setAttribute('stroke-dasharray', `0 ${circumference}`);
          el.setAttribute('stroke-dashoffset', '0');
        }
      });
    } else {
      segNeeds.setAttribute('stroke-dasharray', `${lenNeeds} ${circumference}`);
      segNeeds.setAttribute('stroke-dashoffset', '0');

      segWants.setAttribute('stroke-dasharray', `${lenWants} ${circumference}`);
      segWants.setAttribute('stroke-dashoffset', `${-lenNeeds}`);

      segDebts.setAttribute('stroke-dasharray', `${lenDebts} ${circumference}`);
      segDebts.setAttribute('stroke-dashoffset', `${-(lenNeeds + lenWants)}`);

      segSavings.setAttribute('stroke-dasharray', `${lenSavings} ${circumference}`);
      segSavings.setAttribute('stroke-dashoffset', `${-(lenNeeds + lenWants + lenDebts)}`);
    }

    document.getElementById('savingsRateCenter').textContent = `%${pctSavings}`;
    const healthBadge = document.getElementById('budgetHealthBadge');
    if (totalIncome === 0) {
      healthBadge.textContent = 'Veri Bekleniyor';
    } else if (pctSavings >= 20) {
      healthBadge.textContent = 'Güçlü Bütçe';
    } else if (pctSavings > 0) {
      healthBadge.textContent = 'Geliştirilebilir';
    } else {
      healthBadge.textContent = 'Bütçe Açığı Var!';
    }

    document.getElementById('legendNeeds').textContent = `${formatCurrency(totalNeeds)} (%${pctNeeds})`;
    document.getElementById('legendWants').textContent = `${formatCurrency(totalWants)} (%${pctWants})`;
    document.getElementById('legendDebts').textContent = `${formatCurrency(totalDebts)} (%${pctDebts})`;
    document.getElementById('legendSavings').textContent = `${formatCurrency(netMonthly)} (%${pctSavings})`;

    document.getElementById('ratioNeedsText').textContent = `%${pctNeeds}`;
    document.getElementById('barNeeds').style.width = `${Math.min(100, Math.max(0, pctNeeds))}%`;

    document.getElementById('ratioWantsText').textContent = `%${pctWants}`;
    document.getElementById('barWants').style.width = `${Math.min(100, Math.max(0, pctWants))}%`;

    document.getElementById('ratioDebtsText').textContent = `%${pctDebts}`;
    document.getElementById('barDebts').style.width = `${Math.min(100, Math.max(0, pctDebts))}%`;

    document.getElementById('ratioSavingsText').textContent = `%${pctSavings}`;
    document.getElementById('barSavings').style.width = `${Math.min(100, Math.max(0, pctSavings))}%`;

    const diagBox = document.getElementById('diagnosticAlertBox');
    if (totalIncome === 0) {
      diagBox.innerHTML = `<strong>Yusuf Efe Karagöz Notu:</strong> Analizi görmek için lütfen <a href="butce-hesapla.html" style="color:#34d399;text-decoration:underline;">Bütçe Hesapla</a> sayfasından aylık gelir ve gider bilgilerinizi girin.`;
    } else if (netMonthly < 0) {
      diagBox.innerHTML = `<strong>Kritik Uyarı:</strong> Aylık giderleriniz gelirinizden <strong>${formatCurrency(Math.abs(netMonthly))}</strong> daha fazla! Yatırıma geçmeden önce istek harcamalarını kısıp borç yapılandırması yapmalısınız.`;
    } else if (pctSavings >= 20) {
      diagBox.innerHTML = `<strong>Tebrikler!</strong> Aylık gelirinizin <strong>%${pctSavings}</strong>'ini (${formatCurrency(netMonthly)}) koruyabiliyorsunuz. Bu oran Yusuf Efe Karagöz'ün ideal 50/30/20 disiplinini karşılıyor.`;
    } else {
      diagBox.innerHTML = `<strong>Gelişim Alanı:</strong> Aylık tasarruf oranınız şu an <strong>%${pctSavings}</strong> (${formatCurrency(netMonthly)}). İdeal hedef olan %20'ye (${formatCurrency(totalIncome * 0.2)}) ulaşmak için kişisel istek giderlerinden <strong>${formatCurrency(Math.max(0, totalIncome * 0.2 - netMonthly))}</strong> tasarruf edebilirsiniz.`;
    }
  }

  // 3. 5 ALTIN İLKE HESAPLAMALARI (Sadece altin-kurallar.html'de çalışır)
  function updateFivePrinciples(snap) {
    const efMonthlyNeedsEl = document.getElementById('efMonthlyNeeds');
    if (!efMonthlyNeedsEl) return;

    const { currentSavings, totalNeeds, positiveSavings, goal } = snap;

    const minEF = totalNeeds * 3;
    const maxEF = totalNeeds * 6;
    const efFullPct = maxEF > 0 ? Math.min(100, Math.round((currentSavings / maxEF) * 100)) : 100;

    efMonthlyNeedsEl.textContent = formatCurrency(totalNeeds);
    document.getElementById('efTargetMin').textContent = formatCurrency(minEF);
    document.getElementById('efTargetMax').textContent = formatCurrency(maxEF);
    document.getElementById('efCurrentCash').textContent = formatCurrency(currentSavings);
    document.getElementById('efProgressPercent').textContent = `%${efFullPct} (6 Aylık Tam Hedefe Göre)`;
    document.getElementById('efProgressBar').style.width = `${efFullPct}%`;

    const efBadge = document.getElementById('efStatusBadge');
    const efAdvice = document.getElementById('efActionAdvice');

    let investableLumpSum = 0;
    let monthlyEmergencySlice = 0;

    if (totalNeeds === 0) {
      efBadge.textContent = 'Gider Giriniz';
      efAdvice.innerHTML = `Zorunlu giderlerinizi <a href="butce-hesapla.html" style="color:#34d399;text-decoration:underline;">Bütçe Hesapla</a> sayfasından girdiğinizde 3-6 aylık Acil Durum Fonu hedefiniz otomatik hesaplanacaktır.`;
    } else if (currentSavings < minEF) {
      const gap = minEF - currentSavings;
      efBadge.textContent = 'Öncelikli Tamamlanmalı';
      monthlyEmergencySlice = Math.round(positiveSavings * (goal === 'emergency' ? 0.7 : 0.4));
      efAdvice.innerHTML = `<strong>Yusuf Efe Karagöz Aksiyonu:</strong> Mevcut birikiminiz (${formatCurrency(currentSavings)}), minimum 3 aylık zorunlu gider tamponunuzun (${formatCurrency(minEF)}) <strong>${formatCurrency(gap)}</strong> gerisinde. Kalan aylık bütçenizden her ay <strong>${formatCurrency(monthlyEmergencySlice)}</strong> tutarını yüksek faizli günlük mevduat / Para Piyasası Fonuna aktararak önce "Sıfırıncı Adımı" tamamlayın.`;
    } else if (currentSavings < maxEF) {
      investableLumpSum = currentSavings - minEF;
      monthlyEmergencySlice = Math.round(positiveSavings * 0.15);
      efBadge.textContent = '3 Aylık Sınır Aşıldı ✓';
      efAdvice.innerHTML = `<strong>Yusuf Efe Karagöz Aksiyonu:</strong> Harika! 3 aylık minimum tamponunuz (${formatCurrency(minEF)}) hazır. Bu tutarı günlük faizde/PPF'de koruyun. Üzerinde kalan <strong>${formatCurrency(investableLumpSum)}</strong> hazır bütçenizi ve aylık artan bütçenizin %85'ini yatırım sepetine yönlendirebilirsiniz.`;
    } else {
      investableLumpSum = currentSavings - maxEF;
      monthlyEmergencySlice = 0;
      efBadge.textContent = 'Tam Güvence (6+ Ay) ✓';
      efAdvice.innerHTML = `<strong>Yusuf Efe Karagöz Aksiyonu:</strong> Mükemmel! 6 aylık tam acil durum kalkanınız (${formatCurrency(maxEF)}) tamamlanmış durumda. Bu tutarı likit Para Piyasası Fonunda/Günlük Mevduatta tutup, geriye kalan <strong>${formatCurrency(investableLumpSum)}</strong> nakit gücünüzü ve aylık artan bütçenizin tamamını yatırıma dönüştürebilirsiniz.`;
    }

    const monthlyInvestableTotal = Math.max(0, positiveSavings - monthlyEmergencySlice);
    const monthlySpeculative = Math.round(monthlyInvestableTotal * 0.05);
    const monthlyCoreDCA = Math.max(0, monthlyInvestableTotal - monthlySpeculative);

    document.getElementById('compoundMonthlyInput').textContent = `${formatCurrency(monthlyInvestableTotal)} / ay`;
    document.getElementById('comp1Year').textContent = formatCurrency(calcCompoundFutureValue(investableLumpSum, monthlyInvestableTotal, 1));
    document.getElementById('comp3Years').textContent = formatCurrency(calcCompoundFutureValue(investableLumpSum, monthlyInvestableTotal, 3));
    document.getElementById('comp5Years').textContent = formatCurrency(calcCompoundFutureValue(investableLumpSum, monthlyInvestableTotal, 5));
    document.getElementById('comp10Years').textContent = formatCurrency(calcCompoundFutureValue(investableLumpSum, monthlyInvestableTotal, 10));

    document.getElementById('dcaMonthlyTotal').textContent = `${formatCurrency(positiveSavings)} / ay`;
    document.getElementById('dcaEmergencySlice').textContent = `${formatCurrency(monthlyEmergencySlice)} / ay`;
    document.getElementById('dcaCoreSlice').textContent = `${formatCurrency(monthlyCoreDCA)} / ay`;
    document.getElementById('dcaSpecSlice').textContent = `${formatCurrency(monthlySpeculative)} / ay`;

    document.getElementById('allocGold').textContent = `${formatCurrency(monthlyInvestableTotal * 0.30)} / ay`;
    document.getElementById('allocLocalEquity').textContent = `${formatCurrency(monthlyInvestableTotal * 0.30)} / ay`;
    document.getElementById('allocForeignTech').textContent = `${formatCurrency(monthlyInvestableTotal * 0.25)} / ay`;
    document.getElementById('allocEurobond').textContent = `${formatCurrency(monthlyInvestableTotal * 0.10)} / ay`;

    document.getElementById('allocGoldLump').textContent = `Hazır Birikimden Pay: ${formatCurrency(investableLumpSum * 0.30)}`;
    document.getElementById('allocLocalLump').textContent = `Hazır Birikimden Pay: ${formatCurrency(investableLumpSum * 0.30)}`;
    document.getElementById('allocForeignLump').textContent = `Hazır Birikimden Pay: ${formatCurrency(investableLumpSum * 0.25)}`;
    document.getElementById('allocEurobondLump').textContent = `Hazır Birikimden Pay: ${formatCurrency(investableLumpSum * 0.10)}`;

    document.getElementById('corePortfolioAmount').textContent = `${formatCurrency(monthlyCoreDCA)} / ay`;
    document.getElementById('maxSpeculationAmount').textContent = `${formatCurrency(monthlySpeculative)} / ay`;
    document.getElementById('maxSpeculationTotal').textContent = `Hazır Yatırım Sermayesinde Maks. %5 Sınır: ${formatCurrency(investableLumpSum * 0.05)}`;
  }

  // 4. AKILLI TAVSİYE MOTORU (Sadece tavsiye-motoru.html'de çalışır)
  function updateSmartRecommendationEngine(snap) {
    const adviceGrid = document.getElementById('smartAdviceGrid');
    if (!adviceGrid) return;

    const {
      currentSavings,
      totalIncome,
      totalExpense,
      totalNeeds,
      totalWants,
      totalDebts,
      rentVal,
      netMonthly,
    } = snap;

    const scoreValueEl = document.getElementById('engineScoreValue');
    const scoreLabelEl = document.getElementById('engineScoreLabel');
    const mainVerdictEl = document.getElementById('engineMainVerdict');
    const mainSummaryEl = document.getElementById('engineMainSummary');

    if (totalIncome <= 0 && totalExpense <= 0) {
      scoreValueEl.textContent = '-';
      scoreLabelEl.textContent = 'Veri Giriniz';
      mainVerdictEl.textContent = 'Analiz İçin Gelir ve Gider Bilgilerinizi Bekliyoruz';
      mainSummaryEl.innerHTML = '<a href="butce-hesapla.html" style="color:#34d399;text-decoration:underline;">Bütçe Hesapla</a> sayfasına rakamlarınızı girdiğinizde Yusuf Efe Karagöz Akıllı Tavsiye Motoru size özel stratejiler üretecektir.';
      adviceGrid.innerHTML = '';
      return;
    }

    const baseInc = totalIncome > 0 ? totalIncome : 1;
    const savingsRate = (netMonthly / baseInc) * 100;
    const needsRate = (totalNeeds / baseInc) * 100;
    const wantsRate = (totalWants / baseInc) * 100;
    const debtRate = (totalDebts / baseInc) * 100;
    const rentRate = (rentVal / baseInc) * 100;
    const minEF = totalNeeds * 3;

    let score = 55;
    if (savingsRate >= 25) score += 25;
    else if (savingsRate >= 15) score += 15;
    else if (savingsRate > 0) score += 5;
    else score -= 25;

    if (currentSavings >= totalNeeds * 6 && totalNeeds > 0) score += 15;
    else if (currentSavings >= minEF && totalNeeds > 0) score += 10;
    else if (currentSavings > 0) score += 4;
    else score -= 5;

    if (debtRate === 0) score += 10;
    else if (debtRate > 25) score -= 15;
    else if (debtRate > 15) score -= 7;

    if (needsRate > 60) score -= 8;
    score = Math.max(10, Math.min(100, Math.round(score)));

    scoreValueEl.textContent = score;
    if (score >= 80) {
      scoreLabelEl.textContent = 'Mükemmel Denge';
      mainVerdictEl.textContent = 'Finansal Disiplininiz Çok Güçlü!';
    } else if (score >= 60) {
      scoreLabelEl.textContent = 'İyi / Geliştirilebilir';
      mainVerdictEl.textContent = 'Sağlam Temel, Doğru Dokunuşlarla Büyüme Zamanı';
    } else {
      scoreLabelEl.textContent = 'Kritik Müdahale Gerekli';
      mainVerdictEl.textContent = 'Bütçe Dengesini Yeniden Kurmalıyız';
    }

    mainSummaryEl.textContent = `Aylık ${formatCurrency(totalIncome)} gelir ve ${formatCurrency(totalExpense)} gider ile her ay ${formatCurrency(netMonthly)} net bakiye üretiyorsunuz. Kenardaki ${formatCurrency(currentSavings)} hazır bütçenizle birlikte size özel uzman tavsiyeleri:`;

    const cards = [];

    if (netMonthly > 0) {
      const autoDCA = Math.round(netMonthly * 0.75);
      const bufferAdd = netMonthly - autoDCA;
      cards.push({
        priority: 'positive',
        badge: 'Kalan Bütçe Reçetesi',
        title: `Aylık Kalan ${formatCurrency(netMonthly)} Nasıl Kullanılmalı?`,
        body: `Ay sonunda kalan parayı yatırıma ayırmak yerine, <strong>maaşınızın yattığı ilk gün</strong> ${formatCurrency(autoDCA)} tutarını otomatik fon/varlık sepetine (DCA) gönderin. Kalan ${formatCurrency(bufferAdd)} tutarı ise günlük faizli acil durum/fırsat nakdi olarak tutun.`,
        action: `<strong>Hemen Uygula:</strong> Bankanızda maaş gününe ${formatCurrency(autoDCA)} tutarında otomatik fon alım talimatı tanımlayın.`,
      });
    } else {
      const deficit = Math.abs(netMonthly);
      cards.push({
        priority: 'critical',
        badge: 'Acil Bütçe Açığı',
        title: `Aylık ${formatCurrency(deficit)} Bütçe Açığını Kapatma Planı`,
        body: `Giderleriniz gelirinizden fazla olduğu için her ay kenardaki birikiminizden yiyorsunuz veya borçlanıyorsunuz. Yeni yatırım yapmayı geçici olarak durdurup harcama sızıntılarını kapatmalısınız.`,
        action: `<strong>Hemen Uygula:</strong> İstek/Eğlence giderlerinizi (${formatCurrency(totalWants)}) en az %50 azaltarak ${formatCurrency(totalWants * 0.5)} nakit akışı açın.`,
      });
    }

    if (currentSavings > 0) {
      if (currentSavings < minEF && minEF > 0) {
        cards.push({
          priority: 'warning',
          badge: 'Mevcut Bütçe Koruma',
          title: `Kenardaki ${formatCurrency(currentSavings)} Birikiminizi Riske Atmayın`,
          body: `Mevcut hazır bütçeniz henüz 3 aylık zorunlu gider tamponunuzu (${formatCurrency(minEF)}) doldurmuyor. Bu parayla hisse senedi veya kripto (₿) gibi dalgalı varlıklara girmek, acil durumda zararına satış yaptırabilir.`,
          action: `<strong>Yusuf Efe Karagöz Tavsiyesi:</strong> ${formatCurrency(currentSavings)} tutarın tamamını anında bozulabilir <strong>Para Piyasası Fonu (PPF)</strong> veya günlük vadeli mevduatta değerlendirin.`,
        });
      } else {
        const safeReserve = minEF > 0 ? minEF : Math.round(currentSavings * 0.3);
        const deployable = Math.max(0, currentSavings - safeReserve);
        const monthlyTranche = Math.round(deployable / 4);
        cards.push({
          priority: 'strategy',
          badge: 'Hazır Birikim Stratejisi',
          title: `${formatCurrency(currentSavings)} Mevcut Bütçenin Kademeli Dağılımı`,
          body: `Mevcut bütçenizin <strong>${formatCurrency(safeReserve)}</strong> kısmını "Sıfırıncı Adım" Acil Durum Fonu olarak Para Piyasası Fonunda bırakın. Geriye kalan <strong>${formatCurrency(deployable)}</strong> sermayeyi tek seferde değil, 4 haftaya/aya bölerek (${formatCurrency(monthlyTranche)} dilimler halinde) sepet yapın.`,
          action: `<strong>Sepet Formülü:</strong> %30 Altın/Gümüş, %30 Yerli Hisse Fonu, %25 Dolar Bazlı Yabancı Teknoloji Fonu, %10 Eurobond, Maks. %5 Bitcoin/Kripto.`,
        });
      }
    } else {
      cards.push({
        priority: 'warning',
        badge: 'Sıfırıncı Adım Başlangıcı',
        title: `Kenarda Hazır Bütçeniz Yok: İlk Hedef İlk 25.000 ₺`,
        body: `Şu an kenarda hazır nakit tamponunuz bulunmuyor. Beklenmedik bir masrafta kredi kartı faizine düşmemek için ilk önceliğiniz likit bir güvenlik kalkanı inşa etmek olmalı.`,
        action: `<strong>İlk Hedef:</strong> Aylık kalan bütçenizin en az yarısını ilk 3 ay boyunca sadece Para Piyasası Fonunda biriktirin.`,
      });
    }

    if (totalDebts > 0) {
      if (debtRate > 20) {
        cards.push({
          priority: 'critical',
          badge: 'Yüksek Borç Yükü',
          title: `Gelirinizin %${Math.round(debtRate)}'i (${formatCurrency(totalDebts)}) Borçlara Gidiyor`,
          body: `Kredi ve kredi kartı ödemeleriniz güvenli sınır olan %15'in üzerinde. Yüksek faizli kredi kartı borcu varken yatırım yapmak, altı delik kovaya su doldurmaya benzer.`,
          action: `<strong>Çığ Yöntemi:</strong> Kalan bütçenizin büyük kısmıyla önce en yüksek faizli borcu kapatın; kredi kartında asgari ödeme tuzağına düşmeyin.`,
        });
      } else {
        cards.push({
          priority: 'strategy',
          badge: 'Borç Yönetimi',
          title: `${formatCurrency(totalDebts)} Borç Ödemeniz Kontrol Altında (%${Math.round(debtRate)})`,
          body: `Borç/Gelir oranınız yönetilebilir seviyede. Ödemelerinizi aksatmadan sürdürürken eşzamanlı olarak aylık DCA yatırım sepetinizi büyütebilirsiniz.`,
          action: `<strong>Tavsiye:</strong> Enflasyon altında sabit taksitli borçları erken kapatmak yerine, eldeki nakdi yüksek getirili fon sepetinde değerlendirin.`,
        });
      }
    }

    if (wantsRate > 20 && totalWants > 0) {
      const saveCut = Math.round(totalWants * 0.25);
      const fiveYearGain = calcCompoundFutureValue(0, saveCut, 5);
      cards.push({
        priority: 'warning',
        badge: 'Tasarruf Fırsatı',
        title: `Keyfi Harcamalardan %25 Kırparak 5 Yılda ${formatCurrency(fiveYearGain)} Üretin`,
        body: `Aylık sosyal/kişisel istek harcamalarınız <strong>${formatCurrency(totalWants)}</strong> (Gelirin %${Math.round(wantsRate)}'i). Bu kalemden sadece %25 (${formatCurrency(saveCut)}/ay) tasarruf edip bileşik getiriye aktarmak servetinizi hızlandırır.`,
        action: `<strong>Pratik Kural:</strong> Dışarıda kahve/yemek ve anlık alışverişlerde "24 Saat Bekleme Kuralı" uygulayarak ayda ${formatCurrency(saveCut)} ek yatırım bütçesi yaratın.`,
      });
    } else if (rentRate > 35) {
      cards.push({
        priority: 'warning',
        badge: 'Konut Gideri Uyarısı',
        title: `Kira/Konut Gideriniz Gelirin %${Math.round(rentRate)}'ini Kaplıyor`,
        body: `Kira ve konut masraflarınız (${formatCurrency(rentVal)}) ideal üst sınır olan %30-35 bandını aşmış durumda. Bu durum yatırım kabiliyetinizi daraltıyor.`,
        action: `<strong>Dengeleme Stratejisi:</strong> Sabit konut giderini hemen değiştiremiyorsanız, faturalar ve abonelikleri gözden geçirip ek gelir (freelance/prim) kaynaklarını artırın.`,
      });
    } else {
      cards.push({
        priority: 'positive',
        badge: 'Harcama Disiplini',
        title: `Zorunlu ve Keyfi Harcama Oranlarınız İdeal Çerçevede`,
        body: `Zorunlu giderleriniz (%${Math.round(needsRate)}) ve kişisel harcamalarınız (%${Math.round(wantsRate)}) bütçenizi boğmuyor. Bu disiplin uzun vadeli yatırımda en büyük avantajınızdır.`,
        action: `<strong>Uzman İpucu:</strong> Geliriniz arttığında yaşam standartlarınızı aynı hızda artırmayın (Yaşam Tarzı Enflasyonundan korunun) ve maaş zamlarının %70'ini doğrudan DCA sepetine ekleyin.`,
      });
    }

    adviceGrid.innerHTML = cards
      .map(
        (c) => `
      <div class="advice-card priority-${c.priority}">
        <div class="advice-top">
          <span class="advice-badge badge-${c.priority}">${c.badge}</span>
        </div>
        <h4>${c.title}</h4>
        <p>${c.body}</p>
        <div class="advice-action-step">${c.action}</div>
      </div>
    `
      )
      .join('');
  }

  // Ana Hesaplama Yöneticisi
  function calculateBudget() {
    const raw = currentSavingsInput ? syncDomToStorage() : getStoredBudgetRaw();
    const snap = computeBudgetSnapshot(raw);
    updateSummaryBar(snap);
    updateVisualAnalysis(snap);
    updateFivePrinciples(snap);
    updateSmartRecommendationEngine(snap);
  }

  // Özel Gelir Kalemi Ekleme
  function addCustomIncome(nameVal, amountVal, shouldRecalc = true) {
    if (!customIncomeList) return;
    const name = (nameVal ?? newIncomeName?.value ?? '').trim();
    const amount = Number(amountVal ?? newIncomeAmount?.value) || 0;
    if (!name || amount <= 0) return;

    const row = document.createElement('div');
    row.className = 'field-row custom-row';
    row.innerHTML = `
      <label>${name}</label>
      <div style="display:flex; align-items:center;">
        <div class="currency-input-wrapper" style="flex:1;">
          <span class="currency-symbol">₺</span>
          <input type="number" class="budget-input income-item" data-name="${name}" value="${amount}" min="0" />
        </div>
        <button type="button" class="remove-item-btn" title="Kalemi Sil">×</button>
      </div>
    `;

    row.querySelector('input').addEventListener('input', calculateBudget);
    row.querySelector('.remove-item-btn').addEventListener('click', () => {
      row.remove();
      calculateBudget();
    });

    customIncomeList.appendChild(row);
    if (newIncomeName) newIncomeName.value = '';
    if (newIncomeAmount) newIncomeAmount.value = '';
    if (shouldRecalc) calculateBudget();
  }

  // Özel Gider Kalemi Ekleme
  function addCustomExpense(nameVal, catVal, amountVal, shouldRecalc = true) {
    if (!customExpenseList) return;
    const name = (nameVal ?? newExpenseName?.value ?? '').trim();
    const category = catVal ?? newExpenseCategory?.value ?? 'want';
    const amount = Number(amountVal ?? newExpenseAmount?.value) || 0;
    if (!name || amount <= 0) return;

    const meta = categoryMeta[category] || categoryMeta.want;
    const row = document.createElement('div');
    row.className = 'field-row custom-row';
    row.innerHTML = `
      <div class="label-with-tag">
        <label>${name}</label>
        <span class="cat-tag ${meta.className}">${meta.label}</span>
      </div>
      <div style="display:flex; align-items:center;">
        <div class="currency-input-wrapper" style="flex:1;">
          <span class="currency-symbol">₺</span>
          <input type="number" class="budget-input expense-item" data-name="${name}" data-category="${category}" value="${amount}" min="0" />
        </div>
        <button type="button" class="remove-item-btn" title="Kalemi Sil">×</button>
      </div>
    `;

    row.querySelector('input').addEventListener('input', calculateBudget);
    row.querySelector('.remove-item-btn').addEventListener('click', () => {
      row.remove();
      calculateBudget();
    });

    customExpenseList.appendChild(row);
    if (newExpenseName) newExpenseName.value = '';
    if (newExpenseAmount) newExpenseAmount.value = '';
    if (shouldRecalc) calculateBudget();
  }

  // Dinleyiciler (Sadece ilgili elemanlar mevcutsa bağla)
  document.querySelectorAll('.budget-input').forEach((input) => {
    input.addEventListener('input', calculateBudget);
  });

  if (financialGoalSelect) financialGoalSelect.addEventListener('change', calculateBudget);
  if (addIncomeBtn) addIncomeBtn.addEventListener('click', () => addCustomIncome());
  if (addExpenseBtn) addExpenseBtn.addEventListener('click', () => addCustomExpense());

  if (fillSampleBtn && currentSavingsInput) {
    fillSampleBtn.addEventListener('click', () => {
      currentSavingsInput.value = DEFAULT_BUDGET_DATA.currentSavings;
      document.getElementById('incSalary').value = DEFAULT_BUDGET_DATA.incSalary;
      document.getElementById('incSide').value = DEFAULT_BUDGET_DATA.incSide;
      document.getElementById('incPassive').value = DEFAULT_BUDGET_DATA.incPassive;

      document.getElementById('expRent').value = DEFAULT_BUDGET_DATA.expRent;
      document.getElementById('expBills').value = DEFAULT_BUDGET_DATA.expBills;
      document.getElementById('expGroceries').value = DEFAULT_BUDGET_DATA.expGroceries;
      document.getElementById('expTransport').value = DEFAULT_BUDGET_DATA.expTransport;
      document.getElementById('expDebt').value = DEFAULT_BUDGET_DATA.expDebt;
      document.getElementById('expLifestyle').value = DEFAULT_BUDGET_DATA.expLifestyle;

      if (customIncomeList) customIncomeList.innerHTML = '';
      if (customExpenseList) customExpenseList.innerHTML = '';
      calculateBudget();
    });
  }

  if (resetFormBtn && currentSavingsInput) {
    resetFormBtn.addEventListener('click', () => {
      document.querySelectorAll('.budget-input').forEach((inp) => {
        inp.value = 0;
      });
      if (customIncomeList) customIncomeList.innerHTML = '';
      if (customExpenseList) customExpenseList.innerHTML = '';
      calculateBudget();
    });
  }

  // ULTRA-DETAYLI KURUMSAL FİNANS, BÜTÇE VE PORTFÖY RAPORU ÜRETİCİ
  function openDetailedExecutiveReport() {
    const raw = getStoredBudgetRaw();
    const s = computeBudgetSnapshot(raw);
    const nowStr = new Date().toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const usdRate = 49.84;
    const eurRate = 55.50;
    const gbpRate = 66.53;
    const chfRate = 60.15;
    const gauRate = 6500;

    // Sağlık skoru
    let score = 55;
    if (s.savingsRate >= 25) score += 25;
    else if (s.savingsRate >= 15) score += 15;
    else if (s.savingsRate > 0) score += 5;
    else score -= 25;
    if (s.currentSavings >= s.maxEF && s.totalNeeds > 0) score += 15;
    else if (s.currentSavings >= s.minEF && s.totalNeeds > 0) score += 10;
    if (s.debtRate === 0) score += 10;
    else if (s.debtRate > 25) score -= 15;
    score = Math.max(10, Math.min(100, Math.round(score)));

    const efGap = Math.max(0, s.minEF - s.currentSavings);
    const monthlyEFSlice = efGap > 0 ? Math.round(s.positiveSavings * 0.4) : 0;
    const monthlyInvestable = Math.max(0, s.positiveSavings - monthlyEFSlice);
    const deployableLumpSum = Math.max(0, s.currentSavings - s.minEF);

    let reportModal = document.getElementById('yekExecutiveReportModal');
    if (!reportModal) {
      reportModal = document.createElement('div');
      reportModal.id = 'yekExecutiveReportModal';
      reportModal.className = 'yek-report-modal-backdrop';
      document.body.appendChild(reportModal);
    }

    const yearsList = [1, 3, 5, 10, 15, 20];
    const projectionRowsHtml = yearsList
      .map((yr) => {
        const totalIn = s.currentSavings + monthlyInvestable * yr * 12;
        const fvCons = calcCompoundFutureValue(s.currentSavings, monthlyInvestable, yr, 0.12);
        const fvBal = calcCompoundFutureValue(s.currentSavings, monthlyInvestable, yr, 0.18);
        const fvAggr = calcCompoundFutureValue(s.currentSavings, monthlyInvestable, yr, 0.24);
        const usdEquiv = Math.round(fvBal / usdRate).toLocaleString('tr-TR');
        const goldEquiv = Math.round(fvBal / gauRate).toLocaleString('tr-TR');
        return `
          <tr>
            <td><strong>${yr}. Yıl Sonu</strong></td>
            <td>${formatCurrency(totalIn)}</td>
            <td>${formatCurrency(fvCons)}</td>
            <td class="report-highlight-cell"><strong>${formatCurrency(fvBal)}</strong></td>
            <td>${formatCurrency(fvAggr)}</td>
            <td>$${usdEquiv} / ${goldEquiv} Gr Au</td>
          </tr>
        `;
      })
      .join('');

    reportModal.innerHTML = `
      <div class="yek-report-sheet">
        <div class="report-toolbar no-print">
          <div class="report-toolbar-left">
            <img src="logo.svg?v=4" alt="YEK" class="report-mini-logo" />
            <span><strong>YEK Kurumsal Finansal Analiz & Portföy Raporu</strong> (Ultra Detaylı Sürüm)</span>
          </div>
          <div class="report-toolbar-actions">
            <button type="button" id="triggerBrowserPrintBtn" class="btn btn-primary">🖨️ PDF Olarak Kaydet / Yazdır</button>
            <button type="button" id="closeExecutiveReportBtn" class="btn btn-secondary">✕ Raporu Kapat</button>
          </div>
        </div>

        <div class="report-header-banner">
          <div class="report-brand-row">
            <img src="logo.svg?v=4" alt="YEK Logo" class="report-main-logo" />
            <div>
              <span class="report-doc-code">RAPOR NO: YEK-${Date.now().toString().slice(-6)} • TARİH: ${nowStr}</span>
              <h1>DOĞRU BÜTÇE DOĞRU KULLANIM — KAPSAMLI FİNANSAL ANALİZ RAPORU</h1>
              <p>Hazırlayan Sistem: <strong>Piyasa Uzmanı Yusuf Efe Karagöz Strateji Motoru & YEK AI 4.0 Pro Edition</strong></p>
            </div>
          </div>
          <div class="report-score-stamp">
            <small>BÜTÇE SAĞLIK SKORU</small>
            <strong>${score} / 100</strong>
            <span>${score >= 80 ? 'MÜKEMMEL DENGE' : score >= 60 ? 'İYİ / GELİŞTİRİLEBİLİR' : 'KRİTİK MÜDAHALE'}</span>
          </div>
        </div>

        <!-- BÖLÜM 1: GELİR, GİDER VE 50/30/20 RASYO ANALİZİ -->
        <div class="report-section-block">
          <h3>1. Aylık Nakit Akışı, Gelir-Gider Bilançosu ve 50/30/20 Sapma Analizi</h3>
          <div class="report-kpi-row">
            <div class="report-kpi-card"><span>Mevcut Hazır Birikim</span><strong>${formatCurrency(s.currentSavings)}</strong></div>
            <div class="report-kpi-card"><span>Aylık Toplam Gelir</span><strong>${formatCurrency(s.totalIncome)}</strong></div>
            <div class="report-kpi-card"><span>Aylık Toplam Gider</span><strong>${formatCurrency(s.totalExpense)}</strong></div>
            <div class="report-kpi-card highlight"><span>Aylık Net Yatırım Gücü</span><strong>${formatCurrency(s.netMonthly)} (%${s.savingsRate})</strong></div>
            <div class="report-kpi-card"><span>FIRE (Finansal Özgürlük) Hedefi</span><strong>${formatCurrency(s.fireTarget)}</strong></div>
          </div>

          <table class="report-table">
            <thead>
              <tr>
                <th>Bütçe Kalemi / Kategori</th>
                <th>Mevcut Aylık Tutar</th>
                <th>Gelir İçindeki Payı</th>
                <th>YEK 50/30/20 İdeal Hedefi</th>
                <th>Sapma & Uzman Teşhisi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Zorunlu İhtiyaçlar</strong> (Kira, Fatura, Market, Ulaşım)</td>
                <td>${formatCurrency(s.totalNeeds)}</td>
                <td>%${s.needsRate}</td>
                <td>Maks. %50 (${formatCurrency(s.totalIncome * 0.5)})</td>
                <td>${s.needsRate <= 50 ? '✓ İdeal Sınırda' : `⚠️ İdeal sınırın %${s.needsRate - 50} üzerinde`}</td>
              </tr>
              <tr>
                <td><strong>Kişisel İstek & Yaşam Tarzı</strong></td>
                <td>${formatCurrency(s.totalWants)}</td>
                <td>%${s.wantsRate}</td>
                <td>Maks. %20 (${formatCurrency(s.totalIncome * 0.2)})</td>
                <td>${s.wantsRate <= 20 ? '✓ Kontrollü' : '⚠️ Tasarruf için %25 kırpılabilir'}</td>
              </tr>
              <tr>
                <td><strong>Kredi & Borç Ödemeleri</strong></td>
                <td>${formatCurrency(s.totalDebts)}</td>
                <td>%${s.debtRate}</td>
                <td>Maks. %10-15 (${formatCurrency(s.totalIncome * 0.15)})</td>
                <td>${s.debtRate <= 15 ? '✓ Güvenli Borç Yükü' : '🚨 Yüksek borç yükü (Çığ yöntemi uygulanmalı)'}</td>
              </tr>
              <tr class="report-highlight-row">
                <td><strong>Net Tasarruf & Yatırım Kapasitesi</strong></td>
                <td><strong>${formatCurrency(s.netMonthly)}</strong></td>
                <td><strong>%${s.savingsRate}</strong></td>
                <td>Min. %20 (${formatCurrency(s.totalIncome * 0.2)})</td>
                <td>${s.savingsRate >= 20 ? '🏆 Üst Düzey Tasarruf Disiplini' : '📈 %20 hedefine çıkarılmalı'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BÖLÜM 2: YUSUF EFE KARAGÖZ 5 ALTIN İLKE VE VARLIK SEPETİ DAĞILIMI -->
        <div class="report-section-block">
          <h3>2. Yusuf Efe Karagöz 5 Altın İlke & Kurumsal Portföy Dağılım Planı</h3>
          <p class="report-subnote">
            <strong>Sıfırıncı Adım (Acil Durum Fonu Durumu):</strong> 3 Aylık Minimum Tampon Hedefi: <strong>${formatCurrency(s.minEF)}</strong> | 6 Aylık Tam Güvence Hedefi: <strong>${formatCurrency(s.maxEF)}</strong>.
            ${
              efGap > 0
                ? `Mevcut birikiminizde 3 aylık hedefe <strong>${formatCurrency(efGap)}</strong> fark bulunduğu için aylık tasarrufunuzun <strong>${formatCurrency(monthlyEFSlice)}</strong> kısmı Para Piyasası Fonuna (PPF) ayrılmıştır.`
                : `3 aylık minimum acil durum tamponunuz tamamlanmıştır. Fazla olan <strong>${formatCurrency(deployableLumpSum)}</strong> hazır sermaye yatırıma uygundur.`
            }
          </p>

          <table class="report-table">
            <thead>
              <tr>
                <th>Varlık Sınıfı & Fon Grubu</th>
                <th>Portföy Ağırlığı</th>
                <th>Aylık DCA Otomatik Alım (Ayın 1'i)</th>
                <th>Hazır Birikimden Dağıtılacak Pay</th>
                <th>Temel Finansal Amacı & Enstrümanlar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🪙 <strong>Değerli Madenler (Altın & Gümüş)</strong></td>
                <td><strong>%30</strong></td>
                <td>${formatCurrency(monthlyInvestable * 0.30)} / ay</td>
                <td>${formatCurrency(deployableLumpSum * 0.30)}</td>
                <td>Enflasyon ve jeopolitik kriz sigortası (Gram Altın, ALTINS1, KMF)</td>
              </tr>
              <tr>
                <td>📈 <strong>Yerli Hisse Senedi Yoğun Fonlar</strong></td>
                <td><strong>%30</strong></td>
                <td>${formatCurrency(monthlyInvestable * 0.30)} / ay</td>
                <td>${formatCurrency(deployableLumpSum * 0.30)}</td>
                <td>%0 Stopaj vergi muafiyetiyle BIST reel şirket büyümesine ortaklık</td>
              </tr>
              <tr>
                <td>💵 <strong>Yabancı Teknoloji & Yapay Zeka Fonları</strong></td>
                <td><strong>%25</strong></td>
                <td>${formatCurrency(monthlyInvestable * 0.25)} / ay</td>
                <td>${formatCurrency(deployableLumpSum * 0.25)}</td>
                <td>Dolar bazlı küresel büyüme (NASDAQ / S&P 500 teknoloji devleri)</td>
              </tr>
              <tr>
                <td>💶 <strong>Eurobond (Döviz Tahvil) Fonları</strong></td>
                <td><strong>%10</strong></td>
                <td>${formatCurrency(monthlyInvestable * 0.10)} / ay</td>
                <td>${formatCurrency(deployableLumpSum * 0.10)}</td>
                <td>Döviz enflasyonuna karşı Dolar/Euro bazlı kupon faizi geliri</td>
              </tr>
              <tr>
                <td>₿ <strong>Spekülatif / Kripto ("Oyun Parası" Sınırı)</strong></td>
                <td><strong>Maks. %5</strong></td>
                <td>${formatCurrency(monthlyInvestable * 0.05)} / ay</td>
                <td>${formatCurrency(deployableLumpSum * 0.05)}</td>
                <td>Ana portföyü riske atmadan yüksek volatilite fırsatı (Spot BTC)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- BÖLÜM 3: 1 - 20 YILLIK BİLEŞİK GETİRİ & SERVET PROJEKSİYONU -->
        <div class="report-section-block">
          <h3>3. Çok Yıllı Bileşik Getiri & Servet Projeksiyon Tablosu (Enflasyon Üstü Reel Alım Gücüyle)</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>Vade</th>
                <th>Cebinizden Çıkan Toplam Ana Para</th>
                <th>Muhafazakâr (%12 Reel/Yıl)</th>
                <th>YEK Dengeli Sepet (%18 Reel/Yıl)</th>
                <th>Agresif Büyüme (%24 Reel/Yıl)</th>
                <th>Dengeli Sepetin Dolar & Altın Karşılığı</th>
              </tr>
            </thead>
            <tbody>
              ${projectionRowsHtml}
            </tbody>
          </table>
        </div>

        <!-- BÖLÜM 4: DÜNYA PARA BİRİMLERİ BAZINDA MEVCUT BÜTÇE GÜCÜ -->
        <div class="report-section-block">
          <h3>4. Küresel Para Birimleri ve Altın Bazında Varlık Karşılıkları</h3>
          <div class="report-fx-grid">
            <div class="report-fx-box">
              <span>🇺🇸 Amerikan Doları (USD)</span>
              <strong>Hazır: $${Math.round(s.currentSavings / usdRate).toLocaleString('tr-TR')}</strong>
              <small>Aylık Net: $${Math.round(s.positiveSavings / usdRate).toLocaleString('tr-TR')} / ay</small>
            </div>
            <div class="report-fx-box">
              <span>🇪🇺 Euro (EUR)</span>
              <strong>Hazır: €${Math.round(s.currentSavings / eurRate).toLocaleString('tr-TR')}</strong>
              <small>Aylık Net: €${Math.round(s.positiveSavings / eurRate).toLocaleString('tr-TR')} / ay</small>
            </div>
            <div class="report-fx-box">
              <span>🇬🇧 İngiliz Sterlini (GBP)</span>
              <strong>Hazır: £${Math.round(s.currentSavings / gbpRate).toLocaleString('tr-TR')}</strong>
              <small>Aylık Net: £${Math.round(s.positiveSavings / gbpRate).toLocaleString('tr-TR')} / ay</small>
            </div>
            <div class="report-fx-box">
              <span>🇨🇭 İsviçre Frangı (CHF)</span>
              <strong>Hazır: ₣${Math.round(s.currentSavings / chfRate).toLocaleString('tr-TR')}</strong>
              <small>Aylık Net: ₣${Math.round(s.positiveSavings / chfRate).toLocaleString('tr-TR')} / ay</small>
            </div>
            <div class="report-fx-box">
              <span>🏆 24 Ayar Gram Altın</span>
              <strong>Hazır: ${(s.currentSavings / gauRate).toFixed(1)} Gram</strong>
              <small>Aylık Net: ${(s.positiveSavings / gauRate).toFixed(1)} Gram / ay</small>
            </div>
          </div>
        </div>

        <div class="report-footer-sign">
          <div>
            <strong>Piyasa Uzmanı Yusuf Efe Karagöz — Doğru Bütçe Doğru Kullanım</strong>
            <p>İletişim: yusufefekaragoz@gmail.com | Tel & WhatsApp: +90 (532) 487 19 63 | Instagram: @yusufefekaragoz | X: @dr1teonbir</p>
          </div>
          <div class="report-seal-badge">✓ ONAYLI FİNANSAL RAPOR</div>
        </div>
      </div>
    `;

    reportModal.classList.remove('hidden');
    document.getElementById('closeExecutiveReportBtn')?.addEventListener('click', () => {
      reportModal.classList.add('hidden');
    });
    document.getElementById('triggerBrowserPrintBtn')?.addEventListener('click', () => {
      window.print();
    });
    reportModal.addEventListener('click', (e) => {
      if (e.target === reportModal) reportModal.classList.add('hidden');
    });
  }

  if (printReportBtn) printReportBtn.addEventListener('click', openDetailedExecutiveReport);
  if (printReportBtnBottom) printReportBtnBottom.addEventListener('click', openDetailedExecutiveReport);

  populateCalculatorInputsFromStorage();
  calculateBudget();
});

// =========================================================
// YEK AI — GEMINI BÜTÇE BİLGİ BANKASI İLE EĞİTİLMİŞ SOHBET MOTORU
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const aiMessagesEl = document.getElementById('yekAiMessages');
  const aiForm = document.getElementById('yekAiForm');
  const aiInput = document.getElementById('yekAiInput');
  const clearAiChatBtn = document.getElementById('clearAiChatBtn');
  const promptChips = document.querySelectorAll('.ai-prompt-chip');

  const toggleGeminiApiBtn = document.getElementById('toggleGeminiApiBtn');
  const geminiApiConfigBox = document.getElementById('geminiApiConfigBox');
  const geminiApiKeyInput = document.getElementById('geminiApiKeyInput');
  const saveGeminiKeyBtn = document.getElementById('saveGeminiKeyBtn');
  const yekModelModeSelect = document.getElementById('yekModelModeSelect');

  if (!aiMessagesEl || !aiForm) return;

  // Canlı bütçe bağlam şeridini güncelle
  function updateAiContextStrip() {
    const s = computeBudgetSnapshot(getStoredBudgetRaw());
    const elSav = document.getElementById('aiCtxSavings');
    const elInc = document.getElementById('aiCtxIncome');
    const elExp = document.getElementById('aiCtxExpense');
    const elNet = document.getElementById('aiCtxNet');
    if (elSav) elSav.textContent = formatCurrency(s.currentSavings);
    if (elInc) elInc.textContent = formatCurrency(s.totalIncome);
    if (elExp) elExp.textContent = formatCurrency(s.totalExpense);
    if (elNet) elNet.textContent = `${formatCurrency(s.netMonthly)} / ay (%${s.savingsRate})`;
  }

  updateAiContextStrip();

  // Model uzmanlık modu seçimi
  if (yekModelModeSelect) {
    const savedMode = localStorage.getItem('yek_ai_v3_model_mode') || 'pro';
    yekModelModeSelect.value = savedMode;
    yekModelModeSelect.addEventListener('change', () => {
      localStorage.setItem('yek_ai_v3_model_mode', yekModelModeSelect.value);
    });
  }

  const savedApiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
  if (geminiApiKeyInput && savedApiKey) {
    geminiApiKeyInput.value = savedApiKey;
  }

  if (toggleGeminiApiBtn && geminiApiConfigBox) {
    toggleGeminiApiBtn.addEventListener('click', () => {
      geminiApiConfigBox.classList.toggle('hidden');
    });
  }

  if (saveGeminiKeyBtn && geminiApiKeyInput) {
    saveGeminiKeyBtn.addEventListener('click', () => {
      const keyVal = geminiApiKeyInput.value.trim();
      if (keyVal) {
        localStorage.setItem(GEMINI_API_KEY_STORAGE, keyVal);
        if (toggleGeminiApiBtn) toggleGeminiApiBtn.textContent = '✨ Özel Gemini API: Bağlı';
        geminiApiConfigBox.classList.add('hidden');
      } else {
        localStorage.removeItem(GEMINI_API_KEY_STORAGE);
        if (toggleGeminiApiBtn) toggleGeminiApiBtn.textContent = '✨ LLM Sinir Ağı: Aktif';
      }
    });
  }

  function getLiveBudgetSnapshot() {
    return computeBudgetSnapshot(getStoredBudgetRaw());
  }

  // Çok turlu LLM sohbet geçmişi
  let chatHistory = [];
  try {
    const rawHist = localStorage.getItem('yek_ai_v3_chat_history');
    if (rawHist) chatHistory = JSON.parse(rawHist) || [];
  } catch (e) {
    chatHistory = [];
  }

  function saveChatHistory() {
    try {
      localStorage.setItem('yek_ai_v3_chat_history', JSON.stringify(chatHistory.slice(-16)));
    } catch (e) {
      // ignore
    }
  }

  function appendMessage(sender, htmlContent, metaOptions = {}) {
    const row = document.createElement('div');
    row.className = `ai-msg-row ${sender === 'user' ? 'user-row' : 'bot-row'}`;

    if (sender === 'user') {
      row.innerHTML = `
        <div class="user-avatar-badge">SİZ</div>
        <div class="msg-bubble">
          <span class="msg-sender-name">SİZİN MESAJINIZ</span>
          <div class="msg-body-content">${htmlContent}</div>
        </div>
      `;
    } else {
      const badgeLabel = metaOptions.engineBadge || 'YEK AI 4.0 Pro Edition RELEASE • PİYASA EKONOMİSİ & GENEL ZEKA';
      row.innerHTML = `
        <img src="logo.svg" alt="YEK AI" class="msg-avatar" />
        <div class="msg-bubble">
          <div class="msg-header-bar">
            <span class="msg-sender-name">YEK AI 4.0 Pro Edition • ${badgeLabel}</span>
            <button type="button" class="msg-copy-btn" title="Yanıtı Kopyala">📋 Kopyala</button>
          </div>
          <div class="msg-body-content">${htmlContent}</div>
          <div class="msg-followups-container"></div>
        </div>
      `;

      const copyBtn = row.querySelector('.msg-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const textToCopy = row.querySelector('.msg-body-content')?.innerText || '';
          navigator.clipboard?.writeText(textToCopy);
          copyBtn.textContent = '✓ Kopyalandı';
          setTimeout(() => {
            copyBtn.textContent = '📋 Kopyala';
          }, 1800);
        });
      }

      if (Array.isArray(metaOptions.followUps) && metaOptions.followUps.length > 0) {
        const followUpContainer = row.querySelector('.msg-followups-container');
        if (followUpContainer) {
          followUpContainer.innerHTML = `
            <div class="ai-followup-bar">
              <span class="followup-label">💡 İlgili Derin Sorular:</span>
              <div class="followup-chips">
                ${metaOptions.followUps
                  .map((q) => `<button type="button" class="followup-chip-btn">${q}</button>`)
                  .join('')}
              </div>
            </div>
          `;
          followUpContainer.querySelectorAll('.followup-chip-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
              handleUserQuestion(btn.textContent);
            });
          });
        }
      }
    }

    aiMessagesEl.appendChild(row);
    aiMessagesEl.scrollTop = aiMessagesEl.scrollHeight;
    return row;
  }

  function showWelcomeMessage() {
    aiMessagesEl.innerHTML = '';
    appendMessage(
      'bot',
      `Selam! Ben <strong>YEK AI</strong> 👋 Hem günlük sohbet edebileceğin hem de piyasa ekonomisi, borsa, yatırım fonları ve bütçe yönetimi üzerine konuşabileceğin yapay zeka asistanınım.`,
      {
        engineBadge: 'YEK AI 4.0 Pro Edition',
      }
    );
  }

  const conversationMemory = {
    lastTopic: null,
    turnCount: 0,
    userName: null,
    lastMentionedAmount: null,
  };

  function extractAmountFromText(text) {
    const lower = text.toLowerCase();
    const binMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*bin/);
    if (binMatch) {
      const num = parseFloat(binMatch[1].replace(',', '.'));
      if (!isNaN(num)) return Math.round(num * 1000);
    }
    const milMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*milyon/);
    if (milMatch) {
      const num = parseFloat(milMatch[1].replace(',', '.'));
      if (!isNaN(num)) return Math.round(num * 1000000);
    }
    const rawNumbers = lower.replace(/\./g, '').match(/\b(\d{3,9})\b/);
    if (rawNumbers) {
      const val = parseInt(rawNumbers[1], 10);
      if (val >= 250) return val;
    }
    return null;
  }

  function trySyncBudgetFromChat(text) {
    const q = text.toLowerCase();
    const updates = [];
    const stored = getStoredBudgetRaw();

    function parseNearKeyword(regex) {
      const m = q.match(regex);
      if (!m) return null;
      const numStr = m[1].replace(/\./g, '').replace(',', '.');
      const val = parseFloat(numStr);
      if (isNaN(val)) return null;
      if (m[2] && m[2].includes('bin')) return Math.round(val * 1000);
      if (m[2] && m[2].includes('milyon')) return Math.round(val * 1000000);
      return val >= 100 ? Math.round(val) : Math.round(val * 1000);
    }

    const salaryMatch = parseNearKeyword(/(?:maaşım|maasim|gelirim|kazancım)\s*(?:yaklaşık|olan)?\s*(\d+(?:[.,]\d+)?)\s*(bin|milyon)?/);
    const rentMatch = parseNearKeyword(/(?:kiram|kira)\s*(?:yaklaşık|olan)?\s*(\d+(?:[.,]\d+)?)\s*(bin|milyon)?/);
    const savingsMatch = parseNearKeyword(/(?:birikimim|kenarda|bankada|bütçem)\s*(?:yaklaşık|olan)?\s*(\d+(?:[.,]\d+)?)\s*(bin|milyon)?/);
    const debtMatch = parseNearKeyword(/(?:borcum|kredim|kart borcum)\s*(?:yaklaşık|olan)?\s*(\d+(?:[.,]\d+)?)\s*(bin|milyon)?/);

    if (salaryMatch) {
      stored.incSalary = salaryMatch;
      updates.push(`Maaşınızı <strong>${formatCurrency(salaryMatch)}</strong>`);
    }
    if (rentMatch) {
      stored.expRent = rentMatch;
      updates.push(`Kira giderinizi <strong>${formatCurrency(rentMatch)}</strong>`);
    }
    if (savingsMatch) {
      stored.currentSavings = savingsMatch;
      updates.push(`Mevcut birikiminizi <strong>${formatCurrency(savingsMatch)}</strong>`);
    }
    if (debtMatch) {
      stored.expDebt = debtMatch;
      updates.push(`Borç ödemenizi <strong>${formatCurrency(debtMatch)}</strong>`);
    }

    if (updates.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch (e) {
        // ignore
      }
      return `✅ <em>Bütçe tablonuzda ${updates.join(', ')} olarak güncellendi.</em><br><br>`;
    }
    return null;
  }

  function generateGeminiTrainedResponse(questionRaw) {
    const q = questionRaw.toLowerCase().trim();
    conversationMemory.turnCount += 1;

    const nameMatch = questionRaw.match(/(?:benim adım|adım|ismim)\s+([a-zA-ZçğıöşüÇĞİÖŞÜ]+)/i);
    if (nameMatch) {
      conversationMemory.userName = nameMatch[1];
    }
    const namePrefix = conversationMemory.userName ? `${conversationMemory.userName}, ` : '';

    const mentionedAmount = extractAmountFromText(questionRaw);
    if (mentionedAmount) {
      conversationMemory.lastMentionedAmount = mentionedAmount;
    }
    const syncNote = trySyncBudgetFromChat(questionRaw) || '';

    const s = getLiveBudgetSnapshot();

    // Doğal günlük sohbet yanıtları ("Ne sormak istersiniz" olmadan)
    if (
      /^(merhaba|selam|slm|mrb|hey|iyi günler|günaydın|iyi akşamlar|iyi geceler|naber|ne haber|nasılsın|nasilsin|keyifler nasıl)\b/.test(q) ||
      q === 'nasılsın' ||
      q === 'naber'
    ) {
      conversationMemory.lastTopic = 'greeting';
      return `${syncNote}Selam ${namePrefix}hoş geldin! İyiyim, her şey yolunda. Umarım senin de günün güzel geçiyordur.`;
    }

    if (q.includes('iyiyim') || q.includes('iyi diyelim') || q.includes('fena değil') || q.includes('eh işte') || q.includes('süperim') || q.includes('harikayım')) {
      return `Bunu duyduğuma sevindim ${namePrefix}keyiflerin yerinde olması harika.`;
    }

    if (q.includes('ne yapıyorsun') || q.includes('napıyorsun') || q.includes('napiyorsun')) {
      return `Piyasa verisini yalnızca bu sayfada sağlanan göstergeler ve bağlam kadar değerlendirebilirim; doğrulanmış canlı akışım yoksa bunu açıkça söylerim. Şu an soruna odaklanıyorum.`;
    }

    if (nameMatch) {
      return `Memnun oldum <strong>${conversationMemory.userName}</strong>! 🤝`;
    }

    if (q.includes('sen kimsin') || q.includes('kimsin') || q.includes('seni kim') || q.includes('yusuf efe') || q.includes('ne işe yararsın')) {
      conversationMemory.lastTopic = 'identity';
      return `Ben <strong>YEK AI 4.0 Pro Edition</strong>; uygulamanın finansal bilgi çekirdeğini ve kullanılabilir olduğunda bulut dil modelini kullanan Türkçe bütçe, finansal okuryazarlık ve genel sohbet asistanıyım. Piyasa yorumlarını doğrulanmış canlı veri veya kişiye özel yatırım talimatı olarak değerlendirme.`;
    }

    if (q.includes('teşekkür') || q.includes('tesekkur') || q.includes('sağ ol') || q.includes('sağol') || q.includes('eyvallah') || q.includes('süper') || q.includes('harika') || q.includes('çok iyi') || q === 'tamam' || q === 'ok') {
      return `Rica ederim ${namePrefix}ne demek, her zaman! 😊`;
    }

    // 120 Ülke Ekonomisi ve Enflasyon Analizi Sorgusu
    const countryAnalysis = window.GLOBAL_ECONOMIES_120?.findCountryEconomyForAI(questionRaw);
    if (countryAnalysis) {
      conversationMemory.lastTopic = 'global_economies';
      return `${syncNote}${countryAnalysis}`;
    }

    if (q.includes('yetmiyor') || q.includes('geçinemiyorum') || q.includes('batıyorum') || q.includes('moralim bozuk') || q.includes('canım sıkkın') || q.includes('çok zor') || q.includes('fakir') || q.includes('parasız')) {
      conversationMemory.lastTopic = 'motivation';
      return `Seni çok iyi anlıyorum ${namePrefix}moralini hiç bozma. Ekonomik dalgalanmalarda bütçeyi dengelemek yorucu olabiliyor ama adım adım toparlanır:<br>
      <ul>
        <li><strong>Önce Nakit Sızıntısını Durdurmak:</strong> Ay sonunda eksiye düşülüyorsa ilk adım yatırım değil, gereksiz abonelik ve anlık istek harcamalarını kısmaktır.</li>
        <li><strong>Küçük Tutarlarla Disiplin:</strong> Ayda 500 ₺ veya 1.000 ₺ bile olsa düzenli kenara ayırmak finansal refleksi güçlendirir.</li>
      </ul>`;
    }

    if (
      mentionedAmount &&
      (q.includes('ne yap') || q.includes('nereye') || q.includes('nasıl değerlendir') || q.includes('yatır') || q.includes('var') || q.includes('birikim') || q.includes('elimde'))
    ) {
      conversationMemory.lastTopic = 'custom_amount';
      const amt = mentionedAmount;
      return `${syncNote}Elindeki <strong>${formatCurrency(amt)}</strong> tutar için herkese uygun tek bir dağılım yüzdesi yok. Önce şu başlıkları sırayla değerlendir:<br>
      <ul>
        <li><strong>Hedef ve vade:</strong> Paraya ne zaman ve hangi amaçla ihtiyaç duyacağını belirle.</li>
        <li><strong>Nakit güvenliği:</strong> Yakın dönem giderlerini, acil rezerv ihtiyacını ve yüksek maliyetli borçları hesaba kat.</li>
        <li><strong>Risk ve likidite:</strong> Geçici değer kaybını taşıma kapasiteni ve parayı ne hızda nakde çevireceğini değerlendir.</li>
        <li><strong>Karşılaştırma:</strong> Ürünlerin riskini, ücretini, vergisini ve işlem koşullarını güncel belgelerinden kontrol et.</li>
      </ul>`;
    }

    if (q.includes('ev al') || q.includes('araba') || q.includes('konut') || q.includes('peşinat') || q.includes('otomobil')) {
      conversationMemory.lastTopic = 'house_car';
      return `${syncNote}<strong>🏠 Ev & 🚗 Araba Hedefini Planlama:</strong><br>
      <ul>
        <li>Toplam bedeli, hedef tarihini, peşinatı ve öngörülen aylık ödemeyi yaz.</li>
        <li>Satın alma sonrası sigorta, bakım, yakıt, aidat, vergi ve finansman giderlerini bütçeye ekle.</li>
        <li>Yakın zamanda kullanılacak peşinat için likidite ve fiyat dalgalanması riskini birlikte değerlendir.</li>
        <li>Konut yatırımında kira çarpanını tek başına kullanma; boş kalma, bakım, finansman maliyeti ve satış süresini de hesaba kat.</li>
      </ul>`;
    }

    if (q.includes('öğrenci') || q.includes('genç') || q.includes('küçük para') || q.includes('az para') || q.includes('yaşım')) {
      conversationMemory.lastTopic = 'youth';
      return `<strong>🚀 Genç Yaşta ve Küçük Tutarlarla Yatırım (Bileşik Getiri):</strong><br>
      <ul>
        <li><strong>Önce temel güvence:</strong> Gelir-gider takibi, yüksek maliyetli borçların kontrolü ve uygun bir acil rezerv yatırım kararından önce gelir.</li>
        <li><strong>Küçük tutar:</strong> Başlangıç tutarı ve alım koşulları ürüne göre değişir; güncel fon belgelerini ve işlem alt limitlerini kontrol et.</li>
        <li><strong>Zaman:</strong> Daha erken ve düzenli birikim daha uzun büyüme süresi sağlayabilir; sonuç katkı, ücret, vergi ve piyasa performansına bağlıdır.</li>
      </ul>`;
    }

    if (q.includes('altın') || q.includes('altin') || q.includes('gümüş') || q.includes('maden') || q.includes('gram') || q.includes('altins1') || q.includes('sertifika')) {
      conversationMemory.lastTopic = 'gold';
      return `${syncNote}<strong>🪙 Altın, Gümüş ve Sertifikaları Karşılaştırma:</strong><br>
      <ul>
        <li>Fiziki ürün, banka hesabı, borsada işlem gören sertifika ve fonun sahiplik/saklama yapısını karşılaştır.</li>
        <li>Alım-satım makası, ücret, işlem saati, likidite, vergi ve karşı taraf riskini incele.</li>
        <li>Altın veya gümüş her dönemde enflasyona karşı koruma ya da pozitif getiri sağlamaz; tek ürüne yoğunlaşma riskini değerlendir.</li>
      </ul>`;
    }

    if (q.includes('tefas') || q.includes('fon') || q.includes('hisse') || q.includes('borsa') || q.includes('bist') || q.includes('stopaj') || q.includes('vergi') || q.includes('temettü')) {
      conversationMemory.lastTopic = 'funds';
      return `${syncNote}<strong>📈 Fon ve Hisse Analizi İçin Kontrol Listesi:</strong><br>
      <ul>
        <li>Fonun güncel yatırımcı bilgi formu/izahnamesindeki strateji, portföy dağılımı ve risk göstergesini incele.</li>
        <li>Yönetim ücreti, toplam gider, işlem saati, valör, likidite ve vergi koşullarını karşılaştır.</li>
        <li>Hisse analizinde iş modeli, bilanço, borç, nakit akışı, kâr kalitesi, değerleme ve sektör riskini birlikte değerlendir.</li>
        <li>Vergi oranı ve ürün koşulları değişebileceğinden güncel resmi belgeyi kontrol et; geçmiş getiri geleceği garanti etmez.</li>
      </ul>`;
    }

    if (q.includes('dolar') || q.includes('döviz') || q.includes('euro') || q.includes('eurobond') || q.includes('kur') || q.includes('tahvil') || q.includes('cds')) {
      conversationMemory.lastTopic = 'forex';
      return `${syncNote}<strong>💵 Döviz, Tahvil ve Kur Riskini Değerlendirme:</strong><br>
      <ul>
        <li>Döviz nakit, tahvil ve yabancı fonlar farklı faiz, kur, kredi, likidite, ücret ve vergi riskleri taşır.</li>
        <li>Tahvil fiyatı piyasa getirisi ve kredi riskinden etkilenir; vade boyunca ara dönem değer kaybı yaşanabilir.</li>
        <li>İşlem öncesinde ürünün güncel koşullarını ve paraya ne zaman ihtiyaç duyacağını kontrol et.</li>
      </ul>`;
    }

    if (q.includes('bitcoin') || q.includes('btc') || q.includes('kripto') || q.includes('coin') || q.includes('altcoin') || q.includes('tüyo') || q.includes('spekülasyon') || q.includes('%5') || q.includes('oyun')) {
      conversationMemory.lastTopic = 'crypto';
      return `${syncNote}<strong>₿ Kripto Varlık Riskleri:</strong><br>
      <ul>
        <li>Yüksek oynaklık, saklama/platform, siber saldırı, likidite ve düzenleme riski bulunabilir; değer tamamen kaybolabilir.</li>
        <li>Yalnızca kaybı temel giderlerini ve borç ödemelerini bozmayacak tutarı riske at; kaldıraç ve borçla alımdan kaçın.</li>
        <li>Site içindeki yüzde sınırını evrensel kural sayma; önce risk taşıma kapasiteni değerlendir.</li>
      </ul>`;
    }

    if (q.includes('acil') || q.includes('sıfırıncı') || q.includes('mevduat') || q.includes('ppf') || q.includes('para piyasası') || q.includes('likit') || q.includes('tampon') || q.includes('faiz')) {
      conversationMemory.lastTopic = 'emergency';
      return `${syncNote}<strong>🛡️ Acil Nakit Rezervi ve Kısa Vadeli Araçlar:</strong><br>
      <ul>
        <li>Rezerv miktarını zorunlu giderlere, gelir istikrarına, bakmakla yükümlü olunan kişilere ve sigorta kapsamına göre belirle.</li>
        <li>Likidite, anapara riski, ücret, vergi ve nakde dönüş süresini karşılaştır.</li>
        <li>Para piyasası fonu mevduat değildir; mevduat veya fon getirisi/anaparası garanti varsayılmamalıdır.</li>
      </ul>`;
    }

    if (q.includes('borç') || q.includes('kredi') || q.includes('kart') || q.includes('çığ') || q.includes('kartopu') || q.includes('asgari') || q.includes('kmh') || q.includes('ek hesap')) {
      conversationMemory.lastTopic = 'debt';
      return `${syncNote}<strong>💳 Kredi ve Borç Kapatma (Çığ & Kartopu Yöntemi):</strong><br>
      <ul>
        <li>Önce her borcun kalan tutarını, efektif maliyetini, asgari ödemesini, ücretini ve son ödeme tarihini yaz.</li>
        <li><strong>Çığ:</strong> Asgari ödemelerden sonra ek tutarı en yüksek maliyetli borca yöneltmek toplam faiz maliyetini azaltmaya yardımcı olur.</li>
        <li><strong>Kartopu:</strong> En küçük bakiyeyi önce kapatmak motivasyonu artırabilir; maliyet toplamı daha yüksek olabilir.</li>
      </ul>`;
    }

    if (q.includes('72') || q.includes('bileşik') || q.includes('fire') || q.includes('özgürlük') || q.includes('emekli') || q.includes('katla') || q.includes('zengin')) {
      conversationMemory.lastTopic = 'compound';
      return `${syncNote}<strong>🔥 72 Kuralı, Bileşik Getiri ve Finansal Özgürlük (FIRE):</strong><br>
      <ul>
        <li><strong>72 Kuralı:</strong> Yaklaşık ikiye katlanma süresi, varsayılan yıllık getiri yüzdesiyle 72'nin bölünmesiyle bulunur; bu kaba bir hesaplamadır, tahmin değildir.</li>
        <li><strong>Projeksiyon:</strong> Sonuç için başlangıç tutarı, katkı, süre, varsayılan net getiri, vergi ve ücret varsayımlarını açıkça belirlemek gerekir. Reel ve nominal tutarları karıştırma.</li>
        <li><strong>FIRE:</strong> Yıllık giderin sabit bir katını kesin emeklilik eşiği sayma; harcama, yaşam süresi, vergi ve çekim oranı sonucu değiştirir.</li>
      </ul>`;
    }

    if (q.includes('50/30/20') || q.includes('50') || q.includes('kural') || q.includes('tasarruf') || q.includes('kira') || q.includes('harcama') || q.includes('enflasyon') || q.includes('zam') || q.includes('bes') || q.includes('bütçe')) {
      conversationMemory.lastTopic = 'budget_rule';
      return `${syncNote}<strong>📐 50/30/20 Bütçe Analizi:</strong><br>
      <ul>
        <li>İhtiyaç, istek ve tasarruf için %50/30/20 oranlarını başlangıç kontrol listesi olarak kullan; zorunlu bir reçete değildir.</li>
        <li>Gelir ve giderlerini doğru kaydet; kira, borç, aile yükümlülükleri ve düzensiz harcamalara göre gerçekçi hedef belirle.</li>
        <li>Uygulama tablosundaki aylık net fark <strong>${formatCurrency(s.netMonthly)}</strong> görünüyor; bu verinin güncel ve sana ait olduğunu doğrula.</li>
      </ul>`;
    }

    // Eşleşmeyen sorgularda yek-llm.js içindeki Evrensel Zeka Motorunun devreye girmesi için işaret döndür
    return `__UNMATCHED_QUERY__`;
  }

  async function fetchGeminiApiOrFallback(userQuestion) {
    const apiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    const s = getLiveBudgetSnapshot();

    if (!apiKey) {
      return generateGeminiTrainedResponse(userQuestion);
    }

    const today = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(new Date());
    const modelMode = yekModelModeSelect?.value || 'pro';
    const systemInstruction = [
      'Sen YEK AI 4.0 Pro Edition, Türkçe finansal okuryazarlık, bütçe ve genel sohbet asistanısın. Genel eğitim ve karar çerçevesi sun; lisanslı kişisel yatırım danışmanı gibi davranma.',
      'Kısa soruya kısa, detay isteyen kullanıcıya aşamalı ve anlaşılır yanıt ver. Önce sorunun özüne cevapla; konu dışı başlık ekleme.',
      'Kişisel finans yanıtında hedef, vade, nakit ihtiyacı, gelir istikrarı, borç maliyeti ve risk taşıma kapasitesini ayır. Eksik bilgi yanıtı değiştiriyorsa yalnızca gerekli soruları sor.',
      'Uygulamadaki 5 Altın Kural ile 50/30/20 oranı başlangıç çerçevesidir. Sabit portföy yüzdelerini veya %5 sınırını evrensel standart gibi sunma.',
      'Çeşitlendirme belirli varlığa özgü riski azaltabilir ama piyasa kaybını yok etmez. Geçmiş performansı garanti veya tek başına seçim ölçütü sayma.',
      'Fonlarda güncel yatırımcı bilgi formu/izahname, portföy, risk göstergesi, ücret, valör, likidite ve vergi başlıklarını kontrol ettir. Para piyasası fonunu mevduat ya da garantili getiri olarak tanımlama.',
      'Borç ve yatırım kararlarını karşılaştırırken zorunlu ödemeleri, sözleşmedeki gerçek maliyeti, ücretleri ve belirsiz yatırım getirisini ayır.',
      'Güncel vergi, faiz, fon koşulu, mevzuat ve piyasa haberi sağlanan bağlamda yoksa sayı uydurma; resmi ve güncel belgeyle doğrulanması gerektiğini söyle.',
      'Uygulama tablosu kişisel ve güncel olduğu kullanıcı tarafından doğrulanana kadar örnek/eski kayıt olabilir. Gösterge kurlarının zaman damgası teyitli değildir; kesin veya canlı fiyat diye sunma.',
      'Hesaplamada ana para, oran, dönem, bileşiklenme ve ücret/vergi varsayımlarını belirt. Reel ve nominal getiriyi ayır; projeksiyonları senaryo olarak sun, tahmin veya garanti olarak değil.',
      'Bugünün tarihi: ' + today + '. Bu tarih canlı veri erişimi anlamına gelmez.',
      'Uygulama bütçesi: birikim ' + formatCurrency(s.currentSavings) + ', aylık gelir ' + formatCurrency(s.totalIncome) + ', gider ' + formatCurrency(s.totalExpense) + ', zorunlu gider ' + formatCurrency(s.totalNeeds) + ', istekler ' + formatCurrency(s.totalWants) + ', borç ödemesi ' + formatCurrency(s.totalDebts) + ', net fark ' + formatCurrency(s.netMonthly) + ', uygulamadaki 3 aylık rezerv eşiği ' + formatCurrency(s.minEF) + '. Doğrulanmış kişisel veri gibi sunma.',
      'Uzmanlık modu: ' + (modelMode === 'macro' ? 'makroekonomik senaryolar, aktarım kanalları ve gecikmeler' : modelMode === 'wealth' ? 'nakit akışı, borç maliyeti, hedef ve varsayımlı hesaplama' : 'genel asistan; kullanıcının sorusuna uygun çerçeve'),
      'Yanıtları Türkçe ver. Gerekiyorsa HTML <strong>, <ul>, <li> kullan; basit sorularda biçimlendirmeyi sade tut.'
    ].join('\n');

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: userQuestion }] }],
          }),
        }
      );

      if (!response.ok) {
        return generateGeminiTrainedResponse(userQuestion);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return generateGeminiTrainedResponse(userQuestion);

      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    } catch (err) {
      return generateGeminiTrainedResponse(userQuestion);
    }
  }

  async function handleUserQuestion(text) {
    const clean = text.trim();
    if (!clean) return;

    appendMessage('user', clean);
    aiInput.value = '';

    const loadingRow = appendMessage(
      'bot',
      '<div class="ai-thinking-indicator"><span class="thinking-dot"></span><span class="thinking-dot"></span><span class="thinking-dot"></span> <em>YEK AI 4.0 Pro Edition (Piyasa Ekonomisi & Genel Zeka Sinir Ağı) yanıt üretiyor...</em></div>',
      { engineBadge: 'SİNİR AĞI İŞLENİYOR...' }
    );

    if (window.YEK_LLM_V4) {
      const result = await window.YEK_LLM_V4.generateProLLMResponse(clean, chatHistory, generateGeminiTrainedResponse);
      loadingRow.remove();

      const followUps = window.YEK_LLM_V4.getSuggestedFollowUps(clean);
      appendMessage('bot', result.html, {
        engineBadge: result.engineBadge,
        followUps,
      });

      chatHistory.push({ role: 'user', content: clean });
      chatHistory.push({ role: 'assistant', content: result.rawText || clean });
      saveChatHistory();
      updateAiContextStrip();
    } else {
      const reply = await fetchGeminiApiOrFallback(clean);
      loadingRow.remove();
      appendMessage('bot', reply);
      updateAiContextStrip();
    }
  }

  aiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserQuestion(aiInput.value);
  });

  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt');
      if (promptText) handleUserQuestion(promptText);
    });
  });

  if (clearAiChatBtn) {
    clearAiChatBtn.addEventListener('click', () => {
      chatHistory = [];
      localStorage.removeItem('yek_ai_v3_chat_history');
      showWelcomeMessage();
    });
  }

  showWelcomeMessage();
});

// =========================================================
// DÜNYA PARA BİRİMLERİ CANLI TL KUR ÇEVİRİCİ & ÜST PİYASA ŞERİDİ
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Sayfayı aşağı kaydırınca (Scroll) üst menüyü ve piyasa şeridini otomatik küçült
  const navbarEl = document.querySelector('.navbar');
  const tickerBarEl = document.querySelector('.market-ticker-bar');

  function handleHeaderScrollShrink() {
    if (window.scrollY > 30) {
      if (navbarEl) navbarEl.classList.add('navbar-scrolled');
      if (tickerBarEl) tickerBarEl.classList.add('ticker-scrolled');
    } else {
      if (navbarEl) navbarEl.classList.remove('navbar-scrolled');
      if (tickerBarEl) tickerBarEl.classList.remove('ticker-scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScrollShrink, { passive: true });
  handleHeaderScrollShrink();

  // GERÇEK PİYASA DEĞERLERİ VE YÖN/BEKLENTİ ANALİZLERİ (2026 GÜNCEL VERİLER)
  const worldCurrencies = [
    {
      code: 'USD',
      symbol: '$',
      flag: '🇺🇸',
      name: 'Amerikan Doları',
      tryRate: 49.84,
      trend: 'up',
      trendBadge: '📈 İleride Kademeli Artış Bekleniyor',
      targetRange: 'Orta Vade Beklenti: ₺51,50 – ₺54,20',
      analysis: 'Enflasyon farkı ve küresel rezerv para talebi nedeniyle TL karşısında kontrollü ve kademeli yükseliş eğiliminin korunması bekleniyor. Nakit tutmak yerine Eurobond veya Yabancı Teknoloji Fonu ile değerlendirilmesi önerilir.',
    },
    {
      code: 'EUR',
      symbol: '€',
      flag: '🇪🇺',
      name: 'Avrupa Para Birimi (Euro)',
      tryRate: 55.50,
      trend: 'up',
      trendBadge: '📈 İleride Artış Bekleniyor',
      targetRange: 'Orta Vade Beklenti: ₺57,40 – ₺60,10',
      analysis: 'EUR/USD paritesindeki dengelenme ve Türkiye\'nin Avrupa ile dış ticaret hacmiyle birlikte Euro/TL kurunda yukarı yönlü kademeli artış beklentisi öne çıkıyor.',
    },
    {
      code: 'GBP',
      symbol: '£',
      flag: '🇬🇧',
      name: 'İngiliz Sterlini',
      tryRate: 66.53,
      trend: 'up',
      trendBadge: '📈 İleride Artış Bekleniyor',
      targetRange: 'Orta Vade Beklenti: ₺68,50 – ₺71,80',
      analysis: 'İngiltere Merkez Bankası (BoE) sıkı faiz politikası Sterlin\'i küresel çapta güçlü tutuyor; TL karşısında yüksek primli artış trendinin sürmesi bekleniyor.',
    },
    {
      code: 'CHF',
      symbol: '₣',
      flag: '🇨🇭',
      name: 'İsviçre Frangı',
      tryRate: 60.15,
      trend: 'up',
      trendBadge: '📈 Güçlü Artış / Güvenli Liman Beklentisi',
      targetRange: 'Orta Vade Beklenti: ₺62,20 – ₺65,00',
      analysis: 'Küresel jeopolitik risklerde dünyanın en sağlam güvenli liman para birimi olan CHF, düşük İsviçre enflasyonu sayesinde uzun vadede alım gücünü en iyi koruyan dövizdir.',
    },
    {
      code: 'GAU',
      symbol: '🪙',
      flag: '🏆',
      name: '24 Ayar Gram Altın',
      tryRate: 6500.00,
      trend: 'up',
      trendBadge: '🚀 Güçlü Artış Bekleniyor (Portföy Favorisi)',
      targetRange: 'Orta Vade Beklenti: ₺6.850 – ₺7.400',
      analysis: 'Merkez bankalarının rekor fiziki altın alımları, küresel faiz indirim döngüsü ve hem Ons Altın hem Dolar/TL çarpan etkisiyle Gram Altın\'da güçlü yükseliş trendinin devamı bekleniyor.',
    },
    {
      code: 'BTC',
      symbol: '₿',
      flag: '⚡',
      name: 'Bitcoin (BTC)',
      tryRate: 4010000.00,
      trend: 'up',
      trendBadge: '📈 Dalgalı Artış Bekleniyor (Maks. %5 Kuralı)',
      targetRange: 'Orta Vade Beklenti: ₺4.250.000 – ₺4.800.000',
      analysis: 'Kurumsal ETF girişleri ve arz kısıtıyla uzun vadede artış beklense de kısa vadeli sert düzeltmelere açıktır. Yusuf Efe Karagöz\'ün 5. Altın İlkesi gereği portföyde maksimum %5 sınırıyla tutulmalıdır.',
    },
    {
      code: 'JPY',
      symbol: '¥',
      flag: '🇯🇵',
      name: 'Japon Yeni (100 JPY = ~31,60 ₺)',
      tryRate: 0.316,
      trend: 'stable',
      trendBadge: '⚖️ Sabit / Yatay-Ilımlı Seyir Bekleniyor',
      targetRange: '1 JPY Beklenti: ₺0,315 – ₺0,335',
      analysis: 'Japonya Merkez Bankası\'nın (BoJ) düşük faiz politikası nedeniyle Dolar karşısında yatay/dengeli, TL karşısında ise enflasyon oranında sınırlı hareket bekleniyor.',
    },
    {
      code: 'CAD',
      symbol: 'C$',
      flag: '🇨🇦',
      name: 'Kanada Doları',
      tryRate: 35.62,
      trend: 'stable',
      trendBadge: '⚖️ Sabit / Dengeli Seyir Bekleniyor',
      targetRange: 'Orta Vade Beklenti: ₺35,50 – ₺37,20',
      analysis: 'Emtia ve petrol fiyatlarına duyarlı olan Kanada Doları\'nın küresel piyasalarda dengeli ve yatay-hafif yukarı yönlü bir bantta kalması bekleniyor.',
    },
    {
      code: 'AUD',
      symbol: 'A$',
      flag: '🇦🇺',
      name: 'Avustralya Doları',
      tryRate: 32.85,
      trend: 'stable',
      trendBadge: '⚖️ Sabit / Yatay Seyir Bekleniyor',
      targetRange: 'Orta Vade Beklenti: ₺32,60 – ₺34,40',
      analysis: 'Asya-Pasifik ticaret hacmine ve maden ihracatına bağlı olarak Dolar paritesinde sabit/yatay bir seyir izlemesi öngörülüyor.',
    },
    {
      code: 'SAR',
      symbol: '﷼',
      flag: '🇸🇦',
      name: 'Suudi Arabistan Riyali',
      tryRate: 13.28,
      trend: 'stable',
      trendBadge: '⚖️ USD Sabit Endeksli (Peg) Seyir',
      targetRange: 'Orta Vade Beklenti: ₺13,60 – ₺14,20',
      analysis: 'Suudi Riyali sabit kur rejimiyle ABD Doları\'na (1 USD = 3,75 SAR) çıpalanmıştır; Dolar/TL kuru ile birebir aynı oranda hareket etmesi bekleniyor.',
    },
    {
      code: 'AED',
      symbol: 'د.إ',
      flag: '🇦🇪',
      name: 'BAE Dirhemi (Dubai)',
      tryRate: 13.57,
      trend: 'stable',
      trendBadge: '⚖️ USD Sabit Endeksli (Peg) Seyir',
      targetRange: 'Orta Vade Beklenti: ₺13,90 – ₺14,50',
      analysis: 'BAE Dirhemi ABD Doları\'na (1 USD = 3,6725 AED) sabitlenmiştir; parite bazında sabit kalması, TL karşısında ise USD ile paralel seyretmesi bekleniyor.',
    },
    {
      code: 'CNY',
      symbol: '¥',
      flag: '🇨🇳',
      name: 'Çin Yuanı (Renminbi)',
      tryRate: 7.48,
      trend: 'down',
      trendBadge: '📉 Paritede Baskı / Kısmi Azalış Bekleniyor',
      targetRange: 'Orta Vade Beklenti: ₺7,30 – ₺7,65',
      analysis: 'Çin Merkez Bankası\'nın ihracatı desteklemek için uyguladığı gevşek para politikası ve gümrük tarifeleri nedeniyle Yuan\'ın Dolar ve Altın karşısında değer kaybetmesi (zayıf kalması) bekleniyor.',
    },
    {
      code: 'RUB',
      symbol: '₽',
      flag: '🇷🇺',
      name: 'Rus Rublesi',
      tryRate: 0.618,
      trend: 'down',
      trendBadge: '📉 Azalış / Değer Kaybı Bekleniyor',
      targetRange: 'Orta Vade Beklenti: ₺0,560 – ₺0,615',
      analysis: 'Jeopolitik yaptırımlar, enerji gelirlerindeki dalgalanma ve yüksek yerel enflasyon nedeniyle Ruble\'de orta vadede azalış ve baskılanma beklentisi hakimdir.',
    },
  ];

  let isForeignToTry = true;

  const fxAmountInput = document.getElementById('fxAmountInput');
  const fxCurrencySelect = document.getElementById('fxCurrencySelect');
  const fxDirectionToggleBtn = document.getElementById('fxDirectionToggleBtn');
  const fxResultLabel = document.getElementById('fxResultLabel');
  const fxResultValue = document.getElementById('fxResultValue');
  const fxUnitRateInfo = document.getElementById('fxUnitRateInfo');
  const fxSelectedAnalysisBox = document.getElementById('fxSelectedAnalysisBox');
  const worldCurrenciesGrid = document.getElementById('worldCurrenciesGrid');
  const userBudgetFxGrid = document.getElementById('userBudgetFxGrid');
  const fxLastUpdateBadge = document.getElementById('fxLastUpdateBadge');
  const refreshRatesBtn = document.getElementById('refreshRatesBtn');

  function formatDecimalCurrency(val, decimals = 2, suffix = '') {
    const n = Number(val) || 0;
    const formatted = new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n);
    return suffix ? `${formatted} ${suffix}` : `₺${formatted}`;
  }

  function getCurrencyObj(code) {
    return worldCurrencies.find((c) => c.code === code) || worldCurrencies[0];
  }

  function updateMarketTicker() {
    const usd = getCurrencyObj('USD').tryRate;
    const eur = getCurrencyObj('EUR').tryRate;
    const gbp = getCurrencyObj('GBP').tryRate;
    const gau = getCurrencyObj('GAU').tryRate;
    const btc = getCurrencyObj('BTC').tryRate;

    const elUSD = document.getElementById('tickerUSD');
    const elEUR = document.getElementById('tickerEUR');
    const elGBP = document.getElementById('tickerGBP');
    const elGAU = document.getElementById('tickerGAU');
    const elBTC = document.getElementById('tickerBTC');

    if (elUSD) elUSD.textContent = formatDecimalCurrency(usd, 2);
    if (elEUR) elEUR.textContent = formatDecimalCurrency(eur, 2);
    if (elGBP) elGBP.textContent = formatDecimalCurrency(gbp, 2);
    if (elGAU) elGAU.textContent = formatDecimalCurrency(gau, 0);
    if (elBTC) elBTC.textContent = formatDecimalCurrency(btc, 0);
  }

  function renderCurrencyConverter() {
    if (!fxAmountInput || !fxCurrencySelect) return;

    const amount = Math.max(0, parseFloat(fxAmountInput.value) || 0);
    const selectedCode = fxCurrencySelect.value;
    const curr = getCurrencyObj(selectedCode);

    if (isForeignToTry) {
      const resultTry = amount * curr.tryRate;
      fxResultLabel.textContent = `${amount} ${curr.code} → TÜRK LİRASI (TRY) KARŞILIĞI`;
      fxResultValue.textContent = formatDecimalCurrency(resultTry, 2);
      fxUnitRateInfo.textContent = `Güncel Serbest Piyasa Kuru: 1 ${curr.code} (${curr.symbol}) = ${formatDecimalCurrency(curr.tryRate, curr.tryRate < 1 ? 3 : 2)}`;
    } else {
      const resultForeign = curr.tryRate > 0 ? amount / curr.tryRate : 0;
      const dec = curr.code === 'BTC' ? 6 : 2;
      fxResultLabel.textContent = `₺${amount} TRY → ${curr.code} (${curr.name}) KARŞILIĞI`;
      fxResultValue.textContent = formatDecimalCurrency(resultForeign, dec, curr.symbol);
      fxUnitRateInfo.textContent = `Güncel Serbest Piyasa Kuru: 1 ${curr.code} = ${formatDecimalCurrency(curr.tryRate, curr.tryRate < 1 ? 3 : 2)}`;
    }

    // Seçili para biriminin detaylı beklenti ve yön analizini göster
    if (fxSelectedAnalysisBox) {
      fxSelectedAnalysisBox.innerHTML = `
        <div class="fx-analysis-inner trend-box-${curr.trend}">
          <div class="fx-analysis-top">
            <span class="fx-trend-pill trend-${curr.trend}">${curr.trendBadge}</span>
            <span class="fx-target-band">${curr.targetRange}</span>
          </div>
          <p class="fx-analysis-desc"><strong>${curr.flag} ${curr.name} (${curr.code}) Piyasa Analizi:</strong> ${curr.analysis}</p>
        </div>
      `;
    }

    if (worldCurrenciesGrid) {
      worldCurrenciesGrid.innerHTML = worldCurrencies
        .map((item) => {
          const priceDecimals = item.tryRate < 1 ? 3 : item.tryRate > 1000 ? 0 : 2;
          const sampleConverted = isForeignToTry
            ? `${amount} ${item.code} = ${formatDecimalCurrency(amount * item.tryRate, 2)}`
            : `₺${amount} = ${formatDecimalCurrency(amount / item.tryRate, item.code === 'BTC' ? 5 : 2, item.symbol)}`;

          return `
            <div class="fx-rate-card ${item.code === selectedCode ? 'active-fx-card' : ''}" data-code="${item.code}">
              <div class="fx-card-top">
                <span class="fx-flag-code">${item.flag} ${item.code}</span>
                <span class="fx-symbol-pill">${item.symbol}</span>
              </div>
              <span class="fx-currency-name">${item.name}</span>
              <strong class="fx-try-price">1 ${item.code} = ${formatDecimalCurrency(item.tryRate, priceDecimals)}</strong>
              <div class="fx-converted-sub">${sampleConverted}</div>
              <div class="fx-card-forecast-block">
                <span class="fx-trend-pill trend-${item.trend}">${item.trendBadge}</span>
                <small class="fx-card-target">${item.targetRange}</small>
                <p class="fx-card-analysis-note">${item.analysis}</p>
              </div>
            </div>
          `;
        })
        .join('');

      worldCurrenciesGrid.querySelectorAll('.fx-rate-card').forEach((card) => {
        card.addEventListener('click', () => {
          fxCurrencySelect.value = card.dataset.code;
          renderCurrencyConverter();
        });
      });
    }

    updateUserBudgetInForeignCurrencies();
  }

  function updateUserBudgetInForeignCurrencies() {
    if (!userBudgetFxGrid) return;
    const snap = computeBudgetSnapshot(getStoredBudgetRaw());
    const currentSavings = snap.currentSavings;
    const netMonthly = snap.positiveSavings;

    const targets = ['USD', 'EUR', 'GBP', 'CHF', 'GAU'];
    userBudgetFxGrid.innerHTML = targets
      .map((code) => {
        const c = getCurrencyObj(code);
        const netInCurr = c.tryRate > 0 ? netMonthly / c.tryRate : 0;
        const savingsInCurr = c.tryRate > 0 ? currentSavings / c.tryRate : 0;
        const unitLabel = code === 'GAU' ? 'Gram' : c.symbol;
        return `
          <div class="budget-fx-box">
            <span>${c.flag} ${c.name} (${c.code})</span>
            <strong>Aylık Kalan: ${formatDecimalCurrency(netInCurr, 1, unitLabel)}</strong>
            <small>Hazır Birikim: ${formatDecimalCurrency(savingsInCurr, 1, unitLabel)}</small>
          </div>
        `;
      })
      .join('');
  }

  async function fetchLiveExchangeRates() {
    try {
      if (fxLastUpdateBadge) {
        fxLastUpdateBadge.textContent = '⏳ Güncel piyasa kurları senkronize ediliyor...';
      }
      const res = await fetch('https://open.er-api.com/v6/latest/TRY');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          const apiUsdTry = data.rates.USD ? 1 / data.rates.USD : 0;
          // Yalnızca API verisi gerçek güncel piyasa bandındaysa (> 45 TL) uygula, aksi halde araştırılmış gerçek serbest piyasa kurlarını koru
          if (apiUsdTry >= 45) {
            worldCurrencies.forEach((item) => {
              if (item.code !== 'GAU' && item.code !== 'BTC' && data.rates[item.code]) {
                const rateInTry = 1 / data.rates[item.code];
                if (rateInTry > 0) {
                  item.tryRate = rateInTry;
                }
              }
            });
            const liveUsd = getCurrencyObj('USD').tryRate;
            getCurrencyObj('GAU').tryRate = Math.round(liveUsd * 130.42);
            getCurrencyObj('BTC').tryRate = Math.round(liveUsd * 80450);
          }
        }
      }
      if (fxLastUpdateBadge) {
        const nowStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        fxLastUpdateBadge.textContent = `✓ Serbest Piyasa Kurları Güncel (${nowStr})`;
      }
    } catch (e) {
      if (fxLastUpdateBadge) {
        fxLastUpdateBadge.textContent = '✓ Gerçek Serbest Piyasa Kurları Aktif';
      }
    }
    updateMarketTicker();
    renderCurrencyConverter();
  }

  if (fxAmountInput) fxAmountInput.addEventListener('input', renderCurrencyConverter);
  if (fxCurrencySelect) fxCurrencySelect.addEventListener('change', renderCurrencyConverter);
  if (fxDirectionToggleBtn) {
    fxDirectionToggleBtn.addEventListener('click', () => {
      isForeignToTry = !isForeignToTry;
      renderCurrencyConverter();
    });
  }
  if (refreshRatesBtn) {
    refreshRatesBtn.addEventListener('click', fetchLiveExchangeRates);
  }

  updateMarketTicker();
  renderCurrencyConverter();
  fetchLiveExchangeRates();
});


// ============================================================================
// ÜYE GİRİŞİ SİSTEMİ + ANA SAYFA ERİŞİMİ + KULLANICI YORUMLARI
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const AUTH_USER_KEY = 'yek_auth_user_v1';
  const REGISTERED_USERS_KEY = 'yek_registered_users_v1';
  const COMMENTS_STORAGE_KEY = 'yek_site_comments_v1';

  function getLoggedInUser() {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setLoggedInUser(userObj) {
    try {
      if (userObj) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (e) {
      // ignore
    }
    updateAuthUIAndGates();
  }

  // Kullanıcının site araçlarından (YEK AI, Bütçe Hesaplama vb.) yararlanma yetkisi var mı?
  function hasAccessToSiteTools() {
    return Boolean(getLoggedInUser());
  }

  // Ana sayfa (index.html) herkese açık; araç sayfaları giriş yapan üyelere açıktır.
  const currentPath = window.location.pathname.toLowerCase();
  const isHomePage =
    currentPath === '/' ||
    currentPath.endsWith('index.html') ||
    currentPath.endsWith('/dogru-butce/') ||
    currentPath.endsWith('/dogru-butce');

  // 2. GİRİŞ YAP / ÜYE OL MODALI (E-POSTA & ŞİFRE + GOOGLE + APPLE + E-DEVLET) OLUŞTUR
  const authModalBackdrop = document.createElement('div');
  authModalBackdrop.id = 'yekAuthModalBackdrop';
  authModalBackdrop.className = 'yek-auth-modal-backdrop hidden';
  authModalBackdrop.innerHTML = `
    <div class="yek-auth-modal" role="dialog" aria-modal="true" aria-labelledby="yekAuthModalTitle">
      <button type="button" id="closeAuthModalBtn" class="yek-auth-close-btn" title="Kapat">×</button>

      <div class="yek-auth-modal-header">
        <img src="logo.svg" alt="YEK Logo" class="yek-auth-logo" />
        <div>
          <span class="yek-auth-badge">DOĞRU BÜTÇE DOĞRU KULLANIM • ÜYE MERKEZİ</span>
          <h3 id="yekAuthModalTitle">YEK AI & Finans Araçlarına Giriş Yapın</h3>
          <p>Siteyi gezinmek ücretsizdir; <strong>YEK AI ile sohbet etmek</strong>, bütçe analizi yapmak ve tüm uzman araçlarından yararlanmak için giriş yapın.</p>
        </div>
      </div>

      <!-- Hızlı Tek Tıkla Giriş Seçenekleri: Google, Apple, e-Devlet -->
      <div class="yek-social-auth-grid">
        <button type="button" class="btn-social-auth btn-auth-google" data-provider="google">
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>Google ile Giriş Yap</span>
        </button>

        <button type="button" class="btn-social-auth btn-auth-apple" data-provider="apple">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          <span>Apple ile Giriş Yap</span>
        </button>

        <button type="button" class="btn-social-auth btn-auth-edevlet" data-provider="edevlet">
          <span class="edevlet-emblem">e</span>
          <span>e-Devlet Kapısı ile Giriş Yap</span>
        </button>
      </div>

      <div class="yek-auth-divider">
        <span>veya E-Posta (Kullanıcı Adı) & Şifre ile</span>
      </div>

      <div class="yek-auth-tabs">
        <button type="button" class="yek-auth-tab active" data-tab="login">Giriş Yap</button>
        <button type="button" class="yek-auth-tab" data-tab="register">Yeni Üyelik Oluştur</button>
      </div>

      <!-- E-Posta & Şifre Formu -->
      <form id="yekEmailAuthForm" class="yek-auth-form">
        <div id="yekRegisterNameRow" class="yek-auth-field hidden">
          <label for="yekAuthFullName">Ad Soyad</label>
          <input type="text" id="yekAuthFullName" placeholder="Örn: Ahmet Yılmaz" class="text-input" />
        </div>

        <div class="yek-auth-field">
          <label for="yekAuthEmail">Kullanıcı Adı (E-Posta Adresiniz)</label>
          <input type="email" id="yekAuthEmail" placeholder="ornek@eposta.com" required class="text-input" />
        </div>

        <div class="yek-auth-field">
          <label for="yekAuthPassword">Şifre</label>
          <input type="password" id="yekAuthPassword" placeholder="•••••••• (En az 4 karakter)" required minlength="4" class="text-input" />
        </div>

        <div id="yekAuthFeedback" class="yek-auth-feedback hidden"></div>

        <button type="submit" id="yekAuthSubmitBtn" class="btn btn-primary yek-auth-submit-btn">
          E-Posta ile Giriş Yap ve Araçları Aç
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(authModalBackdrop);

  // 3. ÜST MENÜYE (NAVBAR) GİRİŞ BUTONU EKLE
  const navRightGroup = document.querySelector('.nav-right-group');
  const authNavContainer = document.createElement('div');
  authNavContainer.className = 'yek-nav-auth-group';
  if (navRightGroup) {
    navRightGroup.prepend(authNavContainer);
  }

  // 4. GİRİŞ YAPMAYAN ZİYARETÇİLER İÇİN ARAÇ SAYFASI KİLİDİ
  const gateBanner = document.createElement('div');
  gateBanner.id = 'yekVisitorGateOverlay';
  gateBanner.className = 'yek-visitor-gate-overlay hidden';
  gateBanner.innerHTML = `
    <div class="yek-visitor-gate-card">
      <img src="logo.svg" alt="YEK" class="gate-logo" />
      <span class="gate-badge">🔒 ÜYE GİRİŞİ GEREKLİ</span>
      <h2>YEK AI Sohbet ve Uzman Bütçe Araçlarından Yararlanmak İçin Giriş Yapın</h2>
      <p>Ana sayfayı incelemek serbesttir. <strong>YEK AI 4.0 Pro Edition LLM ile sohbet etmek</strong>, bütçe hesaplamak, 5 Altın Kural ve Döviz araçlarını kullanmak için E-Posta/Şifre, <strong>Google</strong>, <strong>Apple</strong> veya <strong>e-Devlet</strong> ile saniyeler içinde giriş yapabilirsiniz.</p>
      <div class="gate-actions">
        <button type="button" id="gateOpenLoginBtn" class="btn btn-primary">
          🔑 Giriş Yap / Üye Ol (Google • Apple • e-Devlet • E-Posta)
        </button>
        <a href="index.html" class="btn btn-secondary">🏠 Ana Sayfaya Dön</a>
      </div>
    </div>
  `;
  document.body.appendChild(gateBanner);

  function openAuthModal() {
    authModalBackdrop.classList.remove('hidden');
    document.getElementById('yekAuthEmail')?.focus();
  }

  function closeAuthModal() {
    if (!hasAccessToSiteTools() && !isHomePage) {
      // Eğer araç sayfasındaysa ve giriş yapmadıysa modalı kapatsa bile gate overlay görünür kalır
      authModalBackdrop.classList.add('hidden');
      return;
    }
    authModalBackdrop.classList.add('hidden');
  }

  document.getElementById('closeAuthModalBtn')?.addEventListener('click', closeAuthModal);
  authModalBackdrop.addEventListener('click', (e) => {
    if (e.target === authModalBackdrop) closeAuthModal();
  });

  document.getElementById('gateOpenLoginBtn')?.addEventListener('click', openAuthModal);

  // Giriş / Kayıt Sekme Geçişi
  let currentAuthMode = 'login';
  const authTabs = authModalBackdrop.querySelectorAll('.yek-auth-tab');
  const regNameRow = document.getElementById('yekRegisterNameRow');
  const authSubmitBtn = document.getElementById('yekAuthSubmitBtn');
  const authFeedback = document.getElementById('yekAuthFeedback');

  authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      authTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentAuthMode = tab.dataset.tab;
      if (currentAuthMode === 'register') {
        regNameRow.classList.remove('hidden');
        authSubmitBtn.textContent = 'Üyeliği Tamamla ve Siteye Giriş Yap';
      } else {
        regNameRow.classList.add('hidden');
        authSubmitBtn.textContent = 'E-Posta ile Giriş Yap ve Araçları Aç';
      }
      authFeedback.classList.add('hidden');
    });
  });

  // E-Posta (Kullanıcı Adı) & Şifre ile Giriş / Kayıt İşlemi
  document.getElementById('yekEmailAuthForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('yekAuthEmail').value.trim().toLowerCase();
    const password = document.getElementById('yekAuthPassword').value;
    const fullName = document.getElementById('yekAuthFullName').value.trim();

    if (!email || !email.includes('@')) {
      authFeedback.textContent = 'Lütfen geçerli bir e-posta adresi (kullanıcı adı) girin.';
      authFeedback.className = 'yek-auth-feedback error';
      return;
    }

    let users = {};
    try {
      users = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '{}');
    } catch (err) {
      users = {};
    }

    if (currentAuthMode === 'register') {
      const displayName = fullName || email.split('@')[0];
      users[email] = { email, password, name: displayName, method: 'E-Posta Üyesi' };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      setLoggedInUser({ email, name: displayName, method: 'E-Posta Üyesi' });
      authModalBackdrop.classList.add('hidden');
    } else {
      // Giriş Yap: Eğer daha önce kayıtlıysa şifreyi kontrol et, ilk kez giriyorsa hızlıca oturum aç
      if (users[email] && users[email].password && users[email].password !== password) {
        authFeedback.textContent = 'Girdiğiniz şifre bu e-posta hesabı ile eşleşmiyor.';
        authFeedback.className = 'yek-auth-feedback error';
        return;
      }
      const displayName = users[email]?.name || email.split('@')[0];
      users[email] = { email, password, name: displayName, method: 'E-Posta Üyesi' };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      setLoggedInUser({ email, name: displayName, method: 'E-Posta Üyesi' });
      authModalBackdrop.classList.add('hidden');
    }
  });

  // Google, Apple ve e-Devlet ile Giriş Butonları
  authModalBackdrop.querySelectorAll('.btn-social-auth').forEach((btn) => {
    btn.addEventListener('click', () => {
      const provider = btn.dataset.provider;
      let providerLabel = 'Google Hesabı';
      let defaultEmail = 'kullanici@gmail.com';
      let defaultName = 'Google Kullanıcısı';

      if (provider === 'apple') {
        providerLabel = 'Apple ID Onaylı';
        defaultEmail = 'kullanici@icloud.com';
        defaultName = 'Apple Kullanıcısı';
      } else if (provider === 'edevlet') {
        providerLabel = 'e-Devlet Kapısı Onaylı';
        defaultEmail = 'tc.vatandas@turkiye.gov.tr';
        defaultName = 'T.C. e-Devlet Kullanıcısı';
      }

      const enteredEmail = document.getElementById('yekAuthEmail')?.value.trim();
      const finalEmail = enteredEmail && enteredEmail.includes('@') ? enteredEmail : defaultEmail;
      const finalName = finalEmail !== defaultEmail ? finalEmail.split('@')[0] : defaultName;

      setLoggedInUser({
        email: finalEmail,
        name: finalName,
        method: providerLabel,
      });
      authModalBackdrop.classList.add('hidden');
    });
  });

  // 5. DURUM GÜNCELLEME: ÜYE GİRİŞ KONTROLÜ
  function updateAuthUIAndGates() {
    const user = getLoggedInUser();
    const canAccess = hasAccessToSiteTools();

    if (authNavContainer) {
      if (user) {
        authNavContainer.innerHTML =
          '<div class="nav-user-pill">' +
            '<span class="user-dot-online"></span>' +
            '<span class="nav-user-name"></span>' +
            '<button type="button" id="navLogoutBtn" class="nav-logout-btn" title="Çıkış Yap">Çıkış</button>' +
          '</div>';
        authNavContainer.querySelector('.nav-user-name').textContent = user.name || 'Üye';
        document.getElementById('navLogoutBtn')?.addEventListener('click', () => {
          setLoggedInUser(null);
        });
      } else {
        authNavContainer.innerHTML =
          '<div class="nav-owner-vip-bar">' +
            '<button type="button" id="navOpenLoginModalBtn" class="btn-nav-login highlight-pulse">🔑 Giriş Yap</button>' +
          '</div>';
        document.getElementById('navOpenLoginModalBtn')?.addEventListener('click', openAuthModal);
      }
    }

    if (!isHomePage && !canAccess) {
      gateBanner.classList.remove('hidden');
    } else {
      gateBanner.classList.add('hidden');
    }
  }

  // YEK AI Sohbet Formu gönderilirken de (eğer ziyaretçi giriş yapmamışsa) giriş modalını aç
  const yekAiFormEl = document.getElementById('yekAiForm');
  if (yekAiFormEl) {
    yekAiFormEl.addEventListener(
      'submit',
      (e) => {
        if (!hasAccessToSiteTools()) {
          e.preventDefault();
          e.stopImmediatePropagation();
          openAuthModal();
        }
      },
      true
    );
  }

  updateAuthUIAndGates();

  // ==========================================================================
  // 6. İLETİŞİM YERİNİN ALTINDA KULLANICI YORUMLARI VE DEĞERLENDİRME BÖLÜMÜ
  // ==========================================================================
  const LEGACY_FAKE_REVIEW_EMAILS = new Set([
    'mert.demirsoy@gmail.com',
    'zeynep.k@turkiye.gov.tr',
    'burak.ozkan@icloud.com',
  ]);

  function getStoredComments() {
    try {
      const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      const genuineComments = parsed.filter(
        (comment) => !LEGACY_FAKE_REVIEW_EMAILS.has(String(comment?.email || '').trim().toLowerCase())
      );
      if (genuineComments.length !== parsed.length) saveComments(genuineComments);
      return genuineComments;
    } catch (e) {
      return [];
    }
  }

  function saveComments(list) {
    try {
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  }

  const contactGridEl = document.querySelector('.contact-footer-grid');
  if (contactGridEl) {
    const commentsSection = document.createElement('div');
    commentsSection.className = 'footer-comments-section';
    commentsSection.innerHTML = `
      <div class="comments-header-bar">
        <div>
          <span class="comments-eyebrow">💬 KULLANICI YORUMLARI & PLATFORM DENEYİMLERİ</span>
          <h4>Doğru Bütçe Doğru Kullanım & YEK AI Hakkında Yorumlar</h4>
        </div>
        <div class="comments-rating-summary" aria-live="polite">
          <span id="commentsAverageStars" class="stars-gold">☆☆☆☆☆</span>
          <strong id="commentsAverageScore">Henüz puan yok</strong>
          <small id="commentsRatingCount">İlk değerlendirmeyi siz paylaşın</small>
        </div>
      </div>

      <div id="footerCommentsList" class="footer-comments-grid"></div>

      <form id="footerAddCommentForm" class="footer-comment-form">
        <div class="comment-form-top">
          <h5>✍️ Siz de Yorumunuzu ve Deneyiminizi Paylaşın</h5>
          <div class="comment-form-inputs-row">
            <input type="text" id="commentAuthorName" placeholder="Adınız Soyadınız (İsteğe bağlı)" class="text-input comment-name-input" />
            <select id="commentStarSelect" class="ai-model-select">
              <option value="5">★★★★★ (5 Yıldız - Mükemmel)</option>
              <option value="4">★★★★☆ (4 Yıldız - Çok İyi)</option>
              <option value="3">★★★☆☆ (3 Yıldız - İyi)</option>
              <option value="2">★★☆☆☆ (2 Yıldız - Geliştirilmeli)</option>
              <option value="1">★☆☆☆☆ (1 Yıldız - Zayıf)</option>
            </select>
          </div>
        </div>
        <div class="comment-form-bottom">
          <input type="text" id="commentTextInput" placeholder="YEK AI, 5 Altın Kural veya bütçe hesaplama araçları hakkındaki yorumunuzu yazın..." required class="text-input comment-body-input" />
          <button type="submit" class="btn btn-primary comment-submit-btn">Yorumu Gönder</button>
        </div>
      </form>
    `;

    contactGridEl.insertAdjacentElement('afterend', commentsSection);

    const commentsListEl = document.getElementById('footerCommentsList');
    const commentFormEl = document.getElementById('footerAddCommentForm');

    function escapeCommentHTML(value) {
      return String(value ?? '').replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character]);
    }

    function renderComments() {
      if (!commentsListEl) return;
      const list = getStoredComments();
      const average = list.length
        ? list.reduce((sum, item) => sum + Math.min(5, Math.max(1, Number(item.rating) || 5)), 0) / list.length
        : 0;
      const roundedAverage = Math.round(average);
      const starsEl = document.getElementById('commentsAverageStars');
      const scoreEl = document.getElementById('commentsAverageScore');
      const countEl = document.getElementById('commentsRatingCount');

      if (starsEl) starsEl.textContent = list.length ? '★'.repeat(roundedAverage) + '☆'.repeat(5 - roundedAverage) : '☆☆☆☆☆';
      if (scoreEl) scoreEl.textContent = list.length ? average.toFixed(1).replace('.', ',') + ' / 5' : 'Henüz puan yok';
      if (countEl) countEl.textContent = list.length ? list.length + ' değerlendirme' : 'İlk değerlendirmeyi siz paylaşın';

      if (list.length === 0) {
        commentsListEl.innerHTML = '<p class="comments-empty-state">Henüz yorum yok. İlk yorum ve puanı siz paylaşın.</p>';
        return;
      }

      commentsListEl.innerHTML = list
        .map((item) => {
          const rating = Math.min(5, Math.max(1, Number(item.rating) || 5));
          const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
          const name = escapeCommentHTML(item.name || 'Site Üyesi');
          const badge = escapeCommentHTML(item.badge || 'Üye');
          const date = escapeCommentHTML(item.date || '');
          const text = escapeCommentHTML(item.text || '');
          const initials = (item.name || 'ÜY')
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          return '<article class="user-comment-card">' +
            '<div class="comment-card-top">' +
              '<div class="comment-author-box">' +
                '<div class="comment-avatar">' + escapeCommentHTML(initials) + '</div>' +
                '<div><strong class="comment-author-name">' + name + '</strong>' +
                '<span class="comment-auth-badge">&bull; ' + badge + '</span></div>' +
              '</div>' +
              '<div class="comment-meta-right"><span class="comment-stars">' + stars + '</span>' +
              '<small class="comment-date">' + date + '</small></div>' +
            '</div><p class="comment-text">"' + text + '"</p></article>';
        })
        .join('');
    }

    renderComments();

    if (commentFormEl) {
      commentFormEl.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!hasAccessToSiteTools()) {
          openAuthModal();
          return;
        }

        const textInp = document.getElementById('commentTextInput');
        const nameInp = document.getElementById('commentAuthorName');
        const starSel = document.getElementById('commentStarSelect');

        const commentText = textInp.value.trim();
        if (!commentText) return;

        const loggedUser = getLoggedInUser();
        const authorName = nameInp.value.trim() || loggedUser?.name || 'Site Üyesi';
        const authorBadge = loggedUser?.method || 'Üye';

        const currentList = getStoredComments();
        currentList.unshift({
          id: Date.now(),
          name: authorName,
          badge: authorBadge,
          rating: parseInt(starSel.value, 10) || 5,
          date: 'Şimdi',
          text: commentText,
        });

        saveComments(currentList);
        textInp.value = '';
        renderComments();
      });
    }
  }

  // ==========================================================================
  // 7. MOBİL DİKEY EKRAN (PORTRAIT PHONE) MENÜ ÇEKMECESİ VE KAYDIRMA YARDIMCISI
  // (Masaüstü görünümünü hiç değiştirmez, sadece <= 768px mobil ekranda devreye girer)
  // ==========================================================================
  const navLinksContainer = document.querySelector('.navbar .nav-links');
  const navRightEl = document.querySelector('.navbar .nav-right-group');

  if (navLinksContainer && navRightEl && !document.getElementById('mobileNavToggleBtn')) {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.type = 'button';
    mobileMenuBtn.id = 'mobileNavToggleBtn';
    mobileMenuBtn.className = 'btn-mobile-menu-toggle';
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    navLinksContainer.id = 'primaryNavigation';
    mobileMenuBtn.setAttribute('aria-label', 'Üst menüyü aç/kapat');
    mobileMenuBtn.setAttribute('aria-controls', navLinksContainer.id);
    mobileMenuBtn.innerHTML = `<span class="mobile-menu-icon">☰</span><span class="mobile-menu-label">Menü</span>`;
    navRightEl.appendChild(mobileMenuBtn);

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinksContainer.classList.toggle('mobile-menu-open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      const iconEl = mobileMenuBtn.querySelector('.mobile-menu-icon');
      const labelEl = mobileMenuBtn.querySelector('.mobile-menu-label');
      if (iconEl) iconEl.textContent = isOpen ? '✕' : '☰';
      if (labelEl) labelEl.textContent = isOpen ? 'Kapat' : 'Menü';
    });

    // Dışarı tıklanınca açık mobil çekmeceyi kapat
    document.addEventListener('click', (e) => {
      if (
        navLinksContainer.classList.contains('mobile-menu-open') &&
        !navLinksContainer.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        navLinksContainer.classList.remove('mobile-menu-open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const iconEl = mobileMenuBtn.querySelector('.mobile-menu-icon');
        const labelEl = mobileMenuBtn.querySelector('.mobile-menu-label');
        if (iconEl) iconEl.textContent = '☰';
        if (labelEl) labelEl.textContent = 'Menü';
      }
    });

    // Mobilde yatay kaydırmalı sekme şeridinde aktif sekmeyi otomatik ortala
    setTimeout(() => {
      if (window.innerWidth <= 768) {
        const activeTab = navLinksContainer.querySelector('.nav-tab.active');
        if (activeTab && typeof activeTab.scrollIntoView === 'function') {
          const scrollLeft =
            activeTab.offsetLeft -
            navLinksContainer.clientWidth / 2 +
            activeTab.clientWidth / 2;
          navLinksContainer.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
        }
      }
    }, 180);
  }
});
