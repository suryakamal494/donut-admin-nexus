import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { assignedTracks, type AssignedTrack } from "@/data/instituteData";
import { BookMarked } from "lucide-react";
import { toast } from "sonner";

interface AssignCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchName: string;
  currentCourses: string[];
  onSave: (courseIds: string[]) => void;
}

export const AssignCourseDialog = ({
  open,
  onOpenChange,
  batchName,
  currentCourses,
  onSave,
}: AssignCourseDialogProps) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>(currentCourses);

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedCourses(currentCourses);
    }
  }, [open, currentCourses]);

  const handleToggle = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSave = () => {
    onSave(selectedCourses);
    toast.success("Courses assigned successfully");
    onOpenChange(false);
  };

  const getCourseDescription = (track: AssignedTrack) => {
    if (track.type === "curriculum") {
      return "Standard curriculum for board examinations";
    }
    return "Competitive exam preparation course";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-primary" />
            Assign Courses
          </DialogTitle>
          <DialogDescription>
            Select the courses this batch ({batchName}) will follow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {assignedTracks.map((track) => (
            <label
              key={track.id}
              className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                checked={selectedCourses.includes(track.id)}
                onCheckedChange={() => handleToggle(track.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">{track.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {getCourseDescription(track)}
                </p>
              </div>
            </label>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Courses
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
