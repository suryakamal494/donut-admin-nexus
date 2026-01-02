import { useState, useMemo, useRef } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Download,
  Printer,
  CalendarOff
} from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addMonths, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth, isToday, getDay } from "date-fns";
import { timetableEntries, defaultPeriodStructure, subjectColors } from "@/data/timetableData";
import { batches } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { Holiday } from "@/components/timetable/HolidayCalendarDialog";
import { academicHolidays } from "@/data/timetableData";

// Convert academic holidays to Holiday format
const defaultHolidays: Holiday[] = academicHolidays.map(h => ({
  date: h.date,
  name: h.name
}));

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ViewTimetable = () => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const printRef = useRef<HTMLDivElement>(null);
  const [holidays] = useState<Holiday[]>(defaultHolidays);

  // Get week boundaries
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Get month boundaries
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Filter entries based on selection
  const filteredEntries = useMemo(() => {
    let entries = [...timetableEntries];
    
    if (selectedBatch !== 'all') {
      entries = entries.filter(e => e.batchId === selectedBatch);
    }
    
    if (selectedTeacher !== 'all') {
      entries = entries.filter(e => e.teacherId === selectedTeacher);
    }
    
    return entries;
  }, [selectedBatch, selectedTeacher]);

  // Get unique teachers from entries
  const teachers = useMemo(() => {
    const teacherMap = new Map<string, string>();
    timetableEntries.forEach(e => {
      teacherMap.set(e.teacherId, e.teacherName);
    });
    return Array.from(teacherMap.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Get entry for a specific day and period
  const getEntry = (day: string, period: number) => {
    return filteredEntries.find(e => e.day === day && e.periodNumber === period);
  };

  // Check if a date is a holiday
  const getHoliday = (date: Date): Holiday | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return holidays.find(h => h.date === dateStr);
  };

  // Navigation handlers
  const goToPrevious = () => {
    if (viewMode === 'weekly') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'weekly') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Get working days
  const workingDays = defaultPeriodStructure.workingDays;

  // Monthly calendar days
  const monthDays = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    // Pad the start to align with day of week
    const startPadding = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;
    return { days, startPadding };
  }, [monthStart, monthEnd]);

  const getSelectedBatchName = () => {
    if (selectedBatch === 'all') return 'All Batches';
    return batches.find(b => b.id === selectedBatch)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="View Timetable"
        description="View your scheduled timetable by week or month"
        breadcrumbs={[
          { label: "Timetable", href: "/institute/timetable" },
          { label: "View" },
        ]}
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: View Toggle + Navigator */}
            <div className="flex items-center gap-4">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'weekly' | 'monthly')}>
                <TabsList>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPrevious}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="min-w-[180px] text-center font-medium">
                  {viewMode === 'weekly' 
                    ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
                    : format(currentDate, 'MMMM yyyy')
                  }
                </div>
                <Button variant="outline" size="icon" onClick={goToNext}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={goToToday}>
                <CalendarIcon className="w-4 h-4 mr-2" />
                Today
              </Button>
            </div>

            {/* Right: Filters + Export */}
            <div className="flex items-center gap-3">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handlePrint} className="print:hidden">
                <Printer className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Display */}
      <div ref={printRef} className="print:p-4">
        {/* Print Header - Only visible when printing */}
        <div className="hidden print:block print:mb-4">
          <h1 className="text-2xl font-bold text-center">{getSelectedBatchName()} Timetable</h1>
          <p className="text-center text-muted-foreground">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </p>
        </div>

        {viewMode === 'weekly' ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-border/50 bg-muted/30 p-3 text-left font-semibold text-sm w-20">
                        Period
                      </th>
                      {workingDays.map(day => {
                        const dayIndex = dayNames.indexOf(day);
                        const dateOfDay = new Date(weekStart);
                        dateOfDay.setDate(weekStart.getDate() + (dayIndex === 0 ? 6 : dayIndex - 1));
                        const holiday = getHoliday(dateOfDay);
                        const isCurrentDay = isToday(dateOfDay);
                        
                        return (
                          <th 
                            key={day} 
                            className={cn(
                              "border border-border/50 p-3 text-center font-semibold text-sm min-w-[140px]",
                              holiday ? "bg-amber-50 dark:bg-amber-950/20" : "bg-muted/30",
                              isCurrentDay && "bg-primary/10"
                            )}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span>{day}</span>
                              <span className={cn(
                                "text-xs font-normal",
                                isCurrentDay ? "text-primary font-medium" : "text-muted-foreground"
                              )}>
                                {format(dateOfDay, 'MMM d')}
                              </span>
                              {holiday && (
                                <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-700 border-amber-200">
                                  {holiday.name}
                                </Badge>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: defaultPeriodStructure.periodsPerDay }, (_, i) => i + 1).map(period => {
                      const isBreak = period === defaultPeriodStructure.breakAfterPeriod;
                      const timeSlot = defaultPeriodStructure.timeMapping.find(t => t.period === period);
                      
                      return (
                        <>
                          <tr key={period}>
                            <td className="border border-border/50 bg-muted/20 p-3 text-center">
                              <div className="font-medium text-sm">P{period}</div>
                              {timeSlot && (
                                <div className="text-[10px] text-muted-foreground">
                                  {timeSlot.startTime}
                                </div>
                              )}
                            </td>
                            {workingDays.map(day => {
                              const dayIndex = dayNames.indexOf(day);
                              const dateOfDay = new Date(weekStart);
                              dateOfDay.setDate(weekStart.getDate() + (dayIndex === 0 ? 6 : dayIndex - 1));
                              const holiday = getHoliday(dateOfDay);
                              
                              if (holiday) {
                                return (
                                  <td 
                                    key={day} 
                                    className="border border-border/50 p-3 bg-amber-50/50 dark:bg-amber-950/10"
                                  >
                                    <div className="flex items-center justify-center text-amber-600">
                                      <CalendarOff className="w-4 h-4" />
                                    </div>
                                  </td>
                                );
                              }
                              
                              const entry = getEntry(day, period);
                              
                              if (!entry) {
                                return (
                                  <td 
                                    key={day} 
                                    className="border border-border/50 p-3 bg-muted/5"
                                  >
                                    <div className="text-center text-muted-foreground text-xs">-</div>
                                  </td>
                                );
                              }
                              
                              const colors = subjectColors[entry.subjectId] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
                              
                              return (
                                <td 
                                  key={day} 
                                  className={cn(
                                    "border border-border/50 p-2",
                                    colors.bg
                                  )}
                                >
                                  <div className="text-center">
                                    <div className={cn("font-medium text-sm", colors.text)}>
                                      {entry.subjectName}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {entry.teacherName.split(' ').slice(-1)[0]}
                                    </div>
                                    {selectedBatch === 'all' && (
                                      <div className="text-[10px] text-muted-foreground mt-0.5">
                                        {entry.batchName.split(' - ')[1]}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                          {isBreak && (
                            <tr key={`break-${period}`}>
                              <td colSpan={workingDays.length + 1} className="border border-border/50 bg-muted/30 p-2 text-center">
                                <span className="text-sm font-medium text-muted-foreground">☕ Break (11:00 - 11:30)</span>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Monthly View */
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for padding */}
                {Array.from({ length: monthDays.startPadding }).map((_, i) => (
                  <div key={`pad-${i}`} className="p-2 min-h-[100px] bg-muted/10 rounded-lg" />
                ))}
                
                {/* Calendar days */}
                {monthDays.days.map(date => {
                  const holiday = getHoliday(date);
                  const dayName = format(date, 'EEEE');
                  const isWorkingDay = workingDays.includes(dayName);
                  const dayEntries = filteredEntries.filter(e => e.day === dayName);
                  const isCurrentDay = isToday(date);
                  
                  return (
                    <div 
                      key={date.toISOString()} 
                      className={cn(
                        "p-2 min-h-[100px] border rounded-lg transition-colors",
                        !isWorkingDay && "bg-muted/20",
                        holiday && "bg-amber-50 dark:bg-amber-950/20 border-amber-200",
                        isCurrentDay && "border-primary border-2"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-sm font-medium",
                          isCurrentDay && "text-primary"
                        )}>
                          {format(date, 'd')}
                        </span>
                        {holiday && (
                          <Tooltip>
                            <TooltipTrigger>
                              <CalendarOff className="w-3 h-3 text-amber-600" />
                            </TooltipTrigger>
                            <TooltipContent>{holiday.name}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      
                      {!holiday && isWorkingDay && (
                        <div className="space-y-0.5">
                          {dayEntries.slice(0, 3).map((entry, i) => {
                            const colors = subjectColors[entry.subjectId] || { bg: 'bg-gray-100', text: 'text-gray-700' };
                            return (
                              <div 
                                key={i}
                                className={cn(
                                  "text-[10px] px-1 py-0.5 rounded truncate",
                                  colors.bg,
                                  colors.text
                                )}
                              >
                                P{entry.periodNumber}: {entry.subjectName.slice(0, 4)}
                              </div>
                            );
                          })}
                          {dayEntries.length > 3 && (
                            <div className="text-[10px] text-muted-foreground text-center">
                              +{dayEntries.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                      
                      {holiday && (
                        <div className="text-[10px] text-amber-600 font-medium">
                          {holiday.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Legend */}
      <Card className="print:hidden">
        <CardContent className="py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Subjects:</span>
            {Object.entries(subjectColors).map(([key, colors]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn("w-3 h-3 rounded", colors.bg, colors.border, "border")} />
                <span className="text-xs text-muted-foreground capitalize">{key}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          [data-print="true"], [data-print="true"] * {
            visibility: visible;
          }
          [data-print="true"] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewTimetable;