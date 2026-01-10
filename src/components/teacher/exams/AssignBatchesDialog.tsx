import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Check, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { TeacherExam } from "@/data/teacher/types";

interface AssignBatchesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: TeacherExam | null;
  onAssign?: (examId: string, batchIds: string[]) => void;
}

// Mock available batches
const allBatches = [
  { id: "batch-1", name: "JEE 2025 - Morning", students: 45, class: "11th" },
  { id: "batch-2", name: "JEE 2025 - Evening", students: 38, class: "11th" },
  { id: "batch-3", name: "NEET 2025 - A", students: 52, class: "12th" },
  { id: "batch-4", name: "NEET 2025 - B", students: 48, class: "12th" },
  { id: "batch-5", name: "Foundation - Physics", students: 35, class: "10th" },
  { id: "batch-6", name: "Foundation - Chemistry", students: 32, class: "10th" },
];

export const AssignBatchesDialog = ({
  open,
  onOpenChange,
  exam,
  onAssign,
}: AssignBatchesDialogProps) => {
  const isMobile = useIsMobile();
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  // Reset selection when dialog opens with new exam
  useMemo(() => {
    if (exam) {
      setSelectedBatches(exam.batchIds || []);
    }
  }, [exam?.id]);

  if (!exam) return null;

  const toggleBatch = (batchId: string) => {
    setSelectedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId)
        : [...prev, batchId]
    );
  };

  const handleAssign = () => {
    if (selectedBatches.length === 0) {
      toast.error("Please select at least one batch");
      return;
    }
    onAssign?.(exam.id, selectedBatches);
    toast.success(`Exam assigned to ${selectedBatches.length} batch${selectedBatches.length > 1 ? 'es' : ''}`);
    onOpenChange(false);
  };

  const alreadyAssigned = exam.batchIds || [];
  const newlySelected = selectedBatches.filter(id => !alreadyAssigned.includes(id));

  const content = (
    <div className="space-y-4">
      {/* Info */}
      <div className="flex items-start gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          You can assign the same exam to multiple batches. Already assigned batches are shown as checked.
        </span>
      </div>

      {/* Batches List */}
      <ScrollArea className="h-[280px] -mx-1 px-1">
        <div className="space-y-2">
          {allBatches.map((batch) => {
            const isAssigned = alreadyAssigned.includes(batch.id);
            const isSelected = selectedBatches.includes(batch.id);
            
            return (
              <button
                key={batch.id}
                onClick={() => toggleBatch(batch.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                  "active:scale-[0.99]",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  className="pointer-events-none"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{batch.name}</span>
                    {isAssigned && (
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        <Check className="w-2.5 h-2.5 mr-0.5" />
                        Assigned
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {batch.students} students
                    </span>
                    <span>•</span>
                    <span>Class {batch.class}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Summary */}
      {selectedBatches.length > 0 && (
        <div className="flex items-center justify-between text-sm p-2.5 bg-muted/50 rounded-lg">
          <span className="text-muted-foreground">
            {selectedBatches.length} batch{selectedBatches.length > 1 ? 'es' : ''} selected
          </span>
          {newlySelected.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{newlySelected.length} new
            </Badge>
          )}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base">Assign to Batches</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-2">
            {content}
          </div>
          <DrawerFooter className="pt-2">
            <Button onClick={handleAssign} className="w-full gradient-button">
              <Check className="w-4 h-4 mr-2" />
              Assign to {selectedBatches.length} Batch{selectedBatches.length !== 1 ? 'es' : ''}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign to Batches</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} className="gradient-button">
            <Check className="w-4 h-4 mr-2" />
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
