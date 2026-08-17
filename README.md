# Bryllupsnettside

Enkel, privat nettside med informasjon til bryllupsgjestene: program, sted, praktisk
info, gaveønsker, bilder, kontaktpersoner og RSVP-skjema.

Bygget med Next.js (App Router) + TypeScript + Tailwind CSS v4.

---

## Kom i gang

```bash
npm install
```

```bash
npm run dev
```

Siden kjører da på http://localhost:3000

---

## Slik fyller du inn ekte innhold

**Alt tekstinnhold ligger i én fil: [`content/bryllup.ts`](content/bryllup.ts).**

Åpne den og bytt ut alt som står i `[klammer]`. Søk etter `[` for å finne det som
gjenstår. Der ligger:

| Hva                                | Hvor i filen  |
| ---------------------------------- | ------------- |
| Navn på brudeparet                 | `par`         |
| Dato og klokkeslett (styrer nedtellingen) | `dato`, `datoTekst` |
| Program for dagen                  | `program`     |
| Kirke og festlokale, kart og bilder | `steder`     |
| Kleskode, overnatting, transport … | `praktisk`    |
| Gaveønsker og lenker               | `gaver`       |
| Bilder                             | `galleri`     |
| Toastmaster og forlovere           | `kontakter`   |
| Svarfrist, av/på for RSVP          | `rsvp`        |

Endringer vises umiddelbart så lenge `npm run dev` kjører.

### Legge inn bilder

1. Legg bildefilene i `public/galleri/`
2. Skriv filnavnet i `galleri`-listen i `content/bryllup.ts`, f.eks. `src: "/galleri/frieri.jpg"`

Bilder uten `src` vises som en pen plassholder, så siden ser hel ut selv om du bare
har noen av bildene klare. Anbefalt størrelse: ca. 1200 px bred, stående format
(bildene beskjæres til 4:5).

### Kart og bilde av lokalene

Hvert sted under `steder` i `content/bryllup.ts` har tre felt for dette:

- `kart: { lat, lon, zoom }` – viser et kart over stedet. Finn koordinatene ved å
  høyreklikke på stedet i Google Maps – da ligger «breddegrad, lengdegrad» øverst i
  menyen. `zoom` går fra ca. 11 (hele Bodø) til 17 (enkeltbygninger). Sett `kart: null`
  for å skjule kartet.
- `kartUrl` – hvor gjesten havner når hun trykker på kartet eller «Åpne veibeskrivelse».
  Åpner stedet i hennes egen kartapp.
- `bilde` – valgfritt foto av lokalet. Legg filen i `public/steder/` og skriv filnavnet,
  f.eks. `"/steder/bodin-kirke.jpg"`. Bildet vises øverst på kortet i bredformat (3:2),
  ca. 1200 x 800 px passer. La feltet stå tomt for å vise bare kartet.

Kartet i [`components/Kart.tsx`](components/Kart.tsx) er satt sammen av kartfliser fra
CARTO «Positron» – et lyst, nesten fargeløst kartlag. Det krever ingen API-nøkkel og
setter ingen informasjonskapsler, så siden trenger ikke noe cookie-banner. Kartet er
med vilje stillestående: det laster raskt og stjeler ikke scrollingen på mobil.

Vil du ha et annet utseende, bytt `LAG` øverst i filen:

| Verdi                 | Ser ut som                        |
| --------------------- | --------------------------------- |
| `light_all`           | lyst og dempet, med stedsnavn (standard) |
| `light_nolabels`      | samme, helt uten tekst            |
| `dark_all`            | mørkt med stedsnavn               |
| `rastertiles/voyager` | litt mer farge, fortsatt rolig    |

### Bilde av toastmaster og forlovere

1. Legg portrettene i `public/kontakter/`
2. Fyll inn `bilde` på personen i `kontakter`-listen, f.eks. `bilde: "/kontakter/havard.jpg"`

Bildene beskjæres til en sirkel, så et kvadratisk utsnitt fungerer best – ca. 400 x 400 px
holder. Så lenge `bilde` står tomt vises personens initialer i sirkelen i stedet.

### Bytte forsidebakgrunn til et foto

I `components/Forside.tsx` erstatter du `div`-en med `bg-[radial-gradient(...)]` med:

```tsx
<Image src="/forside.jpg" alt="" fill priority className="absolute inset-0 -z-10 object-cover" />
```

Legg da også på et mørkt slør over bildet og lys tekstfarge, slik at teksten er lesbar.

---

## RSVP-svar

Gjestene svarer nederst på siden. Svarene lagres i `data/rsvp.json` på serveren.

**Se svarene:** gå til `/admin`. Der møter du et kodefelt, og med riktig kode kommer du
rett inn i oversikten: en tabell med alle svar, samt antall gjester og allergier.
Koden setter du selv i `.env.local`:

```
ADMIN_KODE=din-hemmelige-kode
```

Du forblir innlogget i 30 dager, eller til du trykker «Logg ut». Innloggingen ligger i
en `httpOnly`-informasjonskapsel som bare inneholder et avtrykk av koden, ikke koden
selv. Endrer du `ADMIN_KODE`, blir alle utlogget.

Dette er en enkel sperre for å holde oversikten unna gjester og søkemotorer – ikke ekte
brukerinnlogging. Bruk en kode du ikke bruker andre steder.

`data/rsvp.json` er i `.gitignore`, så gjestenes opplysninger havner ikke i git.

### Viktig om hosting og RSVP

Fillagringen krever en server med **varig filsystem** – f.eks. en VPS, Docker, eller en
maskin som kjører `npm run build && npm start`.

Setter du siden på **Vercel, Netlify eller lignende serverløse plattformer, blir filen
slettet** ved hver ny utrulling, og svarene forsvinner. Velg da ett av disse i stedet:

- Bytt ut innmaten i `lib/rsvp-lager.ts` med f.eks. Vercel Postgres, Supabase eller Turso –
  resten av koden trenger ingen endring.
- Eller send svarene på e-post i stedet for å lagre dem (f.eks. med Resend), i
  `app/api/rsvp/route.ts`.

### Skru av RSVP etter fristen

Sett `apen: false` under `rsvp` i `content/bryllup.ts`. Da forsvinner både skjemaet og
knappen på forsiden.

---

## Publisere siden

Stopp dev-serveren først – `npm run dev` og `npm run build` deler mappen `.next`, og
kjører du dem samtidig får du 404 på script-filer i nettleseren.

```bash
npm run build
```

```bash
npm start
```

Trenger du ikke RSVP-lagring på server, kan siden også legges ut som rene statiske filer.
Legg da `output: "export"` i `next.config.ts` og fjern `app/api/` og `app/admin/`.

---

## Prosjektstruktur

```
content/bryllup.ts        ← alt innhold redigeres her
app/
  page.tsx                forsiden, setter sammen seksjonene
  layout.tsx              skrifttyper og sidetittel
  globals.css             farger og typografi
  admin/page.tsx          innlogging + oversikt over RSVP-svar
  api/rsvp/route.ts       tar imot og validerer svar
components/               én fil per seksjon
lib/rsvp-lager.ts         lesing/skriving av data/rsvp.json
lib/admin-tilgang.ts      innlogging til /admin
public/galleri/           bilder til galleriet
public/kontakter/         portretter av toastmaster og forlovere
public/steder/            bilder av kirke og festlokale
```

### Bytte farger

Alle fargene er definert øverst i `app/globals.css`, under `@theme`. Endre
verdiene der, så slår det gjennom på hele siden.
