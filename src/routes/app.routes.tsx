import type { RouteObject } from "react-router-dom";

import {
  BillingsPageLazy,
  CustomersPageLazy,
  DashboardPageLazy,
  ListingsAddPageLazy,
  ListingsEditPageLazy,
  ListingsPageLazy,
  ProfilePageLazy,
} from "./lazy-components/app.lazy";

export const appRoutes: RouteObject[] = [
  { path: "/dashboard", element: <DashboardPageLazy /> },
  { path: "/listings", element: <ListingsPageLazy /> },

  { path: "/customers", element: <CustomersPageLazy /> },
  { path: "/billings", element: <BillingsPageLazy /> },
  { path: "/profile", element: <ProfilePageLazy /> },
  { path: "/profile/details", element: <ProfilePageLazy /> },
];

export const appRoutesWithLayout: RouteObject[] = [
  { path: "/listings/add", element: <ListingsAddPageLazy /> },
  { path: "/listings/edit/:id", element: <ListingsEditPageLazy /> },
];
