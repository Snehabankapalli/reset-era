"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createDump, createTask, generatePlan } from "@/lib/api-client";

const DEFAULT_USER_ID = "demo-user-1";

export default function DumpPage() {
  const router = useRouter();

  const [rawInput, setRawInput] = useState("");
  const [energyLevel, setEnergyLevel] = useState("medium");
  const [availableMinutes, setAvailableMinutes] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
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
      router.push("/plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while resetting your day.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Brain dump</h1>
        <p className="mt-3 text-white/65">Dump everything. No structure needed.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <textarea
            value={rawInput}
            onChange={(event) => setRawInput(event.target.value)}
            className="min-h-56 w-full rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm outline-none"
            placeholder="Need to fix Kafka issue, reply to recruiter, finish README, taxes still pending..."
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={energyLevel}
              onChange={(event) => setEnergyLevel(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm"
            >
              <option value="low">Energy: Low</option>
              <option value="medium">Energy: Medium</option>
              <option value="high">Energy: High</option>
            </select>

            <select
              value={availableMinutes}
              onChange={(event) => setAvailableMinutes(Number(event.target.value))}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 disabled:opacity-60"
          >
            {isSubmitting ? "Resetting..." : "Reset my day"}
          </button>
        </form>
      </div>
    </main>
  );
}
