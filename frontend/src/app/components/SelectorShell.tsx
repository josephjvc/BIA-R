import { useEffect } from "react";
import { Sparkles, Globe, Settings as SettingsIcon, ArrowLeft, User, Building, Users, Bell, KeyRound, LayoutGrid } from "lucide-react";
import { useLang, setLang, t } from "./i18n";
import { Instances, type ActiveInstance } from "./Instances";
import { Card, PrimaryButton, SecondaryButton } from "./shared";
import { setSearchContext } from "./searchStore";

type Props = {
  onOpenInstance: (i: ActiveInstance) => void;
  view: "selector" | "settings";
  onOpenSettings: () => void;
  onCloseSettings: () => void;
};

export function SelectorShell({ onOpenInstance, view, onOpenSettings, onCloseSettings }: Props) {
  const lang = useLang();

  useEffect(() => {
    if (view === "selector") setSearchContext("instances:active");
    else setSearchContext("global");
  }, [view]);

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

          <button
            onClick={onOpenSettings}
            title="Settings"
            className={`size-11 sm:size-10 rounded-full border flex items-center justify-center transition shadow-sm ${
              view === "settings"
                ? "bg-[#0A2540] border-[#0A2540] text-white"
                : "bg-white border-black/10 hover:bg-slate-50 text-[#0A2540]"
            }`}
          >
            <SettingsIcon className="size-4" strokeWidth={1.75} />
          </button>

          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-black/5">
            <div className="text-right">
              <div style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>Camila Vargas</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{t("header.role")}</div>
            </div>
            <div className="size-10 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 13, fontWeight: 500 }}>
              CV
            </div>
          </div>
          <div className="md:hidden size-9 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 12, fontWeight: 500 }}>
            CV
          </div>
        </div>
      </header>

      {/* Content */}
      {view === "selector" ? (
        <>
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
            <Instances onOpen={onOpenInstance} />
          </div>
        </>
      ) : (
        <SettingsPage onBack={onCloseSettings} />
      )}
    </div>
  );
}

// ───────────────────────── Settings page (platform-level)
function SettingsPage({ onBack }: { onBack: () => void }) {
  const groups = [
    { icon: User, name: "User profile", desc: "Name, email, photo and contact details." },
    { icon: KeyRound, name: "Account preferences", desc: "Password, two-factor authentication and sessions." },
    { icon: Globe, name: "Language preferences", desc: "Interface language and regional formats." },
    { icon: Building, name: "Organization profile", desc: "Company details, industry and country." },
    { icon: Users, name: "Members", desc: "Manage team members and invitations." },
    { icon: Bell, name: "Notifications", desc: "Email and in-app notification preferences." },
    { icon: LayoutGrid, name: "General platform settings", desc: "Defaults, time zone and integrations." },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-[1100px] mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
        style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Back to instances
      </button>

      <div style={{ fontSize: 26, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.02em" }}>Settings</div>
      <div className="mt-1 mb-8" style={{ fontSize: 14, color: "#64748B" }}>
        Platform-level configuration for your account and organization.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-8">
        <Card className="p-3 h-fit">
          {groups.map((g, i) => {
            const Ic = g.icon;
            return (
              <button
                key={g.name}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${
                  i === 0 ? "bg-[#0A2540] text-white" : "hover:bg-slate-100/70 text-slate-700"
                }`}
              >
                <Ic className="size-[18px]" strokeWidth={1.75} />
                <span style={{ fontSize: 13, fontWeight: i === 0 ? 500 : 450 }}>{g.name}</span>
              </button>
            );
          })}
        </Card>

        <Card className="p-5 sm:p-8">
          <div style={{ fontSize: 18, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.01em" }}>User profile</div>
          <div className="mt-1" style={{ fontSize: 12, color: "#64748B" }}>Update your personal information.</div>

          <div className="mt-6 flex items-center gap-5">
            <div className="size-20 rounded-2xl bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 24, fontWeight: 500 }}>
              CV
            </div>
            <div>
              <SecondaryButton>Change photo</SecondaryButton>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <SField label="Full name" value="Camila Vargas" />
            <SField label="Job title" value="Resilience Director" />
            <SField label="Email" value="camila.vargas@bia-r.pe" />
            <SField label="Phone" value="+51 987 654 321" />
            <SField label="Country" value="Peru" />
            <SField label="Time zone" value="(GMT-5) Lima" />
          </div>

          <div className="mt-8 flex justify-end gap-2">
            <SecondaryButton>Cancel</SecondaryButton>
            <PrimaryButton>Save changes</PrimaryButton>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }}>{label.toUpperCase()}</label>
      <input
        defaultValue={value}
        className="mt-1 w-full h-10 px-3 rounded-xl bg-slate-50 border border-black/5 focus:bg-white focus:border-[#1E63D9]/40 outline-none"
        style={{ fontSize: 13, color: "#0A2540" }}
      />
    </div>
  );
}
