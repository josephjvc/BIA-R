import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../api/context";
import type { CreateProcessPayload, UpdateProcessPayload, CreateActivityPayload, UpdateActivityPayload } from "../types/context";

export function useProcesses(instanceId: string | undefined) {
  return useQuery({
    queryKey: ["context", instanceId, "processes"],
    queryFn: () => api.getProcesses(instanceId!),
    enabled: !!instanceId,
  });
}

export function useProcess(instanceId: string | undefined, processId: string | undefined) {
  return useQuery({
    queryKey: ["context", instanceId, "processes", processId],
    queryFn: () => api.getProcess(instanceId!, processId!),
    enabled: !!instanceId && !!processId,
  });
}

export function useCreateProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, data }: { instanceId: string; data: CreateProcessPayload }) =>
      api.createProcess(instanceId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["context", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Process created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, processId, data }: { instanceId: string; processId: string; data: UpdateProcessPayload }) =>
      api.updateProcess(instanceId, processId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["context", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Process updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, processId }: { instanceId: string; processId: string }) =>
      api.deleteProcess(instanceId, processId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["context", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Process deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, processId, data }: { instanceId: string; processId: string; data: CreateActivityPayload }) =>
      api.createActivity(instanceId, processId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["context", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Activity created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, processId, activityId, data }: { instanceId: string; processId: string; activityId: string; data: UpdateActivityPayload }) =>
      api.updateActivity(instanceId, processId, activityId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["context", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Activity updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, processId, activityId }: { instanceId: string; processId: string; activityId: string }) =>
      api.deleteActivity(instanceId, processId, activityId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["context", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Activity deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
