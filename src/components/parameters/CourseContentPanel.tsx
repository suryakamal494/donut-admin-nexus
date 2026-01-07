import { Star, BookOpen, ChevronDown, ChevronRight, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getChaptersForCourseBySubject, DisplayChapter, getSubjectById, courseOwnedChapterTopics } from "@/data/masterData";
import { allCBSETopics } from "@/data/cbseMasterData";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CourseContentPanelProps {
  selectedCourseId: string | null;
  selectedSubjectId: string | null;
}

export const CourseContentPanel = ({ 
  selectedCourseId, 
  selectedSubjectId 
}: CourseContentPanelProps) => {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  
  const chapters = selectedCourseId && selectedSubjectId 
    ? getChaptersForCourseBySubject(selectedCourseId, selectedSubjectId)
    : [];

  const subject = selectedSubjectId ? getSubjectById(selectedSubjectId) : null;

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const getTopicsForChapter = (chapterId: string, isCourseOwned: boolean) => {
    if (isCourseOwned) {
      return courseOwnedChapterTopics.filter(t => t.chapterId === chapterId);
    }
    return allCBSETopics.filter(t => t.chapterId === chapterId);
  };

  const handleDeleteChapter = (chapterId: string, chapterName: string) => {
    // TODO: Implement actual deletion
    console.log("Delete chapter:", chapterId);
    toast.success(`Chapter "${chapterName}" removed from course`);
  };

  const handleDeleteTopic = (topicId: string, topicName: string) => {
    // TODO: Implement actual deletion
    console.log("Delete topic:", topicId);
    toast.success(`Topic "${topicName}" removed from course`);
  };

  if (!selectedCourseId) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-border/50 bg-muted/30">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Chapters & Topics
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Select a course to view its content
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedSubjectId) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-border/50 bg-muted/30">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Chapters & Topics
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Select a subject to view chapters
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border/50 bg-muted/30">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          {subject?.name || "Chapters"} - Chapters & Topics
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{chapters.length} chapters</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {chapters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No chapters found</p>
            </div>
          ) : (
            chapters.map((chapter) => {
              const topics = getTopicsForChapter(chapter.id, chapter.isCourseOwned);
              const isExpanded = expandedChapters.has(chapter.id);
              
              return (
                <Collapsible 
                  key={chapter.id}
                  open={isExpanded}
                  onOpenChange={() => toggleChapter(chapter.id)}
                >
                  <div className={cn(
                    "rounded-lg border transition-all group/chapter",
                    chapter.isCourseOwned 
                      ? "border-coral-200 dark:border-coral-800/50 bg-coral-50/50 dark:bg-coral-950/20" 
                      : "border-border/50 bg-card"
                  )}>
                    <CollapsibleTrigger asChild>
                      <button className="w-full p-3 flex items-start gap-3 text-left hover:bg-muted/30 rounded-lg transition-colors">
                        <span className="mt-0.5 text-muted-foreground">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </span>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            {chapter.isCourseOwned ? (
                              <Star className="w-4 h-4 text-coral-500 mt-0.5 shrink-0" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground">
                                {chapter.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-[10px] px-1.5 py-0 h-4 border-0",
                                    chapter.isCourseOwned
                                      ? "bg-coral-500/10 text-coral-600 dark:text-coral-400"
                                      : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                                  )}
                                >
                                  {chapter.sourceLabel}
                                </Badge>
                                {topics.length > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    {topics.length} topic{topics.length !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Delete Chapter Button */}
                        <div className="opacity-0 group-hover/chapter:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive">
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Chapter</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Remove "{chapter.name}" from this course? This won't delete the chapter from the curriculum.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDeleteChapter(chapter.id, chapter.name)}
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      {topics.length > 0 && (
                        <div className="px-3 pb-3 pt-0">
                          <div className="ml-9 pl-3 border-l-2 border-muted space-y-1.5">
                            {topics.map((topic, index) => (
                              <div 
                                key={topic.id}
                                className="flex items-center gap-2 py-1.5 px-2 rounded text-sm hover:bg-muted/30 transition-colors group/topic"
                              >
                                <span className="text-xs text-muted-foreground w-5">
                                  {index + 1}.
                                </span>
                                <span className="text-foreground flex-1">{topic.name}</span>
                                
                                {/* Delete Topic Button */}
                                <div className="opacity-0 group-hover/topic:opacity-100 transition-opacity">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="w-6 h-6 text-destructive">
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Remove Topic</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Remove "{topic.name}" from this course?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          onClick={() => handleDeleteTopic(topic.id, topic.name)}
                                        >
                                          Remove
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
