// Screenshot Image Component - Renders the mock annotated image

import { memo } from "react";
import type { TeacherScreenshot } from "@/data/student/lessonBundles";

interface ScreenshotImageProps {
  screenshot: TeacherScreenshot;
  zoom: number;
  position: { x: number; y: number };
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onWheel: (e: React.WheelEvent) => void;
}

export const ScreenshotImage = memo(function ScreenshotImage({
  screenshot,
  zoom,
  position,
  isDragging,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onWheel,
}: ScreenshotImageProps) {
  // Generate a mock educational whiteboard image based on topic
  const getMockImageContent = () => {
    const topic = screenshot.title.toLowerCase();
    
    if (topic.includes("formula") || topic.includes("equation")) {
      return (
        <div className="bg-slate-800 rounded-lg p-8 min-h-[400px] flex flex-col items-center justify-center gap-6">
          <h2 className="text-2xl font-bold text-white mb-4">Key Formulas</h2>
          <div className="space-y-4 text-xl text-green-400 font-mono">
            <p>E = mc²</p>
            <p>F = ma</p>
            <p>v = u + at</p>
            <p>s = ut + ½at²</p>
          </div>
          <div className="mt-6 border-2 border-dashed border-amber-400 rounded p-4">
            <p className="text-amber-400 text-sm">📌 Important: Remember units!</p>
          </div>
        </div>
      );
    }

    if (topic.includes("diagram") || topic.includes("concept")) {
      return (
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-8 min-h-[400px]">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Concept Map</h2>
          <div className="flex items-center justify-center gap-8">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              Main Idea
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-20 h-20 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">
                Point A
              </div>
              <div className="w-20 h-20 bg-amber-500 rounded-lg flex items-center justify-center text-white text-sm">
                Point B
              </div>
            </div>
          </div>
          <div className="mt-6 bg-white/10 rounded p-3 text-center">
            <p className="text-cyan-300 text-sm">✏️ Teacher annotation: Focus on connections</p>
          </div>
        </div>
      );
    }

    // Default: general notes
    return (
      <div className="bg-white rounded-lg p-8 min-h-[400px] shadow-lg">
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b-2 border-blue-500 pb-2">
          {screenshot.title}
        </h2>
        <div className="space-y-3 text-slate-700">
          <p className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">1.</span>
            Key point from today's lesson
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">2.</span>
            Remember this important concept
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">3.</span>
            Practice problems for homework
          </p>
        </div>
        <div className="mt-6 bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r">
          <p className="text-amber-700 text-sm font-medium">
            💡 Pro tip: Review this before the test!
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Captured during live class
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-hidden p-4"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
      style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
    >
      <div
        className="transition-transform duration-100 max-w-full"
        style={{
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
        }}
      >
        {getMockImageContent()}
      </div>
    </div>
  );
});
