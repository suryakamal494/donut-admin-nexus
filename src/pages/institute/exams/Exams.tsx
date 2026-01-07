import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Edit2, Calendar, Users, Clock, Monitor, MonitorPlay, UserPlus, FolderOpen, ChevronRight, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { instituteExams, batches } from "@/data/instituteData";
import { mockPreviousYearPapers } from "@/data/examsData";
import ScheduleExamDialog from "@/components/institute/exams/ScheduleExamDialog";
import AssignBatchesDialog from "@/components/institute/exams/AssignBatchesDialog";
import { SubjectBadge } from "@/components/subject/SubjectBadge";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-amber-100 text-amber-700",
  live: "bg-blue-100 text-blue-700",
  completed: "bg-success/10 text-success",
};

const Exams = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [assignBatchesDialogOpen, setAssignBatchesDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<{ id: string; name: string; batches: string[] } | null>(null);

  const handleOpenScheduleDialog = (exam: { id: string; name: string; batches: string[] }) => {
    setSelectedExam(exam);
    setScheduleDialogOpen(true);
  };

  const handleOpenAssignBatchesDialog = (exam: { id: string; name: string; batches: string[] }) => {
    setSelectedExam(exam);
    setAssignBatchesDialogOpen(true);
  };

  const filteredExams = instituteExams.filter((exam) => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBatchNames = (batchIds: string[]) => {
    if (batchIds.length === 0) return "No batches assigned";
    return batchIds.map(id => {
      const batch = batches.find(b => b.id === id);
      return batch ? `${batch.className} - ${batch.name}` : id;
    }).join(", ");
  };

  const stats = {
    total: instituteExams.length,
    draft: instituteExams.filter(e => e.status === "draft").length,
    scheduled: instituteExams.filter(e => e.status === "scheduled").length,
    live: instituteExams.filter(e => e.status === "live").length,
    completed: instituteExams.filter(e => e.status === "completed").length,
  };

  // Count of published PYPs from Super Admin
  const publishedPYPCount = mockPreviousYearPapers.filter(p => p.status === "published").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Exams"
        description="Create and manage tests for your batches"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate("/institute/exams/upload")}>
              <Upload className="w-4 h-4" />
              Upload PDF
            </Button>
            <Button className="gradient-button gap-2" onClick={() => navigate("/institute/exams/create")}>
              <Plus className="w-4 h-4" />
              Create Exam
            </Button>
          </div>
        }
      />

      {/* Previous Year Papers Access Card */}
      <Card 
        className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/40 cursor-pointer transition-all group"
        onClick={() => navigate("/institute/exams/previous-year-papers")}
      >
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                Previous Year Papers
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {publishedPYPCount} Papers
                </Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                Access JEE Main, JEE Advanced & NEET papers • Shared by Super Admin
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Exams</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-amber-600">{stats.scheduled}</p>
            <p className="text-sm text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.live}</p>
            <p className="text-sm text-muted-foreground">Live Now</p>
          </CardContent>
        </Card>
        <Card className="bg-success/5">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-success">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Exams Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="hover-lift">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{exam.name}</h3>
                </div>
                <Badge className={statusColors[exam.status]}>
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </Badge>
              </div>

              {/* Subject Badges with Color Coding */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {exam.subjects.slice(0, 3).map((subject) => (
                  <SubjectBadge key={subject} subject={subject} size="xs" />
                ))}
                {exam.subjects.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{exam.subjects.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className={exam.batches.length === 0 ? "text-amber-600" : ""}>
                    {getBatchNames(exam.batches)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{exam.totalQuestions} questions • {exam.duration} mins • {exam.totalMarks} marks</span>
                </div>
                {exam.scheduledDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {exam.uiType === "real_exam" ? (
                    <>
                      <MonitorPlay className="w-4 h-4" />
                      <span>Real Exam UI</span>
                    </>
                  ) : (
                    <>
                      <Monitor className="w-4 h-4" />
                      <span>Platform UI</span>
                    </>
                  )}
                  {exam.pattern && (
                    <Badge variant="outline" className="ml-2 text-xs">{exam.pattern}</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/institute/exams/review/${exam.id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/institute/exams/review/${exam.id}`)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleOpenAssignBatchesDialog({ id: exam.id, name: exam.name, batches: exam.batches })}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Assign
                </Button>
                {(exam.status === "draft" || exam.batches.length > 0) && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleOpenScheduleDialog({ id: exam.id, name: exam.name, batches: exam.batches })}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Schedule
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredExams.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No exams found matching your criteria</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/institute/exams/create")}
            >
              Create your first exam
            </Button>
          </div>
        )}
      </div>

      {/* Schedule Dialog */}
      {selectedExam && (
        <ScheduleExamDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          exam={selectedExam}
          onScheduleSaved={(date, time) => {
            console.log("Scheduled:", selectedExam.id, date, time);
          }}
        />
      )}

      {/* Assign Batches Dialog */}
      {selectedExam && (
        <AssignBatchesDialog
          open={assignBatchesDialogOpen}
          onOpenChange={setAssignBatchesDialogOpen}
          exam={selectedExam}
          onBatchesSaved={(batches) => {
            console.log("Batches assigned:", selectedExam.id, batches);
          }}
        />
      )}
    </div>
  );
};

export default Exams;