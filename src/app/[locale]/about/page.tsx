import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Locale } from "@/content/types";
import { profileData } from "@/content/profile";
import { publicationsData } from "@/content/publications";
import { coursesData } from "@/content/courses";
import { leadershipRoles } from "@/content/leadership";
import { educationData } from "@/content/academic-journey";
import { getDictionary } from "@/content/translations";
import { RevealController } from "@/components/home/RevealController";
import { assetPath } from "@/lib/asset";
import type { Metadata } from "next";

// V6 "Dark Technical" — about (docs/DESIGN_PROMPT_V6.md).
// Photo + a two-sentence bio, then the facts as cards. Every value comes from the content
// files (CV 2026). The longer narrative paragraphs were dropped: their facts are in the cards.

export const metadata: Metadata = {
  title: "About Dr. Eng. Alaa AbuZaiter",
  description: "Profile of Dr. Eng. Alaa AbuZaiter: education, academic offices, research output, teaching and languages.",
};

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

// Research focus as listed in the CV profile (profile.ts bioFull[1]).
const FOCUS = [
  { en: "Smart microactuators", ar: "المشغلات الميكروية الذكية" },
  { en: "3-DOF micromanipulators", ar: "المناولات الدقيقة ثلاثية الأبعاد" },
  { en: "XYθz micro-positioning stages", ar: "منصات تحديد المواقع الدقيقة XYθz" },
  { en: "Wireless thermopneumatic micromixers", ar: "الميكرومكسرات الحرارية الهوائية اللاسلكية" },
];

