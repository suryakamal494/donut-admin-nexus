import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExamBlock, ExamType, scopeTypeConfig } from "@/types/examBlock";
import { defaultExamTypes } from "@/data/examBlockData";
import { cn } from "@/lib/utils";
import { 
  format, parseISO, getMonth, getYear, startOfYear, endOfYear, 
  eachDayOfInterval, getDay, addDays, isSameMonth, startOfMonth, endOfMonth
} from "date-fns";
import { 
  ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock, 
  Building2, BookOpen, GraduationCap, Users, Edit2, Repeat
} from "lucide-react";

interface ExamYearlyCalendarProps {
  blocks: ExamBlock[];
  examTypes?: ExamType[];
  onEdit: (block: ExamBlock) => void;
}

interface ExamDisplay {
  block: ExamBlock;
  dates: Date[];
  isRecurring: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_MAP: Record<string, number> = {
  'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
  'Thursday': 4, 'Friday': 5, 'Saturday': 6
};

export const ExamYearlyCalendar = ({ 
  blocks, 
  examTypes = defaultExamTypes,
  onEdit 
}: ExamYearlyCalendarProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedExam, setSelectedExam] = useState<ExamBlock | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<number[]>(() => {
    // Auto-expand current month
    return [new Date().getMonth()];
  });

  // Expand recurring dates within a year
  const expandRecurringDates = (block: ExamBlock, year: number): Date[] => {
    if (!block.recurringConfig) return [];
    
    const { dayOfWeek, startDate, endDate } = block.recurringConfig;
    const targetDayIndex = DAY_MAP[dayOfWeek];
    
    const rangeStart = parseISO(startDate);
    const rangeEnd = parseISO(endDate);
    const yearStart = startOfYear(new Date(year, 0));
    const yearEnd = endOfYear(new Date(year, 0));
    
    const effectiveStart = rangeStart > yearStart ? rangeStart : yearStart;
    const effectiveEnd = rangeEnd < yearEnd ? rangeEnd : yearEnd;
    
    if (effectiveStart > effectiveEnd) return [];
    
    const dates: Date[] = [];
    let current = effectiveStart;
    
    // Find first occurrence
    while (getDay(current) !== targetDayIndex && current <= effectiveEnd) {
      current = addDays(current, 1);
    }
    
    // Collect all occurrences
    while (current <= effectiveEnd) {
      dates.push(current);
      current = addDays(current, 7);
    }
    
    return dates;
  };

  // Group exams by month
  const examsByMonth = useMemo(() => {
    const monthMap = new Map<number, ExamDisplay[]>();
    
    // Initialize all months
    for (let i = 0; i < 12; i++) {
      monthMap.set(i, []);
    }
    
    blocks.filter(b => b.isActive).forEach(block => {
      if (block.dateType === 'recurring') {
        const dates = expandRecurringDates(block, selectedYear);
        
        // Group by month
        const monthsWithDates = new Map<number, Date[]>();
        dates.forEach(date => {
          const month = getMonth(date);
          if (!monthsWithDates.has(month)) {
            monthsWithDates.set(month, []);
          }
          monthsWithDates.get(month)!.push(date);
        });
        
        monthsWithDates.forEach((monthDates, month) => {
          monthMap.get(month)!.push({
            block,
            dates: monthDates,
            isRecurring: true
          });
        });
      } else {
        // Single or multi-day
        block.dates.forEach(dateStr => {
          const date = parseISO(dateStr);
          if (getYear(date) === selectedYear) {
            const month = getMonth(date);
            const existing = monthMap.get(month)!.find(e => e.block.id === block.id);
            if (existing) {
              existing.dates.push(date);
            } else {
              monthMap.get(month)!.push({
                block,
                dates: [date],
                isRecurring: false
              });
            }
          }
        });
      }
    });
    
    return monthMap;
  }, [blocks, selectedYear]);

