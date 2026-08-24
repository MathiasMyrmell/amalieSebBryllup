import { Outfit } from "next/font/google";
import { bryllup } from "@/content/bryllup";

/** v7 — «Nordisk lys». Én skrift, kald lys palett, mest luft. */

const sans = Outfit({ subsets: ["latin"], variable: "--font-v7", display: "swap" });

export const metadata = {
  title: `${bryllup.par.brud} & ${bryllup.par.brudgom} — utkast 7`,
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen bg-[#f5f8f9] text-[#2f3a3d] ${sans.variable}`}
      style={{ fontFamily: "var(--font-v7)" }}
    >
      {children}
    </div>
  );
}
