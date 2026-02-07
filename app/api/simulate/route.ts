import { exec } from "child_process";
import fs from "fs";
import path from "path";

import generateNetlist from "../generateNetlist";
import type { StackConfig } from "@/app/features/stack-config/types";
import type {
  SimulationResults,
  SatelliteRelease,
  ColumnMeasurements,
  VoltageData,
} from "@/app/features/sim-results/types";

function parseMeasurementsFile(
  filePath: string,
  config: StackConfig,
): ColumnMeasurements[] {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.trim().split("\n");

  // Parse data lines (skip empty lines)
  const dataLines = lines.filter((line) => line.trim().length > 0);

  // Format is: time1 voltage1 time2 voltage2 time3 voltage3 ...
  // where time1 == time2 == time3 for each row (timestep)
  const timeValues: number[] = [];
  const voltageColumns: number[][] = [];

  for (const line of dataLines) {
    const values = line.trim().split(/\s+/).map(Number);

    // Parse pairs of (time, voltage)
    // Each pair represents one measurement point
    let time = 0;
    const voltages: number[] = [];

    for (let i = 0; i < values.length; i += 2) {
      if (i === 0) {
        time = values[i]; // Get time from first pair
      }
      if (i + 1 < values.length) {
        voltages.push(values[i + 1]); // Get voltage from pair
      }
    }

    timeValues.push(time);

    // Store voltages in columns
    for (let i = 0; i < voltages.length; i++) {
      if (!voltageColumns[i]) {
        voltageColumns[i] = [];
      }
      voltageColumns[i].push(voltages[i]);
    }
  }

  // Group measurements by satellite column (4 measurements per column)
  const totalColumns = config.size * config.size;
  const measurements: ColumnMeasurements[] = [];

  for (let colNum = 1; colNum <= totalColumns; colNum++) {
    const columnId = `col-${colNum}`;
    const row = Math.floor((colNum - 1) / config.size) + 1;
    const col = ((colNum - 1) % config.size) + 1;
    const columnLabel = `${row}-${col}`;

    // Get the 4 measurements for this column
    const startIdx = (colNum - 1) * 4;
    const measurements1 = voltageColumns[startIdx] || [];
    const measurements2 = voltageColumns[startIdx + 1] || [];
    const measurements3 = voltageColumns[startIdx + 2] || [];
    const measurements4 = voltageColumns[startIdx + 3] || [];

    // Average the 4 measurements at each time point
    const data: VoltageData[] = timeValues.map((time, idx) => {
      const avg =
        (measurements1[idx] +
          measurements2[idx] +
          measurements3[idx] +
          measurements4[idx]) /
        4;
      return { timeMs: time * 1000, voltage: avg }; // Convert time to ms
    });

    measurements.push({
      columnId,
      columnLabel,
      data,
    });
  }

  return measurements;
}

function generateSatelliteReleases(config: StackConfig): SatelliteRelease[] {
  const satellites: SatelliteRelease[] = [];
  let releaseTime = 0;
  let satId = 1;

  for (let layer = 1; layer <= config.layers; layer++) {
    for (let row = 1; row <= config.size; row++) {
      for (let col = 1; col <= config.size; col++) {
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

  return satellites;
}

export async function POST(req: Request) {
  console.log("Received simulation request");
  const config: StackConfig = await req.json();
  const netlist: string = generateNetlist(config);

  fs.writeFileSync("/tmp/test.cir", netlist);

  return new Promise((resolve) => {
    exec("ngspice -b /tmp/test.cir", (err, stdout) => {
      if (err) {
        console.error("Simulation error:", err);
        resolve(Response.json({ error: err.message }, { status: 500 }));
        return;
      }

      try {
        // Read and parse the measurements file
        const measurementsPath = path.join(
          process.cwd(),
          "app/simulation/mes_voltages.dat",
        );

        if (!fs.existsSync(measurementsPath)) {
          throw new Error("Measurements file not found");
        }

        const measurements = parseMeasurementsFile(measurementsPath, config);
        const satellites = generateSatelliteReleases(config);

        // Debug logging
        console.log(`Parsed ${measurements.length} column measurements`);
        if (measurements.length > 0) {
          console.log(`First column has ${measurements[0].data.length} data points`);
          console.log(
            `Sample data points:`,
            measurements[0].data.slice(0, 5).map((d) => ({
              time: d.timeMs,
              voltage: d.voltage,
            })),
          );
        }

        const results: SimulationResults = {
          config,
          satellites,
          measurements,
          rawOutput: stdout,
        };

        resolve(Response.json(results));
      } catch (parseError) {
        console.error("Parse error:", parseError);
        resolve(
          Response.json(
            {
              error:
                parseError instanceof Error
                  ? parseError.message
                  : "Failed to parse simulation results",
            },
            { status: 500 },
          ),
        );
      }
    });
  });
}
