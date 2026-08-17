import Bunn from "@/components/Bunn";
import Forside from "@/components/Forside";
import Galleri from "@/components/Galleri";
import Gaver from "@/components/Gaver";
import Kontakt from "@/components/Kontakt";
import Meny from "@/components/Meny";
import Praktisk from "@/components/Praktisk";
import Program from "@/components/Program";
import Rsvp from "@/components/Rsvp";
import Steder from "@/components/Steder";

export default function Hjem() {
  return (
    <>
      <Meny />
      <main>
        <Forside />
        <Program />
        <Steder />
        <Praktisk />
        <Gaver />
        <Galleri />
        <Kontakt />
        <Rsvp />
      </main>
      <Bunn />
    </>
  );
}
