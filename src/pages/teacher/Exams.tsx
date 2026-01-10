import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  FileQuestion,
  Clock,
  Users,
  TrendingUp,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { TeacherExamCard } from "@/components/teacher/exams";
import { teacherExams } from "@/data/teacher/exams";
import { cn } from "@/lib/utils";
import type { TeacherExam } from "@/data/teacher/types";

const Exams = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [exams, setExams] = useState<TeacherExam[]>(teacherExams);

  const filteredExams = exams.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: exams.length,
    draft: exams.filter(e => e.status === "draft").length,
    scheduled: exams.filter(e => e.status === "scheduled").length,
    completed: exams.filter(e => e.status === "completed").length,
  };

  const statusFilters = [
    { id: "all", label: "All", count: stats.total },
    { id: "draft", label: "Drafts", count: stats.draft },
    { id: "scheduled", label: "Scheduled", count: stats.scheduled },
    { id: "completed", label: "Done", count: stats.completed },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Exams"
        description="Create and manage tests for your students"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Exams" },
        ]}
      />

      {/* Stats Row - Compact on mobile */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <Card className="card-premium">
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileQuestion className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold">{stats.total}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold">{stats.draft}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Drafts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold">{stats.scheduled}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-lg sm:text-2xl font-bold">{stats.completed}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Done</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Pills - Mobile-first horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
              "active:scale-[0.98]",
              statusFilter === filter.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            {filter.label}
            {filter.count > 0 && (
              <span className={cn(
                "ml-1.5 px-1.5 py-0.5 rounded-full text-xs",
                statusFilter === filter.id
                  ? "bg-white/20"
                  : "bg-background"
              )}>
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Create */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        
        <Button 
          className="gradient-button h-11 px-4 shrink-0"
          onClick={() => navigate("/teacher/exams/create")}
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Create</span>
        </Button>
      </div>

      {/* Exams Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExams.map((exam) => (
          <TeacherExamCard
            key={exam.id}
            exam={exam}
            onEdit={() => {}}
            onDuplicate={() => {}}
            onDelete={() => {
              setExams(prev => prev.filter(e => e.id !== exam.id));
            }}
            onStart={() => {}}
            onViewResults={() => {}}
          />
        ))}
        
        {filteredExams.length === 0 && (
          <Card className="col-span-full border-dashed">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileQuestion className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">No exams found</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Create your first exam to get started"}
              </p>
              <Button 
                onClick={() => navigate("/teacher/exams/create")} 
                className="gradient-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Exam
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-20 right-4 md:hidden z-40">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full gradient-button shadow-lg shadow-primary/30"
          onClick={() => navigate("/teacher/exams/create")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Exams;
