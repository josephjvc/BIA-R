import { useSyncExternalStore } from "react";

export type Lang = "en" | "es";
let current: Lang = "en";
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
export function setLang(l: Lang) { current = l; listeners.forEach(cb => cb()); }
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, () => current, () => current);
}

type Dict = Record<string, { en: string; es: string }>;
const dict: Dict = {
  // Sidebar
  "nav.instances": { en: "Instances", es: "Instancias" },
  "nav.dashboard": { en: "Dashboard", es: "Panel" },
  "nav.context": { en: "Organizational Context", es: "Contexto Organizacional" },
  "nav.bia": { en: "BIA", es: "BIA" },
  "nav.risks": { en: "Risks", es: "Riesgos" },
  "nav.inter": { en: "Interdependencies", es: "Interdependencias" },
  "nav.reports": { en: "Reports", es: "Reportes" },
  "nav.settings": { en: "Settings", es: "Ajustes" },
  "side.compliance": { en: "Compliance certified", es: "Cumplimiento certificado" },

  // Header / meta
  "meta.instances.t": { en: "Continuity Instances", es: "Instancias de Continuidad" },
  "meta.instances.s": { en: "Create, manage and track continuity analysis workspaces.", es: "Crea, administra y supervisa los espacios de análisis de continuidad." },
  "meta.dashboard.t": { en: "Operational Resilience Dashboard", es: "Panel de Resiliencia Operacional" },
  "meta.dashboard.s": { en: "Real-time view of continuity, BIA and risk indicators.", es: "Vista en tiempo real de continuidad, BIA y riesgos." },
  "meta.context.t": { en: "Organizational Context", es: "Contexto Organizacional" },
  "meta.context.s": { en: "Business units, processes, assets and interdependencies.", es: "Unidades de negocio, procesos, activos e interdependencias." },
  "meta.bia.t": { en: "Business Impact Analysis", es: "Análisis de Impacto al Negocio" },
  "meta.bia.s": { en: "ISO 22317 · Configure criteria and assess process impact.", es: "ISO 22317 · Configura criterios y evalúa el impacto." },
  "meta.risks.t": { en: "Risk Management", es: "Gestión de Riesgos" },
  "meta.risks.s": { en: "ISO 31000 · Threats, treatments and 5×5 risk matrix.", es: "ISO 31000 · Amenazas, tratamientos y matriz 5×5." },
  "meta.integrated.t": { en: "Integrated BIA-Risk View", es: "Vista Integrada BIA-Riesgos" },
  "meta.integrated.s": { en: "Executive perspective combining BIA and risk insights.", es: "Perspectiva ejecutiva que combina BIA y riesgos." },
  "meta.reports.t": { en: "Reports", es: "Reportes" },
  "meta.reports.s": { en: "Generate, export and review compliance reports.", es: "Genera, exporta y revisa reportes de cumplimiento." },
  "meta.settings.t": { en: "Settings", es: "Ajustes" },
  "meta.settings.s": { en: "Manage organization, members and preferences.", es: "Administra la organización, miembros y preferencias." },

  "header.search": { en: "Search processes, risks, reports…", es: "Buscar procesos, riesgos, reportes…" },
  "header.role": { en: "Resilience Director", es: "Directora de Resiliencia" },

  // Login
  "login.welcome": { en: "Welcome back", es: "Bienvenida de nuevo" },
  "login.sub": { en: "Intelligent continuity, BIA and risk management", es: "Continuidad inteligente, gestión de BIA y riesgos" },
  "login.email": { en: "Email", es: "Correo electrónico" },
  "login.password": { en: "Password", es: "Contraseña" },
  "login.signin": { en: "Sign in", es: "Iniciar sesión" },
  "login.forgot": { en: "Forgot password?", es: "¿Olvidaste tu contraseña?" },

  // Common buttons
  "btn.save": { en: "Save analysis", es: "Guardar análisis" },
  "btn.cancel": { en: "Cancel", es: "Cancelar" },
  "btn.registerProcess": { en: "Register Process", es: "Registrar Proceso" },
  "btn.registerRisk": { en: "Register Risk", es: "Registrar Riesgo" },
  "btn.generatePdf": { en: "Generate PDF", es: "Generar PDF" },
  "btn.excel": { en: "Excel", es: "Excel" },
  "btn.history": { en: "History", es: "Historial" },
  "btn.exportLog": { en: "Export log", es: "Exportar registro" },
  "btn.share": { en: "Share with board", es: "Compartir con el directorio" },
  "btn.expand": { en: "Expand", es: "Expandir" },
  "btn.openPlanner": { en: "Open planner", es: "Abrir planificador" },
  "btn.dismissAll": { en: "Dismiss all", es: "Descartar todas" },
  "btn.openBia": { en: "Open BIA", es: "Abrir BIA" },
  "btn.edit": { en: "Edit", es: "Editar" },
  "btn.exportIso": { en: "Export ISO 31000 report", es: "Exportar reporte ISO 31000" },
  "btn.review": { en: "Review plan", es: "Revisar plan" },

  // Dashboard KPIs
  "kpi.critical": { en: "Critical processes identified", es: "Procesos críticos identificados" },
  "kpi.highRisks": { en: "Active high risks", es: "Riesgos altos activos" },
  "kpi.recovery": { en: "Average recovery time", es: "Tiempo promedio de recuperación" },
  "kpi.resilience": { en: "Resilience level", es: "Nivel de resiliencia" },
  "kpi.target": { en: "Target ≥ 85", es: "Objetivo ≥ 85" },
  "kpi.hours": { en: "hours", es: "horas" },

  // Section titles
  "sec.criticality": { en: "Process criticality", es: "Criticidad de procesos" },
  "sec.criticalityHint": { en: "Top 6 by BIA score", es: "Top 6 por puntaje BIA" },
  "sec.riskLevels": { en: "Risk levels", es: "Niveles de riesgo" },
  "sec.totalRisks": { en: "Total risks", es: "Riesgos totales" },
  "sec.recovery": { en: "Recovery timeline", es: "Línea de recuperación" },
  "sec.recoveryHint": { en: "Avg MTPD (hours)", es: "MTPD promedio (horas)" },
  "sec.alerts": { en: "Priority alerts", es: "Alertas prioritarias" },
  "sec.next": { en: "Recommended next actions", es: "Próximas acciones recomendadas" },

  // Risk level chips
  "lv.critical": { en: "Critical", es: "Crítico" },
  "lv.high": { en: "High", es: "Alto" },
  "lv.medium": { en: "Medium", es: "Medio" },
  "lv.low": { en: "Low", es: "Bajo" },
  "lv.active": { en: "Active", es: "Activo" },
  "lv.review": { en: "Under Review", es: "En revisión" },

  // BIA
  "bia.criteria": { en: "Impact criteria", es: "Criterios de impacto" },
  "bia.criteriaHint": { en: "Configured per ISO 22317", es: "Configurado según ISO 22317" },
  "bia.prioritized": { en: "Prioritized processes", es: "Procesos priorizados" },
  "bia.register": { en: "Register process impact", es: "Registrar impacto del proceso" },
  "bia.cat.fin": { en: "Financial", es: "Financiero" },
  "bia.cat.op": { en: "Operational", es: "Operacional" },
  "bia.cat.legal": { en: "Legal", es: "Legal" },
  "bia.cat.rep": { en: "Reputational", es: "Reputacional" },
  "bia.cat.tech": { en: "Technological", es: "Tecnológico" },
  "bia.lvl.severe": { en: "Severe", es: "Severo" },
  "bia.lvl.moderate": { en: "Moderate", es: "Moderado" },

  "f.process": { en: "Process", es: "Proceso" },
  "f.category": { en: "Impact category", es: "Categoría de impacto" },
  "f.level": { en: "Impact level", es: "Nivel de impacto" },
  "f.notes": { en: "Notes", es: "Notas" },

  // Risks
  "risk.matrix": { en: "Risk matrix · 5×5", es: "Matriz de riesgos · 5×5" },
  "risk.matrixHint": { en: "Probability × Impact", es: "Probabilidad × Impacto" },
  "risk.register": { en: "Risk register", es: "Registro de riesgos" },
  "risk.treatment": { en: "Treatment summary", es: "Resumen de tratamiento" },
  "risk.t.mitigate": { en: "Mitigate", es: "Mitigar" },
  "risk.t.transfer": { en: "Transfer", es: "Transferir" },
  "risk.t.accept": { en: "Accept", es: "Aceptar" },
  "risk.t.avoid": { en: "Avoid", es: "Evitar" },

  // Integrated
  "int.resilience": { en: "Resilience index", es: "Índice de resiliencia" },
  "int.atRisk": { en: "Processes at risk", es: "Procesos en riesgo" },
  "int.residual": { en: "Avg residual risk", es: "Riesgo residual promedio" },
  "int.plans": { en: "Plans up to date", es: "Planes actualizados" },
  "int.map": { en: "Interdependency map", es: "Mapa de interdependencias" },
  "int.ranking": { en: "Most critical processes", es: "Procesos más críticos" },
  "int.recs": { en: "Executive recommendations", es: "Recomendaciones ejecutivas" },
  "int.rec1.t": { en: "Prioritize continuity plan", es: "Priorizar plan de continuidad" },
  "int.rec1.d": { en: "Distribution & cold chain are exposed to a port disruption scenario.", es: "Distribución y cadena de frío están expuestas a una interrupción portuaria." },
  "int.rec2.t": { en: "Review critical risk", es: "Revisar riesgo crítico" },
  "int.rec2.d": { en: "Single-source packaging supplier represents 73% of monthly volume.", es: "Un único proveedor de empaques concentra el 73% del volumen mensual." },
  "int.rec3.t": { en: "Update RTO", es: "Actualizar el RTO" },
  "int.rec3.d": { en: "Recovery objectives for ERP downtime need revision after H1 incident.", es: "Los objetivos de recuperación del ERP requieren revisión tras el incidente del primer semestre." },

  // Reports
  "rep.bia": { en: "BIA Report", es: "Reporte BIA" },
  "rep.biaDesc": { en: "Business impact analysis per process — ISO 22317.", es: "Análisis de impacto por proceso — ISO 22317." },
  "rep.risk": { en: "Risk Report", es: "Reporte de Riesgos" },
  "rep.riskDesc": { en: "Threats, vulnerabilities and treatment plans — ISO 31000.", es: "Amenazas, vulnerabilidades y planes de tratamiento — ISO 31000." },
  "rep.crit": { en: "Critical Processes Report", es: "Reporte de Procesos Críticos" },
  "rep.critDesc": { en: "Top processes ranked by criticality and dependencies.", es: "Procesos ordenados por criticidad y dependencias." },
  "rep.exec": { en: "Executive Resilience Report", es: "Reporte Ejecutivo de Resiliencia" },
  "rep.execDesc": { en: "Board-ready summary of resilience and recommendations.", es: "Resumen ejecutivo de resiliencia y recomendaciones." },
  "rep.history": { en: "Generated reports history", es: "Historial de reportes generados" },
  "rep.published": { en: "Published", es: "Publicado" },
  "rep.draft": { en: "Draft", es: "Borrador" },

  // Filter bar
  "flt.dateRange": { en: "Date range", es: "Rango de fechas" },
  "flt.start": { en: "Start date", es: "Fecha inicio" },
  "flt.end": { en: "End date", es: "Fecha fin" },
  "flt.compare": { en: "Compare with previous period", es: "Comparar con período anterior" },
  "flt.compareWith": { en: "Compare with", es: "Comparar con" },
  "flt.apply": { en: "Apply filters", es: "Aplicar filtros" },
  "flt.reset": { en: "Reset", es: "Restablecer" },
  "flt.summary": { en: "Showing reports from", es: "Mostrando reportes del" },
  "flt.summaryTo": { en: "to", es: "al" },
  "flt.summaryCompared": { en: "compared with", es: "comparado con" },

  "preset.today": { en: "Today", es: "Hoy" },
  "preset.7": { en: "Last 7 days", es: "Últimos 7 días" },
  "preset.30": { en: "Last 30 days", es: "Últimos 30 días" },
  "preset.thisMonth": { en: "This month", es: "Este mes" },
  "preset.lastMonth": { en: "Last month", es: "Mes anterior" },
  "preset.thisQ": { en: "This quarter", es: "Este trimestre" },
  "preset.lastQ": { en: "Last quarter", es: "Trimestre anterior" },
  "preset.thisYear": { en: "This year", es: "Este año" },
  "preset.custom": { en: "Custom range", es: "Rango personalizado" },

  "cmp.prev": { en: "Previous period", es: "Período anterior" },
  "cmp.prevMonth": { en: "Previous month", es: "Mes anterior" },
  "cmp.prevQ": { en: "Previous quarter", es: "Trimestre anterior" },
  "cmp.prevYear": { en: "Previous year", es: "Año anterior" },
  "cmp.customCmp": { en: "Custom comparison range", es: "Rango de comparación personalizado" },

  // Comparison summary KPIs
  "cs.title": { en: "Comparison summary", es: "Resumen comparativo" },
  "cs.reports": { en: "Reports generated", es: "Reportes generados" },
  "cs.critRisks": { en: "Critical risks variation", es: "Variación riesgos críticos" },
  "cs.critProc": { en: "Critical processes variation", es: "Variación procesos críticos" },
  "cs.recovery": { en: "Recovery time variation", es: "Variación tiempo recuperación" },

  // History columns
  "col.period": { en: "Period", es: "Período" },
  "col.compared": { en: "Compared period", es: "Período comparado" },
  "col.variation": { en: "Variation", es: "Variación" },
  "btn.compare": { en: "Compare", es: "Comparar" },

  // Comparison modal
  "rc.title": { en: "Report Comparison", es: "Comparación de reportes" },
  "rc.repA": { en: "Report A period", es: "Período Reporte A" },
  "rc.repB": { en: "Report B period", es: "Período Reporte B" },
  "rc.diff": { en: "Key differences", es: "Diferencias clave" },
  "rc.trend": { en: "Trend over time", es: "Tendencia en el tiempo" },
  "rc.metric": { en: "Metric", es: "Métrica" },
  "rc.current": { en: "Current period", es: "Período actual" },
  "rc.previous": { en: "Previous period", es: "Período anterior" },
  "rc.exportPdf": { en: "Export comparison PDF", es: "Exportar comparación PDF" },
  "rc.exportXls": { en: "Export Excel", es: "Exportar Excel" },
  "rc.close": { en: "Close", es: "Cerrar" },
  "rc.improved": { en: "Improved", es: "Mejoró" },
  "rc.declined": { en: "Declined", es: "Empeoró" },
  "rc.stable": { en: "Stable", es: "Estable" },

  // Metrics
  "m.totalReports": { en: "Total reports generated", es: "Reportes generados" },
  "m.critProc": { en: "Critical processes identified", es: "Procesos críticos identificados" },
  "m.highRisks": { en: "Active high risks", es: "Riesgos altos activos" },
  "m.avgRec": { en: "Average recovery time", es: "Tiempo promedio de recuperación" },
  "m.resilience": { en: "Resilience level", es: "Nivel de resiliencia" },
  "m.bia": { en: "BIA score", es: "Puntaje BIA" },
  "m.expo": { en: "Risk exposure level", es: "Nivel de exposición al riesgo" },

  "chip.dateFilter": { en: "Mar 01 – Mar 31, 2026", es: "01 – 31 Mar, 2026" },

  // Table columns
  "col.process": { en: "Process", es: "Proceso" },
  "col.area": { en: "Area", es: "Área" },
  "col.owner": { en: "Owner", es: "Responsable" },
  "col.deps": { en: "Dependencies", es: "Dependencias" },
  "col.status": { en: "Status", es: "Estado" },
  "col.criticality": { en: "Criticality", es: "Criticidad" },
  "col.category": { en: "Category", es: "Categoría" },
  "col.level": { en: "Level", es: "Nivel" },
  "col.score": { en: "Score", es: "Puntaje" },
  "col.risk": { en: "Risk", es: "Riesgo" },
  "col.treatment": { en: "Treatment", es: "Tratamiento" },
  "col.report": { en: "Report", es: "Reporte" },
  "col.type": { en: "Type", es: "Tipo" },
  "col.author": { en: "Author", es: "Autor" },
  "col.date": { en: "Date", es: "Fecha" },
  "col.actions": { en: "Actions", es: "Acciones" },

  // Context module
  "ctx.tab.all": { en: "All", es: "Todos" },
  "ctx.tab.bu": { en: "Business Units", es: "Unidades de negocio" },
  "ctx.tab.proc": { en: "Processes", es: "Procesos" },
  "ctx.tab.assets": { en: "Assets", es: "Activos" },
  "ctx.tab.third": { en: "Third parties", es: "Terceros" },
  "ctx.tab.inter": { en: "Interdependencies", es: "Interdependencias" },
  "ctx.search": { en: "Search process…", es: "Buscar proceso…" },
  "ctx.processes": { en: "processes", es: "procesos" },
  "ctx.linked": { en: "Linked resources", es: "Recursos vinculados" },
};

export function t(key: string): string {
  const e = dict[key];
  if (!e) return key;
  return e[current] || e.en;
}
