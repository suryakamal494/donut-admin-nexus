import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Plus,
  Check,
  Layers,
  Eye,
  ChevronLeft,
  Lock,
} from "lucide-react";
import { WeekNavigator, BatchPlanAccordion } from "@/components/academic-schedule";
import { weeklyChapterPlans, academicWeeks, currentWeekIndex, academicScheduleSetups } from "@/data/academicScheduleData";
import { batches } from "@/data/instituteData";
import { WeeklyChapterPlan, ChapterHourAllocation } from "@/types/academicSchedule";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Subject configuration based on class level
const getSubjectsForClass = (classId: string): { subjectId: string; subjectName: string }[] => {
  const classNum = parseInt(classId.replace("class-", ""));
  
  if (classNum >= 6 && classNum <= 8) {
    return [
      { subjectId: "mat", subjectName: "Mathematics" },
      { subjectId: "sci", subjectName: "Science" },
      { subjectId: "eng", subjectName: "English" },
      { subjectId: "hin", subjectName: "Hindi" },
      { subjectId: "sst", subjectName: "Social Studies" },
    ];
  }
  
  if (classNum >= 9 && classNum <= 10) {
    return [
      { subjectId: "phy", subjectName: "Physics" },
      { subjectId: "che", subjectName: "Chemistry" },
      { subjectId: "mat", subjectName: "Mathematics" },
      { subjectId: "bio", subjectName: "Biology" },
      { subjectId: "eng", subjectName: "English" },
      { subjectId: "hin", subjectName: "Hindi" },
      { subjectId: "sst", subjectName: "Social Studies" },
    ];
  }
  
  if (classNum >= 11 && classNum <= 12) {
    return [
      { subjectId: "phy", subjectName: "Physics" },
      { subjectId: "che", subjectName: "Chemistry" },
      { subjectId: "mat", subjectName: "Mathematics" },
      { subjectId: "bio", subjectName: "Biology" },
    ];
  }
  
  return [
    { subjectId: "mat", subjectName: "Mathematics" },
    { subjectId: "sci", subjectName: "Science" },
    { subjectId: "eng", subjectName: "English" },
  ];
};

const getJEESubjects = (): { subjectId: string; subjectName: string }[] => {
  return [
    { subjectId: "jee_phy", subjectName: "JEE Physics" },
    { subjectId: "jee_che", subjectName: "JEE Chemistry" },
    { subjectId: "jee_mat", subjectName: "JEE Mathematics" },
  ];
};

const getBatchSubjects = (batch: typeof batches[0]) => {
  if (batch.assignedCourses?.includes("jee-mains") || batch.id.startsWith("jee-")) {
    return getJEESubjects();
  }
  return getSubjectsForClass(batch.classId);
};

const CLASS_CHIPS = ["6", "7", "8", "9", "10", "11", "12"];

