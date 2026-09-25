"use server";

import { asc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db";
import { priorityEnum, statusEnum, tasks } from "@/server/db/schema";

const taskInput = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().nullish(),
  dueAt: z.coerce.date(),
  priority: z.enum(priorityEnum.enumValues).nullish(),
  status: z.enum(statusEnum.enumValues).optional(),
});

export type TaskInput = z.input<typeof taskInput>;

export async function getTasks(search?: string) {
  const q = search?.trim();
  return db
    .select()
    .from(tasks)
    .where(
      q
        ? or(ilike(tasks.title, `%${q}%`), ilike(tasks.description, `%${q}%`))
        : undefined,
    )
    .orderBy(asc(tasks.dueAt));
}

export async function createTask(input: TaskInput) {
  const data = taskInput.parse(input);
  const [task] = await db.insert(tasks).values(data).returning();
  return task;
}

export async function updateTask(id: string, input: Partial<TaskInput>) {
  const data = taskInput.partial().parse(input);
  const [task] = await db
    .update(tasks)
    .set(data)
    .where(eq(tasks.id, id))
    .returning();
  return task;
}

export async function deleteTask(id: string) {
  await db.delete(tasks).where(eq(tasks.id, id));
  return id;
}
