"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DataPoint } from "./generateDummyData";

type Props = {
  title: string;
  data: DataPoint[];
  color: string;
};

export default function MeasurementChart({ title, data, color }: Props) {
  return (
    <div className="rounded-2xl border border-purple-500/15 bg-[#0b0716]/70 p-4 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur">
      <h3 className="mb-3 text-sm font-medium text-purple-100">{title}</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,85,247,0.1)" />
            <XAxis
              dataKey="time"
              stroke="rgba(161,161,170,0.5)"
              tick={{ fill: "rgba(161,161,170,0.7)", fontSize: 11 }}
              label={{
                value: "Time (ms)",
                position: "insideBottomRight",
                offset: -5,
                style: { fill: "rgba(161,161,170,0.5)", fontSize: 11 },
              }}
            />
            <YAxis
              stroke="rgba(161,161,170,0.5)"
              tick={{ fill: "rgba(161,161,170,0.7)", fontSize: 11 }}
              label={{
                value: "Voltage (V)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                style: { fill: "rgba(161,161,170,0.5)", fontSize: 11 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(11,7,22,0.95)",
                border: "1px solid rgba(168,85,247,0.25)",
                borderRadius: "12px",
                color: "#e9d5ff",
                fontSize: 12,
              }}
              formatter={(value: number | undefined) => [
                `${(value ?? 0).toFixed(3)} V`,
                "Voltage",
              ]}
              labelFormatter={(label) =>
                `t = ${Number(label).toFixed(1)} ms`
              }
            />
            <Line
              type="monotone"
              dataKey="voltage"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
