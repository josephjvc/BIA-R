import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../api/bia";
import type { UpsertBiaPayload } from "../types/bia";

export function useAssessments(instanceId: string | undefined) {
  return useQuery({
    queryKey: ["bia", instanceId],
    queryFn: () => api.getAssessments(instanceId!),
    enabled: !!instanceId,
  });
}

export function useAssessment(instanceId: string | undefined, processId: string | undefined) {
  return useQuery({
    queryKey: ["bia", instanceId, processId],
    queryFn: () => api.getAssessment(instanceId!, processId!),
    enabled: !!instanceId && !!processId,
  });
}

export function useUpsertAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, processId, data }: { instanceId: string; processId: string; data: UpsertBiaPayload }) =>
      api.upsertAssessment(instanceId, processId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["bia", variables.instanceId] });
      qc.invalidateQueries({ queryKey: ["instances"] });
      toast.success("BIA assessment saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
