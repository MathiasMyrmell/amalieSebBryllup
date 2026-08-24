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

/** Nedtelling som en rad med celler adskilt av hårfine streker */
export default function Nedtelling2({ dato }: { dato: string }) {
  const mal = new Date(dato).getTime();
  const [rest, setRest] = useState<Rest | null>(null);
  const [startet, setStartet] = useState(false);

  useEffect(() => {
    setRest(beregn(mal));
    setStartet(true);

    const id = setInterval(() => setRest(beregn(mal)), 1000);
    return () => clearInterval(id);
  }, [mal]);

  if (!startet) return <div className="h-20" aria-hidden />;

  if (!rest) {
    return (
      <p className="font-grotesk text-2xl text-messing">I dag er dagen.</p>
    );
  }

  const felt: [number, string][] = [
    [rest.dager, "dager"],
    [rest.timer, "timer"],
    [rest.minutter, "min"],
    [rest.sekunder, "sek"],
  ];

  return (
    <div className="flex border-y border-strek">
      {felt.map(([verdi, etikett], i) => (
        <div
          key={etikett}
          className={`flex-1 py-5 ${i > 0 ? "border-l border-strek pl-5" : ""}`}
        >
          <div className="font-grotesk text-3xl font-medium tabular-nums sm:text-4xl">
            {String(verdi).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-tåke">
            {etikett}
          </div>
        </div>
      ))}
    </div>
  );
}
