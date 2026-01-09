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
} from "lucide-react";
import { WeekNavigator, BatchPlanAccordion } from "@/components/academic-schedule";
import { weeklyChapterPlans, academicWeeks, currentWeekIndex, academicScheduleSetups } from "@/data/academicScheduleData";
import { batches } from "@/data/instituteData";
import { WeeklyChapterPlan, ChapterHourAllocation } from "@/types/academicSchedule";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Subject list for batch-subject combinations
const subjectsList = [
  { subjectId: "phy", subjectName: "Physics" },
  { subjectId: "mat", subjectName: "Mathematics" },
  { subjectId: "che", subjectName: "Chemistry" },
];

// Get subjects for a batch (simplified)
const getBatchSubjects = (batchId: string) => {
  return subjectsList;
};

export default function WeeklyPlans() {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(currentWeekIndex);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WeeklyChapterPlan | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  const selectedWeek = academicWeeks[selectedWeekIndex];

  // Filter plans for the selected week
  const weekPlans = useMemo(() => {
    if (!selectedWeek) return [];
    return weeklyChapterPlans.filter(
      plan => plan.weekStartDate === selectedWeek.startDate
    );
  }, [selectedWeek]);

  // Get all unique classes for filter
  const classOptions = useMemo(() => {
    const classes = [...new Set(batches.map(b => b.classId || b.className))];
    return classes.sort();
  }, []);

  // Filter batches by class
  const filteredBatches = useMemo(() => {
    if (classFilter === "all") return batches;
    return batches.filter(b => (b.classId || b.className) === classFilter);
  }, [classFilter]);

  // Build batch data with their subject plans
  const batchPlansData = useMemo(() => {
    return filteredBatches.map(batch => {
      const batchSubjects = getBatchSubjects(batch.id);
      
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
    const batchSubjects = getBatchSubjects(batchId);
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
    setIsDialogOpen(true);
  };

  const handleAddPlan = (batchId: string, subjectId: string) => {
    handleEditPlan(batchId, subjectId);
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
    setSelectedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
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

      {/* Filter & Actions Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classOptions.map(cls => (
                <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Bulk Add Plans
        </Button>
      </div>

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
              onEditPlan={handleEditPlan}
              onAddPlan={handleAddPlan}
            />
          ))
        )}
      </div>

      {/* Week Progress Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-muted-foreground font-medium">Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Current Week</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span>Past Weeks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted/50" />
            <span>Future Weeks</span>
          </div>
        </div>
      </Card>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPlan?.id ? "Edit" : "Add"} Weekly Plan
            </DialogTitle>
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
              <Label className="text-sm font-medium">Select Chapters</Label>
              <ScrollArea className="h-[250px] mt-2">
                <div className="space-y-2">
                  {editingPlan && getChaptersForSubject(editingPlan.subjectId).map((chapter) => (
                    <div
                      key={chapter.chapterId}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedChapters.includes(chapter.chapterId)
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => toggleChapter(chapter.chapterId)}
                    >
                      <Checkbox
                        checked={selectedChapters.includes(chapter.chapterId)}
                        onCheckedChange={() => toggleChapter(chapter.chapterId)}
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
                </div>
              </ScrollArea>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePlan}>
              Save Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
