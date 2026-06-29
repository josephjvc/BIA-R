package com.biar.service;

import com.biar.dto.instance.InstanceDto;
import com.biar.entity.ReportType;
import com.biar.entity.User;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Service
public class PdfGenerationService {

    private static final Logger log = LoggerFactory.getLogger(PdfGenerationService.class);

    private final InstanceService instanceService;
    private final ContextService contextService;
    private final BiaService biaService;
    private final RiskService riskService;

    public PdfGenerationService(InstanceService instanceService,
                                 ContextService contextService,
                                 BiaService biaService,
                                 RiskService riskService) {
        this.instanceService = instanceService;
        this.contextService = contextService;
        this.biaService = biaService;
        this.riskService = riskService;
    }

    public byte[] generate(UUID instanceId, ReportType type, User user) {
        return switch (type) {
            case INSTANCE_SUMMARY -> generateInstanceSummary(instanceId, user);
            case INSTANCE_HISTORY -> generateInstanceSummary(instanceId, user);
            case BIA -> generateBiaReport(instanceId, user);
            case RISK -> generateRiskReport(instanceId, user);
            case EXECUTIVE_RESILIENCE -> generateExecutiveResilience(instanceId, user);
        };
    }

    public byte[] generateInstanceSummary(UUID instanceId, User user) {
        InstanceDto instance = instanceService.getInstance(instanceId, user);
        try (var doc = new PDDocument()) {
            var page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            try (var cs = new PDPageContentStream(doc, page)) {
                float y = page.getMediaBox().getHeight() - 50;
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 20);
                cs.newLineAtOffset(50, y);
                cs.showText("Instance Summary");
                cs.endText();

                y -= 30;
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(50, y);
                cs.showText("Generated: " + Instant.now().toString().substring(0, 19));
                cs.endText();

                y -= 20;
                drawLine(cs, 50, y, page.getMediaBox().getWidth() - 50, y);

                String[][] rows = {
                    {"Name", instance.getName()},
                    {"Description", instance.getDescription() != null ? instance.getDescription() : "-"},
                    {"Status", instance.getStatus()},
                    {"Version", instance.getVersion()},
                    {"Period", (instance.getPeriodStart() != null ? instance.getPeriodStart().toString() : "N/A") + " - " +
                               (instance.getPeriodEnd() != null ? instance.getPeriodEnd().toString() : "N/A")},
                    {"Created by", instance.getCreatedByName()},
                };

                y -= 20;
                for (var row : rows) {
                    cs.beginText();
                    cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 10);
                    cs.newLineAtOffset(50, y);
                    cs.showText(row[0]);
                    cs.endText();
                    cs.beginText();
                    cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                    cs.newLineAtOffset(180, y);
                    cs.showText(row[1]);
                    cs.endText();
                    y -= 18;
                }
            }
            var baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    public byte[] generateBiaReport(UUID instanceId, User user) {
        InstanceDto instance = instanceService.getInstance(instanceId, user);
        var assessments = biaService.getAssessments(instanceId);
        try (var doc = new PDDocument()) {
            var page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            try (var cs = new PDPageContentStream(doc, page)) {
                float y = page.getMediaBox().getHeight() - 50;
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
                cs.newLineAtOffset(50, y);
                cs.showText("BIA Report - " + instance.getName());
                cs.endText();

                y -= 30;
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(50, y);
                cs.showText("Business Impact Analysis per ISO 22317");
                cs.endText();

                y -= 20;
                drawLine(cs, 50, y, page.getMediaBox().getWidth() - 50, y);
                y -= 20;

                // Table header
                String[] headers = {"Process", "MTPD", "RTO", "RPO", "Score"};
                float[] colWidths = {200, 60, 60, 60, 70};
                float x = 50;
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 9);
                for (int i = 0; i < headers.length; i++) {
                    cs.beginText();
                    cs.newLineAtOffset(x, y);
                    cs.showText(headers[i]);
                    cs.endText();
                    x += colWidths[i];
                }
                y -= 15;
                drawLine(cs, 50, y, page.getMediaBox().getWidth() - 50, y);
                y -= 5;

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 9);
                for (var a : assessments) {
                    if (y < 40) { break; }
                    x = 50;
                    String[] values = {
                        a.getProcessName() != null ? a.getProcessName() : "-",
                        a.getMtpd() != null ? String.valueOf(a.getMtpd()) : "-",
                        a.getRto() != null ? String.valueOf(a.getRto()) : "-",
                        a.getRpo() != null ? String.valueOf(a.getRpo()) : "-",
                        a.getImpactScore() != null ? String.valueOf(a.getImpactScore()) : "-"
                    };
                    for (int i = 0; i < values.length; i++) {
                        cs.beginText();
                        cs.newLineAtOffset(x, y);
                        cs.showText(values[i].length() > 25 ? values[i].substring(0, 25) + "..." : values[i]);
                        cs.endText();
                        x += colWidths[i];
                    }
                    y -= 14;
                }
            }
            var baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    public byte[] generateRiskReport(UUID instanceId, User user) {
        InstanceDto instance = instanceService.getInstance(instanceId, user);
        var risks = riskService.getRisks(instanceId);
        try (var doc = new PDDocument()) {
            var page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            try (var cs = new PDPageContentStream(doc, page)) {
                float y = page.getMediaBox().getHeight() - 50;
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 18);
                cs.newLineAtOffset(50, y);
                cs.showText("Risk Report - " + instance.getName());
                cs.endText();

                y -= 30;
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(50, y);
                cs.showText("Risk Management per ISO 31000");
                cs.endText();

                y -= 20;
                drawLine(cs, 50, y, page.getMediaBox().getWidth() - 50, y);
                y -= 20;

                String[] headers = {"Risk", "Category", "Prob.", "Impact", "Level", "Treatment"};
                float[] colWidths = {140, 80, 40, 40, 60, 80};
                float x = 50;
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 9);
                for (int i = 0; i < headers.length; i++) {
                    cs.beginText();
                    cs.newLineAtOffset(x, y);
                    cs.showText(headers[i]);
                    cs.endText();
                    x += colWidths[i];
                }
                y -= 15;
                drawLine(cs, 50, y, page.getMediaBox().getWidth() - 50, y);
                y -= 5;

                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 9);
                for (var r : risks) {
                    if (y < 40) break;
                    x = 50;
                    String[] values = {
                        r.getName(),
                        r.getCategory() != null ? r.getCategory() : "-",
                        String.valueOf(r.getProbability()),
                        String.valueOf(r.getImpact()),
                        r.getRiskLevel() != null ? r.getRiskLevel() : "-",
                        r.getTreatment() != null ? r.getTreatment() : "-"
                    };
                    for (int i = 0; i < values.length; i++) {
                        cs.beginText();
                        cs.newLineAtOffset(x, y);
                        cs.showText(values[i].length() > 20 ? values[i].substring(0, 20) + "..." : values[i]);
                        cs.endText();
                        x += colWidths[i];
                    }
                    y -= 14;
                }
            }
            var baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    public byte[] generateExecutiveResilience(UUID instanceId, User user) {
        InstanceDto instance = instanceService.getInstance(instanceId, user);
        var risks = riskService.getRisks(instanceId);
        var assessments = biaService.getAssessments(instanceId);

        long totalRisks = risks.size();
        long highRisks = risks.stream().filter(r -> "HIGH".equals(r.getRiskLevel()) || "VERY_HIGH".equals(r.getRiskLevel())).count();
        long untreated = risks.stream().filter(r -> r.getTreatment() == null || r.getTreatment().isBlank()).count();
        long assessedProcesses = assessments.size();

        try (var doc = new PDDocument()) {
            var page = new PDPage(PDRectangle.A4);
            doc.addPage(page);
            try (var cs = new PDPageContentStream(doc, page)) {
                float y = page.getMediaBox().getHeight() - 50;
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 20);
                cs.newLineAtOffset(50, y);
                cs.showText("Executive Resilience Report");
                cs.endText();

                y -= 25;
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                cs.newLineAtOffset(50, y);
                cs.showText(instance.getName());
                cs.endText();

                y -= 12;
                cs.beginText();
                cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 10);
                cs.newLineAtOffset(50, y);
                cs.showText("Status: " + instance.getStatus());
                cs.endText();

                y -= 30;
                drawLine(cs, 50, y, page.getMediaBox().getWidth() - 50, y);
                y -= 25;

                String[][] kpis = {
                    {"Total Risks", String.valueOf(totalRisks)},
                    {"High / Critical Risks", String.valueOf(highRisks)},
                    {"Untreated Risks", String.valueOf(untreated)},
                    {"Assessed Processes", String.valueOf(assessedProcesses)}
                };
                for (var kpi : kpis) {
                    cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 22);
                    cs.beginText();
                    cs.newLineAtOffset(70, y);
                    cs.showText(kpi[1]);
                    cs.endText();
                    cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 9);
                    cs.beginText();
                    cs.newLineAtOffset(70, y - 14);
                    cs.showText(kpi[0]);
                    cs.endText();
                    y -= 50;
                }
            }
            var baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private void drawLine(PDPageContentStream cs, float x1, float y1, float x2, float y2) throws IOException {
        cs.setLineWidth(0.5f);
        cs.moveTo(x1, y1);
        cs.lineTo(x2, y2);
        cs.stroke();
    }
}
