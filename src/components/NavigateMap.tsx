"use client";

import { RescuerActiveMission } from "@/types/rescue-team/member";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Clock,
  Info,
  Loader2,
  MapPin,
  Navigation2,
  Phone,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";

// ==========================================
// 1. CÁC ICON BẢN ĐỒ TÙY CHỈNH
// ==========================================
const userLocationIcon = new L.DivIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="relative flex items-center justify-center w-6 h-6">
      <div class="absolute w-full h-full bg-blue-400 rounded-full opacity-40 animate-ping"></div>
      <div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
    </div>
  `,
  iconSize: [24, 24],
});

const destinationIcon = new L.DivIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="w-8 h-8 flex items-center justify-center bg-red-600 rounded-t-full rounded-br-full -rotate-45 shadow-lg border-2 border-white">
      <div class="rotate-45 text-white font-bold text-xs">!</div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function AutoResizeMap() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// ==========================================
// 3. COMPONENT ĐIỀU KHIỂN CAMERA & VẼ ĐƯỜNG
// ==========================================
function RoutingMachine({
  start,
  end,
  onRouteCalculated,
}: {
  start: [number, number];
  end: [number, number];
  onRouteCalculated: (dist: number, time: number) => void;
}) {
  const map = useMap();
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
        );
        const data = await res.json();

        if (isMounted && data.routes && data.routes[0]) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]] as [number, number],
          );
          setRouteCoords(coordinates);

          onRouteCalculated(route.distance, route.duration);

          setTimeout(() => {
            if (isMounted && map) {
              const bounds = L.latLngBounds([start, end]);
              map.fitBounds(bounds, { padding: [50, 50] });
            }
          }, 150);
        }
      } catch (error) {
        console.error("Lỗi lấy đường đi:", error);
      }
    };

    fetchRoute();
    return () => {
      isMounted = false;
    };
  }, [start[0], start[1], end[0], end[1], map, onRouteCalculated]); // Dependency an toàn

  if (routeCoords.length === 0) return null;

  return (
    <>
      <Polyline
        positions={routeCoords}
        color="#1e3a8a"
        weight={8}
        opacity={0.3}
        lineCap="round"
        lineJoin="round"
      />
      <Polyline
        positions={routeCoords}
        color="#2563eb"
        weight={5}
        opacity={1}
        lineCap="round"
        lineJoin="round"
      />
    </>
  );
}

// ==========================================
// 4. COMPONENT CHÍNH
// ==========================================
export default function NavigateMap({
  mission,
}: {
  mission?: RescuerActiveMission | null;
}) {
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [userAddress, setUserAddress] = useState<string>(
    "Đang xác định vị trí...",
  );
  const [isLocating, setIsLocating] = useState(true);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserAddress("Trình duyệt không hỗ trợ GPS");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserCoords(coords);

        // Reverse Geocoding qua Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`,
          );
          const data = await res.json();
          setUserAddress(data.display_name || "Vị trí của tôi");
        } catch (error) {
          setUserAddress("Không thể lấy địa chỉ chữ");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error("GPS Error:", err);
        setUserAddress("Lỗi truy cập GPS");
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  const [now] = useState(() => Date.now());

  // Dùng useCallback để tránh render vòng lặp vô hạn
  const handleRouteCalculated = useCallback((dist: number, time: number) => {
    setDistance(dist);
    setDuration(time);
  }, []);
  if (isLocating) {
    return (
      <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-[2000]">
        <Loader2 className="w-10 h-10 animate-spin text-[#003da5] mb-4" />
        <p className="font-bold text-slate-700">Đang đồng bộ GPS...</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Bản đồ đang chờ</h2>
        <p className="text-slate-500 text-sm mt-2">
          Bản đồ sẽ tự động chỉ đường khi bạn được phân công một nhiệm vụ mới.
        </p>
      </div>
    );
  }

  const startCoords: [number, number] = [16.0544, 108.2022];
  const endCoords: [number, number] = [
    mission.location.latitude,
    mission.location.longitude,
  ];
  const distanceKm = (distance / 1000).toFixed(1);
  const durationMinutes = Math.ceil(duration / 60);
  const etaString =
    duration > 0
      ? new Date(now + duration * 1000).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
  const mainVictim = mission.victims?.[0];

  return (
    <div className="absolute inset-0 bg-slate-100 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={userCoords || [16.0544, 108.2022]}
          zoom={14}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <AutoResizeMap />
          <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" />

          {userCoords && (
            <Marker position={userCoords} icon={userLocationIcon} />
          )}
          <Marker position={endCoords} icon={destinationIcon} />

          {userCoords && (
            <RoutingMachine
              start={userCoords}
              end={endCoords}
              onRouteCalculated={handleRouteCalculated}
            />
          )}
        </MapContainer>
      </div>

      {/* OVERLAY INFO */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-11/12 max-w-[360px] z-[1000] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-100 flex items-center gap-4 pointer-events-auto">
          <div className="w-12 h-12 bg-[#003da5] rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-800 leading-tight">
              {durationMinutes} PHÚT
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              {distanceKm} km • Tuyến nhanh nhất
            </p>
          </div>
          <div className="text-right border-l border-slate-200 pl-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Dự kiến
            </p>
            <p className="text-lg font-bold text-[#003da5]">{etaString}</p>
          </div>
        </div>
      </div>

      {/* BOTTOM SHEET */}
      <div className="absolute bottom-0 left-0 w-full z-[1000]">
        <div className="bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-5 pb-24 border-t border-slate-100">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>

          <div className="flex justify-between items-start mb-4">
            <div className="max-w-[75%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-[#003da5] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Đang thực hiện
                </span>
                <span className="text-slate-400 text-[10px] font-mono">
                  #{mission.id.substring(0, 6).toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 truncate">
                {mission.title}
              </h2>
              {/* Hiển thị địa chỉ thực tế của User */}
              <p className="text-[10px] text-blue-600 font-medium line-clamp-1 mt-1">
                Bắt đầu: {userAddress}
              </p>
            </div>
            <button className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shrink-0">
              <Phone className="w-5 h-5 fill-current" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
                <User className="w-3 h-3 text-slate-400" /> NẠN NHÂN
              </p>
              <p className="text-[13px] font-bold text-slate-800 truncate">
                {mission.victims?.[0]?.fullName || "N/A"}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
                <MapPin className="w-3 h-3 text-slate-400" /> ĐẾN
              </p>
              <p className="text-[13px] font-bold text-slate-800 truncate">
                {mission.location.address.split(",")[0]}
              </p>
            </div>
          </div>

          <button className="w-full bg-[#003da5] text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            <Navigation2 className="w-6 h-6 fill-current" /> Bắt đầu điều hướng
          </button>
        </div>
      </div>
    </div>
  );
}
