import { BookOpen, Layers } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ContentSourceType = 'curriculum' | 'course';

interface SourceTypeSelectorProps {
  value: ContentSourceType;
  onChange: (value: ContentSourceType) => void;
  className?: string;
}

const SourceTypeSelector = ({ value, onChange, className }: SourceTypeSelectorProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>Source Type *</Label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('curriculum')}
          className={cn(
            "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all",
            value === 'curriculum' 
              ? "border-primary bg-primary/5 text-primary" 
              : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Curriculum
        </button>
        <button
          type="button"
          onClick={() => onChange('course')}
          className={cn(
            "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all",
            value === 'course' 
              ? "border-primary bg-primary/5 text-primary" 
              : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <Layers className="w-4 h-4" />
          Course
        </button>
      </div>
    </div>
  );
};

export default SourceTypeSelector;
