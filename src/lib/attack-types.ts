export interface AttackArc {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
  originCountry: string;
  targetCountry: string;
  value: number;
}

export interface AttackRecord {
  originCountryName: string;
  targetCountryName: string;
  value: string;
}

export interface AttackResponse {
  updatedAt: string;
  source: string;
  layer: string;
  attacks: AttackRecord[];
  arcs: AttackArc[];
}

export type AttackLayer = "layer3" | "layer7";
