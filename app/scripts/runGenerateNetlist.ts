import fs from "fs";
import generateNetlist from "../api/generateNetlist";
import StackConfig from "../models/SatelliteStack";

const cfg: StackConfig = {
  rows: 3,
  cols: 3,
  layers: 3,
  releaseStepMs: 10,
  supplyVoltage: 5,
  resistorValue: "10k",
};

const netlist = generateNetlist(cfg);
// console.log(netlist);
fs.writeFileSync("netlist.spice", netlist);
console.log("Wrote netlist.spice");
