import { Poppins } from "next/font/google";
import { bryllup } from "@/content/bryllup";

/** v9 — «Retro». Sennep, rust og krem. Runde former og fete typer. */

const sans = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-v9",
  display: "swap",
});

export const metadata = {
  title: `${bryllup.par.brud} & ${bryllup.par.brudgom} — utkast 9`,
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen bg-[#fdf0dc] text-[#42301f] ${sans.variable}`}
      style={{ fontFamily: "var(--font-v9)" }}
    >
      {children}
    </div>
  );
}
