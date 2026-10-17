
import { coords } from "@/lib/country-coordinates";
import type { AttackLayer } from "@/lib/attack-types";
import { NextResponse } from "next/server";

type CloudflareAttack = {
  originCountryAlpha2: string;
  originCountryName: string;
  targetCountryAlpha2: string;
  targetCountryName: string;
  value: string;
};

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const requestedLimit = searchParams.get("limit");
  const parsedLimit = requestedLimit === null ? 10 : Number(requestedLimit);
  const requestedLayer = searchParams.get("layer") ?? "layer3";

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
    return NextResponse.json(
      { error: "Limit must be a positive whole number" },
      { status: 400 },
    );
  }

  if (requestedLayer !== "layer3" && requestedLayer !== "layer7") {
    return NextResponse.json(
      { error: "Layer must be either layer3 or layer7" },
      { status: 400 },
    );
  }

  const limit = Math.min(parsedLimit, 40);
  const layer: AttackLayer = requestedLayer;
  const token = process.env.CF_RADAR_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Missing CF_RADAR_TOKEN" },
      { status: 500 },
    );
  }

  try {
    const url = new URL(
      `https://api.cloudflare.com/client/v4/radar/attacks/${layer}/top/attacks`,
    );

    url.searchParams.set("dateRange", "1d");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("format", "json");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const body = await response.json();

    if (!response.ok || !body.success) {
      console.error("Cloudflare API error:", body.errors);

      return NextResponse.json(
        { error: "Cloudflare Radar request failed" },
        { status: 502 },
      );
    }

    const attacks: CloudflareAttack[] =
      body.result?.top_0 ?? body.result?.attacks ?? [];

    const arcs = attacks.flatMap((attack, index) => {
      const start = coords[

        attack.originCountryAlpha2
      ];
      const end = coords[
        attack.targetCountryAlpha2
      ];

      if (!start || !end) return [];

      return [
        {
          order: index + 1,
          startLat: start.lat,
          startLng: start.lng,
          endLat: end.lat,
          endLng: end.lng,
          arcAlt: 0.15 + index * 0.015,
          color: "#ff5b36",
          originCountry: attack.originCountryName,
          targetCountry: attack.targetCountryName,
          value: Number(attack.value),
        },
      ];
    });

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      source: "Cloudflare Radar",
      layer: layer === "layer3" ? "Layer 3" : "Layer 7",
      attacks,
      arcs,
    });
  } catch (error) {
    console.error("Radar fetch failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve Radar data" },
      { status: 502 },
    );
  }
}
