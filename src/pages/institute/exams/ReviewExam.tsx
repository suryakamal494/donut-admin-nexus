import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Edit2, Trash2, RefreshCw, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SubjectBadge, getSubjectColor } from "@/components/subject/SubjectBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock questions data for review
const mockQuestions = [
  { id: "q1", subject: "phy", text: "A particle moves in a straight line with constant acceleration. If the velocity at time t=0 is 5 m/s and at t=2s is 15 m/s, what is the acceleration?", options: ["2.5 m/s²", "5 m/s²", "7.5 m/s²", "10 m/s²"], correct: 1, difficulty: "easy", isAIGenerated: true },
  { id: "q2", subject: "phy", text: "The dimensional formula of Planck's constant is the same as that of:", options: ["Energy", "Power", "Angular momentum", "Linear momentum"], correct: 2, difficulty: "medium", isAIGenerated: true },
  { id: "q3", subject: "phy", text: "A body is projected vertically upward from the surface of the earth with a velocity equal to half the escape velocity. The maximum height attained by the body is:", options: ["R/3", "R/2", "2R/3", "R"], correct: 0, difficulty: "hard", isAIGenerated: true },
  { id: "q4", subject: "che", text: "Which of the following is the strongest acid?", options: ["HF", "HCl", "HBr", "HI"], correct: 3, difficulty: "easy", isAIGenerated: true },
  { id: "q5", subject: "che", text: "The hybridization of carbon in diamond is:", options: ["sp", "sp²", "sp³", "sp³d"], correct: 2, difficulty: "easy", isAIGenerated: true },
  { id: "q6", subject: "mat", text: "If f(x) = x³ - 3x² + 3x - 1, then f'(1) equals:", options: ["0", "1", "2", "3"], correct: 0, difficulty: "medium", isAIGenerated: true },
  { id: "q7", subject: "mat", text: "The value of ∫₀^π sin²x dx is:", options: ["0", "π/4", "π/2", "π"], correct: 2, difficulty: "medium", isAIGenerated: true },
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

type QuestionStatus = "pending" | "reviewed" | "deleted" | "regenerating";

interface QuestionState {
  status: QuestionStatus;
  editedText?: string;
  editedOptions?: string[];
}

const ReviewExam = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [activeSubject, setActiveSubject] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  // Question states
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>(() => {
    const initial: Record<string, QuestionState> = {};
    mockQuestions.forEach(q => {
      initial[q.id] = { status: "pending" };
    });
    return initial;
  });

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<typeof mockQuestions[0] | null>(null);
  const [editText, setEditText] = useState("");
  const [editOptions, setEditOptions] = useState<string[]>([]);

  const subjects = [...new Set(mockQuestions.map(q => q.subject))];
  
  const filteredQuestions = activeSubject === "all" 
    ? mockQuestions 
    : mockQuestions.filter(q => q.subject === activeSubject);

  // Filter out deleted questions for display count, but show them in the list
  const nonDeletedQuestions = filteredQuestions.filter(q => questionStates[q.id]?.status !== "deleted");
  
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handlePublish = () => {
    const deletedCount = Object.values(questionStates).filter(s => s.status === "deleted").length;
    const reviewedCount = Object.values(questionStates).filter(s => s.status === "reviewed").length;
    toast.success(`Exam published! ${reviewedCount} questions reviewed, ${deletedCount} deleted.`);
    navigate("/institute/exams");
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "deleted" }
    }));
    toast.success("Question deleted");
  };

  const handleRestoreQuestion = (questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "pending" }
    }));
    toast.success("Question restored");
  };

  const handleRegenerateQuestion = (questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "regenerating" }
    }));

    // Simulate AI regeneration
    setTimeout(() => {
      setQuestionStates(prev => ({
        ...prev,
        [questionId]: { status: "pending" }
      }));
      toast.success("Question regenerated!");
    }, 2000);
  };

  const handleMarkReviewed = (questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "reviewed" }
    }));
  };

  const handleOpenEditDialog = (question: typeof mockQuestions[0]) => {
    setEditingQuestion(question);
    setEditText(question.text);
    setEditOptions([...question.options]);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingQuestion) {
      setQuestionStates(prev => ({
        ...prev,
        [editingQuestion.id]: {
          status: "reviewed",
          editedText: editText,
          editedOptions: editOptions
        }
      }));
      toast.success("Question updated");
      setEditDialogOpen(false);
      setEditingQuestion(null);
    }
  };

  const stats = {
    total: mockQuestions.length,
    reviewed: Object.values(questionStates).filter(s => s.status === "reviewed").length,
    pending: Object.values(questionStates).filter(s => s.status === "pending").length,
    deleted: Object.values(questionStates).filter(s => s.status === "deleted").length,
  };

  const getQuickNavColor = (question: typeof mockQuestions[0]) => {
    const state = questionStates[question.id];
    if (state?.status === "deleted") return "bg-destructive/10 text-destructive border border-destructive/30 line-through";
    if (state?.status === "reviewed") return "bg-success/10 text-success border border-success/30";
    if (state?.status === "regenerating") return "bg-blue-100 text-blue-700 border border-blue-300 animate-pulse";
    
    // Use subject color for pending
    const color = getSubjectColor(question.subject);
    return `${color.bg}/20 text-foreground border border-border/50`;
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
        <Card className="flex-1 bg-destructive/5">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Deleted</span>
            <span className="text-xl font-bold text-destructive">{stats.deleted}</span>
          </CardContent>
        </Card>
      </div>

      {/* Subject Tabs with Color Coding */}
      <Tabs value={activeSubject} onValueChange={(v) => { setActiveSubject(v); setCurrentPage(1); }}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="all" className="px-4">
            All ({mockQuestions.length})
          </TabsTrigger>
          {subjects.map(sub => (
            <TabsTrigger key={sub} value={sub} className="px-3">
              <SubjectBadge subject={sub} size="xs" showIcon={false} className="mr-1.5" />
              ({mockQuestions.filter(q => q.subject === sub).length})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Quick Jump Grid with Subject Colors */}
      <div className="bg-card rounded-xl p-4 border border-border/50">
        <p className="text-sm text-muted-foreground mb-3">Quick Jump</p>
        <div className="flex flex-wrap gap-2">
          {filteredQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentPage(Math.floor(idx / questionsPerPage) + 1)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                getQuickNavColor(q)
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
          const state = questionStates[question.id];
          const isDeleted = state?.status === "deleted";
          const isRegenerating = state?.status === "regenerating";
          const displayText = state?.editedText || question.text;
          const displayOptions = state?.editedOptions || question.options;

          return (
            <Card 
              key={question.id} 
              className={cn(
                "overflow-hidden transition-all",
                isDeleted && "opacity-60 border-destructive/30",
                isRegenerating && "border-blue-300"
              )}
            >
              <CardContent className="p-0">
                <div className={cn(
                  "flex items-center justify-between p-4 border-b border-border/50",
                  isDeleted ? "bg-destructive/5" : "bg-muted/30"
                )}>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      {globalIdx}
                    </span>
                    <SubjectBadge subject={question.subject} size="sm" />
                    <Badge className={difficultyColors[question.difficulty]}>
                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </Badge>
                    {isDeleted && (
                      <Badge variant="destructive">Deleted</Badge>
                    )}
                    {isRegenerating && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        Regenerating...
                      </Badge>
                    )}
                    {state?.status === "reviewed" && !isDeleted && (
                      <Badge className="bg-success/10 text-success">Reviewed</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isDeleted ? (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRestoreQuestion(question.id)}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restore
                        </Button>
                        {question.isAIGenerated && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRegenerateQuestion(question.id)}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Regenerate
                          </Button>
                        )}
                      </>
                    ) : isRegenerating ? null : (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleOpenEditDialog(question)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {state?.status !== "reviewed" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarkReviewed(question.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className={cn("p-4", isDeleted && "line-through opacity-70")}>
                  <p className="text-foreground mb-4">{displayText}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {displayOptions.map((option, optIdx) => (
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

      {/* Edit Question Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-3">
              <Label>Options</Label>
              {editOptions.map((option, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-medium text-sm">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...editOptions];
                      newOptions[idx] = e.target.value;
                      setEditOptions(newOptions);
                    }}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewExam;