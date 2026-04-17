"use client";

type CompletionReflectionProps = {
  taskId: string;
  onSelect: (taskId: string, sentiment: "easy" | "expected" | "grind") => void;
};

const OPTIONS = [
  { value: "easy" as const, emoji: "\u{1F7E2}", label: "Easy", sublabel: "Felt smooth" },
  { value: "expected" as const, emoji: "\u{1F7E1}", label: "As expected", sublabel: "Normal effort" },
  { value: "grind" as const, emoji: "\u{1F534}", label: "A grind", sublabel: "Harder than expected" },
];

export default function CompletionReflection({ taskId, onSelect }: CompletionReflectionProps) {
  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8">
      <div className="space-y-1">
        <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/25">
          Reflection
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-white/80">
          How did that feel?
        </h3>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(taskId, option.value)}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-5 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]"
          >
            <span className="text-2xl">{option.emoji}</span>
            <span className="text-sm font-medium text-white/70">{option.label}</span>
            <span className="text-[11px] text-white/30">{option.sublabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
