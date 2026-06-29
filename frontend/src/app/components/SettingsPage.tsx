import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Globe, ArrowLeft, User, KeyRound, Building, Bell, LayoutGrid, Loader2 } from "lucide-react";
import { useLang, setLang, t } from "./i18n";
import { Card, PrimaryButton, SecondaryButton } from "./shared";
import { useProfile, useUpdateProfile } from "../../shared/queries/settings.queries";

const groups = [
  { icon: User, name: "User profile" },
  { icon: KeyRound, name: "Account preferences" },
  { icon: Globe, name: "Language preferences" },
  { icon: Building, name: "Organization profile" },
  { icon: Bell, name: "Notifications" },
  { icon: LayoutGrid, name: "General platform settings" },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const lang = useLang();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const initials = profile?.displayName
    ? profile.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleSave = () => {
    updateProfile.mutate({ displayName, email });
  };

  if (isLoading) {
    return <div className="p-10 flex items-center justify-center"><Loader2 className="size-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="min-h-screen w-full"
      style={{
        background: "radial-gradient(1200px 600px at 100% 0%, #EAF1FF 0%, transparent 50%), linear-gradient(180deg, #F7F8FB 0%, #FFFFFF 100%)",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
        color: "#0A2540",
      }}
    >
      <header className="h-16 sm:h-20 px-4 sm:px-6 lg:px-10 flex items-center justify-between border-b border-black/5 bg-white/60 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="size-9 rounded-xl bg-gradient-to-br from-[#0A2540] to-[#1E63D9] flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="size-4 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="truncate" style={{ fontWeight: 600, fontSize: 18, color: "#0A2540", letterSpacing: "-0.01em" }}>BIA-R</div>
            <div className="hidden sm:block" style={{ fontSize: 11, color: "#94A3B8" }}>Settings</div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="h-11 sm:h-10 px-3 rounded-xl bg-slate-100/70 hover:bg-slate-200/60 flex items-center gap-2 transition"
            title={lang === "en" ? "Cambiar a español" : "Switch to English"}
          >
            <Globe className="size-4 text-slate-600" strokeWidth={1.75} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#0A2540" }}>{lang === "en" ? "EN" : "ES"}</span>
          </button>
          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-black/5">
            <div className="text-right">
              <div style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{profile?.displayName || "-"}</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>{t("header.role")}</div>
            </div>
            <div className="size-10 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 13, fontWeight: 500 }}>{initials}</div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-10 max-w-[1100px] mx-auto">
        <button onClick={() => navigate("/instances")}
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
                <button key={g.name}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${i === 0 ? "bg-[#0A2540] text-white" : "hover:bg-slate-100/70 text-slate-700"}`}
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
                {initials}
              </div>
              <div><SecondaryButton>Change photo</SecondaryButton></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <SField label="Full name" value={displayName} onChange={setDisplayName} />
              <SField label="Email" value={email} onChange={setEmail} />
              <SField label="Organization" value={profile?.organizationName || "-"} onChange={() => {}} disabled />
            </div>

            <div className="mt-8 flex justify-end gap-2">
              <SecondaryButton onClick={() => { setDisplayName(profile?.displayName || ""); setEmail(profile?.email || ""); }}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSave} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save changes"}
              </PrimaryButton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SField({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.04em" }}>{label.toUpperCase()}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1 w-full h-10 px-3 rounded-xl bg-slate-50 border border-black/5 focus:bg-white focus:border-[#1E63D9]/40 outline-none disabled:opacity-50"
        style={{ fontSize: 13, color: "#0A2540" }}
      />
    </div>
  );
}
