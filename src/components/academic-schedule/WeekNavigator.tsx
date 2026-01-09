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
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Prev Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onWeekChange(Math.max(0, selectedWeekIndex - 1))}
        disabled={selectedWeekIndex === 0}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Week Dots */}
      <div className="flex items-center gap-1">
        {visibleIndices.map((idx) => (
          <button
            key={idx}
            onClick={() => onWeekChange(idx)}
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all",
              idx === selectedWeekIndex
                ? "bg-primary text-primary-foreground shadow-sm"
                : idx === currentWeekIndex
                ? "bg-primary/20 text-primary ring-1 ring-primary/50"
                : idx < currentWeekIndex
                ? "bg-muted text-muted-foreground/70 hover:bg-muted/80"
                : "bg-muted/40 text-muted-foreground/50 hover:bg-muted/60"
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
        className="h-8 w-8 shrink-0"
        onClick={() => onWeekChange(Math.min(weeks.length - 1, selectedWeekIndex + 1))}
        disabled={selectedWeekIndex === weeks.length - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Date Range */}
      <span className="text-xs font-medium text-muted-foreground hidden sm:inline ml-1">
        {formatDateRange()}
      </span>

      {/* Today Button */}
      {!isCurrentWeek && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs gap-1 ml-1"
          onClick={goToCurrentWeek}
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Today</span>
        </Button>
      )}
    </div>
  );
}
