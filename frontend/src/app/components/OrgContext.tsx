import { useState } from "react";
import { Card, Chip, PrimaryButton, SecondaryButton, SectionTitle } from "./shared";
import { Plus, Filter, Search, X, Building, User, Layers } from "lucide-react";

const rows = [
  { id: 1, process: "Last-mile distribution", area: "Logistics", owner: "M. Quispe", deps: 7, status: "critical", crit: 92 },
  { id: 2, process: "Raw material supply", area: "Supply Chain", owner: "J. Rivas", deps: 5, status: "active", crit: 86 },
  { id: 3, process: "Beverage bottling line A", area: "Production", owner: "R. Salazar", deps: 4, status: "review", crit: 78 },
  { id: 4, process: "Customer billing", area: "Finance", owner: "L. Ortega", deps: 3, status: "active", crit: 64 },
  { id: 5, process: "Cold-chain monitoring", area: "Operations", owner: "K. Mendoza", deps: 6, status: "critical", crit: 89 },
  { id: 6, process: "Vendor onboarding", area: "Procurement", owner: "S. Tello", deps: 2, status: "active", crit: 41 },
  { id: 7, process: "Workforce scheduling", area: "HR", owner: "P. Cárdenas", deps: 2, status: "review", crit: 38 },
];

export function OrgContext() {
  const [sel, setSel] = useState(rows[0]);
  return (
    <div className="p-4 sm:p-6 lg:p-10 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 lg:gap-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {["All", "Business Units", "Processes", "Assets", "Third parties", "Interdependencies"].map((t, i) => (
              <button key={t} className={`h-9 px-4 rounded-xl transition ${i === 2 ? "bg-[#0A2540] text-white" : "bg-white border border-black/5 text-slate-600 hover:border-black/10"}`} style={{ fontSize: 13, fontWeight: 500 }}>
                {t}
              </button>
            ))}
          </div>
          <PrimaryButton><span className="inline-flex items-center gap-1.5"><Plus className="size-4" /> Register Process</span></PrimaryButton>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Search process…" className="h-9 w-72 pl-9 pr-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-black/10 outline-none" style={{ fontSize: 13 }} />
              </div>
              <SecondaryButton><span className="inline-flex items-center gap-1.5"><Filter className="size-3.5" /> Area</span></SecondaryButton>
              <SecondaryButton>Status</SecondaryButton>
              <SecondaryButton>Criticality</SecondaryButton>
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>{rows.length} processes</div>
          </div>

          <table className="w-full">
            <thead>
              <tr style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>
                <th className="text-left pb-3 uppercase">Process</th>
                <th className="text-left pb-3 uppercase">Area</th>
                <th className="text-left pb-3 uppercase">Owner</th>
                <th className="text-left pb-3 uppercase">Dependencies</th>
                <th className="text-left pb-3 uppercase">Status</th>
                <th className="text-right pb-3 uppercase">Criticality</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => setSel(r)} className={`cursor-pointer border-t border-black/5 ${sel.id === r.id ? "bg-blue-50/40" : "hover:bg-slate-50"}`}>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{r.process}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.area}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.owner}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{r.deps}</td>
                  <td className="py-3.5">
                    <Chip tone={r.status as any}>{r.status === "active" ? "Active" : r.status === "review" ? "Under Review" : "Critical"}</Chip>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${r.crit}%`, background: r.crit > 80 ? "#E11D48" : r.crit > 60 ? "#F59E0B" : "#10B981" }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#0A2540", fontWeight: 500, width: 24 }}>{r.crit}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card className="p-6 h-fit sticky top-28">
        <div className="flex items-start justify-between">
          <div>
            <Chip tone={sel.status as any}>{sel.status === "active" ? "Active" : sel.status === "review" ? "Under Review" : "Critical"}</Chip>
            <div className="mt-3" style={{ fontSize: 18, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{sel.process}</div>
            <div style={{ fontSize: 12, color: "#64748B" }}>{sel.area} · Owner: {sel.owner}</div>
          </div>
          <button className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"><X className="size-4 text-slate-400" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-slate-50">
            <div style={{ fontSize: 11, color: "#64748B" }}>Criticality</div>
            <div className="mt-1" style={{ fontSize: 20, fontWeight: 600, color: "#0A2540" }}>{sel.crit}/100</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <div style={{ fontSize: 11, color: "#64748B" }}>Dependencies</div>
            <div className="mt-1" style={{ fontSize: 20, fontWeight: 600, color: "#0A2540" }}>{sel.deps}</div>
          </div>
        </div>

        <SectionTitle title="Linked resources" />
        <div className="space-y-2">
          {[
            { icon: Building, label: "Plant Lurín · Production hub" },
            { icon: Layers, label: "SAP S/4HANA · ERP system" },
            { icon: User, label: "Andina Logistics S.A.C. · 3PL" },
          ].map((d, i) => {
            const Ic = d.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50">
                <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center"><Ic className="size-4 text-slate-600" /></div>
                <div style={{ fontSize: 13, color: "#0A2540" }}>{d.label}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-2">
          <PrimaryButton>Open BIA</PrimaryButton>
          <SecondaryButton>Edit</SecondaryButton>
        </div>
      </Card>
    </div>
  );
}
