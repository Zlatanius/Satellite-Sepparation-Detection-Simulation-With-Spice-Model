"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Ruler, Timer, Zap, Cable, Play } from "lucide-react";

import SectionCard from "@/app/components/SectionCard";
import NumberField from "@/app/components/NumberField";

import type StackConfig from "@/app/models/SatelliteStack";
import type { StackDerived } from "./types";
import { clamp, formatMs, formatOhms } from "./format";

type Props = {
  cfg: StackConfig;
  setCfg: React.Dispatch<React.SetStateAction<StackConfig>>;
  derived: StackDerived;
};

export default function StackConfigForm({ cfg, setCfg, derived }: Props) {
  const [busy, setBusy] = useState(false);

  async function simulateStack() {
    // Placeholder: wire to API route later.
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 450));
      alert(
        `Config saved!\n\nRows: ${cfg.rows}\nCols: ${cfg.cols}\nLayers: ${cfg.layers}\nRelease step: ${cfg.releaseStepMs} ms\nRref: ${cfg.resistorValue}`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="space-y-6"
    >
      <SectionCard
        title="Geometry"
        subtitle="Square stack (N × N)"
        icon={<Layers className="h-5 w-5" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Rows"
            help="Number of rows in the stack"
            icon={<Ruler className="h-4 w-4" />}
            value={cfg.rows}
            min={1}
            max={12}
            step={1}
            onChange={(v) =>
              setCfg((c) => ({
                ...c,
                rows: clamp(Math.round(v), 1, 12),
              }))
            }
          />

          <NumberField
            label="Columns"
            help="Number of columns in the stack"
            icon={<Ruler className="h-4 w-4" />}
            value={cfg.cols}
            min={1}
            max={12}
            step={1}
            onChange={(v) =>
              setCfg((c) => ({
                ...c,
                cols: clamp(Math.round(v), 1, 12),
              }))
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
      </SectionCard>

      <SectionCard
        title="Release timing"
        subtitle="One release per step"
        icon={<Timer className="h-5 w-5" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="text-xs text-zinc-400">Estimated sim length</div>
            <div className="mt-1 text-lg font-semibold text-purple-100">
              {formatMs(derived.simEndMs)}
            </div>
            <div className="mt-1 text-xs text-zinc-400">
              Releases: {derived.releases}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Electrical"
        subtitle="Supply + reference resistor"
        icon={<Zap className="h-5 w-5" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
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
            value={0}
            min={1}
            max={1e7}
            step={1}
            suffix="Ω"
            onChange={(v) =>
              setCfg((c) => ({
                ...c,
                resistorValue: v.toString(),
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
                Rref = {cfg.resistorValue}
              </span>
            </div>

            <button
              onClick={simulateStack}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-500/25 bg-gradient-to-b from-purple-500/25 to-purple-700/10 px-4 py-2 text-sm font-medium text-purple-50 shadow-[0_0_0_1px_rgba(168,85,247,0.12)] transition hover:from-purple-500/30 hover:to-purple-700/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Play className="h-4 w-4" />
              {busy ? "Preparing…" : "Simulate Stack"}
            </button>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
}
