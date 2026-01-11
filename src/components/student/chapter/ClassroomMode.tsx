// Classroom Mode - Displays lesson bundles and homework

import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonBundleCard } from "./LessonBundleCard";
import { HomeworkCard } from "./HomeworkCard";
import type { LessonBundle, HomeworkItem } from "@/data/student/lessonBundles";

interface ClassroomModeProps {
  lessonBundles: LessonBundle[];
  homeworkItems: HomeworkItem[];
}

export function ClassroomMode({ lessonBundles, homeworkItems }: ClassroomModeProps) {
  const navigate = useNavigate();
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  
  const pendingHomework = homeworkItems.filter(h => !h.isCompleted);
  const completedHomework = homeworkItems.filter(h => h.isCompleted);

  const handleBundleClick = (bundleId: string) => {
    navigate(`/student/subjects/${subjectId}/${chapterId}/${bundleId}`);
  };

  return (
    <div className="space-y-6">
      {/* Lesson Bundles Section */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <BookOpen className="w-4 h-4 text-cyan-600" />
          <h2 className="text-sm font-semibold text-foreground">CLASS SESSIONS</h2>
          <span className="text-xs text-muted-foreground">({lessonBundles.length})</span>
        </div>

        {lessonBundles.length > 0 ? (
          <div className="space-y-3">
            {lessonBundles.map((bundle) => (
              <LessonBundleCard
                key={bundle.id}
                bundle={bundle}
                onClick={() => handleBundleClick(bundle.id)}
              />
            ))}
          </div>
        ) : (
          <div className={cn(
            "bg-white/50 backdrop-blur-xl rounded-2xl border border-white/50",
            "p-6 text-center"
          )}>
            <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No class sessions yet for this chapter
            </p>
          </div>
        )}
      </section>

      {/* Homework Section */}
      {(pendingHomework.length > 0 || completedHomework.length > 0) && (
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

          <div className="space-y-3">
            {/* Pending homework first */}
            {pendingHomework.map((homework) => (
              <HomeworkCard
                key={homework.id}
                homework={homework}
                onClick={() => console.log("Start homework:", homework.id)}
              />
            ))}
            
            {/* Completed homework */}
            {completedHomework.map((homework) => (
              <HomeworkCard
                key={homework.id}
                homework={homework}
              />
            ))}
          </div>
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
