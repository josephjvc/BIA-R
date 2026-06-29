export interface ActivityLogEntry {
  id: string;
  instanceId: string;
  userId: string;
  action: string;
  details: string | null;
  createdAt: string;
}
