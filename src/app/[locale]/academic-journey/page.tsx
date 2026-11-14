import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { JourneyMap } from "@/components/home/JourneyMap";
import { RevealController } from "@/components/home/RevealController";
import Link from "next/link";
import { Locale, LocalizedString } from "@/content/types";
import { educationData, careerData } from "@/content/academic-journey";
import { awardsData, yearInferredNote } from "@/content/awards";
import { getDictionary } from "@/content/translations";
import type { Metadata } from "next";

// V6 "Dark Technical" — academic journey (docs/DESIGN_PROMPT_V6.md): map + one timeline per place.
// The CV's education and experience entries, grouped into three chapters by place.
// Every entry from academic-journey.ts is shown; dates are as written in the CV,
// overlaps are kept, and open-ended part-time posts stay marked as unconfirmed.

export const metadata: Metadata = {
  title: "Academic Journey & Career Chronology — Dr. Eng. Alaa AbuZaiter",
  description: "Chronological academic progression, doctoral credentials in MEMS, and institutional career milestones.",
};

interface JourneyPageProps {
  params: Promise<{ locale: string }>;
}

const NOW = 2026 + 10 / 12; // document date: November 2026

// Year-only periods ("2013 – 2016") are drawn as whole years.
function parsePeriod(period: string) {
  const [a, b = a] = period.split(/\s[–-]\s/).map((s) => s.trim());
  const point = (t: string, end: boolean) => {
    if (/current|now/i.test(t)) return NOW;
    const mm = t.match(/(\d{1,2})\/(\d{4})/);
    if (mm) return Number(mm[2]) + (Number(mm[1]) - (end ? 0 : 1)) / 12;
    const y = Number(t.match(/\d{4}/)?.[0]);
    return end ? y + 1 : y;
  };
  return { start: point(a, false), end: point(b, true), open: /current|now/i.test(b) };
}

type Kind = "degree" | "research" | "academic" | "administrative" | "part-time" | "industry";

const KIND_BY_ID: Record<string, Kind> = {
  "edu-bsc": "degree",
  "edu-msc": "degree",
  "edu-phd": "degree",
  "career-ra-utm": "research",
  "career-copymax-trainee": "industry",
  "career-copymax-engineer": "industry",
  "career-ptc": "academic",
  "career-ap-applied-eng": "academic",
  "career-head-biomedical": "administrative",
  "career-dean-intermediate": "administrative",
  "career-dean-se-ai": "administrative",
  "career-parttime-quds": "part-time",
  "career-parttime-azhar": "part-time",
};

const KIND_LABEL: Record<Kind, LocalizedString> = {
  degree: { en: "Degree", ar: "درجة علمية" },
  research: { en: "Research", ar: "عمل بحثي" },
  academic: { en: "Academic appointment", ar: "تعيين أكاديمي" },
  administrative: { en: "Administrative role", ar: "منصب إداري" },
  "part-time": { en: "Part-time appointment", ar: "تعيين غير متفرغ" },
  industry: { en: "Engineering work", ar: "عمل هندسي" },
};

const CHAPTERS: {
  id: string;
  place: LocalizedString;
  span: [number, number];
  years: LocalizedString;
  summary: LocalizedString;
  ids: string[];
}[] = [
  {
    id: "gaza-2005",
    place: { en: "Gaza, Palestine", ar: "غزة، فلسطين" },
    span: [2005, 2011 + 8 / 12],
    years: { en: "2005–2011", ar: "2005–2011" },
    summary: {
      en: "A bachelor's degree in Mechatronics Engineering at Al-Azhar University, then maintenance engineering at Copy Max.",
      ar: "بكالوريوس في هندسة الميكاترونكس من جامعة الأزهر، ثم العمل في الصيانة الهندسية لدى شركة كوبي ماكس.",
    },
    ids: ["edu-bsc", "career-copymax-trainee", "career-copymax-engineer"],
  },
  {
    id: "johor-2011",
    place: { en: "Johor, Malaysia", ar: "جوهور، ماليزيا" },
    span: [2011, 2017],
    years: { en: "2011–2016", ar: "2011–2016" },
    summary: {
      en: "A master's degree and a PhD at Universiti Teknologi Malaysia, with research-assistant work in the MEMS Laboratory — the years behind most of his published shape-memory-alloy papers.",
      ar: "الماجستير والدكتوراه في جامعة تكنولوجي ماليزيا، مع العمل مساعد باحث في مختبر MEMS — وهي السنوات التي أنتجت معظم أبحاثه المنشورة في سبائك الذاكرة الشكلية.",
    },
    ids: ["edu-msc", "edu-phd", "career-ra-utm"],
  },
  {
    id: "gaza-2017",
    place: { en: "Gaza, Palestine", ar: "غزة، فلسطين" },
    span: [2017, NOW],
    years: { en: "2017–present", ar: "2017–حتى الآن" },
    summary: {
      en: "Teaching posts at Palestine Technical College, Al-Quds Open University and Al-Azhar University, alongside a career at the University of Palestine — from head of departments to faculty dean.",
      ar: "تدريس في كلية فلسطين التقنية وجامعة القدس المفتوحة وجامعة الأزهر، إلى جانب مسيرة في جامعة فلسطين — من رئاسة الأقسام إلى عمادة الكلية.",
    },
    ids: [
      "career-ptc",
      "career-parttime-quds",
      "career-head-biomedical",
      "career-parttime-azhar",
      "career-dean-intermediate",
      "career-ap-applied-eng",
      "career-dean-se-ai",
    ],
  },
];

