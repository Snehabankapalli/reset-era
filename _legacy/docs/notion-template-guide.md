# Reset Era — Notion Template Build Guide

Step-by-step to build the premium Notion template you sell on Gumroad.

---

## SETUP

1. Open Notion → New Page
2. Title: `✦ Reset Era System`
3. Cover: Upload a dark gradient image (search "dark minimal gradient" on Unsplash)
4. Icon: `✦` (or paste as emoji)
5. Font: `Default` (Inter) — do NOT use serif
6. Turn off breadcrumbs: Page options → Customize → hide breadcrumb

---

## PAGE STRUCTURE

Build in this exact order.

---

### BLOCK 1 — HERO TEXT

Add a Callout block (/) with NO icon:

```
✨ Welcome to your Reset Era

You're not behind.
You're overloaded.

This system clears your mind in minutes.
```

Style: Background color → `Gray` (dark mode will invert it nicely)
Divider below.

---

### BLOCK 2 — TODAY (core feature)

Heading 2: `⚡ Today — Do Only These`

Sub-text (small):
```
max 3 tasks. nothing else matters until these are done.
```

Create a **Database — Inline** (not full-page):

| Column | Type | Options |
|--------|------|---------|
| Task | Title | — |
| Priority | Select | 🔴 High / 🟡 Medium / 🔵 Low |
| Done | Checkbox | — |
| Category | Select | Work / Personal / Health / Admin |

**Filter:** Add filter → Done = Unchecked
**Sort:** Priority (High → Low)
**View name:** rename to `active tasks`

Add a second view: "Completed" → filter Done = Checked

---

### BLOCK 3 — BRAIN DUMP

Heading 2: `🧠 Brain Dump`

Add a Toggle block:
```
▶ click to dump everything
```

Inside the toggle, add a plain text block with placeholder:
```
dump everything here. no structure. no thinking.
meetings you're behind on, the email you keep avoiding,
that thing you said last week, groceries, guilt, ideas,
anxiety you can't name...
```

Below the toggle, add a Callout block (yellow):
```
💡 AI Sort Prompt — copy this into ChatGPT or Claude

Organize this into:
1. Do Now (max 3, urgent + high-impact)
2. This Week
3. Later
4. Ignore (give a short reason)

Keep each item under 12 words.
Only use what I gave you.
Give me the top 3 actions only.

[paste your brain dump below]
```

---

### BLOCK 4 — THIS WEEK

Heading 2: `📅 This Week`

Create another **Database — Inline**:

| Column | Type |
|--------|------|
| Task | Title |
| Day | Select: Mon / Tue / Wed / Thu / Fri / Weekend |
| Status | Select: To Do / In Progress / Done |
| Energy | Select: 🔴 High / 🟡 Medium / 🟢 Low |

**View:** Board by Day (drag tasks across days)
**Filter:** Status ≠ Done (or keep done visible for momentum)

---

### BLOCK 5 — LET GO LIST (differentiator)

Heading 2: `🍃 Let Go List`

Sub-text:
```
not everything deserves your energy. these don't need you right now.
```

Create Database — Inline:

| Column | Type |
|--------|------|
| Item | Title |
| Why I'm Letting Go | Text |
| Added | Date |

Add a sample entry to demonstrate:
- Item: `perfecting before I launch`
- Why: `done is better than perfect`

---

### BLOCK 6 — WEEKLY RESET (bonus feature)

Heading 2: `🔄 Weekly Reset Ritual`

Create a simple template page. To add:
1. Create a **Template** button (/ → Template button)
2. Name it: `start my weekly reset`
3. Inside the template, add:

```
## Weekly Reset — [date]

### What went well this week?


### What drained me?


### What am I carrying into next week that I shouldn't be?


### My 3 priorities for next week:
1.
2.
3.

### What am I letting go of?

```

---

### BLOCK 7 — IDENTITY PAGE (emotional anchor)

Create a **new sub-page** titled:

`you're not the same version anymore`

Inside that page:

Cover: dark gradient (different from main page)
Icon: `✦`

Body text (large, centered, use `/` → Text → increase font):

```
you are not behind.
you are not lazy.
you are not broken.

you're just carrying too much
without a system.

that ends today.

this is your reset era.
```

Style:
- Color: `Gray` text (softens it, feels calm not aggressive)
- No bullet points, no headers
- Lots of whitespace between lines (hit enter twice between each)

---

## DESIGN RULES

| Element | Setting |
|---------|---------|
| Mode | Dark (tell buyers to set Notion to dark mode) |
| Font | Default (Inter) |
| Full width | ON for all pages |
| Color theme | No color backgrounds — use default |
| Emoji use | Sparingly (1 per section header max) |

---

## HOW TO EXPORT & SELL

1. Finish the template
2. Go to top-right menu → Share → Publish to web → ON
3. Go back to Share → Copy link
4. In Gumroad product:
   - File upload: export a PDF instructions doc (optional)
   - Description: include the Notion link
   - OR: use a "Thank you" page redirect to the Notion template share link

**Tip:** Duplicate your template into a clean version before sharing. Remove any personal data.

---

## UPSELL OPPORTUNITY

When you have the $19 product live, build this Notion template as the $49 "Weekly System" upsell:

Add to the upsell version:
- Monthly review template
- Habit tracker (simple checkbox database)
- Routine builder (morning / evening)
- 3-month goal page
- "Who I'm becoming" vision page
