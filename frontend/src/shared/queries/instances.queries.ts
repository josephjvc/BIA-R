import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../api/instances";
import { useInstanceStore } from "../store/instance.store";
import type { CreateInstancePayload, UpdateInstancePayload, StatusActionPayload, AddParticipantPayload } from "../types/instance";

export function useInstances() {
  return useQuery({
    queryKey: ["instances"],
    queryFn: api.getInstances,
  });
}

export function useInstance(id: string | undefined) {
  return useQuery({
    queryKey: ["instances", id],
    queryFn: () => api.getInstance(id!),
    enabled: !!id,
  });
}

export function useCreateInstance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInstancePayload) => api.createInstance(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Instance created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateInstance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInstancePayload }) => api.updateInstance(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Instance updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteInstance() {
  const qc = useQueryClient();
  const clearActiveInstance = useInstanceStore((s) => s.clearActiveInstance);
  return useMutation({
    mutationFn: (id: string) => api.deleteInstance(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instances"] });
      clearActiveInstance();
      toast.success("Instance deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDuplicateInstance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.duplicateInstance(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Instance duplicated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StatusActionPayload }) => api.updateInstanceStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useArchiveInstance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => api.archiveInstance(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Instance archived");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useActivityLog(instanceId: string | undefined) {
  return useQuery({
    queryKey: ["instances", instanceId, "activity-log"],
    queryFn: () => api.getActivityLog(instanceId!),
    enabled: !!instanceId,
  });
}

export function useParticipants(instanceId: string | undefined) {
  return useQuery({
    queryKey: ["instances", instanceId, "participants"],
    queryFn: () => api.getParticipants(instanceId!),
    enabled: !!instanceId,
  });
}

export function useAddParticipant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, data }: { instanceId: string; data: AddParticipantPayload }) =>
      api.addParticipant(instanceId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["instances", variables.instanceId, "participants"] });
      toast.success("Participant added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRemoveParticipant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, participantId }: { instanceId: string; participantId: string }) =>
      api.removeParticipant(instanceId, participantId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["instances", variables.instanceId, "participants"] });
      toast.success("Participant removed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
