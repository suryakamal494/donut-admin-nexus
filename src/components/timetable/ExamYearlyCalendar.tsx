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
  getDay, addDays
} from "date-fns";
import { 
  ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock, 
  Building2, BookOpen, GraduationCap, Users, Edit2, Repeat, CalendarDays
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

// Gradient backgrounds for exam types
const TYPE_GRADIENTS: Record<string, string> = {
  red: 'from-red-500/10 to-red-600/5 border-red-200/50',
  orange: 'from-orange-500/10 to-orange-600/5 border-orange-200/50',
  amber: 'from-amber-500/10 to-amber-600/5 border-amber-200/50',
  green: 'from-green-500/10 to-green-600/5 border-green-200/50',
  blue: 'from-blue-500/10 to-blue-600/5 border-blue-200/50',
  purple: 'from-purple-500/10 to-purple-600/5 border-purple-200/50',
  pink: 'from-pink-500/10 to-pink-600/5 border-pink-200/50',
};

export const ExamYearlyCalendar = ({ 
  blocks, 
  examTypes = defaultExamTypes,
  onEdit 
}: ExamYearlyCalendarProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedExam, setSelectedExam] = useState<ExamBlock | null>(null);
  const [expandedMonths, setExpandedMonths] = useState<number[]>(() => [new Date().getMonth()]);

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
    
    while (getDay(current) !== targetDayIndex && current <= effectiveEnd) {
      current = addDays(current, 1);
    }
    
    while (current <= effectiveEnd) {
      dates.push(current);
      current = addDays(current, 7);
    }
    
    return dates;
  };

  const examsByMonth = useMemo(() => {
    const monthMap = new Map<number, ExamDisplay[]>();
    
    for (let i = 0; i < 12; i++) {
      monthMap.set(i, []);
    }
    
    blocks.filter(b => b.isActive).forEach(block => {
      if (block.dateType === 'recurring') {
        const dates = expandRecurringDates(block, selectedYear);
        
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

  // Only show months with exams
  const monthsWithExams = useMemo(() => {
    return MONTHS.map((name, index) => ({ name, index }))
      .filter(({ index }) => (examsByMonth.get(index) || []).length > 0);
  }, [examsByMonth]);

  const toggleMonth = (month: number) => {
    setExpandedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month)
        : [...prev, month]
    );
  };

  const getTypeColor = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'green': return 'bg-green-100 text-green-700 border-green-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pink': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeGradient = (color?: string) => {
    return TYPE_GRADIENTS[color || ''] || 'from-gray-500/10 to-gray-600/5 border-gray-200/50';
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

  const totalExams = monthsWithExams.reduce((sum, { index }) => 
    sum + (examsByMonth.get(index)?.length || 0), 0
  );

  return (
    <Card className="overflow-hidden">
      {/* Header with gradient */}
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {selectedYear} Exam Calendar
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {totalExams} exam{totalExams !== 1 ? 's' : ''} scheduled across {monthsWithExams.length} month{monthsWithExams.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-background"
              onClick={() => setSelectedYear(y => y - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold w-14 text-center">{selectedYear}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-background"
              onClick={() => setSelectedYear(y => y + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        {monthsWithExams.length === 0 ? (
          <div className="py-16 text-center">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium mb-2">No exams scheduled for {selectedYear}</h3>
            <p className="text-sm text-muted-foreground">
              Create an exam schedule to see it here
            </p>
          </div>
        ) : (
          monthsWithExams.map(({ name: monthName, index: monthIndex }) => {
            const monthExams = examsByMonth.get(monthIndex) || [];
            const isExpanded = expandedMonths.includes(monthIndex);
            
            return (
              <Collapsible
                key={monthIndex}
                open={isExpanded}
                onOpenChange={() => toggleMonth(monthIndex)}
              >
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all",
                      "bg-gradient-to-r from-primary/8 to-primary/3 hover:from-primary/12 hover:to-primary/5",
                      "border border-primary/10 hover:border-primary/20",
                      "shadow-sm hover:shadow-md"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {monthName.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-foreground">{monthName}</span>
                        <Badge variant="secondary" className="ml-2 text-xs bg-primary/10 text-primary border-0">
                          {monthExams.length} exam{monthExams.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 pb-1 px-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {monthExams.map((examDisplay, idx) => {
                      const examType = getExamType(examDisplay.block.examTypeId);
                      const ScopeIcon = getScopeIcon(examDisplay.block.scopeType);
                      
                      return (
                        <button
                          key={`${examDisplay.block.id}-${idx}`}
                          onClick={() => setSelectedExam(examDisplay.block)}
                          className={cn(
                            "flex flex-col gap-2 p-4 rounded-xl border transition-all text-left",
                            "bg-gradient-to-br hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                            getTypeGradient(examType?.color)
                          )}
                        >
                          {/* Date badge */}
                          <div className="flex items-center justify-between">
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs font-semibold", getTypeColor(examType?.color))}
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatExamDates(examDisplay.dates)}
                            </Badge>
                            {examDisplay.isRecurring && (
                              <Badge variant="outline" className="text-xs bg-background/50">
                                <Repeat className="w-3 h-3 mr-1" />
                                {examDisplay.dates.length}×
                              </Badge>
                            )}
                          </div>
                          
                          {/* Exam name */}
                          <h4 className="font-semibold text-sm line-clamp-1">
                            {examDisplay.block.name}
                          </h4>
                          
                          {/* Scope & Time */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ScopeIcon className="w-3.5 h-3.5" />
                            <span className="truncate">
                              {examDisplay.block.scopeName || scopeTypeConfig[examDisplay.block.scopeType].label}
                            </span>
                          </div>
                          
                          {/* Type badge */}
                          {examType && (
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs w-fit mt-auto", getTypeColor(examType.color))}
                            >
                              {examType.name}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })
        )}
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
                  <DialogTitle className="flex items-center gap-2 flex-wrap">
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
