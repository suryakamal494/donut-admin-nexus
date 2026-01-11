// Test Session Data
// Mock data for active test session state management

import type { TestQuestion, QuestionStatus, TestSection } from "./testQuestions";
import { allSampleQuestions, sampleTestSections } from "./testQuestions";

export interface TestSessionQuestion {
  id: string;
  questionNumber: number;
  sectionId: string;
  subject: string;
  status: QuestionStatus;
  timeSpent: number; // seconds
  selectedAnswer?: string | string[] | number | Record<string, string>;
}

export interface TestSessionState {
  testId: string;
  testName: string;
  pattern: string;
  totalQuestions: number;
  totalMarks: number;
  totalDuration: number; // minutes
  remainingTime: number; // seconds
  sections: TestSection[];
  questions: TestQuestion[];
  sessionQuestions: TestSessionQuestion[];
  currentQuestionIndex: number;
  currentSectionId: string;
  startedAt: string;
  isSubmitted: boolean;
  allowBackNavigation: boolean;
  allowMarkForReview: boolean;
  showCalculator: boolean;
}

// Generate session questions from test questions
const generateSessionQuestions = (
  questions: TestQuestion[],
  sections: TestSection[]
): TestSessionQuestion[] => {
  let questionNumber = 1;
  const sessionQuestions: TestSessionQuestion[] = [];

  sections.forEach((section) => {
    const sectionQuestions = questions.filter((q) => q.subject === section.subject);
    sectionQuestions.forEach((q) => {
      sessionQuestions.push({
        id: q.id,
        questionNumber: questionNumber++,
        sectionId: section.id,
        subject: q.subject,
        status: "not_visited",
        timeSpent: 0,
      });
    });
  });

  return sessionQuestions;
};

// Sample active test session (JEE Main format)
export const sampleTestSession: TestSessionState = {
  testId: "gt-1",
  testName: "Grand Test #18",
  pattern: "jee_main",
  totalQuestions: 23, // Using our sample questions
  totalMarks: 92,
  totalDuration: 180,
  remainingTime: 180 * 60, // 3 hours in seconds
  sections: sampleTestSections,
  questions: allSampleQuestions,
  sessionQuestions: generateSessionQuestions(allSampleQuestions, sampleTestSections),
  currentQuestionIndex: 0,
  currentSectionId: "sec-phy",
  startedAt: new Date().toISOString(),
  isSubmitted: false,
  allowBackNavigation: true,
  allowMarkForReview: true,
  showCalculator: true,
};

// Helper: Get questions by section
export const getQuestionsBySection = (
  sessionQuestions: TestSessionQuestion[],
  sectionId: string
): TestSessionQuestion[] => {
  return sessionQuestions.filter((q) => q.sectionId === sectionId);
};

// Helper: Get section stats
export const getSectionStats = (
  sessionQuestions: TestSessionQuestion[],
  sectionId: string
) => {
  const sectionQs = getQuestionsBySection(sessionQuestions, sectionId);
  return {
    total: sectionQs.length,
    answered: sectionQs.filter((q) => q.status === "answered" || q.status === "answered_marked").length,
    notAnswered: sectionQs.filter((q) => q.status === "not_answered").length,
    marked: sectionQs.filter((q) => q.status === "marked_review" || q.status === "answered_marked").length,
    notVisited: sectionQs.filter((q) => q.status === "not_visited").length,
  };
};

// Helper: Get overall stats
export const getOverallStats = (sessionQuestions: TestSessionQuestion[]) => {
  return {
    total: sessionQuestions.length,
    answered: sessionQuestions.filter((q) => q.status === "answered" || q.status === "answered_marked").length,
    notAnswered: sessionQuestions.filter((q) => q.status === "not_answered").length,
    marked: sessionQuestions.filter((q) => q.status === "marked_review" || q.status === "answered_marked").length,
    notVisited: sessionQuestions.filter((q) => q.status === "not_visited").length,
  };
};

// Helper: Format time display
export const formatTimeDisplay = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

// Helper: Get time urgency
export const getTimeUrgency = (
  remainingSeconds: number,
  totalSeconds: number
): "normal" | "warning" | "danger" => {
  const percentRemaining = (remainingSeconds / totalSeconds) * 100;
  if (percentRemaining <= 5) return "danger";
  if (percentRemaining <= 15) return "warning";
  return "normal";
};
