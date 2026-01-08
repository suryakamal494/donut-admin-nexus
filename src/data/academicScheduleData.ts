// Mock data for Academic Schedule Tracking
import {
  AcademicScheduleSetup,
  WeeklyChapterPlan,
  TeachingConfirmation,
  ChapterProgress,
  SubjectProgress,
  BatchProgressSummary,
  PendingConfirmation,
  AcademicWeek,
} from "@/types/academicSchedule";

// ============================================
// Academic Schedule Setup (Stage 1)
// ============================================

export const academicScheduleSetups: AcademicScheduleSetup[] = [
  // Class 10 - Physics (CBSE)
  {
    id: "setup-1",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "phy",
    subjectName: "Physics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "phy-10-1", chapterName: "Light - Reflection and Refraction", plannedHours: 12, order: 1 },
      { chapterId: "phy-10-2", chapterName: "Human Eye and Colourful World", plannedHours: 8, order: 2 },
      { chapterId: "phy-10-3", chapterName: "Electricity", plannedHours: 14, order: 3 },
      { chapterId: "phy-10-4", chapterName: "Magnetic Effects of Electric Current", plannedHours: 10, order: 4 },
      { chapterId: "phy-10-5", chapterName: "Sources of Energy", plannedHours: 6, order: 5 },
    ],
    totalPlannedHours: 50,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  // Class 10 - Mathematics (CBSE)
  {
    id: "setup-2",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "mat",
    subjectName: "Mathematics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "mat-10-1", chapterName: "Real Numbers", plannedHours: 8, order: 1 },
      { chapterId: "mat-10-2", chapterName: "Polynomials", plannedHours: 6, order: 2 },
      { chapterId: "mat-10-3", chapterName: "Pair of Linear Equations in Two Variables", plannedHours: 10, order: 3 },
      { chapterId: "mat-10-4", chapterName: "Quadratic Equations", plannedHours: 10, order: 4 },
      { chapterId: "mat-10-5", chapterName: "Arithmetic Progressions", plannedHours: 8, order: 5 },
      { chapterId: "mat-10-6", chapterName: "Triangles", plannedHours: 12, order: 6 },
      { chapterId: "mat-10-7", chapterName: "Coordinate Geometry", plannedHours: 8, order: 7 },
      { chapterId: "mat-10-8", chapterName: "Introduction to Trigonometry", plannedHours: 10, order: 8 },
    ],
    totalPlannedHours: 72,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  // Class 10 - Chemistry (CBSE)
  {
    id: "setup-3",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "che",
    subjectName: "Chemistry",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "che-10-1", chapterName: "Chemical Reactions and Equations", plannedHours: 10, order: 1 },
      { chapterId: "che-10-2", chapterName: "Acids, Bases and Salts", plannedHours: 12, order: 2 },
      { chapterId: "che-10-3", chapterName: "Metals and Non-metals", plannedHours: 10, order: 3 },
      { chapterId: "che-10-4", chapterName: "Carbon and its Compounds", plannedHours: 14, order: 4 },
      { chapterId: "che-10-5", chapterName: "Periodic Classification of Elements", plannedHours: 8, order: 5 },
    ],
    totalPlannedHours: 54,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  // Class 11 - Physics (JEE Mains)
  {
    id: "setup-4",
    courseId: "jee-mains",
    subjectId: "phy",
    subjectName: "Physics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "phy-11-1", chapterName: "Physical World", plannedHours: 4, order: 1 },
      { chapterId: "phy-11-2", chapterName: "Units and Measurements", plannedHours: 8, order: 2 },
      { chapterId: "phy-11-3", chapterName: "Motion in a Straight Line", plannedHours: 12, order: 3 },
      { chapterId: "phy-11-4", chapterName: "Motion in a Plane", plannedHours: 14, order: 4 },
      { chapterId: "phy-11-5", chapterName: "Laws of Motion", plannedHours: 16, order: 5 },
    ],
    totalPlannedHours: 54,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
];

// ============================================
// Weekly Chapter Plans (Stage 2)
// ============================================

