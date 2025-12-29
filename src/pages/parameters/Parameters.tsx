import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, GripVertical, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classes, courses, subjects, chapters, topics } from "@/data/mockData";
import { cn } from "@/lib/utils";

type Tab = "classes" | "courses" | "curriculum" | "subjects" | "chapters" | "topics";

const tabs: { id: Tab; label: string }[] = [
  { id: "classes", label: "Classes" },
  { id: "courses", label: "Courses" },
  { id: "curriculum", label: "Curriculum" },
  { id: "subjects", label: "Subjects" },
  { id: "chapters", label: "Chapters" },
  { id: "topics", label: "Topics" },
];

const curriculums = [
  { id: "1", name: "CBSE", code: "CBSE", description: "Central Board" },
  { id: "2", name: "ICSE", code: "ICSE", description: "Indian Certificate" },
  { id: "3", name: "State Board", code: "STATE", description: "Various States" },
];

const Parameters = () => {
  const [activeTab, setActiveTab] = useState<Tab>("classes");
  
  // Hierarchical filter states
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  // Reset dependent selections when parent changes
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedSubjectId("");
    setSelectedChapterId("");
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedChapterId("");
  };

  // Filtered data based on selections
  const filteredChapters = useMemo(() => {
    if (!selectedClassId || !selectedSubjectId) return [];
    return chapters.filter(
      ch => ch.classId === selectedClassId && ch.subjectId === selectedSubjectId
    );
  }, [selectedClassId, selectedSubjectId]);

  const chaptersForTopicDropdown = useMemo(() => {
    if (!selectedClassId || !selectedSubjectId) return [];
    return chapters.filter(
      ch => ch.classId === selectedClassId && ch.subjectId === selectedSubjectId
    );
  }, [selectedClassId, selectedSubjectId]);

  const filteredTopics = useMemo(() => {
    if (!selectedChapterId) return [];
    return topics.filter(t => t.chapterId === selectedChapterId);
  }, [selectedChapterId]);

  // Get names for display
  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || "";
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || "";
  const getChapterName = (id: string) => chapters.find(c => c.id === id)?.name || "";

  const getActiveData = () => {
    switch (activeTab) {
      case "classes": return classes;
      case "courses": return courses;
      case "curriculum": return curriculums;
      case "subjects": return subjects;
      case "chapters": return filteredChapters;
      case "topics": return filteredTopics;
      default: return [];
    }
  };

  const renderFilters = () => {
    if (activeTab === "chapters") {
      return (
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-sm text-muted-foreground mb-2 block">Select Class</Label>
            <Select value={selectedClassId} onValueChange={handleClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class..." />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label className="text-sm text-muted-foreground mb-2 block">Select Subject</Label>
            <Select 
              value={selectedSubjectId} 
              onValueChange={handleSubjectChange}
              disabled={!selectedClassId}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedClassId ? "Choose a subject..." : "Select class first"} />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(sub => (
                  <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (activeTab === "topics") {
      return (
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex-1 min-w-[180px]">
            <Label className="text-sm text-muted-foreground mb-2 block">Select Class</Label>
            <Select value={selectedClassId} onValueChange={handleClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class..." />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <Label className="text-sm text-muted-foreground mb-2 block">Select Subject</Label>
            <Select 
              value={selectedSubjectId} 
              onValueChange={handleSubjectChange}
              disabled={!selectedClassId}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedClassId ? "Choose a subject..." : "Select class first"} />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(sub => (
                  <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <Label className="text-sm text-muted-foreground mb-2 block">Select Chapter</Label>
            <Select 
              value={selectedChapterId} 
              onValueChange={setSelectedChapterId}
              disabled={!selectedSubjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedSubjectId ? "Choose a chapter..." : "Select subject first"} />
              </SelectTrigger>
              <SelectContent>
                {chaptersForTopicDropdown.map(ch => (
                  <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderBreadcrumb = () => {
    if (activeTab === "chapters" && selectedClassId && selectedSubjectId) {
      return (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{getSubjectName(selectedSubjectId)}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-muted-foreground">{getClassName(selectedClassId)}</span>
          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {filteredChapters.length} chapter{filteredChapters.length !== 1 ? 's' : ''}
          </span>
        </div>
      );
    }

    if (activeTab === "topics" && selectedChapterId) {
      return (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Layers className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">{getSubjectName(selectedSubjectId)}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-muted-foreground">{getClassName(selectedClassId)}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-muted-foreground">{getChapterName(selectedChapterId)}</span>
          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {filteredTopics.length} topic{filteredTopics.length !== 1 ? 's' : ''}
          </span>
        </div>
      );
    }

    return null;
  };

  const renderEmptyState = () => {
    if (activeTab === "chapters") {
      if (!selectedClassId || !selectedSubjectId) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Select a class and subject</p>
            <p className="text-sm">Choose a class and subject from the dropdowns above to view or add chapters.</p>
          </div>
        );
      }
      if (filteredChapters.length === 0) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No chapters found</p>
            <p className="text-sm">Click "Add Chapter" to create chapters for {getSubjectName(selectedSubjectId)} - {getClassName(selectedClassId)}.</p>
          </div>
        );
      }
    }

    if (activeTab === "topics") {
      if (!selectedClassId || !selectedSubjectId || !selectedChapterId) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Select class, subject, and chapter</p>
            <p className="text-sm">Choose from the dropdowns above to view or add topics.</p>
          </div>
        );
      }
      if (filteredTopics.length === 0) {
        return (
          <div className="text-center py-12 text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No topics found</p>
            <p className="text-sm">Click "Add Topic" to create topics for this chapter.</p>
          </div>
        );
      }
    }

    return null;
  };

  const canAddItem = () => {
    if (activeTab === "chapters") return selectedClassId && selectedSubjectId;
    if (activeTab === "topics") return selectedClassId && selectedSubjectId && selectedChapterId;
    return true;
  };

  const renderAddDialog = () => {
    if (activeTab === "chapters") {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Chapter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Class</Label>
                <Input value={getClassName(selectedClassId)} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Subject</Label>
                <Input value={getSubjectName(selectedSubjectId)} disabled className="bg-muted/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Chapter Name</Label>
              <Input placeholder="Enter chapter name" />
            </div>
            <div className="space-y-2">
              <Label>Order/Position</Label>
              <Input type="number" placeholder="1" defaultValue={filteredChapters.length + 1} />
            </div>
            <Button className="w-full gradient-button">Save Chapter</Button>
          </div>
        </DialogContent>
      );
    }

    if (activeTab === "topics") {
      return (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Class</Label>
                <Input value={getClassName(selectedClassId)} disabled className="bg-muted/50 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Subject</Label>
                <Input value={getSubjectName(selectedSubjectId)} disabled className="bg-muted/50 text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Chapter</Label>
                <Input value={getChapterName(selectedChapterId)} disabled className="bg-muted/50 text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Topic Name</Label>
              <Input placeholder="Enter topic name" />
            </div>
            <div className="space-y-2">
              <Label>Order/Position</Label>
              <Input type="number" placeholder="1" defaultValue={filteredTopics.length + 1} />
            </div>
            <Button className="w-full gradient-button">Save Topic</Button>
          </div>
        </DialogContent>
      );
    }

    // Default dialog for other tabs
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {activeTab.slice(0, -1)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder={`Enter ${activeTab.slice(0, -1)} name`} />
          </div>
          <div className="space-y-2">
            <Label>Code</Label>
            <Input placeholder="Enter code" />
          </div>
          <Button className="w-full gradient-button">Save</Button>
        </div>
      </DialogContent>
    );
  };

  const activeData = getActiveData();
  const showList = activeTab !== "chapters" && activeTab !== "topics" 
    ? true 
    : (activeTab === "chapters" ? filteredChapters.length > 0 : filteredTopics.length > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Global Parameters"
        description="Manage classes, courses, subjects, and content hierarchy"
        breadcrumbs={[{ label: "Dashboard", href: "/superadmin/dashboard" }, { label: "Parameters" }]}
      />

      {/* Tabs */}
      <div className="bg-card rounded-2xl p-2 shadow-soft border border-border/50 inline-flex gap-1 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTab === tab.id ? "gradient-button text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold capitalize">{activeTab}</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="gradient-button gap-2"
                disabled={!canAddItem()}
              >
                <Plus className="w-4 h-4" />
                Add {activeTab.slice(0, -1)}
              </Button>
            </DialogTrigger>
            {renderAddDialog()}
          </Dialog>
        </div>

        {/* Hierarchical Filters */}
        {renderFilters()}

        {/* Breadcrumb */}
        {renderBreadcrumb()}

        {/* Empty State or List */}
        {renderEmptyState()}

        {showList && (
          <div className="space-y-2">
            {activeData.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors">
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.code || item.description || `Order: ${item.order}`}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Parameters;
