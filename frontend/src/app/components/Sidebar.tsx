import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  LayoutDashboard, Building2, FileBarChart, ShieldAlert, Share2, FileText,
  Sparkles, ArrowLeftRight, ChevronDown, FilePen, Plus, CheckCircle2,
  MessageSquare, History, X, AlertTriangle, Archive, FileDown, ScrollText,
  ArchiveRestore, ClipboardCheck, ClipboardSignature, XCircle, Lock,
} from "lucide-react";
import { t, useLang } from "./i18n";
import { useInstanceStore } from "../../shared/store/instance.store";
import { useSidebarStore } from "../../shared/store/sidebar.store";
import { statusMeta } from "./Instances";
import type { InstanceStatus } from "../../shared/types/instance";
import { useUpdateStatus, useArchiveInstance, useDuplicateInstance, useActivityLog } from "../../shared/queries/instances.queries";
import { useComments } from "../../shared/queries/comments.queries";
import type { Comment } from "../../shared/types/comment";

export type Screen = "dashboard" | "context" | "bia" | "risks" | "integrated" | "reports";

const items: { id: Screen; key: string; icon: any }[] = [
  { id: "dashboard", key: "nav.dashboard", icon: LayoutDashboard },
  { id: "context", key: "nav.context", icon: Building2 },
  { id: "bia", key: "nav.bia", icon: FileBarChart },
  { id: "risks", key: "nav.risks", icon: ShieldAlert },
  { id: "integrated", key: "nav.inter", icon: Share2 },
  { id: "reports", key: "nav.reports", icon: FileText },
];

