import { Inter, Space_Grotesk } from "next/font/google";
import { bryllup } from "@/content/bryllup";

/**
 * Alternativ utforming av siden, på /v2.
 *
 * Samme innhold som forsiden – alt hentes fra content/bryllup.ts – men mørk
 * bakgrunn, grotesk skrift og et stramt, venstrestilt oppsett i stedet for det
 * lyse og midtstilte. Ment for å sammenligne to retninger.
 */

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-v2-display",
  display: "swap",
});

const brodtekst = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-v2-body",
  display: "swap",
});

export const metadata = {
  title: `${bryllup.par.brud} & ${bryllup.par.brudgom} — utkast 2`,
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`tema-v2 min-h-screen bg-natt font-brodtekst text-elfenben ${display.variable} ${brodtekst.variable}`}
    >
      {children}
    </div>
  );
}
