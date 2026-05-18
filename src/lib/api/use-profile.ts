"use client";

import { useQuery } from "@tanstack/react-query";
import { apiQueryKeys } from "./query-keys";
import { authApi } from "./services";
import { getStoredAccessToken } from "./storage";

export function useProfileQuery() {
  return useQuery({
    queryKey: apiQueryKeys.auth.profile,
    queryFn: async () => {
      const res = await authApi.profile();
      return res.data;
    },
    enabled: !!getStoredAccessToken(),
    staleTime: 5 * 60_000,
  });
}
