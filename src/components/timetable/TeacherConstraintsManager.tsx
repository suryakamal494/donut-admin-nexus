import { useState } from "react";
import { TeacherConstraint, TeacherLoad } from "@/data/timetableData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoTooltip } from "./InfoTooltip";
import { cn } from "@/lib/utils";
import { User, Clock, AlertTriangle, Settings2, X, Check, RotateCcw } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TeacherConstraintsManagerProps {
  teachers: TeacherLoad[];
  constraints: TeacherConstraint[];
  onUpdate: (constraints: TeacherConstraint[]) => void;
}

export const TeacherConstraintsManager = ({
  teachers,
  constraints,
  onUpdate,
}: TeacherConstraintsManagerProps) => {
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getConstraintForTeacher = (teacherId: string): TeacherConstraint => {
    const existing = constraints.find(c => c.teacherId === teacherId);
    if (existing) return existing;
    
    // Return default constraint
    return {
      teacherId,
      maxPeriodsPerDay: 6,
      maxConsecutivePeriods: 4,
      unavailableDays: [],
      unavailablePeriods: [],
      preferenceLevel: 'soft',
    };
  };

  const updateConstraint = (teacherId: string, updates: Partial<TeacherConstraint>) => {
    const existingIndex = constraints.findIndex(c => c.teacherId === teacherId);
    const current = getConstraintForTeacher(teacherId);
    const updated = { ...current, ...updates };
    
    if (existingIndex >= 0) {
      const newConstraints = [...constraints];
      newConstraints[existingIndex] = updated;
      onUpdate(newConstraints);
    } else {
      onUpdate([...constraints, updated]);
    }
  };

  const resetConstraint = (teacherId: string) => {
    onUpdate(constraints.filter(c => c.teacherId !== teacherId));
  };

  const hasCustomConstraint = (teacherId: string) => {
    return constraints.some(c => c.teacherId === teacherId);
  };

  const filteredTeachers = teachers.filter(t =>
    t.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search teachers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Badge variant="outline" className="text-muted-foreground">
          {constraints.length} configured
        </Badge>
      </div>

      {/* Teacher List */}
      <div className="space-y-3">
        {filteredTeachers.map(teacher => {
          const constraint = getConstraintForTeacher(teacher.teacherId);
          const isEditing = editingTeacherId === teacher.teacherId;
          const hasConstraint = hasCustomConstraint(teacher.teacherId);

          return (
            <div
              key={teacher.teacherId}
              className={cn(
                "p-4 rounded-xl border transition-all",
                isEditing ? "border-primary bg-primary/5 ring-1 ring-primary/20" : 
                hasConstraint ? "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20" :
                "border-border hover:border-primary/30"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    hasConstraint ? "bg-amber-100 dark:bg-amber-900" : "bg-primary/10"
                  )}>
                    <User className={cn(
                      "w-5 h-5",
                      hasConstraint ? "text-amber-700 dark:text-amber-400" : "text-primary"
                    )} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{teacher.teacherName}</p>
                      {hasConstraint && (
                        <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-400 dark:border-amber-700">
                          <Settings2 className="w-3 h-3 mr-1" />
                          Configured
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {teacher.subjects.map(s => s.toUpperCase()).join(', ')} • {teacher.periodsPerWeek} periods/week
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {hasConstraint && !isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => resetConstraint(teacher.teacherId)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditingTeacherId(isEditing ? null : teacher.teacherId)}
                  >
                    {isEditing ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Done
                      </>
                    ) : (
                      'Edit'
                    )}
                  </Button>
                </div>
              </div>

              {/* Summary (when not editing) */}
              {!isEditing && hasConstraint && (
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <Badge variant="secondary" className="font-normal">
                    Max {constraint.maxPeriodsPerDay}/day
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    Max {constraint.maxConsecutivePeriods} consecutive
                  </Badge>
                  {constraint.unavailableDays.length > 0 && (
                    <Badge variant="secondary" className="font-normal bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-400">
                      Off: {constraint.unavailableDays.join(', ')}
                    </Badge>
                  )}
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "font-normal",
                      constraint.preferenceLevel === 'hard' 
                        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400"
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400"
                    )}
                  >
                    {constraint.preferenceLevel === 'hard' ? 'Hard Constraint' : 'Soft Preference'}
                  </Badge>
                </div>
              )}

              {/* Edit Form */}
              {isEditing && (
                <div className="mt-4 pt-4 border-t border-border space-y-5">
                  {/* Max Periods Per Day */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Maximum Periods Per Day
                      <InfoTooltip content="How many periods can this teacher teach in a single day?" />
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[constraint.maxPeriodsPerDay]}
                        onValueChange={(v) => updateConstraint(teacher.teacherId, { maxPeriodsPerDay: v[0] })}
                        min={1}
                        max={8}
                        step={1}
                        className="flex-1 max-w-xs"
                      />
                      <Badge variant="secondary" className="min-w-[50px] justify-center">
                        {constraint.maxPeriodsPerDay}
                      </Badge>
                    </div>
                  </div>

                  {/* Max Consecutive Periods */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Maximum Consecutive Periods
                      <InfoTooltip content="Maximum number of periods in a row without a break" />
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[constraint.maxConsecutivePeriods]}
                        onValueChange={(v) => updateConstraint(teacher.teacherId, { maxConsecutivePeriods: v[0] })}
                        min={1}
                        max={6}
                        step={1}
                        className="flex-1 max-w-xs"
                      />
                      <Badge variant="secondary" className="min-w-[50px] justify-center">
                        {constraint.maxConsecutivePeriods}
                      </Badge>
                    </div>
                  </div>

                  {/* Unavailable Days */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Unavailable Days
                      <InfoTooltip content="Days when this teacher cannot teach (e.g., part-time teachers)" />
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map(day => {
                        const isUnavailable = constraint.unavailableDays.includes(day);
                        return (
                          <button
                            key={day}
                            onClick={() => {
                              const newDays = isUnavailable
                                ? constraint.unavailableDays.filter(d => d !== day)
                                : [...constraint.unavailableDays, day];
                              updateConstraint(teacher.teacherId, { unavailableDays: newDays });
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                              isUnavailable
                                ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-400 dark:border-red-700"
                                : "bg-muted text-muted-foreground border-transparent hover:border-primary/30"
                            )}
                          >
                            {day.slice(0, 3)}
                            {isUnavailable && <X className="w-3 h-3 ml-1 inline" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Window */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Available Period Range (Optional)
                      <InfoTooltip content="If this teacher is only available during specific periods (e.g., visiting faculty)" />
                    </Label>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={!!constraint.timeWindow}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateConstraint(teacher.teacherId, { 
                              timeWindow: { startPeriod: 1, endPeriod: 8 } 
                            });
                          } else {
                            updateConstraint(teacher.teacherId, { timeWindow: undefined });
                          }
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {constraint.timeWindow ? 'Limited availability' : 'Available all periods'}
                      </span>
                    </div>
                    
                    {constraint.timeWindow && (
                      <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">From Period</Label>
                          <Select 
                            value={constraint.timeWindow.startPeriod.toString()} 
                            onValueChange={(v) => updateConstraint(teacher.teacherId, { 
                              timeWindow: { ...constraint.timeWindow!, startPeriod: parseInt(v) } 
                            })}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                                <SelectItem key={p} value={p.toString()}>P{p}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <span className="text-muted-foreground">to</span>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm">Period</Label>
                          <Select 
                            value={constraint.timeWindow.endPeriod.toString()} 
                            onValueChange={(v) => updateConstraint(teacher.teacherId, { 
                              timeWindow: { ...constraint.timeWindow!, endPeriod: parseInt(v) } 
                            })}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                                <SelectItem key={p} value={p.toString()}>P{p}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Constraint Type */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Constraint Level
                      <InfoTooltip content="Hard constraints will block scheduling. Soft constraints will show warnings but allow override." />
                    </Label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateConstraint(teacher.teacherId, { preferenceLevel: 'soft' })}
                        className={cn(
                          "flex-1 p-3 rounded-lg border text-left transition-all",
                          constraint.preferenceLevel === 'soft'
                            ? "bg-blue-50 border-blue-300 ring-1 ring-blue-200 dark:bg-blue-950 dark:border-blue-700"
                            : "hover:border-primary/30"
                        )}
                      >
                        <p className="font-medium text-sm">Soft Preference</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Shows warnings, allows override</p>
                      </button>
                      <button
                        onClick={() => updateConstraint(teacher.teacherId, { preferenceLevel: 'hard' })}
                        className={cn(
                          "flex-1 p-3 rounded-lg border text-left transition-all",
                          constraint.preferenceLevel === 'hard'
                            ? "bg-red-50 border-red-300 ring-1 ring-red-200 dark:bg-red-950 dark:border-red-700"
                            : "hover:border-primary/30"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <p className="font-medium text-sm">Hard Constraint</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Blocks scheduling, no override</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredTeachers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No teachers found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};