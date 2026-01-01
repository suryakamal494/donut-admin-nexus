import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Users, 
  GraduationCap, 
  BookOpen,
  ClipboardList,
  Calendar,
  Clock,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dashboardStats, batches, teachers, students, instituteExams } from "@/data/instituteData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setupStatus, todaySnapshot, counts } = dashboardStats;

  const setupItems = [
    { 
      label: "Classes Configured", 
      done: setupStatus.classesConfigured, 
      href: "/institute/master-data",
      description: "Academic structure from platform"
    },
    { 
      label: "Batches Created", 
      done: setupStatus.batchesCreated, 
      href: "/institute/batches",
      description: "Create sections for your classes"
    },
    { 
      label: "Teachers Added", 
      done: setupStatus.teachersAdded, 
      href: "/institute/teachers",
      description: "Add teaching staff"
    },
    { 
      label: "Students Added", 
      done: setupStatus.studentsAdded, 
      href: "/institute/students",
      description: "Enroll students in batches"
    },
  ];

  const quickActions = [
    { 
      label: "Create Batch", 
      icon: Plus, 
      href: "/institute/batches/create",
      description: "Add a new section"
    },
    { 
      label: "Add Teachers", 
      icon: Users, 
      href: "/institute/teachers/create",
      description: "Register teaching staff"
    },
    { 
      label: "Add Students", 
      icon: GraduationCap, 
      href: "/institute/students/add",
      description: "Enroll new students"
    },
    { 
      label: "Create Test", 
      icon: ClipboardList, 
      href: "/institute/exams/create",
      description: "Schedule an exam"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening at your institute today</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Academic Year 2024-25</span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover-lift cursor-pointer" onClick={() => navigate("/institute/batches")}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{counts.totalBatches}</p>
                <p className="text-sm text-muted-foreground">Batches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer" onClick={() => navigate("/institute/teachers")}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{counts.totalTeachers}</p>
                <p className="text-sm text-muted-foreground">Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer" onClick={() => navigate("/institute/students")}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{counts.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer" onClick={() => navigate("/institute/exams")}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{counts.totalExams}</p>
                <p className="text-sm text-muted-foreground">Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Setup Status - Left Column */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>Setup Status</span>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Complete all steps to fully set up your institute
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {setupItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
              >
                {item.done ? (
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-destructive" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Right Side - Quick Actions & Snapshot */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action) => (
                  <Tooltip key={action.label}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => navigate(action.href)}
                        className="h-auto flex-col gap-2 p-4 hover:bg-primary/5 hover:border-primary/30 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <action.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{action.description}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today / This Week Snapshot */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{todaySnapshot.classesScheduled}</p>
                    <p className="text-sm text-muted-foreground">Classes Today</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{todaySnapshot.testsScheduledThisWeek}</p>
                    <p className="text-sm text-muted-foreground">Tests This Week</p>
                  </div>
                </div>

                <button 
                  onClick={() => navigate("/institute/exams")}
                  className="flex items-center gap-4 p-4 rounded-xl bg-destructive/5 hover:bg-destructive/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-foreground">{todaySnapshot.pendingTestReviews}</p>
                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Exams</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/institute/exams")}>
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {instituteExams.slice(0, 3).map((exam) => (
              <div 
                key={exam.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    exam.status === "completed" ? "bg-success/10" :
                    exam.status === "live" ? "bg-blue-100" :
                    exam.status === "scheduled" ? "bg-amber-100" :
                    "bg-muted"
                  }`}>
                    <ClipboardList className={`w-5 h-5 ${
                      exam.status === "completed" ? "text-success" :
                      exam.status === "live" ? "text-blue-600" :
                      exam.status === "scheduled" ? "text-amber-600" :
                      "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{exam.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.totalQuestions} questions • {exam.duration} mins
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  exam.status === "completed" ? "bg-success/10 text-success" :
                  exam.status === "live" ? "bg-blue-100 text-blue-700" :
                  exam.status === "scheduled" ? "bg-amber-100 text-amber-700" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
