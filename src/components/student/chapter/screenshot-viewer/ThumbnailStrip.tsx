// Thumbnail Strip Component - Bottom navigation thumbnails

import { memo } from "react";
import { cn } from "@/lib/utils";
import type { TeacherScreenshot } from "@/data/student/lessonBundles";

interface ThumbnailStripProps {
  screenshots: TeacherScreenshot[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const ThumbnailStrip = memo(function ThumbnailStrip({
  screenshots,
  currentIndex,
  onSelect,
}: ThumbnailStripProps) {
  if (screenshots.length <= 1) return null;

  return (
    <div className="bg-black/95 border-t border-white/10 px-4 py-3">
      <div className="flex items-center justify-center gap-2 overflow-x-auto">
        {screenshots.map((screenshot, index) => (
          <button
            key={screenshot.id}
            onClick={() => onSelect(index)}
            className={cn(
              "w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all",
              "border-2",
              currentIndex === index
                ? "border-white ring-2 ring-white/30"
                : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100"
            )}
          >
            <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
              <span className="text-white text-xs font-medium">{index + 1}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});
