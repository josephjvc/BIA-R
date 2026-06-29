export type RiskLevel = "very_low" | "low" | "medium" | "high" | "very_high";

export interface Risk {
  id: string;
  instanceId: string;
  processId: string | null;
  processName: string | null;
  name: string;
  description: string | null;
  category: string | null;
  probability: number | null;
  impact: number | null;
  riskLevel: RiskLevel | null;
  treatment: string | null;
  actionPlan: string | null;
  owner: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRiskPayload {
  name: string;
  processId?: string;
  description?: string;
  category?: string;
  probability?: number;
  impact?: number;
  treatment?: string;
  actionPlan?: string;
  owner?: string;
  notes?: string;
}

export interface UpdateRiskPayload {
  name?: string;
  processId?: string;
  description?: string;
  category?: string;
  probability?: number;
  impact?: number;
  treatment?: string;
  actionPlan?: string;
  owner?: string;
  status?: string;
  notes?: string;
}
