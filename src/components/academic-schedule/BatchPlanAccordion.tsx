import { useState } from "react";
import { ChevronDown, Edit2, Plus, BookOpen, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SubjectPlan {
  subjectId: string;
  subjectName: string;
  chapters: string[];
  chapterNames: string[];
  hasPlans: boolean;
}

interface BatchPlanAccordionProps {
  batchId: string;
  batchName: string;
  className: string;
  subjects: SubjectPlan[];
  isExpanded?: boolean;
  onToggle?: () => void;
  onEditPlan?: (batchId: string, subjectId: string) => void;
  onAddPlan?: (batchId: string, subjectId: string) => void;
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
  jee_phy: "bg-blue-100 text-blue-700 border-blue-200",
  jee_mat: "bg-purple-100 text-purple-700 border-purple-200",
  jee_che: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export function BatchPlanAccordion({
  batchId,
  batchName,
  className,
  subjects,
  isExpanded = true,
  onToggle,
  onEditPlan,
  onAddPlan,
}: BatchPlanAccordionProps) {
  const [open, setOpen] = useState(isExpanded);

  const plannedCount = subjects.filter(s => s.hasPlans).length;
  const totalCount = subjects.length;
  const allPlanned = plannedCount === totalCount;

  const handleToggle = () => {
    setOpen(!open);
    onToggle?.();
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        {/* Header */}
        <CollapsibleTrigger asChild>
          <button
            onClick={handleToggle}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
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
            {subjects.map((subject) => (
              <div
                key={subject.subjectId}
                className="flex items-center justify-between p-3 px-4 hover:bg-muted/30 transition-colors group"
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
                  
                  {/* Chapter Info */}
                  {subject.hasPlans ? (
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm truncate">
                        {subject.chapterNames.slice(0, 2).join(", ")}
                        {subject.chapterNames.length > 2 && ` +${subject.chapterNames.length - 2} more`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      No chapters planned
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="shrink-0 ml-2">
                  {subject.hasPlans ? (
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
                      className="h-8 px-3 border-dashed"
                      onClick={() => onAddPlan?.(batchId, subject.subjectId)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Add Plan
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
