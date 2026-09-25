"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TaskSheet } from "@/components/task-sheet";
import { WeekCard } from "@/components/week-card";
import { useTasks } from "@/hooks/use-tasks";
import { groupByWeek, startOfWeek } from "@/lib/week";
import type { Task } from "@/server/db/schema";

export default function Home() {
  const { data: tasks = [], isPending, isError } = useTasks();
  const [expanded, setExpanded] = useState(() => new Set([startOfWeek(new Date()).getTime()]));
  const [sheet, setSheet] = useState<{ task?: Task } | null>(null);
  const weeks = groupByWeek(tasks);

  const toggle = (key: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pt-8 pb-28 md:px-10 md:pb-10">
      <div className="flex gap-4">
        <Link
          href="/search"
          className="flex flex-1 items-center justify-between border border-neutral-200 px-4 py-3 text-sm text-neutral-500 md:max-w-md"
        >
          Search for a task
          <Search className="size-5 text-neutral-900" />
        </Link>
        <button
          onClick={() => setSheet({})}
          className="ml-auto hidden items-center gap-2 bg-primary px-5 text-sm font-medium text-white md:flex"
        >
          <Plus className="size-4" />
          Add Task
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-10 md:gap-6">
        {isPending && <p className="text-sm text-neutral-500">Loading tasks…</p>}
        {isError && <p className="text-sm text-danger">Failed to load tasks</p>}
        {!isPending && !isError && weeks.length === 0 && (
          <p className="text-sm text-neutral-500">No tasks yet. Add one to get started.</p>
        )}
        {weeks.map((week) => {
          const key = week.start.getTime();
          return (
            <WeekCard
              key={key}
              week={week}
              expanded={expanded.has(key)}
              onToggle={() => toggle(key)}
              onEdit={(task) => setSheet({ task })}
            />
          );
        })}
      </div>

      <button
        onClick={() => setSheet({})}
        aria-label="Add task"
        className="fixed bottom-8 left-1/2 flex size-16 md:hidden -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg"
      >
        <Plus className="size-7" />
      </button>

      {sheet && <TaskSheet task={sheet.task} onClose={() => setSheet(null)} />}
    </div>
  );
}
