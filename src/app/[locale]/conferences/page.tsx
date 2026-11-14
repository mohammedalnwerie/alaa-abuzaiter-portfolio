import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { RevealController } from "@/components/home/RevealController";
import Link from "next/link";
import { Locale } from "@/content/types";
import { publicationsData } from "@/content/publications";
import { getDictionary } from "@/content/translations";
import type { Metadata } from "next";

// V6 "Dark Technical" — conference papers (docs/DESIGN_DIRECTION.md).
// Papers in proceedings only. Venues are labelled as where the conference was held;
// nothing here implies attendance, presentation or committee roles (CONTENT_AUDIT.md §6).
// Deliberately no venue map: a travel map would suggest attendance.

export const metadata: Metadata = {
  title: "Conference Proceedings & Academic Symposia — Dr. Eng. Alaa AbuZaiter",
  description: "Peer-reviewed conference papers published in international IEEE and Elsevier proceedings by Dr. Eng. Alaa AbuZaiter.",
};

interface ConferencesPageProps {
  params: Promise<{ locale: string }>;
}

// "…(ISMS 2014)" → "ISMS"
const acronymOf = (sourceName: string) => {
  const m = sourceName.match(/\(([^()]+?)\s*\d{4}\)\s*$/);
  return m ? m[1].trim() : sourceName.split(" ").slice(0, 2).join(" ");
};
// strip the trailing "(ACRONYM YEAR)"
const fullNameOf = (sourceName: string) => sourceName.replace(/\s*\([^()]*\d{4}\)\s*$/, "");

// Attendance confirmed by a photograph in the gallery (Dr. AbuZaiter at the venue).
// Presenting / chairing is NOT inferred from a group photo.
const ATTENDED: Record<string, string> = { "c-2014-isms": "isms-2014-langkawi" };

