export interface RadarResposne<T> {
  succss: boolean;
  errors: Array<{ code: number, message: string}>;
  result: T;
  status?: number;
}

export interface RadarMeta {
  dateRange: Array<{ startTime: string; endTime: string }>;
  confidenceInfo: { level: string | null; annotations: unknown[] } | null;
  normalization: "PERCENTAGE" | "MIN0_MAX" | string;
  lastUpdated: string;
  units: Array<{ name: string; value: string }>;
}



export interface AttackPair {
  originCountryAlpha2: string;
  originCountryName: string;
  targetCountryAlpha2: string;
  targetCountryName: string;
  value: string; 
  rank?: number;
}

export interface TopAttacksResult {
  top_0: AttackPair[];
  meta: RadarMeta;
}


export interface TopLocation {
  originCountryAlpha2?: string;
  originCountryName?: string;
  targetCountryAlpha2?: string;
  targetCountryName?: string;
  value: string;
  rank: number;
}

export interface TopLocationsResult {
  top_0: TopLocation[];
  meta: RadarMeta;
}

export interface TimeseriesResult {
  serie_0: {
    timestamps: string[];
    values: string[];
  };
  meta: RadarMeta & { aggInterval: string };
}


export type AttackLayer = "layer3" | "layer7";


export interface MapAttackDatum {
  id: string;
  layer: AttackLayer;
  origin: { code: string; name: string; lat: number; lng: number };
  target: { code: string; name: string; lat: number; lng: number };
  value: number;
  rank?: number;
}