  const toggleMonth = (month: number) => {
    setExpandedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const getTypeColor = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
      case 'green': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400';
      case 'pink': return 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getExamType = (typeId: string) => examTypes.find(t => t.id === typeId);

  const getScopeIcon = (scopeType: string) => {
    switch (scopeType) {
      case 'institution': return Building2;
      case 'course': return BookOpen;
      case 'class': return GraduationCap;
      case 'batch': return Users;
      default: return Users;
    }
  };

  const formatExamDates = (dates: Date[]) => {
    if (dates.length === 1) {
      return format(dates[0], 'd');
    }
    if (dates.length <= 3) {
      return dates.map(d => format(d, 'd')).join(', ');
    }
    return `${dates.length} days`;
  };

  const formatBlockTime = (block: ExamBlock) => {
    if (block.timeType === 'full_day') return 'Full Day';
    if (block.timeType === 'time_range') return `${block.startTime} - ${block.endTime}`;
    if (block.timeType === 'periods' && block.periods) return `Period ${block.periods.join(', ')}`;
    return '';
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {selectedYear} Exam Calendar
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setSelectedYear(y => y - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{selectedYear}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setSelectedYear(y => y + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {MONTHS.map((monthName, monthIndex) => {
          const monthExams = examsByMonth.get(monthIndex) || [];
          const isExpanded = expandedMonths.includes(monthIndex);
          const hasExams = monthExams.length > 0;
          
          return (
            <Collapsible
              key={monthIndex}
              open={isExpanded}
              onOpenChange={() => toggleMonth(monthIndex)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left",
                    hasExams 
                      ? "bg-muted/50 hover:bg-muted" 
                      : "bg-muted/20 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{monthName}</span>
                    {hasExams && (
                      <Badge variant="secondary" className="text-xs">
                        {monthExams.length} exam{monthExams.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    isExpanded && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 pb-1 px-2">
                {hasExams ? (
                  <div className="flex flex-wrap gap-2">
                    {monthExams.map((examDisplay, idx) => {
                      const examType = getExamType(examDisplay.block.examTypeId);
                      const ScopeIcon = getScopeIcon(examDisplay.block.scopeType);
                      
                      return (
                        <button
                          key={`${examDisplay.block.id}-${idx}`}
                          onClick={() => setSelectedExam(examDisplay.block)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-sm",
                            getTypeColor(examType?.color)
                          )}
                        >
                          {examDisplay.isRecurring && (
                            <Repeat className="w-3.5 h-3.5 opacity-70" />
                          )}
                          <span className="text-xs font-medium">
                            {formatExamDates(examDisplay.dates)}
                          </span>
                          <span className="text-xs font-semibold truncate max-w-[150px]">
                            {examDisplay.block.name}
                          </span>
                          {examDisplay.block.scopeName && (
                            <span className="text-[10px] opacity-70 flex items-center gap-0.5">
                              <ScopeIcon className="w-3 h-3" />
                              {examDisplay.block.scopeName}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2 px-2">
                    No exams scheduled
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>

      {/* Exam Detail Dialog */}
      <Dialog open={!!selectedExam} onOpenChange={(open) => !open && setSelectedExam(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedExam && (() => {
            const examType = getExamType(selectedExam.examTypeId);
            const ScopeIcon = getScopeIcon(selectedExam.scopeType);
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedExam.name}
                    {examType && (
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getTypeColor(examType.color))}
                      >
                        {examType.name}
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedExam.description || "No description provided"}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <ScopeIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Scope:</span>
                    <span>{selectedExam.scopeName || scopeTypeConfig[selectedExam.scopeType].label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {selectedExam.dateType === 'recurring' ? (
                      <Repeat className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">Dates:</span>
                    <span>
                      {selectedExam.dateType === 'recurring' 
                        ? `Every ${selectedExam.recurringConfig?.dayOfWeek}` 
                        : selectedExam.dates.map(d => format(parseISO(d), 'MMM d')).join(', ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Time:</span>
                    <span>{formatBlockTime(selectedExam)}</span>
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button onClick={() => {
                    onEdit(selectedExam);
                    setSelectedExam(null);
                  }} className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Exam Schedule
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
