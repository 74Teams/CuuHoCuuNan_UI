"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

// MỚI: Icon cảnh báo nhiệm vụ (Pulse + Alert Triangle)
const missionAlertIcon = new L.DivIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="relative flex items-center justify-center w-12 h-12">
      <span class="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-50 animate-ping"></span>
      
      <div class="relative z-10 flex items-center justify-center w-8 h-8 bg-[#d40639] rounded-full border-[2px] border-white shadow-lg">
         
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
           <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
           <path d="M12 9v4"/>
           <path d="M12 17h.01"/>
         </svg>
         
      </div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

export default function MiniMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      // Tắt tương tác vì đây chỉ là bản đồ xem trước (Preview)
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
      />
      <Marker position={[lat, lng]} icon={missionAlertIcon} />
    </MapContainer>
  );
}
