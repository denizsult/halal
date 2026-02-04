import type { ReactNode } from "react";

interface RenderIfProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RenderIf({
  condition,
  children,
  fallback = null,
}: RenderIfProps): ReactNode {
  return condition ? children : fallback;
}
