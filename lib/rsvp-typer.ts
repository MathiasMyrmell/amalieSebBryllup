/** Ett RSVP-svar fra en gjest. Delt mellom de to lagringsmåtene. */
export type Svar = {
  id: string;
  /** ISO-tidspunkt for når svaret kom inn */
  mottatt: string;
  navn: string;
  epost: string;
  telefon: string;
  kommer: "ja" | "nei";
  antall: number;
  folge: string;
  allergier: string;
  melding: string;
  /**
   * Satt til true når svaret er lagt i arkivet på /admin. Svaret slettes ikke,
   * det flyttes bare ned i listen over fjernede og kan hentes opp igjen.
   */
  fjernet?: boolean;
};

/** En e-post sendt til eller mottatt fra en gjest. Hører til gjestens e-postadresse. */
export type Epost = {
  /** Message-ID fra e-posten. Gjør at samme e-post aldri lagres to ganger. */
  id: string;
  /** Gjestens adresse (små bokstaver) – det er den tråden samles under */
  adresse: string;
  /** «ut» = sendt til gjesten, «inn» = mottatt fra gjesten */
  retning: "inn" | "ut";
  fra: string;
  til: string;
  emne: string;
  tekst: string;
  /** ISO-tidspunkt */
  tidspunkt: string;
};

/** Det alle lagringsmåter må kunne gjøre */
export type Lager = {
  lesSvar(): Promise<Svar[]>;
  leggTilSvar(svar: Svar): Promise<void>;
  settFjernet(id: string, fjernet: boolean): Promise<boolean>;
  settSvar(id: string, kommer: "ja" | "nei", antall: number): Promise<boolean>;
  slettSvar(id: string): Promise<boolean>;
};
