"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StackShell from "@/app/features/stack-config/StackShell";
import SimulationHeader from "@/app/features/sim-results/SimulationHeader";
import SatelliteOverview from "@/app/features/sim-results/SatelliteOverview";
import VoltageGraphs from "@/app/features/sim-results/VoltageGraphs";
import { generateMockSimulationResults } from "@/app/features/sim-results/mockData";
import type { SimulationResults } from "@/app/features/sim-results/types";

export default function SimulationResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SimulationResults | null>(null);

  useEffect(() => {
    const config = {
      rows: parseInt(searchParams.get("rows") || "3"),
      cols: parseInt(searchParams.get("cols") || "3"),
      layers: parseInt(searchParams.get("layers") || "3"),
      releaseStepMs: parseInt(searchParams.get("releaseStepMs") || "10"),
      supplyVoltage: parseFloat(searchParams.get("supplyVoltage") || "5"),
      resistorValue: searchParams.get("resistorValue") || "10k",
    };

    const mockResults = generateMockSimulationResults(config);
    setResults(mockResults);
  }, [searchParams]);

  if (!results) {
    return (
      <StackShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-lg text-purple-100">
              Loading simulation results...
            </div>
            <div className="text-sm text-zinc-400">
              Preparing your data visualization
            </div>
          </div>
        </div>
      </StackShell>
    );
  }

  return (
    <StackShell>
      <SimulationHeader />

      <div className="mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="mt-8 space-y-6">
          <SatelliteOverview
            satellites={results.satellites}
            config={results.config}
          />
          <VoltageGraphs measurements={results.measurements} />
        </div>

        <footer className="mt-10 text-xs text-zinc-500">
          Deep-purple theme • Simulation visualization • Mock data for frontend
        </footer>
      </div>
    </StackShell>
  );
}
