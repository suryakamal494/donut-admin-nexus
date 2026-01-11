// Classroom Mode - Displays lesson bundles and homework with virtualization

import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { BookOpen, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonBundleCard } from "./LessonBundleCard";
import { HomeworkCard } from "./HomeworkCard";
import { VirtualizedList } from "./VirtualizedList";
import type { LessonBundle, HomeworkItem } from "@/data/student/lessonBundles";

interface ClassroomModeProps {
  lessonBundles: LessonBundle[];
  homeworkItems: HomeworkItem[];
}

export function ClassroomMode({ lessonBundles, homeworkItems }: ClassroomModeProps) {
  const navigate = useNavigate();
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  
  // Memoize filtered lists
  const pendingHomework = useMemo(
    () => homeworkItems.filter(h => !h.isCompleted),
    [homeworkItems]
  );
  const completedHomework = useMemo(
    () => homeworkItems.filter(h => h.isCompleted),
    [homeworkItems]
  );

  // Memoize handlers
  const handleBundleClick = useCallback((bundleId: string) => {
    navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}`);
  }, [navigate, subjectId, chapterId]);

  const handleHomeworkClick = useCallback((homeworkId: string) => {
    console.log("Start homework:", homeworkId);
  }, []);

  // Render functions for virtualized lists
  const renderBundle = useCallback((bundle: LessonBundle) => (
    <LessonBundleCard
      bundle={bundle}
      onClick={() => handleBundleClick(bundle.id)}
    />
  ), [handleBundleClick]);

  const renderHomework = useCallback((homework: HomeworkItem) => (
    <HomeworkCard
      homework={homework}
      onClick={!homework.isCompleted ? () => handleHomeworkClick(homework.id) : undefined}
    />
  ), [handleHomeworkClick]);

  const getBundleKey = useCallback((bundle: LessonBundle) => bundle.id, []);
  const getHomeworkKey = useCallback((homework: HomeworkItem) => homework.id, []);

  // Combine pending and completed homework for single virtualized list
  const allHomework = useMemo(
    () => [...pendingHomework, ...completedHomework],
    [pendingHomework, completedHomework]
  );

  return (
    <div className="space-y-6">
      {/* Lesson Bundles Section */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <BookOpen className="w-4 h-4 text-cyan-600" />
          <h2 className="text-sm font-semibold text-foreground">CLASS SESSIONS</h2>
          <span className="text-xs text-muted-foreground">({lessonBundles.length})</span>
        </div>

        <VirtualizedList
          items={lessonBundles}
          renderItem={renderBundle}
          getItemKey={getBundleKey}
          estimatedItemHeight={100}
          emptyMessage="No class sessions yet for this chapter"
          emptyIcon={<BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto" />}
        />
      </section>

      {/* Homework Section */}
      {allHomework.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <ClipboardList className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-foreground">HOMEWORK</h2>
            {pendingHomework.length > 0 && (
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                "bg-amber-100 text-amber-700"
              )}>
                {pendingHomework.length} pending
              </span>
            )}
          </div>

          <VirtualizedList
            items={allHomework}
            renderItem={renderHomework}
            getItemKey={getHomeworkKey}
            estimatedItemHeight={80}
          />
        </section>
      )}

      {/* Empty state for no homework */}
      {homeworkItems.length === 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3 px-1">
            <ClipboardList className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-foreground">HOMEWORK</h2>
          </div>
          
          <div className={cn(
            "bg-white/50 backdrop-blur-xl rounded-2xl border border-white/50",
            "p-6 text-center"
          )}>
            <ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No homework assigned yet
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export default ClassroomMode;
