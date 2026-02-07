import type { SimulationResults, SatelliteRelease, ColumnMeasurements } from "./types";

export function generateMockSimulationResults(config: {
  rows: number;
  cols: number;
  layers: number;
  releaseStepMs: number;
  supplyVoltage: number;
  resistorValue: string;
}): SimulationResults {
  const satellites: SatelliteRelease[] = [];
  const measurements: ColumnMeasurements[] = [];

  let releaseTime = 0;
  let satId = 1;

  for (let layer = 1; layer <= config.layers; layer++) {
    for (let row = 1; row <= config.rows; row++) {
      for (let col = 1; col <= config.cols; col++) {
        satellites.push({
          id: `SAT-${satId.toString().padStart(3, "0")}`,
          column: col,
          row,
          layer,
          releaseTimeMs: releaseTime,
        });
        satId++;
      }
      releaseTime += config.releaseStepMs;
    }
  }

  for (let col = 1; col <= config.cols; col++) {
    const columnData: ColumnMeasurements = {
      columnId: `col-${col}`,
      columnLabel: `Column ${col}`,
      data: [],
    };

    const totalTime = releaseTime;
    const steps = Math.min(100, totalTime);

    for (let i = 0; i <= steps; i++) {
      const timeMs = (i / steps) * totalTime;
      const baseVoltage = config.supplyVoltage;
      const noise = (Math.random() - 0.5) * 0.1;
      const decay = Math.exp(-timeMs / (totalTime * 0.5));
      const voltage = baseVoltage * (0.3 + 0.7 * decay) + noise;

      columnData.data.push({
        timeMs: Math.round(timeMs),
        voltage: Math.max(0, voltage),
      });
    }

    measurements.push(columnData);
  }

  return {
    config,
    satellites,
    measurements,
  };
}
