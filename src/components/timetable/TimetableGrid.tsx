import { cn } from "@/lib/utils";
import { TimetableEntry, PeriodStructure, subjectColors, TeacherLoad } from "@/data/timetableData";
import { InfoTooltip } from "./InfoTooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, AlertTriangle, Clock, GripVertical, CalendarOff, Building2, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DragEvent, useState } from "react";
import { Holiday } from "./HolidayCalendarDialog";
import { format, parseISO, getDay, startOfWeek, addDays, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

export interface DragData {
  type: 'teacher' | 'entry';
  teacher?: TeacherLoad;
  entry?: TimetableEntry;
}

interface TimetableGridProps {
  entries: TimetableEntry[];
  periodStructure: PeriodStructure;
  selectedTeacher?: TeacherLoad | null;
  selectedBatchId?: string | null;
  viewMode: 'teacher' | 'batch';
  onCellClick?: (day: string, period: number, existingEntry?: TimetableEntry) => void;
  getTeacherConflict?: (day: string, period: number) => boolean;
  getBatchConflict?: (day: string, period: number) => boolean;
  onDrop?: (day: string, period: number, data: DragData) => void;
  onEntryDragStart?: (entry: TimetableEntry) => void;
  onEntryDragEnd?: () => void;
  isDragging?: boolean;
  draggedEntry?: TimetableEntry | null;
  holidays?: Holiday[];
  weekStartDate?: Date;
}

// Map day names to day indices (0 = Sunday)
const dayNameToIndex: Record<string, number> = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
};

