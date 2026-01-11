// Bundle Header - Displays bundle info with teacher and date

import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import type { LessonBundle, BundleContentItem } from "@/data/student/lessonBundles";

interface BundleHeaderProps {
  bundle: LessonBundle;
  contentItems: BundleContentItem[];
  subjectName: string;
  chapterName: string;
  onBack: () => void;
}

export function BundleHeader({ 
  bundle, 
  contentItems, 
  subjectName, 
  chapterName,
  onBack 
}: BundleHeaderProps) {
  const completedCount = contentItems.filter(c => c.isCompleted).length;
  const totalCount = contentItems.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <div className="space-y-3">
      {/* Back button with breadcrumb */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span className="text-sm">
          {chapterName}
        </span>
      </Button>

      {/* Bundle info card */}
      <div className={cn(
        "bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50",
        "p-4 shadow-sm",
        allCompleted && "border-l-4 border-l-green-400"
      )}>
        {/* Top: Date and teacher */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-600" />
            <span className="font-medium text-cyan-600">
              {format(parseISO(bundle.date), "MMMM d, yyyy")}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{bundle.teacherName}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-bold text-xl text-foreground leading-snug">
          {bundle.title}
        </h1>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mt-1">
          {bundle.description}
        </p>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          {allCompleted ? (
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">All content completed!</span>
            </div>
          ) : (
            <>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {completedCount}/{totalCount} done
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BundleHeader;
