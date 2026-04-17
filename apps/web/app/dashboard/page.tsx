import Link from "next/link";

import { generatePlan, type PlanItem } from "@/lib/api-client";

const DEFAULT_USER_ID = "demo-user-1";

async function getPlan() {
  return generatePlan(DEFAULT_USER_ID);
}

export default async function DashboardPage() {
  const plan = await getPlan();

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/50">Good evening</p>
            <h1 className="mt-1 text-3xl font-semibold">Your reset is ready</h1>
          </div>
          <Link
            href="/dump"
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-neutral-950"
          >
            New dump
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/65">
          {plan.brutal_three.length} tasks in today's plan &bull; estimated {plan.estimated_total_minutes} minutes
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">The Brutal 3</h2>
          <div className="mt-5 grid gap-4">
            {plan.brutal_three.map((task: PlanItem, index: number) => (
              <div key={task.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-white/40">0{index + 1}</div>
                    <h3 className="mt-1 text-lg font-semibold">{task.title}</h3>
                    <p className="mt-3 text-sm text-white/65">
                      <span className="font-medium text-white">First step:</span> {task.first_step}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                    {task.estimated_minutes} min
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href="/plan" className="rounded-2xl bg-white px-4 py-2 text-xs font-semibold text-neutral-950">
                    Go to plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
