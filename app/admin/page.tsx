import { erInnlogget } from "@/lib/admin-tilgang";
import { lesSvar } from "@/lib/rsvp-lager";
import Innlogging from "./Innlogging";
import { loggUtHandling } from "./handlinger";

/**
 * Oversikt over innkomne RSVP-svar.
 *
 * Åpnes på /admin. Er du ikke logget inn, møter du kodefeltet først.
 * Koden settes i .env.local (ADMIN_KODE) – se README.
 */
export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

export default async function Admin() {
  if (!(await erInnlogget())) {
    return (
      <Ramme>
        <Innlogging />
      </Ramme>
    );
  }

  const svar = await lesSvar();
  const kommer = svar.filter((s) => s.kommer === "ja");
  const antallGjester = kommer.reduce((sum, s) => sum + (s.antall || 1), 0);

  return (
    <Ramme>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-display text-4xl font-light">RSVP-svar</h1>
        <form action={loggUtHandling}>
          <button
            type="submit"
            className="text-sm text-dempet underline-offset-4 transition-colors hover:text-salvie-dyp hover:underline"
          >
            Logg ut
          </button>
        </form>
      </div>

      <div className="my-8 flex gap-10 border-y border-kant py-5 text-sm">
        <Tall verdi={svar.length} etikett="svar totalt" />
        <Tall verdi={antallGjester} etikett="gjester kommer" />
        <Tall verdi={svar.length - kommer.length} etikett="kan ikke" />
      </div>

      {svar.length === 0 ? (
        <p className="text-dempet">Ingen svar ennå.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-kant text-xs uppercase tracking-wider text-dempet">
                <th className="py-3 pr-4">Navn</th>
                <th className="py-3 pr-4">Svar</th>
                <th className="py-3 pr-4">Ant.</th>
                <th className="py-3 pr-4">Følge</th>
                <th className="py-3 pr-4">Allergier</th>
                <th className="py-3 pr-4">Kontakt</th>
                <th className="py-3 pr-4">Hilsen</th>
                <th className="py-3">Mottatt</th>
              </tr>
            </thead>
            <tbody>
              {svar.map((s) => (
                <tr key={s.id} className="border-b border-kant/60 align-top">
                  <td className="py-3 pr-4 font-medium">{s.navn}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={s.kommer === "ja" ? "text-salvie-dyp" : "text-dempet"}
                    >
                      {s.kommer === "ja" ? "Kommer" : "Kan ikke"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 tabular-nums">{s.antall || "–"}</td>
                  <td className="py-3 pr-4">{s.folge || "–"}</td>
                  <td className="py-3 pr-4">{s.allergier || "–"}</td>
                  <td className="py-3 pr-4">
                    {s.epost && <div className="break-all">{s.epost}</div>}
                    {s.telefon && <div>{s.telefon}</div>}
                    {!s.epost && !s.telefon && "–"}
                  </td>
                  <td className="max-w-xs py-3 pr-4 text-dempet">{s.melding || "–"}</td>
                  <td className="py-3 whitespace-nowrap text-dempet">
                    {new Date(s.mottatt).toLocaleDateString("nb-NO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Ramme>
  );
}

function Ramme({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-6xl px-6 py-16">{children}</main>;
}

function Tall({ verdi, etikett }: { verdi: number; etikett: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-light lining-nums">{verdi}</div>
      <div className="text-xs uppercase tracking-wider text-dempet">{etikett}</div>
    </div>
  );
}
