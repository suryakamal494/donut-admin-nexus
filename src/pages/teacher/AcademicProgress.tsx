import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { subjectProgressData, pendingConfirmations, teachingConfirmations } from "@/data/academicScheduleData";

// Mock teacher data
const teacherProfile = { id: "teacher-1", name: "Dr. Rajesh Kumar" };
const teacherBatches = [
  { id: "batch-1", name: "Section A", className: "Class 10" },
  { id: "batch-3", name: "Section A", className: "Class 9" },
];

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
    default: return status;
  }
};

export default function TeacherAcademicProgress() {
  const [selectedBatch, setSelectedBatch] = useState<string>("all");

  // Filter progress by teacher's assigned batches
  const teacherBatchIds = teacherBatches.map(b => b.id);
  const filteredProgress = subjectProgressData.filter(p => 
    teacherBatchIds.includes(p.batchId) &&
    (selectedBatch === "all" || p.batchId === selectedBatch)
  );

  // Teacher's pending confirmations
  const myPendingConfirmations = pendingConfirmations.filter(
    p => p.teacherId === teacherProfile.id
  );

  // Teacher's teaching hours this week
  const thisWeekConfirmations = teachingConfirmations.filter(
    c => c.teacherId === teacherProfile.id && c.didTeach
  );
  const totalHoursThisWeek = thisWeekConfirmations.reduce(
    (sum, c) => sum + c.periodsCount, 0
  );

  // Summary stats
  const totalSubjects = filteredProgress.length;
  const onTrackCount = filteredProgress.filter(
    p => p.overallStatus === "ahead" || p.overallStatus === "in_progress"
  ).length;
  const laggingCount = filteredProgress.filter(
    p => p.overallStatus === "lagging"
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Syllabus Progress"
        description="Track your teaching progress across batches"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Syllabus Progress" },
        ]}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Batches</p>
                <p className="text-xl font-bold">{teacherBatches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Track</p>
                <p className="text-xl font-bold">{onTrackCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Need Attention</p>
                <p className="text-xl font-bold">{laggingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours This Week</p>
                <p className="text-xl font-bold">{totalHoursThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Confirmations Alert */}
      {myPendingConfirmations.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Pending Confirmations</p>
                  <p className="text-sm text-muted-foreground">
                    {myPendingConfirmations.length} class{myPendingConfirmations.length !== 1 ? 'es' : ''} awaiting confirmation
                  </p>
                </div>
              </div>
              <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                Confirm Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Batches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {teacherBatches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.className} - {batch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProgress.map((progress) => (
          <Card key={`${progress.batchId}-${progress.subjectId}`} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{progress.batchName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{progress.subjectName}</Badge>
                    {progress.currentChapterName && (
                      <span className="text-sm text-muted-foreground">
                        Current: {progress.currentChapterName}
                      </span>
                    )}
                  </div>
                </div>
                <Badge className={cn("gap-1.5", getStatusColor(progress.overallStatus))}>
                  {getStatusIcon(progress.overallStatus)}
                  {getStatusLabel(progress.overallStatus)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{progress.percentComplete}%</span>
                </div>
                <Progress value={progress.percentComplete} className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-lg font-semibold">{progress.chaptersCompleted}/{progress.totalChapters}</p>
                  <p className="text-xs text-muted-foreground">Chapters</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-lg font-semibold">{progress.totalActualHours}h</p>
                  <p className="text-xs text-muted-foreground">Taught</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className={cn(
                    "text-lg font-semibold",
                    progress.lostDays > 2 && "text-amber-600"
                  )}>
                    {progress.lostDays}
                  </p>
                  <p className="text-xs text-muted-foreground">Lost Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProgress.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Progress Data</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Progress tracking will appear here once you start teaching and confirming classes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}