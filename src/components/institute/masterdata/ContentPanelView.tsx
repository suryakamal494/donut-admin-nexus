import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, BookOpen, FileText, ChevronsUpDown, ChevronsDownUp, Star, BookMarked } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { classes, subjects } from "@/data/mockData";
import { allCBSEChapters, allCBSETopics, CBSEChapter } from "@/data/cbseMasterData";
import { courseChapterMappings, courseOwnedChapters, courseOwnedChapterTopics, curriculums } from "@/data/masterData";

interface ContentPanelViewProps {
  selectedClassId: string | null;
  selectedSubjectId: string | null;
  trackId?: string;
  trackType?: "curriculum" | "course";
}

// Map course subject IDs (1, 2, 3, 4) to display subject IDs
const courseSubjectIdMap: Record<string, string> = {
  "1": "physics",
  "2": "chemistry",
  "3": "mathematics",
  "4": "biology",
};

interface DisplayChapter {
  id: string;
  name: string;
  nameHindi?: string;
  nameTransliterated?: string;
  order: number;
  isCourseOwned: boolean;
  sourceLabel?: string;
  classId?: string;
}

export const ContentPanelView = ({ 
  selectedClassId, 
  selectedSubjectId,
  trackId,
  trackType = "curriculum"
}: ContentPanelViewProps) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Get chapters based on track type
  const displayChapters = useMemo((): DisplayChapter[] => {
    if (trackType === "course" && trackId && selectedSubjectId) {
      const chapters: DisplayChapter[] = [];
      
      // Get the course subject ID
      const courseSubjectId = Object.entries(courseSubjectIdMap)
        .find(([_, displayId]) => displayId === selectedSubjectId)?.[0];
      
      // Get mapped chapters
      const mappings = courseChapterMappings.filter(m => m.courseId === trackId);
      mappings.forEach(mapping => {
        const cbseChapter = allCBSEChapters.find(ch => ch.id === mapping.chapterId);
        if (cbseChapter && cbseChapter.subjectId === selectedSubjectId) {
          // Get curriculum name
          const curriculum = curriculums.find(c => c.id === mapping.sourceCurriculumId);
          const classNum = cbseChapter.classId?.replace('class-', '') || '';
          
          chapters.push({
            id: cbseChapter.id,
            name: cbseChapter.name,
            nameHindi: cbseChapter.nameHindi,
            nameTransliterated: cbseChapter.nameTransliterated,
            order: mapping.order,
            isCourseOwned: false,
            sourceLabel: `From ${curriculum?.code || 'CBSE'} ${classNum}`,
            classId: cbseChapter.classId
          });
        }
      });
      
      // Get owned chapters
      if (courseSubjectId) {
        const owned = courseOwnedChapters.filter(
          c => c.courseId === trackId && c.subjectId === courseSubjectId
        );
        owned.forEach(ch => {
          chapters.push({
            id: ch.id,
            name: ch.name,
            order: 1000 + ch.order, // Put owned chapters after mapped
            isCourseOwned: true,
            sourceLabel: "Course Exclusive"
          });
        });
      }
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return chapters.filter(ch => {
          const chapterMatch = ch.name.toLowerCase().includes(query) ||
            ch.nameHindi?.toLowerCase().includes(query) ||
            ch.nameTransliterated?.toLowerCase().includes(query);
          
          // Check topics too
          const topics = getTopicsForChapter(ch.id, ch.isCourseOwned);
          const topicMatch = topics.some(t => t.name.toLowerCase().includes(query));
          
          return chapterMatch || topicMatch;
        });
      }
      
      return chapters.sort((a, b) => a.order - b.order);
    }
    
    // Curriculum mode
    if (!selectedClassId || !selectedSubjectId) return [];
    
    let chapters = allCBSEChapters.filter(
      ch => ch.classId === selectedClassId && ch.subjectId === selectedSubjectId
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      chapters = chapters.filter(ch => {
        const chapterMatch = ch.name.toLowerCase().includes(query) ||
          ch.nameHindi?.toLowerCase().includes(query) ||
          ch.nameTransliterated?.toLowerCase().includes(query);
        
        const topics = allCBSETopics.filter(t => t.chapterId === ch.id);
        const topicMatch = topics.some(t => t.name.toLowerCase().includes(query));
        
        return chapterMatch || topicMatch;
      });
    }

    return chapters.sort((a, b) => a.order - b.order).map(ch => ({
      id: ch.id,
      name: ch.name,
      nameHindi: ch.nameHindi,
      nameTransliterated: ch.nameTransliterated,
      order: ch.order,
      isCourseOwned: false,
      classId: ch.classId
    }));
  }, [selectedClassId, selectedSubjectId, searchQuery, trackId, trackType]);

  const getTopicsForChapter = (chapterId: string, isCourseOwned: boolean) => {
    if (isCourseOwned) {
      return courseOwnedChapterTopics
        .filter(t => t.chapterId === chapterId)
        .sort((a, b) => a.order - b.order);
    }
    return allCBSETopics
      .filter(t => t.chapterId === chapterId)
      .sort((a, b) => a.order - b.order);
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedChapters(new Set(displayChapters.map(ch => ch.id)));
  };

  const collapseAll = () => {
    setExpandedChapters(new Set());
  };

  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || id;
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || id;

  const renderChapterName = (chapter: DisplayChapter) => {
    if (chapter.nameHindi) {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{chapter.nameHindi}</span>
          {chapter.nameTransliterated && (
            <span className="text-xs text-muted-foreground italic">
              {chapter.nameTransliterated}
            </span>
          )}
        </div>
      );
    }
    return <span className="text-sm font-medium">{chapter.name}</span>;
  };

  const totalTopics = useMemo(() => {
    return displayChapters.reduce((acc, ch) => 
      acc + getTopicsForChapter(ch.id, ch.isCourseOwned).length, 0
    );
  }, [displayChapters]);

  // Check if we should show content
  const shouldShowContent = trackType === "course" 
    ? selectedSubjectId 
    : selectedClassId && selectedSubjectId;

  if (!shouldShowContent) {
    return (
      <div className="flex flex-col h-full bg-card rounded-lg border">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm text-foreground">Chapters & Topics</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {trackType === "course" 
                ? "Select a subject to view chapters"
                : "Select a class and subject to view chapters"
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Group chapters by source for courses
  const groupedChapters = useMemo(() => {
    if (trackType !== "course") return null;
    
    const mapped = displayChapters.filter(ch => !ch.isCourseOwned);
    const owned = displayChapters.filter(ch => ch.isCourseOwned);
    
    // Group mapped by source
    const mappedBySource = mapped.reduce((acc, ch) => {
      const source = ch.sourceLabel || "Other";
      if (!acc[source]) acc[source] = [];
      acc[source].push(ch);
      return acc;
    }, {} as Record<string, DisplayChapter[]>);
    
    return { mappedBySource, owned };
  }, [displayChapters, trackType]);

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      <div className="p-3 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              {getSubjectName(selectedSubjectId!)}
              {selectedClassId && trackType === "curriculum" && ` • ${getClassName(selectedClassId)}`}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {displayChapters.length} chapters • {totalTopics} topics
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={expandAll}
              className="h-7 px-2 text-xs"
            >
              <ChevronsUpDown className="h-3 w-3 mr-1" />
              Expand
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={collapseAll}
              className="h-7 px-2 text-xs"
            >
              <ChevronsDownUp className="h-3 w-3 mr-1" />
              Collapse
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search chapters or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {displayChapters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">
                {searchQuery ? 'No matching chapters found' : 'No chapters available'}
              </p>
            </div>
          ) : trackType === "course" && groupedChapters ? (
            // Course view with grouped chapters
            <>
              {/* Mapped chapters by source */}
              {Object.entries(groupedChapters.mappedBySource).map(([source, chapters]) => (
                <div key={source} className="mb-4">
                  <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
                    <BookMarked className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {source}
                    </span>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                      {chapters.length}
                    </Badge>
                  </div>
                  {chapters.map((chapter) => renderChapterItem(chapter))}
                </div>
              ))}
              
              {/* Owned chapters */}
              {groupedChapters.owned.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                      Course Exclusive
                    </span>
                    <Badge className="text-[10px] h-4 px-1.5 bg-amber-100 text-amber-700 hover:bg-amber-100">
                      {groupedChapters.owned.length}
                    </Badge>
                  </div>
                  {groupedChapters.owned.map((chapter) => renderChapterItem(chapter))}
                </div>
              )}
            </>
          ) : (
            // Curriculum view - simple list
            displayChapters.map((chapter) => renderChapterItem(chapter))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  function renderChapterItem(chapter: DisplayChapter) {
    const topics = getTopicsForChapter(chapter.id, chapter.isCourseOwned);
    const isExpanded = expandedChapters.has(chapter.id);

    return (
      <div key={chapter.id} className={`rounded-md border bg-background ${chapter.isCourseOwned ? 'border-amber-200' : ''}`}>
        <button
          onClick={() => toggleChapter(chapter.id)}
          className="w-full text-left px-3 py-2.5 flex items-start gap-2 hover:bg-muted/50 transition-colors rounded-t-md"
        >
          <span className="mt-0.5 text-muted-foreground">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {chapter.isCourseOwned && (
                <Star className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              )}
              {renderChapterName(chapter)}
            </div>
            <span className="text-xs text-muted-foreground ml-0">
              ({topics.length} topics)
            </span>
          </div>
        </button>

        {isExpanded && topics.length > 0 && (
          <div className="border-t bg-muted/30 px-3 py-2 space-y-1">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center gap-2 px-6 py-1.5 text-sm text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                <span>{topic.name}</span>
              </div>
            ))}
          </div>
        )}

        {isExpanded && topics.length === 0 && (
          <div className="border-t bg-muted/30 px-3 py-3 text-center">
            <span className="text-xs text-muted-foreground">No topics available</span>
          </div>
        )}
      </div>
    );
  }
};
