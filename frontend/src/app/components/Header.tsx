import { useState, useEffect, useRef } from "react";
import { Search, Bell, Globe, HelpCircle } from "lucide-react";
import { useLang, setLang, t } from "./i18n";
import { useSearch, setSearch, useSearchContext } from "./searchStore";
import { useAuthStore } from "../../shared/store/auth.store";
import { UserMenu } from "./UserMenu";

const placeholders: Record<string, string> = {
  "instances:active": "Search instances by name, organization, owner, date, status…",
  "instances:archived": "Search archived instances by name, owner, archived date…",
  dashboard: "Search processes, risks and indicators…",
  reports: "Search reports by name, type, author, period or status…",
  bia: "Search processes, categories or impact level…",
  risks: "Search risks, processes, owners or treatment…",
  context: "Search business units, processes or assets…",
  integrated: "Search processes, risks or recommendations…",
  global: "Search…",
};

const helpExamples = [
  { label: "Dashboard", value: "processes, risks, reports and indicators" },
  { label: "Reports", value: "report name, type, author, period and status" },
  { label: "Continuity Instances", value: "instance name, organization, owner, date, status, history and comments" },
  { label: "Archived instances", value: "archived name, archived date, archived by and last status" },
];

function initials(name: string): string {
  return name.split(" ").map(w => w[0]).filter(Boolean).join("").toUpperCase().slice(0, 2);
}

export function Header({ titleKey, subtitleKey }: { titleKey: string; subtitleKey: string }) {
  const lang = useLang();
  const q = useSearch();
  const ctx = useSearchContext();
  const user = useAuthStore((s) => s.user);
  const [helpOpen, setHelpOpen] = useState(false);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setHelpOpen(false);
    };
    if (helpOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [helpOpen]);

  const placeholder = placeholders[ctx] || placeholders.global;

  return (
    <header className="min-h-[64px] sm:h-20 px-4 sm:px-6 lg:px-10 py-3 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border-b border-black/5 bg-white/60 backdrop-blur-xl lg:sticky lg:top-0 z-10">
      <div className="min-w-0">
        <div className="truncate" style={{ fontSize: "clamp(16px, 3.2vw, 22px)", fontWeight: 600, letterSpacing: "-0.01em", color: "#0A2540" }}>{t(titleKey)}</div>
        <div className="hidden sm:block truncate" style={{ fontSize: 13, color: "#64748B" }}>{t(subtitleKey)}</div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 order-3 sm:order-none w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
          <input
            value={q}
            onChange={e => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full sm:w-[280px] lg:w-[380px] xl:w-[420px] h-11 sm:h-10 pl-10 pr-4 rounded-xl bg-slate-100/70 border border-transparent focus:bg-white focus:border-black/10 outline-none transition"
            style={{ fontSize: 13 }}
          />
        </div>

        {/* Help button + popover */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => setHelpOpen(v => !v)}
            className="size-10 rounded-full bg-white border border-black/10 hover:bg-slate-50 flex items-center justify-center transition shadow-sm"
            aria-label="Search help"
            title="Search help"
          >
            <HelpCircle className="size-4 text-[#0A2540]" strokeWidth={1.75} />
          </button>
          {helpOpen && (
            <div className="absolute right-0 top-12 z-30 w-[340px] bg-white rounded-2xl border border-black/5 shadow-[0_20px_60px_-20px_rgba(10,37,64,0.25)] p-5">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Search className="size-4 text-[#1E63D9]" strokeWidth={1.75} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>Search help</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>Context-aware search</div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-black/5" style={{ fontSize: 12, color: "#475569", lineHeight: 1.55 }}>
                Search is context-aware. It searches only within the current screen.
              </div>
              <div className="mt-4 space-y-2.5">
                {helpExamples.map((e) => (
                  <div key={e.label} className="flex gap-3">
                    <span className="shrink-0 mt-1 size-1.5 rounded-full bg-[#1E63D9]" />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#0A2540" }}>{e.label}</div>
                      <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.45 }}>{e.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          className="hidden sm:flex h-10 px-3 rounded-xl bg-slate-100/70 hover:bg-slate-200/60 items-center gap-2 transition"
          title={lang === "en" ? "Cambiar a español" : "Switch to English"}
        >
          <Globe className="size-4 text-slate-600" strokeWidth={1.75} />
          <span style={{ fontSize: 12, fontWeight: 500, color: "#0A2540" }}>{lang === "en" ? "EN" : "ES"}</span>
        </button>

        <button className="size-10 rounded-xl bg-slate-100/70 hover:bg-slate-200/60 flex items-center justify-center relative">
          <Bell className="size-4 text-slate-600" strokeWidth={1.75} />
          <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-emerald-500" />
        </button>

        <UserMenu>
          <button className="hidden xl:flex items-center gap-3 pl-3 border-l border-black/5 cursor-pointer">
            <div className="text-right">
              <div style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{user?.displayName || "User"}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{t("header.role")}</div>
            </div>
            <div className="size-10 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 13, fontWeight: 500 }}>
              {user ? initials(user.displayName) : "?"}
            </div>
          </button>
        </UserMenu>
      </div>
    </header>
  );
}
