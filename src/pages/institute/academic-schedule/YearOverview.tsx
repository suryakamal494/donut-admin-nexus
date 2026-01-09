import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarRange, BookOpen, Clock, TrendingUp, ChevronRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { weeklyChapterPlans, academicScheduleSetups, academicWeeks, currentWeekIndex } from "@/data/academicScheduleData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

// Subject colors
const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string; solid: string }> = {
  phy: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", solid: "bg-blue-500" },
  che: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", solid: "bg-emerald-500" },
  mat: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", solid: "bg-purple-500" },
  bio: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", solid: "bg-green-500" },
  eng: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", solid: "bg-orange-500" },
  hin: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", solid: "bg-red-500" },
  sci: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", solid: "bg-teal-500" },
  sst: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", solid: "bg-indigo-500" },
  eco: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", solid: "bg-yellow-500" },
  cs: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", solid: "bg-cyan-500" },
};

// Batch options
const BATCH_OPTIONS = [
  { id: "batch-6a", name: "Class 6 - Section A", classId: "1" },
  { id: "batch-7a", name: "Class 7 - Section A", classId: "2" },
  { id: "batch-8a", name: "Class 8 - Section A", classId: "3" },
  { id: "batch-9a", name: "Class 9 - Section A", classId: "4" },
  { id: "batch-10a", name: "Class 10 - Section A", classId: "5" },
  { id: "batch-11a", name: "Class 11 - Section A", classId: "6" },
  { id: "jee-11", name: "JEE Class 11", classId: "6" },
];

