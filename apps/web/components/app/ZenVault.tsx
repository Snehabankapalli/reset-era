"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, HelpCircle, Check } from "lucide-react";

import type { PlanItem } from "@/lib/api-client";

type ZenVaultProps = {
  task: PlanItem;
  firstStep: string;
  onExit: () => void;
  onComplete: () => void;
  onStuck: () => void;
};

const HOLD_MS = 1000;

export default function ZenVault({ task, firstStep, onExit, onComplete, onStuck }: ZenVaultProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdStartRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  function resetHold() {
    setIsHolding(false);
    setProgress(0);
    holdStartRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function tick(now: number) {
    if (!holdStartRef.current) holdStartRef.current = now;

    const elapsed = now - holdStartRef.current;
    const nextProgress = Math.min(elapsed / HOLD_MS, 1);
    setProgress(nextProgress);

    if (nextProgress >= 1) {
      resetHold();
      onComplete();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  function startHold() {
    if (isHolding) return;
    setIsHolding(true);
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white">
      <div className="mx-auto flex h-full max-w-5xl flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="rounded-full border border-white/10 p-3 text-white/55 transition hover:bg-white/5 hover:text-white"
            aria-label="Exit focus mode"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="h-1 w-28 overflow-hidden rounded-full bg-white/10 sm:w-40">
            <div className="h-full w-1/3 rounded-full bg-white/70" />
          </div>

          <button
            onClick={onStuck}
            className="rounded-full border border-white/10 p-3 text-white/55 transition hover:bg-white/5 hover:text-white"
            aria-label="I'm stuck"
          >
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="max-w-4xl space-y-6">
            <div className="text-xs font-medium uppercase tracking-[0.3em] text-white/35">
              Current focus
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              {firstStep}
            </h1>

            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.25em] text-white/25">Target task</p>
              <p className="text-lg text-white/55 sm:text-xl">{task.title}</p>
            </div>

            <div className="text-sm text-white/35">Estimated focus block: {task.estimated_minutes} min</div>
          </div>
        </div>

        <div className="pb-6">
          <div className="flex flex-col items-center gap-4">
            <button
              onMouseDown={startHold}
              onMouseUp={resetHold}
              onMouseLeave={resetHold}
              onTouchStart={startHold}
              onTouchEnd={resetHold}
              className={`relative flex h-20 w-20 items-center justify-center rounded-full border transition-all duration-200 ${
                isHolding
                  ? "border-white bg-white text-neutral-950 scale-95"
                  : "border-white/20 bg-white/[0.03] text-white hover:bg-white/6"
              }`}
              aria-label="Hold to complete"
            >
              <Check size={28} />
              <svg className="pointer-events-none absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="38"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-[stroke-dashoffset] duration-75 ease-linear"
                />
              </svg>
            </button>
            <div className="text-xs uppercase tracking-[0.25em] text-white/30">Hold to complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
