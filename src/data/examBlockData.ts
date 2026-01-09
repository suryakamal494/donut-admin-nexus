import { ExamBlock, ExamType } from "@/types/examBlock";

// Default exam types that institutes can customize
export const defaultExamTypes: ExamType[] = [
  { id: "type-exam", name: "Exam", color: "red", isDefault: true },
  { id: "type-assessment", name: "Assessment", color: "amber", isDefault: true },
  { id: "type-test", name: "Internal Test", color: "orange", isDefault: true },
  { id: "type-activity", name: "Activity", color: "blue", isDefault: true },
  { id: "type-mock", name: "Mock Test", color: "purple", isDefault: true },
];

// Comprehensive mock data covering all scenarios across the year
export const examBlocks: ExamBlock[] = [
  // ==================== JANUARY ====================
  // 1. Institution-wide Term Exam (3 days, full day)
  {
    id: "block-1",
    name: "Mid-Term Examination",
    description: "Half-yearly examinations for all students",
    examTypeId: "type-exam",
    scopeType: "institution",
    dateType: "multi_day",
    dates: ["2025-01-15", "2025-01-16", "2025-01-17"],
    timeType: "full_day",
    createdAt: "2025-01-01T10:00:00Z",
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
    dates: ["2025-01-20"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "12:00",
    createdAt: "2025-01-05T14:00:00Z",
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
      startDate: "2025-01-04",
      endDate: "2025-03-29",
    },
    timeType: "periods",
    periods: [3, 4],
    createdAt: "2025-01-02T09:00:00Z",
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
    dates: ["2025-01-25"],
    timeType: "periods",
    periods: [5, 6],
    createdAt: "2025-01-10T11:00:00Z",
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
    dates: ["2025-01-18"],
    timeType: "time_range",
    startTime: "14:00",
    endTime: "16:00",
    createdAt: "2025-01-08T16:00:00Z",
    isActive: true,
  },

  // ==================== FEBRUARY ====================
  // 6. Science Olympiad
  {
    id: "block-6",
    name: "Science Olympiad",
    description: "National Science Olympiad preliminary round",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2025-02-01"],
    timeType: "time_range",
    startTime: "10:00",
    endTime: "13:00",
    createdAt: "2025-01-12T08:00:00Z",
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
    dates: ["2025-02-10"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "12:00",
    createdAt: "2025-01-20T10:00:00Z",
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
    dates: ["2025-02-20"],
    timeType: "periods",
    periods: [5, 6],
    createdAt: "2025-01-25T11:00:00Z",
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
    dates: ["2025-02-08"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "14:00",
    createdAt: "2025-01-15T10:00:00Z",
    isActive: true,
  },

  // ==================== MARCH ====================
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
      startDate: "2025-01-08",
      endDate: "2025-03-26",
    },
    timeType: "periods",
    periods: [7, 8],
    createdAt: "2025-01-03T10:00:00Z",
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
    dates: ["2025-03-10", "2025-03-11", "2025-03-12", "2025-03-13", "2025-03-14"],
    timeType: "full_day",
    createdAt: "2025-01-01T10:00:00Z",
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
    dates: ["2025-03-05"],
    timeType: "full_day",
    createdAt: "2025-02-15T10:00:00Z",
    isActive: true,
  },

  // ==================== APRIL ====================
  // 13. Unit Test 1
  {
    id: "block-13",
    name: "Unit Test 1",
    description: "First unit test of the new session",
    examTypeId: "type-test",
    scopeType: "institution",
    dateType: "multi_day",
    dates: ["2025-04-05", "2025-04-07"],
    timeType: "periods",
    periods: [1, 2, 3],
    createdAt: "2025-03-20T10:00:00Z",
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
    dates: ["2025-04-15", "2025-04-16", "2025-04-17", "2025-04-18"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "13:00",
    createdAt: "2025-03-25T10:00:00Z",
    isActive: true,
  },

  // ==================== MAY ====================
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
    dates: ["2025-05-01", "2025-05-02", "2025-05-03", "2025-05-05", "2025-05-06"],
    timeType: "full_day",
    createdAt: "2025-04-15T10:00:00Z",
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
    dates: ["2025-05-20"],
    timeType: "time_range",
    startTime: "10:00",
    endTime: "15:00",
    createdAt: "2025-04-20T10:00:00Z",
    isActive: true,
  },

  // ==================== JUNE ====================
  // 17. Entrance Test
  {
    id: "block-17",
    name: "Entrance Test for Admissions",
    description: "Entrance examination for new admissions",
    examTypeId: "type-exam",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2025-06-01"],
    timeType: "full_day",
    createdAt: "2025-05-15T10:00:00Z",
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
    dates: ["2025-06-15"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "13:00",
    createdAt: "2025-06-01T10:00:00Z",
    isActive: true,
  },

  // ==================== JULY ====================
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
      startDate: "2025-07-04",
      endDate: "2025-09-26",
    },
    timeType: "periods",
    periods: [6],
    createdAt: "2025-06-25T10:00:00Z",
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
    dates: ["2025-07-25"],
    timeType: "periods",
    periods: [1, 2, 3],
    createdAt: "2025-07-10T10:00:00Z",
    isActive: true,
  },

  // ==================== AUGUST ====================
  // 21. Independence Day Activity
  {
    id: "block-21",
    name: "Independence Day Celebration",
    description: "Cultural programs and flag hoisting",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2025-08-15"],
    timeType: "time_range",
    startTime: "07:00",
    endTime: "11:00",
    createdAt: "2025-08-01T10:00:00Z",
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
    dates: ["2025-08-25"],
    timeType: "periods",
    periods: [4, 5, 6],
    createdAt: "2025-08-10T10:00:00Z",
    isActive: true,
  },

  // ==================== SEPTEMBER ====================
  // 23. Mid-Term II
  {
    id: "block-23",
    name: "Mid-Term II Examination",
    description: "Second mid-term examination",
    examTypeId: "type-exam",
    scopeType: "institution",
    dateType: "multi_day",
    dates: ["2025-09-20", "2025-09-22", "2025-09-23"],
    timeType: "full_day",
    createdAt: "2025-09-01T10:00:00Z",
    isActive: true,
  },

  // ==================== OCTOBER ====================
  // 24. Sports Day
  {
    id: "block-24",
    name: "Annual Sports Day",
    description: "Annual sports meet and competitions",
    examTypeId: "type-activity",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2025-10-15"],
    timeType: "full_day",
    createdAt: "2025-09-20T10:00:00Z",
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
    dates: ["2025-10-20"],
    timeType: "periods",
    periods: [1, 2, 3, 4],
    createdAt: "2025-10-05T10:00:00Z",
    isActive: true,
  },

  // ==================== NOVEMBER ====================
  // 26. Pre-Final Assessment
  {
    id: "block-26",
    name: "Pre-Final Assessment",
    description: "Assessment before final exams",
    examTypeId: "type-assessment",
    scopeType: "institution",
    dateType: "multi_day",
    dates: ["2025-11-15", "2025-11-17", "2025-11-18"],
    timeType: "full_day",
    createdAt: "2025-11-01T10:00:00Z",
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
    dates: ["2025-11-25"],
    timeType: "time_range",
    startTime: "09:00",
    endTime: "15:00",
    createdAt: "2025-11-10T10:00:00Z",
    isActive: true,
  },

  // ==================== DECEMBER ====================
  // 28. Winter Break Prep
  {
    id: "block-28",
    name: "Pre-Winter Break Test",
    description: "Assessment before winter holidays",
    examTypeId: "type-test",
    scopeType: "institution",
    dateType: "single_day",
    dates: ["2025-12-18"],
    timeType: "periods",
    periods: [1, 2, 3, 4],
    createdAt: "2025-12-01T10:00:00Z",
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
    dates: ["2025-12-20"],
    timeType: "full_day",
    createdAt: "2025-12-05T10:00:00Z",
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
  { id: "batch-1", name: "Class 10 - Section A", course: "CBSE" },
  { id: "batch-2", name: "Class 10 - Section B", course: "CBSE" },
  { id: "batch-3", name: "Class 9 - Section A", course: "CBSE" },
  { id: "batch-4", name: "Class 9 - Section B", course: "CBSE" },
  { id: "batch-5", name: "Class 8 - Section A", course: "CBSE" },
  { id: "batch-6", name: "Class 11 - Section A (JEE)", course: "JEE Mains" },
  { id: "batch-7", name: "Class 11 - Section B (JEE)", course: "JEE Mains" },
  { id: "batch-8", name: "Class 12 - Section A (JEE)", course: "JEE Mains" },
];
