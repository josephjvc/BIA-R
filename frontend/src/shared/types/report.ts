export type ReportType = "instance_summary" | "instance_history" | "bia" | "risk" | "executive_resilience";

export interface Report {
  id: string;
  instanceId: string;
  type: ReportType;
  title: string;
  snapshot: string | null;
  generatedBy: string;
  generatedByName: string;
  createdAt: string;
}

export interface GenerateReportPayload {
  type: ReportType;
  title?: string;
}
