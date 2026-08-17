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

/** Det alle lagringsmåter må kunne gjøre */
export type Lager = {
  lesSvar(): Promise<Svar[]>;
  leggTilSvar(svar: Svar): Promise<void>;
  settFjernet(id: string, fjernet: boolean): Promise<boolean>;
  slettSvar(id: string): Promise<boolean>;
};
