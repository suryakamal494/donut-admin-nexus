// Student Lesson Bundles Data - Content from teacher lesson plans

export type ContentType = "video" | "pdf" | "quiz" | "simulation" | "document" | "screenshot";

export interface BundleContentSummary {
  type: ContentType;
  count: number;
}

export interface LessonBundle {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  date: string;
  teacherName: string;
  teacherAvatar?: string;
  contentSummary: BundleContentSummary[];
  isViewed: boolean;
  hasScreenshots: boolean;
}

export interface HomeworkItem {
  id: string;
  chapterId: string;
  title: string;
  dueDate: string;
  linkedSessionId?: string;
  linkedSessionTitle?: string;
  isCompleted: boolean;
  isStarted: boolean;
  questionsCount: number;
}

export interface AIPathItem {
  id: string;
  chapterId: string;
  title: string;
  priority: "high" | "medium" | "low";
  description: string;
  estimatedTime: string;
  isCompleted: boolean;
}

export interface ChallengeItem {
  id: string;
  chapterId: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  topPercentileScore: number;
  isCompleted: boolean;
  userScore?: number;
}

// Mock lesson bundles
export const lessonBundles: LessonBundle[] = [
  // Math - Quadratic Equations
  {
    id: "bundle-1",
    chapterId: "math-ch3",
    title: "Introduction to Quadratics",
    description: "Understanding the standard form ax² + bx + c = 0",
    date: "2026-01-08",
    teacherName: "Mr. Sharma",
    contentSummary: [
      { type: "video", count: 2 },
      { type: "pdf", count: 1 },
      { type: "quiz", count: 1 },
    ],
    isViewed: true,
    hasScreenshots: true,
  },
  {
    id: "bundle-2",
    chapterId: "math-ch3",
    title: "Solving by Factoring",
    description: "Factorization method for quadratic equations",
    date: "2026-01-10",
    teacherName: "Mr. Sharma",
    contentSummary: [
      { type: "video", count: 3 },
      { type: "simulation", count: 1 },
    ],
    isViewed: true,
    hasScreenshots: false,
  },
  {
    id: "bundle-3",
    chapterId: "math-ch3",
    title: "Quadratic Formula",
    description: "Using the quadratic formula for all cases",
    date: "2026-01-12",
    teacherName: "Mr. Sharma",
    contentSummary: [
      { type: "video", count: 1 },
      { type: "pdf", count: 2 },
      { type: "quiz", count: 1 },
    ],
    isViewed: false,
    hasScreenshots: false,
  },
  // Physics - Force and Laws of Motion
  {
    id: "bundle-4",
    chapterId: "physics-ch2",
    title: "Newton's First Law",
    description: "Understanding inertia and balanced forces",
    date: "2026-01-07",
    teacherName: "Ms. Gupta",
    contentSummary: [
      { type: "video", count: 2 },
      { type: "pdf", count: 1 },
    ],
    isViewed: true,
    hasScreenshots: true,
  },
  {
    id: "bundle-5",
    chapterId: "physics-ch2",
    title: "Newton's Second Law",
    description: "F = ma and its applications",
    date: "2026-01-09",
    teacherName: "Ms. Gupta",
    contentSummary: [
      { type: "video", count: 3 },
      { type: "simulation", count: 2 },
      { type: "quiz", count: 1 },
    ],
    isViewed: false,
    hasScreenshots: false,
  },
];

// Mock homework items
export const homeworkItems: HomeworkItem[] = [
  {
    id: "hw-1",
    chapterId: "math-ch3",
    title: "Factoring Practice Problems",
    dueDate: "2026-01-13",
    linkedSessionId: "bundle-2",
    linkedSessionTitle: "Solving by Factoring",
    isCompleted: false,
    isStarted: true,
    questionsCount: 10,
  },
  {
    id: "hw-2",
    chapterId: "math-ch3",
    title: "Quadratic Formula Worksheet",
    dueDate: "2026-01-15",
    isCompleted: false,
    isStarted: false,
    questionsCount: 8,
  },
  {
    id: "hw-3",
    chapterId: "physics-ch2",
    title: "Force Calculations",
    dueDate: "2026-01-12",
    linkedSessionId: "bundle-5",
    linkedSessionTitle: "Newton's Second Law",
    isCompleted: false,
    isStarted: false,
    questionsCount: 12,
  },
];

// Mock AI path items
export const aiPathItems: AIPathItem[] = [
  {
    id: "ai-1",
    chapterId: "math-ch3",
    title: "Factoring Quadratics",
    priority: "high",
    description: "Struggling with identifying factors. Practice targeted exercises.",
    estimatedTime: "20 min",
    isCompleted: false,
  },
  {
    id: "ai-2",
    chapterId: "math-ch3",
    title: "Completing the Square",
    priority: "medium",
    description: "Review alternate method for solving quadratics.",
    estimatedTime: "15 min",
    isCompleted: true,
  },
  {
    id: "ai-3",
    chapterId: "physics-ch2",
    title: "Force Diagrams",
    priority: "high",
    description: "Need practice drawing free body diagrams correctly.",
    estimatedTime: "25 min",
    isCompleted: false,
  },
];

// Mock challenge items
export const challengeItems: ChallengeItem[] = [
  {
    id: "challenge-1",
    chapterId: "math-ch3",
    title: "Speed Factoring",
    difficulty: "easy",
    points: 50,
    topPercentileScore: 45,
    isCompleted: false,
  },
  {
    id: "challenge-2",
    chapterId: "math-ch3",
    title: "Quadratic Master",
    difficulty: "medium",
    points: 100,
    topPercentileScore: 85,
    isCompleted: false,
  },
  {
    id: "challenge-3",
    chapterId: "math-ch3",
    title: "Complex Roots Challenge",
    difficulty: "hard",
    points: 200,
    topPercentileScore: 175,
    isCompleted: false,
  },
  {
    id: "challenge-4",
    chapterId: "physics-ch2",
    title: "Force Fundamentals",
    difficulty: "easy",
    points: 50,
    topPercentileScore: 48,
    isCompleted: true,
    userScore: 42,
  },
];

// Helper functions
export const getLessonBundlesByChapter = (chapterId: string): LessonBundle[] => {
  return lessonBundles.filter(b => b.chapterId === chapterId);
};

export const getHomeworkByChapter = (chapterId: string): HomeworkItem[] => {
  return homeworkItems.filter(h => h.chapterId === chapterId);
};

export const getAIPathByChapter = (chapterId: string): AIPathItem[] => {
  return aiPathItems.filter(a => a.chapterId === chapterId);
};

export const getChallengesByChapter = (chapterId: string): ChallengeItem[] => {
  return challengeItems.filter(c => c.chapterId === chapterId);
};
