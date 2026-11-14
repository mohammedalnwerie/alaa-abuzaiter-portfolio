import React from "react";
import Link from "next/link";
import { Locale } from "@/content/types";
import { getDictionary } from "@/content/translations";
import { profileData } from "@/content/profile";
import { publicationsData } from "@/content/publications";
import { coursesData } from "@/content/courses";
import { publishedPhotos } from "@/content/gallery";
import { HysteresisMark } from "@/components/common/HysteresisMark";

// V4 shell footer — "Shape Memory" system (docs/DESIGN_DIRECTION.md).

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const display = isAr ? "font-kufi" : "font-archivo";
  const prose = isAr ? "font-plexarabic" : "font-plexsans";
  const label = isAr ? "font-kufi text-[13px]" : "font-plexmono text-[12px] tracking-[0.01em]";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temper-light";
  const p = (slug: string) => `/${locale}/${slug}`;

  const columns: { title: string; links: { href: string; label: string; meta?: string }[] }[] = [
    {
      title: isAr ? "الملف" : "Profile",
      links: [
        { href: p("about"), label: dict.nav.about },
        { href: p("academic-journey"), label: dict.nav.academicJourney },
        { href: p("leadership"), label: dict.nav.leadership },
      ],
    },
    {
      title: isAr ? "البحث" : "Research",
      links: [
        { href: p("research"), label: dict.nav.researchAreas },
        { href: p("publications"), label: dict.nav.publications, meta: String(publicationsData.length) },
        { href: p("conferences"), label: dict.nav.academicEvents },
      ],
    },
    {
      title: isAr ? "التدريس والأنشطة" : "Teaching & activities",
      links: [
        { href: p("teaching"), label: dict.nav.courses, meta: String(coursesData.length) },
        { href: p("activities"), label: dict.nav.professionalDev },
        { href: p("awards"), label: dict.nav.awards },
        ...(publishedPhotos().length > 0
          ? [{ href: p("gallery"), label: isAr ? "معرض الصور" : "Gallery", meta: String(publishedPhotos().length) }]
          : []),
      ],
    },
  ];

  const nameLines = isAr ? ["علاء", "أبو زعيتر"] : ["Alaa A.", "AbuZaiter"];

  return (
    <footer className="print:hidden mt-auto bg-vellum-deep text-ink border-t border-ink/10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-16 sm:pt-24 pb-10">
        {/* Colophon */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 border-b border-ink/15 pb-14">
          <div className="lg:col-span-7">
            <HysteresisMark onDark className="h-8 w-12" />
            <p className={`${display} footer-name mt-6 font-bold text-ink`} aria-hidden>
              {nameLines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </p>
            <p className="sr-only">{profileData.fullNameFormal[locale]}</p>
          </div>
          <div className="lg:col-span-5 lg:self-end">
            <dl className="space-y-4">
              <div>
                <dt className={`${label} text-ink/50`}>{isAr ? "الرتبة الأكاديمية" : "Academic rank"}</dt>
                <dd className={`${display} mt-1 text-[16px] font-semibold`}>{profileData.academicRank[locale]}</dd>
              </div>
              <div>
                <dt className={`${label} text-ink/50`}>{isAr ? "المنصب الإداري" : "Administrative role"}</dt>
                <dd className={`${display} mt-1 text-[16px] font-semibold`}>
                  <span aria-hidden className="me-2 inline-block h-2 w-2 rounded-full bg-temper-light align-middle" />
                  {profileData.administrativeRole[locale]}
                </dd>
              </div>
              <div>
                <dt className={`${label} text-ink/50`}>{isAr ? "المؤسسة" : "Institution"}</dt>
                <dd className={`${display} mt-1 text-[16px] font-semibold`}>
                  {profileData.affiliationUniversity[locale]}
                  {isAr ? "، " : ", "}
                  {profileData.location[locale]}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Index */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-10 py-14">
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title} className="lg:col-span-3">
              <h2 className={`${label} text-temper-light mb-4`}>{c.title}</h2>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`${display} ${focus} inline-flex items-baseline gap-2 text-[15px] text-ink/80 transition-colors hover:text-ink`}
                    >
                      {l.label}
                      {l.meta && <span className="font-plexmono text-[12px] text-ink/40">{l.meta}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="lg:col-span-3">
            <h2 className={`${label} text-temper-light mb-4`}>{isAr ? "المراسلة" : "Correspondence"}</h2>
            <a
              href={`mailto:${profileData.email}`}
              dir="ltr"
              className={`font-archivo ${focus} inline-block break-all text-[16px] font-semibold text-ink underline decoration-temper-light/60 decoration-2 underline-offset-[6px] hover:decoration-temper-light`}
            >
              {profileData.email}
            </a>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link href={p("cv")} className={`${display} ${focus} text-[15px] text-ink/80 hover:text-ink`}>
                  {dict.nav.cv}
                </Link>
              </li>
              <li>
                <Link href={p("contact")} className={`${display} ${focus} text-[15px] text-ink/80 hover:text-ink`}>
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Fine print */}
        <div className={`flex flex-col gap-3 border-t border-ink/15 pt-8 text-[13px] leading-relaxed text-ink/50 lg:flex-row lg:items-start lg:justify-between lg:gap-12 ${isAr ? "font-kufi" : ""}`}>
          <p className={`${prose} text-[14px] text-ink/65 lg:max-w-md`}>{dict.footer.disclaimer}</p>
          <div className="space-y-1 lg:text-end">
            <p>{dict.footer.rights}</p>
            <p>{dict.footer.privacyNote}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
