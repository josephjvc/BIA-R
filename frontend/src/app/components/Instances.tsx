import { useState, useEffect, ReactNode, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Plus, Calendar, ChevronDown, MoreHorizontal, FolderOpen, Pencil, FileDown,
  ScrollText, Archive, X, ArchiveRestore, MessageSquare, Trash2, Check,
  ClipboardList, ClipboardCheck, ClipboardSignature, CheckCircle2, AlertCircle, Filter,
  HelpCircle, Building2, FileBarChart, Share2, ShieldAlert, FileText, ArrowRight, Inbox, Sparkles
} from "lucide-react";
import { Card, PrimaryButton, SecondaryButton } from "./shared";
import { useSearch, setSearchContext } from "./searchStore";
import { useInstanceStore } from "../../shared/store/instance.store";
import {
  useInstances, useCreateInstance, useUpdateInstance, useDuplicateInstance,
  useActivityLog, useParticipants,
} from "../../shared/queries/instances.queries";
import { useInstance } from "../../shared/queries/instances.queries";
import { useComments, useCreateComment, useDeleteComment } from "../../shared/queries/comments.queries";
import { useAuthStore } from "../../shared/store/auth.store";
import type { InstanceSummary, InstanceStatus } from "../../shared/types/instance";

// ───────────────────────── types & helpers
type SectionKey = "dept" | "bia" | "dep" | "risk" | "rep";
type SectionStatus = "complete" | "in_progress" | "not_started";

const sectionIcons: Record<SectionKey, React.ElementType> = {
  dept: Building2, bia: FileBarChart, dep: Share2, risk: ShieldAlert, rep: FileText,
};
const sectionLabel: Record<SectionKey, string> = {
  dept: "Organizational Context", bia: "BIA", dep: "Dependencies", risk: "Risk", rep: "Reports",
};
const sectionShort: Record<SectionKey, string> = {
  dept: "Context", bia: "BIA", dep: "Dep.", risk: "Risk", rep: "Reports",
};

const sectionKeys: SectionKey[] = ["dept", "bia", "dep", "risk", "rep"];

