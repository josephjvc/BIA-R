import { Card, Chip, PrimaryButton, SecondaryButton, SectionTitle } from "./shared";
import { Plus } from "lucide-react";

const risks = [
  { r: "Supplier concentration (packaging)", proc: "Raw material supply", p: 4, i: 5, lv: "critical", lvl: "Critical", t: "Mitigate", owner: "J. Rivas" },
  { r: "Port strike — Callao", proc: "Last-mile distribution", p: 3, i: 5, lv: "high", lvl: "High", t: "Transfer", owner: "M. Quispe" },
  { r: "Refrigeration unit failure", proc: "Cold-chain monitoring", p: 3, i: 4, lv: "high", lvl: "High", t: "Mitigate", owner: "K. Mendoza" },
  { r: "ERP downtime > 4h", proc: "Customer billing", p: 2, i: 4, lv: "medium", lvl: "Medium", t: "Mitigate", owner: "L. Ortega" },
  { r: "Currency volatility (USD/PEN)", proc: "Finance", p: 4, i: 2, lv: "medium", lvl: "Medium", t: "Accept", owner: "L. Ortega" },
  { r: "Cyber phishing campaign", proc: "IT operations", p: 3, i: 3, lv: "medium", lvl: "Medium", t: "Mitigate", owner: "D. Romero" },
  { r: "Minor packaging defects", proc: "Production", p: 2, i: 1, lv: "low", lvl: "Low", t: "Accept", owner: "R. Salazar" },
];

const colors = ["#10B981", "#34D399", "#FBBF24", "#F97316", "#E11D48"];
function cellColor(p: number, i: number) {
  const score = (p + i) / 2;
  if (score <= 1.5) return colors[0];
  if (score <= 2.5) return colors[1];
  if (score <= 3.5) return colors[2];
  if (score <= 4.5) return colors[3];
  return colors[4];
}

export function Risks() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-5 sm:space-y-6">
      <div className="grid grid-cols-[480px_1fr] gap-6">
        <Card className="p-6">
          <SectionTitle title="Risk matrix · 5×5" action={<div style={{ fontSize: 11, color: "#94A3B8" }}>Probability × Impact</div>} />
          <div className="flex gap-2">
            <div className="flex flex-col justify-around" style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500, width: 18 }}>
              {[5, 4, 3, 2, 1].map(n => <div key={n} className="rotate-180" style={{ writingMode: "vertical-rl" } as any}>{n}</div>)}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-1.5">
                {[5, 4, 3, 2, 1].map((p) =>
                  [1, 2, 3, 4, 5].map((i) => {
                    const count = risks.filter(r => r.p === p && r.i === i).length;
                    return (
                      <div key={`${p}-${i}`} className="aspect-square rounded-xl flex items-center justify-center transition hover:scale-105" style={{ background: cellColor(p, i), opacity: count > 0 ? 1 : 0.18 }}>
                        {count > 0 && <span style={{ fontSize: 16, fontWeight: 600, color: "white" }}>{count}</span>}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="grid grid-cols-5 gap-1.5 mt-1.5" style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>
                {[1, 2, 3, 4, 5].map(n => <div key={n} className="text-center">{n}</div>)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5" style={{ fontSize: 11, color: "#64748B" }}>
            <span>← Impact →</span>
            <span>↑ Probability</span>
          </div>
          <div className="mt-3 flex items-center gap-2 justify-center">
            {[{c:colors[0],l:"Low"},{c:colors[2],l:"Medium"},{c:colors[3],l:"High"},{c:colors[4],l:"Critical"}].map(x => (
              <div key={x.l} className="flex items-center gap-1.5" style={{ fontSize: 11, color: "#64748B" }}>
                <span className="size-2.5 rounded-full" style={{ background: x.c }} /> {x.l}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <SectionTitle title="Risk register" />
            <PrimaryButton><span className="inline-flex items-center gap-1.5"><Plus className="size-4" /> Register Risk</span></PrimaryButton>
          </div>
          <table className="w-full mt-2">
            <thead>
              <tr style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>
                <th className="text-left pb-3 uppercase">Risk</th>
                <th className="text-left pb-3 uppercase">Process</th>
                <th className="text-left pb-3 uppercase">P</th>
                <th className="text-left pb-3 uppercase">I</th>
                <th className="text-left pb-3 uppercase">Level</th>
                <th className="text-left pb-3 uppercase">Treatment</th>
                <th className="text-left pb-3 uppercase">Owner</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={i} className="border-t border-black/5 hover:bg-slate-50">
                  <td className="py-3.5 pr-4" style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{r.r}</td>
                  <td className="py-3.5" style={{ fontSize: 12, color: "#475569" }}>{r.proc}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.p}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.i}</td>
                  <td className="py-3.5"><Chip tone={r.lv as any}>{r.lvl}</Chip></td>
                  <td className="py-3.5" style={{ fontSize: 12, color: "#475569" }}>{r.t}</td>
                  <td className="py-3.5" style={{ fontSize: 12, color: "#475569" }}>{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card className="p-6">
        <SectionTitle title="Treatment summary" action={<SecondaryButton>Export ISO 31000 report</SecondaryButton>} />
        <div className="grid grid-cols-4 gap-4">
          {[
            { l: "Mitigate", v: 18, pct: 60, c: "#1E63D9" },
            { l: "Transfer", v: 6, pct: 20, c: "#10B981" },
            { l: "Accept", v: 4, pct: 13, c: "#F59E0B" },
            { l: "Avoid", v: 2, pct: 7, c: "#E11D48" },
          ].map((t) => (
            <div key={t.l} className="p-5 rounded-2xl bg-slate-50/60 border border-black/5">
              <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{t.l}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span style={{ fontSize: 26, fontWeight: 600, color: "#0A2540" }}>{t.v}</span>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>· {t.pct}%</span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.c }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
