import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { RevealController } from "@/components/home/RevealController";
import Link from "next/link";
import { Locale, Publication } from "@/content/types";
import { researchPillars } from "@/content/research-areas";
import { publicationsData } from "@/content/publications";
import { workshopsData } from "@/content/awards";
import { profileData } from "@/content/profile";
import { RESEARCH_LADDER, arabicPaperCount } from "@/content/research-ladder";
import type { Metadata } from "next";

// V6 "Dark Technical" — research areas (docs/DESIGN_PROMPT_V6.md): one card per area, papers fold open.
// Shows each pillar's summary (not the longer descriptions, which go beyond the CV)
// and the papers linked to it in research-areas.ts.

export const metadata: Metadata = {
  title: "Research Areas",
  description: "Six research areas of Dr. Eng. Alaa AbuZaiter — MEMS, shape-memory-alloy microactuators, microrobotics, microdevices, control and applied AI — with the papers linked to each.",
};

interface ResearchPageProps {
  params: Promise<{ locale: string }>;
}

const TYPE_ORDER = { journal: 0, conference: 1, "book-chapter": 2 } as const;

export default async function ResearchPage({ params }: ResearchPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;
  const isAr = locale === "ar";
  const L = (en: string, ar: string) => (isAr ? ar : en);

  const display = isAr ? "font-kufi" : "font-archivo";
  const prose = isAr ? "font-plexarabic" : "font-plexsans";
  const label = isAr
    ? "font-kufi text-[13px] font-medium"
    : "font-plexmono text-[12.5px] font-medium tracking-[0.01em]";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temper";
  const arrow = isAr ? "←" : "→";

  const byId = (id: string) => publicationsData.find((p) => p.id === id);
  const rows = RESEARCH_LADDER.map((l) => {
    const pillar = researchPillars.find((p) => p.id === l.id)!;
    const papers = pillar.relatedPublicationIds
      .map(byId)
      .filter((p): p is Publication => Boolean(p))
      .sort((a, b) => a.year - b.year || TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
    return { ...l, pillar, papers };
  });

  const allYears = rows.flatMap((r) => r.papers.map((p) => p.year));
  const y0 = Math.min(...allYears);
  const y1 = Math.max(...allYears);
  const years = Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i);
  const aiWorkshop = workshopsData.find((w) => w.id === "ws-ai-education-2025");

  const typeName = {
    journal: L("Journal article", "مقال في مجلة"),
    conference: L("Conference paper", "ورقة مؤتمر"),
    "book-chapter": L("Book chapter", "فصل في كتاب"),
  } as const;

  const countText = (n: number) => (isAr ? arabicPaperCount(n) : `${n} linked ${n === 1 ? "paper" : "papers"}`);

  return (
    <div className="bg-paper text-ink">
      <RevealController />
      {/* ================= Header ================= */}
      <PageHeader
        locale={locale}
        path="research"
        title={L("Research areas", "مجالات البحث")}
        lede={L("Six areas, each listed with the papers behind it.", "ستة محاور، ومع كل محور الأبحاث المرتبطة به.")}
      />

      {/* ================= Areas: one card each, papers fold open ================= */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pb-24 pt-10 sm:pt-12">
        <ul className={`mb-6 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-nickel ${isAr ? "font-kufi" : "font-plexmono"}`} aria-hidden>
          <li className="inline-flex items-center gap-2"><span className="rec rec--journal" /> {typeName.journal}</li>
          <li className="inline-flex items-center gap-2"><span className="rec rec--conference" /> {typeName.conference}</li>
          <li className="inline-flex items-center gap-2 font-plexmono">{y0}–{y1}</li>
        </ul>

        <ol className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          {rows.map((r, i) => (
            <li
              key={r.id}
              id={r.id}
              className="panel scroll-mt-24 p-5 sm:p-7"
              data-reveal
              style={{ ["--rd" as string]: `${(i % 2) * 70}ms` }}
            >
              <section aria-labelledby={`${r.id}-title`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2">
                    <span className="font-plexmono text-[12px] text-temper-text">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`border border-ink/15 px-1.5 py-0.5 text-[11.5px] text-nickel ${isAr ? "font-kufi" : "font-plexmono"}`}>{r.step[locale]}</span>
                  </p>
                  <span className={`text-[12.5px] text-nickel ${isAr ? "font-kufi" : "font-plexmono"}`}>
                    {r.papers.length > 0 ? countText(r.papers.length) : L("Leadership & teaching", "محور قيادي وتعليمي")}
                  </span>
                </div>

                <h2 id={`${r.id}-title`} className={`${display} mt-4 text-[1.25rem] font-bold leading-snug text-ink sm:text-[1.4rem]`}>
                  {r.pillar.title[locale]}
                </h2>
                <p className={`${prose} mt-2 text-[15px] leading-[1.7] text-nickel`}>{r.pillar.summary[locale]}</p>

                <ul className="mt-4 flex flex-wrap gap-1.5" dir="ltr" lang="en" style={{ justifyContent: isAr ? "flex-end" : "flex-start" }}>
                  {r.pillar.keywords.slice(0, 4).map((k) => (
                    <li key={k} className="tag font-plexmono !py-1 !text-[11.5px]">{k}</li>
                  ))}
                </ul>

                {/* Year strip: one cell per year, a mark per paper */}
                {r.papers.length > 0 && (
                  <div className="mt-5" aria-hidden dir="ltr">
                    <div className="grid border-b border-ink/20" style={{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }}>
                      {years.map((y) => (
                        <div key={y} className="flex min-h-[34px] flex-col-reverse items-center gap-[4px] border-s border-ink/[0.06] pb-1.5 first:border-s-0">
                          {r.papers.filter((p) => p.year === y).map((p) => (
                            <span key={p.id} className={`rec rec--${p.type} !h-[8px] !w-[8px]`} />
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 flex justify-between font-plexmono text-[10.5px] text-nickel">
                      <span>{y0}</span>
                      <span>{y1}</span>
                    </div>
                  </div>
                )}

                {r.papers.length > 0 ? (
                  <details className="group mt-5 border-t border-ink/10 pt-4">
                    <summary className={`${display} ${focus} flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-ink/85 hover:text-temper-text [&::-webkit-details-marker]:hidden`}>
                      <span className="group-open:hidden">{L(`Show the ${r.papers.length} papers`, `اعرض الأبحاث (${r.papers.length})`)}</span>
                      <span className="hidden group-open:inline">{L("Hide the papers", "إخفاء الأبحاث")}</span>
                      <span aria-hidden className="font-plexmono text-[18px] leading-none text-temper transition-transform duration-300 group-open:rotate-45">+</span>
                    </summary>
                    <ol className="mt-3">
                      {r.papers.map((p) => (
                        <li key={p.id} className="grid grid-cols-[3rem_1fr] gap-3 border-b border-ink/10 py-3.5 last:border-b-0">
                          <span className="pt-0.5 font-plexmono text-[12.5px] text-nickel">{p.year}</span>
                          <div dir="ltr" lang="en" className="text-left">
                            <p className="flex items-center gap-2">
                              <span aria-hidden className={`rec rec--${p.type} !h-[8px] !w-[8px]`} />
                              <span className={isAr ? "font-kufi text-[11.5px] text-nickel" : "font-plexmono text-[11px] text-nickel"} lang={locale} dir={isAr ? "rtl" : "ltr"}>
                                {typeName[p.type]}
                              </span>
                            </p>
                            {p.doi ? (
                              <a
                                href={`https://doi.org/${p.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${focus} mt-1 block font-plexsans text-[14.5px] leading-snug text-ink hover:text-anneal-light`}
                              >
                                {p.title} <span aria-hidden className="text-anneal">↗</span>
                                <span className="sr-only">{L(" (opens the publisher's record)", " (يفتح سجل الناشر)")}</span>
                              </a>
                            ) : (
                              <p className="mt-1 font-plexsans text-[14.5px] leading-snug text-ink">{p.title}</p>
                            )}
                            <p className="mt-0.5 font-plexmono text-[11.5px] text-nickel">{p.sourceName}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </details>
                ) : (
                  <ul className="mt-5 border-t border-ink/10 pt-2">
                    <li className="border-b border-ink/10 py-3">
                      <p className={`${label} text-nickel`}>{L("Administrative role", "المنصب الإداري")}</p>
                      <Link href={`/${locale}/leadership`} className={`${display} ${focus} mt-1 block text-[14.5px] font-semibold text-ink hover:text-temper-text`}>
                        {profileData.administrativeRole[locale]} <span className="font-plexmono text-[12px] font-normal text-nickel">· 02/2025–</span>
                      </Link>
                    </li>
                    <li className="border-b border-ink/10 py-3">
                      <p className={`${label} text-nickel`}>{L("Course taught", "مساق درّسه")}</p>
                      <Link href={`/${locale}/teaching`} className={`${display} ${focus} mt-1 block text-[14.5px] font-semibold text-ink hover:text-temper-text`}>
                        {L("Artificial Intelligence", "الذكاء الاصطناعي")}
                      </Link>
                    </li>
                    {aiWorkshop && (
                      <li className="py-3">
                        <p className={`${label} text-nickel`}>{L("Professional development", "التطوير المهني")}</p>
                        <Link href={`/${locale}/activities`} className={`${display} ${focus} mt-1 block text-[14.5px] font-semibold text-ink hover:text-temper-text`}>
                          {aiWorkshop.title[locale]} <span className="font-plexmono text-[12px] font-normal text-nickel">· {aiWorkshop.year}</span>
                        </Link>
                      </li>
                    )}
                    <li className={`pt-1 text-[12.5px] leading-relaxed text-nickel ${isAr ? "font-kufi" : ""}`}>
                      {L("No published papers are linked to this area yet.", "لا ترتبط بهذا المحور أبحاث منشورة بعد.")}
                    </li>
                  </ul>
                )}
              </section>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href={`/${locale}/publications`}
            className={`${display} ${focus} inline-flex items-center gap-3 bg-temper px-6 py-3.5 text-[15px] font-semibold text-vellum transition-colors hover:bg-temper-light`}
          >
            {L(`Open the publication library (${publicationsData.length})`, `افتح مكتبة المنشورات (${publicationsData.length})`)}
            <span aria-hidden>{arrow}</span>
          </Link>
          <Link href={`/${locale}/conferences`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {L("Conference papers", "أوراق المؤتمرات")} <span aria-hidden>{arrow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
