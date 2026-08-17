import type { Metadata } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import { bryllup } from "@/content/bryllup";
import "./globals.css";

const serifDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif-display",
  display: "swap",
});

const sansBody = Karla({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: bryllup.par.tittel,
  description: `${bryllup.par.brud} og ${bryllup.par.brudgom} gifter seg ${bryllup.datoTekst}.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nb" className={`${serifDisplay.variable} ${sansBody.variable}`}>
      <body>{children}</body>
    </html>
  );
}
