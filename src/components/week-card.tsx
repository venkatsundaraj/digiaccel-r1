"use client";

import { ChevronDown, SquareCheck, SquareX } from "lucide-react";
import { formatWeekRange, type Week } from "@/lib/week";
import type { Task } from "@/server/db/schema";
import { TaskRow } from "./task-row";

type Props = {
  week: Week;
  expanded: boolean;
  onToggle: () => void;
  onEdit: (task: Task) => void;
};

export function WeekCard({ week, expanded, onToggle, onEdit }: Props) {
  const completed = week.tasks.filter((t) => t.status === "completed").length;
  const open = week.tasks.length - completed;
  const progress = (completed / week.tasks.length) * 100;

  return (
    <section className="md:border md:border-neutral-200 md:p-5">
      <button onClick={onToggle} aria-expanded={expanded} className="w-full text-left">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{formatWeekRange(week)}</h2>
          <ChevronDown
            className={`size-5 text-neutral-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Tile
            icon={<SquareCheck className="size-6 text-primary" strokeWidth={1.5} />}
            label="Task Complete"
            count={completed}
            className="bg-primary-soft"
            iconClassName="bg-primary/20"
          />
          <Tile
            icon={<SquareX className="size-6 text-danger" strokeWidth={1.5} />}
            label="Task Pending"
            count={open}
            className="bg-danger-soft"
            iconClassName="bg-danger/20"
          />
        </div>
        <div className="mt-4 h-5 bg-primary-soft">
          <div className="h-full bg-primary-dark" style={{ width: `${progress}%` }} />
        </div>
      </button>
      {expanded && (
        <div className="mt-2">
          {week.tasks.map((task) => (
            <TaskRow key={task.id} task={task} onEdit={onEdit} />
          ))}
        </div>
      )}
    </section>
  );
}

type TileProps = {
  icon: React.ReactNode;
  label: string;
  count: number;
  className: string;
  iconClassName: string;
};

function Tile({ icon, label, count, className, iconClassName }: TileProps) {
  return (
    <div className={`flex gap-2 p-3 ${className}`}>
      <div className={`flex size-8 shrink-0 items-center justify-center ${iconClassName}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs">{label}</p>
        <p className="text-xl font-semibold">
          {String(count).padStart(2, "0")}{" "}
          <span className="text-[10px] font-normal whitespace-nowrap text-neutral-500">This Week</span>
        </p>
      </div>
    </div>
  );
}
