const FX_URL = 'https://api.exchangerate.dev/v1/latest/USD?symbols=TRY,EUR,GBP,CHF,JPY,CAD,AUD,SAR,AED,CNY,RUB';
const GOLD_URL = 'https://api.gold-api.com/price/XAU/USD';
const BTC_URL = 'https://api.gold-api.com/price/BTC/USD';
const TROY_OUNCE_GRAMS = 31.1034768;

async function getJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { headers: { accept: 'application/json' }, signal: controller.signal });
    if (!response.ok) throw new Error(`Upstream returned ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function parseTimestamp(value) {
  if (value === undefined || value === null) return null;
  const numeric = Number(value);
  const time = Number.isFinite(numeric) && numeric > 0
    ? (numeric < 100000000000 ? numeric * 1000 : numeric)
    : Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}

function freshPrice(data) {
  const price = Number(data?.price);
  const updatedAt = parseTimestamp(data?.updatedAt ?? data?.updated_at ?? data?.timestamp);
  if (!Number.isFinite(price) || price <= 0 || !updatedAt) return null;
  if (Date.now() - Date.parse(updatedAt) > 5 * 60 * 1000) return null;
  return { price, updatedAt };
}

module.exports = async function handler(_request, response) {
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  const [fxResult, goldResult, btcResult] = await Promise.allSettled([
    getJson(FX_URL), getJson(GOLD_URL), getJson(BTC_URL),
  ]);

  let fx = null;
  if (fxResult.status === 'fulfilled') {
    const data = fxResult.value;
    const usdToTry = Number(data?.rates?.TRY);
    const updatedAt = parseTimestamp(data?.effective_at?.TRY ?? data?.data_updated_at ?? data?.timestamp);
    const isStale = Boolean(data?.stale?.TRY) || !updatedAt || Date.now() - Date.parse(updatedAt) > 6 * 60 * 60 * 1000;
    if (data?.result === 'success' && Number.isFinite(usdToTry) && usdToTry > 0 && !isStale) {
      const rates = { USD: usdToTry };
      for (const code of ['EUR','GBP','CHF','JPY','CAD','AUD','SAR','AED','CNY','RUB']) {
        const unitsPerUsd = Number(data?.rates?.[code]);
        if (Number.isFinite(unitsPerUsd) && unitsPerUsd > 0) rates[code] = usdToTry / unitsPerUsd;
      }
      fx = {
        rates,
        updatedAt,
        source: data.source || 'indicative',
        marketSession: data.market_session || 'unknown',
        delaySeconds: 900,
      };
    }
  }

  const goldUsd = goldResult.status === 'fulfilled' ? freshPrice(goldResult.value) : null;
  const btcUsd = btcResult.status === 'fulfilled' ? freshPrice(btcResult.value) : null;
  const usdToTry = fx?.rates?.USD;
  const payload = {
    fetchedAt: new Date().toISOString(),
    fx,
    gold: goldUsd && usdToTry ? {
      tryPerGram: goldUsd.price * usdToTry / TROY_OUNCE_GRAMS,
      updatedAt: goldUsd.updatedAt,
      fxUpdatedAt: fx.updatedAt,
    } : null,
    bitcoin: btcUsd && usdToTry ? {
      tryPerCoin: btcUsd.price * usdToTry,
      updatedAt: btcUsd.updatedAt,
      fxUpdatedAt: fx.updatedAt,
    } : null,
  };

  if (!payload.fx && !payload.gold && !payload.bitcoin) {
    return response.status(502).json({ error: 'Piyasa verileri şu anda alınamıyor.', fetchedAt: payload.fetchedAt });
  }
  return response.status(200).json(payload);
};
