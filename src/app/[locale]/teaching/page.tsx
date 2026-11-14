import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { ToolsAndSkills } from "@/components/teaching/ToolsAndSkills";
import Link from "next/link";
import { Locale } from "@/content/types";
import { coursesData, courseCategories, technicalSkillsAndTools } from "@/content/courses";
import { getDictionary } from "@/content/translations";
import type { Metadata } from "next";

// V4 "Shape Memory" — teaching (docs/DESIGN_DIRECTION.md).
// The 15 courses from the CV drawn as a layer stack (like a MEMS process cross-section):
// electrical foundations at the bottom, applications at the top; layer thickness = number of courses.
// Course titles are shown as written in the CV; no claim is made about when each was taught.

export const metadata: Metadata = {
  title: "Academic Teaching & Curricular Knowledge Map — Dr. Eng. Alaa AbuZaiter",
  description: "15 specialized engineering courses taught by Dr. Eng. Alaa AbuZaiter organized into a structured academic knowledge map.",
};

interface TeachingPageProps {
  params: Promise<{ locale: string }>;
}

// Field order (applications first); the page lists it reversed, foundations first.
const STACK: { id: string; bg: string; text: "ink" | "vellum" }[] = [
  { id: "artificial-intelligence", bg: "#DCE2F2", text: "ink" },
  { id: "mechatronics-robotics", bg: "#B9C6EA", text: "ink" },
  { id: "modeling-mechanical", bg: "#8DA2DE", text: "ink" },
  { id: "systems-control", bg: "#2F4FA8", text: "vellum" },
  { id: "digital-computing", bg: "#1A2B40", text: "vellum" },
  { id: "circuits-electronics", bg: "#0F1D2E", text: "vellum" },
];

const cvTitle = (t: string) => t.replace(/\.\s*$/, "");

export default async function TeachingPage({ params }: TeachingPageProps) {
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

  const layers = STACK.map((s) => {
    const cat = courseCategories.find((c) => c.id === s.id);
    const courses = coursesData.filter((c) => c.category.id === s.id);
    return cat ? { ...s, cat, courses } : null;
  }).filter((l): l is NonNullable<typeof l> => Boolean(l) && l!.courses.length > 0);

  // Any category not in STACK is still shown (appended at the top).
  const extra = courseCategories
    .filter((c) => !STACK.some((s) => s.id === c.id))
    .map((cat) => ({ id: cat.id, bg: "#EAECE6", text: "ink" as const, cat, courses: coursesData.filter((c) => c.category.id === cat.id) }))
    .filter((l) => l.courses.length > 0);
  const stack = [...extra, ...layers];

  const courseWord = (n: number) =>
    isAr ? (n === 1 ? "مساق واحد" : n === 2 ? "مساقان" : `${n} مساقات`) : `${n} ${n === 1 ? "course" : "courses"}`;

  return (
    <div className="bg-paper text-ink">
      {/* ================= Header ================= */}
      <PageHeader
        locale={locale}
        path="teaching"
        title={L("Courses taught", "المساقات الدراسية")}
        lede={isAr ? `${coursesData.length} مساقاً من السيرة الذاتية في ${stack.length} مجالات.` : `${coursesData.length} courses from the CV, grouped into ${stack.length} fields.`}
      />

      {/* ================= Fields — one panel per field, foundations first ================= */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-8 py-12 sm:py-16">
        <ol className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...stack].reverse().map((layer, i) => {
            const max = Math.max(...stack.map((l) => l.courses.length));
            return (
              <li key={layer.id} className="panel p-5 sm:p-6" data-reveal style={{ ["--rd" as string]: `${(i % 3) * 70}ms` }}>
                <div className="flex items-center justify-between gap-3 font-plexmono text-[12px]">
                  <span className="text-temper-text">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`text-nickel ${isAr ? "font-kufi" : ""}`}>{courseWord(layer.courses.length)}</span>
                </div>
                <div aria-hidden className="mt-3 h-[3px] w-full bg-ink/10">
                  <div className="h-full bg-temper" style={{ width: `${(layer.courses.length / max) * 100}%` }} />
                </div>
                <h2 className={`${display} mt-5 text-[1.15rem] font-bold leading-snug text-ink`}>{layer.cat.name[locale]}</h2>
                <ul className="mt-4 space-y-2.5 border-t border-ink/10 pt-4">
                  {layer.courses.map((c) => (
                    <li key={c.id} className="flex gap-3">
                      <span aria-hidden className="mt-[9px] h-[5px] w-[5px] flex-none bg-temper/80" />
                      {isAr ? (
                        <span className="min-w-0">
                          <span className="block font-plexarabic text-[15px] leading-snug text-ink">{c.titleAr}</span>
                          <span dir="ltr" lang="en" className="mt-0.5 block text-right font-plexmono text-[11.5px] text-nickel">
                            {cvTitle(c.titleOriginal)}
                          </span>
                        </span>
                      ) : (
                        <span className="font-plexsans text-[15px] leading-snug text-ink">{cvTitle(c.titleOriginal)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
        <p className={`mt-6 text-[13px] text-nickel ${isAr ? "font-kufi" : ""}`}>
          {L(
            "Titles follow the CV's wording; the CV does not say when each course was taught. The CAE course, listed twice in the CV, appears once.",
            "الأسماء كما وردت في السيرة الذاتية، التي لا تحدد متى دُرّس كل مساق. مساق CAE الوارد مرتين يظهر مرة واحدة."
          )}
        </p>
      </section>

      {/* ================= Tools & skills ================= */}
      <ToolsAndSkills
        locale={locale}
        tools={technicalSkillsAndTools.softwareTools}
        specs={technicalSkillsAndTools.technicalSpecializations}
        disclaimer={dict.teaching.technicalSkillsDisclaimer}
      />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pb-24 flex flex-wrap gap-x-8 gap-y-3">
        <Link href={`/${locale}/research`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
          {L("Research areas", "مجالات البحث")} <span aria-hidden>{arrow}</span>
        </Link>
        <Link href={`/${locale}/supervision`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
          {dict.nav.supervision} <span aria-hidden>{arrow}</span>
        </Link>
        <Link href={`/${locale}/cv`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
          {dict.nav.cv} <span aria-hidden>{arrow}</span>
        </Link>
      </div>
    </div>
  );
}
