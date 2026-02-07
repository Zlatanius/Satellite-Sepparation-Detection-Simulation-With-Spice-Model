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
  config: {
    rows: number;
    cols: number;
    layers: number;
    releaseStepMs: number;
    supplyVoltage: number;
    resistorValue: string;
  };
  satellites: SatelliteRelease[];
  measurements: ColumnMeasurements[];
  rawOutput?: string;
};
