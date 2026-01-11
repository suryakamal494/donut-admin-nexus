// Test Player Header Component
// Timer, subject tabs, and test info
// Mobile-first with compact layout

import { memo, useCallback } from "react";
import { X, Clock, Calculator, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TestSection } from "@/data/student/testQuestions";
import { formatTimeDisplay, getTimeUrgency, getSectionStats } from "@/data/student/testSession";
import type { TestSessionQuestion } from "@/data/student/testSession";

interface TestPlayerHeaderProps {
  testName: string;
  sections: TestSection[];
  currentSectionId: string;
  sessionQuestions: TestSessionQuestion[];
  remainingTime: number;
  totalDuration: number;
  showCalculator: boolean;
  isFullscreen: boolean;
  onSectionChange: (sectionId: string) => void;
  onToggleCalculator: () => void;
  onToggleFullscreen: () => void;
  onExit: () => void;
}

const sectionColors: Record<string, { active: string; inactive: string }> = {
  physics: {
    active: "bg-purple-500 text-white border-purple-500",
    inactive: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
  },
  chemistry: {
    active: "bg-emerald-500 text-white border-emerald-500",
    inactive: "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
  },
  mathematics: {
    active: "bg-blue-500 text-white border-blue-500",
    inactive: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
  },
  biology: {
    active: "bg-rose-500 text-white border-rose-500",
    inactive: "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100",
  },
};

const TestPlayerHeader = memo(function TestPlayerHeader({
  testName,
  sections,
  currentSectionId,
  sessionQuestions,
  remainingTime,
  totalDuration,
  showCalculator,
  isFullscreen,
  onSectionChange,
  onToggleCalculator,
  onToggleFullscreen,
  onExit,
}: TestPlayerHeaderProps) {
  const timeUrgency = getTimeUrgency(remainingTime, totalDuration * 60);

  const getColorClasses = useCallback((subject: string, isActive: boolean) => {
    const colors = sectionColors[subject.toLowerCase()] || sectionColors.physics;
    return isActive ? colors.active : colors.inactive;
  }, []);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      {/* Top Row: Timer + Actions */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4">
        {/* Exit Button (Mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 lg:hidden text-muted-foreground hover:text-foreground"
          onClick={onExit}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Test Name (Desktop) */}
        <div className="hidden lg:block">
          <h1 className="font-semibold text-foreground text-sm truncate max-w-[200px]">
            {testName}
          </h1>
        </div>

        {/* Timer - Always Centered/Visible */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm",
            timeUrgency === "normal" && "bg-muted text-foreground",
            timeUrgency === "warning" && "bg-amber-100 text-amber-700",
            timeUrgency === "danger" && "bg-red-100 text-red-600 animate-pulse"
          )}
        >
          <Clock className="w-4 h-4" />
          <span>{formatTimeDisplay(remainingTime)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {showCalculator && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onToggleCalculator}
            >
              <Calculator className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex"
            onClick={onToggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex text-muted-foreground hover:text-foreground"
            onClick={onExit}
          >
            Exit
          </Button>
        </div>
      </div>

      {/* Subject Tabs - Horizontal Scroll on Mobile */}
      {sections.length > 1 && (
        <div className="flex gap-2 px-3 pb-2 overflow-x-auto scrollbar-hide sm:px-4 sm:justify-center">
          {sections.map((section) => {
            const isActive = section.id === currentSectionId;
            const stats = getSectionStats(sessionQuestions, section.id);

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium",
                  "transition-all duration-200 shrink-0",
                  getColorClasses(section.subject, isActive)
                )}
              >
                <span>{section.name}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold",
                    isActive ? "bg-white/20" : "bg-current/10"
                  )}
                >
                  {stats.answered}/{stats.total}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
});

export default TestPlayerHeader;
