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

const HOLD_MS = 1200;

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

  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white">
      {/* Subtle breathing ambient */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-[150px]" />

      <div className="relative mx-auto flex h-full max-w-5xl flex-col px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="rounded-full border border-white/[0.08] p-3 text-white/40 transition-all hover:border-white/15 hover:bg-white/[0.03] hover:text-white/70"
            aria-label="Exit focus mode"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/20">
              Focus mode
            </div>
            <div className="h-1 w-24 overflow-hidden rounded-full bg-white/[0.06] sm:w-32">
              <div
                className="h-full rounded-full bg-white/50 transition-all duration-300"
                style={{ width: `${Math.max(10, progress * 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={onStuck}
            className="rounded-full border border-white/[0.08] p-3 text-white/40 transition-all hover:border-amber-400/20 hover:bg-amber-400/[0.04] hover:text-amber-300/70"
            aria-label="I'm stuck"
          >
            <HelpCircle size={20} />
          </button>
        </div>

        {/* Center content */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-8">
            <div className="text-[10px] font-semibold uppercase tracking-[0.5em] text-white/20">
              Current focus
            </div>

            <h1 className="text-3xl font-semibold leading-snug tracking-tight sm:text-5xl sm:leading-tight">
              {firstStep}
            </h1>

            <div className="space-y-2">
              <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/15">
                Target
              </div>
              <p className="text-lg text-white/35 sm:text-xl">{task.title}</p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-xs text-white/25">
              <div className="h-1 w-1 rounded-full bg-white/20" />
              {task.estimated_minutes} min focus block
            </div>
          </div>
        </div>

        {/* Bottom complete button */}
        <div className="pb-8">
          <div className="flex flex-col items-center gap-5">
            <button
              onMouseDown={startHold}
              onMouseUp={resetHold}
              onMouseLeave={resetHold}
              onTouchStart={startHold}
              onTouchEnd={resetHold}
              className={`relative flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 transition-all duration-300 ${
                isHolding
                  ? "border-white bg-white text-neutral-950 scale-90"
                  : "border-white/[0.12] bg-white/[0.02] text-white/50 hover:border-white/20 hover:bg-white/[0.04] hover:text-white/70"
              }`}
              aria-label="Hold to complete"
            >
              <Check size={28} strokeWidth={2.5} />
              <svg className="pointer-events-none absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="44"
                  cy="44"
                  r="42"
                  fill="none"
                  stroke={isHolding ? "#0a0a0a" : "rgba(255,255,255,0.4)"}
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-75 ease-linear"
                />
              </svg>
            </button>
            <div className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/20">
              Hold to complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
