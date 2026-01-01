// Exams Data for Previous Year Papers and Grand Tests

export interface SectionBreakup {
  name: string;
  questionCount: number;
  marksPerQuestion: number;
  negativeMarks: number;
  type: "mcq" | "numerical";
}

export interface PercentileMapping {
  marks: number;
  percentile: number;
  rank: number;
}

export interface PreviousYearPaper {
  id: string;
  name: string;
  examType: "jee_main" | "jee_advanced" | "neet";
  year: number;
  session?: string;
  date?: string;
  totalQuestions: number;
  totalMarks: number;
  duration: number;
  subjects: string[];
  sectionBreakup: SectionBreakup[];
  status: "draft" | "processing" | "review" | "published";
  rankEnabled: boolean;
  percentileEnabled: boolean;
  percentileData?: PercentileMapping[];
  createdAt: string;
  publishedAt?: string;
}

export interface GrandTest {
  id: string;
  name: string;
  pattern: "jee_main" | "jee_advanced" | "neet";
  totalQuestions: number;
  totalMarks: number;
  duration: number;
  subjects: string[];
  status: "draft" | "scheduled" | "live" | "completed";
  creationMethod: "ai" | "pdf";
  sharingConfig: "all" | "selected" | "none";
  sharedInstitutes?: string[];
  scheduledDate?: string;
  completedDate?: string;
  participantCount?: number;
  ranksPublished: boolean;
  createdAt: string;
}

export const examTypeLabels: Record<string, string> = {
  jee_main: "JEE Main",
  jee_advanced: "JEE Advanced",
  neet: "NEET",
};

