"use client";

import { useState } from "react";
import RescueTeamsList from "./RescueTeamsList";
import MapView from "./MapView";
import ActionPanel from "./ActionPanel";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight } from "lucide-react";
import type { TeamStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * Component Command Center chính
 *
 * NHIỆM VỤ CỦA FILE:
 * - Main component kết hợp tất cả sub-components
 * - Layout 2-column: Left (Teams List), Right (Map + Action Panel)
 * - Manage state: selectedTeam, hoveredTeam, statusFilter
 * - Coordinate callbacks giữa components
 * - Handle action panel visibility
 *
 * DATA FLOW:
 * 1. Component mount → Fetch data từ RescueTeamsList và MapView
 * 2. User select team → Update selectedTeam state
 * 3. State truyền xuống MapView và ActionPanel
 * 4. User hover team → Update hoveredTeam state
 * 5. State truyền xuống MapView để highlight marker
 * 6. User action → ActionPanel handle → Refetch data
 *
 * CƠ CHẾ REALTIME:
 * - Sub-components tự handle realtime với React Query
 * - Parent chỉ coordinate state và callbacks
 * - Khi data thay đổi → Sub-components auto update
 *
 * LEAFLET MAP INTEGRATION:
 * - Parent sync state giữa List và Map
 * - selectedTeam → Map flyTo marker
 * - hoveredTeam → Map highlight marker
 * - Map marker click → List scroll to card
 */

export default function CommandCenter() {
  const [selectedTeamId, setSelectedTeamId] = useState<string>();
  const [hoveredTeamId, setHoveredTeamId] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<TeamStatus | "ALL">("ALL");
  const [showActionPanel, setShowActionPanel] = useState(true);

  /**
   * Hàm handleSelectTeam
   * 
   * Mục đích: Xử lý khi user select một team
   * 
   * Logic:
   * 1. Update selectedTeamId state
   * 2. State truyền xuống MapView → Map flyTo marker
   * 3. State truyền xuống ActionPanel → Hiển thị team detail
   * 
   * Data Flow:
   * User Click Card → handleSelectTeam("team-123")
                   → setSelectedTeamId("team-123")
                   → MapView receives prop → flyTo marker
                   → ActionPanel receives prop → fetch team detail
   */
  const handleSelectTeam = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  /**
   * Hàm handleHoverTeam
   * 
   * Mục đích: Xử lý khi user hover vào/ra team
   * 
   * Logic:
   * 1. Update hoveredTeamId state
   * 2. State truyền xuống MapView → Highlight/unhighlight marker
   * 
   * Data Flow:
   * User Hover Card → handleHoverTeam("team-123")
                   → setHoveredTeamId("team-123")
                   → MapView receives prop → highlight marker
   */
  const handleHoverTeam = (teamId: string) => {
    setHoveredTeamId(teamId);
  };

  /**
   * Hàm handleTeamAction
   * 
   * Mục đích: Xử lý khi user click action button trên team card
   * 
   * Logic:
   * 1. Nếu action là "view_details" → Select team và show action panel
   * 2. Nếu action khác → Handle tương ứng
   * 
   * Data Flow:
   * User Click "Xem chi tiết" → handleTeamAction("view_details", "team-123")
                              → setSelectedTeamId("team-123")
                              → setShowActionPanel(true)
   */
  const handleTeamAction = (action: string, teamId: string) => {
    if (action === "view_details") {
      setSelectedTeamId(teamId);
      setShowActionPanel(true);
    }
    // Các actions khác có thể được thêm sau
  };

  /**
   * Hàm handleAssignMission
   *
   * Mục đích: Xử lý khi user click assign mission
   *
   * Logic:
   * 1. Mở dialog assign mission (chưa implement)
   *
   * Note: Logic này sẽ được implement sau khi có assign mission feature
   */
  const handleAssignMission = (teamId: string) => {
    console.log("Assign mission for team:", teamId);
    // TODO: Implement assign mission dialog
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Command Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Trung tâm điều phối đội cứu hộ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowActionPanel(!showActionPanel)}
          >
            {showActionPanel ? (
              <>
                <PanelRight className="h-4 w-4 mr-2" />
                Ẩn panel
              </>
            ) : (
              <>
                <PanelLeft className="h-4 w-4 mr-2" />
                Hiện panel
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Teams List */}
        <div className="w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <RescueTeamsList
            selectedTeamId={selectedTeamId}
            onSelectTeam={handleSelectTeam}
            //onHoverTeam={handleHoverTeam}
            onTeamAction={handleTeamAction}
          />
        </div>

        {/* Right: Map + Action Panel */}
        <div className="flex-1 flex">
          {/* Map */}
          <div className={cn("flex-1", showActionPanel ? "w-2/3" : "w-full")}>
            <MapView
              selectedTeamId={selectedTeamId}
              hoveredTeamId={hoveredTeamId}
              onSelectTeam={handleSelectTeam}
              //onHoverTeam={handleHoverTeam}
              statusFilter={statusFilter}
            />
          </div>

          {/* Action Panel */}
          {showActionPanel && (
            <div className="w-1/3 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <ActionPanel
                selectedTeamId={selectedTeamId}
                onClose={() => setSelectedTeamId(undefined)}
                onAssignMission={handleAssignMission}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
