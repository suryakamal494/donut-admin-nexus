import { memo } from "react";
import { Trash2, Copy, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Slide {
  id: string;
  title: string;
  content: string;
}

interface SlideCardProps {
  slide: Slide;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const SlideCard = memo(function SlideCard({
  slide,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
}: SlideCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative bg-card rounded-xl border p-3 cursor-pointer transition-all",
        isSelected
          ? "border-primary shadow-md ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex items-start gap-2">
        <div className="text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {index + 1}
            </span>
            <h4 className="text-sm font-medium truncate">{slide.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {slide.content.substring(0, 80)}...
          </p>
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicate slide"
        >
          <Copy className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete slide"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
});
