"use client";

import { AuthGuard } from "@/components/shared/AuthGuard";
import { setAuthRefreshHandler } from "@/lib/api/client";
import { AppQueryProvider } from "@/lib/api/query-client";
import { authApi } from "@/lib/api/services";
import { normalizeAuthTokenPayload } from "@/lib/auth/normalize-auth";
import { useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    setAuthRefreshHandler(async (refreshToken) => {
      try {
        const response = await authApi.refresh(refreshToken);
        return normalizeAuthTokenPayload(response.data);
      } catch {
        return null;
      }
    });
    return () => setAuthRefreshHandler(null);
  }, []);
  return (
    <AppQueryProvider>
      <AuthGuard>{children}</AuthGuard>
    </AppQueryProvider>
  );
}
