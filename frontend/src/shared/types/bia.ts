export interface BiaAssessment {
  id: string;
  instanceId: string;
  processId: string;
  processName: string;
  mtpd: number | null;
  rto: number | null;
  rpo: number | null;
  impactScore: number | null;
  criticality: string | null;
  impactCategories: string | null;
  notes: string | null;
  assessedBy: string | null;
  assessedByName: string | null;
  assessedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertBiaPayload {
  mtpd?: number;
  rto?: number;
  rpo?: number;
  impactScore?: number;
  criticality?: string;
  impactCategories?: string;
  notes?: string;
}
