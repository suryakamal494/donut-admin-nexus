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
import { InfoTooltip, HolidayCalendarDialog, PeriodTypeManager, TeacherConstraintsManager, FacilityManager } from "@/components/timetable";
import { Holiday } from "@/components/timetable/HolidayCalendarDialog";
import { BreakConfig } from "@/data/timetableData";
import { 
  defaultPeriodStructure, 
  teacherLoads, 
  TeacherLoad, 
  PeriodType, 
  defaultPeriodTypes,
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
  const [breaks, setBreaks] = useState<BreakConfig[]>(defaultPeriodStructure.breaks);
  const [useTimeMapping, setUseTimeMapping] = useState(defaultPeriodStructure.useTimeMapping);
  const [timeMapping, setTimeMapping] = useState(defaultPeriodStructure.timeMapping);

  // Period types state
  const [periodTypes, setPeriodTypes] = useState<PeriodType[]>(defaultPeriodTypes);

  // Holidays state
  const [holidays, setHolidays] = useState<Holiday[]>(academicHolidays);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);

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
    let currentTime = 8 * 60; // Start at 8:00 AM
    const periodDuration = 45;
    
    // Sort breaks by afterPeriod
    const sortedBreaks = [...breaks].sort((a, b) => a.afterPeriod - b.afterPeriod);

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

      // Add break duration if there's a break after this period
      const breakAfterThis = sortedBreaks.find(b => b.afterPeriod === i);
      currentTime = endTime + (breakAfterThis ? breakAfterThis.duration : 0);
    }

    setTimeMapping(newMappings);
    toast.success("Time slots generated based on your break configuration!");
  };

  // Add a new break
  const addBreak = () => {
    if (breaks.length >= 4) {
      toast.error("Maximum 4 breaks allowed");
      return;
    }
    
    // Find the first available period position
    const usedPositions = breaks.map(b => b.afterPeriod);
    let newPosition = 2;
    for (let i = 1; i < periodsPerDay; i++) {
      if (!usedPositions.includes(i)) {
        newPosition = i;
        break;
      }
    }
    
    const newBreak: BreakConfig = {
      id: `break-${Date.now()}`,
      name: breaks.length === 0 ? 'Short Break' : 
            breaks.length === 1 ? 'Lunch Break' : 
            breaks.length === 2 ? 'Snacks Break' : 'Break',
      afterPeriod: newPosition,
      duration: breaks.length === 1 ? 30 : 15, // Lunch is usually longer
    };
    
    setBreaks([...breaks, newBreak]);
  };

  // Update a break
  const updateBreak = (id: string, field: keyof BreakConfig, value: any) => {
    setBreaks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  // Remove a break
  const removeBreak = (id: string) => {
    setBreaks(prev => prev.filter(b => b.id !== id));
  };

  const basicTabs = [
    { id: 'period-structure', label: 'Period Structure', icon: Clock },
    { id: 'period-types', label: 'Period Types', icon: Layers },
    { id: 'holidays', label: 'Holidays', icon: CalendarDays },
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
            <span className="hidden sm:inline">Save & Continue</span>
            <span className="sm:hidden">Save</span>
          </Button>
        }
      />

      {/* Advanced Mode Toggle */}
      <Card className="border-dashed">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                isAdvancedMode ? "bg-amber-100 dark:bg-amber-900" : "bg-muted"
              )}>
                <Zap className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5",
                  isAdvancedMode ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                )} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm sm:text-base">Advanced Setup</p>
                  {isAdvancedMode && (
                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
                      Enabled
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">
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
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 overflow-x-auto pb-2 scrollbar-thin">
            {tabs.map((tab, index) => {
              const progress = getTabProgress(tab.id);
              const Icon = tab.icon;
              const isAdvancedTab = advancedTabs.some(t => t.id === tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap shrink-0",
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "hover:bg-muted/50",
                    isAdvancedTab && "ring-1 ring-amber-200 dark:ring-amber-800"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                    progress === 'complete' && activeTab !== tab.id && "bg-green-100 text-green-700",
                    progress === 'partial' && activeTab !== tab.id && "bg-amber-100 text-amber-700",
                    progress === 'empty' && activeTab !== tab.id && "bg-muted text-muted-foreground",
                    activeTab === tab.id && "bg-white/20 text-white"
                  )}>
                    {progress === 'complete' ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : index + 1}
                  </div>
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">{tab.label}</span>
                  <span className="text-xs font-medium sm:hidden">{tab.label.split(' ')[0]}</span>
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

              {/* Breaks Configuration (Multiple) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    Breaks Configuration
                    <InfoTooltip content="Configure multiple breaks throughout the day. Common breaks include Short Break, Lunch Break, and Snacks Break." />
                  </Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addBreak}
                    disabled={breaks.length >= 4}
                  >
                    <Coffee className="w-4 h-4 mr-2" />
                    Add Break
                  </Button>
                </div>
                
                {breaks.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed text-center">
                    <Coffee className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No breaks configured</p>
                    <p className="text-xs text-muted-foreground mt-1">Add breaks to define rest periods in your timetable</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {breaks.sort((a, b) => a.afterPeriod - b.afterPeriod).map(breakItem => (
                      <div 
                        key={breakItem.id}
                        className="p-4 rounded-xl border bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-800/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-amber-600" />
                            <Input
                              value={breakItem.name}
                              onChange={(e) => updateBreak(breakItem.id, 'name', e.target.value)}
                              className="h-7 text-sm font-medium w-32 bg-white dark:bg-background"
                              placeholder="Break name"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeBreak(breakItem.id)}
                          >
                            ×
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">After Period</Label>
                            <Select 
                              value={breakItem.afterPeriod.toString()} 
                              onValueChange={(v) => updateBreak(breakItem.id, 'afterPeriod', parseInt(v))}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: periodsPerDay - 1 }, (_, i) => i + 1).map(p => (
                                  <SelectItem key={p} value={p.toString()}>
                                    Period {p}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Duration (min)</Label>
                            <Select 
                              value={breakItem.duration.toString()} 
                              onValueChange={(v) => updateBreak(breakItem.id, 'duration', parseInt(v))}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">10 min</SelectItem>
                                <SelectItem value="15">15 min</SelectItem>
                                <SelectItem value="20">20 min</SelectItem>
                                <SelectItem value="30">30 min</SelectItem>
                                <SelectItem value="45">45 min</SelectItem>
                                <SelectItem value="60">60 min</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {breaks.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    <Coffee className="w-4 h-4" />
                    <span>
                      Breaks after: {breaks.sort((a, b) => a.afterPeriod - b.afterPeriod).map(b => `P${b.afterPeriod}`).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Time Mapping Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    Use Time Mapping
                    <InfoTooltip content="When enabled, periods will show clock times (8:00-8:45). When disabled, only period numbers will be shown (P1, P2, etc.)." />
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {useTimeMapping ? "Display clock times for each period" : "Display period numbers only (P1, P2...)"}
                  </p>
                </div>
                <Switch checked={useTimeMapping} onCheckedChange={setUseTimeMapping} />
              </div>

              {/* Time Mapping Grid */}
              {useTimeMapping && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Period Times</Label>
                    <Button variant="outline" size="sm" onClick={generateTimeMappings}>
                      <Clock className="w-4 h-4 mr-2" />
                      Auto-Generate
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    {Array.from({ length: periodsPerDay }, (_, i) => i + 1).map(period => {
                      const mapping = timeMapping.find(t => t.period === period) || { startTime: '', endTime: '' };
                      const isAfterBreak = breaks.some(b => b.afterPeriod === period - 1);
                      const breakBefore = breaks.find(b => b.afterPeriod === period - 1);
                      
                      return (
                        <div 
                          key={period} 
                          className={cn(
                            "p-3 rounded-xl border space-y-2 min-w-0",
                            isAfterBreak && "ring-2 ring-amber-200 bg-amber-50/50 dark:ring-amber-800 dark:bg-amber-950/20"
                          )}
                        >
                          <div className="flex items-center justify-between gap-1 min-w-0">
                            <span className="text-sm font-medium shrink-0">P{period}</span>
                            {isAfterBreak && breakBefore && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-200 truncate">
                                After {breakBefore.name.split(' ')[0]}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="time"
                              value={mapping.startTime}
                              onChange={(e) => updateTimeMapping(period, 'startTime', e.target.value)}
                              className="text-xs h-8 px-1.5"
                            />
                            <span className="text-muted-foreground shrink-0">-</span>
                            <Input
                              type="time"
                              value={mapping.endTime}
                              onChange={(e) => updateTimeMapping(period, 'endTime', e.target.value)}
                              className="text-xs h-8 px-1.5"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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

        {/* Tab 4: Teacher Load */}
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