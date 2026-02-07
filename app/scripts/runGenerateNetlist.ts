import fs from "fs";
import generateNetlist from "../api/generateNetlist";
import type { StackConfig } from "../features/stack-config/types";

const cfg: StackConfig = {
  size: 3,
  layers: 3,
  releaseStepMs: 10,
  supplyVoltage: 5,
  resistorValue: "10k",
};

const netlist = generateNetlist(cfg);
// console.log(netlist);
fs.writeFileSync("netlist.spice", netlist);
console.log("Wrote netlist.spice");
