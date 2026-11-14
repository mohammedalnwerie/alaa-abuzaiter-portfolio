import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Locale } from "@/content/types";
import { publicationsData } from "@/content/publications";
import { getDictionary } from "@/content/translations";
import { PublicationsExplorer } from "@/components/publications/PublicationsExplorer";
import type { Metadata } from "next";

// V6 "Dark Technical" — publications catalogue (docs/DESIGN_PROMPT_V6.md).

export const metadata: Metadata = {
  title: "Publications",
  description: "Comprehensive repository of 19 verified scholarly works: 11 refereed journals, 6 international conference papers, and 2 book chapters.",
};

interface PublicationsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PublicationsPage({ params }: PublicationsPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";

  const display = isAr ? "font-kufi" : "font-archivo";
  const prose = isAr ? "font-plexarabic" : "font-plexsans";
  const label = isAr
    ? "font-kufi text-[13px] font-medium"
    : "font-plexmono text-[12.5px] font-medium tracking-[0.01em]";

  const years = publicationsData.map((p) => p.year);
  const first = Math.min(...years);
  const last = Math.max(...years);
  const leadAuthored = publicationsData.filter((p) => p.authors[0]?.includes("AbuZaiter")).length;

  return (
    <div className="bg-paper text-ink">
      {/* Header */}
      <PageHeader
        locale={locale}
        path="publications"
        title={dict.publications.pageTitle}
        lede={dict.publications.pageSubtitle}
        aside={
          <dl className="grid grid-cols-3 border border-ink/10 bg-vellum-deep/80">
            {[
              { k: isAr ? "الفترة" : "Span", v: `${first}–${last}`, mono: true },
              { k: isAr ? "باسمه أولاً" : "First-authored", v: String(leadAuthored), mono: true },
              { k: isAr ? "مع معرّف DOI" : "With DOI", v: String(publicationsData.filter((p) => p.doi).length), mono: true },
            ].map((f) => (
              <div key={f.k} className="border-e border-ink/10 last:border-e-0 p-4">
                <dt className={`${label} text-nickel`}>{f.k}</dt>
                <dd className="mt-2 whitespace-nowrap font-archivo text-[1.5rem] sm:text-[1.9rem] font-bold leading-none" style={{ fontVariationSettings: '"wdth" 78' }}>
                  {f.v}
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* Catalogue */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-10 sm:pt-14 pb-24">
        <PublicationsExplorer publications={publicationsData} locale={locale} />
        <p className={`mt-12 max-w-2xl text-[13px] leading-relaxed text-nickel ${isAr ? "font-kufi" : ""}`}>
          {isAr
            ? "تتبع البيانات السيرة الذاتية 2026، وتفتح روابط DOI سجل الناشر حيثما وُجد. الملخصات المعروضة موجزة استرشادية وليست النص الأصلي المنشور."
            : "Entries follow the CV 2026; DOI links open the publisher's record where one exists. Summaries shown are short guides, not the original published abstracts."}
        </p>
      </section>
    </div>
  );
}
