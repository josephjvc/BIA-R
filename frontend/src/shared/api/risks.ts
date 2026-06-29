import client from "./client";
import type { Risk, CreateRiskPayload, UpdateRiskPayload } from "../types/risk";

export function getRisks(instanceId: string): Promise<Risk[]> {
  return client.get(`/api/instances/${instanceId}/risks`).then((r) => r.data);
}

export function getRisk(instanceId: string, riskId: string): Promise<Risk> {
  return client.get(`/api/instances/${instanceId}/risks/${riskId}`).then((r) => r.data);
}

export function createRisk(instanceId: string, payload: CreateRiskPayload): Promise<Risk> {
  return client.post(`/api/instances/${instanceId}/risks`, payload).then((r) => r.data);
}

export function updateRisk(instanceId: string, riskId: string, payload: UpdateRiskPayload): Promise<Risk> {
  return client.put(`/api/instances/${instanceId}/risks/${riskId}`, payload).then((r) => r.data);
}

export function deleteRisk(instanceId: string, riskId: string): Promise<void> {
  return client.delete(`/api/instances/${instanceId}/risks/${riskId}`).then((r) => r.data);
}
