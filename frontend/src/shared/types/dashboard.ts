export interface CriticalProcess {
  processName: string;
  impactScore: number;
  criticality: string;
}

export interface RiskLevelCount {
  level: string;
  count: number;
}

export interface DashboardData {
  totalProcesses: number;
  totalRisks: number;
  highRisks: number;
  untreatedRisks: number;
  assessedProcesses: number;
  avgMtpdHours: number;
  resilienceScore: number;
  criticalProcesses: CriticalProcess[];
  riskLevels: RiskLevelCount[];
  alerts: string[];
}
