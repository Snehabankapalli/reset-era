"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import BrutalThree from "@/components/app/BrutalThree";
import CompletionReflection from "@/components/app/CompletionReflection";
import StuckModal from "@/components/app/StuckModal";
import ZenVault from "@/components/app/ZenVault";
import {
  completeTask,
  createReflection,
  recordTaskEvent,
  resolveStuckStep,
  updateTask,
  type PlanItem,
  type PlanResponse,
} from "@/lib/api-client";

type ViewState = "PLAN" | "VAULT" | "REFLECTION";

const DEFAULT_REPO_CONTEXT = {
  repo_name: "fintech-pipeline",
  readme_summary: "Kafka + Spark + Snowflake real-time pipeline",
  structure: ["src", "kafka", "infra", "dashboards"],
};

export default function PlanClient({ initialPlan }: { initialPlan: PlanResponse }) {
  const router = useRouter();

  const [plan, setPlan] = useState<PlanResponse>(initialPlan);
  const [view, setView] = useState<ViewState>("PLAN");
  const [activeTask, setActiveTask] = useState<PlanItem | null>(null);
  const [vaultFirstStep, setVaultFirstStep] = useState<string | null>(null);
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);
  const [isStuckOpen, setIsStuckOpen] = useState(false);
  const [pinnedTaskIds, setPinnedTaskIds] = useState<string[]>([]);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visibleTasks = useMemo(() => {
    return plan.brutal_three.filter((task) => task.id !== completedTaskId);
  }, [plan.brutal_three, completedTaskId]);

  function openVault(taskId: string) {
    const task = plan.brutal_three.find((item) => item.id === taskId) ?? null;
    if (!task) return;
    setActiveTask(task);
    setVaultFirstStep(task.first_step);
    setView("VAULT");
    setError(null);
  }

  async function handleStart(taskId: string) {
    setBusyTaskId(taskId);
    setError(null);
    try {
      await recordTaskEvent(taskId, "started");
      openVault(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleDoneFromPlan(taskId: string) {
    setBusyTaskId(taskId);
    setError(null);
    try {
      await recordTaskEvent(taskId, "done");
      setCompletedTaskId(taskId);
      setView("REFLECTION");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleVaultComplete() {
    if (!activeTask) return;

    setBusyTaskId(activeTask.id);
    setError(null);
    try {
      await completeTask(activeTask.id);
      setCompletedTaskId(activeTask.id);
      setView("REFLECTION");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleCoolLater(taskId: string) {
    setBusyTaskId(taskId);
    setError(null);
    try {
      await updateTask(taskId, { status: "cooling" });
      setPlan((current) => ({
        ...current,
        brutal_three: current.brutal_three.filter((task) => task.id !== taskId),
      }));

      if (activeTask?.id === taskId) {
        setView("PLAN");
        setActiveTask(null);
        setVaultFirstStep(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cool this task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handlePin(taskId: string) {
    setBusyTaskId(taskId);
    setError(null);
    try {
      await updateTask(taskId, { is_pinned: true });
      setPinnedTaskIds((current) => (current.includes(taskId) ? current : [...current, taskId]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to pin task.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleReflection(sentiment: "easy" | "expected" | "grind") {
    if (!completedTaskId) return;

    setBusyTaskId(completedTaskId);
    setError(null);
    try {
      await createReflection({ task_id: completedTaskId, sentiment });
      setPlan((current) => ({
        ...current,
        brutal_three: current.brutal_three.filter((task) => task.id !== completedTaskId),
      }));
      setCompletedTaskId(null);
      setActiveTask(null);
      setVaultFirstStep(null);
      setView("PLAN");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save reflection.");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleStuckSubmit(note: string) {
    if (!activeTask || !vaultFirstStep) return;

    setBusyTaskId(activeTask.id);
    setError(null);
    try {
      const response = await resolveStuckStep({
        taskId: activeTask.id,
        friction_note: note,
        current_first_step: vaultFirstStep,
        repo_context: DEFAULT_REPO_CONTEXT,
      });
      setVaultFirstStep(response.updated_first_step);
      setIsStuckOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to refine next step.");
    } finally {
      setBusyTaskId(null);
    }
  }

  function handleExitVault() {
    setView("PLAN");
    setActiveTask(null);
    setVaultFirstStep(null);
    setIsStuckOpen(false);
  }

  const completedTask = plan.brutal_three.find((task) => task.id === completedTaskId) ?? activeTask;

  return (
    <>
      <section className="mt-8 space-y-6">
        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {view === "PLAN" ? (
          <BrutalThree
            tasks={visibleTasks}
            pinnedTaskIds={pinnedTaskIds}
            onStart={handleStart}
            onDone={handleDoneFromPlan}
            onFreeze={handleCoolLater}
            onPin={handlePin}
          />
        ) : null}

        {view === "REFLECTION" && completedTaskId && completedTask ? (
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="text-sm text-white/45">Task completed</div>
            <div className="text-2xl font-semibold text-white">{completedTask.title}</div>
            <CompletionReflection taskId={completedTaskId} onSelect={(taskId, sentiment) => handleReflection(sentiment)} />
          </div>
        ) : null}

        {busyTaskId ? <div className="text-sm text-white/45">Updating task...</div> : null}
      </section>

      {view === "VAULT" && activeTask && vaultFirstStep ? (
        <ZenVault
          task={activeTask}
          firstStep={vaultFirstStep}
          onExit={handleExitVault}
          onComplete={handleVaultComplete}
          onStuck={() => setIsStuckOpen(true)}
        />
      ) : null}

      <StuckModal
        isOpen={isStuckOpen}
        onClose={() => setIsStuckOpen(false)}
        onSubmit={handleStuckSubmit}
      />
    </>
  );
}
