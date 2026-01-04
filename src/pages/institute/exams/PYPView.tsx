import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Clock, Award, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubjectBadge } from "@/components/subject/SubjectBadge";
import { mockPreviousYearPapers, examTypeLabels } from "@/data/examsData";

// Mock questions for PYP preview
const mockPYPQuestions = [
  { id: "q1", subject: "Physics", question: "A particle moves in a circle of radius R with constant speed v. The magnitude of average velocity in one complete revolution is:", options: ["v", "2v/π", "0", "v/2"], correctAnswer: 2, difficulty: "Medium" },
  { id: "q2", subject: "Physics", question: "The dimensional formula of impulse is same as that of:", options: ["Force", "Momentum", "Energy", "Work"], correctAnswer: 1, difficulty: "Easy" },
  { id: "q3", subject: "Physics", question: "A body of mass 2 kg is thrown vertically upwards with kinetic energy of 490 J. The height at which the kinetic energy becomes half is:", options: ["12.5 m", "25 m", "50 m", "100 m"], correctAnswer: 0, difficulty: "Medium" },
  { id: "q4", subject: "Chemistry", question: "Which of the following is the strongest acid?", options: ["HF", "HCl", "HBr", "HI"], correctAnswer: 3, difficulty: "Easy" },
  { id: "q5", subject: "Chemistry", question: "The hybridization of carbon in diamond is:", options: ["sp", "sp²", "sp³", "dsp²"], correctAnswer: 2, difficulty: "Easy" },
  { id: "q6", subject: "Chemistry", question: "Which of the following has the highest ionization energy?", options: ["Na", "Mg", "Al", "Si"], correctAnswer: 1, difficulty: "Medium" },
  { id: "q7", subject: "Mathematics", question: "If f(x) = x³ - 3x² + 3x - 1, then f'(1) equals:", options: ["0", "1", "2", "3"], correctAnswer: 0, difficulty: "Easy" },
  { id: "q8", subject: "Mathematics", question: "The value of ∫₀^π sin²x dx is:", options: ["0", "π/4", "π/2", "π"], correctAnswer: 2, difficulty: "Medium" },
  { id: "q9", subject: "Mathematics", question: "The number of solutions of the equation tan x = x in [0, 2π] is:", options: ["1", "2", "3", "4"], correctAnswer: 2, difficulty: "Hard" },
  { id: "q10", subject: "Biology", question: "The powerhouse of the cell is:", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], correctAnswer: 2, difficulty: "Easy" },
];

const QUESTIONS_PER_PAGE = 5;

const PYPView = () => {
  const navigate = useNavigate();
  const { paperId } = useParams();
  const [activeSubject, setActiveSubject] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Find the paper
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

  // Filter questions by subject
  const filteredQuestions = activeSubject === "all" 
    ? mockPYPQuestions 
    : mockPYPQuestions.filter(q => q.subject === activeSubject);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  const subjects = [...new Set(mockPYPQuestions.map(q => q.subject))];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={paper.name}
        description={paper.session || `${examTypeLabels[paper.examType]} - ${paper.year}`}
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
                  <h3 className="font-semibold text-foreground">{examTypeLabels[paper.examType]}</h3>
                  <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                    <Lock className="w-3 h-3" />
                    Read Only
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
      <Tabs value={activeSubject} onValueChange={(val) => { setActiveSubject(val); setCurrentPage(1); }}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Subjects</TabsTrigger>
          {subjects.map((subject) => (
            <TabsTrigger key={subject} value={subject}>{subject}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeSubject} className="space-y-4">
          {/* Question Cards */}
          {paginatedQuestions.map((question, index) => {
            const questionNumber = (currentPage - 1) * QUESTIONS_PER_PAGE + index + 1;
            return (
              <Card key={question.id} className="overflow-hidden">
                <CardContent className="p-5">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {questionNumber}
                      </div>
                      <SubjectBadge subject={question.subject} size="xs" />
                      <Badge variant="outline" className="text-xs">
                        {question.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-foreground mb-4 leading-relaxed">{question.question}</p>

                  {/* Options */}
                  <div className="grid sm:grid-cols-2 gap-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg border text-sm ${
                          optIndex === question.correctAnswer
                            ? "border-success bg-success/10 text-success"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(65 + optIndex)}.
                        </span>
                        {option}
                        {optIndex === question.correctAnswer && (
                          <Badge className="ml-2 bg-success text-success-foreground text-xs">
                            Correct
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

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
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * QUESTIONS_PER_PAGE + 1} - {Math.min(currentPage * QUESTIONS_PER_PAGE, filteredQuestions.length)} of {filteredQuestions.length} questions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PYPView;
