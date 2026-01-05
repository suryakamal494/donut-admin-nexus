import { useState } from "react";
import { TimetableEntry, TeacherLoad, TimetableConflict } from "@/data/timetableData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, ChevronDown, ChevronUp, UserX, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConflictSummaryPanelProps {
  entries: TimetableEntry[];
  teachers: TeacherLoad[];
  onConflictClick?: (conflict: TimetableConflict) => void;
}

export const ConflictSummaryPanel = ({
  entries,
  teachers,
  onConflictClick,
}: ConflictSummaryPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Detect conflicts
  const detectConflicts = (): TimetableConflict[] => {
    const conflicts: TimetableConflict[] = [];

    // Teacher clashes: same teacher, same day, same period, different batches
    const teacherSlots = new Map<string, TimetableEntry[]>();
    entries.forEach(entry => {
      const key = `${entry.teacherId}-${entry.day}-${entry.periodNumber}`;
      if (!teacherSlots.has(key)) {
        teacherSlots.set(key, []);
      }
      teacherSlots.get(key)!.push(entry);
    });

    teacherSlots.forEach((slotEntries, key) => {
      if (slotEntries.length > 1) {
        const [teacherId, day, period] = key.split('-');
        const teacher = teachers.find(t => t.teacherId === teacherId);
        conflicts.push({
          type: 'teacher_clash',
          severity: 'error',
          message: `${teacher?.teacherName || 'Teacher'} is assigned to ${slotEntries.length} classes at ${day} P${period}`,
          day,
          periodNumber: parseInt(period),
          teacherId,
        });
      }
    });

    // Batch clashes: same batch, same day, same period, different teachers
    const batchSlots = new Map<string, TimetableEntry[]>();
    entries.forEach(entry => {
      const key = `${entry.batchId}-${entry.day}-${entry.periodNumber}`;
      if (!batchSlots.has(key)) {
        batchSlots.set(key, []);
      }
      batchSlots.get(key)!.push(entry);
    });

    batchSlots.forEach((slotEntries, key) => {
      if (slotEntries.length > 1) {
        const [batchId, day, period] = key.split('-');
        conflicts.push({
          type: 'batch_clash',
          severity: 'error',
          message: `${slotEntries[0].batchName} has ${slotEntries.length} classes at ${day} P${period}`,
          day,
          periodNumber: parseInt(period),
          batchId,
        });
      }
    });

    // Overload: teacher has more assigned periods than allowed
    teachers.forEach(teacher => {
      const assignedCount = entries.filter(e => e.teacherId === teacher.teacherId).length;
      if (assignedCount > teacher.periodsPerWeek) {
        conflicts.push({
          type: 'overload',
          severity: 'warning',
          message: `${teacher.teacherName} is overloaded: ${assignedCount}/${teacher.periodsPerWeek} periods`,
          day: '',
          periodNumber: 0,
          teacherId: teacher.teacherId,
        });
      }
    });

    return conflicts;
  };

  const conflicts = detectConflicts();
  const teacherClashes = conflicts.filter(c => c.type === 'teacher_clash');
  const batchClashes = conflicts.filter(c => c.type === 'batch_clash');
  const overloads = conflicts.filter(c => c.type === 'overload');

  const hasConflicts = conflicts.length > 0;

  const getConflictIcon = (type: TimetableConflict['type']) => {
    switch (type) {
      case 'teacher_clash':
        return <UserX className="w-4 h-4" />;
      case 'batch_clash':
        return <Users className="w-4 h-4" />;
      case 'overload':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getConflictColor = (type: TimetableConflict['type']) => {
    switch (type) {
      case 'teacher_clash':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'batch_clash':
        return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800';
      case 'overload':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950/30 dark:border-orange-800';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn(
        "rounded-xl border transition-colors",
        hasConflicts 
          ? "bg-destructive/5 border-destructive/20" 
          : "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800"
      )}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto hover:bg-transparent"
          >
            <div className="flex items-center gap-3">
              {hasConflicts ? (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              )}
              <span className={cn(
                "font-semibold",
                hasConflicts ? "text-destructive" : "text-emerald-700 dark:text-emerald-400"
              )}>
                {hasConflicts ? 'Conflicts Detected' : 'No Conflicts'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {hasConflicts && (
                <div className="flex gap-2">
                  {teacherClashes.length > 0 && (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      {teacherClashes.length} Teacher
                    </Badge>
                  )}
                  {batchClashes.length > 0 && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400">
                      {batchClashes.length} Batch
                    </Badge>
                  )}
                  {overloads.length > 0 && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400">
                      {overloads.length} Overload
                    </Badge>
                  )}
                </div>
              )}
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-2">
            {!hasConflicts ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Your timetable has no scheduling conflicts. Great job!
              </p>
            ) : (
              conflicts.map((conflict, index) => (
                <button
                  key={index}
                  onClick={() => onConflictClick?.(conflict)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:shadow-sm",
                    getConflictColor(conflict.type),
                    conflict.type !== 'overload' && "cursor-pointer hover:scale-[1.01]"
                  )}
                  disabled={conflict.type === 'overload'}
                >
                  {getConflictIcon(conflict.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{conflict.message}</p>
                    {conflict.type !== 'overload' && (
                      <p className="text-xs opacity-70 mt-0.5">Click to navigate</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
