import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  FileQuestion,
  BarChart3,
  Clock,
  Users,
  TrendingUp,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { AssessmentCard } from "@/components/teacher/AssessmentCard";
import { CreateAssessmentDialog } from "@/components/teacher/CreateAssessmentDialog";
import { teacherAssessments, type TeacherAssessment } from "@/data/teacherData";

const Assessments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [assessments, setAssessments] = useState<TeacherAssessment[]>(teacherAssessments);

  const filteredAssessments = assessments.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: assessments.length,
    draft: assessments.filter(a => a.status === "draft").length,
    scheduled: assessments.filter(a => a.status === "scheduled").length,
    completed: assessments.filter(a => a.status === "completed").length,
  };

  const handleAssessmentCreated = (newAssessment: TeacherAssessment) => {
    setAssessments(prev => [newAssessment, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Assessments"
        description="Create quizzes, tests, and track student performance"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Assessments" },
        ]}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileQuestion className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.draft}</p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.scheduled}</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="min-w-[100px] w-auto shrink-0">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="test">Test</SelectItem>
              <SelectItem value="poll">Poll</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="min-w-[110px] w-auto shrink-0">
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
          
          <Button 
            className="gradient-button gap-2 shrink-0 h-10 min-w-[44px]"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssessments.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            onEdit={() => {}}
            onDuplicate={() => {}}
            onDelete={() => {
              setAssessments(prev => prev.filter(a => a.id !== assessment.id));
            }}
            onStart={() => {}}
            onViewResults={() => {}}
          />
        ))}
        
        {filteredAssessments.length === 0 && (
          <Card className="col-span-full border-dashed">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <FileQuestion className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-1">No assessments found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first quiz or test"}
              </p>
              <Button onClick={() => setShowCreateDialog(true)} className="gradient-button">
                <Plus className="w-4 h-4 mr-2" />
                Create Assessment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Dialog */}
      <CreateAssessmentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreated={handleAssessmentCreated}
      />

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 md:hidden">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full gradient-button shadow-lg shadow-primary/30"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Assessments;
