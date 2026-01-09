import { DragEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { TeacherLoadCard, BatchSelector } from "@/components/timetable";
import { TeacherLoad, TeacherConstraint, TimetableEntry, defaultPeriodStructure } from "@/data/timetableData";
import { Batch } from "@/data/instituteData";

interface TimetableSidebarProps {
  viewMode: 'teacher' | 'batch';
  
  // Teacher mode
  teachers: TeacherLoad[];
  selectedTeacherId: string | null;
  setSelectedTeacherId: (id: string) => void;
  onTeacherDragStart: (e: DragEvent<HTMLDivElement>, teacher: TeacherLoad) => void;
  onTeacherDragEnd: () => void;
  teacherConstraints: TeacherConstraint[];
  entries: TimetableEntry[];
  
  // Batch mode
  batches: Batch[];
  selectedBatchId: string | null;
  onSelectBatch: (id: string | null) => void;
}

export const TimetableSidebar = ({
  viewMode,
  teachers,
  selectedTeacherId,
  setSelectedTeacherId,
  onTeacherDragStart,
  onTeacherDragEnd,
  teacherConstraints,
  entries,
  batches,
  selectedBatchId,
  onSelectBatch,
}: TimetableSidebarProps) => {
  const getCurrentDay = () => {
    const dayIndex = new Date().getDay();
    return defaultPeriodStructure.workingDays[dayIndex === 0 ? 6 : dayIndex - 1];
  };

  if (viewMode === 'teacher') {
    return (
      <>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Select Teacher</h3>
          <Badge variant="secondary" className="text-xs">{teachers.length}</Badge>
        </div>
        <div className="grid grid-cols-1 gap-1.5 max-h-[250px] lg:max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {teachers.map(teacher => (
            <TeacherLoadCard
              key={teacher.teacherId}
              teacher={teacher}
              isSelected={selectedTeacherId === teacher.teacherId}
              onClick={() => setSelectedTeacherId(teacher.teacherId)}
              compact
              draggable
              onDragStart={onTeacherDragStart}
              onDragEnd={onTeacherDragEnd}
              constraint={teacherConstraints.find(c => c.teacherId === teacher.teacherId)}
              currentDayPeriods={entries.filter(e => e.teacherId === teacher.teacherId && e.day === getCurrentDay()).length}
              currentDay={getCurrentDay()}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Select Batch</h3>
        <Badge variant="secondary" className="text-xs">{batches.length}</Badge>
      </div>
      <BatchSelector
        batches={batches}
        selectedBatchId={selectedBatchId}
        onSelect={onSelectBatch}
      />
    </>
  );
};
