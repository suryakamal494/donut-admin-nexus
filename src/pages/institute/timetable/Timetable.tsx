import { useState, useEffect, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimetableGrid, TeacherLoadCard, BatchSelector, AssignmentDialog, InfoTooltip, ConflictSummaryPanel, UndoRedoControls } from "@/components/timetable";
import { DragData } from "@/components/timetable/TimetableGrid";
import { defaultPeriodStructure, teacherLoads, timetableEntries, TimetableEntry, TimetableConflict, TeacherLoad } from "@/data/timetableData";
import { useTimetableHistory } from "@/hooks/useTimetableHistory";
import { batches, availableSubjects } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { Settings, Upload, User, BookOpen, GripVertical } from "lucide-react";
import { toast } from "sonner";

// Quick Batch Picker Dialog Component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BatchPickerDialogProps {
  open: boolean;
  onClose: () => void;
  teacher: TeacherLoad | null;
  day: string;
  period: number;
  onSelectBatch: (batchId: string, batchName: string, subject: string) => void;
  getBatchConflict: (batchId: string) => boolean;
}

const BatchPickerDialog = ({
  open,
  onClose,
  teacher,
  day,
  period,
  onSelectBatch,
  getBatchConflict,
}: BatchPickerDialogProps) => {
  if (!teacher) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Batch</DialogTitle>
          <DialogDescription>
            {teacher.teacherName} • {day} P{period}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2 mt-4">
          {teacher.allowedBatches.map((batch) => {
            const hasConflict = getBatchConflict(batch.batchId);
            return (
              <Button
                key={batch.batchId}
                variant={hasConflict ? "outline" : "secondary"}
                className={cn(
                  "justify-start h-auto py-3 px-4",
                  hasConflict && "opacity-50 cursor-not-allowed"
                )}
                disabled={hasConflict}
                onClick={() => {
                  onSelectBatch(batch.batchId, batch.batchName, batch.subject);
                  onClose();
                }}
              >
                <div className="text-left">
                  <p className="font-medium">{batch.batchName}</p>
                  <p className="text-xs text-muted-foreground">{batch.subject}</p>
                </div>
                {hasConflict && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    Busy
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Timetable = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'teacher' | 'batch'>('teacher');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(teacherLoads[0]?.teacherId || null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContext, setDialogContext] = useState<{ day: string; period: number } | null>(null);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTeacher, setDraggedTeacher] = useState<TeacherLoad | null>(null);
  const [draggedEntry, setDraggedEntry] = useState<TimetableEntry | null>(null);
  
  // Batch picker dialog state
  const [batchPickerOpen, setBatchPickerOpen] = useState(false);
  const [pendingDrop, setPendingDrop] = useState<{ day: string; period: number; teacher: TeacherLoad } | null>(null);

  // Use undo/redo history hook
  const {
    entries,
    addEntry,
    removeEntry,
    moveEntry,
    undo,
    redo,
    canUndo,
    canRedo,
    lastAction,
    nextAction,
  } = useTimetableHistory(timetableEntries);

  const selectedTeacher = teacherLoads.find(t => t.teacherId === selectedTeacherId);
  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          if (canRedo) {
            redo();
            toast.info("Redo", { description: nextAction?.description });
          }
        } else {
          e.preventDefault();
          if (canUndo) {
            undo();
            toast.info("Undo", { description: lastAction?.description });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, lastAction, nextAction]);

  const handleCellClick = (day: string, period: number) => {
    setDialogContext({ day, period });
    setDialogOpen(true);
  };

  const handleAssign = (entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = { ...entry, id: `entry-${Date.now()}` };
    addEntry(newEntry);
    toast.success("Period assigned!", { description: `${entry.subjectName} added to ${entry.day} P${entry.periodNumber}` });
  };

  const handleConflictClick = (conflict: TimetableConflict) => {
    if (conflict.type === 'overload') return;

    // Navigate to the conflict location
    if (conflict.teacherId) {
      setViewMode('teacher');
      setSelectedTeacherId(conflict.teacherId);
    } else if (conflict.batchId) {
      setViewMode('batch');
      setSelectedBatchId(conflict.batchId);
    }

    // Open dialog at the conflict location
    if (conflict.day && conflict.periodNumber) {
      setDialogContext({ day: conflict.day, period: conflict.periodNumber });
      setDialogOpen(true);
    }

    toast.info("Navigated to conflict", { description: conflict.message });
  };

  const handleUndoClick = () => {
    if (canUndo) {
      undo();
      toast.info("Undo", { description: lastAction?.description });
    }
  };

  const handleRedoClick = () => {
    if (canRedo) {
      redo();
      toast.info("Redo", { description: nextAction?.description });
    }
  };

  const getTeacherConflict = (day: string, period: number) => {
    if (!selectedTeacher) return false;
    return entries.some(e => e.teacherId === selectedTeacher.teacherId && e.day === day && e.periodNumber === period);
  };

  const getBatchConflict = (day: string, period: number) => {
    if (viewMode === 'teacher' && selectedTeacher) {
      return false;
    }
    if (!selectedBatchId) return false;
    return entries.some(e => e.batchId === selectedBatchId && e.day === day && e.periodNumber === period);
  };

  // Check if batch has conflict at specific day/period
  const checkBatchConflictAtSlot = (batchId: string, day: string, period: number) => {
    return entries.some(e => e.batchId === batchId && e.day === day && e.periodNumber === period);
  };

  // Handle teacher drag start from sidebar
  const handleTeacherDragStart = (e: DragEvent<HTMLDivElement>, teacher: TeacherLoad) => {
    setIsDragging(true);
    setDraggedTeacher(teacher);
  };

  // Handle teacher drag end
  const handleTeacherDragEnd = () => {
    setIsDragging(false);
    setDraggedTeacher(null);
  };

  // Handle entry drag start from grid
  const handleEntryDragStart = (entry: TimetableEntry) => {
    setIsDragging(true);
    setDraggedEntry(entry);
  };

  // Handle entry drag end
  const handleEntryDragEnd = () => {
    setIsDragging(false);
    setDraggedEntry(null);
  };

  // Handle drop on grid cell
  const handleDrop = (day: string, period: number, data: DragData) => {
    setIsDragging(false);
    setDraggedTeacher(null);
    setDraggedEntry(null);

    if (data.type === 'teacher' && data.teacher) {
      // Dragging teacher from sidebar
      const teacher = data.teacher;
      
      // Check if teacher works on this day
      if (!teacher.workingDays.includes(day)) {
        toast.error("Cannot assign", { description: `${teacher.teacherName} doesn't work on ${day}` });
        return;
      }

      // Check if teacher already has a class at this time
      const teacherBusy = entries.some(
        e => e.teacherId === teacher.teacherId && e.day === day && e.periodNumber === period
      );
      if (teacherBusy) {
        toast.error("Teacher already busy", { description: `${teacher.teacherName} already has a class at this time` });
        return;
      }

      // If teacher teaches only one batch, auto-assign
      if (teacher.allowedBatches.length === 1) {
        const batch = teacher.allowedBatches[0];
        
        // Check batch conflict
        if (checkBatchConflictAtSlot(batch.batchId, day, period)) {
          toast.error("Batch already busy", { description: `${batch.batchName} already has a class at this time` });
          return;
        }

        const subjectData = availableSubjects.find(s => s.name === batch.subject);
        const newEntry: TimetableEntry = {
          id: `entry-${Date.now()}`,
          day,
          periodNumber: period,
          subjectId: subjectData?.id || batch.subject.toLowerCase().slice(0, 3),
          subjectName: batch.subject,
          teacherId: teacher.teacherId,
          teacherName: teacher.teacherName,
          batchId: batch.batchId,
          batchName: batch.batchName,
        };
        addEntry(newEntry);
        toast.success("Period assigned!", { 
          description: `${batch.subject} assigned to ${day} P${period}` 
        });
      } else {
        // Show batch picker
        setPendingDrop({ day, period, teacher });
        setBatchPickerOpen(true);
      }
    } else if (data.type === 'entry' && data.entry) {
      // Moving existing entry
      const entry = data.entry;
      
      // Check if target slot is empty for this teacher/batch
      const targetHasEntry = entries.some(
        e => e.id !== entry.id && 
             ((viewMode === 'teacher' && e.teacherId === entry.teacherId) ||
              (viewMode === 'batch' && e.batchId === entry.batchId)) &&
             e.day === day && e.periodNumber === period
      );
      
      if (targetHasEntry) {
        toast.error("Slot occupied", { description: "Cannot move to an occupied slot" });
        return;
      }

      // Check teacher works on target day
      const teacher = teacherLoads.find(t => t.teacherId === entry.teacherId);
      if (teacher && !teacher.workingDays.includes(day)) {
        toast.error("Cannot move", { description: `${teacher.teacherName} doesn't work on ${day}` });
        return;
      }

      // Move the entry
      moveEntry(entry.id, day, period);
      toast.success("Entry moved!", { 
        description: `${entry.subjectName} moved to ${day} P${period}` 
      });
    }
  };

  // Handle batch selection from picker
  const handleBatchSelect = (batchId: string, batchName: string, subject: string) => {
    if (!pendingDrop) return;

    const { day, period, teacher } = pendingDrop;

    // Check batch conflict
    if (checkBatchConflictAtSlot(batchId, day, period)) {
      toast.error("Batch already busy", { description: `${batchName} already has a class at this time` });
      return;
    }

    const subjectData = availableSubjects.find(s => s.name === subject);
    const newEntry: TimetableEntry = {
      id: `entry-${Date.now()}`,
      day,
      periodNumber: period,
      subjectId: subjectData?.id || subject.toLowerCase().slice(0, 3),
      subjectName: subject,
      teacherId: teacher.teacherId,
      teacherName: teacher.teacherName,
      batchId: batchId,
      batchName: batchName,
    };
    addEntry(newEntry);
    toast.success("Period assigned!", { 
      description: `${subject} assigned to ${day} P${period}` 
    });
    
    setPendingDrop(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable Workspace"
        description="Create and manage your school timetable. Drag teachers to assign periods."
        actions={
          <div className="flex items-center gap-2">
            <UndoRedoControls
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndoClick}
              onRedo={handleRedoClick}
              lastAction={lastAction}
              nextAction={nextAction}
            />
            <Button variant="outline" onClick={() => navigate("/institute/timetable/upload")}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button variant="outline" onClick={() => navigate("/institute/timetable/setup")}>
              <Settings className="w-4 h-4 mr-2" />
              Setup
            </Button>
          </div>
        }
      />

      {/* Conflict Summary Panel */}
      <ConflictSummaryPanel
        entries={entries}
        teachers={teacherLoads}
        onConflictClick={handleConflictClick}
      />

      {/* View Mode Toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Tabs value={viewMode} onValueChange={(v) => { setViewMode(v as 'teacher' | 'batch'); setSelectedBatchId(null); }}>
            <TabsList>
              <TabsTrigger value="teacher" className="gap-2"><User className="w-4 h-4" />Teacher View</TabsTrigger>
              <TabsTrigger value="batch" className="gap-2"><BookOpen className="w-4 h-4" />Batch View</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            {viewMode === 'teacher' && (
              <Badge variant="secondary" className="gap-1">
                <GripVertical className="w-3 h-3" />
                Drag teachers to grid
              </Badge>
            )}
            <InfoTooltip content="Teacher View: Drag teachers from sidebar to grid, or click cells to assign. Batch View: Fill a batch's timetable with teachers." />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {viewMode === 'teacher' ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Select Teacher</h3>
                <Badge variant="secondary">{teacherLoads.length}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Drag a teacher to the grid or click to select
              </p>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {teacherLoads.map(teacher => (
                  <TeacherLoadCard
                    key={teacher.teacherId}
                    teacher={teacher}
                    isSelected={selectedTeacherId === teacher.teacherId}
                    onClick={() => setSelectedTeacherId(teacher.teacherId)}
                    compact
                    draggable
                    onDragStart={handleTeacherDragStart}
                    onDragEnd={handleTeacherDragEnd}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Select Batch</h3>
                <Badge variant="secondary">{batches.length}</Badge>
              </div>
              <BatchSelector
                batches={batches}
                selectedBatchId={selectedBatchId}
                onSelect={setSelectedBatchId}
              />
            </>
          )}
        </div>

        {/* Main Grid */}
        <div className="lg:col-span-3">
          {(viewMode === 'teacher' && selectedTeacher) || (viewMode === 'batch' && selectedBatch) ? (
            <Card>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {viewMode === 'teacher' ? selectedTeacher?.teacherName : `${selectedBatch?.className} - ${selectedBatch?.name}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {viewMode === 'teacher' 
                        ? `${selectedTeacher?.periodsPerWeek - selectedTeacher?.assignedPeriods} periods remaining • Drag entries to move`
                        : `${selectedBatch?.subjects.length} subjects`
                      }
                    </p>
                  </div>
                </div>
                <TimetableGrid
                  entries={entries}
                  periodStructure={defaultPeriodStructure}
                  selectedTeacher={viewMode === 'teacher' ? selectedTeacher : null}
                  selectedBatchId={viewMode === 'batch' ? selectedBatchId : null}
                  viewMode={viewMode}
                  onCellClick={handleCellClick}
                  getTeacherConflict={getTeacherConflict}
                  getBatchConflict={getBatchConflict}
                  onDrop={handleDrop}
                  onEntryDragStart={handleEntryDragStart}
                  onEntryDragEnd={handleEntryDragEnd}
                  isDragging={isDragging}
                  draggedEntry={draggedEntry}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                {viewMode === 'teacher' ? <User className="w-8 h-8 text-muted-foreground" /> : <BookOpen className="w-8 h-8 text-muted-foreground" />}
              </div>
              <h3 className="font-semibold mb-2">Select a {viewMode === 'teacher' ? 'Teacher' : 'Batch'}</h3>
              <p className="text-muted-foreground">Choose from the sidebar to start building the timetable</p>
            </Card>
          )}
        </div>
      </div>

      {dialogContext && (
        <AssignmentDialog
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); setDialogContext(null); }}
          day={dialogContext.day}
          period={dialogContext.period}
          viewMode={viewMode}
          selectedTeacher={selectedTeacher}
          selectedBatch={selectedBatch}
          teachers={teacherLoads}
          batches={batches}
          onAssign={handleAssign}
          getTeacherConflict={(tid, d, p) => entries.some(e => e.teacherId === tid && e.day === d && e.periodNumber === p)}
          getBatchConflict={(bid, d, p) => entries.some(e => e.batchId === bid && e.day === d && e.periodNumber === p)}
        />
      )}

      {/* Batch Picker Dialog for multi-batch teachers */}
      <BatchPickerDialog
        open={batchPickerOpen}
        onClose={() => { setBatchPickerOpen(false); setPendingDrop(null); }}
        teacher={pendingDrop?.teacher || null}
        day={pendingDrop?.day || ''}
        period={pendingDrop?.period || 0}
        onSelectBatch={handleBatchSelect}
        getBatchConflict={(batchId) => pendingDrop ? checkBatchConflictAtSlot(batchId, pendingDrop.day, pendingDrop.period) : false}
      />
    </div>
  );
};

export default Timetable;
