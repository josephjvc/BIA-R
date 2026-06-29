package com.biar.dto.bia;

import java.math.BigDecimal;

public class UpsertBiaRequest {

    private Integer mtpd;
    private Integer rto;
    private Integer rpo;
    private BigDecimal impactScore;
    private String criticality;
    private String impactCategories;
    private String notes;

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
}
