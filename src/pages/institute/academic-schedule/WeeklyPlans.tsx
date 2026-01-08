import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ChevronLeft,
  ChevronRight,
  Calendar,
  BookOpen,
  Plus,
  Edit2,
  Check,
} from "lucide-react";
import { batches } from "@/data/instituteData";
import { weeklyChapterPlans, academicWeeks, currentWeekIndex, academicScheduleSetups } from "@/data/academicScheduleData";
import { WeeklyChapterPlan, ChapterHourAllocation } from "@/types/academicSchedule";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const subjects = [
  { id: "all", name: "All Subjects" },
  { id: "phy", name: "Physics" },
  { id: "che", name: "Chemistry" },
  { id: "mat", name: "Mathematics" },
];

export default function WeeklyPlans() {
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [weekIndex, setWeekIndex] = useState(currentWeekIndex);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WeeklyChapterPlan | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  const currentWeek = academicWeeks[weekIndex];
  
  // Filter plans by week, batch, and subject
  const filteredPlans = weeklyChapterPlans.filter(plan => {
    const weekMatch = plan.weekStartDate === currentWeek?.startDate;
    const batchMatch = selectedBatch === "all" || plan.batchId === selectedBatch;
    const subjectMatch = selectedSubject === "all" || plan.subjectId === selectedSubject;
    return weekMatch && batchMatch && subjectMatch;
  });

  // Get batches for batch cards (when no filter applied)
  const displayBatches = selectedBatch === "all" 
    ? batches 
    : batches.filter(b => b.id === selectedBatch);

  const handlePrevWeek = () => {
    if (weekIndex > 0) setWeekIndex(weekIndex - 1);
  };

  const handleNextWeek = () => {
    if (weekIndex < academicWeeks.length - 1) setWeekIndex(weekIndex + 1);
  };

  const handleAddPlan = (batchId: string, subjectId: string) => {
    // Get chapters from setup
    const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
    setSelectedChapters([]);
    setEditingPlan({
      id: "",
      batchId,
      batchName: batches.find(b => b.id === batchId)?.name || "",
      subjectId,
      subjectName: subjects.find(s => s.id === subjectId)?.name || "",
      courseId: "cbse",
      weekStartDate: currentWeek?.startDate || "",
      weekEndDate: currentWeek?.endDate || "",
      plannedChapters: [],
      granularity: "weekly",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: WeeklyChapterPlan) => {
    setEditingPlan(plan);
    setSelectedChapters(plan.plannedChapters);
    setIsDialogOpen(true);
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

  // Get chapters for the editing dialog
  const getChaptersForSubject = (subjectId: string): ChapterHourAllocation[] => {
    const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
    return setup?.chapters || [];
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Plans"
        description="Assign chapters to batches for each week"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Weekly Plans" },
        ]}
      />

      {/* Week Navigator & Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Week Navigator */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevWeek}
                disabled={weekIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 min-w-[280px] justify-center">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="font-semibold text-primary">
                  {currentWeek?.label || "No week selected"}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextWeek}
                disabled={weekIndex >= academicWeeks.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.className} - {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch-Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayBatches.map((batch) => {
          const batchSubjects = selectedSubject === "all"
            ? ["phy", "mat", "che"]
            : [selectedSubject];

          return batchSubjects.map((subjectId) => {
            const plan = weeklyChapterPlans.find(
              p => p.batchId === batch.id && 
                   p.subjectId === subjectId && 
                   p.weekStartDate === currentWeek?.startDate
            );
            const subjectName = subjects.find(s => s.id === subjectId)?.name || subjectId;

            return (
              <Card 
                key={`${batch.id}-${subjectId}`}
                className={cn(
                  "transition-all hover:shadow-md",
                  plan && "border-primary/30 bg-primary/5"
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {batch.className} - {batch.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {subjectName}
                      </Badge>
                    </div>
                    {plan ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleAddPlan(batch.id, subjectId)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {plan ? (
                    <div className="space-y-2">
                      {plan.plannedChapters.map((chapterId, idx) => {
                        const setup = academicScheduleSetups.find(s => s.subjectId === subjectId);
                        const chapter = setup?.chapters.find(c => c.chapterId === chapterId);
                        return (
                          <div
                            key={chapterId}
                            className="flex items-center gap-2 text-sm p-2 rounded bg-background border"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="truncate">
                              {chapter?.chapterName || chapterId}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No chapters planned</p>
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-1"
                        onClick={() => handleAddPlan(batch.id, subjectId)}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          });
        })}
      </div>

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
              <span className="font-medium">{currentWeek?.label}</span>
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
                        <Check className="w-4 h-4 text-primary" />
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
            <Button onClick={handleSavePlan} className="gradient-button">
              Save Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
