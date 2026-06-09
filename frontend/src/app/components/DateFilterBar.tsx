import { useState } from "react";
import { Calendar, ChevronDown, GitCompareArrows, RotateCcw, Check } from "lucide-react";
import { Card, PrimaryButton, SecondaryButton } from "./shared";
import { t, useLang } from "./i18n";

const presets = [
  { id: "today", k: "preset.today" },
  { id: "7", k: "preset.7" },
  { id: "30", k: "preset.30" },
  { id: "thisMonth", k: "preset.thisMonth" },
  { id: "lastMonth", k: "preset.lastMonth" },
  { id: "thisQ", k: "preset.thisQ" },
  { id: "lastQ", k: "preset.lastQ" },
  { id: "thisYear", k: "preset.thisYear" },
  { id: "custom", k: "preset.custom" },
];

const compareOpts = ["cmp.prev", "cmp.prevMonth", "cmp.prevQ", "cmp.prevYear", "cmp.customCmp"];

export function DateFilterBar() {
  useLang();
  const [preset, setPreset] = useState("thisMonth");
  const [openPreset, setOpenPreset] = useState(false);
  const [openCmp, setOpenCmp] = useState(false);
  const [compare, setCompare] = useState(true);
  const [cmp, setCmp] = useState("cmp.prevMonth");
  const [start, setStart] = useState("2026-03-01");
  const [end, setEnd] = useState("2026-03-31");
  const isCustom = preset === "custom";

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-end gap-3">
        {/* Date range / preset selector */}
        <div className="relative">
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.02em" }}>
            {t("flt.dateRange").toUpperCase()}
          </div>
          <button
            onClick={() => { setOpenPreset(v => !v); setOpenCmp(false); }}
            className="mt-1 h-10 px-3.5 pr-3 rounded-xl bg-slate-50 border border-black/5 hover:bg-white hover:border-black/10 flex items-center gap-2 transition min-w-[220px]"
          >
            <Calendar className="size-4 text-slate-500" strokeWidth={1.75} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>
              {t(presets.find(p => p.id === preset)!.k)}
            </span>
            <ChevronDown className="size-3.5 text-slate-400 ml-auto" />
          </button>
          {openPreset && (
            <div className="absolute z-30 mt-1.5 w-[260px] bg-white rounded-2xl border border-black/5 shadow-[0_20px_60px_-20px_rgba(10,37,64,0.25)] p-1.5">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setPreset(p.id); setOpenPreset(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition`}
                  style={{ fontSize: 13, color: "#0A2540" }}
                >
                  {t(p.k)}
                  {preset === p.id && <Check className="size-3.5 text-[#1E63D9]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom range */}
        {isCustom && (
          <>
            <div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.02em" }}>
                {t("flt.start").toUpperCase()}
              </div>
              <input type="date" value={start} onChange={e => setStart(e.target.value)}
                className="mt-1 h-10 px-3 rounded-xl bg-slate-50 border border-black/5 hover:bg-white outline-none focus:border-[#1E63D9]/40 focus:bg-white"
                style={{ fontSize: 13, color: "#0A2540" }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.02em" }}>
                {t("flt.end").toUpperCase()}
              </div>
              <input type="date" value={end} onChange={e => setEnd(e.target.value)}
                className="mt-1 h-10 px-3 rounded-xl bg-slate-50 border border-black/5 hover:bg-white outline-none focus:border-[#1E63D9]/40 focus:bg-white"
                style={{ fontSize: 13, color: "#0A2540" }} />
            </div>
          </>
        )}

        {/* Compare toggle */}
        <div className="flex items-center gap-2 h-10 px-3.5 rounded-xl bg-slate-50 border border-black/5 self-end">
          <GitCompareArrows className="size-4 text-slate-500" strokeWidth={1.75} />
          <span style={{ fontSize: 13, color: "#0A2540", fontWeight: 500 }}>{t("flt.compare")}</span>
          <button
            onClick={() => setCompare(v => !v)}
            className={`relative w-9 h-5 rounded-full transition ${compare ? "bg-[#0A2540]" : "bg-slate-300"}`}
            aria-pressed={compare}
          >
            <span className={`absolute top-0.5 ${compare ? "left-[18px]" : "left-0.5"} size-4 rounded-full bg-white shadow-sm transition-all`} />
          </button>
        </div>

        {/* Compare dropdown — progressive disclosure */}
        {compare && (
          <div className="relative">
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, letterSpacing: "0.02em" }}>
              {t("flt.compareWith").toUpperCase()}
            </div>
            <button
              onClick={() => { setOpenCmp(v => !v); setOpenPreset(false); }}
              className="mt-1 h-10 px-3.5 pr-3 rounded-xl bg-slate-50 border border-black/5 hover:bg-white hover:border-black/10 flex items-center gap-2 transition min-w-[220px]"
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#0A2540" }}>{t(cmp)}</span>
              <ChevronDown className="size-3.5 text-slate-400 ml-auto" />
            </button>
            {openCmp && (
              <div className="absolute z-30 mt-1.5 w-[260px] bg-white rounded-2xl border border-black/5 shadow-[0_20px_60px_-20px_rgba(10,37,64,0.25)] p-1.5">
                {compareOpts.map(o => (
                  <button
                    key={o}
                    onClick={() => { setCmp(o); setOpenCmp(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition"
                    style={{ fontSize: 13, color: "#0A2540" }}
                  >
                    {t(o)}
                    {cmp === o && <Check className="size-3.5 text-[#1E63D9]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <SecondaryButton><span className="inline-flex items-center gap-1.5"><RotateCcw className="size-3.5" /> {t("flt.reset")}</span></SecondaryButton>
          <PrimaryButton>{t("flt.apply")}</PrimaryButton>
        </div>
      </div>

      {/* Summary line */}
      <div className="mt-4 pt-4 border-t border-black/5 flex items-center gap-2" style={{ fontSize: 12, color: "#64748B" }}>
        <Calendar className="size-3.5 text-slate-400" />
        <span>
          {t("flt.summary")} <span style={{ color: "#0A2540", fontWeight: 500 }}>Mar 01, 2026</span> {t("flt.summaryTo")}{" "}
          <span style={{ color: "#0A2540", fontWeight: 500 }}>Mar 31, 2026</span>
          {compare && (
            <>
              {" "}{t("flt.summaryCompared")}{" "}
              <span style={{ color: "#0A2540", fontWeight: 500 }}>Feb 01, 2026</span> {t("flt.summaryTo")}{" "}
              <span style={{ color: "#0A2540", fontWeight: 500 }}>Feb 28, 2026</span>.
            </>
          )}
        </span>
      </div>
    </Card>
  );
}
