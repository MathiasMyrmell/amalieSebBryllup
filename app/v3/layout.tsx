import { Lato, Playfair_Display } from "next/font/google";
import { bryllup } from "@/content/bryllup";

/** v3 — «Blomstereng». Lys rosa, mye pynt, kursiv display. */

const display = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-v3-display",
  display: "swap",
});

const brodtekst = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-v3-body",
  display: "swap",
});

export const metadata = {
  title: `${bryllup.par.brud} & ${bryllup.par.brudgom} — utkast 3`,
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen bg-[#fdf6f4] text-[#4a3b3c] ${display.variable} ${brodtekst.variable}`}
      style={{ fontFamily: "var(--font-v3-body)" }}
    >
      {children}
    </div>
  );
}