function formatDateShort(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type Change = { icon: any; action: string; author: string; date: string };

export function Sidebar() {
  const navigate = useNavigate();
  const { instanceId } = useParams();
  const activeInstance = useInstanceStore((s) => s.activeInstance);
  const setMobileNavOpen = useSidebarStore((s) => s.setMobileNavOpen);
  useLang();

  const pathParts = window.location.pathname.split("/");
  const current = (pathParts[pathParts.length - 1] || "dashboard") as Screen;

  const instance = {
    name: activeInstance?.name || "",
    org: activeInstance?.org || "",
    version: activeInstance?.version || "",
    status: (activeInstance?.status || "in_progress") as InstanceStatus,
  };

  const onNavigate = (screen: Screen) => {
    navigate(`/instances/${instanceId}/${screen}`);
    setMobileNavOpen(false);
  };

  const onSwitchInstance = () => {
    useInstanceStore.getState().clearActiveInstance();
    navigate("/instances");
  };

  const { data: activityLog = [] } = useActivityLog(instanceId);
  const { data: comments = [] } = useComments(instanceId);

  const recentChanges: Change[] = activityLog.slice(0, 5).map(e => {
    const icon = e.action.includes("STATUS") ? CheckCircle2 : e.action.includes("CREATED") ? Plus : FilePen;
    return {
      icon,
      action: e.action.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      author: e.user?.displayName || "System",
      date: formatDateShort(e.createdAt),
    };
  });

  const allChanges: Change[] = activityLog.map(e => {
    const icon = e.action.includes("STATUS") ? CheckCircle2 : e.action.includes("CREATED") ? Plus : FilePen;
    return {
      icon,
      action: e.action.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      author: e.user?.displayName || "System",
      date: formatDateShort(e.createdAt),
    };
  });

  const [changesOpen, setChangesOpen] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [drawer, setDrawer] = useState<null | "changes" | "comments">(null);

  return (
    <>
      <aside className="w-full lg:w-72 shrink-0 lg:h-screen lg:sticky lg:top-0 lg:border-r border-black/5 bg-white/70 backdrop-blur-xl flex flex-col">
        {/* Logo */}
        <div className="px-6 pt-5 pb-3 flex items-center gap-2">
          <div className="size-8 rounded-xl bg-gradient-to-br from-[#0A2540] to-[#1E63D9] flex items-center justify-center shadow-sm">
            <Sparkles className="size-4 text-white" strokeWidth={2} />
          </div>
          <div className="tracking-tight" style={{ fontWeight: 600, fontSize: 18, color: "#0A2540" }}>BIA-R</div>
        </div>

        {/* Instance switcher + status */}
        <div className="mx-3 mb-3 p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/60 border border-black/5">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 10, color: "#64748B", fontWeight: 500, letterSpacing: "0.06em" }}>
              ACTIVE INSTANCE
            </span>
            <button onClick={onSwitchInstance} title="Back to instances" className="size-6 rounded-md hover:bg-white/70 flex items-center justify-center transition">
              <ArrowLeftRight className="size-3.5 text-slate-400 hover:text-[#1E63D9] transition" strokeWidth={1.75} />
            </button>
          </div>
          <div className="mt-1.5 truncate" style={{ fontSize: 13, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>
            {instance.name}
          </div>
          <div className="truncate" style={{ fontSize: 11, color: "#64748B" }}>
            {instance.org} · {instance.version}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <MiniStatusChip s={instance.status} />
            <button onClick={onSwitchInstance} className="hover:underline" style={{ fontSize: 10, color: "#1E63D9", fontWeight: 500 }}>
              Switch instance →
            </button>
          </div>
          <WorkflowStepper status={instance.status} />
          {instance.status === "disapproved" && (
            <HelperLine tone="warning" icon={AlertTriangle} text="Changes required before review." />
          )}
          {instance.status === "finished" && (
            <HelperLine tone="info" icon={Lock} text="This instance is closed. Duplicate it for a new period or archive it." />
          )}
          <InstanceActions status={instance.status} />
        </div>

        {/* Nav (dominant) */}
        <nav className="px-3 flex flex-col gap-0.5">
          {items.map((it) => {
            const Icon = it.icon;
            const active = current === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onNavigate(it.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left ${
                  active ? "bg-[#0A2540] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100/70"
                }`}
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
                <span style={{ fontSize: 14, fontWeight: active ? 500 : 450 }}>{t(it.key)}</span>
              </button>
            );
          })}
        </nav>

        {/* Secondary: Recent changes */}
        <div className="mx-3 mt-4 pt-3 border-t border-black/5">
          <AccordionHeader
            title="Recent changes"
            count={recentChanges.length}
            open={changesOpen}
            onToggle={() => setChangesOpen((v) => !v)}
          />
          {changesOpen && (
            <div className="mt-1">
              {recentChanges.length === 0 ? (
                <EmptyLine text="No recent changes" />
              ) : (
                <ul className="divide-y divide-black/5">
                  {recentChanges.map((c, i) => {
                    const Ic = c.icon;
                    return (
                      <li key={i} className="py-1.5 flex items-start gap-2">
                        <div className="mt-0.5 size-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                          <Ic className="size-3 text-slate-500" strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0 flex-1 leading-tight">
                          <div className="truncate" style={{ fontSize: 12, color: "#0A2540", fontWeight: 500 }}>{c.action}</div>
                          <div className="truncate" style={{ fontSize: 10.5, color: "#94A3B8" }}>{c.author} · {c.date}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <button
                onClick={() => setDrawer("changes")}
                className="mt-1 hover:underline"
                style={{ fontSize: 11, color: "#1E63D9", fontWeight: 500 }}
              >
                View all changes →
              </button>
            </div>
          )}
        </div>

        {/* Secondary: Latest comments */}
        <div className="mx-3 mt-3 pt-3 border-t border-black/5">
          <AccordionHeader
            title="Latest comments"
            count={comments.length}
            open={commentsOpen}
            onToggle={() => setCommentsOpen((v) => !v)}
          />
          {commentsOpen && (
            <div className="mt-1">
              {comments.length === 0 ? (
                <EmptyLine text="No comments yet" />
              ) : (
                <div className="space-y-2 max-h-[240px] overflow-y-auto">
                  {comments.slice(0, 5).map((c) => (
                    <div key={c.id} className="p-2 rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#0A2540" }}>{c.userDisplayName}</span>
                        <span style={{ fontSize: 10, color: "#94A3B8" }}>· {formatDateShort(c.createdAt)}</span>
                      </div>
                      <div className="mt-0.5 truncate" style={{ fontSize: 11.5, color: "#475569" }}>{c.content}</div>
                    </div>
                  ))}
                </div>
              )}
              {comments.length > 5 && (
                <button
                  onClick={() => setDrawer("comments")}
                  className="w-full mt-1 py-1.5 rounded-lg hover:bg-slate-50 text-center"
                  style={{ fontSize: 11, color: "#1E63D9", fontWeight: 500 }}
                >
                  View all {comments.length} comments →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="m-3 mt-auto p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/60 border border-black/5">
          <div style={{ fontSize: 11, color: "#64748B" }}>ISO 22317 · ISO 31000</div>
          <div className="mt-0.5" style={{ fontSize: 12.5, color: "#0A2540", fontWeight: 500 }}>{t("side.compliance")}</div>
        </div>
      </aside>

      {drawer && (
        <ActivityDrawer
          kind={drawer}
          changes={allChanges}
          comments={comments}
          onClose={() => setDrawer(null)}
        />
      )}
    </>
  );
}

function MiniStatusChip({ s }: { s: InstanceStatus }) {
  const m = statusMeta[s];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${m.tone}`} style={{ fontSize: 10, fontWeight: 500 }}>
      <span className={`size-1.5 rounded-full ${m.dot}`} /> {m.label}
    </span>
  );
}

function WorkflowStepper({ status }: { status: InstanceStatus }) {
  // Compact horizontal stepper: In progress → Completed → Reviewed → Approved/Disapproved → Finished
  const steps: { key: InstanceStatus | "approval"; label: string }[] = [
    { key: "in_progress", label: "In progress" },
    { key: "completed", label: "Completed" },
    { key: "reviewed", label: "Reviewed" },
    { key: "approval", label: status === "disapproved" ? "Disapproved" : "Approved" },
    { key: "finished", label: "Finished" },
  ];
  const order: InstanceStatus[] = ["in_progress", "completed", "reviewed", "approved", "finished"];
  const currentIdx = status === "disapproved" ? 3 : status === "archived" ? 4 : order.indexOf(status);

  const dotColor = (i: number) => {
    if (i < currentIdx) return "#10B981";
    if (i === currentIdx) return status === "disapproved" ? "#E11D48" : "#1E63D9";
    return "#CBD5E1";
  };
  const segColor = (i: number) => (i < currentIdx ? "#10B981" : "#E2E8F0");

  return (
    <div className="mt-3 pt-3 border-t border-black/5">
      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="size-2 rounded-full transition" style={{ background: dotColor(i) }} />
            {i < steps.length - 1 && <div className="flex-1 h-px mx-1" style={{ background: segColor(i) }} />}
          </div>
        ))}
      </div>
      <div className="mt-1.5 truncate" style={{ fontSize: 10.5, color: "#64748B" }}>
        Stage: <span style={{ color: status === "disapproved" ? "#BE123C" : "#0A2540", fontWeight: 500 }}>{statusMeta[status].label}</span>
      </div>
    </div>
  );
}

function HelperLine({ tone, icon: Ic, text }: { tone: "warning" | "info"; icon: any; text: string }) {
  const cls = tone === "warning"
    ? "bg-rose-50/70 border-rose-100 text-rose-700"
    : "bg-slate-100/70 border-black/5 text-slate-700";
  return (
    <div className={`mt-2 p-2 rounded-lg border flex items-start gap-1.5 ${cls}`} style={{ fontSize: 11, lineHeight: 1.4 }}>
      <Ic className="size-3 mt-0.5 shrink-0" strokeWidth={1.75} />
      <span>{text}</span>
    </div>
  );
}

type Btn = { label: string; icon: any; primary?: boolean; action?: () => void };
function InstanceActions({ status }: { status: InstanceStatus }) {
  const { instanceId } = useParams();
  const updateStatus = useUpdateStatus();
  const archiveInstance = useArchiveInstance();
  const duplicateInstance = useDuplicateInstance();

  const act = (action: string) => {
    if (instanceId) updateStatus.mutate({ id: instanceId, data: { action } });
  };

  let helper: string | null = null;
  let btns: Btn[] = [];

  switch (status) {
    case "in_progress":
      helper = "Complete all required sections to enable review.";
      break;
    case "completed":
      btns = [{ label: "Mark as reviewed", icon: ClipboardCheck, primary: true, action: () => act("review") }];
      break;
    case "reviewed":
      btns = [
        { label: "Mark as approved", icon: ClipboardCheck, primary: true, action: () => act("approve") },
        { label: "Mark as disapproved", icon: XCircle, action: () => act("disapprove") },
      ];
      break;
    case "approved":
      btns = [{ label: "Finish instance", icon: Lock, primary: true, action: () => act("finish") }];
      break;
    case "disapproved":
      helper = "Update the required sections to continue.";
      break;
    case "finished":
      btns = [
        { label: "Duplicate for new period", icon: Sparkles, primary: true, action: () => { if (instanceId) duplicateInstance.mutate(instanceId); } },
        { label: "Archive", icon: Archive, action: () => { if (instanceId) archiveInstance.mutate({ id: instanceId }); } },
        { label: "Export PDF", icon: FileDown },
        { label: "Export history PDF", icon: ScrollText },
      ];
      break;
    case "archived":
      btns = [
        { label: "Restore", icon: ArchiveRestore, primary: true, action: () => act("restore") },
        { label: "Export PDF", icon: FileDown },
        { label: "Export history PDF", icon: ScrollText },
      ];
      break;
  }

  return (
    <div className="mt-3 pt-3 border-t border-black/5">
      <div className="flex items-center gap-1 mb-1.5">
        <ClipboardSignature className="size-3 text-slate-500" strokeWidth={1.75} />
        <span style={{ fontSize: 10, color: "#64748B", fontWeight: 600, letterSpacing: "0.06em" }}>INSTANCE ACTIONS</span>
      </div>
      {helper && (
        <div className="px-2 py-1.5" style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.4 }}>{helper}</div>
      )}
      <div className="space-y-1">
        {btns.map((b, i) => {
          const Ic = b.icon;
          return b.primary ? (
            <button
              key={i}
              onClick={b.action}
              className="w-full h-8 px-2.5 rounded-lg bg-[#0A2540] hover:bg-[#0F3057] text-white flex items-center gap-1.5 transition shadow-[0_6px_18px_-10px_rgba(10,37,64,0.5)]"
              style={{ fontSize: 12, fontWeight: 500 }}
            >
              <Ic className="size-3.5" strokeWidth={1.75} /> {b.label}
            </button>
          ) : (
            <button
              key={i}
              onClick={b.action}
              className="w-full h-8 px-2.5 rounded-lg bg-white hover:bg-slate-50 border border-black/10 text-[#0A2540] flex items-center gap-1.5 transition"
              style={{ fontSize: 12, fontWeight: 450 }}
            >
              <Ic className="size-3.5 text-slate-500" strokeWidth={1.75} /> {b.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AccordionHeader({ title, count, open, onToggle }: { title: string; count: number; open: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center justify-between px-1 py-1 group">
      <span className="inline-flex items-center gap-1.5" style={{ fontSize: 11, color: "#64748B", fontWeight: 600, letterSpacing: "0.06em" }}>
        {title.toUpperCase()}
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-slate-100 text-slate-600" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0 }}>
          {count}
        </span>
      </span>
      <ChevronDown
        className={`size-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${open ? "" : "-rotate-90"}`}
        strokeWidth={2}
      />
    </button>
  );
}

function EmptyLine({ text }: { text: string }) {
  return (
    <div className="py-2 px-1" style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic" }}>
      {text}
    </div>
  );
}

function ActivityDrawer({ kind, changes, comments, onClose }: { kind: "changes" | "comments"; changes: Change[]; comments: Comment[]; onClose: () => void }) {
  const isChanges = kind === "changes";
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-[#0A2540]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[460px] h-full bg-white shadow-[-20px_0_60px_-20px_rgba(10,37,64,0.25)] overflow-y-auto flex flex-col">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-black/5 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-slate-100 flex items-center justify-center">
              {isChanges ? <History className="size-4 text-slate-600" strokeWidth={1.75} /> : <MessageSquare className="size-4 text-slate-600" strokeWidth={1.75} />}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.06em" }}>
                {isChanges ? "ACTIVITY HISTORY" : "COMMENTS"}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>
                {isChanges ? "All changes" : "All comments"}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="size-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
            <X className="size-4 text-slate-600" />
          </button>
        </div>

        <div className="p-6">
          {isChanges ? (
            <ul className="space-y-3">
              {changes.map((c, i) => {
                const Ic = c.icon;
                return (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50">
                    <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Ic className="size-4 text-slate-600" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{c.action}</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{c.author} · {c.date}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : comments.length === 0 ? (
            <div className="p-4 text-center" style={{ fontSize: 13, color: "#94A3B8" }}>
              No comments yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50">
                  <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <MessageSquare className="size-4 text-slate-600" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{c.userDisplayName}</div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.45 }}>{c.content}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{formatDateShort(c.createdAt)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
