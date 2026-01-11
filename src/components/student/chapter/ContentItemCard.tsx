// Content Item Card - Displays individual content items in a bundle

import { 
  Play, 
  FileText, 
  HelpCircle, 
  Beaker, 
  CheckCircle2,
  ChevronRight,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BundleContentItem, ContentType } from "@/data/student/lessonBundles";

const contentConfig: Record<ContentType, {
  icon: typeof Play;
  color: string;
  bgColor: string;
  label: string;
}> = {
  video: {
    icon: Play,
    color: "text-red-600",
    bgColor: "bg-red-100",
    label: "Video",
  },
  pdf: {
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "PDF",
  },
  quiz: {
    icon: HelpCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    label: "Quiz",
  },
  simulation: {
    icon: Beaker,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    label: "Simulation",
  },
  document: {
    icon: FileText,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    label: "Document",
  },
  screenshot: {
    icon: FileText,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    label: "Note",
  },
};

interface ContentItemCardProps {
  item: BundleContentItem;
  onClick?: () => void;
}

export function ContentItemCard({ item, onClick }: ContentItemCardProps) {
  const config = contentConfig[item.type];
  const Icon = config.icon;

  // Build meta info string
  const getMetaInfo = () => {
    if (item.duration) return item.duration;
    if (item.pageCount) return `${item.pageCount} pages`;
    if (item.questionCount) return `${item.questionCount} questions`;
    return null;
  };

  const metaInfo = getMetaInfo();

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left group",
        "bg-white/70 backdrop-blur-xl rounded-xl border border-white/50",
        "p-3 shadow-sm hover:shadow-md transition-all duration-300",
        "active:scale-[0.98]",
        item.isCompleted && "border-l-4 border-l-green-400"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          config.bgColor
        )}>
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              config.bgColor,
              config.color
            )}>
              {config.label}
            </span>
            {item.isCompleted && (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            )}
          </div>
          <h3 className="font-medium text-foreground text-sm mt-1 leading-snug">
            {item.title}
          </h3>
          {metaInfo && (
            <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{metaInfo}</span>
            </div>
          )}
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors flex-shrink-0" />
      </div>
    </button>
  );
}

export default ContentItemCard;
