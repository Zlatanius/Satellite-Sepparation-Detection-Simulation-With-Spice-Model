"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LineChart as LineChartIcon, ChevronDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import SectionCard from "@/app/components/SectionCard";
import type { ColumnMeasurements } from "./types";
import type { StackConfig } from "@/app/features/stack-config/types";

type Props = {
  measurements: ColumnMeasurements[];
  config: StackConfig;
  selectedColumnLabel?: string;
};

function VoltageChart({
  data,
}: {
  data: { timeMs: number; voltage: number }[];
}) {
  if (data.length === 0) return null;

  console.log(`VoltageChart rendering with ${data.length} data points`, {
    firstPoint: data[0],
    lastPoint: data[data.length - 1],
    sample: data.slice(0, 5),
  });

  return (
    <div className="w-full" style={{ height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
        >
          <defs>
            <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(168, 85, 247, 0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="timeMs"
            stroke="rgba(168, 85, 247, 0.5)"
            tick={{ fill: "rgba(168, 85, 247, 0.7)", fontSize: 12 }}
            label={{
              value: "Time (ms)",
              position: "insideBottom",
              offset: -20,
              fill: "rgba(168, 85, 247, 0.7)",
              fontSize: 13,
            }}
          />
          <YAxis
            stroke="rgba(168, 85, 247, 0.5)"
            tick={{ fill: "rgba(168, 85, 247, 0.7)", fontSize: 12 }}
            label={{
              value: "Voltage (V)",
              angle: -90,
              position: "insideLeft",
              fill: "rgba(168, 85, 247, 0.7)",
              fontSize: 13,
            }}
            domain={[0, "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(11, 7, 22, 0.95)",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "8px",
              color: "#e9d5ff",
            }}
            labelStyle={{ color: "#a855f7" }}
            formatter={(value: any) => [
              `${Number(value).toFixed(4)} V`,
              "Voltage",
            ]}
            labelFormatter={(label: any) => `Time: ${Number(label).toFixed(2)} ms`}
          />
          <Area
            type="monotone"
            dataKey="voltage"
            stroke="none"
            fill="url(#colorVoltage)"
          />
          <Line
            type="monotone"
            dataKey="voltage"
            stroke="#a855f7"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: "#a855f7" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function VoltageGraphs({ measurements, config, selectedColumnLabel }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Generate all possible column IDs based on stack configuration
  const allColumns = useMemo(() => {
    const totalColumns = config.size * config.size;
    return Array.from({ length: totalColumns }, (_, i) => {
      const columnNum = i + 1;
      const columnId = `col-${columnNum}`;
      // Convert to row-col format (1-1, 1-2, etc.)
      const row = Math.floor(i / config.size) + 1;
      const col = (i % config.size) + 1;
      const columnLabel = `${row}-${col}`;
      const hasMeasurements = measurements.some((m) => m.columnId === columnId);

      return {
        columnId,
        columnLabel,
        hasMeasurements,
      };
    });
  }, [config.size, measurements]);

  const [selectedColumn, setSelectedColumn] = useState<string>(
    allColumns[0]?.columnId || "",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Convert row-col label (e.g., "1-1") to column ID (e.g., "col-1")
  const labelToColumnId = (label: string): string => {
    const [rowStr, colStr] = label.split("-");
    const row = parseInt(rowStr) - 1; // Convert to 0-indexed
    const col = parseInt(colStr) - 1; // Convert to 0-indexed
    const columnIndex = row * config.size + col + 1; // 1-indexed column number
    return `col-${columnIndex}`;
  };

  // Handle external column selection
  useEffect(() => {
    if (selectedColumnLabel) {
      const columnId = labelToColumnId(selectedColumnLabel);
      setSelectedColumn(columnId);
      setIsDropdownOpen(false);
      // Scroll to the graph section with smooth behavior
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [selectedColumnLabel, config.size]);

  const currentMeasurement = measurements.find(
    (m) => m.columnId === selectedColumn,
  );

  const currentColumnInfo = allColumns.find(
    (c) => c.columnId === selectedColumn,
  );

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 }}
    >
      <SectionCard
        title="Voltage measurements"
        subtitle="Time-series data"
        icon={<LineChartIcon className="h-5 w-5" />}
      >
        <div className="mb-6">
          <label className="mb-2 block text-xs text-zinc-400">
            Select column
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-full items-center justify-between rounded-xl border border-purple-500/20 bg-black/30 px-4 py-3 text-sm font-medium text-purple-100 transition hover:border-purple-500/30 hover:bg-black/40"
            >
              <span>
                {currentColumnInfo?.columnLabel || "Select a column"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-purple-500/20 bg-[#0b0716]/95 shadow-xl backdrop-blur"
              >
                {allColumns.map((column) => (
                  <button
                    key={column.columnId}
                    onClick={() => {
                      setSelectedColumn(column.columnId);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition hover:bg-purple-500/10 ${
                      selectedColumn === column.columnId
                        ? "bg-purple-500/15 font-medium text-purple-100"
                        : column.hasMeasurements
                          ? "text-zinc-300"
                          : "text-zinc-500"
                    }`}
                  >
                    <span>{column.columnLabel}</span>
                    {!column.hasMeasurements && (
                      <span className="ml-2 text-xs text-zinc-600">
                        (no data)
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {currentMeasurement ? (
          <div className="rounded-xl border border-purple-500/10 bg-black/20 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-purple-100">
                  Column {currentColumnInfo?.columnLabel}
                </div>
                <div className="text-xs text-zinc-400">
                  {currentMeasurement.data.length} data points
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-zinc-400">Max:</span>
                <span className="text-sm font-semibold text-purple-100">
                  {Math.max(...currentMeasurement.data.map((d) => d.voltage)).toFixed(2)} V
                </span>
              </div>
            </div>

            <VoltageChart data={currentMeasurement.data} />

            <div className="mt-4 text-center text-xs text-zinc-500">
              Hover over the graph to see detailed values
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-purple-500/10 bg-black/20 p-12 text-center">
            <LineChartIcon className="mx-auto mb-3 h-10 w-10 text-purple-500/30" />
            <p className="text-sm text-zinc-400">
              No measurement data available for {currentColumnInfo?.columnLabel}
            </p>
          </div>
        )}
      </SectionCard>
    </motion.div>
  );
}
