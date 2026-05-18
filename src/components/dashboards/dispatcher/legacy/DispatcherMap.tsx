"use client";

// Đổi Import Type sang IncidentReport thay vì Request cũ
import { IncidentReport } from "@/types/dashboards/dispatcher";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, Loader2, LocateFixed, Minus, Phone, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { toast } from "sonner";
import RequestDetailDialog from "./DispatchCommandDialog"; // Đảm bảo Component này vẫn còn tồn tại nhé
import { MapLayer } from "@/constants/map-layers";

// 1. MARKER TÂM BẢN ĐỒ / GPS HIỆN TẠI
const shadcnIcon = new L.DivIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <span class="absolute inline-flex w-full h-full bg-blue-400 rounded-full opacity-50 animate-ping"></span>
      <svg class="relative z-10 w-8 h-8 text-blue-700 fill-blue-100 drop-shadow-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MAP_LAYERS = [
  {
    name: "Google Maps",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "&copy; Google Maps",
  },
  {
    name: "Bản đồ Cứu hộ",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap",
  },
  {
    name: "Vệ tinh",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
];

// Hàm tạo Icon động dựa theo Status (Đỏ cho PENDING, Xanh cho IN_PROGRESS)
const createIncidentIcon = (status: string) => {
  const color = status === "PENDING" ? "bg-red-500" : "bg-blue-500";
  const innerColor = status === "PENDING" ? "bg-red-600" : "bg-blue-600";
  return new L.DivIcon({
    className: "bg-transparent border-none",
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="absolute inline-flex w-full h-full ${color} rounded-full opacity-75 animate-ping"></span>
        <div class="relative w-3 h-3 ${innerColor} rounded-full border-2 border-white shadow-sm"></div>
      </div>
    `,
    iconSize: [24, 24],
    popupAnchor: [0, -12], // Đẩy popup lên một chút để không che icon
  });
};

// Từ điển Map nhanh các loại sự cố và mức độ (Bác có thể thay bằng file constants nếu muốn)
const PRIORITY_LABELS: Record<string, string> = {
  CRITICAL: "CẤP BÁCH",
  HIGH: "NGUY HIỂM",
  MEDIUM: "TRUNG BÌNH",
  LOW: "THẤP",
};

// ========================================================
// 2. COMPONENT BẢN ĐỒ CHÍNH
// ========================================================

export default function Map({ requests }: { requests: IncidentReport[] }) {
  const [position, setPosition] = useState<[number, number]>([
    16.0544, 108.2022,
  ]); // Mặc định ở Đà Nẵng
  const [layerIndex, setLayerIndex] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [popupContent, setPopupContent] = useState("Vị trí Trạm Điều Phối");

  const mapRef = useRef<LeafletMap | null>(null);

  // Xử lý sự kiện bay từ cái bảng Danh sách (khi ấn con mắt)
  useEffect(() => {
    const handleMoveMap = (e: Event) => {
      // Ép kiểu chuẩn để TS không kêu ca
      const customEvent = e as CustomEvent<{ lat: number; lng: number }>;
      const { lat, lng } = customEvent.detail;

      if (mapRef.current && lat && lng) {
        mapRef.current.flyTo([lat, lng], 17, { animate: true, duration: 1.5 });
      }
    };

    window.addEventListener("MOVE_MAP", handleMoveMap);
    return () => window.removeEventListener("MOVE_MAP", handleMoveMap);
  }, []);

  // Tự động focus vào điểm đầu tiên trong danh sách khi load
  useEffect(() => {
    if (requests.length > 0 && mapRef.current) {
      mapRef.current.flyTo(
        [requests[0].location.latitude, requests[0].location.longitude],
        15,
      );
    }
    // Sửa lỗi map bị co xám khi load trong flexbox
    setTimeout(() => mapRef.current?.invalidateSize(), 300);
  }, [requests]);

  const handleSwitchLayer = () =>
    setLayerIndex((prev) => (prev + 1) % MAP_LAYERS.length);

  const handleLocate = () => {
    if (!mapRef.current) return;

    if (!navigator.geolocation) {
      toast.error("Lỗi định vị", {
        description:
          "Trình duyệt hoặc thiết bị của bạn không hỗ trợ định vị GPS.",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(newCoords);
        setPopupContent("Vị trí của bạn");
        mapRef.current?.flyTo(newCoords, 16);
        setIsLocating(false);
        toast.success("Đã định vị thành công");
      },
      (error) => {
        setIsLocating(false);
        toast.error("Không thể lấy tọa độ", {
          description: "Mất tín hiệu hoặc bạn chưa cấp quyền GPS.",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const btnClass =
    "w-10 h-10 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center text-[#20448c] hover:bg-blue-50 hover:text-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer";
  const tooltipClass =
    "absolute right-12 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none";

  return (
    <div className="w-full h-full bg-slate-50 relative">
      <div className="w-full h-full rounded-sm overflow-hidden border border-slate-200 shadow-sm relative">
        <MapContainer
          ref={mapRef}
          center={position}
          zoom={13}
          zoomControl={false} // Tắt zoom mặc định của Leaflet để dùng nút tùy chỉnh của bác
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution={MAP_LAYERS[2].attribution}
            url={MAP_LAYERS[2].url}
          />

          {/* RENDER CÁC SỰ CỐ TỪ DANH SÁCH */}
          {requests &&
            requests.map((request) => {
              const isPending = request.status === "PENDING";

              return (
                <Marker
                  key={request.id}
                  position={[
                    request.location?.latitude || 16.0544,
                    request.location?.longitude || 108.2022,
                  ]}
                  icon={createIncidentIcon(request.status)}
                >
                  <Popup className="shadcn-popup">
                    <div className="flex flex-col w-[220px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                      {/* Header Của Popup đổi màu theo Trạng thái */}
                      <div
                        className={`${isPending ? "bg-red-50/50 border-red-100/50" : "bg-blue-50/50 border-blue-100/50"} px-3 py-2 border-b flex items-center justify-between`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPending ? "bg-red-400" : "bg-blue-400"} opacity-75`}
                            ></span>
                            <span
                              className={`relative inline-flex rounded-full h-2 w-2 ${isPending ? "bg-red-600" : "bg-blue-600"}`}
                            ></span>
                          </span>
                          <span
                            className={`text-[10px] font-bold ${isPending ? "text-red-600" : "text-blue-600"} uppercase tracking-wider`}
                          >
                            {PRIORITY_LABELS[request.priority] ||
                              request.priority}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          INC-{request.id?.substring(4, 8)}
                        </span>
                      </div>

                      {/* Nội dung Popup */}
                      <div className="p-3 space-y-3">
                        <div>
                          <h4
                            className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2"
                            title={request.title}
                          >
                            {request.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-xs font-medium tracking-tight">
                              {request.callerName} (
                              {request.callerPhone
                                ? request.callerPhone.slice(0, -3) + "***"
                                : "N/A"}
                              )
                            </span>
                          </div>
                        </div>

                        {/* Bác đang có cái Dialog này, tôi giữ nguyên, nhưng nó có thể báo lỗi nếu bác chưa update bên trong Dialog */}
                        <RequestDetailDialog request={request}>
                          <button
                            className={`w-full cursor-pointer group relative flex items-center justify-center gap-2 ${isPending ? "bg-red-600 hover:bg-red-700" : "bg-[#003da5] hover:bg-blue-700"} text-white text-[11px] font-bold py-2.5 rounded-xl transition-all duration-300 active:scale-95 overflow-hidden`}
                          >
                            <span className="relative z-10">
                              {isPending
                                ? "XỬ LÝ NGAY"
                                : "Xem chi tiết báo cáo"}
                            </span>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </RequestDetailDialog>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* VỊ TRÍ CỦA TRUNG TÂM (HOẶC VỊ TRÍ CỦA DISPATCHER KHI BẤM NÚT ĐỊNH VỊ) */}
          <Marker position={position} icon={shadcnIcon}>
            <Popup className="shadcn-popup">
              <div className="font-semibold text-slate-900 line-clamp-1">
                {popupContent}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                {position[0].toFixed(5)}, {position[1].toFixed(5)}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* CÁC NÚT ĐIỀU KHIỂN BẢN ĐỒ */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-3 items-end pointer-events-none">
        <button
          onClick={handleSwitchLayer}
          className={`group relative ${btnClass} pointer-events-auto`}
        >
          <Layers className="w-5 h-5" strokeWidth={2.5} />
          <span className={tooltipClass}>{MAP_LAYERS[layerIndex].name}</span>
        </button>

        <button
          onClick={handleLocate}
          disabled={isLocating}
          className={`group relative ${btnClass} ${isLocating ? "opacity-70" : ""} pointer-events-auto`}
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
          ) : (
            <LocateFixed className="w-5 h-5" strokeWidth={2.5} />
          )}
          <span className={tooltipClass}>Định vị GPS</span>
        </button>

        <div className="flex flex-col bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden w-10 pointer-events-auto">
          <button
            onClick={handleZoomIn}
            className="group relative w-full h-10 flex items-center justify-center text-[#20448c] hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors border-b border-slate-100 cursor-pointer"
          >
            <Plus className="w-5 h-5" strokeWidth={3} />
            <span className={`${tooltipClass} z-50`}>Phóng to</span>
          </button>

          <button
            onClick={handleZoomOut}
            className="group relative w-full h-10 flex items-center justify-center text-[#20448c] hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors cursor-pointer"
          >
            <Minus className="w-5 h-5" strokeWidth={3} />
            <span className={`${tooltipClass} z-50`}>Thu nhỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
