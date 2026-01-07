import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  Send, 
  Search,
  BookOpen,
  Layers,
  CheckSquare,
  XSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { 
  courses, 
  curriculums, 
  courseChapterMappings,
  getActiveCurriculums,
  getCourseOwnedChapters
} from "@/data/masterData";
import { 
  allCBSEChapters, 
  getChaptersByClassAndSubject 
} from "@/data/cbseMasterData";
import { classes, subjects } from "@/data/mockData";
import { Course, Chapter } from "@/types/masterData";
import { SortableChapterItem } from "@/components/parameters/SortableChapterItem";

interface CourseChapterEntry {
  id: string;
  chapterId: string;
  name: string;
  subjectId: string;
  sourceLabel: string;
  isCourseOwned: boolean;
  order: number;
}

const CourseBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Course selection - initialize from URL if present
  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => {
    const courseFromUrl = searchParams.get('course');
    if (courseFromUrl && courses.find(c => c.id === courseFromUrl)) {
      return courseFromUrl;
    }
    return "";
  });
  const [showCreateCourseDialog, setShowCreateCourseDialog] = useState(false);
  const [showCreateChapterDialog, setShowCreateChapterDialog] = useState(false);
  
  // Source panel filters
  const [sourceCurriculumId, setSourceCurriculumId] = useState<string>("cbse");
  const [sourceClassId, setSourceClassId] = useState<string>("");
  const [sourceSubjectId, setSourceSubjectId] = useState<string>("");
  const [sourceSearchQuery, setSourceSearchQuery] = useState("");
  
  // Selected chapters for adding
  const [selectedChapterIds, setSelectedChapterIds] = useState<Set<string>>(new Set());
  
  // Course content state - persisted chapters
  const [courseContent, setCourseContent] = useState<Record<string, CourseChapterEntry[]>>({});
  const [isDirty, setIsDirty] = useState(false);
  
  // New course form
  const [newCourse, setNewCourse] = useState({
    name: "",
    code: "",
    description: "",
    courseType: "competitive" as Course["courseType"],
    allowedCurriculums: ["cbse"] as string[],
    allowedClasses: [] as string[],
  });
  
  // New chapter form
  const [newChapter, setNewChapter] = useState({
    name: "",
    subjectId: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  
  // Get available chapters from curriculum tree
  const availableChapters = useMemo(() => {
    if (!sourceClassId || !sourceSubjectId) return [];
    
    let chapters = getChaptersByClassAndSubject(sourceClassId, sourceSubjectId);
    
    if (sourceSearchQuery) {
      const query = sourceSearchQuery.toLowerCase();
      chapters = chapters.filter(ch => 
        ch.name.toLowerCase().includes(query) ||
        ch.nameHindi?.toLowerCase().includes(query)
      );
    }
    
    return chapters;
  }, [sourceClassId, sourceSubjectId, sourceSearchQuery]);

  // Get course-owned chapters for selected course
  const ownedChapters = useMemo(() => {
    if (!selectedCourseId) return [];
    return getCourseOwnedChapters(selectedCourseId);
  }, [selectedCourseId]);

  // Get mapped chapters for display (from initial data)
  const initialMappedChapters = useMemo(() => {
    if (!selectedCourseId) return [];
    
    const mappings = courseChapterMappings.filter(m => m.courseId === selectedCourseId);
    return mappings.map(m => {
      const chapter = allCBSEChapters.find(ch => ch.id === m.chapterId);
      const curriculum = curriculums.find(c => c.id === m.sourceCurriculumId);
      const classInfo = classes.find(c => c.id === chapter?.classId);
      return {
        id: m.id,
        chapterId: m.chapterId,
        name: chapter?.name || "",
        subjectId: chapter?.subjectId || "",
        sourceLabel: `${curriculum?.code || ""} ${classInfo?.name || ""}`,
        isCourseOwned: false,
        order: m.order,
      };
    }).filter(m => m.name);
  }, [selectedCourseId]);

  // Initialize course content when course changes
  useMemo(() => {
    if (selectedCourseId && !courseContent[selectedCourseId]) {
      const mapped = initialMappedChapters;
      const owned = ownedChapters.map((ch, idx) => ({
        id: ch.id,
        chapterId: ch.id,
        name: ch.name,
        subjectId: ch.subjectId,
        sourceLabel: "Course-Owned",
        isCourseOwned: true,
        order: mapped.length + idx + 1,
      }));
      setCourseContent(prev => ({
        ...prev,
        [selectedCourseId]: [...mapped, ...owned],
      }));
    }
  }, [selectedCourseId, initialMappedChapters, ownedChapters]);

  const currentCourseChapters = courseContent[selectedCourseId] || [];

  // Group by subject
  const courseContentBySubject = useMemo(() => {
    const grouped: Record<string, CourseChapterEntry[]> = {};
    currentCourseChapters.forEach(ch => {
      if (!grouped[ch.subjectId]) {
        grouped[ch.subjectId] = [];
      }
      grouped[ch.subjectId].push(ch);
    });
    // Sort each group by order
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => a.order - b.order);
    });
    return grouped;
  }, [currentCourseChapters]);

  const handleChapterToggle = (chapterId: string) => {
    const newSet = new Set(selectedChapterIds);
    if (newSet.has(chapterId)) {
      newSet.delete(chapterId);
    } else {
      newSet.add(chapterId);
    }
    setSelectedChapterIds(newSet);
  };

  const handleSelectAll = () => {
    const allIds = new Set(availableChapters.map(ch => ch.id));
    setSelectedChapterIds(allIds);
  };

  const handleClearSelection = () => {
    setSelectedChapterIds(new Set());
  };

  const handleAddSelectedChapters = () => {
    if (selectedChapterIds.size === 0 || !selectedCourseId) {
      toast.error("No chapters selected");
      return;
    }
    
    const existingIds = new Set(currentCourseChapters.map(ch => ch.chapterId));
    const chaptersToAdd: CourseChapterEntry[] = [];
    let duplicateCount = 0;
    
    selectedChapterIds.forEach(chapterId => {
      if (existingIds.has(chapterId)) {
        duplicateCount++;
        return;
      }
      
      const chapter = availableChapters.find(ch => ch.id === chapterId);
      if (chapter) {
        const classInfo = classes.find(c => c.id === chapter.classId);
        chaptersToAdd.push({
          id: `added-${chapterId}-${Date.now()}`,
          chapterId: chapter.id,
          name: chapter.name,
          subjectId: chapter.subjectId,
          sourceLabel: `CBSE ${classInfo?.name || ""}`,
          isCourseOwned: false,
          order: currentCourseChapters.length + chaptersToAdd.length + 1,
        });
      }
    });
    
    if (chaptersToAdd.length > 0) {
      setCourseContent(prev => ({
        ...prev,
        [selectedCourseId]: [...(prev[selectedCourseId] || []), ...chaptersToAdd],
      }));
      setIsDirty(true);
      toast.success(`Added ${chaptersToAdd.length} chapter(s) to course`);
    }
    
    if (duplicateCount > 0) {
      toast.info(`${duplicateCount} chapter(s) already in course`);
    }
    
    setSelectedChapterIds(new Set());
  };

  const handleDeleteChapter = (entryId: string) => {
    if (!selectedCourseId) return;
    
    setCourseContent(prev => ({
      ...prev,
      [selectedCourseId]: prev[selectedCourseId].filter(ch => ch.id !== entryId),
    }));
    setIsDirty(true);
    toast.success("Chapter removed from course");
  };

  const handleDragEnd = (event: DragEndEvent, subjectId: string) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const subjectChapters = courseContentBySubject[subjectId] || [];
      const oldIndex = subjectChapters.findIndex(ch => ch.id === active.id);
      const newIndex = subjectChapters.findIndex(ch => ch.id === over.id);
      
      const reordered = arrayMove(subjectChapters, oldIndex, newIndex);
      
      // Update orders
      const updatedSubjectChapters = reordered.map((ch, idx) => ({
        ...ch,
        order: idx + 1,
      }));
      
      // Merge back into full list
      const otherChapters = currentCourseChapters.filter(ch => ch.subjectId !== subjectId);
      setCourseContent(prev => ({
        ...prev,
        [selectedCourseId]: [...otherChapters, ...updatedSubjectChapters],
      }));
      setIsDirty(true);
    }
  };

  const handleCreateCourse = () => {
    if (!newCourse.name || !newCourse.code) {
      toast.error("Please fill in required fields");
      return;
    }
    
    toast.success(`Course "${newCourse.name}" created`);
    setShowCreateCourseDialog(false);
    setNewCourse({ name: "", code: "", description: "", courseType: "competitive", allowedCurriculums: ["cbse"], allowedClasses: [] });
  };

  const handleCreateChapter = () => {
    if (!newChapter.name || !newChapter.subjectId || !selectedCourseId) {
      toast.error("Please fill in required fields");
      return;
    }
    
    const newEntry: CourseChapterEntry = {
      id: `owned-${Date.now()}`,
      chapterId: `owned-${Date.now()}`,
      name: newChapter.name,
      subjectId: newChapter.subjectId,
      sourceLabel: "Course-Owned",
      isCourseOwned: true,
      order: currentCourseChapters.length + 1,
    };
    
    setCourseContent(prev => ({
      ...prev,
      [selectedCourseId]: [...(prev[selectedCourseId] || []), newEntry],
    }));
    setIsDirty(true);
    
    toast.success(`Course-only chapter "${newChapter.name}" created`);
    setShowCreateChapterDialog(false);
    setNewChapter({ name: "", subjectId: "" });
  };

  const handleSaveDraft = () => {
    setIsDirty(false);
    toast.success("Course saved as draft");
  };

  const handlePublish = () => {
    setIsDirty(false);
    toast.success("Course published successfully");
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || "Unknown";
  };

  const toggleCurriculumSelection = (currId: string) => {
    setNewCourse(prev => ({
      ...prev,
      allowedCurriculums: prev.allowedCurriculums.includes(currId)
        ? prev.allowedCurriculums.filter(c => c !== currId)
        : [...prev.allowedCurriculums, currId]
    }));
  };

  const toggleClassSelection = (classId: string) => {
    setNewCourse(prev => ({
      ...prev,
      allowedClasses: prev.allowedClasses.includes(classId)
        ? prev.allowedClasses.filter(c => c !== classId)
        : [...prev.allowedClasses, classId]
    }));
  };

  return (
    <div className="space-y-4 animate-fade-in h-full">
      <PageHeader
        title="Course Builder"
        description="Build competitive courses by selecting chapters from curriculums"
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Master Data", href: "/superadmin/parameters" },
          { label: "Course Builder" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/superadmin/parameters")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {selectedCourseId && (
              <>
                <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={!isDirty}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button size="sm" onClick={handlePublish}>
                  <Send className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Course Selector */}
      <div className="bg-card rounded-xl p-4 border border-border/50 shadow-soft">
        <div className="flex items-center gap-4 flex-wrap">
          <Label className="text-sm font-medium">Course:</Label>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select or create a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.filter(c => c.isActive).map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  <div className="flex items-center gap-2">
                    <span>{course.name}</span>
                    <Badge variant={course.status === "published" ? "default" : "secondary"} className="text-xs">
                      {course.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowCreateCourseDialog(true)}
          >
            <Plus className="w-4 h-4" />
            New Course
          </Button>
          
          {selectedCourse && (
            <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
              <span>Type: <strong className="text-foreground capitalize">{selectedCourse.courseType}</strong></span>
              <span>Chapters: <strong className="text-foreground">{currentCourseChapters.length}</strong></span>
              {isDirty && <Badge variant="outline" className="text-amber-600 border-amber-300">Unsaved</Badge>}
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      {selectedCourseId ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-320px)] min-h-[500px]">
          {/* Left Panel: Source (Curriculum Tree) */}
          <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/50 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="font-semibold">Source: Curriculum Tree</h3>
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-3 gap-2">
                <Select value={sourceCurriculumId} onValueChange={setSourceCurriculumId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Curriculum" />
                  </SelectTrigger>
                  <SelectContent>
                    {getActiveCurriculums().map((curr) => (
                      <SelectItem key={curr.id} value={curr.id}>{curr.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sourceClassId} onValueChange={(v) => { setSourceClassId(v); setSourceSubjectId(""); setSelectedChapterIds(new Set()); }}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sourceSubjectId} onValueChange={(v) => { setSourceSubjectId(v); setSelectedChapterIds(new Set()); }}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search chapters..." 
                  className="pl-9 h-9"
                  value={sourceSearchQuery}
                  onChange={(e) => setSourceSearchQuery(e.target.value)}
                />
              </div>
              
              {availableChapters.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSelectAll} className="h-7 text-xs">
                    <CheckSquare className="w-3 h-3 mr-1" />
                    Select All
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClearSelection} className="h-7 text-xs">
                    <XSquare className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
            
            <ScrollArea className="flex-1 p-4">
              {!sourceClassId || !sourceSubjectId ? (
                <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                  <BookOpen className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Select a class and subject to view chapters</p>
                </div>
              ) : availableChapters.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">No chapters found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableChapters.map((chapter) => (
                    <label
                      key={chapter.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        selectedChapterIds.has(chapter.id)
                          ? "bg-primary/5 border-primary/30"
                          : "bg-background border-border/50 hover:bg-accent/30"
                      )}
                    >
                      <Checkbox
                        checked={selectedChapterIds.has(chapter.id)}
                        onCheckedChange={() => handleChapterToggle(chapter.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{chapter.name}</p>
                        {chapter.nameHindi && (
                          <p className="text-xs text-muted-foreground truncate">{chapter.nameHindi}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">Ch. {chapter.order}</span>
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            <div className="p-4 border-t border-border/50 space-y-2">
              <Button 
                className="w-full" 
                disabled={selectedChapterIds.size === 0}
                onClick={handleAddSelectedChapters}
              >
                Add Selected ({selectedChapterIds.size}) →
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => setShowCreateChapterDialog(true)}
              >
                <Plus className="w-4 h-4" />
                Create Course-Only Chapter
              </Button>
            </div>
          </div>

          {/* Right Panel: Course Content */}
          <div className="bg-card rounded-xl border border-border/50 shadow-soft overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold">{selectedCourse?.name}</h3>
                </div>
                <Badge variant="outline">
                  {currentCourseChapters.length} Chapters
                </Badge>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              {Object.keys(courseContentBySubject).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                  <Layers className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No chapters added yet</p>
                  <p className="text-xs">Select chapters from the left panel to add them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(courseContentBySubject).map(([subjectId, chapters]) => (
                    <div key={subjectId} className="space-y-2">
                      <div className="flex items-center gap-2 py-2 border-b border-border/30">
                        <span className="text-sm font-semibold text-foreground">
                          {getSubjectName(subjectId)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {chapters.length}
                        </Badge>
                      </div>
                      
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDragEnd(e, subjectId)}
                      >
                        <SortableContext
                          items={chapters.map(ch => ch.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2">
                            {chapters.map((ch) => (
                              <SortableChapterItem
                                key={ch.id}
                                id={ch.id}
                                name={ch.name}
                                sourceLabel={ch.sourceLabel}
                                isCourseOwned={ch.isCourseOwned}
                                onDelete={handleDeleteChapter}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border/50 shadow-soft p-12 text-center">
          <Layers className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold mb-2">Select a Course to Begin</h3>
          <p className="text-muted-foreground mb-4">
            Choose an existing course from the dropdown above or create a new one
          </p>
          <Button onClick={() => setShowCreateCourseDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </div>
      )}

      {/* Create Course Dialog */}
      <Dialog open={showCreateCourseDialog} onOpenChange={setShowCreateCourseDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Create a competitive or foundation course to group chapters from different curriculums.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., IIT-JEE Mains"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseCode">Code *</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., JEEM"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseType">Course Type</Label>
              <Select 
                value={newCourse.courseType} 
                onValueChange={(v) => setNewCourse({ ...newCourse, courseType: v as Course["courseType"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="competitive">Competitive</SelectItem>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="board">Board Preparation</SelectItem>
                  <SelectItem value="olympiad">Olympiad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Allowed Curriculums *</Label>
              <div className="flex flex-wrap gap-2">
                {getActiveCurriculums().map((curr) => (
                  <label key={curr.id} className="flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer hover:bg-accent/30 transition-colors">
                    <Checkbox
                      checked={newCourse.allowedCurriculums.includes(curr.id)}
                      onCheckedChange={() => toggleCurriculumSelection(curr.id)}
                    />
                    <span className="text-sm">{curr.code}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Allowed Classes *</Label>
              <div className="flex flex-wrap gap-2">
                {classes.map((cls) => (
                  <label key={cls.id} className="flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer hover:bg-accent/30 transition-colors">
                    <Checkbox
                      checked={newCourse.allowedClasses.includes(cls.id)}
                      onCheckedChange={() => toggleClassSelection(cls.id)}
                    />
                    <span className="text-sm">{cls.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseDesc">Description</Label>
              <Textarea
                id="courseDesc"
                placeholder="Brief description of the course..."
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCourseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCourse}>Create Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Course-Only Chapter Dialog */}
      <Dialog open={showCreateChapterDialog} onOpenChange={setShowCreateChapterDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Create Course-Only Chapter</DialogTitle>
            <DialogDescription>
              This chapter will only exist inside this course and won't appear in regular curriculum.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chapterName">Chapter Name *</Label>
              <Input
                id="chapterName"
                placeholder="e.g., Advanced Mechanics - Problem Solving"
                value={newChapter.name}
                onChange={(e) => setNewChapter({ ...newChapter, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chapterSubject">Subject *</Label>
              <Select 
                value={newChapter.subjectId} 
                onValueChange={(v) => setNewChapter({ ...newChapter, subjectId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateChapterDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateChapter}>Create Chapter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseBuilder;
