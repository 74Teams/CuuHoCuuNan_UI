"use client";
import dynamic from "next/dynamic";

import { AppSidebar } from "@/components/AppSidebar";
import { MOCK_REQUESTS } from "@/data/mockCitizenPage";
import { RequestDetail } from "@/types/request";
import { useState } from "react";

const MapComponent = dynamic(() => import("@/components/citizen/CitizenMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      Đang tải bản đồ Cứu Hộ...
    </div>
  ),
});

const DynamicMap = dynamic(() => import("@/components/citizen/CitizenMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-xl border border-slate-200">
      <span className="text-slate-400 font-medium">Đang tải bản đồ...</span>
    </div>
  ),
});

export default function CitizenDashboard() {
  const [requestsList, setRequestsList] = useState(MOCK_REQUESTS);

  const handleAddNewRequest = (newRequestData: RequestDetail) => {
    setRequestsList((prev) => [newRequestData, ...prev]);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <AppSidebar requests={requestsList} onAddRequest={handleAddNewRequest} />

      <main className="flex-1 relative z-0">
        <MapComponent requests={requestsList} />
      </main>
    </div>
  );
}
