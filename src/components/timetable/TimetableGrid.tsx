import { cn } from "@/lib/utils";
import { TimetableEntry, PeriodStructure, subjectColors, TeacherLoad } from "@/data/timetableData";
import { InfoTooltip } from "./InfoTooltip";
import { Plus, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TimetableGridProps {
  entries: TimetableEntry[];
  periodStructure: PeriodStructure;
  selectedTeacher?: TeacherLoad | null;
  selectedBatchId?: string | null;
  viewMode: 'teacher' | 'batch';
  onCellClick?: (day: string, period: number) => void;
  getTeacherConflict?: (day: string, period: number) => boolean;
  getBatchConflict?: (day: string, period: number) => boolean;
}

export const TimetableGrid = ({
  entries,
  periodStructure,
  selectedTeacher,
  selectedBatchId,
  viewMode,
  onCellClick,
  getTeacherConflict,
  getBatchConflict,
}: TimetableGridProps) => {
  const { workingDays, periodsPerDay, breakAfterPeriod, timeMapping } = periodStructure;
  
  // Generate period numbers array
  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1);

  // Get entry for specific cell
  const getEntry = (day: string, period: number): TimetableEntry | undefined => {
    if (viewMode === 'teacher' && selectedTeacher) {
      return entries.find(
        e => e.day === day && e.periodNumber === period && e.teacherId === selectedTeacher.teacherId
      );
    }
    if (viewMode === 'batch' && selectedBatchId) {
      return entries.find(
        e => e.day === day && e.periodNumber === period && e.batchId === selectedBatchId
      );
    }
    return undefined;
  };

  // Check if teacher is available on this day
  const isTeacherAvailable = (day: string): boolean => {
    if (!selectedTeacher) return true;
    return selectedTeacher.workingDays.includes(day);
  };

  // Check if period should be avoided
  const shouldAvoidPeriod = (period: number): boolean => {
    if (!selectedTeacher) return false;
    if (period === 1 && selectedTeacher.avoidFirstPeriod) return true;
    if (period === periodsPerDay && selectedTeacher.avoidLastPeriod) return true;
    return false;
  };

  // Get time for period
  const getTimeForPeriod = (period: number): string => {
    const mapping = timeMapping.find(t => t.period === period);
    if (mapping) {
      return `${mapping.startTime} - ${mapping.endTime}`;
    }
    return `Period ${period}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="bg-muted/40">
            <th className="p-3 text-left text-sm font-medium text-muted-foreground border-b border-r border-border w-[100px]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Period
              </div>
            </th>
            {workingDays.map(day => (
              <th 
                key={day} 
                className={cn(
                  "p-3 text-center text-sm font-medium border-b border-border",
                  !isTeacherAvailable(day) && "bg-muted/60 text-muted-foreground/50"
                )}
              >
                {day}
                {!isTeacherAvailable(day) && selectedTeacher && (
                  <span className="block text-xs font-normal text-muted-foreground/70">Off Day</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map(period => (
            <>
              {period === breakAfterPeriod + 1 && (
                <tr key={`break-${period}`} className="bg-amber-50 dark:bg-amber-950/20">
                  <td 
                    colSpan={workingDays.length + 1} 
                    className="p-2 text-center text-sm font-medium text-amber-700 dark:text-amber-400 border-b border-border"
                  >
                    <div className="flex items-center justify-center gap-2">
                      ☕ Break
                      <InfoTooltip content="Students and teachers take a break after this period" />
                    </div>
                  </td>
                </tr>
              )}
              <tr 
                key={period} 
                className={cn(
                  "border-b border-border",
                  shouldAvoidPeriod(period) && "bg-orange-50/50 dark:bg-orange-950/10"
                )}
              >
                <td className="p-3 text-sm font-medium text-muted-foreground border-r border-border">
                  <div className="flex flex-col">
                    <span>P{period}</span>
                    <span className="text-xs text-muted-foreground/70">
                      {getTimeForPeriod(period)}
                    </span>
                  </div>
                  {shouldAvoidPeriod(period) && (
                    <Badge variant="outline" className="text-xs mt-1 bg-orange-100 text-orange-700 border-orange-200">
                      Avoid
                    </Badge>
                  )}
                </td>
                {workingDays.map(day => {
                  const entry = getEntry(day, period);
                  const isTeacherOff = !isTeacherAvailable(day);
                  const hasTeacherConflict = getTeacherConflict?.(day, period);
                  const hasBatchConflict = getBatchConflict?.(day, period);
                  const colors = entry ? subjectColors[entry.subjectId] : null;

                  return (
                    <td
                      key={`${day}-${period}`}
                      className={cn(
                        "p-2 text-center border-r border-border last:border-r-0 transition-all duration-200",
                        isTeacherOff && "bg-muted/40 cursor-not-allowed",
                        !isTeacherOff && !entry && "hover:bg-primary/5 cursor-pointer",
                        hasTeacherConflict && "bg-red-50 dark:bg-red-950/20",
                        hasBatchConflict && "bg-amber-50 dark:bg-amber-950/20"
                      )}
                      onClick={() => !isTeacherOff && onCellClick?.(day, period)}
                    >
                      {entry ? (
                        <div
                          className={cn(
                            "p-2 rounded-lg border transition-all hover:shadow-md",
                            colors?.bg,
                            colors?.text,
                            colors?.border
                          )}
                        >
                          <p className="font-medium text-sm">{entry.subjectName}</p>
                          <p className="text-xs opacity-80 mt-0.5 truncate">
                            {viewMode === 'teacher' ? entry.batchName : entry.teacherName.split(' ').pop()}
                          </p>
                        </div>
                      ) : isTeacherOff ? (
                        <div className="p-2 text-xs text-muted-foreground/50">—</div>
                      ) : (
                        <div className="p-3 rounded-lg border border-dashed border-border/50 hover:border-primary/50 group">
                          <Plus className="w-4 h-4 mx-auto text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        </div>
                      )}
                      
                      {(hasTeacherConflict || hasBatchConflict) && (
                        <div className="flex items-center justify-center mt-1">
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};
