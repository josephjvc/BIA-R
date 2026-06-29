import client from "./client";
import type { DashboardData } from "../types/dashboard";

export function getDashboard(instanceId: string): Promise<DashboardData> {
  return client.get(`/api/instances/${instanceId}/dashboard`).then((r) => r.data);
}
