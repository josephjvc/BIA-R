import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard";

export function useDashboard(instanceId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", instanceId],
    queryFn: () => getDashboard(instanceId!),
    enabled: !!instanceId,
  });
}
