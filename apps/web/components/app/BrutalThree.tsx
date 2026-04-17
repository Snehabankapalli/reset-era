"use client";

import { Pin, Snowflake, Play, CheckCircle } from "lucide-react";

import type { PlanItem } from "@/lib/api-client";

type BrutalThreeProps = {
  tasks: PlanItem[];
  onStart?: (taskId: string) => void;
  onDone?: (taskId: string) => void;
  onFreeze?: (taskId: string) => void;
  onPin?: (taskId: string) => void;
  pinnedTaskIds?: string[];
};

const PRIORITY_COLORS = [
  "from-white/[0.06] to-white/[0.02]",
  "from-white/[0.04] to-white/[0.015]",
  "from-white/[0.03] to-white/[0.01]",
];

export default function BrutalThree({
  tasks,
  onStart,
  onDone,
  onFreeze,
  onPin,
  pinnedTaskIds = [],
}: BrutalThreeProps) {
  if (tasks.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <div className="text-4xl">&#x1F9CA;</div>
          <h3 className="mt-4 text-lg font-medium text-white/60">No tasks right now</h3>
          <p className="mt-2 text-sm text-white/30">
            Create a brain dump to generate your Brutal 3.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {tasks.map((task, index) => {
        const pinned = pinnedTaskIds.includes(task.id);

        return (
          <div
            key={task.id}
            className={`group relative rounded-[28px] border border-white/[0.08] bg-gradient-to-b ${PRIORITY_COLORS[index] || PRIORITY_COLORS[2]} p-7 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-white/[0.12] hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]`}
          >
            {/* Priority indicator */}
            <div className="absolute right-7 top-7 flex items-center gap-3">
              {pinned ? (
                <div className="flex items-center gap-1.5 rounded-full bg-sky-400/10 px-3 py-1 text-xs text-sky-300/80">
                  <Pin size={12} /> Pinned
                </div>
              ) : null}
              <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs tabular-nums text-white/40">
                {task.estimated_minutes}m
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.4em] text-white/20">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 text-xl font-semibold leading-7 tracking-tight text-white sm:text-2xl">
                  {task.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/40">{task.why_selected}</p>
              </div>

              <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-5 py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/25">
                  First step
                </div>
                <p className="mt-1.5 text-sm leading-6 text-white/65">{task.first_step}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => onStart?.(task.id)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)]"
                >
                  <Play size={14} fill="currentColor" /> Start
                </button>
                <button
                  onClick={() => onDone?.(task.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] px-4 py-2.5 text-sm text-white/60 transition-all hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-emerald-300"
                >
                  <CheckCircle size={14} /> Done
                </button>
                <button
                  onClick={() => onFreeze?.(task.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] px-4 py-2.5 text-sm text-white/50 transition-all hover:border-sky-400/20 hover:bg-sky-400/[0.04] hover:text-sky-300"
                >
                  <Snowflake size={14} /> Cool later
                </button>
                {!pinned ? (
                  <button
                    onClick={() => onPin?.(task.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.08] px-4 py-2.5 text-sm text-white/40 transition-all hover:border-white/15 hover:text-white/60"
                  >
                    <Pin size={14} /> Pin
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
