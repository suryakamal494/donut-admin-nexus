import { ExamBlock, ExamType } from "@/types/examBlock";

// Default exam types that institutes can customize
export const defaultExamTypes: ExamType[] = [
  { id: "type-exam", name: "Exam", color: "red", isDefault: true },
  { id: "type-assessment", name: "Assessment", color: "amber", isDefault: true },
  { id: "type-test", name: "Internal Test", color: "orange", isDefault: true },
  { id: "type-activity", name: "Activity", color: "blue", isDefault: true },
];

// Comprehensive mock data covering all scenarios
export const examBlocks: ExamBlock[] = [
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
    examTypeId: "type-exam",
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

  // 5. Workshop/Activity
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

  // 6. Competition/Activity
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

  // 7. Batch-specific weekly test (different batch)
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

  // 8. Annual exam (end of term)
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
