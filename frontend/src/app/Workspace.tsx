import { useEffect } from "react";
import { Outlet, useParams, useLocation, useNavigate, Navigate } from "react-router";
import { Menu, X, Sparkles } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { useInstanceStore } from "../shared/store/instance.store";
import { useSidebarStore } from "../shared/store/sidebar.store";
import { useAuthStore } from "../shared/store/auth.store";
import { setSearchContext } from "./components/searchStore";

const meta: Record<string, { titleKey: string; subtitleKey: string }> = {
  dashboard: { titleKey: "meta.dashboard.t", subtitleKey: "meta.dashboard.s" },
  context: { titleKey: "meta.context.t", subtitleKey: "meta.context.s" },
  bia: { titleKey: "meta.bia.t", subtitleKey: "meta.bia.s" },
  risks: { titleKey: "meta.risks.t", subtitleKey: "meta.risks.s" },
  integrated: { titleKey: "meta.integrated.t", subtitleKey: "meta.integrated.s" },
  reports: { titleKey: "meta.reports.t", subtitleKey: "meta.reports.s" },
};

function initials(name: string): string {
  return name.split(" ").map(w => w[0]).filter(Boolean).join("").toUpperCase().slice(0, 2);
}

export default function WorkspaceLayout() {
  const { instanceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const activeInstance = useInstanceStore((s) => s.activeInstance);
  const mobileNavOpen = useSidebarStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useSidebarStore((s) => s.setMobileNavOpen);
  const user = useAuthStore((s) => s.user);

  const screen = location.pathname.split("/").pop() || "dashboard";
  const m = meta[screen] || meta.dashboard;

  useEffect(() => {
    setSearchContext(screen);
  }, [screen]);

  useEffect(() => {
    if (activeInstance && activeInstance.id !== instanceId) {
      navigate("/instances", { replace: true });
    }
  }, [instanceId, activeInstance, navigate]);

  if (!activeInstance) {
    return <Navigate to="/instances" replace />;
  }

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
          onClick={() => setMobileNavOpen(true)}
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
            <div className="truncate" style={{ fontSize: 10, color: "#64748B" }}>{activeInstance.name}</div>
          </div>
        </div>
        <div className="size-9 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white shrink-0" style={{ fontSize: 12, fontWeight: 500 }}>
          {user ? initials(user.displayName) : "?"}
        </div>
      </div>

      {/* Sidebar — desktop sticky, mobile drawer */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[#0A2540]/40 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[360px] md:w-[360px] bg-white shadow-[20px_0_60px_-20px_rgba(10,37,64,0.35)] overflow-y-auto animate-[slideInLeft_220ms_ease-out]">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-3 right-3 z-10 size-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              aria-label="Close navigation"
            >
              <X className="size-4 text-slate-600" />
            </button>
            <Sidebar />
          </div>
          <style>{`@keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
        </div>
      )}

      <main className="flex-1 min-w-0 overflow-x-clip">
        <Header titleKey={m.titleKey} subtitleKey={m.subtitleKey} />
        <Outlet />
      </main>
    </div>
  );
}
