import { 
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableChapterItem } from "@/components/parameters/SortableChapterItem";
import { CourseChapterEntry } from "@/hooks/useCourseBuilder";
import { SensorDescriptor, SensorOptions } from "@dnd-kit/core";

interface TargetPanelProps {
  courseName: string;
  courseContentBySubject: Record<string, CourseChapterEntry[]>;
  totalChapters: number;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragEnd: (event: DragEndEvent, subjectId: string) => void;
  onDeleteChapter: (entryId: string) => void;
  getSubjectName: (subjectId: string) => string;
}

export const TargetPanel = ({
  courseName,
  courseContentBySubject,
  totalChapters,
  sensors,
  onDragEnd,
  onDeleteChapter,
  getSubjectName,
}: TargetPanelProps) => {
  return (
    <div className="bg-card rounded-lg sm:rounded-xl border border-border/50 shadow-soft overflow-hidden flex flex-col">
      <div className="p-3 sm:p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <h3 className="font-semibold text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{courseName}</h3>
          </div>
          <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0">
            {totalChapters} Chapters
          </Badge>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-3 sm:p-4">
        {Object.keys(courseContentBySubject).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 sm:h-40 text-center text-muted-foreground">
            <Layers className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-30" />
            <p className="text-xs sm:text-sm">No chapters added yet</p>
            <p className="text-[10px] sm:text-xs">Select chapters from the left panel to add them</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(courseContentBySubject).map(([subjectId, chapters]) => (
              <div key={subjectId} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 py-1.5 sm:py-2 border-b border-border/30">
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    {getSubjectName(subjectId)}
                  </span>
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    {chapters.length}
                  </Badge>
                </div>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => onDragEnd(e, subjectId)}
                >
                  <SortableContext
                    items={chapters.map(ch => ch.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {chapters.map((ch) => (
                        <SortableChapterItem
                          key={ch.id}
                          id={ch.id}
                          name={ch.name}
                          sourceLabel={ch.sourceLabel}
                          isCourseOwned={ch.isCourseOwned}
                          onDelete={onDeleteChapter}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
