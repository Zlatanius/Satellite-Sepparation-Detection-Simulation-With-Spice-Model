"use client";

import React from "react";
import { motion } from "framer-motion";
import { Satellite, Clock, Layers, Grid3x3 } from "lucide-react";
import SectionCard from "@/app/components/SectionCard";
import type { SatelliteRelease } from "./types";
import type { StackConfig } from "@/app/features/stack-config/types";

type Props = {
  satellites: SatelliteRelease[];
  config: StackConfig;
};

export default function SatelliteOverview({ satellites, config }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
    >
      <SectionCard
        title="Released satellites"
        subtitle={`${satellites.length} total`}
        icon={<Satellite className="h-5 w-5" />}
      >
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <StatCard
            icon={<Grid3x3 className="h-4 w-4" />}
            label="Satellite columns"
            value={config.rows * config.cols}
          />
          <StatCard
            icon={<Layers className="h-4 w-4" />}
            label="Layers"
            value={config.layers}
          />
          <StatCard
            icon={<Satellite className="h-4 w-4" />}
            label="Total satellites"
            value={satellites.length}
          />
        </div>

        <div className="max-h-96 overflow-y-auto rounded-xl border border-purple-500/10 bg-black/20">
          <table className="w-full text-sm">
            <thead className="sticky top-0 border-b border-purple-500/10 bg-[#0b0716]/95 text-xs text-zinc-400 backdrop-blur">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Satellite</th>
                <th className="px-4 py-3 text-left font-medium">Column</th>
                <th className="px-4 py-3 text-left font-medium">Row</th>
                <th className="px-4 py-3 text-left font-medium">Layer</th>
                <th className="px-4 py-3 text-left font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Release time
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/5">
              {satellites.map((sat, idx) => (
                <tr
                  key={sat.id}
                  className="transition hover:bg-purple-500/5"
                >
                  <td className="px-4 py-3 font-medium text-purple-100">
                    {sat.id}
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{sat.column}</td>
                  <td className="px-4 py-3 text-zinc-300">{sat.row}</td>
                  <td className="px-4 py-3 text-zinc-300">{sat.layer}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    {sat.releaseTimeMs} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-purple-500/10 bg-black/20 p-3">
      <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-2 text-purple-200">
        {icon}
      </div>
      <div>
        <div className="text-xs text-zinc-400">{label}</div>
        <div className="text-lg font-semibold text-purple-100">{value}</div>
      </div>
    </div>
  );
}
