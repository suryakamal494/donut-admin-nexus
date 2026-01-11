// Content Item Card - Displays individual content items in a bundle with action buttons

import { memo, useMemo } from "react";
import { 
  Play, 
  FileText, 
  HelpCircle, 
  Beaker, 
  CheckCircle2,
  Clock,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { BundleContentItem, ContentType } from "@/data/student/lessonBundles";

const contentConfig: Record<ContentType, {
  icon: typeof Play;
  color: string;
  bgColor: string;
  label: string;
  actionLabel: string;
  buttonVariant: "default" | "outline" | "secondary";
}> = {
  video: {
    icon: Play,
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Video",
    actionLabel: "Play",
    buttonVariant: "default",
  },
  pdf: {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "PDF",
    actionLabel: "View",
    buttonVariant: "outline",
  },
  quiz: {
    icon: HelpCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    label: "Quiz",
    actionLabel: "Start",
    buttonVariant: "default",
  },
  simulation: {
    icon: Beaker,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    label: "Simulation",
    actionLabel: "Open",
    buttonVariant: "outline",
  },
  document: {
    icon: FileText,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    label: "Document",
    actionLabel: "View",
    buttonVariant: "outline",
  },
  screenshot: {
    icon: Eye,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    label: "Note",
    actionLabel: "View",
    buttonVariant: "outline",
  },
};

interface ContentItemCardProps {
  item: BundleContentItem;
  onClick?: () => void;
}

export const ContentItemCard = memo(function ContentItemCard({ item, onClick }: ContentItemCardProps) {
  const config = contentConfig[item.type];
  const Icon = config.icon;

  // Build meta info string - memoized for performance
  const metaInfo = useMemo(() => {
    if (item.duration) return item.duration;
    if (item.pageCount) return `${item.pageCount} pages`;
    if (item.questionCount) return `${item.questionCount} questions`;
    return null;
  }, [item.duration, item.pageCount, item.questionCount]);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left group",
        "bg-white/70 backdrop-blur-xl rounded-xl border border-white/50",
        "p-2.5 md:p-3 shadow-sm hover:shadow-md transition-all duration-300",
        "active:scale-[0.98]",
        item.isCompleted && "border-l-4 border-l-green-400"
      )}
    >
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* Icon */}
        <div className={cn(
          "w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          config.bgColor
        )}>
          <Icon className={cn("w-4 h-4 md:w-5 md:h-5", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "text-[10px] md:text-xs font-semibold px-1.5 py-0.5 rounded",
              config.bgColor,
              config.color
            )}>
              {config.label}
            </span>
            {item.isCompleted && (
              <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-500" />
            )}
          </div>
          <h3 className="font-medium text-foreground text-sm leading-snug mt-0.5 line-clamp-1">
            {item.title}
          </h3>
          {metaInfo && (
            <div className="flex items-center gap-1 mt-0.5 text-[10px] md:text-xs text-muted-foreground">
              <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span>{metaInfo}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          size="sm"
          variant={config.buttonVariant}
          className={cn(
            "flex-shrink-0 h-8 px-3 text-xs font-medium",
            config.buttonVariant === "default" && item.type === "video" && "bg-red-500 hover:bg-red-600",
            config.buttonVariant === "default" && item.type === "quiz" && "bg-purple-500 hover:bg-purple-600"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          {item.isCompleted ? "Review" : config.actionLabel}
        </Button>
      </div>
    </button>
  );
});

ContentItemCard.displayName = "ContentItemCard";
export default ContentItemCard;
