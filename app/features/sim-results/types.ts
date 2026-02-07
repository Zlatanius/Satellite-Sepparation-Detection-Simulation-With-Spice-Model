import type { StackConfig } from "@/app/features/stack-config/types";

export type SatelliteRelease = {
  id: string;
  column: number;
  row: number;
  layer: number;
  releaseTimeMs: number;
};

export type VoltageData = {
  timeMs: number;
  voltage: number;
};

export type ColumnMeasurements = {
  columnId: string;
  columnLabel: string;
  data: VoltageData[];
};

export type SimulationResults = {
  config: StackConfig;
  satellites: SatelliteRelease[];
  measurements: ColumnMeasurements[];
  rawOutput?: string;
};
