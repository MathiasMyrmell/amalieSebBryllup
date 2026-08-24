import { DM_Serif_Display, Work_Sans } from "next/font/google";
import { bryllup } from "@/content/bryllup";

/** v5 — «Riviera». Terrakotta, oliven og sand. Buer og striper. */

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-v5-display",
  display: "swap",
});

const brodtekst = Work_Sans({
  subsets: ["latin"],
  variable: "--font-v5-body",
  display: "swap",
});

export const metadata = {
  title: `${bryllup.par.brud} & ${bryllup.par.brudgom} — utkast 5`,
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen bg-[#fbf3e8] text-[#40342a] ${display.variable} ${brodtekst.variable}`}
      style={{ fontFamily: "var(--font-v5-body)" }}
    >
      {children}
    </div>
  );
}
