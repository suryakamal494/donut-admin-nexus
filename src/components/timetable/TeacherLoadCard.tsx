import { memo } from "react";
import { cn } from "@/lib/utils";
import { TeacherLoad, TeacherConstraint } from "@/data/timetableData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Clock, AlertTriangle, GripVertical, Zap, Ban, Timer } from "lucide-react";
import { DragEvent } from "react";

interface TeacherLoadCardProps {
  teacher: TeacherLoad;
  constraint?: TeacherConstraint;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
  draggable?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>, teacher: TeacherLoad) => void;
  onDragEnd?: (e: DragEvent<HTMLDivElement>) => void;
  currentDayPeriods?: number; // Periods already assigned today
  currentDay?: string; // Current day being viewed
}

export const TeacherLoadCard = memo(function TeacherLoadCard({ 
  teacher, 
  constraint,
  isSelected, 
  onClick, 
  compact = false,
  draggable = false,
  onDragStart,
  onDragEnd,
  currentDayPeriods = 0,
  currentDay,
}: TeacherLoadCardProps) {
  const percentage = Math.round((teacher.assignedPeriods / teacher.periodsPerWeek) * 100);
  const remaining = teacher.periodsPerWeek - teacher.assignedPeriods;
  const isOverloaded = percentage > 100;
  const isNearCapacity = percentage >= 80 && percentage <= 100;
  
  // Check constraint violations
  const hasConstraint = !!constraint;
  const isNearDayLimit = constraint && currentDayPeriods >= (constraint.maxPeriodsPerDay - 1);
  const isAtDayLimit = constraint && currentDayPeriods >= constraint.maxPeriodsPerDay;
  const isUnavailableToday = constraint && currentDay && constraint.unavailableDays.includes(currentDay);
  const hasTimeWindow = constraint?.timeWindow;
  const isHardConstraint = constraint?.preferenceLevel === 'hard';
  
  const getProgressColor = () => {
    if (isOverloaded) return 'bg-destructive';
    if (isNearCapacity) return 'bg-amber-500';
    return 'bg-primary';
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (!draggable) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'teacher',
      teacher: teacher,
    }));
    onDragStart?.(e, teacher);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    onDragEnd?.(e);
  };

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            draggable={draggable && !isUnavailableToday && !isAtDayLimit}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={onClick}
            className={cn(
              "w-full flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-200 min-w-0 overflow-hidden",
              isSelected 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-border hover:border-primary/50 hover:bg-muted/30",
              draggable && !isUnavailableToday && !isAtDayLimit && "cursor-grab active:cursor-grabbing",
              draggable && !isUnavailableToday && !isAtDayLimit && "hover:shadow-md",
              isUnavailableToday && "opacity-50 cursor-not-allowed bg-muted/20",
              isAtDayLimit && isHardConstraint && "opacity-50 cursor-not-allowed"
            )}
          >
            {draggable && !isUnavailableToday && !isAtDayLimit && (
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
            )}
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
              hasConstraint ? "bg-amber-100 dark:bg-amber-900" : "bg-primary/10"
            )}>
              <User className={cn(
                "w-3.5 h-3.5",
                hasConstraint ? "text-amber-600 dark:text-amber-400" : "text-primary"
              )} />
            </div>
            <div className="flex-1 text-left min-w-0 overflow-hidden">
              <p className="font-medium text-sm truncate">{teacher.teacherName}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="truncate">{remaining} left</span>
                <span className="flex-shrink-0">•</span>
                <span className="flex-shrink-0">{percentage}%</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {isUnavailableToday && (
                <Ban className="w-3.5 h-3.5 text-red-500" />
              )}
              {isAtDayLimit && !isUnavailableToday && (
                <Timer className="w-3.5 h-3.5 text-orange-500" />
              )}
              {isNearDayLimit && !isAtDayLimit && !isUnavailableToday && (
                <Clock className="w-3.5 h-3.5 text-amber-500" />
              )}
              {hasConstraint && !isUnavailableToday && !isAtDayLimit && !isNearDayLimit && (
                <Zap className="w-3 h-3 text-amber-500" />
              )}
              {isOverloaded && (
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
              )}
            </div>
          </div>
        </TooltipTrigger>
        {(hasConstraint || isOverloaded) && (
          <TooltipContent side="right" className="max-w-[200px]">
            <div className="space-y-1 text-xs">
              {isUnavailableToday && (
                <p className="text-red-500 font-medium">Not available on {currentDay}</p>
              )}
              {isAtDayLimit && !isUnavailableToday && (
                <p className="text-orange-500 font-medium">At daily limit ({constraint?.maxPeriodsPerDay} periods)</p>
              )}
              {isNearDayLimit && !isAtDayLimit && (
                <p className="text-amber-500">Near daily limit ({currentDayPeriods}/{constraint?.maxPeriodsPerDay})</p>
              )}
              {hasConstraint && constraint && (
                <>
                  <p>Max {constraint.maxPeriodsPerDay}/day</p>
                  <p>Max {constraint.maxConsecutivePeriods} consecutive</p>
                  {isHardConstraint && <p className="text-red-500">Hard constraint</p>}
                </>
              )}
              {isOverloaded && <p className="text-destructive">Weekly overload!</p>}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    );
  }

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border transition-all duration-200 text-left",
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border hover:border-primary/50 hover:bg-muted/30",
        draggable && "cursor-grab active:cursor-grabbing",
        hasConstraint && "ring-1 ring-amber-200 dark:ring-amber-800"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            hasConstraint ? "bg-amber-100 dark:bg-amber-900" : "bg-primary/10"
          )}>
            <User className={cn(
              "w-5 h-5",
              hasConstraint ? "text-amber-600 dark:text-amber-400" : "text-primary"
            )} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">{teacher.teacherName}</p>
              {hasConstraint && (
                <Tooltip>
                  <TooltipTrigger>
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Has availability constraints</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {teacher.subjects.map(s => s.toUpperCase()).join(', ')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isOverloaded && (
            <Badge variant="destructive" className="text-xs">Overloaded</Badge>
          )}
          {hasConstraint && isHardConstraint && (
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400">
              Hard
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Weekly Load</span>
          <span className="font-medium">
            {teacher.assignedPeriods} / {teacher.periodsPerWeek} periods
          </span>
        </div>
        <Progress 
          value={Math.min(percentage, 100)} 
          className={cn("h-2", getProgressColor())}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{remaining} remaining</span>
          <span className={cn(
            isOverloaded && "text-destructive font-medium",
            isNearCapacity && "text-amber-600 font-medium"
          )}>
            {percentage}%
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
        <div className="flex flex-wrap gap-1">
          {teacher.workingDays.slice(0, 3).map(day => (
            <Badge key={day} variant="secondary" className="text-xs px-2 py-0.5">
              {day.slice(0, 3)}
            </Badge>
          ))}
          {teacher.workingDays.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              +{teacher.workingDays.length - 3}
            </Badge>
          )}
        </div>
        
        {/* Constraint Summary */}
        {hasConstraint && constraint && (
          <div className="flex flex-wrap gap-1 pt-1">
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400">
              <Clock className="w-3 h-3 mr-1" />
              {constraint.maxPeriodsPerDay}/day
            </Badge>
            {constraint.unavailableDays.length > 0 && (
              <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400">
                <Ban className="w-3 h-3 mr-1" />
                Off: {constraint.unavailableDays.map(d => d.slice(0, 3)).join(', ')}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
