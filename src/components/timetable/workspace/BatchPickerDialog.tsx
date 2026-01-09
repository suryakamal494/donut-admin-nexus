import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TeacherLoad } from "@/data/timetableData";

interface BatchPickerDialogProps {
  open: boolean;
  onClose: () => void;
  teacher: TeacherLoad | null;
  day: string;
  period: number;
  onSelectBatch: (batchId: string, batchName: string, subject: string) => void;
  getBatchConflict: (batchId: string) => boolean;
}

export const BatchPickerDialog = ({
  open,
  onClose,
  teacher,
  day,
  period,
  onSelectBatch,
  getBatchConflict,
}: BatchPickerDialogProps) => {
  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Batch</DialogTitle>
          <DialogDescription>
            {teacher.teacherName} • {day} P{period}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 mt-4">
          {teacher.allowedBatches.map((batch) => {
            const hasConflict = getBatchConflict(batch.batchId);
            return (
              <Button
                key={batch.batchId}
                variant={hasConflict ? "outline" : "secondary"}
                className={cn(
                  "justify-start h-auto py-3 px-4",
                  hasConflict && "opacity-50 cursor-not-allowed"
                )}
                disabled={hasConflict}
                onClick={() => {
                  onSelectBatch(batch.batchId, batch.batchName, batch.subject);
                  onClose();
                }}
              >
                <div className="text-left">
                  <p className="font-medium">{batch.batchName}</p>
                  <p className="text-xs text-muted-foreground">{batch.subject}</p>
                </div>
                {hasConflict && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    Busy
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
