"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import StackShell from "@/app/features/stack-config/StackShell";
import ResultsView from "@/app/features/simulation-results/ResultsView";

function ResultsContent() {
  const params = useSearchParams();
  const router = useRouter();

  const rows = Number(params.get("rows")) || 3;
  const cols = Number(params.get("cols")) || 3;

  return (
    <StackShell>
      <ResultsView rows={rows} cols={cols} onBack={() => router.push("/")} />
    </StackShell>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}
