import { ArrowLeft, Sparkles, SkipForward, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { batches } from "@/data/instituteData";

interface BatchAssignmentStepProps {
  batchesByClass: Record<string, typeof batches>;
  selectedBatches: string[];
  toggleBatch: (batchId: string) => void;
  scheduleDate: Date | undefined;
  setScheduleDate: (date: Date | undefined) => void;
  scheduleTime: string;
  setScheduleTime: (time: string) => void;
  isProcessing: boolean;
  onBack: () => void;
  onCreate: (skipBatch: boolean) => void;
}

export const BatchAssignmentStep = ({
  batchesByClass,
  selectedBatches,
  toggleBatch,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  isProcessing,
  onBack,
  onCreate,
}: BatchAssignmentStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-1">Assign to Batches</h3>
        <p className="text-muted-foreground text-sm">Select batches or skip to assign later</p>
      </div>
      
      <div className="space-y-4">
        {Object.entries(batchesByClass).map(([className, classBatches]) => (
          <div key={className} className="space-y-2">
            <Label className="text-muted-foreground">{className}</Label>
            <div className="grid grid-cols-2 gap-2">
              {classBatches.map((batch) => (
                <label
                  key={batch.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    selectedBatches.includes(batch.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Checkbox 
                    checked={selectedBatches.includes(batch.id)}
                    onCheckedChange={() => toggleBatch(batch.id)}
                  />
                  <div>
                    <p className="text-sm font-medium">{batch.name}</p>
                    <p className="text-xs text-muted-foreground">{batch.studentCount} students</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedBatches.length > 0 && (
        <div className="space-y-4 p-4 rounded-xl bg-muted/30">
          <Label>Schedule (Optional)</Label>
          <div className="grid grid-cols-2 gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !scheduleDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={scheduleDate}
                  onSelect={setScheduleDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Input 
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              placeholder="Select time"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Leave empty to save as draft and schedule later
          </p>
        </div>
      )}
      
      <div className="flex flex-col gap-3 pt-4">
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            className="gradient-button gap-2"
            disabled={isProcessing}
            onClick={() => onCreate(false)}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Exam
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
        
        {selectedBatches.length === 0 && (
          <Button 
            variant="ghost" 
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => onCreate(true)}
            disabled={isProcessing}
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip - Assign Batches Later
          </Button>
        )}
      </div>
    </div>
  );
};
