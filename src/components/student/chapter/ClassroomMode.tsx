// Classroom Mode - Displays lesson bundles with integrated homework

import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { BookOpen } from "lucide-react";
import { LessonBundleCard } from "./LessonBundleCard";
import { VirtualizedList } from "./VirtualizedList";
import { useToast } from "@/hooks/use-toast";
import type { LessonBundle, HomeworkItem } from "@/data/student/lessonBundles";

interface ClassroomModeProps {
  lessonBundles: LessonBundle[];
  homeworkItems: HomeworkItem[];
}

export function ClassroomMode({ lessonBundles, homeworkItems }: ClassroomModeProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  
  // Group homework by linked session ID
  const homeworkByBundle = useMemo(() => {
    const map = new Map<string, HomeworkItem[]>();
    homeworkItems.forEach(hw => {
      if (hw.linkedSessionId) {
        const existing = map.get(hw.linkedSessionId) || [];
        existing.push(hw);
        map.set(hw.linkedSessionId, existing);
      }
    });
    return map;
  }, [homeworkItems]);

  // Memoize handlers
  const handleBundleClick = useCallback((bundleId: string) => {
    navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}`);
  }, [navigate, subjectId, chapterId]);

  const handleHomeworkClick = useCallback((homeworkId: string) => {
    // Find the homework item
    const homework = homeworkItems.find(hw => hw.id === homeworkId);
    
    if (homework) {
      toast({
        title: "Opening Homework",
        description: `${homework.title} - Homework viewer coming soon!`,
        duration: 2000,
      });
      
      // If homework has linked content, navigate to it
      if (homework.linkedSessionId) {
        navigate(`/student/subjects/${subjectId}/${chapterId}/${homework.linkedSessionId}`);
      }
    }
  }, [homeworkItems, navigate, subjectId, chapterId, toast]);

  // Render function for virtualized list
  const renderBundle = useCallback((bundle: LessonBundle) => {
    const linkedHomework = homeworkByBundle.get(bundle.id) || [];
    return (
      <LessonBundleCard
        bundle={bundle}
        linkedHomework={linkedHomework}
        onClick={() => handleBundleClick(bundle.id)}
        onHomeworkClick={handleHomeworkClick}
      />
    );
  }, [handleBundleClick, handleHomeworkClick, homeworkByBundle]);

  const getBundleKey = useCallback((bundle: LessonBundle) => bundle.id, []);

  return (
    <div className="space-y-3">
      {/* Lesson Bundles Section Header */}
      <div className="flex items-center gap-2 px-1">
        <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-600" />
        <h2 className="text-xs md:text-sm font-semibold text-foreground">CLASS SESSIONS</h2>
        <span className="text-xs text-muted-foreground">({lessonBundles.length})</span>
      </div>

      {/* Virtualized lesson bundles with integrated homework */}
      <VirtualizedList
        items={lessonBundles}
        renderItem={renderBundle}
        getItemKey={getBundleKey}
        estimatedItemHeight={90}
        emptyMessage="No class sessions yet for this chapter"
        emptyIcon={<BookOpen className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground/40 mx-auto" />}
      />
    </div>
  );
}

export default ClassroomMode;
