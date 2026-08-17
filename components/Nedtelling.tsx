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

export default function Nedtelling({ dato }: { dato: string }) {
  const mal = new Date(dato).getTime();
  // Starter som null slik at server og klient rendrer likt ved hydrering.
  const [rest, setRest] = useState<Rest | null>(null);
  const [startet, setStartet] = useState(false);

  useEffect(() => {
    setRest(beregn(mal));
    setStartet(true);

    const id = setInterval(() => setRest(beregn(mal)), 1000);
    return () => clearInterval(id);
  }, [mal]);

  if (!startet) {
    // Reserverer plassen så innholdet ikke hopper når nedtellingen dukker opp.
    return <div className="h-24" aria-hidden />;
  }

  if (!rest) {
    return (
      <p className="font-display text-2xl text-salvie-dyp">
        I dag er dagen. Vi gleder oss til å se dere!
      </p>
    );
  }

  const felt: [number, string][] = [
    [rest.dager, rest.dager === 1 ? "dag" : "dager"],
    [rest.timer, "timer"],
    [rest.minutter, "minutter"],
    [rest.sekunder, "sekunder"],
  ];

  return (
    <div className="flex justify-center gap-6 sm:gap-10" aria-live="off">
      {felt.map(([verdi, etikett]) => (
        <div key={etikett} className="text-center">
          <div className="font-display text-4xl font-light lining-nums tabular-nums sm:text-5xl">
            {String(verdi).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-dempet">
            {etikett}
          </div>
        </div>
      ))}
    </div>
  );
}
