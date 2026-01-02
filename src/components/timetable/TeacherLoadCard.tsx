import { cn } from "@/lib/utils";
import { TeacherLoad } from "@/data/timetableData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { User, Clock, AlertTriangle } from "lucide-react";

interface TeacherLoadCardProps {
  teacher: TeacherLoad;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export const TeacherLoadCard = ({ 
  teacher, 
  isSelected, 
  onClick, 
  compact = false 
}: TeacherLoadCardProps) => {
  const percentage = Math.round((teacher.assignedPeriods / teacher.periodsPerWeek) * 100);
  const remaining = teacher.periodsPerWeek - teacher.assignedPeriods;
  const isOverloaded = percentage > 100;
  const isNearCapacity = percentage >= 80 && percentage <= 100;
  
  const getProgressColor = () => {
    if (isOverloaded) return 'bg-destructive';
    if (isNearCapacity) return 'bg-amber-500';
    return 'bg-primary';
  };

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
          isSelected 
            ? "border-primary bg-primary/5 shadow-sm" 
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="font-medium text-sm truncate">{teacher.teacherName}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{remaining} left</span>
            <span>•</span>
            <span>{percentage}%</span>
          </div>
        </div>
        {isOverloaded && (
          <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border transition-all duration-200 text-left",
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-border hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{teacher.teacherName}</p>
            <p className="text-xs text-muted-foreground">
              {teacher.subjects.map(s => s.toUpperCase()).join(', ')}
            </p>
          </div>
        </div>
        {isOverloaded && (
          <Badge variant="destructive" className="text-xs">Overloaded</Badge>
        )}
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

      <div className="mt-3 pt-3 border-t border-border/50">
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
      </div>
    </button>
  );
};
