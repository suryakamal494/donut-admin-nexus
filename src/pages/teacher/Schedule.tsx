import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar as CalendarIcon,
  BookOpen,
  Plus,
  List,
  Grid3X3,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { WeekNavigator } from "@/components/teacher/WeekNavigator";
import { ScheduleClassCard } from "@/components/teacher/ScheduleClassCard";
import { 
  teacherWeeklySchedule,
  type TeacherTimetableSlot 
} from "@/data/teacherData";

// Generate schedule for any week (returns mock data for non-current weeks)
const getScheduleForWeek = (weekStart: Date): Record<string, TeacherTimetableSlot[]> => {
  const today = new Date();
  const currentWeekMonday = new Date(today);
  const day = currentWeekMonday.getDay();
  const diff = currentWeekMonday.getDate() - day + (day === 0 ? -6 : 1);
  currentWeekMonday.setDate(diff);
  currentWeekMonday.setHours(0, 0, 0, 0);
  
  // If it's the current week, use actual data
  if (weekStart.getTime() === currentWeekMonday.getTime()) {
    return teacherWeeklySchedule;
  }
  
  // For other weeks, generate similar schedule with new dates
  const schedule: Record<string, TeacherTimetableSlot[]> = {};
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Get entries from current week as template
  const templateEntries = Object.values(teacherWeeklySchedule);
  
  dayNames.forEach((_, dayIndex) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayIndex);
    const dateStr = date.toISOString().split('T')[0];
    
    if (templateEntries[dayIndex]) {
      schedule[dateStr] = templateEntries[dayIndex].map((slot, i) => ({
        ...slot,
        id: `slot-${dateStr}-${i}`,
        // Randomly mark some as having plans for variety
        hasLessonPlan: Math.random() > 0.4,
        lessonPlanStatus: Math.random() > 0.6 ? 'ready' : (Math.random() > 0.5 ? 'draft' : 'none'),
      }));
    }
  });
  
  return schedule;
};

const TeacherSchedule = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"week" | "list">("week");
  
  // Get Monday of current week
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
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isToday: date.toDateString() === new Date().toDateString(),
      });
    }
    return result;
  }, [currentWeekStart]);

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
    
    const coverage = totalClasses > 0 ? Math.round((ready / totalClasses) * 100) : 0;
    
    return { totalClasses, ready, draft, pending, coverage };
  }, [weeklySchedule]);

  const handleCreatePlan = (slot: TeacherTimetableSlot, dateStr: string) => {
    const params = new URLSearchParams({
      batch: slot.batchId,
      batchName: slot.batchName,
      date: dateStr,
      period: slot.periodNumber.toString(),
      className: slot.className,
    });
    navigate(`/teacher/lesson-plans/create?${params.toString()}`);
  };

  const handleViewPlan = (slot: TeacherTimetableSlot) => {
    if (slot.lessonPlanId) {
      navigate(`/teacher/lesson-plans/${slot.lessonPlanId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="My Schedule"
        description="Weekly calendar and class schedule"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Schedule" },
        ]}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <WeekNavigator 
          currentWeekStart={currentWeekStart}
          onWeekChange={setCurrentWeekStart}
        />
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Stats Badges */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial overflow-x-auto pb-1 sm:pb-0">
            <Badge variant="secondary" className="gap-1 whitespace-nowrap">
              <CalendarIcon className="w-3 h-3" />
              {stats.totalClasses} classes
            </Badge>
            <Badge 
              variant="secondary" 
              className={cn(
                "gap-1 whitespace-nowrap",
                stats.coverage >= 70 ? "bg-green-100 text-green-700" : 
                stats.coverage >= 40 ? "bg-amber-100 text-amber-700" : 
                "bg-red-100 text-red-700"
              )}
            >
              <CheckCircle2 className="w-3 h-3" />
              {stats.ready} ready
            </Badge>
            {stats.pending > 0 && (
              <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-700 whitespace-nowrap">
                <AlertCircle className="w-3 h-3" />
                {stats.pending} pending
              </Badge>
            )}
          </div>
          
          {/* View Toggle */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "week" | "list")}>
            <TabsList className="h-9">
              <TabsTrigger value="week" className="px-3">
                <Grid3X3 className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-3">
                <List className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Weekly Grid View */}
      {viewMode === "week" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {days.map((day) => {
            const slots = weeklySchedule[day.dateStr] || [];
            const hasLiveClass = slots.some(s => isSlotLive(s, day.dateStr));
            
            return (
              <Card 
                key={day.dateStr} 
                className={cn(
                  "overflow-hidden flex flex-col",
                  day.isToday && "border-primary ring-2 ring-primary/20",
                  hasLiveClass && "border-primary/70"
                )}
              >
                {/* Day Header */}
                <CardHeader className={cn(
                  "p-3 pb-2 border-b",
                  day.isToday ? "bg-primary text-primary-foreground" : "bg-muted/50"
                )}>
                  <div className="text-center">
                    <p className={cn(
                      "text-[10px] font-medium uppercase tracking-wide",
                      day.isToday ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {day.dayName}
                    </p>
                    <p className={cn(
                      "text-xl font-bold",
                      day.isToday ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {day.dayNum}
                    </p>
                    <p className={cn(
                      "text-[10px]",
                      day.isToday ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {day.month}
                    </p>
                  </div>
                </CardHeader>
                
                {/* Slots */}
                <CardContent className="p-2 flex-1">
                  <ScrollArea className="h-[280px] sm:h-[320px] pr-1">
                    <div className="space-y-2">
                      {slots.length > 0 ? (
                        slots.map((slot) => (
                          <ScheduleClassCard
                            key={slot.id}
                            slot={slot}
                            isLive={isSlotLive(slot, day.dateStr)}
                            isPast={isSlotPast(slot, day.dateStr)}
                            compact
                            onViewPlan={() => handleViewPlan(slot)}
                            onCreatePlan={() => handleCreatePlan(slot, day.dateStr)}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-foreground/40">
                          <Clock className="w-6 h-6 mx-auto mb-2 opacity-30" />
                          <p className="text-xs">No classes</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  
                  {/* Quick Add Button */}
                  {slots.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 h-10 text-xs text-muted-foreground hover:text-primary gap-1"
                      onClick={() => navigate(`/teacher/lesson-plans/create?date=${day.dateStr}`)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
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
                      {day.dayName}
                    </span>
                    <span className="text-xl font-bold leading-tight">{day.dayNum}</span>
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "font-semibold text-lg",
                      day.isToday && "text-primary"
                    )}>
                      {day.fullDayName}
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
                      onViewPlan={() => handleViewPlan(slot)}
                      onCreatePlan={() => handleCreatePlan(slot, day.dateStr)}
                      onStartClass={() => {}}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 md:hidden z-10">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full gradient-button shadow-lg shadow-primary/30"
          onClick={() => navigate("/teacher/lesson-plans/create")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default TeacherSchedule;
