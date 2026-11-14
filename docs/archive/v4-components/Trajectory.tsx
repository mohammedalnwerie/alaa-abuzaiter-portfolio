import React from "react";
import { Locale } from "@/content/types";
import { educationData, careerData } from "@/content/academic-journey";

// Two-lane timeline: study (education) and appointments.
// Positions are computed from the verified period strings in academic-journey.ts.
// Part-time appointments marked "Needs Confirmation" in CONTENT_AUDIT.md are not shown here.

const START = 2005;
const NOW = 2026 + 10 / 12; // November 2026 (document date)
const END = 2027;

const APPOINTMENT_IDS = [
  "career-ptc",
  "career-head-biomedical",
  "career-dean-intermediate",
  "career-ap-applied-eng",
  "career-dean-se-ai",
];

function parsePoint(token: string, isEnd: boolean): number {
  const t = token.trim();
  if (/current|now/i.test(t)) return NOW;
  const mmYYYY = t.match(/(\d{1,2})\/(\d{4})/);
  if (mmYYYY) return Number(mmYYYY[2]) + (Number(mmYYYY[1]) - 1) / 12;
  const yyyy = t.match(/(\d{4})/);
  if (yyyy) return Number(yyyy[1]) + (isEnd ? 0.5 : 0.67);
  return START;
}

function parsePeriod(period: string) {
  const [a, b] = period.split(/[–-]/).map((s) => s.trim()).filter(Boolean);
  // "02/2025 – Currently" may split on "/" safely since we split on dashes only
  return { start: parsePoint(a, false), end: parsePoint(b ?? a, true) };
}

const pct = (v: number) => ((v - START) / (END - START)) * 100;

type Bar = {
  id: string;
  label: string;
  place: string;
  period: string;
  start: number;
  end: number;
  kind: "study" | "past" | "current";
};

