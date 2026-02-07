"use client";

import { motion } from "framer-motion";
import { BarChart3, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SimulationHeader() {
  return (
    <div className="relative mx-auto w-full max-w-5xl px-6 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-3"
      >
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm text-purple-200/70 transition hover:text-purple-200"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to configuration</span>
        </Link>
        <div className="inline-flex items-center gap-2 text-purple-200/90">
          <BarChart3 className="h-5 w-5" />
          <span className="text-sm tracking-wide">
            Umbilical Separation Simulator
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Simulation results
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-300/90">
          Overview of released satellites and voltage measurements.
        </p>
      </motion.div>
    </div>
  );
}
