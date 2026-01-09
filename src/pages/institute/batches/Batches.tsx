import { useState, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, GraduationCap, BookOpen, ChevronRight, Calendar, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { batches, availableClasses } from "@/data/instituteData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const Batches = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Group batches by class - memoized
  const batchesByClass = useMemo(() => 
    availableClasses.reduce((acc, cls) => {
      const classBatches = batches.filter((b) => b.classId === cls.id);
      if (classBatches.length > 0) {
        acc[cls.id] = {
          className: cls.name,
          batches: classBatches,
        };
      }
      return acc;
    }, {} as Record<string, { className: string; batches: typeof batches }>), []);

  // Class chips with batch counts - memoized
  const classChips = useMemo(() => 
    availableClasses
      .map((cls) => ({
        id: cls.id,
        name: cls.name,
        count: batchesByClass[cls.id]?.batches.length || 0,
      }))
      .filter((c) => c.count > 0), [batchesByClass]);

  // Filtered batches based on selection - memoized
  const filteredBatchesByClass = useMemo(() => 
    selectedClass
      ? { [selectedClass]: batchesByClass[selectedClass] }
      : batchesByClass, [selectedClass, batchesByClass]);

  // Computed stats - memoized
  const stats = useMemo(() => ({
    totalBatches: batches.length,
    totalStudents: batches.reduce((sum, b) => sum + b.studentCount, 0),
    totalClasses: Object.keys(batchesByClass).length,
  }), [batchesByClass]);

  // Handle chip click - filter and scroll
  const handleChipClick = useCallback((classId: string | null) => {
    setSelectedClass(classId);
    if (classId && sectionRefs.current[classId]) {
      setTimeout(() => {
        sectionRefs.current[classId]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batches"
        description="Organize your classes into batches. Each batch is a group of students with assigned teachers and timetable."
        actions={
          <Button
            onClick={() => navigate("/institute/batches/create")}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Batch
          </Button>
        }
      />

      {/* Quick Stats - Compact */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-foreground">{stats.totalBatches}</p>
              <p className="text-xs text-muted-foreground truncate">Batches</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-foreground">{stats.totalStudents}</p>
              <p className="text-xs text-muted-foreground truncate">Students</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <CardContent className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-xl font-bold text-foreground">{stats.totalClasses}</p>
              <p className="text-xs text-muted-foreground truncate">Classes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Filter Chips - Sticky */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2.5 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleChipClick(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
              "border border-border/50 hover:border-primary/50",
              selectedClass === null
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            All
            <span className="ml-1 text-xs opacity-80">({stats.totalBatches})</span>
          </button>
          {classChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => handleChipClick(chip.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all shrink-0",
                "border border-border/50 hover:border-primary/50",
                selectedClass === chip.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {chip.name.replace('Class ', '')}
              <span className="ml-1 text-xs opacity-80">({chip.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Batches Grouped by Class */}
      <div className="space-y-8">
        {Object.entries(filteredBatchesByClass).map(([classId, data]) => {
          if (!data) return null;
          const { className, batches: classBatches } = data;
          return (
            <div
              key={classId}
              ref={(el) => (sectionRefs.current[classId] = el)}
              className="space-y-4 scroll-mt-20"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-primary/50" />
                <h2 className="text-lg font-semibold text-foreground">{className}</h2>
                <Badge variant="secondary" className="ml-2">
                  {classBatches.length} {classBatches.length === 1 ? "Batch" : "Batches"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {classBatches.map((batch) => (
                  <Card
                    key={batch.id}
                    className="group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    onClick={() => navigate(`/institute/batches/${batch.id}`)}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {batch.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            {batch.academicYear}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                      </div>

                      {/* Course Badges */}
                      {batch.assignedCourses.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {batch.assignedCourses.map((course) => (
                            <Badge
                              key={course}
                              variant="outline"
                              className={cn(
                                "text-xs",
                                course === "jee-mains"
                                  ? "border-purple-300 bg-purple-50 text-purple-700"
                                  : "border-blue-300 bg-blue-50 text-blue-700"
                              )}
                            >
                              {course === "jee-mains" ? "JEE" : "CBSE"}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">{batch.studentCount}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Students in this batch</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <GraduationCap className="h-4 w-4" />
                              <span className="font-medium">{batch.teacherCount}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Teachers assigned</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              <span className="font-medium">{batch.subjects.length}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Subjects</TooltipContent>
                        </Tooltip>
                      </div>

                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex flex-wrap gap-1">
                          {batch.subjects.slice(0, 4).map((subjectId) => (
                            <Badge
                              key={subjectId}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {subjectId.toUpperCase()}
                            </Badge>
                          ))}
                          {batch.subjects.length > 4 && (
                            <Badge variant="outline" className="text-xs font-normal">
                              +{batch.subjects.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {Object.keys(batchesByClass).length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-16 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No batches created yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Create your first batch to start organizing students and assigning teachers.
              </p>
              <Button onClick={() => navigate("/institute/batches/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Batch
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Batches;