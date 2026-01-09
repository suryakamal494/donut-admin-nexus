import { Check, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SubjectCompletion {
  subjectId: string;
  subjectName: string;
  isComplete: boolean;
}

interface ClassProgress {
  classId: string;
  className: string;
  subjects: SubjectCompletion[];
}

interface SetupProgressMatrixProps {
  trackName: string;
  classes: ClassProgress[];
  onSelectClass?: (classId: string) => void;
  selectedClassId?: string;
}

export function SetupProgressMatrix({
  trackName,
  classes,
  onSelectClass,
  selectedClassId,
}: SetupProgressMatrixProps) {
  const totalSubjects = classes.reduce((sum, c) => sum + c.subjects.length, 0);
  const completedSubjects = classes.reduce(
    (sum, c) => sum + c.subjects.filter(s => s.isComplete).length,
    0
  );
  const progressPercent = totalSubjects > 0 ? Math.round((completedSubjects / totalSubjects) * 100) : 0;

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      {/* Track Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">{trackName} Progress</h3>
        <Badge 
          variant={progressPercent === 100 ? "default" : "secondary"}
          className={cn(
            progressPercent === 100 && "bg-emerald-100 text-emerald-700"
          )}
        >
          {completedSubjects}/{totalSubjects} subjects
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500",
            progressPercent === 100 ? "bg-emerald-500" : "bg-primary"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Class Rows */}
      <div className="space-y-2">
        {classes.map((classItem) => {
          const classComplete = classItem.subjects.filter(s => s.isComplete).length;
          const classTotal = classItem.subjects.length;
          const isSelected = selectedClassId === classItem.classId;

          return (
            <button
              key={classItem.classId}
              onClick={() => onSelectClass?.(classItem.classId)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                isSelected 
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                  : "border-transparent bg-muted/50 hover:bg-muted/80"
              )}
            >
              <span className="font-medium text-sm">{classItem.className}</span>
              
              <div className="flex items-center gap-2">
                {/* Subject Dots */}
                <div className="flex items-center gap-1">
                  {classItem.subjects.map((subject) => (
                    <div
                      key={subject.subjectId}
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center transition-colors",
                        subject.isComplete 
                          ? "bg-emerald-100 text-emerald-600" 
                          : "bg-muted-foreground/10 text-muted-foreground/40"
                      )}
                      title={`${subject.subjectName}: ${subject.isComplete ? "Configured" : "Not configured"}`}
                    >
                      {subject.isComplete ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Circle className="w-2 h-2" />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Count Badge */}
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs tabular-nums",
                    classComplete === classTotal && "border-emerald-200 text-emerald-700"
                  )}
                >
                  {classComplete}/{classTotal}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
