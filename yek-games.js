// YEK mini oyunları: geçici hesap ve oyun durumları bu tarayıcıdaki localStorage'da tutulur.
(function () {
  const WHEEL_STORAGE_PREFIX = 'yek_daily_wheel_v1:';
  const VALUE_GAME_STORAGE_PREFIX = 'yek_value_guess_v1:';
  const RATE_CACHE_KEY = 'yek_value_guess_rates_v1';
  const INITIAL_EURO_BUDGET = 10;
  const MAX_VALUE_ROUNDS = 250;
  const MAX_CACHED_RATE_AGE = 7 * 24 * 60 * 60 * 1000;
  const WHEEL_SEGMENTS = [
    { label: '+$50', kind: 'cash', amount: 50, color: '#0f765a' },
    { label: '+1 dk AI', kind: 'chat', amount: 60, color: '#12634f' },
    { label: '−$25', kind: 'cash', amount: -25, color: '#a63c4c' },
    { label: '+2 dk AI', kind: 'chat', amount: 120, color: '#155a75' },
    { label: '+$25', kind: 'cash', amount: 25, color: '#16805a' },
    { label: '−1 dk AI', kind: 'chat', amount: -60, color: '#a34c3c' },
    { label: '+$75', kind: 'cash', amount: 75, color: '#366b9d' },
    { label: '−$10', kind: 'cash', amount: -10, color: '#8c4a83' },
  ];

  const guestNotice = document.getElementById('gamesGuestNotice');
  const authContent = document.getElementById('gamesAuthContent');
  const gameRoute = new URLSearchParams(window.location.search).get('game');
  const gamesHub = document.getElementById('gamesHub');
  const gamesReturnLink = document.getElementById('gamesReturnLink');
  const gamesPageTitle = document.getElementById('gamesPageTitle');
  const gamesPageDescription = document.getElementById('gamesPageDescription');
  const wheelGamePanel = document.getElementById('wheelGamePanel');
  const valueGamePanel = document.getElementById('valueGamePanel');
  const wheel = document.getElementById('prizeWheel');
  const wheelCanvas = document.getElementById('prizeWheelCanvas');
  const wheelLabels = document.getElementById('prizeWheelLabels');
  const spinButton = document.getElementById('spinWheelButton');
  const wheelStatus = document.getElementById('wheelDailyStatus');
  const wheelResult = document.getElementById('wheelResult');
  const rateStatus = document.getElementById('valueRateStatus');
  const guessSetup = document.getElementById('valueGuessSetup');
  const guessSetupMessage = document.getElementById('valueGuessSetupMessage');
  const startGuessButton = document.getElementById('startValueGuessButton');
  const guessPlay = document.getElementById('valueGuessPlay');
  const guessBalance = document.getElementById('valueGuessBalance');
  const guessProgress = document.getElementById('valueGuessProgress');
  const guessCorrect = document.getElementById('valueGuessCorrect');
  const guessWrong = document.getElementById('valueGuessWrong');
  const guessLeftCard = document.getElementById('valueCountryLeft');
  const guessRightCard = document.getElementById('valueCountryRight');
  const guessComparison = document.getElementById('valueGuessComparison');
  const guessFeedback = document.getElementById('valueGuessFeedback');
  const guessEndStatus = document.getElementById('valueGuessEndStatus');
  const cashOutButton = document.getElementById('cashOutValueGuessButton');

  let currentEmail = '';
  let rateSnapshot = null;
  let rateRefreshTimer = null;
  let wheelRotationDegrees = 0;
  let spinning = false;
  let activeWheelTimeout = null;
  let valueGame = null;

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function todayKey() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function makeId() {
    return window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }

  function formatEuro(value, maximumFractionDigits = 2) {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits,
    }).format(Number(value) || 0);
  }

  function formatUsd(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }

  function applyGameRoute() {
    const selected = gameRoute === 'wheel' || gameRoute === 'value' ? gameRoute : '';
    if (gamesHub) gamesHub.classList.toggle('hidden', Boolean(selected));
    if (wheelGamePanel) wheelGamePanel.classList.toggle('hidden', selected !== 'wheel');
    if (valueGamePanel) valueGamePanel.classList.toggle('hidden', selected !== 'value');
    if (gamesReturnLink) gamesReturnLink.classList.toggle('hidden', !selected);
    if (gamesPageTitle) gamesPageTitle.textContent = selected === 'wheel' ? 'Günlük Çark' : selected === 'value' ? 'Değer Tahmin' : 'Oyunlar';
    if (gamesPageDescription) gamesPageDescription.textContent = selected
      ? 'Bu oyun ayrı bir sekmede açık. Diğer oyunları seçmek için oyun listesine dönebilirsin.'
      : 'Bir oyun seç; her oyun ayrı bir sekmede açılır.';
  }

  function getWheelStorageKey(email) {
    return WHEEL_STORAGE_PREFIX + encodeURIComponent(normalizeEmail(email));
  }

  function readWheelState(email) {
    try {
      const saved = JSON.parse(localStorage.getItem(getWheelStorageKey(email)) || 'null');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function saveWheelState(state) {
    try {
      localStorage.setItem(getWheelStorageKey(state.email), JSON.stringify(state));
      return true;
    } catch (error) {
      if (wheelResult) wheelResult.textContent = 'Tarayıcı oyun verisini kaydedemedi; depolama alanını kontrol et.';
      return false;
    }
  }

  function valueGameStorageKey(email) {
    return VALUE_GAME_STORAGE_PREFIX + encodeURIComponent(normalizeEmail(email));
  }

  function readValueGame(email) {
    try {
      const saved = JSON.parse(localStorage.getItem(valueGameStorageKey(email)) || 'null');
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return null;
      const session = saved.session;
      if (!session || !Array.isArray(session.questions) || !Number.isFinite(Number(session.balanceEur))) return null;
      return session;
    } catch (error) {
      return null;
    }
  }

  function saveValueGame(session) {
    try {
      localStorage.setItem(valueGameStorageKey(session.email), JSON.stringify({ session }));
      return true;
    } catch (error) {
      if (guessFeedback) guessFeedback.textContent = 'Tarayıcı oyun verisini kaydedemedi; depolama alanını kontrol et.';
      return false;
    }
  }

  function drawWheel() {
    if (!wheelCanvas || !wheelLabels) return;
    const context = wheelCanvas.getContext('2d');
    if (!context) return;
    const size = wheelCanvas.width;
    const center = size / 2;
    const radius = center - 5;
    const slice = (Math.PI * 2) / WHEEL_SEGMENTS.length;
    context.clearRect(0, 0, size, size);
    WHEEL_SEGMENTS.forEach((segment, index) => {
      const start = -Math.PI / 2 + index * slice;
      const end = start + slice;
      context.beginPath();
      context.moveTo(center, center);
      context.arc(center, center, radius, start, end);
      context.closePath();
      context.fillStyle = segment.color;
      context.fill();
      context.strokeStyle = 'rgba(255,255,255,.62)';
      context.lineWidth = 3;
      context.stroke();
    });
    wheelLabels.replaceChildren();
    WHEEL_SEGMENTS.forEach((segment, index) => {
      const angle = ((index + 0.5) / WHEEL_SEGMENTS.length) * Math.PI * 2;
      const label = document.createElement('span');
      label.className = 'prize-wheel-label';
      label.textContent = segment.label;
      label.style.left = `${50 + Math.sin(angle) * 34}%`;
      label.style.top = `${50 - Math.cos(angle) * 34}%`;
      wheelLabels.appendChild(label);
    });
  }

  function formatWheelOutcome(segment, appliedDelta) {
    if (segment.kind === 'cash') {
      if (appliedDelta === 0 && segment.amount < 0) return 'Borsa nakdin sıfır olduğu için eksi bakiye uygulanmadı.';
      const sign = appliedDelta >= 0 ? '+' : '−';
      return `Borsa sanal nakdi ${sign}${formatUsd(Math.abs(appliedDelta))} değişti.`;
    }
    if (appliedDelta === 0 && segment.amount < 0) return 'Bankalı günlük sohbet dakikan olmadığı için eksi dakika uygulanmadı.';
    const sign = appliedDelta >= 0 ? '+' : '−';
    const minutes = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(Math.abs(appliedDelta) / 60);
    return `Bankalı YEK AI günlük sohbet hakkı ${sign}${minutes} dakika değişti.`;
  }

  function applyWheelOutcome(state) {
    if (!state || !state.pending || state.applied) return;
    const segment = WHEEL_SEGMENTS[state.segmentIndex];
    if (!segment) return;
    let appliedDelta = 0;
    if (segment.kind === 'cash') {
      const result = window.YEKStockGame?.adjustCash(
        state.email,
        segment.amount,
        'Günlük çark',
        `wheel-${state.day}-${state.email}`
      );
      if (!result?.success) {
        if (wheelResult) wheelResult.textContent = 'Borsa sanal cüzdanına ulaşılamadı. Sonuç saklandı; sayfayı yenileyince yeniden uygulanacak.';
        return;
      }
      appliedDelta = result.appliedDelta;
    } else {
      const result = window.YEKRewards?.adjustDailySeconds(
        state.email,
        segment.amount,
        `wheel-${state.day}-${state.email}`
      );
      if (!result?.success) {
        if (wheelResult) wheelResult.textContent = 'YEK AI günlük hakkına ulaşılamadı. Sonuç saklandı; sayfayı yenileyince yeniden uygulanacak.';
        return;
      }
      appliedDelta = result.appliedDelta;
    }

    state.applied = true;
    state.appliedDelta = appliedDelta;
    state.appliedAt = Date.now();
    saveWheelState(state);
    if (wheelResult) wheelResult.textContent = `Çark sonucu: ${segment.label}. ${formatWheelOutcome(segment, appliedDelta)}`;
    renderWheelStatus(state);
  }

  function renderWheelStatus(existingState) {
    if (!currentEmail) return;
    const state = existingState || readWheelState(currentEmail);
    const alreadyUsed = state?.day === todayKey();
    const isPending = alreadyUsed && state?.pending && !state?.applied;
    if (wheelStatus) {
      wheelStatus.textContent = isPending ? 'Sonuç uygulanıyor…' : alreadyUsed ? 'Bugünkü hak kullanıldı' : 'Bugün kullanıma hazır';
      wheelStatus.classList.toggle('ready', !alreadyUsed);
    }
    if (spinButton) {
      spinButton.disabled = alreadyUsed || spinning;
      spinButton.textContent = alreadyUsed ? 'Yarın tekrar çevir' : spinning ? 'Çark dönüyor…' : 'Günlük çarkı çevir';
    }
    if (!spinning && state?.pending && !state.applied && state.day === todayKey()) applyWheelOutcome(state);
    else if (state?.day === todayKey() && state.applied && wheelResult && !wheelResult.textContent) {
      const segment = WHEEL_SEGMENTS[state.segmentIndex];
      if (segment) wheelResult.textContent = `Bugünkü sonuç: ${segment.label}. ${formatWheelOutcome(segment, Number(state.appliedDelta) || 0)}`;
    }
  }

  function onWheelSpin() {
    if (!currentEmail || spinning) return;
    const previousState = readWheelState(currentEmail);
    if (previousState?.day === todayKey()) {
      renderWheelStatus(previousState);
      return;
    }

    const segmentIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const state = {
      email: currentEmail,
      day: todayKey(),
      segmentIndex,
      pending: true,
      applied: false,
      createdAt: Date.now(),
    };
    if (!saveWheelState(state)) return;
    spinning = true;
    if (spinButton) spinButton.disabled = true;
    if (wheelResult) wheelResult.textContent = 'Çark dönüyor…';

    const targetMod = (360 - ((segmentIndex + 0.5) * 360) / WHEEL_SEGMENTS.length) % 360;
    const currentMod = ((wheelRotationDegrees % 360) + 360) % 360;
    const distance = (targetMod - currentMod + 360) % 360;
    wheelRotationDegrees += 5 * 360 + distance;
    if (wheel) wheel.style.transform = `rotate(${wheelRotationDegrees}deg)`;

    const finishSpin = () => {
      if (!spinning) return;
      spinning = false;
      if (activeWheelTimeout) window.clearTimeout(activeWheelTimeout);
      activeWheelTimeout = null;
      applyWheelOutcome(state);
      renderWheelStatus(state);
    };
    wheel?.addEventListener('transitionend', finishSpin, { once: true });
    activeWheelTimeout = window.setTimeout(finishSpin, 5200);
    renderWheelStatus(state);
  }

  function readCachedRates() {
    try {
      const cached = JSON.parse(localStorage.getItem(RATE_CACHE_KEY) || 'null');
      if (!cached || !cached.rates || !(Number(cached.rates.USD) > 0) || !(Number(cached.rates.EUR) > 0)) return null;
      const updatedAt = Date.parse(cached.time_last_update_utc || '');
      if (!Number.isFinite(updatedAt) || Date.now() - updatedAt > MAX_CACHED_RATE_AGE) return null;
      return cached;
    } catch (error) {
      return null;
    }
  }

  async function loadRates() {
    if (rateStatus) rateStatus.textContent = 'Kur verisi alınıyor…';
    if (guessSetupMessage) guessSetupMessage.textContent = 'Güncel kur anlık görüntüsü alınıyor…';
    const cachedAtStart = readCachedRates();
    const cachedNextAt = Date.parse(cachedAtStart?.time_next_update_utc || '');
    if (cachedAtStart && Number.isFinite(cachedNextAt) && Date.now() < cachedNextAt) {
      rateSnapshot = { ...cachedAtStart, fromCache: true, stale: false };
      renderRateStatus();
      renderGuessSetup();
      if (currentEmail) {
        valueGame = readValueGame(currentEmail);
        if (valueGame?.status === 'pending-entry') processPendingEntry();
        else if (valueGame?.status === 'cashing-out') cashOutValueGame();
        renderValueGame();
      }
      return;
    }
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 9000);
      let response;
      try {
        response = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
      } finally {
        window.clearTimeout(timeout);
      }
      if (!response.ok) throw new Error(`Kur servisi ${response.status} yanıtı verdi.`);
      const data = await response.json();
      const updatedAt = Date.parse(data?.time_last_update_utc || '');
      if (data?.result !== 'success' || data?.base_code !== 'USD' || !data?.rates || !Number.isFinite(updatedAt) || !(Number(data.rates.EUR) > 0)) {
        throw new Error('Kur yanıtı geçerli değil.');
      }
      rateSnapshot = { ...data, fromCache: false, stale: false };
      try {
        localStorage.setItem(RATE_CACHE_KEY, JSON.stringify(data));
      } catch (error) {
        // Önbellek kullanılamasa da bu oturumdaki kur verisiyle oyun devam edebilir.
      }
    } catch (error) {
      const cached = readCachedRates();
      if (cached) rateSnapshot = { ...cached, fromCache: true, stale: true };
      else {
        rateSnapshot = null;
        if (rateStatus) rateStatus.textContent = 'Kur servisine ulaşılamadı';
        if (guessSetupMessage) guessSetupMessage.textContent = 'Ülke karşılaştırmalarını açmak için bağlantı kurup tekrar dene. Kur olmadan değer uydurulmaz.';
      }
    }
    renderRateStatus();
    renderGuessSetup();
    if (currentEmail) {
      valueGame = readValueGame(currentEmail);
      if (valueGame?.status === 'pending-entry') processPendingEntry();
      else if (valueGame?.status === 'cashing-out') cashOutValueGame();
      renderValueGame();
    }
  }

  function renderRateStatus() {
    if (!rateStatus || !rateSnapshot) return;
    const date = new Date(rateSnapshot.time_last_update_utc);
    const dateLabel = Number.isFinite(date.getTime())
      ? new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }).format(date)
      : 'tarih bilgisi yok';
    const nextAt = Date.parse(rateSnapshot.time_next_update_utc || '');
    const isStale = Boolean(rateSnapshot.stale) || (rateSnapshot.fromCache && Number.isFinite(nextAt) && Date.now() >= nextAt);
    rateStatus.textContent = `${rateSnapshot.fromCache ? 'Önbellek' : 'Kur anlık görüntüsü'} · ${dateLabel}${isStale ? ' · yenileme bekliyor' : ''}`;
    rateStatus.classList.toggle('stale', isStale);
    if (rateRefreshTimer) window.clearTimeout(rateRefreshTimer);
    if (Number.isFinite(nextAt) && nextAt > Date.now()) {
      rateRefreshTimer = window.setTimeout(loadRates, Math.min(nextAt - Date.now() + 1000, 2147483000));
    }
  }

  function getEligibleCurrencies(snapshot = rateSnapshot) {
    const countries = window.GLOBAL_ECONOMIES_120?.ALL_120_COUNTRIES;
    const rates = snapshot?.rates;
    if (!Array.isArray(countries) || !rates) return [];
    return countries.flatMap((country) => {
      const code = String(country.currency || '').match(/^([A-Z]{3})\b/)?.[1];
      const unitsPerUsd = Number(code && rates[code]);
      const euroPerUsd = Number(rates.EUR);
      if (!code || !Number.isFinite(unitsPerUsd) || unitsPerUsd <= 0 || !Number.isFinite(euroPerUsd) || euroPerUsd <= 0) return [];
      return [{
        name: country.name,
        flag: country.flag || '🌍',
        currency: country.currency,
        code,
        euroValue: euroPerUsd / unitsPerUsd,
      }];
    });
  }

  function makeQuestionSet(snapshot) {
    const currencies = getEligibleCurrencies(snapshot);
    if (currencies.length < 2) return null;
    const questions = [];
    for (let index = 0; index < MAX_VALUE_ROUNDS; index += 1) {
      const left = currencies[Math.floor(Math.random() * currencies.length)];
      let right = currencies[Math.floor(Math.random() * currencies.length)];
      for (let attempt = 0; attempt < 10 && right.code === left.code; attempt += 1) {
        right = currencies[Math.floor(Math.random() * currencies.length)];
      }
      if (right.code === left.code) right = currencies.find((currency) => currency.code !== left.code);
      if (!right) return null;
      questions.push({ left, right });
    }
    return questions;
  }

  function processPendingEntry() {
    if (!valueGame || valueGame.status !== 'pending-entry') return;
    const result = window.YEKStockGame?.adjustCash(
      valueGame.email,
      -valueGame.entryCostUsd,
      'Değer Tahmin · oyun girişi',
      `value-entry-${valueGame.id}`
    );
    if (!result?.success) {
      valueGame.status = 'entry-failed';
      valueGame.endMessage = 'Borsa sanal cüzdanından giriş tutarı alınamadı.';
    } else if (result.duplicate || Math.abs(result.appliedDelta + valueGame.entryCostUsd) <= 0.011) {
      valueGame.status = 'active';
    } else {
      valueGame.status = 'entry-failed';
      valueGame.endMessage = 'Sanal nakit giriş tutarı için yeterli değildi.';
    }
    saveValueGame(valueGame);
    renderGuessSetup();
    renderValueGame();
  }

  function startValueGame() {
    if (!currentEmail || !rateSnapshot || !window.YEKStockGame) return;
    if (valueGame && ['active', 'pending-entry', 'cashing-out'].includes(valueGame.status)) {
      renderValueGame();
      return;
    }
    const questions = makeQuestionSet(rateSnapshot);
    if (!questions) {
      if (guessSetupMessage) guessSetupMessage.textContent = 'Bu kur anlık görüntüsünden oyun turu üretilemedi.';
      return;
    }
    const entryCostUsd = Math.round((INITIAL_EURO_BUDGET / Number(rateSnapshot.rates.EUR)) * 100) / 100;
    const availableCash = window.YEKStockGame.getCash(currentEmail);
    if (availableCash + 0.001 < entryCostUsd) {
      if (guessSetupMessage) guessSetupMessage.textContent = `Giriş için ${formatUsd(entryCostUsd)} Borsa sanal nakdi gerekiyor; şu an ${formatUsd(availableCash)} var.`;
      return;
    }

    valueGame = {
      id: makeId(),
      email: currentEmail,
      status: 'pending-entry',
      startedAt: Date.now(),
      sourceUpdatedAt: rateSnapshot.time_last_update_utc,
      usdPerEuro: 1 / Number(rateSnapshot.rates.EUR),
      entryCostUsd,
      balanceEur: INITIAL_EURO_BUDGET,
      currentRound: 0,
      correct: 0,
      wrong: 0,
      questions,
    };
    if (!saveValueGame(valueGame)) return;
    processPendingEntry();
  }

  function createCountryCard(container, country, sideLabel) {
    if (!container) return;
    container.replaceChildren();
    const flag = document.createElement('span');
    flag.className = 'value-country-flag';
    flag.setAttribute('aria-hidden', 'true');
    flag.textContent = country.flag;
    const countryName = document.createElement('strong');
    countryName.className = 'value-country-name';
    countryName.textContent = country.name;
    const currencyName = document.createElement('span');
    currencyName.className = 'value-country-currency';
    currencyName.textContent = `${country.code} · ${country.currency}`;
    const side = document.createElement('span');
    side.className = 'value-country-side';
    side.textContent = sideLabel;
    container.append(flag, countryName, currencyName, side);
  }

  function renderGuessComparison() {
    if (!guessComparison) return;
    const answer = valueGame?.lastAnswer;
    guessComparison.replaceChildren();
    if (!answer) {
      guessComparison.classList.add('hidden');
      return;
    }

    const title = document.createElement('strong');
    title.className = 'value-comparison-title';
    title.textContent = 'Son karşılaştırma · 1 birim başına';
    const values = document.createElement('div');
    values.className = 'value-comparison-countries';

    [
      { flag: answer.leftFlag, name: answer.leftName, code: answer.leftCode, value: answer.leftValue },
      { flag: answer.rightFlag, name: answer.rightName, code: answer.rightCode, value: answer.rightValue },
    ].forEach((country) => {
      const item = document.createElement('div');
      item.className = 'value-comparison-country';
      const identity = document.createElement('span');
      identity.className = 'value-comparison-identity';
      const flag = document.createElement('span');
      flag.className = 'value-comparison-flag';
      flag.setAttribute('aria-hidden', 'true');
      flag.textContent = country.flag || '🌍';
      const name = document.createElement('span');
      name.textContent = `${country.name || 'Ülke'} · ${country.code || '—'}`;
      identity.append(flag, name);
      const amount = document.createElement('strong');
      amount.textContent = `${formatEuro(country.value, 8)} / birim`;
      item.append(identity, amount);
      values.appendChild(item);
    });

    const result = document.createElement('p');
    result.className = `value-comparison-result ${answer.correct ? 'correct' : 'incorrect'}`;
    const higherName = answer.leftValue > answer.rightValue ? answer.leftName : answer.rightName;
    result.textContent = `${answer.correct ? 'Doğru · +€2' : 'Yanlış · −€1'} · Daha değerli para birimi: ${higherName}.`;
    guessComparison.append(title, values, result);
    guessComparison.classList.remove('hidden');
  }

  function finishAtZero() {
    if (!valueGame) return;
    valueGame.balanceEur = 0;
    valueGame.status = 'lost';
    valueGame.endMessage = 'Bakiye €0 oldu; bu oturum sona erdi ve aktarılacak tutar kalmadı.';
    saveValueGame(valueGame);
  }

  function answerValueGame(side) {
    if (!valueGame || valueGame.status !== 'active') return;
    const question = valueGame.questions[valueGame.currentRound];
    if (!question || (side !== 'left' && side !== 'right')) return;
    const picked = question[side];
    const other = question[side === 'left' ? 'right' : 'left'];
    const correct = picked.euroValue > other.euroValue;
    if (correct) valueGame.correct += 1;
    else valueGame.wrong += 1;
    valueGame.balanceEur = Math.max(0, Math.round((valueGame.balanceEur + (correct ? 2 : -1)) * 100) / 100);
    valueGame.lastAnswer = {
      pickedName: picked.name,
      leftFlag: question.left.flag,
      leftName: question.left.name,
      leftCode: question.left.code,
      rightFlag: question.right.flag,
      rightName: question.right.name,
      rightCode: question.right.code,
      correct,
      leftValue: question.left.euroValue,
      rightValue: question.right.euroValue,
    };
    valueGame.currentRound += 1;
    if (valueGame.balanceEur <= 0) finishAtZero();
    else if (valueGame.currentRound >= MAX_VALUE_ROUNDS) {
      valueGame.status = 'complete';
      valueGame.endMessage = `250 tur tamamlandı. ${formatEuro(valueGame.balanceEur)} bakiyeni Borsa sanal cüzdanına aktarabilirsin.`;
      saveValueGame(valueGame);
    } else {
      saveValueGame(valueGame);
    }
    renderValueGame();
  }

  function cashOutValueGame() {
    if (!valueGame || !['active', 'complete', 'cashing-out'].includes(valueGame.status) || valueGame.balanceEur <= 0) return;
    const payoutUsd = Math.round(valueGame.balanceEur * valueGame.usdPerEuro * 100) / 100;
    valueGame.status = 'cashing-out';
    saveValueGame(valueGame);
    const result = window.YEKStockGame?.adjustCash(
      valueGame.email,
      payoutUsd,
      `Değer Tahmin · ${formatEuro(valueGame.balanceEur)} aktarımı`,
      `value-payout-${valueGame.id}`
    );
    if (!result?.success) {
      if (guessFeedback) guessFeedback.textContent = 'Borsa sanal cüzdanına erişilemiyor. Bakiyen kaydedildi; tekrar deneyebilirsin.';
      return;
    }
    valueGame.status = 'cashed-out';
    valueGame.payoutUsd = payoutUsd;
    valueGame.cashedOutAt = Date.now();
    valueGame.endMessage = `${formatEuro(valueGame.balanceEur)} bakiye ${formatUsd(payoutUsd)} olarak Borsa sanal cüzdanına aktarıldı.`;
    saveValueGame(valueGame);
    renderValueGame();
  }

  function renderGuessSetup() {
    if (!guessSetup || !currentEmail) return;
    const active = Boolean(valueGame && ['active', 'pending-entry', 'cashing-out', 'complete'].includes(valueGame.status));
    guessSetup.classList.toggle('hidden', active);
    if (guessSetupMessage && valueGame && ['lost', 'complete', 'cashed-out', 'entry-failed'].includes(valueGame.status)) {
      guessSetupMessage.textContent = valueGame.endMessage || 'Önceki oyun oturumu sona erdi. Yeni oturumu başlatabilirsin.';
    } else if (guessSetupMessage && rateSnapshot) {
      const eligible = getEligibleCurrencies();
      const usdCost = Math.round((INITIAL_EURO_BUDGET / Number(rateSnapshot.rates.EUR)) * 100) / 100;
      const cash = window.YEKStockGame?.getCash(currentEmail) || 0;
      const date = new Date(rateSnapshot.time_last_update_utc);
      const sourceLabel = Number.isFinite(date.getTime())
        ? new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', timeZone: 'Europe/Istanbul' }).format(date)
        : 'son kur';
      guessSetupMessage.textContent = `${rateSnapshot.fromCache ? 'Önbellekteki' : 'Kaynakta bildirilen'} ${sourceLabel} kuru · ${eligible.length} ülke kullanılabilir · Borsa nakdi ${formatUsd(cash)} · €10 giriş yaklaşık ${formatUsd(usdCost)}.`;
      if (rateSnapshot.stale) guessSetupMessage.textContent += ' Yeni kur alınamadığı için kayıtlı anlık görüntü kullanılıyor.';
      if (cash + 0.001 < usdCost) guessSetupMessage.textContent += ' Giriş için daha fazla sanal nakit gerekiyor.';
    }
    if (startGuessButton) {
      const insufficient = rateSnapshot && currentEmail && window.YEKStockGame
        ? window.YEKStockGame.getCash(currentEmail) + 0.001 < Math.round((INITIAL_EURO_BUDGET / Number(rateSnapshot.rates.EUR)) * 100) / 100
        : true;
      startGuessButton.disabled = !rateSnapshot || insufficient || active;
    }
  }

  function renderValueGame() {
    if (!guessPlay || !valueGame || valueGame.email !== currentEmail) {
      if (guessPlay) guessPlay.classList.add('hidden');
      renderGuessSetup();
      return;
    }
    const active = ['active', 'pending-entry', 'cashing-out', 'complete'].includes(valueGame.status);
    guessPlay.classList.toggle('hidden', !active);
    renderGuessSetup();
    if (!active) return;

    if (guessBalance) guessBalance.textContent = formatEuro(valueGame.balanceEur);
    if (guessProgress) guessProgress.textContent = `${Math.min(valueGame.currentRound + 1, MAX_VALUE_ROUNDS)} / ${MAX_VALUE_ROUNDS}`;
    if (guessCorrect) guessCorrect.textContent = String(valueGame.correct);
    if (guessWrong) guessWrong.textContent = String(valueGame.wrong);
    renderGuessComparison();
    const question = valueGame.questions[valueGame.currentRound];
    if (question) {
      createCountryCard(guessLeftCard, question.left, 'SOL ÜLKE');
      createCountryCard(guessRightCard, question.right, 'SAĞ ÜLKE');
    } else {
      guessLeftCard?.replaceChildren();
      guessRightCard?.replaceChildren();
    }
    const buttons = guessPlay.querySelectorAll('[data-value-choice]');
    buttons.forEach((button) => { button.disabled = valueGame.status !== 'active' || !question; });
    if (guessFeedback && valueGame.lastAnswer) {
      const answer = valueGame.lastAnswer;
      const left = answer.leftName || question?.left.name || 'Sol ülke';
      const right = answer.rightName || question?.right.name || 'Sağ ülke';
      const higherName = answer.leftValue > answer.rightValue ? left : right;
      const higherValue = Math.max(answer.leftValue, answer.rightValue);
      guessFeedback.textContent = `${answer.correct ? 'Doğru tahmin, +€2.' : 'Yanlış tahmin, −€1.'} Daha değerli para birimi ${higherName} (${formatEuro(higherValue, 8)} / birim).`;
    } else if (guessFeedback) {
      guessFeedback.textContent = 'Para biriminin ülke başına bir birim değerini tahmin et.';
    }
    if (guessEndStatus) {
      guessEndStatus.textContent = valueGame.status === 'pending-entry' ? 'Giriş tutarı işleniyor…'
        : valueGame.status === 'cashing-out' ? 'Bakiye aktarılıyor…'
          : valueGame.status === 'complete' ? '250 tur tamamlandı.' : '';
    }
    if (cashOutButton) {
      cashOutButton.disabled = valueGame.status === 'pending-entry' || valueGame.status === 'cashing-out' || valueGame.balanceEur <= 0;
      cashOutButton.textContent = valueGame.status === 'complete' ? 'Bakiye ödülünü al' : 'Oyunu bitir ve bakiyeyi al';
    }
  }

  function updateAccountState() {
    currentEmail = normalizeEmail(window.YEKRewards?.getCurrentEmail());
    if (guestNotice) guestNotice.classList.toggle('hidden', Boolean(currentEmail));
    if (authContent) authContent.classList.toggle('hidden', !currentEmail);
    if (!currentEmail) {
      valueGame = null;
      if (guessPlay) guessPlay.classList.add('hidden');
      return;
    }
    if (gameRoute === 'wheel') renderWheelStatus();
    if (gameRoute === 'value') {
      valueGame = readValueGame(currentEmail);
      renderGuessSetup();
      if (valueGame?.status === 'pending-entry') processPendingEntry();
      if (valueGame?.status === 'cashing-out') cashOutValueGame();
      renderValueGame();
    }
  }

  drawWheel();
  spinButton?.addEventListener('click', onWheelSpin);
  startGuessButton?.addEventListener('click', startValueGame);
  cashOutButton?.addEventListener('click', cashOutValueGame);
  document.querySelectorAll('[data-value-choice]').forEach((button) => {
    button.addEventListener('click', () => answerValueGame(button.dataset.valueChoice));
  });
  window.addEventListener('yek-auth-state-changed', updateAccountState);
  window.addEventListener('yek-game-state-updated', (event) => {
    if (gameRoute === 'value' && normalizeEmail(event.detail?.email) === currentEmail) renderGuessSetup();
  });

  applyGameRoute();
  updateAccountState();
  if (gameRoute === 'value') loadRates();
})();
