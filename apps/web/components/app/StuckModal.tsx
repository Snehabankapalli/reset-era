"use client";

import { useState } from "react";

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-neutral-900 p-6 text-white shadow-2xl">
        <div className="text-sm font-medium text-white/45">Reset Era</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">What is the smallest friction point right now?</h2>
        <p className="mt-3 text-sm leading-6 text-white/55">
          Keep it short. The system will shrink the next step, not start a conversation.
        </p>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="I do not know where the dashboard is"
          className="mt-5 min-h-28 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm outline-none"
        />

        <div className="mt-5 flex gap-2">
          <button
            onClick={async () => {
              if (!note.trim()) return;
              setIsSubmitting(true);
              await onSubmit(note.trim());
              setIsSubmitting(false);
              setNote("");
            }}
            disabled={isSubmitting}
            className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Refine next step"}
          </button>
          <button
            onClick={() => {
              setNote("");
              onClose();
            }}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/70"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
