// Screenshot Gallery - Displays teacher screenshots/annotations

import { Camera, Clock, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { TeacherScreenshot } from "@/data/student/lessonBundles";

interface ScreenshotGalleryProps {
  screenshots: TeacherScreenshot[];
  onScreenshotClick?: (screenshot: TeacherScreenshot) => void;
}

export function ScreenshotGallery({ screenshots, onScreenshotClick }: ScreenshotGalleryProps) {
  if (screenshots.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2 px-1">
        <Camera className="w-4 h-4 text-amber-600" />
        <h2 className="text-sm font-semibold text-foreground">CLASS NOTES</h2>
        <span className="text-xs text-muted-foreground">
          ({screenshots.length} {screenshots.length === 1 ? "note" : "notes"})
        </span>
      </div>

      {/* Screenshots grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {screenshots.map((screenshot) => (
          <button
            key={screenshot.id}
            onClick={() => onScreenshotClick?.(screenshot)}
            className={cn(
              "group text-left",
              "bg-white/70 backdrop-blur-xl rounded-xl border border-white/50",
              "overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
              "active:scale-[0.98]"
            )}
          >
            {/* Thumbnail placeholder */}
            <div className={cn(
              "aspect-[4/3] bg-gradient-to-br from-amber-50 to-amber-100/50",
              "flex items-center justify-center border-b border-amber-100"
            )}>
              <ImageIcon className="w-8 h-8 text-amber-300" />
            </div>

            {/* Info */}
            <div className="p-2.5">
              <h3 className="font-medium text-sm text-foreground line-clamp-1">
                {screenshot.title}
              </h3>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{format(parseISO(screenshot.timestamp), "h:mm a")}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Hint text */}
      <p className="text-xs text-muted-foreground text-center px-4">
        These are annotated screenshots captured by your teacher during class
      </p>
    </section>
  );
}

export default ScreenshotGallery;
