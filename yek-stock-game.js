// Sanal borsa prototipi. Bakiye ve fiyatlar bu tarayıcıda, e-posta etiketine göre saklanır.
(function () {
  const STORAGE_PREFIX = 'yek_virtual_stock_game_v1:';
  const DAY_MS = 24 * 60 * 60 * 1000;
  const MARKET_TICK_MS = 60 * 1000;
  const DAILY_BUDGET = 300;
  const STOCKS = [
    { symbol: 'NOVA', name: 'Nova Enerji', sector: 'Temiz enerji', startPrice: 12.5, icon: '☀️' },
    { symbol: 'MINT', name: 'Mint Gıda', sector: 'Gıda teknolojisi', startPrice: 8.75, icon: '🌱' },
    { symbol: 'ROTA', name: 'Rota Lojistik', sector: 'Ulaşım ve lojistik', startPrice: 16.2, icon: '🚚' },
    { symbol: 'NEON', name: 'Neon Medya', sector: 'Dijital medya', startPrice: 21.4, icon: '💡' },
    { symbol: 'KIVR', name: 'Kıvılcım Teknoloji', sector: 'Teknoloji', startPrice: 28.6, icon: '⚡' },
    { symbol: 'MAVI', name: 'Mavi Bulut', sector: 'Yazılım', startPrice: 34.8, icon: '☁️' },
    { symbol: 'LUMA', name: 'Luma Sağlık', sector: 'Sağlık teknolojisi', startPrice: 18.35, icon: '🩺' },
    { symbol: 'PICO', name: 'Pico Robotik', sector: 'Robotik', startPrice: 45.2, icon: '🤖' },
    { symbol: 'VERA', name: 'Vera Tarım', sector: 'Tarım', startPrice: 6.85, icon: '🌾' },
    { symbol: 'ZENA', name: 'Zena Moda', sector: 'Giyim ve tasarım', startPrice: 15.7, icon: '🧵' },
    { symbol: 'ORBI', name: 'Orbi Ulaşım', sector: 'Elektrikli ulaşım', startPrice: 23.9, icon: '🚲' },
    { symbol: 'TERA', name: 'Tera Maden', sector: 'Geri dönüşüm', startPrice: 31.6, icon: '♻️' },
    { symbol: 'PULA', name: 'Pula Ödeme', sector: 'Finansal teknoloji', startPrice: 11.8, icon: '💳' },
    { symbol: 'SERA', name: 'Sera Yapı', sector: 'Sürdürülebilir yapı', startPrice: 14.35, icon: '🏗️' },
    { symbol: 'FARO', name: 'Faro Sigorta', sector: 'Sigorta', startPrice: 26.5, icon: '🛡️' },
    { symbol: 'ARGO', name: 'Argo Denizcilik', sector: 'Deniz taşımacılığı', startPrice: 39.4, icon: '🚢' },
    { symbol: 'YUMU', name: 'Yumuşak Bulut', sector: 'Bulut bilişim', startPrice: 20.25, icon: '🌥️' },
    { symbol: 'BORA', name: 'Bora İçecek', sector: 'Gıda ve içecek', startPrice: 9.6, icon: '🥤' },
    { symbol: 'DEPO', name: 'DepoX', sector: 'Depolama', startPrice: 24.1, icon: '📦' },
    { symbol: 'LOKA', name: 'Loka Eğlence', sector: 'Eğlence', startPrice: 13.3, icon: '🎭' },
    { symbol: 'VIVA', name: 'Viva Giyim', sector: 'Tekstil', startPrice: 17.95, icon: '👕' },
    { symbol: 'ODAK', name: 'Odak Veri', sector: 'Veri hizmetleri', startPrice: 32.5, icon: '📡' },
    { symbol: 'EKOA', name: 'Ekoa Güneş', sector: 'Güneş enerjisi', startPrice: 7.4, icon: '🌞' },
    { symbol: 'KENT', name: 'KentAkıllı', sector: 'Akıllı şehirler', startPrice: 28.75, icon: '🏙️' },
    { symbol: 'MIRA', name: 'Mira Uzay', sector: 'Uzay teknolojisi', startPrice: 52.1, icon: '🛰️' },
  ];
  const REWARDS = [
    { id: 'portfolio-10000', threshold: 5000, label: '$5.000', duration: 48 * 60 * 60 * 1000, reward: '48 saat sınırsız sohbet' },
    { id: 'portfolio-100000', threshold: 50000, label: '$50.000', duration: 10 * DAY_MS, reward: '10 gün sınırsız sohbet' },
    { id: 'portfolio-1000000', threshold: 500000, label: '$500.000', duration: 365 * DAY_MS, reward: '1 yıl sınırsız sohbet' },
    { id: 'portfolio-10000000', threshold: 5000000, label: '$5.000.000', reward: 'ömür boyu sınırsız sohbet', lifetime: true },
  ];

  const app = document.getElementById('stockGameApp');
  const guestNotice = document.getElementById('stockGameGuestNotice');
  const gameFeedback = document.getElementById('stockGameFeedback');
  const marketGrid = document.getElementById('stockMarketGrid');
  const holdingsGrid = document.getElementById('stockHoldingsGrid');
  let currentEmail = '';
  let gameState = null;
  let marketTimer = null;

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function todayKey() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Istanbul',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function keyFor(email) {
    return STORAGE_PREFIX + encodeURIComponent(normalizeEmail(email));
  }

  function readGameState(email) {
    try {
      const saved = JSON.parse(localStorage.getItem(keyFor(email)) || 'null');
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return null;
      return saved;
    } catch (error) {
      return null;
    }
  }

  function saveGameState(state) {
    try {
      localStorage.setItem(keyFor(state.email), JSON.stringify(state));
    } catch (error) {
      showFeedback('Bu tarayıcı oyun verilerini saklayamadı. Depolama alanını kontrol et.', 'error');
    }
    window.dispatchEvent(new CustomEvent('yek-game-state-updated', { detail: { email: state.email } }));
  }

  function createGameState(email) {
    const prices = {};
    const holdings = {};
    const changes = {};
    const costBasis = {};
    STOCKS.forEach((stock) => {
      prices[stock.symbol] = stock.startPrice;
      holdings[stock.symbol] = 0;
      changes[stock.symbol] = 0;
      costBasis[stock.symbol] = 0;
    });
    return {
      version: 1,
      email,
      cash: 0,
      prices,
      holdings,
      changes,
      costBasis,
      lastDailyGiftDay: '',
      lastMarketRoundAt: 0,
      transactions: [],
    };
  }

  function ensureGameState(email) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return null;
    const saved = readGameState(normalizedEmail);
    const state = saved || createGameState(normalizedEmail);
    const defaults = createGameState(normalizedEmail);
    state.version = 1;
    state.email = normalizedEmail;
    state.cash = Math.max(0, Number(state.cash) || 0);
    state.prices = { ...defaults.prices, ...(state.prices || {}) };
    state.holdings = { ...defaults.holdings, ...(state.holdings || {}) };
    state.changes = { ...defaults.changes, ...(state.changes || {}) };
    const hasSavedCostBasis = Boolean(saved?.costBasis && typeof saved.costBasis === 'object' && !Array.isArray(saved.costBasis));
    state.costBasis = { ...defaults.costBasis, ...(state.costBasis || {}) };
    state.transactions = Array.isArray(state.transactions) ? state.transactions.slice(0, 12) : [];

    let changed = !saved;
    STOCKS.forEach((stock) => {
      const shares = Math.max(0, Number(state.holdings[stock.symbol]) || 0);
      const basis = Number(state.costBasis[stock.symbol]);
      const hasSymbolCostBasis = hasSavedCostBasis && Object.prototype.hasOwnProperty.call(saved.costBasis, stock.symbol);
      if (!hasSymbolCostBasis || !Number.isFinite(basis) || basis < 0 || (basis === 0 && shares > 0)) {
        state.costBasis[stock.symbol] = shares * (Number(state.prices[stock.symbol]) || stock.startPrice);
        changed = true;
      } else {
        state.costBasis[stock.symbol] = basis;
      }
    });
    const today = todayKey();
    if (state.lastDailyGiftDay !== today) {
      state.cash += DAILY_BUDGET;
      state.lastDailyGiftDay = today;
      state.transactions.unshift({ text: `Günlük sanal bütçe +${formatMoney(DAILY_BUDGET)}`, at: Date.now(), kind: 'gift' });
      state.transactions = state.transactions.slice(0, 12);
      changed = true;
      window.setTimeout(() => showFeedback(`Bugünün ${formatMoney(DAILY_BUDGET)} sanal bütçesi eklendi.`, 'success'), 0);
    }

    if (changed) saveGameState(state);
    return state;
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number(value) || 0);
  }

  function formatSharePrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value) || 0);
  }

  function getHoldingValue(state, symbol) {
    return (Number(state.holdings[symbol]) || 0) * (Number(state.prices[symbol]) || 0);
  }

  function getPortfolioValue(state) {
    return state.cash + STOCKS.reduce((total, stock) => total + getHoldingValue(state, stock.symbol), 0);
  }

  function getSharesValue(state) {
    return STOCKS.reduce((total, stock) => total + getHoldingValue(state, stock.symbol), 0);
  }

  function showFeedback(message, type = 'success') {
    if (!gameFeedback) return;
    gameFeedback.textContent = message;
    gameFeedback.className = `stock-game-feedback ${type}`;
  }

  function checkRewardsFor(state) {
    if (!state || !window.YEKRewards) return;
    const portfolioValue = getPortfolioValue(state);
    const newlyEarned = [];
    REWARDS.forEach((reward) => {
      if (portfolioValue >= reward.threshold && window.YEKRewards.grantMilestone(state.email, reward.id, reward.duration || 0, Boolean(reward.lifetime))) {
        newlyEarned.push(`${reward.label}: ${reward.reward}`);
      }
    });
    if (newlyEarned.length && gameState?.email === state.email) {
      showFeedback(`Tebrikler! Ödül açıldı: ${newlyEarned.join(' · ')}`, 'reward');
    }
  }

  function checkRewards() {
    checkRewardsFor(gameState);
  }

  function getCash(email) {
    const state = ensureGameState(email || currentEmail);
    return state ? state.cash : 0;
  }

  function adjustCash(email, delta, reason, operationId) {
    const state = ensureGameState(email || currentEmail);
    const amount = Math.round((Number(delta) || 0) * 100) / 100;
    if (!state || !Number.isFinite(amount) || amount === 0) {
      return { success: Boolean(state), appliedDelta: 0, cash: state?.cash || 0 };
    }

    state.processedGameOperations = Array.isArray(state.processedGameOperations)
      ? state.processedGameOperations.filter((id) => typeof id === 'string').slice(-499)
      : [];
    const operation = String(operationId || '');
    if (operation && state.processedGameOperations.includes(operation)) {
      return { success: true, duplicate: true, appliedDelta: 0, cash: state.cash };
    }

    const before = state.cash;
    const appliedDelta = amount < 0 ? -Math.min(before, Math.abs(amount)) : amount;
    state.cash = Math.round((before + appliedDelta) * 100) / 100;
    if (operation) state.processedGameOperations.push(operation);
    const label = String(reason || 'Mini oyun işlemi').slice(0, 80);
    state.transactions.unshift({
      text: `${label} · ${appliedDelta >= 0 ? '+' : '−'}${formatMoney(Math.abs(appliedDelta))}`,
      at: Date.now(),
      kind: 'mini-game',
    });
    state.transactions = state.transactions.slice(0, 12);
    saveGameState(state);
    checkRewardsFor(state);
    if (gameState?.email === state.email && app) render();
    return { success: true, appliedDelta, cash: state.cash, portfolioValue: getPortfolioValue(state) };
  }

  function renderMarket() {
    if (!marketGrid || !gameState) return;
    marketGrid.innerHTML = STOCKS.map((stock) => {
      const price = Number(gameState.prices[stock.symbol]) || stock.startPrice;
      const change = Number(gameState.changes[stock.symbol]) || 0;
      const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
      const trendClass = change >= 0 ? 'up' : 'down';
      const owned = Number(gameState.holdings[stock.symbol]) || 0;
      return `
        <article class="virtual-stock-card">
          <div class="virtual-stock-head">
            <span class="virtual-stock-icon" aria-hidden="true">${stock.icon}</span>
            <div><strong>${stock.symbol}</strong><small>${stock.name}</small></div>
            <span class="virtual-stock-change ${trendClass}">${changeText}</span>
          </div>
          <p class="virtual-stock-sector">${stock.sector} · Sanal şirket</p>
          <div class="virtual-stock-price">${formatSharePrice(price)} <small>/ hisse</small></div>
          <div class="virtual-stock-owned">Portföyünde: ${owned} adet · ${formatMoney(owned * price)}</div>
          <label class="stock-quantity-label" for="qty-${stock.symbol}">Adet</label>
          <div class="stock-trade-actions">
            <input id="qty-${stock.symbol}" type="number" min="1" max="10000" step="1" value="1" inputmode="numeric" aria-label="${stock.symbol} hisse adedi" />
            <button type="button" class="stock-buy-btn" data-action="buy" data-symbol="${stock.symbol}">Al</button>
            <button type="button" class="stock-sell-btn" data-action="sell" data-symbol="${stock.symbol}" ${owned < 1 ? 'disabled' : ''}>Sat</button>
          </div>
        </article>`;
    }).join('');

    marketGrid.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => trade(button.dataset.symbol, button.dataset.action, button.closest('.virtual-stock-card')?.querySelector('input')?.value));
    });
  }

  function renderHoldings() {
    if (!holdingsGrid || !gameState) return;
    const owned = STOCKS.filter((stock) => Number(gameState.holdings[stock.symbol]) > 0);
    if (!owned.length) {
      holdingsGrid.innerHTML = '<p class="stock-empty-state">Henüz sanal hisse almadın. Günlük bütçenle ilk alımını yapabilirsin.</p>';
      return;
    }
    holdingsGrid.innerHTML = owned.map((stock) => {
      const amount = Number(gameState.holdings[stock.symbol]) || 0;
      const value = getHoldingValue(gameState, stock.symbol);
      const costBasis = Math.max(0, Number(gameState.costBasis[stock.symbol]) || 0);
      const profitLoss = value - costBasis;
      const percent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
      const trendClass = profitLoss >= 0 ? 'up' : 'down';
      const sign = profitLoss >= 0 ? '+' : '−';
      const percentSign = percent > 0 ? '+' : '';
      const direction = profitLoss > 0 ? 'arttı' : profitLoss < 0 ? 'azaldı' : 'değişmedi';
      const arrow = profitLoss > 0 ? '▲' : profitLoss < 0 ? '▼' : '•';
      return `<div class="stock-holding-row">
        <span><strong>${stock.symbol}</strong><small>${stock.name} · ${amount} adet</small></span>
        <span class="stock-holding-value">
          <strong>${formatMoney(value)}</strong>
          <small class="stock-holding-performance ${trendClass}">${arrow} ${sign}${formatMoney(Math.abs(profitLoss))} (${percentSign}${percent.toFixed(2)}%) · alışa göre ${direction}</small>
        </span>
      </div>`;
    }).join('');
  }

  function renderRewards() {
    const rewardsList = document.getElementById('stockGameRewards');
    if (!rewardsList || !gameState) return;
    const rewardProfile = window.YEKRewards?.getPublicProfile(currentEmail);
    const claimed = new Set(rewardProfile?.claimedMilestones || []);
    const total = getPortfolioValue(gameState);
    rewardsList.innerHTML = REWARDS.map((reward) => {
      const complete = claimed.has(reward.id);
      const progress = Math.min(100, Math.round((total / reward.threshold) * 100));
      return `<div class="stock-reward-row ${complete ? 'complete' : ''}">
        <span class="stock-reward-check" aria-hidden="true">${complete ? '✓' : '○'}</span>
        <div class="stock-reward-details"><strong>${reward.label} portföy değeri</strong><small>${reward.reward}${complete ? ' · kazanıldı' : ''}</small>
          <div class="stock-reward-progress"><span style="width:${progress}%"></span></div>
        </div>
      </div>`;
    }).join('');
  }

  function renderTransactions() {
    const transactionList = document.getElementById('stockGameTransactions');
    if (!transactionList || !gameState) return;
    if (!gameState.transactions.length) {
      transactionList.innerHTML = '<p class="stock-empty-state">İşlem geçmişin burada görünecek.</p>';
      return;
    }
    transactionList.innerHTML = gameState.transactions.slice(0, 8).map((item) => {
      const date = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }).format(new Date(item.at));
      return `<div class="stock-transaction-row"><span>${item.text}</span><small>${date}</small></div>`;
    }).join('');
  }

  function renderSummary() {
    if (!gameState) return;
    const cashEl = document.getElementById('stockGameCash');
    const sharesEl = document.getElementById('stockGameSharesValue');
    const totalEl = document.getElementById('stockGamePortfolioValue');
    const accessEl = document.getElementById('stockGameAiAccess');
    const dailyGiftEl = document.getElementById('stockGameDailyGiftStatus');
    if (cashEl) cashEl.textContent = formatMoney(gameState.cash);
    if (sharesEl) sharesEl.textContent = formatMoney(getSharesValue(gameState));
    if (totalEl) totalEl.textContent = formatMoney(getPortfolioValue(gameState));
    if (dailyGiftEl) dailyGiftEl.textContent = gameState.lastDailyGiftDay === todayKey() ? `Bugünün ${formatMoney(DAILY_BUDGET)} sanal bütçesi eklendi. Harcanmayan nakit bakiyende kalır.` : 'Günlük sanal bütçe hazırlanıyor.';
    if (accessEl && window.YEKRewards) {
      const access = window.YEKRewards.getAccess(currentEmail);
      accessEl.textContent = access.mode === 'lifetime' ? 'Ömür boyu sınırsız' : access.mode === 'trial' ? '24 saatlik ücretsiz erişim açık' : access.mode === 'bonus' ? 'Sınırsız ödül süresi açık' : `${Math.floor(access.remainingSeconds / 60)} dk günlük süre`;
    }
  }

  function render() {
    if (!gameState) return;
    renderSummary();
    renderMarket();
    renderHoldings();
    renderRewards();
    renderTransactions();
  }

  function trade(symbol, action, quantityValue) {
    if (!gameState || !STOCKS.some((stock) => stock.symbol === symbol)) return;
    const quantity = Math.floor(Number(quantityValue));
    const price = Number(gameState.prices[symbol]);
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 10000 || !Number.isFinite(price) || price <= 0) {
      showFeedback('Lütfen 1 ile 10.000 arasında geçerli bir hisse adedi gir.', 'error');
      return;
    }

    const total = quantity * price;
    const stock = STOCKS.find((item) => item.symbol === symbol);
    if (action === 'buy') {
      if (gameState.cash < total) {
        showFeedback(`Bu alım için ${formatMoney(total)} gerekiyor; kullanılabilir sanal paran ${formatMoney(gameState.cash)}.`, 'error');
        return;
      }
      gameState.cash -= total;
      gameState.holdings[symbol] = (Number(gameState.holdings[symbol]) || 0) + quantity;
      gameState.costBasis[symbol] = (Number(gameState.costBasis[symbol]) || 0) + total;
      gameState.transactions.unshift({ text: `${symbol} · ${quantity} adet alındı · ${formatMoney(total)}`, at: Date.now(), kind: 'buy' });
    } else {
      if ((Number(gameState.holdings[symbol]) || 0) < quantity) {
        showFeedback(`Satmak için portföyünde en az ${quantity} adet ${symbol} olmalı.`, 'error');
        return;
      }
      const previousShares = Number(gameState.holdings[symbol]) || 0;
      const averageCostPerShare = previousShares > 0 ? (Number(gameState.costBasis[symbol]) || 0) / previousShares : 0;
      const removedCostBasis = Math.round(averageCostPerShare * quantity * 100) / 100;
      gameState.holdings[symbol] = previousShares - quantity;
      gameState.costBasis[symbol] = Math.max(0, (Number(gameState.costBasis[symbol]) || 0) - removedCostBasis);
      gameState.cash += total;
      gameState.transactions.unshift({ text: `${symbol} · ${quantity} adet satıldı · ${formatMoney(total)}`, at: Date.now(), kind: 'sell' });
    }

    gameState.transactions = gameState.transactions.slice(0, 12);
    saveGameState(gameState);
    showFeedback(`${stock.name} işlemi tamamlandı.`, 'success');
    checkRewards();
    render();
  }

  function runMarketRound() {
    if (!gameState) return;
    if (gameState.lastDailyGiftDay !== todayKey()) {
      gameState = ensureGameState(currentEmail);
      if (!gameState) return;
      checkRewards();
      render();
    }
    const now = Date.now();
    if (gameState.lastMarketRoundAt && now - gameState.lastMarketRoundAt < MARKET_TICK_MS) return;
    STOCKS.forEach((stock) => {
      const movement = (Math.random() * 0.20) - 0.09;
      const previous = Number(gameState.prices[stock.symbol]) || stock.startPrice;
      const next = Math.max(0.5, previous * (1 + movement));
      gameState.prices[stock.symbol] = Number(next.toFixed(2));
      gameState.changes[stock.symbol] = movement * 100;
    });
    gameState.lastMarketRoundAt = now;
    saveGameState(gameState);
    checkRewards();
    render();
    const nextRound = document.getElementById('stockGameNextRound');
    if (nextRound) nextRound.textContent = 'Sanal piyasa turu tamamlandı. Yeni tur yaklaşık 1 dakika sonra.';
  }

  function updateGuestState() {
    currentEmail = window.YEKRewards?.getCurrentEmail() || '';
    if (!currentEmail) {
      if (guestNotice) guestNotice.classList.remove('hidden');
      if (app) app.classList.add('hidden');
      gameState = null;
      if (marketTimer) window.clearInterval(marketTimer);
      marketTimer = null;
      return;
    }

    if (guestNotice) guestNotice.classList.add('hidden');
    if (app) app.classList.remove('hidden');
    window.YEKRewards?.ensureForUser(currentEmail);
    gameState = ensureGameState(currentEmail);
    if (!app) return;
    checkRewards();
    render();
    if (!gameState.lastMarketRoundAt || Date.now() - gameState.lastMarketRoundAt >= MARKET_TICK_MS) runMarketRound();
    if (marketTimer) window.clearInterval(marketTimer);
    marketTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') runMarketRound();
    }, 1000);
  }

  const api = {
    getPortfolioValue: () => gameState ? getPortfolioValue(gameState) : 0,
    getCurrentEmail: () => currentEmail,
    getCash,
    adjustCash,
    update: updateGuestState,
  };
  window.YEKStockGame = api;

  window.addEventListener('yek-auth-state-changed', updateGuestState);
  window.addEventListener('yek-rewards-updated', renderSummary);
  window.addEventListener('storage', (event) => {
    if (event.key === keyFor(currentEmail)) updateGuestState();
  });

  if (app) {
    const userEmail = window.YEKRewards?.getCurrentEmail();
    if (userEmail) updateGuestState();
    else {
      guestNotice?.classList.remove('hidden');
      app.classList.add('hidden');
    }
  } else {
    const userEmail = window.YEKRewards?.getCurrentEmail();
    if (userEmail) ensureGameState(userEmail);
  }
})();
