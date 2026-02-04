import React, { useMemo,useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Ban,Eye, MoreHorizontal } from "lucide-react";

import { DataTable } from "@/components/datatable/DataTable";
import { StatsBlock } from "@/components/stats-block";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type PaymentsStatus = "Paid" | "Declined" | "Pending";
type BillingPlan = "Premium" | "Free" | "Platinum";
type AccountStatus = "Active" | "Inactive" | "Banned";

interface Customer {
  id: number;
  name: string;
  email: string;
  country: string;
  city: string;
  interestedArea: string;
  totalSpent: number;
  payments: PaymentsStatus;
  billingPlan: BillingPlan;
  status: AccountStatus;
  note: string;
  avatar?: string;
}

// TODO: Refactor
const PAYMENTS_STYLES: Record<PaymentsStatus, string> = {
  Paid: "bg-brand-25 text-brand-500 py-[7px] px-3 rounded-full font-medium text-sm",
  Declined:
    "bg-red-25 text-red-500  py-[7px] px-3 rounded-full font-medium text-sm ",
  Pending:
    "bg-yellow-25 text-yellow-500  py-[7px] px-3 rounded-full font-medium text-sm",
};

const BILLING_STYLES: Record<BillingPlan, string> = {
  Premium:
    "bg-brand-25 text-brand-500 py-[7px] px-3 rounded-full font-medium text-sm",
  Free: "bg-gray-100 text-gray-700 py-[7px] px-3 rounded-full font-medium text-sm",
  Platinum:
    "bg-gradient-to-r from-theme-purple-500 to-orange-500 text-white border-0 py-[7px] px-3 rounded-full font-medium text-sm",
};

const STATUS_STYLES: Record<AccountStatus, string> = {
  Active:
    "bg-brand-25 text-brand-500 py-[7px] px-3 rounded-full font-medium text-sm",
  Inactive:
    "bg-gray-100 text-gray-500 py-[7px] px-3 rounded-full font-medium text-sm",
  Banned:
    "bg-red-25 text-red-500 py-[7px] px-3 rounded-full font-medium text-sm",
};

