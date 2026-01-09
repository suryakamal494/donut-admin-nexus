import { CheckCircle2, Clock, Plus, FlaskConical, Dumbbell, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeacherTimetableSlot } from "@/data/teacherData";

interface TeacherTimetableCellProps {
  slot?: TeacherTimetableSlot;
  isLive?: boolean;
  isPast?: boolean;
  isToday?: boolean;
  dateStr: string;
  onCellClick?: () => void;
}

const getPeriodTypeIcon = (type?: string) => {
  switch (type) {
    case 'lab':
      return <FlaskConical className="w-3 h-3" />;
    case 'sports':
      return <Dumbbell className="w-3 h-3" />;
    case 'library':
      return <BookOpen className="w-3 h-3" />;
    default:
      return null;
  }
};

export const TeacherTimetableCell = ({
  slot,
  isLive,
  isPast,
  isToday,
  dateStr,
  onCellClick,
}: TeacherTimetableCellProps) => {
  // Empty cell (no class scheduled)
  if (!slot) {
    return (
      <div className={cn(
        "h-[52px] flex items-center justify-center",
        "bg-muted/20 rounded-md",
        isToday && "bg-primary/5"
      )}>
        <span className="text-muted-foreground/40 text-xs">—</span>
      </div>
    );
  }

  const hasLessonPlan = slot.lessonPlanStatus === 'ready' || slot.lessonPlanStatus === 'draft';
  const isReady = slot.lessonPlanStatus === 'ready';
  const isDraft = slot.lessonPlanStatus === 'draft';
  const periodTypeIcon = getPeriodTypeIcon(slot.periodType);

  // Extract section from batchName (e.g., "10A" -> "10A")
  const classSection = slot.batchName;

  return (
    <div
      onClick={onCellClick}
      className={cn(
        // Base styles - Compact design
        "h-[52px] px-2.5 py-1.5 rounded-md cursor-pointer transition-all duration-150",
        "flex flex-col justify-center group relative",
        
        // Status-based backgrounds
        isReady && "bg-teal-50 border border-teal-200/60",
        isDraft && "bg-amber-50 border border-amber-200/60",
        !hasLessonPlan && !isPast && "bg-white border border-border hover:border-green-400 hover:bg-green-50/30",
        !hasLessonPlan && isPast && "bg-muted/30 border border-transparent",
        
        // Live state - Prominent
        isLive && "ring-2 ring-primary ring-offset-1 bg-primary/10 border-primary/30",
        
        // Past state
        isPast && "opacity-60",
        
        // Hover effects
        !isPast && "hover:shadow-sm"
      )}
    >
      {/* Top Row: Class+Section + Room/Type Badge */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          {/* Live Badge */}
          {isLive && (
            <span className="text-[8px] font-bold text-white bg-primary px-1 py-0.5 rounded uppercase tracking-wide animate-pulse">
              LIVE
            </span>
          )}
          
          {/* Class + Section - Bold and prominent */}
          <span className={cn(
            "text-sm font-bold text-gray-900 leading-none",
            isLive && "text-primary"
          )}>
            {classSection}
          </span>
          
          {/* Period Type Icon */}
          {periodTypeIcon && (
            <span className="text-muted-foreground">{periodTypeIcon}</span>
          )}
        </div>
        
        {/* Room Badge or Status Icon */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isReady && (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          )}
          {isDraft && (
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          )}
          {slot.room && !isReady && !isDraft && (
            <span className="text-[9px] font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
              {slot.room.replace('Room ', 'R').replace('Physics Lab', 'Lab')}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Chapter/Topic OR Add Plan CTA */}
      <div className="mt-0.5">
        {hasLessonPlan && slot.topic ? (
          <p className={cn(
            "text-[11px] leading-tight line-clamp-1 font-medium",
            isReady && "text-gray-700",
            isDraft && "text-gray-600"
          )}>
            {slot.topic}
          </p>
        ) : !isPast ? (
          <div className={cn(
            "flex items-center gap-0.5 text-[11px] font-semibold",
            "text-green-600 group-hover:text-green-700 transition-colors"
          )}>
            <Plus className="w-3 h-3" />
            <span>Add Plan</span>
          </div>
        ) : (
          <span className="text-[10px] text-gray-400 font-medium">No plan</span>
        )}
      </div>
    </div>
  );
};
