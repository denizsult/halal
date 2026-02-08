import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import { appRoutes, appRoutesWithLayout } from "./routes/app.routes";
import { AppLayoutLazy } from "./routes/lazy-components/app.lazy";
import { authRoutes } from "./routes";

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
  </div>
);

function App() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Auth routes (public) */}
          {authRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* App routes with layout */}
          <Route element={<AppLayoutLazy />}>
            {appRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>

          {/* App routes with layout */}
          <Route>
            {appRoutesWithLayout.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
