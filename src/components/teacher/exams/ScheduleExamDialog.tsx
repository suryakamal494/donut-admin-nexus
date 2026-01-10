import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import type { TeacherExam } from "@/data/teacher/types";

interface ScheduleExamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: TeacherExam | null;
  onSchedule?: (examId: string, date: Date, time: string) => void;
}

export const ScheduleExamDialog = ({
  open,
  onOpenChange,
  exam,
  onSchedule,
}: ScheduleExamDialogProps) => {
  const isMobile = useIsMobile();
  const [date, setDate] = useState<Date | undefined>(
    exam?.scheduledDate ? new Date(exam.scheduledDate) : undefined
  );
  const [time, setTime] = useState(exam?.scheduledTime || "09:00");

  if (!exam) return null;

  const handleSchedule = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    onSchedule?.(exam.id, date, time);
    toast.success("Exam scheduled successfully");
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4">
      {/* Date Picker */}
      <div className="space-y-2">
        <Label className="text-sm">Select Date</Label>
        {isMobile ? (
          <div className="border rounded-lg overflow-hidden">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-none"
            />
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-11",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Time Picker */}
      <div className="space-y-2">
        <Label className="text-sm">Start Time</Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Summary */}
      {date && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-center">
            <span className="text-muted-foreground">Scheduled for </span>
            <span className="font-semibold text-primary">
              {format(date, "EEEE, MMMM d, yyyy")}
            </span>
            <span className="text-muted-foreground"> at </span>
            <span className="font-semibold text-primary">{time}</span>
          </p>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base">Schedule Exam</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-2">
            {content}
          </div>
          <DrawerFooter className="pt-2">
            <Button onClick={handleSchedule} className="w-full gradient-button" disabled={!date}>
              <Check className="w-4 h-4 mr-2" />
              Schedule Exam
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Exam</DialogTitle>
        </DialogHeader>
        {content}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} className="gradient-button" disabled={!date}>
            <Check className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
