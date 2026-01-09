import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Printer,
  CalendarOff,
  Pencil,
  Lock,
  AlertTriangle
} from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addMonths, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, isToday, getDay, isBefore, isAfter, startOfDay } from "date-fns";
import { timetableEntries, defaultPeriodStructure, subjectColors, TimetableEntry } from "@/data/timetableData";
import { batches } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { Holiday } from "@/components/timetable/HolidayCalendarDialog";
import { academicHolidays } from "@/data/timetableData";
import { examBlocks, defaultExamTypes } from "@/data/examBlockData";
import { isSlotBlocked, getBlocksForDate } from "@/lib/examBlockUtils";

// Convert academic holidays to Holiday format
const defaultHolidays: Holiday[] = academicHolidays.map(h => ({
  date: h.date,
  name: h.name
}));

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ViewTimetable = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const printRef = useRef<HTMLDivElement>(null);
  const [holidays] = useState<Holiday[]>(defaultHolidays);

  // Determine if viewing past or future week
  const today = startOfDay(new Date());

  // Get week boundaries
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Check if this is a past week (week end is before today)
  const isPastWeek = isBefore(weekEnd, today);
  const isFutureWeek = isAfter(weekStart, today);
  const isCurrentWeek = !isPastWeek && !isFutureWeek;

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

  // Get unique teachers from entries (filter out empty IDs for library/sports periods)
  const teachers = useMemo(() => {
    const teacherMap = new Map<string, string>();
    timetableEntries.forEach(e => {
      if (e.teacherId && e.teacherId.trim() !== '') {
        teacherMap.set(e.teacherId, e.teacherName);
      }
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
  const handlePrint = () => window.print();

  // Navigate to workspace with this week pre-selected
  const handleEditWeek = () => {
    navigate(`/institute/timetable?week=${format(weekStart, 'yyyy-MM-dd')}`);
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

      {/* Filter Bar - Compact */}
      <Card>
        <CardContent className="py-2 px-3 sm:py-3 sm:px-4">
          {/* Mobile Layout */}
          <div className="md:hidden space-y-2">
            {/* Row 1: View toggle + Navigator */}
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'weekly' | 'monthly')}>
                <TabsList className="h-8">
                  <TabsTrigger value="weekly" className="h-7 px-2 text-xs">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="h-7 px-2 text-xs">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-1 flex-1 justify-end">
                <Button variant="outline" size="icon" onClick={goToPrevious} className="h-8 w-8 shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="min-w-[100px] text-center font-medium text-xs truncate">
                  {viewMode === 'weekly' 
                    ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'd')}`
                    : format(currentDate, 'MMM yyyy')
                  }
                </div>
                <Button variant="outline" size="icon" onClick={goToNext} className="h-8 w-8 shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Row 2: Filters + Actions (horizontal scroll) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="h-8 w-[110px] shrink-0 text-xs">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="h-8 w-[110px] shrink-0 text-xs">
                  <SelectValue placeholder="Teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={goToToday} className="h-8 w-8 shrink-0 print:hidden">
                    <CalendarIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Today</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handlePrint} className="h-8 w-8 shrink-0 print:hidden">
                    <Printer className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export PDF</TooltipContent>
              </Tooltip>
              
              {!isPastWeek && viewMode === 'weekly' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" onClick={handleEditWeek} className="h-8 w-8 shrink-0 print:hidden">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Week</TooltipContent>
                </Tooltip>
              )}
            </div>
            
            {/* Past/Future Week Indicator - Mobile */}
            {viewMode === 'weekly' && (isPastWeek || isFutureWeek) && (
              <div className={cn(
                "flex items-center gap-1.5 text-xs",
                isPastWeek ? "text-muted-foreground" : "text-primary"
              )}>
                {isPastWeek ? <Lock className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                <span>{isPastWeek ? "Past week (read-only)" : "Future week (editable)"}</span>
              </div>
            )}
          </div>
          
          {/* Tablet+ Layout: Single Compact Row */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'weekly' | 'monthly')}>
              <TabsList className="h-8">
                <TabsTrigger value="weekly" className="h-7 px-3 text-xs">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="h-7 px-3 text-xs">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={goToPrevious} className="h-8 w-8">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-[120px] lg:min-w-[150px] text-center font-medium text-sm truncate">
                {viewMode === 'weekly' 
                  ? `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
                  : format(currentDate, 'MMMM yyyy')
                }
              </div>
              <Button variant="outline" size="icon" onClick={goToNext} className="h-8 w-8">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={goToToday} className="h-8 w-8 print:hidden">
                  <CalendarIcon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Today</TooltipContent>
            </Tooltip>
            
            <div className="w-px h-5 bg-border mx-1" />
            
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="h-8 w-[120px] lg:w-[140px] text-xs">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="h-8 w-[120px] lg:w-[140px] text-xs">
                <SelectValue placeholder="Teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="w-px h-5 bg-border mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 print:hidden">
                  <Printer className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline text-xs">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">Export PDF</TooltipContent>
            </Tooltip>
            
            {!isPastWeek && viewMode === 'weekly' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={handleEditWeek} className="h-8 print:hidden">
                    <Pencil className="w-4 h-4 lg:mr-2" />
                    <span className="hidden lg:inline text-xs">Edit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="lg:hidden">Edit Week</TooltipContent>
              </Tooltip>
            )}
            
            {/* Past/Future Week Indicator - Tablet+ */}
            {viewMode === 'weekly' && (isPastWeek || isFutureWeek) && (
              <div className={cn(
                "flex items-center gap-1.5 text-xs ml-auto",
                isPastWeek ? "text-muted-foreground" : "text-primary"
              )}>
                {isPastWeek ? <Lock className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
                <span className="hidden lg:inline">{isPastWeek ? "Past week (read-only)" : "Future week (editable)"}</span>
                <span className="lg:hidden">{isPastWeek ? "Read-only" : "Editable"}</span>
              </div>
            )}
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
                      const breakInfo = defaultPeriodStructure.breaks.find(b => b.afterPeriod === period - 1);
                      const timeSlot = defaultPeriodStructure.timeMapping.find(t => t.period === period);
                      
                      return (
                        <>
                          {/* Show break row before this period if previous period has a break */}
                          {breakInfo && (
                            <tr key={`break-before-${period}`}>
                              <td colSpan={workingDays.length + 1} className="border border-border/50 bg-muted/30 p-2 text-center">
                                <span className="text-sm font-medium text-muted-foreground">☕ {breakInfo.name} ({breakInfo.duration} min)</span>
                              </td>
                            </tr>
                          )}
                          <tr key={period}>
                            <td className="border border-border/50 bg-muted/20 p-3 text-center">
                              <div className="font-medium text-sm">P{period}</div>
                              {defaultPeriodStructure.useTimeMapping && timeSlot && (
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
                              
                              // Check for exam blocks
                              const blockResult = isSlotBlocked(dateOfDay, period, selectedBatch !== 'all' ? selectedBatch : null, examBlocks);
                              const examType = blockResult.blocked ? defaultExamTypes.find(t => t.id === blockResult.examTypeId) : undefined;
                              
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
                              
                              // Show exam block
                              if (blockResult.blocked) {
                                const typeColor = examType?.color || 'red';
                                const colorClasses: Record<string, string> = {
                                  red: 'bg-red-50 dark:bg-red-950/20 border-red-200',
                                  orange: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200',
                                  amber: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200',
                                  green: 'bg-green-50 dark:bg-green-950/20 border-green-200',
                                  blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200',
                                  purple: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200',
                                  pink: 'bg-pink-50 dark:bg-pink-950/20 border-pink-200',
                                };
                                const textClasses: Record<string, string> = {
                                  red: 'text-red-600',
                                  orange: 'text-orange-600',
                                  amber: 'text-amber-600',
                                  green: 'text-green-600',
                                  blue: 'text-blue-600',
                                  purple: 'text-purple-600',
                                  pink: 'text-pink-600',
                                };
                                
                                return (
                                  <td 
                                    key={day} 
                                    className={cn(
                                      "border border-border/50 p-2",
                                      colorClasses[typeColor] || colorClasses.red
                                    )}
                                  >
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex flex-col items-center justify-center gap-1 cursor-help">
                                          <AlertTriangle className={cn("w-4 h-4", textClasses[typeColor] || textClasses.red)} />
                                          <span className={cn("text-xs font-medium text-center line-clamp-2", textClasses[typeColor] || textClasses.red)}>
                                            {blockResult.blockName}
                                          </span>
                                          {examType && (
                                            <Badge variant="outline" className={cn("text-[10px]", textClasses[typeColor] || textClasses.red)}>
                                              {examType.name}
                                            </Badge>
                                          )}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="font-medium">{blockResult.blockName}</p>
                                        <p className="text-xs text-muted-foreground">No regular classes</p>
                                      </TooltipContent>
                                    </Tooltip>
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
                                    colors.bg,
                                    entry.isSubstituted && "bg-amber-50/50 dark:bg-amber-950/10"
                                  )}
                                >
                                  <div className="text-center">
                                    <div className={cn("font-medium text-sm", colors.text)}>
                                      {entry.subjectName}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {entry.isSubstituted ? (
                                        <span className="text-amber-600">
                                          {entry.substituteTeacherName?.split(' ').slice(-1)[0]} (Sub)
                                        </span>
                                      ) : (
                                        entry.teacherName.split(' ').slice(-1)[0]
                                      )}
                                    </div>
                                    {entry.facilityName && (
                                      <div className="text-[10px] text-muted-foreground mt-0.5">
                                        📍 {entry.facilityName}
                                      </div>
                                    )}
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