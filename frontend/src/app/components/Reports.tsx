import { useParams } from "react-router";
import { Card, PrimaryButton, SecondaryButton, SectionTitle } from "./shared";
import { FileText, FileBarChart, FileSpreadsheet, Loader2, Download } from "lucide-react";
import { useReports, useGenerateReport } from "../../shared/queries/reports.queries";

const reportTypes = [
  { type: "instance_summary", icon: FileText, name: "Instance Summary", desc: "Continuity instance overview.", color: "from-blue-50 to-blue-100/40" },
  { type: "bia", icon: FileBarChart, name: "BIA Report", desc: "Business impact analysis per ISO 22317.", color: "from-amber-50 to-amber-100/40" },
  { type: "risk", icon: FileSpreadsheet, name: "Risk Report", desc: "Threats and treatment plans per ISO 31000.", color: "from-violet-50 to-violet-100/40" },
  { type: "executive_resilience", icon: FileText, name: "Executive Resilience", desc: "Board-ready resilience summary.", color: "from-emerald-50 to-emerald-100/40" },
  { type: "instance_history", icon: FileText, name: "Instance History", desc: "Full activity and change timeline.", color: "from-rose-50 to-rose-100/40" },
];

export function Reports() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const { data: reports, isLoading } = useReports(instanceId);
  const generateReport = useGenerateReport();

  if (isLoading) {
    return <div className="p-10 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-slate-400" /></div>;
  }

  const api = `http://localhost:3000/api/instances/${instanceId}/reports`;

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-5 sm:space-y-6">
      <Card className="p-6">
        <SectionTitle title="Generate reports" />
        <div className="grid grid-cols-5 gap-4">
          {reportTypes.map((r) => {
            const Ic = r.icon;
            return (
              <div key={r.type} className={`p-5 rounded-2xl border border-black/5 bg-gradient-to-br ${r.color}`}>
                <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Ic className="size-5 text-[#0A2540]" strokeWidth={1.75} />
                </div>
                <div className="mt-3" style={{ fontSize: 14, fontWeight: 600, color: "#0A2540" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{r.desc}</div>
                <button
                  onClick={() => instanceId && generateReport.mutate({ instanceId, data: { type: r.type, title: r.name } })}
                  disabled={generateReport.isPending}
                  className="mt-3 h-9 px-4 rounded-xl bg-[#0A2540] text-white text-xs font-medium hover:bg-[#0F3057] transition disabled:opacity-40"
                >
                  {generateReport.isPending ? "Generating..." : "Generate"}
                </button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <SectionTitle title="Generated reports history" />
        <table className="w-full">
          <thead>
            <tr style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>
              <th className="text-left pb-3 uppercase">Title</th>
              <th className="text-left pb-3 uppercase">Type</th>
              <th className="text-left pb-3 uppercase">Author</th>
              <th className="text-left pb-3 uppercase">Date</th>
              <th className="text-right pb-3 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(reports || []).map((r, i) => (
              <tr key={i} className="border-t border-black/5 hover:bg-slate-50">
                <td className="py-3.5" style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{r.title}</td>
                <td className="py-3.5" style={{ fontSize: 12, color: "#475569" }}>{r.type}</td>
                <td className="py-3.5" style={{ fontSize: 12, color: "#475569" }}>{r.generatedByName || "-"}</td>
                <td className="py-3.5" style={{ fontSize: 12, color: "#475569" }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}</td>
                <td className="py-3.5 text-right">
                  <a
                    href={`${api}/${r.id}/download`}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    style={{ fontSize: 12, fontWeight: 500 }}
                  >
                    <Download className="size-3.5" /> PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!reports || reports.length === 0) && (
          <div className="py-10 text-center" style={{ color: "#94A3B8", fontSize: 13 }}>No reports generated yet.</div>
        )}
      </Card>
    </div>
  );
}
