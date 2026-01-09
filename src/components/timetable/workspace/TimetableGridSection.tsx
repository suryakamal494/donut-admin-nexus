import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, GripVertical } from "lucide-react";
import { TimetableGrid } from "@/components/timetable";
import { TimetableEntry, TeacherLoad, PeriodStructure } from "@/data/timetableData";
import { Holiday } from "@/components/timetable";
import { DragData } from "@/components/timetable/TimetableGrid";
import { ExamBlock } from "@/types/examBlock";
import { Batch } from "@/data/instituteData";

interface TimetableGridSectionProps {
  viewMode: 'teacher' | 'batch';
  selectedTeacher: TeacherLoad | null | undefined;
  selectedBatch: Batch | undefined;
  entries: TimetableEntry[];
  periodStructure: PeriodStructure;
  onCellClick: (day: string, period: number, existingEntry?: TimetableEntry) => void;
  getTeacherConflict: (day: string, period: number) => boolean;
  getBatchConflict: (day: string, period: number) => boolean;
  onDrop: (day: string, period: number, data: DragData) => void;
  onEntryDragStart: (entry: TimetableEntry) => void;
  onEntryDragEnd: () => void;
  isDragging: boolean;
  draggedEntry: TimetableEntry | null;
  holidays: Holiday[];
  weekStartDate: Date;
  examBlocks: ExamBlock[];
  selectedBatchId: string | null;
}

export const TimetableGridSection = ({
  viewMode,
  selectedTeacher,
  selectedBatch,
  entries,
  periodStructure,
  onCellClick,
  getTeacherConflict,
  getBatchConflict,
  onDrop,
  onEntryDragStart,
  onEntryDragEnd,
  isDragging,
  draggedEntry,
  holidays,
  weekStartDate,
  examBlocks,
  selectedBatchId,
}: TimetableGridSectionProps) => {
  const hasSelection = (viewMode === 'teacher' && selectedTeacher) || (viewMode === 'batch' && selectedBatch);

  if (!hasSelection) {
    return (
      <Card className="p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
          {viewMode === 'teacher' ? <User className="w-6 h-6 text-muted-foreground" /> : <BookOpen className="w-6 h-6 text-muted-foreground" />}
        </div>
        <h3 className="font-semibold text-sm mb-1">Select a {viewMode === 'teacher' ? 'Teacher' : 'Batch'}</h3>
        <p className="text-xs text-muted-foreground">Choose from the sidebar to start</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-3">
        {/* Compact Guidance */}
        {viewMode === 'teacher' && selectedTeacher && (
          <div className="mb-3 p-2 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm">{selectedTeacher.teacherName}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {selectedTeacher.periodsPerWeek - selectedTeacher.assignedPeriods} periods left
              </span>
            </div>
            <Badge variant="secondary" className="gap-1 text-xs hidden md:flex">
              <GripVertical className="w-3 h-3" />
              Drag to assign
            </Badge>
          </div>
        )}

        {viewMode === 'batch' && selectedBatch && (
          <div className="mb-3 p-2 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm">{selectedBatch.className} - {selectedBatch.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                {selectedBatch.subjects.length} subjects • {selectedBatch.studentCount} students
              </span>
            </div>
          </div>
        )}

        <TimetableGrid
          entries={entries}
          periodStructure={periodStructure}
          selectedTeacher={viewMode === 'teacher' ? selectedTeacher : null}
          selectedBatchId={viewMode === 'batch' ? selectedBatchId : null}
          viewMode={viewMode}
          onCellClick={onCellClick}
          getTeacherConflict={getTeacherConflict}
          getBatchConflict={getBatchConflict}
          onDrop={onDrop}
          onEntryDragStart={onEntryDragStart}
          onEntryDragEnd={onEntryDragEnd}
          isDragging={isDragging}
          draggedEntry={draggedEntry}
          holidays={holidays}
          weekStartDate={weekStartDate}
          examBlocks={examBlocks}
        />
      </CardContent>
    </Card>
  );
};
