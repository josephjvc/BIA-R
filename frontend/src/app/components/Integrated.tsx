import { Card, Chip, PrimaryButton, SecondaryButton, SectionTitle } from "./shared";
import { TrendingUp, AlertTriangle, RefreshCw, ArrowRight } from "lucide-react";

const ranking = [
  { p: "Last-mile distribution", crit: 92, risk: "Critical", tone: "critical" },
  { p: "Cold-chain monitoring", crit: 89, risk: "Critical", tone: "critical" },
  { p: "Raw material supply", crit: 86, risk: "High", tone: "high" },
  { p: "Bottling line A", crit: 78, risk: "High", tone: "high" },
  { p: "Customer billing", crit: 64, risk: "Medium", tone: "medium" },
];

// Layout for nodes
const nodes = [
  { id: "supply", x: 80, y: 80, label: "Supply", tone: "#1E63D9" },
  { id: "prod", x: 280, y: 60, label: "Production", tone: "#1E63D9" },
  { id: "wh", x: 480, y: 120, label: "Warehouse", tone: "#0A2540" },
  { id: "dist", x: 680, y: 80, label: "Distribution", tone: "#E11D48" },
  { id: "it", x: 200, y: 240, label: "ERP / IT", tone: "#F59E0B" },
  { id: "cold", x: 460, y: 280, label: "Cold chain", tone: "#E11D48" },
  { id: "fin", x: 680, y: 260, label: "Billing", tone: "#10B981" },
];
const edges: [string, string][] = [
  ["supply", "prod"], ["prod", "wh"], ["wh", "dist"],
  ["it", "prod"], ["it", "wh"], ["it", "fin"],
  ["cold", "wh"], ["cold", "dist"], ["dist", "fin"],
];
const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

export function Integrated() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-5 sm:space-y-6">
      <div className="grid grid-cols-4 gap-5">
        {[
          { l: "Resilience index", v: "87", d: "+6 pts" },
          { l: "Processes at risk", v: "4", d: "Critical" },
          { l: "Avg residual risk", v: "2.4", d: "of 5" },
          { l: "Plans up to date", v: "92%", d: "+8%" },
        ].map((k) => (
          <Card key={k.l} className="p-6">
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{k.l}</div>
            <div className="mt-3" style={{ fontSize: 32, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.02em" }}>{k.v}</div>
            <div className="mt-1" style={{ fontSize: 12, color: "#10B981" }}>{k.d}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_420px] gap-6">
        <Card className="p-6">
          <SectionTitle title="Interdependency map" action={<SecondaryButton>Expand</SecondaryButton>} />
          <div className="relative rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-black/5 overflow-hidden" style={{ height: 380 }}>
            <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 780 380">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#94A3B8" />
                </marker>
              </defs>
              {edges.map(([a, b], i) => {
                const A = nodeMap[a], B = nodeMap[b];
                return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#arr)" />;
              })}
            </svg>
            {nodes.map(n => (
              <div key={n.id} className="absolute" style={{ left: n.x - 50, top: n.y - 22 }}>
                <div className="px-3.5 py-2 rounded-xl bg-white shadow-[0_4px_16px_-4px_rgba(10,37,64,0.15)] border border-black/5 flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: n.tone }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#0A2540" }}>{n.label}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Most critical processes" />
          <div className="space-y-2">
            {ranking.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                <div className="size-7 rounded-lg bg-slate-100 flex items-center justify-center" style={{ fontSize: 12, fontWeight: 600, color: "#0A2540" }}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{r.p}</div>
                  <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.crit}%`, background: r.crit > 80 ? "#E11D48" : "#F59E0B" }} />
                  </div>
                </div>
                <Chip tone={r.tone as any}>{r.risk}</Chip>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionTitle title="Executive recommendations" action={<PrimaryButton>Share with board</PrimaryButton>} />
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, tint: "from-blue-50 to-blue-100/40", title: "Prioritize continuity plan", desc: "Distribution & cold chain are exposed to a port disruption scenario.", chip: <Chip tone="critical">Action required</Chip> },
            { icon: AlertTriangle, tint: "from-rose-50 to-rose-100/40", title: "Review critical risk", desc: "Single-source packaging supplier represents 73% of monthly volume.", chip: <Chip tone="high">High</Chip> },
            { icon: RefreshCw, tint: "from-emerald-50 to-emerald-100/40", title: "Update RTO", desc: "Recovery objectives for ERP downtime need revision after H1 incident.", chip: <Chip tone="review">Review</Chip> },
          ].map((c, i) => {
            const Ic = c.icon;
            return (
              <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${c.tint} border border-black/5 hover:shadow-md transition cursor-pointer`}>
                <div className="flex items-center justify-between">
                  <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><Ic className="size-4 text-[#0A2540]" /></div>
                  {c.chip}
                </div>
                <div className="mt-4" style={{ fontSize: 15, fontWeight: 600, color: "#0A2540" }}>{c.title}</div>
                <div className="mt-1" style={{ fontSize: 12, color: "#475569" }}>{c.desc}</div>
                <div className="mt-4 inline-flex items-center gap-1" style={{ fontSize: 12, color: "#1E63D9", fontWeight: 500 }}>Review plan <ArrowRight className="size-3.5" /></div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
