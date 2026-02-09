import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/datatable/DataTable";
import { StatsBlock } from "@/components/stats-block";
import { Button } from "@/components/ui/button";
import { RenderIf } from "@/components/ui/render-if";
import { type FilterState,hasFilterConfig } from "@/features/filter-modal";
import { getModuleListingsConfig } from "@/module-configs";
import { useAuthStore } from "@/stores/auth.store";
import type { CompanyType } from "@/types/api";

import { useListings } from "./api";
import { getListingsTableColumns } from "./configs";
import type { ListingsView } from "./types";

const stats = [
  { label: "Total Bookings", value: "1,234" },
  { label: "Total Payments", value: "$45,678" },
  { label: "Cancelled", value: "23" },
  { label: "Pending", value: "56" },
  { label: "Reviews", value: "892" },
];

const listingLabelByType: Partial<Record<CompanyType, string>> = {
  rent_a_car: "My Cars",
  transfer: "My Transfers",
  hotel: "My Hotels",
  hospital: "My Hospitals",
  flight: "My Flights",
  tour: "My Tours",
  event: "My Events",
  activity: "My Activities",
  health: "My Health",
  room: "My Rooms",
};

const getListingsLabel = (companyType: CompanyType | undefined) =>
  (companyType && listingLabelByType[companyType]) ?? "My Listings";

const getRowSearchText = (row: Record<string, unknown>) => {
  const values = [
    row.full_name,
    row.name,
    row.car_name,
    row.customer_name,
    row.plate_number,
    row.pickup_location,
    row.status_label,
    row.status,
  ];
  return values
    .filter((value) => typeof value === "string" || typeof value === "number")
    .map((value) => String(value).toLowerCase())
    .join(" ");
};

export default function ListingsPage() {
  const { user } = useAuthStore();
  const companyType = user?.company?.type as CompanyType | undefined;
  const hasListingsConfig = !!getModuleListingsConfig(companyType);
  const listingsLabel = getListingsLabel(companyType);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeView, setActiveView] = useState<ListingsView>("listings");
  const [filters, setFilters] = useState<FilterState>({});

  // Check if filter config exists for this company type
  const hasFilters = companyType ? hasFilterConfig(companyType) : false;

  // Clean filter values - remove null, empty strings, and default sort values
  const cleanedFilters = useMemo(() => {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(filters)) {
      // Skip null, undefined, empty strings
      if (value === null || value === undefined || value === "") continue;
      // Skip default sort values (they're handled separately)
      if (key === "sort_by" && value === "created_at") continue;
      if (key === "sort_order" && value === "desc") continue;
      cleaned[key] = value;
    }
    return cleaned;
  }, [filters]);

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleFilterClear = () => {
    setFilters({});
    setPage(1);
  };

  const handleViewChange = (view: ListingsView) => {
    if (view === activeView) return;
    setActiveView(view);
    setPage(1);
  };

  const { data, isLoading } = useListings({
    companyType,
    params: {
      page,
      limit: pageSize,
      sortBy: "created_at",
      sortOrder: "desc",
      ...cleanedFilters,
    },
    view: activeView,
    enabled: hasListingsConfig,
  });

  const columns = useMemo(
    () => getListingsTableColumns(companyType, activeView),
    [companyType, activeView]
  );

  const rows = useMemo(() => {
    if (!data?.data?.length) return [];
    return data.data as Record<string, unknown>[];
  }, [data?.data]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((row) => {
      const haystack = getRowSearchText(row);
      return haystack.includes(q);
    });
  }, [rows, searchQuery]);

  const meta = data?.meta;
  const totalItems = meta?.total ?? 0;
  const totalPages = meta?.last_page ?? 1;
  const searchPlaceholder =
    activeView === "bookings" ? "Search bookings..." : "Search listings...";
  const emptyStateTitle =
    activeView === "bookings" ? "No bookings found" : "No listings found";
  const emptyStateDescription =
    activeView === "bookings"
      ? "Try adjusting your search or check back later."
      : "Try adjusting your search or add a new listing.";

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Listings</h1>
          <p className="text-gray-500 mt-1">
            Manage and review all your company listings
          </p>
        </div>
        <RenderIf condition={hasListingsConfig}>
          <Button leftIcon={<Plus className="h-4 w-4 mr-2" />} size="md">
            <Link to="/listings/add">Add New Listing</Link>
          </Button>
        </RenderIf>
      </div>

      <div className="w-full overflow-x-auto pb-4 lg:pb-0">
        <div className="min-w-[800px] rounded-[12px] bg-gray-50 border-2 border-gray-100 p-8">
          <div className="flex items-center justify-between">
            <StatsBlock stats={stats} />
          </div>
        </div>
      </div>

      <RenderIf condition={!hasListingsConfig}>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
          No listings module configured for your company type.
        </div>
      </RenderIf>

      <p className="text-lg font-medium">
        {activeView === "bookings" ? "Bookings" : "Listings"}
      </p>
      <RenderIf condition={hasListingsConfig}>
        <div className="flex gap-4">
          <Button
            variant={activeView === "bookings" ? "default" : "secondary"}
            onClick={() => handleViewChange("bookings")}
          >
            Bookings
          </Button>
          <Button
            variant={activeView === "listings" ? "default" : "secondary"}
            onClick={() => handleViewChange("listings")}
          >
            {listingsLabel}
          </Button>
        </div>
        <div className="max-w-full">
          <DataTable
            columns={columns}
            data={filteredData}
            loading={isLoading}
            toolbar={{
              searchValue: searchQuery,
              onSearchChange: setSearchQuery,
              searchPlaceholder,
              showFilter: hasFilters,
            }}
            pagination={{
              page,
              pageSize,
              totalPages,
              totalItems,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
            sorting={{ enabled: true }}
            emptyState={{
              title: emptyStateTitle,
              description: emptyStateDescription,
            }}
            filterServiceType={hasFilters ? companyType : undefined}
            onFilterApply={handleFilterApply}
            onFilterClear={handleFilterClear}
          />
        </div>
      </RenderIf>
    </div>
  );
}
