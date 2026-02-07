import type { StackConfig, StackDerived } from "./types";

export function computeDerived(cfg: StackConfig): StackDerived {
  const columns = cfg.rows * cfg.cols;
  const bracketsPerSatellite = 4;
  const satellites = columns * cfg.layers;
  const brackets = satellites * bracketsPerSatellite;

  // Current assumption: one satellite released per step (column-by-column).
  const releases = columns * cfg.layers;
  const simEndMs = releases * cfg.releaseStepMs;

  return { columns, satellites, brackets, releases, simEndMs };
}
