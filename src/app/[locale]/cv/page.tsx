import React from "react";
import { Locale, Publication } from "@/content/types";
import { profileData } from "@/content/profile";
import { educationData, careerData } from "@/content/academic-journey";
import { publicationsData } from "@/content/publications";
import { coursesData, technicalSkillsAndTools } from "@/content/courses";
import { awardsData, workshopsData, yearInferredNote } from "@/content/awards";
import { getDictionary } from "@/content/translations";
import { PrintButton } from "@/components/common/PrintButton";
import type { Metadata } from "next";

// V4 "Shape Memory" — CV (docs/DESIGN_DIRECTION.md).
// The page is the public CV: a print-ready document built only from the verified
// content files. The downloadable PDFs are printed from this page
// (scripts/build_public_cv.js), so the web CV and the PDF cannot drift apart.
// Never add: date of birth, home address, personal phone, or the excluded JESTEC 2022 entry.

export const metadata: Metadata = {
  title: "Curriculum Vitae (CV)",
  description: "Official academic and professional curriculum vitae of Dr. Eng. Alaa AbuZaiter.",
};

interface CvPageProps {
  params: Promise<{ locale: string }>;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const PDF = {
  en: `${basePath}/documents/Alaa_AbuZaiter_CV_Public.pdf`,
  ar: `${basePath}/documents/Alaa_AbuZaiter_CV_Public_AR.pdf`,
};

export default async function CvPage({ params }: CvPageProps) {
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
  const localPeriod = (p: string) => p.replace(/Currently|Now/i, isAr ? "حتى الآن" : "present");

  const byType = (t: Publication["type"]) => publicationsData.filter((p) => p.type === t).sort((a, b) => a.year - b.year);
  const pubGroups = [
    { key: "journal", title: L("Journal articles", "مقالات في مجلات محكمة"), list: byType("journal") },
    { key: "conference", title: L("Conference papers", "أوراق في وقائع مؤتمرات"), list: byType("conference") },
    { key: "book-chapter", title: L("Book chapters", "فصول في كتب"), list: byType("book-chapter") },
  ];

  const citation = (p: Publication) =>
    p.citationApa ??
    `${p.authors.join(", ")} (${p.year}). ${p.title}. ${p.sourceName}${p.pages ? `, ${p.pages}` : ""}.`;

  const H = ({ children }: { children: React.ReactNode }) => (
    <h2 className={`${label} cv-h text-temper-text border-b-2 border-ink pb-2 mb-5`}>{children}</h2>
  );

  return (
    <div className="bg-paper text-ink">
      {/* ================= Toolbar (screen only) ================= */}
      <div className="print:hidden border-b border-ink/15">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-10 sm:pt-14 pb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-1 font-plexmono text-[12.5px] text-temper-text" dir="ltr" style={{ justifyContent: isAr ? "flex-end" : "flex-start" }}><span className="text-nickel">~/</span>cv</p>
            <p className={`${prose} mt-4 max-w-2xl text-[1.08rem] leading-relaxed text-ink/80`}>
              {L(
                "The public version of the CV, built from the verified content on this site. The PDF is printed from this page. Date of birth, home address and personal phone number are left out.",
                "النسخة العامة من السيرة الذاتية، مبنية من المحتوى الموثّق في هذا الموقع، وملف PDF مطبوع من هذه الصفحة نفسها. حُذف تاريخ الميلاد والعنوان السكني ورقم الهاتف الشخصي."
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={PDF[locale]}
              download
              className={`${display} ${focus} inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-[15px] font-semibold text-vellum transition-colors hover:bg-ink-soft`}
            >
              {L("Download PDF", "تحميل PDF")}
              <span className="font-plexmono text-[12px] font-normal text-vellum/60">{isAr ? "عربي" : "EN"}</span>
            </a>
            <a href={PDF[isAr ? "en" : "ar"]} download className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
              {isAr ? "PDF بالإنجليزية" : "PDF in Arabic"}
            </a>
            <PrintButton label={L("Print", "طباعة")} className={`${display} ${focus} text-[15px] font-semibold text-nickel hover:text-ink`} />
          </div>
        </div>
      </div>

      {/* ================= The document ================= */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 py-10 sm:py-16 print:p-0">
        <article className="cv-sheet mx-auto max-w-[52rem] border border-ink/10 bg-vellum-deep print:border-0 px-6 py-10 sm:px-14 sm:py-16 shadow-[0_1px_0_rgba(15,29,46,0.08),0_30px_60px_-40px_rgba(15,29,46,0.35)] print:max-w-none print:bg-white print:p-0 print:shadow-none">
          {/* Masthead */}
          <header className="border-b-2 border-ink pb-7">
            <h1 className={`${display} text-[2rem] sm:text-[2.6rem] font-bold leading-tight`}>{profileData.fullNameFormal[locale]}</h1>
            <p
              className={`${isAr ? "font-archivo" : "font-kufi"} mt-1 text-[1rem] text-nickel`}
              lang={isAr ? "en" : "ar"}
              dir={isAr ? "ltr" : "rtl"}
              style={{ textAlign: isAr ? "right" : "left" }}
            >
              {profileData.fullNameFormal[isAr ? "en" : "ar"]}
            </p>
            <dl className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 text-[14.5px]">
              <div className="flex gap-3"><dt className={`${label} text-nickel w-[7.5rem] shrink-0 pt-[3px]`}>{L("Rank", "الرتبة")}</dt><dd className={`${display} font-semibold`}>{profileData.academicRank[locale]}</dd></div>
              <div className="flex gap-3"><dt className={`${label} text-nickel w-[7.5rem] shrink-0 pt-[3px]`}>{L("Office", "المنصب")}</dt><dd className={`${display} font-semibold`}>{profileData.administrativeRole[locale]}</dd></div>
              <div className="flex gap-3"><dt className={`${label} text-nickel w-[7.5rem] shrink-0 pt-[3px]`}>{L("Institution", "المؤسسة")}</dt><dd className={display}>{profileData.affiliationUniversity[locale]}{isAr ? "، " : ", "}{profileData.location[locale]}</dd></div>
              <div className="flex gap-3"><dt className={`${label} text-nickel w-[7.5rem] shrink-0 pt-[3px]`}>{L("Email", "البريد")}</dt><dd className="font-plexmono" dir="ltr">{profileData.email}</dd></div>
            </dl>
          </header>

          {/* Profile */}
          <section className="mt-9 cv-block">
            <H>{L("Profile", "الملخص المهني")}</H>
            <p className={`${prose} text-[1.08rem] leading-[1.7] text-ink/90`}>{profileData.bioShort[locale]}</p>
          </section>

          {/* Education */}
          <section className="mt-9">
            <H>{L("Education", "المؤهلات العلمية")}</H>
            <ol className="space-y-4">
              {educationData.map((e) => (
                <li key={e.id} className="cv-row grid grid-cols-[6.5rem_1fr] gap-4">
                  <span className="font-plexmono text-[13px] text-nickel pt-0.5">{e.period}</span>
                  <div>
                    <p className={`${display} text-[15.5px] font-semibold leading-snug`}>{isAr ? e.degreeAr : e.degreeEn}</p>
                    <p className="text-[14px] text-nickel">{e.institution[locale]}{e.institution[locale].includes(e.location[locale]) ? "" : ` · ${e.location[locale]}`}</p>
                    {e.gradeNote && <p className={`${prose} text-[14px] italic text-ink/75`}>{e.gradeNote[locale]}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Experience */}
          <section className="mt-9">
            <H>{L("Experience", "الخبرات الأكاديمية والمهنية")}</H>
            <ol className="space-y-4">
              {careerData.map((c) => {
                const unconfirmed = !!c.isPartTime && !!c.isCurrent;
                return (
                  <li key={c.id} className="cv-row grid grid-cols-[6.5rem_1fr] gap-4">
                    <span className="font-plexmono text-[13px] text-nickel pt-0.5">{localPeriod(c.period)}</span>
                    <div>
                      <p className={`${display} text-[15.5px] font-semibold leading-snug`}>
                        {isAr ? c.roleAr : c.roleEn}
                        {unconfirmed && <sup className="ms-0.5 text-temper-text">†</sup>}
                      </p>
                      <p className="text-[14px] text-nickel">{c.institution[locale]}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className={`mt-4 text-[12.5px] text-nickel ${isAr ? "font-kufi" : ""}`}>
              † {L("Part-time appointment listed as ongoing in the CV; current status awaiting confirmation.", "تعيين غير متفرغ مسجل كمستمر في السيرة؛ الاستمرارية الحالية بانتظار التأكيد.")}
            </p>
          </section>

          {/* Publications */}
          <section className="mt-9">
            <H>
              {L(`Publications (${publicationsData.length})`, `المنشورات (${publicationsData.length})`)}
            </H>
            {pubGroups.map((g) => (
              <div key={g.key} className="mt-6 first:mt-0">
                <h3 className={`${display} text-[15px] font-bold`}>
                  {g.title} <span className="font-plexmono text-[12.5px] font-normal text-nickel">({g.list.length})</span>
                </h3>
                <ol className="mt-3 space-y-3" dir="ltr" lang="en">
                  {g.list.map((p, i) => (
                    <li key={p.id} className="cv-row grid grid-cols-[2rem_1fr] gap-2 text-left">
                      <span className="font-plexmono text-[12.5px] text-nickel pt-0.5">{i + 1}.</span>
                      <p className="font-plexsans text-[14.5px] leading-[1.55] text-ink/90">
                        {citation(p)}
                        {p.doi && <span className="font-plexmono text-[12.5px] text-anneal"> doi:{p.doi}</span>}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </section>

          {/* Teaching */}
          <section className="mt-9 cv-block">
            <H>{L(`Courses taught (${coursesData.length})`, `المساقات التي درّسها (${coursesData.length})`)}</H>
            <p className={`${prose} text-[15px] leading-[1.75] text-ink/90`}>
              {coursesData.map((c) => (isAr ? c.titleAr : c.titleOriginal.replace(/\.\s*$/, ""))).join(isAr ? "، " : "; ")}.
            </p>
          </section>

          {/* Training */}
          <section className="mt-9">
            <H>{L("Training and workshops", "الدورات وورش العمل")}</H>
            <ul className="space-y-2.5">
              {workshopsData.map((w) => (
                <li key={w.id} className="cv-row grid grid-cols-[6.5rem_1fr] gap-4">
                  <span className="font-plexmono text-[13px] text-nickel pt-0.5">{w.year ?? "—"}</span>
                  <p className="text-[14.5px] leading-snug">
                    <span className={`${display} font-semibold`}>{w.title[locale]}</span>
                    {w.organizer && <span className="text-nickel"> · {w.organizer[locale]}</span>}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Awards */}
          <section className="mt-9">
            <H>{L("Awards and honours", "الجوائز والتكريمات")}</H>
            <ul className="space-y-2.5">
              {[...awardsData].sort((a, b) => b.year - a.year).map((a) => (
                <li key={a.id} className="cv-row grid grid-cols-[6.5rem_1fr] gap-4">
                  <span className="font-plexmono text-[13px] text-nickel pt-0.5">{a.year}{a.yearInferred ? "*" : ""}</span>
                  <p className="text-[14.5px] leading-snug">
                    <span className={`${display} font-semibold`}>{a.title[locale]}</span>
                    <span className="text-nickel"> · {a.organization[locale]}</span>
                  </p>
                </li>
              ))}
            </ul>
            {awardsData.some((a) => a.yearInferred) && (
              <p className={`mt-3 text-[12.5px] text-nickel ${isAr ? "font-kufi" : ""}`}>{yearInferredNote[locale]}</p>
            )}
          </section>

          {/* Skills & languages */}
          <section className="mt-9 cv-block grid gap-8 sm:grid-cols-2">
            <div>
              <H>{L("Skills and tools", "المهارات والأدوات")}</H>
              <p className={`${display} text-[14.5px] leading-[1.7]`}>
                {technicalSkillsAndTools.technicalSpecializations.map((s) => s[locale]).join(isAr ? "، " : "; ")}
              </p>
              <p className="mt-2 font-plexmono text-[13px] leading-[1.7] text-nickel" dir="ltr" style={{ textAlign: isAr ? "right" : "left" }}>
                {technicalSkillsAndTools.softwareTools.join(" · ")}
              </p>
            </div>
            <div>
              <H>{L("Languages", "اللغات")}</H>
              <ul className="space-y-1.5 text-[14.5px]">
                {profileData.languages.map((l) => (
                  <li key={l.language.en}>
                    <span className={`${display} font-semibold`}>{l.language[locale]}</span>
                    <span className="text-nickel"> · {l.proficiency[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <footer className={`mt-12 border-t border-ink/20 pt-4 text-[12px] leading-relaxed text-nickel ${isAr ? "font-kufi" : ""}`}>
            {L(
              "Public version prepared from CV 2026. Personal details (date of birth, home address, personal phone) are omitted.",
              "نسخة عامة معدّة من سيرة 2026. حُذفت البيانات الشخصية (تاريخ الميلاد، العنوان السكني، الهاتف الشخصي)."
            )}
          </footer>
        </article>
      </div>
    </div>
  );
}
