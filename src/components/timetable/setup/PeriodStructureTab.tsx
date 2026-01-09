import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoTooltip } from "@/components/timetable";
import { BreakConfig } from "@/data/timetableData";
import { cn } from "@/lib/utils";
import { Clock, Coffee } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimeMapping {
  period: number;
  startTime: string;
  endTime: string;
}

interface PeriodStructureTabProps {
  workingDays: string[];
  periodsPerDay: number;
  breaks: BreakConfig[];
  useTimeMapping: boolean;
  timeMapping: TimeMapping[];
  onToggleDay: (day: string) => void;
  onPeriodsChange: (value: number) => void;
  onBreaksChange: {
    add: () => void;
    update: (id: string, field: keyof BreakConfig, value: any) => void;
    remove: (id: string) => void;
  };
  onTimeMappingToggle: (value: boolean) => void;
  onTimeMappingUpdate: (period: number, field: 'startTime' | 'endTime', value: string) => void;
  onGenerateTimeMappings: () => void;
}

export const PeriodStructureTab = ({
  workingDays,
  periodsPerDay,
  breaks,
  useTimeMapping,
  timeMapping,
  onToggleDay,
  onPeriodsChange,
  onBreaksChange,
  onTimeMappingToggle,
  onTimeMappingUpdate,
  onGenerateTimeMappings,
}: PeriodStructureTabProps) => {
  return (
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
                onClick={() => onToggleDay(day)}
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
            onValueChange={(v) => onPeriodsChange(v[0])}
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

        {/* Breaks Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              Breaks Configuration
              <InfoTooltip content="Configure multiple breaks throughout the day. Common breaks include Short Break, Lunch Break, and Snacks Break." />
            </Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBreaksChange.add}
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
                        onChange={(e) => onBreaksChange.update(breakItem.id, 'name', e.target.value)}
                        className="h-7 text-sm font-medium w-32 bg-white dark:bg-background"
                        placeholder="Break name"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onBreaksChange.remove(breakItem.id)}
                    >
                      ×
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">After Period</Label>
                      <Select 
                        value={breakItem.afterPeriod.toString()} 
                        onValueChange={(v) => onBreaksChange.update(breakItem.id, 'afterPeriod', parseInt(v))}
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
                        onValueChange={(v) => onBreaksChange.update(breakItem.id, 'duration', parseInt(v))}
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
          <Switch checked={useTimeMapping} onCheckedChange={onTimeMappingToggle} />
        </div>

        {/* Time Mapping Grid */}
        {useTimeMapping && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Period Times</Label>
              <Button variant="outline" size="sm" onClick={onGenerateTimeMappings}>
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
                        onChange={(e) => onTimeMappingUpdate(period, 'startTime', e.target.value)}
                        className="text-xs h-8 px-1.5"
                      />
                      <span className="text-muted-foreground shrink-0">-</span>
                      <Input
                        type="time"
                        value={mapping.endTime}
                        onChange={(e) => onTimeMappingUpdate(period, 'endTime', e.target.value)}
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
  );
};
