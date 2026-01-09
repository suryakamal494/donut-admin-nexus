import { useState, useMemo, useCallback } from "react";
import { format, addDays, subDays } from "date-fns";
import { toast } from "sonner";
import { 
  teacherLoads, 
  timetableEntries, 
  TeacherLoad, 
  TimetableEntry,
  TeacherAbsence,
  SubstitutionAssignment,
  sampleTeacherAbsences,
  sampleSubstitutionAssignments,
  academicHolidays
} from "@/data/timetableData";

export interface AbsenceForm {
  teacherId: string;
  absenceType: 'full_day' | 'partial';
  periods: number[];
  reason: string;
}

export interface SelectedSlot {
  entry: TimetableEntry;
  absence: TeacherAbsence;
}

export const useSubstitution = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [absences, setAbsences] = useState<TeacherAbsence[]>(sampleTeacherAbsences);
  const [substitutions, setSubstitutions] = useState<SubstitutionAssignment[]>(sampleSubstitutionAssignments);
  const [markAbsentDialogOpen, setMarkAbsentDialogOpen] = useState(false);
  const [findSubstituteDialogOpen, setFindSubstituteDialogOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const [absenceForm, setAbsenceForm] = useState<AbsenceForm>({
    teacherId: '',
    absenceType: 'full_day',
    periods: [],
    reason: '',
  });

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayName = format(selectedDate, 'EEEE');

  // Get dates with absences for calendar highlighting
  const datesWithAbsences = useMemo(() => {
    return absences.map(a => new Date(a.date));
  }, [absences]);

  // Get holiday dates
  const holidayDates = useMemo(() => {
    return academicHolidays.map(h => new Date(h.date));
  }, []);

  // Check if selected date is a holiday
  const selectedHoliday = useMemo(() => {
    return academicHolidays.find(h => h.date === dateStr);
  }, [dateStr]);

  // Get affected entries for absentees on the selected date
  const affectedEntries = useMemo(() => {
    const dayAbsences = absences.filter(a => a.date === dateStr);
    const affected: { entry: TimetableEntry; absence: TeacherAbsence; substitution?: SubstitutionAssignment }[] = [];

    dayAbsences.forEach(absence => {
      const teacherEntries = timetableEntries.filter(e => 
        e.teacherId === absence.teacherId && e.day === dayName
      );

      teacherEntries.forEach(entry => {
        if (absence.absenceType === 'full_day' || absence.periods?.includes(entry.periodNumber)) {
          const substitution = substitutions.find(s => 
            s.absenceId === absence.id && 
            s.period === entry.periodNumber &&
            s.date === dateStr
          );
          affected.push({ entry, absence, substitution });
        }
      });
    });

    return affected.sort((a, b) => a.entry.periodNumber - b.entry.periodNumber);
  }, [absences, substitutions, dateStr, dayName]);

  // Get available teachers for a specific period
  const getAvailableTeachers = useCallback((period: number, excludeTeacherId: string) => {
    const busyTeacherIds = timetableEntries
      .filter(e => e.day === dayName && e.periodNumber === period)
      .map(e => e.teacherId);

    return teacherLoads.filter(t => 
      t.teacherId !== excludeTeacherId && 
      !busyTeacherIds.includes(t.teacherId) &&
      t.workingDays.includes(dayName)
    );
  }, [dayName]);

  const handleMarkAbsent = useCallback(() => {
    if (!absenceForm.teacherId) {
      toast.error("Please select a teacher");
      return;
    }

    const teacher = teacherLoads.find(t => t.teacherId === absenceForm.teacherId);
    const newAbsence: TeacherAbsence = {
      id: `absence-${Date.now()}`,
      teacherId: absenceForm.teacherId,
      teacherName: teacher?.teacherName || '',
      date: dateStr,
      absenceType: absenceForm.absenceType,
      periods: absenceForm.absenceType === 'partial' ? absenceForm.periods : undefined,
      reason: absenceForm.reason || undefined,
      createdAt: new Date().toISOString(),
    };

    setAbsences(prev => [...prev, newAbsence]);
    setMarkAbsentDialogOpen(false);
    setAbsenceForm({ teacherId: '', absenceType: 'full_day', periods: [], reason: '' });
    toast.success(`${teacher?.teacherName} marked as absent for ${format(selectedDate, 'MMM d')}`);
  }, [absenceForm, dateStr, selectedDate]);

  const handleAssignSubstitute = useCallback((substituteId: string) => {
    if (!selectedSlot) return;

    const substitute = teacherLoads.find(t => t.teacherId === substituteId);
    const newSubstitution: SubstitutionAssignment = {
      id: `sub-${Date.now()}`,
      absenceId: selectedSlot.absence.id,
      originalTeacherId: selectedSlot.entry.teacherId,
      substituteTeacherId: substituteId,
      substituteTeacherName: substitute?.teacherName || '',
      date: dateStr,
      period: selectedSlot.entry.periodNumber,
      batchId: selectedSlot.entry.batchId,
      batchName: selectedSlot.entry.batchName,
      subject: selectedSlot.entry.subjectName,
      status: 'assigned',
      isTemporary: true,
    };

    setSubstitutions(prev => [...prev, newSubstitution]);
    setFindSubstituteDialogOpen(false);
    setSelectedSlot(null);
    toast.success(`${substitute?.teacherName} assigned as substitute`);
  }, [selectedSlot, dateStr]);

  const removeSubstitution = useCallback((subId: string) => {
    setSubstitutions(prev => prev.filter(s => s.id !== subId));
    toast.success("Substitution removed");
  }, []);

  const cancelAbsence = useCallback((absenceId: string) => {
    setAbsences(prev => prev.filter(a => a.id !== absenceId));
    setSubstitutions(prev => prev.filter(s => s.absenceId !== absenceId));
    toast.success("Absence cancelled");
  }, []);

  // Date navigation
  const goToPreviousDay = useCallback(() => setSelectedDate(prev => subDays(prev, 1)), []);
  const goToNextDay = useCallback(() => setSelectedDate(prev => addDays(prev, 1)), []);

  const urgentCount = affectedEntries.filter(a => !a.substitution).length;
  const assignedCount = affectedEntries.filter(a => a.substitution).length;
  const dayAbsences = absences.filter(a => a.date === dateStr);

  return {
    // Date state
    selectedDate,
    setSelectedDate,
    dateStr,
    dayName,
    goToPreviousDay,
    goToNextDay,
    
    // Calendar
    calendarOpen,
    setCalendarOpen,
    datesWithAbsences,
    holidayDates,
    selectedHoliday,
    
    // Absences
    absences,
    dayAbsences,
    affectedEntries,
    urgentCount,
    assignedCount,
    
    // Substitutions
    substitutions,
    
    // Dialog state
    markAbsentDialogOpen,
    setMarkAbsentDialogOpen,
    findSubstituteDialogOpen,
    setFindSubstituteDialogOpen,
    selectedSlot,
    setSelectedSlot,
    
    // Form state
    absenceForm,
    setAbsenceForm,
    
    // Actions
    handleMarkAbsent,
    handleAssignSubstitute,
    removeSubstitution,
    cancelAbsence,
    getAvailableTeachers,
    
    // Static data
    teacherLoads,
    timetableEntries,
  };
};
