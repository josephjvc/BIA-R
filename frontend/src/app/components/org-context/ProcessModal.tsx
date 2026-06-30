import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, Save } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../shared";
import { useCreateProcess, useUpdateProcess, useCreateActivity, useDeleteActivity } from "../../../shared/queries/context.queries";
import { toast } from "sonner";
import type { BusinessProcess, CreateProcessPayload, UpdateProcessPayload } from "../../../shared/types/context";

const inputCls = "w-full h-10 px-3 rounded-xl bg-slate-50 border border-black/5 focus:bg-white focus:border-[#1E63D9]/40 outline-none";
const inputErr = "w-full h-10 px-3 rounded-xl bg-rose-50/40 border border-rose-300 focus:border-rose-400 outline-none";

interface ActivityRow { id?: string; name: string; criticalTimePeriod: string; notes: string; isNew?: boolean }

export function ProcessModal({ instanceId, process, onClose }: { instanceId: string; process: BusinessProcess | null; onClose: () => void }) {
  const isEdit = !!process;
  const createProcess = useCreateProcess();
  const updateProcess = useUpdateProcess();
  const createActivity = useCreateActivity();
  const deleteActivity = useDeleteActivity();

  const [name, setName] = useState("");
  const [businessUnit, setBusinessUnit] = useState("");
  const [owner, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [keyObjectives, setKeyObjectives] = useState("");
  const [region, setRegion] = useState("");
  const [sites, setSites] = useState("");
  const [employeesCount, setEmployeesCount] = useState("");
  const [biaPeriodicity, setBiaPeriodicity] = useState("");
  const [criticalTimePeriod, setCriticalTimePeriod] = useState("");
  const [status, setStatus] = useState("active");
  const [criticality, setCriticality] = useState("");
  const [notes, setNotes] = useState("");
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savingActivities, setSavingActivities] = useState(false);

  useEffect(() => {
    if (process) {
      setName(process.name || "");
      setBusinessUnit(process.businessUnit || "");
      setOwner(process.owner || "");
      setDescription(process.description || "");
      setKeyObjectives(process.keyObjectives || "");
      setRegion(process.region || process.country || "");
      setSites(process.sites || "");
      setEmployeesCount(process.employeesCount ? String(process.employeesCount) : "");
      setBiaPeriodicity(process.biaPeriodicity || "");
      setCriticalTimePeriod(process.criticalTimePeriod || "");
      setStatus(process.status || "active");
      setCriticality(process.criticality || "");
      setNotes(process.notes || "");
      setActivities((process.activities || []).map(a => ({ id: a.id, name: a.name, criticalTimePeriod: a.criticalTimePeriod || "", notes: a.notes || "" })));
    }
  }, [process]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Process name is required";
    if (!businessUnit.trim()) e.businessUnit = "Business unit is required";
    if (!owner.trim()) e.owner = "Process owner is required";
    if (!criticalTimePeriod.trim()) e.criticalTimePeriod = "Critical time period is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addActivity = () => setActivities([...activities, { name: "", criticalTimePeriod: "", notes: "", isNew: true }]);
  const removeActivity = (idx: number) => {
    const a = activities[idx];
    if (a.id && instanceId && process) {
      deleteActivity.mutate({ instanceId, processId: process.id, activityId: a.id });
    }
    setActivities(activities.filter((_, i) => i !== idx));
  };

 const handleSubmit = async () => {
    if (!validate()) return;
    const payload: CreateProcessPayload & UpdateProcessPayload = {
      name: name.trim(),
      businessUnit: businessUnit.trim(),
      owner: owner.trim(),
      description: description.trim() || undefined,
      keyObjectives: keyObjectives.trim() || undefined,
      country: region.trim() || undefined,
      region: region.trim() || undefined,
      sites: sites.trim() || undefined,
      employeesCount: employeesCount ? Number(employeesCount) : undefined,
      biaPeriodicity: biaPeriodicity.trim() || undefined,
      criticalTimePeriod: criticalTimePeriod.trim(),
      criticality: criticality.trim() || undefined,
      notes: notes.trim() || undefined,
      sortOrder: 0,
    };

    if (isEdit && process) {
      updateProcess.mutate(
        { instanceId, processId: process.id, data: payload },
        {
          onSuccess: (updated) => {
            const procId = updated.id;
            // Save new activities (filter empty rows)
            const newActs = activities.filter(a => a.isNew && a.name.trim());
            if (newActs.length > 0) {
              setSavingActivities(true);
              Promise.all(newActs.map(a =>
                createActivity.mutateAsync({ instanceId, processId: procId, data: { name: a.name.trim(), criticalTimePeriod: a.criticalTimePeriod || undefined, notes: a.notes || undefined } })
              )).then(() => {
                setSavingActivities(false);
                toast.success("Process saved. Instance status returned to In progress.");
                onClose();
              }).catch(() => { setSavingActivities(false); toast.error("Some activities could not be saved"); });
            } else {
              toast.success("Process saved. Instance status returned to In progress.");
              onClose();
            }
          },
        }
      );
    } else {
      createProcess.mutate(
        { instanceId, data: payload },
        {
          onSuccess: (created) => {
            const procId = created.id;
            // Filter empty activity rows
            const newActs = activities.filter(a => a.name.trim());
            if (newActs.length > 0) {
              setSavingActivities(true);
              Promise.all(newActs.map(a =>
                createActivity.mutateAsync({ instanceId, processId: procId, data: { name: a.name.trim(), criticalTimePeriod: a.criticalTimePeriod || undefined, notes: a.notes || undefined } })
              )).then(() => {
                setSavingActivities(false);
                toast.success("Process saved. Instance status returned to In progress.");
                onClose();
              }).catch(() => { setSavingActivities(false); toast.error("Some activities could not be saved"); });
            } else {
              toast.success("Process saved. Instance status returned to In progress.");
              onClose();
            }
          },
        }
      );
    }
  };

  const isPending = createProcess.isPending || updateProcess.isPending || savingActivities;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-black/5 w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#0A2540" }}>{isEdit ? "Edit process" : "Register business process"}</div>
            <div className="mt-0.5" style={{ fontSize: 13, color: "#64748B" }}>{isEdit ? "Update process information for this continuity instance." : "Add a process to the current continuity instance."}</div>
          </div>
          <button onClick={onClose} className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"><X className="size-4 text-slate-400" /></button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Section 1: Basic Info */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0A2540", letterSpacing: "0.04em", textTransform: "uppercase" }}>Basic Information</div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <Field label="Process name" required error={errors.name}>
                <input className={errors.name ? inputErr : inputCls} style={{ fontSize: 13 }} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Order Fulfillment" />
              </Field>
              <Field label="Business unit / department" required error={errors.businessUnit}>
                <input className={errors.businessUnit ? inputErr : inputCls} style={{ fontSize: 13 }} value={businessUnit} onChange={e => setBusinessUnit(e.target.value)} placeholder="e.g. Logistics" />
              </Field>
              <Field label="Process owner" required error={errors.owner}>
                <input className={errors.owner ? inputErr : inputCls} style={{ fontSize: 13 }} value={owner} onChange={e => setOwner(e.target.value)} placeholder="e.g. M. Quispe" />
              </Field>
              <Field label="Description">
                <input className={inputCls} style={{ fontSize: 13 }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Key objectives">
                <textarea rows={2} className={inputCls + " h-auto py-2 resize-none"} style={{ fontSize: 13 }} value={keyObjectives} onChange={e => setKeyObjectives(e.target.value)} placeholder="Primary goals of this process" />
              </Field>
            </div>
            <div className="mt-2 -mb-1" style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic" }}>
              The department is used as context. The process is the main unit for BIA and risk analysis.
            </div>
          </div>

          {/* Section 2: Location */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0A2540", letterSpacing: "0.04em", textTransform: "uppercase" }}>Location and Scope</div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <Field label="Country / region">
                <input className={inputCls} style={{ fontSize: 13 }} value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. Peru / Lima" />
              </Field>
              <Field label="Sites or locations">
                <input className={inputCls} style={{ fontSize: 13 }} value={sites} onChange={e => setSites(e.target.value)} placeholder="e.g. Plant Lurín, Warehouse Callao" />
              </Field>
              <Field label="Number of employees involved">
                <input type="number" className={inputCls} style={{ fontSize: 13 }} value={employeesCount} onChange={e => setEmployeesCount(e.target.value)} placeholder="e.g. 15" />
              </Field>
              <Field label="BIA review periodicity">
                <input className={inputCls} style={{ fontSize: 13 }} value={biaPeriodicity} onChange={e => setBiaPeriodicity(e.target.value)} placeholder="e.g. Annual" />
              </Field>
            </div>
          </div>

          {/* Section 3: Operational */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0A2540", letterSpacing: "0.04em", textTransform: "uppercase" }}>Operational Details</div>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <Field label="Critical time period" required error={errors.criticalTimePeriod}>
                <select className={errors.criticalTimePeriod ? inputErr : inputCls} style={{ fontSize: 13 }} value={criticalTimePeriod} onChange={e => setCriticalTimePeriod(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="Normal daily task">Normal daily task</option>
                  <option value="Daily, on demand">Daily, on demand</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly, on demand">Monthly, on demand</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
              </Field>
              <Field label="Process status">
                <select className={inputCls} style={{ fontSize: 13 }} value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="under_review">Under review</option>
                  <option value="critical">Critical</option>
                  <option value="incomplete">Incomplete</option>
                </select>
              </Field>
              <Field label="Initial criticality">
                <select className={inputCls} style={{ fontSize: 13 }} value={criticality} onChange={e => setCriticality(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </Field>
              <Field label="Notes">
                <input className={inputCls} style={{ fontSize: 13 }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes" />
              </Field>
            </div>
          </div>

          {/* Section 4: Activities */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0A2540", letterSpacing: "0.04em", textTransform: "uppercase" }}>Process Activities</div>
            <div className="mt-3 space-y-2">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input className={inputCls + " flex-1"} style={{ fontSize: 12 }} placeholder="Activity name" value={a.name}
                    onChange={e => { const c = [...activities]; c[i] = { ...a, name: e.target.value }; setActivities(c); }} />
                  <select className={inputCls + " w-40"} style={{ fontSize: 12 }} value={a.criticalTimePeriod}
                    onChange={e => { const c = [...activities]; c[i] = { ...a, criticalTimePeriod: e.target.value }; setActivities(c); }}>
                    <option value="">Period</option>
                    <option value="Normal daily task">Normal daily task</option>
                    <option value="Daily, on demand">Daily, on demand</option>
                    <option value="Monthly, on demand">Monthly, on demand</option>
                  </select>
                  <button onClick={() => removeActivity(i)} className="size-9 rounded-xl bg-rose-50 hover:bg-rose-100 flex items-center justify-center shrink-0">
                    <Trash2 className="size-4 text-rose-500" />
                  </button>
                </div>
              ))}
              <button onClick={addActivity} className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1E63D9]/10 hover:bg-[#1E63D9]/20 text-[#1E63D9] transition" style={{ fontSize: 12, fontWeight: 500 }}>
                <Plus className="size-3.5" /> Add activity
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t border-black/5 sticky bottom-0 bg-white rounded-b-2xl">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={handleSubmit} disabled={!name.trim() || !businessUnit.trim() || !owner.trim() || !criticalTimePeriod.trim() || isPending}>
            {isPending ? <span className="flex items-center gap-1.5"><Loader2 className="size-4 animate-spin" /> Saving...</span> :
              <span className="flex items-center gap-1.5"><Save className="size-4" /> {isEdit ? "Update process" : "Save process"}</span>}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }} className={required ? "after:content-['*'] after:text-rose-400 after:ml-0.5" : ""}>
        {label.toUpperCase()}
      </label>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1" style={{ fontSize: 11, color: "#BE123C" }}>{error}</div>}
    </div>
  );
}