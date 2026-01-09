import { Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateCourse: () => void;
}

export const EmptyState = ({ onCreateCourse }: EmptyStateProps) => {
  return (
    <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 shadow-soft p-8 sm:p-12 text-center">
      <Layers className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-muted-foreground/30" />
      <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">Select a Course to Begin</h3>
      <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 px-4">
        Choose an existing course from the dropdown above or create a new one
      </p>
      <Button onClick={onCreateCourse} className="h-8 sm:h-9 text-xs sm:text-sm">
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        Create New Course
      </Button>
    </div>
  );
};
