// src/data/mockApiRescuer.ts
import { ApiResponse, MemberDashboardData } from "@/types/rescue-team/member";

export const MOCK_MEMBER_DASHBOARD: ApiResponse<MemberDashboardData> = {
  success: true,
  statusCode: 200,
  message: "Lấy dữ liệu Dashboard thành công",
  data: {
    profile: {
      id: "member_02",
      userId: "usr_002",
      fullName: "Lê Văn Nam",
      specialty: "ĐỘI CỨU HỘ NƯỚC",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nam",
    },

    dutyStatus: {
      isOnline: true,
      statusCode: "READY",
      lastUpdated: new Date().toISOString(),
    },

    notifications: [
      {
        id: "notif_102",
        type: "NEW_MISSION_ASSIGNED",
        title: "Nhiệm vụ mới từ Team Lead",
        message: "Yêu cầu hỗ trợ cứu hộ tại Quận 7. Nhấn để xem chi tiết.",
        createdAt: new Date(Date.now() - 120000).toISOString(),
        isRead: false,
        actionUrl: "/missions/RE-405",
      },
      {
        id: "notif_103",
        type: "MISSION_CANCELED",
        title: "Hủy bỏ nhiệm vụ XYZ",
        message:
          "Nhiệm vụ của bạn bị hủy bỏ do tình trạng đã được ứng phó kịp thời.",
        createdAt: new Date(Date.now() - 120000).toISOString(),
        isRead: false,
        actionUrl: "/missions/RE-406",
      },
      {
        id: "notif_104",
        type: "SYSTEM_ALERT",
        title: "Cảnh báo thời tiết xấu",
        message:
          "Phía bên nạn nhân đang mưa to và có khả năng sạt lở cao, đề phòng nguy hại, hãy sử dụng xe chuyên dụng do cơ quan tổ chức",
        createdAt: new Date(Date.now() - 120000).toISOString(),
        isRead: false,
        actionUrl: "/missions/RE-407",
      },
      {
        id: "notif_105",
        type: "MISSION_CANCELED",
        title: "Hủy bỏ nhiệm vụ XYZ",
        message:
          "Nhiệm vụ của bạn bị hủy bỏ do tình trạng đã được ứng phó kịp thời.",
        createdAt: new Date(Date.now() - 120000).toISOString(),
        isRead: false,
        actionUrl: "/missions/RE-408",
      },
      {
        id: "notif_106",
        type: "MISSION_CANCELED",
        title: "Hủy bỏ nhiệm vụ XYZ",
        message:
          "Nhiệm vụ của bạn bị hủy bỏ do tình trạng đã được ứng phó kịp thời.",
        createdAt: new Date(Date.now() - 120000).toISOString(),
        isRead: false,
        actionUrl: "/missions/RE-409",
      },
      {
        id: "notif_107",
        type: "MISSION_CANCELED",
        title: "Hủy bỏ nhiệm vụ XYZ",
        message:
          "Nhiệm vụ của bạn bị hủy bỏ do tình trạng đã được ứng phó kịp thời.",
        createdAt: new Date(Date.now() - 120000).toISOString(),
        isRead: false,
        actionUrl: "/missions/RE-410",
      },
      {
        id: "notif_108",
        type: "MISSION_CANCELED",
        title: "Hủy bỏ nhiệm vụ XYZ",
        message:
          "Nhiệm vụ của bạn bị hủy bỏ do tình trạng đã được ứng phó kịp thời.",
        createdAt: new Date(Date.now() - 120000).toISOString(),
        isRead: false,
        actionUrl: "/missions/RE-411",
      },
      {
        id: "notif_109",
        type: "MISSION_CANCELED",
        title: "Hủy bỏ nhiệm vụ XYZ",
        message:
          "Nhiệm vụ của bạn bị hủy bỏ do tình trạng đã được ứng phó kịp thời.",
        createdAt: new Date(Date.now() - 120000).toISOString(),
        isRead: false,
        actionUrl: "/missions/RE-412",
      },
    ],

    activeMission: {
      id: "RE-405",
      title: "Cứu hộ Sơ tán Ngập lụt",
      status: "IN_PROGRESS",
      priority: "CRITICAL",
      victims: [
        {
          id: "v1",
          fullName: "Nguyễn Văn A",
          age: 65,
          phoneNumber: "0369999342",
          email: "resucesystem@online.com",
          condition: "Cần hỗ trợ y tế khẩn cấp, có biểu hiện hạ thân nhiệt",
        },
      ],
      location: {
        id: "loc_01",
        address: "Đường Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng",
        latitude: 16.0678,
        longitude: 108.244,
        landmark: "Gần bãi biển Mỹ Khê",
        distanceKm: 1.2,
      },
    },
  },
};
