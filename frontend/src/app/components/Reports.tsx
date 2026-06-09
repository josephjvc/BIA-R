import { useState } from "react";
import { Card, Chip, PrimaryButton, SecondaryButton, SectionTitle } from "./shared";
import { FileBarChart, ShieldAlert, Layers, Crown, Download, FileSpreadsheet, History, ArrowUpRight, ArrowDownRight, Calendar, GitCompareArrows, X } from "lucide-react";
import { DateFilterBar } from "./DateFilterBar";
import { ReportComparison } from "./ReportComparison";
import { t, useLang } from "./i18n";

const reports = [
  { icon: FileBarChart, nameK: "rep.bia", descK: "rep.biaDesc", tint: "from-blue-50 to-blue-100/40", deltaText: "+12% vs prev. period", positive: true },
  { icon: ShieldAlert, nameK: "rep.risk", descK: "rep.riskDesc", tint: "from-rose-50 to-rose-100/40", deltaText: "-3 risks", positive: true },
  { icon: Layers, nameK: "rep.crit", descK: "rep.critDesc", tint: "from-amber-50 to-amber-100/40", deltaText: "RTO improved 18%", positive: true },
  { icon: Crown, nameK: "rep.exec", descK: "rep.execDesc", tint: "from-emerald-50 to-emerald-100/40", deltaText: "+6 pts resilience", positive: true },
];

const history = [
  { n: "Executive Resilience Report — Q1 2026", a: "Camila Vargas", d: "Apr 14, 2026", t: "Executive", s: "active", period: "Q1 2026", cmp: "Q4 2025", varTxt: "+6 pts", pos: true },
  { n: "Risk Report — Apr 2026", a: "D. Romero", d: "Apr 02, 2026", t: "Risk", s: "active", period: "Apr 2026", cmp: "Mar 2026", varTxt: "-2 risks", pos: true },
  { n: "BIA Report — Distribution", a: "M. Quispe", d: "Mar 28, 2026", t: "BIA", s: "review", period: "Mar 2026", cmp: "Feb 2026", varTxt: "+4 score", pos: true },
  { n: "Critical Processes — Q1", a: "Camila Vargas", d: "Mar 15, 2026", t: "Processes", s: "active", period: "Q1 2026", cmp: "Q4 2025", varTxt: "+1 process", pos: false },
  { n: "Risk Report — Mar 2026", a: "D. Romero", d: "Mar 02, 2026", t: "Risk", s: "draft", period: "Mar 2026", cmp: "Feb 2026", varTxt: "0", pos: null },
];

