export type StackConfig = {
  size: number;
  layers: number;
  releaseStepMs: number;
  supplyVoltage: number;
  resistorValue: string;
};

export type StackDerived = {
  columns: number;
  satellites: number;
  brackets: number;
  releases: number;
  simEndMs: number;
};
