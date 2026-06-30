import { useState } from "react";
import { useNavigate } from "react-router";
import { X, FileBarChart, Pencil, GitBranch, ShieldAlert, Trash2 } from "lucide-react";
import { Card, Chip, SecondaryButton, PrimaryButton } from "../shared";
import { useDeleteProcess } from "../../../shared/queries/context.queries";
import { toast } from "sonner";
import type { BusinessProcess } from "../../../shared/types/context";

type ChipTone = "neutral" | "active" | "review" | "critical" | "high" | "medium" | "low" | "draft";

function statusToTone(status: string): ChipTone {
  switch (status) {
    case "active": return "active";
    case "under_review": case "review": return "review";
    case "critical": return "critical";
    case "incomplete": return "draft";
    default: return "neutral";
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "active": return "Active";
    case "under_review": case "review": return "Under review";
    case "critical": return "Critical";
    case "incomplete": return "Incomplete";
    default: return status || "Active";
  }
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ProcessDetailPanel({
  process,
  instanceId,
  onClose,
  onEdit,
}: {
  process: BusinessProcess;
  instanceId: string;
  onClose: () => void;
  onEdit: () => void;
}) {
  const navigate = useNavigate();
  const deleteProcess = useDeleteProcess();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    deleteProcess.mutate(
      { instanceId, processId: process.id },
      { onSuccess: () => { toast.success("Process deleted"); onClose(); } }
    );
  };

  return (
    <Card className="p-6 h-fit sticky top-28">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <Chip tone={statusToTone(process.status)}>{statusLabel(process.status)}</Chip>
          <div className="mt-3" style={{ fontSize: 18, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{process.name}</div>
          <div style={{ fontSize: 12, color: "#64748B" }}>{process.businessUnit || "-"} · Owner: {process.owner || "-"}</div>
        </div>
        <button onClick={onClose} className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center shrink-0"><X className="size-4 text-slate-400" /></button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="p-3 rounded-xl bg-slate-50">
          <div style={{ fontSize: 11, color: "#64748B" }}>Criticality</div>
          <div className="mt-1" style={{ fontSize: 20, fontWeight: 600, color: "#0A2540" }}>{process.criticality || "-"}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50">
          <div style={{ fontSize: 11, color: "#64748B" }}>Country / Region</div>
          <div className="mt-1" style={{ fontSize: 20, fontWeight: 600, color: "#0A2540" }}>{process.country || process.region || "-"}</div>
        </div>
      </div>

      {/* Info fields */}
      <div className="mt-5 space-y-3">
        {process.description && (
          <InfoRow label="Description" value={process.description} />
        )}
        {process.keyObjectives && (
          <InfoRow label="Key objectives" value={process.keyObjectives} />
        )}
        {process.sites && (
          <InfoRow label="Sites or locations" value={process.sites} />
        )}
        <div className="grid grid-cols-2 gap-3">
          <InfoRow label="Employees" value={process.employeesCount ? String(process.employeesCount) : "-"} />
          <InfoRow label="BIA periodicity" value={process.biaPeriodicity || "-"} />
        </div>
        <InfoRow label="Critical time period" value={process.criticalTimePeriod || "-"} />
      </div>

      {/* Activities */}
      {process.activities && process.activities.length > 0 && (
        <div className="mt-5">
          <div style={{ fontSize: 12, fontWeight: 600, color: "#0A2540", letterSpacing: "0.04em", textTransform: "uppercase" }}>Activities</div>
          <div className="mt-2 space-y-1.5">
            {process.activities.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50">
                <span style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{a.name}</span>
                <span style={{ fontSize: 11, color: "#64748B" }}>{a.criticalTimePeriod || "-"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        <ActionButton icon={FileBarChart} label="Open BIA" onClick={() => navigate(`/instances/${instanceId}/bia`)} />
        <ActionButton icon={Pencil} label="Edit" onClick={onEdit} />
        <ActionButton icon={GitBranch} label="View dependencies" onClick={() => navigate(`/instances/${instanceId}/integrated`)} />
        <ActionButton icon={ShieldAlert} label="Add risk" onClick={() => navigate(`/instances/${instanceId}/risks`)} />
      </div>

      {/* Delete */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-rose-600 hover:bg-rose-50 transition"
          style={{ fontSize: 12, fontWeight: 500 }}
        >
          <Trash2 className="size-3.5" /> Delete process
        </button>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="mt-3 p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div style={{ fontSize: 13, fontWeight: 500, color: "#BE123C" }}>Delete this process?</div>
          <div className="mt-1" style={{ fontSize: 12, color: "#64748B" }}>This action cannot be undone. All activities will be removed.</div>
          <div className="mt-3 flex gap-2 justify-end">
            <SecondaryButton onClick={() => setShowDeleteConfirm(false)}>Cancel</SecondaryButton>
            <button
              onClick={handleDelete}
              disabled={deleteProcess.isPending}
              className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-40"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              {deleteProcess.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-black/5" style={{ fontSize: 11, color: "#94A3B8" }}>
        Last updated: {formatDate(process.updatedAt)}
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>{label}</div>
      <div className="mt-0.5" style={{ fontSize: 13, color: "#0A2540", lineHeight: 1.45 }}>{value}</div>
    </div>
  );
}

function ActionButton({ icon: Ic, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 h-10 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-black/5 transition" style={{ fontSize: 12, fontWeight: 500, color: "#0A2540" }}>
      <Ic className="size-4 text-slate-500" strokeWidth={1.75} />
      {label}
    </button>
  );
}