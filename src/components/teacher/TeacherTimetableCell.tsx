import { CheckCircle2, Edit3, Plus, FlaskConical, Dumbbell, BookOpen } from "lucide-react";
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
      return <FlaskConical className="w-3 h-3 text-purple-500" />;
    case 'sports':
      return <Dumbbell className="w-3 h-3 text-orange-500" />;
    case 'library':
      return <BookOpen className="w-3 h-3 text-blue-500" />;
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
        "h-full min-h-[72px] flex items-center justify-center",
        "bg-muted/20 rounded-lg border border-dashed border-muted-foreground/10",
        isToday && "bg-primary/5"
      )}>
        <span className="text-muted-foreground/30 text-xs">—</span>
      </div>
    );
  }

  const hasLessonPlan = slot.lessonPlanStatus === 'ready' || slot.lessonPlanStatus === 'draft';
  const isReady = slot.lessonPlanStatus === 'ready';
  const isDraft = slot.lessonPlanStatus === 'draft';
  const periodTypeIcon = getPeriodTypeIcon(slot.periodType);

  return (
    <div
      onClick={onCellClick}
      className={cn(
        // Base styles
        "h-full min-h-[72px] p-2.5 rounded-lg cursor-pointer transition-all duration-200",
        "flex flex-col justify-between group relative overflow-hidden",
        
        // Status-based styling
        isReady && "bg-gradient-to-br from-teal-50 to-cyan-50 border-l-[3px] border-l-green-500",
        isDraft && "bg-amber-50/70 border-l-[3px] border-l-amber-500",
        !hasLessonPlan && "bg-white border border-dashed border-muted-foreground/20 hover:border-primary/40",
        
        // Live state
        isLive && "ring-2 ring-primary ring-offset-1 bg-primary/10 animate-pulse-subtle",
        
        // Past state
        isPast && "opacity-50",
        
        // Hover
        !isPast && "hover:shadow-md hover:scale-[1.02]",
        
        // Today column highlight
        isToday && !isReady && !isDraft && "bg-primary/5"
      )}
    >
      {/* Top Row: Batch + Room Badge */}
      <div className="flex items-start justify-between gap-1">
        <span className={cn(
          "text-sm font-bold text-foreground leading-tight truncate",
          isLive && "text-primary"
        )}>
          {slot.batchName}
        </span>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {periodTypeIcon}
          {slot.room && (
            <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
              {slot.room.replace('Room ', 'R')}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Chapter/Topic (only if lesson plan exists) */}
      {slot.topic && (
        <p className={cn(
          "text-xs text-foreground/60 leading-snug line-clamp-2 my-1",
          isDraft && "text-amber-700/70"
        )}>
          {slot.topic}
        </p>
      )}

      {/* Bottom: Status Indicator */}
      <div className="flex items-center justify-between mt-auto">
        {/* Live Badge */}
        {isLive && (
          <span className="text-[9px] font-bold text-white bg-primary px-1.5 py-0.5 rounded uppercase tracking-wide">
            Live
          </span>
        )}
        
        {/* Status Icon */}
        <div className="ml-auto">
          {isReady && (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          )}
          {isDraft && (
            <Edit3 className="w-4 h-4 text-amber-600" />
          )}
          {!hasLessonPlan && !isPast && (
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-medium",
              "text-muted-foreground group-hover:text-primary transition-colors"
            )}>
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Plan</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
