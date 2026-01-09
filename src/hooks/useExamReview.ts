import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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

export const subjectLabels: Record<string, string> = {
  phy: "Physics",
  che: "Chemistry",
  mat: "Mathematics",
  bio: "Biology",
  eng: "English",
};

export const difficultyColors: Record<string, string> = {
  easy: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  hard: "bg-destructive/10 text-destructive",
};

export type QuestionStatus = "pending" | "reviewed" | "deleted" | "regenerating";

export interface QuestionState {
  status: QuestionStatus;
  editedText?: string;
  editedOptions?: string[];
}

export type Question = typeof mockQuestions[0];

export const useExamReview = () => {
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
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editText, setEditText] = useState("");
  const [editOptions, setEditOptions] = useState<string[]>([]);

  const subjects = [...new Set(mockQuestions.map(q => q.subject))];
  
  const filteredQuestions = activeSubject === "all" 
    ? mockQuestions 
    : mockQuestions.filter(q => q.subject === activeSubject);

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const stats = {
    total: mockQuestions.length,
    reviewed: Object.values(questionStates).filter(s => s.status === "reviewed").length,
    pending: Object.values(questionStates).filter(s => s.status === "pending").length,
    deleted: Object.values(questionStates).filter(s => s.status === "deleted").length,
  };

  const handlePublish = useCallback(() => {
    toast.success(`Exam published! ${stats.reviewed} questions reviewed, ${stats.deleted} deleted.`);
    navigate("/institute/exams");
  }, [navigate, stats]);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "deleted" }
    }));
    toast.success("Question deleted");
  }, []);

  const handleRestoreQuestion = useCallback((questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "pending" }
    }));
    toast.success("Question restored");
  }, []);

  const handleRegenerateQuestion = useCallback((questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "regenerating" }
    }));

    setTimeout(() => {
      setQuestionStates(prev => ({
        ...prev,
        [questionId]: { status: "pending" }
      }));
      toast.success("Question regenerated!");
    }, 2000);
  }, []);

  const handleMarkReviewed = useCallback((questionId: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], status: "reviewed" }
    }));
  }, []);

  const handleOpenEditDialog = useCallback((question: Question) => {
    setEditingQuestion(question);
    setEditText(question.text);
    setEditOptions([...question.options]);
    setEditDialogOpen(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
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
  }, [editingQuestion, editText, editOptions]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const previousPage = useCallback(() => {
    setCurrentPage(p => Math.max(1, p - 1));
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const changeSubject = useCallback((subject: string) => {
    setActiveSubject(subject);
    setCurrentPage(1);
  }, []);

  return {
    // Navigation
    navigate,
    examId,
    
    // Filtering
    activeSubject,
    changeSubject,
    subjects,
    
    // Pagination
    currentPage,
    totalPages,
    questionsPerPage,
    goToPage,
    previousPage,
    nextPage,
    
    // Questions
    mockQuestions,
    filteredQuestions,
    paginatedQuestions,
    questionStates,
    stats,
    
    // Edit dialog
    editDialogOpen,
    setEditDialogOpen,
    editingQuestion,
    editText,
    setEditText,
    editOptions,
    setEditOptions,
    
    // Actions
    handlePublish,
    handleDeleteQuestion,
    handleRestoreQuestion,
    handleRegenerateQuestion,
    handleMarkReviewed,
    handleOpenEditDialog,
    handleSaveEdit,
  };
};