export const TimetableGrid = ({
  entries,
  periodStructure,
  selectedTeacher,
  selectedBatchId,
  viewMode,
  onCellClick,
  getTeacherConflict,
  getBatchConflict,
  onDrop,
  onEntryDragStart,
  onEntryDragEnd,
  isDragging = false,
  draggedEntry,
  holidays = [],
  weekStartDate,
}: TimetableGridProps) => {
  const { workingDays, periodsPerDay, breaks, timeMapping, useTimeMapping } = periodStructure;
  const [dragOverCell, setDragOverCell] = useState<{ day: string; period: number } | null>(null);
  
  // Generate period numbers array
  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1);
  
  // Check if period has a break after it
  const isBreakAfter = (period: number): boolean => {
    return breaks.some(b => b.afterPeriod === period);
  };
  
  // Get break info for a period
  const getBreakAfter = (period: number) => {
    return breaks.find(b => b.afterPeriod === period);
  };

  // Check if a specific date is a holiday
  const isDateHoliday = (dayIndex: number): boolean => {
    if (!weekStartDate || holidays.length === 0) return false;
    const dateForDay = addDays(weekStartDate, dayIndex);
    const dateStr = format(dateForDay, 'yyyy-MM-dd');
    return holidays.some(h => h.date === dateStr);
  };

  // Get holiday info for a specific date
  const getHolidayForDate = (dayIndex: number): Holiday | null => {
    if (!weekStartDate || holidays.length === 0) return null;
    const dateForDay = addDays(weekStartDate, dayIndex);
    const dateStr = format(dateForDay, 'yyyy-MM-dd');
    return holidays.find(h => h.date === dateStr) || null;
  };

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

  // Check if day has any holidays (for visual indicator in header)
  const getHolidaysForDay = (dayName: string): Holiday[] => {
    const dayIndex = dayNameToIndex[dayName];
    if (dayIndex === undefined) return [];
    
    return holidays.filter(h => {
      const holidayDate = parseISO(h.date);
      return getDay(holidayDate) === dayIndex;
    });
  };

  // Check if a specific day name has upcoming holidays
  const hasUpcomingHoliday = (dayName: string): Holiday | null => {
    const dayHolidays = getHolidaysForDay(dayName);
    if (dayHolidays.length === 0) return null;
    
    // Return the nearest upcoming holiday on this day
    const today = new Date();
    const upcoming = dayHolidays
      .filter(h => parseISO(h.date) >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return upcoming[0] || null;
  };

  // Check if period should be avoided
  const shouldAvoidPeriod = (period: number): boolean => {
    if (!selectedTeacher) return false;
    if (period === 1 && selectedTeacher.avoidFirstPeriod) return true;
    if (period === periodsPerDay && selectedTeacher.avoidLastPeriod) return true;
    return false;
  };

  // Get time for period (or period number if time mapping disabled)
  const getTimeForPeriod = (period: number): string => {
    if (!useTimeMapping) {
      return `Period ${period}`;
    }
    const mapping = timeMapping.find(t => t.period === period);
    if (mapping) {
      return `${mapping.startTime} - ${mapping.endTime}`;
    }
    return `Period ${period}`;
  };

  // Check if drop is valid for this cell
  const isValidDropTarget = (day: string, period: number, dayIndex: number): boolean => {
    if (!isTeacherAvailable(day)) return false;
    if (isDateHoliday(dayIndex)) return false;
    const existingEntry = getEntry(day, period);
    if (existingEntry && draggedEntry?.id !== existingEntry.id) return false;
    return true;
  };

  // Handle drag over
  const handleDragOver = (e: DragEvent<HTMLTableCellElement>, day: string, period: number, dayIndex: number) => {
    if (!isTeacherAvailable(day) || isDateHoliday(dayIndex)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell({ day, period });
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  // Handle drop
  const handleDrop = (e: DragEvent<HTMLTableCellElement>, day: string, period: number, dayIndex: number) => {
    e.preventDefault();
    setDragOverCell(null);
    
    if (!isTeacherAvailable(day) || isDateHoliday(dayIndex)) return;
    
    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (rawData) {
        const data: DragData = JSON.parse(rawData);
        onDrop?.(day, period, data);
      }
    } catch (err) {
      console.error('Error parsing drop data:', err);
    }
  };

  // Handle entry drag start
  const handleEntryDragStart = (e: DragEvent<HTMLDivElement>, entry: TimetableEntry) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'entry',
      entry: entry,
    }));
    onEntryDragStart?.(entry);
  };

  // Handle entry drag end
  const handleEntryDragEnd = () => {
    setDragOverCell(null);
    onEntryDragEnd?.();
  };

  return (
    <TooltipProvider>
      <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[700px] lg:min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-muted/40">
              <th className="p-2 sm:p-3 text-left text-xs sm:text-sm font-medium text-muted-foreground border-b border-r border-border w-[60px] sm:w-[100px]">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Period</span>
                </div>
              </th>
              {workingDays.map((day, dayIndex) => {
                const upcomingHoliday = hasUpcomingHoliday(day);
                const isOff = !isTeacherAvailable(day);
                
                // Calculate the actual date for this day
                const dayDate = weekStartDate ? addDays(weekStartDate, dayIndex) : null;
                
                return (
                  <th 
                    key={day} 
                    className={cn(
                      "p-3 text-center text-sm font-medium border-b border-border relative",
                      isOff && "bg-muted/60 text-muted-foreground/50",
                      upcomingHoliday && "bg-destructive/5"
                    )}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center justify-center gap-1">
                        {day}
                        {upcomingHoliday && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CalendarOff className="w-3.5 h-3.5 text-destructive" />
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs font-medium">{upcomingHoliday.name}</p>
                              <p className="text-xs text-muted-foreground">{format(parseISO(upcomingHoliday.date), "MMM d, yyyy")}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {dayDate && (
                        <span className="text-xs font-normal text-muted-foreground">
                          {format(dayDate, 'MMM d')}
                        </span>
                      )}
                    </div>
                    {isOff && selectedTeacher && (
                      <span className="block text-xs font-normal text-muted-foreground/70">Off Day</span>
                    )}
                    {upcomingHoliday && !isOff && (
                      <span className="block text-xs font-normal text-destructive/70">Holiday</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => {
              const breakAfter = getBreakAfter(period);
              
              return (
              <>
                {breakAfter && period > 1 && isBreakAfter(period - 1) ? null : null}
                {/* Show break before this period if the previous period has a break */}
                {period > 1 && isBreakAfter(period - 1) && (
                  <tr key={`break-before-${period}`} className="bg-amber-50 dark:bg-amber-950/20">
                    <td 
                      colSpan={workingDays.length + 1} 
                      className="p-2 text-center text-sm font-medium text-amber-700 dark:text-amber-400 border-b border-border"
                    >
                      <div className="flex items-center justify-center gap-2">
                        ☕ {getBreakAfter(period - 1)?.name || 'Break'} 
                        <span className="text-xs font-normal">({getBreakAfter(period - 1)?.duration} min)</span>
                        <InfoTooltip content="Students and teachers take a break after the previous period" />
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
                  <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium text-muted-foreground border-r border-border">
                    <div className="flex flex-col">
                      <span>P{period}</span>
                      {useTimeMapping && (
                        <span className="text-[10px] sm:text-xs text-muted-foreground/70 hidden sm:block">
                          {getTimeForPeriod(period)}
                        </span>
                      )}
                    </div>
                    {shouldAvoidPeriod(period) && (
                      <Badge variant="outline" className="text-[10px] sm:text-xs mt-1 bg-orange-100 text-orange-700 border-orange-200 hidden sm:inline-flex">
                        Avoid
                      </Badge>
                    )}
                  </td>
                  {workingDays.map((day, dayIndex) => {
                    const entry = getEntry(day, period);
                    const isTeacherOff = !isTeacherAvailable(day);
                    const isDayHoliday = isDateHoliday(dayIndex);
                    const holidayInfo = getHolidayForDate(dayIndex);
                    const hasTeacherConflict = getTeacherConflict?.(day, period);
                    const hasBatchConflict = getBatchConflict?.(day, period);
                    const hasConflict = hasTeacherConflict || hasBatchConflict;
                    const colors = entry ? subjectColors[entry.subjectId] : null;
                    const isOver = dragOverCell?.day === day && dragOverCell?.period === period;
                    const isBeingDragged = draggedEntry?.id === entry?.id;
                    const isValidDrop = isValidDropTarget(day, period, dayIndex);
                    const isBlocked = isTeacherOff || isDayHoliday;

                    // Render holiday-blocked cell
                    if (isDayHoliday) {
                      return (
                        <td
                          key={`${day}-${period}`}
                          className="p-2 text-center border-r border-border last:border-r-0 bg-muted/50"
                        >
                          <div className="p-2 flex flex-col items-center justify-center text-muted-foreground/50">
                            <CalendarOff className="w-4 h-4 mb-1" />
                            <span className="text-xs">Holiday</span>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={`${day}-${period}`}
                        className={cn(
                          "p-2 text-center border-r border-border last:border-r-0 transition-all duration-200",
                          isTeacherOff && "bg-muted/40 cursor-not-allowed",
                          !isBlocked && !entry && "hover:bg-primary/5 cursor-pointer",
                          hasTeacherConflict && "bg-red-50 dark:bg-red-950/20",
                          hasBatchConflict && "bg-amber-50 dark:bg-amber-950/20",
                          // Drag-over styling
                          isOver && isValidDrop && "ring-2 ring-primary ring-inset bg-primary/10",
                          isOver && !isValidDrop && "ring-2 ring-destructive ring-inset bg-destructive/10",
                          isDragging && !isBlocked && !entry && isValidDrop && "bg-primary/5 border-dashed"
                        )}
                        onClick={() => !isBlocked && onCellClick?.(day, period, entry)}
                        onDragOver={(e) => handleDragOver(e, day, period, dayIndex)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day, period, dayIndex)}
                      >
                        {entry ? (
                          <div
                            draggable
                            onDragStart={(e) => handleEntryDragStart(e, entry)}
                            onDragEnd={handleEntryDragEnd}
                            className={cn(
                              "p-2 rounded-lg border transition-all cursor-grab active:cursor-grabbing group",
                              colors?.bg,
                              colors?.text,
                              colors?.border,
                              isBeingDragged && "opacity-50 scale-95",
                              !isBeingDragged && "hover:shadow-md hover:scale-[1.02]",
                              entry.isSubstituted && "border-dashed border-2"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm flex-1">{entry.subjectName}</p>
                              <div className="flex items-center gap-1">
                                {entry.isSubstituted && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <UserCheck className="w-3 h-3 text-amber-600" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <p className="text-xs">Substitute: {entry.substituteTeacherName}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                                <GripVertical className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                              </div>
                            </div>
                            <p className="text-xs opacity-80 mt-0.5 truncate">
                              {entry.isSubstituted 
                                ? <span className="text-amber-600">{entry.substituteTeacherName?.split(' ').pop()} (Sub)</span>
                                : viewMode === 'teacher' ? entry.batchName : entry.teacherName.split(' ').pop()
                              }
                            </p>
                            {entry.facilityName && (
                              <div className="flex items-center gap-1 mt-1">
                                <Building2 className="w-2.5 h-2.5 opacity-60" />
                                <span className="text-[10px] opacity-60">{entry.facilityName}</span>
                              </div>
                            )}
                          </div>
                        ) : isTeacherOff ? (
                          <div className="p-2 text-xs text-muted-foreground/50">—</div>
                        ) : (
                          <div className={cn(
                            "p-3 rounded-lg border border-dashed border-border/50 hover:border-primary/50 group transition-all",
                            isOver && isValidDrop && "border-primary bg-primary/5"
                          )}>
                            <Plus className={cn(
                              "w-4 h-4 mx-auto text-muted-foreground/50 group-hover:text-primary transition-colors",
                              isOver && isValidDrop && "text-primary"
                            )} />
                          </div>
                        )}
                        
                        {hasConflict && (
                          <div className="flex items-center justify-center mt-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertTriangle className="w-3 h-3 text-destructive cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[200px]">
                                <p className="text-xs">
                                  {hasTeacherConflict && "Teacher is already assigned to another class at this time."}
                                  {hasBatchConflict && "This batch already has a class at this time."}
                                  {" "}Check the Conflict Summary Panel above.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </>
              );
            })}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
};
