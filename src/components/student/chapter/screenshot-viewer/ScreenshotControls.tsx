// Screenshot Controls Component - Footer with zoom controls

import { memo } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Download, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScreenshotControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const ScreenshotControls = memo(function ScreenshotControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: ScreenshotControlsProps) {
  return (
    <div className="bg-black/90 border-t border-white/10 px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Left: Download button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Save</span>
        </Button>

        {/* Center: Zoom controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onZoomOut}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>

          <span className="text-white/80 text-sm font-medium w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onZoomIn}
            disabled={zoom >= 3}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 ml-2"
            onClick={onReset}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Fullscreen button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <Maximize className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Full</span>
        </Button>
      </div>
    </div>
  );
});
