import { useState, useMemo } from "react";
import { useParams } from "react-router";
import { Plus, Search, ChevronDown, Loader2 } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../shared";
import { useProcesses } from "../../../shared/queries/context.queries";
import type { BusinessProcess } from "../../../shared/types/context";
import { ProcessTable } from "./ProcessTable";
import { ProcessDetailPanel } from "./ProcessDetailPanel";
import { ProcessModal } from "./ProcessModal";
import { EmptyState } from "./EmptyState";
import { ComingSoon } from "./ComingSoon";

const tabs = [
  { key: "all", label: "All" },
  { key: "business_units", label: "Business Units" },
  { key: "processes", label: "Processes" },
  { key: "assets", label: "Assets" },
  { key: "third_parties", label: "Third parties" },
  { key: "interdependencies", label: "Interdependencies" },
];

export function OrgContext() {
  const { instanceId } = useParams<{ instanceId: string }>();
  const { data: processes, isLoading } = useProcesses(instanceId);
  const [activeTab, setActiveTab] = useState("processes");
  const [selected, setSelected] = useState<BusinessProcess | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<BusinessProcess | null>(null);
  const [search, setSearch] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCriticality, setFilterCriticality] = useState("");

  const allProcesses = processes || [];

  // Extract unique values for filter dropdowns
  const areas = useMemo(() => [...new Set(allProcesses.map(p => p.businessUnit).filter(Boolean))] as string[], [allProcesses]);

  // Filter processes
  const filtered = useMemo(() => {
    return allProcesses.filter(p => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matches = p.name?.toLowerCase().includes(q) ||
          p.businessUnit?.toLowerCase().includes(q) ||
          p.owner?.toLowerCase().includes(q) ||
          p.status?.toLowerCase().includes(q) ||
          p.criticality?.toLowerCase().includes(q) ||
          p.activities?.some(a => a.name.toLowerCase().includes(q));
        if (!matches) return false;
      }
      // Filters
      if (filterArea && p.businessUnit !== filterArea) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      if (filterCriticality && (p.criticality || "").toLowerCase() !== filterCriticality) return false;
      return true;
    });
  }, [allProcesses, search, filterArea, filterStatus, filterCriticality]);

  const handleOpenRegister = () => { setEditing(null); setShowModal(true); };
  const handleOpenEdit = () => { setEditing(selected); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setEditing(null); };

  if (isLoading) {
    return <div className="p-10 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-slate-400" /></div>;
  }

  // Non-Processes tabs show Coming Soon
  if (activeTab !== "all" && activeTab !== "processes") {
    return (
      <div className="p-4 sm:p-6 lg:p-10">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ComingSoon
          title={tabs.find(t => t.key === activeTab)?.label || "This section"}
          description="This module will be available in a future release."
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Tabs */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Header row */}
      <div className="flex items-center justify-between mt-5">
        <div style={{ fontSize: 13, color: "#64748B" }}>{allProcesses.length} process{allProcesses.length !== 1 ? "es" : ""}</div>
        <PrimaryButton onClick={handleOpenRegister}>
          <span className="inline-flex items-center gap-1.5"><Plus className="size-4" /> Register Process</span>
        </PrimaryButton>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search processes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 w-64 pl-9 pr-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-black/10 outline-none"
            style={{ fontSize: 13 }}
          />
        </div>
        <FilterDropdown label="Area" value={filterArea} options={areas} onChange={setFilterArea} />
        <FilterDropdown label="Status" value={filterStatus} options={["active", "under_review", "critical", "incomplete"]} onChange={setFilterStatus} />
        <FilterDropdown label="Criticality" value={filterCriticality} options={["low", "medium", "high", "critical"]} onChange={setFilterCriticality} />
      </div>

      {/* Main grid: table + detail panel */}
      <div className="mt-5 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 lg:gap-6">
        <div>
          {filtered.length > 0 ? (
            <ProcessTable processes={filtered} selectedId={selected?.id || null} onSelect={setSelected} />
          ) : allProcesses.length === 0 ? (
            <EmptyState onRegister={handleOpenRegister} />
          ) : (
            <div className="py-16 text-center" style={{ color: "#94A3B8", fontSize: 13 }}>
              No processes match your filters.
            </div>
          )}
        </div>

        {selected && (
          <ProcessDetailPanel
            process={selected}
            instanceId={instanceId!}
            onClose={() => setSelected(null)}
            onEdit={handleOpenEdit}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && instanceId && (
        <ProcessModal instanceId={instanceId} process={editing} onClose={handleCloseModal} />
      )}
    </div>
  );
}

function Tabs({ activeTab, onTabChange }: { activeTab: string; onTabChange: (t: string) => void }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onTabChange(t.key)}
          className={`h-9 px-4 rounded-xl transition ${activeTab === t.key ? "bg-[#0A2540] text-white" : "bg-white border border-black/5 text-slate-600 hover:border-black/10"}`}
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-9 pl-3 pr-8 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-black/10 outline-none appearance-none cursor-pointer"
        style={{ fontSize: 13, color: "#475569" }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
      </select>
      <ChevronDown className="size-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}