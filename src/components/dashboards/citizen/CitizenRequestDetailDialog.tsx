"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dictStatus } from "@/constants/dictionary";
// IMPORT TYPE CHUẨN TỪ BÀI TRƯỚC
import FlyToLocationButton from "@/components/shared/FlyToLocationButton";
import { RequestDetail } from "@/types/request";
import { Activity, Navigation, User } from "lucide-react";

const dictType: Record<string, string> = {
  FIRE: "Hỏa hoạn",
  FLOOD: "Ngập lụt",
  MEDICAL: "Y tế",
  LANDSLIDE: "Sạt lở",
};

export default function CitizenRequestDetailDialog({
  request,
  children,
}: {
  request: RequestDetail; // SỬ DỤNG TYPE CHUẨN Ở ĐÂY
  children: React.ReactNode;
}) {
  if (!request) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-white rounded-2xl z-[10000]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-[#003da5]">
            <Activity className="w-5 h-5" /> Chi tiết yêu cầu cứu trợ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2 max-h-[70vh] overflow-y-auto pr-2">
          {!request.isPublicView ? (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Người báo cáo
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">Họ tên: </span>
                <span className="font-semibold text-slate-900">
                  {request.requestedBy?.fullName || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-500">SĐT: </span>
                <span className="font-semibold text-slate-900">
                  {request.requestedBy?.phoneNumber || "N/A"}
                </span>
              </div>
            </div>
          </div>
          ) : (
            <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              Thông tin cá nhân (họ tên, số điện thoại, email) không hiển thị trên
              bản đồ công khai.
            </p>
          )}

          {/* HIỂN THỊ NẠN NHÂN (NẾU CÓ)
          {request.victims && request.victims.length > 0 && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Thông tin nạn nhân (
                {request.victims.length})
              </h4>
              <div className="space-y-2">
                {request.victims.map((v, idx) => (
                  <div
                    key={idx}
                    className="text-sm bg-white p-2 rounded shadow-sm border border-red-50"
                  >
                    <div className="font-bold text-slate-800">
                      {v.name} {v.age ? `(${v.age} tuổi)` : ""}
                    </div>
                    <div className="text-xs text-red-600 mt-0.5">
                      {v.condition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 font-medium">Loại sự cố: </span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  {dictType[request.emergencyType] || request.emergencyType}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Tình trạng: </span>
                <span
                  className={`font-bold ${
                    request.status === "PENDING"
                      ? "text-orange-600"
                      : request.status === "RESOLVED"
                        ? "text-green-600"
                        : "text-blue-600"
                  }`}
                >
                  {dictStatus[request.status] || request.status}
                </span>
              </div>
            </div>

            {/* MÔ TẢ */}
            <div>
              <span className="text-slate-500 font-medium">
                Mô tả chi tiết:
              </span>
              <p className="text-slate-900 bg-slate-50 p-2.5 rounded border border-slate-100 mt-1 leading-relaxed">
                {request.description}
              </p>
            </div>

            {/* VỊ TRÍ */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5" /> Vị trí sự cố:
                </span>

                <FlyToLocationButton
                  lat={request.location.latitude}
                  lng={request.location.longitude}
                  label="XEM TRÊN BẢN ĐỒ"
                />
              </div>

              <div className="mt-2 bg-slate-50 p-2.5 rounded border border-slate-100">
                <p className="text-slate-900 font-medium mb-1">
                  {request.location.address}
                </p>
                <p className="text-slate-500 font-mono text-xs">
                  GPS: {request.location.latitude}, {request.location.longitude}
                </p>
                {request.location.landmark && (
                  <p className="text-slate-600 mt-2 italic text-xs border-t border-slate-200 pt-2">
                    <span className="font-semibold not-italic text-slate-500">
                      Mốc nhận diện:{" "}
                    </span>
                    {request.location.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ĐỘI CỨU HỘ ĐÃ ĐIỀU ĐỘNG */}
          {request.missions && request.missions.length > 0 && (
            <div className="border-t border-slate-100 pt-3">
              <h4 className="text-xs font-bold text-[#003da5] uppercase tracking-wider mb-2">
                Đội Cứu Hộ Đã Điều Động ({request.missions.length})
              </h4>
              <div className="space-y-2">
                {request.missions.map((mission) => (
                  <div
                    key={mission.id}
                    className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 flex justify-between items-center text-sm shadow-sm"
                  >
                    <div>
                      <span className="font-bold text-blue-800 block">
                        {mission.rescueTeam?.teamName || "Đội đang đến"}
                      </span>
                      <span className="text-[10px] text-blue-600/70 font-mono mt-0.5 block">
                        ID: {mission.id.substring(0, 8)}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-white rounded text-[#003da5] shadow-sm">
                      {mission.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
