type StackConfig = {
  rows: number; // 3
  cols: number; // 3
  layers: number; // 3 satellites per column
  releaseStepMs: number; // e.g. 10
  supplyVoltage: number; // e.g. 5
  resistorValue: string; // "10k"
};

export default StackConfig;
