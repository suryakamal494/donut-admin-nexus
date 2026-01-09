import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface WeekNavigatorProps {
  weeks: { weekNumber: number; startDate: string; endDate: string; label: string }[];
  currentWeekIndex: number;
  selectedWeekIndex: number;
  onWeekChange: (index: number) => void;
}

export function WeekNavigator({
  weeks,
  currentWeekIndex,
  selectedWeekIndex,
  onWeekChange,
}: WeekNavigatorProps) {
  const selectedWeek = weeks[selectedWeekIndex];
  const isCurrentWeek = selectedWeekIndex === currentWeekIndex;

  const formatDateRange = () => {
    if (!selectedWeek) return "";
    const start = parseISO(selectedWeek.startDate);
    const end = parseISO(selectedWeek.endDate);
    return `${format(start, "d MMM")} - ${format(end, "d MMM")}`;
  };

  const goToCurrentWeek = () => {
    onWeekChange(currentWeekIndex);
  };

  // Show 3 week dots on mobile, 5 on desktop centered around current selection
  const getVisibleWeekIndices = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const totalToShow = isMobile ? 3 : 5;
    const half = Math.floor(totalToShow / 2);
    let start = Math.max(0, selectedWeekIndex - half);
    let end = Math.min(weeks.length - 1, start + totalToShow - 1);
    
    // Adjust start if we're near the end
    if (end - start < totalToShow - 1) {
      start = Math.max(0, end - totalToShow + 1);
    }
    
    const indices: number[] = [];
    for (let i = start; i <= end; i++) {
      indices.push(i);
    }
    return indices;
  };

  const visibleIndices = getVisibleWeekIndices();

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
      {/* Prev Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={() => onWeekChange(Math.max(0, selectedWeekIndex - 1))}
        disabled={selectedWeekIndex === 0}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </Button>

      {/* Week Dots */}
      <div className="flex items-center gap-0.5">
        {visibleIndices.map((idx) => (
          <button
            key={idx}
            onClick={() => onWeekChange(idx)}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all",
              idx === selectedWeekIndex
                ? "bg-primary text-primary-foreground shadow-sm"
                : idx === currentWeekIndex
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : idx < currentWeekIndex
                ? "bg-muted/60 text-muted-foreground/50 hover:bg-muted"
                : "bg-muted/40 text-muted-foreground/40 hover:bg-muted/60"
            )}
            title={weeks[idx]?.label}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={() => onWeekChange(Math.min(weeks.length - 1, selectedWeekIndex + 1))}
        disabled={selectedWeekIndex === weeks.length - 1}
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </Button>

      {/* Date Range */}
      <div className="px-2 py-0.5 rounded bg-muted/40 shrink-0">
        <span className="text-xs font-medium text-foreground whitespace-nowrap">
          {formatDateRange()}
        </span>
      </div>

      {/* Today Button */}
      {!isCurrentWeek && (
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-[11px] gap-0.5 border-primary/30 text-primary hover:bg-primary/5 shrink-0"
          onClick={goToCurrentWeek}
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Today</span>
        </Button>
      )}
    </div>
  );
}
