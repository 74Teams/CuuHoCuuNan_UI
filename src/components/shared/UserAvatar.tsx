"use client";

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/initials";

const sizeMap = {
  sm: "size-8 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-10 text-sm",
  xl: "size-14 text-lg",
} as const;

interface UserAvatarProps {
  name?: string;
  src?: string | null;
  size?: keyof typeof sizeMap;
  className?: string;
  showRing?: boolean;
}

export function UserAvatar({
  name,
  src,
  size = "md",
  className,
  showRing = false,
}: UserAvatarProps) {
  const initials = getInitials(name, "U");
  const sizeClass = sizeMap[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "Avatar"}
        className={cn(
          "shrink-0 rounded-full object-cover",
          sizeClass,
          showRing && "ring-2 ring-blue-400 ring-offset-1",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 font-bold text-white",
        sizeClass,
        showRing && "ring-2 ring-blue-400 ring-offset-1",
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}