export default async function ConferencesPage({ params }: ConferencesPageProps) {
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

  const papers = publicationsData
    .filter((p) => p.type === "conference")
    .sort((a, b) => a.year - b.year)
    .map((p) => {
      const pos = p.authors.findIndex((a) => a.includes("AbuZaiter")) + 1;
      return { ...p, acronym: acronymOf(p.sourceName), fullName: fullNameOf(p.sourceName), pos };
    });

  const years = papers.map((p) => p.year);
  const publishers = Array.from(new Set(papers.map((p) => p.publisher).filter(Boolean)));
  const n = papers.length;
  const numberWord = isAr
    ? ({ 1: "ورقة واحدة", 2: "ورقتان", 3: "ثلاث أوراق", 4: "أربع أوراق", 5: "خمس أوراق", 6: "ست أوراق", 7: "سبع أوراق" } as Record<number, string>)[n] ?? `${n} أوراق`
    : ({ 1: "One paper", 2: "Two papers", 3: "Three papers", 4: "Four papers", 5: "Five papers", 6: "Six papers", 7: "Seven papers" } as Record<number, string>)[n] ?? `${n} papers`;

  const authorPos = (pos: number, total: number) =>
    isAr ? `المؤلف ${pos} من ${total}` : `Author ${pos} of ${total}`;

  return (
    <div className="bg-paper text-ink">
      <RevealController />
      {/* ================= Header ================= */}
      <PageHeader
        locale={locale}
        path="conferences"
        title={L("Conference papers", "أوراق المؤتمرات")}
        lede={L("Six peer-reviewed papers, 2014–2021. A listed paper does not by itself mean he attended.", "ست أوراق محكّمة، 2014–2021. ورود الورقة لا يعني بحد ذاته أنه حضر المؤتمر.")}
      />

      {/* ================= Index — one tag per paper ================= */}
      <nav className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-10" aria-label={L("Papers", "الأوراق")}>
        <ol className="flex flex-wrap gap-2">
          {papers.map((p) => (
            <li key={p.id}>
              <a href={`#${p.id}`} className={`${focus} tag font-plexmono transition-colors hover:border-temper hover:text-temper-text`} dir="ltr">
                <span className="font-semibold text-ink">{p.acronym}</span>
                <span className="text-nickel">{p.year}</span>
                <span className="text-nickel/70">{p.publisher}</span>
                <span className="sr-only">{` — ${p.title}`}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ================= Papers ================= */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pb-20">
        <ol className="space-y-4 pt-4">
          {papers.map((p) => (
            <li
              key={p.id}
              id={p.id}
              className="panel scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 p-5 sm:p-8" data-reveal
            >
              <div className="lg:col-span-4">
                <p className="font-archivo text-[2.2rem] sm:text-[2.6rem] font-bold leading-none" dir="ltr" style={{ textAlign: isAr ? "right" : "left" }}>
                  {p.acronym}
                  <span className="ms-3 font-plexmono text-[1rem] font-normal text-temper-text">{p.year}</span>
                </p>
                <dl className="mt-6 space-y-3 text-[14px]">
                  {p.location && (
                    <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                      <dt className={`${label} text-nickel pt-[2px]`}>{L("Venue", "مكان الانعقاد")}</dt>
                      <dd className="text-ink" dir="ltr" lang="en" style={{ textAlign: isAr ? "right" : "left" }}>{p.location}</dd>
                    </div>
                  )}
                  <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                    <dt className={`${label} text-nickel pt-[2px]`}>{L("Publisher", "الناشر")}</dt>
                    <dd className="text-ink">{p.publisher}</dd>
                  </div>
                  <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                    <dt className={`${label} text-nickel pt-[2px]`}>{L("Authorship", "التأليف")}</dt>
                    <dd className={`text-ink ${isAr ? "font-kufi" : ""}`}>{authorPos(p.pos, p.authors.length)}</dd>
                  </div>
                </dl>
              </div>

              <div className="lg:col-span-8">
                <div dir="ltr" lang="en" className="text-left">
                  <h2 className="font-plexsans text-[1.35rem] sm:text-[1.6rem] leading-[1.3] text-ink">{p.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-nickel">
                    {p.authors.map((a, i) => (
                      <React.Fragment key={a}>
                        {a.includes("AbuZaiter") ? <strong className="font-semibold text-ink">{a}</strong> : a}
                        {i < p.authors.length - 1 ? ", " : ""}
                      </React.Fragment>
                    ))}
                  </p>
                  <p className="mt-2 font-plexsans italic text-[16px] text-ink/85">{p.fullName}</p>
                  {p.pages && (
                    <p className="mt-1 font-plexmono text-[12.5px] text-nickel">
                      {/[–-]/.test(p.pages) ? `pp. ${p.pages}` : `p. ${p.pages}`}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px]">
                  {p.doi ? (
                    <a
                      href={`https://doi.org/${p.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className={`${focus} font-plexmono break-all text-anneal underline decoration-anneal/30 underline-offset-4 hover:decoration-anneal`}
                    >
                      doi:{p.doi} <span aria-hidden>↗</span>
                      <span className="sr-only">{L(" (opens the publisher's record)", " (يفتح سجل الناشر)")}</span>
                    </a>
                  ) : (
                    <span className={`text-nickel ${isAr ? "font-kufi" : ""}`}>{L("No DOI listed", "لا يوجد معرّف DOI")}</span>
                  )}
                  {p.publisherUrl && (
                    <a href={p.publisherUrl} target="_blank" rel="noopener noreferrer" className={`${display} ${focus} text-nickel hover:text-ink`}>
                      {dict.publications.publisherLink} <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
                {p.statusNote && (
                  <p className={`mt-4 text-[13.5px] text-nickel ${isAr ? "font-kufi" : ""}`}>{p.statusNote[locale]}</p>
                )}
                {ATTENDED[p.id] && (
                  <p className={`mt-3 inline-flex flex-wrap items-center gap-2 text-[13.5px] ${isAr ? "font-kufi" : ""}`}>
                    <span className="inline-flex items-center gap-1.5 text-temper-text">
                      <span aria-hidden className="h-2 w-2 rounded-full bg-temper" />
                      {L("Attended — documented by a photograph at the conference", "حضره — موثّق بصورة من المؤتمر")}
                    </span>
                    <Link href={`/${locale}/gallery`} className={`${focus} font-semibold text-ink underline decoration-temper decoration-2 underline-offset-4`}>
                      {L("see the photo", "انظر الصورة")} <span aria-hidden>{arrow}</span>
                    </Link>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* Not yet documented */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6" aria-labelledby="events-title">
          <div className="lg:col-span-4">
            <p className={`${label} text-nickel`}>{L("Attendance, talks and committees", "الحضور والمحاضرات واللجان")}</p>
          </div>
          <div className="lg:col-span-8 border border-dashed border-temper/70 p-6 sm:p-8">
            <h2 id="events-title" className={`${display} text-[1.25rem] sm:text-[1.4rem] font-bold leading-snug`}>
              {L("Not yet documented", "لم تُوثّق بعد")}
            </h2>
            <p className={`${prose} mt-3 text-[1.05rem] leading-[1.7] text-ink/80`}>
              {L(
                "His attendance at ISMS 2014 is documented by a photograph (above). For the other papers, the CV does not state whether he attended, presented, chaired a session or served on a committee; those roles will be added once confirmed with supporting documents.",
                "حضوره مؤتمر ISMS 2014 موثّق بصورة (بالأعلى). أما باقي الأوراق فلا تبيّن السيرة الذاتية الحضور أو الإلقاء أو رئاسة الجلسات أو عضوية اللجان، وتُضاف هذه الأدوار بعد تأكيدها بوثائق داعمة."
              )}
            </p>
          </div>
        </section>

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
          <Link href={`/${locale}/publications`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {L(`All ${publicationsData.length} publications`, `جميع المنشورات (${publicationsData.length})`)} <span aria-hidden>{arrow}</span>
          </Link>
          <Link href={`/${locale}/research`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {L("Research areas", "مجالات البحث")} <span aria-hidden>{arrow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