export default async function AboutPage({ params }: AboutPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const L = (en: string, ar: string) => (isAr ? ar : en);

  const display = isAr ? "font-kufi" : "font-archivo";
  const text = isAr ? "font-plexarabic" : "font-plexsans";
  const mono = isAr ? "font-kufi text-[13px] font-medium" : "font-plexmono text-[12.5px] font-medium";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temper";
  const arrow = isAr ? "←" : "→";
  const nudge = "transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1";
  const present = (p: string) => p.replace(/Currently|Now/i, isAr ? "حتى الآن" : "present");

  const count = {
    total: publicationsData.length,
    journal: publicationsData.filter((p) => p.type === "journal").length,
    conference: publicationsData.filter((p) => p.type === "conference").length,
    chapter: publicationsData.filter((p) => p.type === "book-chapter").length,
  };
  const offices = [...leadershipRoles].sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));

  const CardHead = ({ index, name, link }: { index: number; name: string; link?: { href: string; label: string } }) => (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink/10 pb-4">
      <p className="flex items-center gap-2">
        <span className="font-plexmono text-[12px] text-temper-text">{String(index).padStart(2, "0")}</span>
        <span className={`${display} text-[1.05rem] font-bold text-ink`}>{name}</span>
      </p>
      {link && (
        <Link href={link.href} className={`${display} ${focus} group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-nickel hover:text-temper-text`}>
          {link.label} <span aria-hidden className={nudge}>{arrow}</span>
        </Link>
      )}
    </div>
  );

  return (
    <div className="bg-paper text-ink">
      <RevealController />

      {/* ================= Hero: photo + identity ================= */}
      <header className="border-b border-ink/10">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-x-14 gap-y-10 px-4 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:grid-cols-[400px_minmax(0,1fr)]">
          <figure className="hero-in mx-auto w-full max-w-[260px] sm:max-w-[320px] md:max-w-none">
            {profileData.photo && (
              <div className="tech-frame">
                <div className="relative aspect-[4/5] overflow-hidden border border-ink/15 bg-vellum-deep">
                  <Image
                    src={assetPath(profileData.photo)}
                    alt={(profileData.photoAlt ?? profileData.name)[locale]}
                    fill
                    priority
                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 320px, 260px"
                    className="object-cover object-[50%_20%]"
                  />
                </div>
              </div>
            )}
          </figure>

          <div>
            <p className="hero-in flex items-center gap-1 font-plexmono text-[12.5px] text-temper-text" dir="ltr" style={{ justifyContent: isAr ? "flex-end" : "flex-start" }}>
              <span className="text-nickel">~/</span>about
            </p>
            <h1 className={`${display} hero-in mt-4 text-[2.1rem] font-bold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[3rem] rtl:leading-[1.35] rtl:tracking-normal`} style={{ ["--d" as string]: "70ms" }}>
              {profileData.fullNameFormal[locale]}
            </h1>
            <p
              className={`${isAr ? "font-archivo" : "font-kufi"} hero-in mt-2 text-[1rem] text-nickel`}
              lang={isAr ? "en" : "ar"}
              dir={isAr ? "ltr" : "rtl"}
              style={{ textAlign: isAr ? "right" : "left", ["--d" as string]: "110ms" }}
            >
              {profileData.fullNameFormal[isAr ? "en" : "ar"]}
            </p>

            <p className={`hero-in mt-6 inline-flex items-center gap-3 border border-ink/15 bg-vellum-deep/80 px-3 py-1.5 ${mono} text-ink/85`} style={{ ["--d" as string]: "150ms" }}>
              <span aria-hidden className="pulse-dot" />
              {profileData.administrativeRole[locale]}
            </p>

            <p className={`${text} hero-in mt-6 max-w-[40rem] text-[1.05rem] leading-[1.8] text-ink/80 sm:text-[1.12rem]`} style={{ ["--d" as string]: "200ms" }}>
              {profileData.bioFull[0][locale]}
            </p>

            <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "260ms" }}>
              <Link
                href={`/${locale}/cv`}
                className={`${display} ${focus} group inline-flex items-center gap-3 bg-temper px-6 py-3.5 text-[15px] font-semibold text-vellum transition-colors hover:bg-temper-light active:translate-y-px`}
              >
                {dict.common.downloadCv}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className={`${display} ${focus} group inline-flex items-center gap-3 border border-ink/25 px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/60 hover:bg-ink/5 active:translate-y-px`}
              >
                {L("Contact", "تواصل")} <span aria-hidden className={nudge}>{arrow}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= Cards ================= */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-4 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-2">
        {/* Education */}
        <section className="panel p-5 sm:p-7" data-reveal aria-label={L("Education", "التعليم")}>
          <CardHead index={1} name={L("Education", "التعليم")} link={{ href: `/${locale}/academic-journey`, label: L("Journey", "المسيرة") }} />
          <ol className="mt-5 space-y-5">
            {educationData.map((e) => (
              <li key={e.id} className="grid grid-cols-1 gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
                <span className="pt-0.5 font-plexmono text-[12px] text-nickel" dir="ltr" style={{ textAlign: isAr ? "right" : "left" }}>{e.period}</span>
                <span>
                  <span className={`${display} block text-[15px] font-semibold leading-snug text-ink`}>{isAr ? e.degreeAr : e.degreeEn}</span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-nickel">{e.institution[locale]}</span>
                  {!e.institution[locale].includes(e.location[locale]) && (
                    <span className="block text-[13.5px] leading-snug text-nickel">{e.location[locale]}</span>
                  )}
                  {e.gradeNote && <span className={`mt-1 block text-[12.5px] text-temper-text ${isAr ? "font-kufi" : "font-plexmono"}`}>{e.gradeNote[locale]}</span>}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Offices */}
        <section className="panel p-5 sm:p-7" data-reveal style={{ ["--rd" as string]: "80ms" }} aria-label={L("Academic offices", "المناصب الإدارية")}>
          <CardHead index={2} name={L("Academic offices", "المناصب الإدارية")} link={{ href: `/${locale}/leadership`, label: dict.nav.leadership }} />
          <ol className="mt-5 space-y-5">
            {offices.map((r) => (
              <li key={r.id} className="grid grid-cols-1 gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-4">
                <span className="pt-0.5 font-plexmono text-[12px] text-nickel" dir="ltr" style={{ textAlign: isAr ? "right" : "left" }}>
                  {r.startDate} – <br className="hidden sm:inline" />
                  {present(r.endDate)}
                </span>
                <span>
                  <span className={`${display} block text-[15px] font-semibold leading-snug text-ink`}>
                    {r.isCurrent && <span aria-hidden className="pulse-dot me-2 align-middle" />}
                    {r.title[locale]}
                  </span>
                  <span className="mt-0.5 block text-[13.5px] leading-snug text-nickel">{r.institution[locale]}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Research output */}
        <section className="panel p-5 sm:p-7" data-reveal aria-label={L("Research", "البحث العلمي")}>
          <CardHead index={3} name={L("Research", "البحث العلمي")} link={{ href: `/${locale}/publications`, label: dict.nav.publications }} />
          <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden border border-ink/10 bg-ink/10">
            {[
              { n: count.journal, k: L("Journal articles", "بحثاً في مجلات") },
              { n: count.conference, k: L("Conference papers", "أوراق مؤتمرات") },
              { n: count.chapter, k: L("Book chapters", "فصول في كتب") },
            ].map((m) => (
              <div key={m.k} className="bg-vellum-deep px-3 py-4">
                <dd className="font-archivo text-[2rem] font-bold leading-none text-ink">{m.n}</dd>
                <dt className={`mt-2 ${mono} text-nickel`}>{m.k}</dt>
              </div>
            ))}
          </dl>
          <p className={`mt-5 ${mono} text-nickel`}>{L("Focus", "التركيز")}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {FOCUS.map((f) => (
              <li key={f.en} className={`tag ${isAr ? "font-kufi" : "font-plexmono"}`}>
                <span aria-hidden className="text-temper">#</span>
                {f[locale]}
              </li>
            ))}
          </ul>
          <Link href={`/${locale}/research`} className={`${display} ${focus} group mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-nickel hover:text-temper-text`}>
            {dict.nav.researchAreas} <span aria-hidden className={nudge}>{arrow}</span>
          </Link>
        </section>

        {/* Teaching + languages */}
        <section className="panel p-5 sm:p-7" data-reveal style={{ ["--rd" as string]: "80ms" }} aria-label={L("Teaching and languages", "التدريس واللغات")}>
          <CardHead index={4} name={L("Teaching & languages", "التدريس واللغات")} link={{ href: `/${locale}/teaching`, label: dict.nav.courses }} />
          <div className="mt-5 flex items-end gap-4">
            <span className="font-archivo text-[2.6rem] font-bold leading-none text-ink">{coursesData.length}</span>
            <span className={`${mono} pb-1 text-nickel`}>
              {L("engineering and computing courses listed in the CV", "مساقاً هندسياً وحاسوبياً واردة في السيرة الذاتية")}
            </span>
          </div>
          <dl className="mt-6 border-t border-ink/10">
            {profileData.languages.map((l) => (
              <div key={l.language.en} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-ink/10 py-3.5">
                <dt className={`${display} text-[15px] font-bold text-ink`}>{l.language[locale]}</dt>
                <dd className="text-[14px] text-nickel">{l.proficiency[locale]}</dd>
              </div>
            ))}
          </dl>
          <p className={`mt-5 text-[12.5px] leading-relaxed text-nickel/80 ${isAr ? "font-kufi" : ""}`}>
            {L(
              "Date of birth, home address and personal phone number are in the CV but are not published on this site.",
              "تاريخ الميلاد والعنوان السكني ورقم الهاتف الشخصي واردة في السيرة الذاتية، ولا تُنشر في هذا الموقع."
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
