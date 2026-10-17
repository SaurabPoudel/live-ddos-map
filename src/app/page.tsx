"use client";

import LiveGlobe from "@/components/live-globe";
import Sider from "@/components/Sider";
import type { AttackLayer, AttackResponse } from "@/lib/attack-types";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [limit, setLimit] = useState(10);
  const [layer, setLayer] = useState<AttackLayer>("layer3");
  const [data, setData] = useState<AttackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleLimitChange(nextLimit: number) {
    setLoading(true);
    setLimit(nextLimit);
  }

  function handleLayerChange(nextLayer: AttackLayer) {
    setLoading(true);
    setLayer(nextLayer);
  }

  const loadAttacks = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await fetch(
          `/api/attacks?limit=${limit}&layer=${layer}`,
          {
            cache: "no-store",
            signal,
          },
        );

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error ?? "Could not load attack data");
        }

        const result: AttackResponse = await response.json();
        setData(result);
        setError("");
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === "AbortError") {
          return;
        }
        setError(
          loadError instanceof Error ? loadError.message : "Unknown error",
        );
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [layer, limit],
  );

  useEffect(() => {
    const controller = new AbortController();
    const initialLoad = window.setTimeout(() => {
      void loadAttacks(controller.signal);
    }, 0);

    const interval = window.setInterval(() => {
      void loadAttacks(controller.signal);
    }, 5 * 60 * 1000);

    return () => {
      controller.abort();
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [loadAttacks]);

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-[#050b14] text-slate-100">
      <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Network observability
          </p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
            Live DDoS attack visualizer
          </h1>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-300">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          LIVE
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <section className="flex min-h-0 min-w-0 flex-[0_0_38%] flex-col items-center overflow-hidden px-4 py-2 sm:px-8 lg:flex-1 lg:justify-center lg:px-10 lg:py-4">
          <div className="w-full max-w-[760px] shrink-0">
            <p className="text-sm text-slate-400">
              Global attack traffic · Cloudflare Radar ·{" "}
              {layer === "layer3" ? "Layer 3" : "Layer 7"}
            </p>
          </div>
          <LiveGlobe
            arcs={data?.arcs ?? []}
            loading={loading}
            error={error}
          />
        </section>
        <Sider
          data={data}
          loading={loading}
          error={error}
          limit={limit}
          layer={layer}
          onLimitChange={handleLimitChange}
          onLayerChange={handleLayerChange}
        />
      </div>
    </main>
  );
}
