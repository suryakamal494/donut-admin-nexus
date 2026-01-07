import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeekNavigatorProps {
  currentWeekStart: Date;
  onWeekChange: (newStart: Date) => void;
  className?: string;
}

export const WeekNavigator = ({ currentWeekStart, onWeekChange, className }: WeekNavigatorProps) => {
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    onWeekChange(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    onWeekChange(newStart);
  };

  const goToThisWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    onWeekChange(monday);
  };

  const isThisWeek = () => {
    const today = new Date();
    return today >= currentWeekStart && today <= weekEnd;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <div className="flex items-center gap-2 min-w-[180px] justify-center">
        <span className="font-medium text-sm">
          {formatDate(currentWeekStart)} - {formatDate(weekEnd)}
        </span>
        {!isThisWeek() && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-primary px-2 h-6"
            onClick={goToThisWeek}
          >
            Today
          </Button>
        )}
      </div>
      
      <Button variant="ghost" size="icon" onClick={goToNextWeek}>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
