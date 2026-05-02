import { RequestDetail } from "@/types/request";
export const MOCK_REQUESTS: RequestDetail[] = [
  // 1. NGẬP LỤT - Đang chờ xử lý (Cấp bách)
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    requestedBy: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      fullName: "Nguyễn Văn A",
      phoneNumber: "0905123456",
      email: "nguyenvana@example.com",
    },
    emergencyType: "FLOOD",
    priority: "CRITICAL",
    status: "PENDING",
    description:
      "Nước ngập vào nhà hơn 1.5m, dòng chảy siết. Có 2 người già và 1 trẻ em đang mắc kẹt trên gác lửng, cần xuồng cứu hộ khẩn cấp.",
    location: {
      id: "770e8400-e29b-41d4-a716-446655440001",
      latitude: 16.068,
      longitude: 108.212,
      address: "K123/45 Ông Ích Khiêm, phường Thanh Bình, Hải Châu, Đà Nẵng",
      landmark: "Gần ngã tư Ông Ích Khiêm - Quang Trung",
    },
    mediaUrl: [],
    submittedTime: "2026-04-10T08:30:00Z",
    missions: [],
    createdAt: "2026-04-10T08:30:00Z",
    updatedAt: "2026-04-10T08:30:00Z",
  },

  // 2. Y TẾ - Đang điều phối (Nguy hiểm)
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    requestedBy: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      fullName: "Trần Thị B",
      phoneNumber: "0905888999",
      email: "tranthib@example.com",
    },
    emergencyType: "MEDICAL",
    priority: "HIGH",
    status: "IN_PROGRESS",
    description:
      "Tai nạn giao thông nghiêm trọng do cây đổ. Nạn nhân nam, khoảng 40 tuổi, chảy nhiều máu ở vùng đầu và bất tỉnh.",
    location: {
      id: "770e8400-e29b-41d4-a716-446655440002",
      latitude: 16.06,
      longitude: 108.21,
      address: "K20/5 Hoàng Diệu, Phường Bình Hiên, Hải Châu, Đà Nẵng",
      landmark: "Hẻm cạnh bưu điện",
    },
    mediaUrl: [],
    submittedTime: "2026-04-10T09:15:00Z",
    missions: [
      {
        id: "880e8400-e29b-41d4-a716-446655440000",
        status: "IN_PROGRESS",
        startTime: "2026-04-10T09:20:00Z",
        rescueTeam: {
          id: "990e8400-e29b-41d4-a716-446655440000",
          teamName: "Đội Cấp Cứu 115 - Trạm Hải Châu",
          status: "ON_MISSION",
        },
      },
    ],
    createdAt: "2026-04-10T09:15:00Z",
    updatedAt: "2026-04-10T09:20:00Z",
  },

  // 3. HỎA HOẠN - Đang chờ xử lý (Cấp bách)
  {
    id: "660e8400-e29b-41d4-a716-446655440003",
    userId: "550e8400-e29b-41d4-a716-446655440002",
    requestedBy: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      fullName: "Lê Văn C",
      phoneNumber: "0934111222",
      email: "levanc@example.com",
    },
    emergencyType: "FIRE",
    priority: "CRITICAL",
    status: "PENDING",
    description:
      "Cháy lớn tại khu vực kho hàng xưởng gỗ, ngọn lửa đang lan nhanh sang các nhà dân lân cận. Khói rất dày đặc.",
    location: {
      id: "770e8400-e29b-41d4-a716-446655440003",
      latitude: 16.082,
      longitude: 108.15,
      address: "Đường số 4, KCN Hòa Khánh, Liên Chiểu, Đà Nẵng",
      landmark: "Cổng số 2 KCN",
    },
    mediaUrl: [],
    submittedTime: "2026-04-10T09:45:00Z",
    missions: [],
    createdAt: "2026-04-10T09:45:00Z",
    updatedAt: "2026-04-10T09:45:00Z",
  },

  // 4. SẠT LỞ - Đang điều phối (Nguy hiểm)
  {
    id: "660e8400-e29b-41d4-a716-446655440004",
    userId: "550e8400-e29b-41d4-a716-446655440003",
    requestedBy: {
      id: "550e8400-e29b-41d4-a716-446655440003",
      fullName: "Phạm Thị D",
      phoneNumber: "0987555666",
      email: "phamthid@example.com",
    },
    emergencyType: "LANDSLIDE",
    priority: "HIGH",
    status: "IN_PROGRESS",
    description:
      "Đất đá sạt lở chia cắt hoàn toàn tuyến đường. Có 1 xe tải chở hàng bị đất đá vùi lấp phần đuôi, tài xế vẫn an toàn nhưng không thể thoát ra.",
    location: {
      id: "770e8400-e29b-41d4-a716-446655440004",
      latitude: 16.185,
      longitude: 108.125,
      address: "Km 12+500 Đèo Hải Vân, Liên Chiểu, Đà Nẵng",
      landmark: "Cách đỉnh đèo 2km về phía Nam",
    },
    mediaUrl: [],
    submittedTime: "2026-04-10T10:00:00Z",
    missions: [
      {
        id: "880e8400-e29b-41d4-a716-446655440001",
        status: "IN_PROGRESS",
        startTime: "2026-04-10T10:10:00Z",
        rescueTeam: {
          id: "990e8400-e29b-41d4-a716-446655440001",
          teamName: "Đội CHCN Giao Thông Phía Bắc",
          status: "ON_MISSION",
        },
      },
    ],
    createdAt: "2026-04-10T10:00:00Z",
    updatedAt: "2026-04-10T10:10:00Z",
  },

  // 5. Y TẾ - Đã hoàn thành (Trung bình)
  {
    id: "660e8400-e29b-41d4-a716-446655440005",
    userId: "550e8400-e29b-41d4-a716-446655440004",
    requestedBy: {
      id: "550e8400-e29b-41d4-a716-446655440004",
      fullName: "Đội Tuần Tra Biển",
      phoneNumber: "02363999999",
      email: "lifeguard.mykhe@example.com",
    },
    emergencyType: "MEDICAL",
    priority: "MEDIUM",
    status: "RESOLVED",
    description:
      "Cứu hộ thành công một du khách bị đuối nước. Nạn nhân đã tỉnh táo nhưng cần chuyển về bệnh viện kiểm tra phổi.",
    location: {
      id: "770e8400-e29b-41d4-a716-446655440005",
      latitude: 16.059,
      longitude: 108.245,
      address: "Bãi tắm số 3, Biển Mỹ Khê, Sơn Trà, Đà Nẵng",
      landmark: "Đối diện khách sạn Holiday Beach",
    },
    mediaUrl: [],
    submittedTime: "2026-04-10T07:15:00Z",
    missions: [
      {
        id: "880e8400-e29b-41d4-a716-446655440002",
        status: "COMPLETED",
        startTime: "2026-04-10T07:20:00Z",
        rescueTeam: {
          id: "990e8400-e29b-41d4-a716-446655440002",
          teamName: "Xe Cấp Cứu Trực Bãi Biển",
          status: "AVAILABLE",
        },
      },
    ],
    createdAt: "2026-04-10T07:15:00Z",
    updatedAt: "2026-04-10T08:00:00Z",
  },

  // 6. NGẬP LỤT - Đang chờ xử lý (Thấp)
  {
    id: "660e8400-e29b-41d4-a716-446655440006",
    userId: "550e8400-e29b-41d4-a716-446655440005",
    requestedBy: {
      id: "550e8400-e29b-41d4-a716-446655440005",
      fullName: "Hoàng Minh E",
      phoneNumber: "0901222333",
      email: "hoangminhe@example.com",
    },
    emergencyType: "FLOOD",
    priority: "LOW",
    status: "PENDING",
    description:
      "Khu vực đường trũng thấp bắt đầu ngập 30cm, người dân báo cáo để chính quyền nắm tình hình hỗ trợ kê cao đồ đạc nếu nước tiếp tục lên.",
    location: {
      id: "770e8400-e29b-41d4-a716-446655440006",
      latitude: 16.021,
      longitude: 108.215,
      address: "Đường Võ Chí Công, Khu đô thị Hòa Xuân, Cẩm Lệ, Đà Nẵng",
      landmark: "Khu vực gần cầu Hòa Xuân",
    },
    mediaUrl: [],
    submittedTime: "2026-04-10T11:00:00Z",
    missions: [],
    createdAt: "2026-04-10T11:00:00Z",
    updatedAt: "2026-04-10T11:00:00Z",
  },

  // 7. SẠT LỞ - Đang chờ xử lý (Trung bình)
  {
    id: "660e8400-e29b-41d4-a716-446655440007",
    userId: "550e8400-e29b-41d4-a716-446655440006",
    requestedBy: {
      id: "550e8400-e29b-41d4-a716-446655440006",
      fullName: "UBND Xã Hòa Bắc",
      phoneNumber: "02363777888",
      email: "hoabac@example.com",
    },
    emergencyType: "LANDSLIDE",
    priority: "MEDIUM",
    status: "PENDING",
    description:
      "Sạt lở taluy dương làm đất đá tràn xuống đường giao thông liên thôn. Hiện không có thiệt hại về người nhưng xe cơ giới không thể qua lại.",
    location: {
      id: "770e8400-e29b-41d4-a716-446655440007",
      latitude: 16.12,
      longitude: 108.05,
      address: "Thôn Tà Lang, Xã Hòa Bắc, Huyện Hòa Vang, Đà Nẵng",
      landmark: "Đường đèo đi thôn Giàn Bí",
    },
    mediaUrl: [],
    submittedTime: "2026-04-10T11:20:00Z",
    missions: [],
    createdAt: "2026-04-10T11:20:00Z",
    updatedAt: "2026-04-10T11:20:00Z",
  },

  // 8. HỎA HOẠN - Đã hoàn thành (Nguy hiểm)
  {
    id: "660e8400-e29b-41d4-a716-446655440008",
    userId: "550e8400-e29b-41d4-a716-446655440007",
    requestedBy: {
      id: "550e8400-e29b-41d4-a716-446655440007",
      fullName: "Người dân khu phố",
      phoneNumber: "0912444555",
      email: "dancu@example.com",
    },
    emergencyType: "FIRE",
    priority: "HIGH",
    status: "RESOLVED",
    description:
      "Cháy bình biến áp cột điện đầu ngõ, đã dập tắt nhưng hệ thống điện khu vực đang bị chập, cần đội kỹ thuật đến cô lập.",
    location: {
      id: "770e8400-e29b-41d4-a716-446655440008",
      latitude: 16.072,
      longitude: 108.23,
      address: "K65 Tô Hiến Thành, Phường Phước Mỹ, Sơn Trà, Đà Nẵng",
      landmark: "Đầu hẻm",
    },
    mediaUrl: [],
    submittedTime: "2026-04-10T06:00:00Z",
    missions: [
      {
        id: "880e8400-e29b-41d4-a716-446655440003",
        status: "COMPLETED",
        startTime: "2026-04-10T06:05:00Z",
        rescueTeam: {
          id: "990e8400-e29b-41d4-a716-446655440003",
          teamName: "Đội PCCC Sơn Trà & EVN Đà Nẵng",
          status: "AVAILABLE",
        },
      },
    ],
    createdAt: "2026-04-10T06:00:00Z",
    updatedAt: "2026-04-10T06:45:00Z",
  },
];
