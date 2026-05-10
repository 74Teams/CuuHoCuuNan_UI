"use client";

import { AppQueryProvider } from "@/lib/api/query-client";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <AppQueryProvider>{children}</AppQueryProvider>;
}
