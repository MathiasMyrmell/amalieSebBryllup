/**
 * ============================================================
 *  ALT INNHOLD PÅ NETTSIDEN REDIGERES HER
 * ============================================================
 *  Dette er den eneste filen du trenger å endre for å fylle inn
 *  ekte informasjon. Alt som står i [KLAMMER] er en plassholder
 *  som må byttes ut.
 *
 *  Tips: søk etter "[" i denne filen for å finne alt som gjenstår.
 */

export const bryllup = {
  /* ---------------------------------------------------------
   * 1. PARET OG DATOEN
   * ------------------------------------------------------- */
  par: {
    brud: "Amalie",
    brudgom: "Sebastian",
    /** Vises i nettleserfanen og ved deling */
    tittel: "Amalie & Sebastian – 31. juli 2027",
  },

  /**
   * Dato og klokkeslett for vielsen, i ISO-format.
   * Format: "ÅÅÅÅ-MM-DDTTT:MM:SS+02:00"  (+02:00 = norsk sommertid, +01:00 = vintertid)
   * Denne styrer nedtellingen.
   */
  dato: "2027-07-31T14:00:00+02:00",

  /** Hvordan datoen skrives ut med ord på forsiden */
  datoTekst: "Lørdag 31. juli 2027",

  /** Stedsnavnet som vises ved siden av datoen på forsiden */
  sted: "Bodø",

  /** Kort velkomsthilsen på forsiden */
  ingress:
    "Vi gifter oss, og vi vil gjerne ha dere med på feiringen. Her finner dere all praktisk informasjon om dagen.",

  /* ---------------------------------------------------------
   * 2. PROGRAM FOR DAGEN
   * ------------------------------------------------------- */
  program: [
    {
      tid: "13:30",
      tittel: "Ankomst",
      beskrivelse: "Vi ber alle gjester være på plass i kirken senest 13:45.",
    },
    {
      tid: "14:00",
      tittel: "Vielse",
      beskrivelse: "[Navn på kirke/sted]",
    },
    {
      tid: "15:00",
      tittel: "Mingling og fotografering",
      beskrivelse: "Bobler og snacks utenfor [sted].",
    },
    {
      tid: "17:00",
      tittel: "Middag",
      beskrivelse: "Bordplassering henger ved inngangen.",
    },
    {
      tid: "21:00",
      tittel: "Kaker og dans",
      beskrivelse: "Bandet [navn] spiller opp.",
    },
    {
      tid: "01:00",
      tittel: "Takk for i kveld",
      beskrivelse: "Siste buss/taxi går fra [sted].",
    },
  ],

  /* ---------------------------------------------------------
   * 3. STEDENE
   * ------------------------------------------------------- */
  /**
   * Hvert sted kan vise et innebygd kart og et bilde av lokalet.
   *
   *  kart   – koordinater og hvor tett innpå kartet skal ligge. Slik finner du
   *           koordinatene: høyreklikk på stedet i Google Maps, så ligger
   *           «breddegrad, lengdegrad» øverst i menyen. `zoom` går fra ca. 11
   *           (hele Bodø) til 17 (enkeltbygninger); 14 er et greit utgangspunkt.
   *           Sett `kart: null` for å skjule kartet.
   *  bilde  – legg bildefilen i  public/steder/  og skriv filnavnet her,
   *           f.eks. "/steder/bodin-kirke.jpg". La den stå tom ("") for å skjule
   *           bildet. Bildet beskjæres til bredformat (3:2).
   */
  steder: [
    {
      merkelapp: "Vielse",
      navn: "Bodin kirke",
      adresse: "Gamle Riksvei 66, 8070 Bodø",
      bilde: "",
      kart: { lat: 67.27401, lon: 14.4348, zoom: 15 },
      /**
       * Lenke som åpner stedet i gjestens egen kartapp. Vil du bytte den ut:
       *   1. Søk opp stedet på Google Maps
       *   2. Trykk "Del" → kopier lenke
       */
      kartUrl:
        "https://www.google.com/maps/search/?api=1&query=Bodin+kirke%2C+Gamle+Riksvei+66%2C+8070+Bod%C3%B8",
      notat: "[Parkering: ...]",
    },
    {
      merkelapp: "Fest",
      navn: "Bestemorstua",
      adresse: "Soløyvannsveien 479, 8025 Bodø",
      bilde: "",
      kart: { lat: 67.30007, lon: 14.52513, zoom: 13 },
      kartUrl:
        "https://www.google.com/maps/search/?api=1&query=Bestemorstua%2C+Sol%C3%B8yvannsveien+479%2C+8025+Bod%C3%B8",
      notat: "Felles buss fra kirken kl. [tid].",
    },
  ],

  /* ---------------------------------------------------------
   * 4. PRAKTISK INFORMASJON
   * ------------------------------------------------------- */
  praktisk: [
    {
      tittel: "Kleskode",
      tekst: "[Mørk dress / smoking / pent antrekk]. Vi setter pris på om dere unngår hvitt.",
    },
    {
      tittel: "Overnatting",
      tekst:
        "Vi har reservert rom på [hotell] til rabattert pris. Oppgi kode «[KODE]» ved booking, innen [dato].",
    },
    {
      tittel: "Transport",
      tekst:
        "Buss går fra [sted] kl. [tid], og tilbake fra festlokalet kl. [tid]. Taxi bestilles på [telefonnummer].",
    },
    {
      tittel: "Barn",
      tekst: "[Vi har dessverre ikke plass til barn i bryllupet / Barn er hjertelig velkomne].",
    },
    {
      tittel: "Tale eller innslag?",
      tekst: "Ta kontakt med Håvard i god tid, senest [dato].",
    },
    {
      tittel: "Bilder",
      tekst:
        "Vi har fotograf på plass – nyt gjerne seremonien uten mobil. Del gjerne egne bilder med emneknaggen [#emneknagg] etterpå.",
    },
  ],

  /* ---------------------------------------------------------
   * 5. GAVER OG ØNSKELISTE
   * ------------------------------------------------------- */
  gaver: {
    tekst:
      "Den største gaven er at dere feirer dagen sammen med oss. Ønsker dere likevel å gi noe, setter vi stor pris på et bidrag til [bryllupsreisen til ...].",
    /** Fjern linjer du ikke trenger, eller sett listen til [] for å skjule knappene */
    lenker: [
      { navn: "Ønskeliste", url: "https://" },
      { navn: "Vipps til [navn]", url: "https://" },
    ],
  },

  /* ---------------------------------------------------------
   * 6. BILDEGALLERI
   * ------------------------------------------------------- */
  /**
   * Legg bildefilene i mappen  public/galleri/
   * og skriv inn filnavnet under, f.eks. "/galleri/forlovelse.jpg".
   * La "src" stå tom ("") for å vise en pen plassholder i mellomtiden.
   */
  galleri: [
    { src: "", alt: "[Beskrivelse av bildet]", bildetekst: "Der det hele startet" },
    { src: "", alt: "[Beskrivelse av bildet]", bildetekst: "Frieriet" },
    { src: "", alt: "[Beskrivelse av bildet]", bildetekst: "Sommeren [år]" },
    { src: "", alt: "[Beskrivelse av bildet]", bildetekst: "Forlovelsesbilder" },
    { src: "", alt: "[Beskrivelse av bildet]", bildetekst: "Turen til [sted]" },
    { src: "", alt: "[Beskrivelse av bildet]", bildetekst: "Oss" },
  ],

  /* ---------------------------------------------------------
   * 7. KONTAKTPERSONER
   * ------------------------------------------------------- */
  /**
   * Vil du ha portrettbilde på kortene? Legg bildefilen i  public/kontakter/
   * og skriv filnavnet i "bilde", f.eks. "/kontakter/havard.jpg".
   * Bildet beskjæres til en sirkel, så et kvadratisk utsnitt fungerer best
   * (ca. 400 x 400 px holder). La "bilde" stå tom ("") for å vise initialene
   * i stedet – kortene ser hele ut uansett.
   */
  kontakter: [
    {
      rolle: "Toastmaster",
      navn: "Håvard Klette",
      bilde: "",
      telefon: "[+47 000 00 000]",
      epost: "[epost@eksempel.no]",
      notat: "Kontakt om taler, sanger og innslag.",
    },
    {
      rolle: "Forlover for Amalie",
      navn: "Frida Krüger Hansen",
      bilde: "",
      telefon: "[+47 000 00 000]",
      epost: "",
      notat: "",
    },
    {
      rolle: "Forlover for Sebastian",
      navn: "Andreas Kristiansen",
      bilde: "",
      telefon: "[+47 000 00 000]",
      epost: "",
      notat: "",
    },
    {
      rolle: "Forlover for Sebastian",
      navn: "Mathias Myrmell Moen",
      bilde: "",
      telefon: "[+47 000 00 000]",
      epost: "",
      notat: "",
    },
  ],

  /* ---------------------------------------------------------
   * 8. RSVP
   * ------------------------------------------------------- */
  rsvp: {
    /** Siste svarfrist, vises over skjemaet */
    frist: "1. juni 2027",
    /** Vises som ren tekst under skjemaet */
    hjelpetekst:
      "Har dere spørsmål, eller trenger å endre svaret? Send en melding til Håvard.",
    /** Sett til false for å skjule hele RSVP-seksjonen (f.eks. etter fristen) */
    apen: true,
  },
} as const;

export type Bryllup = typeof bryllup;
