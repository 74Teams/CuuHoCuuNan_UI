export type PriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

// Các loại sự cố: Ngập lụt, Y tế, Hỏa hoạn, Sạt lở
export type EmergencyCategory =
  | "FLOOD"
  | "MEDICAL"
  | "FIRE"
  | "LANDSLIDE"
  | "OTHER";
export type DispatchStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";
export interface Request {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: string;
  description: string;
  landmark: string;
  emergencyType: string;
  priority: string;
  requestedBy: {
    fullName: string;
    phoneNumber: string;
  };
  missions: Mission[];
  submittedTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlyToLocationProps {
  lat: number;
  lng: number;
  label?: string;
  onAfterClick?: () => void;
}

// export interface Mission {
//   id: string
//   rescueTeam: RescueTeam
// }

export interface RescueTeam {
  id: string;
  teamName: string;
  status: string;
}

export interface Mission {
  id: string;
  status: string;
  startTime: string;
  rescueTeam: RescueTeam;
}

export interface Location {
  id: string;
  coordinates: Coordinates;
  address: string;
  landmark: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RequestDetail {
  id: string;
  userId: string;
  requestedBy: {
    id: string;
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  emergencyType: string;
  priority: string;
  status: string;
  description: string;

  location: {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    landmark: string;
  };
  mediaUrl: string;
  submittedTime: string;
  missions: Mission[];
  createdAt: string;
  updatedAt: string;
}

export interface VictimInfo {
  id: string;
  fullName: string;
  age: number;
  phoneNumber: string;
  email: string;
  condition: string;
}
