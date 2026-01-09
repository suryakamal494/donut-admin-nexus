import { useState } from "react";
import { FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChaptersForCourseBySubject, getSubjectById, courseOwnedChapterTopics } from "@/data/masterData";
import { allCBSETopics } from "@/data/cbseMasterData";
import { toast } from "sonner";
import { ChapterItem, ContentEmptyState } from "./courses";

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
    console.log("Delete chapter:", chapterId);
    toast.success(`Chapter "${chapterName}" removed from course`);
  };

  const handleDeleteTopic = (topicId: string, topicName: string) => {
    console.log("Delete topic:", topicId);
    toast.success(`Topic "${topicName}" removed from course`);
  };

  if (!selectedCourseId) {
    return <ContentEmptyState type="course" />;
  }

  if (!selectedSubjectId) {
    return <ContentEmptyState type="subject" />;
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
                <ChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  topics={topics}
                  isExpanded={isExpanded}
                  onToggle={() => toggleChapter(chapter.id)}
                  onDeleteChapter={handleDeleteChapter}
                  onDeleteTopic={handleDeleteTopic}
                />
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
