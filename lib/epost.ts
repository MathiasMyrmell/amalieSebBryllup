import nodemailer from "nodemailer";
import { bryllup } from "@/content/bryllup";
import { lagreEpost } from "./epost-lager";
import type { Svar } from "./rsvp-typer";

/**
 * Sender e-post om nye RSVP-svar:
 *   1. en bekreftelse til gjesten (hvis hen oppga en gyldig e-postadresse)
 *   2. en kopi til brudeparet, slik at dere får beskjed med en gang
 *
 * Bruker SMTP_HOST, SMTP_PORT, SMTP_USER og SMTP_PASS (settes under
 * Settings → Environment Variables på Vercel). Mangler de, hoppes utsendingen
 * over med en advarsel i loggen – svaret er uansett lagret i databasen.
 */

const GYLDIG_EPOST = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fjerner linjeskift, slik at ingenting kan snike seg inn i e-postheadere */
function enLinje(tekst: string): string {
  return tekst.replace(/[\r\n]+/g, " ").trim();
}

function oppsett() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const port = Number(SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL fra start, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  return { transporter, adresse: SMTP_USER };
}

function bekreftelsestekst(svar: Svar): string {
  const fornavn = svar.navn.split(/\s+/)[0];
  const { brud, brudgom } = bryllup.par;
  const signatur = `Hilsen\n${brud} og ${brudgom}`;

  if (svar.kommer === "nei") {
    return [
      `Hei ${fornavn}!`,
      "",
      "Takk for at du ga beskjed. Det er synd at du ikke kan være med, men vi setter pris på at du svarte.",
      "",
      "Skulle noe endre seg, er det bare å svare på denne e-posten.",
      "",
      signatur,
    ].join("\n");
  }

  const linjer = [
    `Hei ${fornavn}!`,
    "",
    "Takk for svaret! Vi har registrert at du kommer, og vi gleder oss til å feire sammen med deg.",
    "",
    `Dato: ${bryllup.datoTekst}`,
    `Sted: ${bryllup.sted}`,
    `Antall: ${svar.antall}`,
  ];
  if (svar.folge) linjer.push(`Følge: ${svar.folge}`);
  if (svar.allergier) linjer.push(`Allergier/matbehov: ${svar.allergier}`);
  linjer.push(
    "",
    "Trenger du å endre noe? Svar på denne e-posten.",
    "",
    signatur,
  );
  return linjer.join("\n");
}

function varseltekst(svar: Svar): string {
  return [
    `Navn: ${svar.navn}`,
    `Kommer: ${svar.kommer === "ja" ? `Ja (${svar.antall})` : "Nei"}`,
    `E-post: ${svar.epost || "–"}`,
    `Telefon: ${svar.telefon || "–"}`,
    `Følge: ${svar.folge || "–"}`,
    `Allergier: ${svar.allergier || "–"}`,
    `Hilsen: ${svar.melding || "–"}`,
    "",
    `Mottatt: ${svar.mottatt}`,
  ].join("\n");
}

/** Sender begge e-postene. Kaster aldri – feil logges bare. */
export async function sendRsvpEpost(svar: Svar): Promise<void> {
  const smtp = oppsett();
  if (!smtp) {
    console.warn("SMTP er ikke satt opp – hopper over e-post om RSVP.");
    return;
  }

  const { transporter, adresse } = smtp;
  const fra = `"${bryllup.par.brud} & ${bryllup.par.brudgom}" <${adresse}>`;
  const gjestKanFaaMail = GYLDIG_EPOST.test(svar.epost);

  const utsendinger: Promise<unknown>[] = [
    transporter.sendMail({
      from: fra,
      to: adresse,
      replyTo: gjestKanFaaMail ? svar.epost : undefined,
      subject: enLinje(
        `RSVP: ${svar.navn} – ${svar.kommer === "ja" ? `kommer (${svar.antall})` : "kommer ikke"}`,
      ),
      text: varseltekst(svar),
    }),
  ];

  if (gjestKanFaaMail) {
    const emne =
      svar.kommer === "ja" ? "Takk for svaret – vi gleder oss!" : "Takk for at du ga beskjed";
    const tekst = bekreftelsestekst(svar);

    utsendinger.push(
      transporter
        .sendMail({ from: fra, to: svar.epost, replyTo: adresse, subject: emne, text: tekst })
        // Bekreftelsen lagres på gjesten, så den vises i tråden på /admin
        .then((info) =>
          lagreEpost({
            id: info.messageId,
            adresse: svar.epost.trim().toLowerCase(),
            retning: "ut",
            fra: adresse,
            til: svar.epost,
            emne,
            tekst,
            tidspunkt: new Date().toISOString(),
          }),
        ),
    );
  }

  const resultat = await Promise.allSettled(utsendinger);
  for (const r of resultat) {
    if (r.status === "rejected") console.error("Klarte ikke sende RSVP-e-post:", r.reason);
  }
}
