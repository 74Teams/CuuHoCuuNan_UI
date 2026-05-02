// src/types/rescuer.ts
import { LocationInfo, MissionStatus, RequestPriority } from "../request";

import { VictimInfo } from "../type";

export type NotificationType =
  | "NEW_MISSION_ASSIGNED"
  | "SYSTEM_ALERT"
  | "LEAVE_APPROVED"
  | "LEAVE_REJECTED"
  | "MISSION_CANCELED";

export interface RescuerProfile {
  id: string;
  userId: string;
  fullName: string;
  specialty: string;
  avatarUrl?: string;
}

export interface RescuerDutyStatus {
  isOnline: boolean;
  //- "READY": isOnline = true và activeMission = null
  // - "ON_MISSION": isOnline = true và activeMission != null
  statusCode: "READY" | "ON_MISSION" | "OFFLINE" | "ON_LEAVE";
  lastUpdated: string;
}

export interface RescuerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}

// Kế thừa LocationInfo nhưng thêm distanceKm (Vì khoảng cách thay đổi tùy vào vị trí GPS của từng thành viên)
export interface ActiveMissionLocation extends LocationInfo {
  distanceKm?: number;
}

export interface RescuerActiveMission {
  id: string;
  title: string;
  status: MissionStatus;
  priority: RequestPriority;
  victims: VictimInfo[];
  location: ActiveMissionLocation;
}

export interface MemberDashboardData {
  profile: RescuerProfile;
  dutyStatus: RescuerDutyStatus;
  notifications: RescuerNotification[];
  activeMission: RescuerActiveMission | null;
}

// Wrapper bọc ngoài chuẩn API
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
