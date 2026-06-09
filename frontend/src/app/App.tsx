import { useState, useEffect } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { Sidebar, Screen } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { OrgContext } from "./components/OrgContext";
import { BIA } from "./components/BIA";
import { Risks } from "./components/Risks";
import { Integrated } from "./components/Integrated";
import { Reports } from "./components/Reports";
import { SelectorShell } from "./components/SelectorShell";
import type { ActiveInstance } from "./components/Instances";
import { setSearchContext } from "./components/searchStore";

const meta: Record<Screen, { titleKey: string; subtitleKey: string }> = {
  dashboard: { titleKey: "meta.dashboard.t", subtitleKey: "meta.dashboard.s" },
  context: { titleKey: "meta.context.t", subtitleKey: "meta.context.s" },
  bia: { titleKey: "meta.bia.t", subtitleKey: "meta.bia.s" },
  risks: { titleKey: "meta.risks.t", subtitleKey: "meta.risks.s" },
  integrated: { titleKey: "meta.integrated.t", subtitleKey: "meta.integrated.s" },
  reports: { titleKey: "meta.reports.t", subtitleKey: "meta.reports.s" },
};

type Flow = "login" | "selector" | "settings" | "workspace";

export default function App() {
  const [flow, setFlow] = useState<Flow>("login");
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [active, setActive] = useState<ActiveInstance | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (flow === "workspace") setSearchContext(screen);
  }, [flow, screen]);

  useEffect(() => { setNavOpen(false); }, [screen]);

  if (flow === "login") {
    return <Login onLogin={() => setFlow("selector")} />;
  }

  if (flow === "selector" || flow === "settings") {
    return (
      <SelectorShell
        view={flow === "settings" ? "settings" : "selector"}
        onOpenSettings={() => setFlow("settings")}
        onCloseSettings={() => setFlow("selector")}
        onOpenInstance={(i) => { setActive(i); setScreen("dashboard"); setFlow("workspace"); }}
      />
    );
  }

  if (!active) {
    setFlow("selector");
    return null;
  }

  const m = meta[screen];

  return (
    <div
      className="min-h-screen w-full lg:flex"
      style={{
        background:
          "radial-gradient(1200px 600px at 100% 0%, #EAF1FF 0%, transparent 50%), linear-gradient(180deg, #F7F8FB 0%, #FFFFFF 100%)",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
        color: "#0A2540",
      }}
    >
      {/* Mobile / tablet top app bar */}
      <div className="lg:hidden sticky top-0 z-30 h-14 px-3 flex items-center justify-between bg-white/85 backdrop-blur-xl border-b border-black/5">
        <button
          onClick={() => setNavOpen(true)}
          className="size-11 rounded-xl hover:bg-slate-100 flex items-center justify-center"
          aria-label="Open navigation"
        >
          <Menu className="size-5 text-[#0A2540]" strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-2 min-w-0 flex-1 mx-2">
          <div className="size-7 rounded-lg bg-gradient-to-br from-[#0A2540] to-[#1E63D9] flex items-center justify-center shrink-0">
            <Sparkles className="size-3.5 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="truncate" style={{ fontSize: 13, fontWeight: 600, color: "#0A2540" }}>BIA-R</div>
            <div className="truncate" style={{ fontSize: 10, color: "#64748B" }}>{active.name}</div>
          </div>
        </div>
        <div className="size-9 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white shrink-0" style={{ fontSize: 12, fontWeight: 500 }}>
          CV
        </div>
      </div>

      {/* Sidebar — desktop sticky, mobile drawer */}
      <div className="hidden lg:block">
        <Sidebar
          current={screen}
          onNavigate={setScreen}
          instance={active}
          onSwitchInstance={() => setFlow("selector")}
        />
      </div>
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[#0A2540]/40 backdrop-blur-sm" onClick={() => setNavOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[360px] md:w-[360px] bg-white shadow-[20px_0_60px_-20px_rgba(10,37,64,0.35)] overflow-y-auto animate-[slideInLeft_220ms_ease-out]">
            <button
              onClick={() => setNavOpen(false)}
              className="absolute top-3 right-3 z-10 size-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              aria-label="Close navigation"
            >
              <X className="size-4 text-slate-600" />
            </button>
            <Sidebar
              current={screen}
              onNavigate={(s) => { setScreen(s); setNavOpen(false); }}
              instance={active}
              onSwitchInstance={() => { setNavOpen(false); setFlow("selector"); }}
            />
          </div>
          <style>{`@keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
        </div>
      )}

      <main className="flex-1 min-w-0 overflow-x-clip">
        <Header titleKey={m.titleKey} subtitleKey={m.subtitleKey} />
        {screen === "dashboard" && <Dashboard />}
        {screen === "context" && <OrgContext />}
        {screen === "bia" && <BIA />}
        {screen === "risks" && <Risks />}
        {screen === "integrated" && <Integrated />}
        {screen === "reports" && <Reports />}
      </main>
    </div>
  );
}
