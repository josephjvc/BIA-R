import { X, Download, FileSpreadsheet, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card, Chip, PrimaryButton, SecondaryButton } from "./shared";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { t, useLang } from "./i18n";

type Trend = "up" | "down" | "flat";

const metrics: { keyName: string; cur: string; prev: string; delta: string; trend: Trend; goodIfDown?: boolean }[] = [
  { keyName: "m.totalReports", cur: "24", prev: "19", delta: "+26%", trend: "up" },
  { keyName: "m.critProc", cur: "28", prev: "31", delta: "-3", trend: "down", goodIfDown: true },
  { keyName: "m.highRisks", cur: "15", prev: "17", delta: "-2", trend: "down", goodIfDown: true },
  { keyName: "m.avgRec", cur: "5.2h", prev: "6.4h", delta: "-18%", trend: "down", goodIfDown: true },
  { keyName: "m.resilience", cur: "87", prev: "81", delta: "+6 pts", trend: "up" },
  { keyName: "m.bia", cur: "78", prev: "74", delta: "+4 pts", trend: "up" },
  { keyName: "m.expo", cur: "Med.", prev: "High", delta: "↓ 1 lvl", trend: "down", goodIfDown: true },
];

const trend = [
  { m: "Oct", a: 71, b: 64 },
  { m: "Nov", a: 74, b: 66 },
  { m: "Dec", a: 76, b: 68 },
  { m: "Jan", a: 79, b: 70 },
  { m: "Feb", a: 81, b: 72 },
  { m: "Mar", a: 87, b: 74 },
];

function isPositive(m: typeof metrics[number]) {
  if (m.trend === "flat") return null;
  const goingDown = m.trend === "down";
  const wantDown = !!m.goodIfDown;
  return goingDown === wantDown;
}

export function ReportComparison({ open, onClose, reportName }: { open: boolean; onClose: () => void; reportName?: string }) {
  useLang();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-[#0A2540]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[860px] h-full bg-[#F7F8FB] shadow-[-20px_0_60px_-20px_rgba(10,37,64,0.25)] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-black/5 px-8 py-5 flex items-center justify-between">
          <div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.06em" }}>BIA-R · COMPARISON</div>
            <div className="mt-0.5" style={{ fontSize: 20, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>
              {t("rc.title")}
            </div>
            {reportName && <div style={{ fontSize: 12, color: "#64748B" }}>{reportName}</div>}
          </div>
          <button onClick={onClose} className="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
            <X className="size-4 text-slate-600" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Period cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-black/5">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#1E63D9]" />
                <span style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }}>{t("rc.repA").toUpperCase()}</span>
              </div>
              <div className="mt-2" style={{ fontSize: 17, fontWeight: 600, color: "#0A2540" }}>Mar 01 – Mar 31, 2026</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>Q1 2026 closing window</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-black/5">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-slate-400" />
                <span style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }}>{t("rc.repB").toUpperCase()}</span>
              </div>
              <div className="mt-2" style={{ fontSize: 17, fontWeight: 600, color: "#0A2540" }}>Feb 01 – Feb 28, 2026</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>Previous month</div>
            </div>
          </div>

          {/* Key differences (KPI cards) */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0A2540" }}>{t("rc.diff")}</div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { l: t("m.resilience"), v: "+6", u: "pts", pos: true },
                { l: t("m.highRisks"), v: "-2", u: "risks", pos: true },
                { l: t("m.avgRec"), v: "-18%", u: "MTPD", pos: true },
                { l: t("m.expo"), v: "↓ 1", u: "level", pos: true },
              ].map((k, i) => (
                <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-black/5">
                  <div style={{ fontSize: 11, color: "#64748B" }}>{k.l}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span style={{ fontSize: 22, fontWeight: 600, color: k.pos ? "#047857" : "#BE123C", letterSpacing: "-0.01em" }}>{k.v}</span>
                    <span style={{ fontSize: 11, color: "#94A3B8" }}>{k.u}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trend chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div style={{ fontSize: 15, fontWeight: 600, color: "#0A2540" }}>{t("rc.trend")}</div>
              <div className="flex items-center gap-3" style={{ fontSize: 11, color: "#64748B" }}>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#1E63D9]" /> Current</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-slate-400" /> Previous</span>
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 12 }} />
                  <Line type="monotone" dataKey="a" stroke="#1E63D9" strokeWidth={2.5} dot={{ fill: "#1E63D9", r: 3 }} />
                  <Line type="monotone" dataKey="b" stroke="#94A3B8" strokeWidth={2} dot={{ fill: "#94A3B8", r: 3 }} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Metrics table */}
          <Card className="p-6">
            <table className="w-full">
              <thead>
                <tr style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>
                  <th className="text-left pb-3 uppercase">{t("rc.metric")}</th>
                  <th className="text-left pb-3 uppercase">{t("rc.current")}</th>
                  <th className="text-left pb-3 uppercase">{t("rc.previous")}</th>
                  <th className="text-left pb-3 uppercase">{t("col.variation")}</th>
                  <th className="text-left pb-3 uppercase">{t("col.status")}</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, i) => {
                  const pos = isPositive(m);
                  const Ic = m.trend === "flat" ? Minus : pos ? ArrowUpRight : ArrowDownRight;
                  const cls = pos === null ? "bg-slate-50 text-slate-600" : pos ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700";
                  return (
                    <tr key={i} className="border-t border-black/5">
                      <td className="py-3.5" style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{t(m.keyName)}</td>
                      <td className="py-3.5" style={{ fontSize: 13, color: "#0A2540" }}>{m.cur}</td>
                      <td className="py-3.5" style={{ fontSize: 13, color: "#64748B" }}>{m.prev}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${cls}`} style={{ fontSize: 11, fontWeight: 500 }}>
                          <Ic className="size-3" /> {m.delta}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <Chip tone={pos === null ? "neutral" : pos ? "low" : "critical"}>
                          {pos === null ? t("rc.stable") : pos ? t("rc.improved") : t("rc.declined")}
                        </Chip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <SecondaryButton onClick={onClose}>{t("rc.close")}</SecondaryButton>
            <SecondaryButton><span className="inline-flex items-center gap-1.5"><FileSpreadsheet className="size-3.5" /> {t("rc.exportXls")}</span></SecondaryButton>
            <PrimaryButton><span className="inline-flex items-center gap-1.5"><Download className="size-3.5" /> {t("rc.exportPdf")}</span></PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
