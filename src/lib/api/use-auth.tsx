"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "./services";
import { setStoredAuthSession } from "./storage";
import type { LoginRequest } from "./types";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await authApi.login(payload);
      return response.data;
    },
    onSuccess: (data) => {
      setStoredAuthSession(data);
      router.push("/");
    },
  });
}
