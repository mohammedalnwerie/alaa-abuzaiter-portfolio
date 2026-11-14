"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ar");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper text-ink p-6">
      <noscript>
        <meta httpEquiv="refresh" content="0; url=./ar" />
      </noscript>
      <div className="text-center">
        <p className="text-lg font-medium">جاري التحويل إلى الموقع...</p>
        <p className="mt-2 text-sm text-nickel">
          إذا لم يتم التحويل تلقائياً،{" "}
          <a href="./ar" className="text-temper underline">
            اضغط هنا
          </a>
        </p>
      </div>
    </div>
  );
}
