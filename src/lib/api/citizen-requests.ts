"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiQueryKeys } from "./query-keys";
import { locationsApi, requestsApi } from "./services";
import type {
  EmergencyType,
  PriorityLevel,
  RequestSummary,
  RequestStatus as ApiRequestStatus,
} from "./types";

import type {
  EmergencyCategory,
  RequestDetail,
  RequestPriority,
  RequestStatus,
} from "@/types/request";

export interface CitizenRequestSubmissionInput {
  emergencyType: EmergencyCategory;
  priority: RequestPriority;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  landmark?: string;
  medias?: File[];
}

const emergencyTypeMap: Record<EmergencyCategory, EmergencyType> = {
  FIRE: "FIRE",
  FLOOD: "FLOOD",
  MEDICAL: "MEDICAL_EMERGENCY",
  LANDSLIDE: "NATURAL_DISASTER",
  OTHER: "OTHER",
};

const priorityMap: Record<RequestPriority, PriorityLevel> = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
};

const apiEmergencyTypeMap: Partial<Record<EmergencyType, EmergencyCategory>> = {
  FIRE: "FIRE",
  FLOOD: "FLOOD",
  MEDICAL_EMERGENCY: "MEDICAL",
  NATURAL_DISASTER: "LANDSLIDE",
  OTHER: "OTHER",
};

const apiPriorityMap: Partial<Record<PriorityLevel, RequestPriority>> = {
  CRITICAL: "CRITICAL",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
};

const apiStatusMap: Record<ApiRequestStatus, RequestStatus> = {
  PENDING: "PENDING",
  ACCEPTED: "IN_PROGRESS",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "RESOLVED",
  CANCELED: "CLOSED",
  REJECTED: "CLOSED",
};

function mapSummaryToRequestDetail(request: RequestSummary): RequestDetail {
  return {
    id: request.id,
    userId: request.requestedBy.id,
    requestedBy: {
      id: request.requestedBy.id,
      fullName: request.requestedBy.fullName,
      phoneNumber: request.requestedBy.phoneNumber ?? "",
      email: request.requestedBy.email ?? "",
    },
    emergencyType: apiEmergencyTypeMap[request.emergencyType] ?? "OTHER",
    priority: apiPriorityMap[request.priority] ?? "LOW",
    status: apiStatusMap[request.status] ?? "PENDING",
    description: request.description,
    location: {
      id: request.location.id,
      latitude: request.location.latitude,
      longitude: request.location.longitude,
      address: request.location.address,
      landmark: request.location.landmark,
    },
    mediaUrl: request.medias?.map((media) => media.mediaUrl),
    submittedTime:
      request.createdAt ?? request.updatedAt ?? new Date().toISOString(),
    missions: (request.missions ?? []).map((mission) => ({
      id: mission.id,
      status: mission.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
      startTime: request.createdAt ?? new Date().toISOString(),
      rescueTeam: {
        id: mission.id,
        teamName: "Đội cứu hộ",
        status: mission.status === "COMPLETED" ? "AVAILABLE" : "ON_MISSION",
      },
    })),
    createdAt: request.createdAt ?? new Date().toISOString(),
    updatedAt:
      request.updatedAt ?? request.createdAt ?? new Date().toISOString(),
  };
}

export function useCitizenRequestsQuery() {
  return useQuery({
    queryKey: apiQueryKeys.requests.all,
    queryFn: async () => {
      const response = await requestsApi.list({ pageNumber: 1, pageSize: 100 });
      return {
        ...response.data,
        items: response.data.items.map(mapSummaryToRequestDetail),
      };
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCitizenRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CitizenRequestSubmissionInput) => {
      const locationResponse = await locationsApi.create({
        latitude: payload.latitude,
        longitude: payload.longitude,
        address: payload.address,
        landmark: payload.landmark,
      });

      const requestResponse = await requestsApi.create({
        emergencyType: emergencyTypeMap[payload.emergencyType],
        priority: priorityMap[payload.priority],
        description: payload.description,
        locationId: locationResponse.data.id,
        medias: payload.medias,
      });

      return requestResponse.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: apiQueryKeys.requests.all,
      });
    },
  });
}
