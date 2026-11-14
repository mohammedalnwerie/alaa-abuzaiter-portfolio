import React from "react";
import Link from "next/link";
import { Locale } from "@/content/types";
import { profileData } from "@/content/profile";
import { getDictionary } from "@/content/translations";
import type { Metadata } from "next";

// V6 "Dark Technical" — contact (docs/DESIGN_DIRECTION.md).
// Institutional email only (no form, no tracking). Topics are limited to what the CV supports.
// The email's public use is marked "needs confirmation" in CONTENT_AUDIT.md, and the page says so.

export const metadata: Metadata = {
  title: "Academic Contact & Inquiries",
  description: "Contact Dr. Eng. Alaa AbuZaiter for research collaboration, student project supervision and faculty matters.",
};

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
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
  const email = profileData.email;
  const mailto = (subject: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  const topics = [
    {
      k: L("Research collaboration", "التعاون البحثي"),
      d: L(
        "MEMS, shape-memory-alloy microactuators, micro-positioning, mechatronics and control.",
        "الأنظمة الكهروميكانيكية الدقيقة، ومشغلات سبائك الذاكرة الشكلية، وتحديد المواقع الدقيق، والميكاترونكس والتحكم."
      ),
      subject: L("Research collaboration", "تعاون بحثي"),
      href: `/${locale}/research`,
      more: L("Research areas", "مجالات البحث"),
    },
    {
      k: L("Student projects", "مشاريع الطلبة"),
      d: L(
        "Graduation projects and student research in engineering.",
        "مشاريع التخرج والبحث العلمي للطلبة في الهندسة."
      ),
      subject: L("Student project", "مشروع طلابي"),
      href: `/${locale}/teaching`,
      more: dict.nav.courses,
    },
    {
      k: L("Faculty matters", "شؤون الكلية"),
      d: L(
        "The Faculty of Software Engineering and Artificial Intelligence at the University of Palestine, where he is dean.",
        "كلية هندسة البرمجيات والذكاء الاصطناعي في جامعة فلسطين، التي يشغل منصب عميدها."
      ),
      subject: L("Faculty of Software Engineering and AI", "كلية هندسة البرمجيات والذكاء الاصطناعي"),
      href: `/${locale}/leadership`,
      more: dict.nav.leadership,
    },
  ];

  return (
    <div className="bg-paper text-ink">
      {/* ================= Header: the address is the headline ================= */}
      <header className="border-b border-ink/10">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-12 sm:pt-20 pb-14 sm:pb-20">
          <p className="flex items-center gap-1 font-plexmono text-[12.5px] text-temper-text" dir="ltr" style={{ justifyContent: isAr ? "flex-end" : "flex-start" }}><span className="text-nickel">~/</span>contact</p>
          <h1 className={`${display} mt-6 max-w-3xl text-[1.35rem] sm:text-[1.6rem] font-semibold leading-snug text-ink/80`}>
            {L("Write to Dr. AbuZaiter at his institutional address.", "راسل الدكتور أبو زعيتر على بريده المؤسسي.")}
          </h1>
          <a
            href={`mailto:${email}`}
            dir="ltr"
            className={`${focus} mt-6 inline-block break-all font-archivo font-bold leading-[0.95] tracking-tight text-ink underline decoration-temper decoration-[4px] underline-offset-[14px] hover:text-temper-text`}
            style={{ fontSize: "clamp(2rem, 6vw, 4.4rem)", fontVariationSettings: '"wdth" 92' }}
          >
            {email}
          </a>
          <p className={`mt-8 text-[14.5px] leading-relaxed text-nickel ${isAr ? "font-kufi" : ""}`}>
            {L(
              "His official academic email at the University of Palestine.",
              "البريد الأكاديمي الرسمي للدكتور في جامعة فلسطين."
            )}
          </p>
        </div>
      </header>

      {/* ================= Topics + details ================= */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-14">
        <section className="lg:col-span-8" aria-labelledby="topics-title">
          <h2 id="topics-title" className={`${label} text-nickel`}>{L("Start an email about", "ابدأ رسالة بخصوص")}</h2>
          <ol className="mt-5 space-y-3">
            {topics.map((t) => (
              <li key={t.k} className="panel grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-x-8 gap-y-3 p-5 sm:p-6">
                <div>
                  <h3 className={`${display} text-[1.3rem] sm:text-[1.5rem] font-bold leading-snug`}>{t.k}</h3>
                  <p className={`${prose} mt-2 text-[1.05rem] leading-[1.65] text-ink/80`}>{t.d}</p>
                  <Link href={t.href} className={`${display} ${focus} mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-nickel underline decoration-ink/20 underline-offset-4 hover:text-ink`}>
                    {t.more} <span aria-hidden>{arrow}</span>
                  </Link>
                </div>
                <a
                  href={mailto(t.subject)}
                  className={`${display} ${focus} inline-flex h-fit min-h-[48px] items-center gap-3 self-center bg-ink px-5 text-[14.5px] font-semibold text-vellum transition-colors hover:bg-ink-soft`}
                >
                  {L("Write", "اكتب")}
                  <span aria-hidden className="text-temper-light">{arrow}</span>
                  <span className="sr-only">{L(` an email with the subject “${t.subject}”`, ` رسالة بعنوان «${t.subject}»`)}</span>
                </a>
              </li>
            ))}
          </ol>
          <p className={`mt-5 text-[13.5px] text-nickel ${isAr ? "font-kufi" : ""}`}>
            {L("Each button opens your email app with the subject filled in.", "يفتح كل زر تطبيق البريد لديك مع تعبئة عنوان الرسالة.")}
          </p>
        </section>

        <aside className="panel lg:col-span-4 space-y-8 self-start p-5 sm:p-6">
          <div>
            <h2 className={`${label} text-nickel`}>{L("Institution", "المؤسسة")}</h2>
            <address className="mt-4 not-italic">
              <p className={`${display} text-[16px] font-semibold leading-snug`}>{profileData.affiliationFaculty[locale]}</p>
              <p className={`${display} mt-1 text-[15px] text-ink/80`}>{profileData.affiliationUniversity[locale]}</p>
              <p className={`${display} text-[15px] text-ink/80`}>{profileData.location[locale]}</p>
            </address>
          </div>
          <div>
            <h2 className={`${label} text-nickel`}>{L("Languages", "اللغات")}</h2>
            <p className={`mt-4 text-[15px] leading-relaxed text-ink/85 ${isAr ? "font-kufi" : ""}`}>
              {L("You can write in Arabic or English.", "يمكنك المراسلة بالعربية أو الإنجليزية.")}
            </p>
          </div>
          <div>
            <h2 className={`${label} text-nickel`}>{L("Scholarly profiles", "الحسابات الأكاديمية")}</h2>
            <p className={`mt-4 text-[14.5px] leading-relaxed text-ink/70 ${isAr ? "font-kufi" : ""}`}>
              <span className="border-b border-dashed border-temper/70">
                {isAr ? (
                  <>
                    تُضاف روابط <bdi dir="ltr">Google Scholar</bdi> و<bdi dir="ltr">ORCID</bdi> و<bdi dir="ltr">ResearchGate</bdi> بعد تأكيدها.
                  </>
                ) : (
                  "Google Scholar, ORCID and ResearchGate links will be added once confirmed."
                )}
              </span>
            </p>
          </div>
          <div>
            <h2 className={`${label} text-nickel`}>{L("Privacy", "الخصوصية")}</h2>
            <p className={`mt-4 text-[14.5px] leading-relaxed text-nickel ${isAr ? "font-kufi" : ""}`}>
              {L(
                "This site has no contact form and does not collect or track visitor data.",
                "لا يحتوي هذا الموقع على نموذج تواصل، ولا يجمع بيانات الزوار أو يتتبعها."
              )}
            </p>
          </div>
          <Link href={`/${locale}/cv`} className={`${display} ${focus} inline-flex items-center gap-2 text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {dict.nav.cv} <span aria-hidden>{arrow}</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
