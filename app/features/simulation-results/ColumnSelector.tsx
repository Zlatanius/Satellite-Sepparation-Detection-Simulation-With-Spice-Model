"use client";

import { ChevronDown } from "lucide-react";

type Props = {
  rows: number;
  cols: number;
  selectedRow: number;
  selectedCol: number;
  onChange: (row: number, col: number) => void;
};

export default function ColumnSelector({
  rows,
  cols,
  selectedRow,
  selectedCol,
  onChange,
}: Props) {
  const columns: { row: number; col: number; label: string }[] = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      columns.push({ row: r, col: c, label: `Column (${r}, ${c})` });
    }
  }

  return (
    <div className="relative">
      <select
        value={`${selectedRow}-${selectedCol}`}
        onChange={(e) => {
          const [r, c] = e.target.value.split("-").map(Number);
          onChange(r, c);
        }}
        className="w-full appearance-none rounded-xl border border-purple-500/20 bg-[#0b0716]/70 px-4 py-2.5 pr-10 text-sm font-medium text-purple-100 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur transition hover:border-purple-500/30 focus:border-purple-500/40 focus:outline-none"
      >
        {columns.map(({ row, col, label }) => (
          <option
            key={`${row}-${col}`}
            value={`${row}-${col}`}
            className="bg-[#0b0716] text-purple-100"
          >
            {label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300/60" />
    </div>
  );
}
