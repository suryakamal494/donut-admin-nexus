import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Clock, Award, Lock, ChevronLeft, ChevronRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubjectBadge } from "@/components/subject/SubjectBadge";
import { mockPreviousYearPapers, examTypeLabels } from "@/data/examsData";
import { samplePYPForReview, ExamQuestion } from "@/data/examQuestionsData";
import { cn } from "@/lib/utils";

const QUESTIONS_PER_PAGE = 5;

const PYPView = () => {
  const navigate = useNavigate();
  const { paperId } = useParams();
  
  // Use rich mock data from examQuestionsData
  const examData = samplePYPForReview;
  const subjects = examData.subjects;
  
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  // Find the paper for metadata
  const paper = mockPreviousYearPapers.find(p => p.id === paperId);

  if (!paper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Paper not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/institute/exams/previous-year-papers")}>
          Back to Papers
        </Button>
      </div>
    );
  }

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
    return { total: qs.length };
  };

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
    setCurrentPage(1);
  };

  const toggleSolution = (questionId: string) => {
    setShowSolution(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Quick nav color - view only mode uses neutral colors
  const getQuickNavColor = (questionId: string, idx: number) => {
    const isCurrentPage = idx >= (currentPage - 1) * QUESTIONS_PER_PAGE && idx < currentPage * QUESTIONS_PER_PAGE;
    return cn(
      "bg-muted hover:bg-muted/80",
      isCurrentPage && "ring-2 ring-primary"
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={paper.name}
        description={
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline">{examTypeLabels[paper.examType]}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Read Only
            </Badge>
            <span className="text-muted-foreground">|</span>
            <span>{examData.totalQuestions} Questions</span>
            <span className="text-muted-foreground">|</span>
            <span>{examData.totalMarks} Marks</span>
            <span className="text-muted-foreground">|</span>
            <span>{examData.duration} mins</span>
          </div>
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/institute/dashboard" },
          { label: "Exams", href: "/institute/exams" },
          { label: "Previous Year Papers", href: "/institute/exams/previous-year-papers" },
          { label: paper.name },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate("/institute/exams/previous-year-papers")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        }
      />

      {/* Paper Info Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{paper.session || `${paper.year} Session`}</h3>
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Lock className="w-3 h-3" />
                    Super Admin
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {paper.totalQuestions} Questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {paper.totalMarks} Marks
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {paper.duration} minutes
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {paper.subjects.map((subject) => (
                <SubjectBadge key={subject} subject={subject} size="sm" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
                  {stats.total}
                </Badge>
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
                  getQuickNavColor(q.id, idx)
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
          const globalIdx = (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1;
          
          return (
            <Card key={question.id}>
              <CardContent className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">Q{globalIdx}</span>
                    <Badge variant="outline">{question.type === "numerical" ? "Numerical" : "MCQ"}</Badge>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "capitalize",
                        question.difficulty === "easy" && "bg-green-500/20 text-green-700",
                        question.difficulty === "medium" && "bg-yellow-500/20 text-yellow-700",
                        question.difficulty === "hard" && "bg-red-500/20 text-red-700"
                      )}
                    >
                      {question.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{question.chapter} › {question.topic}</span>
                  </div>
                </div>
                
                {/* Question Text */}
                <p className="text-base mb-4">{question.questionText}</p>
                
                {/* Options or Answer */}
                {question.type !== "numerical" && question.options && (
                  <div className="space-y-2 mb-4">
                    {question.options.map((opt, optIdx) => (
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
                    <span>{question.numericalAnswer}</span>
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
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  {showSolution[question.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showSolution[question.id] ? "Hide Solution" : "Show Solution"}
                </button>
                
                {showSolution[question.id] && (
                  <div className="p-4 bg-muted/50 rounded-lg mt-4">
                    <p className="text-sm">{question.solution}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {paginatedQuestions.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No questions found for this subject</p>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
};

export default PYPView;
