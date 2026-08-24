import { Libre_Baskerville } from "next/font/google";
import { bryllup } from "@/content/bryllup";

/** v6 — «Papir». Som en trykt invitasjon: doble rammer, kapiteler, vignetter. */

const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-v6",
  display: "swap",
});

export const metadata = {
  title: `${bryllup.par.brud} & ${bryllup.par.brudgom} — utkast 6`,
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen bg-[#f7f4ec] text-[#3b3730] ${serif.variable}`}
      style={{ fontFamily: "var(--font-v6)" }}
    >
      {children}
    </div>
  );
}
