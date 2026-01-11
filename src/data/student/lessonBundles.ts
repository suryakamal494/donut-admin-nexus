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

// Detailed content item within a bundle
export interface BundleContentItem {
  id: string;
  bundleId: string;
  type: ContentType;
  title: string;
  description?: string;
  duration?: string; // For videos
  pageCount?: number; // For PDFs
  questionCount?: number; // For quizzes
  thumbnailUrl?: string;
  isCompleted: boolean;
  order: number;
}

// Teacher screenshot/annotation from presentation mode
export interface TeacherScreenshot {
  id: string;
  bundleId: string;
  title: string;
  description?: string;
  timestamp: string;
  thumbnailUrl?: string;
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

// ============================================
// MOCK DATA - Lesson Bundles
// ============================================

export const lessonBundles: LessonBundle[] = [
  // Math - Quadratic Equations (math-ch3)
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
  // Math - Number Systems (math-ch1)
  {
    id: "bundle-6",
    chapterId: "math-ch1",
    title: "Real Numbers Introduction",
    description: "Understanding rational and irrational numbers",
    date: "2025-12-15",
    teacherName: "Mr. Sharma",
    contentSummary: [
      { type: "video", count: 2 },
      { type: "pdf", count: 1 },
    ],
    isViewed: true,
    hasScreenshots: true,
  },
  {
    id: "bundle-7",
    chapterId: "math-ch1",
    title: "Properties of Real Numbers",
    description: "Closure, commutative, associative properties",
    date: "2025-12-17",
    teacherName: "Mr. Sharma",
    contentSummary: [
      { type: "video", count: 1 },
      { type: "pdf", count: 2 },
      { type: "quiz", count: 1 },
    ],
    isViewed: true,
    hasScreenshots: true,
  },
  {
    id: "bundle-8",
    chapterId: "math-ch1",
    title: "Decimal Expansions",
    description: "Terminating and non-terminating decimals",
    date: "2025-12-19",
    teacherName: "Mr. Sharma",
    contentSummary: [
      { type: "video", count: 2 },
      { type: "simulation", count: 1 },
      { type: "quiz", count: 1 },
    ],
    isViewed: true,
    hasScreenshots: false,
  },
  // Physics - Force and Laws of Motion (physics-ch2)
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

// ============================================
// MOCK DATA - Bundle Content Items (detailed content)
// ============================================

export const bundleContentItems: BundleContentItem[] = [
  // Bundle 1: Introduction to Quadratics
  {
    id: "content-1-1",
    bundleId: "bundle-1",
    type: "video",
    title: "What is a Quadratic Equation?",
    description: "Introduction to the concept and standard form",
    duration: "12:45",
    order: 1,
    isCompleted: true,
  },
  {
    id: "content-1-2",
    bundleId: "bundle-1",
    type: "video",
    title: "Identifying Coefficients a, b, and c",
    description: "Practice identifying parts of quadratic equations",
    duration: "8:30",
    order: 2,
    isCompleted: true,
  },
  {
    id: "content-1-3",
    bundleId: "bundle-1",
    type: "pdf",
    title: "Quadratic Equations - Study Notes",
    description: "Comprehensive notes with examples",
    pageCount: 12,
    order: 3,
    isCompleted: true,
  },
  {
    id: "content-1-4",
    bundleId: "bundle-1",
    type: "quiz",
    title: "Quick Check: Quadratic Basics",
    description: "Test your understanding of the basics",
    questionCount: 5,
    order: 4,
    isCompleted: false,
  },

  // Bundle 2: Solving by Factoring
  {
    id: "content-2-1",
    bundleId: "bundle-2",
    type: "video",
    title: "Introduction to Factoring",
    description: "Understanding the factoring method",
    duration: "15:20",
    order: 1,
    isCompleted: true,
  },
  {
    id: "content-2-2",
    bundleId: "bundle-2",
    type: "video",
    title: "Factoring when a = 1",
    description: "Simple cases of factorization",
    duration: "11:15",
    order: 2,
    isCompleted: true,
  },
  {
    id: "content-2-3",
    bundleId: "bundle-2",
    type: "video",
    title: "Factoring when a ≠ 1",
    description: "Advanced factorization techniques",
    duration: "18:40",
    order: 3,
    isCompleted: false,
  },
  {
    id: "content-2-4",
    bundleId: "bundle-2",
    type: "simulation",
    title: "Interactive Factoring Tool",
    description: "Practice factoring with instant feedback",
    order: 4,
    isCompleted: false,
  },

  // Bundle 3: Quadratic Formula
  {
    id: "content-3-1",
    bundleId: "bundle-3",
    type: "video",
    title: "Deriving the Quadratic Formula",
    description: "Understanding where the formula comes from",
    duration: "20:15",
    order: 1,
    isCompleted: false,
  },
  {
    id: "content-3-2",
    bundleId: "bundle-3",
    type: "pdf",
    title: "Quadratic Formula Cheat Sheet",
    description: "Quick reference guide",
    pageCount: 4,
    order: 2,
    isCompleted: false,
  },
  {
    id: "content-3-3",
    bundleId: "bundle-3",
    type: "pdf",
    title: "Practice Problems - Formula Method",
    description: "20 solved examples",
    pageCount: 8,
    order: 3,
    isCompleted: false,
  },
  {
    id: "content-3-4",
    bundleId: "bundle-3",
    type: "quiz",
    title: "Formula Application Quiz",
    description: "Apply the quadratic formula",
    questionCount: 8,
    order: 4,
    isCompleted: false,
  },

  // Bundle 6: Real Numbers Introduction
  {
    id: "content-6-1",
    bundleId: "bundle-6",
    type: "video",
    title: "What are Real Numbers?",
    description: "Understanding the number system hierarchy",
    duration: "14:30",
    order: 1,
    isCompleted: true,
  },
  {
    id: "content-6-2",
    bundleId: "bundle-6",
    type: "video",
    title: "Rational vs Irrational Numbers",
    description: "Key differences with examples",
    duration: "11:45",
    order: 2,
    isCompleted: true,
  },
  {
    id: "content-6-3",
    bundleId: "bundle-6",
    type: "pdf",
    title: "Number Systems Overview",
    description: "Visual guide to number classifications",
    pageCount: 6,
    order: 3,
    isCompleted: true,
  },

  // Bundle 7: Properties of Real Numbers
  {
    id: "content-7-1",
    bundleId: "bundle-7",
    type: "video",
    title: "Properties of Operations",
    description: "Closure, associative, commutative properties",
    duration: "16:20",
    order: 1,
    isCompleted: true,
  },
  {
    id: "content-7-2",
    bundleId: "bundle-7",
    type: "pdf",
    title: "Properties Summary Chart",
    description: "Quick reference for all properties",
    pageCount: 3,
    order: 2,
    isCompleted: true,
  },
  {
    id: "content-7-3",
    bundleId: "bundle-7",
    type: "pdf",
    title: "Property Examples Workbook",
    description: "Solved examples for each property",
    pageCount: 10,
    order: 3,
    isCompleted: true,
  },
  {
    id: "content-7-4",
    bundleId: "bundle-7",
    type: "quiz",
    title: "Properties Quick Test",
    description: "Identify and apply properties",
    questionCount: 10,
    order: 4,
    isCompleted: true,
  },

  // Bundle 8: Decimal Expansions
  {
    id: "content-8-1",
    bundleId: "bundle-8",
    type: "video",
    title: "Types of Decimal Expansions",
    description: "Terminating, non-terminating, repeating",
    duration: "13:15",
    order: 1,
    isCompleted: true,
  },
  {
    id: "content-8-2",
    bundleId: "bundle-8",
    type: "video",
    title: "Converting Fractions to Decimals",
    description: "Step-by-step conversion process",
    duration: "10:40",
    order: 2,
    isCompleted: true,
  },
  {
    id: "content-8-3",
    bundleId: "bundle-8",
    type: "simulation",
    title: "Decimal Expansion Visualizer",
    description: "See how fractions become decimals",
    order: 3,
    isCompleted: true,
  },
  {
    id: "content-8-4",
    bundleId: "bundle-8",
    type: "quiz",
    title: "Decimal Classification Quiz",
    description: "Classify decimal types",
    questionCount: 8,
    order: 4,
    isCompleted: true,
  },

  // Bundle 4: Newton's First Law
  {
    id: "content-4-1",
    bundleId: "bundle-4",
    type: "video",
    title: "Introduction to Inertia",
    description: "Understanding the concept of inertia",
    duration: "14:20",
    order: 1,
    isCompleted: true,
  },
  {
    id: "content-4-2",
    bundleId: "bundle-4",
    type: "video",
    title: "Balanced and Unbalanced Forces",
    description: "How forces affect motion",
    duration: "12:35",
    order: 2,
    isCompleted: true,
  },
  {
    id: "content-4-3",
    bundleId: "bundle-4",
    type: "pdf",
    title: "Newton's First Law - Detailed Notes",
    description: "Complete study material",
    pageCount: 8,
    order: 3,
    isCompleted: true,
  },

  // Bundle 5: Newton's Second Law
  {
    id: "content-5-1",
    bundleId: "bundle-5",
    type: "video",
    title: "Understanding F = ma",
    description: "The relationship between force, mass, and acceleration",
    duration: "18:45",
    order: 1,
    isCompleted: false,
  },
  {
    id: "content-5-2",
    bundleId: "bundle-5",
    type: "video",
    title: "Units and Dimensions",
    description: "Newton, kilogram, and meter per second squared",
    duration: "10:20",
    order: 2,
    isCompleted: false,
  },
  {
    id: "content-5-3",
    bundleId: "bundle-5",
    type: "video",
    title: "Problem Solving with F = ma",
    description: "Step-by-step approach to force problems",
    duration: "22:10",
    order: 3,
    isCompleted: false,
  },
  {
    id: "content-5-4",
    bundleId: "bundle-5",
    type: "simulation",
    title: "Force and Motion Simulator",
    description: "Experiment with mass, force, and acceleration",
    order: 4,
    isCompleted: false,
  },
  {
    id: "content-5-5",
    bundleId: "bundle-5",
    type: "simulation",
    title: "Inclined Plane Simulator",
    description: "See how angles affect force components",
    order: 5,
    isCompleted: false,
  },
  {
    id: "content-5-6",
    bundleId: "bundle-5",
    type: "quiz",
    title: "F = ma Application Quiz",
    description: "Solve numerical problems",
    questionCount: 10,
    order: 6,
    isCompleted: false,
  },
];

// ============================================
// MOCK DATA - Teacher Screenshots
// ============================================

export const teacherScreenshots: TeacherScreenshot[] = [
  // Bundle 1 screenshots
  {
    id: "screenshot-1-1",
    bundleId: "bundle-1",
    title: "Standard Form Breakdown",
    description: "Annotated explanation of ax² + bx + c",
    timestamp: "2026-01-08T10:15:00",
  },
  {
    id: "screenshot-1-2",
    bundleId: "bundle-1",
    title: "Coefficient Identification",
    description: "Examples with highlighted coefficients",
    timestamp: "2026-01-08T10:32:00",
  },
  {
    id: "screenshot-1-3",
    bundleId: "bundle-1",
    title: "Common Mistakes to Avoid",
    description: "Teacher notes on frequent errors",
    timestamp: "2026-01-08T10:45:00",
  },
  // Bundle 6 screenshots
  {
    id: "screenshot-6-1",
    bundleId: "bundle-6",
    title: "Number System Hierarchy",
    description: "Visual diagram of number classifications",
    timestamp: "2025-12-15T11:20:00",
  },
  {
    id: "screenshot-6-2",
    bundleId: "bundle-6",
    title: "Irrational Number Examples",
    description: "√2, π, and other irrationals explained",
    timestamp: "2025-12-15T11:35:00",
  },
  // Bundle 7 screenshots
  {
    id: "screenshot-7-1",
    bundleId: "bundle-7",
    title: "Properties Table",
    description: "Complete summary of all properties",
    timestamp: "2025-12-17T09:45:00",
  },
  {
    id: "screenshot-7-2",
    bundleId: "bundle-7",
    title: "Distributive Property Example",
    description: "Step-by-step worked example",
    timestamp: "2025-12-17T10:10:00",
  },
  // Bundle 4 screenshots
  {
    id: "screenshot-4-1",
    bundleId: "bundle-4",
    title: "Inertia Demonstrations",
    description: "Real-world examples of inertia",
    timestamp: "2026-01-07T14:20:00",
  },
  {
    id: "screenshot-4-2",
    bundleId: "bundle-4",
    title: "Force Diagrams",
    description: "How to draw free body diagrams",
    timestamp: "2026-01-07T14:45:00",
  },
];

// ============================================
// MOCK DATA - Homework Items
// ============================================

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
  {
    id: "hw-4",
    chapterId: "math-ch1",
    title: "Number System Classification",
    dueDate: "2025-12-20",
    linkedSessionId: "bundle-6",
    linkedSessionTitle: "Real Numbers Introduction",
    isCompleted: true,
    isStarted: true,
    questionsCount: 15,
  },
];

// ============================================
// MOCK DATA - AI Path Items
// ============================================

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

// ============================================
// MOCK DATA - Challenge Items
// ============================================

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

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getLessonBundlesByChapter = (chapterId: string): LessonBundle[] => {
  return lessonBundles.filter(b => b.chapterId === chapterId);
};

export const getLessonBundleById = (bundleId: string): LessonBundle | undefined => {
  return lessonBundles.find(b => b.id === bundleId);
};

export const getContentByBundle = (bundleId: string): BundleContentItem[] => {
  return bundleContentItems
    .filter(c => c.bundleId === bundleId)
    .sort((a, b) => a.order - b.order);
};

export const getScreenshotsByBundle = (bundleId: string): TeacherScreenshot[] => {
  return teacherScreenshots.filter(s => s.bundleId === bundleId);
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
