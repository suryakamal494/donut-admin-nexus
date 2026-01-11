// Screenshot Viewer - Full-screen modal with zoom and pan

import { useState, useRef, useEffect } from "react";
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import type { TeacherScreenshot } from "@/data/student/lessonBundles";

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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const screenshot = screenshots[currentIndex];
  const hasNext = currentIndex < screenshots.length - 1;
  const hasPrev = currentIndex > 0;

  // Reset zoom and position when changing screenshots
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Reset index when opening
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [open, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (hasPrev) setCurrentIndex(currentIndex - 1);
          break;
        case "ArrowRight":
          if (hasNext) setCurrentIndex(currentIndex + 1);
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          handleReset();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, currentIndex, hasPrev, hasNext]);

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-white truncate">
              {screenshot.title}
            </h1>
            <p className="text-xs text-white/60 truncate">
              {format(parseISO(screenshot.timestamp), "MMM d, yyyy • h:mm a")}
            </p>
          </div>
        </div>

        {/* Counter */}
        <span className="text-white/60 text-sm px-3">
          {currentIndex + 1} / {screenshots.length}
        </span>
      </header>

      {/* Image container */}
      <div
        ref={containerRef}
        className={cn(
          "flex-1 overflow-hidden flex items-center justify-center relative",
          zoom > 1 ? "cursor-grab" : "cursor-zoom-in",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onClick={() => {
          if (!isDragging && zoom === 1) {
            handleZoomIn();
          }
        }}
      >
        {/* Mock screenshot image */}
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          }}
        >
          <div className={cn(
            "bg-white rounded-lg shadow-2xl overflow-hidden",
            "w-[90vw] max-w-3xl aspect-[16/10]"
          )}>
            {/* Mock annotated content */}
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 relative">
              {/* Header decoration */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-200" />
              
              {/* Title */}
              <div className="pt-8 mb-6">
                <h2 className="text-xl font-bold text-slate-800">{screenshot.title}</h2>
                {screenshot.description && (
                  <p className="text-sm text-slate-500 mt-1">{screenshot.description}</p>
                )}
              </div>

              {/* Mock content with annotations */}
              <div className="space-y-4">
                {/* Text block */}
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>

                {/* Highlighted section (teacher annotation) */}
                <div className="relative bg-amber-100/50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                  <div className="h-3 bg-amber-200 rounded w-4/5 mb-2" />
                  <div className="h-3 bg-amber-200 rounded w-3/4" />
                  {/* Annotation marker */}
                  <div className="absolute -right-2 -top-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                </div>

                {/* Formula/diagram placeholder */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                    <span className="text-sm text-blue-400">Diagram / Formula</span>
                  </div>
                </div>

                {/* Another annotation */}
                <div className="relative">
                  <div className="h-3 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-2/3" />
                  {/* Circle annotation */}
                  <div className="absolute right-4 top-0 w-16 h-10 border-2 border-red-500 rounded-full opacity-70" />
                  <div className="absolute -right-2 top-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                </div>
              </div>

              {/* Teacher watermark */}
              <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                Captured by Teacher
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        {hasPrev && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(currentIndex - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        )}
        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(currentIndex + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        )}
      </div>

      {/* Controls footer */}
      <footer className="flex items-center justify-center gap-2 px-4 py-3 bg-black/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          className="text-white hover:bg-white/20 disabled:opacity-30"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>

        <span className="text-white text-sm min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="text-white hover:bg-white/20 disabled:opacity-30"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>

        <div className="w-px h-6 bg-white/20 mx-2" />

        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="text-white hover:bg-white/20"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Download className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Maximize2 className="w-5 h-5" />
        </Button>
      </footer>

      {/* Thumbnail strip (for multiple screenshots) */}
      {screenshots.length > 1 && (
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-black/30 overflow-x-auto">
          {screenshots.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                i === currentIndex
                  ? "border-white opacity-100"
                  : "border-transparent opacity-50 hover:opacity-75"
              )}
            >
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScreenshotViewer;
