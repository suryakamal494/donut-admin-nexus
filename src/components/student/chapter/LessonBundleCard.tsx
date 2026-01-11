// Lesson Bundle Card - Displays a teacher's lesson plan bundle with attached homework

import { memo } from "react";
import { 
  ChevronRight, 
  Video, 
  FileText, 
  HelpCircle, 
  Beaker, 
  Camera,
  CheckCircle2,
  ClipboardList,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, differenceInDays, isPast } from "date-fns";
import type { LessonBundle, ContentType, HomeworkItem } from "@/data/student/lessonBundles";

const contentIcons: Record<ContentType, typeof Video> = {
  video: Video,
  pdf: FileText,
  quiz: HelpCircle,
  simulation: Beaker,
  document: FileText,
  screenshot: Camera,
};

interface LessonBundleCardProps {
  bundle: LessonBundle;
  linkedHomework?: HomeworkItem[];
  onClick?: () => void;
  onHomeworkClick?: (homeworkId: string) => void;
}

export const LessonBundleCard = memo(function LessonBundleCard({ 
  bundle, 
  linkedHomework = [],
  onClick,
  onHomeworkClick
}: LessonBundleCardProps) {
  const formattedDate = format(parseISO(bundle.date), "MMM d");
  const pendingHomework = linkedHomework.filter(h => !h.isCompleted);
  const hasPendingHomework = pendingHomework.length > 0;

  // Get urgency of closest due homework
  const getHomeworkUrgency = () => {
    if (pendingHomework.length === 0) return null;
    const closestDue = pendingHomework.reduce((closest, hw) => {
      const dueDate = parseISO(hw.dueDate);
      const closestDate = parseISO(closest.dueDate);
      return dueDate < closestDate ? hw : closest;
    });
    const daysUntilDue = differenceInDays(parseISO(closestDue.dueDate), new Date());
    if (isPast(parseISO(closestDue.dueDate))) return "overdue";
    if (daysUntilDue <= 1) return "urgent";
    if (daysUntilDue <= 3) return "soon";
    return "normal";
  };

  const urgency = getHomeworkUrgency();

  return (
    <div className="space-y-1.5">
      {/* Main bundle card */}
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left group",
          "bg-white/70 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/50",
          "p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-300",
          "active:scale-[0.98]",
          bundle.isViewed && "border-l-4 border-l-cyan-400"
        )}
      >
        {/* Header: Date + Title */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Date badge */}
            <div className="inline-flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <span className="font-medium text-cyan-600">{formattedDate}</span>
              <span>•</span>
              <span className="truncate">{bundle.teacherName}</span>
            </div>

            {/* Title only - no description */}
            <h3 className="font-semibold text-sm md:text-base text-foreground leading-snug">
              {bundle.title}
            </h3>
          </div>

          {/* Right: Status indicators */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {bundle.isViewed && (
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-500" />
            )}
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors" />
          </div>
        </div>

        {/* Content summary - compact */}
        <div className="flex items-center gap-2 md:gap-3 mt-2 flex-wrap">
          {bundle.contentSummary.map((content) => {
            const Icon = contentIcons[content.type];
            return (
              <div
                key={content.type}
                className="flex items-center gap-0.5 text-xs text-muted-foreground"
              >
                <Icon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span>{content.count}</span>
              </div>
            );
          })}
          
          {bundle.hasScreenshots && (
            <div className="flex items-center gap-0.5 text-xs text-amber-600">
              <Camera className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span>Notes</span>
            </div>
          )}
        </div>
      </button>

      {/* Attached homework indicator */}
      {hasPendingHomework && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onHomeworkClick && pendingHomework[0]) {
              onHomeworkClick(pendingHomework[0].id);
            }
          }}
          className={cn(
            "w-full text-left",
            "flex items-center gap-2 px-2.5 py-1.5 rounded-lg",
            "transition-all duration-200 active:scale-[0.98]",
            urgency === "overdue" && "bg-red-50 border border-red-200 hover:bg-red-100",
            urgency === "urgent" && "bg-amber-50 border border-amber-200 hover:bg-amber-100",
            urgency === "soon" && "bg-orange-50/60 border border-orange-200 hover:bg-orange-100",
            urgency === "normal" && "bg-slate-50 border border-slate-200 hover:bg-slate-100"
          )}
        >
          {urgency === "overdue" || urgency === "urgent" ? (
            <AlertCircle className={cn(
              "w-3.5 h-3.5 flex-shrink-0",
              urgency === "overdue" ? "text-red-500" : "text-amber-500"
            )} />
          ) : (
            <ClipboardList className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          )}
          <span className={cn(
            "text-xs font-medium",
            urgency === "overdue" && "text-red-700",
            urgency === "urgent" && "text-amber-700",
            (urgency === "soon" || urgency === "normal") && "text-foreground"
          )}>
            Homework: {pendingHomework.length} pending
          </span>
          {pendingHomework[0] && (
            <span className={cn(
              "text-xs ml-auto",
              urgency === "overdue" && "text-red-500",
              urgency === "urgent" && "text-amber-600",
              (urgency === "soon" || urgency === "normal") && "text-muted-foreground"
            )}>
              Due {format(parseISO(pendingHomework[0].dueDate), "MMM d")}
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
        </button>
      )}

      {/* Completed homework indicator (subtle) */}
      {!hasPendingHomework && linkedHomework.length > 0 && (
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Homework completed</span>
        </div>
      )}
    </div>
  );
});

LessonBundleCard.displayName = "LessonBundleCard";
export default LessonBundleCard;
