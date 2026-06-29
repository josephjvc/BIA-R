export type InstanceStatus = "in_progress" | "completed" | "reviewed" | "approved" | "disapproved" | "finished" | "archived";

export interface InstanceSummary {
  id: string;
  name: string;
  version: string;
  status: InstanceStatus;
  createdByName: string;
  processCount: number;
  riskCount: number;
  activityCount: number;
  biaAssessmentCount: number;
  reportCount: number;
  org: string;
  createdAt: string;
  updatedAt: string;
}

export interface Instance {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  version: string;
  status: InstanceStatus;
  periodStart: string | null;
  periodEnd: string | null;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstancePayload {
  name: string;
  description?: string;
  periodStart?: string;
  periodEnd?: string;
  organizationName?: string;
}

export interface UpdateInstancePayload {
  name?: string;
  description?: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface InstanceParticipant {
  id: string;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  role: string;
  createdAt: string;
}

export interface AddParticipantPayload {
  userId: string;
  role: string;
}

export interface StatusActionPayload {
  action: string;
  reason?: string;
}