export const weeklyChapterPlans: WeeklyChapterPlan[] = [
  // Batch 1 (Class 10 Section A) - Physics
  {
    id: "plan-1",
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "phy",
    subjectName: "Physics",
    courseId: "cbse",
    weekStartDate: "2025-01-06",
    weekEndDate: "2025-01-11",
    plannedChapters: ["phy-10-3"],
    granularity: "weekly",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  {
    id: "plan-2",
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "phy",
    subjectName: "Physics",
    courseId: "cbse",
    weekStartDate: "2025-01-13",
    weekEndDate: "2025-01-18",
    plannedChapters: ["phy-10-3", "phy-10-4"],
    granularity: "weekly",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  // Batch 1 - Mathematics
  {
    id: "plan-3",
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "mat",
    subjectName: "Mathematics",
    courseId: "cbse",
    weekStartDate: "2025-01-06",
    weekEndDate: "2025-01-11",
    plannedChapters: ["mat-10-4"],
    granularity: "weekly",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
  // Batch 3 (Class 9 Section A) - Physics
  {
    id: "plan-4",
    batchId: "batch-3",
    batchName: "Class 9 - Section A",
    subjectId: "phy",
    subjectName: "Physics",
    courseId: "cbse",
    weekStartDate: "2025-01-06",
    weekEndDate: "2025-01-11",
    plannedChapters: ["phy-9-3"],
    granularity: "weekly",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
  },
];

// ============================================
// Teaching Confirmations (Stage 3)
// ============================================

export const teachingConfirmations: TeachingConfirmation[] = [
  // Recent confirmations for Physics - Batch 1
  {
    id: "conf-1",
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "phy",
    subjectName: "Physics",
    teacherId: "teacher-1",
    teacherName: "Dr. Rajesh Kumar",
    date: "2025-01-06",
    didTeach: true,
    chapterId: "phy-10-3",
    chapterName: "Electricity",
    periodsCount: 2,
    confirmedAt: "2025-01-06T16:00:00Z",
    confirmedBy: "teacher",
  },
  {
    id: "conf-2",
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "phy",
    subjectName: "Physics",
    teacherId: "teacher-1",
    teacherName: "Dr. Rajesh Kumar",
    date: "2025-01-07",
    didTeach: true,
    chapterId: "phy-10-3",
    chapterName: "Electricity",
    periodsCount: 1,
    confirmedAt: "2025-01-07T16:00:00Z",
    confirmedBy: "teacher",
  },
  {
    id: "conf-3",
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "phy",
    subjectName: "Physics",
    teacherId: "teacher-1",
    teacherName: "Dr. Rajesh Kumar",
    date: "2025-01-08",
    didTeach: false,
    noTeachReason: "student_event",
    noTeachNote: "Annual Day preparations",
    periodsCount: 1,
    confirmedAt: "2025-01-08T16:00:00Z",
    confirmedBy: "teacher",
  },
  // Mathematics confirmations
  {
    id: "conf-4",
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "mat",
    subjectName: "Mathematics",
    teacherId: "teacher-2",
    teacherName: "Mrs. Priya Sharma",
    date: "2025-01-06",
    didTeach: true,
    chapterId: "mat-10-4",
    chapterName: "Quadratic Equations",
    periodsCount: 2,
    confirmedAt: "2025-01-06T16:30:00Z",
    confirmedBy: "teacher",
  },
  {
    id: "conf-5",
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "mat",
    subjectName: "Mathematics",
    teacherId: "teacher-2",
    teacherName: "Mrs. Priya Sharma",
    date: "2025-01-07",
    didTeach: true,
    chapterId: "mat-10-4",
    chapterName: "Quadratic Equations",
    periodsCount: 1,
    confirmedAt: "2025-01-07T16:30:00Z",
    confirmedBy: "teacher",
  },
];

// ============================================
// Progress Data
// ============================================

export const subjectProgressData: SubjectProgress[] = [
  {
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "phy",
    subjectName: "Physics",
    totalPlannedHours: 50,
    totalActualHours: 28,
    chaptersCompleted: 2,
    totalChapters: 5,
    currentChapter: "phy-10-3",
    currentChapterName: "Electricity",
    overallStatus: "in_progress",
    percentComplete: 56,
    lostDays: 2,
    lostDaysReasons: [
      { reason: "student_event", count: 1 },
      { reason: "holiday", count: 1 },
    ],
  },
  {
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "mat",
    subjectName: "Mathematics",
    totalPlannedHours: 72,
    totalActualHours: 32,
    chaptersCompleted: 3,
    totalChapters: 8,
    currentChapter: "mat-10-4",
    currentChapterName: "Quadratic Equations",
    overallStatus: "lagging",
    percentComplete: 44,
    lostDays: 3,
    lostDaysReasons: [
      { reason: "teacher_absent", count: 2 },
      { reason: "exam", count: 1 },
    ],
  },
  {
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    subjectId: "che",
    subjectName: "Chemistry",
    totalPlannedHours: 54,
    totalActualHours: 36,
    chaptersCompleted: 3,
    totalChapters: 5,
    currentChapter: "che-10-4",
    currentChapterName: "Carbon and its Compounds",
    overallStatus: "ahead",
    percentComplete: 67,
    lostDays: 0,
    lostDaysReasons: [],
  },
];

export const batchProgressSummaries: BatchProgressSummary[] = [
  {
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    className: "Class 10",
    subjects: subjectProgressData.filter(s => s.batchId === "batch-1"),
    overallProgress: 56,
    status: "on_track",
  },
  {
    batchId: "batch-2",
    batchName: "Class 10 - Section B",
    className: "Class 10",
    subjects: [
      {
        batchId: "batch-2",
        batchName: "Class 10 - Section B",
        subjectId: "phy",
        subjectName: "Physics",
        totalPlannedHours: 50,
        totalActualHours: 22,
        chaptersCompleted: 2,
        totalChapters: 5,
        currentChapter: "phy-10-3",
        currentChapterName: "Electricity",
        overallStatus: "lagging",
        percentComplete: 44,
        lostDays: 5,
        lostDaysReasons: [
          { reason: "teacher_absent", count: 3 },
          { reason: "holiday", count: 2 },
        ],
      },
    ],
    overallProgress: 44,
    status: "lagging",
  },
  {
    batchId: "batch-3",
    batchName: "Class 9 - Section A",
    className: "Class 9",
    subjects: [
      {
        batchId: "batch-3",
        batchName: "Class 9 - Section A",
        subjectId: "phy",
        subjectName: "Physics",
        totalPlannedHours: 48,
        totalActualHours: 40,
        chaptersCompleted: 4,
        totalChapters: 5,
        currentChapter: "phy-9-5",
        currentChapterName: "Work, Energy and Power",
        overallStatus: "ahead",
        percentComplete: 83,
        lostDays: 1,
        lostDaysReasons: [{ reason: "holiday", count: 1 }],
      },
    ],
    overallProgress: 83,
    status: "ahead",
  },
];

// ============================================
// Pending Confirmations (for Academic In-charge)
// ============================================

export const pendingConfirmations: PendingConfirmation[] = [
  {
    id: "pending-1",
    batchId: "batch-2",
    batchName: "Class 10 - Section B",
    subjectId: "mat",
    subjectName: "Mathematics",
    teacherId: "teacher-2",
    teacherName: "Mrs. Priya Sharma",
    date: "2025-01-07",
    expectedPeriods: 2,
    daysOverdue: 1,
  },
  {
    id: "pending-2",
    batchId: "batch-4",
    batchName: "Class 9 - Section B",
    subjectId: "phy",
    subjectName: "Physics",
    teacherId: "teacher-1",
    teacherName: "Dr. Rajesh Kumar",
    date: "2025-01-06",
    expectedPeriods: 1,
    daysOverdue: 2,
  },
];

// ============================================
// Helper: Generate Academic Weeks
// ============================================

export const generateAcademicWeeks = (startDate: string, numWeeks: number): AcademicWeek[] => {
  const weeks: AcademicWeek[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < numWeeks; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + (i * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 5); // Monday to Saturday
    
    const formatDate = (d: Date) => {
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    };
    
    weeks.push({
      weekNumber: i + 1,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      label: `Week ${i + 1} (${formatDate(weekStart)} - ${formatDate(weekEnd)})`,
    });
  }
  
  return weeks;
};

// Generate 40 weeks starting from April 2024 (academic year)
export const academicWeeks = generateAcademicWeeks("2024-04-01", 40);

// Current week for demo
export const currentWeekIndex = 39; // January 2025 week
