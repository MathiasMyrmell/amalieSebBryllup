import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { harEpostLager, kjenteEpostIder, lagreEpost } from "./epost-lager";
import type { Svar } from "./rsvp-typer";

/**
 * Henter e-post fra postkassen (IMAP) og lagrer den på riktig gjest.
 *
 *   Innboks  → e-post FRA en gjest         (retning «inn»)
 *   Sendt    → e-post TIL en gjest         (retning «ut»), f.eks. svar du skrev i Mail-appen
 *
 * En e-post hører til en gjest når den andre parten har samme adresse som gjesten
 * oppga i RSVP-skjemaet. E-post fra og til andre adresser ignoreres, og lagres ikke.
 *
 * Bruker samme postkasse og passord som utsendingen (SMTP_USER / SMTP_PASS).
 * IMAP_HOST og IMAP_PORT kan settes om serveren er en annen enn SMTP_HOST.
 */

const GYLDIG_EPOST = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAGER_TILBAKE = 120;
const MAKS_NYE_PER_MAPPE = 100;
const MAKS_TEKST = 5000;

type Retning = "inn" | "ut";

/** Fjerner sitert tekst («> …») fra tidligere meldinger, så tråden ikke gjentar seg */
function rens(tekst: string): string {
  return tekst
    .split(/\r?\n/)
    .filter((linje) => !linje.trimStart().startsWith(">"))
    .join("\n")
    .trim()
    .slice(0, MAKS_TEKST);
}

export async function synkroniserEpost(
  alleSvar: Svar[],
): Promise<{ nye: number; feil?: string }> {
  if (!harEpostLager) return { nye: 0 };

  const { SMTP_HOST, SMTP_USER, SMTP_PASS, IMAP_HOST, IMAP_PORT } = process.env;
  const vert = IMAP_HOST || SMTP_HOST;
  if (!vert || !SMTP_USER || !SMTP_PASS) {
    return { nye: 0, feil: "E-postkontoen er ikke satt opp (SMTP_HOST, SMTP_USER, SMTP_PASS)." };
  }

  const egen = SMTP_USER.toLowerCase();
  const kjente = new Set(
    alleSvar.map((s) => s.epost.trim().toLowerCase()).filter((e) => GYLDIG_EPOST.test(e)),
  );
  if (kjente.size === 0) return { nye: 0 };

  // Ingen grunn til å lete lenger tilbake enn første svar (maks DAGER_TILBAKE dager)
  const eldste = Math.min(...alleSvar.map((s) => Date.parse(s.mottatt)));
  const dagMs = 24 * 60 * 60 * 1000;
  const siden = new Date(Math.max(eldste, Date.now() - DAGER_TILBAKE * dagMs) - dagMs);

  const allerede = await kjenteEpostIder();
  const klient = new ImapFlow({
    host: vert,
    port: Number(IMAP_PORT) || 993,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    logger: false,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  // Uten denne ville en nettverksfeil krasjet hele prosessen
  klient.on("error", () => {});

  let nye = 0;

  try {
    await klient.connect();

    const mapper = await klient.list();
    const sendt =
      mapper.find((m) => m.specialUse === "\\Sent")?.path ??
      mapper.find((m) => /^(inbox\.)?(sent|sendt)( items| mail)?$/i.test(m.path))?.path;

    const kilder: { sti: string; retning: Retning }[] = [{ sti: "INBOX", retning: "inn" }];
    if (sendt) kilder.push({ sti: sendt, retning: "ut" });

    for (const { sti, retning } of kilder) {
      const lås = await klient.getMailboxLock(sti);
      try {
        // Først bare konvoluttene (raskt). Selve innholdet hentes bare for e-post som
        // hører til en gjest og som vi ikke har fra før.
        const kandidater: { uid: number; id: string; adresse: string }[] = [];

        for await (const melding of klient.fetch({ since: siden }, { uid: true, envelope: true })) {
          const env = melding.envelope;
          if (!env) continue;

          const id = env.messageId || `${sti}:${melding.uid}@lokal`;
          if (allerede.has(id)) continue;

          const fra = env.from?.[0]?.address?.toLowerCase() ?? "";
          const til = [...(env.to ?? []), ...(env.cc ?? [])].map(
            (a) => a.address?.toLowerCase() ?? "",
          );

          const adresse =
            retning === "inn"
              ? kjente.has(fra) && fra !== egen
                ? fra
                : ""
              : (til.find((a) => kjente.has(a) && a !== egen) ?? "");

          if (adresse) kandidater.push({ uid: melding.uid, id, adresse });
        }

        for (const kandidat of kandidater.slice(0, MAKS_NYE_PER_MAPPE)) {
          const full = await klient.fetchOne(String(kandidat.uid), { source: true }, { uid: true });
          if (!full || !full.source) continue;

          const post = await simpleParser(full.source);
          const til = Array.isArray(post.to)
            ? post.to.map((t) => t.text).join(", ")
            : (post.to?.text ?? "");

          await lagreEpost({
            id: kandidat.id,
            adresse: kandidat.adresse,
            retning,
            fra: post.from?.text ?? "",
            til,
            emne: post.subject ?? "",
            tekst: rens(post.text ?? ""),
            tidspunkt: (post.date ?? new Date()).toISOString(),
          });
          nye++;
        }
      } finally {
        lås.release();
      }
    }

    return { nye };
  } catch (feil) {
    return { nye, feil: feil instanceof Error ? feil.message : String(feil) };
  } finally {
    await klient.logout().catch(() => klient.close());
  }
}
