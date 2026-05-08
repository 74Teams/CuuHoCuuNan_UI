// src/types/rescue-team/dispatcher.ts

// 1. Kế thừa các Type gốc cốt lõi
import { LocationInfo, MissionStatus, RequestPriority } from "../request";
import { VictimInfo } from "../type";

// 2. Kế thừa Type của Member để đảm bảo trạng thái đồng nhất giữa Dispatcher và Rescuer
import { RescuerDutyStatus } from "./member";

// ==========================================
// 1. THÔNG TIN CỦA ĐIỀU PHỐI VIÊN (NGƯỜI TRỰC MÁY)
// ==========================================
export interface DispatcherProfile {
  id: string;
  userId: string;
  fullName: string;
  role: "CHIEF_DISPATCHER" | "DISPATCHER";
  // shiftStart: string; // ISO String thời gian bắt đầu ca
  // shiftEnd: string;   // ISO String thời gian kết thúc ca
  avatarUrl?: string;
}

// ==========================================
// 2. QUẢN LÝ SỰ CỐ / YÊU CẦU CỨU HỘ (INCIDENT)
// ==========================================
// Giải thích logic: Người dân báo cáo -> Gọi là Incident (Sự cố)
// Dispatcher giao Incident này cho 1 Rescuer -> Nó biến thành ActiveMission trên điện thoại của Rescuer đó.
export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  callerName: string;
  callerPhone: string;
  priority: RequestPriority; // Import từ request.ts (LOW, MEDIUM, HIGH, CRITICAL)
  status: MissionStatus; // Import từ request.ts (PENDING, IN_PROGRESS, RESOLVED...)
  location: LocationInfo; // Import từ request.ts
  victims: VictimInfo[]; // Import từ type.ts
  createdAt: string;
  updatedAt: string;
  assignedRescuerIds: string[]; // Danh sách ID các đội viên đã được điều động đi xử lý vụ này
}

// ==========================================
// 3. QUẢN LÝ LỰC LƯỢNG TRÊN BẢN ĐỒ (RESCUER OVERVIEW)
// ==========================================
// Dùng để vẽ các chấm xanh (xe cứu hộ) di chuyển trên bản đồ tổng
export interface RescuerOverview {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  specialty: string;
  dutyStatus: RescuerDutyStatus; // Tái sử dụng trạng thái ONLINE/OFFLINE/READY từ member.ts
  currentLocation: LocationInfo | null; // GPS realtime bắn về liên tục (null nếu tắt app)
  batteryLevel?: number; // % Pin điện thoại (Để Dispatcher biết tránh giao việc cho ông sắp sập nguồn)
  activeIncidentId: string | null; // Đang kẹt ở sự cố nào (null nếu đang rảnh)
}

// ==========================================
// 4. CHỈ SỐ THỐNG KÊ (DASHBOARD CARDS)
// ==========================================
export interface DispatcherStats {
  totalPendingIncidents: number; // Số vụ đang chờ (Chưa ai nhận)
  totalActiveIncidents: number; // Số vụ đang xử lý
  totalResolvedToday: number; // Số vụ đã xong trong ngày
  totalRescuersOnline: number; // Tổng nhân sự đang Online
  totalRescuersReady: number; // Tổng nhân sự đang Rảnh (Có thể điều động ngay)
}

// ==========================================
// 5. GÓI DỮ LIỆU TỔNG ĐỂ RENDER GIAO DIỆN CHÍNH
// ==========================================

// ==========================================
// WRAPPER BỌC NGOÀI CHUẨN API (Nếu file member.ts đã có thì không cần lặp lại)
// ==========================================
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface RescueTeamOverview {
  id: string;
  name: string;
  captainName: string;
  specialty: string;
  status: "READY" | "BUSY" | "OFFLINE";
  onlineMembers: number;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
}

export interface DispatcherDashboardData {
  profile: DispatcherProfile;
  stats: DispatcherStats;
  incidents: IncidentReport[];
  teams: RescueTeamOverview[];
}
