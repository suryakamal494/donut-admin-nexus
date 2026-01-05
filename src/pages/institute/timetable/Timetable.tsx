import { useState, useEffect, DragEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimetableGrid, TeacherLoadCard, BatchSelector, AssignmentDialog, InfoTooltip, ConflictSummaryPanel, UndoRedoControls, HolidayCalendarDialog, Holiday, CopyWeekDialog, CopyOptions } from "@/components/timetable";
import { DragData } from "@/components/timetable/TimetableGrid";
import { defaultPeriodStructure, teacherLoads, timetableEntries, TimetableEntry, TimetableConflict, TeacherLoad, academicHolidays, defaultTeacherConstraints, defaultFacilities, TeacherConstraint, Facility } from "@/data/timetableData";
import { useTimetableHistory } from "@/hooks/useTimetableHistory";
import { batches, availableSubjects } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { Settings, Upload, User, BookOpen, GripVertical, CalendarDays, ChevronLeft, ChevronRight, Save, Send, Eye, MoreHorizontal, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { format, startOfWeek, addWeeks, subWeeks, addDays, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

// Types for embed data from upload page
interface EmbedData {
  batchId: string;
  entries: Array<{ day: string; period: number; subject: string; teacher: string }>;
  weekStart: string;
}

const Timetable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'teacher' | 'batch'>('teacher');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(teacherLoads[0]?.teacherId || null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContext, setDialogContext] = useState<{ day: string; period: number; existingEntry?: TimetableEntry } | null>(null);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTeacher, setDraggedTeacher] = useState<TeacherLoad | null>(null);
  const [draggedEntry, setDraggedEntry] = useState<TimetableEntry | null>(null);
  
  // Batch picker dialog state
  const [batchPickerOpen, setBatchPickerOpen] = useState(false);
  const [pendingDrop, setPendingDrop] = useState<{ day: string; period: number; teacher: TeacherLoad } | null>(null);

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
    // Teacher clashes
    entries.forEach((entry, i) => {
      entries.slice(i + 1).forEach(other => {
        if (entry.teacherId === other.teacherId && entry.day === other.day && entry.periodNumber === other.periodNumber) {
          conflicts.push(`teacher-${entry.teacherId}-${entry.day}-${entry.periodNumber}`);
        }
      });
    });
    // Batch clashes
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
      // Switch to batch view
      setViewMode('batch');
      setSelectedBatchId(embedData.batchId);
      
      // Set the week if provided
      if (embedData.weekStart) {
        try {
          setCurrentWeekStart(parseISO(embedData.weekStart));
        } catch (e) {
          // Keep current week if parsing fails
        }
      }
      
      // Add entries to grid
      const batch = batches.find(b => b.id === embedData.batchId);
      let addedCount = 0;
      
      embedData.entries.forEach(entry => {
        // Find teacher by name
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
      
      // Clear navigation state
      window.history.replaceState({}, document.title);
      
      toast.success("Timetable embedded!", { 
        description: `${addedCount} entries added to ${batch?.className} - ${batch?.name}` 
      });
    }
  }, [location.state]);

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

  const handleCellClick = (day: string, period: number, existingEntry?: TimetableEntry) => {
    setDialogContext({ day, period, existingEntry });
    setDialogOpen(true);
  };

  const handleRemoveEntry = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      removeEntry(entryId);
      toast.success("Entry removed", { description: `${entry.subjectName} removed from ${entry.day} P${entry.periodNumber}` });
    }
    setDialogOpen(false);
    setDialogContext(null);
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

  // Week navigation handlers
  const goToPreviousWeek = () => setCurrentWeekStart(prev => subWeeks(prev, 1));
  const goToNextWeek = () => setCurrentWeekStart(prev => addWeeks(prev, 1));
  const goToCurrentWeek = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Save/Publish handlers
  const handleSaveDraft = () => {
    setSaveStatus('draft');
    toast.success("Draft saved", { description: `Timetable for week of ${format(currentWeekStart, 'MMM d')} saved as draft` });
  };

  const handlePublish = () => {
    setSaveStatus('published');
    toast.success("Timetable published!", { description: `Week of ${format(currentWeekStart, 'MMM d')} is now visible in View Timetable` });
  };

  // Handle copy week
  const handleCopyWeek = (targetWeeks: Date[], options: CopyOptions) => {
    // Filter entries for current week context
    const currentEntries = viewMode === 'teacher' && selectedTeacher
      ? entries.filter(e => e.teacherId === selectedTeacher.teacherId)
      : viewMode === 'batch' && selectedBatchId
        ? entries.filter(e => e.batchId === selectedBatchId)
        : entries;

    let copiedCount = 0;
    
    targetWeeks.forEach(weekStart => {
      currentEntries.forEach(entry => {
        // Check if should skip holidays
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
  };

  const weekEndDate = addDays(currentWeekStart, 5); // Saturday

  return (
    <div className="space-y-3">
      {/* Compact Header */}
      <PageHeader
        title="Timetable Workspace"
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
          </div>
        }
      />

      {/* Compact All-in-One Toolbar */}
      <Card className="p-2.5 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Week Selector */}
          <div className="flex items-center gap-1 bg-background rounded-lg border p-0.5">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToPreviousWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="px-2 py-1 min-w-[140px] text-center">
              <p className="text-xs font-semibold">
                {format(currentWeekStart, 'MMM d')} – {format(weekEndDate, 'MMM d')}
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goToNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs hidden sm:flex" onClick={goToCurrentWeek}>
            Today
          </Button>

          {/* Divider */}
          <div className="h-5 w-px bg-border hidden sm:block" />

          {/* View Mode Toggle */}
          <Tabs value={viewMode} onValueChange={(v) => { setViewMode(v as 'teacher' | 'batch'); setSelectedBatchId(null); }} className="h-7">
            <TabsList className="h-7 p-0.5">
              <TabsTrigger value="teacher" className="h-6 px-2 text-xs gap-1">
                <User className="w-3 h-3" />
                <span className="hidden sm:inline">Teacher</span>
              </TabsTrigger>
              <TabsTrigger value="batch" className="h-6 px-2 text-xs gap-1">
                <BookOpen className="w-3 h-3" />
                <span className="hidden sm:inline">Batch</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Conflict Badge - Click to expand */}
          <Collapsible open={conflictPanelOpen} onOpenChange={setConflictPanelOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-7 text-xs gap-1",
                  conflictCount > 0 ? "text-destructive hover:text-destructive" : "text-green-600 hover:text-green-600"
                )}
              >
                {conflictCount > 0 ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {conflictCount} Conflict{conflictCount !== 1 ? 's' : ''}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">No Conflicts</span>
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>

          {/* Upload Image - Prominent Action */}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs gap-1 border-primary/30 hover:border-primary hover:bg-primary/5" 
            onClick={() => navigate("/institute/timetable/upload")}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </Button>

          {/* Copy Week */}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs gap-1" 
            onClick={() => setCopyWeekDialogOpen(true)}
            disabled={entries.length === 0}
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copy Week</span>
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Save Status */}
          {saveStatus !== 'unsaved' && (
            <Badge 
              variant={saveStatus === 'published' ? 'default' : 'secondary'} 
              className={cn(
                "text-xs h-6",
                saveStatus === 'published' && "bg-green-100 text-green-700 hover:bg-green-100"
              )}
            >
              {saveStatus === 'draft' ? 'Draft' : 'Published'}
            </Badge>
          )}

          {/* Save/Publish Buttons */}
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleSaveDraft}>
            <Save className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={handlePublish}>
            <Send className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Publish</span>
          </Button>

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="Timetable settings">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/institute/timetable/setup")}>
                <Settings className="w-4 h-4 mr-2" />
                Setup & Configuration
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/institute/timetable/view")}>
                <Eye className="w-4 h-4 mr-2" />
                View Timetable
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Collapsible Conflict Panel */}
      <Collapsible open={conflictPanelOpen} onOpenChange={setConflictPanelOpen}>
        <CollapsibleContent>
          <ConflictSummaryPanel
            entries={entries}
            teachers={teacherLoads}
            onConflictClick={handleConflictClick}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Sidebar */}
        <div className="space-y-2 order-2 lg:order-1">
          {viewMode === 'teacher' ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Select Teacher</h3>
                <Badge variant="secondary" className="text-xs">{teacherLoads.length}</Badge>
              </div>
              <div className="grid grid-cols-1 gap-1.5 max-h-[250px] lg:max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
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
                    constraint={teacherConstraints.find(c => c.teacherId === teacher.teacherId)}
                    currentDayPeriods={entries.filter(e => e.teacherId === teacher.teacherId && e.day === defaultPeriodStructure.workingDays[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]).length}
                    currentDay={defaultPeriodStructure.workingDays[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Select Batch</h3>
                <Badge variant="secondary" className="text-xs">{batches.length}</Badge>
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
        <div className="lg:col-span-3 order-1 lg:order-2">
          {(viewMode === 'teacher' && selectedTeacher) || (viewMode === 'batch' && selectedBatch) ? (
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
                  holidays={holidays}
                  weekStartDate={currentWeekStart}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                {viewMode === 'teacher' ? <User className="w-6 h-6 text-muted-foreground" /> : <BookOpen className="w-6 h-6 text-muted-foreground" />}
              </div>
              <h3 className="font-semibold text-sm mb-1">Select a {viewMode === 'teacher' ? 'Teacher' : 'Batch'}</h3>
              <p className="text-xs text-muted-foreground">Choose from the sidebar to start</p>
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
          existingEntry={dialogContext.existingEntry}
          onAssign={handleAssign}
          onRemove={dialogContext.existingEntry ? () => handleRemoveEntry(dialogContext.existingEntry!.id) : undefined}
          getTeacherConflict={(tid, d, p) => entries.some(e => e.teacherId === tid && e.day === d && e.periodNumber === p)}
          getBatchConflict={(bid, d, p) => entries.some(e => e.batchId === bid && e.day === d && e.periodNumber === p)}
          teacherConstraints={teacherConstraints}
          facilities={facilities}
          getTeacherDayPeriods={(tid, d) => entries.filter(e => e.teacherId === tid && e.day === d).length}
          getFacilityConflict={(fid, d, p) => !!entries.find(e => e.facilityId === fid && e.day === d && e.periodNumber === p)}
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

      {/* Holiday Calendar Dialog */}
      <HolidayCalendarDialog
        open={holidayDialogOpen}
        onClose={() => setHolidayDialogOpen(false)}
        holidays={holidays}
        onSave={(newHolidays) => {
          setHolidays(newHolidays);
          toast.success("Holidays saved", { description: `${newHolidays.length} holidays configured` });
        }}
      />

      {/* Copy Week Dialog */}
      <CopyWeekDialog
        open={copyWeekDialogOpen}
        onClose={() => setCopyWeekDialogOpen(false)}
        sourceWeekStart={currentWeekStart}
        entries={
          viewMode === 'teacher' && selectedTeacher
            ? entries.filter(e => e.teacherId === selectedTeacher.teacherId)
            : viewMode === 'batch' && selectedBatchId
              ? entries.filter(e => e.batchId === selectedBatchId)
              : entries
        }
        holidays={holidays}
        onCopy={handleCopyWeek}
      />
    </div>
  );
};

export default Timetable;
