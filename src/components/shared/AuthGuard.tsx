"use client";

import { getStoredAccessToken, getStoredUser } from "@/lib/api/storage";
import {
  canAccessPath,
  getProtectedRoles,
  isPublicPath,
} from "@/lib/auth/route-access";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (isPublicPath(pathname)) {
      //CHECK: WTF?
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllowed(true);
      return;
    }

    const requiredRoles = getProtectedRoles(pathname);
    if (!requiredRoles) {
      setAllowed(true);
      return;
    }

    const token = getStoredAccessToken();
    const user = getStoredUser();

    if (!token || !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      setAllowed(false);
      return;
    }

    if (!canAccessPath(pathname, user.roles)) {
      router.replace("/");
      setAllowed(false);
      return;
    }

    setAllowed(true);
  }, [pathname, router]);

  if (allowed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Đang kiểm tra quyền...
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
