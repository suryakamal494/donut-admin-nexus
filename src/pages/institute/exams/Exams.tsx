import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Eye, Edit2, Calendar, Users, Clock, Monitor, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { instituteExams, batches } from "@/data/instituteData";

const examTypeLabels: Record<string, string> = {
  unit_test: "Unit Test",
  mid_term: "Mid-Term",
  final: "Final Exam",
  practice: "Practice Test",
};

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
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredExams = instituteExams.filter((exam) => {
    const matchesSearch = exam.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
    const matchesType = typeFilter === "all" || exam.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getBatchNames = (batchIds: string[]) => {
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
          <Button className="gradient-button gap-2" onClick={() => navigate("/institute/exams/create")}>
            <Plus className="w-4 h-4" />
            Create Exam
          </Button>
        }
      />

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
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="unit_test">Unit Test</SelectItem>
            <SelectItem value="mid_term">Mid-Term</SelectItem>
            <SelectItem value="final">Final Exam</SelectItem>
            <SelectItem value="practice">Practice Test</SelectItem>
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
                  <p className="text-sm text-muted-foreground">{examTypeLabels[exam.type]}</p>
                </div>
                <Badge className={statusColors[exam.status]}>
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{getBatchNames(exam.batches)}</span>
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

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => navigate(`/institute/exams/review/${exam.id}`)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                {exam.status === "draft" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/institute/exams/review/${exam.id}`)}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
                {exam.status === "draft" && (
                  <Button variant="default" size="sm" className="flex-1">
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
    </div>
  );
};

export default Exams;
