
"use client";

import dynamic from "next/dynamic";
import type { AttackArc } from "@/lib/attack-types";

const World = dynamic(
  () => import("@/components/ui/globe").then((mod) => mod.World),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-96 items-center justify-center text-sm text-neutral-400">
        Initializing globe...
      </div>
    ),
  },
);

const globeConfig = {
  pointSize: 1,
  globeColor: "#071426",
  showAtmosphere: true,
  atmosphereColor: "#38bdf8",
  atmosphereAltitude: 0.15,
  emissive: "#071426",
  emissiveIntensity: 0.2,
  shininess: 0.8,
  polygonColor: "rgba(255,255,255,0.65)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

type LiveGlobeProps = {
  arcs: AttackArc[];
  loading: boolean;
  error: string;
};

export default function LiveGlobe({ arcs, loading, error }: LiveGlobeProps) {
  return (
    <section className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
      {loading && (
        <p className="absolute z-10 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
          Loading attack statistics...
        </p>
      )}

      {error && (
        <p role="alert" className="absolute z-10 rounded-lg border border-red-400/20 bg-slate-950/90 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="relative mx-auto aspect-square w-[min(90vw,38vh,760px)] max-h-full max-w-full lg:w-[min(50vw,70vh,760px)]">
        <World globeConfig={globeConfig} data={arcs} />
      </div>
    </section>
  );
}
