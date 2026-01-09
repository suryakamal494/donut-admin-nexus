import { format, isToday, isFuture } from "date-fns";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, UserX, UserCheck, 
  AlertTriangle, BookOpen, Users, CheckCircle2, ArrowRight 
} from "lucide-react";
import { useSubstitution } from "@/hooks/useSubstitution";

const Substitution = () => {
  const sub = useSubstitution();

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
          <Button onClick={() => sub.setMarkAbsentDialogOpen(true)} className="gap-2" size="sm">
            <UserX className="w-4 h-4" />
            <span className="hidden sm:inline">Mark Teacher Absent</span>
            <span className="sm:hidden">Mark Absent</span>
          </Button>
        }
      />

      {/* Date Navigator with Calendar Picker */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Button variant="outline" size="icon" onClick={sub.goToPreviousDay} className="shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Popover open={sub.calendarOpen} onOpenChange={sub.setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="gap-1.5 sm:gap-2 hover:bg-muted px-2 sm:px-4 min-w-0 flex-1 sm:flex-none">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                  <div className="text-center min-w-0">
                    <p className="font-semibold text-sm sm:text-lg truncate">
                      {format(sub.selectedDate, 'EEE, MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {isToday(sub.selectedDate) ? "Today" : isFuture(sub.selectedDate) ? "Upcoming" : "Past"} • Click to select date
                    </p>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={sub.selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      sub.setSelectedDate(date);
                      sub.setCalendarOpen(false);
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  modifiers={{
                    hasAbsence: sub.datesWithAbsences,
                    holiday: sub.holidayDates,
                  }}
                  modifiersStyles={{
                    hasAbsence: { backgroundColor: 'hsl(var(--warning) / 0.2)', borderRadius: '50%' },
                    holiday: { backgroundColor: 'hsl(var(--destructive) / 0.15)', color: 'hsl(var(--destructive))' },
                  }}
                />
                <div className="px-3 pb-3 border-t pt-2 text-xs text-muted-foreground flex gap-4">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-warning/30"></span>Has absences</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-destructive/20"></span>Holiday</span>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" onClick={sub.goToNextDay}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {sub.selectedHoliday && (
            <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-sm font-medium text-destructive">🎉 {sub.selectedHoliday.name} - School Holiday</p>
              <p className="text-xs text-muted-foreground mt-1">No classes scheduled for this day</p>
            </div>
          )}
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
                    {sub.urgentCount > 0 && <Badge variant="destructive" className="animate-pulse">{sub.urgentCount} Urgent</Badge>}
                    {sub.assignedCount > 0 && <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">{sub.assignedCount} Assigned</Badge>}
                  </CardTitle>
                  <CardDescription>Classes that need substitute teachers for {format(sub.selectedDate, 'MMM d')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {sub.selectedHoliday ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-destructive opacity-50" />
                  <p className="font-medium">Holiday - {sub.selectedHoliday.name}</p>
                  <p className="text-sm mt-1">No coverage needed for holidays</p>
                </div>
              ) : sub.affectedEntries.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                  <p className="font-medium">All Clear!</p>
                  <p className="text-sm mt-1">No teacher absences for {format(sub.selectedDate, 'MMMM d')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sub.affectedEntries.map(({ entry, absence, substitution }, index) => (
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
                            substitution ? "bg-emerald-100 text-emerald-700" : "bg-destructive/10 text-destructive"
                          )}>
                            P{entry.periodNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{absence.teacherName}</p>
                              {!substitution && <Badge variant="destructive" className="text-xs"><AlertTriangle className="w-3 h-3 mr-1" />Urgent</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{entry.subjectName} • {entry.batchName}</p>
                            {substitution && (
                              <div className="flex items-center gap-2 mt-2 text-sm text-emerald-700">
                                <UserCheck className="w-4 h-4" />
                                <span>Covered by: <strong>{substitution.substituteTeacherName}</strong></span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {substitution ? (
                            <>
                              <Button variant="outline" size="sm" onClick={() => { sub.setSelectedSlot({ entry, absence }); sub.setFindSubstituteDialogOpen(true); }}>Change</Button>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => sub.removeSubstitution(substitution.id)}>Remove</Button>
                            </>
                          ) : (
                            <Button size="sm" onClick={() => { sub.setSelectedSlot({ entry, absence }); sub.setFindSubstituteDialogOpen(true); }} className="gap-1">
                              Find Substitute<ArrowRight className="w-4 h-4" />
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

        {/* Right Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Today's Absences</CardTitle>
              <CardDescription>Teachers marked absent for {format(sub.selectedDate, 'MMM d')}</CardDescription>
            </CardHeader>
            <CardContent>
              {sub.dayAbsences.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No absences recorded</p>
              ) : (
                <div className="space-y-2">
                  {sub.dayAbsences.map(absence => (
                    <div key={absence.id} className="p-3 rounded-lg border bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{absence.teacherName}</p>
                          <p className="text-xs text-muted-foreground">
                            {absence.absenceType === 'full_day' ? 'Full day' : `Periods: ${absence.periods?.join(', ')}`}
                          </p>
                          {absence.reason && <p className="text-xs text-muted-foreground mt-1">Reason: {absence.reason}</p>}
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => sub.cancelAbsence(absence.id)}>Cancel</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-destructive">{sub.urgentCount}</p>
                  <p className="text-xs text-muted-foreground">Need Coverage</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-emerald-600">{sub.assignedCount}</p>
                  <p className="text-xs text-muted-foreground">Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mark Absent Dialog */}
      <Dialog open={sub.markAbsentDialogOpen} onOpenChange={sub.setMarkAbsentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark Teacher Absent</DialogTitle>
            <DialogDescription>Record an absence for {format(sub.selectedDate, 'MMMM d, yyyy')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={sub.absenceForm.teacherId} onValueChange={(v) => sub.setAbsenceForm({ ...sub.absenceForm, teacherId: v })}>
                <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                <SelectContent>
                  {sub.teacherLoads.map(t => <SelectItem key={t.teacherId} value={t.teacherId}>{t.teacherName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Absence Type</Label>
              <div className="flex gap-3">
                <button
                  onClick={() => sub.setAbsenceForm({ ...sub.absenceForm, absenceType: 'full_day', periods: [] })}
                  className={cn("flex-1 p-3 rounded-lg border text-left transition-all", sub.absenceForm.absenceType === 'full_day' ? "bg-primary/10 border-primary ring-1 ring-primary/20" : "hover:border-primary/30")}
                >
                  <p className="font-medium text-sm">Full Day</p><p className="text-xs text-muted-foreground">All periods</p>
                </button>
                <button
                  onClick={() => sub.setAbsenceForm({ ...sub.absenceForm, absenceType: 'partial' })}
                  className={cn("flex-1 p-3 rounded-lg border text-left transition-all", sub.absenceForm.absenceType === 'partial' ? "bg-primary/10 border-primary ring-1 ring-primary/20" : "hover:border-primary/30")}
                >
                  <p className="font-medium text-sm">Specific Periods</p><p className="text-xs text-muted-foreground">Select periods</p>
                </button>
              </div>
            </div>
            {sub.absenceForm.absenceType === 'partial' && (
              <div className="space-y-2">
                <Label>Select Periods</Label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        const periods = sub.absenceForm.periods.includes(p) ? sub.absenceForm.periods.filter(x => x !== p) : [...sub.absenceForm.periods, p];
                        sub.setAbsenceForm({ ...sub.absenceForm, periods });
                      }}
                      className={cn("w-10 h-10 rounded-lg font-medium transition-all border", sub.absenceForm.periods.includes(p) ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground hover:border-primary/50")}
                    >
                      P{p}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Input value={sub.absenceForm.reason} onChange={(e) => sub.setAbsenceForm({ ...sub.absenceForm, reason: e.target.value })} placeholder="e.g., Medical leave, personal emergency" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => sub.setMarkAbsentDialogOpen(false)}>Cancel</Button>
            <Button onClick={sub.handleMarkAbsent}>Mark Absent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Find Substitute Dialog */}
      <Dialog open={sub.findSubstituteDialogOpen} onOpenChange={sub.setFindSubstituteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Find Substitute</DialogTitle>
            <DialogDescription>
              {sub.selectedSlot && <>Coverage for {sub.selectedSlot.entry.subjectName} • {sub.selectedSlot.entry.batchName} • Period {sub.selectedSlot.entry.periodNumber}</>}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {sub.selectedSlot && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Available Teachers</p>
                {sub.getAvailableTeachers(sub.selectedSlot.entry.periodNumber, sub.selectedSlot.entry.teacherId).length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <UserX className="w-8 h-8 mx-auto mb-2 opacity-50" /><p>No teachers available for this period</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {sub.getAvailableTeachers(sub.selectedSlot.entry.periodNumber, sub.selectedSlot.entry.teacherId).map(teacher => {
                      const assignedToday = sub.timetableEntries.filter(e => e.teacherId === teacher.teacherId && e.day === sub.dayName).length;
                      const isSameSubject = teacher.subjects.some(s => sub.selectedSlot!.entry.subjectId.toLowerCase().includes(s.toLowerCase()));
                      return (
                        <button key={teacher.teacherId} onClick={() => sub.handleAssignSubstitute(teacher.teacherId)} className={cn("w-full p-3 rounded-lg border text-left transition-all hover:border-primary hover:bg-primary/5", isSameSubject && "ring-1 ring-emerald-200 border-emerald-300")}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{teacher.teacherName}</p>
                                {isSameSubject && <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Same Subject</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{teacher.subjects.map(s => s.toUpperCase()).join(', ')}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{assignedToday}/{Math.round(teacher.periodsPerWeek / 6)}</p>
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
          <DialogFooter><Button variant="outline" onClick={() => sub.setFindSubstituteDialogOpen(false)}>Cancel</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Substitution;