export function Reports() {
  useLang();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | undefined>();

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-5 sm:space-y-6">
      <DateFilterBar />

      {/* Comparison summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitCompareArrows className="size-4 text-[#1E63D9]" strokeWidth={1.75} />
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{t("cs.title")}</div>
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>Mar 2026 vs Feb 2026</div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { l: t("cs.reports"), v: "24", d: "+5", pos: true },
            { l: t("cs.critRisks"), v: "15", d: "-2", pos: true },
            { l: t("cs.critProc"), v: "28", d: "+1", pos: false },
            { l: t("cs.recovery"), v: "5.2h", d: "-18%", pos: true },
          ].map((k, i) => (
            <div key={i} className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-black/5">
              <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{k.l}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span style={{ fontSize: 26, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{k.v}</span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${k.pos ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                  style={{ fontSize: 11, fontWeight: 500 }}
                >
                  {k.pos ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {k.d}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Report cards */}
      <div className="grid grid-cols-4 gap-5">
        {reports.map((r, idx) => {
          const Ic = r.icon;
          return (
            <Card key={idx} className={`p-6 bg-gradient-to-br ${r.tint}`}>
              <div className="flex items-center justify-between">
                <div className="size-11 rounded-xl bg-white shadow-sm flex items-center justify-center"><Ic className="size-5 text-[#0A2540]" strokeWidth={1.75} /></div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${r.positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
                  style={{ fontSize: 11, fontWeight: 500 }}
                >
                  {r.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {r.deltaText}
                </span>
              </div>
              <div className="mt-4" style={{ fontSize: 15, fontWeight: 600, color: "#0A2540" }}>{t(r.nameK)}</div>
              <div className="mt-1 mb-5" style={{ fontSize: 12, color: "#475569" }}>{t(r.descK)}</div>
              <div className="flex flex-col gap-2">
                <PrimaryButton><span className="inline-flex items-center gap-1.5"><Download className="size-3.5" /> {t("btn.generatePdf")}</span></PrimaryButton>
                <div className="flex gap-2">
                  <SecondaryButton><span className="inline-flex items-center gap-1.5"><FileSpreadsheet className="size-3.5" /> {t("btn.excel")}</span></SecondaryButton>
                  <SecondaryButton><span className="inline-flex items-center gap-1.5"><History className="size-3.5" /> {t("btn.history")}</span></SecondaryButton>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* History */}
      <Card className="p-6">
        <SectionTitle title={t("rep.history")} action={<SecondaryButton>{t("btn.exportLog")}</SecondaryButton>} />

        {/* Date filter chip */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 h-8 pl-3 pr-2 rounded-full bg-blue-50 text-[#0A2540] border border-blue-100">
            <Calendar className="size-3.5 text-[#1E63D9]" />
            <span style={{ fontSize: 12, fontWeight: 500 }}>{t("chip.dateFilter")}</span>
            <button className="size-5 rounded-full hover:bg-white/70 flex items-center justify-center"><X className="size-3 text-slate-500" /></button>
          </div>
          <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-slate-100 text-slate-700">
            <GitCompareArrows className="size-3.5 text-slate-500" />
            <span style={{ fontSize: 12, fontWeight: 500 }}>vs Feb 2026</span>
          </div>
          <div className="ml-auto" style={{ fontSize: 12, color: "#94A3B8" }}>{history.length} entries</div>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>
              <th className="text-left pb-3 uppercase">{t("col.report")}</th>
              <th className="text-left pb-3 uppercase">{t("col.type")}</th>
              <th className="text-left pb-3 uppercase">{t("col.period")}</th>
              <th className="text-left pb-3 uppercase">{t("col.compared")}</th>
              <th className="text-left pb-3 uppercase">{t("col.variation")}</th>
              <th className="text-left pb-3 uppercase">{t("col.status")}</th>
              <th className="text-right pb-3 uppercase">{t("col.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {history.map((r, i) => (
              <tr key={i} className="border-t border-black/5 hover:bg-slate-50">
                <td className="py-3.5 pr-4" style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{r.n}</td>
                <td className="py-3.5"><Chip tone="neutral">{r.t}</Chip></td>
                <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.period}</td>
                <td className="py-3.5" style={{ fontSize: 13, color: "#64748B" }}>{r.cmp}</td>
                <td className="py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                      r.pos === null ? "bg-slate-50 text-slate-600" : r.pos ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}
                    style={{ fontSize: 11, fontWeight: 500 }}
                  >
                    {r.pos === null ? "—" : r.pos ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                    {r.varTxt}
                  </span>
                </td>
                <td className="py-3.5">
                  <Chip tone={r.s as any}>
                    {r.s === "active" ? t("rep.published") : r.s === "review" ? t("lv.review") : t("rep.draft")}
                  </Chip>
                </td>
                <td className="py-3.5 text-right">
                  <div className="inline-flex gap-2">
                    <SecondaryButton onClick={() => { setActive(r.n); setOpen(true); }}>
                      <span className="inline-flex items-center gap-1.5"><GitCompareArrows className="size-3.5" /> {t("btn.compare")}</span>
                    </SecondaryButton>
                    <SecondaryButton>PDF</SecondaryButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ReportComparison open={open} onClose={() => setOpen(false)} reportName={active} />
    </div>
  );
}
