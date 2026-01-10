import { ArrowLeft, Check, Calendar, Clock, Users, SkipForward, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BatchScheduleStepProps {
  batchesByClass: Record<string, Array<{ id: string; name: string; className: string }>>;
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

export const BatchScheduleStep = ({
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
}: BatchScheduleStepProps) => {
  const hasBatchesSelected = selectedBatches.length > 0;

  const hasBatches = Object.keys(batchesByClass).length > 0;
  
  return (
    <div className="flex flex-col min-h-[60vh]">
      <div className="flex-1 space-y-6">
        {/* Batch Selection */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            Assign to Batches
          </Label>
          
          {hasBatches ? (
            Object.entries(batchesByClass).map(([className, batches]) => (
              <div key={className} className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {className}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {batches.map((batch) => {
                    const isSelected = selectedBatches.includes(batch.id);
                    return (
                      <button
                        key={batch.id}
                        type="button"
                        onClick={() => toggleBatch(batch.id)}
                        className={cn(
                          "relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all min-h-[48px]",
                          "active:scale-[0.98]",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-card"
                        )}
                      >
                        <Checkbox checked={isSelected} />
                        <span className={cn(
                          "font-medium",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>
                          {batch.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-xl">
              <Users className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="font-medium text-foreground">No batches assigned</p>
              <p className="text-sm text-muted-foreground mt-1">
                You'll be able to assign batches later
              </p>
            </div>
          )}
        </div>

        {/* Schedule (only show if batches selected) */}
      {hasBatchesSelected && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Schedule (Optional)
          </Label>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 justify-start text-left font-normal",
                    !scheduleDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {scheduleDate ? format(scheduleDate, "MMM d") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={scheduleDate}
                  onSelect={setScheduleDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {/* Time Input */}
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="h-12 pl-10"
                placeholder="Time"
              />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Leave empty to keep as draft and schedule later
          </p>
        </div>
      )}
      </div>

      {/* Actions - sticky footer */}
      <div className="flex flex-col gap-3 pt-4 mt-auto sticky bottom-0 bg-background pb-safe">
        {!hasBatchesSelected && (
          <Button
            variant="outline"
            onClick={() => onCreate(true)}
            disabled={isProcessing}
            className="h-12 gap-2"
          >
            <SkipForward className="w-4 h-4" />
            {hasBatches ? "Skip & Create as Draft" : "Create as Draft"}
          </Button>
        )}
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isProcessing}
            className="flex-1 h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {hasBatchesSelected && (
            <Button
              onClick={() => onCreate(false)}
              disabled={isProcessing}
              className="flex-1 h-12 gradient-button"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Create Exam
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
