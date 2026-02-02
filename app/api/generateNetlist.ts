import StackConfig from "../models/SatelliteStack";

export default function generateNetlist(cfg: StackConfig) {
  const { rows, cols, layers, releaseStepMs, supplyVoltage, resistorValue } =
    cfg;

  let timeIndex = 1;
  const controlSources: string[] = [];
  const columnInstances: string[] = [];
  const supplies: string[] = [];

  // --- Generate control signals ---
  for (let layer = layers; layer >= 1; layer--) {
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const ctrlName = `CTRL_L${layer}_R${r}_C${c}`;
        const t = timeIndex * releaseStepMs;

        controlSources.push(
          `V${ctrlName} ${ctrlName} 0 PWL(0 0 ${t - 1}m 0 ${t}m 5)`,
        );

        timeIndex++;
      }
    }
  }

  // --- Generate columns ---
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const colNode = `C_${r}_${c}`;

      // supply per column
      supplies.push(`V_SUP_${r}_${c} ${colNode} 0 ${supplyVoltage}`);

      // control list per column (one per layer)
      const ctrls: string[] = [];
      for (let layer = 1; layer <= layers; layer++) {
        ctrls.push(`CTRL_L${layer}_R${r}_C${c}`);
      }

      const mesPoints: string[] = [];
      for (let i = 1; i <= 4; i++) {
        mesPoints.push(`MES_${r}_${c}_${i}`);
      }

      columnInstances.push(
        `Xcol_${r}_${c} ${colNode} 0 0 0 0 ${ctrls.join(" ")} ${mesPoints.join(" ")} COLUMN RVAL=${resistorValue}`,
      );
    }
  }

  // --- Satellite controll pins ---
  const satellitesInColumn: string[] = [];

  for (let layerIndex = 1; layerIndex <= layers; layerIndex++) {
    const isLastSatellite = layerIndex === layers;
    const isFirstSatellite = layerIndex === 1;

    const sigInCurrent = isFirstSatellite
      ? ["mes1", "mes2", "mes3", "mes4"]
      : Array.from({ length: 4 }, (_, i) => `sigin${layerIndex}_${i + 1}`);

    const sigInNext = isLastSatellite
      ? ["end", "end", "end", "end"]
      : Array.from({ length: 4 }, (_, i) => `sigin${layerIndex + 1}_${i + 1}`);

    const gnds = ["gnd1", "gnd2", "gnd3", "gnd4"];

    satellitesInColumn.push(
      [
        `Xsat${layerIndex}`,
        ...sigInCurrent,
        ...sigInNext,
        ...gnds,
        `ctrl${layerIndex}`,
        "SATELLITE",
        "RVAL={RVAL}",
      ].join(" "),
    );
  }

  // --- Define Column Subcircuit ---

  const columnDef = `
.subckt COLUMN vin gnd1 gnd2 gnd3 gnd4 ${Array.from({ length: layers }, (_, i) => `ctrl${i + 1}`).join(" ")} mes1 mes2 mes3 mes4 RVAL=10k

Rref1 vin mes1 {RVAL}
Rref2 vin mes2 {RVAL}
Rref3 vin mes3 {RVAL}
Rref4 vin mes4 {RVAL}

Rend end gnd 1e12

${satellitesInColumn.join("\n")}
.ends COLUMN
`;

  // --- Voltage Measurements ---
  const printVoltages: string[] = [];

  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      for (let i = 1; i <= 4; i++) {
        printVoltages.push(`V(MES_${r}_${c}_${i})`);
      }
    }
  }

  // --- Final Netlist Assembly ---
  return `
* Umbilical separation model

.model SW SW(Ron=1e12 Roff=0.01 Vt=2 Vh=0)


* A signle bracket sub circuit
.subckt BRACKET sigin sigout gnd ctrl RVAL=10k
Sbr sigin sigout ctrl gnd SW
Rbr sigout gnd {RVAL}
.ends BRACKET


* A single satellite (4 brackets)
.subckt SATELLITE sigin1 sigin2 sigin3 sigin4 sigout1 sigout2 sigout3 sigout4 gnd1 gnd2 gnd3 gnd4 ctrl RVAL=10k
Xb1 sigin1 sigout1 gnd1 ctrl BRACKET RVAL={RVAL}
Xb2 sigin2 sigout2 gnd2 ctrl BRACKET RVAL={RVAL}
Xb3 sigin3 sigout3 gnd3 ctrl BRACKET RVAL={RVAL}
Xb4 sigin4 sigout4 gnd4 ctrl BRACKET RVAL={RVAL}
.ends SATELLITE


* A column of satellites
${columnDef}


* Top level netlist (the whole stack)
${supplies.join("\n")}

${columnInstances.join("\n")}

* ---- Release control signals ----
${controlSources.join("\n")}

.tran 0.1m ${timeIndex * releaseStepMs}m

.control
  set filetype=ascii
  run
  wrdata mes_voltages.dat ${printVoltages.join(" ")}
  quit
.endc
.end
`;
}