export const statusMeta: Record<InstanceStatus, { label: string; tone: string; dot: string }> = {
  in_progress: { label: "In progress", tone: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  completed: { label: "Completed", tone: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  reviewed: { label: "Reviewed", tone: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  approved: { label: "Approved", tone: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  disapproved: { label: "Disapproved", tone: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
  finished: { label: "Finished", tone: "bg-slate-100 text-[#0A2540]", dot: "bg-[#0A2540]" },
  archived: { label: "Archived", tone: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

function getSectionStatus(inst: InstanceSummary, key: SectionKey): { status: SectionStatus; tooltip: string } {
  switch (key) {
    case "dept":
      if (inst.processCount === 0) return { status: "not_started", tooltip: "No processes yet" };
      if (inst.activityCount > 0) return { status: "complete", tooltip: `${inst.processCount} processes · ${inst.activityCount} activities` };
      return { status: "in_progress", tooltip: `${inst.processCount} processes` };
    case "bia":
      if (inst.processCount === 0) return { status: "not_started", tooltip: "No processes to assess" };
      if (inst.biaAssessmentCount === 0) return { status: "not_started", tooltip: "No assessments yet" };
      if (inst.biaAssessmentCount < inst.processCount) return { status: "in_progress", tooltip: `${inst.biaAssessmentCount}/${inst.processCount} processes assessed` };
      return { status: "complete", tooltip: `${inst.processCount}/${inst.processCount} processes assessed` };
    case "dep":
      return { status: "not_started", tooltip: "Not available" };
    case "risk":
      if (inst.riskCount === 0) return { status: "not_started", tooltip: "No risks identified" };
      return { status: "complete", tooltip: `${inst.riskCount} risks identified` };
    case "rep":
      if (inst.reportCount === 0) return { status: "not_started", tooltip: "None generated" };
      return { status: "complete", tooltip: `${inst.reportCount} reports generated` };
  }
}

function computeProgress(inst: InstanceSummary): number {
  const done = sectionKeys.filter(k => getSectionStatus(inst, k).status === "complete").length;
  const partial = sectionKeys.filter(k => getSectionStatus(inst, k).status === "in_progress").length;
  return Math.round((done * 100 + partial * 50) / sectionKeys.length);
}

function initials(name: string): string {
  return name.split(" ").map(w => w[0]).filter(Boolean).join("").toUpperCase().slice(0, 2);
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function StatusChip({ s }: { s: string }) {
  const m = statusMeta[s as InstanceStatus] ?? statusMeta.in_progress;
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

// ───────────────────────── main
export function Instances() {
  const navigate = useNavigate();
  const setActiveInstance = useInstanceStore((s) => s.setActiveInstance);
  const [tab, setTab] = useState<"active" | "archived">("active");

  const { data: instances = [], isLoading, isError, error } = useInstances();
  const createInstance = useCreateInstance();
  const updateInstance = useUpdateInstance();
  const duplicateInstance = useDuplicateInstance();

  const openInstance = (i: InstanceSummary) => {
    setActiveInstance(i);
    navigate(`/instances/${i.id}/dashboard`);
  };
  const [sel, setSel] = useState<InstanceSummary | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [dupOpen, setDupOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | InstanceStatus>("all");
  const [statusOpen, setStatusOpen] = useState(false);
  const query = useSearch();

  useEffect(() => {
    setSearchContext(tab === "active" ? "instances:active" : "instances:archived");
  }, [tab]);

  const matchesQuery = (i: InstanceSummary, q: string) => {
    if (!q) return true;
    const hay = [
      i.name, i.org, i.version, i.status, i.createdByName, i.createdAt, i.updatedAt,
    ].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  };

  const list = useMemo(
    () => instances
      .filter(i => i.status !== "archived")
      .filter(i => statusFilter === "all" || i.status === statusFilter)
      .filter(i => matchesQuery(i, query)),
    [instances, statusFilter, query]
  );

  const archivedList = useMemo(
    () => instances.filter(i => i.status === "archived").filter(i => matchesQuery(i, query)),
    [instances, query]
  );

  const kpis = useMemo(() => ({
    active: instances.filter(i => ["in_progress", "completed"].includes(i.status)).length,
    underReview: instances.filter(i => i.status === "reviewed").length,
    approved: instances.filter(i => i.status === "approved").length,
    completed: instances.filter(i => i.status === "finished").length,
  }), [instances]);

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-10">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center" style={{ color: "#BE123C" }}>
          <AlertCircle className="size-8 mx-auto mb-3" />
          <div style={{ fontSize: 16, fontWeight: 600 }}>Failed to load instances</div>
          <div className="mt-1" style={{ fontSize: 13 }}>{(error as Error)?.message || "An unexpected error occurred."}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-5 sm:space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-black/5">
        {[
          { id: "active", label: "Active instances", count: instances.filter(i => i.status !== "archived").length },
          { id: "archived", label: "Archived instances", count: instances.filter(i => i.status === "archived").length },
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
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>All periods</span>
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
              { l: "Active", v: kpis.active, hint: "In progress or completed", icon: ClipboardList, color: "text-blue-700 bg-blue-50" },
              { l: "Under review", v: kpis.underReview, hint: "Pending approval", icon: ClipboardSignature, color: "text-amber-700 bg-amber-50" },
              { l: "Approved", v: kpis.approved, hint: "Ready to finish", icon: ClipboardCheck, color: "text-violet-700 bg-violet-50" },
              { l: "Finished", v: kpis.completed, hint: "All instances", icon: CheckCircle2, color: "text-emerald-700 bg-emerald-50" },
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
              {isLoading
                ? "Loading instances..."
                : query
                  ? `Showing ${list.length} matching ${list.length === 1 ? "instance" : "instances"}`
                  : `${list.length} active ${list.length === 1 ? "instance" : "instances"}`}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
              {[1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-2xl border border-black/5 p-5 animate-pulse">
                  <div className="h-5 w-24 bg-slate-100 rounded-full" />
                  <div className="mt-3 h-5 w-3/4 bg-slate-100 rounded-lg" />
                  <div className="mt-1 h-4 w-1/2 bg-slate-100 rounded-lg" />
                  <div className="mt-4 flex items-center gap-3">
                    <div className="size-7 rounded-full bg-slate-100" />
                    <div className="h-4 w-1/3 bg-slate-100 rounded-lg" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full bg-slate-100 rounded-full" />
                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5].map(m => <div key={m} className="h-12 bg-slate-100 rounded-xl" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
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
                  onOpen={() => openInstance(i)}
                  onEdit={() => { setSel(i); setEditOpen(true); }}
                  onExportHistory={() => { setSel(i); setExportOpen(true); }}
                  onDuplicatePeriod={() => { setSel(i); setDupOpen(true); }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <ArchivedGallery rows={archivedList} query={query} />
      )}

      {/* Drawer */}
      {sel && (
        <InstanceDetailDrawer
          instanceId={sel.id}
          instanceSummary={sel}
          onClose={() => setSel(null)}
          onEdit={() => setEditOpen(true)}
          onExportHistory={() => setExportOpen(true)}
          onOpenWorkspace={() => openInstance(sel)}
        />
      )}

      {newOpen && <NewInstanceModal onClose={() => setNewOpen(false)} />}
      {editOpen && sel && <EditInstanceModal instance={sel} onClose={() => { setEditOpen(false); }} />}
      {exportOpen && <ExportHistoryPdfModal onClose={() => setExportOpen(false)} />}
      {dupOpen && sel && <DuplicatePeriodModal instance={sel} onClose={() => setDupOpen(false)} />}
    </div>
  );
}

// ───────────────────────── Instance Card
function InstanceCard({
  inst, onSelect, onOpen, onEdit, onExportHistory, onDuplicatePeriod,
}: {
  inst: InstanceSummary; onSelect: () => void; onOpen: () => void; onEdit: () => void; onExportHistory: () => void; onDuplicatePeriod: () => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false); };
    if (moreOpen) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [moreOpen]);

  const progress = computeProgress(inst);
  const progColor = progress >= 100 ? "#10B981" : progress >= 70 ? "#1E63D9" : progress >= 40 ? "#F59E0B" : "#94A3B8";

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
          {initials(inst.createdByName)}
        </div>
        <div className="min-w-0">
          <div className="truncate" style={{ fontSize: 12, color: "#0A2540", fontWeight: 500 }}>{inst.createdByName}</div>
          <div className="truncate" style={{ fontSize: 11, color: "#94A3B8" }}>Updated {formatDate(inst.updatedAt)}</div>
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
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0A2540" }}>{progress}%</span>
        </div>
        <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: progColor }} />
        </div>
      </div>

      {/* section indicators */}
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {sectionKeys.map(key => {
          const { status, tooltip } = getSectionStatus(inst, key);
          const Ic = sectionIcons[key];
          const cls = status === "complete"
            ? "bg-emerald-50/60 border-emerald-100 text-emerald-700"
            : status === "in_progress"
              ? "bg-blue-50/60 border-blue-100 text-[#1E63D9]"
              : "bg-slate-50 border-black/5 text-slate-400";
          return (
            <Tip key={key} text={`${sectionLabel[key]} · ${tooltip}`}>
              <div className={`flex flex-col items-center gap-1 p-2 rounded-xl border ${cls}`}>
                <Ic className="size-3.5" strokeWidth={1.75} />
                <span style={{ fontSize: 9, fontWeight: 500 }}>{sectionShort[key]}</span>
              </div>
            </Tip>
          );
        })}
      </div>

      {/* footer */}
      <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between" onClick={e => e.stopPropagation()}>
        <span style={{ fontSize: 11, color: "#94A3B8" }}>Created {formatDate(inst.createdAt)}</span>
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
function ArchivedGallery({ rows, query }: { rows: InstanceSummary[]; query: string }) {
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
          <Archive className="size-3" /> {rows.length}
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
                <StatusChip s={r.status} />
              </div>
              <div className="mt-3" style={{ fontSize: 16, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{r.org} · {r.version}</div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Meta label="Archived" value={formatDate(r.updatedAt)} />
                <Meta label="Owner" value={r.createdByName} />
              </div>

              <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Tip text="Open this archived instance read-only.">
                    <IconAction icon={FolderOpen} />
                  </Tip>
                  <Tip text="Export PDF summary.">
                    <IconAction icon={FileDown} />
                  </Tip>
                  <Tip text="Export history PDF.">
                    <IconAction icon={ScrollText} />
                  </Tip>
                </div>
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
  instanceId, instanceSummary, onClose, onEdit, onExportHistory, onOpenWorkspace,
}: {
  instanceId: string; instanceSummary: InstanceSummary; onClose: () => void; onEdit: () => void; onExportHistory: () => void; onOpenWorkspace?: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "activity" | "comments">("overview");

  const { data: fullInstance } = useInstance(instanceId);
  const { data: participants = [] } = useParticipants(instanceId);
  const { data: activityLog = [] } = useActivityLog(instanceId);

  const description = fullInstance?.description || "No description provided.";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="hidden sm:block flex-1 bg-[#0A2540]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full sm:w-[520px] h-full bg-white shadow-[-20px_0_60px_-20px_rgba(10,37,64,0.25)] overflow-y-auto">
        {/* header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-black/5 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.06em" }}>INSTANCE DETAILS</div>
              <div className="mt-1.5" style={{ fontSize: 18, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>{instanceSummary.name}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{instanceSummary.org} · {instanceSummary.version}</div>
            </div>
            <button onClick={onClose} className="size-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
              <X className="size-4 text-slate-600" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <StatusChip s={instanceSummary.status} />
            <span style={{ fontSize: 11, color: "#94A3B8" }}>· Owner {instanceSummary.createdByName}</span>
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
                <div className="mt-1.5" style={{ fontSize: 13, color: "#0A2540", lineHeight: 1.55 }}>{description}</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0A2540" }}>Progress by section</div>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{computeProgress(instanceSummary)}% overall</span>
                </div>
                <div className="space-y-2.5">
                  {sectionKeys.map(key => {
                    const { status, tooltip } = getSectionStatus(instanceSummary, key);
                    const pct = status === "complete" ? 100 : status === "in_progress" ? 50 : 0;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
                          <span style={{ color: "#0A2540" }}>{sectionLabel[key]}</span>
                          <span style={{ color: status === "complete" ? "#047857" : "#64748B", fontWeight: 500 }}>
                            {status === "complete" ? "Completed" : status === "in_progress" ? "In progress" : "Not started"}
                          </span>
                        </div>
                        <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: status === "complete" ? "#10B981" : status === "in_progress" ? "#1E63D9" : "#CBD5E1" }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{tooltip}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0A2540", marginBottom: 12 }}>Participants</div>
                {participants.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 text-center" style={{ fontSize: 12, color: "#64748B" }}>
                    No participants yet.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {participants.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                        <div className="size-9 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 11, fontWeight: 500 }}>
                          {initials(p.userDisplayName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="truncate" style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{p.userDisplayName}</div>
                          <div className="truncate" style={{ fontSize: 11, color: "#94A3B8" }}>{p.userEmail}</div>
                        </div>
                        <RoleChip role={p.role} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "activity" && (
            <div className="relative">
              <div className="absolute left-[15px] top-1 bottom-1 w-px bg-slate-200" />
              {activityLog.length === 0 ? (
                <div className="pl-10 py-4 text-center" style={{ fontSize: 12, color: "#94A3B8" }}>
                  No activity recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {activityLog.map((e, i) => (
                    <div key={i} className="relative pl-10">
                      <div className="absolute left-2 top-1 size-3 rounded-full bg-white border-2 border-[#1E63D9]" />
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{e.action}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{e.user?.displayName || "System"} · {formatDate(e.createdAt)}</div>
                      {e.details && <div className="mt-1.5 p-2.5 rounded-lg bg-slate-50 border border-black/5" style={{ fontSize: 12, color: "#475569" }}>{e.details}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "comments" && <CommentsSection instanceId={instanceId} />}
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

function CommentsSection({ instanceId }: { instanceId: string }) {
  const currentUser = useAuthStore((s) => s.user);
  const { data: comments = [], isLoading } = useComments(instanceId);
  const createComment = useCreateComment(instanceId);
  const deleteComment = useDeleteComment(instanceId);
  const [text, setText] = useState("");

  const handlePost = () => {
    if (!text.trim()) return;
    createComment.mutate({ content: text.trim() }, { onSuccess: () => setText("") });
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="size-4 text-slate-500" />
        <div style={{ fontSize: 13, fontWeight: 600, color: "#0A2540" }}>Comments & change notes</div>
      </div>

      {isLoading ? (
        <div className="p-4 rounded-xl bg-slate-50 text-center" style={{ fontSize: 12, color: "#64748B" }}>Loading comments…</div>
      ) : comments.length === 0 ? (
        <div className="p-4 rounded-xl bg-slate-50 text-center" style={{ fontSize: 12, color: "#64748B" }}>No comments yet.</div>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-black/5">
              <div className="flex items-center justify-between">
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0A2540" }}>{c.userDisplayName}</div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 10, color: "#94A3B8" }}>{formatDate(c.createdAt)}</span>
                  {c.userId === currentUser?.id && (
                    <button
                      onClick={() => deleteComment.mutate(c.id)}
                      className="size-6 rounded-lg hover:bg-white flex items-center justify-center text-slate-400 hover:text-rose-500 transition"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-1" style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{c.content}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={2}
          placeholder="Add comment or change note…"
          className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-black/5 focus:bg-white focus:border-[#1E63D9]/40 outline-none resize-none"
          style={{ fontSize: 12 }}
        />
        <PrimaryButton onClick={handlePost} disabled={!text.trim() || createComment.isPending}>
          {createComment.isPending ? "Posting…" : "Post"}
        </PrimaryButton>
      </div>
    </div>
  );
}

function RoleChip({ role }: { role: string }) {
  const map: Record<string, string> = {
    Author: "bg-blue-50 text-blue-700",
    Responsible: "bg-emerald-50 text-emerald-700",
    Reviewer: "bg-amber-50 text-amber-700",
    Approver: "bg-violet-50 text-violet-700",
  };
  return <span className={`px-2 py-0.5 rounded-full ${map[role] || "bg-slate-50 text-slate-600"}`} style={{ fontSize: 10, fontWeight: 500 }}>{role}</span>;
}

// ───────────────────────── Modals
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
  const createInstance = useCreateInstance();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [startToday, setStartToday] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleStartToday = () => {
    setPeriodStart(today);
    setStartToday(true);
  };

  const handlePeriodStartChange = (value: string) => {
    setPeriodStart(value);
    setStartToday(value === today);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    createInstance.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      organizationName: company.trim() || undefined,
      periodStart: periodStart || undefined,
      periodEnd: periodEnd || undefined,
    }, {
      onSuccess: onClose,
    });
  };

  return (
    <ModalShell
      title="Create continuity instance"
      subtitle="The new instance will start automatically with status: In progress."
      onClose={onClose}
      footer={<>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={handleSubmit} disabled={!name.trim() || createInstance.isPending}>
          {createInstance.isPending ? "Creating..." : "Create instance"}
        </PrimaryButton>
      </>}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5 md:gap-7">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Instance name">
              <input
                className={inputCls}
                style={{ fontSize: 13 }}
                placeholder="e.g. Q2 2026 Continuity Analysis"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Description">
              <textarea
                rows={3}
                className={inputCls + " h-auto py-2 resize-none"}
                style={{ fontSize: 13 }}
                placeholder="Briefly describe the scope of this continuity analysis…"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Field label="Company (optional)">
              <input
                className={inputCls}
                style={{ fontSize: 13 }}
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
            </Field>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Field label="Period start">
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  className={inputCls}
                  style={{ fontSize: 13 }}
                  value={periodStart}
                  onChange={e => handlePeriodStartChange(e.target.value)}
                />
                {!startToday ? (
                  <button
                    onClick={handleStartToday}
                    className="shrink-0 h-10 px-3 rounded-xl bg-[#1E63D9]/10 hover:bg-[#1E63D9]/20 text-[#1E63D9] text-xs font-medium transition flex items-center gap-1"
                  >
                    <Calendar className="size-3" /> Today
                  </button>
                ) : (
                  <div className="shrink-0 h-10 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-1">
                    <Check className="size-3" /> Today
                  </div>
                )}
              </div>
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Period end">
              <input
                type="date"
                className={inputCls}
                style={{ fontSize: 13 }}
                value={periodEnd}
                onChange={e => setPeriodEnd(e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-black/5">
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }}>WORKFLOW PREVIEW</div>
          <div className="mt-3 space-y-3">
            {["Organizational Context", "BIA Framework", "Dependencies", "Risk Assessment", "Reports"].map((s, i) => (
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

function EditInstanceModal({ instance, onClose }: { instance: InstanceSummary; onClose: () => void }) {
  const updateInstance = useUpdateInstance();
  const { data: fullInstance } = useInstance(instance.id);
  const [name, setName] = useState(instance.name);
  const [description, setDescription] = useState(fullInstance?.description || "");

  useEffect(() => {
    if (fullInstance?.description) {
      setDescription(fullInstance.description);
    }
  }, [fullInstance?.description]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    updateInstance.mutate({
      id: instance.id,
      data: { name: name.trim(), description: description.trim() || undefined },
    }, { onSuccess: onClose });
  };

  return (
    <ModalShell
      title="Edit instance details"
      subtitle="Update general information for this continuity instance."
      onClose={onClose}
      width={620}
      footer={<>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={handleSubmit} disabled={!name.trim() || updateInstance.isPending}>
          {updateInstance.isPending ? "Saving..." : "Save changes"}
        </PrimaryButton>
      </>}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Field label="Instance name">
            <input className={inputCls} style={{ fontSize: 13 }} value={name} onChange={e => setName(e.target.value)} />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Description">
            <textarea
              rows={3}
              className={inputCls + " h-auto py-2 resize-none"}
              style={{ fontSize: 13 }}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Instance description"
            />
          </Field>
        </div>
      </div>
    </ModalShell>
  );
}

function DuplicatePeriodModal({ instance, onClose }: { instance: InstanceSummary; onClose: () => void }) {
  const duplicateInstance = useDuplicateInstance();
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

  const handleSubmit = () => {
    duplicateInstance.mutate(instance.id, { onSuccess: onClose });
  };

  return (
    <ModalShell
      title="Duplicate instance for new period"
      subtitle="The new instance will start with status: In progress."
      onClose={onClose}
      width={760}
      footer={<>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={handleSubmit} disabled={duplicateInstance.isPending}>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            {duplicateInstance.isPending ? "Duplicating..." : "Create new period instance"}
          </span>
        </PrimaryButton>
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
          <Field label="Organization"><input className={inputCls} style={{ fontSize: 13 }} defaultValue={instance.org} /></Field>
          <Field label="Version"><input className={inputCls} style={{ fontSize: 13 }} defaultValue="v1.0" /></Field>
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
