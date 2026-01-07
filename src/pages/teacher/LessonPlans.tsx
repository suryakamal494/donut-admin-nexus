import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  BookOpen,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Play,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { teacherLessonPlans, currentTeacher, type LessonPlan } from "@/data/teacherData";
import { PageHeader } from "@/components/ui/page-header";

const LessonPlans = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");

  const filteredPlans = teacherLessonPlans.filter((plan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || plan.status === statusFilter;
    const matchesBatch = batchFilter === "all" || plan.batchId === batchFilter;
    return matchesSearch && matchesStatus && matchesBatch;
  });

  const getStatusConfig = (status: LessonPlan["status"]) => {
    switch (status) {
      case "draft":
        return { label: "Draft", className: "bg-muted text-muted-foreground" };
      case "ready":
        return { label: "Ready", className: "bg-green-100 text-green-700" };
      case "completed":
        return { label: "Completed", className: "bg-blue-100 text-blue-700" };
      default:
        return { label: status, className: "bg-muted text-muted-foreground" };
    }
  };

  const getTotalDuration = (plan: LessonPlan) => {
    return plan.blocks.reduce((total, block) => total + (block.duration || 0), 0);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Lesson Plans"
        description="Create and manage your teaching plans"
        breadcrumbs={[
          { label: "Teacher", href: "/teacher" },
          { label: "Lesson Plans" },
        ]}
      />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search lesson plans..."
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={batchFilter} onValueChange={setBatchFilter}>
            <SelectTrigger className="w-[130px]">
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
            onClick={() => navigate("/teacher/lesson-plans/create")}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Plan</span>
          </Button>
        </div>
      </div>

      {/* Lesson Plans Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => {
          const statusConfig = getStatusConfig(plan.status);
          const totalDuration = getTotalDuration(plan);
          
          return (
            <Card 
              key={plan.id} 
              className="card-premium cursor-pointer group"
              onClick={() => navigate(`/teacher/lesson-plans/${plan.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Badge className={statusConfig.className}>
                    {statusConfig.label}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/teacher/lesson-plans/${plan.id}`); }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Copy className="w-4 h-4 mr-2" />
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                  {plan.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {plan.chapter} • {plan.topic}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {plan.batchName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {totalDuration}m
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {plan.blocks.length} blocks
                  </span>
                </div>
                
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(plan.scheduledDate).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    • Period {plan.periodNumber}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {/* Empty State / Create Card */}
        <Card 
          className="border-dashed border-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          onClick={() => navigate("/teacher/lesson-plans/create")}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center min-h-[200px] text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Create New Plan</h3>
            <p className="text-sm text-muted-foreground">
              Start from scratch or use AI
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlans;
