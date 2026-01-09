import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Clock, CalendarRange, Users, ChevronDown, Search, CheckCircle2, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { weeklyChapterPlans, academicScheduleSetups, academicWeeks, currentWeekIndex } from "@/data/academicScheduleData";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Subject colors
const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  phy: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  che: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  mat: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  bio: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  eng: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  hin: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  sci: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  sst: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
};

// Batch info mapping
const BATCH_INFO: Record<string, { name: string; classId: string }> = {
  "batch-6a": { name: "Class 6 - Section A", classId: "1" },
  "batch-6b": { name: "Class 6 - Section B", classId: "1" },
  "batch-7a": { name: "Class 7 - Section A", classId: "2" },
  "batch-8a": { name: "Class 8 - Section A", classId: "3" },
  "batch-9a": { name: "Class 9 - Section A", classId: "4" },
  "batch-9b": { name: "Class 9 - Section B", classId: "4" },
  "batch-10a": { name: "Class 10 - Section A", classId: "5" },
  "batch-10b": { name: "Class 10 - Section B", classId: "5" },
  "batch-11a": { name: "Class 11 - Section A", classId: "6" },
  "jee-11": { name: "JEE Class 11", classId: "6" },
};

export default function ChapterDetail() {
  const [selectedSubject, setSelectedSubject] = useState("mat");
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBatches, setExpandedBatches] = useState<string[]>([]);

  // Get unique subjects from setups
  const subjects = useMemo(() => {
    const uniqueSubjects = new Map<string, string>();
    academicScheduleSetups.forEach(s => {
      if (!uniqueSubjects.has(s.subjectId)) {
        uniqueSubjects.set(s.subjectId, s.subjectName);
      }
    });
    return Array.from(uniqueSubjects, ([id, name]) => ({ id, name }));
  }, []);

  // Get all chapters for selected subject (across all classes)
  const allChapters = useMemo(() => {
    const chapters: { chapterId: string; chapterName: string; classId: string; className: string; plannedHours: number }[] = [];
    
    academicScheduleSetups
      .filter(s => s.subjectId === selectedSubject)
      .forEach(setup => {
        const classNames: Record<string, string> = {
          "1": "Class 6", "2": "Class 7", "3": "Class 8",
          "4": "Class 9", "5": "Class 10", "6": "Class 11", "7": "Class 12"
        };
        
        setup.chapters.forEach(ch => {
          chapters.push({
            ...ch,
            classId: setup.classId,
            className: classNames[setup.classId] || setup.classId,
          });
        });
      });
    
    return chapters.filter(ch => 
      searchQuery === "" || 
      ch.chapterName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedSubject, searchQuery]);

  // Group chapters by class
  const chaptersByClass = useMemo(() => {
    const grouped: Record<string, typeof allChapters> = {};
    allChapters.forEach(ch => {
      if (!grouped[ch.className]) {
        grouped[ch.className] = [];
      }
      grouped[ch.className].push(ch);
    });
    return grouped;
  }, [allChapters]);

  // Get selected chapter details
  const chapterDetails = useMemo(() => {
    if (!selectedChapter) return null;
    return allChapters.find(ch => ch.chapterId === selectedChapter);
  }, [selectedChapter, allChapters]);

  // Get batch-wise planning for selected chapter
  const batchPlanning = useMemo(() => {
    if (!selectedChapter || !chapterDetails) return [];

    // Find all batches that have this chapter planned
    const batches: {
      batchId: string;
      batchName: string;
      plannedWeeks: number[];
      status: 'completed' | 'in_progress' | 'pending' | 'not_planned';
    }[] = [];

    // Get all batches for the same class
    Object.entries(BATCH_INFO)
      .filter(([_, info]) => info.classId === chapterDetails.classId)
      .forEach(([batchId, info]) => {
        const plans = weeklyChapterPlans.filter(
          p => p.batchId === batchId && p.subjectId === selectedSubject && p.plannedChapters.includes(selectedChapter)
        );

        const plannedWeeks = plans.map(p => {
          const weekIdx = academicWeeks.findIndex(w => w.startDate === p.weekStartDate);
          return weekIdx + 1;
        });

        let status: 'completed' | 'in_progress' | 'pending' | 'not_planned' = 'not_planned';
        if (plannedWeeks.length > 0) {
          const maxWeek = Math.max(...plannedWeeks);
          const minWeek = Math.min(...plannedWeeks);
          
          if (maxWeek < currentWeekIndex + 1) {
            status = 'completed';
          } else if (minWeek <= currentWeekIndex + 1) {
            status = 'in_progress';
          } else {
            status = 'pending';
          }
        }

        batches.push({
          batchId,
          batchName: info.name,
          plannedWeeks,
          status,
        });
      });

    return batches;
  }, [selectedChapter, chapterDetails, selectedSubject]);

  const toggleBatchExpand = (batchId: string) => {
    setExpandedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(id => id !== batchId)
        : [...prev, batchId]
    );
  };

  const subjectColors = SUBJECT_COLORS[selectedSubject] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Chapter Details"
        description="Deep dive into chapter planning across batches"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Chapter Detail" },
        ]}
      />

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left: Chapter Selector */}
        <div className="lg:col-span-1 space-y-4">
          {/* Subject Selector */}
          <Card className="p-4">
            <label className="text-xs text-muted-foreground mb-2 block">Subject</label>
            <Select value={selectedSubject} onValueChange={(v) => { setSelectedSubject(v); setSelectedChapter(null); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Chapter Search & List */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 px-4 py-3 bg-muted/30 border-b">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                {Object.entries(chaptersByClass).map(([className, chapters]) => (
                  <Collapsible key={className} defaultOpen>
                    <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2 bg-muted/20 hover:bg-muted/40 transition-colors border-b">
                      <span className="text-sm font-medium">{className}</span>
                      <ChevronDown className="w-4 h-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {chapters.map((ch, idx) => (
                        <button
                          key={ch.chapterId}
                          onClick={() => setSelectedChapter(ch.chapterId)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 border-b last:border-b-0 transition-colors",
                            selectedChapter === ch.chapterId
                              ? cn(subjectColors.bg, "border-l-2 border-l-primary")
                              : "hover:bg-muted/30"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] px-1.5 shrink-0">
                              {idx + 1}
                            </Badge>
                            <span className="text-sm truncate">{ch.chapterName}</span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-6">{ch.plannedHours}h</span>
                        </button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}

                {allChapters.length === 0 && (
                  <div className="p-8 text-center">
                    <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">No chapters found</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right: Chapter Detail */}
        <div className="lg:col-span-2 space-y-4">
          {chapterDetails ? (
            <>
              {/* Chapter Summary Card */}
              <Card className={cn("p-6", subjectColors.bg, subjectColors.border, "border")}>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className={cn("mb-2", subjectColors.text, "bg-white/50")}>
                      {chapterDetails.className}
                    </Badge>
                    <h2 className={cn("text-xl font-bold", subjectColors.text)}>
                      {chapterDetails.chapterName}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {subjects.find(s => s.id === selectedSubject)?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-2xl font-bold">{chapterDetails.plannedHours}</span>
                      <span className="text-sm">hours</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 text-center">
                  <Users className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-2xl font-bold">{batchPlanning.length}</p>
                  <p className="text-xs text-muted-foreground">Batches</p>
                </Card>
                <Card className="p-4 text-center">
                  <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                  <p className="text-2xl font-bold text-emerald-600">
                    {batchPlanning.filter(b => b.status === 'completed').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </Card>
                <Card className="p-4 text-center">
                  <Loader2 className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                  <p className="text-2xl font-bold text-amber-600">
                    {batchPlanning.filter(b => b.status === 'in_progress').length}
                  </p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </Card>
              </div>

              {/* Batch-wise Planning */}
              <Card>
                <CardHeader className="pb-2 px-4 py-3 bg-muted/30 border-b">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CalendarRange className="w-4 h-4" />
                    Batch-wise Planning
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {batchPlanning.length > 0 ? (
                    <div className="divide-y">
                      {batchPlanning.map(batch => (
                        <div 
                          key={batch.batchId}
                          className="px-4 py-3 hover:bg-muted/5 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                                <Users className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{batch.batchName}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {batch.plannedWeeks.length > 0 ? (
                                    <>
                                      <CalendarRange className="w-3 h-3" />
                                      <span>
                                        Week {Math.min(...batch.plannedWeeks)}
                                        {batch.plannedWeeks.length > 1 && `-${Math.max(...batch.plannedWeeks)}`}
                                      </span>
                                    </>
                                  ) : (
                                    <span>Not scheduled</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={cn(
                                "text-xs",
                                batch.status === 'completed' && "bg-emerald-100 text-emerald-700",
                                batch.status === 'in_progress' && "bg-amber-100 text-amber-700",
                                batch.status === 'pending' && "bg-blue-100 text-blue-700",
                                batch.status === 'not_planned' && "bg-gray-100 text-gray-500"
                              )}
                            >
                              {batch.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {batch.status === 'in_progress' && <Loader2 className="w-3 h-3 mr-1" />}
                              {batch.status === 'pending' && <Circle className="w-3 h-3 mr-1" />}
                              {batch.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Users className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">No batches found for this chapter</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Section Comparison Visual */}
              {batchPlanning.length > 1 && (
                <Card className="p-4">
                  <h3 className="text-sm font-medium mb-4">Section Comparison</h3>
                  <div className="space-y-2">
                    {batchPlanning.map(batch => (
                      <div key={batch.batchId} className="flex items-center gap-2">
                        <span className="text-xs w-32 truncate">{batch.batchName}</span>
                        <div className="flex-1 flex gap-0.5">
                          {Array.from({ length: 8 }, (_, i) => {
                            const weekNum = i + 1;
                            const isPlanned = batch.plannedWeeks.includes(weekNum);
                            return (
                              <div 
                                key={i}
                                className={cn(
                                  "h-4 flex-1 rounded-sm transition-colors",
                                  isPlanned 
                                    ? batch.status === 'completed' 
                                      ? "bg-emerald-500" 
                                      : batch.status === 'in_progress'
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                    : "bg-muted/30"
                                )}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground px-32">
                    <span>W1</span>
                    <span>W4</span>
                    <span>W8</span>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">Select a Chapter</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a chapter from the list to view its planning details across batches
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
