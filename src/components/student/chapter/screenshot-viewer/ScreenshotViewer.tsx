// Screenshot Viewer - Main orchestrator component (refactored from 389 lines)

import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { TeacherScreenshot } from "@/data/student/lessonBundles";
import { useScreenshotViewer } from "./useScreenshotViewer";
import { ScreenshotImage } from "./ScreenshotImage";
import { ScreenshotControls } from "./ScreenshotControls";
import { ThumbnailStrip } from "./ThumbnailStrip";

interface ScreenshotViewerProps {
  screenshots: TeacherScreenshot[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

export function ScreenshotViewer({
  screenshots,
  initialIndex,
  open,
  onClose,
}: ScreenshotViewerProps) {
  const {
    currentIndex,
    currentScreenshot,
    zoom,
    position,
    isDragging,
    goToNext,
    goToPrevious,
    goToIndex,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  } = useScreenshotViewer({ screenshots, initialIndex, open, onClose });

  if (screenshots.length === 0 || !currentScreenshot) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 border-0 bg-black/95">
        <DialogTitle className="sr-only">Screenshot Viewer</DialogTitle>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-black/90 border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-white font-medium text-sm sm:text-base">
                  {currentScreenshot.title}
                </h3>
                <p className="text-white/60 text-xs">
                  {format(parseISO(currentScreenshot.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {screenshots.length > 1 && (
                <span className="text-white/60 text-sm mr-2">
                  {currentIndex + 1} / {screenshots.length}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Image container */}
          <ScreenshotImage
            screenshot={currentScreenshot}
            zoom={zoom}
            position={position}
            isDragging={isDragging}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          />

          {/* Navigation arrows */}
          {screenshots.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12",
                  "bg-black/50 text-white/80 hover:bg-black/70 hover:text-white",
                  "rounded-full backdrop-blur-sm",
                  currentIndex === 0 && "opacity-30 pointer-events-none"
                )}
                onClick={goToPrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12",
                  "bg-black/50 text-white/80 hover:bg-black/70 hover:text-white",
                  "rounded-full backdrop-blur-sm",
                  currentIndex === screenshots.length - 1 && "opacity-30 pointer-events-none"
                )}
                onClick={goToNext}
                disabled={currentIndex === screenshots.length - 1}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Controls footer */}
          <ScreenshotControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
          />

          {/* Thumbnail strip */}
          <ThumbnailStrip
            screenshots={screenshots}
            currentIndex={currentIndex}
            onSelect={goToIndex}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
