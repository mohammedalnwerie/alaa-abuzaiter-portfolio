import React from "react";
import Link from "next/link";
import { Locale, LocalizedString } from "@/content/types";

// V4 "Shape Memory" — hidden scaffold pages (/community, /media).
// Not linked from the site and marked noindex. They state that nothing is published
// yet and list the details required before an entry can appear (PROJECT_BRIEF.md §12).

interface PendingSectionProps {
  locale: Locale;
  kicker: LocalizedString;
  title: LocalizedString;
  reason: LocalizedString;
  fields: LocalizedString[];
}

export function PendingSection({ locale, kicker, title, reason, fields }: PendingSectionProps) {
  const isAr = locale === "ar";
  const L = (en: string, ar: string) => (isAr ? ar : en);
  const display = isAr ? "font-kufi" : "font-archivo";
  const prose = isAr ? "font-plexarabic" : "font-plexsans";
  const label = isAr
    ? "font-kufi text-[13px] font-medium"
    : "font-plexmono text-[12.5px] font-medium tracking-[0.01em]";
  const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-temper";
  const arrow = isAr ? "←" : "→";

  return (
    <div className="bg-paper text-ink">
      <header className="border-b border-ink/15">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 items-end">
          <div className="lg:col-span-7">
            <p className={`${label} text-temper-text flex items-center gap-3`}>
              <span aria-hidden className="h-px w-8 bg-temper" />
              {kicker[locale]}
            </p>
            <h1 className={`${display} home-h2 mt-6 font-bold`}>{title[locale]}</h1>
          </div>
          <p className={`${prose} lg:col-span-5 text-[1.15rem] sm:text-[1.25rem] leading-[1.6] text-ink/85`}>{reason[locale]}</p>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8">
        <div className="lg:col-span-4">
          <h2 className={`${display} home-h3 font-bold`}>{L("Before anything is published", "قبل نشر أي بند")}</h2>
          <p className={`mt-4 text-[14.5px] leading-relaxed text-nickel ${isAr ? "font-kufi" : ""}`}>
            {L(
              "Each entry needs these details, a source, and approval from Dr. AbuZaiter. People named or shown need to consent.",
              "يحتاج كل بند إلى هذه التفاصيل ومصدر وموافقة الدكتور أبو زعيتر، وموافقة الأشخاص المذكورين أو الظاهرين."
            )}
          </p>
        </div>
        <div className="lg:col-span-8 border border-dashed border-temper/70 p-6 sm:p-8">
          <ol className="space-y-0">
            {fields.map((f) => (
              <li key={f.en} className={`${display} border-b border-ink/10 py-3 text-[15.5px] last:border-b-0`}>
                {f[locale]}
              </li>
            ))}
          </ol>
          <p className={`mt-6 ${display} text-[15px] text-temper-text`}>{L("Nothing listed yet", "لا بنود منشورة بعد")}</p>
        </div>

        <div className="lg:col-span-12 flex flex-wrap gap-x-8 gap-y-3 pt-8">
          <Link href={`/${locale}`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {L("Home", "الرئيسية")} <span aria-hidden>{arrow}</span>
          </Link>
          <Link href={`/${locale}/contact`} className={`${display} ${focus} text-[15px] font-semibold underline decoration-temper decoration-2 underline-offset-[6px]`}>
            {L("Contact", "التواصل")} <span aria-hidden>{arrow}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
