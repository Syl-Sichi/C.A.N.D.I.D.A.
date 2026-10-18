"use client";

import { ListTodo, Circle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useCandidaStore, type TaskItem } from "@/lib/store";
import { clsx } from "clsx";

const statusIcon: Record<
  TaskItem["status"],
  React.ComponentType<{ className?: string }>
> = {
  pending: Circle,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
};

const statusColor: Record<TaskItem["status"], string> = {
  pending: "text-zinc-500",
  running: "text-amber-400",
  completed: "text-emerald-400",
  failed: "text-red-400",
};

const priorityBadge: Record<TaskItem["priority"], string> = {
  low: "bg-zinc-700/50 text-zinc-400",
  medium: "bg-sky-500/15 text-sky-400",
  high: "bg-rose-500/15 text-rose-400",
};

export default function TaskEngine() {
  const { tasks, toggleTask } = useCandidaStore();

  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-candida-border px-4 py-3">
        <ListTodo className="h-4 w-4 text-candida-accent" />
        <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
          Task & Routine Engine
        </h2>
        <span className="ml-auto text-[10px] text-candida-muted">
          {completed}/{tasks.length} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-candida-accent transition-all duration-500"
            style={{ width: `${(completed / tasks.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {tasks.map((task) => {
          const Icon = statusIcon[task.status];
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex w-full items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-left transition-all hover:border-candida-border hover:bg-white/[0.03]"
            >
              <Icon
                className={clsx(
                  "h-4 w-4 shrink-0",
                  statusColor[task.status],
                  task.status === "running" && "animate-spin"
                )}
              />
              <span
                className={clsx(
                  "flex-1 text-sm",
                  task.status === "completed"
                    ? "text-zinc-500 line-through"
                    : "text-zinc-200"
                )}
              >
                {task.title}
              </span>
              <span
                className={clsx(
                  "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                  priorityBadge[task.priority]
                )}
              >
                {task.priority}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-candida-border p-3">
        <button className="w-full rounded-md border border-dashed border-candida-border py-2 text-xs text-candida-muted transition-colors hover:border-candida-accent/40 hover:text-candida-accent">
          + Queue new task
        </button>
      </div>
    </div>
  );
}
