import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
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

  const formatDateRange = () => {
    if (!selectedWeek) return "";
    const start = parseISO(selectedWeek.startDate);
    const end = parseISO(selectedWeek.endDate);
    return `${format(start, "d MMM")} - ${format(end, "d MMM yyyy")}`;
  };

  // Show 5 week dots centered around current selection
  const getVisibleWeekIndices = () => {
    const totalToShow = 7;
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
    <div className="rounded-xl border bg-card p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Week Selector */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onWeekChange(Math.max(0, selectedWeekIndex - 1))}
            disabled={selectedWeekIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Week Dots */}
          <div className="flex items-center gap-1.5">
            {visibleIndices.map((idx) => (
              <button
                key={idx}
                onClick={() => onWeekChange(idx)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  idx === selectedWeekIndex
                    ? "bg-primary text-primary-foreground scale-110"
                    : idx === currentWeekIndex
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : idx < currentWeekIndex
                    ? "bg-muted text-muted-foreground hover:bg-muted/80"
                    : "bg-muted/50 text-muted-foreground/70 hover:bg-muted/80"
                )}
                title={weeks[idx]?.label}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onWeekChange(Math.min(weeks.length - 1, selectedWeekIndex + 1))}
            disabled={selectedWeekIndex === weeks.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Week Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{formatDateRange()}</span>
          </div>
          
          {isCurrentWeek && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
              Current Week
            </Badge>
          )}
          {isPastWeek && (
            <Badge variant="secondary" className="text-muted-foreground">
              Past
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
