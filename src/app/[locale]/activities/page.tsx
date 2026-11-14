import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { RevealController } from "@/components/home/RevealController";
import Link from "next/link";
import { Locale, LocalizedString } from "@/content/types";
import { workshopsData } from "@/content/awards";
import { getDictionary } from "@/content/translations";
import type { Metadata } from "next";

// V6 "Dark Technical" — professional development (docs/DESIGN_DIRECTION.md).
// Shows only what the CV gives for each training item: title, organizer, year.
// The `type` descriptors in awards.ts are not shown (they go beyond the CV).

export const metadata: Metadata = {
  title: "Professional Development & Workshops — Dr. Eng. Alaa AbuZaiter",
  description: "Training listed in the CV: MEMS fabrication, CNC micro-machining, teaching methods, AI in education, and project management.",
};

interface ActivitiesPageProps {
  params: Promise<{ locale: string }>;
}

// Editorial grouping by where the training applies.
const GROUPS: { id: string; title: LocalizedString; note: LocalizedString; ids: string[]; link: { slug: string; label: LocalizedString } }[] = [
  {
    id: "lab",
    title: { en: "In the lab", ar: "في المختبر" },
    note: { en: "Fabrication and machining at micro scale.", ar: "التصنيع والتشغيل على المستوى الميكروي." },
    ids: ["ws-mems-fabrication", "ws-cnc-micromachining"],
    link: { slug: "research", label: { en: "Research areas", ar: "مجالات البحث" } },
  },
  {
    id: "classroom",
    title: { en: "In the classroom", ar: "في قاعة الدرس" },
    note: { en: "Teaching methods and the use of AI in education.", ar: "طرائق التدريس واستخدام الذكاء الاصطناعي في التعليم." },
    ids: ["ws-modern-teaching", "ws-ai-education-2025"],
    link: { slug: "teaching", label: { en: "Courses taught", ar: "المساقات الدراسية" } },
  },
  {
    id: "institution",
    title: { en: "In the institution", ar: "في المؤسسة" },
    note: { en: "Planning and managing projects.", ar: "التخطيط وإدارة المشاريع." },
    ids: ["ws-project-management"],
    link: { slug: "leadership", label: { en: "Leadership & roles", ar: "القيادة والمناصب" } },
  },
];

export default async function ActivitiesPage({ params }: ActivitiesPageProps) {
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

  const byId = new Map(workshopsData.map((w) => [w.id, w]));
  const grouped = new Set(GROUPS.flatMap((g) => g.ids));
  const extra = workshopsData.filter((w) => !grouped.has(w.id)); // anything new still appears
  const groups = GROUPS.map((g) => ({ ...g, items: g.ids.map((id) => byId.get(id)).filter((w): w is NonNullable<typeof w> => Boolean(w)) }));
  if (extra.length) {
    groups.push({
      id: "other",
      title: { en: "Other training", ar: "تدريب آخر" },
      note: { en: "", ar: "" },
      ids: extra.map((e) => e.id),
      link: { slug: "cv", label: { en: "CV", ar: "السيرة الذاتية" } },
      items: extra,
    });
  }

  const n = workshopsData.length;
  const countWord = isAr
    ? ({ 3: "ثلاث دورات", 4: "أربع دورات", 5: "خمس دورات وورش عمل", 6: "ست دورات" } as Record<number, string>)[n] ?? `${n} دورات`
    : ({ 3: "Three courses", 4: "Four courses", 5: "Five training courses", 6: "Six training courses" } as Record<number, string>)[n] ?? `${n} training courses`;

  return (
    <div className="bg-paper text-ink">
      <RevealController />
      {/* ================= Header ================= */}
      <PageHeader
        locale={locale}
        path="activities"
        title={L("Professional development", "التطوير المهني")}
        lede={L("Training courses and workshops listed in the CV.", "الدورات التدريبية وورش العمل الواردة في السيرة الذاتية.")}
      />

      {/* ================= Three settings ================= */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-16">
          {groups.map((g) => (
            <section key={g.id} aria-labelledby={`${g.id}-title`} className="flex flex-col">
              <div className="panel h-full p-5 sm:p-6" data-reveal>
                <h2 id={`${g.id}-title`} className={`${display} text-[1.8rem] sm:text-[2.1rem] font-bold leading-tight`}>
                  {g.title[locale]}
                </h2>
                {g.note[locale] && <p className={`${prose} mt-2 text-[1.05rem] leading-relaxed text-ink/75`}>{g.note[locale]}</p>}
              </div>

              <ol className="mt-8 flex-1 space-y-0">
                {g.items.map((w) => (
                  <li key={w.id} className="border-b border-ink/10 py-5 first:pt-0 last:border-b-0">
                    <p className="font-plexmono text-[13px] text-temper-text">
                      {w.year ?? <span className={`text-nickel ${isAr ? "font-kufi" : ""}`}>{L("Year not given", "السنة غير مذكورة")}</span>}
                    </p>
                    <h3 className={`${display} mt-2 text-[1.12rem] sm:text-[1.2rem] font-semibold leading-snug`}>{w.title[locale]}</h3>
                    <p className={`mt-1.5 text-[14.5px] text-nickel ${!w.organizer && isAr ? "font-kufi" : ""}`}>
                      {w.organizer ? w.organizer[locale] : L("Organizer not given in the CV", "الجهة المنظمة غير مذكورة في السيرة")}
                    </p>
                  </li>
                ))}
              </ol>

              <Link
                href={`/${locale}/${g.link.slug}`}
                className={`${display} ${focus} mt-6 inline-flex items-center gap-2 self-start text-[14.5px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}
              >
                {g.link.label[locale]} <span aria-hidden>{arrow}</span>
              </Link>
            </section>
          ))}
        </div>

        {/* Also in the CV — awaiting confirmation */}
        <section className="mt-24 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6" aria-labelledby="council-title">
          <div className="lg:col-span-4">
            <p className={`${label} text-nickel`}>{L("Also mentioned in the CV", "مذكور أيضاً في السيرة")}</p>
          </div>
          <div className="lg:col-span-8 border border-dashed border-temper/70 p-6 sm:p-8">
            <h2 id="council-title" className={`${display} text-[1.25rem] sm:text-[1.4rem] font-bold leading-snug`}>
              {L("Scientific Research Council and curriculum development", "مجلس البحث العلمي وتطوير المناهج")}
            </h2>
            <p className={`mt-3 text-[14.5px] leading-relaxed text-temper-text ${isAr ? "font-kufi" : ""}`}>
              {L(
                "Listed among his leadership tasks; official title and dates awaiting confirmation.",
                "مذكورة ضمن مهامه القيادية؛ المسمى الرسمي والفترة بانتظار التأكيد."
              )}
            </p>
            <Link href={`/${locale}/leadership`} className={`${display} ${focus} mt-4 inline-flex items-center gap-2 text-[14.5px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
              {dict.nav.leadership} <span aria-hidden>{arrow}</span>
            </Link>
          </div>
        </section>

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
          <Link href={`/${locale}/awards`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.nav.awards} <span aria-hidden>{arrow}</span>
          </Link>
          <Link href={`/${locale}/cv`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.nav.cv} <span aria-hidden>{arrow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
