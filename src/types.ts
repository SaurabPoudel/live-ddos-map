type EventEvidence =
  | "synthetic"
  | "threat-intelligence"
  | "cloudflare-security-event"
  | "cloudflare-aggregate";

type ThreatEvent = {
  id: string;
  observedAt: string;
  source: string;
  evidence: EventEvidence;
  category: string;
  severity: "low" | "medium" | "high" | "unknown";
  sourceIp?: string;
  sourceCountry?: string;
  sourceLat?: number;
  sourceLng?: number;
  destinationLabel?: string;
  destinationLat?: number;
  destinationLng?: number;
  description: string;
};
