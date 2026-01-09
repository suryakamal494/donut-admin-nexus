import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GitCompareArrows, BookOpen, AlertTriangle, CheckCircle2, Clock, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { weeklyChapterPlans, academicScheduleSetups, currentWeekIndex } from "@/data/academicScheduleData";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
};

// Class options with their sections
const CLASS_OPTIONS = [
  { id: "1", name: "Class 6", sections: ["batch-6a", "batch-6b"] },
  { id: "2", name: "Class 7", sections: ["batch-7a", "batch-7b"] },
  { id: "3", name: "Class 8", sections: ["batch-8a", "batch-8b"] },
  { id: "4", name: "Class 9", sections: ["batch-9a", "batch-9b"] },
  { id: "5", name: "Class 10", sections: ["batch-10a", "batch-10b", "batch-10c"] },
  { id: "6", name: "Class 11", sections: ["batch-11a", "batch-11b"] },
  { id: "7", name: "Class 12", sections: ["batch-12a", "batch-12b"] },
];

// Mock section data
const SECTION_DATA: Record<string, { name: string; classId: string }> = {
  "batch-6a": { name: "Section A", classId: "1" },
  "batch-6b": { name: "Section B", classId: "1" },
  "batch-7a": { name: "Section A", classId: "2" },
  "batch-7b": { name: "Section B", classId: "2" },
  "batch-8a": { name: "Section A", classId: "3" },
  "batch-8b": { name: "Section B", classId: "3" },
  "batch-9a": { name: "Section A", classId: "4" },
  "batch-9b": { name: "Section B", classId: "4" },
  "batch-10a": { name: "Section A", classId: "5" },
  "batch-10b": { name: "Section B", classId: "5" },
  "batch-10c": { name: "Section C", classId: "5" },
  "batch-11a": { name: "Section A", classId: "6" },
  "batch-11b": { name: "Section B", classId: "6" },
  "batch-12a": { name: "Section A", classId: "7" },
  "batch-12b": { name: "Section B", classId: "7" },
};

