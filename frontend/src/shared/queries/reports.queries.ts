import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../api/reports";
import type { GenerateReportPayload } from "../types/report";

export function useReports(instanceId: string | undefined) {
  return useQuery({
    queryKey: ["reports", instanceId],
    queryFn: () => api.getReports(instanceId!),
    enabled: !!instanceId,
  });
}

export function useReport(instanceId: string | undefined, reportId: string | undefined) {
  return useQuery({
    queryKey: ["reports", instanceId, reportId],
    queryFn: () => api.getReport(instanceId!, reportId!),
    enabled: !!instanceId && !!reportId,
  });
}

export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ instanceId, data }: { instanceId: string; data: GenerateReportPayload }) =>
      api.generateReport(instanceId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["reports", variables.instanceId] });
      toast.success("Report generated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
