import { lazy } from "react";

export const AppLayoutLazy = lazy(
  () => import("@/components/layout/AppLayout")
);

export const DashboardPageLazy = lazy(() =>
  import("@/features/dashboard").then((m) => ({ default: m.DashboardPage }))
);

export const ListingsPageLazy = lazy(() =>
  import("@/features/listings").then((m) => ({ default: m.ListingsPage }))
);

export const ListingsAddPageLazy = lazy(() =>
  import("@/features/listings-add").then((m) => ({
    default: m.ListingsAddPage,
  }))
);

export const ListingsEditPageLazy = lazy(() =>
  import("@/features/listings-edit").then((m) => ({
    default: m.ListingsEditPage,
  }))
);

export const CustomersPageLazy = lazy(() =>
  import("@/features/customers").then((m) => ({ default: m.CustomersPage }))
);

export const BillingsPageLazy = lazy(() =>
  import("@/features/billings").then((m) => ({ default: m.BillingsPage }))
);

export const ProfilePageLazy = lazy(() =>
  import("@/features/profile").then((m) => ({ default: m.ProfilePage }))
);
