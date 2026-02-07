"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart as LineChartIcon, ChevronDown } from "lucide-react";
import SectionCard from "@/app/components/SectionCard";
import type { ColumnMeasurements } from "./types";
import type { StackConfig } from "@/app/features/stack-config/types";

type Props = {
  measurements: ColumnMeasurements[];
  config: StackConfig;
};

function VoltageChart({
  data,
  width,
  height,
}: {
  data: { timeMs: number; voltage: number }[];
  width: number;
  height: number;
}) {
  if (data.length === 0) return null;

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minTime = Math.min(...data.map((d) => d.timeMs));
  const maxTime = Math.max(...data.map((d) => d.timeMs));
  const minVoltage = Math.min(...data.map((d) => d.voltage));
  const maxVoltage = Math.max(...data.map((d) => d.voltage));

  const timeRange = maxTime - minTime || 1;
  const voltageRange = maxVoltage - minVoltage || 1;

  const pathD = data
    .map((d, i) => {
      const x = padding + ((d.timeMs - minTime) / timeRange) * chartWidth;
      const y =
        padding + chartHeight - ((d.voltage - minVoltage) / voltageRange) * chartHeight;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="w-full"
        style={{ minWidth: `${width}px` }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding + (chartHeight / 4) * i;
          return (
            <line
              key={`grid-${i}`}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(168, 85, 247, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Area fill */}
        <path
          d={`${pathD} L ${padding + chartWidth} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`}
          fill="url(#areaGradient)"
        />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = padding + ((d.timeMs - minTime) / timeRange) * chartWidth;
          const y =
            padding + chartHeight - ((d.voltage - minVoltage) / voltageRange) * chartHeight;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#a855f7"
              stroke="#0b0716"
              strokeWidth="2"
            />
          );
        })}

        {/* Axes labels */}
        <text
          x={padding}
          y={height - 10}
          fill="rgba(161, 161, 170, 0.6)"
          fontSize="11"
        >
          {minTime.toFixed(0)}
        </text>
        <text
          x={width - padding}
          y={height - 10}
          fill="rgba(161, 161, 170, 0.6)"
          fontSize="11"
          textAnchor="end"
        >
          {maxTime.toFixed(0)}
        </text>
        <text
          x={padding - 5}
          y={padding + chartHeight}
          fill="rgba(161, 161, 170, 0.6)"
          fontSize="11"
          textAnchor="end"
        >
          {minVoltage.toFixed(2)}
        </text>
        <text
          x={padding - 5}
          y={padding + 5}
          fill="rgba(161, 161, 170, 0.6)"
          fontSize="11"
          textAnchor="end"
        >
          {maxVoltage.toFixed(2)}
        </text>
      </svg>
    </div>
  );
}

export default function VoltageGraphs({ measurements, config }: Props) {
  // Generate all possible column IDs based on stack configuration
  const allColumns = useMemo(() => {
    const totalColumns = config.rows * config.cols;
    return Array.from({ length: totalColumns }, (_, i) => {
      const columnNum = i + 1;
      const columnId = `col-${columnNum}`;
      const columnLabel = `Column ${columnNum}`;
      const hasMeasurements = measurements.some((m) => m.columnId === columnId);

      return {
        columnId,
        columnLabel,
        hasMeasurements,
      };
    });
  }, [config.rows, config.cols, measurements]);

  const [selectedColumn, setSelectedColumn] = useState<string>(
    allColumns[0]?.columnId || "",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentMeasurement = measurements.find(
    (m) => m.columnId === selectedColumn,
  );

  const currentColumnInfo = allColumns.find(
    (c) => c.columnId === selectedColumn,
  );

  return (
    <motion.div
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
                  {currentColumnInfo?.columnLabel}
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

            <VoltageChart
              data={currentMeasurement.data}
              width={600}
              height={300}
            />

            <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
              <span>Time (ms)</span>
              <span>Voltage (V)</span>
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
