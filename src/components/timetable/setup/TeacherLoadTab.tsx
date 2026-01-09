import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { InfoTooltip } from "@/components/timetable";
import { TeacherLoad } from "@/data/timetableData";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TeacherLoadTabProps {
  teachers: TeacherLoad[];
  editingTeacherId: string | null;
  onEditingChange: (teacherId: string | null) => void;
  onTeacherUpdate: (teacherId: string, field: keyof TeacherLoad, value: any) => void;
}

export const TeacherLoadTab = ({
  teachers,
  editingTeacherId,
  onEditingChange,
  onTeacherUpdate,
}: TeacherLoadTabProps) => {
  return (
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
          {teachers.map(teacher => {
            const isEditing = editingTeacherId === teacher.teacherId;
            
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
                    onClick={() => onEditingChange(isEditing ? null : teacher.teacherId)}
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
                            onValueChange={(v) => onTeacherUpdate(teacher.teacherId, 'periodsPerWeek', v[0])}
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
                                onTeacherUpdate(teacher.teacherId, 'workingDays', newDays);
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
                          onCheckedChange={(checked) => onTeacherUpdate(teacher.teacherId, 'avoidFirstPeriod', checked)}
                        />
                        <Label htmlFor={`avoid-first-${teacher.teacherId}`} className="text-sm cursor-pointer">
                          Avoid first period
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`avoid-last-${teacher.teacherId}`}
                          checked={teacher.avoidLastPeriod}
                          onCheckedChange={(checked) => onTeacherUpdate(teacher.teacherId, 'avoidLastPeriod', checked)}
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
  );
};
