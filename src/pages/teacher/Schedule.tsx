import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Plus,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/page-header";
import { WeekNavigator } from "@/components/teacher/WeekNavigator";
import { ScheduleClassCard } from "@/components/teacher/ScheduleClassCard";
import { 
  currentTeacher, 
  type TeacherTimetableSlot 
} from "@/data/teacherData";

// Generate mock weekly schedule data
const generateWeeklySchedule = (weekStart: Date): Record<string, TeacherTimetableSlot[]> => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const schedule: Record<string, TeacherTimetableSlot[]> = {};
  
  const baseSlots = [
    { period: 1, start: "08:00", end: "08:45", batch: "10A", room: "Lab 1", hasPlan: true },
    { period: 3, start: "09:45", end: "10:30", batch: "10B", room: "Room 204", hasPlan: false },
    { period: 5, start: "11:30", end: "12:15", batch: "11A", room: "Lab 1", hasPlan: true },
  ];
  
  days.forEach((day, dayIndex) => {
    const currentDate = new Date(weekStart);
    currentDate.setDate(currentDate.getDate() + dayIndex);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Skip Sunday, vary schedule by day
    if (dayIndex < 6) {
      const daySlots = baseSlots
        .filter((_, i) => (dayIndex + i) % 3 !== 2) // Vary which slots appear
        .map((slot, i) => ({
          id: `slot-${dateStr}-${slot.period}`,
          day,
          periodNumber: slot.period,
          startTime: slot.start,
          endTime: slot.end,
          subject: "Physics",
          subjectId: "phy",
          batchId: `batch-${slot.batch.toLowerCase()}`,
          batchName: slot.batch,
          className: slot.batch.startsWith("10") ? "Class 10" : "Class 11",
          room: slot.room,
          hasLessonPlan: slot.hasPlan && dayIndex % 2 === 0,
          lessonPlanId: slot.hasPlan ? `lp-${dateStr}-${i}` : undefined,
        }));
      schedule[dateStr] = daySlots;
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
  
  const weeklySchedule = useMemo(() => generateWeeklySchedule(currentWeekStart), [currentWeekStart]);
  
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      result.push({
        date,
        dateStr: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
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

  // Stats
  const stats = useMemo(() => {
    let totalClasses = 0;
    let withPlans = 0;
    Object.values(weeklySchedule).forEach(slots => {
      totalClasses += slots.length;
      withPlans += slots.filter(s => s.hasLessonPlan).length;
    });
    return { totalClasses, withPlans, coverage: totalClasses > 0 ? Math.round((withPlans / totalClasses) * 100) : 0 };
  }, [weeklySchedule]);

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
        
        <div className="flex items-center gap-3">
          {/* Stats Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <CalendarIcon className="w-3 h-3" />
              {stats.totalClasses} classes
            </Badge>
            <Badge variant="secondary" className={cn(
              "gap-1",
              stats.coverage >= 80 ? "bg-green-100 text-green-700" : 
              stats.coverage >= 50 ? "bg-amber-100 text-amber-700" : 
              "bg-red-100 text-red-700"
            )}>
              <BookOpen className="w-3 h-3" />
              {stats.coverage}% plans ready
            </Badge>
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
          {days.map((day) => (
            <Card 
              key={day.dateStr} 
              className={cn(
                "overflow-hidden",
                day.isToday && "border-primary/50 ring-1 ring-primary/20"
              )}
            >
              <CardHeader className={cn(
                "p-3 pb-2",
                day.isToday && "bg-primary/5"
              )}>
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-medium",
                    day.isToday ? "text-primary" : "text-muted-foreground"
                  )}>
                    {day.dayName}
                  </p>
                  <p className={cn(
                    "text-lg font-bold",
                    day.isToday ? "text-primary" : "text-foreground"
                  )}>
                    {day.dayNum}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-2 space-y-2">
                {weeklySchedule[day.dateStr]?.length > 0 ? (
                  weeklySchedule[day.dateStr].map((slot) => (
                    <ScheduleClassCard
                      key={slot.id}
                      slot={slot}
                      isLive={isSlotLive(slot, day.dateStr)}
                      isPast={isSlotPast(slot, day.dateStr)}
                      compact
                      onViewPlan={() => navigate(`/teacher/lesson-plans/${slot.lessonPlanId}`)}
                      onCreatePlan={() => navigate("/teacher/lesson-plans/create")}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-xs">No classes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {days.map((day) => {
            const slots = weeklySchedule[day.dateStr] || [];
            if (slots.length === 0) return null;
            
            return (
              <div key={day.dateStr}>
                <div className={cn(
                  "flex items-center gap-2 mb-3 pb-2 border-b",
                  day.isToday && "border-primary/30"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex flex-col items-center justify-center",
                    day.isToday ? "bg-primary text-white" : "bg-muted"
                  )}>
                    <span className="text-[10px] font-medium leading-none">{day.dayName}</span>
                    <span className="text-sm font-bold leading-none">{day.dayNum}</span>
                  </div>
                  <div>
                    <p className={cn(
                      "font-semibold",
                      day.isToday && "text-primary"
                    )}>
                      {day.date.toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {slots.length} class{slots.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                  {day.isToday && (
                    <Badge className="bg-primary text-white ml-auto">Today</Badge>
                  )}
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {slots.map((slot) => (
                    <ScheduleClassCard
                      key={slot.id}
                      slot={slot}
                      isLive={isSlotLive(slot, day.dateStr)}
                      isPast={isSlotPast(slot, day.dateStr)}
                      onViewPlan={() => navigate(`/teacher/lesson-plans/${slot.lessonPlanId}`)}
                      onCreatePlan={() => navigate("/teacher/lesson-plans/create")}
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
      <div className="fixed bottom-20 right-4 md:hidden">
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
