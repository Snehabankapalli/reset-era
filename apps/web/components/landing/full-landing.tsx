export function ResetEraLanding() {
  const brutalThree = [
    {
      id: 1,
      title: "Fix Kafka partition skew in ingestion pipeline",
      why: "Blocking downstream reliability and causing noisy retries.",
      step: "Open consumer lag dashboard and compare partition distribution for the affected topic.",
      time: "25 min",
    },
    {
      id: 2,
      title: "Ship healthcare platform README architecture section",
      why: "Unblocks portfolio credibility and clarifies system scope.",
      step: "Write the architecture overview bullets for ingestion, validation, storage, and observability.",
      time: "20 min",
    },
    {
      id: 3,
      title: "Reply to recruiter about interview availability",
      why: "Fast leverage move with immediate career upside.",
      step: "Send a two-line confirmation with your available windows for next week.",
      time: "5 min",
    },
  ];

  const freezer = [
    "Research desk setup ideas",
    "Reorganize old screenshots folder",
    "Try 3 new note-taking apps",
    "Rewrite portfolio about section again",
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white text-neutral-950 flex items-center justify-center text-sm font-semibold">
                RE
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide">Reset Era</div>
                <div className="text-xs text-white/50">Execution system</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
              <a href="#how-it-works" className="hover:text-white">How it works</a>
              <a href="#product" className="hover:text-white">Product</a>
              <a href="#pricing" className="hover:text-white">Pricing</a>
            </div>
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-white/90">
              Start your reset
            </button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.10),transparent_25%),radial-gradient(circle_at_top_left,rgba(255,255,255,0.07),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Built for overloaded professionals
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Turn mental overload into a clear execution plan.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Dump everything on your mind. Reset Era sorts the chaos, kills stale noise,
              and gives you the Brutal 3 tasks that actually move the needle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-white/90">
                Start your reset
              </button>
              <button className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5">
                See how it works
              </button>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold">3</div>
                <div className="mt-1 text-sm text-white/60">tasks surfaced for today</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold">12</div>
                <div className="mt-1 text-sm text-white/60">stale tasks frozen</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-semibold">1</div>
                <div className="mt-1 text-sm text-white/60">clear next move</div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[28px] border border-white/10 bg-neutral-900 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-sm font-medium text-white/60">Today's plan</div>
                  <div className="mt-1 text-xl font-semibold">The Brutal 3</div>
                </div>
                <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Reset complete
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {brutalThree.map((task, index) => (
                  <div key={task.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-white text-xs font-semibold text-neutral-950">
                          0{index + 1}
                        </div>
                        <div>
                          <div className="text-base font-semibold leading-6">{task.title}</div>
                          <div className="mt-1 text-sm text-white/55">{task.why}</div>
                        </div>
                      </div>
                      <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                        {task.time}
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl bg-black/30 p-3 text-sm text-white/75">
                      <span className="font-medium text-white">First step:</span> {task.step}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-neutral-950">Start</button>
                      <button className="rounded-2xl border border-white/10 px-4 py-2 text-xs text-white/70">Delay</button>
                      <button className="rounded-2xl border border-white/10 px-4 py-2 text-xs text-white/70">Block</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-white/50">How it works</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Not another to-do app. A reset system.
            </h2>
            <p className="mt-4 text-lg text-white/65">
              Reset Era helps you decide, cut, and start. The product is built to reduce
              decision fatigue, not collect more tasks.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {[
              ["01", "Dump everything", "Write or speak what is on your mind. No formatting needed."],
              ["02", "Clarify only if needed", "The system asks only the few questions that actually change priority or execution."],
              ["03", "Get the Brutal 3", "Your highest-value tasks are selected with first steps already drafted."],
              ["04", "Freeze the noise", "Low-value stale tasks get moved out of sight so your list stays usable."],
            ].map(([num, title, copy]) => (
              <div key={num} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <div className="text-sm font-medium text-white/40">{num}</div>
                <div className="mt-5 text-xl font-semibold">{title}</div>
                <p className="mt-3 text-sm leading-6 text-white/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm font-medium text-white/50">Core interface</div>
              <h3 className="mt-3 text-2xl font-semibold">Brain dump → decision → action</h3>
              <div className="mt-6 rounded-[28px] border border-white/10 bg-neutral-900 p-5">
                <div className="text-sm text-white/50">Brain dump</div>
                <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
                  Need to fix Kafka issue, reply to recruiter, update portfolio project section,
                  finish healthcare repo architecture, maybe clean desk, look into new planner app,
                  taxes still pending.
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55">
                  <div className="rounded-full border border-white/10 px-3 py-1">Energy: Medium</div>
                  <div className="rounded-full border border-white/10 px-3 py-1">Available time: 90 min</div>
                </div>
                <button className="mt-5 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950">
                  Reset my day
                </button>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm font-medium text-white/50">Signature mechanism</div>
              <h3 className="mt-3 text-2xl font-semibold">Deep Freeze keeps the list clean</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
                Tasks that stay stale and low-value do not keep haunting the main view.
                Reset Era moves them out so you can focus on what matters now.
              </p>
              <div className="mt-6 rounded-[28px] border border-white/10 bg-neutral-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white/50">Deep Freeze</div>
                    <div className="mt-1 text-lg font-semibold">4 tasks archived today</div>
                  </div>
                  <div className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-300">
                    Cleaner list
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {freezer.map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/60">
                      <span>{item}</span>
                      <button className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">Restore</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              ["Brutal 3", "The system never overloads you with ten priorities at once."],
              ["First-step prompts", "Every selected task comes with a clear physical starting action."],
              ["Behavior-aware", "The product learns what you avoid and adjusts future plans."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <div className="text-lg font-semibold">{title}</div>
                <p className="mt-3 text-sm leading-6 text-white/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-sm font-medium text-white/50">Who it is for</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Built for ambitious people with too much in their head.
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-white/65">
                Engineers, analysts, founders, operators, and job seekers who do not need
                more motivation — they need a system that cuts noise and makes action obvious.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
              <div className="text-sm font-medium text-white/50">Why it works</div>
              <div className="mt-5 space-y-5">
                {[
                  "Reduces decision fatigue before work even starts",
                  "Rewrites vague tasks into clear execution steps",
                  "Protects attention by freezing stale clutter",
                  "Makes progress visible and easier to repeat",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-white" />
                    <div className="text-sm leading-6 text-white/70">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-white/50">Pricing</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Start simple. Pay when it becomes part of your execution system.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
              <div className="text-lg font-semibold">Free</div>
              <div className="mt-3 text-4xl font-semibold">$0</div>
              <p className="mt-3 text-sm text-white/60">For trying the reset workflow and building trust in the system.</p>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <div>3 resets per week</div>
                <div>Basic task sorting</div>
                <div>1 daily Brutal 3 plan</div>
                <div>Deep Freeze preview</div>
              </div>
              <button className="mt-8 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/5">
                Start free
              </button>
            </div>
            <div className="rounded-[32px] border border-white bg-white p-8 text-neutral-950 shadow-2xl shadow-black/30">
              <div className="inline-flex rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white">Best for consistent execution</div>
              <div className="mt-4 text-lg font-semibold">Pro</div>
              <div className="mt-3 text-4xl font-semibold">$12<span className="text-base font-medium text-neutral-500">/month</span></div>
              <p className="mt-3 text-sm text-neutral-600">For users who want the system to actively reduce noise and improve follow-through.</p>
              <div className="mt-6 space-y-3 text-sm text-neutral-700">
                <div>Unlimited resets</div>
                <div>Behavior-aware prioritization</div>
                <div>Deep Freeze automation</div>
                <div>Reflection insights</div>
                <div>Coaching tone controls</div>
              </div>
              <button className="mt-8 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-10 text-center">
            <div className="mx-auto max-w-3xl">
              <div className="text-sm font-medium text-white/50">Final CTA</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                Stop organizing everything. Start finishing what matters.
              </h2>
              <p className="mt-5 text-lg text-white/65">
                Reset Era clears mental clutter, cuts stale tasks, and gives you the next move.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-white/90">
                  Start your reset
                </button>
                <button className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5">
                  View product demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetEraLanding;
