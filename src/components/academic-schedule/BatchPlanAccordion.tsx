import { useState } from "react";
import { ChevronDown, Edit2, Plus, BookOpen, Calendar, Eye, Lock, Check, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChapterPlanStatus } from "@/types/academicSchedule";

interface ChapterWithStatus {
  chapterId: string;
  chapterName: string;
  status: ChapterPlanStatus;
}

interface SubjectPlan {
  subjectId: string;
  subjectName: string;
  chapters: string[];
  chapterNames: string[];
  chaptersWithStatus?: ChapterWithStatus[];
  hasPlans: boolean;
}

interface BatchPlanAccordionProps {
  batchId: string;
  batchName: string;
  className: string;
  subjects: SubjectPlan[];
  isExpanded?: boolean;
  isPastWeek?: boolean;
  onToggle?: () => void;
  onEditPlan?: (batchId: string, subjectId: string) => void;
  onAddPlan?: (batchId: string, subjectId: string) => void;
  onViewPlan?: (batchId: string, subjectId: string) => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  phy: "bg-blue-100 text-blue-700 border-blue-200",
  mat: "bg-purple-100 text-purple-700 border-purple-200",
  che: "bg-emerald-100 text-emerald-700 border-emerald-200",
  bio: "bg-green-100 text-green-700 border-green-200",
  eng: "bg-orange-100 text-orange-700 border-orange-200",
  cs: "bg-cyan-100 text-cyan-700 border-cyan-200",
  eco: "bg-amber-100 text-amber-700 border-amber-200",
  hin: "bg-red-100 text-red-700 border-red-200",
  sci: "bg-teal-100 text-teal-700 border-teal-200",
  sst: "bg-indigo-100 text-indigo-700 border-indigo-200",
  jee_phy: "bg-blue-100 text-blue-700 border-blue-200",
  jee_mat: "bg-purple-100 text-purple-700 border-purple-200",
  jee_che: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

// Status indicator component for chapters
function ChapterStatusIndicator({ status }: { status: ChapterPlanStatus }) {
  switch (status) {
    case 'completed':
      return (
        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0" title="Completed">
          <Check className="w-2.5 h-2.5 text-emerald-600" />
        </div>
      );
    case 'in_progress':
      return (
        <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center shrink-0" title="In Progress">
          <Loader2 className="w-2.5 h-2.5 text-amber-600" />
        </div>
      );
    case 'pending':
    default:
      return (
        <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center shrink-0" title="Pending">
          <Circle className="w-2 h-2 text-muted-foreground" />
        </div>
      );
  }
}

export function BatchPlanAccordion({
  batchId,
  batchName,
  className,
  subjects,
  isExpanded = true,
  isPastWeek = false,
  onToggle,
  onEditPlan,
  onAddPlan,
  onViewPlan,
}: BatchPlanAccordionProps) {
  const [open, setOpen] = useState(isExpanded);

  const plannedCount = subjects.filter(s => s.hasPlans).length;
  const totalCount = subjects.length;
  const allPlanned = plannedCount === totalCount;

  const handleToggle = () => {
    setOpen(!open);
    onToggle?.();
  };

  // Derive chapter status for display
  const getChapterStatusDisplay = (subject: SubjectPlan) => {
    if (subject.chaptersWithStatus && subject.chaptersWithStatus.length > 0) {
      return subject.chaptersWithStatus;
    }
    // Fall back to chapterNames if no status data, mark as pending for current/future, completed for past
    return subject.chapterNames.map((name, idx) => ({
      chapterId: subject.chapters[idx] || `ch-${idx}`,
      chapterName: name,
      status: isPastWeek ? 'completed' : 'pending' as ChapterPlanStatus,
    }));
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className={cn(
        "rounded-xl border bg-card overflow-hidden shadow-sm transition-all",
        isPastWeek && "opacity-90"
      )}>
        {/* Header */}
        <CollapsibleTrigger asChild>
          <button
            onClick={handleToggle}
            className={cn(
              "w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors",
              isPastWeek && "bg-muted/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isPastWeek ? "bg-muted" : "bg-primary/10"
              )}>
                {isPastWeek ? (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <BookOpen className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-base">{batchName}</h3>
                <p className="text-sm text-muted-foreground">{className}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge 
                variant={allPlanned ? "default" : "secondary"}
                className={cn(
                  "text-xs font-medium",
                  allPlanned && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                {plannedCount}/{totalCount} planned
              </Badge>
              {isPastWeek && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  View Only
                </Badge>
              )}
              <ChevronDown 
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
            </div>
          </button>
        </CollapsibleTrigger>

        {/* Subject Rows */}
        <CollapsibleContent>
          <div className="border-t divide-y">
            {subjects.map((subject) => {
              const chaptersDisplay = getChapterStatusDisplay(subject);
              
              return (
                <div
                  key={subject.subjectId}
                  className={cn(
                    "flex items-center justify-between p-3 px-4 transition-colors group",
                    isPastWeek ? "hover:bg-muted/20" : "hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Subject Badge */}
                    <Badge
                      variant="outline"
                      className={cn(
                        "shrink-0 text-xs font-medium px-2.5 py-0.5",
                        SUBJECT_COLORS[subject.subjectId] || "bg-gray-100 text-gray-700"
                      )}
                    >
                      {subject.subjectName}
                    </Badge>
                    
                    {/* Chapter Info with Status Indicators */}
                    {subject.hasPlans ? (
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto scrollbar-hide">
                          {chaptersDisplay.slice(0, 3).map((chapter, idx) => (
                            <div key={chapter.chapterId} className="flex items-center gap-1.5 shrink-0">
                              <ChapterStatusIndicator status={chapter.status} />
                              <span className={cn(
                                "text-sm truncate max-w-[120px] sm:max-w-[180px]",
                                chapter.status === 'completed' && "line-through text-muted-foreground",
                                chapter.status === 'in_progress' && "font-medium text-amber-700"
                              )}>
                                {chapter.chapterName}
                              </span>
                              {idx < chaptersDisplay.slice(0, 3).length - 1 && chaptersDisplay.length > 1 && (
                                <span className="text-muted-foreground/50 hidden sm:inline">•</span>
                              )}
                            </div>
                          ))}
                          {chaptersDisplay.length > 3 && (
                            <Badge variant="secondary" className="text-xs shrink-0">
                              +{chaptersDisplay.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className={cn(
                        "text-sm italic",
                        isPastWeek ? "text-muted-foreground/60" : "text-muted-foreground"
                      )}>
                        {isPastWeek ? "No chapters were planned" : "No chapters planned"}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 ml-2">
                    {isPastWeek ? (
                      // Past week - View only button
                      subject.hasPlans ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onViewPlan?.(batchId, subject.subjectId)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          View
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground/50 px-2">—</span>
                      )
                    ) : (
                      // Current/Future week - Edit or Add
                      subject.hasPlans ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => onEditPlan?.(batchId, subject.subjectId)}
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 border-dashed border-primary/50 text-primary hover:bg-primary/5"
                          onClick={() => onAddPlan?.(batchId, subject.subjectId)}
                        >
                          <Plus className="w-3.5 h-3.5 mr-1.5" />
                          Add Plan
                        </Button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}