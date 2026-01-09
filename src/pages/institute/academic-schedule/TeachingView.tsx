import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar, BookOpen, User, Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { timetableEntries, defaultPeriodStructure } from "@/data/timetableData";
import { weeklyChapterPlans, academicScheduleSetups, academicWeeks, currentWeekIndex } from "@/data/academicScheduleData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Subject colors for consistent branding
const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  phy: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  che: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  mat: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  bio: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  eng: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  hin: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  sci: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  sst: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  eco: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  cs: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
};

// Batch options
const BATCH_OPTIONS = [
  { id: "batch-1", name: "Class 10 - Section A", classId: "5" },
  { id: "batch-2", name: "Class 10 - Section B", classId: "5" },
  { id: "batch-3", name: "Class 9 - Section A", classId: "4" },
  { id: "batch-6a", name: "Class 6 - Section A", classId: "1" },
  { id: "batch-7a", name: "Class 7 - Section A", classId: "2" },
  { id: "batch-9a", name: "Class 9 - Section A", classId: "4" },
  { id: "batch-10a", name: "Class 10 - Section A", classId: "5" },
  { id: "batch-11a", name: "Class 11 - Section A", classId: "6" },
];

// Content component for use in tabs
export function TeachingViewContent() {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(currentWeekIndex);
  const [selectedBatch, setSelectedBatch] = useState("batch-1");

  const selectedWeek = academicWeeks[selectedWeekIndex];
  const workingDays = defaultPeriodStructure.workingDays;
  const periods = defaultPeriodStructure.timeMapping;
  const breaks = defaultPeriodStructure.breaks;

  // Get weekly chapter plans for this batch/week
  const weekPlans = useMemo(() => {
    return weeklyChapterPlans.filter(
      plan => plan.batchId === selectedBatch && plan.weekStartDate === selectedWeek.startDate
    );
  }, [selectedBatch, selectedWeek]);

  // Build a mapping of subjectId → chapter name for overlay
  const subjectToChapter = useMemo(() => {
    const mapping: Record<string, string> = {};
    
    weekPlans.forEach(plan => {
      if (plan.plannedChapters.length > 0) {
        // Find chapter name from setup
        const setup = academicScheduleSetups.find(s => s.subjectId === plan.subjectId);
        if (setup) {
          const chapterNames = plan.plannedChapters
            .map(chId => setup.chapters.find(ch => ch.chapterId === chId)?.chapterName)
            .filter(Boolean);
          if (chapterNames.length > 0) {
            mapping[plan.subjectId] = chapterNames.length > 1 
              ? `${chapterNames[0]} +${chapterNames.length - 1}` 
              : chapterNames[0] || '';
          }
        }
      }
    });
    
    return mapping;
  }, [weekPlans]);

  // Filter timetable entries for selected batch
  const batchTimetable = useMemo(() => {
    return timetableEntries.filter(entry => entry.batchId === selectedBatch);
  }, [selectedBatch]);

  // Get entry for a specific day/period
  const getEntry = (day: string, period: number) => {
    return batchTimetable.find(e => e.day === day && e.periodNumber === period);
  };

  // Check if period is a break
  const isBreakAfter = (period: number) => {
    return breaks.some(b => b.afterPeriod === period);
  };

  const getBreakInfo = (period: number) => {
    return breaks.find(b => b.afterPeriod === period);
  };

  // Get unique chapters for legend
  const activeChapters = useMemo(() => {
    const chapters: { subjectId: string; subjectName: string; chapterName: string }[] = [];
    
    weekPlans.forEach(plan => {
      if (plan.plannedChapters.length > 0) {
        const setup = academicScheduleSetups.find(s => s.subjectId === plan.subjectId);
        if (setup) {
          plan.plannedChapters.forEach(chId => {
            const chapter = setup.chapters.find(ch => ch.chapterId === chId);
            if (chapter) {
              chapters.push({
                subjectId: plan.subjectId,
                subjectName: plan.subjectName,
                chapterName: chapter.chapterName,
              });
            }
          });
        }
      }
    });
    
    return chapters;
  }, [weekPlans]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedWeekIndex > 0) {
      setSelectedWeekIndex(prev => prev - 1);
    } else if (direction === 'next' && selectedWeekIndex < academicWeeks.length - 1) {
      setSelectedWeekIndex(prev => prev + 1);
    }
  };

  const isPastWeek = selectedWeekIndex < currentWeekIndex;
  const isCurrentWeek = selectedWeekIndex === currentWeekIndex;

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <Card className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Batch Selector */}
          <div className="w-full sm:w-auto">
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-full sm:w-[220px] h-9">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {BATCH_OPTIONS.map(batch => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Week Navigator */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigateWeek('prev')}
              disabled={selectedWeekIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg min-w-[180px] justify-center">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Week {selectedWeek.weekNumber}
              </span>
              <Badge 
                variant={isCurrentWeek ? "default" : isPastWeek ? "secondary" : "outline"}
                className="text-xs"
              >
                {isCurrentWeek ? "Current" : isPastWeek ? "Past" : "Upcoming"}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigateWeek('next')}
              disabled={selectedWeekIndex === academicWeeks.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Week Date Range */}
          <div className="text-xs text-muted-foreground hidden lg:block">
            {new Date(selectedWeek.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {new Date(selectedWeek.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </Card>

      {/* Chapter Legend */}
      {activeChapters.length > 0 && (
        <Card className="p-3 md:p-4 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Chapters This Week</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeChapters.map((ch, idx) => {
              const colors = SUBJECT_COLORS[ch.subjectId] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
              return (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs font-normal cursor-default",
                          colors.bg, colors.text, colors.border
                        )}
                      >
                        <BookOpen className="w-3 h-3 mr-1" />
                        {ch.chapterName.length > 25 ? ch.chapterName.slice(0, 25) + '...' : ch.chapterName}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{ch.subjectName}</p>
                      <p className="text-xs">{ch.chapterName}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </Card>
      )}

      {/* Timetable Grid */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 px-4 py-3 bg-muted/30 border-b">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Weekly Timetable with Chapter Overlay
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid border-b bg-muted/20" style={{ gridTemplateColumns: `80px repeat(${workingDays.length}, 1fr)` }}>
                <div className="p-3 font-medium text-xs text-muted-foreground border-r">
                  Period
                </div>
                {workingDays.map(day => (
                  <div key={day} className="p-3 font-medium text-sm text-center border-r last:border-r-0">
                    {day.slice(0, 3)}
                  </div>
                ))}
              </div>

              {/* Period Rows */}
              {periods.map((period, idx) => (
                <div key={period.period}>
                  {/* Period Row */}
                  <div 
                    className="grid border-b hover:bg-muted/10 transition-colors" 
                    style={{ gridTemplateColumns: `80px repeat(${workingDays.length}, 1fr)` }}
                  >
                    {/* Period Label */}
                    <div className="p-2 border-r bg-muted/10 flex flex-col justify-center">
                      <span className="text-xs font-medium">P{period.period}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {period.startTime}
                      </span>
                    </div>

                    {/* Day Cells */}
                    {workingDays.map(day => {
                      const entry = getEntry(day, period.period);
                      const chapterName = entry ? subjectToChapter[entry.subjectId] : null;
                      const colors = entry ? (SUBJECT_COLORS[entry.subjectId] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" }) : null;

                      return (
                        <div key={day} className="p-1.5 border-r last:border-r-0 min-h-[80px]">
                          {entry ? (
                            <div 
                              className={cn(
                                "h-full rounded-lg p-2 transition-all",
                                colors?.bg,
                                colors?.border,
                                "border",
                                chapterName && "ring-2 ring-primary/20"
                              )}
                            >
                              {/* Subject */}
                              <div className={cn("font-medium text-xs", colors?.text)}>
                                {entry.subjectName}
                              </div>
                              
                              {/* Teacher */}
                              <div className="flex items-center gap-1 mt-0.5">
                                <User className="w-3 h-3 text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground truncate">
                                  {entry.teacherName || 'TBA'}
                                </span>
                              </div>

                              {/* Chapter Overlay */}
                              {chapterName && (
                                <div className="mt-1.5 pt-1.5 border-t border-dashed border-current/20">
                                  <div className="flex items-start gap-1">
                                    <BookOpen className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                                    <span className="text-[10px] text-primary font-medium line-clamp-2">
                                      {chapterName}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Lab/Facility Indicator */}
                              {entry.periodType && entry.periodType !== 'regular' && (
                                <Badge variant="secondary" className="mt-1 text-[9px] px-1 py-0">
                                  {entry.periodType}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <div className="h-full rounded-lg bg-muted/20 flex items-center justify-center">
                              <span className="text-xs text-muted-foreground/50">—</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Break Row */}
                  {isBreakAfter(period.period) && (
                    <div 
                      className="grid border-b bg-amber-50/50" 
                      style={{ gridTemplateColumns: `80px repeat(${workingDays.length}, 1fr)` }}
                    >
                      <div className="p-1.5 text-center col-span-full">
                        <span className="text-xs text-amber-600 font-medium">
                          ☕ {getBreakInfo(period.period)?.name} ({getBreakInfo(period.period)?.duration} min)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* No Plans Message */}
      {weekPlans.length === 0 && (
        <Card className="p-8 text-center bg-muted/20">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-medium text-muted-foreground">No chapter plans for this week</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add weekly chapter mappings in the Weekly Plans section
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/institute/academic-schedule/plans'}>
            Go to Weekly Plans
          </Button>
        </Card>
      )}
    </div>
  );
}

// Full page component for direct URL access
export default function TeachingView() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Condensed Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Weekly Teaching Plan"
          description="Timetable view with chapter overlays"
          breadcrumbs={[
            { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
            { label: "Teaching View" },
          ]}
        />
      </div>
      <TeachingViewContent />
    </div>
  );
}
