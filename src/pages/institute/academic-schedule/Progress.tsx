import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { StatsCard } from "@/components/ui/stats-card";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BookOpen,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { batchProgressSummaries, pendingConfirmations } from "@/data/academicScheduleData";
import { cn } from "@/lib/utils";

const getStatusColor = (status: string) => {
  switch (status) {
    case "ahead":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "on_track":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "lagging":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-muted-foreground bg-muted";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "ahead":
      return <TrendingUp className="w-4 h-4" />;
    case "on_track":
      return <CheckCircle className="w-4 h-4" />;
    case "lagging":
      return <TrendingDown className="w-4 h-4" />;
    case "critical":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "ahead":
      return "Ahead";
    case "on_track":
      return "On Track";
    case "lagging":
      return "Lagging";
    case "critical":
      return "Critical";
    default:
      return status;
  }
};

export default function AcademicProgress() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const filteredBatches = selectedClass === "all"
    ? batchProgressSummaries
    : batchProgressSummaries.filter(b => b.className.toLowerCase().includes(selectedClass.toLowerCase()));

  // Summary stats
  const totalBatches = batchProgressSummaries.length;
  const onTrackCount = batchProgressSummaries.filter(b => b.status === "on_track" || b.status === "ahead").length;
  const laggingCount = batchProgressSummaries.filter(b => b.status === "lagging" || b.status === "critical").length;
  const pendingCount = pendingConfirmations.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Syllabus Progress"
        description="Track syllabus completion across all batches"
        breadcrumbs={[
          { label: "Syllabus Tracker" },
          { label: "Progress" },
        ]}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Batches"
          value={totalBatches}
          icon={Users}
        />
        <StatsCard
          title="On Track"
          value={onTrackCount}
          icon={CheckCircle}
          className="border-emerald-200 bg-emerald-50/30"
        />
        <StatsCard
          title="Lagging"
          value={laggingCount}
          icon={AlertTriangle}
          className="border-amber-200 bg-amber-50/30"
        />
        <StatsCard
          title="Pending Confirmations"
          value={pendingCount}
          icon={Clock}
          className="border-orange-200 bg-orange-50/30"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="class 9">Class 9</SelectItem>
            <SelectItem value="class 10">Class 10</SelectItem>
            <SelectItem value="class 11">Class 11</SelectItem>
            <SelectItem value="class 12">Class 12</SelectItem>
          </SelectContent>
        </Select>

        {pendingCount > 0 && (
          <Button variant="outline" className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50">
            <Clock className="w-4 h-4" />
            {pendingCount} Pending Confirmations
          </Button>
        )}
      </div>

      {/* Batch Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBatches.map((batch) => (
          <Card
            key={batch.batchId}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/institute/academic-schedule/progress/${batch.batchId}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{batch.batchName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{batch.className}</p>
                </div>
                <Badge className={cn("gap-1.5", getStatusColor(batch.status))}>
                  {getStatusIcon(batch.status)}
                  {getStatusLabel(batch.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-semibold">{batch.overallProgress}%</span>
                </div>
                <Progress value={batch.overallProgress} className="h-2" />
              </div>

              {/* Subject Progress */}
              <div className="space-y-2">
                {batch.subjects.slice(0, 3).map((subject) => (
                  <div
                    key={subject.subjectId}
                    className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{subject.subjectName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {subject.chaptersCompleted}/{subject.totalChapters} chapters
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getStatusColor(subject.overallStatus))}
                      >
                        {subject.percentComplete}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Details */}
              <Button variant="ghost" className="w-full justify-between group">
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBatches.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Progress Data</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by setting up academic schedules and weekly plans to track progress.
              </p>
              <Button
                className="mt-4 gradient-button"
                onClick={() => navigate("/institute/academic-schedule/setup")}
              >
                Go to Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
