# Reset Era System

AI clarity system. Brain dump → AI sort → 3 clear actions. 10 minutes.

---

## What's in this repo

```
reset-era/
├── src/
│   ├── index.html        # SaaS web app (deployable anywhere)
│   ├── styles.css        # Dark aesthetic UI
│   └── app.js            # Core logic + Claude/OpenAI API integration
├── content/
│   ├── gumroad-copy.md   # High-converting Gumroad listing copy
│   └── 30-posts.md       # Full content bank (30 posts, reels + carousels)
├── docs/
│   └── notion-template-guide.md  # Step-by-step Notion build guide
└── README.md
```

---

## Deploy the SaaS

### Option A — Replit (fastest, free)

1. Go to replit.com → New Repl → HTML/CSS/JS
2. Upload `src/index.html`, `src/styles.css`, `src/app.js`
3. In Replit Secrets panel, add: `ANTHROPIC_API_KEY = sk-ant-...`
4. In `app.js` line 13, update: `API_KEY: window.__RESET_ERA_API_KEY__ || ''`
5. Add this to `index.html` before your script tag:
   ```html
   <script>window.__RESET_ERA_API_KEY__ = '__REPLIT_SECRET__';</script>
   ```
   (Replit injects this securely at serve time via a server-side script)
6. Hit Run — you get a live URL

### Option B — Vercel (cleanest, free tier)

1. Push this repo to GitHub
2. Connect to vercel.com → import repo
3. Add env var: `ANTHROPIC_API_KEY`
4. Note: for Vercel you'll need a simple API route to avoid exposing your key client-side
   - Create `/api/reset.js` as a serverless function (see below)

### Option C — Gumroad only (zero infra)

Ship without a live app first:
1. Package the Notion template + AI prompt as a PDF/Notion export
2. List on Gumroad for $19
3. Add the web app later as an upgrade

---

## API Key Setup

The app supports both Anthropic (Claude) and OpenAI.

**To use Claude (recommended — smarter, cheaper for this use case):**
```js
// app.js line 11-12
API_KEY: 'sk-ant-your-key-here',
API_PROVIDER: 'anthropic',
```

**To use OpenAI:**
```js
API_KEY: 'sk-your-openai-key',
API_PROVIDER: 'openai',
```

**Without any API key:**
The app runs in demo mode — shows a sample result. Good for testing the UI.

---

## Vercel API Route (for production — keeps key server-side)

Create `api/reset.js`:

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { dump } = req.body;
  if (!dump) return res.status(400).json({ error: 'no dump provided' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildPrompt(dump) }],
    }),
  });

  const data = await response.json();
  res.json({ result: data.content[0].text });
}
```

Then update `app.js` `callAI()` to hit `/api/reset` instead of Anthropic directly.

---

## 90-Day Revenue Targets

| Month | Goal | How |
|-------|------|-----|
| 1 | $500 | 30 posts, $9 launch price, first 50 buyers |
| 2 | $3,000 | Price to $19, add $49 upsell (weekly system) |
| 3 | $10,000 | Live app + $12/mo subscription, volume play |

---

## Pricing Ladder

| Product | Price | Status |
|---------|-------|--------|
| Reset Era System (Notion + prompts) | $19 | build this first |
| Weekly Reset System (full Notion OS) | $49 | upsell after 20 sales |
| Reset Era Pro (web app, unlimited) | $12/mo | month 2-3 |
| Life OS Bundle | $79 | bundle all three |

---

## Cost to run

| Item | Cost |
|------|------|
| Claude API (Haiku) | ~$0.001 per reset |
| Hosting (Replit/Vercel free tier) | $0 |
| Gumroad | 10% transaction fee |
| Total infra at 100 users/day | ~$3/month |
