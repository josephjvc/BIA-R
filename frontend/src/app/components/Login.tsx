import { useState } from "react";
import { Sparkles, ArrowRight, Globe, Check, AlertCircle } from "lucide-react";
import { useLang, setLang, t } from "./i18n";

type Mode = "signin" | "signup" | "complete";

const REGISTERED_EMAIL = "camila.vargas@bia-r.pe";

function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.1 35 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.2 5.2C41.1 35.6 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

export function Login({ onLogin }: { onLogin: () => void }) {
  const lang = useLang();
  const [mode, setMode] = useState<Mode>("signin");

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 600px at 20% 10%, #EAF1FF 0%, transparent 60%), radial-gradient(900px 500px at 80% 90%, #F5F7FB 0%, transparent 55%), linear-gradient(180deg, #FFFFFF 0%, #F7F8FB 100%)",
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 0%, rgba(30,99,217,0.05), transparent 50%)",
      }} />
      <button
        onClick={() => setLang(lang === "en" ? "es" : "en")}
        className="absolute top-6 right-6 h-10 px-3.5 rounded-xl bg-white/70 backdrop-blur-xl hover:bg-white border border-black/5 flex items-center gap-2 transition shadow-sm z-10"
      >
        <Globe className="size-4 text-slate-600" strokeWidth={1.75} />
        <span style={{ fontSize: 12, fontWeight: 500, color: "#0A2540" }}>{lang === "en" ? "English" : "Español"}</span>
      </button>

      {mode === "signin" && <SignInCard onLogin={onLogin} onSignUp={() => setMode("signup")} onGoogleNewUser={() => setMode("complete")} />}
      {mode === "signup" && <SignUpCard onCreated={onLogin} onSignIn={() => setMode("signin")} onGoogleNewUser={() => setMode("complete")} />}
      {mode === "complete" && <CompleteProfileCard onDone={onLogin} />}
    </div>
  );
}

// ───────────────────────── Shared shell
function Shell({ children, width = 440 }: { children: React.ReactNode; width?: number }) {
  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-[0_20px_60px_-20px_rgba(10,37,64,0.15)] p-10" style={{ width }}>
      <div className="flex items-center gap-2 mb-8">
        <div className="size-9 rounded-xl bg-gradient-to-br from-[#0A2540] to-[#1E63D9] flex items-center justify-center shadow-sm">
          <Sparkles className="size-4 text-white" strokeWidth={2} />
        </div>
        <div style={{ fontWeight: 600, fontSize: 22, color: "#0A2540", letterSpacing: "-0.02em" }}>BIA-R</div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, type = "text", value, onChange, error, placeholder, autoComplete }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string; autoComplete?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, color: "#0A2540" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`mt-1.5 w-full h-11 px-3.5 rounded-xl bg-slate-50 border outline-none transition ${
          error ? "border-rose-300 focus:border-rose-400 bg-rose-50/40" : "border-black/5 focus:border-[#1E63D9]/40 focus:bg-white"
        }`}
        style={{ fontSize: 14 }}
      />
      {error && (
        <div className="mt-1 flex items-center gap-1" style={{ fontSize: 11, color: "#BE123C" }}>
          <AlertCircle className="size-3" /> {error}
        </div>
      )}
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-11 rounded-xl bg-[#0A2540] hover:bg-[#0F3057] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 transition shadow-[0_8px_24px_-12px_rgba(10,37,64,0.5)]"
      style={{ fontSize: 14, fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

function GoogleBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-11 rounded-xl bg-white hover:bg-slate-50 border border-black/10 text-[#0A2540] flex items-center justify-center gap-2.5 transition"
      style={{ fontSize: 14, fontWeight: 500 }}
    >
      <GoogleIcon /> {label}
    </button>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-black/5" />
      <span style={{ fontSize: 11, color: "#94A3B8", letterSpacing: "0.04em" }}>{label.toUpperCase()}</span>
      <div className="flex-1 h-px bg-black/5" />
    </div>
  );
}

function Checkbox({ checked, onChange, children, error }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="flex items-start gap-2.5 cursor-pointer">
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`mt-0.5 size-[18px] rounded-md border flex items-center justify-center transition ${
            checked ? "bg-[#0A2540] border-[#0A2540]" : error ? "bg-white border-rose-300" : "bg-white border-black/15 hover:border-[#1E63D9]/40"
          }`}
        >
          {checked && <Check className="size-3 text-white" strokeWidth={3} />}
        </button>
        <span style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>{children}</span>
      </label>
      {error && (
        <div className="mt-1 ml-7 flex items-center gap-1" style={{ fontSize: 11, color: "#BE123C" }}>
          <AlertCircle className="size-3" /> {error}
        </div>
      )}
    </div>
  );
}

