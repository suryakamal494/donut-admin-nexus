import { useState, useMemo } from "react";
import { format, addDays, subDays, isToday, isFuture, isPast } from "date-fns";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  UserX, 
  UserCheck, 
  AlertTriangle,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  Search,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { 
  teacherLoads, 
  timetableEntries, 
  TeacherLoad, 
  TimetableEntry,
  TeacherAbsence,
  SubstitutionAssignment 
} from "@/data/timetableData";

const Substitution = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [absences, setAbsences] = useState<TeacherAbsence[]>([]);
  const [substitutions, setSubstitutions] = useState<SubstitutionAssignment[]>([]);
  const [markAbsentDialogOpen, setMarkAbsentDialogOpen] = useState(false);
  const [findSubstituteDialogOpen, setFindSubstituteDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    entry: TimetableEntry;
    absence: TeacherAbsence;
  } | null>(null);

  // Mark Absent form state
  const [absenceForm, setAbsenceForm] = useState({
    teacherId: '',
    absenceType: 'full_day' as 'full_day' | 'partial',
    periods: [] as number[],
    reason: '',
  });

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayName = format(selectedDate, 'EEEE');

  // Get affected entries for absentees on the selected date
  const getAffectedEntries = useMemo(() => {
    const dayAbsences = absences.filter(a => a.date === dateStr);
    const affected: { entry: TimetableEntry; absence: TeacherAbsence; substitution?: SubstitutionAssignment }[] = [];

    dayAbsences.forEach(absence => {
      // Find all entries for this teacher on this day
      const teacherEntries = timetableEntries.filter(e => 
        e.teacherId === absence.teacherId && e.day === dayName
      );

      teacherEntries.forEach(entry => {
        // Check if this period is affected
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
  const getAvailableTeachers = (period: number, excludeTeacherId: string) => {
    // Find teachers who don't have a class at this period on this day
    const busyTeacherIds = timetableEntries
      .filter(e => e.day === dayName && e.periodNumber === period)
      .map(e => e.teacherId);

    return teacherLoads.filter(t => 
      t.teacherId !== excludeTeacherId && 
      !busyTeacherIds.includes(t.teacherId) &&
      t.workingDays.includes(dayName)
    );
  };

  const handleMarkAbsent = () => {
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

    setAbsences([...absences, newAbsence]);
    setMarkAbsentDialogOpen(false);
    setAbsenceForm({ teacherId: '', absenceType: 'full_day', periods: [], reason: '' });
    toast.success(`${teacher?.teacherName} marked as absent for ${format(selectedDate, 'MMM d')}`);
  };

  const handleAssignSubstitute = (substituteId: string) => {
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

    setSubstitutions([...substitutions, newSubstitution]);
    setFindSubstituteDialogOpen(false);
    setSelectedSlot(null);
    toast.success(`${substitute?.teacherName} assigned as substitute`);
  };

  const removeSubstitution = (subId: string) => {
    setSubstitutions(substitutions.filter(s => s.id !== subId));
    toast.success("Substitution removed");
  };

  const cancelAbsence = (absenceId: string) => {
    setAbsences(absences.filter(a => a.id !== absenceId));
    setSubstitutions(substitutions.filter(s => s.absenceId !== absenceId));
    toast.success("Absence cancelled");
  };

  const urgentCount = getAffectedEntries.filter(a => !a.substitution).length;
  const assignedCount = getAffectedEntries.filter(a => a.substitution).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Substitution Management"
        description="Manage teacher absences and find coverage"
        breadcrumbs={[
          { label: "Timetable", href: "/institute/timetable" },
          { label: "Substitution" },
        ]}
        actions={
          <Button onClick={() => setMarkAbsentDialogOpen(true)} className="gap-2">
            <UserX className="w-4 h-4" />
            Mark Teacher Absent
          </Button>
        }
      />

      {/* Date Navigator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="text-center">
                <p className="font-semibold text-lg">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isToday(selectedDate) ? "Today" : isFuture(selectedDate) ? "Upcoming" : "Past"}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coverage Needed Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Coverage Needed
                    {urgentCount > 0 && (
                      <Badge variant="destructive" className="animate-pulse">
                        {urgentCount} Urgent
                      </Badge>
                    )}
                    {assignedCount > 0 && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {assignedCount} Assigned
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Classes that need substitute teachers today
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {getAffectedEntries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                  <p className="font-medium">All Clear!</p>
                  <p className="text-sm mt-1">No teacher absences for {format(selectedDate, 'MMMM d')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getAffectedEntries.map(({ entry, absence, substitution }, index) => (
                    <div
                      key={`${entry.id}-${index}`}
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        substitution 
                          ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800"
                          : "bg-destructive/5 border-destructive/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                            substitution 
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400"
                              : "bg-destructive/10 text-destructive"
                          )}>
                            P{entry.periodNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{absence.teacherName}</p>
                              {!substitution && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {entry.subjectName} • {entry.batchName}
                            </p>
                            
                            {substitution && (
                              <div className="flex items-center gap-2 mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                                <UserCheck className="w-4 h-4" />
                                <span>Covered by: <strong>{substitution.substituteTeacherName}</strong></span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {substitution ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedSlot({ entry, absence });
                                  setFindSubstituteDialogOpen(true);
                                }}
                              >
                                Change
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeSubstitution(substitution.id)}
                              >
                                Remove
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedSlot({ entry, absence });
                                setFindSubstituteDialogOpen(true);
                              }}
                              className="gap-1"
                            >
                              Find Substitute
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Teachers Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Today's Absences
              </CardTitle>
              <CardDescription>
                Teachers marked absent for {format(selectedDate, 'MMM d')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {absences.filter(a => a.date === dateStr).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No absences recorded
                </p>
              ) : (
                <div className="space-y-2">
                  {absences.filter(a => a.date === dateStr).map(absence => (
                    <div
                      key={absence.id}
                      className="p-3 rounded-lg border bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{absence.teacherName}</p>
                          <p className="text-xs text-muted-foreground">
                            {absence.absenceType === 'full_day' 
                              ? 'Full day' 
                              : `Periods: ${absence.periods?.join(', ')}`}
                          </p>
                          {absence.reason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Reason: {absence.reason}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={() => cancelAbsence(absence.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-destructive">{urgentCount}</p>
                  <p className="text-xs text-muted-foreground">Need Coverage</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-emerald-600">{assignedCount}</p>
                  <p className="text-xs text-muted-foreground">Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mark Absent Dialog */}
      <Dialog open={markAbsentDialogOpen} onOpenChange={setMarkAbsentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Teacher Absent</DialogTitle>
            <DialogDescription>
              Record an absence for {format(selectedDate, 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select 
                value={absenceForm.teacherId} 
                onValueChange={(v) => setAbsenceForm({ ...absenceForm, teacherId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teacherLoads.map(t => (
                    <SelectItem key={t.teacherId} value={t.teacherId}>
                      {t.teacherName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Absence Type</Label>
              <div className="flex gap-3">
                <button
                  onClick={() => setAbsenceForm({ ...absenceForm, absenceType: 'full_day', periods: [] })}
                  className={cn(
                    "flex-1 p-3 rounded-lg border text-left transition-all",
                    absenceForm.absenceType === 'full_day'
                      ? "bg-primary/10 border-primary ring-1 ring-primary/20"
                      : "hover:border-primary/30"
                  )}
                >
                  <p className="font-medium text-sm">Full Day</p>
                  <p className="text-xs text-muted-foreground">All periods</p>
                </button>
                <button
                  onClick={() => setAbsenceForm({ ...absenceForm, absenceType: 'partial' })}
                  className={cn(
                    "flex-1 p-3 rounded-lg border text-left transition-all",
                    absenceForm.absenceType === 'partial'
                      ? "bg-primary/10 border-primary ring-1 ring-primary/20"
                      : "hover:border-primary/30"
                  )}
                >
                  <p className="font-medium text-sm">Specific Periods</p>
                  <p className="text-xs text-muted-foreground">Select periods</p>
                </button>
              </div>
            </div>

            {absenceForm.absenceType === 'partial' && (
              <div className="space-y-2">
                <Label>Select Periods</Label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        const periods = absenceForm.periods.includes(p)
                          ? absenceForm.periods.filter(x => x !== p)
                          : [...absenceForm.periods, p];
                        setAbsenceForm({ ...absenceForm, periods });
                      }}
                      className={cn(
                        "w-10 h-10 rounded-lg font-medium transition-all border",
                        absenceForm.periods.includes(p)
                          ? "bg-primary text-white border-primary"
                          : "bg-muted text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      P{p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Input
                value={absenceForm.reason}
                onChange={(e) => setAbsenceForm({ ...absenceForm, reason: e.target.value })}
                placeholder="e.g., Medical leave, personal emergency"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkAbsentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkAbsent}>
              Mark Absent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Find Substitute Dialog */}
      <Dialog open={findSubstituteDialogOpen} onOpenChange={setFindSubstituteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Find Substitute</DialogTitle>
            <DialogDescription>
              {selectedSlot && (
                <>
                  Coverage for {selectedSlot.entry.subjectName} • {selectedSlot.entry.batchName} • Period {selectedSlot.entry.periodNumber}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {selectedSlot && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Available Teachers</p>
                {getAvailableTeachers(selectedSlot.entry.periodNumber, selectedSlot.entry.teacherId).length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <UserX className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No teachers available for this period</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {getAvailableTeachers(selectedSlot.entry.periodNumber, selectedSlot.entry.teacherId).map(teacher => {
                      const assignedToday = timetableEntries.filter(e => 
                        e.teacherId === teacher.teacherId && e.day === dayName
                      ).length;
                      const isSameSubject = teacher.subjects.some(s => 
                        selectedSlot.entry.subjectId.toLowerCase().includes(s.toLowerCase())
                      );

                      return (
                        <button
                          key={teacher.teacherId}
                          onClick={() => handleAssignSubstitute(teacher.teacherId)}
                          className={cn(
                            "w-full p-3 rounded-lg border text-left transition-all hover:border-primary hover:bg-primary/5",
                            isSameSubject && "ring-1 ring-emerald-200 border-emerald-300"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{teacher.teacherName}</p>
                                {isSameSubject && (
                                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                    Same Subject
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {teacher.subjects.map(s => s.toUpperCase()).join(', ')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{assignedToday}/{teacher.periodsPerWeek / 6}</p>
                              <p className="text-xs text-muted-foreground">periods today</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFindSubstituteDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Substitution;