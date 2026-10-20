import React from "react";
import { useMenu } from "../context/MenuContext";
import { Sparkles, Flame } from "lucide-react";

export default function AnnouncementBar() {
  const { cafeInfo } = useMenu();

  if (!cafeInfo.announcement) return null;

  return (
    <div className="bg-gradient-to-r from-[#141714] via-[#1f241f] to-[#141714] border-y border-[#c9a34a]/30 py-2 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-[11px] sm:text-xs text-[#e2c875]">
        <Flame className="w-3.5 h-3.5 text-[#c9a34a] shrink-0 animate-pulse" />
        <span className="font-semibold text-center truncate">
          {cafeInfo.announcement}
        </span>
        <Sparkles className="w-3 h-3 text-[#c9a34a] shrink-0 hidden sm:inline" />
      </div>
    </div>
  );
}
