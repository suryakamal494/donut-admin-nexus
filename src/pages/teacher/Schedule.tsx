import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar as CalendarIcon,
  CheckCircle2,
  Edit3,
  AlertCircle,
  List,
  Grid3X3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { WeekNavigator } from "@/components/teacher/WeekNavigator";
import { TeacherTimetableGrid } from "@/components/teacher/TeacherTimetableGrid";
import { ScheduleClassCard } from "@/components/teacher/ScheduleClassCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  teacherWeeklySchedule,
  type TeacherTimetableSlot 
} from "@/data/teacherData";

// Generate schedule for any week
const getScheduleForWeek = (weekStart: Date): Record<string, TeacherTimetableSlot[]> => {
  const today = new Date();
  const currentWeekMonday = new Date(today);
  const day = currentWeekMonday.getDay();
  const diff = currentWeekMonday.getDate() - day + (day === 0 ? -6 : 1);
  currentWeekMonday.setDate(diff);
  currentWeekMonday.setHours(0, 0, 0, 0);
  
  if (weekStart.getTime() === currentWeekMonday.getTime()) {
    return teacherWeeklySchedule;
  }
  
  const schedule: Record<string, TeacherTimetableSlot[]> = {};
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const templateEntries = Object.values(teacherWeeklySchedule);
  
  dayNames.forEach((_, dayIndex) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayIndex);
    const dateStr = date.toISOString().split('T')[0];
    
    if (templateEntries[dayIndex]) {
      schedule[dateStr] = templateEntries[dayIndex].map((slot, i) => ({
        ...slot,
        id: `slot-${dateStr}-${i}`,
        hasLessonPlan: Math.random() > 0.4,
        lessonPlanStatus: Math.random() > 0.6 ? 'ready' : (Math.random() > 0.5 ? 'draft' : 'none'),
      }));
    }
  });
  
  return schedule;
};

