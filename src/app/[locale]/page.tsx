import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale, Publication } from "@/content/types";
import { profileData } from "@/content/profile";
import { publicationsData } from "@/content/publications";
import { coursesData } from "@/content/courses";
import { getDictionary } from "@/content/translations";
import { RevealController } from "@/components/home/RevealController";
import { CountUp } from "@/components/home/Motion";
import { JourneyMap } from "@/components/home/JourneyMap";
import { assetPath } from "@/lib/asset";

// Homepage V6 — "Dark Technical" (docs/DESIGN_PROMPT_V6.md).
// Photo + identity, four figures, the Gaza ↔ Johor map, three papers, contact.
// All facts come from src/content (CV 2026, verified in docs/CONTENT_AUDIT.md).

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const FEATURED_IDS = ["j-2015-stewart-platform", "j-2016-thermopneumatic-mixer", "j-2025-iterative-learning"];

const FIELDS = [
  { en: "MEMS", ar: "MEMS" },
  { en: "SMA microactuators", ar: "مشغلات SMA الدقيقة" },
  { en: "Microrobotics", ar: "الروبوتات الدقيقة" },
  { en: "Mechatronics", ar: "الميكاترونكس" },
  { en: "Control systems", ar: "أنظمة التحكم" },
  { en: "Applied AI", ar: "الذكاء الاصطناعي التطبيقي" },
];

