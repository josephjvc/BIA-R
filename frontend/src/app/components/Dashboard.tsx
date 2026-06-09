import { Card, KpiCard, SectionTitle, Chip, PrimaryButton, SecondaryButton } from "./shared";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip } from "recharts";
import { AlertTriangle, CheckCircle2, Clock, ChevronRight } from "lucide-react";

const criticality = [
  { name: "Distribution", v: 92 },
  { name: "Supply", v: 86 },
  { name: "Production", v: 78 },
  { name: "Sales", v: 64 },
  { name: "Finance", v: 52 },
  { name: "HR", v: 34 },
];
const risks = [
  { name: "Critical", value: 4, color: "#E11D48" },
  { name: "High", value: 11, color: "#F97316" },
  { name: "Medium", value: 18, color: "#F59E0B" },
  { name: "Low", value: 27, color: "#10B981" },
];
const recovery = [
  { m: "Jan", v: 8.2 }, { m: "Feb", v: 7.6 }, { m: "Mar", v: 7.1 }, { m: "Apr", v: 6.4 }, { m: "May", v: 5.9 }, { m: "Jun", v: 5.2 },
];

export function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
        <KpiCard label="Critical processes identified" value="28" delta="+3 vs Q1" positive />
        <KpiCard label="Active high risks" value="15" delta="-2 vs Q1" positive />
        <KpiCard label="Average recovery time" value="5.2" unit="hours" delta="-18%" positive />
        <KpiCard label="Resilience level" value="87" unit="/ 100" delta="+6 pts" positive hint="Target ≥ 85" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <Card className="col-span-1 lg:col-span-2 p-5 sm:p-6">
          <SectionTitle title="Process criticality" action={<div style={{ fontSize: 12, color: "#94A3B8" }}>Top 6 by BIA score</div>} />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criticality} barCategoryGap={28}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip cursor={{ fill: "rgba(10,37,64,0.04)" }} contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 12 }} />
                <Bar dataKey="v" radius={[8, 8, 4, 4]} fill="url(#g1)" />
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E63D9" />
                    <stop offset="100%" stopColor="#0A2540" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Risk levels" />
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={risks} dataKey="value" innerRadius={60} outerRadius={86} paddingAngle={3} stroke="none">
                  {risks.map((r) => <Cell key={r.name} fill={r.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div style={{ fontSize: 28, fontWeight: 600, color: "#0A2540" }}>60</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Total risks</div>
            </div>
          </div>
          <div className="mt-3 space-y-1.5">
            {risks.map((r) => (
              <div key={r.name} className="flex items-center justify-between" style={{ fontSize: 12 }}>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="size-2 rounded-full" style={{ background: r.color }} />
                  {r.name}
                </div>
                <span style={{ color: "#0A2540", fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <Card className="col-span-1 lg:col-span-2 p-5 sm:p-6">
          <SectionTitle title="Recovery timeline" action={<div style={{ fontSize: 12, color: "#94A3B8" }}>Avg MTPD (hours)</div>} />
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recovery}>
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="#1E63D9" strokeWidth={2.5} dot={{ fill: "#1E63D9", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Priority alerts" />
          <div className="space-y-3">
            {[
              { icon: AlertTriangle, color: "text-rose-600 bg-rose-50", title: "Distribution center · Callao", desc: "RTO exceeded — 12h", t: "now" },
              { icon: Clock, color: "text-amber-600 bg-amber-50", title: "Cold chain monitoring", desc: "Critical risk under review", t: "2h" },
              { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", title: "Continuity test passed", desc: "BCP — Plant Lurín", t: "1d" },
            ].map((a, i) => {
              const Ic = a.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition">
                  <div className={`size-9 rounded-xl flex items-center justify-center ${a.color}`}>
                    <Ic className="size-4" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate" style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{a.title}</div>
                    <div className="truncate" style={{ fontSize: 12, color: "#64748B" }}>{a.desc}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{a.t}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionTitle
          title="Recommended next actions"
          action={<div className="flex gap-2"><SecondaryButton>Dismiss all</SecondaryButton><PrimaryButton>Open planner</PrimaryButton></div>}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            { title: "Update BIA for Distribution", desc: "MTPD missing for 2 sub-processes in Callao.", chip: <Chip tone="critical">Critical</Chip> },
            { title: "Mitigate supplier concentration risk", desc: "73% of packaging sourced from one supplier.", chip: <Chip tone="high">High</Chip> },
            { title: "Quarterly continuity test", desc: "Schedule the Q2 BCP exercise for Plant Lurín.", chip: <Chip tone="review">Scheduled</Chip> },
          ].map((c, i) => (
            <div key={i} className="p-5 rounded-2xl border border-black/5 hover:border-black/10 hover:shadow-sm transition cursor-pointer bg-gradient-to-br from-white to-slate-50/60">
              <div className="flex items-center justify-between mb-3">
                {c.chip}
                <ChevronRight className="size-4 text-slate-400" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0A2540" }}>{c.title}</div>
              <div className="mt-1" style={{ fontSize: 12, color: "#64748B" }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
