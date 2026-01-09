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

// Helper to format batch name for display
const formatBatchDisplay = (batchName: string): string => {
  // If already in expanded format, return as-is
  if (batchName.includes('Class')) return batchName;
  return batchName;
};

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
        "min-h-[90px] flex items-center justify-center",
        "bg-muted/20 rounded-md",
        isToday && "bg-primary/5"
      )}>
        <span className="text-black/40 text-xs">—</span>
      </div>
    );
  }

  const hasLessonPlan = slot.lessonPlanStatus === 'ready' || slot.lessonPlanStatus === 'draft';
  const isReady = slot.lessonPlanStatus === 'ready';
  const isDraft = slot.lessonPlanStatus === 'draft';
  const periodTypeIcon = getPeriodTypeIcon(slot.periodType);

  // Display batch name (can be short like "10A" or expanded like "Class Tenth, Section A")
  const classSection = formatBatchDisplay(slot.batchName);

  return (
    <div
      onClick={onCellClick}
      className={cn(
        // Base styles - Taller design for full content
        "min-h-[90px] px-3 py-2.5 rounded-md cursor-pointer transition-all duration-150",
        "flex flex-col justify-start group relative",
        
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
      {/* Top Row: Class+Section + Status Icon */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Live Badge */}
          {isLive && (
            <span className="text-[8px] font-bold text-white bg-primary px-1 py-0.5 rounded uppercase tracking-wide animate-pulse">
              LIVE
            </span>
          )}
          
          {/* Class + Section - Bold and prominent in BLACK */}
          <span className={cn(
            "text-sm font-bold text-black leading-tight",
            isLive && "text-primary"
          )}>
            {classSection}
          </span>
          
          {/* Period Type Icon */}
          {periodTypeIcon && (
            <span className="text-black">{periodTypeIcon}</span>
          )}
        </div>
        
        {/* Status Icon */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isReady && (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          )}
          {isDraft && (
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          )}
        </div>
      </div>

      {/* Room Badge - Separate row */}
      {slot.room && (
        <div className="mb-1">
          <span className="text-[10px] font-semibold text-black bg-gray-100 px-1.5 py-0.5 rounded">
            {slot.room}
          </span>
        </div>
      )}

      {/* Chapter/Topic - Full display, BLACK text */}
      <div className="flex-1">
        {slot.topic && (
          <p className="text-[12px] leading-snug font-medium text-black line-clamp-2">
            {slot.topic}
          </p>
        )}
      </div>

      {/* Add Plan Button - Always visible for tiles without lesson plan */}
      {!hasLessonPlan && !isPast && (
        <div className={cn(
          "flex items-center gap-1 text-[12px] font-bold mt-1",
          "text-green-600 group-hover:text-green-700 transition-colors"
        )}>
          <Plus className="w-3.5 h-3.5" />
          <span>Add Plan</span>
        </div>
      )}
      
      {/* Past slot without plan */}
      {!hasLessonPlan && isPast && (
        <span className="text-[11px] text-black font-medium mt-1">No plan</span>
      )}
    </div>
  );
};
