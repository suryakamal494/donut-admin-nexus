import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, BookOpen, FileText, ChevronsUpDown, ChevronsDownUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { classes, subjects } from "@/data/mockData";
import { allCBSEChapters, allCBSETopics, CBSEChapter } from "@/data/cbseMasterData";

interface ContentPanelViewProps {
  selectedClassId: string | null;
  selectedSubjectId: string | null;
}

export const ContentPanelView = ({ selectedClassId, selectedSubjectId }: ContentPanelViewProps) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChapters = useMemo(() => {
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

    return chapters.sort((a, b) => a.order - b.order);
  }, [selectedClassId, selectedSubjectId, searchQuery]);

  const getTopics = (chapterId: string) => {
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
    setExpandedChapters(new Set(filteredChapters.map(ch => ch.id)));
  };

  const collapseAll = () => {
    setExpandedChapters(new Set());
  };

  const getClassName = (id: string) => classes.find(c => c.id === id)?.name || id;
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || id;

  const renderChapterName = (chapter: CBSEChapter) => {
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
    return filteredChapters.reduce((acc, ch) => acc + getTopics(ch.id).length, 0);
  }, [filteredChapters]);

  if (!selectedClassId || !selectedSubjectId) {
    return (
      <div className="flex flex-col h-full bg-card rounded-lg border">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm text-foreground">Chapters & Topics</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a class and subject to view chapters</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      <div className="p-3 border-b space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              {getSubjectName(selectedSubjectId)} • {getClassName(selectedClassId)}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filteredChapters.length} chapters • {totalTopics} topics
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
          {filteredChapters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">
                {searchQuery ? 'No matching chapters found' : 'No chapters available'}
              </p>
            </div>
          ) : (
            filteredChapters.map((chapter) => {
              const topics = getTopics(chapter.id);
              const isExpanded = expandedChapters.has(chapter.id);

              return (
                <div key={chapter.id} className="rounded-md border bg-background">
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
                      {renderChapterName(chapter)}
                      <span className="text-xs text-muted-foreground ml-2">
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
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
