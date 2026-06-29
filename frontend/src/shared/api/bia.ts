import client from "./client";
import type { BiaAssessment, UpsertBiaPayload } from "../types/bia";

export function getAssessments(instanceId: string): Promise<BiaAssessment[]> {
  return client.get(`/api/instances/${instanceId}/bia`).then((r) => r.data);
}

export function getAssessment(instanceId: string, processId: string): Promise<BiaAssessment> {
  return client.get(`/api/instances/${instanceId}/bia/${processId}`).then((r) => r.data);
}

export function upsertAssessment(instanceId: string, processId: string, payload: UpsertBiaPayload): Promise<BiaAssessment> {
  return client.put(`/api/instances/${instanceId}/bia/${processId}`, payload).then((r) => r.data);
}
