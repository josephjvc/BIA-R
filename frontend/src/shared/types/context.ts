export interface ProcessActivity {
  id: string;
  processId: string;
  name: string;
  criticalTimePeriod: string | null;
  notes: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProcess {
  id: string;
  instanceId: string;
  name: string;
  businessUnit: string | null;
  owner: string | null;
  description: string | null;
  keyObjectives: string | null;
  country: string | null;
  region: string | null;
  sites: string | null;
  employeesCount: number | null;
  biaPeriodicity: string | null;
  criticalTimePeriod: string | null;
  criticality: string | null;
  status: string;
  notes: string | null;
  sortOrder: number;
  activities: ProcessActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProcessPayload {
  name: string;
  businessUnit?: string;
  owner?: string;
  description?: string;
  keyObjectives?: string;
  country?: string;
  region?: string;
  sites?: string;
  employeesCount?: number;
  biaPeriodicity?: string;
  criticalTimePeriod?: string;
  criticality?: string;
  notes?: string;
  sortOrder?: number;
}

export interface UpdateProcessPayload {
  name?: string;
  businessUnit?: string;
  owner?: string;
  description?: string;
  keyObjectives?: string;
  country?: string;
  region?: string;
  sites?: string;
  employeesCount?: number;
  biaPeriodicity?: string;
  criticalTimePeriod?: string;
  criticality?: string;
  notes?: string;
  sortOrder?: number;
}

export interface CreateActivityPayload {
  name: string;
  criticalTimePeriod?: string;
  notes?: string;
  sortOrder?: number;
}

export interface UpdateActivityPayload {
  name?: string;
  criticalTimePeriod?: string;
  notes?: string;
  sortOrder?: number;
}
