"use client";

import { Check, SquarePen, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useDeleteTask, useUpdateTask } from "@/hooks/use-tasks";
import { formatDueAt } from "@/lib/week";
import type { Task } from "@/server/db/schema";

const DELETE_WIDTH = 80;

const priorityStyles = {
  low: "bg-emerald-50 text-emerald-600",
  medium: "bg-amber-50 text-amber-600",
  high: "bg-danger-soft text-danger",
};

export function TaskRow({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [offset, setOffset] = useState(0);
  const touchStart = useRef<{ x: number; offset: number } | null>(null);
  const completed = task.status === "completed";

  const toggleStatus = () =>
    updateTask.mutate({
      id: task.id,
      input: { status: completed ? "in_progress" : "completed" },
    });

  return (
    <div className="relative overflow-hidden border-b border-neutral-200">
      <button
        onClick={() => deleteTask.mutate(task.id)}
        className="absolute inset-y-0 right-0 bg-danger text-sm font-medium text-white"
        style={{ width: DELETE_WIDTH }}
      >
        Delete
      </button>
      <div
        className="relative flex items-center gap-3 bg-white py-4 transition-transform"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={(e) => {
          touchStart.current = { x: e.touches[0].clientX, offset };
        }}
        onTouchMove={(e) => {
          if (!touchStart.current) return;
          const dx = e.touches[0].clientX - touchStart.current.x;
          setOffset(Math.min(0, Math.max(-DELETE_WIDTH, touchStart.current.offset + dx)));
        }}
        onTouchEnd={() => {
          touchStart.current = null;
          setOffset((o) => (o < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0));
        }}
      >
        <button
          onClick={toggleStatus}
          aria-label={completed ? "Mark as in progress" : "Mark as completed"}
          className={`flex size-5 shrink-0 items-center justify-center border-2 border-primary ${
            completed ? "text-primary" : "text-transparent"
          }`}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </button>
        <button onClick={() => onEdit(task)} className="min-w-0 flex-1 text-left">
          <p className={`truncate text-sm font-medium ${completed ? "line-through" : ""}`}>
            {task.title}
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-xs text-neutral-400">
            {formatDueAt(task.dueAt)}
            {task.priority && (
              <span className={`rounded px-1.5 capitalize ${priorityStyles[task.priority]}`}>
                {task.priority}
              </span>
            )}
          </p>
        </button>
        <button
          onClick={() => deleteTask.mutate(task.id)}
          aria-label="Delete task"
          className="text-neutral-400"
        >
          <Trash2 className="size-5" strokeWidth={1.5} />
        </button>
        <button onClick={() => onEdit(task)} aria-label="Edit task" className="text-neutral-400">
          <SquarePen className="size-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
