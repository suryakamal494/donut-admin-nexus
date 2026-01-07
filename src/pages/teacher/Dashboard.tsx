import { useState } from "react";
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
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  currentTeacher, 
  teacherTodayTimetable, 
  teacherPendingActions,
  teacherWeeklyStats,
  type TeacherTimetableSlot,
  type PendingAction
} from "@/data/teacherData";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get current/next class
  const getCurrentClass = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    for (const slot of teacherTodayTimetable) {
      if (currentTime >= slot.startTime && currentTime < slot.endTime) {
        return { slot, status: 'current' as const };
      }
      if (currentTime < slot.startTime) {
        return { slot, status: 'next' as const };
      }
    }
    return null;
  };

  const classInfo = getCurrentClass();

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {getGreeting()}, {currentTeacher.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Quick Action FAB - Desktop */}
        <Button className="hidden sm:flex gradient-button">
          <Plus className="w-4 h-4 mr-2" />
          Create Lesson Plan
        </Button>
      </div>

      {/* Current/Next Class Highlight */}
      {classInfo && (
        <Card className={cn(
          "overflow-hidden border-2 transition-all duration-300 card-premium",
          classInfo.status === 'current' 
            ? "border-primary/50 bg-gradient-to-r from-primary/5 to-accent/5" 
            : "border-border"
        )}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                  classInfo.status === 'current'
                    ? "gradient-button"
                    : "bg-muted"
                )}>
                  {classInfo.status === 'current' ? (
                    <Play className="w-6 h-6 text-white" />
                  ) : (
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        classInfo.status === 'current' 
                          ? "bg-primary text-white" 
                          : "bg-muted"
                      )}
                    >
                      {classInfo.status === 'current' ? 'NOW' : 'NEXT'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {classInfo.slot.startTime} - {classInfo.slot.endTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground truncate">
                    {classInfo.slot.subject} • {classInfo.slot.batchName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{classInfo.slot.className}</span>
                    {classInfo.slot.room && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {classInfo.slot.room}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 sm:flex-col sm:items-end">
                {classInfo.slot.hasLessonPlan ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 sm:flex-none border-primary/30 text-primary hover:bg-primary/5"
                  >
                    View Plan
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    className="flex-1 sm:flex-none gradient-button"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Plan
                  </Button>
                )}
                {classInfo.status === 'current' && classInfo.slot.hasLessonPlan && (
                  <Button 
                    size="sm"
                    className="flex-1 sm:flex-none gradient-button"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start Class
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Classes
            </h2>
            <Button variant="ghost" size="sm" className="text-primary">
              Full Schedule
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid gap-3">
            {teacherTodayTimetable.map((slot, index) => (
              <ClassCard 
                key={slot.id} 
                slot={slot} 
                index={index}
                isSelected={selectedSlot === slot.id}
                onSelect={() => setSelectedSlot(slot.id === selectedSlot ? null : slot.id)}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="overflow-hidden card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{teacherWeeklyStats.totalClasses}</p>
                <p className="text-xs text-muted-foreground">Classes</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{teacherWeeklyStats.scheduledTests}</p>
                <p className="text-xs text-muted-foreground">Tests</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{teacherWeeklyStats.lessonPlansCreated}</p>
                <p className="text-xs text-muted-foreground">Plans</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-foreground">{teacherWeeklyStats.pendingHomework}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="card-premium">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teacherPendingActions.map((action) => {
                const Icon = getActionIcon(action.type);
                return (
                  <div 
                    key={action.id}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md",
                      getPriorityColor(action.priority)
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
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
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">AI Teaching Assistant</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create lesson plans, quizzes, and content with AI help
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-3 border-primary/30 text-primary hover:bg-primary/5"
                  >
                    Try AI Assist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 md:hidden">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full gradient-button shadow-lg shadow-primary/30"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

// Class Card Component
interface ClassCardProps {
  slot: TeacherTimetableSlot;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

const ClassCard = ({ slot, index, isSelected, onSelect }: ClassCardProps) => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const isLive = currentTime >= slot.startTime && currentTime < slot.endTime;
  const isPast = currentTime >= slot.endTime;

  return (
    <Card 
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-md card-premium",
        isLive && "border-primary/50 bg-primary/5",
        isPast && "opacity-60",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Time Column */}
          <div className="text-center min-w-[60px]">
            <p className={cn(
              "font-bold text-base",
              isLive ? "text-primary" : "text-foreground"
            )}>
              {slot.startTime}
            </p>
            <p className="text-xs text-foreground/60">{slot.endTime}</p>
          </div>
          
          {/* Divider */}
          <div className={cn(
            "w-1 h-12 rounded-full",
            isLive ? "bg-gradient-to-b from-primary to-accent" : "bg-muted"
          )} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-lg text-foreground truncate">
                {slot.subject}
              </h4>
              {isLive && (
                <Badge className="bg-primary text-white text-[10px] px-1.5">
                  LIVE
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/70 font-medium">
              <span>{slot.batchName}</span>
              <span>•</span>
              <span>{slot.className}</span>
              {slot.room && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {slot.room}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Status/Action */}
          <div className="flex items-center gap-2">
            {slot.hasLessonPlan ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                <BookOpen className="w-3 h-3 mr-1" />
                Plan Ready
              </Badge>
            ) : (
              <Badge variant="outline" className="border-dashed">
                <Plus className="w-3 h-3 mr-1" />
                Add Plan
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherDashboard;
