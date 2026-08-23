export type TEventStatus = 'Open' | 'Closed' | 'Suspended';

export interface IOutcome {
  ID: string;
  O: string;
  N: string;
  MBS: string;
  G: string;
  OD: number;
  IMF: boolean;
}

export interface IOddGroup {
  ID: string;
  N: string;
  MBS: string;
  SO: number;
  OC: Record<string, IOutcome>;
}

export interface IBetEvent {
  C: string;
  N: string;
  TYPE: string;
  NID: string;
  D: string;
  T: string;
  DAY: string;
  S: TEventStatus;
  LN: string;
  IMF: boolean;
  OCG: Record<string, IOddGroup>;
  HEC: boolean;
}

export type IBetsResponse = IBetEvent[];
