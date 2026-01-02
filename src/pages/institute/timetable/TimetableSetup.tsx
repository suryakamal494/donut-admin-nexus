import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoTooltip } from "@/components/timetable";
import { defaultPeriodStructure, teacherLoads, TeacherLoad } from "@/data/timetableData";
import { teachers } from "@/data/instituteData";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  Save, 
  ArrowRight, 
  Check,
  User,
  Coffee
} from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableSetup = () => {
  const navigate = useNavigate();
  
  // Period structure state
  const [workingDays, setWorkingDays] = useState<string[]>(defaultPeriodStructure.workingDays);
  const [periodsPerDay, setPeriodsPerDay] = useState(defaultPeriodStructure.periodsPerDay);
  const [breakAfterPeriod, setBreakAfterPeriod] = useState(defaultPeriodStructure.breakAfterPeriod);
  const [showTimeMapping, setShowTimeMapping] = useState(true);
  const [timeMapping, setTimeMapping] = useState(defaultPeriodStructure.timeMapping);

  // Teacher load states
  const [teacherLoadData, setTeacherLoadData] = useState<TeacherLoad[]>(teacherLoads);
  const [editingTeacher, setEditingTeacher] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setWorkingDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const updateTimeMapping = (period: number, field: 'startTime' | 'endTime', value: string) => {
    setTimeMapping(prev => 
      prev.map(t => t.period === period ? { ...t, [field]: value } : t)
    );
  };

  const updateTeacherLoad = (teacherId: string, field: keyof TeacherLoad, value: any) => {
    setTeacherLoadData(prev =>
      prev.map(t => t.teacherId === teacherId ? { ...t, [field]: value } : t)
    );
  };

  const handleSave = () => {
    // In a real app, this would save to database
    toast.success("Setup saved successfully!", {
      description: "Your period structure and teacher loads have been configured."
    });
    navigate("/institute/timetable");
  };

  const generateTimeMappings = () => {
    const newMappings = [];
    let currentTime = 8 * 60; // 8:00 AM in minutes
    const periodDuration = 45;
    const breakDuration = 30;
    const shortBreak = 15;

    for (let i = 1; i <= periodsPerDay; i++) {
      const startHour = Math.floor(currentTime / 60);
      const startMin = currentTime % 60;
      const endTime = currentTime + periodDuration;
      const endHour = Math.floor(endTime / 60);
      const endMin = endTime % 60;

      newMappings.push({
        period: i,
        startTime: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
        endTime: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
      });

      currentTime = endTime + (i === breakAfterPeriod ? breakDuration : shortBreak);
    }

    setTimeMapping(newMappings);
    toast.success("Time slots generated!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable Setup"
        description="Configure your school's period structure and teacher availability before creating the timetable."
        breadcrumbs={[
          { label: "Timetable", href: "/institute/timetable" },
          { label: "Setup" },
        ]}
      />

      {/* Progress Steps */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">1</div>
          <span className="font-medium text-sm">Period Structure</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">2</div>
          <span className="font-medium text-sm">Teacher Load</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">3</div>
          <span className="text-sm">Build Timetable</span>
        </div>
      </div>

      {/* Section 1: Period Structure */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Period Structure
                <InfoTooltip content="Define your school's daily schedule structure. This includes working days, number of periods, and break times." />
              </CardTitle>
              <CardDescription>Configure your school's daily schedule</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Working Days */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Working Days
              <InfoTooltip content="Select which days of the week your school operates. Sunday is always a holiday." />
            </Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                    workingDays.includes(day)
                      ? "bg-primary text-white border-primary"
                      : "bg-background border-border hover:border-primary/50"
                  )}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {workingDays.length} working days per week
            </p>
          </div>

          {/* Periods Per Day */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Periods Per Day: <span className="font-bold text-primary">{periodsPerDay}</span>
              <InfoTooltip content="How many teaching periods does your school have each day? Breaks are not counted as periods." />
            </Label>
            <Slider
              value={[periodsPerDay]}
              onValueChange={(v) => setPeriodsPerDay(v[0])}
              min={4}
              max={10}
              step={1}
              className="max-w-md"
            />
            <div className="flex justify-between text-xs text-muted-foreground max-w-md">
              <span>4 periods</span>
              <span>10 periods</span>
            </div>
          </div>

          {/* Break After Period */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              Main Break After Period
              <InfoTooltip content="Select after which period the main break (lunch/recess) occurs." />
            </Label>
            <Select value={breakAfterPeriod.toString()} onValueChange={(v) => setBreakAfterPeriod(parseInt(v))}>
              <SelectTrigger className="max-w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: periodsPerDay - 1 }, (_, i) => i + 1).map(p => (
                  <SelectItem key={p} value={p.toString()}>
                    After Period {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coffee className="w-4 h-4" />
              Break will appear after Period {breakAfterPeriod}
            </div>
          </div>

          {/* Time Mapping Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                Time Mapping (Optional)
                <InfoTooltip content="Map each period to specific clock times. This is optional but helps in display." />
              </Label>
              <p className="text-xs text-muted-foreground">
                Assign specific times to each period
              </p>
            </div>
            <Switch checked={showTimeMapping} onCheckedChange={setShowTimeMapping} />
          </div>

          {/* Time Mapping Grid */}
          {showTimeMapping && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Period Times</Label>
                <Button variant="outline" size="sm" onClick={generateTimeMappings}>
                  <Clock className="w-4 h-4 mr-2" />
                  Auto-Generate
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: periodsPerDay }, (_, i) => i + 1).map(period => {
                  const mapping = timeMapping.find(t => t.period === period) || { startTime: '', endTime: '' };
                  const isAfterBreak = period === breakAfterPeriod + 1;
                  
                  return (
                    <div 
                      key={period} 
                      className={cn(
                        "p-3 rounded-xl border space-y-2",
                        isAfterBreak && "ring-2 ring-amber-200 bg-amber-50/50 dark:ring-amber-800 dark:bg-amber-950/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Period {period}</span>
                        {isAfterBreak && (
                          <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
                            After Break
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={mapping.startTime}
                          onChange={(e) => updateTimeMapping(period, 'startTime', e.target.value)}
                          className="text-xs h-8"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="time"
                          value={mapping.endTime}
                          onChange={(e) => updateTimeMapping(period, 'endTime', e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Teacher Load Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Teacher Load Configuration
                <InfoTooltip content="Set how many periods each teacher should teach per week and their preferences." />
              </CardTitle>
              <CardDescription>Define weekly teaching load for each teacher</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherLoadData.map(teacher => {
              const isEditing = editingTeacher === teacher.teacherId;
              const percentage = Math.round((teacher.assignedPeriods / teacher.periodsPerWeek) * 100);
              
              return (
                <div
                  key={teacher.teacherId}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    isEditing ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{teacher.teacherName}</p>
                        <p className="text-sm text-muted-foreground">
                          {teacher.subjects.map(s => s.toUpperCase()).join(', ')} • {teacher.allowedBatches.length} batches
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEditingTeacher(isEditing ? null : teacher.teacherId)}
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </Button>
                  </div>

                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-border space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            Periods Per Week
                            <InfoTooltip content="Total number of periods this teacher should teach each week" />
                          </Label>
                          <div className="flex items-center gap-3">
                            <Slider
                              value={[teacher.periodsPerWeek]}
                              onValueChange={(v) => updateTeacherLoad(teacher.teacherId, 'periodsPerWeek', v[0])}
                              min={10}
                              max={40}
                              step={1}
                              className="flex-1"
                            />
                            <Badge variant="secondary" className="min-w-[60px] justify-center">
                              {teacher.periodsPerWeek}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Working Days</Label>
                          <div className="flex flex-wrap gap-1">
                            {DAYS.map(day => (
                              <button
                                key={day}
                                onClick={() => {
                                  const newDays = teacher.workingDays.includes(day)
                                    ? teacher.workingDays.filter(d => d !== day)
                                    : [...teacher.workingDays, day];
                                  updateTeacherLoad(teacher.teacherId, 'workingDays', newDays);
                                }}
                                className={cn(
                                  "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                                  teacher.workingDays.includes(day)
                                    ? "bg-primary text-white"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                              >
                                {day.slice(0, 2)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`avoid-first-${teacher.teacherId}`}
                            checked={teacher.avoidFirstPeriod}
                            onCheckedChange={(checked) => updateTeacherLoad(teacher.teacherId, 'avoidFirstPeriod', checked)}
                          />
                          <Label htmlFor={`avoid-first-${teacher.teacherId}`} className="text-sm cursor-pointer">
                            Avoid first period
                          </Label>
                          <InfoTooltip content="Teacher prefers not to be scheduled for the first period of the day" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`avoid-last-${teacher.teacherId}`}
                            checked={teacher.avoidLastPeriod}
                            onCheckedChange={(checked) => updateTeacherLoad(teacher.teacherId, 'avoidLastPeriod', checked)}
                          />
                          <Label htmlFor={`avoid-last-${teacher.teacherId}`} className="text-sm cursor-pointer">
                            Avoid last period
                          </Label>
                          <InfoTooltip content="Teacher prefers not to be scheduled for the last period of the day" />
                        </div>
                      </div>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{teacher.periodsPerWeek} periods/week</span>
                      <span>•</span>
                      <span>{teacher.workingDays.length} days</span>
                      {(teacher.avoidFirstPeriod || teacher.avoidLastPeriod) && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600">Has preferences</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
        <div>
          <p className="font-medium">Ready to build your timetable?</p>
          <p className="text-sm text-muted-foreground">
            Save your setup and proceed to the timetable workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/institute/timetable")}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimetableSetup;
