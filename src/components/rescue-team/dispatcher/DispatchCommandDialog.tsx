"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// Xóa cái import { Request } from "@/types/type" cũ đi
import { IncidentReport } from "@/types/rescue-team/dispatcher";
import {
  AlertTriangle,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Siren,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Interface mới chuẩn 100%
interface DispatchCommandDialogProps {
  request: IncidentReport;
  children: React.ReactNode;
}

// Dữ liệu giả lập các đội cứu hộ
const MOCK_TEAMS = [
  {
    id: "T01",
    name: "Đội Y tế Quận Hải Châu",
    type: "MEDICAL",
    distance: "1.2 km",
    time: "3 phút",
    status: "AVAILABLE",
    members: 4,
  },
  {
    id: "T02",
    name: "Đội PCCC & CHCN Số 1",
    type: "FIRE",
    distance: "2.8 km",
    time: "6 phút",
    status: "AVAILABLE",
    members: 7,
  },
  {
    id: "T03",
    name: "Đội Cứu hộ Đa Năng",
    type: "FLOOD",
    distance: "0.5 km",
    time: "1 phút",
    status: "BUSY",
    members: 5,
  },
  {
    id: "T04",
    name: "Trạm Y tế Phường",
    type: "MEDICAL",
    distance: "3.5 km",
    time: "8 phút",
    status: "AVAILABLE",
    members: 2,
  },
];

const dictType: Record<string, string> = {
  FIRE: "Hỏa hoạn",
  FLOOD: "Ngập lụt",
  MEDICAL: "Y tế",
  LANDSLIDE: "Sạt lở",
};

export default function RequestDetailDialog({
  request,
  children,
}: DispatchCommandDialogProps) {
  // <--- Sử dụng đúng cái Interface đã định nghĩa ở trên!
  const [isOpen, setIsOpen] = useState(false);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [isDispatched, setIsDispatched] = useState(false);

  // Vì trong IncidentReport không còn trường emergencyType nữa (nó được gộp vào title/description rồi)
  // nên ta tạm sắp xếp theo ID hoặc cứ để mặc định. Nếu sau này bác thêm lại trường category/type thì so sánh ở đây.
  const sortedTeams = [...MOCK_TEAMS];

  const handleDispatch = async (teamId: string) => {
    setDispatchingId(teamId);

    // Giả lập API call mất 1.5s
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setDispatchingId(null);
    setIsDispatched(true);

    toast.success("ĐÃ ĐIỀU ĐỘNG THÀNH CÔNG!", {
      description: `Lệnh đã được gửi đến thiết bị của đội cứu hộ.`,
    });

    // Tự động đóng form sau 2 giây khi điều động xong
    setTimeout(() => {
      setIsOpen(false);
      setIsDispatched(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-50 border-slate-200">
        <DialogHeader className="px-6 py-4 bg-white border-b border-slate-100 flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
            <Siren className="w-6 h-6 text-red-500 animate-pulse" />
            Điều phối xử lý sự cố{" "}
            <span className="text-slate-400 font-mono text-base ml-2">
              #{request.id.substring(4, 8).toUpperCase()}{" "}
              {/* Chỉnh lại substring cho hợp với chuỗi ID mới (INC-XXXX) */}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-full max-h-[70vh] overflow-hidden">
          {/* ================= CỘT TRÁI: CHI TIẾT SỰ CỐ ================= */}
          <div className="w-full md:w-[40%] bg-white p-6 overflow-y-auto border-r border-slate-100">
            <div className="space-y-6">
              {/* Tiêu đề Sự Cố & Mức độ */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tóm tắt Sự Cố
                </h4>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-black text-slate-800 leading-tight">
                    {request.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 font-bold text-xs rounded-lg uppercase tracking-wider border border-orange-200">
                      {request.priority}
                    </span>
                    <span className="px-3 py-1 bg-red-50 text-red-700 font-bold text-xs rounded-lg uppercase flex items-center gap-1.5 border border-red-100">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {request.status === "PENDING"
                        ? "Cần điều động"
                        : "Đang xử lý"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vị trí */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Hiện trường
                </h4>
                <div className="flex items-start gap-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-sm leading-snug">
                    {request.location.address}
                  </span>
                </div>
              </div>

              {/* Thông tin nạn nhân / Người báo */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Thông tin Báo Cáo
                </h4>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-semibold">{request.callerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono font-medium">
                      {request.callerPhone || "Không cung cấp"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-600">
                      {new Date(request.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Ghi chú hiện trường
                </h4>
                <p className="text-sm text-slate-700 font-medium bg-amber-50 p-3 rounded-xl border border-amber-100 leading-relaxed">
                  {request.description || "Không có mô tả thêm."}
                </p>
              </div>

              {/* Danh sách Nạn nhân cần hỗ trợ */}
              {request.victims.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Người cần cứu hộ ({request.victims.length})
                  </h4>
                  <div className="space-y-2">
                    {request.victims.map((vic) => (
                      <div
                        key={vic.id}
                        className="bg-white border border-slate-200 p-2.5 rounded-lg text-xs"
                      >
                        <div className="font-bold text-slate-800">
                          {vic.fullName} {vic.age ? `(${vic.age}t)` : ""}
                        </div>
                        <div className="text-slate-500 mt-1 line-clamp-1">
                          {vic.condition}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= CỘT PHẢI: ĐIỀU ĐỘNG ĐỘI CỨU HỘ ================= */}
          <div className="w-full md:w-[60%] p-6 overflow-y-auto bg-slate-50/50">
            {isDispatched ? (
              // Màn hình thành công
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    Đã giao nhiệm vụ
                  </h3>
                  <p className="text-slate-500 mt-2 font-medium">
                    Lực lượng cứu hộ đã nhận lệnh và đang di chuyển tới hiện
                    trường.
                  </p>
                </div>
              </div>
            ) : (
              // Danh sách các đội
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-base">
                    Lực lượng ứng trực gần nhất
                  </h3>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full shadow-sm border border-blue-100">
                    Bán kính 5km
                  </span>
                </div>

                <div className="space-y-3">
                  {sortedTeams.map((team) => (
                    <div
                      key={team.id}
                      className={`flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl border transition-all ${
                        team.status === "AVAILABLE"
                          ? "border-slate-200 hover:border-blue-300 hover:shadow-md"
                          : "border-slate-200 opacity-60 bg-slate-50"
                      }`}
                    >
                      {/* Thông tin đội */}
                      <div className="flex-1 min-w-0 w-full mb-3 sm:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 truncate text-sm">
                            {team.name}
                          </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 text-blue-500" />{" "}
                            <span className="text-slate-700 font-bold">
                              {team.distance}
                            </span>{" "}
                            ({team.time})
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" />{" "}
                            {team.members} người
                          </span>
                          {team.status === "BUSY" && (
                            <span className="text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                              Đang làm nhiệm vụ
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <div className="w-full sm:w-auto shrink-0 pl-0 sm:pl-4">
                        <Button
                          disabled={
                            team.status === "BUSY" ||
                            dispatchingId !== null ||
                            request.status !== "PENDING"
                          }
                          onClick={() => handleDispatch(team.id)}
                          className={`w-full sm:w-auto font-bold transition-all h-9 text-xs px-5 ${
                            team.status === "AVAILABLE" &&
                            request.status === "PENDING"
                              ? "bg-[#003da5] hover:bg-blue-700 text-white shadow-md shadow-blue-200/50"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {dispatchingId === team.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />{" "}
                              Đang gửi lệnh...
                            </>
                          ) : request.status !== "PENDING" ? (
                            "ĐÃ ĐIỀU PHỐI"
                          ) : team.status === "AVAILABLE" ? (
                            "CHỌN ĐỘI NÀY"
                          ) : (
                            "KHÔNG KHẢ DỤNG"
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
