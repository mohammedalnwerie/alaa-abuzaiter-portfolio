import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { RevealController } from "@/components/home/RevealController";
import Link from "next/link";
import { Locale } from "@/content/types";
import { publicationsData } from "@/content/publications";
import { getDictionary } from "@/content/translations";
import type { Metadata } from "next";

// V6 "Dark Technical" — supervision (docs/DESIGN_DIRECTION.md).
// The CV records supervision of graduation projects and scientific research, with no
// titles, students or years (CONTENT_AUDIT.md §10). This page states exactly that,
// shows the two final-year-project book chapters as published co-authored work
// (without claiming a supervision role), and shows the register that will be filled
// once projects are confirmed and students consent. No supervision domains are invented.

export const metadata: Metadata = {
  title: "Supervision & Student Projects",
  description: "Supervision of graduation projects and student research, as recorded in the CV of Dr. Eng. Alaa AbuZaiter.",
};

interface SupervisionPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SupervisionPage({ params }: SupervisionPageProps) {
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

  const chapters = publicationsData.filter((p) => p.type === "book-chapter").sort((a, b) => a.year - b.year);

  // Wording follows CV 2026: Profile summary; Skills → Academic; Skills → Innovation.
  const recorded = [
    {
      where: L("Profile summary", "الملخص المهني"),
      what: L("Supervising graduation projects and scientific research.", "الإشراف على مشاريع التخرج والبحث العلمي."),
    },
    {
      where: L("Academic skills", "المهارات الأكاديمية"),
      what: L("Supervision of graduation projects and research.", "الإشراف على مشاريع التخرج والأبحاث."),
    },
    {
      where: L("Innovation", "الابتكار"),
      what: L("Mentoring future engineers and AI specialists.", "توجيه مهندسي ومتخصصي الذكاء الاصطناعي في المستقبل."),
    },
  ];

  const columns = [
    L("Project title", "عنوان المشروع"),
    L("Students", "الطلبة"),
    L("Year", "السنة"),
    L("Institution", "المؤسسة"),
    L("Role", "الدور"),
  ];

  return (
    <div className="bg-paper text-ink">
      <RevealController />
      {/* ================= Header ================= */}
      <PageHeader
        locale={locale}
        path="supervision"
        title={L("Supervision", "الإشراف")}
        lede={L("Graduation projects and student research. Titles and students will be added once confirmed, with consent.", "مشاريع التخرج والبحث الطلابي. تُضاف العناوين وأسماء الطلبة بعد تأكيدها وبموافقتهم.")}
      />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 py-16 sm:py-24 space-y-14">
        {/* ================= What the CV records ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6" aria-labelledby="recorded-title">
          <div className="lg:col-span-4">
            <h2 id="recorded-title" className={`${display} text-[1.3rem] sm:text-[1.5rem] font-bold`}>{L("What the CV records", "ما تسجّله السيرة")}</h2>
          </div>
          <ol className="panel lg:col-span-8 px-5 sm:px-7 py-2">
            {recorded.map((r) => (
              <li key={r.where} className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-1 border-b border-ink/10 py-5 last:border-b-0">
                <span className={`${label} text-nickel pt-1`}>{r.where}</span>
                <p className={`${prose} text-[1.15rem] leading-snug text-ink`}>{r.what}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ================= Published final-year-project chapters ================= */}
        {chapters.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6" aria-labelledby="chapters-title">
            <div className="lg:col-span-4">
              <h2 id="chapters-title" className={`${display} text-[1.3rem] sm:text-[1.5rem] font-bold`}>{L("Final-year projects in print", "مشاريع تخرج منشورة")}</h2>
              <p className={`mt-4 text-[14.5px] leading-relaxed text-nickel ${isAr ? "font-kufi" : ""}`}>
                {L(
                  "Two chapters in UTM's volumes of final-year projects, co-authored with the students named. The CV does not state his role in these projects.",
                  "فصلان في مجلدات مشاريع التخرج الصادرة عن جامعة تكنولوجي ماليزيا، بالاشتراك مع الطلبة المذكورين. لا تذكر السيرة دوره في هذه المشاريع."
                )}
              </p>
            </div>
            <ol className="panel lg:col-span-8 px-5 sm:px-7 py-2">
              {chapters.map((c) => (
                <li key={c.id} className="grid grid-cols-[3.75rem_1fr] gap-4 border-b border-ink/10 py-6 last:border-b-0">
                  <span className="font-plexmono text-[14px] text-nickel pt-1">{c.year}</span>
                  <div dir="ltr" lang="en" className="text-left">
                    <p className="font-plexsans text-[1.2rem] sm:text-[1.3rem] leading-snug text-ink">{c.title}</p>
                    <p className="mt-2 text-[14.5px] text-nickel">
                      {c.authors.map((a, i) => (
                        <React.Fragment key={a}>
                          {a.includes("AbuZaiter") ? <strong className="font-semibold text-ink">{a}</strong> : a}
                          {i < c.authors.length - 1 ? ", " : ""}
                        </React.Fragment>
                      ))}
                    </p>
                    <p className="mt-1 font-plexsans italic text-[15px] text-ink/80">
                      {c.sourceName}
                      {c.publisher ? ` · ${c.publisher}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ================= Register (empty until confirmed) ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6" aria-labelledby="register-title">
          <div className="lg:col-span-4">
            <h2 id="register-title" className={`${display} text-[1.3rem] sm:text-[1.5rem] font-bold`}>{L("Project register", "سجل المشاريع")}</h2>
            <p className={`mt-4 text-[14.5px] leading-relaxed text-nickel ${isAr ? "font-kufi" : ""}`}>
              {L(
                "Each confirmed project will be listed with these details. Student names appear only with their consent.",
                "سيُدرج كل مشروع مؤكَّد بهذه التفاصيل، ولا تظهر أسماء الطلبة إلا بموافقتهم."
              )}
            </p>
          </div>
          <div className="lg:col-span-8">
            {/* desktop: table */}
            <table className="hidden w-full border-collapse md:table">
              <caption className="sr-only">{L("Supervised projects (none confirmed yet)", "المشاريع المشرف عليها (لا مشاريع مؤكدة بعد)")}</caption>
              <thead>
                <tr className="border-y border-ink/20">
                  {columns.map((c) => (
                    <th key={c} scope="col" className={`${label} py-3 pe-4 text-start font-medium text-nickel`}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={columns.length} className="border-b border-dashed border-temper/70 py-10 text-center">
                    <span className={`${display} text-[15px] text-temper-text`}>{L("No projects confirmed yet", "لا مشاريع مؤكدة بعد")}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* mobile: field list */}
            <div className="md:hidden border-t border-ink/20">
              <p className={`${label} border-b border-ink/15 py-3 text-nickel`}>{columns.join(" · ")}</p>
              <p className={`${display} border-b border-dashed border-temper/70 py-8 text-center text-[15px] text-temper-text`}>
                {L("No projects confirmed yet", "لا مشاريع مؤكدة بعد")}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <Link href={`/${locale}/teaching`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.nav.courses} <span aria-hidden>{arrow}</span>
          </Link>
          <Link href={`/${locale}/contact`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {L("Contact about a student project", "التواصل بشأن مشروع طلابي")} <span aria-hidden>{arrow}</span>
          </Link>
          <Link href={`/${locale}/publications`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.nav.publications} <span aria-hidden>{arrow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
