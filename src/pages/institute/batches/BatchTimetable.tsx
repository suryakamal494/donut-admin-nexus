import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Printer,
  CalendarOff
} from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isToday } from "date-fns";
import { timetableEntries, defaultPeriodStructure, subjectColors } from "@/data/timetableData";
import { batches } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { Holiday } from "@/components/timetable/HolidayCalendarDialog";
import { academicHolidays } from "@/data/timetableData";

const defaultHolidays: Holiday[] = academicHolidays.map(h => ({
  date: h.date,
  name: h.name
}));

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const BatchTimetable = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays] = useState<Holiday[]>(defaultHolidays);

  const batch = batches.find(b => b.id === batchId);

  // Get week boundaries
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Filter entries for this batch only
  const batchEntries = useMemo(() => {
    return timetableEntries.filter(e => e.batchId === batchId);
  }, [batchId]);

  // Get entry for a specific day and period
  const getEntry = (day: string, period: number) => {
    return batchEntries.find(e => e.day === day && e.periodNumber === period);
  };

  // Check if a date is a holiday
  const getHoliday = (date: Date): Holiday | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return holidays.find(h => h.date === dateStr);
  };

  // Navigation handlers
  const goToPrevious = () => setCurrentDate(prev => subWeeks(prev, 1));
  const goToNext = () => setCurrentDate(prev => addWeeks(prev, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Print handler
  const handlePrint = () => window.print();

  const workingDays = defaultPeriodStructure.workingDays;

  if (!batch) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold mb-2">Batch not found</h2>
        <Button variant="outline" onClick={() => navigate("/institute/batches")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Batches
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${batch.className} - ${batch.name} Timetable`}
        description="View the weekly timetable for this batch"
        breadcrumbs={[
          { label: "Batches", href: "/institute/batches" },
          { label: `${batch.className} - ${batch.name}`, href: `/institute/batches/${batchId}` },
          { label: "Timetable" },
        ]}
      />

      {/* Navigation Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPrevious}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="min-w-[200px] text-center font-medium">
                  {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                </div>
                <Button variant="outline" size="icon" onClick={goToNext}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={goToToday}>
                <CalendarIcon className="w-4 h-4 mr-2" />
                This Week
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {batchEntries.length} scheduled periods
              </Badge>
              <Button variant="outline" onClick={handlePrint} className="print:hidden">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Grid */}
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
                  const isBreakAfterThis = defaultPeriodStructure.breaks.some(b => b.afterPeriod === period);
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

      {/* Subject Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(subjectColors).map(([subjectId, colors]) => {
              const hasSubject = batchEntries.some(e => e.subjectId === subjectId);
              if (!hasSubject) return null;
              const subjectName = batchEntries.find(e => e.subjectId === subjectId)?.subjectName || subjectId;
              return (
                <Badge 
                  key={subjectId}
                  variant="outline" 
                  className={cn("text-xs", colors.bg, colors.text, colors.border)}
                >
                  {subjectName}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          [class*="space-y-6"] { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; }
          [class*="space-y-6"] * { visibility: visible; }
        }
      `}</style>
    </div>
  );
};

export default BatchTimetable;
