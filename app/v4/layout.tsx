import { Inter } from "next/font/google";
import { bryllup } from "@/content/bryllup";

/** v4 — «Sveitsisk». Hvitt, stramt rutenett, ingen pynt. */

const sans = Inter({ subsets: ["latin"], variable: "--font-v4", display: "swap" });

export const metadata = {
  title: `${bryllup.par.brud} & ${bryllup.par.brudgom} — utkast 4`,
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen bg-white text-[#111111] ${sans.variable}`}
      style={{ fontFamily: "var(--font-v4)" }}
    >
      {children}
    </div>
  );
}
