import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, BookOpen, Lock, Maximize2, Minimize2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  physicsChapters, 
  cbseTopics, 
  CBSEChapter, 
  CBSETopic 
} from "@/data/cbseMasterData";
import { currentTeacher } from "@/data/teacherData";
import { cn } from "@/lib/utils";

// Map class IDs to display names
const classIdToName: Record<string, string> = {
  "5": "Class 10",
  "6": "Class 11",
  "7": "Class 12",
};

// Group chapters by class
const getChaptersByClass = () => {
  const grouped: Record<string, CBSEChapter[]> = {};
  
  physicsChapters.forEach(chapter => {
    const className = classIdToName[chapter.classId];
    if (className && (className === "Class 10" || className === "Class 11" || className === "Class 12")) {
      if (!grouped[className]) {
        grouped[className] = [];
      }
      grouped[className].push(chapter);
    }
  });

  // Sort chapters within each class by order
  Object.keys(grouped).forEach(className => {
    grouped[className].sort((a, b) => a.order - b.order);
  });

  return grouped;
};

// Get topics for a chapter
const getTopicsForChapter = (chapterId: string): CBSETopic[] => {
  return cbseTopics
    .filter(topic => topic.chapterId === chapterId)
    .sort((a, b) => a.order - b.order);
};

const Reference = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("Class 11");
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const chaptersByClass = useMemo(() => getChaptersByClass(), []);
  const availableClasses = Object.keys(chaptersByClass).sort();

  // Filter chapters based on search
  const filteredChapters = useMemo(() => {
    const chapters = chaptersByClass[selectedClass] || [];
    
    if (!searchQuery) return chapters;

    const query = searchQuery.toLowerCase();
    return chapters.filter(chapter => {
      // Check chapter name
      if (chapter.name.toLowerCase().includes(query)) return true;
      
      // Check topics
      const topics = getTopicsForChapter(chapter.id);
      return topics.some(topic => topic.name.toLowerCase().includes(query));
    });
  }, [chaptersByClass, selectedClass, searchQuery]);

  // Count total topics for stats
  const totalTopics = useMemo(() => {
    return filteredChapters.reduce((acc, ch) => {
      return acc + getTopicsForChapter(ch.id).length;
    }, 0);
  }, [filteredChapters]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reference Data</h1>
            <p className="text-muted-foreground mt-1">
              CBSE syllabus chapters and topics for your subject
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <Lock className="w-3 h-3" />
            Read-Only
          </Badge>
        </div>

        {/* Subject context */}
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-600 text-white">
            <BookOpen className="w-3 h-3 mr-1" />
            Physics
          </Badge>
          <span className="text-sm text-muted-foreground">
            {filteredChapters.length} chapters • {totalTopics} topics
          </span>
        </div>
      </div>

      {/* Class Tabs */}
      <Tabs value={selectedClass} onValueChange={(v) => { setSelectedClass(v); setExpandedChapters(new Set()); }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <TabsList>
            {availableClasses.map(className => (
              <TabsTrigger key={className} value={className}>
                {className}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              <Minimize2 className="w-3.5 h-3.5 mr-1.5" />
              Collapse All
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chapters and topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Chapter List */}
        {availableClasses.map(className => (
          <TabsContent key={className} value={className} className="mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {className} - Physics
                  <Badge variant="secondary" className="font-normal">
                    {filteredChapters.length} chapters
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-380px)] min-h-[400px]">
                  <div className="divide-y">
                    {filteredChapters.length > 0 ? (
                      filteredChapters.map((chapter, index) => {
                        const topics = getTopicsForChapter(chapter.id);
                        const isExpanded = expandedChapters.has(chapter.id);

                        return (
                          <Collapsible
                            key={chapter.id}
                            open={isExpanded}
                            onOpenChange={() => toggleChapter(chapter.id)}
                          >
                            <CollapsibleTrigger asChild>
                              <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {chapter.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {topics.length} topics
                                  </p>
                                </div>
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                )}
                              </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="pb-4 px-4 pl-16 space-y-1">
                                {topics.length > 0 ? (
                                  topics.map((topic, topicIndex) => (
                                    <div
                                      key={topic.id}
                                      className="flex items-center gap-2 py-2 px-3 rounded-md bg-muted/30 text-sm"
                                    >
                                      <span className="text-muted-foreground text-xs w-5">
                                        {topicIndex + 1}.
                                      </span>
                                      <span>{topic.name}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground italic py-2">
                                    No topics available for this chapter
                                  </p>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                          <Search className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No chapters found matching "{searchQuery}"</p>
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setSearchQuery("")}
                          className="mt-2"
                        >
                          Clear search
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Reference;
