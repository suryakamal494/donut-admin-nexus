import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, BookOpen, Play, HelpCircle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceBlock } from "./WorkspaceBlock";
import { ContentPreviewDialog } from "./ContentPreviewDialog";
import { blockTypeConfig, type LessonPlanBlock, type BlockType } from "./types";
import { cn } from "@/lib/utils";

interface WorkspaceCanvasProps {
  blocks: LessonPlanBlock[];
  onReorder: (blocks: LessonPlanBlock[]) => void;
  onEditBlock: (block: LessonPlanBlock) => void;
  onDeleteBlock: (blockId: string) => void;
  onAddBetween: (index: number, type: BlockType) => void;
}

export const WorkspaceCanvas = ({
  blocks,
  onReorder,
  onEditBlock,
  onDeleteBlock,
  onAddBetween,
}: WorkspaceCanvasProps) => {
  const [previewBlock, setPreviewBlock] = useState<LessonPlanBlock | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      onReorder(newBlocks);
    }
  };

  // Empty State
  if (blocks.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border-2 border-dashed border-border/60 p-8 sm:p-12">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-[hsl(var(--donut-pink))]/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Start building your lesson
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Use the toolbar above to add teaching blocks. Drag and drop to reorder.
          </p>
          
          <div className="grid grid-cols-2 gap-3 text-left">
            {(['explain', 'demonstrate', 'quiz', 'homework'] as BlockType[]).map((type) => {
              const config = blockTypeConfig[type];
              const Icon = type === 'explain' ? BookOpen 
                : type === 'demonstrate' ? Play 
                : type === 'quiz' ? HelpCircle 
                : ClipboardList;
              
              return (
                <div 
                  key={type}
                  className={cn(
                    "flex items-start gap-2 p-3 rounded-lg",
                    config.bgColor
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                    config.color
                  )}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium">{config.label}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {config.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={blocks.map(b => b.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {blocks.map((block, index) => (
            <div key={block.id}>
              <WorkspaceBlock
                block={block}
                index={index}
                onEdit={onEditBlock}
                onDelete={onDeleteBlock}
                onPreview={(block) => setPreviewBlock(block)}
              />
              
              {/* Add Between Button */}
              {index < blocks.length - 1 && (
                <div className="flex items-center justify-center py-1 group/add">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-6 px-3 text-xs gap-1",
                      "opacity-0 group-hover/add:opacity-100 transition-opacity",
                      "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )}
                    onClick={() => onAddBetween(index + 1, 'explain')}
                  >
                    <Plus className="w-3 h-3" />
                    Add block
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content Preview Dialog */}
        <ContentPreviewDialog
          open={!!previewBlock}
          onOpenChange={(open) => !open && setPreviewBlock(null)}
          block={previewBlock}
        />
      </SortableContext>
    </DndContext>
  );
};
