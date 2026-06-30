import { Card, Chip } from "../shared";
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

function criticalityToTone(crit: string): ChipTone {
  switch ((crit || "").toLowerCase()) {
    case "critical": case "very high": return "critical";
    case "high": return "high";
    case "medium": return "medium";
    case "low": case "very low": return "low";
    default: return "neutral";
  }
}

function criticalityLabel(crit: string): string {
  const c = (crit || "").toLowerCase();
  if (!c) return "-";
  return c.charAt(0).toUpperCase() + c.slice(1);
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ProcessTable({
  processes,
  selectedId,
  onSelect,
}: {
  processes: BusinessProcess[];
  selectedId: string | null;
  onSelect: (p: BusinessProcess) => void;
}) {
  return (
    <Card className="p-5">
      <table className="w-full">
        <thead>
          <tr style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>
            <th className="text-left pb-3 uppercase">Process</th>
            <th className="text-left pb-3 uppercase">Business unit</th>
            <th className="text-left pb-3 uppercase">Owner</th>
            <th className="text-left pb-3 uppercase">Activities</th>
            <th className="text-left pb-3 uppercase">Status</th>
            <th className="text-left pb-3 uppercase">Criticality</th>
            <th className="text-right pb-3 uppercase">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelect(p)}
              className={`cursor-pointer border-t border-black/5 ${selectedId === p.id ? "bg-blue-50/40" : "hover:bg-slate-50"}`}
            >
              <td className="py-3.5" style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{p.name}</td>
              <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{p.businessUnit || "-"}</td>
              <td className="py-3.5" style={{ fontSize: 13, color: "#475569" }}>{p.owner || "-"}</td>
              <td className="py-3.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100" style={{ fontSize: 11, fontWeight: 500, color: "#475569" }}>
                  {p.activities?.length || 0}
                </span>
              </td>
              <td className="py-3.5"><Chip tone={statusToTone(p.status)}>{statusLabel(p.status)}</Chip></td>
              <td className="py-3.5"><Chip tone={criticalityToTone(p.criticality || "")}>{criticalityLabel(p.criticality || "")}</Chip></td>
              <td className="py-3.5 text-right" style={{ fontSize: 12, color: "#94A3B8" }}>{formatDate(p.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}