import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import type { StatCard } from "../dashboard.types";

export const StatCardItem = ({ stat }: { stat: StatCard }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{stat.label}</p>
    <div className="mt-3 flex items-center justify-between">
      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
          stat.trend === "up" && "bg-success-50 text-success-700",
          stat.trend === "down" && "bg-error-50 text-error-700"
        )}
      >
        {stat.trend === "up" ? (
          <ArrowUpRight className="h-3 w-3" />
        ) : (
          <ArrowDownRight className="h-3 w-3" />
        )}
        {stat.change}
      </span>
    </div>
    <p className="mt-3 text-xs text-gray-400">{stat.note}</p>
  </div>
);
