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
      <div className="min-w-[700px] md:min-w-[800px]">
        {/* Table Structure */}
        <table className="w-full border-collapse">
          {/* Header Row */}
          <thead>
            <tr>
              {/* Period Column Header */}
              <th className="sticky left-0 z-20 w-[80px] min-w-[80px] md:w-[100px] md:min-w-[100px] bg-white border-b border-r p-1.5 md:p-2 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                <span className="text-[10px] md:text-xs font-bold text-black uppercase tracking-wide">Period</span>
              </th>
              
              {/* Day Headers */}
              {days.map((day) => (
                <th
                  key={day.dateStr}
                  className={cn(
                    "min-w-[90px] md:min-w-[120px] p-1.5 md:p-2 text-center border-b transition-colors",
                    day.isToday 
                      ? "bg-gradient-to-b from-primary/15 to-primary/5" 
                      : "bg-muted/30"
                  )}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className={cn(
                      "text-[9px] md:text-[10px] font-semibold uppercase tracking-wide",
                      day.isToday ? "text-primary" : "text-muted-foreground"
                    )}>
                      {day.shortDayName}
                    </span>
                    <span className={cn(
                      "text-base md:text-lg font-bold leading-none",
                      day.isToday ? "text-primary" : "text-foreground"
                    )}>
                      {day.dayNum}
                    </span>
                    {day.isToday && (
                      <span className="text-[7px] md:text-[8px] font-bold text-white bg-primary px-1 md:px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        Today
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Body Rows */}
          <tbody>
            {gridRows.map((row) => {
              if (row.type === 'break') {
                const BreakIcon = getBreakIcon(row.break!.name);
                return (
                  <tr key={`break-${row.break!.id}`}>
                    <td 
                      colSpan={7} 
                      className="bg-amber-50/60 border-y border-amber-200/40 py-1 md:py-1.5 px-2 md:px-3"
                    >
                      <div className="flex items-center justify-center gap-1.5 md:gap-2">
                        <BreakIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-600" />
                        <span className="text-[10px] md:text-xs font-medium text-amber-700">
                          {row.break!.name}
                        </span>
                        <span className="text-[9px] md:text-[10px] text-amber-600/70">
                          ({row.break!.duration}m)
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              }

              // Period row
              const periodNumber = row.period!;
              const periodTime = row.time;

              return (
                <tr key={`period-row-${periodNumber}`}>
                  {/* Period Label Cell - Sticky */}
                  <td className="sticky left-0 z-10 w-[80px] min-w-[80px] md:w-[100px] md:min-w-[100px] bg-white border-b border-r p-1 md:p-2 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] md:text-xs font-bold text-black">
                        P{periodNumber}
                      </span>
                      {periodTime && (
                        <span className="text-[8px] md:text-[10px] text-black mt-0.5 font-medium">
                          {periodTime.startTime}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Day Cells */}
                  {days.map((day) => {
                    const slot = getSlotForPeriod(day.dateStr, periodNumber);
                    const live = isSlotLive(slot, day.dateStr);
                    const past = isSlotPast(slot, day.dateStr, periodNumber);

                    return (
                      <td
                        key={`cell-${day.dateStr}-${periodNumber}`}
                        className={cn(
                          "border-b p-0.5 md:p-1",
                          day.isToday && "bg-primary/[0.03]"
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
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
