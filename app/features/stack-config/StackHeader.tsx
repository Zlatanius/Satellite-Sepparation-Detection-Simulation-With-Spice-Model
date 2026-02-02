"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function StackHeader() {
  return (
    <div className="relative mx-auto w-full max-w-5xl px-6 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-3"
      >
        <div className="inline-flex items-center gap-2 text-purple-200/90">
          <Settings className="h-5 w-5" />
          <span className="text-sm tracking-wide">
            Umbilical Separation Simulator
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Stack configuration
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-300/90">
          Define the stack geometry and electrical parameters.
        </p>
      </motion.div>
    </div>
  );
}
