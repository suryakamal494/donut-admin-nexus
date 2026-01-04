import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AcademicTerm, BatchExamSchedule, academicTerms } from "@/data/timetableData";
import { batches } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  FileEdit,
  GraduationCap,
  CalendarDays
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

interface AcademicTimelineEditorProps {
  terms: AcademicTerm[];
  examSchedules: BatchExamSchedule[];
  onUpdateTerms: (terms: AcademicTerm[]) => void;
  onUpdateSchedules: (schedules: BatchExamSchedule[]) => void;
}

export const AcademicTimelineEditor = ({
  terms,
  examSchedules,
  onUpdateTerms,
  onUpdateSchedules,
}: AcademicTimelineEditorProps) => {
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'terms' | 'exams'>('terms');

  const selectedBatch = batches.find(b => b.id === selectedBatchId);
  const batchSchedules = examSchedules.filter(s => s.batchId === selectedBatchId);

  const handleAddTerm = () => {
    const newTerm: AcademicTerm = {
      id: `term-${Date.now()}`,
      name: `Term ${terms.length + 1}`,
      startDate: '',
      endDate: '',
    };
    onUpdateTerms([...terms, newTerm]);
  };

  const handleUpdateTerm = (termId: string, field: keyof AcademicTerm, value: string) => {
    onUpdateTerms(
      terms.map(t => t.id === termId ? { ...t, [field]: value } : t)
    );
  };

  const handleDeleteTerm = (termId: string) => {
    onUpdateTerms(terms.filter(t => t.id !== termId));
    toast.success("Term removed");
  };

  const handleAddExamSchedule = (examType: BatchExamSchedule['examType']) => {
    if (!selectedBatchId) return;
    
    const newSchedule: BatchExamSchedule = {
      id: `sch-${Date.now()}`,
      batchId: selectedBatchId,
      batchName: selectedBatch ? `${selectedBatch.className} - ${selectedBatch.name}` : '',
      termId: terms[0]?.id || '',
      examType,
      dates: [],
      recurringDay: examType === 'weekly' ? 'Saturday' : undefined,
    };
    onUpdateSchedules([...examSchedules, newSchedule]);
    toast.success(`${examType} exam schedule added`);
  };

  const handleUpdateSchedule = (scheduleId: string, field: keyof BatchExamSchedule, value: any) => {
    onUpdateSchedules(
      examSchedules.map(s => s.id === scheduleId ? { ...s, [field]: value } : s)
    );
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    onUpdateSchedules(examSchedules.filter(s => s.id !== scheduleId));
    toast.success("Exam schedule removed");
  };

  const getExamTypeLabel = (type: string) => {
    switch (type) {
      case 'weekly': return 'Weekly Test';
      case 'monthly': return 'Monthly Test';
      case 'terminal': return 'Term Exam';
      case 'annual': return 'Annual Exam';
      default: return type;
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'weekly': return 'bg-blue-100 text-blue-700';
      case 'monthly': return 'bg-amber-100 text-amber-700';
      case 'terminal': return 'bg-purple-100 text-purple-700';
      case 'annual': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'terms' | 'exams')}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="terms" className="gap-2">
            <Calendar className="w-4 h-4" />
            Academic Terms
          </TabsTrigger>
          <TabsTrigger value="exams" className="gap-2">
            <FileEdit className="w-4 h-4" />
            Exam Schedule
          </TabsTrigger>
        </TabsList>

        {/* Terms Tab */}
        <TabsContent value="terms" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Define your academic year terms</p>
            <Button variant="outline" size="sm" onClick={handleAddTerm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Term
            </Button>
          </div>

          <div className="space-y-3">
            {terms.map((term, index) => (
              <Card key={term.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-primary">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Term Name</Label>
                        <Input
                          value={term.name}
                          onChange={(e) => handleUpdateTerm(term.id, 'name', e.target.value)}
                          placeholder="Term 1"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Start Date</Label>
                        <Input
                          type="date"
                          value={term.startDate}
                          onChange={(e) => handleUpdateTerm(term.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">End Date</Label>
                        <Input
                          type="date"
                          value={term.endDate}
                          onChange={(e) => handleUpdateTerm(term.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteTerm(term.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {terms.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No academic terms defined yet</p>
                <p className="text-sm">Add terms to organize your academic year</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="mt-4 space-y-4">
          {/* Batch Selector */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Select Batch</Label>
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a batch..." />
                </SelectTrigger>
                <SelectContent>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.className} - {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedBatchId && (
            <>
              {/* Quick Add Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAddExamSchedule('weekly')} className="gap-2">
                  <Plus className="w-3 h-3" />
                  Weekly Test
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddExamSchedule('monthly')} className="gap-2">
                  <Plus className="w-3 h-3" />
                  Monthly Test
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddExamSchedule('terminal')} className="gap-2">
                  <Plus className="w-3 h-3" />
                  Term Exam
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleAddExamSchedule('annual')} className="gap-2">
                  <Plus className="w-3 h-3" />
                  Annual Exam
                </Button>
              </div>

              {/* Exam Schedules List */}
              <div className="space-y-3">
                {batchSchedules.map((schedule) => (
                  <Card key={schedule.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Badge className={cn("flex-shrink-0", getExamTypeColor(schedule.examType))}>
                          {getExamTypeLabel(schedule.examType)}
                        </Badge>

                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Term</Label>
                              <Select 
                                value={schedule.termId} 
                                onValueChange={(v) => handleUpdateSchedule(schedule.id, 'termId', v)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {terms.map(term => (
                                    <SelectItem key={term.id} value={term.id}>
                                      {term.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {schedule.examType === 'weekly' && (
                              <div className="space-y-1">
                                <Label className="text-xs">Recurring Day</Label>
                                <Select
                                  value={schedule.recurringDay}
                                  onValueChange={(v) => handleUpdateSchedule(schedule.id, 'recurringDay', v)}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                      <SelectItem key={day} value={day}>{day}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          {schedule.examType !== 'weekly' && (
                            <div className="space-y-1">
                              <Label className="text-xs">Exam Dates</Label>
                              <div className="flex flex-wrap gap-2">
                                {schedule.dates.map((date, i) => (
                                  <Badge key={i} variant="outline" className="gap-1">
                                    {format(parseISO(date), 'MMM d')}
                                    <button
                                      onClick={() => {
                                        const newDates = schedule.dates.filter((_, idx) => idx !== i);
                                        handleUpdateSchedule(schedule.id, 'dates', newDates);
                                      }}
                                      className="ml-1 hover:text-destructive"
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                ))}
                                <Input
                                  type="date"
                                  className="w-[140px] h-6 text-xs"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleUpdateSchedule(schedule.id, 'dates', [...schedule.dates, e.target.value]);
                                      e.target.value = '';
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {batchSchedules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileEdit className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No exam schedules for this batch</p>
                    <p className="text-sm">Add exam schedules using the buttons above</p>
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};