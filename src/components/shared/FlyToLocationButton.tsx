"use client";

import { Button } from "@/components/ui/button";
import { FlyToLocationProps } from "@/types/fly-to-location-props";
import { Target } from "lucide-react";

export default function FlyToLocationButton({
  lat,
  lng,
  label = "ĐỊNH VỊ",
  onAfterClick,
}: FlyToLocationProps) {
  const handleFlyTo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent("MOVE_MAP", {
      detail: { lat, lng },
    });
    window.dispatchEvent(event);
    if (onAfterClick) {
      onAfterClick();
    }
  };

  return (
    <Button
      type="button"
      onClick={handleFlyTo}
      variant="outline"
      size="sm"
      className="h-7 px-2 text-[10px] font-bold bg-white border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90 shadow-sm shrink-0"
    >
      <Target className="w-3 h-3 mr-1" /> {label}
    </Button>
  );
}
