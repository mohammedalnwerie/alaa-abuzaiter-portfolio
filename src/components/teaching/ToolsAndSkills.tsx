import React from "react";
import { Locale, LocalizedString } from "@/content/types";
import { TOOL_LOGOS, TOOL_MONOGRAMS, TOOL_KIND, TOOL_LOGO_SCALE } from "@/content/tool-logos";

// Teaching page — software from the CV as logo tiles, technical specialisations with
// line icons. Motion is CSS only (globals.css: .tool-*, .spec-icon): tiles boot in with a
// stagger, logos take their brand colour on hover, a scan line sweeps the grid, and the
// icons draw their strokes when revealed. Everything is static under reduced motion.

const SPEC_ICONS: { match: RegExp; d: string }[] = [
  // wafer with a die grid
  { match: /MEMS/i, d: "M12 3a9 9 0 1 0 0.01 0M8 8h8v8H8zM8 12h8M12 8v8M5.5 12H8M16 12h2.5M12 5.5V8M12 16v2.5" },
  // shape-memory coil between two anchors
  { match: /SMA/i, d: "M3 6v12M21 6v12M3 12h1.5c1.2-3.5 2.6-3.5 3.6 0s2.4 3.5 3.6 0s2.4-3.5 3.6 0s2.4 3.5 3.6 0H21" },
  // microcontroller with pins
  { match: /Microcontroller/i, d: "M7 7h10v10H7zM10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3M10 10h4v4h-4z" },
  // isometric wireframe cube
  { match: /CAD/i, d: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" },
  // CNC spindle over a bed
  { match: /CNC/i, d: "M9 3h6v4H9zM10 7h4l-.8 6h-2.4zM12 13v3M4 20h16M6 17h12M4 20v-3M20 20v-3" },
];

export function ToolsAndSkills({
  locale,
  tools,
  specs,
  disclaimer,
}: {
  locale: Locale;
  tools: string[];
  specs: LocalizedString[];
  disclaimer: string;
}) {
  const isAr = locale === "ar";
  const L = (en: string, ar: string) => (isAr ? ar : en);
  const display = isAr ? "font-kufi" : "font-archivo";
  const mono = isAr ? "font-kufi text-[13px] font-medium" : "font-plexmono text-[12.5px] font-medium";

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="tools-title">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3" data-reveal>
        <div>
          <p className="font-plexmono text-[12.5px] text-temper-text" dir="ltr" style={{ textAlign: isAr ? "right" : "left" }}>
            ~/tools
          </p>
          <h2 id="tools-title" className={`${display} home-h3 mt-2 font-bold text-ink`}>
            {L("Tools and skills in the CV", "الأدوات والمهارات في السيرة")}
          </h2>
        </div>
        <p className={`max-w-md text-[13.5px] leading-relaxed text-nickel ${isAr ? "font-kufi" : ""}`}>{disclaimer}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        {/* ---------- Software: logo tiles ---------- */}
        <div className="lg:col-span-7">
          <h3 className={`${mono} mb-3 text-nickel`}>{L("Software", "البرمجيات")}</h3>
          <ul className="tool-grid grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tools.map((t, i) => {
              const logo = TOOL_LOGOS[t];
              const mono2 = TOOL_MONOGRAMS[t];
              const hex = logo?.hex ?? mono2?.hex ?? "#E0A852";
              const kind = TOOL_KIND[t];
              return (
                <li
                  key={t}
                  className="tool panel group flex aspect-[5/4] flex-col justify-between p-4"
                  style={{ ["--brand" as string]: hex, ["--rd" as string]: `${i * 55}ms` }}
                  data-reveal
                >
                  <span className="font-plexmono text-[11px] text-nickel">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-1 items-center justify-center">
                    <span className="tool-glow" aria-hidden />
                    {logo ? (
                      <svg viewBox="0 0 24 24" className="tool-logo h-10 w-10 sm:h-11 sm:w-11"
                        style={{ ["--ls" as string]: TOOL_LOGO_SCALE[t] ?? 1 }} role="img" aria-label={`${t} logo`}>
                        <path d={logo.path} />
                      </svg>
                    ) : (
                      <span className="tool-logo tool-mono font-plexmono" aria-hidden>
                        {mono2?.mark ?? t.slice(0, 2)}
                      </span>
                    )}
                  </span>
                  <span className="block">
                    <span className="block truncate font-plexmono text-[12.5px] font-medium text-ink" dir="ltr" lang="en" style={{ textAlign: isAr ? "right" : "left" }}>{t}</span>
                    {kind && (
                      <span className={`block truncate text-[11px] text-nickel ${isAr ? "font-kufi text-right" : "font-plexmono"}`} dir={isAr ? "rtl" : "ltr"}>
                        {kind[locale]}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- Specialisations: line icons ---------- */}
        <div className="lg:col-span-5">
          <h3 className={`${mono} mb-3 text-nickel`}>{L("Technical specialisations", "التخصصات التقنية")}</h3>
          <ul className="space-y-3">
            {specs.map((sp, i) => {
              const icon = SPEC_ICONS.find((s) => s.match.test(sp.en));
              return (
                <li
                  key={sp.en}
                  className="panel panel--lift flex items-center gap-4 p-4"
                  data-reveal
                  style={{ ["--rd" as string]: `${i * 70}ms` }}
                >
                  <span className="flex h-12 w-12 flex-none items-center justify-center border border-temper/30 bg-temper/[0.06]">
                    {icon && (
                      <svg viewBox="0 0 24 24" className="spec-icon h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d={icon.d} pathLength={1} />
                      </svg>
                    )}
                  </span>
                  <span className={`${display} text-[14.5px] font-semibold leading-snug text-ink`}>{sp[locale]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
