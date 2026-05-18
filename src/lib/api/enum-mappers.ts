import type {
  EmergencyType,
  MissionStatus,
  PriorityLevel,
  RequestStatus,
  TeamStatus,
} from "./types";

export const numericEmergencyTypeMap: Record<number, EmergencyType> = {
  1: "FIRE",
  2: "FLOOD",
  3: "EARTHQUAKE",
  4: "MEDICAL_EMERGENCY",
  5: "TRAFFIC_EMERGENCY",
  6: "BUILDING_COLLAPSE",
  7: "NATURAL_DISASTER",
  8: "OTHER",
};

export const numericPriorityMap: Record<number, PriorityLevel> = {
  1: "CRITICAL",
  2: "HIGH",
  3: "MEDIUM",
  4: "LOW",
};

export const numericStatusMap: Record<number, RequestStatus> = {
  1: "PENDING",
  2: "ACCEPTED",
  3: "IN_PROGRESS",
  4: "COMPLETED",
  5: "CANCELED",
  6: "REJECTED",
};

export const numericMissionStatusMap: Record<number, MissionStatus> = {
  1: "ASSIGNED",
  2: "EN_ROUTE",
  3: "ON_SITE",
  4: "IN_PROGRESS",
  5: "COMPLETED",
  6: "ABORTED",
};

export const numericTeamStatusMap: Record<number, TeamStatus> = {
  1: "AVAILABLE",
  2: "ON_MISSION",
  3: "UNAVAILABLE",
  4: "MAINTENANCE",
};

export function resolveEnum<T extends string>(
  value: T | number,
  map: Record<number, T>,
  fallback: T,
): T {
  if (typeof value === "number") return map[value] ?? fallback;
  return value;
}

export function extractPaginatedItems<T>(
  data: T[] | { items?: T[] } | unknown,
): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "items" in data) {
    const items = (data as { items?: T[] }).items;
    return Array.isArray(items) ? items : [];
  }
  return [];
}
