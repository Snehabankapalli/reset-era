import { Suspense } from "react";

import { generatePlan } from "@/lib/api-client";
import PlanClient from "./plan-client";

const DEFAULT_USER_ID = "demo-user-1";

async function getPlan() {
  return generatePlan(DEFAULT_USER_ID);
}

export default async function PlanPage() {
  const plan = await getPlan();

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/50">Today's plan</p>
            <h1 className="mt-1 text-3xl font-semibold">The Brutal 3</h1>
            <p className="mt-3 max-w-2xl text-white/60">{plan.reasoning_summary}</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/65">
          Estimated time: {plan.estimated_total_minutes} minutes
        </div>

        <Suspense fallback={<div className="mt-8 text-white/50">Loading plan...</div>}>
          <PlanClient initialPlan={plan} />
        </Suspense>
      </div>
    </main>
  );
}
