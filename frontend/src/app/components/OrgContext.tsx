import { useState } from "react";
import { useParams } from "react-router";
import { Card, Chip, PrimaryButton, SecondaryButton, SectionTitle } from "./shared";
import { Plus, Filter, Search, Save, X, Loader2 } from "lucide-react";
import { useProcesses, useCreateProcess, useDeleteProcess } from "../../shared/queries/context.queries";
import type { BusinessProcess } from "../../shared/types/context";

const inputCls = "w-full h-10 px-3 rounded-xl bg-slate-50 border border-black/5 focus:bg-white focus:border-[#1E63D9]/40 outline-none";

export function OrgContext() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const { data: processes, isLoading } = useProcesses(instanceId);
  const createProcess = useCreateProcess();
  const deleteProcess = useDeleteProcess();
  const [sel, setSel] = useState<BusinessProcess | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");

  const handleCreate = () => {
    if (!name.trim() || !instanceId) return;
    createProcess.mutate(
      { instanceId, data: { name: name.trim(), owner: owner.trim() || undefined } },
      { onSuccess: () => { setShowForm(false); setName(""); setOwner(""); } }
    );
  };

  if (isLoading) {
    return <div className="p-10 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 lg:gap-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div style={{ fontSize: 13, color: "#64748B" }}>{processes?.length || 0} processes</div>
          <PrimaryButton onClick={() => setShowForm(true)}>
            <span className="inline-flex items-center gap-1.5"><Plus className="size-4" /> Register Process</span>
          </PrimaryButton>
        </div>

        {showForm && (
          <Card className="p-4 space-y-3">
            <input className={inputCls} style={{ fontSize: 13 }} placeholder="Process name" value={name} onChange={e => setName(e.target.value)} />
            <input className={inputCls} style={{ fontSize: 13 }} placeholder="Owner (optional)" value={owner} onChange={e => setOwner(e.target.value)} />
            <div className="flex gap-2">
              <PrimaryButton onClick={handleCreate} disabled={!name.trim() || createProcess.isPending}>
                {createProcess.isPending ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4" /> Save</>}
              </PrimaryButton>
              <SecondaryButton onClick={() => { setShowForm(false); setName(""); setOwner(""); }}>Cancel</SecondaryButton>
            </div>
          </Card>
        )}

        <Card className="p-5">
          <table className="w-full">
            <thead>
              <tr style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>
                <th className="text-left pb-3 uppercase">Process</th>
                <th className="text-left pb-3 uppercase">Owner</th>
                <th className="text-left pb-3 uppercase">Status</th>
                <th className="text-right pb-3 uppercase">Criticality</th>
              </tr>
            </thead>
            <tbody>
              {(processes || []).map((p) => (
                <tr key={p.id} onClick={() => setSel(p)} className={`cursor-pointer border-t border-black/5 ${sel?.id === p.id ? "bg-blue-50/40" : "hover:bg-slate-50"}`}>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{p.name}</td>
                  <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{p.owner || "-"}</td>
                  <td className="py-3.5">
                    <Chip tone={p.status === "active" ? "active" : p.status === "critical" ? "critical" : "review"}>
                      {p.status || "active"}
                    </Chip>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.criticality || 0}%`, background: Number(p.criticality) > 80 ? "#E11D48" : Number(p.criticality) > 60 ? "#F59E0B" : "#10B981" }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#0A2540", fontWeight: 500, width: 24 }}>{p.criticality || 0}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!processes || processes.length === 0) && (
            <div className="py-10 text-center" style={{ color: "#94A3B8", fontSize: 13 }}>No processes registered yet. Click "Register Process" to add one.</div>
          )}
        </Card>
      </div>

      {sel && (
        <Card className="p-6 h-fit sticky top-28">
          <div className="flex items-start justify-between">
            <div>
              <Chip tone={sel.status === "active" ? "active" : sel.status === "critical" ? "critical" : "review"}>
                {sel.status || "active"}
              </Chip>
              <div className="mt-3" style={{ fontSize: 18, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{sel.name}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{sel.businessUnit || "-"} · Owner: {sel.owner || "-"}</div>
            </div>
            <button onClick={() => setSel(null)} className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"><X className="size-4 text-slate-400" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-3 rounded-xl bg-slate-50">
              <div style={{ fontSize: 11, color: "#64748B" }}>Criticality</div>
              <div className="mt-1" style={{ fontSize: 20, fontWeight: 600, color: "#0A2540" }}>{sel.criticality || "-"}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <div style={{ fontSize: 11, color: "#64748B" }}>Country</div>
              <div className="mt-1" style={{ fontSize: 20, fontWeight: 600, color: "#0A2540" }}>{sel.country || "-"}</div>
            </div>
          </div>

          {sel.description && (
            <div className="mt-4" style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{sel.description}</div>
          )}

          <div className="mt-6 flex gap-2">
            <SecondaryButton onClick={() => {}}>Edit</SecondaryButton>
            <SecondaryButton onClick={() => {
              if (instanceId) deleteProcess.mutate({ instanceId, processId: sel.id });
            }}>Delete</SecondaryButton>
          </div>
        </Card>
      )}
    </div>
  );
}
