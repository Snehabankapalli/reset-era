export default function DumpPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Brain dump</h1>
        <p className="mt-3 text-white/65">
          Dump everything. No structure needed.
        </p>

        <form className="mt-8 space-y-5">
          <textarea
            className="min-h-56 w-full rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm outline-none"
            placeholder="Need to fix Kafka issue, reply to recruiter, finish README, taxes still pending..."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <select className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm">
              <option>Energy: Low</option>
              <option>Energy: Medium</option>
              <option>Energy: High</option>
            </select>
            <select className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm">
              <option>30 minutes</option>
              <option>60 minutes</option>
              <option>90 minutes</option>
            </select>
          </div>

          <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950">
            Reset my day
          </button>
        </form>
      </div>
    </main>
  );
}
