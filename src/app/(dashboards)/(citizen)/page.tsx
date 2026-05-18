"use client";

import dynamic from "next/dynamic";

import { AppSidebar } from "@/components/shared/AppSidebar";
import { useCitizenRequestsQuery } from "@/lib/api/dashboards/citizen-requests";

const MapComponent = dynamic(
  () => import("@/components/dashboards/citizen/CitizenMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        Đang tải bản đồ Cứu Hộ...
      </div>
    ),
  },
);

export default function CitizenDashboard() {
  const { data } = useCitizenRequestsQuery();
  const requestsList = data?.items ?? [];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <AppSidebar requests={requestsList} />

      <main className="flex-1 relative z-0">
        <MapComponent requests={requestsList} />
      </main>
    </div>
  );
}
