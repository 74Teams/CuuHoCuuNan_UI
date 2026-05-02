export type MapLayer = {
  name: string;
  url: string;
  attribution: string;
};

const MAP_LAYERS: MapLayer[] = [
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

export default MAP_LAYERS;
