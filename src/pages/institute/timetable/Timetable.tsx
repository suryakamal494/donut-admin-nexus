import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimetableGrid, TeacherLoadCard, BatchSelector, AssignmentDialog, InfoTooltip } from "@/components/timetable";
import { defaultPeriodStructure, teacherLoads, timetableEntries, TimetableEntry } from "@/data/timetableData";
import { batches } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { Settings, Upload, User, BookOpen, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const Timetable = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'teacher' | 'batch'>('teacher');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(teacherLoads[0]?.teacherId || null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [entries, setEntries] = useState<TimetableEntry[]>(timetableEntries);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContext, setDialogContext] = useState<{ day: string; period: number } | null>(null);

  const selectedTeacher = teacherLoads.find(t => t.teacherId === selectedTeacherId);
  const selectedBatch = batches.find(b => b.id === selectedBatchId);

  const handleCellClick = (day: string, period: number) => {
    setDialogContext({ day, period });
    setDialogOpen(true);
  };

  const handleAssign = (entry: Omit<TimetableEntry, 'id'>) => {
    const newEntry: TimetableEntry = { ...entry, id: `entry-${Date.now()}` };
    setEntries(prev => [...prev, newEntry]);
    toast.success("Period assigned!", { description: `${entry.subjectName} added to ${entry.day} P${entry.periodNumber}` });
  };

  const getTeacherConflict = (day: string, period: number) => {
    if (!selectedTeacher) return false;
    return entries.some(e => e.teacherId === selectedTeacher.teacherId && e.day === day && e.periodNumber === period);
  };

  const getBatchConflict = (day: string, period: number) => {
    if (viewMode === 'teacher' && selectedTeacher) {
      return false; // Check per batch in dialog
    }
    if (!selectedBatchId) return false;
    return entries.some(e => e.batchId === selectedBatchId && e.day === day && e.periodNumber === period);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable Workspace"
        description="Create and manage your school timetable. Switch between teacher and batch views."
        actions={
          <div className="flex items-center gap-2">
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

      {/* View Mode Toggle */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Tabs value={viewMode} onValueChange={(v) => { setViewMode(v as 'teacher' | 'batch'); setSelectedBatchId(null); }}>
            <TabsList>
              <TabsTrigger value="teacher" className="gap-2"><User className="w-4 h-4" />Teacher View</TabsTrigger>
              <TabsTrigger value="batch" className="gap-2"><BookOpen className="w-4 h-4" />Batch View</TabsTrigger>
            </TabsList>
          </Tabs>
          <InfoTooltip content="Teacher View: Assign a teacher's periods across batches. Batch View: Fill a batch's timetable with teachers." />
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
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {teacherLoads.map(teacher => (
                  <TeacherLoadCard
                    key={teacher.teacherId}
                    teacher={teacher}
                    isSelected={selectedTeacherId === teacher.teacherId}
                    onClick={() => setSelectedTeacherId(teacher.teacherId)}
                    compact
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
                        ? `${selectedTeacher?.periodsPerWeek - selectedTeacher?.assignedPeriods} periods remaining`
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
    </div>
  );
};

export default Timetable;
