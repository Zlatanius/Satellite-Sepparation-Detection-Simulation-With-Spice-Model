"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import type { StackDerived } from "./types";
import { formatMs } from "./format";

export default function StackSummary({ derived }: { derived: StackDerived }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 }}
    >
      <div className="sticky top-6 rounded-2xl border border-purple-500/15 bg-[#0b0716]/70 p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-2 text-purple-100">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium">Summary</div>
            <div className="text-xs text-zinc-400">Live derived totals</div>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <Stat label="Columns" value={derived.columns.toString()} />
          <Stat label="Satellites" value={derived.satellites.toString()} />
          <Stat label="Brackets" value={derived.brackets.toString()} />
          <Stat label="Releases" value={derived.releases.toString()} />
          <Stat label="Sim end" value={formatMs(derived.simEndMs)} />
        </div>
      </div>
    </motion.div>
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
