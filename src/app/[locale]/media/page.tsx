import React from "react";
import { Locale } from "@/content/types";
import { PendingSection } from "@/components/common/PendingSection";
import type { Metadata } from "next";

// Hidden scaffold: no talks, interviews or media are documented in CV 2026 (CONTENT_AUDIT.md §10).
// Not linked anywhere; keep `robots: noindex` until real, approved entries exist.

export const metadata: Metadata = {
  title: "News & Media (Pending)",
  description: "Academic talks, public lectures, and media features.",
  robots: {
    index: false,
    follow: false,
  },
};

interface MediaPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MediaPage({ params }: MediaPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;

  return (
    <PendingSection
      locale={locale}
      kicker={{ en: "News, talks and media", ar: "الأخبار والمحاضرات والإعلام" }}
      title={{ en: "Talks, interviews and news.", ar: "المحاضرات والمقابلات والأخبار." }}
      reason={{
        en: "The CV does not list public talks, interviews or media appearances, so nothing is shown here. This page is not linked from the site.",
        ar: "لا تذكر السيرة الذاتية محاضرات عامة أو مقابلات أو ظهوراً إعلامياً، لذلك لا يُعرض شيء هنا. هذه الصفحة غير مرتبطة بقوائم الموقع.",
      }}
      fields={[
        { en: "Title of the talk, interview or article", ar: "عنوان المحاضرة أو المقابلة أو المقال" },
        { en: "Type (lecture, seminar, interview, news)", ar: "النوع (محاضرة، ندوة، مقابلة، خبر)" },
        { en: "Date", ar: "التاريخ" },
        { en: "Host or publisher", ar: "الجهة المنظمة أو الناشرة" },
        { en: "Link to the original source", ar: "رابط المصدر الأصلي" },
        { en: "Approved photo or recording, if any", ar: "صورة أو تسجيل معتمد إن وُجد" },
      ]}
    />
  );
}
