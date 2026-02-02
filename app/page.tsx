"use client";

import React, { useMemo, useState } from "react";
import StackShell from "@/app/features/stack-config/StackShell";
import StackHeader from "@/app/features/stack-config/StackHeader";
import StackConfigForm from "@/app/features/stack-config/StackConfigForm";
import StackSummary from "@/app/features/stack-config/StackSummary";
import { computeDerived } from "@/app/features/stack-config/derived";
import type { StackConfig } from "@/app/features/stack-config/types";

export default function Page() {
  const [cfg, setCfg] = useState<StackConfig>({
    size: 3,
    layers: 3,
    releaseStepMs: 10,
    supplyVoltage: 5,
    resistorValueOhms: 10_000,
  });

  const derived = useMemo(() => computeDerived(cfg), [cfg]);

  return (
    <StackShell>
      <StackHeader />

      <div className="mx-auto w-full max-w-5xl px-6 pb-10">
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StackConfigForm cfg={cfg} setCfg={setCfg} derived={derived} />
          </div>
          <div className="lg:col-span-1">
            <StackSummary derived={derived} />
          </div>
        </div>

        <footer className="mt-10 text-xs text-zinc-500">
          Deep-purple theme • Next.js App Router • Client-side config form
        </footer>
      </div>
    </StackShell>
  );
}
