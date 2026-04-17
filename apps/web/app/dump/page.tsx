"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createDump, createTask, generatePlan } from "@/lib/api-client";

const DEFAULT_USER_ID = "demo-user-1";

const PROCESSING_STEPS = [
  "[Intake] Scanning for dependencies...",
  "[Intake] Parsing task boundaries...",
  "[Strategist] Scoring impact vs effort...",
  "[Strategist] Cross-referencing avoidance patterns...",
  "[Strategist] Calculating momentum decay...",
  "[Executive] Extracting the Brutal 3...",
  "[Executive] Generating atomic first steps...",
  "[System] Your reset is ready.",
];

function ProcessingOverlay() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setVisibleLines(step);
      if (step >= PROCESSING_STEPS.length) clearInterval(interval);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm">
      <div className="w-full max-w-lg px-6">
        <div className="rounded-[24px] border border-white/[0.06] bg-neutral-900/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400/80">
              Processing
            </span>
          </div>
          <div className="mt-6 space-y-2.5 font-mono text-sm">
            {PROCESSING_STEPS.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ${
                  i === visibleLines - 1
                    ? "text-emerald-300/90"
                    : "text-white/30"
                }`}
              >
                {line}
              </div>
            ))}
            {visibleLines < PROCESSING_STEPS.length ? (
              <span className="inline-block h-4 w-1.5 animate-pulse bg-emerald-400/70" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DumpPage() {
  const router = useRouter();

  const [rawInput, setRawInput] = useState("");
  const [energyLevel, setEnergyLevel] = useState("medium");
  const [availableMinutes, setAvailableMinutes] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setShowProcessing(true);
    setError(null);

    try {
      const dumpResponse = await createDump({
        raw_input: rawInput,
        input_mode: "text",
        energy_level: energyLevel,
        available_minutes: availableMinutes,
      });

      for (const task of dumpResponse.provisional_tasks) {
        await createTask({
          user_id: DEFAULT_USER_ID,
          title: task.title,
          category: task.category as "do_now" | "do_today" | "schedule_later" | "let_go",
          urgency_score: task.category === "do_now" ? 0.8 : 0.5,
          impact_score: task.category === "do_now" ? 0.8 : 0.6,
          effort_score: 0.4,
          source_brain_dump_id: dumpResponse.brain_dump_id,
        });
      }

      await generatePlan(DEFAULT_USER_ID);

      // Wait for animation to finish before navigating
      const minDisplayTime = PROCESSING_STEPS.length * 600 + 800;
      await new Promise((resolve) => setTimeout(resolve, minDisplayTime));

      router.push("/plan");
    } catch (err) {
      setShowProcessing(false);
      setError(err instanceof Error ? err.message : "Something went wrong while resetting your day.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      {showProcessing ? <ProcessingOverlay /> : null}

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.03] blur-[120px]" />

      <div className="relative mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-[0.35em] text-white/30">
            Reset Era
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Brain dump
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/50">
            Everything on your mind. No structure, no judgement. The system will sort it.
          </p>
        </div>

        <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
          <div className="group relative">
            <textarea
              value={rawInput}
              onChange={(event) => setRawInput(event.target.value)}
              className="min-h-[200px] w-full resize-none rounded-[24px] border border-white/[0.08] bg-white/[0.03] px-6 py-5 text-[15px] leading-7 text-white/90 outline-none transition-all duration-300 placeholder:text-white/25 focus:border-white/20 focus:bg-white/[0.05] focus:shadow-[0_0_40px_rgba(255,255,255,0.04)]"
              placeholder={"Fix Kafka consumer lag in prod...\nReply to that recruiter email...\nFinish the README for healthcare repo...\nTaxes are still pending..."}
              required
            />
            <div className="pointer-events-none absolute bottom-4 right-4 text-xs text-white/15">
              {rawInput.length > 0 ? `${rawInput.split("\n").filter(Boolean).length} items` : ""}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/30">
                Energy level
              </label>
              <select
                value={energyLevel}
                onChange={(event) => setEnergyLevel(event.target.value)}
                className="w-full cursor-pointer appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3.5 text-sm text-white/70 outline-none transition-all hover:border-white/15 focus:border-white/20"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/30">
                Available time
              </label>
              <select
                value={availableMinutes}
                onChange={(event) => setAvailableMinutes(Number(event.target.value))}
                className="w-full cursor-pointer appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3.5 text-sm text-white/70 outline-none transition-all hover:border-white/15 focus:border-white/20"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-300/90">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !rawInput.trim()}
            className="group relative w-full overflow-hidden rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-neutral-950 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] disabled:opacity-40"
          >
            <span className="relative z-10">
              {isSubmitting ? "Sorting your chaos..." : "Reset my day"}
            </span>
          </button>
        </form>
      </div>
    </main>
  );
}
