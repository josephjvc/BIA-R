import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-black/5 shadow-[0_1px_2px_rgba(10,37,64,0.04),0_8px_24px_-12px_rgba(10,37,64,0.08)] ${className}`}>
      {children}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  unit,
  delta,
  positive = true,
  hint,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  positive?: boolean;
  hint?: string;
}) {
  return (
    <Card className="p-6">
      <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500, letterSpacing: "0.01em" }}>
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", color: "#0A2540" }}>
          {value}
        </div>
        {unit && <div style={{ fontSize: 14, color: "#94A3B8" }}>{unit}</div>}
      </div>
      <div className="mt-3 flex items-center justify-between">
        {delta && (
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md ${
              positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
            style={{ fontSize: 11, fontWeight: 500 }}
          >
            {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {delta}
          </div>
        )}
        {hint && <div style={{ fontSize: 11, color: "#94A3B8" }}>{hint}</div>}
      </div>
    </Card>
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "active" | "review" | "critical" | "high" | "medium" | "low" | "draft";
}) {
  const map: Record<string, string> = {
    neutral: "bg-slate-100 text-slate-700",
    active: "bg-emerald-50 text-emerald-700",
    review: "bg-amber-50 text-amber-700",
    critical: "bg-rose-50 text-rose-700",
    high: "bg-orange-50 text-orange-700",
    medium: "bg-amber-50 text-amber-700",
    low: "bg-emerald-50 text-emerald-700",
    draft: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${map[tone]}`}
      style={{ fontSize: 11, fontWeight: 500 }}
    >
      <span className={`size-1.5 rounded-full ${
        tone === "active" || tone === "low" ? "bg-emerald-500" :
        tone === "review" || tone === "medium" ? "bg-amber-500" :
        tone === "critical" ? "bg-rose-500" :
        tone === "high" ? "bg-orange-500" :
        tone === "draft" ? "bg-slate-300" : "bg-slate-400"
      }`} />
      {children}
    </span>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div style={{ fontSize: 15, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>
        {title}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-4 rounded-xl bg-[#0A2540] hover:bg-[#0F3057] text-white transition shadow-[0_8px_24px_-12px_rgba(10,37,64,0.5)]"
      style={{ fontSize: 13, fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-4 rounded-xl bg-white hover:bg-slate-50 border border-black/10 text-slate-700 transition"
      style={{ fontSize: 13, fontWeight: 500 }}
    >
      {children}
    </button>
  );
}
