import { Inter, Lora } from "next/font/google";
import { bryllup } from "@/content/bryllup";

/** v10 — «Magasin». Redaksjonelt oppsett, anfang, tynne linjer, teglrød aksent. */

const display = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-v10-display",
  display: "swap",
});

const brodtekst = Inter({
  subsets: ["latin"],
  variable: "--font-v10-body",
  display: "swap",
});

export const metadata = {
  title: `${bryllup.par.brud} & ${bryllup.par.brudgom} — utkast 10`,
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen bg-[#fffdf8] text-[#1f1d1b] ${display.variable} ${brodtekst.variable}`}
      style={{ fontFamily: "var(--font-v10-body)" }}
    >
      {children}
    </div>
  );
}
