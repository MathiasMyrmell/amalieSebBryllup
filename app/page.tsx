import Bunn from "@/components/Bunn";
import Forside from "@/components/Forside";
import Galleri from "@/components/Galleri";
import Gaver from "@/components/Gaver";
import Kontakt from "@/components/Kontakt";
import Meny from "@/components/Meny";
import Portrett from "@/components/Portrett";
import Praktisk from "@/components/Praktisk";
import Program from "@/components/Program";
import Rsvp from "@/components/Rsvp";
import Steder from "@/components/Steder";
import { bryllup } from "@/content/bryllup";

/**
 * Første synlige seksjon får vanlig bakgrunn, deretter annenhver tonet.
 * Portrett teller ikke med (det er et bildebånd).
 */
function vekslendeToner(synlige: boolean[]) {
  let indeks = 0;
  return synlige.map((vis) => {
    if (!vis) return false;
    return indeks++ % 2 === 1;
  });
}

export default function Hjem() {
  const { seksjoner: s } = bryllup;
  const visRsvp = s.rsvp && bryllup.rsvp.apen;

  const [
    tonerProgram,
    tonerSted,
    tonerPraktisk,
    tonerGaver,
    tonerGalleri,
    tonerKontakt,
    tonerRsvp,
  ] = vekslendeToner([
    s.program,
    s.sted,
    s.praktisk,
    s.gaver,
    s.galleri,
    s.kontakt,
    visRsvp,
  ]);

  return (
    <>
      <Meny />
      <main>
        <Forside />
        {s.portrett && <Portrett />}
        {s.program && <Program toner={tonerProgram} />}
        {s.sted && <Steder toner={tonerSted} />}
        {s.praktisk && <Praktisk toner={tonerPraktisk} />}
        {s.gaver && <Gaver toner={tonerGaver} />}
        {s.galleri && <Galleri toner={tonerGalleri} />}
        {s.kontakt && <Kontakt toner={tonerKontakt} />}
        {visRsvp && <Rsvp toner={tonerRsvp} />}
      </main>
      <Bunn />
    </>
  );
}
