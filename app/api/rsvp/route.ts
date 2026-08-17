import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { leggTilSvar, type Svar } from "@/lib/rsvp-lager";

export const runtime = "nodejs";

/** Klipper strenger så ingen kan sende inn en roman */
function tekst(verdi: unknown, maks: number): string {
  return typeof verdi === "string" ? verdi.trim().slice(0, maks) : "";
}

export async function POST(request: Request) {
  let kropp: Record<string, unknown>;

  try {
    kropp = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ feil: "Ugyldig forespørsel." }, { status: 400 });
  }

  const navn = tekst(kropp.navn, 120);
  const kommer = kropp.kommer === "ja" ? "ja" : kropp.kommer === "nei" ? "nei" : null;

  if (!navn) {
    return NextResponse.json({ feil: "Vi trenger navnet ditt." }, { status: 400 });
  }
  if (!kommer) {
    return NextResponse.json(
      { feil: "Gi beskjed om du kommer eller ikke." },
      { status: 400 },
    );
  }

  const antallRa = Number(kropp.antall);
  const antall =
    kommer === "ja" && Number.isFinite(antallRa)
      ? Math.min(Math.max(Math.trunc(antallRa), 1), 10)
      : 0;

  const svar: Svar = {
    id: randomUUID(),
    mottatt: new Date().toISOString(),
    navn,
    epost: tekst(kropp.epost, 160),
    telefon: tekst(kropp.telefon, 40),
    kommer,
    antall,
    folge: tekst(kropp.folge, 300),
    allergier: tekst(kropp.allergier, 500),
    melding: tekst(kropp.melding, 1000),
  };

  try {
    await leggTilSvar(svar);
  } catch (feil) {
    console.error("Klarte ikke lagre RSVP:", feil);
    return NextResponse.json(
      { feil: "Noe gikk galt hos oss. Prøv igjen, eller send en melding i stedet." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
