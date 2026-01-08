import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Save,
  GripVertical,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import real master data
import { assignedTracks, availableClasses } from "@/data/instituteData";
import { 
  allCBSEChapters, 
  getSubjectsByClass,
  type CBSEChapter 
} from "@/data/cbseMasterData";
import { 
  courseChapterMappings, 
  courseOwnedChapters 
} from "@/data/masterData";
import { 
  subjectMasterList, 
  findSubject, 
  getSubjectColor,
  type SubjectInfo 
} from "@/components/subject/SubjectBadge";
import { academicScheduleSetups } from "@/data/academicScheduleData";
import { ChapterHourAllocation } from "@/types/academicSchedule";
import { toast } from "sonner";

// Map class IDs to internal IDs used in CBSE data
const classIdMapping: Record<string, string> = {
  "class-6": "1",
  "class-7": "2", 
  "class-8": "3",
  "class-9": "4",
  "class-10": "5",
  "class-11": "6",
  "class-12": "7",
};

// Reverse mapping for display
const internalToClassId: Record<string, string> = {
  "1": "class-6",
  "2": "class-7",
  "3": "class-8",
  "4": "class-9",
  "5": "class-10",
  "6": "class-11",
  "7": "class-12",
};

// Subject ID to code mapping
const subjectIdToCode: Record<string, string> = {
  "1": "phy",
  "2": "che",
  "3": "mat",
  "4": "bio",
  "5": "his",
  "6": "hin",
};

// JEE Mains subjects (Physics, Chemistry, Mathematics only)
const jeeMainsSubjects = ["1", "2", "3"];

