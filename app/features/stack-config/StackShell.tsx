"use client";

import React from "react";

export default function StackShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#05020b] text-zinc-100">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute bottom-[-240px] right-[-160px] h-[520px] w-[520px] rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute top-[30%] left-[-240px] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative">{children}</div>
    </div>
  );
}
