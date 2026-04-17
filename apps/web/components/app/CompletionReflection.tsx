"use client";

type CompletionReflectionProps = {
  taskId: string;
  onSelect: (taskId: string, sentiment: "easy" | "expected" | "grind") => void;
};

const OPTIONS = [
  { value: "easy", emoji: "\u{1F7E2}", label: "Easy" },
  { value: "expected", emoji: "\u{1F7E1}", label: "As expected" },
  { value: "grind", emoji: "\u{1F534}", label: "A grind" },
] as const;

export default function CompletionReflection({ taskId, onSelect }: CompletionReflectionProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-sm font-medium text-white/70">How did that feel?</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(taskId, option.value)}
            className="rounded-2xl border border-white/12 px-4 py-2 text-sm text-white/75 transition hover:bg-white/5"
          >
            <span className="mr-2">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
