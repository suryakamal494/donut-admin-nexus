import { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { 
  Save, 
  Upload, 
  ChevronLeft, 
  ChevronRight,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Circle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sampleExamForReview, samplePYPForReview, ExamQuestion } from "@/data/examQuestionsData";
import { cn } from "@/lib/utils";

type QuestionStatus = "pending" | "reviewed" | "edited" | "deleted";

interface QuestionState {
  id: string;
  status: QuestionStatus;
  data: ExamQuestion;
  isViewed: boolean;
}

const QUESTIONS_PER_PAGE = 5;

const ReviewExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const examType = searchParams.get("type") || "grand_test";
  const creationMethod = searchParams.get("method") || "ai";
  
  // Use appropriate mock data based on type
  const examData = examType === "previous_year" ? samplePYPForReview : sampleExamForReview;
  
  const subjects = examData.subjects;
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});
  
  // Question states
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>(() => {
    const states: Record<string, QuestionState> = {};
    examData.questions.forEach(q => {
      states[q.id] = { id: q.id, status: "pending", data: q, isViewed: false };
    });
    return states;
  });
  
  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null);
  
  // Regenerate dialog (AI only)
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [regeneratingQuestionId, setRegeneratingQuestionId] = useState<string | null>(null);
  const [regenerateOption, setRegenerateOption] = useState("same_topic");
  
  // Publish dialog
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  
  // Get questions for current subject
  const subjectQuestions = useMemo(() => {
    return examData.questions.filter(q => q.subject === activeSubject);
  }, [activeSubject, examData.questions]);
  
  // Pagination
  const totalPages = Math.ceil(subjectQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = subjectQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );
  
  // Stats per subject
  const getSubjectStats = (subject: string) => {
    const qs = examData.questions.filter(q => q.subject === subject);
    const reviewed = qs.filter(q => questionStates[q.id]?.status !== "pending" && questionStates[q.id]?.status !== "deleted").length;
    const deleted = qs.filter(q => questionStates[q.id]?.status === "deleted").length;
    return { total: qs.length, reviewed, deleted };
  };
  
  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
    setCurrentPage(1);
  };
  
  const handleEditQuestion = (question: ExamQuestion) => {
    setEditingQuestion({ ...question });
    setEditDialogOpen(true);
  };
  
  const handleSaveEdit = () => {
    if (!editingQuestion) return;
    setQuestionStates(prev => ({
      ...prev,
      [editingQuestion.id]: {
        ...prev[editingQuestion.id],
        status: "edited",
        data: editingQuestion
      }
    }));
    setEditDialogOpen(false);
    toast({ title: "Question updated", description: "Changes saved successfully." });
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "deleted" }
    }));
    toast({ title: "Question deleted", description: "You can regenerate a replacement." });
  };
  
  const handleRegenerateClick = (questionId: string) => {
    setRegeneratingQuestionId(questionId);
    setRegenerateDialogOpen(true);
  };
  
  const handleRegenerate = () => {
    if (!regeneratingQuestionId) return;
    // Simulate regeneration
    setTimeout(() => {
      setQuestionStates(prev => ({
        ...prev,
        [regeneratingQuestionId]: { ...prev[regeneratingQuestionId], status: "reviewed" }
      }));
      setRegenerateDialogOpen(false);
      toast({ title: "Question regenerated", description: "New question added successfully." });
    }, 1000);
  };
  
  const handleMarkReviewed = (questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "reviewed", isViewed: true }
    }));
  };
  
  const handleSaveDraft = () => {
    toast({ title: "Draft saved", description: "Your progress has been saved." });
  };
  
  const handlePublish = () => {
    setPublishDialogOpen(false);
    toast({ title: "Test published!", description: "The test is now available." });
    navigate("/superadmin/exams");
  };
  
  const toggleSolution = (questionId: string) => {
    setShowSolution(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };
  
  const getStatusIcon = (status: QuestionStatus) => {
    switch (status) {
      case "reviewed": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "edited": return <Edit2 className="h-4 w-4 text-orange-500" />;
      case "deleted": return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getQuickNavColor = (questionId: string) => {
    const state = questionStates[questionId];
    if (!state) return "bg-muted hover:bg-muted/80";
    switch (state.status) {
      case "reviewed": return "bg-green-500/20 text-green-700 border-green-500/30";
      case "edited": return "bg-orange-500/20 text-orange-700 border-orange-500/30";
      case "deleted": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted hover:bg-muted/80";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Review: ${examData.name}`}
        description={
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline">{examType === "previous_year" ? "Previous Year Paper" : "Grand Test"}</Badge>
            <Badge variant="outline" className="capitalize">{examData.pattern.replace("_", " ")}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              {creationMethod === "ai" ? <Sparkles className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
              {creationMethod === "ai" ? "AI Generated" : "PDF Upload"}
            </Badge>
            <span className="text-muted-foreground">|</span>
            <span>{examData.totalQuestions} Questions</span>
            <span className="text-muted-foreground">|</span>
            <span>{examData.totalMarks} Marks</span>
          </div>
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/superadmin/dashboard" },
          { label: "Exams", href: "/superadmin/exams" },
          { label: "Review" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => setPublishDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Publish Test
            </Button>
          </div>
        }
      />

      {/* Subject Tabs */}
      <Tabs value={activeSubject} onValueChange={handleSubjectChange}>
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
          {subjects.map((subject) => {
            const stats = getSubjectStats(subject);
            return (
              <TabsTrigger
                key={subject}
                value={subject}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {subject}
                <Badge variant="secondary" className="text-xs">
                  {stats.reviewed}/{stats.total}
                </Badge>
                {stats.deleted > 0 && (
                  <Badge variant="destructive" className="text-xs">{stats.deleted}</Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Quick Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Quick Navigation</span>
            <span className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * QUESTIONS_PER_PAGE + 1}-{Math.min(currentPage * QUESTIONS_PER_PAGE, subjectQuestions.length)} of {subjectQuestions.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {subjectQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentPage(Math.floor(idx / QUESTIONS_PER_PAGE) + 1)}
                className={cn(
                  "w-8 h-8 text-xs font-medium rounded border transition-colors",
                  getQuickNavColor(q.id),
                  idx >= (currentPage - 1) * QUESTIONS_PER_PAGE && idx < currentPage * QUESTIONS_PER_PAGE && "ring-2 ring-primary"
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {paginatedQuestions.map((question, idx) => {
          const state = questionStates[question.id];
          const globalIdx = (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1;
          const isDeleted = state?.status === "deleted";
          
          return (
            <Card key={question.id} className={cn(isDeleted && "opacity-50 border-destructive/50")}>
              <CardContent className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">Q{globalIdx}</span>
                    <Badge variant="outline">{question.type === "numerical" ? "Numerical" : "MCQ"}</Badge>
                    <Badge variant="secondary" className="capitalize">{question.difficulty}</Badge>
                    <span className="text-xs text-muted-foreground">{question.chapter} › {question.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(state?.status || "pending")}
                    <span className="text-xs text-muted-foreground capitalize">{state?.status || "pending"}</span>
                  </div>
                </div>
                
                {/* Question Text */}
                <p className="text-base mb-4">{state?.data?.questionText || question.questionText}</p>
                
                {/* Options or Answer */}
                {question.type !== "numerical" && question.options && (
                  <div className="space-y-2 mb-4">
                    {(state?.data?.options || question.options).map((opt, optIdx) => (
                      <div
                        key={opt.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border",
                          opt.isCorrect && "bg-green-500/10 border-green-500/30"
                        )}
                      >
                        <span className="font-medium">({String.fromCharCode(65 + optIdx)})</span>
                        <span>{opt.text}</span>
                        {opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />}
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === "numerical" && (
                  <div className="p-3 rounded-lg border bg-green-500/10 border-green-500/30 mb-4">
                    <span className="font-medium">Answer: </span>
                    <span>{state?.data?.numericalAnswer || question.numericalAnswer}</span>
                    {question.numericalTolerance && (
                      <span className="text-muted-foreground ml-2">(±{question.numericalTolerance})</span>
                    )}
                  </div>
                )}
                
                {/* Marks */}
                <div className="text-sm text-muted-foreground mb-4">
                  +{question.marks} / -{question.negativeMarks} marks
                </div>
                
                {/* Solution Toggle */}
                <button
                  onClick={() => toggleSolution(question.id)}
                  className="flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                >
                  {showSolution[question.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showSolution[question.id] ? "Hide Solution" : "Show Solution"}
                </button>
                
                {showSolution[question.id] && (
                  <div className="p-4 bg-muted/50 rounded-lg mb-4">
                    <p className="text-sm">{state?.data?.solution || question.solution}</p>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  {!isDeleted && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleEditQuestion(state?.data || question)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                      {state?.status === "pending" && (
                        <Button variant="ghost" size="sm" onClick={() => handleMarkReviewed(question.id)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Reviewed
                        </Button>
                      )}
                    </>
                  )}
                  {creationMethod === "ai" && isDeleted && (
                    <Button size="sm" onClick={() => handleRegenerateClick(question.id)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Modify the question details below.</DialogDescription>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div>
                <Label>Question Text</Label>
                <Textarea
                  value={editingQuestion.questionText}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                  rows={3}
                />
              </div>
              
              {editingQuestion.type !== "numerical" && editingQuestion.options && (
                <div className="space-y-2">
                  <Label>Options</Label>
                  {editingQuestion.options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="w-8">({String.fromCharCode(65 + idx)})</span>
                      <Input
                        value={opt.text}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options!];
                          newOptions[idx] = { ...opt, text: e.target.value };
                          setEditingQuestion({ ...editingQuestion, options: newOptions });
                        }}
                        className="flex-1"
                      />
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) => {
                            const newOptions = [...editingQuestion.options!];
                            newOptions[idx] = { ...opt, isCorrect: e.target.checked };
                            setEditingQuestion({ ...editingQuestion, options: newOptions });
                          }}
                        />
                        Correct
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              {editingQuestion.type === "numerical" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Answer</Label>
                    <Input
                      type="number"
                      value={editingQuestion.numericalAnswer}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, numericalAnswer: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Tolerance</Label>
                    <Input
                      type="number"
                      value={editingQuestion.numericalTolerance}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, numericalTolerance: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label>Solution</Label>
                <Textarea
                  value={editingQuestion.solution}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, solution: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    value={editingQuestion.marks}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, marks: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Negative Marks</Label>
                  <Input
                    type="number"
                    value={editingQuestion.negativeMarks}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, negativeMarks: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={editingQuestion.difficulty}
                    onValueChange={(v: "easy" | "medium" | "hard") => setEditingQuestion({ ...editingQuestion, difficulty: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Dialog */}
      <Dialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate Question</DialogTitle>
            <DialogDescription>Choose how to generate a replacement question.</DialogDescription>
          </DialogHeader>
          <RadioGroup value={regenerateOption} onValueChange={setRegenerateOption} className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="same_topic" id="same_topic" />
              <Label htmlFor="same_topic">Same topic, similar difficulty</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="harder" id="harder" />
              <Label htmlFor="harder">Same topic, harder question</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easier" id="easier" />
              <Label htmlFor="easier">Same topic, easier question</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="different" id="different" />
              <Label htmlFor="different">Different topic from same chapter</Label>
            </div>
          </RadioGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegenerateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRegenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Test</DialogTitle>
            <DialogDescription>Ready to publish "{examData.name}"?</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {subjects.map(subject => {
              const stats = getSubjectStats(subject);
              return (
                <div key={subject} className="flex items-center justify-between">
                  <span>{subject}</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.total - stats.deleted} questions {stats.deleted > 0 && `(${stats.deleted} deleted)`}
                  </span>
                </div>
              );
            })}
            <div className="pt-2 border-t mt-2">
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>{examData.totalQuestions} questions | {examData.totalMarks} marks | {examData.duration} min</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePublish}>Publish Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewExam;
