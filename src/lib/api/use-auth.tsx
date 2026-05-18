"use client";

import { normalizeAuthTokenPayload } from "@/lib/auth/normalize-auth";
import { resolvePostLoginPath } from "@/lib/auth/route-access";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "./services";
import {
  clearStoredAuthSession,
  getStoredUser,
  setStoredAuthSession,
  setStoredUser,
} from "./storage";
import type { ApiRole, AuthTokenPayload, LoginRequest } from "./types";

function normalizeRoles(roles: string[] | undefined): ApiRole[] {
  return (roles ?? []) as ApiRole[];
}

export function getRoleRedirectPath(roles: ApiRole[] | string[]) {
  return resolvePostLoginPath(roles as string[], null);
}

function persistAuthSession(data: AuthTokenPayload): AuthTokenPayload {
  const session = {
    ...data,
  };
  setStoredAuthSession(session);
  return session;
}

type LoginVariables = {
  payload: LoginRequest;
  redirectTo?: string | null;
};

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload }: LoginVariables) => {
      const response = await authApi.login(payload);
      return persistAuthSession(normalizeAuthTokenPayload(response.data));
    },
    onSuccess: (session, variables) => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      const nextPath = resolvePostLoginPath(
        session.user.roles as string[],
        variables.redirectTo,
      );
      router.replace(nextPath);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    clearStoredAuthSession();
    queryClient.clear();
    router.replace("/");
  };
}

export function updateStoredUserAvatar(avatarUrl: string) {
  const user = getStoredUser();
  if (!user) return;
  setStoredUser({ ...user, avatarUrl });
}