export default function AcademicScheduleSetup() {
  // Selection state
  const [selectedTrack, setSelectedTrack] = useState<string>(assignedTracks[0]?.id || "cbse");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  
  // Chapter allocation state
  const [chapters, setChapters] = useState<ChapterHourAllocation[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Get current track config
  const currentTrack = assignedTracks.find(t => t.id === selectedTrack);
  const requiresClass = currentTrack?.hasClasses ?? true;

  // Get available classes (for CBSE, all classes 6-12)
  const availableClassList = useMemo(() => {
    if (!requiresClass) return [];
    return availableClasses;
  }, [requiresClass]);

  // Get subjects based on selection
  const availableSubjects = useMemo(() => {
    if (selectedTrack === "cbse") {
      if (!selectedClass) return [];
      const internalClassId = classIdMapping[selectedClass];
      if (!internalClassId) return [];
      
      // Get subjects that have chapters for this class
      const subjectsWithData = getSubjectsByClass(internalClassId);
      return subjectsWithData.map(s => {
        const subjectInfo = findSubject(s.name);
        return {
          id: s.id,
          name: s.name,
          code: subjectIdToCode[s.id] || s.id,
          info: subjectInfo,
        };
      });
    } else if (selectedTrack === "jee-mains") {
      // JEE Mains has fixed subjects: Physics, Chemistry, Mathematics
      return jeeMainsSubjects.map(id => {
        const names: Record<string, string> = { "1": "Physics", "2": "Chemistry", "3": "Mathematics" };
        const codes: Record<string, string> = { "1": "phy", "2": "che", "3": "mat" };
        const subjectInfo = findSubject(names[id]);
        return {
          id,
          name: names[id],
          code: codes[id],
          info: subjectInfo,
        };
      });
    }
    return [];
  }, [selectedTrack, selectedClass]);

  // Get chapters for selected combination
  const getChaptersForSelection = (): CBSEChapter[] => {
    if (selectedTrack === "cbse") {
      if (!selectedClass || !selectedSubject) return [];
      const internalClassId = classIdMapping[selectedClass];
      return allCBSEChapters.filter(
        ch => ch.classId === internalClassId && ch.subjectId === selectedSubject
      );
    } else if (selectedTrack === "jee-mains") {
      if (!selectedSubject) return [];
      
      // Get mapped chapters from CBSE (Class 11 & 12)
      const mappedChapterIds = courseChapterMappings
        .filter(m => m.courseId === "jee-mains")
        .map(m => m.chapterId);
      
      const mappedChapters = allCBSEChapters.filter(
        ch => mappedChapterIds.includes(ch.id) && ch.subjectId === selectedSubject
      );
      
      // Get course-owned chapters
      const ownedChapters = courseOwnedChapters.filter(
        ch => ch.courseId === "jee-mains" && ch.subjectId === selectedSubject
      );
      
      // Combine and convert to CBSEChapter format
      const combined: CBSEChapter[] = [
        ...mappedChapters,
        ...ownedChapters.map(ch => ({
          id: ch.id,
          name: ch.name,
          curriculumId: "jee-mains",
          classId: "",
          subjectId: ch.subjectId,
          order: ch.order,
          isCourseOwned: true,
          courseId: ch.courseId,
        })),
      ];
      
      return combined.sort((a, b) => a.order - b.order);
    }
    return [];
  };

  // Check if setup exists for selected combination
  const existingSetup = academicScheduleSetups.find(
    s => s.courseId === selectedTrack && 
         s.classId === selectedClass && 
         s.subjectId === selectedSubject
  );

  // Handlers
  const handleTrackChange = (value: string) => {
    setSelectedTrack(value);
    setSelectedClass("");
    setSelectedSubject("");
    setChapters([]);
    setHasChanges(false);
  };

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedSubject("");
    setChapters([]);
    setHasChanges(false);
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    
    // Load existing setup or default chapters
    const existing = academicScheduleSetups.find(
      s => s.courseId === selectedTrack && 
           s.classId === selectedClass && 
           s.subjectId === subjectId
    );
    
    if (existing) {
      setChapters(existing.chapters);
    } else {
      // Load from master data with default hours
      const rawChapters = getChaptersForSelection();
      // Need to re-filter since selectedSubject wasn't updated yet
      let filteredChapters: CBSEChapter[];
      if (selectedTrack === "cbse") {
        const internalClassId = classIdMapping[selectedClass];
        filteredChapters = allCBSEChapters.filter(
          ch => ch.classId === internalClassId && ch.subjectId === subjectId
        );
      } else {
        const mappedChapterIds = courseChapterMappings
          .filter(m => m.courseId === "jee-mains")
          .map(m => m.chapterId);
        
        const mappedChapters = allCBSEChapters.filter(
          ch => mappedChapterIds.includes(ch.id) && ch.subjectId === subjectId
        );
        
        const ownedChapters = courseOwnedChapters.filter(
          ch => ch.courseId === "jee-mains" && ch.subjectId === subjectId
        );
        
        filteredChapters = [
          ...mappedChapters,
          ...ownedChapters.map(ch => ({
            id: ch.id,
            name: ch.name,
            curriculumId: "jee-mains",
            classId: "",
            subjectId: ch.subjectId,
            order: ch.order,
            isCourseOwned: true,
            courseId: ch.courseId,
          })),
        ].sort((a, b) => a.order - b.order);
      }
      
      const defaultChapters: ChapterHourAllocation[] = filteredChapters.map((ch, idx) => ({
        chapterId: ch.id,
        chapterName: ch.name,
        plannedHours: 8, // Default 8 hours per chapter
        order: idx + 1,
      }));
      setChapters(defaultChapters);
    }
    setHasChanges(false);
  };

  const handleHoursChange = (index: number, hours: number) => {
    const updated = [...chapters];
    updated[index] = { ...updated[index], plannedHours: hours };
    setChapters(updated);
    setHasChanges(true);
  };

  const totalHours = chapters.reduce((sum, ch) => sum + ch.plannedHours, 0);

  const handleSave = () => {
    toast.success("Academic schedule setup saved successfully!");
    setHasChanges(false);
  };

  const canSelectSubject = selectedTrack && (!requiresClass || selectedClass);
  const selectedSubjectInfo = availableSubjects.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Syllabus Setup"
        description="Define planned hours per chapter for the academic year"
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Setup" },
        ]}
      />

      {/* Compact Selection Card */}
      <Card>
        <CardContent className="pt-5 pb-4 space-y-4">
          {/* Row 1: Track Tabs */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground min-w-[60px]">Track</span>
            <Tabs value={selectedTrack} onValueChange={handleTrackChange}>
              <TabsList className="h-9">
                {assignedTracks.map((track) => (
                  <TabsTrigger 
                    key={track.id} 
                    value={track.id}
                    className="px-4 text-sm"
                  >
                    {track.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Row 2: Class Chips (only for curriculum-based tracks) */}
          {requiresClass && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-[60px]">Class</span>
              <div className="flex flex-wrap gap-1.5">
                {availableClassList.map((cls) => {
                  const classNum = cls.name.replace("Class ", "");
                  const isSelected = selectedClass === cls.id;
                  return (
                    <Button
                      key={cls.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-8 min-w-[40px] px-3 font-medium transition-all",
                        isSelected && "shadow-md"
                      )}
                      onClick={() => handleClassChange(cls.id)}
                    >
                      {classNum}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Row 3: Subject Cards */}
          {canSelectSubject && availableSubjects.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-[60px] pt-1.5">Subject</span>
              <div className="flex flex-wrap gap-2">
                {availableSubjects.map((subject) => {
                  const isSelected = selectedSubject === subject.id;
                  const Icon = subject.info?.icon || BookOpen;
                  const colors = getSubjectColor(subject.code);
                  
                  return (
                    <button
                      key={subject.id}
                      onClick={() => handleSubjectChange(subject.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium",
                        isSelected 
                          ? `${colors.bg} ${colors.text} border-transparent shadow-md scale-105` 
                          : "bg-card border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{subject.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state for subjects */}
          {canSelectSubject && availableSubjects.length === 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground min-w-[60px]">Subject</span>
              <span className="text-sm text-muted-foreground italic">No subjects available for this selection</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chapter Hour Allocation */}
      {selectedSubject && chapters.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Chapter Hour Allocation</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubjectInfo?.name} • {chapters.length} chapters
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {existingSetup && (
                  <Badge variant="outline" className="gap-1.5 text-emerald-600 border-emerald-200 bg-emerald-50">
                    <Check className="w-3.5 h-3.5" />
                    Setup Complete
                  </Badge>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">{totalHours} hours</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-3">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.chapterId}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GripVertical className="w-4 h-4" />
                      <span className="text-sm font-medium w-6">{index + 1}.</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{chapter.chapterName}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        value={chapter.plannedHours}
                        onChange={(e) => handleHoursChange(index, parseInt(e.target.value) || 0)}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">hrs</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Save Button */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {hasChanges ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>You have unsaved changes</span>
                  </>
                ) : (
                  <span>All changes saved</span>
                )}
              </div>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges}
                className="gradient-button gap-2"
              >
                <Save className="w-4 h-4" />
                Save Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedSubject && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {!selectedTrack 
                  ? "Select a Track" 
                  : requiresClass && !selectedClass 
                    ? "Select a Class" 
                    : "Select a Subject"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {!selectedTrack 
                  ? "Choose a curriculum or course track to get started."
                  : requiresClass && !selectedClass 
                    ? "Select a class to view available subjects."
                    : "Choose a subject to configure planned hours per chapter."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
