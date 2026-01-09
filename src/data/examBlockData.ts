import { ExamBlock, ExamType } from "@/types/examBlock";

// Default exam types that institutes can customize
export const defaultExamTypes: ExamType[] = [
  { id: "type-exam", name: "Exam", color: "red", isDefault: true },
  { id: "type-assessment", name: "Assessment", color: "amber", isDefault: true },
  { id: "type-test", name: "Internal Test", color: "orange", isDefault: true },
  { id: "type-activity", name: "Activity", color: "blue", isDefault: true },
  { id: "type-mock", name: "Mock Test", color: "purple", isDefault: true },
];

// Comprehensive mock data covering all scenarios across the year (2026)
export const examBlocks: ExamBlock[] = [
  // ==================== JANUARY 2026 ====================
  // 1. Institution-wide Term Exam (3 days, full day)
  {
    id: "block-1",
    name: "Mid-Term Examination",
    description: "Half-yearly examinations for all students",
    examTypeId: "type-exam",
    scopeType: "institution",
    dateType: "multi_day",
    dates: ["2026-01-15", "2026-01-16", "2026-01-17"],
    timeType: "full_day",
    createdAt: "2026-01-01T10:00:00Z",
    isActive: true,
  },
  // 2. JEE Course Morning Exam (single day, 9:00-12:00)
  {
    id: "block-2",
    name: "JEE Mock Test - January",
    description: "Full syllabus mock test for JEE aspirants",
    examTypeId: "type-mock",
    scopeType: "course",
    scopeId: "jee-mains",
    scopeName: "JEE Mains",
    dateType: "single_day",
    dates: ["2026-01-20"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "12:00",
    createdAt: "2026-01-05T14:00:00Z",
    isActive: true,
  },
  // 3. Weekly Batch Test (Recurring - every Saturday, periods 3-4)
  {
    id: "block-3",
    name: "Weekly Physics Test",
    description: "Weekly assessment for JEE Physics",
    examTypeId: "type-test",
    scopeType: "batch",
    scopeId: "batch-6",
    scopeName: "Class 11 - Section A (JEE)",
    dateType: "recurring",
    dates: [],
    recurringConfig: {
      dayOfWeek: "Saturday",
      startDate: "2026-01-03",
      endDate: "2026-03-28",
    },
    timeType: "periods",
    periods: [3, 4],
    createdAt: "2026-01-02T09:00:00Z",
    isActive: true,
  },
  // 4. Class Monthly Assessment (single day, periods 5-6)
  {
    id: "block-4",
    name: "January Monthly Assessment",
    description: "Monthly evaluation for Class 10",
    examTypeId: "type-assessment",
    scopeType: "class",
    scopeId: "class-10",
    scopeName: "Class 10",
    dateType: "single_day",
    dates: ["2026-01-24"],
    timeType: "periods",
    periods: [5, 6],
    createdAt: "2026-01-10T11:00:00Z",
    isActive: true,
  },
  // 5. Career Counseling Activity
  {
    id: "block-5",
    name: "Career Counseling Session",
    description: "Career guidance workshop for senior students",
    examTypeId: "type-activity",
    scopeType: "class",
    scopeId: "class-12",
    scopeName: "Class 12",
    dateType: "single_day",
    dates: ["2026-01-17"],
    timeType: "time_range",
    startTime: "14:00",
    endTime: "16:00",
    createdAt: "2026-01-08T16:00:00Z",
    isActive: true,
  },

  // ==================== FEBRUARY 2026 ====================
  // 6. Science Olympiad
  {
    id: "block-6",
    name: "Science Olympiad",
    description: "National Science Olympiad preliminary round",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-02-07"],
    timeType: "time_range",
    startTime: "10:00",
    endTime: "13:00",
    createdAt: "2026-01-12T08:00:00Z",
    isActive: true,
  },
  // 7. NEET Biology Mock
  {
    id: "block-9",
    name: "NEET Biology Mock Test",
    description: "Full-length biology mock for NEET aspirants",
    examTypeId: "type-mock",
    scopeType: "course",
    scopeId: "neet",
    scopeName: "NEET",
    dateType: "single_day",
    dates: ["2026-02-10"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "12:00",
    createdAt: "2026-01-20T10:00:00Z",
    isActive: true,
  },
  // 8. February Monthly Assessment
  {
    id: "block-10",
    name: "February Monthly Assessment",
    description: "Monthly evaluation for Class 11",
    examTypeId: "type-assessment",
    scopeType: "class",
    scopeId: "class-11",
    scopeName: "Class 11",
    dateType: "single_day",
    dates: ["2026-02-20"],
    timeType: "periods",
    periods: [5, 6],
    createdAt: "2026-01-25T11:00:00Z",
    isActive: true,
  },
  // 9. Parent-Teacher Meeting
  {
    id: "block-11",
    name: "Parent-Teacher Meeting",
    description: "Half-yearly PTM for all classes",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-02-14"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "14:00",
    createdAt: "2026-01-15T10:00:00Z",
    isActive: true,
  },

  // ==================== MARCH 2026 ====================
  // 10. Weekly Chemistry Test (Recurring)
  {
    id: "block-7",
    name: "Weekly Chemistry Test",
    description: "Weekly assessment for JEE Chemistry",
    examTypeId: "type-test",
    scopeType: "batch",
    scopeId: "batch-7",
    scopeName: "Class 11 - Section B (JEE)",
    dateType: "recurring",
    dates: [],
    recurringConfig: {
      dayOfWeek: "Wednesday",
      startDate: "2026-01-07",
      endDate: "2026-03-25",
    },
    timeType: "periods",
    periods: [7, 8],
    createdAt: "2026-01-03T10:00:00Z",
    isActive: true,
  },
  // 11. Annual Examination (5 days)
  {
    id: "block-8",
    name: "Annual Examination",
    description: "Final examination for the academic year",
    examTypeId: "type-exam",
    scopeType: "institution",
    dateType: "multi_day",
    dates: ["2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13"],
    timeType: "full_day",
    createdAt: "2026-01-01T10:00:00Z",
    isActive: true,
  },
  // 12. Board Prep Test
  {
    id: "block-12",
    name: "Board Prep Test",
    description: "Pre-board practice test for Class 12",
    examTypeId: "type-mock",
    scopeType: "class",
    scopeId: "class-12",
    scopeName: "Class 12",
    dateType: "single_day",
    dates: ["2026-03-05"],
    timeType: "full_day",
    createdAt: "2026-02-15T10:00:00Z",
    isActive: true,
  },

  // ==================== APRIL 2026 ====================
  // 13. Unit Test 1
  {
    id: "block-13",
    name: "Unit Test 1",
    description: "First unit test of the new session",
    examTypeId: "type-test",
    scopeType: "institution",
    dateType: "multi_day",
    dates: ["2026-04-06", "2026-04-08"],
    timeType: "periods",
    periods: [1, 2, 3],
    createdAt: "2026-03-20T10:00:00Z",
    isActive: true,
  },
  // 14. Practical Exams
  {
    id: "block-14",
    name: "Practical Examinations",
    description: "Science practical exams for Class 11 & 12",
    examTypeId: "type-exam",
    scopeType: "course",
    scopeId: "cbse",
    scopeName: "CBSE",
    dateType: "multi_day",
    dates: ["2026-04-15", "2026-04-16", "2026-04-17", "2026-04-18"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "13:00",
    createdAt: "2026-03-25T10:00:00Z",
    isActive: true,
  },

  // ==================== MAY 2026 ====================
  // 15. Pre-Board Examination
  {
    id: "block-15",
    name: "Pre-Board Examination",
    description: "Final pre-board exam before summer break",
    examTypeId: "type-exam",
    scopeType: "class",
    scopeId: "class-12",
    scopeName: "Class 12",
    dateType: "multi_day",
    dates: ["2026-05-04", "2026-05-05", "2026-05-06", "2026-05-07", "2026-05-08"],
    timeType: "full_day",
    createdAt: "2026-04-15T10:00:00Z",
    isActive: true,
  },
  // 16. Summer Workshop
  {
    id: "block-16",
    name: "Summer Workshop",
    description: "STEM workshop for interested students",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-05-20"],
    timeType: "time_range",
    startTime: "10:00",
    endTime: "15:00",
    createdAt: "2026-04-20T10:00:00Z",
    isActive: true,
  },

  // ==================== JUNE 2026 ====================
  // 17. Entrance Test
  {
    id: "block-17",
    name: "Entrance Test for Admissions",
    description: "Entrance examination for new admissions",
    examTypeId: "type-exam",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-06-01"],
    timeType: "full_day",
    createdAt: "2026-05-15T10:00:00Z",
    isActive: true,
  },
  // 18. Orientation
  {
    id: "block-18",
    name: "New Session Orientation",
    description: "Orientation program for new students",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-06-15"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "13:00",
    createdAt: "2026-06-01T10:00:00Z",
    isActive: true,
  },

  // ==================== JULY 2026 ====================
  // 19. Weekly Maths Test (Recurring)
  {
    id: "block-19",
    name: "Weekly Maths Quiz",
    description: "Weekly mathematics assessment",
    examTypeId: "type-test",
    scopeType: "batch",
    scopeId: "batch-1",
    scopeName: "Class 10 - Section A",
    dateType: "recurring",
    dates: [],
    recurringConfig: {
      dayOfWeek: "Friday",
      startDate: "2026-07-03",
      endDate: "2026-09-25",
    },
    timeType: "periods",
    periods: [6],
    createdAt: "2026-06-25T10:00:00Z",
    isActive: true,
  },
  // 20. July Monthly Assessment
  {
    id: "block-20",
    name: "July Monthly Assessment",
    description: "Monthly evaluation for all classes",
    examTypeId: "type-assessment",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-07-25"],
    timeType: "periods",
    periods: [1, 2, 3],
    createdAt: "2026-07-10T10:00:00Z",
    isActive: true,
  },

  // ==================== AUGUST 2026 ====================
  // 21. Independence Day Activity
  {
    id: "block-21",
    name: "Independence Day Celebration",
    description: "Cultural programs and flag hoisting",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-08-15"],
    timeType: "time_range",
    startTime: "07:00",
    endTime: "11:00",
    createdAt: "2026-08-01T10:00:00Z",
    isActive: true,
  },
  // 22. August Assessment
  {
    id: "block-22",
    name: "August Monthly Assessment",
    description: "Monthly evaluation for Class 9",
    examTypeId: "type-assessment",
    scopeType: "class",
    scopeId: "class-9",
    scopeName: "Class 9",
    dateType: "single_day",
    dates: ["2026-08-25"],
    timeType: "periods",
    periods: [4, 5, 6],
    createdAt: "2026-08-10T10:00:00Z",
    isActive: true,
  },

  // ==================== SEPTEMBER 2026 ====================
  // 23. Mid-Term II
  {
    id: "block-23",
    name: "Mid-Term II Examination",
    description: "Second mid-term examination",
    examTypeId: "type-exam",
    scopeType: "institution",
    dateType: "multi_day",
    dates: ["2026-09-21", "2026-09-22", "2026-09-23"],
    timeType: "full_day",
    createdAt: "2026-09-01T10:00:00Z",
    isActive: true,
  },

  // ==================== OCTOBER 2026 ====================
  // 24. Sports Day
  {
    id: "block-24",
    name: "Annual Sports Day",
    description: "Annual sports meet and competitions",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-10-15"],
    timeType: "full_day",
    createdAt: "2026-09-20T10:00:00Z",
    isActive: true,
  },
  // 25. Diwali Prep Test
  {
    id: "block-25",
    name: "Pre-Diwali Assessment",
    description: "Assessment before Diwali break",
    examTypeId: "type-assessment",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-10-20"],
    timeType: "periods",
    periods: [1, 2, 3, 4],
    createdAt: "2026-10-05T10:00:00Z",
    isActive: true,
  },

  // ==================== NOVEMBER 2026 ====================
  // 26. Pre-Final Assessment
  {
    id: "block-26",
    name: "Pre-Final Assessment",
    description: "Assessment before final exams",
    examTypeId: "type-assessment",
    scopeType: "institution",
    dateType: "multi_day",
    dates: ["2026-11-16", "2026-11-17", "2026-11-18"],
    timeType: "full_day",
    createdAt: "2026-11-01T10:00:00Z",
    isActive: true,
  },
  // 27. JEE Full Mock
  {
    id: "block-27",
    name: "JEE Full Mock Test",
    description: "Complete JEE mock with all subjects",
    examTypeId: "type-mock",
    scopeType: "course",
    scopeId: "jee-mains",
    scopeName: "JEE Mains",
    dateType: "single_day",
    dates: ["2026-11-25"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "15:00",
    createdAt: "2026-11-10T10:00:00Z",
    isActive: true,
  },

  // ==================== DECEMBER 2026 ====================
  // 28. Winter Break Prep
  {
    id: "block-28",
    name: "Pre-Winter Break Test",
    description: "Assessment before winter holidays",
    examTypeId: "type-test",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-12-18"],
    timeType: "periods",
    periods: [1, 2, 3, 4],
    createdAt: "2026-12-01T10:00:00Z",
    isActive: true,
  },
  // 29. Annual Day
  {
    id: "block-29",
    name: "Annual Day Celebration",
    description: "Annual day cultural program",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2026-12-19"],
    timeType: "full_day",
    createdAt: "2026-12-05T10:00:00Z",
    isActive: true,
  },
];

// Mock data for scope selection dropdowns
export const coursesForBlocks = [
  { id: "cbse", name: "CBSE" },
  { id: "jee-mains", name: "JEE Mains" },
  { id: "jee-advanced", name: "JEE Advanced" },
  { id: "neet", name: "NEET" },
];

export const classesForBlocks = [
  { id: "class-8", name: "Class 8" },
  { id: "class-9", name: "Class 9" },
  { id: "class-10", name: "Class 10" },
  { id: "class-11", name: "Class 11" },
  { id: "class-12", name: "Class 12" },
];

export const batchesForBlocks = [
  { id: "batch-1", name: "Class 10 - Section A", courseId: "cbse" },
  { id: "batch-2", name: "Class 10 - Section B", courseId: "cbse" },
  { id: "batch-3", name: "Class 10 - Section C", courseId: "cbse" },
  { id: "batch-4", name: "Class 11 - Section A", courseId: "cbse" },
  { id: "batch-5", name: "Class 11 - Section B", courseId: "cbse" },
  { id: "batch-6", name: "Class 11 - Section A (JEE)", courseId: "jee-mains" },
  { id: "batch-7", name: "Class 11 - Section B (JEE)", courseId: "jee-mains" },
  { id: "batch-8", name: "Class 12 - Section A", courseId: "cbse" },
  { id: "batch-9", name: "Class 12 - Section B", courseId: "cbse" },
  { id: "batch-10", name: "Class 12 - NEET", courseId: "neet" },
];
