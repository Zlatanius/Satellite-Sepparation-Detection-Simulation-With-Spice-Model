"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StackShell from "@/app/features/stack-config/StackShell";
import SimulationHeader from "@/app/features/sim-results/SimulationHeader";
import StackVisualization3D from "@/app/features/sim-results/StackVisualization3D";
import SatelliteOverview from "@/app/features/sim-results/SatelliteOverview";
import VoltageGraphs from "@/app/features/sim-results/VoltageGraphs";
import { generateMockSimulationResults } from "@/app/features/sim-results/mockData";
import type { SimulationResults } from "@/app/features/sim-results/types";

export default function SimulationResultsPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [selectedColumnLabel, setSelectedColumnLabel] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check if we have real simulation results in sessionStorage
    const storedResults = sessionStorage.getItem("simulationResults");

    if (storedResults) {
      // Use real simulation results
      const parsedResults: SimulationResults = JSON.parse(storedResults);
      console.log("Loaded simulation results:", {
        numColumns: parsedResults.measurements.length,
        firstColumnDataPoints: parsedResults.measurements[0]?.data.length,
        sampleData: parsedResults.measurements[0]?.data.slice(0, 5),
      });
      setResults(parsedResults);
    } else {
      // Fallback to mock data if no simulation results available
      const config = {
        size: parseInt(searchParams.get("size") || "3"),
        layers: parseInt(searchParams.get("layers") || "3"),
        releaseStepMs: parseInt(searchParams.get("releaseStepMs") || "10"),
        supplyVoltage: parseFloat(searchParams.get("supplyVoltage") || "5"),
        resistorValue: searchParams.get("resistorValue") || "10k",
      };

      const mockResults = generateMockSimulationResults(config);
      setResults(mockResults);
    }
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
          <StackVisualization3D
            config={results.config}
            onColumnClick={setSelectedColumnLabel}
          />
          <SatelliteOverview
            satellites={results.satellites}
            config={results.config}
          />
          <VoltageGraphs
            measurements={results.measurements}
            config={results.config}
            selectedColumnLabel={selectedColumnLabel}
          />
        </div>

        <footer className="mt-10 text-xs text-zinc-500">
          Deep-purple theme • Simulation visualization • Mock data for frontend
        </footer>
      </div>
    </StackShell>
  );
}
