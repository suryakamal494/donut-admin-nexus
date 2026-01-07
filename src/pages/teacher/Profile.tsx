import { 
  Mail, 
  Phone, 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  ClipboardList, 
  GraduationCap,
  ChevronRight,
  Settings,
  Bell,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { currentTeacher, teacherLessonPlans, teacherAssessments, teacherHomework } from "@/data/teacherData";
import { teachers, batches } from "@/data/instituteData";

// Get enriched teacher data
const getEnrichedTeacherData = () => {
  const instituteTeacher = teachers.find(t => t.id === currentTeacher.id);
  return {
    ...currentTeacher,
    batches: instituteTeacher?.batches || [],
    email: instituteTeacher?.email || currentTeacher.email,
    mobile: instituteTeacher?.mobile || currentTeacher.mobile,
  };
};

// Calculate stats
const getTeachingStats = () => {
  return {
    totalLessonPlans: teacherLessonPlans.length,
    readyLessonPlans: teacherLessonPlans.filter(lp => lp.status === "ready").length,
    totalAssessments: teacherAssessments.length,
    completedAssessments: teacherAssessments.filter(a => a.status === "completed").length,
    totalHomework: teacherHomework.length,
    activeHomework: teacherHomework.filter(h => h.status === "assigned").length,
    totalStudents: batches
      .filter(b => currentTeacher.assignedBatches?.includes(b.id) || 
        teachers.find(t => t.id === currentTeacher.id)?.batches.some(tb => tb.batchId === b.id))
      .reduce((acc, b) => acc + b.studentCount, 0) || 127,
  };
};

const Profile = () => {
  const teacher = getEnrichedTeacherData();
  const stats = getTeachingStats();

  const initials = teacher.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        {/* Gradient Header */}
        <div className="h-24 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-400" />
        
        <CardContent className="relative pt-0 pb-6">
          {/* Avatar */}
          <div className="absolute -top-12 left-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="pt-14 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{teacher.name}</h1>
              <p className="text-muted-foreground">Senior Physics Teacher</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {teacher.subjects.map(subject => (
                <Badge key={subject} className="bg-indigo-600 text-white">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {subject}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{teacher.mobile}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teaching Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Teaching Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-center">
              <p className="text-2xl font-bold text-teal-600">{stats.totalStudents}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Students</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalLessonPlans}</p>
              <p className="text-xs text-muted-foreground mt-1">Lesson Plans</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.totalAssessments}</p>
              <p className="text-xs text-muted-foreground mt-1">Assessments</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.totalHomework}</p>
              <p className="text-xs text-muted-foreground mt-1">Homework Assigned</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Batches */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Assigned Batches
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {teacher.batches.length > 0 ? (
            teacher.batches.map((batch, index) => {
              const batchInfo = batches.find(b => b.id === batch.batchId);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{batch.batchName}</p>
                      <p className="text-xs text-muted-foreground">{batch.subject}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {batchInfo?.studentCount || 35} students
                  </Badge>
                </div>
              );
            })
          ) : (
            <p className="text-muted-foreground text-sm">No batches assigned yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <Link
              to="/teacher/lesson-plans"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">My Lesson Plans</p>
                  <p className="text-xs text-muted-foreground">{stats.readyLessonPlans} ready to teach</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            <Link
              to="/teacher/assessments"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">My Assessments</p>
                  <p className="text-xs text-muted-foreground">{stats.totalAssessments} assessments created</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>

            <Link
              to="/teacher/schedule"
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">View Timetable</p>
                  <p className="text-xs text-muted-foreground">Weekly schedule overview</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="notifications" className="text-sm cursor-pointer">
                Push Notifications
              </Label>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
          
          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="email-notif" className="text-sm cursor-pointer">
                Email Notifications
              </Label>
            </div>
            <Switch id="email-notif" defaultChecked />
          </div>

          <Separator />

          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
