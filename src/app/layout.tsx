import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Dr. Eng. Alaa AbuZaiter",
    default: "Dr. Eng. Alaa AbuZaiter | Academic Portfolio & Research",
  },
  description: "Official academic and research portfolio of Dr. Eng. Alaa A. AbuZaiter, Dean of Software Engineering and Artificial Intelligence at University of Palestine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} ${ibmPlexArabic.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
