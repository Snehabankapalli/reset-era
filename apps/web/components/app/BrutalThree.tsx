"use client";

import { Pin, Snowflake } from "lucide-react";

import type { PlanItem } from "@/lib/api-client";

type BrutalThreeProps = {
  tasks: PlanItem[];
  onStart?: (taskId: string) => void;
  onDone?: (taskId: string) => void;
  onFreeze?: (taskId: string) => void;
  onPin?: (taskId: string) => void;
  pinnedTaskIds?: string[];
};

export default function BrutalThree({
  tasks,
  onStart,
  onDone,
  onFreeze,
  onPin,
  pinnedTaskIds = [],
}: BrutalThreeProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <div className="text-sm font-medium tracking-wide text-white/45">Reset Era</div>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          The Brutal 3
        </h1>
        <p className="max-w-xl text-sm leading-6 text-white/55">
          Only what matters today. No extra noise, no fake urgency.
        </p>
      </header>

      <div className="space-y-4">
        {tasks.map((task, index) => {
          const pinned = pinnedTaskIds.includes(task.id);

          return (
            <div
              key={task.id}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-white/35">0{index + 1}</div>
                  <h3 className="mt-2 text-xl font-semibold leading-7 text-white sm:text-2xl">
                    {task.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">{task.why_selected}</p>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                  {task.estimated_minutes} min
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/70">
                <span className="font-medium text-white">First step:</span> {task.first_step}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => onStart?.(task.id)}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-white/90"
                >
                  Start
                </button>
                <button
                  onClick={() => onDone?.(task.id)}
                  className="rounded-2xl border border-white/12 px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/5"
                >
                  Mark complete
                </button>
                <button
                  onClick={() => onFreeze?.(task.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                >
                  <Snowflake size={16} /> Cool later
                </button>
                <button
                  onClick={() => onPin?.(task.id)}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition ${
                    pinned
                      ? "border-sky-400/30 bg-sky-400/10 text-sky-200"
                      : "border-white/12 text-white/70 hover:bg-white/5"
                  }`}
                >
                  <Pin size={16} /> {pinned ? "Pinned" : "Pin"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