export default function YearOverview() {
  const [selectedBatch, setSelectedBatch] = useState("batch-9a");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const batch = BATCH_OPTIONS.find(b => b.id === selectedBatch);

  // Get available subjects for this batch from setup
  const availableSubjects = useMemo(() => {
    const subjects = academicScheduleSetups
      .filter(s => s.classId === batch?.classId)
      .map(s => ({ id: s.subjectId, name: s.subjectName }));
    return subjects;
  }, [batch]);

  // Auto-select first subject if none selected
  const activeSubject = selectedSubject || availableSubjects[0]?.id;

  // Get setup for selected subject
  const subjectSetup = useMemo(() => {
    return academicScheduleSetups.find(
      s => s.classId === batch?.classId && s.subjectId === activeSubject
    );
  }, [batch, activeSubject]);

  // Build chapter timeline data
  const chapterTimeline = useMemo(() => {
    if (!subjectSetup) return [];

    return subjectSetup.chapters.map(chapter => {
      // Find all weeks where this chapter is planned
      const plannedWeeks: number[] = [];
      
      weeklyChapterPlans.forEach(plan => {
        if (plan.batchId === selectedBatch && plan.subjectId === activeSubject) {
          if (plan.plannedChapters.includes(chapter.chapterId)) {
            const weekIdx = academicWeeks.findIndex(w => w.startDate === plan.weekStartDate);
            if (weekIdx >= 0) {
              plannedWeeks.push(weekIdx + 1);
            }
          }
        }
      });

      // Determine status
      let status: 'completed' | 'in_progress' | 'planned' | 'not_planned' = 'not_planned';
      if (plannedWeeks.length > 0) {
        const maxWeek = Math.max(...plannedWeeks);
        const minWeek = Math.min(...plannedWeeks);
        
        if (maxWeek < currentWeekIndex + 1) {
          status = 'completed';
        } else if (minWeek <= currentWeekIndex + 1) {
          status = 'in_progress';
        } else {
          status = 'planned';
        }
      }

      return {
        ...chapter,
        plannedWeeks,
        startWeek: plannedWeeks.length > 0 ? Math.min(...plannedWeeks) : null,
        endWeek: plannedWeeks.length > 0 ? Math.max(...plannedWeeks) : null,
        status,
      };
    });
  }, [subjectSetup, selectedBatch, activeSubject]);

  // Calculate totals
  const totalPlannedHours = subjectSetup?.totalPlannedHours || 0;
  const totalWeeksUsed = new Set(chapterTimeline.flatMap(c => c.plannedWeeks)).size;
  const completedChapters = chapterTimeline.filter(c => c.status === 'completed').length;
  const progressPercent = subjectSetup ? Math.round((completedChapters / subjectSetup.chapters.length) * 100) : 0;

  // Display weeks range
  const displayWeeks = 12; // Show 12 weeks

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Academic Year Overview"
        description="Chapter distribution across the academic year"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Year Overview" },
        ]}
      />

      {/* Controls */}
      <Card className="p-3 md:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Batch Selector */}
          <div className="w-full sm:w-auto">
            <label className="text-xs text-muted-foreground mb-1 block">Batch</label>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-full sm:w-[200px] h-9">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {BATCH_OPTIONS.map(b => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Chips */}
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Subject</label>
            <div className="flex flex-wrap gap-2">
              {availableSubjects.map(subject => {
                const colors = SUBJECT_COLORS[subject.id] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
                const isSelected = activeSubject === subject.id;
                
                return (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                      isSelected ? "ring-2 ring-primary ring-offset-1" : "",
                      colors.bg, colors.text, colors.border
                    )}
                  >
                    {subject.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs">Total Chapters</span>
          </div>
          <p className="text-2xl font-bold">{subjectSetup?.chapters.length || 0}</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-transparent">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Planned Hours</span>
          </div>
          <p className="text-2xl font-bold">{totalPlannedHours}h</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CalendarRange className="w-4 h-4" />
            <span className="text-xs">Weeks Covered</span>
          </div>
          <p className="text-2xl font-bold">{totalWeeksUsed}</p>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-transparent">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold">{progressPercent}%</p>
            <Progress value={progressPercent} className="flex-1 h-2" />
          </div>
        </Card>
      </div>

      {/* Chapter Timeline */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 px-4 py-3 bg-muted/30 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Chapter Timeline
            </CardTitle>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-amber-500" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span>Planned</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[700px]">
              {/* Week Header */}
              <div className="flex border-b bg-muted/10 sticky top-0 z-10">
                <div className="w-[200px] shrink-0 p-3 font-medium text-xs text-muted-foreground border-r">
                  Chapter
                </div>
                <div className="flex-1 flex">
                  {Array.from({ length: displayWeeks }, (_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "flex-1 p-2 text-center text-xs border-r last:border-r-0 min-w-[50px]",
                        i + 1 === currentWeekIndex + 1 && "bg-primary/10 font-medium"
                      )}
                    >
                      W{i + 1}
                    </div>
                  ))}
                </div>
                <div className="w-[80px] shrink-0 p-2 text-center text-xs text-muted-foreground border-l">
                  Hours
                </div>
              </div>

              {/* Chapter Rows */}
              {chapterTimeline.map((chapter, idx) => (
                <div key={chapter.chapterId} className="flex border-b last:border-b-0 hover:bg-muted/5 transition-colors">
                  {/* Chapter Name */}
                  <div className="w-[200px] shrink-0 p-3 border-r">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0 text-[10px] px-1.5 py-0">
                        {idx + 1}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-sm font-medium truncate cursor-default">
                              {chapter.chapterName.length > 18 ? chapter.chapterName.slice(0, 18) + '...' : chapter.chapterName}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{chapter.chapterName}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 flex relative">
                    {Array.from({ length: displayWeeks }, (_, i) => {
                      const weekNum = i + 1;
                      const isPlanned = chapter.plannedWeeks.includes(weekNum);
                      const isStart = chapter.startWeek === weekNum;
                      const isEnd = chapter.endWeek === weekNum;
                      const isCurrentWeek = weekNum === currentWeekIndex + 1;
                      
                      return (
                        <div 
                          key={i}
                          className={cn(
                            "flex-1 min-w-[50px] p-1 border-r last:border-r-0 relative",
                            isCurrentWeek && "bg-primary/5"
                          )}
                        >
                          {isPlanned && (
                            <div 
                              className={cn(
                                "h-6 transition-all",
                                chapter.status === 'completed' && "bg-emerald-500",
                                chapter.status === 'in_progress' && "bg-amber-500",
                                chapter.status === 'planned' && "bg-blue-500",
                                isStart && "rounded-l-md",
                                isEnd && "rounded-r-md"
                              )}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Hours */}
                  <div className="w-[80px] shrink-0 p-2 text-center border-l flex items-center justify-center">
                    <span className="text-sm font-medium">{chapter.plannedHours}h</span>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {chapterTimeline.length === 0 && (
                <div className="p-12 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-medium text-muted-foreground">No chapters configured</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set up chapter allocations in the Setup page
                  </p>
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chapter List (Mobile Friendly) */}
      <div className="md:hidden space-y-2">
        <h3 className="text-sm font-medium px-1">Chapters</h3>
        {chapterTimeline.map((chapter, idx) => (
          <Card key={chapter.chapterId} className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="shrink-0 text-xs">
                    Ch {idx + 1}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      chapter.status === 'completed' && "bg-emerald-100 text-emerald-700",
                      chapter.status === 'in_progress' && "bg-amber-100 text-amber-700",
                      chapter.status === 'planned' && "bg-blue-100 text-blue-700",
                      chapter.status === 'not_planned' && "bg-gray-100 text-gray-500"
                    )}
                  >
                    {chapter.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm font-medium mt-1 truncate">{chapter.chapterName}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {chapter.plannedHours}h
                  </span>
                  {chapter.startWeek && (
                    <span className="flex items-center gap-1">
                      <CalendarRange className="w-3 h-3" />
                      Week {chapter.startWeek}{chapter.endWeek !== chapter.startWeek && `-${chapter.endWeek}`}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
