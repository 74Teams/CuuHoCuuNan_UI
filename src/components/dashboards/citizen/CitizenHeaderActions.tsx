"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAccountMenu } from "@/components/shared/UserAccountMenu";

export function CitizenHeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full hover:bg-slate-100"
        type="button"
      >
        <Bell className="h-5 w-5 text-slate-600" />
        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white" />
      </Button>
      <UserAccountMenu showLoginWhenGuest avatarSize="md" />
    </div>
  );
}
