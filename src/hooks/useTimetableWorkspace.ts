import { useState, useEffect, useCallback, DragEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { format, startOfWeek, addWeeks, subWeeks, addDays, parseISO } from "date-fns";
import { useTimetableHistory } from "@/hooks/useTimetableHistory";
import { defaultPeriodStructure, teacherLoads, timetableEntries, TimetableEntry, TimetableConflict, TeacherLoad, academicHolidays, defaultTeacherConstraints, defaultFacilities, TeacherConstraint, Facility } from "@/data/timetableData";
import { Holiday, CopyOptions } from "@/components/timetable";
import { batches, availableSubjects } from "@/data/instituteData";

// Types for embed data from upload page
export interface EmbedData {
  batchId: string;
  entries: Array<{ day: string; period: number; subject: string; teacher: string }>;
  weekStart: string;
}

export interface PendingDrop {
  day: string;
  period: number;
  teacher: TeacherLoad;
}

export interface DragData {
  type: 'teacher' | 'entry';
  teacher?: TeacherLoad;
  entry?: TimetableEntry;
}

export const useTimetableWorkspace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // View state
  const [viewMode, setViewMode] = useState<'teacher' | 'batch'>('teacher');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(teacherLoads[0]?.teacherId || null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContext, setDialogContext] = useState<{ day: string; period: number; existingEntry?: TimetableEntry } | null>(null);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTeacher, setDraggedTeacher] = useState<TeacherLoad | null>(null);
  const [draggedEntry, setDraggedEntry] = useState<TimetableEntry | null>(null);
  
  // Batch picker dialog state
  const [batchPickerOpen, setBatchPickerOpen] = useState(false);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);

  // Holiday calendar state
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);
  const [holidays, setHolidays] = useState<Holiday[]>(academicHolidays);

  // Teacher constraints and facilities state
  const [teacherConstraints] = useState<TeacherConstraint[]>(defaultTeacherConstraints);
  const [facilities] = useState<Facility[]>(defaultFacilities);

  // Copy week dialog state
  const [copyWeekDialogOpen, setCopyWeekDialogOpen] = useState(false);

  // Week navigation state
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'draft' | 'published'>('unsaved');

  // Conflict panel collapsed state
  const [conflictPanelOpen, setConflictPanelOpen] = useState(false);

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

  // Calculate conflicts count for compact display
  const conflictCount = (() => {
    const conflicts: string[] = [];
    entries.forEach((entry, i) => {
      entries.slice(i + 1).forEach(other => {
        if (entry.teacherId === other.teacherId && entry.day === other.day && entry.periodNumber === other.periodNumber) {
          conflicts.push(`teacher-${entry.teacherId}-${entry.day}-${entry.periodNumber}`);
        }
      });
    });
    entries.forEach((entry, i) => {
      entries.slice(i + 1).forEach(other => {
        if (entry.batchId === other.batchId && entry.day === other.day && entry.periodNumber === other.periodNumber) {
          conflicts.push(`batch-${entry.batchId}-${entry.day}-${entry.periodNumber}`);
        }
      });
    });
    return new Set(conflicts).size;
  })();

  // Handle embed data from upload page
  useEffect(() => {
    const embedData = location.state?.embedData as EmbedData | undefined;
    if (embedData) {
      setViewMode('batch');
      setSelectedBatchId(embedData.batchId);
      
      if (embedData.weekStart) {
        try {
          setCurrentWeekStart(parseISO(embedData.weekStart));
        } catch (e) {
          // Keep current week if parsing fails
        }
      }
      
      const batch = batches.find(b => b.id === embedData.batchId);
      let addedCount = 0;
      
      embedData.entries.forEach(entry => {
        const teacher = teacherLoads.find(t => 
          t.teacherName.toLowerCase().includes(entry.teacher.toLowerCase()) ||
          entry.teacher.toLowerCase().includes(t.teacherName.split(' ').pop()?.toLowerCase() || '')
        );
        
        if (teacher) {
          const subjectData = availableSubjects.find(s => s.name === entry.subject);
          const newEntry: TimetableEntry = {
            id: `entry-embed-${Date.now()}-${Math.random()}`,
            day: entry.day,
            periodNumber: entry.period,
            subjectId: subjectData?.id || entry.subject.toLowerCase().slice(0, 3),
            subjectName: entry.subject,
            teacherId: teacher.teacherId,
            teacherName: teacher.teacherName,
            batchId: embedData.batchId,
            batchName: batch ? `${batch.className} - ${batch.name}` : 'Unknown Batch',
          };
          addEntry(newEntry);
          addedCount++;
        }
      });
      
      window.history.replaceState({}, document.title);
      
      toast.success("Timetable embedded!", { 
        description: `${addedCount} entries added to ${batch?.className} - ${batch?.name}` 
      });
    }
  }, [location.state, addEntry]);

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

  // Cell click handler
  const handleCellClick = useCallback((day: string, period: number, existingEntry?: TimetableEntry) => {
    setDialogContext({ day, period, existingEntry });
    setDialogOpen(true);
  }, []);

  // Remove entry handler
  const handleRemoveEntry = useCallback((entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      removeEntry(entryId);
      toast.success("Entry removed", { description: `${entry.subjectName} removed from ${entry.day} P${entry.periodNumber}` });
    }
    setDialogOpen(false);
    setDialogContext(null);
  }, [entries, removeEntry]);

  // Assign handler
  const handleAssign = useCallback((entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = { ...entry, id: `entry-${Date.now()}` };
    addEntry(newEntry);
    toast.success("Period assigned!", { description: `${entry.subjectName} added to ${entry.day} P${entry.periodNumber}` });
  }, [addEntry]);

  // Conflict click handler
  const handleConflictClick = useCallback((conflict: TimetableConflict) => {
    if (conflict.type === 'overload') return;

    if (conflict.teacherId) {
      setViewMode('teacher');
      setSelectedTeacherId(conflict.teacherId);
    } else if (conflict.batchId) {
      setViewMode('batch');
      setSelectedBatchId(conflict.batchId);
    }

    if (conflict.day && conflict.periodNumber) {
      setDialogContext({ day: conflict.day, period: conflict.periodNumber });
      setDialogOpen(true);
    }

    toast.info("Navigated to conflict", { description: conflict.message });
  }, []);

  // Undo/Redo click handlers
  const handleUndoClick = useCallback(() => {
    if (canUndo) {
      undo();
      toast.info("Undo", { description: lastAction?.description });
    }
  }, [canUndo, undo, lastAction]);

  const handleRedoClick = useCallback(() => {
    if (canRedo) {
      redo();
      toast.info("Redo", { description: nextAction?.description });
    }
  }, [canRedo, redo, nextAction]);

  // Conflict checkers
  const getTeacherConflict = useCallback((day: string, period: number) => {
    if (!selectedTeacher) return false;
    return entries.some(e => e.teacherId === selectedTeacher.teacherId && e.day === day && e.periodNumber === period);
  }, [selectedTeacher, entries]);

  const getBatchConflict = useCallback((day: string, period: number) => {
    if (viewMode === 'teacher' && selectedTeacher) return false;
    if (!selectedBatchId) return false;
    return entries.some(e => e.batchId === selectedBatchId && e.day === day && e.periodNumber === period);
  }, [viewMode, selectedTeacher, selectedBatchId, entries]);

  const checkBatchConflictAtSlot = useCallback((batchId: string, day: string, period: number) => {
    return entries.some(e => e.batchId === batchId && e.day === day && e.periodNumber === period);
  }, [entries]);

  // Drag handlers
  const handleTeacherDragStart = useCallback((e: DragEvent<HTMLDivElement>, teacher: TeacherLoad) => {
    setIsDragging(true);
    setDraggedTeacher(teacher);
  }, []);

  const handleTeacherDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedTeacher(null);
  }, []);

  const handleEntryDragStart = useCallback((entry: TimetableEntry) => {
    setIsDragging(true);
    setDraggedEntry(entry);
  }, []);

  const handleEntryDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedEntry(null);
  }, []);

  // Drop handler
  const handleDrop = useCallback((day: string, period: number, data: DragData) => {
    setIsDragging(false);
    setDraggedTeacher(null);
    setDraggedEntry(null);

    if (data.type === 'teacher' && data.teacher) {
      const teacher = data.teacher;
      
      if (!teacher.workingDays.includes(day)) {
        toast.error("Cannot assign", { description: `${teacher.teacherName} doesn't work on ${day}` });
        return;
      }

      const teacherBusy = entries.some(
        e => e.teacherId === teacher.teacherId && e.day === day && e.periodNumber === period
      );
      if (teacherBusy) {
        toast.error("Teacher already busy", { description: `${teacher.teacherName} already has a class at this time` });
        return;
      }

      if (teacher.allowedBatches.length === 1) {
        const batch = teacher.allowedBatches[0];
        
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
        setPendingDrop({ day, period, teacher });
        setBatchPickerOpen(true);
      }
    } else if (data.type === 'entry' && data.entry) {
      const entry = data.entry;
      
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

      const teacher = teacherLoads.find(t => t.teacherId === entry.teacherId);
      if (teacher && !teacher.workingDays.includes(day)) {
        toast.error("Cannot move", { description: `${teacher.teacherName} doesn't work on ${day}` });
        return;
      }

      moveEntry(entry.id, day, period);
      toast.success("Entry moved!", { 
        description: `${entry.subjectName} moved to ${day} P${period}` 
      });
    }
  }, [entries, viewMode, addEntry, moveEntry, checkBatchConflictAtSlot]);

  // Batch selection from picker
  const handleBatchSelect = useCallback((batchId: string, batchName: string, subject: string) => {
    if (!pendingDrop) return;

    const { day, period, teacher } = pendingDrop;

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
  }, [pendingDrop, addEntry, checkBatchConflictAtSlot]);

  // Week navigation handlers
  const goToPreviousWeek = useCallback(() => setCurrentWeekStart(prev => subWeeks(prev, 1)), []);
  const goToNextWeek = useCallback(() => setCurrentWeekStart(prev => addWeeks(prev, 1)), []);
  const goToCurrentWeek = useCallback(() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 })), []);

  // Save/Publish handlers
  const handleSaveDraft = useCallback(() => {
    setSaveStatus('draft');
    toast.success("Draft saved", { description: `Timetable for week of ${format(currentWeekStart, 'MMM d')} saved as draft` });
  }, [currentWeekStart]);

  const handlePublish = useCallback(() => {
    setSaveStatus('published');
    toast.success("Timetable published!", { description: `Week of ${format(currentWeekStart, 'MMM d')} is now visible in View Timetable` });
  }, [currentWeekStart]);

  // Handle copy week
  const handleCopyWeek = useCallback((targetWeeks: Date[], options: CopyOptions) => {
    const currentEntries = viewMode === 'teacher' && selectedTeacher
      ? entries.filter(e => e.teacherId === selectedTeacher.teacherId)
      : viewMode === 'batch' && selectedBatchId
        ? entries.filter(e => e.batchId === selectedBatchId)
        : entries;

    let copiedCount = 0;
    
    targetWeeks.forEach(weekStart => {
      currentEntries.forEach(entry => {
        if (options.skipHolidays) {
          const entryDate = addDays(weekStart, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(entry.day));
          const dateStr = format(entryDate, 'yyyy-MM-dd');
          if (holidays.some(h => h.date === dateStr)) {
            return;
          }
        }

        const newEntry: TimetableEntry = {
          ...entry,
          id: `entry-copy-${Date.now()}-${Math.random()}`,
        };
        addEntry(newEntry);
        copiedCount++;
      });
    });

    toast.success("Week copied!", { 
      description: `${copiedCount} entries copied to ${targetWeeks.length} week${targetWeeks.length > 1 ? 's' : ''}` 
    });
  }, [viewMode, selectedTeacher, selectedBatchId, entries, holidays, addEntry]);

  const weekEndDate = addDays(currentWeekStart, 5);

  // Close dialog helper
  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setDialogContext(null);
  }, []);

  // Close batch picker helper
  const closeBatchPicker = useCallback(() => {
    setBatchPickerOpen(false);
    setPendingDrop(null);
  }, []);

  return {
    // Navigation
    navigate,
    
    // View state
    viewMode,
    setViewMode,
    selectedTeacherId,
    setSelectedTeacherId,
    selectedBatchId,
    setSelectedBatchId,
    selectedTeacher,
    selectedBatch,
    
    // Dialog state
    dialogOpen,
    dialogContext,
    closeDialog,
    
    // Drag state
    isDragging,
    draggedTeacher,
    draggedEntry,
    
    // Batch picker
    batchPickerOpen,
    pendingDrop,
    closeBatchPicker,
    
    // Holiday calendar
    holidayDialogOpen,
    setHolidayDialogOpen,
    holidays,
    setHolidays,
    
    // Constraints
    teacherConstraints,
    facilities,
    
    // Copy week
    copyWeekDialogOpen,
    setCopyWeekDialogOpen,
    
    // Week navigation
    currentWeekStart,
    weekEndDate,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    
    // Save status
    saveStatus,
    handleSaveDraft,
    handlePublish,
    
    // Conflict
    conflictPanelOpen,
    setConflictPanelOpen,
    conflictCount,
    
    // Entries & history
    entries,
    canUndo,
    canRedo,
    lastAction,
    nextAction,
    
    // Event handlers
    handleCellClick,
    handleRemoveEntry,
    handleAssign,
    handleConflictClick,
    handleUndoClick,
    handleRedoClick,
    getTeacherConflict,
    getBatchConflict,
    checkBatchConflictAtSlot,
    handleTeacherDragStart,
    handleTeacherDragEnd,
    handleEntryDragStart,
    handleEntryDragEnd,
    handleDrop,
    handleBatchSelect,
    handleCopyWeek,
    
    // Static data
    teacherLoads,
    batches,
    defaultPeriodStructure,
  };
};
