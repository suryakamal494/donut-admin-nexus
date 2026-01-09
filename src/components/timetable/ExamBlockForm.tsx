import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExamBlock, ExamType, ScopeType, DateType, TimeType, scopeTypeConfig } from "@/types/examBlock";
import { coursesForBlocks, classesForBlocks, batchesForBlocks, defaultExamTypes } from "@/data/examBlockData";
import { ExamTypeManager } from "./ExamTypeManager";
import { cn } from "@/lib/utils";
import { format, isSameDay, parseISO } from "date-fns";
import { 
  Calendar as CalendarIcon, Building2, BookOpen, GraduationCap, Users, 
  Clock, Repeat, X, Save, Plus
} from "lucide-react";

interface ExamBlockFormProps {
  existingBlock?: ExamBlock | null;
  onSave: (block: ExamBlock) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const scopeIcons: Record<ScopeType, React.ElementType> = {
  institution: Building2,
  course: BookOpen,
  class: GraduationCap,
  batch: Users,
};

export const ExamBlockForm = ({ existingBlock, onSave, onCancel }: ExamBlockFormProps) => {
  // Exam types state
  const [examTypes, setExamTypes] = useState<ExamType[]>(defaultExamTypes);
  
  // Form state
  const [name, setName] = useState(existingBlock?.name || "");
  const [description, setDescription] = useState(existingBlock?.description || "");
  const [examTypeId, setExamTypeId] = useState(existingBlock?.examTypeId || "type-exam");
  const [scopeType, setScopeType] = useState<ScopeType>(existingBlock?.scopeType || "institution");
  const [scopeId, setScopeId] = useState(existingBlock?.scopeId || "");
  const [scopeName, setScopeName] = useState(existingBlock?.scopeName || "");
  const [dateType, setDateType] = useState<DateType>(existingBlock?.dateType || "single_day");
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    existingBlock?.dates?.map(d => parseISO(d)) || []
  );
  const [recurringDay, setRecurringDay] = useState(existingBlock?.recurringConfig?.dayOfWeek || "Saturday");
  const [recurringStartDate, setRecurringStartDate] = useState<Date | undefined>(
    existingBlock?.recurringConfig?.startDate ? parseISO(existingBlock.recurringConfig.startDate) : undefined
  );
  const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>(
    existingBlock?.recurringConfig?.endDate ? parseISO(existingBlock.recurringConfig.endDate) : undefined
  );
  const [timeType, setTimeType] = useState<TimeType>(existingBlock?.timeType || "full_day");
  const [startTime, setStartTime] = useState(existingBlock?.startTime || "09:00");
  const [endTime, setEndTime] = useState(existingBlock?.endTime || "12:00");
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>(existingBlock?.periods || []);

  // Determine if recurring should be available
  const canShowRecurring = dateType !== 'multi_day' && timeType !== 'full_day';

  // Reset date type if conditions change
  useEffect(() => {
    if (dateType === 'recurring' && !canShowRecurring) {
      setDateType('single_day');
    }
  }, [timeType, canShowRecurring, dateType]);

  // Get scope options based on type
  const getScopeOptions = () => {
    switch (scopeType) {
      case 'course':
        return coursesForBlocks;
      case 'class':
        return classesForBlocks;
      case 'batch':
        return batchesForBlocks;
      default:
        return [];
    }
  };

  const handleScopeChange = (id: string) => {
    setScopeId(id);
    const options = getScopeOptions();
    const selected = options.find(o => o.id === id);
    setScopeName(selected?.name || "");
  };

