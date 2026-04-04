/**
 * Reset Era — Production Server
 * Stack: Express + Claude AI + Stripe + Supabase
 */

const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CLIENTS ─────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// ─── MIDDLEWARE ───────────────────────────────────────────
// Raw body needed for Stripe webhooks BEFORE express.json()
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// ─── HEALTH ──────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ─── AI RESET ────────────────────────────────────────────
app.post('/api/reset', async (req, res) => {
  const { dump, email } = req.body;

  if (!dump || dump.trim().length < 5) {
    return res.status(400).json({ error: 'brain dump is too short' });
  }

  // Check daily limit for free users
  if (email) {
    const isPro = await checkProStatus(email);
    if (!isPro) {
      const uses = await getDailyUses(email);
      if (uses >= 3) {
        return res.status(429).json({ error: 'daily_limit_reached', isPro: false });
      }
      await incrementDailyUses(email);
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: buildPrompt(dump) }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.error?.message || 'AI error' });
    }

    const data = await response.json();
    const result = data.content[0].text;

    // Save reset for logged-in users (Pro saves all, free saves last 3)
    if (email) {
      await saveReset(email, dump, result).catch(() => {});
    }

    res.json({ result });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: 'AI request failed' });
  }
});

// ─── AUTH — CHECK PRO STATUS ──────────────────────────────
app.post('/api/auth/status', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });

  const isPro = await checkProStatus(email);
  const uses = isPro ? null : await getDailyUses(email);
  const remaining = isPro ? null : Math.max(0, 3 - uses);

  res.json({ isPro, remaining });
});

// ─── AUTH — MAGIC LINK ────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/` },
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true, message: 'Check your email for the login link.' });
});

// ─── SAVED RESETS ─────────────────────────────────────────
app.get('/api/resets', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });

  const isPro = await checkProStatus(email);

  const { data, error } = await supabase
    .from('resets')
    .select('id, input, output, created_at')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(isPro ? 100 : 3);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ resets: data || [], isPro });
});

// ─── STRIPE — CREATE CHECKOUT ─────────────────────────────
app.post('/api/create-checkout', async (req, res) => {
  const { email, plan } = req.body; // plan: 'monthly' | 'annual'

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const priceId = plan === 'annual'
    ? process.env.STRIPE_ANNUAL_PRICE_ID
    : process.env.STRIPE_MONTHLY_PRICE_ID;

  if (!priceId) {
    return res.status(500).json({ error: 'Stripe price IDs not configured' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/`,
      metadata: { email: email || '' },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── STRIPE — WEBHOOK ─────────────────────────────────────
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email || session.metadata?.email;
    if (email) {
      await grantProAccess(email, session.subscription);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    await revokeProAccess(sub.id);
  }

  res.json({ received: true });
});

// ─── STRIPE — VERIFY SESSION (success page) ───────────────
app.get('/api/verify-session', async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id required' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const email = session.customer_email || session.metadata?.email;
    const paid = session.payment_status === 'paid';

    if (paid && email) {
      await grantProAccess(email, session.subscription);
    }

    res.json({ paid, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SUPABASE HELPERS ────────────────────────────────────
async function checkProStatus(email) {
  if (!process.env.SUPABASE_URL) return false;
  const { data } = await supabase
    .from('pro_users')
    .select('email')
    .eq('email', email.toLowerCase())
    .eq('active', true)
    .maybeSingle();
  return !!data;
}

async function grantProAccess(email, subscriptionId) {
  if (!process.env.SUPABASE_URL) return;
  await supabase.from('pro_users').upsert({
    email: email.toLowerCase(),
    subscription_id: subscriptionId,
    active: true,
    granted_at: new Date().toISOString(),
  }, { onConflict: 'email' });
}

async function revokeProAccess(subscriptionId) {
  if (!process.env.SUPABASE_URL) return;
  await supabase
    .from('pro_users')
    .update({ active: false })
    .eq('subscription_id', subscriptionId);
}

async function getDailyUses(email) {
  if (!process.env.SUPABASE_URL) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('daily_usage')
    .select('uses')
    .eq('email', email.toLowerCase())
    .eq('date', today)
    .maybeSingle();
  return data?.uses || 0;
}

async function incrementDailyUses(email) {
  if (!process.env.SUPABASE_URL) return;
  const today = new Date().toISOString().slice(0, 10);
  await supabase.rpc('increment_daily_uses', {
    p_email: email.toLowerCase(),
    p_date: today,
  });
}

async function saveReset(email, input, output) {
  if (!process.env.SUPABASE_URL) return;
  await supabase.from('resets').insert({
    email: email.toLowerCase(),
    input,
    output,
    created_at: new Date().toISOString(),
  });
}

// ─── PROMPT ──────────────────────────────────────────────
function buildPrompt(dump) {
  return `You are a calm, clear-headed life clarity assistant.

Organize this brain dump into exactly this JSON structure. Return ONLY valid JSON — no markdown, no explanation.

Rules:
- "doNow": max 3 items — urgent AND high-impact only
- "thisWeek": important but not today
- "later": real but low urgency
- "letGo": not theirs to carry right now — include a SHORT reason (max 8 words)
- "identityLine": one gentle, grounding sentence. Not motivational. Something quietly true.
- Each item: under 12 words. Only use what they gave you.

{
  "doNow": ["item1", "item2", "item3"],
  "thisWeek": ["item1", "item2"],
  "later": ["item1"],
  "letGo": [{ "item": "thing", "reason": "short reason" }],
  "identityLine": "one quiet sentence"
}

Brain dump:
"""
${dump.trim()}
"""`;
}

// ─── STATIC ROUTES ───────────────────────────────────────
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'success.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => console.log(`Reset Era running on port ${PORT}`));
