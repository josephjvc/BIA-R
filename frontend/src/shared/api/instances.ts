import client from "./client";
import type {
  Instance, InstanceSummary, CreateInstancePayload, UpdateInstancePayload,
  InstanceParticipant, AddParticipantPayload, StatusActionPayload, InstanceStatus,
} from "../types/instance";

const VALID_STATUSES: InstanceStatus[] = [
  "in_progress", "completed", "reviewed", "approved", "disapproved", "finished", "archived",
];

function normalizeStatus(s: string | null | undefined): InstanceStatus {
  if (s && (VALID_STATUSES as string[]).includes(s)) return s as InstanceStatus;
  return "in_progress";
}

function normalizeInstance<T extends { status: string }>(inst: T): T {
  return { ...inst, status: normalizeStatus(inst.status) as any };
}

export function getInstances(): Promise<InstanceSummary[]> {
  return client.get("/api/instances").then((r) => r.data.map(normalizeInstance));
}

export function getInstance(id: string): Promise<Instance> {
  return client.get(`/api/instances/${id}`).then((r) => normalizeInstance(r.data));
}

export function createInstance(payload: CreateInstancePayload): Promise<Instance> {
  return client.post("/api/instances", payload).then((r) => r.data);
}

export function updateInstance(id: string, payload: UpdateInstancePayload): Promise<Instance> {
  return client.put(`/api/instances/${id}`, payload).then((r) => r.data);
}

export function deleteInstance(id: string): Promise<void> {
  return client.delete(`/api/instances/${id}`).then((r) => r.data);
}

export function duplicateInstance(id: string): Promise<Instance> {
  return client.post(`/api/instances/${id}/duplicate`).then((r) => r.data);
}

export function updateInstanceStatus(id: string, payload: StatusActionPayload): Promise<Instance> {
  return client.put(`/api/instances/${id}/status`, payload).then((r) => r.data);
}

export function archiveInstance(id: string, reason?: string): Promise<Instance> {
  return client.post(`/api/instances/${id}/archive`, reason ? { reason } : undefined).then((r) => r.data);
}

export function getActivityLog(id: string): Promise<{ id: string; action: string; details: string | null; createdAt: string; user: { id: string; displayName: string } }[]> {
  return client.get(`/api/instances/${id}/activity-log`).then((r) => r.data);
}

export function getParticipants(id: string): Promise<InstanceParticipant[]> {
  return client.get(`/api/instances/${id}/participants`).then((r) => r.data);
}

export function addParticipant(id: string, payload: AddParticipantPayload): Promise<InstanceParticipant> {
  return client.post(`/api/instances/${id}/participants`, payload).then((r) => r.data);
}

export function removeParticipant(id: string, participantId: string): Promise<void> {
  return client.delete(`/api/instances/${id}/participants/${participantId}`).then((r) => r.data);
}
