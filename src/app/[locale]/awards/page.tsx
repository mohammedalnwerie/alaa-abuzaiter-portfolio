import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { RevealController } from "@/components/home/RevealController";
import Link from "next/link";
import { Locale } from "@/content/types";
import { awardsData } from "@/content/awards";
import { getDictionary } from "@/content/translations";
import type { Metadata } from "next";

// V6 "Dark Technical" — awards (docs/DESIGN_DIRECTION.md).
// Three honours as listed in the CV. No categories, rankings or citations are added;
// the PhD certificate's year is flagged as inferred (the CV gives no date).

export const metadata: Metadata = {
  title: "Academic Awards & Innovation Honors — Dr. Eng. Alaa AbuZaiter",
  description: "Verified academic honors, doctoral distinctions, and international innovation medals awarded to Dr. Eng. Alaa AbuZaiter.",
};

interface AwardsPageProps {
  params: Promise<{ locale: string }>;
}

// Career chapters (same as the Academic Journey page), used as context bands.
const BANDS = [
  { id: "johor-2011", from: 2011, to: 2016 + 7 / 12, label: { en: "Johor, Malaysia — master's & PhD", ar: "جوهور، ماليزيا — الماجستير والدكتوراه" } },
  { id: "gaza-2017", from: 2017, to: 2026 + 10 / 12, label: { en: "Gaza, Palestine — teaching & leadership", ar: "غزة، فلسطين — التدريس والقيادة" } },
];

