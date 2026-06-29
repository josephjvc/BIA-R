import client from "./client";
import type { Report, GenerateReportPayload } from "../types/report";

export function getReports(instanceId: string): Promise<Report[]> {
  return client.get(`/api/instances/${instanceId}/reports`).then((r) => r.data);
}

export function getReport(instanceId: string, reportId: string): Promise<Report> {
  return client.get(`/api/instances/${instanceId}/reports/${reportId}`).then((r) => r.data);
}

export function generateReport(instanceId: string, payload: GenerateReportPayload): Promise<Report> {
  return client.post(`/api/instances/${instanceId}/reports`, payload).then((r) => r.data);
}
