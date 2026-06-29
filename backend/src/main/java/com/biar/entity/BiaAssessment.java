package com.biar.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "bia_assessments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"instance_id", "process_id"})
})
public class BiaAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instance_id", nullable = false)
    private Instance instance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    private BusinessProcess process;

    private Integer mtpd;
    private Integer rto;
    private Integer rpo;

    @Column(name = "impact_score", precision = 5, scale = 2)
    private BigDecimal impactScore;

    private String criticality;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "impact_categories", columnDefinition = "JSONB")
    private String impactCategories;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessed_by")
    private User assessedBy;

    @Column(name = "assessed_at")
    private Instant assessedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public BiaAssessment() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Instance getInstance() { return instance; }
    public void setInstance(Instance instance) { this.instance = instance; }
    public BusinessProcess getProcess() { return process; }
    public void setProcess(BusinessProcess process) { this.process = process; }
    public Integer getMtpd() { return mtpd; }
    public void setMtpd(Integer mtpd) { this.mtpd = mtpd; }
    public Integer getRto() { return rto; }
    public void setRto(Integer rto) { this.rto = rto; }
    public Integer getRpo() { return rpo; }
    public void setRpo(Integer rpo) { this.rpo = rpo; }
    public BigDecimal getImpactScore() { return impactScore; }
    public void setImpactScore(BigDecimal impactScore) { this.impactScore = impactScore; }
    public String getCriticality() { return criticality; }
    public void setCriticality(String criticality) { this.criticality = criticality; }
    public String getImpactCategories() { return impactCategories; }
    public void setImpactCategories(String impactCategories) { this.impactCategories = impactCategories; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public User getAssessedBy() { return assessedBy; }
    public void setAssessedBy(User assessedBy) { this.assessedBy = assessedBy; }
    public Instant getAssessedAt() { return assessedAt; }
    public void setAssessedAt(Instant assessedAt) { this.assessedAt = assessedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
