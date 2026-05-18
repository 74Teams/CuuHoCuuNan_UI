"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api/client";
import { apiQueryKeys } from "@/lib/api/query-keys";
import { authApi } from "@/lib/api/services";
import { getStoredUser, setStoredUser } from "@/lib/api/storage";
import { updateStoredUserAvatar, useLogout } from "@/lib/api/use-auth";
import { useProfileQuery } from "@/lib/api/use-profile";

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSettingsDialog({
  open,
  onOpenChange,
}: ProfileSettingsDialogProps) {
  const queryClient = useQueryClient();
  const logout = useLogout();
  const { data: profile, isLoading } = useProfileQuery();
  const storedUser = getStoredUser();

  const [fullName, setfullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName =
    profile?.fullName ?? profile?.fullName ?? storedUser?.fullName ?? "";
  const displayEmail = profile?.email ?? storedUser?.email ?? "";

  useEffect(() => {
    if (!open) return;
    setfullName(displayName);
    setPhoneNumber(profile?.phoneNumber ?? storedUser?.phoneNumber ?? "");
    setAvatarUrl(
      profile?.avatarUrl ??
        profile?.avatar ??
        storedUser?.avatarUrl ??
        undefined,
    );
  }, [open, displayName, profile, storedUser]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await authApi.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      const current = getStoredUser();
      if (current) {
        setStoredUser({
          ...current,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
        });
      }
      await queryClient.invalidateQueries({
        queryKey: apiQueryKeys.auth.profile,
      });
      toast.success("Đã cập nhật hồ sơ");
      onOpenChange(false);
    } catch (error) {
      toast.error("Không thể cập nhật hồ sơ", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await authApi.uploadAvatar(file);
      const url =
        res.data.avatarUrl ?? (res.data as { avatar?: string }).avatar ?? "";
      setAvatarUrl(url);
      updateStoredUserAvatar(url);
      await queryClient.invalidateQueries({
        queryKey: apiQueryKeys.auth.profile,
      });
      toast.success("Đã cập nhật ảnh đại diện");
    } catch (error) {
      toast.error("Không thể tải ảnh lên", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Cài đặt tài khoản</DialogTitle>
          <DialogDescription>
            Cập nhật ảnh đại diện và thông tin cá nhân của bạn.
          </DialogDescription>
        </DialogHeader>

        {isLoading && !storedUser ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-4">
              <div className="relative">
                <UserAvatar
                  name={fullName || displayName}
                  src={avatarUrl}
                  size="xl"
                  showRing
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-60"
                >
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Camera className="size-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  {displayName || "Người dùng"}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {displayEmail}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {(profile?.roles ?? storedUser?.roles ?? []).join(", ") ||
                    "Citizen"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Họ và tên
                </label>
                <Input
                  id="profile-name"
                  value={fullName}
                  onChange={(e) => setfullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Số điện thoại
                </label>
                <Input
                  id="profile-phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                className="w-full bg-[#003da5] hover:bg-blue-800"
                disabled={isSaving || isUploading}
                onClick={handleSaveProfile}
              >
                {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
                Lưu thay đổi
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full text-red-600 hover:text-red-700"
                onClick={() => {
                  onOpenChange(false);
                  logout();
                }}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
