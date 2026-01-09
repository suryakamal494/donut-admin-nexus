import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Play, 
  Plus, 
  ChevronRight,
  MapPin,
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Sparkles,
  TrendingUp,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CurrentClassWidget } from "@/components/teacher/CurrentClassWidget";
import { TeachingConfirmationDialog } from "@/components/teacher/TeachingConfirmationDialog";
import { 
  currentTeacher, 
  teacherTodayTimetable, 
  teacherPendingActions,
  teacherWeeklyStats,
  type TeacherTimetableSlot,
  type PendingAction
} from "@/data/teacherData";
import { toast } from "sonner";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [slotToConfirm, setSlotToConfirm] = useState<TeacherTimetableSlot | null>(null);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get current date string
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Get current/next class with more context
  const classInfo = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // First check for current class
    for (const slot of teacherTodayTimetable) {
      if (currentTime >= slot.startTime && currentTime < slot.endTime) {
        return { slot, status: 'current' as const };
      }
    }
    
    // Then find the next upcoming class
    for (const slot of teacherTodayTimetable) {
      if (currentTime < slot.startTime) {
        return { slot, status: 'next' as const };
      }
    }
    
    return null;
  }, []);

  // Find past classes that need confirmation (classes that ended but not confirmed)
  const pastUnconfirmedSlots = useMemo(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return teacherTodayTimetable.filter(slot => 
      currentTime >= slot.endTime
    ).slice(-2); // Show last 2 past classes max
  }, []);

  const getPriorityColor = (priority: PendingAction['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning-foreground border-warning/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getActionIcon = (type: PendingAction['type']) => {
    switch (type) {
      case 'homework': return FileText;
      case 'quiz': return ClipboardCheck;
      case 'lesson_plan': return BookOpen;
      case 'review': return CheckCircle2;
      default: return AlertCircle;
    }
  };

  const handleConfirmTeaching = (slot: TeacherTimetableSlot) => {
    setSlotToConfirm(slot);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmationSubmit = (data: any) => {
    toast.success(data.didTeach 
      ? "Teaching confirmed! Chapter progress updated." 
      : "Noted. Class marked as not conducted."
    );
    setConfirmationDialogOpen(false);
    setSlotToConfirm(null);
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto pb-20 md:pb-6">
      {/* Greeting Section - Mobile optimized */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            {getGreeting()}, {currentTeacher.name.split(' ')[0]}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Quick Action FAB - Desktop */}
        <Button 
          className="hidden sm:flex gradient-button h-11"
          onClick={() => navigate("/teacher/lesson-plans/create")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Lesson Plan
        </Button>
      </div>

      {/* Current/Next Class - Enhanced Widget with Lesson Plan Preview */}
      {classInfo && (
        <CurrentClassWidget
          slot={classInfo.slot}
          status={classInfo.status}
          dateStr={todayStr}
          onStartClass={() => toast.info("Starting class mode...")}
          onConfirmTeaching={() => handleConfirmTeaching(classInfo.slot)}
        />
      )}

      {/* Past Classes Needing Confirmation - Mobile-friendly cards */}
      {pastUnconfirmedSlots.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-amber-600" />
              <h3 className="font-semibold text-sm text-amber-800">Confirm Past Classes</h3>
            </div>
            <div className="space-y-2">
              {pastUnconfirmedSlots.map((slot) => (
                <div 
                  key={slot.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-background border"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{slot.subject} • {slot.batchName}</p>
                      <p className="text-xs text-muted-foreground">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-shrink-0 h-9 px-3 text-xs font-medium border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => handleConfirmTeaching(slot)}
                  >
                    Confirm
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Today's Classes
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary h-9 px-3"
              onClick={() => navigate("/teacher/schedule")}
            >
              Full Schedule
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid gap-2 sm:gap-3">
            {teacherTodayTimetable.length > 0 ? (
              teacherTodayTimetable.map((slot, index) => (
                <ClassCard 
                  key={slot.id} 
                  slot={slot} 
                  index={index}
                  isSelected={selectedSlot === slot.id}
                  onSelect={() => setSelectedSlot(slot.id === selectedSlot ? null : slot.id)}
                  onConfirm={() => handleConfirmTeaching(slot)}
                />
              ))
            ) : (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center">
                  <Clock className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar - Mobile: Horizontal scroll cards, Desktop: Vertical stack */}
        <div className="space-y-4 sm:space-y-5">
          {/* Quick Stats - 2x2 grid optimized for mobile */}
          <Card className="overflow-hidden card-premium">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:gap-4 px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-center p-2.5 sm:p-3 rounded-xl bg-muted/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{teacherWeeklyStats.totalClasses}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Classes</p>
              </div>
              <div className="text-center p-2.5 sm:p-3 rounded-xl bg-muted/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{teacherWeeklyStats.scheduledTests}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Tests</p>
              </div>
              <div className="text-center p-2.5 sm:p-3 rounded-xl bg-muted/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{teacherWeeklyStats.lessonPlansCreated}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Plans</p>
              </div>
              <div className="text-center p-2.5 sm:p-3 rounded-xl bg-muted/50">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{teacherWeeklyStats.pendingHomework}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="card-premium">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Pending Actions
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {teacherPendingActions.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6 pb-3 sm:pb-6">
              {teacherPendingActions.map((action) => {
                const Icon = getActionIcon(action.type);
                return (
                  <div 
                    key={action.id}
                    className={cn(
                      "p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]",
                      getPriorityColor(action.priority)
                    )}
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-background/50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{action.title}</p>
                        <p className="text-xs opacity-70 truncate">{action.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* AI Assist Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 card-premium">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">AI Teaching Assistant</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create lesson plans, quizzes with AI help
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2.5 sm:mt-3 h-9 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    Try AI Assist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile FAB - Context aware */}
      <div className="fixed bottom-20 right-4 md:hidden z-10">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full gradient-button shadow-lg shadow-primary/30"
          onClick={() => navigate("/teacher/lesson-plans/create")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Teaching Confirmation Dialog */}
      {slotToConfirm && (
        <TeachingConfirmationDialog
          open={confirmationDialogOpen}
          onOpenChange={setConfirmationDialogOpen}
          batchName={slotToConfirm.batchName}
          subjectName={slotToConfirm.subject}
          date={todayStr}
          periodsCount={1}
          chapters={[
            { chapterId: "ch-1", chapterName: "Newton's Laws of Motion", order: 1, plannedHours: 8 },
            { chapterId: "ch-2", chapterName: "Force and Momentum", order: 2, plannedHours: 6 },
            { chapterId: "ch-3", chapterName: "Work and Energy", order: 3, plannedHours: 10 },
          ]}
          suggestedChapter={slotToConfirm.topic ? "ch-1" : undefined}
          onConfirm={handleConfirmationSubmit}
        />
      )}
    </div>
  );
};

// Class Card Component - Mobile optimized
interface ClassCardProps {
  slot: TeacherTimetableSlot;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
}

const ClassCard = ({ slot, index, isSelected, onSelect, onConfirm }: ClassCardProps) => {
  const navigate = useNavigate();
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const isLive = currentTime >= slot.startTime && currentTime < slot.endTime;
  const isPast = currentTime >= slot.endTime;

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-md active:scale-[0.99] card-premium",
        isLive && "border-primary/50 bg-primary/5 ring-1 ring-primary/20",
        isPast && "opacity-60",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Time Column */}
          <div className="text-center min-w-[50px] sm:min-w-[60px]">
            <p className={cn(
              "font-bold text-sm sm:text-base",
              isLive ? "text-primary" : "text-foreground"
            )}>
              {slot.startTime}
            </p>
            <p className="text-[10px] sm:text-xs text-foreground/60">{slot.endTime}</p>
          </div>
          
          {/* Divider */}
          <div className={cn(
            "w-1 h-10 sm:h-12 rounded-full flex-shrink-0",
            isLive ? "bg-gradient-to-b from-primary to-accent" : 
            slot.lessonPlanStatus === 'ready' ? "bg-green-500" :
            slot.lessonPlanStatus === 'draft' ? "bg-amber-500" :
            "bg-muted"
          )} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
              <h4 className="font-bold text-base sm:text-lg text-foreground truncate">
                {slot.subject}
              </h4>
              {isLive && (
                <Badge className="bg-primary text-white text-[9px] sm:text-[10px] px-1.5 animate-pulse">
                  LIVE
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-foreground/70 font-medium flex-wrap">
              <span className="font-semibold">{slot.batchName}</span>
              <span>•</span>
              <span>{slot.className}</span>
              {slot.room && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {slot.room}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Status/Action - Larger touch targets */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {isPast ? (
              <Button 
                size="sm" 
                variant="outline"
                className="h-8 sm:h-9 px-2 sm:px-3 text-xs font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Confirm</span>
              </Button>
            ) : slot.hasLessonPlan ? (
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-700 border-0 h-7 sm:h-8 px-2 sm:px-2.5 cursor-pointer hover:bg-green-200"
                onClick={(e) => {
                  e.stopPropagation();
                  if (slot.lessonPlanId) {
                    navigate(`/teacher/lesson-plans/${slot.lessonPlanId}`);
                  }
                }}
              >
                <BookOpen className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline text-xs">Ready</span>
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className="border-dashed h-7 sm:h-8 px-2 sm:px-2.5 cursor-pointer hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/teacher/lesson-plans/create");
                }}
              >
                <Plus className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline text-xs">Plan</span>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherDashboard;
