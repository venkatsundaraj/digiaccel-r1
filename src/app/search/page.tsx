"use client";

import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TaskRow } from "@/components/task-row";
import { TaskSheet } from "@/components/task-sheet";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@/server/db/schema";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Task | null>(null);
  const { data: tasks = [], isFetching } = useTasks(search);

  useEffect(() => {
    const id = setTimeout(() => setSearch(query.trim()), 300);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pt-8 pb-8 md:px-10">
      <Link href="/home" aria-label="Back" className="w-fit">
        <ArrowLeft className="size-6" />
      </Link>

      <label className="mt-6 flex items-center gap-2 border border-neutral-200 px-4 py-3">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a task"
          className="flex-1 text-sm outline-none"
        />
        <Search className="size-5" />
      </label>

      <div className="mt-4">
        {!isFetching && tasks.length === 0 && (
          <p className="text-sm text-neutral-500">No tasks found</p>
        )}
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onEdit={setEditing} />
        ))}
      </div>

      {editing && <TaskSheet task={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
