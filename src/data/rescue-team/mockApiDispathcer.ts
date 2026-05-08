// src/data/rescue-team/mockDispatcherData.ts

import {
  DispatcherDashboardData,
  IncidentReport,
  RescuerOverview,
  RescueTeamOverview,
} from "@/types/rescue-team/dispatcher";
import { RequestPriority, MissionStatus } from "@/types/request";

// ==========================================
// 1. DỮ LIỆU ĐỘI VIÊN (RESCUERS)
// ==========================================

export const MOCK_RESCUERS: RescuerOverview[] = [
  {
    id: "R-001",
    userId: "USR-101",
    fullName: "Lê Văn Tiến",
    phone: "0901234567",
    specialty: "Cứu hộ dưới nước, Lái xuồng",
    dutyStatus: {
      isOnline: true,
      statusCode: "READY",
      lastUpdated: new Date().toISOString(),
    },
    currentLocation: {
      id: "LOC-R001",
      latitude: 16.0544,
      longitude: 108.2022,
      address: "Hải Châu, Đà Nẵng",
    },
    batteryLevel: 85,
    activeIncidentId: null,
  },
  {
    id: "R-002",
    userId: "USR-102",
    fullName: "Nguyễn Thị Hoa",
    phone: "0912345678",
    specialty: "Sơ cứu y tế cơ bản",
    dutyStatus: {
      isOnline: true,
      statusCode: "ON_MISSION",
      lastUpdated: new Date().toISOString(),
    },
    currentLocation: {
      id: "LOC-R002",
      latitude: 16.068,
      longitude: 108.212,
      address: "Sơn Trà, Đà Nẵng",
    },
    batteryLevel: 42,
    activeIncidentId: "INC-9901",
  },
  {
    id: "R-003",
    userId: "USR-103",
    fullName: "Trần Hữu Quân",
    phone: "0987654321",
    specialty: "Cứu hộ hỏa hoạn, Di tản",
    dutyStatus: {
      isOnline: true,
      statusCode: "READY",
      lastUpdated: new Date().toISOString(),
    },
    currentLocation: {
      id: "LOC-R003",
      latitude: 16.035,
      longitude: 108.218,
      address: "Ngũ Hành Sơn, Đà Nẵng",
    },
    batteryLevel: 98,
    activeIncidentId: null,
  },
  {
    id: "R-004",
    userId: "USR-104",
    fullName: "Phạm Đức Thắng",
    phone: "0934567890",
    specialty: "Cơ khí, Tháo dỡ vật cản",
    dutyStatus: {
      isOnline: false,
      statusCode: "OFFLINE",
      lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    },
    currentLocation: null,
    batteryLevel: 5,
    activeIncidentId: null,
  },
  {
    id: "R-005",
    userId: "USR-105",
    fullName: "Hoàng Thanh Bình",
    phone: "0965432109",
    specialty: "Điều phối hiện trường",
    dutyStatus: {
      isOnline: true,
      statusCode: "ON_MISSION",
      lastUpdated: new Date().toISOString(),
    },
    currentLocation: {
      id: "LOC-R005",
      latitude: 16.072,
      longitude: 108.15,
      address: "Liên Chiểu, Đà Nẵng",
    },
    batteryLevel: 60,
    activeIncidentId: "INC-9902",
  },
];

