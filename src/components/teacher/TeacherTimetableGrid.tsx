import { useMemo } from "react";
import { Coffee, UtensilsCrossed, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import { TeacherTimetableCell } from "./TeacherTimetableCell";
import { defaultPeriodStructure } from "@/data/timetableData";
import type { TeacherTimetableSlot } from "@/data/teacherData";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DayInfo {
  date: Date;
  dateStr: string;
  dayName: string;
  shortDayName: string;
  dayNum: number;
  month: string;
  isToday: boolean;
}

interface TeacherTimetableGridProps {
  days: DayInfo[];
  weeklySchedule: Record<string, TeacherTimetableSlot[]>;
  onCellClick: (slot: TeacherTimetableSlot | undefined, dateStr: string, periodNumber: number) => void;
}

const getBreakIcon = (name: string) => {
  if (name.toLowerCase().includes('lunch')) return UtensilsCrossed;
  if (name.toLowerCase().includes('snack')) return Cookie;
  return Coffee;
};

export const TeacherTimetableGrid = ({
  days,
  weeklySchedule,
  onCellClick,
}: TeacherTimetableGridProps) => {
  const { periodsPerDay, breaks, timeMapping } = defaultPeriodStructure;

  // Create a map of period -> slot for quick lookup
  const getSlotForPeriod = (dateStr: string, periodNumber: number): TeacherTimetableSlot | undefined => {
    const daySlots = weeklySchedule[dateStr] || [];
    return daySlots.find(s => s.periodNumber === periodNumber);
  };

  // Check if a slot is live
  const isSlotLive = (slot: TeacherTimetableSlot | undefined, dateStr: string) => {
    if (!slot) return false;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (dateStr !== today) return false;
    
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= slot.startTime && currentTime < slot.endTime;
  };

  // Check if a slot is past
  const isSlotPast = (slot: TeacherTimetableSlot | undefined, dateStr: string, periodNumber: number) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (dateStr < today) return true;
    if (dateStr > today) return false;
    
    // Find the end time for this period
    const periodTime = timeMapping.find(t => t.period === periodNumber);
    if (!periodTime) return false;
    
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= periodTime.endTime;
  };

  // Build the grid rows (periods + breaks interspersed)
  const gridRows = useMemo(() => {
    const rows: { type: 'period' | 'break'; period?: number; break?: typeof breaks[0]; time?: typeof timeMapping[0] }[] = [];
    
    for (let p = 1; p <= periodsPerDay; p++) {
      // Add period row
      const periodTime = timeMapping.find(t => t.period === p);
      rows.push({ type: 'period', period: p, time: periodTime });
      
      // Check if there's a break after this period
      const breakAfter = breaks.find(b => b.afterPeriod === p);
      if (breakAfter) {
        rows.push({ type: 'break', break: breakAfter });
      }
    }
    
    return rows;
  }, [periodsPerDay, breaks, timeMapping]);

  return (
    <ScrollArea className="w-full">
      <div className="min-w-[700px]">
        {/* Grid Container */}
        <div className="grid" style={{ gridTemplateColumns: '70px repeat(6, 1fr)' }}>
          
          {/* Header Row */}
          <div className="sticky top-0 z-10 bg-background p-2 border-b" />
          {days.map((day) => (
            <div
              key={day.dateStr}
              className={cn(
                "sticky top-0 z-10 p-2 text-center border-b transition-colors",
                day.isToday 
                  ? "bg-gradient-to-b from-primary/10 to-primary/5" 
                  : "bg-background"
              )}
            >
              <p className={cn(
                "text-[10px] font-semibold uppercase tracking-wide",
                day.isToday ? "text-primary" : "text-muted-foreground"
              )}>
                {day.shortDayName}
              </p>
              <p className={cn(
                "text-lg font-bold",
                day.isToday ? "text-primary" : "text-foreground"
              )}>
                {day.dayNum}
              </p>
              {day.isToday && (
                <span className="inline-block text-[9px] font-bold text-white bg-primary px-1.5 py-0.5 rounded-full mt-0.5">
                  TODAY
                </span>
              )}
            </div>
          ))}

          {/* Grid Rows */}
          {gridRows.map((row, index) => {
            if (row.type === 'break') {
              const BreakIcon = getBreakIcon(row.break!.name);
              return (
                <div
                  key={`break-${row.break!.id}`}
                  className="col-span-7 flex items-center justify-center gap-2 py-2 px-3 bg-amber-50/50 border-y border-amber-200/50"
                >
                  <BreakIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">
                    {row.break!.name}
                  </span>
                  <span className="text-[10px] text-amber-600/70">
                    ({row.break!.duration} min)
                  </span>
                </div>
              );
            }

            // Period row
            const periodNumber = row.period!;
            const periodTime = row.time;

            return (
              <div key={`period-row-${periodNumber}`} className="contents">
                {/* Period Label Cell */}
                <div
                  className={cn(
                    "p-2 flex flex-col items-center justify-center border-b border-r bg-muted/30",
                    index === 0 && "rounded-tl-lg"
                  )}
                >
                  <span className="text-xs font-bold text-foreground">
                    P{periodNumber}
                  </span>
                  {periodTime && (
                    <span className="text-[9px] text-muted-foreground mt-0.5">
                      {periodTime.startTime}
                    </span>
                  )}
                </div>

                {/* Day Cells */}
                {days.map((day) => {
                  const slot = getSlotForPeriod(day.dateStr, periodNumber);
                  const live = isSlotLive(slot, day.dateStr);
                  const past = isSlotPast(slot, day.dateStr, periodNumber);

                  return (
                    <div
                      key={`cell-${day.dateStr}-${periodNumber}`}
                      className={cn(
                        "p-1.5 border-b",
                        day.isToday && "bg-primary/[0.02]"
                      )}
                    >
                      <TeacherTimetableCell
                        slot={slot}
                        isLive={live}
                        isPast={past}
                        isToday={day.isToday}
                        dateStr={day.dateStr}
                        onCellClick={() => onCellClick(slot, day.dateStr, periodNumber)}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
