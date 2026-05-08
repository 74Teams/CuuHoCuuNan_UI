"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, ArrowUpDown, Eye, Info } from "lucide-react";

import { IncidentReport } from "@/types/rescue-team/dispatcher";
import { MOCK_DISPATCHER_DASHBOARD } from "@/data/rescue-team/mockApiDispathcer";

// ==========================================
// UTILITIES
// ==========================================
const maskPhoneNumber = (phone: string) => {
  if (!phone || phone.length < 10) return phone;
  return phone.substring(0, 4) + "***" + phone.substring(phone.length - 3);
};

// Trọng số để sắp xếp
const priorityWeight: Record<string, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};
const statusWeight: Record<string, number> = {
  PENDING: 3,
  IN_PROGRESS: 2,
  RESOLVED: 1,
  CANCELED: 0,
};

const DispatcherMapComponent = dynamic(
  () =>
    import("@/components/rescue-team/dispatcher/DispatcherMap").catch(() => {
      // Fallback tạm thời nếu bác chưa tạo file DispatcherMap
      return function FallbackMap() {
        return (
          <div className="flex items-center justify-center h-full bg-slate-100 rounded-2xl">
            <span className="text-slate-400 font-medium text-sm">
              Chưa có Component Bản đồ
            </span>
          </div>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-slate-100 animate-pulse rounded-2xl">
        <span className="text-slate-400 font-medium text-sm">
          Đang tải bản đồ...
        </span>
      </div>
    ),
  },
);

export default function DispatcherDashboard() {
  const { data } = MOCK_DISPATCHER_DASHBOARD;

  // Dùng danh sách Incidents mới
  const [requestsList, setRequestsList] = useState<IncidentReport[]>(
    data.incidents,
  );

  const [sortConfig, setSortConfig] = useState<{
    key: "priority" | "status" | "time";
    direction: "desc" | "asc";
  } | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<IncidentReport | null>(
    requestsList[0] || null,
  );

  // ==========================================
  // XỬ LÝ THỜI GIAN & SẮP XẾP
  // ==========================================
  const getRelativeTime = (isoString: string) => {
    const past = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (diffInSeconds <= 60) return "Vừa xong";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const getExactTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedRequests = [...requestsList].sort((a, b) => {
    if (!sortConfig) return 0;
    if (sortConfig.key === "time") {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortConfig.direction === "desc" ? timeB - timeA : timeA - timeB;
    }
    if (sortConfig.key === "priority") {
      const weightA = priorityWeight[a.priority] || 0;
      const weightB = priorityWeight[b.priority] || 0;
      return sortConfig.direction === "desc"
        ? weightB - weightA
        : weightA - weightB;
    }
    if (sortConfig.key === "status") {
      const weightA = statusWeight[a.status] || 0;
      const weightB = statusWeight[b.status] || 0;
      return sortConfig.direction === "desc"
        ? weightB - weightA
        : weightA - weightB;
    }
    return 0;
  });

  const handleSort = (columnKey: "priority" | "status" | "time") => {
    let direction: "desc" | "asc" = "desc";
    if (
      sortConfig &&
      sortConfig.key === columnKey &&
      sortConfig.direction === "desc"
    ) {
      direction = "asc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  // ==========================================
  // RENDER UI HELPERS
  // ==========================================
  const renderStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="flex items-center text-red-600 font-bold whitespace-nowrap bg-red-50 px-2 py-1 rounded w-fit">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2 shrink-0 animate-pulse"></span>{" "}
            Chờ xử lý
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="flex items-center text-blue-600 font-bold whitespace-nowrap bg-blue-50 px-2 py-1 rounded w-fit">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shrink-0"></span>{" "}
            Đang xử lý
          </span>
        );
      case "RESOLVED":
        return (
          <span className="flex items-center text-emerald-600 font-bold whitespace-nowrap bg-emerald-50 px-2 py-1 rounded w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shrink-0"></span>{" "}
            Hoàn thành
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none rounded font-bold whitespace-nowrap text-[11px] px-2 py-0.5">
            CẤP BÁCH
          </Badge>
        );
      case "HIGH":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none rounded font-bold whitespace-nowrap text-[11px] px-2 py-0.5">
            NGUY HIỂM
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none rounded font-bold whitespace-nowrap text-[11px] px-2 py-0.5">
            TRUNG BÌNH
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="rounded font-bold whitespace-nowrap text-[11px] px-2 py-0.5"
          >
            THẤP
          </Badge>
        );
    }
  };
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [requiredMembers, setRequiredMembers] = useState<number>(1);

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto w-full bg-slate-50/80">
      {/* HEADER TỔNG QUAN THỐNG KÊ */}
      <div className="flex flex-col xl:flex-row gap-5 xl:gap-6 justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bảng Điều Phối Cứu Trợ
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            RescueCore Central Command — Giám sát & Điều động thời gian thực
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="p-3 min-w-[100px] bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tổng cộng
            </p>
            <p className="text-2xl font-black text-[#003da5] mt-0.5 ">
              {requestsList.length}
            </p>
          </div>
          <div className="p-3 min-w-[100px] bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
              Đang chờ
            </p>
            <p className="text-2xl font-black text-red-600 mt-0.5">
              {requestsList.filter((r) => r.status === "PENDING").length}
            </p>
          </div>
          <div className="p-3 min-w-[100px] bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
              Đang xử lý
            </p>
            <p className="text-2xl font-black text-blue-600 mt-0.5">
              {requestsList.filter((r) => r.status === "IN_PROGRESS").length}
            </p>
          </div>
          <div className="p-3 min-w-[100px] bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              Nhân sự rảnh
            </p>
            <p className="text-2xl font-black text-emerald-500 mt-0.5">
              {data.stats.totalRescuersReady}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT (LIST BÊN TRÁI, ĐIỀU PHỐI BÊN PHẢI) */}
      <div className="flex flex-col xl:flex-row gap-5 xl:gap-6 h-[calc(100vh-170px)] min-h-[550px]">
        {/* CỘT TRÁI - BẢNG DANH SÁCH YÊU CẦU */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <h2 className="font-bold text-[15px] text-slate-800">
              Danh sách yêu cầu mới nhất
            </h2>
            <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-0.5 uppercase shadow-md shadow-red-200 shrink-0 text-[10px]">
              CẦN XỬ LÝ
            </Badge>
          </div>

          <div className="flex-1 overflow-auto overflow-x-auto">
            <Table className="w-full text-[13px]">
              <TableHeader className="bg-slate-50/50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead
                    className="w-[100px] font-bold text-slate-500 cursor-pointer hover:text-slate-800 py-3"
                    onClick={() => handleSort("priority")}
                  >
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      ƯU TIÊN{" "}
                      <ArrowUpDown
                        className={`w-3 h-3 shrink-0 ${sortConfig?.key === "priority" ? "text-[#003da5]" : "text-slate-400"}`}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="w-[140px] font-bold text-slate-500 whitespace-nowrap py-3">
                    SỰ CỐ
                  </TableHead>
                  <TableHead className="w-[140px] font-bold text-slate-500 whitespace-nowrap py-3">
                    NGƯỜI GỌI
                  </TableHead>
                  <TableHead className="min-w-[180px] font-bold text-slate-500 py-3">
                    VỊ TRÍ
                  </TableHead>
                  <TableHead
                    className="w-[110px] font-bold text-slate-500 cursor-pointer hover:text-slate-800 py-3"
                    onClick={() => handleSort("time")}
                  >
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      THỜI GIAN{" "}
                      <ArrowUpDown
                        className={`w-3 h-3 shrink-0 ${sortConfig?.key === "time" ? "text-[#003da5]" : "text-slate-400"}`}
                      />
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[120px] font-bold text-slate-500 cursor-pointer hover:text-slate-800 py-3"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      TRẠNG THÁI{" "}
                      <ArrowUpDown
                        className={`w-3 h-3 shrink-0 ${sortConfig?.key === "status" ? "text-[#003da5]" : "text-slate-400"}`}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="w-[50px] text-right font-bold text-slate-500 pr-4 py-3">
                    GPS
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedRequests.map((req) => (
                  <TableRow
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`cursor-pointer transition-colors ${selectedRequest?.id === req.id ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-slate-50"}`}
                  >
                    <TableCell className="py-2.5">
                      {renderPriorityBadge(req.priority)}
                    </TableCell>

                    <TableCell className="py-2.5">
                      <div
                        className="font-bold text-slate-800 line-clamp-1"
                        title={req.title}
                      >
                        {req.title}
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5">
                      <div className="font-bold text-slate-800 whitespace-nowrap">
                        {req.callerName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 whitespace-nowrap">
                        {maskPhoneNumber(req.callerPhone)}
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5">
                      <div className="text-[13px] text-slate-600 line-clamp-2 min-w-[180px]">
                        {req.location.address}
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5">
                      <div className="font-bold text-slate-700 whitespace-nowrap">
                        {getRelativeTime(req.createdAt)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono whitespace-nowrap">
                        {getExactTime(req.createdAt)}
                      </div>
                    </TableCell>

                    <TableCell className="py-2.5">
                      {renderStatus(req.status)}
                    </TableCell>

                    <TableCell className="text-right pr-4 py-2.5">
                      <div className="flex justify-end">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(req);
                            // Bắn event để Map di chuyển tới tọa độ (nếu map có hứng sự kiện này)
                            window.dispatchEvent(
                              new CustomEvent("MOVE_MAP", {
                                detail: {
                                  lat: req.location.latitude,
                                  lng: req.location.longitude,
                                },
                              }),
                            );
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer transition-colors shrink-0 ${selectedRequest?.id === req.id ? "bg-[#003da5] text-white shadow-md" : "text-slate-400 hover:text-[#003da5] hover:bg-blue-50"}`}
                        >
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* CỘT PHẢI - BẢN ĐỒ VÀ BẢNG PHÂN CÔNG */}
        <div className="w-full xl:w-[380px] 2xl:w-[420px] flex flex-col gap-5 shrink-0 h-full">
          {/* MAP */}
          <div className="h-[260px] bg-slate-200 rounded-2xl overflow-hidden shadow-sm border border-slate-200 shrink-0 relative">
            <DispatcherMapComponent
              requests={selectedRequest ? [selectedRequest] : []}
            />
            {selectedRequest && (
              <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md border border-slate-200 flex items-center gap-1.5 pointer-events-none">
                <span className="flex h-1.5 w-1.5 relative shrink-0">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${selectedRequest.status === "PENDING" ? "bg-red-400" : "bg-blue-400"} opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-1.5 w-1.5 ${selectedRequest.status === "PENDING" ? "bg-red-500" : "bg-blue-500"}`}
                  ></span>
                </span>
                <span className="text-[10px] font-bold text-slate-800 font-mono">
                  INC-{selectedRequest.id.substring(4, 8)}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-bold text-[14px] text-slate-800">
                  Điều phối lực lượng
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Phân công theo Đội (Gửi lệnh cho Đội trưởng)
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-slate-500 bg-slate-50 shrink-0 text-[10px] px-2 py-0.5"
              >
                {data.teams.length} Đội trực ban
              </Badge>
            </div>

            <div className="p-3 overflow-y-auto flex-1 space-y-2 bg-slate-50/50">
              {!selectedRequest || selectedRequest.status !== "PENDING" ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                  <ShieldAlert className="w-8 h-8 mb-2 opacity-20" />
                  Hãy chọn một Sự cố đang chờ xử lý.
                </div>
              ) : (
                data.teams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => {
                      if (team.status === "READY") {
                        setSelectedTeamId(team.id);
                        setRequiredMembers(1); // Reset về 1 khi đổi đội
                      }
                    }}
                    className={`bg-white p-3 rounded-xl border transition-all ${
                      team.status === "READY"
                        ? "cursor-pointer hover:border-blue-300 shadow-sm"
                        : "opacity-60 bg-slate-50"
                    } ${selectedTeamId === team.id ? "border-[#003da5] ring-1 ring-[#003da5]" : "border-slate-200"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-[#003da5] rounded-lg flex items-center justify-center font-black text-xs shrink-0">
                          {team.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {team.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Đội trưởng:{" "}
                            <span className="font-bold">
                              {team.captainName}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {team.status === "READY" ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase">
                            Sẵn sàng
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded uppercase">
                            Đang bận
                          </span>
                        )}
                        <p className="text-[10px] text-slate-500 mt-1">
                          Quân số:{" "}
                          <span className="font-bold">
                            {team.onlineMembers}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* MỞ RỘNG KHI ĐƯỢC CHỌN - YÊU CẦU SỐ LƯỢNG */}
                    {selectedTeamId === team.id && (
                      <div className="mt-3 pt-3 border-t border-slate-100 animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-700">
                            Yêu cầu Đội trưởng cử bao nhiêu người?
                          </label>
                          <span className="text-[10px] text-slate-400">
                            Tối đa: {team.onlineMembers}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRequiredMembers((prev) =>
                                  Math.max(1, prev - 1),
                                );
                              }}
                              className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 font-bold"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              readOnly
                              value={requiredMembers}
                              className="w-10 text-center text-sm font-bold bg-transparent outline-none"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRequiredMembers((prev) =>
                                  Math.min(team.onlineMembers, prev + 1),
                                );
                              }}
                              className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 font-bold"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            Nhân sự
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-white shrink-0">
              <button
                disabled={
                  !selectedTeamId ||
                  !selectedRequest ||
                  selectedRequest.status !== "PENDING"
                }
                onClick={() => {
                  toast.success("ĐÃ GỬI LỆNH CHO ĐỘI TRƯỞNG!", {
                    description: `Yêu cầu cử ${requiredMembers} nhân sự từ đội đã được gửi đi.`,
                  });
                  setSelectedTeamId(null);
                }}
                className={`w-full font-bold py-3 rounded-xl text-[13px] transition shadow-md ${
                  selectedTeamId && selectedRequest?.status === "PENDING"
                    ? "bg-[#003da5] text-white hover:bg-blue-800 active:scale-[0.98]"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                XÁC NHẬN PHÂN CÔNG ({requiredMembers} NGƯỜI)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
