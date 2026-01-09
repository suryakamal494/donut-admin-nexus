import { ChevronLeft, ChevronRight, CalendarDays, RotateCcw, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const isPastWeek = selectedWeekIndex < currentWeekIndex;
  const isFutureWeek = selectedWeekIndex > currentWeekIndex;

  const formatDateRange = () => {
    if (!selectedWeek) return "";
    const start = parseISO(selectedWeek.startDate);
    const end = parseISO(selectedWeek.endDate);
    return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`;
  };

  const goToCurrentWeek = () => {
    onWeekChange(currentWeekIndex);
  };

  // Show 5 week dots on mobile, 7 on desktop centered around current selection
  const getVisibleWeekIndices = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const totalToShow = isMobile ? 5 : 7;
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
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Week Navigation Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Prev Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => onWeekChange(Math.max(0, selectedWeekIndex - 1))}
            disabled={selectedWeekIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Center: Week Dots - Scrollable on mobile */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-max px-2">
              {visibleIndices.map((idx) => (
                <button
                  key={idx}
                  onClick={() => onWeekChange(idx)}
                  className={cn(
                    "min-w-[36px] h-9 sm:min-w-[40px] sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all relative",
                    idx === selectedWeekIndex
                      ? "bg-primary text-primary-foreground scale-110 shadow-md"
                      : idx === currentWeekIndex
                      ? "bg-primary/20 text-primary hover:bg-primary/30 ring-2 ring-primary/50"
                      : idx < currentWeekIndex
                      ? "bg-muted text-muted-foreground hover:bg-muted/80"
                      : "bg-muted/50 text-muted-foreground/70 hover:bg-muted/80"
                  )}
                  title={weeks[idx]?.label}
                >
                  {idx + 1}
                  {/* Past week indicator */}
                  {idx < currentWeekIndex && idx !== selectedWeekIndex && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-muted-foreground/40" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => onWeekChange(Math.min(weeks.length - 1, selectedWeekIndex + 1))}
            disabled={selectedWeekIndex === weeks.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Week Info Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t">
          {/* Date Range */}
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">{formatDateRange()}</span>
          </div>
          
          {/* Status Badges and Today Button */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            {isCurrentWeek && (
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border border-primary/20">
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Current Week
              </Badge>
            )}
            {isPastWeek && (
              <Badge variant="secondary" className="text-muted-foreground gap-1">
                <Lock className="w-3 h-3" />
                Past Week (View Only)
              </Badge>
            )}
            {isFutureWeek && (
              <Badge variant="outline" className="text-primary border-primary/30 gap-1">
                <ArrowRight className="w-3 h-3" />
                Upcoming
              </Badge>
            )}
            
            {!isCurrentWeek && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={goToCurrentWeek}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Today
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
