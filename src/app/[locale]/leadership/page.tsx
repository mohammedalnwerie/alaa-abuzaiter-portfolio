import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { RevealController } from "@/components/home/RevealController";
import Link from "next/link";
import { Locale } from "@/content/types";
import { leadershipRoles, academicGovernanceNote } from "@/content/leadership";
import { careerData } from "@/content/academic-journey";
import { getDictionary } from "@/content/translations";
import type { Metadata } from "next";

// V6 "Dark Technical" — administrative leadership (docs/DESIGN_DIRECTION.md).
// Only what the CV and CONTENT_AUDIT support: three offices with dates.
// Responsibilities/outcomes are not invented; the research-council mention stays "awaiting confirmation".

export const metadata: Metadata = {
  title: "Administrative Leadership & University Governance — Dr. Eng. Alaa AbuZaiter",
  description: "Executive leadership appointments, faculty deanships, and academic governance at the University of Palestine.",
};

interface LeadershipPageProps {
  params: Promise<{ locale: string }>;
}

const NOW = 2026 + 10 / 12; // document date: November 2026

// "MM/YYYY" → decimal year (start of month); "Currently"/"Now" → NOW
function point(token: string, isEnd: boolean) {
  if (/current|now/i.test(token)) return NOW;
  const m = token.match(/(\d{1,2})\/(\d{4})/);
  if (!m) return NOW;
  return Number(m[2]) + (Number(m[1]) - (isEnd ? 0 : 1)) / 12;
}

function months(start: number, end: number) {
  return Math.max(1, Math.round((end - start) * 12));
}

function durationText(total: number, isAr: boolean) {
  const y = Math.floor(total / 12);
  const m = total % 12;
  if (!isAr) {
    const parts = [];
    if (y) parts.push(`${y} ${y === 1 ? "year" : "years"}`);
    if (m) parts.push(`${m} ${m === 1 ? "month" : "months"}`);
    return parts.join(", ");
  }
  const yy = y === 0 ? "" : y === 1 ? "سنة" : y === 2 ? "سنتان" : y <= 10 ? `${y} سنوات` : `${y} سنة`;
  const mm = m === 0 ? "" : m === 1 ? "شهر" : m === 2 ? "شهران" : m <= 10 ? `${m} أشهر` : `${m} شهراً`;
  return [yy, mm].filter(Boolean).join(" و");
}

