export type StackConfig = {
  size: number; // rows = cols = size
  layers: number;
  releaseStepMs: number;
  supplyVoltage: number;
  resistorValueOhms: number;
};

export type StackDerived = {
  columns: number;
  satellites: number;
  brackets: number;
  releases: number;
  simEndMs: number;
};
