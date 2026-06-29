import { useParams } from "react-router";
import { Card, Chip, PrimaryButton, SecondaryButton, SectionTitle } from "./shared";
import { DollarSign, Cog, Scale, MessageSquareWarning, Server, Loader2, Check } from "lucide-react";
import { useAssessments } from "../../shared/queries/bia.queries";

const criteria = [
  { icon: DollarSign, name: "Financial", desc: "Loss ≥ USD 100K", color: "from-blue-50 to-blue-100/40", active: true },
  { icon: Cog, name: "Operational", desc: "Output drop > 25%", color: "from-amber-50 to-amber-100/40", active: true },
  { icon: Scale, name: "Legal", desc: "Regulatory exposure", color: "from-violet-50 to-violet-100/40" },
  { icon: MessageSquareWarning, name: "Reputational", desc: "Public sentiment", color: "from-rose-50 to-rose-100/40", active: true },
  { icon: Server, name: "Technological", desc: "System unavailability", color: "from-emerald-50 to-emerald-100/40" },
];

export function BIA() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const { data: assessments, isLoading } = useAssessments(instanceId);

  if (isLoading) {
    return <div className="p-10 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-slate-400" /></div>;
  }

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
          <SectionTitle title="Prioritized processes" />
          <table className="w-full">
            <thead>
              <tr style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>
                <th className="text-left pb-3 uppercase">Process</th>
                <th className="text-left pb-3 uppercase">MTPD</th>
                <th className="text-left pb-3 uppercase">RTO</th>
                <th className="text-left pb-3 uppercase">RPO</th>
                <th className="text-right pb-3 uppercase">Score</th>
                <th className="text-left pb-3 uppercase">Criticality</th>
              </tr>
            </thead>
            <tbody>
              {(assessments || []).map((a, i) => (
                <tr key={i} className="border-t border-black/5 hover:bg-slate-50">
                  <td className="py-3.5" style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{a.processName || "-"}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{a.mtpd != null ? a.mtpd + " min" : "-"}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{a.rto != null ? a.rto + " min" : "-"}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{a.rpo != null ? a.rpo + " min" : "-"}</td>
                  <td className="py-3.5 text-right" style={{ fontSize: 13, color: "#0A2540", fontWeight: 600 }}>{a.impactScore != null ? a.impactScore : "-"}</td>
                  <td className="py-3.5"><Chip tone={a.criticality === "critical" ? "critical" : a.criticality === "high" ? "high" : "medium"}>{a.criticality || "-"}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!assessments || assessments.length === 0) && (
            <div className="py-10 text-center" style={{ color: "#94A3B8", fontSize: 13 }}>No BIA assessments yet.</div>
          )}
        </Card>

        <Card className="p-6 h-fit">
          <SectionTitle title="Register process impact" />
          <div className="space-y-4">
            <Field label="Process">
              <select className="bia-input"><option>Select process</option></select>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="MTPD (min)"><input type="number" className="bia-input" /></Field>
              <Field label="RTO (min)"><input type="number" className="bia-input" /></Field>
              <Field label="RPO (min)"><input type="number" className="bia-input" /></Field>
            </div>
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
