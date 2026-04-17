"use client";

import { useState } from "react";
import { X } from "lucide-react";

type StuckModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: string) => Promise<void>;
};

export default function StuckModal({ isOpen, onClose, onSubmit }: StuckModalProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-white/[0.08] bg-neutral-900 p-8 text-white shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/25">
              Reset Era
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              What's blocking you?
            </h2>
          </div>
          <button
            onClick={() => { setNote(""); onClose(); }}
            className="rounded-full p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white/60"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/40">
          One sentence. The system will shrink your next step, not start a conversation.
        </p>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="I don't know where the dashboard is..."
          className="mt-6 min-h-[100px] w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-sm leading-6 text-white/80 outline-none transition-all placeholder:text-white/20 focus:border-white/15 focus:bg-white/[0.05]"
          autoFocus
        />

        <div className="mt-6 flex gap-3">
          <button
            onClick={async () => {
              if (!note.trim()) return;
              setIsSubmitting(true);
              await onSubmit(note.trim());
              setIsSubmitting(false);
              setNote("");
            }}
            disabled={isSubmitting || !note.trim()}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition-all hover:shadow-[0_0_24px_rgba(255,255,255,0.1)] disabled:opacity-40"
          >
            {isSubmitting ? "Refining..." : "Refine step"}
          </button>
          <button
            onClick={() => { setNote(""); onClose(); }}
            className="rounded-2xl border border-white/[0.08] px-5 py-3 text-sm text-white/50 transition hover:bg-white/[0.03]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