export default async function LeadershipPage({ params }: LeadershipPageProps) {
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
  const present = L("present", "حتى الآن");

  // Offices, oldest first
  const offices = [...leadershipRoles]
    .map((r) => {
      const start = point(r.startDate, false);
      const end = point(r.endDate, true);
      return { ...r, start, end, span: months(start, end) };
    })
    .sort((a, b) => a.start - b.start);

  // The interval between offices, as recorded in the CV
  const between = careerData.find((c) => c.id === "career-ap-applied-eng");
  const betweenRange = between
    ? (() => {
        const [a, b] = between.period.split(/\s[–-]\s/);
        return { start: point(a, false), end: point(b, true) };
      })()
    : null;

  const axis0 = Math.min(...offices.map((o) => o.start));
  const axis1 = NOW;
  const pct = (v: number) => ((v - axis0) / (axis1 - axis0)) * 100;
  const ticks: number[] = [];
  for (let y = Math.ceil(axis0); y <= Math.floor(axis1); y++) ticks.push(y);

  // Union of office intervals (consecutive offices share their handover month)
  const totalAdmin = (() => {
    let total = 0;
    let curStart = -Infinity;
    let curEnd = -Infinity;
    offices.forEach((o) => {
      if (o.start > curEnd) {
        if (curEnd > curStart) total += months(curStart, curEnd);
        curStart = o.start;
        curEnd = o.end;
      } else curEnd = Math.max(curEnd, o.end);
    });
    if (curEnd > curStart) total += months(curStart, curEnd);
    return total;
  })();
  const periodText = (o: (typeof offices)[number]) => `${o.startDate} – ${o.isCurrent ? present : o.endDate}`;

  return (
    <div className="bg-paper text-ink">
      <RevealController />
      {/* ================= Header ================= */}
      <PageHeader
        locale={locale}
        path="leadership"
        title={L("Leadership", "المناصب القيادية")}
        lede={L("Three administrative offices at the University of Palestine, Gaza, Palestine, since 2017.", "ثلاثة مناصب إدارية في جامعة فلسطين، غزة، فلسطين، منذ 2017.")}
      />

      {/* ================= Fig. — tenure ================= */}
      <section>
        <figure className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-10 sm:pt-12">
          <div className="panel p-5 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
            <p className={`${label} text-ink`}>
              {L("Administrative tenure, 2017 to now", "مدة المناصب الإدارية من 2017 حتى الآن")}
            </p>
            <p className="font-plexmono text-[12.5px] text-nickel">
              {L("Total", "المجموع")}: {durationText(totalAdmin, isAr)}
            </p>
          </div>

          {/* labels (md+) */}
          <div className="relative mt-10 hidden h-14 md:block" aria-hidden>
            {offices.map((o) => (
              <span
                key={o.id}
                className={`absolute bottom-2 pe-2 ${display} text-[13px] font-semibold leading-tight ${o.isCurrent ? "text-temper-text" : "text-ink"}`}
                style={{ insetInlineStart: `${pct(o.start)}%`, maxWidth: `${Math.max(pct(o.end) - pct(o.start), 16)}%` }}
              >
                {o.title[locale].replace(/^(Dean of the |Dean, )/, isAr ? "" : "Dean, ")}
              </span>
            ))}
          </div>

          {/* track */}
          <div className="relative mt-4 md:mt-0 h-10 bg-ink/[0.05]" aria-hidden>
            {betweenRange && (
              <span
                className="absolute inset-y-0 jr-between"
                style={{ insetInlineStart: `${pct(betweenRange.start)}%`, width: `${pct(betweenRange.end) - pct(betweenRange.start)}%` }}
              />
            )}
            {offices.map((o) => (
              <span
                key={o.id}
                className={`absolute inset-y-0 border-s-[3px] border-vellum ${o.isCurrent ? "bg-temper" : "bg-anneal"}`}
                style={{ insetInlineStart: `${pct(o.start)}%`, width: `${pct(o.end) - pct(o.start)}%` }}
              />
            ))}
          </div>

          {/* axis */}
          <div className="relative h-7 border-t border-ink/30" aria-hidden>
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

          <figcaption className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-3">
            <span className={`inline-flex items-center gap-2 text-[13.5px] text-nickel ${isAr ? "font-kufi" : ""}`}>
              <span className="h-2.5 w-6 flex-none bg-temper" /> {L("Current office", "المنصب الحالي")}
            </span>
            <span className={`inline-flex items-center gap-2 text-[13.5px] text-nickel ${isAr ? "font-kufi" : ""}`}>
              <span className="h-2.5 w-6 flex-none bg-anneal" /> {L("Past office", "منصب سابق")}
            </span>
            {between && (
              <span className={`inline-flex items-start gap-2 text-[13.5px] text-nickel ${isAr ? "font-kufi" : ""}`}>
                <span className="mt-1 h-2.5 w-6 flex-none jr-between ring-1 ring-inset ring-ink/20" />
                <span>
                  {L("No administrative office: ", "دون منصب إداري: ")}
                  {isAr ? between.roleAr : between.roleEn} ({between.period})
                </span>
              </span>
            )}
          </figcaption>
          </div>
        </figure>
      </section>

      {/* ================= Offices ================= */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pb-24">
        <ol className="space-y-4 pt-4">
          {[...offices].reverse().map((o) => (
            <li
              key={o.id}
              className="panel grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-5 p-5 sm:p-8" data-reveal
            >
              <div className="lg:col-span-4">
                <p className={`${label} ${o.isCurrent ? "text-temper-text" : "text-nickel"}`}>
                  {o.isCurrent ? dict.leadership.currentRole : L("Past office", "منصب سابق")}
                </p>
                <p className="mt-4 font-plexmono text-[1.35rem] sm:text-[1.6rem] text-ink">{periodText(o)}</p>
                <p className={`mt-2 text-[14px] text-nickel ${isAr ? "font-kufi" : ""}`}>
                  {durationText(o.span, isAr)}
                  {o.isCurrent ? L(" so far", " حتى الآن") : ""}
                </p>
              </div>

              <div className="lg:col-span-8">
                <h2 className={`${display} text-[1.35rem] sm:text-[1.6rem] font-bold leading-snug`}>
                  {o.isCurrent && <span aria-hidden className="me-3 inline-block h-3 w-3 rounded-full bg-temper align-middle" />}
                  {o.title[locale]}
                </h2>
                <p className="mt-3 text-[16px] text-nickel">{o.institution[locale]}</p>

                <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 border-t border-ink/15 pt-6">
                  <div>
                    <dt className={`${label} text-nickel`}>{dict.leadership.scopeAndResponsibility}</dt>
                    <dd className={`mt-2 text-[14.5px] leading-relaxed text-ink/70 ${isAr ? "font-kufi" : ""}`}>
                      <span className="border-b border-dashed border-ink/30">
                        {L("Awaiting institutional documentation", "بانتظار التوثيق المؤسسي")}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className={`${label} text-nickel`}>{L("Source", "المصدر")}</dt>
                    <dd className={`mt-2 text-[14.5px] leading-relaxed text-ink/80 ${isAr ? "font-kufi" : ""}`}>
                      {o.verifiedSource[locale]}
                    </dd>
                  </div>
                </dl>
              </div>
            </li>
          ))}
        </ol>

        {/* Also in the CV — not yet confirmed */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6" aria-labelledby="governance-title">
          <div className="lg:col-span-4">
            <p className={`${label} text-nickel`}>{dict.leadership.governanceCouncil}</p>
          </div>
          <div className="lg:col-span-8 border border-dashed border-temper/70 p-6 sm:p-8">
            <h2 id="governance-title" className={`${display} text-[1.25rem] sm:text-[1.4rem] font-bold leading-snug`}>
              {L(
                "Scientific Research Council and curriculum development",
                "مجلس البحث العلمي وتطوير المناهج"
              )}
            </h2>
            <p className={`${prose} mt-3 text-[1.05rem] leading-[1.7] text-ink/80`}>{academicGovernanceNote[locale]}</p>
            <p className={`mt-4 text-[13.5px] text-temper-text ${isAr ? "font-kufi" : ""}`}>
              {L(
                "Mentioned in the CV; official title and dates awaiting confirmation.",
                "مذكور في السيرة الذاتية؛ المسمى الرسمي والفترة بانتظار التأكيد."
              )}
            </p>
          </div>
        </section>

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
          <Link href={`/${locale}/academic-journey`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {L("Full academic journey", "المسيرة الأكاديمية كاملة")} <span aria-hidden>{arrow}</span>
          </Link>
          <Link href={`/${locale}/cv`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.nav.cv} <span aria-hidden>{arrow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