// ───────────────────────── Sign in
function SignInCard({ onLogin, onSignUp, onGoogleNewUser }: { onLogin: () => void; onSignUp: () => void; onGoogleNewUser: () => void }) {
  const [email, setEmail] = useState("camila.vargas@bia-r.pe");
  const [password, setPassword] = useState("••••••••••");

  return (
    <Shell>
      <div style={{ fontSize: 24, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.02em" }}>{t("login.welcome")}</div>
      <div className="mt-1.5" style={{ fontSize: 14, color: "#64748B" }}>{t("login.sub")}</div>

      <div className="mt-7 space-y-4">
        <Field label={t("login.email")} type="email" value={email} onChange={setEmail} autoComplete="email" />
        <Field label={t("login.password")} type="password" value={password} onChange={setPassword} autoComplete="current-password" />
      </div>

      <div className="mt-6">
        <PrimaryBtn onClick={onLogin}>{t("login.signin")} <ArrowRight className="size-4" strokeWidth={2} /></PrimaryBtn>
      </div>

      <Divider label="or" />
      <GoogleBtn onClick={() => { /* simulate existing google user */ onLogin(); }} label="Continue with Google" />

      <div className="mt-5 flex items-center justify-between">
        <a className="cursor-pointer hover:text-[#0A2540]" style={{ fontSize: 13, color: "#1E63D9" }}>{t("login.forgot")}</a>
        <div style={{ fontSize: 12, color: "#94A3B8" }}>v2.4 · Lima, Perú</div>
      </div>

      <div className="mt-5 pt-5 border-t border-black/5 text-center" style={{ fontSize: 13, color: "#64748B" }}>
        Don't have an account?{" "}
        <button onClick={onSignUp} className="hover:underline" style={{ color: "#1E63D9", fontWeight: 500 }}>Sign up</button>
        {/* keep hidden link to simulate Google new user path in dev */}
        <button onClick={onGoogleNewUser} className="hidden" aria-hidden />
      </div>
    </Shell>
  );
}

// ───────────────────────── Sign up
function SignUpCard({ onCreated, onSignIn, onGoogleNewUser }: { onCreated: () => void; onSignIn: () => void; onGoogleNewUser: () => void }) {
  const [name, setName] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [org, setOrg] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Required";
    if (!last.trim()) e.last = "Required";
    if (!email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email address";
    else if (email.toLowerCase() === REGISTERED_EMAIL) e.email = "This email is already registered";
    if (!password) e.password = "Required";
    else if (password.length < 8) e.password = "Use at least 8 characters";
    if (!confirm) e.confirm = "Required";
    else if (confirm !== password) e.confirm = "Passwords do not match";
    if (!org.trim()) e.org = "Required";
    if (!terms) e.terms = "You must accept the terms to continue";
    setErrors(e);
    if (Object.keys(e).length === 0) onCreated();
  };

  return (
    <Shell width={520}>
      <div style={{ fontSize: 24, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.02em" }}>Create your account</div>
      <div className="mt-1.5" style={{ fontSize: 14, color: "#64748B" }}>Set up your BIA-R workspace in less than a minute.</div>

      <div className="mt-6">
        <GoogleBtn onClick={onGoogleNewUser} label="Continue with Google" />
      </div>

      <Divider label="or sign up with email" />

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" value={name} onChange={setName} error={errors.name} autoComplete="given-name" />
          <Field label="Last name" value={last} onChange={setLast} error={errors.last} autoComplete="family-name" />
        </div>
        <Field label="Email" type="email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" placeholder="name@company.com" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Password" type="password" value={password} onChange={setPassword} error={errors.password} autoComplete="new-password" />
          <Field label="Confirm password" type="password" value={confirm} onChange={setConfirm} error={errors.confirm} autoComplete="new-password" />
        </div>
        <Field label="Organization" value={org} onChange={setOrg} error={errors.org} placeholder="e.g. Alicorp S.A." />
        <Checkbox checked={terms} onChange={setTerms} error={errors.terms}>
          I accept the <a className="underline hover:text-[#0A2540]" style={{ color: "#1E63D9" }}>terms</a> and <a className="underline hover:text-[#0A2540]" style={{ color: "#1E63D9" }}>privacy policy</a>.
        </Checkbox>
      </div>

      <div className="mt-6">
        <PrimaryBtn onClick={submit}>Create account <ArrowRight className="size-4" strokeWidth={2} /></PrimaryBtn>
      </div>

      <div className="mt-5 pt-5 border-t border-black/5 text-center" style={{ fontSize: 13, color: "#64748B" }}>
        Already have an account?{" "}
        <button onClick={onSignIn} className="hover:underline" style={{ color: "#1E63D9", fontWeight: 500 }}>Sign in</button>
      </div>
    </Shell>
  );
}

// ───────────────────────── Complete profile (Google new user)
function CompleteProfileCard({ onDone }: { onDone: () => void }) {
  const [org, setOrg] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!org.trim()) e.org = "Required";
    if (!terms) e.terms = "You must accept the terms to continue";
    setErrors(e);
    if (Object.keys(e).length === 0) onDone();
  };

  return (
    <Shell>
      <div style={{ fontSize: 24, fontWeight: 600, color: "#0A2540", letterSpacing: "-0.02em" }}>Complete your profile</div>
      <div className="mt-1.5" style={{ fontSize: 14, color: "#64748B" }}>
        We'll use your Google account information to create your BIA-R profile.
      </div>

      <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 border border-black/5 flex items-center gap-3">
        <div className="size-10 rounded-full bg-gradient-to-br from-[#1E63D9] to-[#0A2540] flex items-center justify-center text-white" style={{ fontSize: 13, fontWeight: 500 }}>CV</div>
        <div className="min-w-0">
          <div className="truncate" style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>Camila Vargas</div>
          <div className="truncate" style={{ fontSize: 12, color: "#64748B" }}>camila.vargas@gmail.com</div>
        </div>
        <div className="ml-auto inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-black/5" style={{ fontSize: 11, color: "#475569" }}>
          <GoogleIcon className="size-3" /> Google
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <Field label="Organization" value={org} onChange={setOrg} error={errors.org} placeholder="e.g. Alicorp S.A." />
        <Checkbox checked={terms} onChange={setTerms} error={errors.terms}>
          I accept the <a className="underline hover:text-[#0A2540]" style={{ color: "#1E63D9" }}>terms</a> and <a className="underline hover:text-[#0A2540]" style={{ color: "#1E63D9" }}>privacy policy</a>.
        </Checkbox>
      </div>

      <div className="mt-6">
        <PrimaryBtn onClick={submit}>Continue to BIA-R <ArrowRight className="size-4" strokeWidth={2} /></PrimaryBtn>
      </div>

      <div className="mt-4 text-center" style={{ fontSize: 11.5, color: "#94A3B8" }}>
        Roles such as Author, Reviewer or Approver are assigned later within each continuity instance.
      </div>
    </Shell>
  );
}
