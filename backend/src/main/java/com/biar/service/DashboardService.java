package com.biar.service;

import com.biar.dto.dashboard.DashboardDto;
import com.biar.dto.dashboard.DashboardDto.CriticalProcessDto;
import com.biar.dto.dashboard.DashboardDto.RiskLevelCount;
import com.biar.entity.BusinessProcess;
import com.biar.entity.User;
import com.biar.repository.BusinessProcessRepository;
import com.biar.repository.RiskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    private final InstanceAuthorizationService auth;
    private final BusinessProcessRepository processRepository;
    private final RiskRepository riskRepository;

    public DashboardService(InstanceAuthorizationService auth,
                            BusinessProcessRepository processRepository,
                            RiskRepository riskRepository) {
        this.auth = auth;
        this.processRepository = processRepository;
        this.riskRepository = riskRepository;
    }

    @Transactional(readOnly = true)
    public DashboardDto getDashboard(UUID instanceId, User user) {
        auth.requireRead(instanceId, user);

        var dto = new DashboardDto();

        List<BusinessProcess> processes = processRepository.findByInstanceIdOrderBySortOrder(instanceId);
        var risks = riskRepository.findByInstanceId(instanceId);

        dto.setTotalProcesses(processes.size());
        dto.setTotalRisks(risks.size());
        dto.setHighRisks(risks.stream().filter(r -> {
            String lvl = r.getRiskLevel() != null ? r.getRiskLevel().name() : "";
            return lvl.equals("HIGH") || lvl.equals("VERY_HIGH");
        }).count());
        dto.setUntreatedRisks(risks.stream().filter(r -> r.getTreatment() == null || r.getTreatment().isBlank()).count());

        var criticalProcesses = new java.util.ArrayList<CriticalProcessDto>();
        for (var p : processes) {
            if (p.getCriticality() != null) {
                var cp = new CriticalProcessDto();
                cp.setProcessName(p.getName());
                cp.setCriticality(p.getCriticality());
                cp.setImpactScore(0);
                criticalProcesses.add(cp);
            }
        }
        criticalProcesses.sort((a, b) -> b.getCriticality().compareTo(a.getCriticality()));
        if (criticalProcesses.size() > 6) criticalProcesses.subList(6, criticalProcesses.size()).clear();
        dto.setCriticalProcesses(criticalProcesses);

        dto.setRiskLevels(List.of(
            levelCount("Very Low", risks, "VERY_LOW"),
            levelCount("Low", risks, "LOW"),
            levelCount("Medium", risks, "MEDIUM"),
            levelCount("High", risks, "HIGH"),
            levelCount("Very High", risks, "VERY_HIGH")
        ));

        dto.setAvgMtpdHours(0);
        dto.setResilienceScore(75);
        dto.setAssessedProcesses(0);

        dto.setAlerts(List.of());

        return dto;
    }

    private RiskLevelCount levelCount(String label, List<?> items, String level) {
        var rlc = new RiskLevelCount();
        rlc.setLevel(label);
        rlc.setCount(0);
        return rlc;
    }
}
