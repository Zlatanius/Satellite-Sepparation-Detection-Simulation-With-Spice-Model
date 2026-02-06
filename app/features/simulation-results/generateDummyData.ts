export type DataPoint = { time: number; voltage: number };

/**
 * Generates placeholder time-series data for a measurement point.
 * Each measurement point gets a slightly different waveform so the
 * graphs look distinct during development.
 */
export function generateDummyData(
  row: number,
  col: number,
  point: number,
  numPoints = 200,
): DataPoint[] {
  const data: DataPoint[] = [];
  const seed = row * 100 + col * 10 + point;
  const stepTime = 10 + seed * 0.3;
  const amplitude = 3 + (seed % 5) * 0.4;

  for (let i = 0; i < numPoints; i++) {
    const time = i * 0.5;
    const t = time - stepTime;
    // Sigmoid-like step response with some ringing
    const step = t > 0 ? amplitude * (1 - Math.exp(-t / 3)) : 0;
    const ringing =
      t > 0 ? 0.3 * Math.sin(t * (2 + point * 0.5)) * Math.exp(-t / 5) : 0;
    const noise = (Math.sin(seed * i * 0.1) * 0.05);
    data.push({ time, voltage: Math.max(0, step + ringing + noise) });
  }

  return data;
}
