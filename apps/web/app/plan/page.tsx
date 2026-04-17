import { Suspense } from "react";
import Link from "next/link";

import { generatePlan } from "@/lib/api-client";
import PlanClient from "./plan-client";

const DEFAULT_USER_ID = "demo-user-1";

async function getPlan() {
  try {
    return await generatePlan(DEFAULT_USER_ID);
  } catch {
    return {
      brutal_three: [],
      reasoning_summary: "Could not load plan. Make sure the API is running.",
      estimated_total_minutes: 0,
    };
  }
}

export default async function PlanPage() {
  const plan = await getPlan();

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-medium uppercase tracking-[0.35em] text-white/30">
              Reset Era
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              The Brutal 3
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/45">
              {plan.reasoning_summary}
            </p>
          </div>
          <Link
            href="/dump"
            className="shrink-0 rounded-2xl border border-white/[0.08] px-5 py-2.5 text-sm text-white/60 transition-all hover:border-white/15 hover:bg-white/[0.03] hover:text-white/80"
          >
            New dump
          </Link>
        </div>

        {plan.estimated_total_minutes > 0 ? (
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            <span className="text-sm text-white/50">
              {plan.estimated_total_minutes} min estimated
            </span>
          </div>
        ) : null}

        <Suspense fallback={<div className="mt-12 text-sm text-white/30">Loading plan...</div>}>
          <PlanClient initialPlan={plan} />
        </Suspense>
      </div>
    </main>
  );
}
