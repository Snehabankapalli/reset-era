const brutalThree = [
  {
    title: "Fix Kafka partition skew",
    step: "Open consumer lag dashboard and compare partition distribution.",
    time: "25 min",
  },
  {
    title: "Ship healthcare repo architecture README",
    step: "Write bullets for ingestion, validation, storage, and observability.",
    time: "20 min",
  },
  {
    title: "Reply to recruiter",
    step: "Send your available interview windows for next week.",
    time: "5 min",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Good evening</p>
            <h1 className="mt-1 text-3xl font-semibold">Your reset is ready</h1>
          </div>
          <a
            href="/dump"
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
          >
            New dump
          </a>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/65">
          3 tasks active &bull; 12 frozen &bull; 1 plan ready
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">The Brutal 3</h2>
          <div className="mt-5 grid gap-4">
            {brutalThree.map((task, index) => (
              <div key={task.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-white/40">0{index + 1}</div>
                    <h3 className="mt-1 text-lg font-semibold">{task.title}</h3>
                    <p className="mt-3 text-sm text-white/65">
                      <span className="font-medium text-white">First step:</span> {task.step}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {task.time}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-neutral-950">Start</button>
                  <button className="rounded-2xl border border-white/10 px-4 py-2 text-xs text-white/70">Delay</button>
                  <button className="rounded-2xl border border-white/10 px-4 py-2 text-xs text-white/70">Block</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
