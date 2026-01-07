import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SortableChapterItemProps {
  id: string;
  name: string;
  sourceLabel?: string;
  isCourseOwned?: boolean;
  onDelete?: (id: string) => void;
}

export const SortableChapterItem = ({
  id,
  name,
  sourceLabel,
  isCourseOwned = false,
  onDelete,
}: SortableChapterItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg group transition-all",
        isCourseOwned 
          ? "bg-primary/5 border border-primary/20" 
          : "bg-background border border-border/50",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary/30"
      )}
    >
      <button
        className="cursor-grab active:cursor-grabbing touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
      </button>
      
      {isCourseOwned && (
        <Star className="w-4 h-4 text-primary flex-shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className={cn(
          "text-xs",
          isCourseOwned ? "text-primary/70" : "text-muted-foreground"
        )}>
          {isCourseOwned ? "Course-Owned" : sourceLabel}
        </p>
      </div>
      
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
        </Button>
      )}
    </div>
  );
};