// ==========================================
// 2. DỮ LIỆU SỰ CỐ / YÊU CẦU CỨU HỘ (INCIDENTS)
// Đã fix lỗi properties của VictimInfo (fullName, phoneNumber, email)
// ==========================================
export const MOCK_INCIDENTS: IncidentReport[] = [
  {
    id: "INC-9903",
    title: "Cây đổ đè trúng xe máy",
    description:
      "Cây xà cừ lớn bật gốc đè trúng người đi đường, nạn nhân đang bị kẹt chân dưới gốc cây.",
    callerName: "Bác Tâm (Người dân)",
    callerPhone: "0908111222",
    priority: "CRITICAL" as RequestPriority,
    status: "PENDING" as MissionStatus,
    location: {
      id: "LOC-INC9903",
      latitude: 16.059,
      longitude: 108.2,
      address: "Ngã tư Lê Duẩn - Hoàng Hoa Thám, Đà Nẵng",
    },
    victims: [
      {
        id: "V-01",
        fullName: "Chưa rõ tên",
        age: 30,
        phoneNumber: "",
        email: "",
        condition: "Kẹt chân phải, chảy nhiều máu, tỉnh táo",
      },
    ],
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    assignedRescuerIds: [],
  },
  {
    id: "INC-9904",
    title: "Ngập sâu khu dân cư",
    description:
      "Nước lên nhanh trong đêm, ngập qua đầu gối, có 2 người già và 1 trẻ em cần sơ tán lên cao.",
    callerName: "Chị Lan",
    callerPhone: "0912333444",
    priority: "HIGH" as RequestPriority,
    status: "PENDING" as MissionStatus,
    location: {
      id: "LOC-INC9904",
      latitude: 16.04,
      longitude: 108.22,
      address: "Hẻm 45 Mẹ Nhu, Thanh Khê, Đà Nẵng",
    },
    victims: [
      {
        id: "V-02",
        fullName: "Trần Văn B",
        age: 75,
        phoneNumber: "",
        email: "",
        condition: "Khó thở nhẹ",
      },
      {
        id: "V-03",
        fullName: "Lê Thị C",
        age: 70,
        phoneNumber: "",
        email: "",
        condition: "Bình thường",
      },
      {
        id: "V-04",
        fullName: "Bé Gấu",
        age: 5,
        phoneNumber: "",
        email: "",
        condition: "Hoảng loạn",
      },
    ],
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    assignedRescuerIds: [],
  },
  {
    id: "INC-9901",
    title: "Tai nạn giao thông - Đã có người",
    description:
      "Va chạm giữa 2 xe máy, nạn nhân trầy xước nhẹ, cần hỗ trợ y tế sơ cứu tại chỗ.",
    callerName: "Anh Hùng",
    callerPhone: "0988555666",
    priority: "MEDIUM" as RequestPriority,
    status: "IN_PROGRESS" as MissionStatus,
    location: {
      id: "LOC-INC9901",
      latitude: 16.068,
      longitude: 108.212,
      address: "Cầu Rồng, Đà Nẵng",
    },
    victims: [
      {
        id: "V-05",
        fullName: "Nguyễn Nam",
        age: 22,
        phoneNumber: "0909123123",
        email: "nam@email.com",
        condition: "Trầy xước tay chân",
      },
    ],
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    assignedRescuerIds: ["R-002"],
  },
  {
    id: "INC-9902",
    title: "Sập la phông nhà trọ",
    description:
      "Mưa lớn làm sập la phông, mảng thạch cao rớt trúng đầu sinh viên.",
    callerName: "Em Tuấn",
    callerPhone: "0905999888",
    priority: "HIGH" as RequestPriority,
    status: "IN_PROGRESS" as MissionStatus,
    location: {
      id: "LOC-INC9902",
      latitude: 16.072,
      longitude: 108.15,
      address: "Đường Tôn Đức Thắng, Liên Chiểu, Đà Nẵng",
    },
    victims: [
      {
        id: "V-06",
        fullName: "Lê Văn Tí",
        age: 19,
        phoneNumber: "0933456789",
        email: "",
        condition: "Chấn thương phần mềm ở đầu",
      },
    ],
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    assignedRescuerIds: ["R-005"],
  },
];

// ==========================================
// 3. THỐNG KÊ TỔNG QUÁT (DASHBOARD STATS)
// ==========================================
const calculateStats = () => {
  return {
    totalPendingIncidents: MOCK_INCIDENTS.filter((i) => i.status === "PENDING")
      .length,
    totalActiveIncidents: MOCK_INCIDENTS.filter(
      (i) => i.status === "IN_PROGRESS",
    ).length,
    totalResolvedToday: 12,
    totalRescuersOnline: MOCK_RESCUERS.filter((r) => r.dutyStatus.isOnline)
      .length,
    totalRescuersReady: MOCK_RESCUERS.filter(
      (r) => r.dutyStatus.statusCode === "READY",
    ).length,
  };
};

// ==========================================
// 4. GÓI DỮ LIỆU TỔNG DÀNH CHO API RESPONSE
// ==========================================
export const MOCK_TEAMS: RescueTeamOverview[] = [
  {
    id: "TEAM-01",
    name: "Đội Y Tế Nhanh Quận 1",
    captainName: "Lê Văn Tiến",
    specialty: "Sơ cứu y tế, Chuyển viện",
    status: "READY",
    onlineMembers: 12,
    currentLocation: {
      latitude: 16.0544,
      longitude: 108.2022,
      address: "Trạm y tế Quận 1",
    },
  },
  {
    id: "TEAM-02",
    name: "Đội CHCN Dưới Nước",
    captainName: "Nguyễn Thị Hoa",
    specialty: "Lái xuồng, Lặn cứu hộ",
    status: "BUSY",
    onlineMembers: 8,
    currentLocation: {
      latitude: 16.068,
      longitude: 108.212,
      address: "Sông Hàn",
    },
  },
  {
    id: "TEAM-03",
    name: "Đội Phản Ứng Nhanh PCCC",
    captainName: "Trần Hữu Quân",
    specialty: "Chữa cháy, Dập lửa, Cứu hộ",
    status: "READY",
    onlineMembers: 15,
    currentLocation: {
      latitude: 16.035,
      longitude: 108.218,
      address: "Trạm PCCC số 3",
    },
  },
];

export const MOCK_DISPATCHER_DASHBOARD = {
  success: true,
  statusCode: 200,
  message: "Lấy dữ liệu Trạm Điều Phối thành công",
  data: {
    profile: {
      id: "DISP-01",
      userId: "AD-999",
      fullName: "Đội Trưởng Nguyễn Admin",
      role: "CHIEF_DISPATCHER",
      shiftStart: new Date(Date.now() - 4 * 3600000).toISOString(),
      shiftEnd: new Date(Date.now() + 4 * 3600000).toISOString(),
    },
    stats: calculateStats(),
    incidents: MOCK_INCIDENTS,
    teams: MOCK_TEAMS,
  } as DispatcherDashboardData,
};