  const togglePeriod = (period: number) => {
    setSelectedPeriods(prev => 
      prev.includes(period) ? prev.filter(p => p !== period) : [...prev, period].sort((a, b) => a - b)
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (dateType === 'single_day') {
      setSelectedDates([date]);
    } else if (dateType === 'multi_day') {
      // Toggle date in multi-select
      const exists = selectedDates.some(d => isSameDay(d, date));
      if (exists) {
        setSelectedDates(prev => prev.filter(d => !isSameDay(d, date)));
      } else {
        setSelectedDates(prev => [...prev, date].sort((a, b) => a.getTime() - b.getTime()));
      }
    }
  };

  const handleAddExamType = (type: ExamType) => {
    setExamTypes(prev => [...prev, type]);
  };

  const handleUpdateExamType = (type: ExamType) => {
    setExamTypes(prev => prev.map(t => t.id === type.id ? type : t));
  };

  const handleDeleteExamType = (typeId: string) => {
    setExamTypes(prev => prev.filter(t => t.id !== typeId));
    if (examTypeId === typeId) {
      setExamTypeId("type-exam");
    }
  };

  const handleSubmit = () => {
    const block: ExamBlock = {
      id: existingBlock?.id || "",
      name,
      description: description || undefined,
      examTypeId,
      scopeType,
      scopeId: scopeType !== 'institution' ? scopeId : undefined,
      scopeName: scopeType !== 'institution' ? scopeName : undefined,
      dateType,
      dates: dateType !== 'recurring' ? selectedDates.map(d => format(d, 'yyyy-MM-dd')) : [],
      recurringConfig: dateType === 'recurring' ? {
        dayOfWeek: recurringDay,
        startDate: recurringStartDate ? format(recurringStartDate, 'yyyy-MM-dd') : '',
        endDate: recurringEndDate ? format(recurringEndDate, 'yyyy-MM-dd') : '',
      } : undefined,
      timeType,
      startTime: timeType === 'time_range' ? startTime : undefined,
      endTime: timeType === 'time_range' ? endTime : undefined,
      periods: timeType === 'periods' ? selectedPeriods : undefined,
      createdAt: existingBlock?.createdAt || new Date().toISOString(),
      isActive: existingBlock?.isActive ?? true,
    };
    
    onSave(block);
  };

  const isValid = name.trim() && 
    (scopeType === 'institution' || scopeId) &&
    (dateType === 'recurring' ? (recurringStartDate && recurringEndDate) : selectedDates.length > 0) &&
    (timeType === 'full_day' || timeType === 'time_range' || selectedPeriods.length > 0);

  const getTypeColor = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'green': return 'bg-green-100 text-green-700 border-green-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pink': return 'bg-pink-100 text-pink-700 border-pink-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const selectedType = examTypes.find(t => t.id === examTypeId);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Step 1: Exam Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span>
            Exam Details
          </CardTitle>
          <CardDescription>Choose exam type and enter details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Exam Type Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Exam Type *</Label>
              <ExamTypeManager
                examTypes={examTypes}
                onAddType={handleAddExamType}
                onUpdateType={handleUpdateExamType}
                onDeleteType={handleDeleteExamType}
              />
            </div>
            <Select value={examTypeId} onValueChange={setExamTypeId}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue>
                  {selectedType && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs", getTypeColor(selectedType.color))}>
                        {selectedType.name}
                      </Badge>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs", getTypeColor(type.color))}>
                        {type.name}
                      </Badge>
                      {type.isDefault && (
                        <span className="text-[10px] text-muted-foreground">(default)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Exam Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Mid-Term Examination"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Applicable For */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span>
            Applicable For
          </CardTitle>
          <CardDescription>Select who this exam applies to</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scope Type Selection */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {(Object.keys(scopeTypeConfig) as ScopeType[]).map((type) => {
              const config = scopeTypeConfig[type];
              const Icon = scopeIcons[type];
              return (
                <button
                  key={type}
                  onClick={() => {
                    setScopeType(type);
                    setScopeId("");
                    setScopeName("");
                  }}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 rounded-xl border transition-all text-left",
                    scopeType === type
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", scopeType === type ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{config.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-1">{config.description}</span>
                </button>
              );
            })}
          </div>

          {/* Scope Selection Dropdown */}
          {scopeType !== 'institution' && (
            <div className="space-y-2">
              <Label>Select {scopeTypeConfig[scopeType].label} *</Label>
              <Select value={scopeId} onValueChange={handleScopeChange}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder={`Choose a ${scopeType}...`} />
                </SelectTrigger>
                <SelectContent>
                  {getScopeOptions().map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                      {'course' in option && (
                        <span className="text-muted-foreground ml-2">({(option as any).course})</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 3: Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">3</span>
            Schedule
          </CardTitle>
          <CardDescription>Set the date and time for this exam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Type Selection */}
          <div className="space-y-3">
            <Label>Date Selection</Label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDateType('single_day')}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  dateType === 'single_day'
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                )}
              >
                Single Day
              </button>
              <button
                onClick={() => setDateType('multi_day')}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  dateType === 'multi_day'
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                )}
              >
                Multiple Days
              </button>
              {canShowRecurring && (
                <button
                  onClick={() => setDateType('recurring')}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2",
                    dateType === 'recurring'
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Repeat className="w-4 h-4" />
                  Recurring
                </button>
              )}
            </div>
          </div>

          {/* Date Picker */}
          {dateType !== 'recurring' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>
                  {dateType === 'single_day' ? 'Select Date' : 'Select Dates (click to add/remove)'}
                </Label>
                {selectedDates.length > 0 && (
                  <Badge variant="secondary">{selectedDates.length} day(s) selected</Badge>
                )}
              </div>
              <div className="flex justify-center sm:justify-start">
                <Calendar
                  mode="single"
                  selected={selectedDates[selectedDates.length - 1]}
                  onSelect={handleDateSelect}
                  modifiers={{ selected: selectedDates }}
                  modifiersStyles={{ selected: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' } }}
                  className="rounded-md border"
                />
              </div>
              {selectedDates.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedDates.map((date, idx) => (
                    <Badge key={idx} variant="outline" className="gap-1">
                      {format(date, 'MMM d, yyyy')}
                      {dateType === 'multi_day' && (
                        <button onClick={() => handleDateSelect(date)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select value={recurringDay} onValueChange={setRecurringDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {recurringStartDate ? format(recurringStartDate, 'MMM d, yyyy') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={recurringStartDate} onSelect={setRecurringStartDate} />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {recurringEndDate ? format(recurringEndDate, 'MMM d, yyyy') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={recurringEndDate} onSelect={setRecurringEndDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {recurringStartDate && recurringEndDate && (
                <p className="text-sm text-muted-foreground">
                  This exam will repeat every <strong>{recurringDay}</strong> from {format(recurringStartDate, 'MMM d')} to {format(recurringEndDate, 'MMM d, yyyy')}
                </p>
              )}
            </div>
          )}

          {/* Time Type Selection */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Time Specification</Label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTimeType('full_day')}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  timeType === 'full_day'
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                )}
              >
                Full Day
              </button>
              <button
                onClick={() => setTimeType('time_range')}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2",
                  timeType === 'time_range'
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Clock className="w-4 h-4" />
                Time Range
              </button>
              <button
                onClick={() => setTimeType('periods')}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                  timeType === 'periods'
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                )}
              >
                Specific Periods
              </button>
            </div>
          </div>

          {/* Time Range Inputs */}
          {timeType === 'time_range' && (
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-32"
                />
              </div>
              <span className="mt-6 text-muted-foreground">to</span>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
          )}

          {/* Period Selection */}
          {timeType === 'periods' && (
            <div className="space-y-3">
              <Label>Select Periods</Label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(period => (
                  <button
                    key={period}
                    onClick={() => togglePeriod(period)}
                    className={cn(
                      "w-10 h-10 rounded-lg border text-sm font-medium transition-all",
                      selectedPeriods.includes(period)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    P{period}
                  </button>
                ))}
              </div>
              {selectedPeriods.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Selected: Period {selectedPeriods.join(', ')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid} className="gap-2">
          <Save className="w-4 h-4" />
          {existingBlock ? 'Save Exam' : 'Create Exam'}
        </Button>
      </div>
    </div>
  );
};
