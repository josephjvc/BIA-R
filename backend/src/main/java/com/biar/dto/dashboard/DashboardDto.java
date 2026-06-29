package com.biar.dto.dashboard;

import java.util.List;

public class DashboardDto {

    private long totalProcesses;
    private long totalRisks;
    private long highRisks;
    private long untreatedRisks;
    private long assessedProcesses;
    private double avgMtpdHours;
    private double resilienceScore;
    private List<CriticalProcessDto> criticalProcesses;
    private List<RiskLevelCount> riskLevels;
    private List<String> alerts;

    public long getTotalProcesses() { return totalProcesses; }
    public void setTotalProcesses(long totalProcesses) { this.totalProcesses = totalProcesses; }
    public long getTotalRisks() { return totalRisks; }
    public void setTotalRisks(long totalRisks) { this.totalRisks = totalRisks; }
    public long getHighRisks() { return highRisks; }
    public void setHighRisks(long highRisks) { this.highRisks = highRisks; }
    public long getUntreatedRisks() { return untreatedRisks; }
    public void setUntreatedRisks(long untreatedRisks) { this.untreatedRisks = untreatedRisks; }
    public long getAssessedProcesses() { return assessedProcesses; }
    public void setAssessedProcesses(long assessedProcesses) { this.assessedProcesses = assessedProcesses; }
    public double getAvgMtpdHours() { return avgMtpdHours; }
    public void setAvgMtpdHours(double avgMtpdHours) { this.avgMtpdHours = avgMtpdHours; }
    public double getResilienceScore() { return resilienceScore; }
    public void setResilienceScore(double resilienceScore) { this.resilienceScore = resilienceScore; }
    public List<CriticalProcessDto> getCriticalProcesses() { return criticalProcesses; }
    public void setCriticalProcesses(List<CriticalProcessDto> criticalProcesses) { this.criticalProcesses = criticalProcesses; }
    public List<RiskLevelCount> getRiskLevels() { return riskLevels; }
    public void setRiskLevels(List<RiskLevelCount> riskLevels) { this.riskLevels = riskLevels; }
    public List<String> getAlerts() { return alerts; }
    public void setAlerts(List<String> alerts) { this.alerts = alerts; }

    public static class CriticalProcessDto {
        private String processName;
        private double impactScore;
        private String criticality;
        public String getProcessName() { return processName; }
        public void setProcessName(String processName) { this.processName = processName; }
        public double getImpactScore() { return impactScore; }
        public void setImpactScore(double impactScore) { this.impactScore = impactScore; }
        public String getCriticality() { return criticality; }
        public void setCriticality(String criticality) { this.criticality = criticality; }
    }

    public static class RiskLevelCount {
        private String level;
        private long count;
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }
}
