"use client";

import { CalendarDays, Clock, X } from "lucide-react";
import { useState } from "react";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import type { Priority, Task } from "@/server/db/schema";

const priorities: Priority[] = ["low", "medium", "high"];

const pad = (n: number) => String(n).padStart(2, "0");
const toDateInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toTimeInput = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

type Props = { task?: Task; onClose: () => void };

export function TaskSheet({ task, onClose }: Props) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const initial = task ? new Date(task.dueAt) : new Date();

  const [title, setTitle] = useState(task?.title ?? "");
  const [date, setDate] = useState(toDateInput(initial));
  const [time, setTime] = useState(toTimeInput(initial));
  const [priority, setPriority] = useState<Priority | null>(task?.priority ?? null);
  const [description, setDescription] = useState(task?.description ?? "");
  const [error, setError] = useState("");

  const pending = createTask.isPending || updateTask.isPending;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError("Task title is required");
    if (!date || !time) return setError("Date and time are required");
    setError("");

    const input = {
      title,
      description: description || null,
      dueAt: new Date(`${date}T${time}`),
      priority,
    };
    const options = { onSuccess: onClose, onError: () => setError("Something went wrong") };
    if (task) updateTask.mutate({ id: task.id, input }, options);
    else createTask.mutate(input, options);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/30 md:items-center md:justify-center md:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={submit}
        className="flex max-h-full w-full flex-col gap-4 overflow-y-auto bg-white px-6 pt-6 pb-8 md:max-w-lg md:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{task ? "Edit Task" : "Add New Task"}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        <Field label="Task title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Doing Homework"
            className="w-full border border-neutral-200 px-3 py-2.5 text-sm outline-primary"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Set Date">
            <label className="flex items-center gap-2 border border-neutral-200 px-3 py-2.5">
              <CalendarDays className="size-4 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-w-0 text-sm outline-none"
              />
            </label>
          </Field>
          <Field label="Set Time">
            <label className="flex items-center gap-2 border border-neutral-200 px-3 py-2.5">
              <Clock className="size-4 shrink-0" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full min-w-0 text-sm outline-none"
              />
            </label>
          </Field>
        </div>

        <Field label="Priority">
          <div className="grid grid-cols-3 gap-2">
            {priorities.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(priority === p ? null : p)}
                className={`border py-2 text-sm capitalize ${
                  priority === p
                    ? "border-primary bg-primary text-white"
                    : "border-neutral-200 text-neutral-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add Description"
            rows={3}
            className="w-full resize-none border border-neutral-200 px-3 py-2.5 text-sm outline-primary"
          />
        </Field>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="bg-primary py-3 font-medium text-white disabled:opacity-60"
        >
          {task ? "Save" : "Create task"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-neutral-500">{label}</span>
      {children}
    </div>
  );
}
