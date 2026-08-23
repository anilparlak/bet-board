export interface IOddColumn {
  key: string;
  label: string;
  g?: string;
  n?: string;
}

export const ODD_COLUMNS: IOddColumn[] = [
  { key: "ms-1", label: "1", g: "1", n: "1" },
  { key: "ms-x", label: "x", g: "1", n: "X" },
  { key: "ms-2", label: "2", g: "1", n: "2" },
  { key: "au-alt", label: "Alt", g: "5", n: "Alt" },
  { key: "au-ust", label: "Üst", g: "5", n: "Üst" },
  { key: "hcp-h1", label: "H1" },
  { key: "hcp-1", label: "1" },
  { key: "hcp-x", label: "x" },
  { key: "hcp-2", label: "2" },
  { key: "hcp-h2", label: "H2" },
  { key: "dc-1x", label: "1-X", g: "2", n: "1-X" },
  { key: "dc-12", label: "1-2", g: "2", n: "1-2" },
  { key: "dc-x2", label: "X-2", g: "2", n: "X-2" },
  { key: "kg-var", label: "Var" },
  { key: "kg-yok", label: "Yok" },
];


export enum BullentinRowTypes {
  ROW_HEIGH = 64,
  OVER_SCAN_ROW_COUNT = 4
}