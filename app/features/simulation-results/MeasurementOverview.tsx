"use client";

import { Activity } from "lucide-react";

type Props = {
  rows: number;
  cols: number;
  selectedRow: number;
  selectedCol: number;
  onSelect: (row: number, col: number) => void;
};

export default function MeasurementOverview({
  rows,
  cols,
  selectedRow,
  selectedCol,
  onSelect,
}: Props) {
  return (
    <div className="rounded-2xl border border-purple-500/15 bg-[#0b0716]/70 p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-2 text-purple-100">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-medium">All Measurement Points</div>
          <div className="text-xs text-zinc-400">
            Click a column to view its graphs
          </div>
        </div>
      </div>

      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const row = r + 1;
            const col = c + 1;
            const isSelected = row === selectedRow && col === selectedCol;

            return (
              <button
                key={`${row}-${col}`}
                onClick={() => onSelect(row, col)}
                className={`group relative rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? "border-purple-500/40 bg-purple-500/15 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                    : "border-purple-500/10 bg-black/20 hover:border-purple-500/25 hover:bg-purple-500/5"
                }`}
              >
                <div className="text-xs font-medium text-purple-200/80">
                  ({row},{col})
                </div>
                <div className="mt-1.5 flex flex-col gap-1">
                  {[1, 2, 3, 4].map((p) => (
                    <div
                      key={p}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[10px] text-zinc-500">
                        MES {p}
                      </span>
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-purple-400" : "bg-purple-500/30"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
