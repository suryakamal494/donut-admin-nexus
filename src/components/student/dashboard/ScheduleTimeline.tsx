// Schedule Timeline Component
// Interactive vertical timeline - tapping a class opens detail sheet

import { useState } from "react";
import { Calendar, Coffee } from "lucide-react";
import { todaySchedule, subjectColors, type ScheduleItem } from "@/data/student/dashboard";
import { cn } from "@/lib/utils";
import ClassDetailSheet from "./ClassDetailSheet";

const ScheduleTimeline = () => {
  const [selectedClass, setSelectedClass] = useState<ScheduleItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleClassClick = (item: ScheduleItem) => {
    if (item.type === 'break') return;
    setSelectedClass(item);
    setSheetOpen(true);
  };

  const getStatusStyles = (status: ScheduleItem['status'], type?: string) => {
    if (type === 'break') {
      return {
        dot: 'bg-muted-foreground/30',
        card: 'bg-muted/30 border-dashed border-muted-foreground/20',
        text: 'text-muted-foreground'
      };
    }
    
    switch (status) {
      case 'completed':
        return {
          dot: 'bg-muted-foreground/40',
          card: 'bg-white/40 border-transparent opacity-60',
          text: 'text-muted-foreground'
        };
      case 'current':
        return {
          dot: 'bg-gradient-to-br from-donut-coral to-donut-orange ring-4 ring-donut-coral/20',
          card: 'bg-white/90 border-donut-coral/40 shadow-md shadow-donut-coral/10',
          text: 'text-foreground'
        };
      default:
        return {
          dot: '',
          card: 'bg-white/70 border-white/50 hover:bg-white/90 hover:shadow-sm',
          text: 'text-foreground'
        };
    }
  };

  return (
    <>
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-donut-coral" />
            <h3 className="font-semibold text-foreground text-sm">Today's Schedule</h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Schedule Items */}
        <div className="space-y-2">
          {todaySchedule.map((item) => {
            const styles = getStatusStyles(item.status, item.type);
            const colors = item.subject ? subjectColors[item.subject] : null;
            const isClickable = item.type !== 'break';
            
            return (
              <div 
                key={item.id} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all",
                  styles.card,
                  isClickable && "cursor-pointer active:scale-[0.98]"
                )}
                onClick={() => handleClassClick(item)}
              >
                {/* Time */}
                <div className="w-14 flex-shrink-0">
                  <span className={cn("text-xs font-medium", styles.text)}>
                    {item.time}
                  </span>
                </div>

                {/* Dot indicator */}
                <div 
                  className={cn(
                    "w-3 h-3 rounded-full flex-shrink-0",
                    item.status === 'upcoming' && colors ? colors.bg : '',
                    styles.dot
                  )} 
                />

                {/* Content */}
                {item.type === 'break' ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Coffee className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className={cn("font-semibold text-sm capitalize truncate", styles.text)}>
                        {item.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{item.topic}</p>
                    </div>
                    {item.status === 'current' && (
                      <span className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-donut-coral to-donut-orange text-white text-[10px] font-semibold rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Class Detail Sheet */}
      <ClassDetailSheet 
        classItem={selectedClass}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
};

export default ScheduleTimeline;
