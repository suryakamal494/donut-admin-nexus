import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoTooltip } from "./InfoTooltip";
import { TeacherLoad, TimetableEntry, subjectColors } from "@/data/timetableData";
import { Batch, availableSubjects } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { AlertTriangle, User, BookOpen, Check } from "lucide-react";

interface AssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  day: string;
  period: number;
  viewMode: 'teacher' | 'batch';
  selectedTeacher?: TeacherLoad | null;
  selectedBatch?: Batch | null;
  teachers: TeacherLoad[];
  batches: Batch[];
  existingEntry?: TimetableEntry | null;
  onAssign: (entry: Omit<TimetableEntry, 'id'>) => void;
  onRemove?: () => void;
  getTeacherConflict?: (teacherId: string, day: string, period: number) => boolean;
  getBatchConflict?: (batchId: string, day: string, period: number) => boolean;
}

export const AssignmentDialog = ({
  open,
  onClose,
  day,
  period,
  viewMode,
  selectedTeacher,
  selectedBatch,
  teachers,
  batches,
  existingEntry,
  onAssign,
  onRemove,
  getTeacherConflict,
  getBatchConflict,
}: AssignmentDialogProps) => {
  const [selectedBatchId, setSelectedBatchId] = useState(existingEntry?.batchId || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState(existingEntry?.teacherId || '');

  // Reset state when dialog opens with different context
  const dialogKey = `${day}-${period}-${existingEntry?.id || 'new'}`;
  
  // Check if we're in view/edit mode for existing entry
  const isEditMode = !!existingEntry;

  // Reset selections when dialog opens
  useEffect(() => {
    if (open && !isEditMode) {
      setSelectedBatchId('');
      setSelectedTeacherId('');
    } else if (open && isEditMode && existingEntry) {
      setSelectedBatchId(existingEntry.batchId);
      setSelectedTeacherId(existingEntry.teacherId);
    }
  }, [open, isEditMode, existingEntry]);

  // Get available teachers for batch view - ONLY teachers assigned to this batch
  const getAvailableTeachers = () => {
    if (!selectedBatch) return [];
    
    return teachers.filter(t => {
      // Check if teacher works on this day
      if (!t.workingDays.includes(day)) return false;
      // Check if teacher is assigned to this specific batch
      return t.allowedBatches.some(b => b.batchId === selectedBatch.id);
    });
  };

  // Get allowed batches for teacher view
  const getAllowedBatches = () => {
    if (!selectedTeacher) return batches;
    const allowedBatchIds = selectedTeacher.allowedBatches.map(b => b.batchId);
    return batches.filter(b => allowedBatchIds.includes(b.id));
  };

  // Check for conflicts
  const hasTeacherConflict = (teacherId: string) => {
    return getTeacherConflict?.(teacherId, day, period) || false;
  };

  const hasBatchConflict = (batchId: string) => {
    return getBatchConflict?.(batchId, day, period) || false;
  };

  // Get subject for teacher-batch combination (fixed mapping)
  const getSubjectForTeacherBatch = (teacherId: string, batchId: string): string | undefined => {
    const teacher = teachers.find(t => t.teacherId === teacherId);
    if (!teacher) return undefined;
    const assignment = teacher.allowedBatches.find(b => b.batchId === batchId);
    return assignment?.subject;
  };

  // Get the auto-determined subject when teacher is selected (for batch view)
  const getAutoSubject = () => {
    if (!selectedTeacherId || !selectedBatch) return null;
    const subject = getSubjectForTeacherBatch(selectedTeacherId, selectedBatch.id);
    if (!subject) return null;
    const subjectData = availableSubjects.find(s => s.name === subject);
    return { id: subjectData?.id || subject.toLowerCase().slice(0, 3), name: subject };
  };

  const autoSubject = getAutoSubject();

  const handleAssign = () => {
    let entry: Omit<TimetableEntry, 'id'>;

    if (viewMode === 'teacher' && selectedTeacher) {
      const batch = batches.find(b => b.id === selectedBatchId);
      const subject = selectedTeacher.allowedBatches.find(b => b.batchId === selectedBatchId)?.subject;
      const subjectData = availableSubjects.find(s => s.name === subject);
      
      if (!batch || !subject) return;

      entry = {
        day,
        periodNumber: period,
        subjectId: subjectData?.id || subject.toLowerCase().slice(0, 3),
        subjectName: subject,
        teacherId: selectedTeacher.teacherId,
        teacherName: selectedTeacher.teacherName,
        batchId: batch.id,
        batchName: `${batch.className} - ${batch.name}`,
      };
    } else if (selectedBatch && autoSubject) {
      // Batch view: use auto-determined subject from teacher-batch mapping
      const teacher = teachers.find(t => t.teacherId === selectedTeacherId);
      
      if (!teacher) return;

      entry = {
        day,
        periodNumber: period,
        subjectId: autoSubject.id,
        subjectName: autoSubject.name,
        teacherId: teacher.teacherId,
        teacherName: teacher.teacherName,
        batchId: selectedBatch.id,
        batchName: `${selectedBatch.className} - ${selectedBatch.name}`,
      };
    } else {
      return;
    }

    onAssign(entry);
    onClose();
  };

  // For batch view, only need to select teacher (subject is auto-determined)
  const canAssign = viewMode === 'teacher' 
    ? !!selectedBatchId 
    : !!selectedTeacherId && !!autoSubject;

  return (
    <Dialog open={open} onOpenChange={onClose} key={dialogKey}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Assignment' : 'Assign Period'}
          </DialogTitle>
          <DialogDescription>
            {day} • Period {period}
            {viewMode === 'teacher' && selectedTeacher && (
              <span className="ml-2 font-medium text-foreground">
                • {selectedTeacher.teacherName}
              </span>
            )}
            {viewMode === 'batch' && selectedBatch && (
              <span className="ml-2 font-medium text-foreground">
                • {selectedBatch.className} - {selectedBatch.name}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Show existing entry details in edit mode */}
          {isEditMode && existingEntry && (
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">{existingEntry.subjectName}</p>
                  <p className="text-sm text-muted-foreground">
                    {existingEntry.teacherName} • {existingEntry.batchName}
                  </p>
                </div>
                <Badge variant="secondary">Current</Badge>
              </div>
            </div>
          )}

          {/* Teacher View: Select Batch */}
          {!isEditMode && viewMode === 'teacher' && selectedTeacher && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Select Batch
                  <InfoTooltip content="Choose which batch this teacher will teach during this period. Subject is automatically determined." />
                </label>
                <Badge variant="secondary">
                  {selectedTeacher.periodsPerWeek - selectedTeacher.assignedPeriods} periods left
                </Badge>
              </div>
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a batch..." />
                </SelectTrigger>
                <SelectContent>
                  {getAllowedBatches().map(batch => {
                    const hasConflict = hasBatchConflict(batch.id);
                    const subject = getSubjectForTeacherBatch(selectedTeacher.teacherId, batch.id);
                    
                    return (
                      <SelectItem 
                        key={batch.id} 
                        value={batch.id}
                        disabled={hasConflict}
                      >
                        <div className="flex items-center gap-2">
                          <span>{batch.className} - {batch.name}</span>
                          {subject && (
                            <Badge variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          )}
                          {hasConflict && (
                            <AlertTriangle className="w-3 h-3 text-destructive" />
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              {selectedBatchId && hasBatchConflict(selectedBatchId) && (
                <Alert variant="destructive" className="py-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This batch already has a class at this time
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Batch View: Select Teacher ONLY (subject is auto-determined) */}
          {!isEditMode && viewMode === 'batch' && selectedBatch && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Select Teacher
                  <InfoTooltip content="Choose the teacher for this period. Subject is automatically determined based on teacher's assignment to this batch." />
                </label>
                <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTeachers().map(teacher => {
                      const hasConflict = hasTeacherConflict(teacher.teacherId);
                      const remaining = teacher.periodsPerWeek - teacher.assignedPeriods;
                      const subject = getSubjectForTeacherBatch(teacher.teacherId, selectedBatch.id);
                      
                      return (
                        <SelectItem 
                          key={teacher.teacherId} 
                          value={teacher.teacherId}
                          disabled={hasConflict || remaining <= 0}
                        >
                          <div className="flex items-center gap-2">
                            <span>{teacher.teacherName}</span>
                            {subject && (
                              <Badge variant="outline" className="text-xs">
                                {subject}
                              </Badge>
                            )}
                            <Badge 
                              variant={remaining <= 0 ? "destructive" : "secondary"} 
                              className="text-xs"
                            >
                              {remaining} left
                            </Badge>
                            {hasConflict && (
                              <AlertTriangle className="w-3 h-3 text-destructive" />
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {getAvailableTeachers().length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No teachers assigned to this batch are available on {day}
                  </p>
                )}
              </div>

              {/* Show auto-determined subject when teacher is selected */}
              {autoSubject && (
                <div className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Subject:</span>
                    <Badge className={cn(
                      subjectColors[autoSubject.id]?.bg,
                      subjectColors[autoSubject.id]?.text,
                      subjectColors[autoSubject.id]?.border
                    )}>
                      {autoSubject.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">(auto-determined)</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isEditMode && onRemove && (
            <Button variant="destructive" onClick={onRemove} className="mr-auto">
              Remove Entry
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            {isEditMode ? 'Close' : 'Cancel'}
          </Button>
          {!isEditMode && (
            <Button onClick={handleAssign} disabled={!canAssign}>
              <Check className="w-4 h-4 mr-2" />
              Assign
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
