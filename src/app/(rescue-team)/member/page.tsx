"use client";

import {
  ArrowUpRight,
  Bell,
  BellRing,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Crosshair,
  FileWarning,
  Info,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Navigation,
  Phone,
  Settings,
  ShieldAlert,
  Target,
  UserCircle,
  UserSquare2,
  XCircle,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { MOCK_MEMBER_DASHBOARD } from "@/data/rescue-team/mockApiMember";
import {
  MemberDashboardData,
  RescuerNotification,
} from "@/types/rescue-team/member";

const MiniMap = dynamic(
  () => import("@/components/rescue-team/member/MiniMap"),
  { ssr: false },
);
const NavigateMap = dynamic(() => import("@/components/NavigateMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-slate-50">
      <span className="animate-pulse">Đang tải luồng dẫn đường...</span>
    </div>
  ),
});
const getNotificationStyle = (type: string) => {
  switch (type) {
    case "NEW_MISSION_ASSIGNED":
      return {
        wrapper: "bg-orange-50 border-orange-100 border-l-orange-500",
        iconBg: "bg-white border-orange-200 text-orange-600",
        title: "text-orange-800",
        icon: <BellRing className="w-4 h-4" />,
      };
    case "MISSION_CANCELED":
      return {
        wrapper: "bg-red-50 border-red-100 border-l-red-500",
        iconBg: "bg-white border-red-200 text-red-600",
        title: "text-red-800",
        icon: <XCircle className="w-4 h-4" />,
      };
    case "SYSTEM_ALERT":
      return {
        wrapper: "bg-blue-50 border-blue-100 border-l-blue-500",
        iconBg: "bg-white border-blue-200 text-blue-600",
        title: "text-blue-800",
        icon: <Info className="w-4 h-4" />,
      };
    case "LEAVE_APPROVED":
      return {
        wrapper: "bg-emerald-50 border-emerald-100 border-l-emerald-500",
        iconBg: "bg-white border-emerald-200 text-emerald-600",
        title: "text-emerald-800",
        icon: <CheckCircle2 className="w-4 h-4" />,
      };
    case "LEAVE_REJECTED":
      return {
        wrapper: "bg-slate-50 border-slate-200 border-l-slate-500",
        iconBg: "bg-white border-slate-300 text-slate-600",
        title: "text-slate-800",
        icon: <FileWarning className="w-4 h-4" />,
      };
    default:
      return {
        wrapper: "bg-slate-50 border-slate-100 border-l-slate-400",
        iconBg: "bg-white border-slate-200 text-slate-500",
        title: "text-slate-700",
        icon: <Bell className="w-4 h-4" />,
      };
  }
};
const formatTimeAgoSafe = (isoString: string) => {
  try {
    const past = new Date(isoString).getTime();
    const now = new Date().getTime();
    const diffInSeconds = Math.max(0, Math.floor((now - past) / 1000));
    if (diffInSeconds < 60) return "VỪA XONG";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} PHÚT TRƯỚC`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} GIỜ TRƯỚC`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} NGÀY TRƯỚC`;
  } catch (error) {
    return "GẦN ĐÂY";
  }
};

export default function MemberDashboardPage() {
  const data: MemberDashboardData = MOCK_MEMBER_DASHBOARD.data;

  const [isOnline, setIsOnline] = useState(data.dutyStatus.isOnline);
  const [activeTab, setActiveTab] = useState<
    "missions" | "chat" | "navigate" | "duty"
  >(data.activeMission ? "navigate" : "missions");
  const [isNotiOpen, setIsNotiOpen] = useState(false);

  const shortName = data.profile.fullName.split(" ").pop();
  const avatarInitials = data.profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);
  const mainVictim = data.activeMission?.victims?.[0];

  const visibleNotifications = data.activeMission
    ? data.notifications.filter((noti) => noti.type !== "NEW_MISSION_ASSIGNED")
    : data.notifications;

  const handleToggleStatus = () => {
    setIsOnline((prevStatus) => !prevStatus);
  };

  const renderNotificationCard = (notification: RescuerNotification) => {
    const style = getNotificationStyle(notification.type);

    return (
      <div
        key={notification.id}
        className={`p-3 rounded-xl border border-l-4 shadow-sm flex flex-col gap-2.5 transition-all ${style.wrapper}`}
      >
        <div className="flex items-start gap-2.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${style.iconBg}`}
          >
            {style.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3
                className={`text-xs font-black uppercase tracking-tight leading-snug truncate ${style.title}`}
              >
                {notification.title}
              </h3>
              <span
                suppressHydrationWarning
                className="text-[9px] text-slate-500 font-medium flex items-center gap-1 shrink-0 mt-0.5"
              >
                <Clock3 className="w-2.5 h-2.5" />{" "}
                {formatTimeAgoSafe(notification.createdAt)}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">
              {notification.message}
            </p>
          </div>
        </div>

        {/* Nút thao tác tùy theo loại thông báo */}
        {notification.type === "NEW_MISSION_ASSIGNED" && (
          <div className="flex gap-2 pt-2 mt-0.5 border-t border-orange-200/50">
            <button
              onClick={() => {
                toast.success("Đã tiếp nhận nhiệm vụ!", {
                  description: "Đang tải dữ liệu bản đồ...",
                });
                setIsNotiOpen(false); // Tự động đóng Sidebar nếu đang mở
                setTimeout(() => setActiveTab("navigate"), 800);
              }}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-[11px] py-1.5 rounded-lg font-bold shadow-sm active:scale-95 transition-all"
            >
              TIẾP NHẬN
            </button>
            <button
              onClick={() =>
                toast.error("Đã từ chối nhiệm vụ", {
                  description: "Đã báo cáo về Trung tâm điều phối.",
                })
              }
              className="flex-1 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 text-[11px] py-1.5 rounded-lg font-bold active:scale-95 transition-all"
            >
              TỪ CHỐI
            </button>
          </div>
        )}
        {notification.type === "MISSION_CANCELED" && (
          <div className="flex gap-2 pt-2 mt-0.5 border-t border-red-200/50">
            <button
              onClick={() => toast.success("Đã xác nhận hủy nhiệm vụ.")}
              className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-[11px] py-1.5 rounded-lg font-bold shadow-sm active:scale-95 transition-all"
            >
              XÁC NHẬN ĐÃ ĐỌC
            </button>
          </div>
        )}
        {notification.type === "SYSTEM_ALERT" && (
          <div className="flex gap-2 pt-2 mt-0.5 border-t border-blue-200/50">
            <button
              onClick={() => toast.success("Đã xác nhận.")}
              className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 text-[11px] py-1.5 rounded-lg font-bold shadow-sm active:scale-95 transition-all"
            >
              XÁC NHẬN ĐÃ ĐỌC
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center p-0 md:p-4 font-sans text-slate-900">
      <div className="w-full max-w-[400px] h-full min-h-screen bg-white md:rounded-[36px] md:shadow-2xl overflow-hidden flex flex-col relative">
        {/* ================= TAB 1: TRANG NHIỆM VỤ (MẶC ĐỊNH) ================= */}
        {activeTab === "missions" && (
          <>
            {/* HEADER CỦA TAB MISSIONS */}
            <div className="flex justify-between items-center p-4 bg-white sticky top-0 z-10 border-b border-slate-100">
              {/* === BÊN TRÁI: MENU & LỜI CHÀO (Đã gộp lại) === */}
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition active:scale-95">
                      <Menu className="w-7 h-7 text-slate-700" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] sm:w-[320px] p-0 flex flex-col"
                  >
                    <SheetHeader className="p-6 text-left border-b border-slate-100 bg-slate-50/50">
                      <SheetTitle className="text-[#003da5] font-black text-xl flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6" /> RESCUE CORE
                      </SheetTitle>
                      <div className="flex items-center gap-3 mt-6">
                        <div className="w-12 h-12 rounded-full bg-[#003da5] text-white flex items-center justify-center font-bold text-lg">
                          {avatarInitials}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {data.profile.fullName}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {data.profile.specialty}
                          </p>
                        </div>
                      </div>
                    </SheetHeader>
                    <div className="flex-1 p-4 space-y-2">
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition text-slate-700 font-semibold">
                        <UserCircle className="w-5 h-5 text-slate-500" /> Hồ sơ
                        cá nhân
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition text-slate-700 font-semibold">
                        <ClipboardList className="w-5 h-5 text-slate-500" />{" "}
                        Lịch sử nhiệm vụ
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition text-slate-700 font-semibold">
                        <Settings className="w-5 h-5 text-slate-500" /> Cài đặt
                        ứng dụng
                      </button>
                    </div>
                    <div className="p-4 border-t border-slate-100">
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition text-red-600 font-bold">
                        <LogOut className="w-5 h-5" /> Đăng xuất
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="text-[15px] font-medium text-slate-800 ml-1">
                  Xin chào,{" "}
                  <span className="text-[#003da5] font-bold">{shortName}</span>
                </div>
              </div>

              {/* === BÊN PHẢI: CHUÔNG & AVATAR === */}
              <div className="flex items-center gap-3">
                {/* Nút Chuông Thông Báo */}
                <button
                  onClick={() => setIsNotiOpen(true)}
                  className="relative p-1 rounded-full hover:bg-slate-100 transition active:scale-95"
                >
                  <Bell className="w-6 h-6 text-slate-600" />
                  {/* Chấm đỏ thông báo */}
                  {visibleNotifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#f43f5e] border-[2px] border-white rounded-full"></span>
                  )}
                </button>

                {/* Avatar người dùng */}
                <div className="w-10 h-10 rounded-full bg-[#0047A0] flex items-center justify-center text-white font-bold text-[15px] shadow-sm">
                  {avatarInitials}
                </div>
              </div>
            </div>

            {/* === SIDEBAR PHẢI (DANH SÁCH TẤT CẢ THÔNG BÁO) === */}
            <Sheet open={isNotiOpen} onOpenChange={setIsNotiOpen}>
              <SheetContent
                side="right"
                className="w-[320px] sm:w-[380px] p-0 flex flex-col bg-slate-50 z-10000"
              >
                <SheetHeader className="p-4 bg-white border-b border-slate-100 flex-shrink-0">
                  <SheetTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <BellRing className="w-5 h-5 text-[#003da5]" /> Thông báo
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {visibleNotifications.length === 0 ? (
                    <div className="text-center text-slate-500 py-10 text-sm">
                      Bạn không có thông báo nào.
                    </div>
                  ) : (
                    visibleNotifications.map((noti) =>
                      renderNotificationCard(noti),
                    )
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* NỘI DUNG CUỘN CỦA TAB MISSIONS */}
            <div className="flex-1 overflow-y-auto pb-24 px-4 space-y-5 mt-2">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-[15px] font-bold text-slate-900">
                    Trạng thái làm việc
                  </h2>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    Bạn đang{" "}
                    {isOnline ? "trực tuyến và sẵn sàng" : "ngoại tuyến"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleStatus}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${isOnline ? "bg-[#003da5]" : "bg-slate-200"}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-0.5 ${isOnline ? "translate-x-[22px]" : "translate-x-0.5"}`}
                    />
                  </button>
                  <span
                    className={`text-xs font-bold uppercase w-12 ${isOnline ? "text-[#003da5]" : "text-slate-400"}`}
                  >
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
              </div>

              {/*3 Thong bao moi nhat */}
              {visibleNotifications
                .slice(0, 3)
                .map((noti) => renderNotificationCard(noti))}

              {/* NẾU CÓ NHIỀU HƠN 3 THÔNG BÁO -> HIỆN NÚT XEM THÊM */}
              {visibleNotifications.length > 3 && (
                <button
                  onClick={() => setIsNotiOpen(true)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold rounded-xl transition-colors active:scale-95"
                >
                  Xem tất cả {visibleNotifications.length} thông báo
                </button>
              )}

              {data.activeMission ? (
                <>
                  <div>
                    <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-tight mb-3">
                      NHIỆM VỤ HIỆN TẠI
                    </h2>
                    <div className="bg-white p-4 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0">
                        <span className="bg-blue-50 text-[#003da5] font-bold text-[10px] px-3 py-2 rounded-bl-2xl uppercase tracking-wider">
                          Đang thực hiện
                        </span>
                      </div>

                      <h3 className="text-[22px] font-black text-[#003da5] leading-tight mt-6 mb-4 pr-4">
                        {data.activeMission.title}
                      </h3>

                      {mainVictim && (
                        <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 mb-4 bg-white shadow-sm">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                            <UserSquare2 className="w-6 h-6 text-[#003da5]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">
                              Người cần hỗ trợ{" "}
                              {data.activeMission.victims.length > 1
                                ? `(+${data.activeMission.victims.length - 1} người)`
                                : ""}
                            </p>
                            <p className="text-[15px] font-bold text-slate-900">
                              {mainVictim.fullName}{" "}
                              {mainVictim.age ? `(${mainVictim.age} tuổi)` : ""}
                            </p>
                            <p className="text-[12px] text-slate-500 italic line-clamp-1">
                              {mainVictim.condition}
                            </p>
                          </div>
                          <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#003da5] hover:bg-blue-100 transition border border-blue-100 shrink-0">
                            <Phone className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                          <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
                            <MapPin className="w-3 h-3 text-red-500 shrink-0" />{" "}
                            VỊ TRÍ
                          </p>
                          <p className="text-[13px] font-semibold text-slate-800 leading-snug truncate">
                            {data.activeMission.location.address}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
                            <Target className="w-3 h-3 text-[#003da5]" /> KHOẢNG
                            CÁCH
                          </p>
                          <p className="text-xl font-black text-[#003da5]">
                            {data.activeMission.location.distanceKm} km
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 relative h-[250px] overflow-hidden">
                    <div className="absolute inset-0 opacity-80 z-0">
                      <MiniMap
                        lat={data.activeMission.location.latitude}
                        lng={data.activeMission.location.longitude}
                      />
                    </div>
                    <div className="absolute bottom-16 right-3 z-10">
                      <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-600 border border-slate-100 hover:text-[#003da5] active:scale-95 transition-all">
                        <Crosshair className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 right-0 z-10">
                      <button
                        onClick={() => setActiveTab("navigate")} // CLICK Ở ĐÂY SẼ CHUYỂN SANG TAB DẪN ĐƯỜNG
                        className="w-14 h-14 rounded-tl-2xl bg-[#003da5] text-white flex items-center justify-center shadow-lg hover:bg-blue-800 transition active:scale-95"
                      >
                        <ArrowUpRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center mt-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Zap className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">
                    Chưa có nhiệm vụ
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Hãy giữ trạng thái Online để sẵn sàng nhận lệnh từ Trưởng
                    nhóm.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= TAB 2: TRANG DẪN ĐƯỜNG ================= */}
        {activeTab === "navigate" && (
          <div className="flex-1 w-full relative min-h-0 overflow-hidden">
            <NavigateMap mission={data.activeMission} />
          </div>
        )}
        {/* ================= THANH ĐIỀU HƯỚNG BOTTOM (CỐ ĐỊNH) ================= */}
        {/* Nâng z-[9999] để nó luôn nằm trên cùng, không bị map đè */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-2 flex justify-around items-center pb-4 pt-3 z-9999">
          <button
            onClick={() => setActiveTab("missions")}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === "missions" ? "text-[#003da5] font-bold" : "text-slate-400 hover:text-[#003da5]"}`}
          >
            <Zap className="w-6 h-6 shrink-0" />
            <span className="text-[10px] uppercase tracking-wider">
              Missions
            </span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === "chat" ? "text-[#003da5] font-bold" : "text-slate-400 hover:text-[#003da5]"}`}
          >
            <MessageSquare className="w-6 h-6 shrink-0" />
            <span className="text-[10px] uppercase tracking-wider">Chat</span>
          </button>

          <button
            onClick={() => setActiveTab("navigate")}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === "navigate" ? "text-[#003da5] font-bold" : "text-slate-400 hover:text-[#003da5]"}`}
          >
            <Navigation className="w-6 h-6 shrink-0" />
            <span className="text-[10px] uppercase tracking-wider">
              Navigate
            </span>
          </button>

          <button
            onClick={() => setActiveTab("duty")}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === "duty" ? "text-[#003da5] font-bold" : "text-slate-400 hover:text-[#003da5]"}`}
          >
            <ClipboardList className="w-6 h-6 shrink-0" />
            <span className="text-[10px] uppercase tracking-wider">Duty</span>
          </button>
        </div>
      </div>
    </div>
  );
}