export default async function AwardsPage({ params }: AwardsPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const L = (en: string, ar: string) => (isAr ? ar : en);

  const display = isAr ? "font-kufi" : "font-archivo";
  const prose = isAr ? "font-plexarabic" : "font-plexsans";
  const label = isAr
    ? "font-kufi text-[13px] font-medium"
    : "font-plexmono text-[12.5px] font-medium tracking-[0.01em]";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temper";
  const arrow = isAr ? "←" : "→";

  const awards = [...awardsData].sort((a, b) => a.year - b.year);
  const y0 = 2011;
  const y1 = 2026 + 10 / 12;
  const pct = (v: number) => ((v - y0) / (y1 - y0)) * 100;
  const ticks = [2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026];
  const n = awards.length;
  const countWord = isAr
    ? ({ 1: "تكريم واحد", 2: "تكريمان", 3: "ثلاثة تكريمات", 4: "أربعة تكريمات" } as Record<number, string>)[n] ?? `${n} تكريمات`
    : ({ 1: "One honour", 2: "Two honours", 3: "Three honours", 4: "Four honours" } as Record<number, string>)[n] ?? `${n} honours`;

  return (
    <div className="bg-paper text-ink">
      <RevealController />
      {/* ================= Header ================= */}
      <PageHeader
        locale={locale}
        path="awards"
        title={L("Awards & honours", "الجوائز والتكريمات")}
        lede={L("Three honours listed in the CV, 2013–2021.", "ثلاث تكريمات واردة في السيرة الذاتية، 2013–2021.")}
      />

      {/* ================= Fig. — honours on the career line ================= */}
      <section>
        <figure className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-10 sm:pt-12">
          <div className="panel p-5 sm:p-7">
          <div>
            <p className={`${label} text-ink`}>{L("Honours on the career timeline", "التكريمات على مراحل المسيرة")}</p>
          </div>

          <div className="relative mt-16 sm:mt-20" aria-hidden>
            {/* award markers + labels */}
            <div className="relative h-16">
              {awards.map((a) => (
                <span
                  key={a.id}
                  className="absolute bottom-0 flex -translate-x-1/2 rtl:translate-x-1/2 flex-col items-center gap-2"
                  style={{ insetInlineStart: `${pct(a.year + 0.5)}%` }}
                >
                  <span className={`font-plexmono text-[12px] sm:text-[13px] font-medium ${!!a.yearInferred ? "text-nickel" : "text-temper-text"}`}>
                    {a.year}
                    {!!a.yearInferred ? "*" : ""}
                  </span>
                  <span className={`block h-3.5 w-3.5 rotate-45 ${!!a.yearInferred ? "border-2 border-temper bg-vellum" : "bg-temper"}`} />
                </span>
              ))}
            </div>

            {/* chapter bands */}
            <div className="relative mt-2 h-12 bg-ink/[0.04]">
              {BANDS.map((b, i) => (
                <span
                  key={b.id}
                  className={`absolute inset-y-0 flex items-center px-3 ${i === 0 ? "bg-anneal-soft" : "bg-anneal/15"}`}
                  style={{ insetInlineStart: `${pct(b.from)}%`, width: `${pct(b.to) - pct(b.from)}%` }}
                >
                  <span className={`${display} truncate text-[12px] sm:text-[13.5px] font-semibold text-ink/80`}>{b.label[locale]}</span>
                </span>
              ))}
            </div>

            {/* axis */}
            <div className="relative h-7 border-t border-ink/30">
              {ticks.map((y) => (
                <span
                  key={y}
                  className="absolute top-2 font-plexmono text-[11px] sm:text-[12px] text-nickel -translate-x-1/2 rtl:translate-x-1/2"
                  style={{ insetInlineStart: `${pct(y)}%` }}
                >
                  <span className="hidden sm:inline">{y}</span>
                  <bdi dir="ltr" className="sm:hidden">’{String(y).slice(2)}</bdi>
                </span>
              ))}
            </div>
          </div>

          <figcaption className={`mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-nickel ${isAr ? "font-kufi" : ""}`}>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rotate-45 bg-temper" />{L("Year given in the CV", "السنة كما وردت في السيرة")}</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rotate-45 border-2 border-temper" />{L("* Year inferred — the CV gives no date", "* سنة مستنتجة — لا تذكر السيرة تاريخاً")}</span>
            <Link href={`/${locale}/academic-journey`} className={`${display} ${focus} font-semibold text-ink underline decoration-temper decoration-2 underline-offset-[5px]`}>
              {dict.nav.academicJourney} <span aria-hidden>{arrow}</span>
            </Link>
          </figcaption>
          </div>
        </figure>
      </section>

      {/* ================= Citations ================= */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pb-24">
        <ol className="space-y-4 pt-4">
          {[...awards].reverse().map((a) => {
            const inferred = !!a.yearInferred;
            return (
              <li key={a.id} className="panel grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 p-5 sm:p-8" data-reveal>
                <div className="lg:col-span-3">
                  <p className={`font-archivo home-year ${inferred ? "text-ink/25" : "text-temper"}`} style={{ fontSize: "clamp(2.2rem, 4vw, 3rem)" }}>
                    {a.year}
                    {inferred && <span className="text-[0.45em] align-top">*</span>}
                  </p>
                </div>
                <div className="lg:col-span-9">
                  <h2 className={`${display} text-[1.3rem] sm:text-[1.55rem] font-bold leading-snug`}>{a.title[locale]}</h2>
                  <p className={`${prose} mt-4 text-[1.15rem] sm:text-[1.25rem] leading-[1.6] text-ink/85`}>{a.organization[locale]}</p>

                  <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-3 border-t border-ink/15 pt-6">
                    <div>
                      <dt className={`${label} text-nickel`}>{L("Place", "المكان")}</dt>
                      <dd className={`mt-2 text-[14.5px] text-ink ${isAr ? "font-kufi" : ""}`}>{a.location?.[locale] ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className={`${label} text-nickel`}>{L("Source", "المصدر")}</dt>
                      <dd className={`mt-2 text-[14.5px] text-ink ${isAr ? "font-kufi" : ""}`}>
                        {L("CV 2026", "السيرة الذاتية 2026")}
                        {inferred && (
                          <span className="block text-nickel">{L("Year inferred from the PhD period (2013–2016)", "السنة مستنتجة من فترة الدكتوراه (2013–2016)")}</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className={`${label} text-nickel`}>{L("Certificate", "الشهادة")}</dt>
                      <dd className={`mt-2 text-[14.5px] text-ink/70 ${isAr ? "font-kufi" : ""}`}>
                        <span className="border-b border-dashed border-temper/70">{L("Not yet provided", "لم تُقدَّم بعد")}</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
          <Link href={`/${locale}/activities`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.nav.professionalDev} <span aria-hidden>{arrow}</span>
          </Link>
          <Link href={`/${locale}/cv`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.nav.cv} <span aria-hidden>{arrow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
