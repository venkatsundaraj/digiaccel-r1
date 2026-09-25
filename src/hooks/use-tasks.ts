"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type TaskInput,
} from "@/server/actions/tasks";

export function useTasks(search = "") {
  return useQuery({
    queryKey: ["tasks", search],
    queryFn: () => getTasks(search),
  });
}

function useInvalidateTasks() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["tasks"] });
}

export function useCreateTask() {
  const onSuccess = useInvalidateTasks();
  return useMutation({
    mutationFn: (input: TaskInput) => createTask(input),
    onSuccess,
  });
}

export function useUpdateTask() {
  const onSuccess = useInvalidateTasks();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TaskInput> }) =>
      updateTask(id, input),
    onSuccess,
  });
}

export function useDeleteTask() {
  const onSuccess = useInvalidateTasks();
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess,
  });
}
