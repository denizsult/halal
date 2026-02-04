import React from "react";

export function StatsBlock({
  stats,
}: {
  stats: { label: string; value: string }[];
}) {
  return stats.map((item, index) => (
    <React.Fragment key={item.label}>
      <div className="flex flex-1 flex-col items-center gap-3 text-center">
        <span className="text-theme-sm font-medium text-gray-900 leading-[1.47] tracking-[0.28px]">
          {item.label}
        </span>
        <span className="text-theme-xl font-semibold text-gray-900 leading-[1.47] tracking-[0.4px]">
          {item.value}
        </span>
      </div>
      {index < stats.length - 1 && (
        <div className="h-14 w-px bg-gray-200 shrink-0 mx-4" />
      )}
    </React.Fragment>
  ));
}
