import { MapPin } from "lucide-react";

import type { GlobalRegion } from "../dashboard.types";

export const GlobalRegionList = ({ regions }: { regions: GlobalRegion[] }) => (
  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500">
    {regions.map((region) => (
      <div key={region.label} className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <MapPin className="h-3 w-3 text-gray-300" />
          {region.label}
        </span>
        <span className="text-gray-700">{region.value}</span>
      </div>
    ))}
  </div>
);
