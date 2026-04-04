/**
 * Reset Era — AI Clarity System
 * Frontend: auth, usage tracking, Stripe checkout, results
 */

// ─── CONFIG ────────────────────────────────────────────
const CONFIG = {
  GUMROAD_LINK: 'https://snehabank.gumroad.com/l/aaugjh',
};

// ─── STATE ───────────────────────────────────────────────
const State = {
  email: localStorage.getItem('reset_era_email') || null,
  isPro: localStorage.getItem('reset_era_pro') === 'true',
  remaining: 3,
  selectedPlan: 'monthly',

  setEmail(email) {
    this.email = email;
    localStorage.setItem('reset_era_email', email);
  },
  setPro(val) {
    this.isPro = val;
    if (val) localStorage.setItem('reset_era_pro', 'true');
    else localStorage.removeItem('reset_era_pro');
  },
};

// ─── DOM ────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

const screens = {
  hero:    $('heroScreen'),
  dump:    $('dumpScreen'),
  loading: $('loadingScreen'),
  results: $('resultsScreen'),
};

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo(0, 0);
}

// ─── BADGE ───────────────────────────────────────────────
function updateBadge() {
  const badge = $('usesBadge');
  const remaining = $('usesRemaining');
  const label = State.isPro
    ? '✦ Pro'
    : `${State.remaining} free reset${State.remaining !== 1 ? 's' : ''} left today`;

  if (badge) {
    badge.textContent = label;
    badge.style.color = State.isPro ? 'var(--accent)' : '';
  }
  if (remaining) remaining.textContent = State.isPro ? '' : label;
}

// ─── SERVER USAGE CHECK ───────────────────────────────────
async function syncStatus() {
  if (!State.email) return;
  try {
    const res = await fetch('/api/auth/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: State.email }),
    });
    if (!res.ok) return;
    const data = await res.json();
    State.setPro(data.isPro);
    if (!data.isPro && data.remaining !== null) State.remaining = data.remaining;
    updateBadge();
  } catch (_) {}
}

// ─── API CALL ────────────────────────────────────────────
async function callAI(dump) {
  const response = await fetch('/api/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dump, email: State.email }),
  });

  if (response.status === 429) {
    openProModal();
    throw new Error('daily_limit_reached');
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `server error ${response.status}`);
  }

  const data = await response.json();

  // Refresh remaining count
  if (!State.isPro) {
    State.remaining = Math.max(0, State.remaining - 1);
    updateBadge();
  }

  return data.result;
}

// ─── PARSE ───────────────────────────────────────────────
function parseResult(raw) {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

// ─── RENDER ──────────────────────────────────────────────
function renderList(listId, items, emptyMsg) {
  const ul = $(listId);
  ul.innerHTML = '';
  if (!items || items.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-item';
    li.textContent = emptyMsg;
    ul.appendChild(li);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = typeof item === 'string' ? item : item.item;
    ul.appendChild(li);
  });
}

