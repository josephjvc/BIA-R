import client from "./client";
import type {
  BusinessProcess, CreateProcessPayload, UpdateProcessPayload,
  ProcessActivity, CreateActivityPayload, UpdateActivityPayload,
} from "../types/context";

export function getProcesses(instanceId: string): Promise<BusinessProcess[]> {
  return client.get(`/api/instances/${instanceId}/processes`).then((r) => r.data);
}

export function getProcess(instanceId: string, processId: string): Promise<BusinessProcess> {
  return client.get(`/api/instances/${instanceId}/processes/${processId}`).then((r) => r.data);
}

export function createProcess(instanceId: string, payload: CreateProcessPayload): Promise<BusinessProcess> {
  return client.post(`/api/instances/${instanceId}/processes`, payload).then((r) => r.data);
}

export function updateProcess(instanceId: string, processId: string, payload: UpdateProcessPayload): Promise<BusinessProcess> {
  return client.put(`/api/instances/${instanceId}/processes/${processId}`, payload).then((r) => r.data);
}

export function deleteProcess(instanceId: string, processId: string): Promise<void> {
  return client.delete(`/api/instances/${instanceId}/processes/${processId}`).then((r) => r.data);
}

export function createActivity(instanceId: string, processId: string, payload: CreateActivityPayload): Promise<ProcessActivity> {
  return client.post(`/api/instances/${instanceId}/processes/${processId}/activities`, payload).then((r) => r.data);
}

export function updateActivity(instanceId: string, processId: string, activityId: string, payload: UpdateActivityPayload): Promise<ProcessActivity> {
  return client.put(`/api/instances/${instanceId}/processes/${processId}/activities/${activityId}`, payload).then((r) => r.data);
}

export function deleteActivity(instanceId: string, processId: string, activityId: string): Promise<void> {
  return client.delete(`/api/instances/${instanceId}/processes/${processId}/activities/${activityId}`).then((r) => r.data);
}
