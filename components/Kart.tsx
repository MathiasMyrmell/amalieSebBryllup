/**
 * Stillestående kart satt sammen av kartfliser (standard: Esri Satellitt).
 * Trykker gjesten på kartet, åpnes veibeskrivelsen i deres egen kartapp.
 */

export type KartIkon = "pin" | "kirke" | "fest";

type KartStil = {
  id: string;
  navn: string;
  /** Bygg URL for én flis. Esri: z/y/x. OSM: z/x/y. */
  url: (z: number, x: number, y: number) => string;
  attribuisjon: string;
  /** Lett krem-filter over kartet */
  varmTone?: boolean;
};

const esri =
  (sti: string) => (z: number, x: number, y: number) =>
    `https://server.arcgisonline.com/ArcGIS/rest/services/${sti}/MapServer/tile/${z}/${y}/${x}`;

/** Alle lag du kan bla i under kartene i `next dev`. */
export const KART_STILER: KartStil[] = [
  {
    id: "esri-street",
    navn: "Esri Gatekart",
    url: esri("World_Street_Map"),
    attribuisjon: "© Esri © OpenStreetMap",
    varmTone: true,
  },
  {
    id: "esri-topo",
    navn: "Esri Terreng",
    url: esri("World_Topo_Map"),
    attribuisjon: "© Esri © OpenStreetMap",
    varmTone: true,
  },
  {
    id: "esri-light-gray",
    navn: "Esri Lys grå",
    url: esri("Canvas/World_Light_Gray_Base"),
    attribuisjon: "© Esri © OpenStreetMap",
    varmTone: true,
  },
  {
    id: "esri-dark-gray",
    navn: "Esri Mørk grå",
    url: esri("Canvas/World_Dark_Gray_Base"),
    attribuisjon: "© Esri © OpenStreetMap",
  },
  {
    id: "esri-natgeo",
    navn: "Esri NatGeo",
    url: esri("NatGeo_World_Map"),
    attribuisjon: "© Esri © National Geographic",
    varmTone: true,
  },
  {
    id: "esri-imagery",
    navn: "Esri Satellitt",
    url: esri("World_Imagery"),
    attribuisjon: "© Esri",
  },
  {
    id: "osm",
    navn: "OpenStreetMap",
    url: (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
    attribuisjon: "© OpenStreetMap",
    varmTone: true,
  },
  {
    id: "osm-hot",
    navn: "OSM Humanitarian",
    url: (z, x, y) =>
      `https://tile.openstreetmap.fr/hot/${z}/${x}/${y}.png`,
    attribuisjon: "© OpenStreetMap",
    varmTone: true,
  },
  {
    id: "opentopomap",
    navn: "OpenTopoMap",
    url: (z, x, y) => `https://tile.opentopomap.org/${z}/${x}/${y}.png`,
    attribuisjon: "© OpenStreetMap © OpenTopoMap",
    varmTone: true,
  },
  {
    id: "cyclosm",
    navn: "CyclOSM",
    url: (z, x, y) =>
      `https://a.tile-cyclosm.openstreetmap.fr/cyclosm/${z}/${x}/${y}.png`,
    attribuisjon: "© OpenStreetMap © CyclOSM",
    varmTone: true,
  },
];

/** Standard lag på forsiden (bytt id når du har valgt favoritt). */
export const STANDARD_KART_STIL = "esri-imagery";

function finnStil(lag: string): KartStil {
  return (
    KART_STILER.find((s) => s.id === lag) ??
    KART_STILER.find((s) => s.id === STANDARD_KART_STIL)!
  );
}

const FLIS = 256;
const BREDDE = 960;
const HOYDE = 224;

function flisX(lon: number, zoom: number) {
  return ((lon + 180) / 360) * 2 ** zoom;
}

function flisY(lat: number, zoom: number) {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom;
}

const IKON_EMOJI: Record<KartIkon, string> = {
  kirke: "⛪",
  fest: "🎉",
  pin: "📍",
};

function MarkorSvg({ ikon }: { ikon: KartIkon }) {
  return (
    <span aria-hidden className="block text-3xl leading-none drop-shadow-md">
      {IKON_EMOJI[ikon]}
    </span>
  );
}

export default function Kart({
  lat,
  lon,
  tittel,
  lenke,
  zoom = 14,
  lag = STANDARD_KART_STIL,
  hoyde = HOYDE,
  ramme = "border border-kant bg-krem-dyp",
  markor = "text-salvie-dyp",
  merke = "bg-krem/80 text-dempet",
  ikon = "pin",
}: {
  lat: number;
  lon: number;
  tittel: string;
  lenke: string;
  zoom?: number;
  /** Stil-id fra KART_STILER */
  lag?: string;
  hoyde?: number;
  ramme?: string;
  markor?: string;
  merke?: string;
  ikon?: KartIkon;
}) {
  const stil = finnStil(lag);
  const senterX = flisX(lon, zoom) * FLIS;
  const senterY = flisY(lat, zoom) * FLIS;

  const venstre = senterX - BREDDE / 2;
  const topp = senterY - hoyde / 2;

  const fraX = Math.floor(venstre / FLIS);
  const tilX = Math.floor((venstre + BREDDE - 1) / FLIS);
  const fraY = Math.floor(topp / FLIS);
  const tilY = Math.floor((topp + hoyde - 1) / FLIS);

  const fliser = [];
  for (let x = fraX; x <= tilX; x++) {
    for (let y = fraY; y <= tilY; y++) {
      fliser.push({
        x,
        y,
        venstre: x * FLIS - venstre,
        topp: y * FLIS - topp,
      });
    }
  }

  return (
    <a
      href={lenke}
      target="_blank"
      rel="noreferrer"
      aria-label={`Kart over ${tittel} – åpne veibeskrivelse`}
      className={`group relative block overflow-hidden ${ramme}`}
      style={{ height: hoyde }}
    >
      <div
        className="absolute top-0 left-1/2 transition-opacity group-hover:opacity-90"
        style={{ width: BREDDE, height: hoyde, marginLeft: -BREDDE / 2 }}
      >
        {fliser.map((flis) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${stil.id}-${flis.x}-${flis.y}`}
            src={stil.url(zoom, flis.x, flis.y)}
            alt=""
            width={FLIS}
            height={FLIS}
            loading="lazy"
            className="absolute max-w-none"
            style={{ left: flis.venstre, top: flis.topp }}
          />
        ))}
      </div>

      {stil.varmTone && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#f2ece1]/25 mix-blend-multiply"
        />
      )}

      <span
        aria-hidden
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${markor}`}
      >
        <MarkorSvg ikon={ikon} />
      </span>

      <span
        className={`absolute right-0 bottom-0 px-1.5 py-0.5 text-[0.6rem] ${merke}`}
      >
        {stil.attribuisjon}
      </span>
    </a>
  );
}
