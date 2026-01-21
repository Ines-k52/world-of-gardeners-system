// src/types/api.ts

/* ---------- User ---------- */
export interface User {
  benutzerID: number;   
  vorname: string;
  nachname: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Auth ---------- */
export interface AuthResponse {
  token: string;
}

export interface RegisterRequest {
  vorname: string;
  nachname: string;
  email: string;
  passwort: string;
}

export interface LoginRequest {
  email: string;
  passwort: string;
}

/* ---------- Pflanze ---------- */
export interface Pflanze {
  pflanzenID: number;
  name: string;
  wissenschaftlicherName?: string;
  eigenschaftID?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Eigenschaft ---------- */
export interface Eigenschaft {
  eigenschaftID: number;
  bezeichnung: string;
  beschreibung?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Standort ---------- */
export interface Standort {
  standortID: number;
  bezeichnung: string;
  beschreibung?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Bestand ---------- */
export interface Bestand {
  bestandID: number;
  pflanzenID: number;
  standortID: number;
  jahr: number;
  pflegehinweis?: string;
  pflanzdatum?: string;
  erntedatum?: string;
  pflanze?: Pflanze;
  standort?: Standort;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Request zum Anlegen eines Bestands ---------- */
export interface CreateBestandRequest {
  pflanzenID: number;
  standortName: string;
  pflegehinweis?: string;
  pflanzdatum?: string;
}
