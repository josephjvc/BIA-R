import { useState, useEffect, ReactNode, useMemo, useRef } from "react";
import {
  Plus, Calendar, ChevronDown, MoreHorizontal, FolderOpen, Pencil, FileDown,
  ScrollText, Archive, X, ArchiveRestore, MessageSquare, Trash2, ShieldOff, Check,
  ClipboardList, ClipboardCheck, ClipboardSignature, CheckCircle2, AlertCircle, Filter,
  HelpCircle, Building2, FileBarChart, Share2, ShieldAlert, FileText, ArrowRight, Inbox, Sparkles
} from "lucide-react";
import { Card, PrimaryButton, SecondaryButton } from "./shared";
import { useSearch, setSearchContext } from "./searchStore";

// ───────────────────────── types & helpers
export type Status = "in_progress" | "completed" | "reviewed" | "approved" | "disapproved" | "finished" | "archived";
export type ActiveInstance = { id: string; name: string; org: string; version: string; status: Status };

export const statusMeta: Record<Status, { label: string; tone: string; dot: string }> = {
  in_progress: { label: "In progress", tone: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  completed: { label: "Completed", tone: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  reviewed: { label: "Reviewed", tone: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  approved: { label: "Approved", tone: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  disapproved: { label: "Disapproved", tone: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
  finished: { label: "Finished", tone: "bg-slate-100 text-[#0A2540]", dot: "bg-[#0A2540]" },
  archived: { label: "Archived", tone: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

export function StatusChip({ s }: { s: Status }) {
  const m = statusMeta[s];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${m.tone}`} style={{ fontSize: 11, fontWeight: 500 }}>
      <span className={`size-1.5 rounded-full ${m.dot}`} /> {m.label}
    </span>
  );
}

// Tooltip (uses native title for accessibility + custom popover)
function Tip({ text, children, className = "" }: { text: string; children: ReactNode; className?: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          className="absolute z-40 left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 rounded-xl bg-[#0A2540] text-white shadow-[0_10px_30px_-10px_rgba(10,37,64,0.4)] whitespace-normal pointer-events-none"
          style={{ fontSize: 11, fontWeight: 450, lineHeight: 1.45, width: 240 }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

// ───────────────────────── data
type Participant = { name: string; email: string; role: "Author" | "Responsible" | "Reviewer" | "Approver"; initials: string; color: string };
type Instance = {
  id: string; name: string; org: string; version: string; status: Status;
  owner: string; ownerInitials: string; lastDate: string; lastBy: string; progress: number;
  country: string; industry: string; description: string; created: string;
  sections: { key: "dept" | "bia" | "dep" | "risk" | "rep"; name: string; pct: number }[];
  participants: Participant[];
  comments: { author: string; date: string; msg: string; initials: string }[];
  activity: { author: string; date: string; action: string; note?: string }[];
};

const sectionIcons: Record<string, any> = {
  dept: Building2, bia: FileBarChart, dep: Share2, risk: ShieldAlert, rep: FileText,
};
const sectionLabel: Record<string, string> = {
  dept: "Department", bia: "BIA", dep: "Dependencies", risk: "Risk", rep: "Reports",
};

const seedInstances: Instance[] = [
  {
    id: "i1", name: "Q1 2026 Continuity Analysis", org: "Bebidas Perú S.A.", version: "v1.0",
    status: "in_progress", owner: "Camila Vargas", ownerInitials: "CV", lastDate: "Apr 14, 2026", lastBy: "Mike Torres", progress: 68,
    country: "Peru", industry: "Consumer Goods · Beverages",
    description: "Quarterly continuity review for distribution and cold-chain operations across Lima and Callao.",
    created: "Jan 10, 2026",
    sections: [
      { key: "dept", name: "Organizational Context", pct: 100 },
      { key: "bia", name: "BIA Framework", pct: 85 },
      { key: "dep", name: "Dependencies", pct: 70 },
      { key: "risk", name: "Risk Assessment", pct: 55 },
      { key: "rep", name: "Reports", pct: 30 },
    ],
    participants: [
      { name: "Camila Vargas", email: "camila.vargas@bia-r.pe", role: "Author", initials: "CV", color: "from-[#1E63D9] to-[#0A2540]" },
      { name: "Mike Torres", email: "mike.torres@bia-r.pe", role: "Responsible", initials: "MT", color: "from-emerald-500 to-emerald-700" },
      { name: "Laura Pérez", email: "laura.perez@bia-r.pe", role: "Reviewer", initials: "LP", color: "from-amber-500 to-amber-700" },
      { name: "Diego Ramos", email: "diego.ramos@bia-r.pe", role: "Approver", initials: "DR", color: "from-violet-500 to-violet-700" },
    ],
    comments: [
      { author: "Mike Torres", date: "Apr 14, 2026", msg: "Updated cold-chain RTO after refrigeration audit.", initials: "MT" },
      { author: "Camila Vargas", date: "Apr 02, 2026", msg: "Final version reviewed for Q1 continuity assessment.", initials: "CV" },
    ],
    activity: [
      { author: "Mike Torres", date: "Apr 14, 2026 · 14:22", action: "Updated BIA Framework", note: "Adjusted MTPD for 3 processes." },
      { author: "Mike Torres", date: "Apr 12, 2026 · 09:10", action: "Added dependency section" },
      { author: "Laura Pérez", date: "Apr 08, 2026 · 16:45", action: "Commented" },
      { author: "Camila Vargas", date: "Apr 02, 2026 · 11:30", action: "Updated Instance Description" },
      { author: "Camila Vargas", date: "Jan 10, 2026 · 08:00", action: "Created instance", note: "Initial scope for Q1 2026." },
    ],
  },
  {
    id: "i2", name: "Distribution BIA Review", org: "Bebidas Perú S.A.", version: "v2.0",
    status: "reviewed", owner: "D. Romero", ownerInitials: "DR", lastDate: "Apr 02, 2026", lastBy: "Laura Pérez", progress: 84,
    country: "Peru", industry: "Consumer Goods · Beverages",
    description: "Deep review of distribution BIA after the Q4 incident report.", created: "Feb 18, 2026",
    sections: [
      { key: "dept", name: "Organizational Context", pct: 100 },
      { key: "bia", name: "BIA Framework", pct: 100 },
      { key: "dep", name: "Dependencies", pct: 90 },
      { key: "risk", name: "Risk Assessment", pct: 80 },
      { key: "rep", name: "Reports", pct: 50 },
    ],
    participants: [
      { name: "D. Romero", email: "d.romero@bia-r.pe", role: "Author", initials: "DR", color: "from-[#1E63D9] to-[#0A2540]" },
      { name: "Laura Pérez", email: "laura.perez@bia-r.pe", role: "Reviewer", initials: "LP", color: "from-amber-500 to-amber-700" },
    ],
    comments: [{ author: "Laura Pérez", date: "Apr 02, 2026", msg: "Approved for next-stage executive review.", initials: "LP" }],
    activity: [
      { author: "Laura Pérez", date: "Apr 02, 2026", action: "Marked as reviewed" },
      { author: "D. Romero", date: "Mar 22, 2026", action: "Updated Risk Assessment" },
      { author: "D. Romero", date: "Feb 18, 2026", action: "Created instance" },
    ],
  },
  {
    id: "i3", name: "Risk Assessment 2026", org: "Bebidas Perú S.A.", version: "v1.3",
    status: "approved", owner: "M. Quispe", ownerInitials: "MQ", lastDate: "Mar 28, 2026", lastBy: "Camila Vargas", progress: 100,
    country: "Peru", industry: "Consumer Goods · Beverages",
    description: "Annual enterprise risk assessment.", created: "Jan 20, 2026",
    sections: [
      { key: "dept", name: "Organizational Context", pct: 100 },
      { key: "bia", name: "BIA Framework", pct: 100 },
      { key: "dep", name: "Dependencies", pct: 100 },
      { key: "risk", name: "Risk Assessment", pct: 100 },
      { key: "rep", name: "Reports", pct: 100 },
    ],
    participants: [
      { name: "M. Quispe", email: "m.quispe@bia-r.pe", role: "Author", initials: "MQ", color: "from-[#1E63D9] to-[#0A2540]" },
      { name: "Camila Vargas", email: "camila.vargas@bia-r.pe", role: "Approver", initials: "CV", color: "from-violet-500 to-violet-700" },
    ],
    comments: [],
    activity: [
      { author: "Camila Vargas", date: "Mar 28, 2026", action: "Marked as approved" },
      { author: "M. Quispe", date: "Mar 10, 2026", action: "Exported summary PDF" },
      { author: "M. Quispe", date: "Jan 20, 2026", action: "Created instance" },
    ],
  },
  {
    id: "i5", name: "Plant Operations Continuity", org: "Bebidas Perú S.A.", version: "v1.2",
    status: "disapproved", owner: "Laura Pérez", ownerInitials: "LP", lastDate: "Apr 09, 2026", lastBy: "Diego Ramos", progress: 92,
    country: "Peru", industry: "Consumer Goods · Beverages",
    description: "Plant-level continuity plan covering production lines and packaging.", created: "Feb 02, 2026",
    sections: [
      { key: "dept", name: "Organizational Context", pct: 100 },
      { key: "bia", name: "BIA Framework", pct: 100 },
      { key: "dep", name: "Dependencies", pct: 90 },
      { key: "risk", name: "Risk Assessment", pct: 85 },
      { key: "rep", name: "Reports", pct: 85 },
    ],
    participants: [
      { name: "Laura Pérez", email: "laura.perez@bia-r.pe", role: "Author", initials: "LP", color: "from-[#1E63D9] to-[#0A2540]" },
      { name: "Diego Ramos", email: "diego.ramos@bia-r.pe", role: "Approver", initials: "DR", color: "from-violet-500 to-violet-700" },
    ],
    comments: [{ author: "Diego Ramos", date: "Apr 09, 2026", msg: "MTPD values for line 3 need revision before approval.", initials: "DR" }],
    activity: [
      { author: "Diego Ramos", date: "Apr 09, 2026", action: "Marked as disapproved", note: "MTPD on line 3 inconsistent with audit." },
      { author: "Laura Pérez", date: "Apr 06, 2026", action: "Marked as reviewed" },
      { author: "Laura Pérez", date: "Feb 02, 2026", action: "Created instance" },
    ],
  },
  {
    id: "i6", name: "Q4 2025 Continuity Closeout", org: "Bebidas Perú S.A.", version: "v1.0",
    status: "finished", owner: "Diego Ramos", ownerInitials: "DR", lastDate: "Jan 31, 2026", lastBy: "System", progress: 100,
    country: "Peru", industry: "Consumer Goods · Beverages",
    description: "Closed Q4 2025 continuity analysis. Ready to duplicate for the new period.", created: "Oct 05, 2025",
    sections: [
      { key: "dept", name: "Organizational Context", pct: 100 },
      { key: "bia", name: "BIA Framework", pct: 100 },
      { key: "dep", name: "Dependencies", pct: 100 },
      { key: "risk", name: "Risk Assessment", pct: 100 },
      { key: "rep", name: "Reports", pct: 100 },
    ],
    participants: [
      { name: "Diego Ramos", email: "diego.ramos@bia-r.pe", role: "Author", initials: "DR", color: "from-[#1E63D9] to-[#0A2540]" },
      { name: "Camila Vargas", email: "camila.vargas@bia-r.pe", role: "Approver", initials: "CV", color: "from-violet-500 to-violet-700" },
    ],
    comments: [],
    activity: [
      { author: "System", date: "Jan 31, 2026", action: "Marked as Finished", note: "Closed for period Q4 2025." },
      { author: "Camila Vargas", date: "Jan 20, 2026", action: "Marked as approved" },
      { author: "Diego Ramos", date: "Oct 05, 2025", action: "Created instance" },
    ],
  },
  {
    id: "i4", name: "Supply Chain Continuity", org: "Bebidas Perú S.A.", version: "v1.0",
    status: "completed", owner: "Camila Vargas", ownerInitials: "CV", lastDate: "Mar 15, 2026", lastBy: "Diego Ramos", progress: 100,
    country: "Peru", industry: "Consumer Goods · Beverages",
    description: "End-to-end supply chain continuity plan.", created: "Nov 04, 2025",
    sections: [
      { key: "dept", name: "Organizational Context", pct: 100 },
      { key: "bia", name: "BIA Framework", pct: 100 },
      { key: "dep", name: "Dependencies", pct: 100 },
      { key: "risk", name: "Risk Assessment", pct: 100 },
      { key: "rep", name: "Reports", pct: 100 },
    ],
    participants: [
      { name: "Camila Vargas", email: "camila.vargas@bia-r.pe", role: "Author", initials: "CV", color: "from-[#1E63D9] to-[#0A2540]" },
      { name: "Diego Ramos", email: "diego.ramos@bia-r.pe", role: "Responsible", initials: "DR", color: "from-emerald-500 to-emerald-700" },
    ],
    comments: [{ author: "Diego Ramos", date: "Mar 15, 2026", msg: "Closed out — handover to operations.", initials: "DR" }],
    activity: [
      { author: "Diego Ramos", date: "Mar 15, 2026", action: "Marked as completed" },
      { author: "Camila Vargas", date: "Nov 04, 2025", action: "Created instance" },
    ],
  },
];

const archivedSeed = [
  { id: "a1", name: "Cold-chain Continuity 2025", org: "Bebidas Perú S.A.", version: "v2.1", archDate: "Jan 18, 2026", archBy: "Camila Vargas", last: "completed" as Status, owner: "Camila Vargas", ownerInitials: "CV", progress: 100, terminated: false },
  { id: "a2", name: "Q4 2025 Continuity Analysis", org: "Bebidas Perú S.A.", version: "v1.4", archDate: "Dec 30, 2025", archBy: "Diego Ramos", last: "approved" as Status, owner: "Diego Ramos", ownerInitials: "DR", progress: 98, terminated: true },
  { id: "a3", name: "Distribution BIA — Legacy", org: "Bebidas Perú S.A.", version: "v1.0", archDate: "Nov 12, 2025", archBy: "Laura Pérez", last: "reviewed" as Status, owner: "Laura Pérez", ownerInitials: "LP", progress: 72, terminated: false },
];

// ───────────────────────── main
export function Instances({ onOpen }: { onOpen?: (i: ActiveInstance) => void } = {}) {
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [sel, setSel] = useState<Instance | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [dupOpen, setDupOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [statusOpen, setStatusOpen] = useState(false);
  const query = useSearch();

  useEffect(() => {
    setSearchContext(tab === "active" ? "instances:active" : "instances:archived");
  }, [tab]);

  const matchesActive = (i: Instance, q: string) => {
    if (!q) return true;
    const hay = [
      i.name, i.org, i.version, i.status, i.owner, i.lastDate, i.lastBy, i.created, i.description,
      ...i.comments.flatMap(c => [c.author, c.msg, c.date]),
      ...i.activity.flatMap(a => [a.author, a.action, a.note || "", a.date]),
      `${i.progress}%`,
    ].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  };

  const list = useMemo(
    () => seedInstances.filter(i => (statusFilter === "all" || i.status === statusFilter) && matchesActive(i, query)),
    [statusFilter, query]
  );

  const archivedFiltered = useMemo(() => {
    const q = query.toLowerCase();
    return archivedSeed.filter(r => !q || [r.name, r.org, r.version, r.archDate, r.archBy, r.last].join(" ").toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-5 sm:space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-black/5">
        {[
          { id: "active", label: "Active instances", count: seedInstances.length },
          { id: "archived", label: "Archived instances", count: archivedSeed.length },
        ].map(x => (
          <button
            key={x.id}
            onClick={() => setTab(x.id as any)}
            className="relative px-4 py-3 transition flex items-center gap-2"
            style={{ fontSize: 13, fontWeight: 500, color: tab === x.id ? "#0A2540" : "#64748B" }}
          >
            {x.label}
            <span className={`px-1.5 rounded-md ${tab === x.id ? "bg-[#0A2540]/8 text-[#0A2540]" : "bg-slate-100 text-slate-500"}`} style={{ fontSize: 10, fontWeight: 500 }}>
              {x.count}
            </span>
            {tab === x.id && <span className="absolute left-3 right-3 -bottom-px h-0.5 bg-[#0A2540] rounded-full" />}
          </button>
        ))}
      </div>

      {tab === "active" ? (
        <>
          {/* Compact filter bar */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <button className="h-10 px-3.5 rounded-xl bg-slate-50 border border-black/5 hover:bg-white hover:border-black/10 flex items-center gap-2 transition">
                  <Calendar className="size-4 text-slate-500" strokeWidth={1.75} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>Mar 01 – Apr 30, 2026</span>
                  <ChevronDown className="size-3.5 text-slate-400" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setStatusOpen(v => !v)}
                    className="h-10 px-3.5 rounded-xl bg-slate-50 border border-black/5 hover:bg-white hover:border-black/10 flex items-center gap-2 transition min-w-[170px]"
                  >
                    <Filter className="size-3.5 text-slate-500" strokeWidth={1.75} />
                    <span className="capitalize" style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>
                      Status: {statusFilter === "all" ? "All" : statusFilter.replace("_", " ")}
                    </span>
                    <ChevronDown className="size-3.5 text-slate-400 ml-auto" />
                  </button>
                  {statusOpen && (
                    <div className="absolute z-30 mt-1.5 w-[200px] bg-white rounded-2xl border border-black/5 shadow-[0_20px_60px_-20px_rgba(10,37,64,0.25)] p-1.5">
                      {(["all", "in_progress", "completed", "reviewed", "approved", "disapproved", "finished"] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-50 capitalize"
                          style={{ fontSize: 13, color: "#0A2540" }}
                        >
                          {s === "all" ? "All" : s.replace("_", " ")}
                          {statusFilter === s && <Check className="size-3.5 text-[#1E63D9]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Tip text="Export history PDF includes the full activity and change history since creation.">
                  <SecondaryButton onClick={() => setExportOpen(true)}>
                    <span className="inline-flex items-center gap-1.5"><ScrollText className="size-3.5" /> Export history PDF</span>
                  </SecondaryButton>
                </Tip>
                <PrimaryButton onClick={() => setNewOpen(true)}>
                  <span className="inline-flex items-center gap-1.5"><Plus className="size-4" /> New instance</span>
                </PrimaryButton>
              </div>
            </div>
          </Card>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {[
              { l: "Active", v: 12, hint: "+2 this month", icon: ClipboardList, color: "text-blue-700 bg-blue-50" },
              { l: "Under review", v: 4, hint: "2 pending approval", icon: ClipboardSignature, color: "text-amber-700 bg-amber-50" },
              { l: "Approved", v: 7, hint: "+1 vs last month", icon: ClipboardCheck, color: "text-violet-700 bg-violet-50" },
              { l: "Completed", v: 18, hint: "All on schedule", icon: CheckCircle2, color: "text-emerald-700 bg-emerald-50" },
            ].map((k, i) => {
              const Ic = k.icon;
              return (
                <Card key={i} className="p-5">
                  <div className="flex items-start justify-between">
                    <div className={`size-9 rounded-xl ${k.color} flex items-center justify-center`}>
                      <Ic className="size-4" strokeWidth={1.75} />
                    </div>
                  </div>
                  <div className="mt-3" style={{ fontSize: 28, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.02em" }}>{k.v}</div>
                  <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{k.l}</div>
                  <div className="mt-1.5" style={{ fontSize: 11, color: "#94A3B8" }}>{k.hint}</div>
                </Card>
              );
            })}
          </div>

          {/* Helper + grid */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0A2540" }}>Your workspaces</div>
              <Tip text="An instance is a complete continuity analysis workspace with its own BIA, risks, dependencies and reports.">
                <button className="size-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                  <HelpCircle className="size-3 text-slate-500" strokeWidth={1.75} />
                </button>
              </Tip>
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>
              {query
                ? `Showing ${list.length} matching ${list.length === 1 ? "instance" : "instances"}`
                : `${list.length} active ${list.length === 1 ? "instance" : "instances"}`}
            </div>
          </div>

          {list.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No active instances yet"
              subtitle={query ? "Try a different search or clear filters to see all instances." : "Create your first continuity instance to start analyzing impact, risks and dependencies."}
              action={<PrimaryButton onClick={() => setNewOpen(true)}><span className="inline-flex items-center gap-1.5"><Plus className="size-4" /> New instance</span></PrimaryButton>}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
              {list.map(i => (
                <InstanceCard
                  key={i.id}
                  inst={i}
                  onSelect={() => setSel(i)}
                  onOpen={() => onOpen?.({ id: i.id, name: i.name, org: i.org, version: i.version, status: i.status })}
                  onEdit={() => { setSel(i); setEditOpen(true); }}
                  onExportHistory={() => { setSel(i); setExportOpen(true); }}
                  onDuplicatePeriod={() => { setSel(i); setDupOpen(true); }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <ArchivedGallery rows={archivedFiltered} totalCount={archivedSeed.length} query={query} />
      )}

      {/* Drawer */}
      {sel && (
        <InstanceDetailDrawer
          instance={sel}
          onClose={() => setSel(null)}
          onEdit={() => setEditOpen(true)}
          onExportHistory={() => setExportOpen(true)}
          onOpenWorkspace={() => onOpen?.({ id: sel.id, name: sel.name, org: sel.org, version: sel.version, status: sel.status })}
        />
      )}

      {newOpen && <NewInstanceModal onClose={() => setNewOpen(false)} />}
      {editOpen && sel && <EditInstanceModal instance={sel} onClose={() => setEditOpen(false)} />}
      {exportOpen && <ExportHistoryPdfModal onClose={() => setExportOpen(false)} />}
      {dupOpen && sel && <DuplicatePeriodModal instance={sel} onClose={() => setDupOpen(false)} />}
    </div>
  );
}

// ───────────────────────── Instance Card
function InstanceCard({
  inst, onSelect, onOpen, onEdit, onExportHistory, onDuplicatePeriod,
}: {
  inst: Instance; onSelect: () => void; onOpen: () => void; onEdit: () => void; onExportHistory: () => void; onDuplicatePeriod: () => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false); };
    if (moreOpen) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [moreOpen]);

  const progColor = inst.progress >= 100 ? "#10B981" : inst.progress >= 70 ? "#1E63D9" : inst.progress >= 40 ? "#F59E0B" : "#94A3B8";

  return (
    <div
      onClick={onSelect}
      className="group relative bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(10,37,64,0.04),0_8px_24px_-12px_rgba(10,37,64,0.08)] hover:shadow-[0_2px_4px_rgba(10,37,64,0.06),0_16px_40px_-12px_rgba(10,37,64,0.16)] hover:border-black/10 transition cursor-pointer p-5"
    >
      {/* top row */}
      <div className="flex items-start justify-between">
        <StatusChip s={inst.status} />
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <Tip text="Edit instance details.">
            <IconAction icon={Pencil} onClick={onEdit} />
          </Tip>
          <Tip text="Generate a PDF summary report of this instance.">
            <IconAction icon={FileDown} />
          </Tip>
          <div className="relative" ref={moreRef}>
            <IconAction icon={MoreHorizontal} onClick={() => setMoreOpen(v => !v)} />
            {moreOpen && (
              <div className="absolute right-0 top-9 z-30 w-60 bg-white rounded-2xl border border-black/5 shadow-[0_20px_60px_-20px_rgba(10,37,64,0.25)] p-1.5">
                {(inst.status === "finished"
                  ? [
                      { ic: FolderOpen, label: "Open", onClick: onOpen },
                      { ic: Sparkles, label: "Duplicate for new period", onClick: onDuplicatePeriod },
                      { ic: FileDown, label: "Export PDF" },
                      { ic: ScrollText, label: "Export history PDF", onClick: onExportHistory },
                      { ic: Archive, label: "Archive" },
                    ]
                  : [
                      { ic: Pencil, label: "Edit", onClick: onEdit },
                      { ic: FileDown, label: "Export PDF" },
                      { ic: ScrollText, label: "Export history PDF", onClick: onExportHistory },
                      { ic: Archive, label: "Archive" },
                    ]
                ).map((m, i) => {
                  const Ic = m.ic;
                  return (
                    <button
                      key={i}
                      onClick={() => { setMoreOpen(false); m.onClick?.(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-slate-50"
                      style={{ fontSize: 13, color: "#0A2540" }}
                    >
                      <Ic className="size-3.5 text-slate-500" /> {m.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* title */}
      <div className="mt-3" style={{ fontSize: 16, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>
        {inst.name}
      </div>
      <div style={{ fontSize: 12, color: "#64748B" }}>{inst.org} · {inst.version}</div>

      {/* owner + last modified */}
      <div className="mt-4 flex items-center gap-3">
        <div className="size-7 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 10, fontWeight: 500 }}>
          {inst.ownerInitials}
        </div>
        <div className="min-w-0">
          <div className="truncate" style={{ fontSize: 12, color: "#0A2540", fontWeight: 500 }}>{inst.owner}</div>
          <div className="truncate" style={{ fontSize: 11, color: "#94A3B8" }}>Updated {inst.lastDate} · {inst.lastBy}</div>
        </div>
      </div>

      {/* progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.02em" }}>PROGRESS</span>
            <Tip text="Progress is calculated from completed sections.">
              <HelpCircle className="size-3 text-slate-400" />
            </Tip>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0A2540" }}>{inst.progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${inst.progress}%`, background: progColor }} />
        </div>
      </div>

      {/* section indicators */}
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {inst.sections.map(s => {
          const Ic = sectionIcons[s.key];
          const done = s.pct >= 100;
          const partial = s.pct > 0 && s.pct < 100;
          return (
            <Tip key={s.key} text={`${sectionLabel[s.key]} · ${s.pct}%`}>
              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${done ? "bg-emerald-50/60 border-emerald-100" : partial ? "bg-blue-50/60 border-blue-100" : "bg-slate-50 border-black/5"}`}>
                <Ic className={`size-3.5 ${done ? "text-emerald-700" : partial ? "text-[#1E63D9]" : "text-slate-400"}`} strokeWidth={1.75} />
                <span style={{ fontSize: 9, color: done ? "#047857" : partial ? "#1E63D9" : "#94A3B8", fontWeight: 500 }}>{sectionLabel[s.key]}</span>
              </div>
            </Tip>
          );
        })}
      </div>

      {/* footer */}
      <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between" onClick={e => e.stopPropagation()}>
        <span style={{ fontSize: 11, color: "#94A3B8" }}>Created {inst.created}</span>
        <button
          onClick={onOpen}
          className="h-9 px-4 rounded-xl bg-[#0A2540] hover:bg-[#0F3057] text-white inline-flex items-center gap-1.5 transition shadow-[0_8px_24px_-12px_rgba(10,37,64,0.5)]"
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          Open <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function IconAction({ icon: Ic, onClick }: { icon: any; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-[#0A2540] transition">
      <Ic className="size-4" strokeWidth={1.75} />
    </button>
  );
}

// ───────────────────────── Archived gallery
function ArchivedGallery({ rows, totalCount, query }: { rows: typeof archivedSeed; totalCount: number; query: string }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0A2540" }}>Archived workspaces</div>
          <Tip text="Archived instances are hidden from the active list but can be restored later.">
            <button className="size-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
              <HelpCircle className="size-3 text-slate-500" strokeWidth={1.75} />
            </button>
          </Tip>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600" style={{ fontSize: 11, fontWeight: 500 }}>
          <Archive className="size-3" /> {rows.length} of {totalCount}
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No archived instances"
          subtitle={query ? "No archived instances match your search." : "Archived workspaces will appear here. You can restore them at any time."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rows.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-black/5 p-5 opacity-90 hover:opacity-100 hover:border-black/10 transition">
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600" style={{ fontSize: 11, fontWeight: 500 }}>
                  <Archive className="size-3" /> Archived
                </span>
                <Tip text={r.terminated ? "Permanently delete this terminated instance." : "Terminate this instance."}>
                  <span style={{ fontSize: 10, color: r.terminated ? "#BE123C" : "#94A3B8", fontWeight: 500 }}>
                    {r.terminated ? "TERMINATED" : ""}
                  </span>
                </Tip>
              </div>
              <div className="mt-3" style={{ fontSize: 16, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{r.org} · {r.version}</div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Meta label="Archived" value={r.archDate} />
                <Meta label="Archived by" value={r.archBy} />
                <Meta label="Last status" value={statusMeta[r.last].label} />
                <Meta label="Owner" value={r.owner} />
              </div>

              <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Tip text="Open this archived instance read-only.">
                    <IconAction icon={FolderOpen} />
                  </Tip>
                  <Tip text="Export PDF summary.">
                    <IconAction icon={FileDown} />
                  </Tip>
                  <Tip text="Export history PDF includes the full activity and change history since creation.">
                    <IconAction icon={ScrollText} />
                  </Tip>
                  <Tip text={r.terminated ? "Delete this terminated instance." : "More actions."}>
                    <IconAction icon={r.terminated ? Trash2 : MoreHorizontal} />
                  </Tip>
                </div>
                <button className="h-9 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-black/10 text-slate-700 inline-flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 500 }}>
                  <ArchiveRestore className="size-3.5" /> Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-slate-50">
      <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em" }}>{label.toUpperCase()}</div>
      <div className="mt-0.5 truncate" style={{ fontSize: 12, color: "#0A2540", fontWeight: 500 }}>{value}</div>
    </div>
  );
}

// ───────────────────────── Empty state
function EmptyState({ icon: Ic, title, subtitle, action }: { icon: any; title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center text-center">
      <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Ic className="size-6 text-[#1E63D9]" strokeWidth={1.5} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{title}</div>
      <div className="mt-1 max-w-sm" style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{subtitle}</div>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ───────────────────────── Detail Drawer
function InstanceDetailDrawer({
  instance, onClose, onEdit, onExportHistory, onOpenWorkspace,
}: {
  instance: Instance; onClose: () => void; onEdit: () => void; onExportHistory: () => void; onOpenWorkspace?: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "activity" | "comments">("overview");
  const [commentText, setCommentText] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="hidden sm:block flex-1 bg-[#0A2540]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full sm:w-[520px] h-full bg-white shadow-[-20px_0_60px_-20px_rgba(10,37,64,0.25)] overflow-y-auto">
        {/* header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-black/5 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.06em" }}>INSTANCE DETAILS</div>
              <div className="mt-1.5" style={{ fontSize: 18, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{instance.name}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{instance.org} · {instance.version}</div>
            </div>
            <button onClick={onClose} className="size-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
              <X className="size-4 text-slate-600" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <StatusChip s={instance.status} />
            <span style={{ fontSize: 11, color: "#94A3B8" }}>· Owner {instance.owner}</span>
          </div>

          {/* tabs */}
          <div className="mt-4 flex items-center gap-1 -mb-px">
            {[
              { id: "overview", label: "Overview" },
              { id: "activity", label: "Activity" },
              { id: "comments", label: "Comments" },
            ].map(x => (
              <button
                key={x.id}
                onClick={() => setTab(x.id as any)}
                className="relative px-3 py-2.5"
                style={{ fontSize: 12, fontWeight: 500, color: tab === x.id ? "#0A2540" : "#94A3B8" }}
              >
                {x.label}
                {tab === x.id && <span className="absolute left-2 right-2 -bottom-px h-0.5 bg-[#0A2540] rounded-full" />}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {tab === "overview" && (
            <>
              <div>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }}>DESCRIPTION</div>
                <div className="mt-1.5" style={{ fontSize: 13, color: "#0A2540", lineHeight: 1.55 }}>{instance.description}</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0A2540" }}>Progress by section</div>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{instance.progress}% overall</span>
                </div>
                <div className="space-y-2.5">
                  {instance.sections.map((s, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
                        <span style={{ color: "#0A2540" }}>{s.name}</span>
                        <span style={{ color: s.pct === 100 ? "#047857" : "#64748B", fontWeight: 500 }}>
                          {s.pct === 100 ? "Completed" : `${s.pct}%`}
                        </span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.pct === 100 ? "#10B981" : s.pct >= 60 ? "#1E63D9" : "#F59E0B" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0A2540", marginBottom: 12 }}>Participants</div>
                <div className="space-y-1.5">
                  {instance.participants.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                      <div className={`size-9 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white`} style={{ fontSize: 11, fontWeight: 500 }}>
                        {p.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate" style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{p.name}</div>
                        <div className="truncate" style={{ fontSize: 11, color: "#94A3B8" }}>{p.email}</div>
                      </div>
                      <RoleChip role={p.role} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "activity" && (
            <div className="relative">
              <div className="absolute left-[15px] top-1 bottom-1 w-px bg-slate-200" />
              <div className="space-y-4">
                {instance.activity.map((e, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-2 top-1 size-3 rounded-full bg-white border-2 border-[#1E63D9]" />
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{e.action}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{e.author} · {e.date}</div>
                    {e.note && <div className="mt-1.5 p-2.5 rounded-lg bg-slate-50 border border-black/5" style={{ fontSize: 12, color: "#475569" }}>{e.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "comments" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="size-4 text-slate-500" />
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0A2540" }}>Comments & change notes</div>
              </div>
              <div className="space-y-2.5">
                {instance.comments.length === 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 text-center" style={{ fontSize: 12, color: "#64748B" }}>
                    No comments yet.
                  </div>
                )}
                {instance.comments.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-black/5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 10, fontWeight: 500 }}>
                        {c.initials}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#0A2540" }}>{c.author}</span>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>· {c.date}</span>
                    </div>
                    <div className="mt-2" style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{c.msg}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-end gap-2">
                <textarea
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  rows={2}
                  placeholder="Add comment or change note…"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-black/5 focus:bg-white focus:border-[#1E63D9]/40 outline-none resize-none"
                  style={{ fontSize: 12 }}
                />
                <PrimaryButton>Post</PrimaryButton>
              </div>
            </div>
          )}
        </div>

        {/* footer actions */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-black/5 px-6 py-4 grid grid-cols-2 gap-2">
          <PrimaryButton onClick={onOpenWorkspace}><span className="inline-flex items-center gap-1.5">Open workspace <ArrowRight className="size-3.5" /></span></PrimaryButton>
          <SecondaryButton onClick={onEdit}><span className="inline-flex items-center gap-1.5"><Pencil className="size-3.5" /> Edit</span></SecondaryButton>
          <SecondaryButton><span className="inline-flex items-center gap-1.5"><FileDown className="size-3.5" /> Export PDF</span></SecondaryButton>
          <SecondaryButton onClick={onExportHistory}><span className="inline-flex items-center gap-1.5"><ScrollText className="size-3.5" /> Export history PDF</span></SecondaryButton>
          <div className="col-span-2">
            <SecondaryButton><span className="inline-flex items-center gap-1.5 justify-center w-full"><Archive className="size-3.5" /> Archive instance</span></SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleChip({ role }: { role: Participant["role"] }) {
  const map: Record<string, string> = {
    Author: "bg-blue-50 text-blue-700",
    Responsible: "bg-emerald-50 text-emerald-700",
    Reviewer: "bg-amber-50 text-amber-700",
    Approver: "bg-violet-50 text-violet-700",
  };
  return <span className={`px-2 py-0.5 rounded-full ${map[role]}`} style={{ fontSize: 10, fontWeight: 500 }}>{role}</span>;
}

// ───────────────────────── Modals (unchanged structure)
function ModalShell({ title, subtitle, onClose, children, footer, width = 760 }: {
  title: string; subtitle?: string; onClose: () => void; children: ReactNode; footer: ReactNode; width?: number;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-6 bg-[#0A2540]/30 backdrop-blur-sm">
      <div
        className="bg-white sm:rounded-3xl shadow-[0_30px_80px_-20px_rgba(10,37,64,0.35)] overflow-hidden flex flex-col w-full max-h-[100dvh] sm:max-h-[90vh]"
        style={{ maxWidth: `min(${width}px, 100%)` }}
      >
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-black/5 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <div className="truncate" style={{ fontSize: 18, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{title}</div>
            {subtitle && <div className="mt-0.5 truncate" style={{ fontSize: 12, color: "#64748B" }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} className="size-11 sm:size-9 rounded-lg hover:bg-slate-100 flex items-center justify-center shrink-0">
            <X className="size-4 text-slate-500" />
          </button>
        </div>
        <div className="px-5 sm:px-7 py-5 sm:py-6 overflow-y-auto flex-1">{children}</div>
        <div className="px-5 sm:px-7 py-3 sm:py-4 border-t border-black/5 bg-slate-50/40 flex items-center justify-end gap-2 shrink-0">{footer}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }}>{label.toUpperCase()}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
const inputCls = "w-full h-10 px-3 rounded-xl bg-slate-50 border border-black/5 focus:bg-white focus:border-[#1E63D9]/40 outline-none";

function NewInstanceModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell
      title="Create continuity instance"
      subtitle="The new instance will start automatically with status: In progress."
      onClose={onClose}
      footer={<>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={onClose}>Create instance</PrimaryButton>
      </>}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5 md:gap-7">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="Instance name"><input className={inputCls} style={{ fontSize: 13 }} placeholder="e.g. Q2 2026 Continuity Analysis" /></Field></div>
          <Field label="Organization"><input className={inputCls} style={{ fontSize: 13 }} defaultValue="Bebidas Perú S.A." /></Field>
          <Field label="Version"><input className={inputCls} style={{ fontSize: 13 }} defaultValue="v1.0" /></Field>
          <Field label="Country"><input className={inputCls} style={{ fontSize: 13 }} defaultValue="Peru" /></Field>
          <Field label="Business industry"><input className={inputCls} style={{ fontSize: 13 }} defaultValue="Consumer Goods · Beverages" /></Field>
          <div className="col-span-2"><Field label="Owner"><input className={inputCls} style={{ fontSize: 13 }} defaultValue="Camila Vargas" /></Field></div>
          <div className="col-span-2">
            <Field label="Description">
              <textarea rows={3} className={inputCls + " h-auto py-2 resize-none"} style={{ fontSize: 13 }} placeholder="Briefly describe the scope of this continuity analysis…" />
            </Field>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-black/5">
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }}>WORKFLOW PREVIEW</div>
          <div className="mt-3 space-y-3">
            {["Instance Description", "BIA Framework", "Dependencies", "Risk Assessment", "Reports"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="size-7 rounded-full bg-white border border-black/5 flex items-center justify-center" style={{ fontSize: 11, fontWeight: 600, color: "#0A2540" }}>{i + 1}</div>
                <div style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function EditInstanceModal({ instance, onClose }: { instance: Instance; onClose: () => void }) {
  return (
    <ModalShell
      title="Edit instance details"
      subtitle="Update general information for this continuity instance."
      onClose={onClose}
      width={620}
      footer={<>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={onClose}>Save changes</PrimaryButton>
      </>}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Field label="Instance name"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={instance.name} /></Field></div>
        <Field label="Organization"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={instance.org} /></Field>
        <Field label="Version"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={instance.version} /></Field>
        <Field label="Country"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={instance.country} /></Field>
        <Field label="Business industry"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={instance.industry} /></Field>
        <div className="col-span-2"><Field label="Owner"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={instance.owner} /></Field></div>
        <div className="col-span-2">
          <Field label="Description">
            <textarea rows={3} className={inputCls + " h-auto py-2 resize-none"} style={{ fontSize: 13 }} defaultValue={instance.description} />
          </Field>
        </div>
      </div>
    </ModalShell>
  );
}

function DuplicatePeriodModal({ instance, onClose }: { instance: Instance; onClose: () => void }) {
  const copyOpts = [
    "Copy Department Description",
    "Copy Organizational Context",
    "Copy Dependencies",
    "Copy BIA criteria",
    "Copy Risk parameters",
    "Copy participants",
    "Do not copy comments and history",
  ];
  const [checked, setChecked] = useState<boolean[]>([true, true, true, true, true, true, true]);
  return (
    <ModalShell
      title="Duplicate instance for new period"
      subtitle="The new instance will start with status: In progress."
      onClose={onClose}
      width={760}
      footer={<>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={onClose}><span className="inline-flex items-center gap-1.5"><Sparkles className="size-3.5" /> Create new period instance</span></PrimaryButton>
      </>}
    >
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 mb-5">
        <AlertCircle className="size-4 text-[#1E63D9] mt-0.5" />
        <div style={{ fontSize: 12, color: "#0A2540", lineHeight: 1.55 }}>
          This will create a new continuity analysis instance using <strong>{instance.name}</strong> as a base.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-5 md:gap-7">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Field label="New instance name"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={`${instance.name} — new period`} /></Field></div>
          <Field label="New period"><input className={inputCls} style={{ fontSize: 13 }} placeholder="e.g. Q2 2026" /></Field>
          <Field label="Version"><input className={inputCls} style={{ fontSize: 13 }} defaultValue="v1.0" /></Field>
          <Field label="Organization"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={instance.org} /></Field>
          <Field label="Owner"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={instance.owner} /></Field>
          <div className="col-span-2">
            <Field label="Description">
              <textarea rows={3} className={inputCls + " h-auto py-2 resize-none"} style={{ fontSize: 13 }} defaultValue={instance.description} />
            </Field>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-black/5">
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }}>COPY OPTIONS</div>
          <div className="mt-3 space-y-1.5">
            {copyOpts.map((o, i) => (
              <label key={i} className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-white/60 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setChecked(arr => arr.map((v, idx) => idx === i ? !v : v))}
                  className={`mt-0.5 size-[18px] rounded-md border ${checked[i] ? "bg-[#0A2540] border-[#0A2540]" : "bg-white border-black/15"} flex items-center justify-center transition shrink-0`}
                >
                  {checked[i] && <Check className="size-3 text-white" strokeWidth={3} />}
                </button>
                <span style={{ fontSize: 12.5, color: "#0A2540", lineHeight: 1.45 }}>{o}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function ExportHistoryPdfModal({ onClose }: { onClose: () => void }) {
  const opts = [
    "Include activity timeline",
    "Include comments and change notes",
    "Include status changes",
    "Include participant changes",
    "Include version changes",
  ];
  const [checked, setChecked] = useState<boolean[]>([true, true, true, true, true]);
  return (
    <ModalShell
      title="Export instance history"
      onClose={onClose}
      width={520}
      footer={<>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={onClose}><span className="inline-flex items-center gap-1.5"><FileDown className="size-3.5" /> Generate history PDF</span></PrimaryButton>
      </>}
    >
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
        <AlertCircle className="size-4 text-[#1E63D9] mt-0.5" />
        <div style={{ fontSize: 12, color: "#0A2540", lineHeight: 1.55 }}>
          This PDF will include the full activity and change history of this continuity instance since its creation.
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {opts.map((o, i) => (
          <label key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
            <button
              type="button"
              onClick={() => setChecked(arr => arr.map((v, idx) => idx === i ? !v : v))}
              className={`size-5 rounded-md border ${checked[i] ? "bg-[#0A2540] border-[#0A2540]" : "bg-white border-black/15"} flex items-center justify-center transition`}
            >
              {checked[i] && <Check className="size-3.5 text-white" strokeWidth={3} />}
            </button>
            <span style={{ fontSize: 13, color: "#0A2540" }}>{o}</span>
          </label>
        ))}
      </div>
    </ModalShell>
  );
}
