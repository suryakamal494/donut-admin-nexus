import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { batches } from "@/data/instituteData";
import { Users } from "lucide-react";

interface AssignBatchesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: { id: string; name: string; batches: string[] };
  onBatchesSaved: (batches: string[]) => void;
}

const AssignBatchesDialog = ({ open, onOpenChange, exam, onBatchesSaved }: AssignBatchesDialogProps) => {
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedBatches(exam.batches || []);
    }
  }, [open, exam.batches]);

  // Group batches by class
  const batchesByClass = batches.reduce((acc, batch) => {
    if (!acc[batch.className]) {
      acc[batch.className] = [];
    }
    acc[batch.className].push(batch);
    return acc;
  }, {} as Record<string, typeof batches>);

  const toggleBatch = (batchId: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) 
        ? prev.filter(b => b !== batchId)
        : [...prev, batchId]
    );
  };

  const handleSave = () => {
    onBatchesSaved(selectedBatches);
    toast.success(`Batches assigned to "${exam.name}"`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Assign Batches
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select batches to assign to "{exam.name}"
          </p>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {Object.entries(batchesByClass).map(([className, classBatches]) => (
              <div key={className} className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">{className}</Label>
                <div className="space-y-1">
                  {classBatches.map((batch) => (
                    <label
                      key={batch.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        selectedBatches.includes(batch.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Checkbox 
                        checked={selectedBatches.includes(batch.id)}
                        onCheckedChange={() => toggleBatch(batch.id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{batch.name}</p>
                        <p className="text-xs text-muted-foreground">{batch.studentCount} students</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Save Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignBatchesDialog;