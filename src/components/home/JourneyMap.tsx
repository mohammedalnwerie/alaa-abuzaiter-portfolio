import React from "react";
import { Locale } from "@/content/types";
import { educationData, careerData } from "@/content/academic-journey";
import { MAP_W, MAP_DOTS, PIN_GAZA, PIN_JOHOR } from "@/content/journey-map-dots";

// Journey map: Gaza, Palestine → Johor, Malaysia → Gaza, Palestine.
// Server-rendered dot map (land from Natural Earth, see journey-map-dots.ts). Motion is CSS:
// the arc draws, pins drop in and pulse, a dot travels the route (hidden under reduced motion).
// Every entry is taken from academic-journey.ts (CV 2026). The map is never mirrored in RTL.

const STEPS = [
  {
    id: "gaza-1",
    place: { en: "Gaza, Palestine", ar: "غزة، فلسطين" },
    years: "2005 – 2011",
    edu: ["edu-bsc"],
    career: ["career-copymax-engineer"],
  },
  {
    id: "johor",
    place: { en: "Johor, Malaysia", ar: "جوهور، ماليزيا" },
    years: "2011 – 2016",
    edu: ["edu-msc", "edu-phd"],
    career: ["career-ra-utm"],
  },
  {
    id: "gaza-2",
    place: { en: "Gaza, Palestine", ar: "غزة، فلسطين" },
    years: "2017 –",
    edu: [],
    career: ["career-ptc", "career-head-biomedical", "career-dean-intermediate", "career-ap-applied-eng", "career-dean-se-ai"],
  },
];

