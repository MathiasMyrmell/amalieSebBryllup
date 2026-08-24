import { Fraunces, Nunito_Sans } from "next/font/google";
import { bryllup } from "@/content/bryllup";

/** v8 — «Botanisk». Grønt og krem, bladranker, myke former. */

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-v8-display",
  display: "swap",
});

const brodtekst = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-v8-body",
  display: "swap",
});

export const metadata = {
  title: `${bryllup.par.brud} & ${bryllup.par.brudgom} — utkast 8`,
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen bg-[#f6f7f0] text-[#2f3a2c] ${display.variable} ${brodtekst.variable}`}
      style={{ fontFamily: "var(--font-v8-body)" }}
    >
      {children}
    </div>
  );
}