export default async function HomePage({ params }: HomePageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const L = (en: string, ar: string) => (isAr ? ar : en);

  const display = isAr ? "font-kufi" : "font-archivo";
  const text = isAr ? "font-plexarabic" : "font-plexsans";
  const mono = isAr ? "font-kufi text-[13px] font-medium" : "font-plexmono text-[12.5px] font-medium";
  const arrow = isAr ? "←" : "→";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temper";
  const nudge = "transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1";

  const pubs = publicationsData;
  const count = {
    journal: pubs.filter((p) => p.type === "journal").length,
    conference: pubs.filter((p) => p.type === "conference").length,
    total: pubs.length,
  };
  const featured = FEATURED_IDS.map((id) => pubs.find((p) => p.id === id)).filter((p): p is Publication => Boolean(p));

  const facts = [
    { k: L("Position", "المنصب"), v: profileData.administrativeRole[locale], current: true },
    { k: L("Rank", "الرتبة"), v: profileData.academicRank[locale] },
    { k: L("PhD", "الدكتوراه"), v: L("MEMS — Universiti Teknologi Malaysia, 2016", "MEMS — جامعة تكنولوجي ماليزيا، 2016") },
    { k: L("Based in", "المقر"), v: `${profileData.affiliationUniversity[locale]}${isAr ? "، " : ", "}${profileData.location[locale]}` },
  ];

  const metrics = [
    { n: count.total, k: L("Published works", "عملاً منشوراً"), href: "/publications" },
    { n: count.journal, k: L("Journal articles", "بحثاً في مجلات"), href: "/publications" },
    { n: count.conference, k: L("Conference papers", "أوراق مؤتمرات"), href: "/conferences" },
    { n: coursesData.length, k: L("Courses taught", "مساقاً دراسياً"), href: "/teaching" },
  ];

  const Head = ({ path, title, link }: { path: string; title: string; link?: { href: string; label: string } }) => (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3" data-reveal>
      <div>
        <p className="font-plexmono text-[12.5px] text-temper-text" dir="ltr" style={{ textAlign: isAr ? "right" : "left" }}>
          {path}
        </p>
        <h2 className={`${display} home-h3 mt-2 font-bold text-ink`}>{title}</h2>
      </div>
      {link && (
        <Link href={link.href} className={`${display} group inline-flex items-center gap-2 text-[14.5px] font-semibold text-ink/80 hover:text-temper-text ${focus}`}>
          {link.label} <span aria-hidden className={nudge}>{arrow}</span>
        </Link>
      )}
    </div>
  );

  return (
    <div className="home bg-paper text-ink">
      <RevealController />
      <div aria-hidden className="scroll-progress" />

      {/* ============================ HERO ============================ */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 items-center gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <p className={`hero-in inline-flex items-center gap-3 border border-ink/15 bg-vellum-deep/80 px-3 py-1.5 ${mono} text-ink/80`} style={{ ["--d" as string]: "0ms" }}>
              <span aria-hidden className="pulse-dot" />
              {L("Dean · University of Palestine", "عميد · جامعة فلسطين")}
            </p>

            <h1 className="hero-in mt-7" style={{ ["--d" as string]: "80ms" }}>
              <span className={`${display} block text-[1.05rem] sm:text-xl font-medium text-nickel`}>{isAr ? "د.م." : "Dr. Eng."}</span>
              <span className={`${display} home-name mt-2 block text-ink`}>{isAr ? "علاء أبو زعيتر" : "Alaa A. AbuZaiter"}</span>
            </h1>

            <p className={`${text} hero-in mt-6 max-w-[38rem] text-[1.05rem] sm:text-[1.15rem] leading-[1.7] text-ink/75`} style={{ ["--d" as string]: "180ms" }}>
              {L(
                "Engineer and researcher in MEMS, shape-memory-alloy microactuators, microrobotics and control.",
                "مهندس وباحث في الأنظمة الكهروميكانيكية الدقيقة (MEMS) ومشغلات سبائك الذاكرة الشكلية والروبوتات الدقيقة والتحكم."
              )}
            </p>

            <ul className="hero-in mt-6 flex flex-wrap gap-2" style={{ ["--d" as string]: "260ms" }} aria-label={L("Fields", "المجالات")}>
              {FIELDS.map((f) => (
                <li key={f.en} className={`tag ${isAr ? "font-kufi" : "font-plexmono"}`}>
                  <span aria-hidden className="text-temper">#</span>
                  {f[locale]}
                </li>
              ))}
            </ul>

            <div className="hero-in mt-9 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "340ms" }}>
              <Link
                href={`/${locale}/publications`}
                className={`${display} group inline-flex items-center gap-3 bg-temper px-6 py-3.5 text-[15px] font-semibold text-vellum transition-colors hover:bg-temper-light active:translate-y-px ${focus}`}
              >
                {L("Publications", "المنشورات")}
                <span aria-hidden className={nudge}>{arrow}</span>
              </Link>
              <Link
                href={`/${locale}/cv`}
                className={`${display} inline-flex items-center gap-3 border border-ink/25 px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/60 hover:bg-ink/5 active:translate-y-px ${focus}`}
              >
                {dict.common.downloadCv}
              </Link>
              <Link href={`/${locale}/contact`} className={`${display} px-3 py-3 text-[15px] font-medium text-nickel transition-colors hover:text-ink ${focus}`}>
                {L("Contact", "تواصل")}
              </Link>
            </div>
          </div>

          {/* Photo */}
          <figure className="hero-in order-first mx-auto w-full max-w-[240px] sm:max-w-[300px] lg:order-none lg:max-w-[380px]" style={{ ["--d" as string]: "200ms" }}>
            <div className="tech-frame">
              <div className="relative aspect-[4/5] overflow-hidden border border-ink/15 bg-vellum-deep">
                <Image
                  src={assetPath(profileData.photo ?? "/portrait/alaa-abuzaiter.jpg")}
                  alt={profileData.photoAlt?.[locale] ?? L("Portrait of Dr. Eng. Alaa A. AbuZaiter", "صورة د.م. علاء أبو زعيتر")}
                  fill
                  priority
                  sizes="(min-width: 1024px) 380px, 90vw"
                  className="object-cover object-[50%_20%]"
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-vellum/70 to-transparent" />
              </div>
            </div>
            <figcaption className="mt-4 hidden items-center justify-between gap-3 font-plexmono sm:flex text-[11.5px] text-nickel" dir="ltr">
              <span>{L("Dr. Eng. Alaa A. AbuZaiter", "د.م. علاء أبو زعيتر")}</span>
              <span>{L("University of Palestine", "جامعة فلسطين")}</span>
            </figcaption>
          </figure>
        </div>

        {/* Quick facts */}
        <dl className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {facts.map((f) => (
            <div key={f.k} className="bg-vellum-deep px-5 py-5">
              <dt className={`${mono} text-nickel`}>{f.k}</dt>
              <dd className={`${display} mt-2 text-[15px] font-semibold leading-snug text-ink`}>
                {f.current && <span aria-hidden className="pulse-dot me-2 align-middle" />}
                {f.v}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ============================ FIGURES ============================ */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-8 pb-20 sm:pb-24">
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label={L("Key figures", "أرقام أساسية")}>
          {metrics.map((m, i) => (
            <li key={m.k} data-reveal style={{ ["--rd" as string]: `${i * 70}ms` }}>
              <Link href={`/${locale}${m.href}`} className={`panel group flex h-full flex-col justify-between gap-6 p-5 sm:p-6 ${focus}`}>
                <span className="font-archivo text-[2.6rem] sm:text-[3.2rem] font-bold leading-none tracking-[-0.03em] text-ink">
                  <CountUp to={m.n} />
                </span>
                <span className={`flex items-center justify-between gap-2 ${mono} text-nickel group-hover:text-temper-text`}>
                  {m.k}
                  <span aria-hidden className={nudge}>{arrow}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ============================ MAP ============================ */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-8 pb-20 sm:pb-24">
        <Head
          path="~/journey"
          title={L("Gaza, Palestine → Johor, Malaysia → Gaza, Palestine", "غزة، فلسطين ← جوهور، ماليزيا ← غزة، فلسطين")}
          link={{ href: `/${locale}/academic-journey`, label: L("Full journey", "المسيرة كاملة") }}
        />
        <div className="mt-8">
          <JourneyMap locale={locale} />
        </div>
      </section>

      {/* ============================ PAPERS ============================ */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-8 pb-20 sm:pb-24">
        <Head
          path="~/publications"
          title={L("Selected papers", "أبحاث مختارة")}
          link={{ href: `/${locale}/publications`, label: L(`All ${count.total} works`, `جميع الأعمال (${count.total})`) }}
        />
        <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {featured.map((pub, i) => (
            <li key={pub.id} className="panel flex flex-col p-5 sm:p-6" data-reveal style={{ ["--rd" as string]: `${i * 80}ms` }} dir="ltr" lang="en">
              <div className="flex items-center justify-between gap-3 font-plexmono text-[12px]">
                <span className="text-temper-text">{pub.year}</span>
                <span className="text-nickel">Journal article</span>
              </div>
              <h3 className="mt-4 font-archivo text-[1.08rem] font-semibold leading-snug text-ink">{pub.title}</h3>
              <p className="mt-3 font-plexmono text-[12px] leading-relaxed text-nickel">{pub.sourceName}</p>
              <div className="mt-auto pt-5">
                {pub.doi ? (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 font-plexmono text-[12px] text-anneal hover:text-anneal-light ${focus}`}
                  >
                    DOI <span aria-hidden>↗</span>
                    <span className="sr-only">{pub.doi} (external link)</span>
                  </a>
                ) : (
                  <span className="font-plexmono text-[12px] text-nickel">No DOI listed</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ============================ CONTACT ============================ */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-8 pb-24 sm:pb-28">
        <div className="panel flex flex-col gap-8 p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between" data-reveal>
          <div className="min-w-0">
            <p className="font-plexmono text-[12.5px] text-temper-text" dir="ltr" style={{ textAlign: isAr ? "right" : "left" }}>~/contact</p>
            <p className={`${display} mt-2 text-[1.2rem] font-semibold text-ink`}>
              {L("Research collaboration and academic correspondence", "للتعاون البحثي والمراسلات الأكاديمية")}
            </p>
            <a
              href={`mailto:${profileData.email}`}
              dir="ltr"
              className={`font-archivo home-email mt-4 inline-block break-all text-ink underline decoration-temper decoration-2 underline-offset-[8px] transition-colors hover:text-temper-text ${focus}`}
            >
              {profileData.email}
            </a>
          </div>
          <Link
            href={`/${locale}/contact`}
            className={`${display} group inline-flex shrink-0 items-center gap-3 self-start border border-ink/25 px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/60 hover:bg-ink/5 lg:self-auto ${focus}`}
          >
            {L("Contact page", "صفحة التواصل")} <span aria-hidden className={nudge}>{arrow}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