export function JourneyMap({ locale, steps: showSteps = true }: { locale: Locale; steps?: boolean }) {
  const isAr = locale === "ar";
  const display = isAr ? "font-kufi" : "font-archivo";
  const mono = isAr ? "font-kufi text-[13px]" : "font-plexmono text-[12px] tracking-[0.01em]";

  const [gx, gy] = PIN_GAZA;
  const [jx, jy] = PIN_JOHOR;
  const cx = (gx + jx) / 2;
  const cy = Math.min(gy, jy) - 14;
  const route = `M ${gx} ${gy} Q ${cx} ${cy} ${jx} ${jy}`;

  const dots: React.ReactNode[] = [];
  for (let i = 0; i < MAP_DOTS.length; i += 2) {
    dots.push(<circle key={i} cx={MAP_DOTS[i]} cy={MAP_DOTS[i + 1]} r={0.24} className="jm-dot" />);
  }

  // Crop the empty sea/land above Turkey and below Java so the map stays compact.
  const VB_Y = 4;
  const VB_H = 37;
  const pct = (v: number, max: number) => `${(v / max) * 100}%`;
  const pctY = (y: number) => `${((y - VB_Y) / VB_H) * 100}%`;

  const steps = STEPS.map((s) => ({
    ...s,
    rows: [
      ...s.edu
        .map((id) => educationData.find((e) => e.id === id))
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
        .map((e) => ({ id: e.id, period: e.period, title: isAr ? e.degreeAr : e.degreeEn, where: e.institution[locale], current: false })),
      ...s.career
        .map((id) => careerData.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map((c) => ({
          id: c.id,
          period: c.period.replace(/Currently|Now/i, isAr ? "حتى الآن" : "present"),
          title: isAr ? c.roleAr : c.roleEn,
          where: c.institution[locale],
          current: Boolean(c.isCurrent),
        })),
    ],
  }));

  return (
    <div className="jm" data-reveal>
      {/* ---------- Map ---------- */}
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-4 sm:px-5 py-3">
          <span className={`${mono} text-nickel`}>{isAr ? "خريطة المسار" : "route.map"}</span>
          <span className="font-plexmono text-[11.5px] text-nickel" dir="ltr">
            31.50°N 34.47°E <span className="text-temper">→</span> 1.49°N 103.74°E
          </span>
        </div>

        <div className="relative" dir="ltr">
          <svg viewBox={`0 ${VB_Y} ${MAP_W} ${VB_H}`} className="block h-auto w-full" role="img" aria-label={isAr ? "خريطة: غزة، فلسطين وجوهور، ماليزيا" : "Map: Gaza, Palestine and Johor, Malaysia"}>
            <g>{dots}</g>
            <path d={route} pathLength={1} fill="none" stroke="rgb(var(--c-temper))" strokeWidth={0.32} strokeLinecap="round" className="jm-arc" />
            <path d={route} fill="none" stroke="rgb(var(--c-temper) / 0.25)" strokeWidth={1.4} strokeLinecap="round" className="jm-arc" pathLength={1} style={{ filter: "blur(0.6px)" }} />

            {[
              { x: gx, y: gy, d: "0.2s" },
              { x: jx, y: jy, d: "1.9s" },
            ].map((p) => (
              <g key={p.x} style={{ ["--d" as string]: p.d }}>
                <circle cx={p.x} cy={p.y} r={0.9} fill="rgb(var(--c-temper))" className="jm-ring" />
                <circle cx={p.x} cy={p.y} r={1.05} fill="rgb(var(--c-temper))" stroke="rgb(var(--c-bg))" strokeWidth={0.35} className="jm-pin" />
              </g>
            ))}

            <circle r={0.7} fill="rgb(var(--c-ink))" className="jm-traveller">
              <animateMotion dur="6s" repeatCount="indefinite" path={route} keyPoints="0;1;1;0;0" keyTimes="0;0.42;0.5;0.92;1" calcMode="linear" />
            </circle>
          </svg>

          {/* HTML labels stay legible at any size */}
          {[
            { x: gx, y: gy, label: isAr ? "غزة، فلسطين" : "Gaza, Palestine", n: "A", d: "0.4s", side: "right", dy: "0px" },
            { x: jx, y: jy, label: isAr ? "جوهور، ماليزيا" : "Johor, Malaysia", n: "B", d: "2.1s", side: "left", dy: "26px" },
          ].map((l) => (
            <span
              key={l.n}
              className="jm-card absolute -translate-y-1/2 whitespace-nowrap"
              style={{
                top: `calc(${pctY(l.y)} + ${l.dy})`,
                ...(l.side === "right" ? { left: `calc(${pct(l.x, MAP_W)} + 14px)` } : { right: `calc(${pct(MAP_W - l.x, MAP_W)} + 14px)` }),
                ["--d" as string]: l.d,
              }}
            >
              <span className={`inline-flex items-center gap-2 border border-temper/50 bg-vellum/90 px-2 py-1 text-[12px] sm:text-[13px] font-semibold text-ink ${display}`} dir={isAr ? "rtl" : "ltr"}>
                <span className="font-plexmono text-temper-text">{l.n}</span>
                {l.label}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Steps ---------- */}
      {showSteps && (
      <ol className="mt-4 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.id} className="panel p-5 sm:p-6" data-reveal style={{ ["--rd" as string]: `${i * 90}ms` }}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-plexmono text-[12px] text-temper-text">
                {String(i + 1).padStart(2, "0")} · {i === 1 ? "B" : "A"}
              </span>
              <span className="font-plexmono text-[12px] text-nickel" dir="ltr">{s.years}</span>
            </div>
            <h3 className={`${display} mt-3 text-[1.25rem] font-bold leading-snug text-ink`}>{s.place[locale]}</h3>
            <ul className="mt-4 space-y-3 border-t border-ink/10 pt-4">
              {s.rows.map((r) => (
                <li key={r.id}>
                  <p className="font-plexmono text-[11.5px] text-nickel" dir="ltr" style={{ textAlign: isAr ? "right" : "left" }}>
                    {r.period}
                  </p>
                  <p className={`${display} mt-0.5 text-[14.5px] font-semibold leading-snug text-ink`}>
                    {r.current && <span aria-hidden className="pulse-dot me-2 align-middle" />}
                    {r.title}
                  </p>
                  <p className="text-[13px] leading-snug text-nickel">{r.where}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      )}
    </div>
  );
}
