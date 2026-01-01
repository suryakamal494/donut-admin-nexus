import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Edit2, Trash2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock questions data for review
const mockQuestions = [
  { id: "q1", subject: "phy", text: "A particle moves in a straight line with constant acceleration. If the velocity at time t=0 is 5 m/s and at t=2s is 15 m/s, what is the acceleration?", options: ["2.5 m/s²", "5 m/s²", "7.5 m/s²", "10 m/s²"], correct: 1, difficulty: "easy", status: "reviewed" },
  { id: "q2", subject: "phy", text: "The dimensional formula of Planck's constant is the same as that of:", options: ["Energy", "Power", "Angular momentum", "Linear momentum"], correct: 2, difficulty: "medium", status: "pending" },
  { id: "q3", subject: "phy", text: "A body is projected vertically upward from the surface of the earth with a velocity equal to half the escape velocity. The maximum height attained by the body is:", options: ["R/3", "R/2", "2R/3", "R"], correct: 0, difficulty: "hard", status: "pending" },
  { id: "q4", subject: "che", text: "Which of the following is the strongest acid?", options: ["HF", "HCl", "HBr", "HI"], correct: 3, difficulty: "easy", status: "reviewed" },
  { id: "q5", subject: "che", text: "The hybridization of carbon in diamond is:", options: ["sp", "sp²", "sp³", "sp³d"], correct: 2, difficulty: "easy", status: "pending" },
  { id: "q6", subject: "mat", text: "If f(x) = x³ - 3x² + 3x - 1, then f'(1) equals:", options: ["0", "1", "2", "3"], correct: 0, difficulty: "medium", status: "pending" },
  { id: "q7", subject: "mat", text: "The value of ∫₀^π sin²x dx is:", options: ["0", "π/4", "π/2", "π"], correct: 2, difficulty: "medium", status: "reviewed" },
];

const subjectLabels: Record<string, string> = {
  phy: "Physics",
  che: "Chemistry",
  mat: "Mathematics",
  bio: "Biology",
  eng: "English",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  hard: "bg-destructive/10 text-destructive",
};

const ReviewExam = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [activeSubject, setActiveSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const subjects = [...new Set(mockQuestions.map(q => q.subject))];
  
  const filteredQuestions = activeSubject === "all" 
    ? mockQuestions 
    : mockQuestions.filter(q => q.subject === activeSubject);

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handlePublish = () => {
    toast.success("Exam published successfully!");
    navigate("/institute/exams");
  };

  const stats = {
    total: mockQuestions.length,
    reviewed: mockQuestions.filter(q => q.status === "reviewed").length,
    pending: mockQuestions.filter(q => q.status === "pending").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Review Exam Questions"
        description="Review and approve questions before publishing"
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams", href: "/institute/exams" },
          { label: "Review" },
        ]}
        actions={
          <Button className="gradient-button" onClick={handlePublish}>
            <Check className="w-4 h-4 mr-2" />
            Publish Exam
          </Button>
        }
      />

      {/* Stats */}
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Questions</span>
            <span className="text-xl font-bold">{stats.total}</span>
          </CardContent>
        </Card>
        <Card className="flex-1 bg-success/5">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Reviewed</span>
            <span className="text-xl font-bold text-success">{stats.reviewed}</span>
          </CardContent>
        </Card>
        <Card className="flex-1 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending</span>
            <span className="text-xl font-bold text-amber-600">{stats.pending}</span>
          </CardContent>
        </Card>
      </div>

      {/* Subject Tabs */}
      <Tabs value={activeSubject} onValueChange={(v) => { setActiveSubject(v); setCurrentPage(1); }}>
        <TabsList>
          <TabsTrigger value="all">All ({mockQuestions.length})</TabsTrigger>
          {subjects.map(sub => (
            <TabsTrigger key={sub} value={sub}>
              {subjectLabels[sub]} ({mockQuestions.filter(q => q.subject === sub).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Quick Jump Grid */}
      <div className="bg-card rounded-xl p-4 border border-border/50">
        <p className="text-sm text-muted-foreground mb-3">Quick Jump</p>
        <div className="flex flex-wrap gap-2">
          {filteredQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentPage(Math.floor(idx / questionsPerPage) + 1)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                q.status === "reviewed"
                  ? "bg-success/10 text-success border border-success/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {paginatedQuestions.map((question, idx) => {
          const globalIdx = (currentPage - 1) * questionsPerPage + idx + 1;
          return (
            <Card key={question.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      {globalIdx}
                    </span>
                    <Badge variant="outline">{subjectLabels[question.subject]}</Badge>
                    <Badge className={difficultyColors[question.difficulty]}>
                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-foreground mb-4">{question.text}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className={cn(
                          "p-3 rounded-lg border text-sm",
                          optIdx === question.correct
                            ? "border-success bg-success/5 text-success"
                            : "border-border"
                        )}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewExam;
