import { Card, Chip, PrimaryButton, SecondaryButton, SectionTitle } from "./shared";
import { DollarSign, Cog, Scale, MessageSquareWarning, Server, Check } from "lucide-react";

const criteria = [
  { icon: DollarSign, name: "Financial", desc: "Loss ≥ USD 100K", color: "from-blue-50 to-blue-100/40", active: true },
  { icon: Cog, name: "Operational", desc: "Output drop > 25%", color: "from-amber-50 to-amber-100/40", active: true },
  { icon: Scale, name: "Legal", desc: "Regulatory exposure", color: "from-violet-50 to-violet-100/40" },
  { icon: MessageSquareWarning, name: "Reputational", desc: "Public sentiment", color: "from-rose-50 to-rose-100/40", active: true },
  { icon: Server, name: "Technological", desc: "System unavailability", color: "from-emerald-50 to-emerald-100/40" },
];

const bia = [
  { p: "Last-mile distribution", cat: "Operational", lv: "Severe", mtpd: "8h", rto: "4h", rpo: "30m", crit: 92, tone: "critical" },
  { p: "Cold-chain monitoring", cat: "Operational", lv: "Severe", mtpd: "6h", rto: "2h", rpo: "15m", crit: 89, tone: "critical" },
  { p: "Raw material supply", cat: "Financial", lv: "High", mtpd: "24h", rto: "12h", rpo: "1h", crit: 86, tone: "high" },
  { p: "Bottling line A", cat: "Operational", lv: "High", mtpd: "12h", rto: "6h", rpo: "1h", crit: 78, tone: "high" },
  { p: "Customer billing", cat: "Financial", lv: "Moderate", mtpd: "48h", rto: "24h", rpo: "4h", crit: 64, tone: "medium" },
];

export function BIA() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-5 sm:space-y-6">
      <Card className="p-6">
        <SectionTitle title="Impact criteria" action={<div style={{ fontSize: 12, color: "#94A3B8" }}>Configured per ISO 22317</div>} />
        <div className="grid grid-cols-5 gap-4">
          {criteria.map((c) => {
            const Ic = c.icon;
            return (
              <div key={c.name} className={`relative p-5 rounded-2xl border ${c.active ? "border-[#1E63D9]/30" : "border-black/5"} bg-gradient-to-br ${c.color}`}>
                <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Ic className="size-5 text-[#0A2540]" strokeWidth={1.75} />
                </div>
                <div className="mt-3" style={{ fontSize: 14, fontWeight: 600, color: "#0A2540" }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{c.desc}</div>
                {c.active && <div className="absolute top-3 right-3 size-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="size-3 text-white" strokeWidth={3} /></div>}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-[1fr_400px] gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-1">
            <SectionTitle title="Prioritized processes" />
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>
                <th className="text-left pb-3 uppercase">Process</th>
                <th className="text-left pb-3 uppercase">Category</th>
                <th className="text-left pb-3 uppercase">Level</th>
                <th className="text-left pb-3 uppercase">MTPD</th>
                <th className="text-left pb-3 uppercase">RTO</th>
                <th className="text-left pb-3 uppercase">RPO</th>
                <th className="text-right pb-3 uppercase">Score</th>
              </tr>
            </thead>
            <tbody>
              {bia.map((r, i) => (
                <tr key={i} className="border-t border-black/5 hover:bg-slate-50">
                  <td className="py-3.5" style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{r.p}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.cat}</td>
                  <td className="py-3.5"><Chip tone={r.tone as any}>{r.lv}</Chip></td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.mtpd}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.rto}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.rpo}</td>
                  <td className="py-3.5 text-right" style={{ fontSize: 13, color: "#0A2540", fontWeight: 600 }}>{r.crit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-6 h-fit">
          <SectionTitle title="Register process impact" />
          <div className="space-y-4">
            <Field label="Process">
              <select className="bia-input"><option>Last-mile distribution</option><option>Cold-chain monitoring</option></select>
            </Field>
            <Field label="Impact category">
              <select className="bia-input"><option>Operational</option><option>Financial</option><option>Reputational</option></select>
            </Field>
            <Field label="Impact level">
              <div className="grid grid-cols-4 gap-2">
                {["Low", "Mod.", "High", "Severe"].map((l, i) => (
                  <button key={l} className={`h-9 rounded-xl border ${i === 3 ? "bg-[#0A2540] text-white border-transparent" : "bg-white border-black/10 text-slate-600"}`} style={{ fontSize: 12, fontWeight: 500 }}>{l}</button>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="MTPD"><input defaultValue="8h" className="bia-input" /></Field>
              <Field label="RTO"><input defaultValue="4h" className="bia-input" /></Field>
              <Field label="RPO"><input defaultValue="30m" className="bia-input" /></Field>
            </div>
            <Field label="Notes">
              <textarea rows={3} defaultValue="Critical during peak summer demand in coastal regions." className="bia-input resize-none" />
            </Field>
            <div className="flex gap-2 pt-2">
              <PrimaryButton>Save analysis</PrimaryButton>
              <SecondaryButton>Cancel</SecondaryButton>
            </div>
          </div>
          <style>{`.bia-input{width:100%;padding:8px 12px;border-radius:12px;background:#F8FAFC;border:1px solid rgba(0,0,0,0.06);font-size:13px;outline:none;color:#0A2540}.bia-input:focus{background:white;border-color:rgba(30,99,217,0.4)}`}</style>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.02em" }}>{label.toUpperCase()}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