export default async function JourneyPage({ params }: JourneyPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const L = (en: string, ar: string) => (isAr ? ar : en);

  const display = isAr ? "font-kufi" : "font-archivo";
  const label = isAr
    ? "font-kufi text-[13px] font-medium"
    : "font-plexmono text-[12.5px] font-medium tracking-[0.01em]";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temper";
  const arrow = isAr ? "←" : "→";
  const localPeriod = (p: string) => p.replace(/Currently|Now/i, isAr ? "حتى الآن" : "present");

  type Entry = {
    id: string;
    title: string;
    place: string;
    period: string;
    note?: string;
    grade?: string;
    kind: Kind;
    current: boolean;
    unconfirmed: boolean;
    start: number;
    end: number;
  };

  const entries = new Map<string, Entry>();
  educationData.forEach((e) => {
    const { start, end } = parsePeriod(e.period);
    entries.set(e.id, {
      id: e.id,
      title: isAr ? e.degreeAr : e.degreeEn,
      place: e.institution[locale],
      period: e.period,
      grade: e.gradeNote?.[locale],
      kind: "degree",
      current: false,
      unconfirmed: false,
      start,
      end,
    });
  });
  careerData.forEach((c) => {
    const { start, end } = parsePeriod(c.period);
    const kind = KIND_BY_ID[c.id] ?? "academic";
    entries.set(c.id, {
      id: c.id,
      title: isAr ? c.roleAr : c.roleEn,
      place: c.institution[locale],
      period: localPeriod(c.period),
      note: c.notes?.[locale],
      kind,
      current: !!c.isCurrent && !c.isPartTime,
      unconfirmed: !!c.isPartTime && !!c.isCurrent,
      start,
      end,
    });
  });

  // Safety: anything in the data not assigned to a chapter is appended to the last one.
  const assigned = new Set(CHAPTERS.flatMap((c) => c.ids));
  const unassigned = Array.from(entries.keys()).filter((id) => !assigned.has(id));

  const chapters = CHAPTERS.map((c, i) => ({
    ...c,
    items: [...c.ids, ...(i === CHAPTERS.length - 1 ? unassigned : [])]
      .map((id) => entries.get(id))
      .filter((e): e is Entry => Boolean(e))
      .sort((a, b) => a.start - b.start),
    honours: awardsData
      .filter((a) => a.year >= c.span[0] && a.year < c.span[1])
      .sort((a, b) => a.year - b.year),
  }));


  // Timeline node per kind (the legend uses the same classes).
  const nodeClass = (e: Entry) =>
    e.current
      ? "bg-temper"
      : e.unconfirmed
      ? "jr-unconfirmed"
      : e.kind === "degree"
      ? "bg-vellum ring-2 ring-inset ring-anneal"
      : e.kind === "industry"
      ? "bg-nickel"
      : "bg-anneal";

  return (
    <div className="bg-paper text-ink">
      <RevealController />
      <PageHeader
        locale={locale}
        path="academic-journey"
        title={L("Academic journey", "المسيرة الأكاديمية")}
        lede={L("Gaza, Palestine → Johor, Malaysia → Gaza, Palestine. Every entry is taken from the CV, with its dates as written.", "غزة، فلسطين ← جوهور، ماليزيا ← غزة، فلسطين. كل بند مأخوذ من السيرة الذاتية بتواريخه كما وردت.")}
      />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-10">
        <JourneyMap locale={locale} steps={false} />
        <nav aria-label={L("Chapters", "الفصول")} className="mt-4 flex flex-wrap gap-2">
          {chapters.map((c, i) => (
            <Link key={c.id} href={`#${c.id}`} className={`tag ${focus} ${display} transition-colors hover:border-temper hover:text-temper-text`}>
              <span className="font-plexmono text-temper-text">{String(i + 1).padStart(2, "0")}</span>
              {c.place[locale]}
              <span className="font-plexmono text-nickel">{c.years[locale]}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* ================= Legend ================= */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-6">
        <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-nickel ${isAr ? "font-kufi" : "font-plexmono"}`}>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-[11px] w-[11px] rounded-full bg-temper" />{L("Current role", "المنصب الحالي")}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-[11px] w-[11px] rounded-full bg-anneal" />{L("Appointment or research post", "تعيين أو عمل بحثي")}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-[11px] w-[11px] rounded-full bg-vellum ring-2 ring-inset ring-anneal" />{L("Degree", "درجة علمية")}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-[11px] w-[11px] rounded-full bg-nickel" />{L("Engineering work", "عمل هندسي")}</li>
          <li className="inline-flex items-center gap-2"><span aria-hidden className="h-[11px] w-[11px] rounded-full jr-unconfirmed" />{L("Ongoing in the CV, awaiting confirmation", "مستمر في السيرة، بانتظار التأكيد")}</li>
        </ul>
      </div>

      {/* ================= Chapters: one timeline per place ================= */}
      <div className="mx-auto max-w-[1200px] space-y-4 px-4 pb-20 pt-10 sm:px-8">
        {chapters.map((c, ci) => (
          <section
            key={c.id}
            id={c.id}
            aria-labelledby={`${c.id}-title`}
            className="panel scroll-mt-24 grid grid-cols-1 gap-x-10 gap-y-6 p-5 sm:p-8 lg:grid-cols-[260px_minmax(0,1fr)]"
            data-reveal
          >
            {/* Chapter head */}
            <div className="lg:border-e lg:border-ink/10 lg:pe-8">
              <div className="lg:sticky lg:top-28">
                <p className="font-plexmono text-[12px] text-temper-text">
                  {String(ci + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
                </p>
                <h2 id={`${c.id}-title`} className={`${display} mt-3 text-[1.6rem] font-bold leading-tight text-ink sm:text-[1.9rem]`}>
                  {c.place[locale]}
                </h2>
                <p className="mt-2 font-plexmono text-[13px] text-nickel">
                  {c.years[locale]}
                </p>
                <p className={`mt-1 text-[13px] text-nickel ${isAr ? "font-kufi" : "font-plexmono"}`}>
                  {isAr ? `${c.items.length} بنود` : `${c.items.length} entries`}
                </p>

                {c.honours.length > 0 && (
                  <div className="mt-6 border-t border-ink/10 pt-5">
                    <p className={`${label} text-nickel`}>{L("Honours", "التكريمات")}</p>
                    <ul className="mt-3 space-y-3">
                      {c.honours.map((a) => (
                        <li key={a.id} className="grid grid-cols-[3.25rem_1fr] gap-3">
                          <span className="pt-0.5 font-plexmono text-[12.5px] text-temper-text">{a.year}{a.yearInferred ? "*" : ""}</span>
                          <span>
                            <span className={`${display} block text-[14px] font-semibold leading-snug text-ink`}>{a.title[locale]}</span>
                            <span className="block text-[12.5px] leading-relaxed text-nickel">{a.organization[locale]}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    {c.honours.some((a) => a.yearInferred) && (
                      <p className={`mt-3 text-[12px] text-nickel ${isAr ? "font-kufi" : ""}`}>{yearInferredNote[locale]}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <ol className="relative ms-[5px] border-s border-ink/15">
              {c.items.map((e) => (
                <li key={e.id} className="relative pb-7 ps-7 last:pb-1">
                  <span aria-hidden className={`absolute -start-[6px] top-[5px] h-[11px] w-[11px] rounded-full ${nodeClass(e)}`} />
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-plexmono text-[12.5px] text-nickel">{e.period}</span>
                    <span className={`border px-1.5 py-0.5 text-[11.5px] ${isAr ? "font-kufi" : "font-plexmono"} ${e.current ? "border-temper/50 text-temper-text" : "border-ink/15 text-nickel"}`}>
                      {e.current ? L("Current role", "المنصب الحالي") : KIND_LABEL[e.kind][locale]}
                    </span>
                  </p>
                  <h3 className={`${display} mt-2 text-[1.05rem] font-semibold leading-snug text-ink sm:text-[1.12rem]`}>{e.title}</h3>
                  <p className="mt-0.5 text-[14px] text-nickel">{e.place}</p>
                  {e.grade && <p className={`mt-1.5 text-[13px] text-temper-text ${isAr ? "font-kufi" : "font-plexmono"}`}>{e.grade}</p>}
                  {e.unconfirmed && (
                    <p className={`mt-3 inline-block border border-dashed border-temper/70 px-3 py-1.5 text-[12.5px] text-temper-text ${isAr ? "font-kufi" : ""}`}>
                      {e.note ?? L("Listed as ongoing in the CV; current status awaiting confirmation", "مسجل كتعيين مستمر في السيرة؛ الاستمرارية الحالية بانتظار التأكيد")}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}

        <div className="flex flex-wrap gap-x-8 gap-y-3 pt-8">
          <Link href={`/${locale}/leadership`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.common.viewLeadership} <span aria-hidden>{arrow}</span>
          </Link>
          <Link href={`/${locale}/cv`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.nav.cv} <span aria-hidden>{arrow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
