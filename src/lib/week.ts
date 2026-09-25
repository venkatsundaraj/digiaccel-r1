import type { Task } from "@/server/db/schema";

export type Week = { start: Date; end: Date; tasks: Task[] };

export function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  return d;
}

export function groupByWeek(tasks: Task[]): Week[] {
  const weeks = new Map<number, Week>();
  for (const task of tasks) {
    const start = startOfWeek(new Date(task.dueAt));
    const key = start.getTime();
    if (!weeks.has(key)) {
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      weeks.set(key, { start, end, tasks: [] });
    }
    weeks.get(key)!.tasks.push(task);
  }
  return [...weeks.values()].sort((a, b) => a.start.getTime() - b.start.getTime());
}

const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

export function formatWeekRange(week: Week) {
  return `${dayMonth.format(week.start)} – ${dayMonth.format(week.end)}`;
}

export function formatDueAt(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
