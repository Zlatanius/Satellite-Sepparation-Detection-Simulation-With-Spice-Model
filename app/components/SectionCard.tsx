import React from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export default function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-2xl border border-purple-500/15 bg-[#0b0716]/70 p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.05)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon ? <span className="text-purple-200">{icon}</span> : null}
          <h2 className="text-base font-medium">{title}</h2>
        </div>
        {subtitle ? (
          <div className="text-xs text-zinc-400">{subtitle}</div>
        ) : null}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}
