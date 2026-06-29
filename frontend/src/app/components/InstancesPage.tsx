import { useEffect } from "react";
import { Sparkles, Globe } from "lucide-react";
import { useLang, setLang, t } from "./i18n";
import { Instances } from "./Instances";
import { setSearchContext } from "./searchStore";
import { useAuthStore } from "../../shared/store/auth.store";
import { UserMenu } from "./UserMenu";

function initials(name: string): string {
  return name.split(" ").map(w => w[0]).filter(Boolean).join("").toUpperCase().slice(0, 2);
}

export function InstancesPage() {
  const lang = useLang();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setSearchContext("instances:active");
  }, []);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(1200px 600px at 100% 0%, #EAF1FF 0%, transparent 50%), linear-gradient(180deg, #F7F8FB 0%, #FFFFFF 100%)",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
        color: "#0A2540",
      }}
    >
      {/* Standalone header */}
      <header className="h-16 sm:h-20 px-4 sm:px-6 lg:px-10 flex items-center justify-between border-b border-black/5 bg-white/60 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="size-9 rounded-xl bg-gradient-to-br from-[#0A2540] to-[#1E63D9] flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="size-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="truncate" style={{ fontWeight: 600, fontSize: 18, color: "#0A2540", letterSpacing: "-0.01em" }}>BIA-R</div>
            <div className="hidden sm:block" style={{ fontSize: 11, color: "#94A3B8" }}>Workspace selector</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="h-11 sm:h-10 px-3 rounded-xl bg-slate-100/70 hover:bg-slate-200/60 flex items-center gap-2 transition"
            title={lang === "en" ? "Cambiar a español" : "Switch to English"}
          >
            <Globe className="size-4 text-slate-600" strokeWidth={1.75} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#0A2540" }}>{lang === "en" ? "EN" : "ES"}</span>
          </button>

          <UserMenu>
            <button className="hidden md:flex items-center gap-3 pl-3 border-l border-black/5 cursor-pointer">
              <div className="text-right">
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{user?.displayName || "User"}</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>{t("header.role")}</div>
              </div>
              <div className="size-10 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 13, fontWeight: 500 }}>
                {user ? initials(user.displayName) : "?"}
              </div>
            </button>
          </UserMenu>
          <UserMenu>
            <button className="md:hidden size-9 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white cursor-pointer" style={{ fontSize: 12, fontWeight: 500 }}>
              {user ? initials(user.displayName) : "?"}
            </button>
          </UserMenu>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10 pb-2 max-w-[1400px] mx-auto">
        <div style={{ fontSize: "clamp(22px, 4vw, 28px)", fontWeight: 600, color: "#0A2540", letterSpacing: "-0.02em" }}>
          Continuity Instances
        </div>
        <div className="mt-1" style={{ fontSize: 14, color: "#64748B" }}>
          Select or manage a continuity analysis workspace.
        </div>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/70 border border-blue-100" style={{ fontSize: 12, color: "#0A2540" }}>
          <span className="size-1.5 rounded-full bg-[#1E63D9]" />
          Each instance contains its own Organizational Context, BIA, Dependencies, Risk Assessment and Reports.
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto">
        <Instances />
      </div>
    </div>
  );
}
