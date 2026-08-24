"use client";

import { useEffect, useState } from "react";

type Rest = { dager: number; timer: number; minutter: number; sekunder: number };

function beregn(mal: number): Rest | null {
  const diff = mal - Date.now();
  if (diff <= 0) return null;

  return {
    dager: Math.floor(diff / 86_400_000),
    timer: Math.floor(diff / 3_600_000) % 24,
    minutter: Math.floor(diff / 60_000) % 60,
    sekunder: Math.floor(diff / 1000) % 60,
  };
}

export type NedtellingStil = {
  rad: string;
  celle: string;
  tall: string;
  etikett: string;
  ferdig: string;
};

/**
 * Nedtelling som alle utformingsvariantene deler. Starter tom slik at server
 * og klient rendrer likt, og fyller seg først etter hydrering.
 */
export default function NedtellingFelles({
  dato,
  stil,
  korteEtiketter,
}: {
  dato: string;
  stil: NedtellingStil;
  korteEtiketter?: boolean;
}) {
  const mal = new Date(dato).getTime();
  const [rest, setRest] = useState<Rest | null>(null);
  const [startet, setStartet] = useState(false);

  useEffect(() => {
    setRest(beregn(mal));
    setStartet(true);

    const id = setInterval(() => setRest(beregn(mal)), 1000);
    return () => clearInterval(id);
  }, [mal]);

  if (!startet) return <div className="h-24" aria-hidden />;

  if (!rest) {
    return <p className={stil.ferdig}>I dag er dagen. Vi gleder oss til å se dere!</p>;
  }

  const felt: [number, string][] = korteEtiketter
    ? [
        [rest.dager, "dg"],
        [rest.timer, "t"],
        [rest.minutter, "min"],
        [rest.sekunder, "sek"],
      ]
    : [
        [rest.dager, rest.dager === 1 ? "dag" : "dager"],
        [rest.timer, "timer"],
        [rest.minutter, "minutter"],
        [rest.sekunder, "sekunder"],
      ];

  return (
    <div className={stil.rad}>
      {felt.map(([verdi, etikett]) => (
        <div key={etikett} className={stil.celle}>
          <div className={stil.tall}>{String(verdi).padStart(2, "0")}</div>
          <div className={stil.etikett}>{etikett}</div>
        </div>
      ))}
    </div>
  );
}
