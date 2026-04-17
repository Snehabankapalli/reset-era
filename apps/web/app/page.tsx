export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
          Reset Era v1
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight">
          Turn mental overload into a clear execution plan.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/65">
          Dump everything on your mind. Reset Era sorts the chaos, freezes stale
          noise, and gives you the Brutal 3 tasks that actually matter.
        </p>
        <div className="mt-8 flex gap-3">
          <a
            href="/dashboard"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950"
          >
            Open app
          </a>
          <button className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
            View demo
          </button>
        </div>
      </div>
    </main>
  );
}