export function Trajectory({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const display = isAr ? "font-kufi" : "font-archivo";
  const lbl = isAr ? "font-kufi text-[13px]" : "font-plexmono text-[12px] tracking-[0.01em]";

  const study: Bar[] = [...educationData].reverse().map((e) => {
    const { start, end } = parsePeriod(e.period);
    return {
      id: e.id,
      label: isAr ? e.degreeAr : e.degreeEn,
      place: e.institution[locale],
      period: e.period,
      start,
      end,
      kind: "study",
    };
  });

  const appointments: Bar[] = APPOINTMENT_IDS.map((id) => careerData.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => {
      const { start, end } = parsePeriod(c.period);
      return {
        id: c.id,
        label: isAr ? c.roleAr : c.roleEn,
        place: c.institution[locale],
        period: c.period.replace(/Currently|Now/i, isAr ? "حتى الآن" : "present"),
        start,
        end,
        kind: c.isCurrent ? "current" : "past",
      };
    });

  const lanes = [
    { key: "study", title: isAr ? "الدراسة والبحث" : "Study", bars: study },
    { key: "appointments", title: isAr ? "المناصب الأكاديمية والإدارية" : "Appointments", bars: appointments },
  ];

  const years = [2005, 2010, 2015, 2020, 2025];

  const barColor = (k: Bar["kind"]) =>
    k === "current"
      ? "bg-temper"
      : k === "past"
      ? "bg-anneal"
      : "bg-anneal-soft ring-1 ring-inset ring-anneal/50";

  return (
    <div>
      {/* ---------- Desktop / tablet: Gantt ---------- */}
      <div className="hidden md:block" data-reveal>
        {/* year axis */}
        <div className="relative h-8 border-b border-ink/20">
          {years.map((y) => (
            <span
              key={y}
              className="absolute bottom-2 font-plexmono text-[12px] text-nickel -translate-x-1/2 rtl:translate-x-1/2"
              style={{ insetInlineStart: `${pct(y)}%` }}
            >
              {y}
            </span>
          ))}
          <span
            className="absolute -bottom-px h-3 w-px bg-temper"
            style={{ insetInlineStart: `${pct(NOW)}%` }}
            aria-hidden
          />
        </div>

        <div className="relative">
          {/* vertical guides */}
          {years.map((y) => (
            <span
              key={y}
              aria-hidden
              className="absolute top-0 bottom-0 w-px bg-ink/[0.07]"
              style={{ insetInlineStart: `${pct(y)}%` }}
            />
          ))}

          {lanes.map((lane) => (
            <div key={lane.key} className="relative pt-7 pb-3 border-b border-ink/10 last:border-b-0">
              <h3 className={`${lbl} text-nickel mb-3`}>{lane.title}</h3>
              <ol className="space-y-[10px]">
                {lane.bars.map((b, i) => {
                  const s = pct(b.start);
                  const w = Math.max(pct(b.end) - s, 0.9);
                  const labelAfter = 100 - (s + w) >= s; // place the label on the side with more room
                  return (
                    <li key={b.id} className="relative h-[52px]">
                      <span
                        aria-hidden
                        className={`tl-bar absolute top-[20px] h-[12px] rounded-[2px] ${barColor(b.kind)}`}
                        style={{
                          insetInlineStart: `${s}%`,
                          width: `${w}%`,
                          ["--d" as string]: `${0.15 + i * 0.09}s`,
                        }}
                      />
                      <div
                        className={`absolute top-0 flex h-full flex-col justify-center leading-tight ${
                          labelAfter ? "items-start text-start" : "items-end text-end"
                        }`}
                        style={
                          labelAfter
                            ? { insetInlineStart: `calc(${s + w}% + 14px)`, insetInlineEnd: 0 }
                            : { insetInlineEnd: `calc(${100 - s}% + 14px)`, insetInlineStart: 0 }
                        }
                      >
                        <span className={`${display} text-[15px] font-semibold text-ink whitespace-nowrap`}>
                          {b.kind === "current" && (
                            <span className="me-2 inline-block h-2 w-2 translate-y-[-1px] rounded-full bg-temper align-middle" />
                          )}
                          {b.label}
                        </span>
                        <span className="text-[13px] text-nickel whitespace-nowrap">
                          <span className="font-plexmono" dir={isAr ? undefined : "ltr"}>{b.period}</span>
                          <span className="mx-1.5 text-plate">/</span>
                          {b.place}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Mobile: stacked lanes ---------- */}
      <div className="md:hidden space-y-10">
        {lanes.map((lane) => (
          <div key={lane.key} data-reveal>
            <h3 className={`${lbl} text-nickel mb-4`}>{lane.title}</h3>
            <ol className="relative border-s border-ink/15 ps-5 space-y-6">
              {[...lane.bars].reverse().map((b) => (
                <li key={b.id} className="relative">
                  <span
                    aria-hidden
                    className={`absolute -start-[25px] top-[7px] h-[9px] w-[9px] rounded-full ${
                      b.kind === "current"
                        ? "bg-temper"
                        : b.kind === "past"
                        ? "bg-anneal"
                        : "bg-vellum ring-2 ring-anneal/60"
                    }`}
                  />
                  <p className="font-plexmono text-[12px] text-nickel">
                    {b.period}
                  </p>
                  <p className={`${display} mt-1 text-[16px] font-semibold leading-snug text-ink`}>{b.label}</p>
                  <p className="text-[14px] text-nickel">{b.place}</p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 ${isAr ? "font-kufi text-[13px]" : "text-[13px]"} text-nickel`}>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-5 rounded-[2px] bg-temper" /> {isAr ? "المنصب الحالي" : "Current role"}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-5 rounded-[2px] bg-anneal" /> {isAr ? "مناصب سابقة" : "Past appointments"}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-5 rounded-[2px] bg-anneal-soft ring-1 ring-inset ring-anneal/50" /> {isAr ? "الدراسة" : "Study"}
        </span>
      </div>
    </div>
  );
}
