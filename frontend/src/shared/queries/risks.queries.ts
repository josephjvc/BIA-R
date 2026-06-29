import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../api/risks";
import type { CreateRiskPayload, UpdateRiskPayload } from "../types/risk";

export function useRisks(instanceId: string | undefined) {
  return useQuery({
    queryKey: ["risks", instanceId],
    queryFn: () => api.getRisks(instanceId!),
    enabled: !!instanceId,
  });
}

export function useRisk(instanceId: string | undefined, riskId: string | undefined) {
  return useQuery({
    queryKey: ["risks", instanceId, riskId],
    queryFn: () => api.getRisk(instanceId!, riskId!),
    enabled: !!instanceId && !!riskId,
  });
}

export function useCreateRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, data }: { instanceId: string; data: CreateRiskPayload }) =>
      api.createRisk(instanceId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["risks", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Risk created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, riskId, data }: { instanceId: string; riskId: string; data: UpdateRiskPayload }) =>
      api.updateRisk(instanceId, riskId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["risks", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Risk updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, riskId }: { instanceId: string; riskId: string }) =>
      api.deleteRisk(instanceId, riskId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["risks", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("Risk deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
