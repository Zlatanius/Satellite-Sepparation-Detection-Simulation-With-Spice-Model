"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Layers, Ruler, Zap, Timer, Cable, Play } from "lucide-react";

type StackConfig = {
  size: number; // rows = cols = size
  layers: number;
  releaseStepMs: number;
  supplyVoltage: number;
  resistorValueOhms: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatOhms(ohms: number) {
  if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(2)} MΩ`;
  if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(2)} kΩ`;
  return `${ohms.toFixed(0)} Ω`;
}

function formatMs(ms: number) {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)} s`;
  return `${ms.toFixed(0)} ms`;
}

export default function Page() {
  const [cfg, setCfg] = useState<StackConfig>({
    size: 3,
    layers: 3,
    releaseStepMs: 10,
    supplyVoltage: 5,
    resistorValueOhms: 10_000,
  });

  const [busy, setBusy] = useState(false);

  const derived = useMemo(() => {
    const columns = cfg.size * cfg.size;
    const bracketsPerSatellite = 4;
    const satellites = columns * cfg.layers;
    const brackets = satellites * bracketsPerSatellite;

    const releases = columns * cfg.layers;
    const simEndMs = releases * cfg.releaseStepMs;

    return { columns, satellites, brackets, releases, simEndMs };
  }, [cfg]);

  async function runSimulation() {
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 450));
      alert(
        `Config saved!\n\nSize: ${cfg.size}×${cfg.size}\nLayers: ${cfg.layers}\nRelease step: ${cfg.releaseStepMs} ms\nVsup: ${cfg.supplyVoltage} V\nRref: ${formatOhms(cfg.resistorValueOhms)}`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#05020b] text-zinc-100">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute bottom-[-240px] right-[-160px] h-[520px] w-[520px] rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute top-[30%] left-[-240px] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-3"
        >
          <div className="inline-flex items-center gap-2 text-purple-200/90">
            <Settings className="h-5 w-5" />
            <span className="text-sm tracking-wide">
              Umbilical Separation Simulator
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Stack configuration
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-300/90">
            Define the stack geometry and electrical parameters.
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left: controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="lg:col-span-2"
          >
            {/* Geometry */}
            <div className="rounded-2xl border border-purple-500/15 bg-[#0b0716]/70 p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-200" />
                  <h2 className="text-base font-medium">Geometry</h2>
                </div>
                <div className="text-xs text-zinc-400">
                  Square stack (N × N)
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Stack size"
                  help="Rows and columns are always equal"
                  icon={<Ruler className="h-4 w-4" />}
                  value={cfg.size}
                  min={1}
                  max={12}
                  step={1}
                  renderValue={(v) => `${v} × ${v}`}
                  onChange={(v) =>
                    setCfg((c) => ({ ...c, size: clamp(Math.round(v), 1, 12) }))
                  }
                />
                <NumberField
                  label="Stack height (layers)"
                  icon={<Layers className="h-4 w-4" />}
                  value={cfg.layers}
                  min={1}
                  max={20}
                  step={1}
                  onChange={(v) =>
                    setCfg((c) => ({
                      ...c,
                      layers: clamp(Math.round(v), 1, 20),
                    }))
                  }
                />
              </div>
            </div>

            {/* Release timing */}
            <div className="mt-6 rounded-2xl border border-purple-500/15 bg-[#0b0716]/70 p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-purple-200" />
                  <h2 className="text-base font-medium">Release timing</h2>
                </div>
                <div className="text-xs text-zinc-400">
                  One release per step
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Release period"
                  icon={<Timer className="h-4 w-4" />}
                  value={cfg.releaseStepMs}
                  min={1}
                  max={5000}
                  step={1}
                  suffix="ms"
                  onChange={(v) =>
                    setCfg((c) => ({
                      ...c,
                      releaseStepMs: clamp(Math.round(v), 1, 5000),
                    }))
                  }
                />
                <div className="rounded-xl border border-purple-500/10 bg-black/20 p-4">
                  <div className="text-xs text-zinc-400">
                    Estimated sim length
                  </div>
                  <div className="mt-1 text-lg font-semibold text-purple-100">
                    {formatMs(derived.simEndMs)}
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    Releases: {derived.releases}
                  </div>
                </div>
              </div>
            </div>

            {/* Electrical */}
            <div className="mt-6 rounded-2xl border border-purple-500/15 bg-[#0b0716]/70 p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-200" />
                  <h2 className="text-base font-medium">Electrical</h2>
                </div>
                <div className="text-xs text-zinc-400">
                  Supply + reference resistor
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Supply voltage"
                  icon={<Zap className="h-4 w-4" />}
                  value={cfg.supplyVoltage}
                  min={0.1}
                  max={28}
                  step={0.1}
                  suffix="V"
                  onChange={(v) =>
                    setCfg((c) => ({
                      ...c,
                      supplyVoltage: clamp(Number(v), 0.1, 28),
                    }))
                  }
                />

                <NumberField
                  label="Reference resistance"
                  icon={<Cable className="h-4 w-4" />}
                  value={cfg.resistorValueOhms}
                  min={1}
                  max={1e7}
                  step={1}
                  suffix="Ω"
                  onChange={(v) =>
                    setCfg((c) => ({
                      ...c,
                      resistorValueOhms: clamp(Math.round(v), 1, 10_000_000),
                    }))
                  }
                />
              </div>

              <div className="mt-3 rounded-xl border border-purple-500/10 bg-black/20 p-4">
                <div className="text-xs text-zinc-400">Formatted</div>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-purple-100">
                      V = {cfg.supplyVoltage.toFixed(2)} V
                    </span>
                    <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-purple-100">
                      Rref = {formatOhms(cfg.resistorValueOhms)}
                    </span>
                  </div>
                  <button
                    onClick={runSimulation}
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-500/25 bg-gradient-to-b from-purple-500/25 to-purple-700/10 px-4 py-2 text-sm font-medium text-purple-50 shadow-[0_0_0_1px_rgba(168,85,247,0.12)] transition hover:from-purple-500/30 hover:to-purple-700/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Play className="h-4 w-4" />
                    {busy ? "Preparing…" : "Simulate Stack"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-6 rounded-2xl border border-purple-500/15 bg-[#0b0716]/70 p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-2 text-purple-100">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Summary</div>
                  <div className="text-xs text-zinc-400">
                    Live derived totals
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <Stat label="Columns" value={derived.columns.toString()} />
                <Stat
                  label="Satellites"
                  value={derived.satellites.toString()}
                />
                <Stat label="Brackets" value={derived.brackets.toString()} />
                <Stat label="Releases" value={derived.releases.toString()} />
                <Stat label="Sim end" value={formatMs(derived.simEndMs)} />
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-10 text-xs text-zinc-500">
          Deep-purple theme • Next.js App Router • Client-side config form
        </footer>
      </div>
    </div>
  );
}

function NumberField(props: {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  help?: string;
  renderValue?: (value: number) => string;
  onChange: (value: number) => void;
}) {
  const {
    label,
    icon,
    value,
    min,
    max,
    step,
    suffix,
    help,
    renderValue,
    onChange,
  } = props;

  return (
    <div className="rounded-xl border border-purple-500/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <span className="text-purple-200">{icon}</span>
            <span>{label}</span>
          </div>
          {help ? (
            <div className="mt-1 text-[11px] text-zinc-500">{help}</div>
          ) : null}
        </div>

        <div className="text-xs text-zinc-400">
          {renderValue ? renderValue(value) : value}
          {suffix ? ` ${suffix}` : ""}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          className="w-full rounded-lg border border-purple-500/15 bg-[#070312] px-3 py-2 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-purple-400/35 focus:outline-none"
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix ? (
          <div className="rounded-lg border border-purple-500/15 bg-[#070312] px-2 py-2 text-xs text-zinc-300">
            {suffix}
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
        <span>min {min}</span>
        <span>max {max}</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-purple-500/10 bg-black/20 px-4 py-3">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-sm font-semibold text-purple-100">{value}</div>
    </div>
  );
}
