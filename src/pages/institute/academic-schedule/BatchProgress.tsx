import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  ChevronDown,
  User,
  Calendar,
} from "lucide-react";
import { batchProgressSummaries, academicScheduleSetups, teachingConfirmations } from "@/data/academicScheduleData";
import { cn } from "@/lib/utils";
import { NO_TEACH_REASON_LABELS } from "@/types/academicSchedule";

const getStatusColor = (status: string) => {
  switch (status) {
    case "ahead":
    case "completed":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "on_track":
    case "in_progress":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "lagging":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "critical":
    case "not_started":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-muted-foreground bg-muted";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ahead":
    case "completed":
      return <TrendingUp className="w-4 h-4" />;
    case "on_track":
    case "in_progress":
      return <CheckCircle className="w-4 h-4" />;
    case "lagging":
      return <TrendingDown className="w-4 h-4" />;
    case "critical":
    case "not_started":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "ahead": return "Ahead";
    case "on_track": return "On Track";
    case "in_progress": return "In Progress";
    case "lagging": return "Lagging";
    case "critical": return "Critical";
    case "completed": return "Completed";
    case "not_started": return "Not Started";
    default: return status;
  }
};

export default function BatchProgress() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [lostDaysOpen, setLostDaysOpen] = useState(false);

  const batch = batchProgressSummaries.find(b => b.batchId === batchId);
  
  if (!batch) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Batch Not Found"
          description="The requested batch could not be found"
        />
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const defaultSubject = batch.subjects[0]?.subjectId || "";
  const [activeSubject, setActiveSubject] = useState(defaultSubject);
  
  const currentSubject = batch.subjects.find(s => s.subjectId === activeSubject);
  const subjectSetup = academicScheduleSetups.find(
    s => s.subjectId === activeSubject && s.classId?.includes(batch.className.toLowerCase().replace(" ", "-"))
  );

  // Get teacher contributions for this batch/subject
  const subjectConfirmations = teachingConfirmations.filter(
    c => c.batchId === batchId && c.subjectId === activeSubject && c.didTeach
  );
  
  const teacherContributions = subjectConfirmations.reduce((acc, conf) => {
    const existing = acc.find(t => t.teacherId === conf.teacherId);
    if (existing) {
      existing.hours += conf.periodsCount;
    } else {
      acc.push({
        teacherId: conf.teacherId,
        teacherName: conf.teacherName,
        hours: conf.periodsCount,
      });
    }
    return acc;
  }, [] as { teacherId: string; teacherName: string; hours: number }[]);

  const totalTeacherHours = teacherContributions.reduce((sum, t) => sum + t.hours, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={batch.batchName}
        description={`${batch.className} • Syllabus Progress Details`}
        breadcrumbs={[
          { label: "Syllabus Tracker", href: "/institute/academic-schedule/progress" },
          { label: "Progress", href: "/institute/academic-schedule/progress" },
          { label: batch.batchName },
        ]}
      />

      {/* Back Button & Overall Status */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Progress
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-2xl font-bold">{batch.overallProgress}%</p>
          </div>
          <Badge className={cn("gap-1.5 text-sm py-1.5 px-3", getStatusColor(batch.status))}>
            {getStatusIcon(batch.status)}
            {getStatusLabel(batch.status)}
          </Badge>
        </div>
      </div>

      {/* Subject Tabs */}
      <Tabs value={activeSubject} onValueChange={setActiveSubject}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {batch.subjects.map((subject) => (
            <TabsTrigger key={subject.subjectId} value={subject.subjectId} className="gap-2">
              <BookOpen className="w-4 h-4" />
              {subject.subjectName}
              <Badge variant="secondary" className="text-xs">
                {subject.percentComplete}%
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {batch.subjects.map((subject) => (
          <TabsContent key={subject.subjectId} value={subject.subjectId} className="space-y-6 mt-6">
            {/* Subject Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Actual / Planned</p>
                      <p className="text-lg font-semibold">
                        {subject.totalActualHours} / {subject.totalPlannedHours}h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Chapters</p>
                      <p className="text-lg font-semibold">
                        {subject.chaptersCompleted} / {subject.totalChapters}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="text-lg font-semibold truncate max-w-[120px]">
                        {subject.currentChapterName || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      subject.lostDays > 3 ? "bg-red-100" : "bg-amber-100"
                    )}>
                      <AlertTriangle className={cn(
                        "w-5 h-5",
                        subject.lostDays > 3 ? "text-red-600" : "text-amber-600"
                      )} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lost Days</p>
                      <p className="text-lg font-semibold">{subject.lostDays}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chapter Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chapter Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {subjectSetup?.chapters.map((chapter, index) => {
                  const isCompleted = index < subject.chaptersCompleted;
                  const isCurrent = chapter.chapterId === subject.currentChapter;
                  const progress = isCompleted ? 100 : isCurrent ? 60 : 0;
                  const status = isCompleted ? "completed" : isCurrent ? "in_progress" : "not_started";
                  
                  return (
                    <div
                      key={chapter.chapterId}
                      className={cn(
                        "p-4 rounded-lg border transition-colors",
                        isCurrent && "border-primary bg-primary/5",
                        isCompleted && "border-emerald-200 bg-emerald-50/30"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Ch {index + 1}
                            </span>
                            <h4 className="font-medium truncate">{chapter.chapterName}</h4>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{chapter.plannedHours}h planned</span>
                            {isCompleted && <span className="text-emerald-600">✓ Completed</span>}
                            {isCurrent && <span className="text-primary">● In Progress</span>}
                          </div>
                        </div>
                        <Badge className={cn("shrink-0", getStatusColor(status))}>
                          {getStatusLabel(status)}
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-1.5 mt-3" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Lost Days Breakdown */}
            {subject.lostDays > 0 && (
              <Collapsible open={lostDaysOpen} onOpenChange={setLostDaysOpen}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                          Lost Days Breakdown
                        </CardTitle>
                        <ChevronDown className={cn(
                          "w-5 h-5 transition-transform",
                          lostDaysOpen && "rotate-180"
                        )} />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {subject.lostDaysReasons.map((item) => (
                          <div
                            key={item.reason}
                            className="p-3 rounded-lg bg-muted/50 border"
                          >
                            <p className="text-sm text-muted-foreground">
                              {NO_TEACH_REASON_LABELS[item.reason]}
                            </p>
                            <p className="text-2xl font-bold">{item.count}</p>
                            <p className="text-xs text-muted-foreground">days</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {/* Teacher Contributions */}
            {teacherContributions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Teacher Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teacherContributions.map((teacher) => (
                      <div
                        key={teacher.teacherId}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{teacher.teacherName}</p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.hours} hours taught
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            {Math.round((teacher.hours / totalTeacherHours) * 100)}%
                          </p>
                          <p className="text-xs text-muted-foreground">contribution</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}