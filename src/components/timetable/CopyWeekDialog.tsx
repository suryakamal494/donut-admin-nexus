import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimetableEntry } from "@/data/timetableData";
import { Holiday } from "./HolidayCalendarDialog";
import { format, addWeeks, startOfWeek, isSameWeek, addDays, isAfter } from "date-fns";
import { Copy, CalendarDays, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyWeekDialogProps {
  open: boolean;
  onClose: () => void;
  sourceWeekStart: Date;
  entries: TimetableEntry[];
  holidays: Holiday[];
  onCopy: (targetWeeks: Date[], options: CopyOptions) => void;
}

export interface CopyOptions {
  skipHolidays: boolean;
  skipExamPeriods: boolean;
  overwriteExisting: boolean;
}

export const CopyWeekDialog = ({
  open,
  onClose,
  sourceWeekStart,
  entries,
  holidays,
  onCopy,
}: CopyWeekDialogProps) => {
  const [selectedWeeks, setSelectedWeeks] = useState<Date[]>([]);
  const [options, setOptions] = useState<CopyOptions>({
    skipHolidays: true,
    skipExamPeriods: true,
    overwriteExisting: false,
  });

  // Generate next 8 weeks as options
  const futureWeeks = Array.from({ length: 8 }, (_, i) => 
    startOfWeek(addWeeks(sourceWeekStart, i + 1), { weekStartsOn: 1 })
  );

  // Count entries in source week
  const sourceEntryCount = entries.length;

  // Check if a week has holidays
  const getWeekHolidays = (weekStart: Date) => {
    return holidays.filter(h => {
      const holidayDate = new Date(h.date);
      return isSameWeek(holidayDate, weekStart, { weekStartsOn: 1 });
    });
  };

  const toggleWeek = (weekStart: Date) => {
    setSelectedWeeks(prev => {
      const exists = prev.some(w => isSameWeek(w, weekStart, { weekStartsOn: 1 }));
      if (exists) {
        return prev.filter(w => !isSameWeek(w, weekStart, { weekStartsOn: 1 }));
      }
      return [...prev, weekStart];
    });
  };

  const handleCopy = () => {
    onCopy(selectedWeeks, options);
    setSelectedWeeks([]);
    onClose();
  };

  const weekEndDate = addDays(sourceWeekStart, 5);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5" />
            Copy Week
          </DialogTitle>
          <DialogDescription>
            Copy timetable from <strong>{format(sourceWeekStart, 'MMM d')} – {format(weekEndDate, 'MMM d, yyyy')}</strong> to selected weeks
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Source Week Info */}
          <div className="p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Source Week</span>
              </div>
              <Badge variant="secondary">{sourceEntryCount} entries</Badge>
            </div>
          </div>

          {/* Target Weeks Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Target Weeks</Label>
            <ScrollArea className="h-[200px] rounded-lg border">
              <div className="p-2 space-y-1">
                {futureWeeks.map((weekStart, index) => {
                  const weekEnd = addDays(weekStart, 5);
                  const weekHolidays = getWeekHolidays(weekStart);
                  const isSelected = selectedWeeks.some(w => isSameWeek(w, weekStart, { weekStartsOn: 1 }));
                  
                  return (
                    <button
                      key={index}
                      onClick={() => toggleWeek(weekStart)}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-left",
                        isSelected
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted/50 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox checked={isSelected} />
                        <div>
                          <p className="text-sm font-medium">
                            {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Week {index + 1}
                          </p>
                        </div>
                      </div>
                      {weekHolidays.length > 0 && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">
                          {weekHolidays.length} holiday{weekHolidays.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Options</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="skip-holidays"
                  checked={options.skipHolidays}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, skipHolidays: !!checked }))}
                />
                <Label htmlFor="skip-holidays" className="text-sm cursor-pointer">
                  Skip holidays (don't copy entries to holiday dates)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="skip-exams"
                  checked={options.skipExamPeriods}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, skipExamPeriods: !!checked }))}
                />
                <Label htmlFor="skip-exams" className="text-sm cursor-pointer">
                  Skip exam periods
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="overwrite"
                  checked={options.overwriteExisting}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, overwriteExisting: !!checked }))}
                />
                <Label htmlFor="overwrite" className="text-sm cursor-pointer text-amber-600">
                  Overwrite existing entries
                </Label>
              </div>
            </div>
          </div>

          {/* Preview */}
          {selectedWeeks.length > 0 && (
            <div className="p-3 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {sourceEntryCount * selectedWeeks.length} entries will be copied to {selectedWeeks.length} week{selectedWeeks.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCopy} disabled={selectedWeeks.length === 0}>
            <Copy className="w-4 h-4 mr-2" />
            Copy to {selectedWeeks.length} Week{selectedWeeks.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};