import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  FileText,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { HomeworkCard } from "@/components/teacher/HomeworkCard";
import { CreateHomeworkDialog } from "@/components/teacher/CreateHomeworkDialog";
import { teacherHomework, type TeacherHomework } from "@/data/teacherData";

const Homework = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [homeworkList, setHomeworkList] = useState<TeacherHomework[]>(teacherHomework);

  const filteredHomework = homeworkList.filter((hw) => {
    const matchesSearch = hw.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || hw.status === statusFilter;
    const matchesBatch = batchFilter === "all" || hw.batchId === batchFilter;
    return matchesSearch && matchesStatus && matchesBatch;
  });

  const stats = {
    total: homeworkList.length,
    active: homeworkList.filter(h => h.status === "assigned").length,
    overdue: homeworkList.filter(h => h.status === "overdue").length,
    completed: homeworkList.filter(h => h.status === "completed").length,
    pendingReview: homeworkList.reduce((sum, h) => sum + h.submissionCount, 0),
  };

  const handleHomeworkCreated = (newHomework: TeacherHomework) => {
    setHomeworkList(prev => [newHomework, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Homework"
        description="Assign and track homework submissions"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Homework" },
        ]}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pendingReview}</p>
              <p className="text-xs text-muted-foreground">To Review</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search homework..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="assigned">Active</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={batchFilter} onValueChange={setBatchFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              <SelectItem value="batch-10a">10A</SelectItem>
              <SelectItem value="batch-10b">10B</SelectItem>
              <SelectItem value="batch-11a">11A</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            className="gradient-button gap-2"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Assign</span>
          </Button>
        </div>
      </div>

      {/* Tabs for quick filtering */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All ({homeworkList.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-1">
            <Clock className="w-3 h-3" />
            Active ({stats.active})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            Overdue ({stats.overdue})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed ({stats.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <HomeworkGrid 
            homework={filteredHomework} 
            navigate={navigate}
            onDelete={(id) => setHomeworkList(prev => prev.filter(h => h.id !== id))}
          />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <HomeworkGrid 
            homework={filteredHomework.filter(h => h.status === "assigned")} 
            navigate={navigate}
            onDelete={(id) => setHomeworkList(prev => prev.filter(h => h.id !== id))}
          />
        </TabsContent>
        <TabsContent value="overdue" className="mt-4">
          <HomeworkGrid 
            homework={filteredHomework.filter(h => h.status === "overdue")} 
            navigate={navigate}
            onDelete={(id) => setHomeworkList(prev => prev.filter(h => h.id !== id))}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <HomeworkGrid 
            homework={filteredHomework.filter(h => h.status === "completed")} 
            navigate={navigate}
            onDelete={(id) => setHomeworkList(prev => prev.filter(h => h.id !== id))}
          />
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <CreateHomeworkDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreated={handleHomeworkCreated}
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

// Extracted grid component for reuse in tabs
const HomeworkGrid = ({ 
  homework, 
  navigate,
  onDelete 
}: { 
  homework: TeacherHomework[]; 
  navigate: any;
  onDelete: (id: string) => void;
}) => {
  if (homework.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <FileText className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-foreground mb-1">No homework found</h3>
          <p className="text-sm text-muted-foreground">
            No homework matches your current filters
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {homework.map((hw) => (
        <HomeworkCard
          key={hw.id}
          homework={hw}
          onEdit={() => {}}
          onDelete={() => onDelete(hw.id)}
          onViewSubmissions={() => {}}
          onViewLessonPlan={() => {
            if (hw.linkedLessonPlanId) {
              navigate(`/teacher/lesson-plans/${hw.linkedLessonPlanId}`);
            }
          }}
        />
      ))}
    </div>
  );
};

export default Homework;
