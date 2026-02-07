"use client";

import React from "react";
import { motion } from "framer-motion";
import { Box } from "lucide-react";
import SectionCard from "@/app/components/SectionCard";
import type { StackConfig } from "@/app/features/stack-config/types";

type Props = {
  config: StackConfig;
};

export default function StackVisualization3D({ config }: Props) {
  const satelliteSize = 35;
  const spacing = 5;
  const layerSpacing = 2.5;

  // Isometric projection constants
  const isoX = 0.866; // cos(30°)
  const isoY = 0.5;   // sin(30°)

  // Calculate center offset based on grid size
  const centerX = 300;
  const centerY = 100 + config.layers * layerSpacing * satelliteSize * 0.4;

  // Generate distinct colors for each column
  const getColumnColor = (col: number, row: number) => {
    const columnIndex = row * config.size + col;
    const totalColumns = config.size * config.size;
    const hue = (columnIndex / totalColumns) * 360;
    return {
      h: hue,
      s: 70,
      l: 60,
    };
  };

  // Convert HSL to RGB for better color representation
  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4)),
    };
  };

  // Convert 3D coordinates to 2D isometric
  const toIso = (x: number, y: number, z: number) => {
    return {
      x: (x - y) * isoX * satelliteSize + centerX,
      y: (x + y) * isoY * satelliteSize - z * satelliteSize + centerY,
    };
  };

  // Render a single satellite as an isometric cube
  const renderSatellite = (col: number, row: number, layer: number) => {
    const x = col;
    const y = row;
    const z = layer; // Layers stack directly on top of each other

    const corners = {
      bottomFrontLeft: toIso(x, y, z),
      bottomFrontRight: toIso(x + 1, y, z),
      bottomBackLeft: toIso(x, y + 1, z),
      bottomBackRight: toIso(x + 1, y + 1, z),
      topFrontLeft: toIso(x, y, z + 1),
      topFrontRight: toIso(x + 1, y, z + 1),
      topBackLeft: toIso(x, y + 1, z + 1),
      topBackRight: toIso(x + 1, y + 1, z + 1),
    };

    const key = `sat-${col}-${row}-${layer}`;

    // Get color for this column
    const hsl = getColumnColor(col, row);
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

    // Calculate brightness based on position (for depth effect)
    const brightness = 0.7 + (layer / config.layers) * 0.3;

    return (
      <g key={key}>
        {/* Back face - render first (appears on left side of screen) */}
        <path
          d={`M ${corners.bottomBackLeft.x} ${corners.bottomBackLeft.y}
              L ${corners.bottomBackRight.x} ${corners.bottomBackRight.y}
              L ${corners.topBackRight.x} ${corners.topBackRight.y}
              L ${corners.topBackLeft.x} ${corners.topBackLeft.y} Z`}
          fill={`rgba(${rgb.r * 0.5}, ${rgb.g * 0.5}, ${rgb.b * 0.5}, ${0.85 * brightness})`}
          stroke={`rgba(${rgb.r * 0.4}, ${rgb.g * 0.4}, ${rgb.b * 0.4}, 0.8)`}
          strokeWidth="0.8"
        />

        {/* Right face - render second (appears on right side of screen) */}
        <path
          d={`M ${corners.bottomFrontRight.x} ${corners.bottomFrontRight.y}
              L ${corners.topFrontRight.x} ${corners.topFrontRight.y}
              L ${corners.topBackRight.x} ${corners.topBackRight.y}
              L ${corners.bottomBackRight.x} ${corners.bottomBackRight.y} Z`}
          fill={`rgba(${rgb.r * 0.7}, ${rgb.g * 0.7}, ${rgb.b * 0.7}, ${0.9 * brightness})`}
          stroke={`rgba(${rgb.r * 0.6}, ${rgb.g * 0.6}, ${rgb.b * 0.6}, 0.85)`}
          strokeWidth="0.8"
        />

        {/* Top face - render last (on top) */}
        <path
          d={`M ${corners.topFrontLeft.x} ${corners.topFrontLeft.y}
              L ${corners.topFrontRight.x} ${corners.topFrontRight.y}
              L ${corners.topBackRight.x} ${corners.topBackRight.y}
              L ${corners.topBackLeft.x} ${corners.topBackLeft.y} Z`}
          fill={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.95 * brightness})`}
          stroke={`rgba(${rgb.r * 0.85}, ${rgb.g * 0.85}, ${rgb.b * 0.85}, 0.95)`}
          strokeWidth="0.8"
        />
      </g>
    );
  };

  // Generate all satellites
  const satellites = [];
  for (let layer = 0; layer < config.layers; layer++) {
    for (let row = 0; row < config.size; row++) {
      for (let col = 0; col < config.size; col++) {
        satellites.push(renderSatellite(col, row, layer));
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0 }}
    >
      <SectionCard
        title="Stack visualization"
        subtitle={`${config.size}×${config.size} grid, ${config.layers} layers`}
        icon={<Box className="h-5 w-5" />}
      >
        <div className="flex items-center justify-center rounded-xl border border-purple-500/10 bg-black/20 p-8">
          <svg
            width="600"
            height="500"
            viewBox="0 0 600 500"
            className="w-full"
            style={{ maxWidth: "700px" }}
          >
            <g>
              {satellites}
            </g>

            {/* Legend */}
            <g transform="translate(20, 460)">
              <rect
                x="0"
                y="0"
                width="20"
                height="20"
                fill="rgba(168, 85, 247, 0.5)"
                stroke="rgba(168, 85, 247, 0.6)"
                strokeWidth="1"
              />
              <text
                x="28"
                y="15"
                fill="rgba(161, 161, 170, 0.8)"
                fontSize="12"
                fontFamily="system-ui, sans-serif"
              >
                Satellite
              </text>

              {/* Layer info */}
              <text
                x="120"
                y="15"
                fill="rgba(161, 161, 170, 0.6)"
                fontSize="11"
                fontFamily="system-ui, sans-serif"
              >
                {config.size}×{config.size} satellites per layer • {config.layers} layers
              </text>
            </g>
          </svg>
        </div>
      </SectionCard>
    </motion.div>
  );
}
