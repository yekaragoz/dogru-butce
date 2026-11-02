// YEK AI ve sanal borsa oyunu için tarayıcıda saklanan prototip hesap hakları.
(function () {
  const AUTH_USER_KEY = 'yek_auth_user_v1';
  const PROFILE_PREFIX = 'yek_rewards_profile_v1:';
  const DAY_MS = 24 * 60 * 60 * 1000;
  const DAILY_CHAT_SECONDS = 30 * 60;

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getCurrentUser() {
    try {
      const user = JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
      return user && normalizeEmail(user.email) ? user : null;
    } catch (error) {
      return null;
    }
  }

  function getCurrentEmail() {
    return normalizeEmail(getCurrentUser()?.email);
  }

  function getTodayKey() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function dayNumber(dayKey) {
    const timestamp = Date.parse(`${dayKey}T00:00:00Z`);
    return Number.isFinite(timestamp) ? Math.floor(timestamp / DAY_MS) : null;
  }

  function storageKey(email) {
    return PROFILE_PREFIX + encodeURIComponent(normalizeEmail(email));
  }

  function readProfile(email) {
    try {
      const profile = JSON.parse(localStorage.getItem(storageKey(email)) || 'null');
      return profile && typeof profile === 'object' && !Array.isArray(profile) ? profile : null;
    } catch (error) {
      return null;
    }
  }

  function saveProfile(profile) {
    try {
      localStorage.setItem(storageKey(profile.email), JSON.stringify(profile));
    } catch (error) {
      // Tarayıcı depolama kapalıysa prototip hakları kalıcı olmayabilir.
    }
  }

  function notify(email) {
    window.dispatchEvent(new CustomEvent('yek-rewards-updated', { detail: { email: normalizeEmail(email) } }));
  }

  function ensureForUser(email) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return null;

    const now = Date.now();
    const today = getTodayKey();
    let profile = readProfile(normalizedEmail);
    let changed = false;

    if (!profile) {
      profile = {
        version: 1,
        email: normalizedEmail,
        createdAt: now,
        trialEndsAt: now + DAY_MS,
        dailyChatSeconds: DAILY_CHAT_SECONDS,
        lastDailyCreditDay: today,
        bonusUntil: 0,
        lifetimeUnlimited: false,
        claimedMilestones: [],
      };
      changed = true;
    } else {
      profile.email = normalizedEmail;
      profile.version = 1;
      if (!Number.isFinite(Number(profile.createdAt))) {
        profile.createdAt = now;
        changed = true;
      }
      if (!Number.isFinite(Number(profile.trialEndsAt))) {
        profile.trialEndsAt = Number(profile.createdAt) + DAY_MS;
        changed = true;
      }
      if (!Number.isFinite(Number(profile.dailyChatSeconds)) || profile.dailyChatSeconds < 0) {
        profile.dailyChatSeconds = 0;
        changed = true;
      }
      if (!Array.isArray(profile.claimedMilestones)) {
        profile.claimedMilestones = [];
        changed = true;
      }
      if (!Number.isFinite(Number(profile.bonusUntil))) {
        profile.bonusUntil = 0;
        changed = true;
      }
      if (typeof profile.lifetimeUnlimited !== 'boolean') {
        profile.lifetimeUnlimited = false;
        changed = true;
      }

      const todayNumber = dayNumber(today);
      const lastCreditNumber = dayNumber(profile.lastDailyCreditDay);
      const elapsedDays = todayNumber !== null && lastCreditNumber !== null ? todayNumber - lastCreditNumber : 0;
      if (elapsedDays > 0) {
        profile.dailyChatSeconds += elapsedDays * DAILY_CHAT_SECONDS;
        profile.lastDailyCreditDay = today;
        changed = true;
      } else if (!profile.lastDailyCreditDay) {
        profile.lastDailyCreditDay = today;
        changed = true;
      }
    }

    if (changed) {
      saveProfile(profile);
      notify(normalizedEmail);
    }
    return profile;
  }

  function getAccess(email) {
    const normalizedEmail = normalizeEmail(email || getCurrentEmail());
    const profile = ensureForUser(normalizedEmail);
    if (!profile) return { allowed: false, mode: 'login', remainingSeconds: 0, profile: null };

    const now = Date.now();
    if (profile.lifetimeUnlimited) {
      return { allowed: true, mode: 'lifetime', remainingSeconds: Infinity, profile };
    }
    if (now < Number(profile.trialEndsAt || 0)) {
      return { allowed: true, mode: 'trial', remainingSeconds: Math.ceil((profile.trialEndsAt - now) / 1000), profile };
    }
    if (now < Number(profile.bonusUntil || 0)) {
      return { allowed: true, mode: 'bonus', remainingSeconds: Math.ceil((profile.bonusUntil - now) / 1000), profile };
    }
    const dailySeconds = Math.max(0, Math.floor(Number(profile.dailyChatSeconds) || 0));
    return { allowed: dailySeconds > 0, mode: 'daily', remainingSeconds: dailySeconds, profile };
  }

  function spendDailySeconds(email, seconds) {
    const profile = ensureForUser(email || getCurrentEmail());
    const amount = Math.max(0, Math.floor(Number(seconds) || 0));
    if (!profile || amount === 0) return getAccess(email);

    const access = getAccess(profile.email);
    if (access.mode !== 'daily') return access;

    profile.dailyChatSeconds = Math.max(0, access.remainingSeconds - amount);
    saveProfile(profile);
    return getAccess(profile.email);
  }

  function adjustDailySeconds(email, seconds, operationId) {
    const profile = ensureForUser(email || getCurrentEmail());
    const amount = Math.floor(Number(seconds) || 0);
    if (!profile || amount === 0) {
      return { success: Boolean(profile), appliedDelta: 0, dailyChatSeconds: Math.max(0, Math.floor(Number(profile?.dailyChatSeconds) || 0)) };
    }

    profile.processedGameOperations = Array.isArray(profile.processedGameOperations)
      ? profile.processedGameOperations.filter((id) => typeof id === 'string').slice(-499)
      : [];
    const operation = String(operationId || '');
    if (operation && profile.processedGameOperations.includes(operation)) {
      return { success: true, duplicate: true, appliedDelta: 0, dailyChatSeconds: Math.max(0, Math.floor(Number(profile.dailyChatSeconds) || 0)) };
    }

    const before = Math.max(0, Math.floor(Number(profile.dailyChatSeconds) || 0));
    const after = Math.max(0, before + amount);
    const appliedDelta = after - before;
    profile.dailyChatSeconds = after;
    if (operation) profile.processedGameOperations.push(operation);
    saveProfile(profile);
    notify(profile.email);
    return { success: true, appliedDelta, dailyChatSeconds: after };
  }

  function grantMilestone(email, milestoneId, durationMs, lifetime) {
    const profile = ensureForUser(email || getCurrentEmail());
    if (!profile || profile.claimedMilestones.includes(String(milestoneId))) return false;

    profile.claimedMilestones.push(String(milestoneId));
    if (lifetime) {
      profile.lifetimeUnlimited = true;
    } else {
      const startAt = Math.max(Date.now(), Number(profile.trialEndsAt) || 0, Number(profile.bonusUntil) || 0);
      profile.bonusUntil = startAt + Math.max(0, Number(durationMs) || 0);
    }
    saveProfile(profile);
    notify(profile.email);
    return true;
  }

  function getPublicProfile(email) {
    const profile = ensureForUser(email || getCurrentEmail());
    if (!profile) return null;
    return JSON.parse(JSON.stringify(profile));
  }

  window.YEKRewards = {
    DAILY_CHAT_SECONDS,
    ensureForUser,
    getCurrentEmail,
    getAccess,
    spendDailySeconds,
    adjustDailySeconds,
    grantMilestone,
    getPublicProfile,
  };

  const existingUser = getCurrentUser();
  if (existingUser) ensureForUser(existingUser.email);
  window.addEventListener('storage', (event) => {
    if (event.key === AUTH_USER_KEY) {
      const user = getCurrentUser();
      if (user) ensureForUser(user.email);
    }
  });
})();