export const examPatternConfig = {
  jee_main: {
    label: "JEE Main Pattern",
    description: "90 Questions • 300 Marks • 3 hours",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  jee_advanced: {
    label: "JEE Advanced Pattern",
    description: "54 Questions • 198 Marks • 3 hours",
    totalQuestions: 54,
    totalMarks: 198,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  neet: {
    label: "NEET Pattern",
    description: "180 Questions • 720 Marks • 3 hours",
    totalQuestions: 180,
    totalMarks: 720,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Biology"],
  },
};

// Previous Year Papers - Grouped by Exam Type and Year
export const mockPreviousYearPapers: PreviousYearPaper[] = [
  // JEE Main 2025
  {
    id: "pyp-1",
    name: "JEE Main 2025 - January Session",
    examType: "jee_main",
    year: 2025,
    session: "January",
    date: "2025-01-22",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    sectionBreakup: [
      { name: "Section A", questionCount: 20, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 10, marksPerQuestion: 4, negativeMarks: 0, type: "numerical" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2025-01-25",
    publishedAt: "2025-01-26",
  },
  {
    id: "pyp-2",
    name: "JEE Main 2025 - April Session",
    examType: "jee_main",
    year: 2025,
    session: "April",
    date: "2025-04-10",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    sectionBreakup: [
      { name: "Section A", questionCount: 20, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 10, marksPerQuestion: 4, negativeMarks: 0, type: "numerical" },
    ],
    status: "draft",
    rankEnabled: false,
    percentileEnabled: false,
    createdAt: "2025-04-15",
  },
  // JEE Main 2024
  {
    id: "pyp-3",
    name: "JEE Main 2024 - January Session",
    examType: "jee_main",
    year: 2024,
    session: "January",
    date: "2024-01-24",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    sectionBreakup: [
      { name: "Section A", questionCount: 20, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 10, marksPerQuestion: 4, negativeMarks: 0, type: "numerical" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2024-01-28",
    publishedAt: "2024-01-30",
  },
  {
    id: "pyp-4",
    name: "JEE Main 2024 - April Session",
    examType: "jee_main",
    year: 2024,
    session: "April",
    date: "2024-04-08",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    sectionBreakup: [
      { name: "Section A", questionCount: 20, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 10, marksPerQuestion: 4, negativeMarks: 0, type: "numerical" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2024-04-12",
    publishedAt: "2024-04-14",
  },
  // JEE Main 2023
  {
    id: "pyp-5",
    name: "JEE Main 2023 - January Session",
    examType: "jee_main",
    year: 2023,
    session: "January",
    date: "2023-01-29",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    sectionBreakup: [
      { name: "Section A", questionCount: 20, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 10, marksPerQuestion: 4, negativeMarks: 0, type: "numerical" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2023-02-01",
    publishedAt: "2023-02-03",
  },
  {
    id: "pyp-6",
    name: "JEE Main 2023 - April Session",
    examType: "jee_main",
    year: 2023,
    session: "April",
    date: "2023-04-12",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    sectionBreakup: [
      { name: "Section A", questionCount: 20, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 10, marksPerQuestion: 4, negativeMarks: 0, type: "numerical" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2023-04-16",
    publishedAt: "2023-04-18",
  },
  // JEE Advanced 2025
  {
    id: "pyp-7",
    name: "JEE Advanced 2025 - Paper 1",
    examType: "jee_advanced",
    year: 2025,
    session: "Paper 1",
    date: "2025-05-25",
    totalQuestions: 54,
    totalMarks: 198,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    sectionBreakup: [
      { name: "Section 1", questionCount: 6, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section 2", questionCount: 6, marksPerQuestion: 4, negativeMarks: 2, type: "mcq" },
      { name: "Section 3", questionCount: 6, marksPerQuestion: 3, negativeMarks: 0, type: "numerical" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2025-05-28",
    publishedAt: "2025-05-30",
  },
  {
    id: "pyp-8",
    name: "JEE Advanced 2025 - Paper 2",
    examType: "jee_advanced",
    year: 2025,
    session: "Paper 2",
    date: "2025-05-25",
    totalQuestions: 54,
    totalMarks: 198,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    sectionBreakup: [
      { name: "Section 1", questionCount: 6, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section 2", questionCount: 6, marksPerQuestion: 4, negativeMarks: 2, type: "mcq" },
      { name: "Section 3", questionCount: 6, marksPerQuestion: 3, negativeMarks: 0, type: "numerical" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2025-05-28",
    publishedAt: "2025-05-30",
  },
  // JEE Advanced 2024
  {
    id: "pyp-9",
    name: "JEE Advanced 2024 - Paper 1",
    examType: "jee_advanced",
    year: 2024,
    session: "Paper 1",
    date: "2024-05-26",
    totalQuestions: 54,
    totalMarks: 198,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    sectionBreakup: [
      { name: "Section 1", questionCount: 6, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section 2", questionCount: 6, marksPerQuestion: 4, negativeMarks: 2, type: "mcq" },
      { name: "Section 3", questionCount: 6, marksPerQuestion: 3, negativeMarks: 0, type: "numerical" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2024-05-29",
    publishedAt: "2024-06-01",
  },
  // NEET 2025
  {
    id: "pyp-10",
    name: "NEET 2025 - Official Paper",
    examType: "neet",
    year: 2025,
    date: "2025-05-04",
    totalQuestions: 180,
    totalMarks: 720,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Biology"],
    sectionBreakup: [
      { name: "Section A", questionCount: 35, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 15, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2025-05-08",
    publishedAt: "2025-05-10",
  },
  // NEET 2024
  {
    id: "pyp-11",
    name: "NEET 2024 - Official Paper",
    examType: "neet",
    year: 2024,
    date: "2024-05-05",
    totalQuestions: 180,
    totalMarks: 720,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Biology"],
    sectionBreakup: [
      { name: "Section A", questionCount: 35, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 15, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2024-05-10",
    publishedAt: "2024-05-12",
  },
  // NEET 2023
  {
    id: "pyp-12",
    name: "NEET 2023 - Official Paper",
    examType: "neet",
    year: 2023,
    date: "2023-05-07",
    totalQuestions: 180,
    totalMarks: 720,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Biology"],
    sectionBreakup: [
      { name: "Section A", questionCount: 35, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 15, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2023-05-12",
    publishedAt: "2023-05-14",
  },
  // NEET 2022
  {
    id: "pyp-13",
    name: "NEET 2022 - Official Paper",
    examType: "neet",
    year: 2022,
    date: "2022-07-17",
    totalQuestions: 180,
    totalMarks: 720,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Biology"],
    sectionBreakup: [
      { name: "Section A", questionCount: 35, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
      { name: "Section B", questionCount: 15, marksPerQuestion: 4, negativeMarks: 1, type: "mcq" },
    ],
    status: "published",
    rankEnabled: true,
    percentileEnabled: true,
    createdAt: "2022-07-22",
    publishedAt: "2022-07-25",
  },
];

// Grand Tests - Various statuses
export const mockGrandTests: GrandTest[] = [
  {
    id: "gt-1",
    name: "Grand Test #20 - JEE Full Syllabus Mock",
    pattern: "jee_main",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    status: "draft",
    creationMethod: "ai",
    sharingConfig: "none",
    ranksPublished: false,
    createdAt: "2025-12-28",
  },
  {
    id: "gt-2",
    name: "Grand Test #19 - NEET Complete Revision",
    pattern: "neet",
    totalQuestions: 180,
    totalMarks: 720,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Biology"],
    status: "scheduled",
    creationMethod: "pdf",
    sharingConfig: "all",
    scheduledDate: "2026-01-15",
    ranksPublished: false,
    createdAt: "2025-12-25",
  },
  {
    id: "gt-3",
    name: "Grand Test #18 - JEE Advanced Practice",
    pattern: "jee_advanced",
    totalQuestions: 54,
    totalMarks: 198,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    status: "scheduled",
    creationMethod: "ai",
    sharingConfig: "selected",
    sharedInstitutes: ["Delhi Public School", "Ryan International", "Kendriya Vidyalaya"],
    scheduledDate: "2026-01-10",
    ranksPublished: false,
    createdAt: "2025-12-20",
  },
  {
    id: "gt-4",
    name: "Grand Test #17 - JEE Main January Prep",
    pattern: "jee_main",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    status: "live",
    creationMethod: "ai",
    sharingConfig: "all",
    scheduledDate: "2025-12-31",
    ranksPublished: false,
    createdAt: "2025-12-18",
  },
  {
    id: "gt-5",
    name: "Grand Test #16 - NEET Biology Focus",
    pattern: "neet",
    totalQuestions: 180,
    totalMarks: 720,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Biology"],
    status: "completed",
    creationMethod: "pdf",
    sharingConfig: "all",
    scheduledDate: "2025-12-15",
    completedDate: "2025-12-15",
    participantCount: 3250,
    ranksPublished: true,
    createdAt: "2025-12-10",
  },
  {
    id: "gt-6",
    name: "Grand Test #15 - JEE Main December Mock",
    pattern: "jee_main",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    status: "completed",
    creationMethod: "ai",
    sharingConfig: "all",
    scheduledDate: "2025-12-10",
    completedDate: "2025-12-10",
    participantCount: 2890,
    ranksPublished: true,
    createdAt: "2025-12-05",
  },
  {
    id: "gt-7",
    name: "Grand Test #14 - JEE Advanced Full Mock",
    pattern: "jee_advanced",
    totalQuestions: 54,
    totalMarks: 198,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    status: "completed",
    creationMethod: "ai",
    sharingConfig: "selected",
    sharedInstitutes: ["Delhi Public School", "Army Public School"],
    scheduledDate: "2025-12-05",
    completedDate: "2025-12-05",
    participantCount: 1560,
    ranksPublished: false,
    createdAt: "2025-11-28",
  },
  {
    id: "gt-8",
    name: "Grand Test #13 - NEET November Mock",
    pattern: "neet",
    totalQuestions: 180,
    totalMarks: 720,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Biology"],
    status: "completed",
    creationMethod: "pdf",
    sharingConfig: "all",
    scheduledDate: "2025-11-25",
    completedDate: "2025-11-25",
    participantCount: 4120,
    ranksPublished: true,
    createdAt: "2025-11-18",
  },
  {
    id: "gt-9",
    name: "Grand Test #12 - JEE Main Full Syllabus",
    pattern: "jee_main",
    totalQuestions: 90,
    totalMarks: 300,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    status: "completed",
    creationMethod: "ai",
    sharingConfig: "all",
    scheduledDate: "2025-11-20",
    completedDate: "2025-11-20",
    participantCount: 2650,
    ranksPublished: true,
    createdAt: "2025-11-12",
  },
  {
    id: "gt-10",
    name: "Grand Test #11 - NEET Physics Special",
    pattern: "neet",
    totalQuestions: 180,
    totalMarks: 720,
    duration: 180,
    subjects: ["Physics", "Chemistry", "Biology"],
    status: "completed",
    creationMethod: "ai",
    sharingConfig: "all",
    scheduledDate: "2025-11-15",
    completedDate: "2025-11-15",
    participantCount: 3890,
    ranksPublished: true,
    createdAt: "2025-11-08",
  },
];

// Helper function to group papers by exam type and year
export const groupPapersByExamAndYear = (papers: PreviousYearPaper[]) => {
  const grouped: Record<string, Record<number, PreviousYearPaper[]>> = {};
  
  papers.forEach(paper => {
    if (!grouped[paper.examType]) {
      grouped[paper.examType] = {};
    }
    if (!grouped[paper.examType][paper.year]) {
      grouped[paper.examType][paper.year] = [];
    }
    grouped[paper.examType][paper.year].push(paper);
  });
  
  // Sort years descending within each exam type
  Object.keys(grouped).forEach(examType => {
    const years = Object.keys(grouped[examType]).map(Number).sort((a, b) => b - a);
    const sortedYears: Record<number, PreviousYearPaper[]> = {};
    years.forEach(year => {
      sortedYears[year] = grouped[examType][year];
    });
    grouped[examType] = sortedYears;
  });
  
  return grouped;
};
