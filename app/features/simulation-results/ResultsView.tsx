"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3 } from "lucide-react";
import ColumnSelector from "./ColumnSelector";
import MeasurementChart from "./MeasurementChart";
import MeasurementOverview from "./MeasurementOverview";
import { generateDummyData } from "./generateDummyData";

const CHART_COLORS = ["#a78bfa", "#f0abfc", "#67e8f9", "#fbbf24"];
const POINT_LABELS = [
  "Measurement Point 1",
  "Measurement Point 2",
  "Measurement Point 3",
  "Measurement Point 4",
];

type Props = {
  rows: number;
  cols: number;
  onBack: () => void;
};

export default function ResultsView({ rows, cols, onBack }: Props) {
  const [selectedRow, setSelectedRow] = useState(1);
  const [selectedCol, setSelectedCol] = useState(1);

  const chartData = useMemo(
    () =>
      [1, 2, 3, 4].map((point) =>
        generateDummyData(selectedRow, selectedCol, point),
      ),
    [selectedRow, selectedCol],
  );

  function handleColumnChange(row: number, col: number) {
    setSelectedRow(row);
    setSelectedCol(col);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-3"
      >
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-purple-200/70 transition hover:text-purple-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to configuration
        </button>

        <div className="inline-flex items-center gap-2 text-purple-200/90">
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm tracking-wide">
            Umbilical Separation Simulator
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Simulation Results
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-300/90">
          Viewing measurement point voltages for a {rows}&times;{cols} stack.
          Select a column to see its 4 measurement graphs.
        </p>
      </motion.div>

      {/* Main content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left: column selector + charts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Column selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-zinc-300">
              Column:
            </label>
            <div className="w-56">
              <ColumnSelector
                rows={rows}
                cols={cols}
                selectedRow={selectedRow}
                selectedCol={selectedCol}
                onChange={handleColumnChange}
              />
            </div>
          </div>

          {/* 4 measurement charts in a 2x2 grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <MeasurementChart
                key={`${selectedRow}-${selectedCol}-${i}`}
                title={`${POINT_LABELS[i]} — MES_${selectedRow}_${selectedCol}_${i + 1}`}
                data={chartData[i]}
                color={CHART_COLORS[i]}
              />
            ))}
          </div>
        </motion.div>

        {/* Right: overview grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-6">
            <MeasurementOverview
              rows={rows}
              cols={cols}
              selectedRow={selectedRow}
              selectedCol={selectedCol}
              onSelect={handleColumnChange}
            />
          </div>
        </motion.div>
      </div>

      <footer className="mt-10 text-xs text-zinc-500">
        Deep-purple theme &bull; Placeholder data &bull; Select a column to
        update graphs
      </footer>
    </div>
  );
}
