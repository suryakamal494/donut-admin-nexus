// Student Test Player Page
// Full-screen test execution environment
// Mobile-first with no bottom navigation

import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  TestPlayerHeader,
  QuestionDisplay,
  QuestionNavigation,
  QuestionPalette,
  TestSubmitDialog,
} from "@/components/student/tests/player";
import type { AnswerValue } from "@/components/student/tests/player/QuestionDisplay";
import {
  sampleTestSession,
  getQuestionsBySection,
} from "@/data/student/testSession";
import type { QuestionStatus } from "@/data/student/testQuestions";

const StudentTestPlayer = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();

  // Test session state
  const [session, setSession] = useState(sampleTestSession);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSectionId, setCurrentSectionId] = useState(
    session.sections[0]?.id || ""
  );
  const [remainingTime, setRemainingTime] = useState(session.remainingTime);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  // Current question
  const currentSessionQuestion = session.sessionQuestions[currentQuestionIndex];
  const currentQuestion = session.questions.find(
    (q) => q.id === currentSessionQuestion?.id
  );

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit on time expiry
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mark current question as visited
  useEffect(() => {
    if (currentSessionQuestion?.status === "not_visited") {
      updateQuestionStatus(currentQuestionIndex, "not_answered");
    }
  }, [currentQuestionIndex]);

  // Update question status
  const updateQuestionStatus = useCallback(
    (index: number, status: QuestionStatus) => {
      setSession((prev) => ({
        ...prev,
        sessionQuestions: prev.sessionQuestions.map((q, i) =>
          i === index ? { ...q, status } : q
        ),
      }));
    },
    []
  );

  // Answer change handler
  const handleAnswerChange = useCallback(
    (questionId: string, answer: AnswerValue) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
      
      // Update question status to answered
      const questionIndex = session.sessionQuestions.findIndex(
        (q) => q.id === questionId
      );
      if (questionIndex !== -1) {
        const currentStatus = session.sessionQuestions[questionIndex].status;
        if (currentStatus === "not_answered" || currentStatus === "not_visited") {
          updateQuestionStatus(questionIndex, "answered");
        } else if (currentStatus === "marked_review") {
          updateQuestionStatus(questionIndex, "answered_marked");
        }
      }
    },
    [session.sessionQuestions, updateQuestionStatus]
  );

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0 && session.allowBackNavigation) {
      setCurrentQuestionIndex((prev) => prev - 1);
      // Update section if needed
      const prevQuestion = session.sessionQuestions[currentQuestionIndex - 1];
      if (prevQuestion && prevQuestion.sectionId !== currentSectionId) {
        setCurrentSectionId(prevQuestion.sectionId);
      }
    }
  }, [currentQuestionIndex, session.allowBackNavigation, currentSectionId]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < session.sessionQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      // Update section if needed
      const nextQuestion = session.sessionQuestions[currentQuestionIndex + 1];
      if (nextQuestion && nextQuestion.sectionId !== currentSectionId) {
        setCurrentSectionId(nextQuestion.sectionId);
      }
    }
  }, [currentQuestionIndex, session.sessionQuestions.length, currentSectionId]);

  const handleQuestionSelect = useCallback(
    (index: number) => {
      setCurrentQuestionIndex(index);
      const selectedQuestion = session.sessionQuestions[index];
      if (selectedQuestion && selectedQuestion.sectionId !== currentSectionId) {
        setCurrentSectionId(selectedQuestion.sectionId);
      }
    },
    [currentSectionId, session.sessionQuestions]
  );

  const handleSectionChange = useCallback(
    (sectionId: string) => {
      setCurrentSectionId(sectionId);
      // Jump to first question of the section
      const sectionQuestions = getQuestionsBySection(
        session.sessionQuestions,
        sectionId
      );
      if (sectionQuestions.length > 0) {
        const firstQuestion = sectionQuestions[0];
        const globalIndex = session.sessionQuestions.findIndex(
          (q) => q.id === firstQuestion.id
        );
        if (globalIndex !== -1) {
          setCurrentQuestionIndex(globalIndex);
        }
      }
    },
    [session.sessionQuestions]
  );

  // Mark for review
  const handleMarkForReview = useCallback(() => {
    const currentStatus = currentSessionQuestion?.status;
    let newStatus: QuestionStatus;

    if (currentStatus === "answered") {
      newStatus = "answered_marked";
    } else if (currentStatus === "answered_marked") {
      newStatus = "answered";
    } else if (currentStatus === "marked_review") {
      newStatus = "not_answered";
    } else {
      newStatus = "marked_review";
    }

    updateQuestionStatus(currentQuestionIndex, newStatus);
  }, [currentQuestionIndex, currentSessionQuestion?.status, updateQuestionStatus]);

  // Clear response - removes answer and updates status
  const handleClearResponse = useCallback(() => {
    if (!currentQuestion) return;
    
    const currentStatus = currentSessionQuestion?.status;
    const hasCurrentAnswer = answers[currentQuestion.id] !== undefined;
    
    if (hasCurrentAnswer || currentStatus === "answered" || currentStatus === "answered_marked") {
      // Remove the answer
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[currentQuestion.id];
        return newAnswers;
      });
      
      // Update status
      updateQuestionStatus(
        currentQuestionIndex,
        currentStatus === "answered_marked" ? "marked_review" : "not_answered"
      );
    }
  }, [currentQuestionIndex, currentSessionQuestion?.status, currentQuestion, answers, updateQuestionStatus]);

  // Submit test
  const handleSubmitTest = useCallback(() => {
    console.log("Test submitted!", session.sessionQuestions);
    navigate("/student/tests");
  }, [navigate, session.sessionQuestions]);

  // Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  // Exit test
  const handleExit = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to exit? Your progress will be saved."
      )
    ) {
      navigate("/student/tests");
    }
  }, [navigate]);

  // Check if current question has answer (use actual answers state)
  const hasAnswer = useMemo(() => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    
    // Check based on answer type
    if (answer === undefined || answer === null) return false;
    if (typeof answer === "string" && answer.trim() === "") return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    if (typeof answer === "object" && !Array.isArray(answer) && Object.keys(answer).length === 0) return false;
    
    return true;
  }, [currentQuestion, answers]);

  // Check if current question is marked
  const isMarked = useMemo(() => {
    const status = currentSessionQuestion?.status;
    return status === "marked_review" || status === "answered_marked";
  }, [currentSessionQuestion?.status]);

  if (!currentQuestion || !currentSessionQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading test...</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Header with Timer & Subject Tabs */}
      <TestPlayerHeader
        testName={session.testName}
        sections={session.sections}
        currentSectionId={currentSectionId}
        sessionQuestions={session.sessionQuestions}
        remainingTime={remainingTime}
        totalDuration={session.totalDuration}
        showCalculator={session.showCalculator}
        isFullscreen={isFullscreen}
        onSectionChange={handleSectionChange}
        onToggleCalculator={() => setIsCalculatorOpen(!isCalculatorOpen)}
        onToggleFullscreen={handleToggleFullscreen}
        onExit={handleExit}
      />

      {/* Main Content: Question + Palette (Desktop) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Display */}
        <QuestionDisplay
          question={currentQuestion}
          questionNumber={currentSessionQuestion.questionNumber}
          totalQuestions={session.sessionQuestions.length}
          answer={answers[currentQuestion.id]}
          onAnswerChange={handleAnswerChange}
          className="flex-1"
        />

        {/* Desktop Palette (always visible) */}
        <QuestionPalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          sections={session.sections}
          sessionQuestions={session.sessionQuestions}
          currentQuestionIndex={currentQuestionIndex}
          currentSectionId={currentSectionId}
          onQuestionSelect={handleQuestionSelect}
          onSectionChange={handleSectionChange}
        />
      </div>

      {/* Navigation Controls */}
      <QuestionNavigation
        currentIndex={currentQuestionIndex}
        totalQuestions={session.sessionQuestions.length}
        questionStatus={currentSessionQuestion.status}
        isMarked={isMarked}
        hasAnswer={hasAnswer}
        allowBackNavigation={session.allowBackNavigation}
        allowMarkForReview={session.allowMarkForReview}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onMarkForReview={handleMarkForReview}
        onClearResponse={handleClearResponse}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onSubmit={() => setIsSubmitDialogOpen(true)}
      />

      {/* Submit Confirmation Dialog */}
      <TestSubmitDialog
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
        onConfirm={handleSubmitTest}
        sessionQuestions={session.sessionQuestions}
        testName={session.testName}
      />
    </div>
  );
};

export default StudentTestPlayer;
