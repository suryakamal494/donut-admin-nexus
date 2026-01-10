// Schedule Timeline Component
// Elegant vertical timeline showing today's classes with current time indicator

import { Calendar, Clock, MapPin, User, Coffee } from "lucide-react";
import { todaySchedule, subjectColors, type ScheduleItem } from "@/data/student/dashboard";
import { cn } from "@/lib/utils";

const ScheduleTimeline = () => {
  const getStatusStyles = (status: ScheduleItem['status'], type?: string) => {
    if (type === 'break') {
      return {
        dot: 'bg-muted-foreground/30',
        line: 'bg-muted-foreground/20',
        card: 'bg-muted/30 border-dashed',
        text: 'text-muted-foreground'
      };
    }
    
    switch (status) {
      case 'completed':
        return {
          dot: 'bg-muted-foreground/40',
          line: 'bg-muted-foreground/20',
          card: 'bg-white/40 opacity-60',
          text: 'text-muted-foreground'
        };
      case 'current':
        return {
          dot: 'bg-gradient-to-br from-donut-coral to-donut-orange ring-4 ring-donut-coral/20 animate-pulse',
          line: 'bg-gradient-to-b from-donut-coral to-transparent',
          card: 'bg-white/80 border-donut-coral/30 shadow-md shadow-donut-coral/10',
          text: 'text-foreground'
        };
      default:
        return {
          dot: 'bg-gradient-to-br',
          line: 'bg-muted-foreground/20',
          card: 'bg-white/60',
          text: 'text-foreground'
        };
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-donut-coral" />
          <h3 className="font-semibold text-foreground text-sm">Today's Schedule</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-muted-foreground/10" />

        {/* Schedule Items */}
        <div className="space-y-1">
          {todaySchedule.map((item, index) => {
            const styles = getStatusStyles(item.status, item.type);
            const colors = item.subject ? subjectColors[item.subject] : null;
            
            return (
              <div key={item.id} className="relative flex gap-3">
                {/* Time & Dot */}
                <div className="flex flex-col items-center z-10">
                  <span className={cn("text-[10px] font-medium w-[52px] text-right pr-2", styles.text)}>
                    {item.time}
                  </span>
                </div>

                {/* Dot */}
                <div className="flex flex-col items-center pt-0.5">
                  <div 
                    className={cn(
                      "w-3 h-3 rounded-full flex-shrink-0 z-10",
                      item.status === 'upcoming' && colors ? colors.bg : '',
                      styles.dot
                    )} 
                  />
                  {index < todaySchedule.length - 1 && (
                    <div className={cn("w-0.5 flex-1 min-h-[40px]", styles.line)} />
                  )}
                </div>

                {/* Content Card */}
                <div className={cn("flex-1 mb-2 p-2.5 rounded-xl border transition-all", styles.card)}>
                  {item.type === 'break' ? (
                    <div className="flex items-center gap-2 py-1">
                      <Coffee className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={cn("font-semibold text-sm truncate capitalize", styles.text)}>
                            {item.subject}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{item.topic}</p>
                        </div>
                        {item.status === 'current' && (
                          <span className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-donut-coral to-donut-orange text-white text-[10px] font-medium rounded-full">
                            NOW
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Room {item.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.teacher}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleTimeline;