export default function SectionAlignment() {
  const [selectedClass, setSelectedClass] = useState("4"); // Class 9
  const [selectedSubject, setSelectedSubject] = useState("mat");

  const selectedClassData = CLASS_OPTIONS.find(c => c.id === selectedClass);

  // Get available subjects for this class
  const availableSubjects = useMemo(() => {
    return academicScheduleSetups
      .filter(s => s.classId === selectedClass)
      .map(s => ({ id: s.subjectId, name: s.subjectName }));
  }, [selectedClass]);

  // Build section comparison data
  const sectionComparison = useMemo(() => {
    if (!selectedClassData) return [];

    return selectedClassData.sections.map(sectionId => {
      const sectionInfo = SECTION_DATA[sectionId];
      
      // Get latest week plan for this section + subject
      const latestPlan = weeklyChapterPlans
        .filter(p => p.batchId === sectionId && p.subjectId === selectedSubject)
        .sort((a, b) => new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime())[0];

      // Find current chapter
      let currentChapter = "Not planned";
      let currentWeek = 0;
      let progress = 0;

      if (latestPlan) {
        const setup = academicScheduleSetups.find(s => s.classId === selectedClass && s.subjectId === selectedSubject);
        if (setup && latestPlan.plannedChapters.length > 0) {
          const chapter = setup.chapters.find(ch => ch.chapterId === latestPlan.plannedChapters[0]);
          if (chapter) {
            currentChapter = chapter.chapterName;
            currentWeek = currentWeekIndex + 1;
            // Calculate progress based on chapter order
            const chapterIdx = setup.chapters.findIndex(ch => ch.chapterId === latestPlan.plannedChapters[0]);
            progress = Math.round(((chapterIdx + 1) / setup.chapters.length) * 100);
          }
        }
      }

      // Determine status
      let status: 'on_track' | 'lagging' = 'on_track';
      // Mock different statuses for demo
      if (sectionId.includes('b')) {
        status = 'lagging';
        progress = Math.max(0, progress - 15);
      } else if (sectionId.includes('c')) {
        status = 'lagging';
        progress = Math.max(0, progress - 25);
      }

      return {
        sectionId,
        sectionName: sectionInfo?.name || sectionId,
        currentChapter,
        currentWeek,
        progress,
        status,
      };
    });
  }, [selectedClassData, selectedSubject, selectedClass]);

  // Calculate alignment issues
  const alignmentIssues = useMemo(() => {
    const issues: { sectionId: string; sectionName: string; message: string; severity: 'warning' | 'error' }[] = [];
    
    const maxProgress = Math.max(...sectionComparison.map(s => s.progress));
    
    sectionComparison.forEach(section => {
      const diff = maxProgress - section.progress;
      if (diff > 20) {
        issues.push({
          sectionId: section.sectionId,
          sectionName: section.sectionName,
          message: `${section.sectionName} is ${diff}% behind other sections`,
          severity: diff > 30 ? 'error' : 'warning',
        });
      }
    });

    return issues;
  }, [sectionComparison]);

  // Get unique chapters currently being taught
  const currentChapters = [...new Set(sectionComparison.map(s => s.currentChapter))].filter(c => c !== "Not planned");
  const isAligned = currentChapters.length <= 1;

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Section Alignment"
        description="Compare academic progress across sections"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Section Alignment" },
        ]}
      />

      {/* Class Selector */}
      <Card className="p-3 md:p-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Select Class</label>
            <div className="flex flex-wrap gap-2">
              {CLASS_OPTIONS.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                    selectedClass === cls.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-muted/30 hover:bg-muted/50 border-transparent"
                  )}
                >
                  {cls.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Select Subject</label>
            <div className="flex flex-wrap gap-2">
              {availableSubjects.map(subject => {
                const colors = SUBJECT_COLORS[subject.id] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
                const isSelected = selectedSubject === subject.id;
                
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

      {/* Alignment Status */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={cn(
          "p-4",
          isAligned 
            ? "bg-gradient-to-br from-emerald-50 to-transparent border-emerald-200" 
            : "bg-gradient-to-br from-amber-50 to-transparent border-amber-200"
        )}>
          <div className="flex items-start gap-3">
            {isAligned ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
            )}
            <div>
              <h3 className={cn(
                "font-semibold",
                isAligned ? "text-emerald-800" : "text-amber-800"
              )}>
                {isAligned ? "Sections Aligned" : "Alignment Drift Detected"}
              </h3>
              <p className={cn(
                "text-sm mt-1",
                isAligned ? "text-emerald-700" : "text-amber-700"
              )}>
                {isAligned 
                  ? "All sections are covering the same chapter this week"
                  : `${currentChapters.length} different chapters being taught across sections`
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs">Sections Overview</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold">{sectionComparison.length}</p>
              <p className="text-xs text-muted-foreground">Total Sections</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-3xl font-bold text-emerald-600">
                {sectionComparison.filter(s => s.status === 'on_track').length}
              </p>
              <p className="text-xs text-muted-foreground">On Track</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <p className="text-3xl font-bold text-amber-600">
                {sectionComparison.filter(s => s.status === 'lagging').length}
              </p>
              <p className="text-xs text-muted-foreground">Lagging</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alignment Issues */}
      {alignmentIssues.length > 0 && (
        <div className="space-y-2">
          {alignmentIssues.map((issue, idx) => (
            <Alert 
              key={idx}
              variant={issue.severity === 'error' ? 'destructive' : 'default'}
              className={cn(
                issue.severity === 'warning' && "border-amber-300 bg-amber-50 text-amber-900"
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Alignment Issue</AlertTitle>
              <AlertDescription>{issue.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Section Comparison Grid */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 px-4 py-3 bg-muted/30 border-b">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GitCompareArrows className="w-4 h-4" />
            Section Comparison - {selectedClassData?.name} {availableSubjects.find(s => s.id === selectedSubject)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="grid grid-cols-5 border-b bg-muted/10 text-xs font-medium text-muted-foreground">
                <div className="p-3 border-r">Section</div>
                <div className="p-3 border-r">Current Chapter</div>
                <div className="p-3 border-r text-center">Week</div>
                <div className="p-3 border-r">Progress</div>
                <div className="p-3 text-center">Status</div>
              </div>

              {/* Rows */}
              {sectionComparison.map(section => (
                <div 
                  key={section.sectionId}
                  className="grid grid-cols-5 border-b last:border-b-0 hover:bg-muted/5 transition-colors"
                >
                  <div className="p-3 border-r font-medium">
                    {section.sectionName}
                  </div>
                  <div className="p-3 border-r">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate">{section.currentChapter}</span>
                    </div>
                  </div>
                  <div className="p-3 border-r text-center">
                    <Badge variant="outline" className="text-xs">
                      Week {section.currentWeek || '-'}
                    </Badge>
                  </div>
                  <div className="p-3 border-r">
                    <div className="flex items-center gap-2">
                      <Progress value={section.progress} className="flex-1 h-2" />
                      <span className="text-xs font-medium w-10">{section.progress}%</span>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <Badge
                      className={cn(
                        "text-xs",
                        section.status === 'on_track' && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                        section.status === 'lagging' && "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      )}
                    >
                      {section.status === 'on_track' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {section.status === 'lagging' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {section.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}

              {sectionComparison.length === 0 && (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-medium text-muted-foreground">No sections found</p>
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Visual Alignment Bar */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Progress Comparison
        </h3>
        <div className="space-y-3">
          {sectionComparison.map(section => {
            const colors = SUBJECT_COLORS[selectedSubject] || { solid: "bg-gray-500" };
            return (
              <div key={section.sectionId} className="flex items-center gap-3">
                <span className="text-sm w-24 shrink-0">{section.sectionName}</span>
                <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden relative">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                              section.status === 'on_track' && "bg-emerald-500",
                              section.status === 'lagging' && "bg-amber-500"
                    )}
                    style={{ width: `${section.progress}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground/70">
                    {section.currentChapter !== "Not planned" 
                      ? section.currentChapter.slice(0, 20) + (section.currentChapter.length > 20 ? '...' : '')
                      : "No plan"
                    }
                  </span>
                </div>
                <span className="text-sm font-medium w-12 text-right">{section.progress}%</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
