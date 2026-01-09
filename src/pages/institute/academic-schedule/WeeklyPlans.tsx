import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  Filter,
  Plus,
  Check,
  Layers,
  Eye,
} from "lucide-react";
import { WeekNavigator, BatchPlanAccordion } from "@/components/academic-schedule";
import { weeklyChapterPlans, academicWeeks, currentWeekIndex, academicScheduleSetups } from "@/data/academicScheduleData";
import { batches } from "@/data/instituteData";
import { WeeklyChapterPlan, ChapterHourAllocation } from "@/types/academicSchedule";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Subject configuration based on class level
const getSubjectsForClass = (classId: string): { subjectId: string; subjectName: string }[] => {
  // Extract class number from classId (e.g., "class-6" -> 6)
  const classNum = parseInt(classId.replace("class-", ""));
  
  // Class 6-8: General subjects
  if (classNum >= 6 && classNum <= 8) {
    return [
      { subjectId: "mat", subjectName: "Mathematics" },
      { subjectId: "sci", subjectName: "Science" },
      { subjectId: "eng", subjectName: "English" },
      { subjectId: "hin", subjectName: "Hindi" },
      { subjectId: "sst", subjectName: "Social Studies" },
    ];
  }
  
  // Class 9-10: Science stream
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
  
  // Class 11-12: Science stream
  if (classNum >= 11 && classNum <= 12) {
    return [
      { subjectId: "phy", subjectName: "Physics" },
      { subjectId: "che", subjectName: "Chemistry" },
      { subjectId: "mat", subjectName: "Mathematics" },
      { subjectId: "bio", subjectName: "Biology" },
    ];
  }
  
  // Default
  return [
    { subjectId: "mat", subjectName: "Mathematics" },
    { subjectId: "sci", subjectName: "Science" },
    { subjectId: "eng", subjectName: "English" },
  ];
};

// JEE subjects
const getJEESubjects = (): { subjectId: string; subjectName: string }[] => {
  return [
    { subjectId: "jee_phy", subjectName: "JEE Physics" },
    { subjectId: "jee_che", subjectName: "JEE Chemistry" },
    { subjectId: "jee_mat", subjectName: "JEE Mathematics" },
  ];
};

// Get subjects for a batch
const getBatchSubjects = (batch: typeof batches[0]) => {
  // Check if JEE batch
  if (batch.assignedCourses?.includes("jee-mains") || batch.id.startsWith("jee-")) {
    return getJEESubjects();
  }
  return getSubjectsForClass(batch.classId);
};

// Class numbers for filter chips
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
  
  // Determine if selected week is past, current, or future
  const isPastWeek = selectedWeekIndex < currentWeekIndex;
  const isCurrentWeek = selectedWeekIndex === currentWeekIndex;
  const isFutureWeek = selectedWeekIndex > currentWeekIndex;

  // Filter plans for the selected week
  const weekPlans = useMemo(() => {
    if (!selectedWeek) return [];
    return weeklyChapterPlans.filter(
      plan => plan.weekStartDate === selectedWeek.startDate
    );
  }, [selectedWeek]);

  // Filter batches by class
  const filteredBatches = useMemo(() => {
    if (classFilter === "all") return batches;
    return batches.filter(b => {
      const classNum = b.classId.replace("class-", "");
      return classNum === classFilter;
    });
  }, [classFilter]);

  // Build batch data with their subject plans
  const batchPlansData = useMemo(() => {
    return filteredBatches.map(batch => {
      const batchSubjects = getBatchSubjects(batch);
      
      const subjects = batchSubjects.map(subject => {
        const plan = weekPlans.find(
          p => p.batchId === batch.id && p.subjectId === subject.subjectId
        );
        
        // Get chapter names from setups
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

  // Summary stats
  const stats = useMemo(() => {
    const totalBatches = batchPlansData.length;
    const totalSubjects = batchPlansData.reduce((sum, b) => sum + b.totalCount, 0);
    const plannedSubjects = batchPlansData.reduce((sum, b) => sum + b.plannedCount, 0);
    const totalChapters = weekPlans.reduce((sum, p) => sum + p.plannedChapters.length, 0);
    const missingPlans = totalSubjects - plannedSubjects;
    
    return { totalBatches, totalSubjects, plannedSubjects, totalChapters, missingPlans };
  }, [batchPlansData, weekPlans]);

  // Get chapters for the editing dialog
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
    <div className="space-y-6">
      <PageHeader
        title="Weekly Chapter Plans"
        description="Map chapters to weeks for each batch and subject"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Weekly Plans" },
        ]}
      />

      {/* Class Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <span className="text-sm font-medium text-muted-foreground shrink-0">Class:</span>
        <button
          onClick={() => setClassFilter("all")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all min-w-[44px] h-[44px] flex items-center justify-center",
            classFilter === "all"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          )}
        >
          All
        </button>
        {CLASS_CHIPS.map(cls => (
          <button
            key={cls}
            onClick={() => setClassFilter(cls)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all min-w-[44px] h-[44px] flex items-center justify-center",
              classFilter === cls
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Week Navigator */}
      <WeekNavigator
        weeks={academicWeeks}
        currentWeekIndex={currentWeekIndex}
        selectedWeekIndex={selectedWeekIndex}
        onWeekChange={setSelectedWeekIndex}
      />

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalBatches}</p>
              <p className="text-xs text-muted-foreground">Batches</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.plannedSubjects}</p>
              <p className="text-xs text-muted-foreground">Plans Created</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.missingPlans}</p>
              <p className="text-xs text-muted-foreground">Missing Plans</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalChapters}</p>
              <p className="text-xs text-muted-foreground">Total Chapters</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Row */}
      {!isPastWeek && (
        <div className="flex justify-end">
          <Button className="gap-2" onClick={() => setIsBulkDialogOpen(true)}>
            <Layers className="w-4 h-4" />
            Bulk Add Plans
          </Button>
        </div>
      )}

      {/* Batch Accordions */}
      <div className="space-y-4">
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

      {/* Week Progress Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-muted-foreground font-medium">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-primary/50" />
            <span>Current Week</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span>Past Weeks (View Only)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted/50" />
            <span>Future Weeks</span>
          </div>
        </div>
      </Card>

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