const TeacherSchedule = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const getMonday = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()));
  
  const weeklySchedule = useMemo(
    () => getScheduleForWeek(currentWeekStart), 
    [currentWeekStart]
  );
  
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      result.push({
        date,
        dateStr: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        shortDayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }
    return result;
  }, [currentWeekStart]);

  // Stats calculation
  const stats = useMemo(() => {
    let totalClasses = 0;
    let ready = 0;
    let draft = 0;
    let pending = 0;
    
    Object.values(weeklySchedule).forEach(slots => {
      slots.forEach(slot => {
        totalClasses++;
        if (slot.lessonPlanStatus === 'ready') ready++;
        else if (slot.lessonPlanStatus === 'draft') draft++;
        else pending++;
      });
    });
    
    return { totalClasses, ready, draft, pending };
  }, [weeklySchedule]);

  const handleCellClick = (slot: TeacherTimetableSlot | undefined, dateStr: string, periodNumber: number) => {
    if (!slot) return;
    
    if (slot.hasLessonPlan && slot.lessonPlanId) {
      navigate(`/teacher/lesson-plans/${slot.lessonPlanId}`);
    } else {
      const params = new URLSearchParams({
        batch: slot.batchId,
        batchName: slot.batchName,
        date: dateStr,
        period: periodNumber.toString(),
        className: slot.className,
      });
      navigate(`/teacher/lesson-plans/create?${params.toString()}`);
    }
  };

  const isSlotLive = (slot: TeacherTimetableSlot, dateStr: string) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (dateStr !== today) return false;
    
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= slot.startTime && currentTime < slot.endTime;
  };

  const isSlotPast = (slot: TeacherTimetableSlot, dateStr: string) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    if (dateStr < today) return true;
    if (dateStr > today) return false;
    
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= slot.endTime;
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <PageHeader
        title="My Schedule"
        description="Weekly timetable with lesson plan status"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Schedule" },
        ]}
      />

      {/* Controls Bar */}
      <div className="flex flex-col gap-3">
        {/* Week Navigation */}
        <WeekNavigator 
          currentWeekStart={currentWeekStart}
          onWeekChange={setCurrentWeekStart}
        />
        
        {/* Stats + View Toggle */}
        <div className="flex items-center justify-between gap-3">
          {/* Stats Badges - Horizontal Scroll on Mobile */}
          <ScrollArea className="flex-1">
            <div className="flex items-center gap-2 pb-1">
              <Badge variant="secondary" className="gap-1.5 whitespace-nowrap px-3 py-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span className="font-semibold">{stats.totalClasses}</span>
                <span className="text-muted-foreground">classes</span>
              </Badge>
              <Badge 
                variant="secondary" 
                className="gap-1.5 whitespace-nowrap px-3 py-1 bg-green-100 text-green-700 border-green-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-semibold">{stats.ready}</span>
                <span>ready</span>
              </Badge>
              {stats.draft > 0 && (
                <Badge 
                  variant="secondary" 
                  className="gap-1.5 whitespace-nowrap px-3 py-1 bg-amber-100 text-amber-700 border-amber-200"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="font-semibold">{stats.draft}</span>
                  <span>draft</span>
                </Badge>
              )}
              {stats.pending > 0 && (
                <Badge 
                  variant="secondary" 
                  className="gap-1.5 whitespace-nowrap px-3 py-1 bg-orange-100 text-orange-700 border-orange-200"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="font-semibold">{stats.pending}</span>
                  <span>pending</span>
                </Badge>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          
          {/* View Toggle */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
            <TabsList className="h-9">
              <TabsTrigger value="grid" className="px-3 gap-1.5">
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Grid</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3 gap-1.5">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <Card className="overflow-hidden border-0 shadow-sm">
          <TeacherTimetableGrid
            days={days}
            weeklySchedule={weeklySchedule}
            onCellClick={handleCellClick}
          />
        </Card>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {days.map((day) => {
            const slots = weeklySchedule[day.dateStr] || [];
            if (slots.length === 0) return null;
            
            return (
              <div key={day.dateStr}>
                {/* Day Header */}
                <div className={cn(
                  "flex items-center gap-3 mb-4 pb-3 border-b",
                  day.isToday && "border-primary/30"
                )}>
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex flex-col items-center justify-center shadow-sm",
                    day.isToday 
                      ? "bg-gradient-to-br from-primary to-primary/80 text-white" 
                      : "bg-muted"
                  )}>
                    <span className="text-[10px] font-medium uppercase leading-none">
                      {day.shortDayName}
                    </span>
                    <span className="text-xl font-bold leading-tight">{day.dayNum}</span>
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-semibold text-lg",
                      day.isToday && "text-primary"
                    )}>
                      {day.dayName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-foreground/60 font-medium">
                      <span>{slots.length} class{slots.length !== 1 ? 'es' : ''}</span>
                      <span>•</span>
                      <span className="text-green-600">
                        {slots.filter(s => s.lessonPlanStatus === 'ready').length} ready
                      </span>
                      {slots.filter(s => s.lessonPlanStatus === 'none').length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-orange-600">
                            {slots.filter(s => s.lessonPlanStatus === 'none').length} pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {day.isToday && (
                    <Badge className="gradient-button text-white border-0">Today</Badge>
                  )}
                </div>
                
                {/* Slots Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {slots.map((slot) => (
                    <ScheduleClassCard
                      key={slot.id}
                      slot={slot}
                      isLive={isSlotLive(slot, day.dateStr)}
                      isPast={isSlotPast(slot, day.dateStr)}
                      onViewPlan={() => {
                        if (slot.lessonPlanId) {
                          navigate(`/teacher/lesson-plans/${slot.lessonPlanId}`);
                        }
                      }}
                      onCreatePlan={() => handleCellClick(slot, day.dateStr, slot.periodNumber)}
                      onStartClass={() => {}}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherSchedule;
