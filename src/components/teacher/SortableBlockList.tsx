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
import { LessonBlockCard } from "./LessonBlockCard";
import type { LessonPlanBlock } from "@/data/teacherData";

interface SortableBlockListProps {
  blocks: LessonPlanBlock[];
  onReorder: (blocks: LessonPlanBlock[]) => void;
  onUpdateBlock: (block: LessonPlanBlock) => void;
  onDeleteBlock: (blockId: string) => void;
  onAIGenerate: (blockId: string, type: string) => void;
  generatingBlockId: string | null;
}

export const SortableBlockList = ({
  blocks,
  onReorder,
  onUpdateBlock,
  onDeleteBlock,
  onAIGenerate,
  generatingBlockId,
}: SortableBlockListProps) => {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <LessonBlockCard
              key={block.id}
              block={block}
              index={index}
              onUpdate={onUpdateBlock}
              onDelete={() => onDeleteBlock(block.id)}
              onAIGenerate={onAIGenerate}
              isGenerating={generatingBlockId === block.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
