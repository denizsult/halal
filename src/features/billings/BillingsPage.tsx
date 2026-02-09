import { useMemo,useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CreditCard, DollarSign, Download, Plus } from "lucide-react";

import { DataTable } from "@/components/datatable/DataTable";
import { StatsBlock } from "@/components/stats-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
  { label: "Total Billings", value: "$12,345" },
  { label: "Total Earnings", value: "$45,678" },
  { label: "Paid", value: "156" },
  { label: "Unpaid", value: "23" },
  { label: "Refunded", value: "8" },
];

interface Invoice {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: string;
  method: string;
}

const invoicesData: Invoice[] = [
  {
    id: "INV-001",
    date: "Jan 15, 2026",
    plan: "Premium",
    amount: "$99.00",
    status: "Paid",
    method: "Credit Card",
  },
  {
    id: "INV-002",
    date: "Dec 15, 2025",
    plan: "Premium",
    amount: "$99.00",
    status: "Paid",
    method: "PayPal",
  },
  {
    id: "INV-003",
    date: "Nov 15, 2025",
    plan: "Premium",
    amount: "$99.00",
    status: "Paid",
    method: "Credit Card",
  },
  {
    id: "INV-004",
    date: "Oct 15, 2025",
    plan: "Basic",
    amount: "$49.00",
    status: "Paid",
    method: "Credit Card",
  },
  {
    id: "INV-005",
    date: "Sep 15, 2025",
    plan: "Basic",
    amount: "$49.00",
    status: "Refunded",
    method: "PayPal",
  },
  {
    id: "INV-006",
    date: "Aug 15, 2025",
    plan: "Basic",
    amount: "$49.00",
    status: "Paid",
    method: "Credit Card",
  },
  {
    id: "INV-007",
    date: "Jul 15, 2025",
    plan: "Basic",
    amount: "$49.00",
    status: "Pending",
    method: "PayPal",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Paid":
      return "default";
    case "Pending":
      return "secondary";
    case "Refunded":
      return "outline";
    default:
      return "destructive";
  }
};

export default function BillingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    return invoicesData.filter(
      (invoice) =>
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "id",
      header: "Invoice",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Billing Date",
      cell: ({ row }) => (
        <span className="text-gray-600">{row.original.date}</span>
      ),
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <span className="text-gray-600">{row.original.plan}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.original.amount}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            getStatusVariant(row.original.status) as
              | "default"
              | "secondary"
              | "destructive"
              | "outline"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "method",
      header: "Payment Method",
      cell: ({ row }) => (
        <span className="text-gray-600">{row.original.method}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      meta: { align: "right", width: "80px" },
      cell: () => (
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Billings & Earnings
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of all billings and earnings
        </p>
      </div>

      {/* Plan and Payment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">Premium Plan</h3>
              <p className="text-gray-500 text-sm mt-1">
                Access to all features and priority support
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Listings used</span>
                <span className="font-medium">8 of 15</span>
              </div>
              <Progress value={53} className="h-2" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$99</span>
              <span className="text-gray-500">/ per month</span>
            </div>
            <Button variant="outline" className="w-full">
              Upgrade plan
            </Button>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment Method</CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add new
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/2027</p>
                </div>
              </div>
              <Badge variant="secondary">Default</Badge>
            </div>
            <div className="border rounded-lg p-4 flex items-center gap-3 opacity-60">
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Dashboard */}
      <div className="w-full overflow-x-auto pb-4 lg:pb-0">
        <div className="min-w-[800px] rounded-[12px] bg-gray-50 border-2 border-gray-100 p-8">
          <div className="flex items-center justify-between">
            <StatsBlock stats={stats} />
          </div>
        </div>
      </div>

      {/* Billing History DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        toolbar={{
          searchValue: searchQuery,
          onSearchChange: setSearchQuery,
          searchPlaceholder: "Search invoices...",
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
          title: "No invoices found",
          description: "Your billing history will appear here.",
        }}
      />
    </div>
  );
}
