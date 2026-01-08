// Academic Schedule Tracking Types
// Core types for managing academic schedule setup, planning, and progress tracking

// ============================================
// STAGE 1: Academic Schedule Setup (Foundation)
// ============================================

export interface ChapterHourAllocation {
  chapterId: string;
  chapterName: string;
  plannedHours: number;
  order: number;
}

export interface AcademicScheduleSetup {
  id: string;
  courseId: string;           // "cbse" | "jee-mains" | etc.
  classId?: string;           // For curriculum-based (CBSE) - optional for courses
  subjectId: string;
  subjectName: string;
  academicYear: string;
  chapters: ChapterHourAllocation[];
  totalPlannedHours: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// STAGE 2: Weekly/Daily Academic Plan (Intent)
// ============================================

export interface DailyChapterPlan {
  date: string;               // ISO date string
  chapterIds: string[];
}

export interface WeeklyChapterPlan {
  id: string;
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  courseId: string;
  weekStartDate: string;      // ISO date (Monday of the week)
  weekEndDate: string;        // ISO date (Saturday/Sunday)
  plannedChapters: string[];  // Chapter IDs
  granularity: "weekly" | "daily";
  dailyPlans?: DailyChapterPlan[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// STAGE 3: Teaching Confirmation (Reality)
// ============================================

export type NoTeachReason = 
  | "teacher_absent" 
  | "student_event" 
  | "exam" 
  | "holiday" 
  | "cancelled" 
  | "other";

export interface TeachingConfirmation {
  id: string;
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string;               // ISO date
  didTeach: boolean;
  chapterId?: string;
  chapterName?: string;
  topicIds?: string[];
  topicNames?: string[];
  noTeachReason?: NoTeachReason;
  noTeachNote?: string;
  periodsCount: number;       // From timetable
  confirmedAt: string;
  confirmedBy: "teacher" | "academic_incharge";
}

// ============================================
// Progress Tracking & Analytics
// ============================================

export type ChapterStatus = 
  | "not_started" 
  | "in_progress" 
  | "completed" 
  | "lagging"
  | "ahead";

export interface ChapterProgress {
  batchId: string;
  subjectId: string;
  chapterId: string;
  chapterName: string;
  plannedHours: number;
  actualHours: number;
  plannedWeeks: string[];     // Week start dates when planned
  status: ChapterStatus;
  percentComplete: number;
  completedAt?: string;
}

export interface SubjectProgress {
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  totalPlannedHours: number;
  totalActualHours: number;
  chaptersCompleted: number;
  totalChapters: number;
  currentChapter?: string;
  currentChapterName?: string;
  overallStatus: ChapterStatus;
  percentComplete: number;
  lostDays: number;
  lostDaysReasons: { reason: NoTeachReason; count: number }[];
}

export interface BatchProgressSummary {
  batchId: string;
  batchName: string;
  className: string;
  subjects: SubjectProgress[];
  overallProgress: number;
  status: "on_track" | "lagging" | "ahead" | "critical";
}

// ============================================
// Pending Confirmations (for Admin Override)
// ============================================

export interface PendingConfirmation {
  id: string;
  batchId: string;
  batchName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  expectedPeriods: number;
  daysOverdue: number;
}

// ============================================
// Helper Types
// ============================================

export interface AcademicWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  label: string;              // e.g., "Week 1 (Apr 1 - Apr 6)"
}

export const NO_TEACH_REASON_LABELS: Record<NoTeachReason, string> = {
  teacher_absent: "Teacher Absent",
  student_event: "Student Event / Function",
  exam: "Examination",
  holiday: "Holiday",
  cancelled: "Class Cancelled",
  other: "Other",
};
