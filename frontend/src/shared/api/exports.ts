import client from "./client";

export function getExports(instanceId: string): Promise<{ id: string; type: string; fileName: string; fileSize: number | null; exportedByName: string; createdAt: string }[]> {
  return client.get(`/api/instances/${instanceId}/exports`).then((r) => r.data);
}

export function createExport(instanceId: string, payload: { type: string; fileName?: string }): Promise<{ id: string; type: string; fileName: string; createdAt: string }> {
  return client.post(`/api/instances/${instanceId}/exports`, payload).then((r) => r.data);
}
