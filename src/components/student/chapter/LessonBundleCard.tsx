// Lesson Bundle Card - Displays a teacher's lesson plan bundle

import { memo } from "react";
import { 
  ChevronRight, 
  Video, 
  FileText, 
  HelpCircle, 
  Beaker, 
  Camera,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import type { LessonBundle, ContentType } from "@/data/student/lessonBundles";

const contentIcons: Record<ContentType, typeof Video> = {
  video: Video,
  pdf: FileText,
  quiz: HelpCircle,
  simulation: Beaker,
  document: FileText,
  screenshot: Camera,
};

const contentLabels: Record<ContentType, string> = {
  video: "video",
  pdf: "PDF",
  quiz: "quiz",
  simulation: "sim",
  document: "doc",
  screenshot: "screenshot",
};

interface LessonBundleCardProps {
  bundle: LessonBundle;
  onClick?: () => void;
}

export const LessonBundleCard = memo(function LessonBundleCard({ bundle, onClick }: LessonBundleCardProps) {
  const formattedDate = format(parseISO(bundle.date), "MMM d");

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left group",
        "bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50",
        "p-4 shadow-sm hover:shadow-md transition-all duration-300",
        "active:scale-[0.98]",
        bundle.isViewed && "border-l-4 border-l-cyan-400"
      )}
    >
      {/* Header: Date + Title */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Date badge */}
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <span className="font-medium text-cyan-600">{formattedDate}</span>
            <span>•</span>
            <span>{bundle.teacherName}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground leading-snug">
            {bundle.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {bundle.description}
          </p>
        </div>

        {/* Right: Status indicators */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {bundle.isViewed && (
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
          )}
          <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors" />
        </div>
      </div>

      {/* Content summary */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        {bundle.contentSummary.map((content) => {
          const Icon = contentIcons[content.type];
          return (
            <div
              key={content.type}
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              <Icon className="w-3.5 h-3.5" />
              <span>
                {content.count} {contentLabels[content.type]}
                {content.count > 1 ? "s" : ""}
              </span>
            </div>
          );
        })}
        
        {bundle.hasScreenshots && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <Camera className="w-3.5 h-3.5" />
            <span>Notes</span>
          </div>
        )}
      </div>
    </button>
  );
});

LessonBundleCard.displayName = "LessonBundleCard";
export default LessonBundleCard;
