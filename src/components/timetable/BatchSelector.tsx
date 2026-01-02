import { cn } from "@/lib/utils";
import { Batch } from "@/data/instituteData";
import { TeacherLoad } from "@/data/timetableData";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Check } from "lucide-react";

interface BatchSelectorProps {
  batches: Batch[];
  selectedBatchId?: string | null;
  onSelect: (batchId: string) => void;
  allowedBatchIds?: string[];
  teacherView?: boolean;
}

export const BatchSelector = ({
  batches,
  selectedBatchId,
  onSelect,
  allowedBatchIds,
  teacherView = false,
}: BatchSelectorProps) => {
  // Group batches by class
  const groupedBatches = batches.reduce((acc, batch) => {
    if (!acc[batch.className]) {
      acc[batch.className] = [];
    }
    acc[batch.className].push(batch);
    return acc;
  }, {} as Record<string, Batch[]>);

  const isAllowed = (batchId: string) => {
    if (!allowedBatchIds) return true;
    return allowedBatchIds.includes(batchId);
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedBatches).map(([className, classBatches]) => (
        <div key={className}>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {className}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {classBatches.map(batch => {
              const isSelected = selectedBatchId === batch.id;
              const allowed = isAllowed(batch.id);
              
              return (
                <button
                  key={batch.id}
                  onClick={() => allowed && onSelect(batch.id)}
                  disabled={!allowed}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left",
                    isSelected && "border-primary bg-primary/5 shadow-sm",
                    !isSelected && allowed && "border-border hover:border-primary/50 hover:bg-muted/30",
                    !allowed && "opacity-50 cursor-not-allowed bg-muted/20"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    isSelected ? "bg-primary text-white" : "bg-primary/10"
                  )}>
                    {isSelected ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <BookOpen className={cn("w-4 h-4", isSelected ? "text-white" : "text-primary")} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{batch.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{batch.studentCount} students</span>
                    </div>
                  </div>
                  {!allowed && teacherView && (
                    <Badge variant="outline" className="text-xs">
                      Not Assigned
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
