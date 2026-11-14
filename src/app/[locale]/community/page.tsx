import React from "react";
import { Locale } from "@/content/types";
import { PendingSection } from "@/components/common/PendingSection";
import type { Metadata } from "next";

// Hidden scaffold: no volunteering is documented in CV 2026 (CONTENT_AUDIT.md §10).
// Not linked anywhere; keep `robots: noindex` until real, approved entries exist.

export const metadata: Metadata = {
  title: "Community Engagement & Volunteering (Pending)",
  description: "Community initiatives and civic engagement framework.",
  robots: {
    index: false,
    follow: false,
  },
};

interface CommunityPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale === "en" ? "en" : "ar") as Locale;

  return (
    <PendingSection
      locale={locale}
      kicker={{ en: "Community engagement", ar: "العمل المجتمعي" }}
      title={{ en: "Community work and volunteering.", ar: "العمل المجتمعي والتطوعي." }}
      reason={{
        en: "The CV does not list any volunteering or community work, so nothing is shown here. This page is not linked from the site.",
        ar: "لا تذكر السيرة الذاتية أي عمل تطوعي أو مجتمعي، لذلك لا يُعرض شيء هنا. هذه الصفحة غير مرتبطة بقوائم الموقع.",
      }}
      fields={[
        { en: "Initiative or organisation", ar: "المبادرة أو المؤسسة" },
        { en: "His role", ar: "دوره" },
        { en: "Period", ar: "الفترة" },
        { en: "Place", ar: "المكان" },
        { en: "What he contributed", ar: "طبيعة المساهمة" },
        { en: "Impact that can be shown", ar: "الأثر القابل للإثبات" },
        { en: "Link or photo, with permission", ar: "رابط أو صورة بموافقة أصحابها" },
      ]}
    />
  );
}
