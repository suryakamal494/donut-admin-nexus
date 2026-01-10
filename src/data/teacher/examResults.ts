// Exam Results Mock Data for Analytics

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  score: number;
  maxScore: number;
  percentage: number;
  rank: number;
  timeTaken: number; // in minutes
  submittedAt: string;
  questionWiseResults: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  questionNumber: number;
  isCorrect: boolean | null; // null = unattempted
  marksObtained: number;
  maxMarks: number;
  timeTaken: number; // in seconds
}

export interface ExamAnalytics {
  examId: string;
  examName: string;
  totalStudents: number;
  attemptedCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageTime: number;
  passPercentage: number;
  scoreDistribution: ScoreRange[];
  questionAnalysis: QuestionAnalysis[];
  batchComparison: BatchStats[];
  topPerformers: StudentResult[];
}

export interface ScoreRange {
  range: string;
  count: number;
  percentage: number;
}

export interface QuestionAnalysis {
  questionId: string;
  questionNumber: number;
  subject: string;
  topic: string;
  correctAttempts: number;
  incorrectAttempts: number;
  unattempted: number;
  averageTime: number;
  successRate: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BatchStats {
  batchId: string;
  batchName: string;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
  attemptedCount: number;
  totalStudents: number;
}

// Generate mock student results
const generateStudentResults = (count: number, maxScore: number): StudentResult[] => {
  const results: StudentResult[] = [];
  const names = [
    "Aarav Sharma", "Priya Patel", "Rohan Kumar", "Sneha Singh", "Arjun Reddy",
    "Ananya Gupta", "Vikram Joshi", "Ishita Verma", "Karan Malhotra", "Meera Nair",
    "Aditya Rao", "Kavya Iyer", "Nikhil Tiwari", "Pooja Mehta", "Siddharth Kapoor",
    "Tanvi Desai", "Rahul Chauhan", "Shreya Agarwal", "Dev Saxena", "Riya Mishra",
    "Aryan Bhatt", "Diya Chandra", "Varun Sinha", "Nisha Prakash", "Yash Goel",
  ];

  for (let i = 0; i < count; i++) {
    const score = Math.floor(Math.random() * (maxScore * 0.6)) + Math.floor(maxScore * 0.3);
    const timeTaken = Math.floor(Math.random() * 30) + 30;
    
    results.push({
      id: `result-${i + 1}`,
      studentId: `student-${i + 1}`,
      studentName: names[i % names.length],
      rollNumber: `2024${String(i + 1).padStart(3, '0')}`,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      rank: 0, // Will be assigned after sorting
      timeTaken,
      submittedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      questionWiseResults: [],
    });
  }

  // Sort by score and assign ranks
  results.sort((a, b) => b.score - a.score);
  results.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return results;
};

// Mock exam analytics data
export const examAnalyticsData: Record<string, ExamAnalytics> = {
  "exam-3": {
    examId: "exam-3",
    examName: "Optics Chapter Quiz",
    totalStudents: 25,
    attemptedCount: 24,
    averageScore: 28,
    highestScore: 38,
    lowestScore: 16,
    averageTime: 12,
    passPercentage: 72,
    scoreDistribution: [
      { range: "0-10", count: 1, percentage: 4 },
      { range: "11-20", count: 3, percentage: 12 },
      { range: "21-30", count: 10, percentage: 40 },
      { range: "31-40", count: 10, percentage: 40 },
    ],
    questionAnalysis: [
      { questionId: "q1", questionNumber: 1, subject: "Physics", topic: "Reflection", correctAttempts: 20, incorrectAttempts: 4, unattempted: 1, averageTime: 45, successRate: 80, difficulty: 'easy' },
      { questionId: "q2", questionNumber: 2, subject: "Physics", topic: "Refraction", correctAttempts: 18, incorrectAttempts: 5, unattempted: 2, averageTime: 60, successRate: 72, difficulty: 'easy' },
      { questionId: "q3", questionNumber: 3, subject: "Physics", topic: "Lenses", correctAttempts: 15, incorrectAttempts: 8, unattempted: 2, averageTime: 75, successRate: 60, difficulty: 'medium' },
      { questionId: "q4", questionNumber: 4, subject: "Physics", topic: "Mirrors", correctAttempts: 12, incorrectAttempts: 10, unattempted: 3, averageTime: 90, successRate: 48, difficulty: 'medium' },
      { questionId: "q5", questionNumber: 5, subject: "Physics", topic: "Optical Instruments", correctAttempts: 8, incorrectAttempts: 12, unattempted: 5, averageTime: 100, successRate: 32, difficulty: 'hard' },
      { questionId: "q6", questionNumber: 6, subject: "Physics", topic: "Wave Optics", correctAttempts: 14, incorrectAttempts: 8, unattempted: 3, averageTime: 80, successRate: 56, difficulty: 'medium' },
      { questionId: "q7", questionNumber: 7, subject: "Physics", topic: "Interference", correctAttempts: 6, incorrectAttempts: 14, unattempted: 5, averageTime: 110, successRate: 24, difficulty: 'hard' },
      { questionId: "q8", questionNumber: 8, subject: "Physics", topic: "Diffraction", correctAttempts: 10, incorrectAttempts: 11, unattempted: 4, averageTime: 95, successRate: 40, difficulty: 'hard' },
      { questionId: "q9", questionNumber: 9, subject: "Physics", topic: "Polarization", correctAttempts: 16, incorrectAttempts: 6, unattempted: 3, averageTime: 65, successRate: 64, difficulty: 'medium' },
      { questionId: "q10", questionNumber: 10, subject: "Physics", topic: "TIR", correctAttempts: 19, incorrectAttempts: 4, unattempted: 2, averageTime: 50, successRate: 76, difficulty: 'easy' },
    ],
    batchComparison: [
      { batchId: "batch-10a", batchName: "Class 10-A", averageScore: 28, highestScore: 38, lowestScore: 16, passPercentage: 72, attemptedCount: 24, totalStudents: 25 },
    ],
    topPerformers: generateStudentResults(10, 40).slice(0, 5),
  },
};

// Helper function to get exam analytics
export const getExamAnalytics = (examId: string): ExamAnalytics | null => {
  return examAnalyticsData[examId] || null;
};

// Generate analytics for any exam (for demo purposes)
export const generateExamAnalytics = (examId: string, examName: string, totalMarks: number): ExamAnalytics => {
  const totalStudents = Math.floor(Math.random() * 20) + 20;
  const attemptedCount = totalStudents - Math.floor(Math.random() * 3);
  const results = generateStudentResults(attemptedCount, totalMarks);
  
  const scores = results.map(r => r.score);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const highestScore = Math.max(...scores);
  const lowestScore = Math.min(...scores);
  const passingScore = totalMarks * 0.4;
  const passCount = results.filter(r => r.score >= passingScore).length;

  // Generate score distribution
  const ranges = [
    { min: 0, max: totalMarks * 0.25 },
    { min: totalMarks * 0.25, max: totalMarks * 0.5 },
    { min: totalMarks * 0.5, max: totalMarks * 0.75 },
    { min: totalMarks * 0.75, max: totalMarks },
  ];

  const scoreDistribution = ranges.map((range, idx) => {
    const count = results.filter(r => r.score >= range.min && r.score < range.max).length;
    return {
      range: `${Math.round(range.min)}-${Math.round(range.max)}`,
      count,
      percentage: Math.round((count / attemptedCount) * 100),
    };
  });

  return {
    examId,
    examName,
    totalStudents,
    attemptedCount,
    averageScore,
    highestScore,
    lowestScore,
    averageTime: Math.floor(Math.random() * 30) + 30,
    passPercentage: Math.round((passCount / attemptedCount) * 100),
    scoreDistribution,
    questionAnalysis: [],
    batchComparison: [],
    topPerformers: results.slice(0, 5),
  };
};