const Pill = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
      className
    )}
  >
    {children}
  </span>
);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const CUSTOMERS_MOCK: Customer[] = [
  {
    id: 1,
    name: "John Smith",
    email: "johnsmith@example.com",
    country: "UK",
    city: "London",
    interestedArea: "Standard Rooms",
    totalSpent: 10499.99,
    payments: "Paid",
    billingPlan: "Premium",
    status: "Active",
    note: "-",
  },
  {
    id: 2,
    name: "Carlos Mendez",
    email: "carlos.mendez@example.com",
    country: "Mexico",
    city: "Mexico City",
    interestedArea: "Suites",
    totalSpent: 1200.0,
    payments: "Pending",
    billingPlan: "Free",
    status: "Active",
    note: "-",
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    country: "USA",
    city: "New York",
    interestedArea: "Deluxe / Executive",
    totalSpent: 8750.5,
    payments: "Paid",
    billingPlan: "Platinum",
    status: "Active",
    note: "-",
  },
  {
    id: 4,
    name: "James Chen",
    email: "james.chen@example.com",
    country: "Singapore",
    city: "Singapore",
    interestedArea: "Standard Rooms",
    totalSpent: 3200.0,
    payments: "Declined",
    billingPlan: "Free",
    status: "Inactive",
    note: "-",
  },
  {
    id: 5,
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    country: "France",
    city: "Paris",
    interestedArea: "Suites",
    totalSpent: 15600.0,
    payments: "Paid",
    billingPlan: "Premium",
    status: "Active",
    note: "-",
  },
  {
    id: 6,
    name: "Marcus Brown",
    email: "marcus.brown@example.com",
    country: "USA",
    city: "Los Angeles",
    interestedArea: "Deluxe / Executive",
    totalSpent: 4200.0,
    payments: "Pending",
    billingPlan: "Free",
    status: "Banned",
    note: "Banned due to multiple policy violations - unauthorized tran...",
  },
  {
    id: 7,
    name: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    country: "Japan",
    city: "Tokyo",
    interestedArea: "Standard Rooms",
    totalSpent: 9800.0,
    payments: "Paid",
    billingPlan: "Platinum",
    status: "Active",
    note: "-",
  },
  {
    id: 8,
    name: "Liam O'Brien",
    email: "liam.obrien@example.com",
    country: "Ireland",
    city: "Dublin",
    interestedArea: "Suites",
    totalSpent: 2100.0,
    payments: "Paid",
    billingPlan: "Free",
    status: "Inactive",
    note: "-",
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return CUSTOMERS_MOCK.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        `${c.country}, ${c.city}`.toLowerCase().includes(q) ||
        c.interestedArea.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback className="bg-brand-500 text-white text-xs">
              {row.original.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900 truncate">
            {row.original.name}
          </span>
        </div>
      ),
      meta: { width: "180px" },
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => (
        <span className="text-gray-600 truncate">{row.original.email}</span>
      ),
      meta: { width: "250px" },
    },
    {
      accessorKey: "country",
      header: "Country",
      cell: ({ row }) => (
        <span className="text-gray-600">
          {row.original.country}, {row.original.city}
        </span>
      ),
      meta: { width: "180px" },
    },
    {
      accessorKey: "interestedArea",
      header: "Interested area",
      cell: ({ row }) => (
        <span className="text-gray-600 truncate max-w-[160px] block">
          {row.original.interestedArea}
        </span>
      ),
      meta: { width: "140px" },
    },
    {
      accessorKey: "totalSpent",
      header: "Total Spent",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">
          {formatCurrency(row.original.totalSpent)}
        </span>
      ),
      meta: { align: "center", width: "120px" },
    },
    {
      accessorKey: "payments",
      header: "Payments",
      cell: ({ row }) => (
        <Pill className={PAYMENTS_STYLES[row.original.payments]}>
          {row.original.payments}
        </Pill>
      ),
      meta: { width: "130px" },
    },
    {
      accessorKey: "billingPlan",
      header: "Billing Plan",
      cell: ({ row }) => (
        <Pill className={BILLING_STYLES[row.original.billingPlan]}>
          {row.original.billingPlan}
        </Pill>
      ),
      meta: { width: "130px" },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Pill className={STATUS_STYLES[row.original.status]}>
          {row.original.status}
        </Pill>
      ),
      meta: { width: "130px" },
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => (
        <span className="text-gray-600 text-sm truncate max-w-[200px] block">
          {row.original.note}
        </span>
      ),
      meta: { width: "200px" },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      meta: { align: "right", width: "80px" },
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="size-4 mr-2 shrink-0" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-error-600 focus:text-error-600">
              <Ban className="size-4 mr-2 shrink-0 text-red-500" />
              Ban user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const stats = [
    { label: "Total Customers", value: "2,345" },
    { label: "Total Payment", value: "$125,678" },
    { label: "Cancelled", value: "45" },
    { label: "Pending", value: "78" },
    { label: "Reviews", value: "1,234" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">
          Manage and review all your customers
        </p>
      </div>

      <div className="w-full overflow-x-auto pb-4 lg:pb-0">
        <div className="min-w-[800px] rounded-[12px] bg-gray-50 border-2 border-gray-100 p-8">
          <div className="flex items-center justify-between">
            <StatsBlock stats={stats} />
          </div>
        </div>
      </div>

      {/* TODO: Refactor */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Button variant="default">All</Button>
          <Button variant="secondary">Banned</Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          showCheckbox
          toolbar={{
            searchValue: searchQuery,
            onSearchChange: setSearchQuery,
            searchPlaceholder: "Search customers...",
            showFilter: true,
          }}
          pagination={{
            page,
            pageSize,
            totalPages: Math.ceil(filteredData.length / pageSize),
            totalItems: filteredData.length,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          sorting={{ enabled: true }}
          emptyState={{
            title: "No customers found",
            description: "Try adjusting your search criteria.",
          }}
        />
      </div>
    </div>
  );
}
