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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format, isSameDay, parseISO, isAfter, isBefore, startOfToday } from "date-fns";
import { CalendarIcon, Plus, Trash2, CalendarDays, AlertCircle } from "lucide-react";

export interface Holiday {
  date: string;
  name: string;
}

interface HolidayCalendarDialogProps {
  open: boolean;
  onClose: () => void;
  holidays: Holiday[];
  onSave: (holidays: Holiday[]) => void;
}

export const HolidayCalendarDialog = ({
  open,
  onClose,
  holidays: initialHolidays,
  onSave,
}: HolidayCalendarDialogProps) => {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [holidayName, setHolidayName] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const today = startOfToday();

  const handleAddHoliday = () => {
    if (!selectedDate || !holidayName.trim()) return;

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    
    // Check if date already exists
    if (holidays.some(h => h.date === dateStr)) {
      return;
    }

    const newHoliday: Holiday = {
      date: dateStr,
      name: holidayName.trim(),
    };

    setHolidays(prev => [...prev, newHoliday].sort((a, b) => a.date.localeCompare(b.date)));
    setSelectedDate(undefined);
    setHolidayName("");
  };

  const handleRemoveHoliday = (date: string) => {
    setHolidays(prev => prev.filter(h => h.date !== date));
  };

  const handleSave = () => {
    onSave(holidays);
    onClose();
  };

  // Get holiday dates for calendar highlighting
  const holidayDates = holidays.map(h => parseISO(h.date));

  const upcomingHolidays = holidays.filter(h => isAfter(parseISO(h.date), today) || isSameDay(parseISO(h.date), today));
  const pastHolidays = holidays.filter(h => isBefore(parseISO(h.date), today));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Holiday Calendar
          </DialogTitle>
          <DialogDescription>
            Mark holidays when the school is closed. These days will be blocked in the timetable.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden py-4 space-y-6">
          {/* Add Holiday Form */}
          <div className="p-4 rounded-xl border bg-muted/30 space-y-4">
            <Label className="text-sm font-medium">Add New Holiday</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[180px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setDatePickerOpen(false);
                    }}
                    disabled={(date) => holidayDates.some(h => isSameDay(h, date))}
                    modifiers={{
                      holiday: holidayDates,
                    }}
                    modifiersClassNames={{
                      holiday: "bg-destructive/20 text-destructive font-medium",
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Input
                placeholder="Holiday name (e.g., Diwali)"
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddHoliday()}
              />
              
              <Button 
                onClick={handleAddHoliday}
                disabled={!selectedDate || !holidayName.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Holiday List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Configured Holidays</Label>
              <Badge variant="secondary">{holidays.length} total</Badge>
            </div>
            
            {holidays.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed">
                <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No holidays configured</p>
                <p className="text-xs text-muted-foreground mt-1">Add holidays using the form above</p>
              </div>
            ) : (
              <ScrollArea className="h-[280px]">
                <div className="space-y-4 pr-4">
                  {/* Upcoming Holidays */}
                  {upcomingHolidays.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Upcoming</p>
                      <div className="space-y-2">
                        {upcomingHolidays.map(holiday => (
                          <div
                            key={holiday.date}
                            className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CalendarIcon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{holiday.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(parseISO(holiday.date), "EEEE, MMMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveHoliday(holiday.date)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past Holidays */}
                  {pastHolidays.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Past</p>
                      <div className="space-y-2">
                        {pastHolidays.map(holiday => (
                          <div
                            key={holiday.date}
                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 opacity-60"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{holiday.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(parseISO(holiday.date), "EEEE, MMMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveHoliday(holiday.date)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Holidays
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