export default function WeeklyPlans() {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(currentWeekIndex);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WeeklyChapterPlan | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [bulkSelectedBatches, setBulkSelectedBatches] = useState<string[]>([]);

  const selectedWeek = academicWeeks[selectedWeekIndex];
  const isPastWeek = selectedWeekIndex < currentWeekIndex;
  const isCurrentWeek = selectedWeekIndex === currentWeekIndex;

  const weekPlans = useMemo(() => {
    if (!selectedWeek) return [];
    return weeklyChapterPlans.filter(
      plan => plan.weekStartDate === selectedWeek.startDate
    );
  }, [selectedWeek]);

  const filteredBatches = useMemo(() => {
    if (classFilter === "all") return batches;
    return batches.filter(b => {
      const classNum = b.classId.replace("class-", "");
      return classNum === classFilter;
    });
  }, [classFilter]);

  const batchPlansData = useMemo(() => {
    return filteredBatches.map(batch => {
      const batchSubjects = getBatchSubjects(batch);
      
      const subjects = batchSubjects.map(subject => {
        const plan = weekPlans.find(
          p => p.batchId === batch.id && p.subjectId === subject.subjectId
        );
        
        const chapterNames = plan?.plannedChapters.map(chapterId => {
          const setup = academicScheduleSetups.find(s => s.subjectId === subject.subjectId);
          const chapter = setup?.chapters.find(c => c.chapterId === chapterId);
          return chapter?.chapterName || chapterId;
        }) || [];

        return {
          subjectId: subject.subjectId,
          subjectName: subject.subjectName,
          chapters: plan?.plannedChapters || [],
          chapterNames,
          hasPlans: !!plan && plan.plannedChapters.length > 0,
        };
      });

      return {
        batchId: batch.id,
        batchName: batch.name,
        className: batch.className || `Class ${batch.classId}`,
        subjects,
        plannedCount: subjects.filter(s => s.hasPlans).length,
        totalCount: subjects.length,
      };
    });
  }, [filteredBatches, weekPlans]);

  const stats = useMemo(() => {
    const totalSubjects = batchPlansData.reduce((sum, b) => sum + b.totalCount, 0);
    const plannedSubjects = batchPlansData.reduce((sum, b) => sum + b.plannedCount, 0);
    const missingPlans = totalSubjects - plannedSubjects;
    
    return { plannedSubjects, missingPlans };
  }, [batchPlansData]);

  const getChaptersForSubject = (subjectId: string): ChapterHourAllocation[] => {
    const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
    return setup?.chapters || [];
  };

  const handleEditPlan = (batchId: string, subjectId: string) => {
    const plan = weekPlans.find(p => p.batchId === batchId && p.subjectId === subjectId);
    const batch = batches.find(b => b.id === batchId);
    const batchSubjects = getBatchSubjects(batch!);
    const subject = batchSubjects.find(s => s.subjectId === subjectId);
    
    if (plan) {
      setEditingPlan(plan);
      setSelectedChapters(plan.plannedChapters);
    } else {
      setEditingPlan({
        id: "",
        batchId,
        batchName: batch?.name || "",
        subjectId,
        subjectName: subject?.subjectName || "",
        courseId: "cbse",
        weekStartDate: selectedWeek?.startDate || "",
        weekEndDate: selectedWeek?.endDate || "",
        plannedChapters: [],
        granularity: "weekly",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setSelectedChapters([]);
    }
    setIsViewMode(false);
    setIsDialogOpen(true);
  };

  const handleAddPlan = (batchId: string, subjectId: string) => {
    handleEditPlan(batchId, subjectId);
  };

  const handleViewPlan = (batchId: string, subjectId: string) => {
    const plan = weekPlans.find(p => p.batchId === batchId && p.subjectId === subjectId);
    const batch = batches.find(b => b.id === batchId);
    const batchSubjects = getBatchSubjects(batch!);
    const subject = batchSubjects.find(s => s.subjectId === subjectId);
    
    if (plan) {
      setEditingPlan(plan);
      setSelectedChapters(plan.plannedChapters);
      setIsViewMode(true);
      setIsDialogOpen(true);
    }
  };

  const handleSavePlan = () => {
    if (selectedChapters.length === 0) {
      toast.error("Please select at least one chapter");
      return;
    }
    toast.success("Weekly plan saved successfully!");
    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  const toggleChapter = (chapterId: string) => {
    if (isViewMode) return;
    setSelectedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleBulkAdd = () => {
    if (bulkSelectedBatches.length === 0) {
      toast.error("Please select at least one batch");
      return;
    }
    toast.success(`Bulk plans added for ${bulkSelectedBatches.length} batches!`);
    setIsBulkDialogOpen(false);
    setBulkSelectedBatches([]);
  };

  return (
    <div className="space-y-4">
      {/* Compact Header Row 1: Breadcrumb + Title + Stats + Action */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link 
            to="/institute/academic-schedule/progress" 
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold truncate">Weekly Plans</h1>
          
          {/* Inline Stats - Desktop */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <Separator orientation="vertical" className="h-5" />
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
              <CheckCircle className="w-3 h-3" />
              {stats.plannedSubjects} Planned
            </Badge>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1">
              <AlertCircle className="w-3 h-3" />
              {stats.missingPlans} Missing
            </Badge>
          </div>
        </div>
        
        {/* Bulk Add Button */}
        {!isPastWeek && (
          <Button size="sm" className="gap-1.5 h-8 shrink-0" onClick={() => setIsBulkDialogOpen(true)}>
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bulk Add</span>
            <span className="sm:hidden">Bulk</span>
          </Button>
        )}
      </div>

      {/* Compact Header Row 2: Class Chips + Week Navigator */}
      <div className="bg-card border border-border/50 rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-6">
        {/* Class Section */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">Class</span>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setClassFilter("all")}
              className={cn(
                "px-2.5 h-7 rounded-full text-xs font-medium transition-all shrink-0",
                classFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground"
              )}
            >
              All
            </button>
            {CLASS_CHIPS.map(cls => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={cn(
                  "w-7 h-7 rounded-full text-xs font-medium transition-all shrink-0 flex items-center justify-center",
                  classFilter === cls
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 hover:bg-muted text-muted-foreground"
                )}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Divider - visible on tablet+ */}
        <div className="hidden sm:block w-px h-8 bg-border/60" />
        
        {/* Week Section */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">Week</span>
          <WeekNavigator
            weeks={academicWeeks}
            currentWeekIndex={currentWeekIndex}
            selectedWeekIndex={selectedWeekIndex}
            onWeekChange={setSelectedWeekIndex}
          />
          
          {/* Week Status Badge */}
          {isPastWeek && (
            <Badge variant="secondary" className="text-muted-foreground gap-1 text-xs shrink-0 ml-auto sm:ml-0">
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">View Only</span>
            </Badge>
          )}
          {isCurrentWeek && (
            <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border border-emerald-200/50 text-xs shrink-0 ml-auto sm:ml-0">
              <span className="relative flex h-1.5 w-1.5 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Current Week
            </Badge>
          )}
        </div>
      </div>

      {/* Mobile Stats Row */}
      <div className="flex md:hidden items-center gap-2">
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1 text-xs">
          <CheckCircle className="w-3 h-3" />
          {stats.plannedSubjects} Planned
        </Badge>
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1 text-xs">
          <AlertCircle className="w-3 h-3" />
          {stats.missingPlans} Missing
        </Badge>
      </div>

      {/* Batch Accordions */}
      <div className="space-y-3">
        {batchPlansData.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No batches found</p>
              <p className="text-sm mt-1">Adjust your filter to see batches</p>
            </div>
          </Card>
        ) : (
          batchPlansData.map((batch) => (
            <BatchPlanAccordion
              key={batch.batchId}
              batchId={batch.batchId}
              batchName={batch.batchName}
              className={batch.className}
              subjects={batch.subjects}
              isExpanded={true}
              isPastWeek={isPastWeek}
              onEditPlan={handleEditPlan}
              onAddPlan={handleAddPlan}
              onViewPlan={handleViewPlan}
            />
          ))
        )}
      </div>

      {/* Legend - Moved to bottom */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2">
        <span className="font-medium">Legend:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <span>Past</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted/50" />
          <span>Future</span>
        </div>
      </div>

      {/* Add/Edit/View Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isViewMode ? (
                <>
                  <Eye className="w-5 h-5" />
                  View Weekly Plan
                </>
              ) : editingPlan?.id ? (
                "Edit Weekly Plan"
              ) : (
                "Add Weekly Plan"
              )}
            </DialogTitle>
            {isViewMode && (
              <DialogDescription>
                This is a past week. Plans cannot be modified.
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Batch:</span>
              <span className="font-medium">{editingPlan?.batchName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subject:</span>
              <span className="font-medium">{editingPlan?.subjectName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Week:</span>
              <span className="font-medium">{selectedWeek?.label}</span>
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-medium">
                {isViewMode ? "Planned Chapters" : "Select Chapters"}
              </Label>
              <ScrollArea className="h-[250px] mt-2">
                <div className="space-y-2">
                  {editingPlan && getChaptersForSubject(editingPlan.subjectId).map((chapter) => (
                    <div
                      key={chapter.chapterId}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                        selectedChapters.includes(chapter.chapterId)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50",
                        isViewMode && !selectedChapters.includes(chapter.chapterId) && "opacity-50",
                        !isViewMode && "cursor-pointer"
                      )}
                      onClick={() => toggleChapter(chapter.chapterId)}
                    >
                      <Checkbox
                        checked={selectedChapters.includes(chapter.chapterId)}
                        onCheckedChange={() => toggleChapter(chapter.chapterId)}
                        disabled={isViewMode}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {chapter.chapterName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {chapter.plannedHours} hours planned
                        </p>
                      </div>
                      {selectedChapters.includes(chapter.chapterId) && (
                        <Check className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                  ))}
                  {editingPlan && getChaptersForSubject(editingPlan.subjectId).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No chapters found for this subject.</p>
                      <p className="text-xs mt-1">Please set up the academic schedule first.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button onClick={handleSavePlan}>
                Save Plan
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Add Plans Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Bulk Add Plans
            </DialogTitle>
            <DialogDescription>
              Select batches to add plans for Week {selectedWeekIndex + 1}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label className="text-sm font-medium">Select Batches</Label>
            <ScrollArea className="h-[300px] mt-2 border rounded-lg p-2">
              <div className="space-y-2">
                {filteredBatches.map((batch) => (
                  <div
                    key={batch.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      bulkSelectedBatches.includes(batch.id)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => {
                      setBulkSelectedBatches(prev =>
                        prev.includes(batch.id)
                          ? prev.filter(id => id !== batch.id)
                          : [...prev, batch.id]
                      );
                    }}
                  >
                    <Checkbox
                      checked={bulkSelectedBatches.includes(batch.id)}
                      onCheckedChange={() => {
                        setBulkSelectedBatches(prev =>
                          prev.includes(batch.id)
                            ? prev.filter(id => id !== batch.id)
                            : [...prev, batch.id]
                        );
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{batch.name}</p>
                      <p className="text-xs text-muted-foreground">{batch.className}</p>
                    </div>
                    {bulkSelectedBatches.includes(batch.id) && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted-foreground mt-2">
              {bulkSelectedBatches.length} batch(es) selected
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAdd} disabled={bulkSelectedBatches.length === 0}>
              Add Plans ({bulkSelectedBatches.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