function renderLetGo(items) {
  const ul = $('letGoList');
  ul.innerHTML = '';
  if (!items || items.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-item';
    li.textContent = "nothing to let go right now";
    ul.appendChild(li);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.item || item}<span class="reason">${item.reason || ''}</span>`;
    ul.appendChild(li);
  });
}

function renderResults(data) {
  renderList('doNowList', data.doNow, 'nothing urgent right now — good.');
  renderList('thisWeekList', data.thisWeek, 'nothing pressing this week');
  renderList('laterList', data.later, 'nothing for later');
  renderLetGo(data.letGo);
  $('identityBlock').textContent =
    data.identityLine || 'You do not need to do everything. Start with what matters now.';
  $('upsellBlock').style.display = State.isPro ? 'none' : 'flex';
}

// ─── COPY ────────────────────────────────────────────────
function getResultsAsText() {
  const sections = [
    { id: 'doNowList', label: 'DO NOW' },
    { id: 'thisWeekList', label: 'THIS WEEK' },
    { id: 'laterList', label: 'LATER' },
    { id: 'letGoList', label: 'LET GO' },
  ];
  let text = '✦ Reset Era — Your Clarity Summary\n\n';
  sections.forEach(({ id, label }) => {
    const items = [...$(id).querySelectorAll('li:not(.empty-item)')]
      .map((li) => `  · ${li.textContent.trim()}`).join('\n');
    text += `${label}\n${items || '  · nothing here'}\n\n`;
  });
  const line = $('identityBlock').textContent;
  if (line) text += `"${line}"\n`;
  return text;
}

// ─── TOAST ───────────────────────────────────────────────
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── LOADING ─────────────────────────────────────────────
const loadingMessages = [
  'Clearing the noise…',
  'Sorting what matters now…',
  'Finding what can wait…',
  'Almost ready…',
];

function cycleLoadingMessages() {
  let idx = 0;
  return setInterval(() => {
    idx = (idx + 1) % loadingMessages.length;
    $('loadingText').textContent = loadingMessages[idx];
  }, 1500);
}

// ─── PROCESS ─────────────────────────────────────────────
async function processReset() {
  const dump = $('dumpInput').value.trim();
  if (!dump) return;

  if (!State.isPro && State.remaining <= 0) {
    openProModal();
    return;
  }

  showScreen('loading');
  const msgInterval = cycleLoadingMessages();

  try {
    const raw = await callAI(dump);
    const data = parseResult(raw);
    renderResults(data);
    clearInterval(msgInterval);
    showScreen('results');
  } catch (err) {
    clearInterval(msgInterval);
    if (err.message === 'daily_limit_reached') return;
    renderResults(getDemoResult(dump));
    showScreen('results');
    showToast('Running in demo mode');
  }
}

// ─── DEMO RESULT ─────────────────────────────────────────
function getDemoResult(dump) {
  const lines = dump.split(/[\n,]+/).map((l) => l.trim()).filter(Boolean);
  return {
    doNow:    lines.slice(0, 3).length ? lines.slice(0, 3) : ['reply to that email', 'block 30 mins for focused work', 'make one clear decision'],
    thisWeek: lines.slice(3, 6).length ? lines.slice(3, 6) : ['clear your inbox', 'review your priorities'],
    later:    lines.slice(6, 9).length ? lines.slice(6, 9) : ['the idea you keep postponing'],
    letGo: [
      { item: 'comparing yourself to where you thought you'd be', reason: 'that version of the plan is gone' },
      { item: 'waiting to feel ready', reason: 'clarity comes from action' },
    ],
    identityLine: 'You do not need to do everything. Start with what matters now.',
  };
}

// ─── STRIPE CHECKOUT ─────────────────────────────────────
async function startCheckout() {
  const email = State.email || prompt('Enter your email to continue:');
  if (!email || !email.includes('@')) {
    showToast('Enter a valid email to upgrade');
    return;
  }
  State.setEmail(email);

  try {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan: State.selectedPlan }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      showToast('Stripe not configured yet — coming soon');
    }
  } catch (_) {
    showToast('Could not start checkout — try again');
  }
}

// ─── PRO MODAL ───────────────────────────────────────────
function openProModal() { $('proModal').classList.add('open'); }
function closeProModal() { $('proModal').classList.remove('open'); }

// ─── COLLAPSE TOGGLES ────────────────────────────────────
function setupCollapse(toggleId, bodyId, arrowId) {
  const toggle = $(toggleId);
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    $(bodyId).classList.toggle('open');
    $(arrowId).classList.toggle('open');
  });
}

// ─── NICHE COPY ──────────────────────────────────────────
const NICHE_COPY = {
  founders: {
    eyebrow: 'For Overwhelmed Founders',
    h1: "Your company isn't stalling.<br/><em>Your brain is overloaded.</em>",
    sub: "Dump every decision, task, and worry.<br/>Get your 3 most important moves. Under a minute.",
    dumpH2: "What's taking up space in your founder brain?",
    dumpSub: "Every decision, blocker, task, and idea.\nMessy is fine. That's the point.",
  },
  creatives: {
    eyebrow: 'For Burnt-Out Creatives',
    h1: "You're not blocked.<br/><em>You're carrying too much.</em>",
    sub: "Dump everything crowding your head.<br/>Get clarity on what to make first. Under a minute.",
    dumpH2: "What's crowding your creative brain right now?",
    dumpSub: "Ideas, half-starts, errands, fears. All of it.\nNo structure needed — just dump.",
  },
  adhd: {
    eyebrow: 'For ADHD Brains',
    h1: "You're not lazy.<br/><em>You're overwhelmed and understimulated.</em>",
    sub: "Get everything out of your head.<br/>AI tells you the one thing to do first. Under a minute.",
    dumpH2: "What's spinning in your head right now?",
    dumpSub: "Everything. Big, small, random, urgent.\nJust get it out — order doesn't matter.",
  },
};

function applyNicheCopy() {
  const params = new URLSearchParams(window.location.search);
  const copy = NICHE_COPY[params.get('for')];
  if (!copy) return;

  const eyebrow = document.getElementById('heroEyebrow');
  const h1      = document.getElementById('heroH1');
  const sub     = document.getElementById('heroSub');
  const dumpH2  = document.querySelector('#dumpScreen h2');
  const dumpSub = document.querySelector('#dumpScreen .step-sub');

  if (eyebrow) eyebrow.textContent = copy.eyebrow;
  if (h1)      h1.innerHTML        = copy.h1;
  if (sub)     sub.innerHTML       = copy.sub;
  if (dumpH2)  dumpH2.innerHTML    = copy.dumpH2;
  if (dumpSub) dumpSub.textContent = copy.dumpSub;
}

// ─── INIT ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyNicheCopy();
  syncStatus().then(updateBadge);

  // Hero → Dump (both CTA buttons)
  function goToDump() {
    if (!State.isPro && State.remaining <= 0) { openProModal(); return; }
    $('dumpInput').value = '';
    $('processBtn').disabled = true;
    showScreen('dump');
    setTimeout(() => $('dumpInput').focus(), 100);
  }

  $('startBtn').addEventListener('click', goToDump);
  const startBtn2 = $('startBtn2');
  if (startBtn2) startBtn2.addEventListener('click', goToDump);

  $('backToHero').addEventListener('click', () => showScreen('hero'));

  $('dumpInput').addEventListener('input', () => {
    $('processBtn').disabled = $('dumpInput').value.trim().length < 10;
  });

  $('processBtn').addEventListener('click', processReset);

  $('resetAgainBtn').addEventListener('click', () => {
    $('dumpInput').value = '';
    $('processBtn').disabled = true;
    showScreen('dump');
    setTimeout(() => $('dumpInput').focus(), 100);
  });

  $('copyResultsBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(getResultsAsText())
      .then(() => showToast('Copied to clipboard'))
      .catch(() => showToast('Select and copy manually'));
  });

  setupCollapse('thisWeekToggle', 'thisWeekBody', 'thisWeekArrow');
  setupCollapse('laterToggle',   'laterBody',    'laterArrow');

  $('upgradeBtn').addEventListener('click', openProModal);

  // Both Pro CTAs → Stripe checkout
  $('upsellCTA').addEventListener('click', startCheckout);
  const modalCTA = $('modalCTA');
  if (modalCTA) modalCTA.addEventListener('click', (e) => { e.preventDefault(); startCheckout(); });

  $('maybeLaterBtn').addEventListener('click', () => {
    $('upsellBlock').style.display = 'none';
  });

  $('modalClose').addEventListener('click', closeProModal);
  $('modalSkip').addEventListener('click', closeProModal);
  $('proModal').addEventListener('click', (e) => {
    if (e.target === $('proModal')) closeProModal();
  });

  // Plan toggle in modal
  document.querySelectorAll('.modal-price-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.modal-price-option').forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      State.selectedPlan = opt.dataset.plan || 'monthly';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProModal();
    if (e.key === 'Enter' && e.ctrlKey && document.activeElement === $('dumpInput')) {
      if ($('dumpInput').value.trim().length >= 10) processReset();
    }
  });
});
