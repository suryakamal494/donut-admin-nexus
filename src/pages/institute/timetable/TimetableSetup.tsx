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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoTooltip, HolidayCalendarDialog, PeriodTypeManager, AcademicTimelineEditor, TeacherConstraintsManager, FacilityManager } from "@/components/timetable";
import { Holiday } from "@/components/timetable/HolidayCalendarDialog";
import { 
  defaultPeriodStructure, 
  teacherLoads, 
  TeacherLoad, 
  PeriodType, 
  defaultPeriodTypes,
  AcademicTerm,
  BatchExamSchedule,
  academicTerms as defaultTerms,
  batchExamSchedules as defaultSchedules,
  academicHolidays,
  TeacherConstraint,
  Facility,
  defaultTeacherConstraints,
  defaultFacilities
} from "@/data/timetableData";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  Save, 
  ArrowRight, 
  Check,
  User,
  Coffee,
  Settings,
  Layers,
  CalendarDays,
  FileEdit,
  CheckCircle2,
  Zap,
  Building2,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableSetup = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("period-structure");
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  // Period structure state
  const [workingDays, setWorkingDays] = useState<string[]>(defaultPeriodStructure.workingDays);
  const [periodsPerDay, setPeriodsPerDay] = useState(defaultPeriodStructure.periodsPerDay);
  const [breakAfterPeriod, setBreakAfterPeriod] = useState(defaultPeriodStructure.breakAfterPeriod);
  const [showTimeMapping, setShowTimeMapping] = useState(true);
  const [timeMapping, setTimeMapping] = useState(defaultPeriodStructure.timeMapping);

  // Period types state
  const [periodTypes, setPeriodTypes] = useState<PeriodType[]>(defaultPeriodTypes);

  // Holidays state
  const [holidays, setHolidays] = useState<Holiday[]>(academicHolidays);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);

  // Academic timeline state
  const [terms, setTerms] = useState<AcademicTerm[]>(defaultTerms);
  const [examSchedules, setExamSchedules] = useState<BatchExamSchedule[]>(defaultSchedules);

  // Teacher load states
  const [teacherLoadData, setTeacherLoadData] = useState<TeacherLoad[]>(teacherLoads);
  const [editingTeacher, setEditingTeacher] = useState<string | null>(null);

  // Advanced mode states
  const [teacherConstraints, setTeacherConstraints] = useState<TeacherConstraint[]>(defaultTeacherConstraints);
  const [facilities, setFacilities] = useState<Facility[]>(defaultFacilities);

  // Progress tracking
  const getTabProgress = (tab: string): 'complete' | 'partial' | 'empty' => {
    switch (tab) {
      case 'period-structure':
        return workingDays.length > 0 && periodsPerDay > 0 ? 'complete' : 'empty';
      case 'period-types':
        return periodTypes.length > 0 ? 'complete' : 'empty';
      case 'holidays':
        return holidays.length > 0 ? 'complete' : 'partial';
      case 'academic-timeline':
        return terms.length > 0 ? (examSchedules.length > 0 ? 'complete' : 'partial') : 'empty';
      case 'teacher-load':
        return teacherLoadData.length > 0 ? 'complete' : 'empty';
      case 'teacher-constraints':
        return teacherConstraints.length > 0 ? 'complete' : 'empty';
      case 'facilities':
        return facilities.length > 0 ? 'complete' : 'empty';
      default:
        return 'empty';
    }
  };

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
    toast.success("Setup saved successfully!", {
      description: "Your timetable configuration has been saved."
    });
    navigate("/institute/timetable");
  };

  const generateTimeMappings = () => {
    const newMappings = [];
    let currentTime = 8 * 60;
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

  const basicTabs = [
    { id: 'period-structure', label: 'Period Structure', icon: Clock },
    { id: 'period-types', label: 'Period Types', icon: Layers },
    { id: 'holidays', label: 'Holidays', icon: CalendarDays },
    { id: 'academic-timeline', label: 'Academic Timeline', icon: FileEdit },
    { id: 'teacher-load', label: 'Teacher Load', icon: User },
  ];

  const advancedTabs = [
    { id: 'teacher-constraints', label: 'Teacher Constraints', icon: AlertTriangle },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
  ];

  const tabs = isAdvancedMode ? [...basicTabs, ...advancedTabs] : basicTabs;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable Setup"
        description="Configure all settings before building your timetable"
        breadcrumbs={[
          { label: "Timetable", href: "/institute/timetable" },
          { label: "Setup" },
        ]}
        actions={
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save & Continue
          </Button>
        }
      />

      {/* Advanced Mode Toggle */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                isAdvancedMode ? "bg-amber-100 dark:bg-amber-900" : "bg-muted"
              )}>
                <Zap className={cn(
                  "w-5 h-5",
                  isAdvancedMode ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                )} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Advanced Setup</p>
                  {isAdvancedMode && (
                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                      Enabled
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isAdvancedMode 
                    ? "Configure teacher constraints and facility management" 
                    : "Enable for teacher constraints, facility scheduling, and more"}
                </p>
              </div>
            </div>
            <Switch 
              checked={isAdvancedMode} 
              onCheckedChange={(checked) => {
                setIsAdvancedMode(checked);
                if (!checked && (activeTab === 'teacher-constraints' || activeTab === 'facilities')) {
                  setActiveTab('period-structure');
                }
              }} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 overflow-x-auto pb-1">
            {tabs.map((tab, index) => {
              const progress = getTabProgress(tab.id);
              const Icon = tab.icon;
              const isAdvancedTab = advancedTabs.some(t => t.id === tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "hover:bg-muted/50",
                    isAdvancedTab && "ring-1 ring-amber-200 dark:ring-amber-800"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    progress === 'complete' && activeTab !== tab.id && "bg-green-100 text-green-700",
                    progress === 'partial' && activeTab !== tab.id && "bg-amber-100 text-amber-700",
                    progress === 'empty' && activeTab !== tab.id && "bg-muted text-muted-foreground",
                    activeTab === tab.id && "bg-white/20 text-white"
                  )}>
                    {progress === 'complete' ? <Check className="w-3.5 h-3.5" /> : index + 1}
                  </div>
                  <span className="text-sm font-medium">{tab.label}</span>
                  {isAdvancedTab && activeTab !== tab.id && (
                    <Zap className="w-3 h-3 text-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="sr-only">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {/* Tab 1: Period Structure */}
        <TabsContent value="period-structure">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
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
        </TabsContent>

        {/* Tab 2: Period Types */}
        <TabsContent value="period-types">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Period Types
                    <InfoTooltip content="Define different types of periods like Library, Lab, Sports, etc. Each type can have unique settings." />
                  </CardTitle>
                  <CardDescription>Configure special period types for your timetable</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PeriodTypeManager 
                periodTypes={periodTypes}
                onUpdate={setPeriodTypes}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Holidays */}
        <TabsContent value="holidays">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Holiday Calendar
                    <InfoTooltip content="Mark dates as holidays. These days will be blocked in the timetable grid automatically." />
                  </CardTitle>
                  <CardDescription>Define school holidays and non-working days</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{holidays.length} Holidays Configured</p>
                  <p className="text-sm text-muted-foreground">These dates will be blocked in the timetable</p>
                </div>
                <Button onClick={() => setHolidayDialogOpen(true)} className="gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Manage Holidays
                </Button>
              </div>

              {/* Holiday Preview */}
              {holidays.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {holidays.slice(0, 8).map((holiday, i) => (
                    <div key={i} className="p-3 rounded-lg border bg-muted/30">
                      <p className="text-sm font-medium">{holiday.name}</p>
                      <p className="text-xs text-muted-foreground">{holiday.date}</p>
                    </div>
                  ))}
                  {holidays.length > 8 && (
                    <div className="p-3 rounded-lg border bg-muted/30 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">+{holidays.length - 8} more</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Academic Timeline */}
        <TabsContent value="academic-timeline">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileEdit className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Academic Timeline
                    <InfoTooltip content="Define academic terms and exam schedules. Exam periods will be highlighted in the timetable." />
                  </CardTitle>
                  <CardDescription>Configure terms and exam schedules for each batch</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AcademicTimelineEditor
                terms={terms}
                examSchedules={examSchedules}
                onUpdateTerms={setTerms}
                onUpdateSchedules={setExamSchedules}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Teacher Load */}
        <TabsContent value="teacher-load">
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
        </TabsContent>

        {/* Tab 6: Teacher Constraints (Advanced) */}
        {isAdvancedMode && (
          <TabsContent value="teacher-constraints">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Teacher Constraints
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        <Zap className="w-3 h-3 mr-1" />
                        Advanced
                      </Badge>
                      <InfoTooltip content="Set detailed availability rules for each teacher including max periods per day, consecutive limits, and time windows." />
                    </CardTitle>
                    <CardDescription>Configure availability rules and limits for teachers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TeacherConstraintsManager
                  teachers={teacherLoadData}
                  constraints={teacherConstraints}
                  onUpdate={setTeacherConstraints}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab 7: Facilities (Advanced) */}
        {isAdvancedMode && (
          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Facility Management
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        <Zap className="w-3 h-3 mr-1" />
                        Advanced
                      </Badge>
                      <InfoTooltip content="Manage labs, sports facilities, special rooms, and classrooms. Set capacity limits and class restrictions." />
                    </CardTitle>
                    <CardDescription>Configure rooms, labs, and resources for scheduling</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <FacilityManager
                  facilities={facilities}
                  onUpdate={setFacilities}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Holiday Dialog */}
      <HolidayCalendarDialog
        open={holidayDialogOpen}
        onClose={() => setHolidayDialogOpen(false)}
        holidays={holidays}
        onSave={(newHolidays) => {
          setHolidays(newHolidays);
          toast.success("Holidays saved");
        }}
      />

      {/* Save Actions Footer */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
        <div>
          <p className="font-medium">Ready to build your timetable?</p>
          <p className="text-sm text-muted-foreground">
            Save your setup and proceed to the workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/institute/timetable")}>
            Skip for now
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