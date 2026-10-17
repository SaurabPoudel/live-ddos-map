"use client";

import type { ChangeEvent } from "react";
import type { AttackLayer, AttackResponse } from "@/lib/attack-types";

type SiderProps = {
  data: AttackResponse | null;
  loading: boolean;
  error: string;
  limit: number;
  layer: AttackLayer;
  onLimitChange: (limit: number) => void;
  onLayerChange: (layer: AttackLayer) => void;
};

function formatValue(value: string): string {
  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(parsed)
    : value;
}

export default function Sider({
  data,
  loading,
  error,
  limit,
  layer,
  onLimitChange,
  onLayerChange,
}: SiderProps) {
  function handleLimitChange(event: ChangeEvent<HTMLInputElement>) {
    const nextLimit = event.currentTarget.valueAsNumber;
    if (Number.isFinite(nextLimit)) {
      onLimitChange(Math.min(40, Math.max(1, Math.floor(nextLimit))));
    }
  }

  return (
    <aside className="flex min-h-0 w-full flex-[0_0_62%] flex-col gap-3 overflow-y-auto border-t border-white/10 bg-slate-950/80 p-4 sm:gap-4 sm:p-5 lg:w-[clamp(280px,24vw,340px)] lg:flex-none lg:gap-5 lg:overflow-hidden lg:border-l lg:border-t-0 lg:p-6">
      <section className="shrink-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Radar analytics
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">
          Attack overview
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Cloudflare Radar · {layer === "layer3" ? "Layer 3" : "Layer 7"}
        </p>
      </section>

      <fieldset className="shrink-0">
        <legend className="mb-2 text-sm font-medium text-slate-200">
          Traffic layer
        </legend>
        <div className="grid grid-cols-2 rounded-lg border border-white/10 bg-slate-900 p-1">
          {(["layer3", "layer7"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={layer === option}
              onClick={() => onLayerChange(option)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                layer === option
                  ? "bg-cyan-400/15 text-cyan-200 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {option === "layer3" ? "Layer 3" : "Layer 7"}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block shrink-0">
        <span className="mb-2 flex items-center justify-between text-sm font-medium text-slate-200">
          Country pairs to show
          <span className="text-xs text-slate-500">Max 40</span>
        </span>
        <input
          aria-label="Country pairs to show"
          className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          type="number"
          min={1}
          max={40}
          step={1}
          value={limit}
          onChange={handleLimitChange}
        />
      </label>

      <section className="grid shrink-0 grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-400">Pairs returned</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-white">
            {data?.attacks.length ?? "—"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-400">Arcs displayed</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-cyan-300">
            {data?.arcs.length ?? "—"}
          </p>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Top country pairs
          </h3>
          {loading && (
            <span className="text-xs text-cyan-300">Updating…</span>
          )}
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300"
          >
            {error}
          </p>
        ) : data?.attacks.length ? (
          <ol className="country-pairs-scrollbar min-h-0 flex-1 divide-y divide-white/[0.07] overflow-y-auto">
            {data.attacks.map((attack, index) => (
              <li
                key={`${attack.originCountryName}-${attack.targetCountryName}-${index}`}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {attack.originCountryName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    to {attack.targetCountryName}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-white/[0.06] px-2 py-1 text-xs tabular-nums text-slate-300">
                  {formatValue(attack.value)}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-400">
            {loading
              ? "Loading country-pair data…"
              : "No country pairs available."}
          </p>
        )}
      </section>

      <p className="shrink-0 text-xs text-slate-500">
        {data
          ? `Updated ${new Date(data.updatedAt).toLocaleTimeString()} · refreshes every 5 minutes`
          : "Data refreshes every 5 minutes"}
      </p>
    </aside>
  );
}
