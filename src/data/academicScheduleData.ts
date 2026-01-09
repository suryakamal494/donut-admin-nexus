// Comprehensive Mock Data for Academic Schedule Tracking
// Aligned with timetable data - 8 weeks of data, 8 batches, 10 teachers
// Date range: Jan 6 - Feb 28, 2025

import {
  AcademicScheduleSetup,
  WeeklyChapterPlan,
  TeachingConfirmation,
  ChapterProgress,
  SubjectProgress,
  BatchProgressSummary,
  PendingConfirmation,
  AcademicWeek,
  NoTeachReason,
} from "@/types/academicSchedule";

// ============================================
// Helper: Generate Academic Weeks (Jan 2025 onwards)
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

// Generate 40 weeks starting from Jan 6, 2025 (aligns with timetable)
export const academicWeeks = generateAcademicWeeks("2025-01-06", 40);
export const currentWeekIndex = 0; // Week 1: Jan 6-11, 2025

// ============================================
// Academic Schedule Setups (Stage 1) - 25+ setups
// Aligned with timetable teacher-batch-subject mappings
// ============================================

export const academicScheduleSetups: AcademicScheduleSetup[] = [
  // ========================
  // BATCH 1: Class 10 - Section A (CBSE)
  // Subjects: Physics, Math, Chemistry, Biology, English, CS, Economics
  // ========================
  {
    id: "setup-b1-phy",
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
  {
    id: "setup-b1-mat",
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
  {
    id: "setup-b1-che",
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
  {
    id: "setup-b1-bio",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "bio",
    subjectName: "Biology",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "bio-10-1", chapterName: "Life Processes", plannedHours: 14, order: 1 },
      { chapterId: "bio-10-2", chapterName: "Control and Coordination", plannedHours: 10, order: 2 },
      { chapterId: "bio-10-3", chapterName: "How do Organisms Reproduce?", plannedHours: 12, order: 3 },
      { chapterId: "bio-10-4", chapterName: "Heredity and Evolution", plannedHours: 10, order: 4 },
      { chapterId: "bio-10-5", chapterName: "Our Environment", plannedHours: 8, order: 5 },
    ],
    totalPlannedHours: 54,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b1-eng",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "eng",
    subjectName: "English",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "eng-10-1", chapterName: "A Letter to God", plannedHours: 6, order: 1 },
      { chapterId: "eng-10-2", chapterName: "Nelson Mandela: Long Walk to Freedom", plannedHours: 8, order: 2 },
      { chapterId: "eng-10-3", chapterName: "Two Stories about Flying", plannedHours: 6, order: 3 },
      { chapterId: "eng-10-4", chapterName: "From the Diary of Anne Frank", plannedHours: 8, order: 4 },
      { chapterId: "eng-10-5", chapterName: "The Hundred Dresses", plannedHours: 6, order: 5 },
    ],
    totalPlannedHours: 34,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b1-cs",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "cs",
    subjectName: "Computer Science",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "cs-10-1", chapterName: "Computer Networks", plannedHours: 8, order: 1 },
      { chapterId: "cs-10-2", chapterName: "HTML Basics", plannedHours: 10, order: 2 },
      { chapterId: "cs-10-3", chapterName: "CSS Styling", plannedHours: 8, order: 3 },
      { chapterId: "cs-10-4", chapterName: "Introduction to Python", plannedHours: 12, order: 4 },
    ],
    totalPlannedHours: 38,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b1-eco",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "eco",
    subjectName: "Economics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "eco-10-1", chapterName: "Development", plannedHours: 6, order: 1 },
      { chapterId: "eco-10-2", chapterName: "Sectors of the Indian Economy", plannedHours: 8, order: 2 },
      { chapterId: "eco-10-3", chapterName: "Money and Credit", plannedHours: 8, order: 3 },
      { chapterId: "eco-10-4", chapterName: "Globalisation and the Indian Economy", plannedHours: 6, order: 4 },
    ],
    totalPlannedHours: 28,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },

  // ========================
  // BATCH 2: Class 10 - Section B (CBSE)
  // Subjects: Physics, Math, Chemistry, English, CS, Economics
  // ========================
  {
    id: "setup-b2-phy",
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
  {
    id: "setup-b2-mat",
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
    ],
    totalPlannedHours: 42,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b2-che",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "che",
    subjectName: "Chemistry",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "che-10-1", chapterName: "Chemical Reactions and Equations", plannedHours: 10, order: 1 },
      { chapterId: "che-10-2", chapterName: "Acids, Bases and Salts", plannedHours: 12, order: 2 },
      { chapterId: "che-10-3", chapterName: "Metals and Non-metals", plannedHours: 10, order: 3 },
    ],
    totalPlannedHours: 32,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b2-eng",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "eng",
    subjectName: "English",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "eng-10-1", chapterName: "A Letter to God", plannedHours: 6, order: 1 },
      { chapterId: "eng-10-2", chapterName: "Nelson Mandela: Long Walk to Freedom", plannedHours: 8, order: 2 },
      { chapterId: "eng-10-3", chapterName: "Two Stories about Flying", plannedHours: 6, order: 3 },
    ],
    totalPlannedHours: 20,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b2-cs",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "cs",
    subjectName: "Computer Science",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "cs-10-1", chapterName: "Computer Networks", plannedHours: 8, order: 1 },
      { chapterId: "cs-10-2", chapterName: "HTML Basics", plannedHours: 10, order: 2 },
    ],
    totalPlannedHours: 18,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b2-eco",
    courseId: "cbse",
    classId: "class-10",
    subjectId: "eco",
    subjectName: "Economics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "eco-10-1", chapterName: "Development", plannedHours: 6, order: 1 },
      { chapterId: "eco-10-2", chapterName: "Sectors of the Indian Economy", plannedHours: 8, order: 2 },
    ],
    totalPlannedHours: 14,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },

  // ========================
  // BATCH 3: Class 9 - Section A (CBSE)
  // Subjects: Physics, Math, Biology, Hindi, Social Studies
  // ========================
  {
    id: "setup-b3-phy",
    courseId: "cbse",
    classId: "class-9",
    subjectId: "phy",
    subjectName: "Physics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "phy-9-1", chapterName: "Motion", plannedHours: 12, order: 1 },
      { chapterId: "phy-9-2", chapterName: "Force and Laws of Motion", plannedHours: 14, order: 2 },
      { chapterId: "phy-9-3", chapterName: "Gravitation", plannedHours: 10, order: 3 },
      { chapterId: "phy-9-4", chapterName: "Work and Energy", plannedHours: 12, order: 4 },
      { chapterId: "phy-9-5", chapterName: "Sound", plannedHours: 10, order: 5 },
    ],
    totalPlannedHours: 58,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b3-mat",
    courseId: "cbse",
    classId: "class-9",
    subjectId: "mat",
    subjectName: "Mathematics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "mat-9-1", chapterName: "Number Systems", plannedHours: 10, order: 1 },
      { chapterId: "mat-9-2", chapterName: "Polynomials", plannedHours: 8, order: 2 },
      { chapterId: "mat-9-3", chapterName: "Coordinate Geometry", plannedHours: 8, order: 3 },
      { chapterId: "mat-9-4", chapterName: "Linear Equations in Two Variables", plannedHours: 10, order: 4 },
      { chapterId: "mat-9-5", chapterName: "Introduction to Euclid's Geometry", plannedHours: 6, order: 5 },
    ],
    totalPlannedHours: 42,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b3-bio",
    courseId: "cbse",
    classId: "class-9",
    subjectId: "bio",
    subjectName: "Biology",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "bio-9-1", chapterName: "The Fundamental Unit of Life", plannedHours: 8, order: 1 },
      { chapterId: "bio-9-2", chapterName: "Tissues", plannedHours: 10, order: 2 },
      { chapterId: "bio-9-3", chapterName: "Diversity in Living Organisms", plannedHours: 12, order: 3 },
      { chapterId: "bio-9-4", chapterName: "Why Do We Fall Ill", plannedHours: 8, order: 4 },
    ],
    totalPlannedHours: 38,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b3-hin",
    courseId: "cbse",
    classId: "class-9",
    subjectId: "hin",
    subjectName: "Hindi",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "hin-9-1", chapterName: "दो बैलों की कथा", plannedHours: 6, order: 1 },
      { chapterId: "hin-9-2", chapterName: "ल्हासा की ओर", plannedHours: 6, order: 2 },
      { chapterId: "hin-9-3", chapterName: "उपभोक्तावाद की संस्कृति", plannedHours: 6, order: 3 },
      { chapterId: "hin-9-4", chapterName: "साँवले सपनों की याद", plannedHours: 6, order: 4 },
    ],
    totalPlannedHours: 24,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b3-sst",
    courseId: "cbse",
    classId: "class-9",
    subjectId: "sst",
    subjectName: "Social Studies",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "sst-9-1", chapterName: "The French Revolution", plannedHours: 10, order: 1 },
      { chapterId: "sst-9-2", chapterName: "Socialism in Europe and the Russian Revolution", plannedHours: 10, order: 2 },
      { chapterId: "sst-9-3", chapterName: "Nazism and the Rise of Hitler", plannedHours: 10, order: 3 },
    ],
    totalPlannedHours: 30,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },

  // ========================
  // BATCH 4: Class 9 - Section B (CBSE)
  // Subjects: Math, Biology, Hindi
  // ========================
  {
    id: "setup-b4-mat",
    courseId: "cbse",
    classId: "class-9",
    subjectId: "mat",
    subjectName: "Mathematics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "mat-9-1", chapterName: "Number Systems", plannedHours: 10, order: 1 },
      { chapterId: "mat-9-2", chapterName: "Polynomials", plannedHours: 8, order: 2 },
      { chapterId: "mat-9-3", chapterName: "Coordinate Geometry", plannedHours: 8, order: 3 },
    ],
    totalPlannedHours: 26,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b4-bio",
    courseId: "cbse",
    classId: "class-9",
    subjectId: "bio",
    subjectName: "Biology",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "bio-9-1", chapterName: "The Fundamental Unit of Life", plannedHours: 8, order: 1 },
      { chapterId: "bio-9-2", chapterName: "Tissues", plannedHours: 10, order: 2 },
    ],
    totalPlannedHours: 18,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b4-hin",
    courseId: "cbse",
    classId: "class-9",
    subjectId: "hin",
    subjectName: "Hindi",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "hin-9-1", chapterName: "दो बैलों की कथा", plannedHours: 6, order: 1 },
      { chapterId: "hin-9-2", chapterName: "ल्हासा की ओर", plannedHours: 6, order: 2 },
    ],
    totalPlannedHours: 12,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },

  // ========================
  // BATCH 5: Class 8 - Section A (CBSE)
  // Subjects: Science, English, Hindi, Social Studies
  // ========================
  {
    id: "setup-b5-sci",
    courseId: "cbse",
    classId: "class-8",
    subjectId: "sci",
    subjectName: "Science",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "sci-8-1", chapterName: "Crop Production and Management", plannedHours: 8, order: 1 },
      { chapterId: "sci-8-2", chapterName: "Microorganisms: Friend and Foe", plannedHours: 8, order: 2 },
      { chapterId: "sci-8-3", chapterName: "Synthetic Fibres and Plastics", plannedHours: 6, order: 3 },
      { chapterId: "sci-8-4", chapterName: "Materials: Metals and Non-Metals", plannedHours: 8, order: 4 },
    ],
    totalPlannedHours: 30,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b5-eng",
    courseId: "cbse",
    classId: "class-8",
    subjectId: "eng",
    subjectName: "English",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "eng-8-1", chapterName: "The Best Christmas Present in the World", plannedHours: 6, order: 1 },
      { chapterId: "eng-8-2", chapterName: "The Tsunami", plannedHours: 6, order: 2 },
      { chapterId: "eng-8-3", chapterName: "Glimpses of the Past", plannedHours: 8, order: 3 },
    ],
    totalPlannedHours: 20,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b5-hin",
    courseId: "cbse",
    classId: "class-8",
    subjectId: "hin",
    subjectName: "Hindi",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "hin-8-1", chapterName: "ध्वनि", plannedHours: 4, order: 1 },
      { chapterId: "hin-8-2", chapterName: "लाख की चूड़ियाँ", plannedHours: 6, order: 2 },
      { chapterId: "hin-8-3", chapterName: "बस की यात्रा", plannedHours: 6, order: 3 },
    ],
    totalPlannedHours: 16,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b5-sst",
    courseId: "cbse",
    classId: "class-8",
    subjectId: "sst",
    subjectName: "Social Studies",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "sst-8-1", chapterName: "How, When and Where", plannedHours: 6, order: 1 },
      { chapterId: "sst-8-2", chapterName: "From Trade to Territory", plannedHours: 8, order: 2 },
      { chapterId: "sst-8-3", chapterName: "Ruling the Countryside", plannedHours: 8, order: 3 },
    ],
    totalPlannedHours: 22,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },

  // ========================
  // BATCH 6: Class 11 - Section A (JEE Mains)
  // Subjects: Physics, Mathematics, Chemistry
  // ========================
  {
    id: "setup-b6-phy",
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
  {
    id: "setup-b6-mat",
    courseId: "jee-mains",
    subjectId: "mat",
    subjectName: "Mathematics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "mat-11-1", chapterName: "Sets", plannedHours: 8, order: 1 },
      { chapterId: "mat-11-2", chapterName: "Relations and Functions", plannedHours: 10, order: 2 },
      { chapterId: "mat-11-3", chapterName: "Trigonometric Functions", plannedHours: 14, order: 3 },
      { chapterId: "mat-11-4", chapterName: "Principle of Mathematical Induction", plannedHours: 8, order: 4 },
    ],
    totalPlannedHours: 40,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },

  // ========================
  // BATCH 7: Class 11 - Section B (JEE Mains)
  // Subjects: Physics, Mathematics, Chemistry, English
  // ========================
  {
    id: "setup-b7-phy",
    courseId: "jee-mains",
    subjectId: "phy",
    subjectName: "Physics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "phy-11-1", chapterName: "Physical World", plannedHours: 4, order: 1 },
      { chapterId: "phy-11-2", chapterName: "Units and Measurements", plannedHours: 8, order: 2 },
      { chapterId: "phy-11-3", chapterName: "Motion in a Straight Line", plannedHours: 12, order: 3 },
      { chapterId: "phy-11-4", chapterName: "Motion in a Plane", plannedHours: 14, order: 4 },
    ],
    totalPlannedHours: 38,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b7-che",
    courseId: "jee-mains",
    subjectId: "che",
    subjectName: "Chemistry",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "che-11-1", chapterName: "Some Basic Concepts of Chemistry", plannedHours: 10, order: 1 },
      { chapterId: "che-11-2", chapterName: "Structure of Atom", plannedHours: 12, order: 2 },
      { chapterId: "che-11-3", chapterName: "Classification of Elements and Periodicity in Properties", plannedHours: 10, order: 3 },
    ],
    totalPlannedHours: 32,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },

  // ========================
  // BATCH 8: Class 12 - Section A (JEE Mains)
  // Subjects: Physics, Mathematics, Chemistry
  // ========================
  {
    id: "setup-b8-phy",
    courseId: "jee-mains",
    subjectId: "phy",
    subjectName: "Physics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "phy-12-1", chapterName: "Electric Charges and Fields", plannedHours: 12, order: 1 },
      { chapterId: "phy-12-2", chapterName: "Electrostatic Potential and Capacitance", plannedHours: 14, order: 2 },
      { chapterId: "phy-12-3", chapterName: "Current Electricity", plannedHours: 16, order: 3 },
      { chapterId: "phy-12-4", chapterName: "Moving Charges and Magnetism", plannedHours: 12, order: 4 },
    ],
    totalPlannedHours: 54,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b8-mat",
    courseId: "jee-mains",
    subjectId: "mat",
    subjectName: "Mathematics",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "mat-12-1", chapterName: "Relations and Functions", plannedHours: 10, order: 1 },
      { chapterId: "mat-12-2", chapterName: "Inverse Trigonometric Functions", plannedHours: 10, order: 2 },
      { chapterId: "mat-12-3", chapterName: "Matrices", plannedHours: 12, order: 3 },
      { chapterId: "mat-12-4", chapterName: "Determinants", plannedHours: 12, order: 4 },
    ],
    totalPlannedHours: 44,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "setup-b8-che",
    courseId: "jee-mains",
    subjectId: "che",
    subjectName: "Chemistry",
    academicYear: "2024-25",
    chapters: [
      { chapterId: "che-12-1", chapterName: "The Solid State", plannedHours: 8, order: 1 },
      { chapterId: "che-12-2", chapterName: "Solutions", plannedHours: 10, order: 2 },
      { chapterId: "che-12-3", chapterName: "Electrochemistry", plannedHours: 12, order: 3 },
    ],
    totalPlannedHours: 30,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
];

// ============================================
// Weekly Chapter Plans (Stage 2) - 150+ plans for 8 weeks
// Week 1: Jan 6-11, Week 2: Jan 13-18, ... Week 8: Feb 24-28
// ============================================

export const weeklyChapterPlans: WeeklyChapterPlan[] = [
  // ========================
  // WEEK 1: Jan 6-11, 2025
  // ========================
  // Batch 1 - Class 10A
  { id: "plan-w1-b1-phy", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["phy-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b1-mat", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b1-che", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["che-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b1-bio", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["bio-10-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b1-eng", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["eng-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 2 - Class 10B
  { id: "plan-w1-b2-phy", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["phy-10-2", "phy-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b2-mat", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-10-3", "mat-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b2-che", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["che-10-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 3 - Class 9A
  { id: "plan-w1-b3-phy", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["phy-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b3-mat", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b3-bio", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["bio-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b3-hin", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["hin-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 4 - Class 9B
  { id: "plan-w1-b4-mat", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["mat-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b4-bio", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["bio-9-1", "bio-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b4-hin", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["hin-9-1"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 5 - Class 8A
  { id: "plan-w1-b5-sci", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["sci-8-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b5-eng", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["eng-8-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w1-b5-hin", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-06", weekEndDate: "2025-01-11", plannedChapters: ["hin-8-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // ========================
  // WEEK 2: Jan 13-18, 2025
  // ========================
  // Batch 1
  { id: "plan-w2-b1-phy", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["phy-10-3", "phy-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-b1-mat", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-10-4", "mat-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-b1-che", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["che-10-3", "che-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-b1-bio", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["bio-10-2", "bio-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 2
  { id: "plan-w2-b2-phy", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["phy-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-b2-mat", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 3
  { id: "plan-w2-b3-phy", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["phy-9-3", "phy-9-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-b3-mat", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-9-3", "mat-9-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 4
  { id: "plan-w2-b4-mat", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["mat-9-2", "mat-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-b4-bio", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["bio-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 5
  { id: "plan-w2-b5-sci", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["sci-8-2", "sci-8-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w2-b5-eng", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-13", weekEndDate: "2025-01-18", plannedChapters: ["eng-8-2", "eng-8-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // ========================
  // WEEK 3: Jan 20-25, 2025 (Republic Day prep week)
  // ========================
  // Batch 1
  { id: "plan-w3-b1-phy", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["phy-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-b1-mat", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["mat-10-5", "mat-10-6"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-b1-che", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["che-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 2
  { id: "plan-w3-b2-phy", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["phy-10-3", "phy-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-b2-mat", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["mat-10-4", "mat-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 3
  { id: "plan-w3-b3-phy", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["phy-9-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-b3-mat", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["mat-9-4", "mat-9-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-b3-sst", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "sst", subjectName: "Social Studies", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sst-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 5
  { id: "plan-w3-b5-sci", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sci-8-3", "sci-8-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w3-b5-sst", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sst", subjectName: "Social Studies", courseId: "cbse", weekStartDate: "2025-01-20", weekEndDate: "2025-01-25", plannedChapters: ["sst-8-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // ========================
  // WEEK 4: Jan 27 - Feb 1, 2025
  // ========================
  // Batch 1
  { id: "plan-w4-b1-phy", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["phy-10-4", "phy-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-b1-mat", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["mat-10-6"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-b1-che", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["che-10-4", "che-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-b1-bio", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["bio-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 2
  { id: "plan-w4-b2-phy", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["phy-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-b2-che", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["che-10-2", "che-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 3
  { id: "plan-w4-b3-phy", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["phy-9-4", "phy-9-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-b3-bio", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["bio-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 4
  { id: "plan-w4-b4-mat", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["mat-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-b4-hin", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["hin-9-1", "hin-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 5
  { id: "plan-w4-b5-sci", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["sci-8-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w4-b5-eng", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-01-27", weekEndDate: "2025-02-01", plannedChapters: ["eng-8-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // ========================
  // WEEK 5: Feb 3-8, 2025 (Unit Tests week)
  // ========================
  // Batch 1
  { id: "plan-w5-b1-phy", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["phy-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w5-b1-mat", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["mat-10-6", "mat-10-7"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w5-b1-che", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["che-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 2
  { id: "plan-w5-b2-phy", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["phy-10-4", "phy-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w5-b2-mat", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["mat-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 3
  { id: "plan-w5-b3-phy", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["phy-9-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w5-b3-mat", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["mat-9-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w5-b3-bio", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["bio-9-3", "bio-9-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 5
  { id: "plan-w5-b5-sci", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["sci-8-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w5-b5-hin", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-02-03", weekEndDate: "2025-02-08", plannedChapters: ["hin-8-2", "hin-8-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // ========================
  // WEEK 6: Feb 10-15, 2025
  // ========================
  // Batch 1
  { id: "plan-w6-b1-phy", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["phy-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w6-b1-mat", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["mat-10-7", "mat-10-8"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w6-b1-bio", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["bio-10-3", "bio-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 2
  { id: "plan-w6-b2-phy", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["phy-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w6-b2-eng", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "eng", subjectName: "English", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["eng-10-2", "eng-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 3
  { id: "plan-w6-b3-sst", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "sst", subjectName: "Social Studies", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["sst-9-2", "sst-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w6-b3-hin", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["hin-9-3", "hin-9-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 4
  { id: "plan-w6-b4-bio", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["bio-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 5
  { id: "plan-w6-b5-sst", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sst", subjectName: "Social Studies", courseId: "cbse", weekStartDate: "2025-02-10", weekEndDate: "2025-02-15", plannedChapters: ["sst-8-2", "sst-8-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // ========================
  // WEEK 7: Feb 17-22, 2025
  // ========================
  // Batch 1
  { id: "plan-w7-b1-mat", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-02-17", weekEndDate: "2025-02-22", plannedChapters: ["mat-10-8"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w7-b1-bio", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-02-17", weekEndDate: "2025-02-22", plannedChapters: ["bio-10-4", "bio-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w7-b1-cs", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "cs", subjectName: "Computer Science", courseId: "cbse", weekStartDate: "2025-02-17", weekEndDate: "2025-02-22", plannedChapters: ["cs-10-3", "cs-10-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 3
  { id: "plan-w7-b3-bio", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", courseId: "cbse", weekStartDate: "2025-02-17", weekEndDate: "2025-02-22", plannedChapters: ["bio-9-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 4
  { id: "plan-w7-b4-mat", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-02-17", weekEndDate: "2025-02-22", plannedChapters: ["mat-9-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w7-b4-hin", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "hin", subjectName: "Hindi", courseId: "cbse", weekStartDate: "2025-02-17", weekEndDate: "2025-02-22", plannedChapters: ["hin-9-2"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // ========================
  // WEEK 8: Feb 24-28, 2025 (Month-end revision)
  // ========================
  // Batch 1
  { id: "plan-w8-b1-phy", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-24", weekEndDate: "2025-02-28", plannedChapters: ["phy-10-3", "phy-10-4", "phy-10-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  { id: "plan-w8-b1-mat", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", courseId: "cbse", weekStartDate: "2025-02-24", weekEndDate: "2025-02-28", plannedChapters: ["mat-10-4", "mat-10-5", "mat-10-6"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 2
  { id: "plan-w8-b2-che", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "che", subjectName: "Chemistry", courseId: "cbse", weekStartDate: "2025-02-24", weekEndDate: "2025-02-28", plannedChapters: ["che-10-1", "che-10-2", "che-10-3"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 3
  { id: "plan-w8-b3-phy", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", courseId: "cbse", weekStartDate: "2025-02-24", weekEndDate: "2025-02-28", plannedChapters: ["phy-9-3", "phy-9-4", "phy-9-5"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
  
  // Batch 5
  { id: "plan-w8-b5-sci", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", courseId: "cbse", weekStartDate: "2025-02-24", weekEndDate: "2025-02-28", plannedChapters: ["sci-8-1", "sci-8-2", "sci-8-3", "sci-8-4"], granularity: "weekly", createdAt: "2025-01-01", updatedAt: "2025-01-01" },
];

// ============================================
// Teaching Confirmations (Stage 3) - 200+ entries
// 5 weeks of confirmed data: Jan 6 - Feb 7, 2025
// Aligned with timetable teacher-batch-subject mappings
// ============================================

// Helper function to generate confirmations programmatically
const generateConfirmations = (): TeachingConfirmation[] => {
  const confirmations: TeachingConfirmation[] = [];
  let confId = 1;
  
  // Teacher-Batch-Subject mappings (from timetable)
  const mappings = [
    { teacherId: "teacher-1", teacherName: "Dr. Rajesh Kumar", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", dailyPeriods: 2 },
    { teacherId: "teacher-1", teacherName: "Dr. Rajesh Kumar", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "phy", subjectName: "Physics", dailyPeriods: 1 },
    { teacherId: "teacher-1", teacherName: "Dr. Rajesh Kumar", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "phy", subjectName: "Physics", dailyPeriods: 1 },
    { teacherId: "teacher-2", teacherName: "Mrs. Priya Sharma", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", dailyPeriods: 2 },
    { teacherId: "teacher-2", teacherName: "Mrs. Priya Sharma", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "mat", subjectName: "Mathematics", dailyPeriods: 1 },
    { teacherId: "teacher-2", teacherName: "Mrs. Priya Sharma", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "mat", subjectName: "Mathematics", dailyPeriods: 1 },
    { teacherId: "teacher-2", teacherName: "Mrs. Priya Sharma", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "mat", subjectName: "Mathematics", dailyPeriods: 1 },
    { teacherId: "teacher-3", teacherName: "Mr. Suresh Verma", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", dailyPeriods: 1 },
    { teacherId: "teacher-3", teacherName: "Mr. Suresh Verma", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "che", subjectName: "Chemistry", dailyPeriods: 1 },
    { teacherId: "teacher-4", teacherName: "Ms. Anjali Gupta", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", dailyPeriods: 1 },
    { teacherId: "teacher-4", teacherName: "Ms. Anjali Gupta", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", dailyPeriods: 1 },
    { teacherId: "teacher-4", teacherName: "Ms. Anjali Gupta", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "bio", subjectName: "Biology", dailyPeriods: 1 },
    { teacherId: "teacher-5", teacherName: "Mr. Vikram Singh", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "eng", subjectName: "English", dailyPeriods: 1 },
    { teacherId: "teacher-5", teacherName: "Mr. Vikram Singh", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "eng", subjectName: "English", dailyPeriods: 1 },
    { teacherId: "teacher-5", teacherName: "Mr. Vikram Singh", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "eng", subjectName: "English", dailyPeriods: 1 },
    { teacherId: "teacher-6", teacherName: "Mrs. Kavita Nair", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "hin", subjectName: "Hindi", dailyPeriods: 1 },
    { teacherId: "teacher-6", teacherName: "Mrs. Kavita Nair", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "hin", subjectName: "Hindi", dailyPeriods: 1 },
    { teacherId: "teacher-6", teacherName: "Mrs. Kavita Nair", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "hin", subjectName: "Hindi", dailyPeriods: 1 },
    { teacherId: "teacher-7", teacherName: "Mr. Arun Mehta", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "sst", subjectName: "Social Studies", dailyPeriods: 1 },
    { teacherId: "teacher-7", teacherName: "Mr. Arun Mehta", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sst", subjectName: "Social Studies", dailyPeriods: 1 },
    { teacherId: "teacher-8", teacherName: "Dr. Sneha Reddy", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "cs", subjectName: "Computer Science", dailyPeriods: 1 },
    { teacherId: "teacher-8", teacherName: "Dr. Sneha Reddy", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "cs", subjectName: "Computer Science", dailyPeriods: 1 },
    { teacherId: "teacher-9", teacherName: "Mr. Rahul Saxena", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "eco", subjectName: "Economics", dailyPeriods: 1 },
    { teacherId: "teacher-9", teacherName: "Mr. Rahul Saxena", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "eco", subjectName: "Economics", dailyPeriods: 1 },
    { teacherId: "teacher-10", teacherName: "Mrs. Geeta Iyer", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", dailyPeriods: 1 },
  ];
  
  // Chapter mappings per subject
  const chaptersBySubject: Record<string, { id: string; name: string }[]> = {
    "phy-batch-1": [
      { id: "phy-10-3", name: "Electricity" },
      { id: "phy-10-4", name: "Magnetic Effects of Electric Current" },
    ],
    "phy-batch-2": [
      { id: "phy-10-2", name: "Human Eye and Colourful World" },
      { id: "phy-10-3", name: "Electricity" },
    ],
    "phy-batch-3": [
      { id: "phy-9-3", name: "Gravitation" },
      { id: "phy-9-4", name: "Work and Energy" },
    ],
    "mat-batch-1": [
      { id: "mat-10-4", name: "Quadratic Equations" },
      { id: "mat-10-5", name: "Arithmetic Progressions" },
    ],
    "mat-batch-2": [
      { id: "mat-10-3", name: "Pair of Linear Equations" },
      { id: "mat-10-4", name: "Quadratic Equations" },
    ],
    "mat-batch-3": [
      { id: "mat-9-3", name: "Coordinate Geometry" },
      { id: "mat-9-4", name: "Linear Equations" },
    ],
    "mat-batch-4": [
      { id: "mat-9-2", name: "Polynomials" },
      { id: "mat-9-3", name: "Coordinate Geometry" },
    ],
    "che-batch-1": [
      { id: "che-10-3", name: "Metals and Non-metals" },
      { id: "che-10-4", name: "Carbon and its Compounds" },
    ],
    "che-batch-2": [
      { id: "che-10-2", name: "Acids, Bases and Salts" },
      { id: "che-10-3", name: "Metals and Non-metals" },
    ],
    "bio-batch-1": [
      { id: "bio-10-2", name: "Control and Coordination" },
      { id: "bio-10-3", name: "How do Organisms Reproduce?" },
    ],
    "bio-batch-3": [
      { id: "bio-9-2", name: "Tissues" },
      { id: "bio-9-3", name: "Diversity in Living Organisms" },
    ],
    "bio-batch-4": [
      { id: "bio-9-1", name: "The Fundamental Unit of Life" },
      { id: "bio-9-2", name: "Tissues" },
    ],
    "eng-batch-1": [
      { id: "eng-10-3", name: "Two Stories about Flying" },
      { id: "eng-10-4", name: "From the Diary of Anne Frank" },
    ],
    "eng-batch-2": [
      { id: "eng-10-1", name: "A Letter to God" },
      { id: "eng-10-2", name: "Nelson Mandela" },
    ],
    "eng-batch-5": [
      { id: "eng-8-2", name: "The Tsunami" },
      { id: "eng-8-3", name: "Glimpses of the Past" },
    ],
    "hin-batch-3": [
      { id: "hin-9-2", name: "ल्हासा की ओर" },
      { id: "hin-9-3", name: "उपभोक्तावाद की संस्कृति" },
    ],
    "hin-batch-4": [
      { id: "hin-9-1", name: "दो बैलों की कथा" },
      { id: "hin-9-2", name: "ल्हासा की ओर" },
    ],
    "hin-batch-5": [
      { id: "hin-8-2", name: "लाख की चूड़ियाँ" },
      { id: "hin-8-3", name: "बस की यात्रा" },
    ],
    "sst-batch-3": [
      { id: "sst-9-1", name: "The French Revolution" },
      { id: "sst-9-2", name: "Socialism in Europe" },
    ],
    "sst-batch-5": [
      { id: "sst-8-1", name: "How, When and Where" },
      { id: "sst-8-2", name: "From Trade to Territory" },
    ],
    "cs-batch-1": [
      { id: "cs-10-1", name: "Computer Networks" },
      { id: "cs-10-2", name: "HTML Basics" },
    ],
    "cs-batch-2": [
      { id: "cs-10-1", name: "Computer Networks" },
      { id: "cs-10-2", name: "HTML Basics" },
    ],
    "eco-batch-1": [
      { id: "eco-10-1", name: "Development" },
      { id: "eco-10-2", name: "Sectors of Indian Economy" },
    ],
    "eco-batch-2": [
      { id: "eco-10-1", name: "Development" },
      { id: "eco-10-2", name: "Sectors of Indian Economy" },
    ],
    "sci-batch-5": [
      { id: "sci-8-2", name: "Microorganisms" },
      { id: "sci-8-3", name: "Synthetic Fibres and Plastics" },
    ],
  };
  
  // No-teach reasons for realistic data
  const noTeachReasons: { reason: NoTeachReason; note: string }[] = [
    { reason: "teacher_absent", note: "Medical leave" },
    { reason: "teacher_absent", note: "Personal emergency" },
    { reason: "student_event", note: "Annual Day preparations" },
    { reason: "student_event", note: "Sports Day practice" },
    { reason: "exam", note: "Unit test scheduled" },
    { reason: "holiday", note: "School closed" },
    { reason: "cancelled", note: "Power outage" },
    { reason: "cancelled", note: "Building maintenance" },
  ];
  
  // Generate dates: Jan 6 - Feb 7 (weekdays only, Mon-Sat)
  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const startDate = new Date('2025-01-06');
  const endDate = new Date('2025-02-07');
  
  const allDates: string[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    if (workingDays.includes(dayName)) {
      // Skip holidays
      const dateStr = d.toISOString().split('T')[0];
      if (dateStr !== '2025-01-14' && dateStr !== '2025-01-26') { // Makar Sankranti, Republic Day
        allDates.push(dateStr);
      }
    }
  }
  
  // Generate confirmations for each mapping
  mappings.forEach(mapping => {
    const chapterKey = `${mapping.subjectId}-${mapping.batchId}`;
    const chapters = chaptersBySubject[chapterKey] || [{ id: "default", name: "General Class" }];
    let chapterIndex = 0;
    
    allDates.forEach((date, dateIndex) => {
      // Simulate realistic patterns
      const random = Math.random();
      
      // 85% taught, 10% not taught, 5% skipped (pending for recent dates)
      if (random < 0.85) {
        // Taught
        const chapter = chapters[chapterIndex % chapters.length];
        // Progress chapter every 5-7 days
        if (dateIndex > 0 && dateIndex % 6 === 0) {
          chapterIndex++;
        }
        
        confirmations.push({
          id: `conf-${confId++}`,
          batchId: mapping.batchId,
          batchName: mapping.batchName,
          subjectId: mapping.subjectId,
          subjectName: mapping.subjectName,
          teacherId: mapping.teacherId,
          teacherName: mapping.teacherName,
          date,
          didTeach: true,
          chapterId: chapter.id,
          chapterName: chapter.name,
          periodsCount: mapping.dailyPeriods,
          confirmedAt: `${date}T16:00:00Z`,
          confirmedBy: "teacher",
        });
      } else if (random < 0.95) {
        // Not taught
        const reasonData = noTeachReasons[Math.floor(Math.random() * noTeachReasons.length)];
        
        confirmations.push({
          id: `conf-${confId++}`,
          batchId: mapping.batchId,
          batchName: mapping.batchName,
          subjectId: mapping.subjectId,
          subjectName: mapping.subjectName,
          teacherId: mapping.teacherId,
          teacherName: mapping.teacherName,
          date,
          didTeach: false,
          noTeachReason: reasonData.reason,
          noTeachNote: reasonData.note,
          periodsCount: mapping.dailyPeriods,
          confirmedAt: `${date}T16:00:00Z`,
          confirmedBy: "teacher",
        });
      }
      // else: pending (no confirmation generated)
    });
  });
  
  return confirmations;
};

export const teachingConfirmations: TeachingConfirmation[] = generateConfirmations();

// ============================================
// Progress Data - Per Subject
// ============================================

export const subjectProgressData: SubjectProgress[] = [
  // Batch 1 - Class 10A
  {
    batchId: "batch-1", batchName: "Class 10 - Section A",
    subjectId: "phy", subjectName: "Physics",
    totalPlannedHours: 50, totalActualHours: 32,
    chaptersCompleted: 3, totalChapters: 5,
    currentChapter: "phy-10-4", currentChapterName: "Magnetic Effects of Electric Current",
    overallStatus: "in_progress", percentComplete: 64, lostDays: 2,
    lostDaysReasons: [{ reason: "student_event", count: 1 }, { reason: "holiday", count: 1 }],
  },
  {
    batchId: "batch-1", batchName: "Class 10 - Section A",
    subjectId: "mat", subjectName: "Mathematics",
    totalPlannedHours: 72, totalActualHours: 42,
    chaptersCompleted: 4, totalChapters: 8,
    currentChapter: "mat-10-5", currentChapterName: "Arithmetic Progressions",
    overallStatus: "on_track", percentComplete: 58, lostDays: 3,
    lostDaysReasons: [{ reason: "teacher_absent", count: 2 }, { reason: "exam", count: 1 }],
  },
  {
    batchId: "batch-1", batchName: "Class 10 - Section A",
    subjectId: "che", subjectName: "Chemistry",
    totalPlannedHours: 54, totalActualHours: 40,
    chaptersCompleted: 3, totalChapters: 5,
    currentChapter: "che-10-4", currentChapterName: "Carbon and its Compounds",
    overallStatus: "ahead", percentComplete: 74, lostDays: 0,
    lostDaysReasons: [],
  },
  {
    batchId: "batch-1", batchName: "Class 10 - Section A",
    subjectId: "bio", subjectName: "Biology",
    totalPlannedHours: 54, totalActualHours: 28,
    chaptersCompleted: 2, totalChapters: 5,
    currentChapter: "bio-10-3", currentChapterName: "How do Organisms Reproduce?",
    overallStatus: "lagging", percentComplete: 52, lostDays: 4,
    lostDaysReasons: [{ reason: "teacher_absent", count: 3 }, { reason: "cancelled", count: 1 }],
  },
  {
    batchId: "batch-1", batchName: "Class 10 - Section A",
    subjectId: "eng", subjectName: "English",
    totalPlannedHours: 34, totalActualHours: 22,
    chaptersCompleted: 3, totalChapters: 5,
    currentChapter: "eng-10-4", currentChapterName: "From the Diary of Anne Frank",
    overallStatus: "on_track", percentComplete: 65, lostDays: 1,
    lostDaysReasons: [{ reason: "student_event", count: 1 }],
  },
  {
    batchId: "batch-1", batchName: "Class 10 - Section A",
    subjectId: "cs", subjectName: "Computer Science",
    totalPlannedHours: 38, totalActualHours: 20,
    chaptersCompleted: 2, totalChapters: 4,
    currentChapter: "cs-10-3", currentChapterName: "CSS Styling",
    overallStatus: "on_track", percentComplete: 53, lostDays: 2,
    lostDaysReasons: [{ reason: "holiday", count: 2 }],
  },
  {
    batchId: "batch-1", batchName: "Class 10 - Section A",
    subjectId: "eco", subjectName: "Economics",
    totalPlannedHours: 28, totalActualHours: 18,
    chaptersCompleted: 2, totalChapters: 4,
    currentChapter: "eco-10-3", currentChapterName: "Money and Credit",
    overallStatus: "ahead", percentComplete: 64, lostDays: 0,
    lostDaysReasons: [],
  },
  
  // Batch 2 - Class 10B
  {
    batchId: "batch-2", batchName: "Class 10 - Section B",
    subjectId: "phy", subjectName: "Physics",
    totalPlannedHours: 50, totalActualHours: 22,
    chaptersCompleted: 2, totalChapters: 5,
    currentChapter: "phy-10-3", currentChapterName: "Electricity",
    overallStatus: "lagging", percentComplete: 44, lostDays: 5,
    lostDaysReasons: [{ reason: "teacher_absent", count: 3 }, { reason: "holiday", count: 2 }],
  },
  {
    batchId: "batch-2", batchName: "Class 10 - Section B",
    subjectId: "mat", subjectName: "Mathematics",
    totalPlannedHours: 42, totalActualHours: 26,
    chaptersCompleted: 3, totalChapters: 5,
    currentChapter: "mat-10-4", currentChapterName: "Quadratic Equations",
    overallStatus: "on_track", percentComplete: 62, lostDays: 2,
    lostDaysReasons: [{ reason: "exam", count: 2 }],
  },
  {
    batchId: "batch-2", batchName: "Class 10 - Section B",
    subjectId: "che", subjectName: "Chemistry",
    totalPlannedHours: 32, totalActualHours: 18,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "che-10-3", currentChapterName: "Metals and Non-metals",
    overallStatus: "on_track", percentComplete: 56, lostDays: 3,
    lostDaysReasons: [{ reason: "teacher_absent", count: 1 }, { reason: "cancelled", count: 2 }],
  },
  
  // Batch 3 - Class 9A
  {
    batchId: "batch-3", batchName: "Class 9 - Section A",
    subjectId: "phy", subjectName: "Physics",
    totalPlannedHours: 58, totalActualHours: 48,
    chaptersCompleted: 4, totalChapters: 5,
    currentChapter: "phy-9-5", currentChapterName: "Sound",
    overallStatus: "ahead", percentComplete: 83, lostDays: 1,
    lostDaysReasons: [{ reason: "holiday", count: 1 }],
  },
  {
    batchId: "batch-3", batchName: "Class 9 - Section A",
    subjectId: "mat", subjectName: "Mathematics",
    totalPlannedHours: 42, totalActualHours: 32,
    chaptersCompleted: 4, totalChapters: 5,
    currentChapter: "mat-9-5", currentChapterName: "Introduction to Euclid's Geometry",
    overallStatus: "ahead", percentComplete: 76, lostDays: 0,
    lostDaysReasons: [],
  },
  {
    batchId: "batch-3", batchName: "Class 9 - Section A",
    subjectId: "bio", subjectName: "Biology",
    totalPlannedHours: 38, totalActualHours: 24,
    chaptersCompleted: 3, totalChapters: 4,
    currentChapter: "bio-9-4", currentChapterName: "Why Do We Fall Ill",
    overallStatus: "on_track", percentComplete: 63, lostDays: 2,
    lostDaysReasons: [{ reason: "student_event", count: 2 }],
  },
  {
    batchId: "batch-3", batchName: "Class 9 - Section A",
    subjectId: "hin", subjectName: "Hindi",
    totalPlannedHours: 24, totalActualHours: 16,
    chaptersCompleted: 3, totalChapters: 4,
    currentChapter: "hin-9-4", currentChapterName: "साँवले सपनों की याद",
    overallStatus: "on_track", percentComplete: 67, lostDays: 1,
    lostDaysReasons: [{ reason: "teacher_absent", count: 1 }],
  },
  {
    batchId: "batch-3", batchName: "Class 9 - Section A",
    subjectId: "sst", subjectName: "Social Studies",
    totalPlannedHours: 30, totalActualHours: 18,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "sst-9-3", currentChapterName: "Nazism and the Rise of Hitler",
    overallStatus: "on_track", percentComplete: 60, lostDays: 2,
    lostDaysReasons: [{ reason: "holiday", count: 1 }, { reason: "student_event", count: 1 }],
  },
  
  // Batch 4 - Class 9B
  {
    batchId: "batch-4", batchName: "Class 9 - Section B",
    subjectId: "mat", subjectName: "Mathematics",
    totalPlannedHours: 26, totalActualHours: 14,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "mat-9-3", currentChapterName: "Coordinate Geometry",
    overallStatus: "lagging", percentComplete: 54, lostDays: 4,
    lostDaysReasons: [{ reason: "teacher_absent", count: 2 }, { reason: "exam", count: 2 }],
  },
  {
    batchId: "batch-4", batchName: "Class 9 - Section B",
    subjectId: "bio", subjectName: "Biology",
    totalPlannedHours: 18, totalActualHours: 12,
    chaptersCompleted: 2, totalChapters: 2,
    currentChapter: "bio-9-2", currentChapterName: "Tissues",
    overallStatus: "ahead", percentComplete: 67, lostDays: 1,
    lostDaysReasons: [{ reason: "cancelled", count: 1 }],
  },
  {
    batchId: "batch-4", batchName: "Class 9 - Section B",
    subjectId: "hin", subjectName: "Hindi",
    totalPlannedHours: 12, totalActualHours: 8,
    chaptersCompleted: 1, totalChapters: 2,
    currentChapter: "hin-9-2", currentChapterName: "ल्हासा की ओर",
    overallStatus: "on_track", percentComplete: 67, lostDays: 1,
    lostDaysReasons: [{ reason: "student_event", count: 1 }],
  },
  
  // Batch 5 - Class 8A
  {
    batchId: "batch-5", batchName: "Class 8 - Section A",
    subjectId: "sci", subjectName: "Science",
    totalPlannedHours: 30, totalActualHours: 22,
    chaptersCompleted: 3, totalChapters: 4,
    currentChapter: "sci-8-4", currentChapterName: "Materials: Metals and Non-Metals",
    overallStatus: "ahead", percentComplete: 73, lostDays: 1,
    lostDaysReasons: [{ reason: "holiday", count: 1 }],
  },
  {
    batchId: "batch-5", batchName: "Class 8 - Section A",
    subjectId: "eng", subjectName: "English",
    totalPlannedHours: 20, totalActualHours: 14,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "eng-8-3", currentChapterName: "Glimpses of the Past",
    overallStatus: "on_track", percentComplete: 70, lostDays: 1,
    lostDaysReasons: [{ reason: "student_event", count: 1 }],
  },
  {
    batchId: "batch-5", batchName: "Class 8 - Section A",
    subjectId: "hin", subjectName: "Hindi",
    totalPlannedHours: 16, totalActualHours: 10,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "hin-8-3", currentChapterName: "बस की यात्रा",
    overallStatus: "on_track", percentComplete: 63, lostDays: 2,
    lostDaysReasons: [{ reason: "teacher_absent", count: 2 }],
  },
  {
    batchId: "batch-5", batchName: "Class 8 - Section A",
    subjectId: "sst", subjectName: "Social Studies",
    totalPlannedHours: 22, totalActualHours: 14,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "sst-8-3", currentChapterName: "Ruling the Countryside",
    overallStatus: "on_track", percentComplete: 64, lostDays: 2,
    lostDaysReasons: [{ reason: "holiday", count: 1 }, { reason: "exam", count: 1 }],
  },
];

// ============================================
// Batch Progress Summaries - All 8 batches
// ============================================

export const batchProgressSummaries: BatchProgressSummary[] = [
  {
    batchId: "batch-1",
    batchName: "Class 10 - Section A",
    className: "Class 10",
    subjects: subjectProgressData.filter(s => s.batchId === "batch-1"),
    overallProgress: 61,
    status: "on_track",
  },
  {
    batchId: "batch-2",
    batchName: "Class 10 - Section B",
    className: "Class 10",
    subjects: subjectProgressData.filter(s => s.batchId === "batch-2"),
    overallProgress: 54,
    status: "lagging",
  },
  {
    batchId: "batch-3",
    batchName: "Class 9 - Section A",
    className: "Class 9",
    subjects: subjectProgressData.filter(s => s.batchId === "batch-3"),
    overallProgress: 70,
    status: "ahead",
  },
  {
    batchId: "batch-4",
    batchName: "Class 9 - Section B",
    className: "Class 9",
    subjects: subjectProgressData.filter(s => s.batchId === "batch-4"),
    overallProgress: 63,
    status: "on_track",
  },
  {
    batchId: "batch-5",
    batchName: "Class 8 - Section A",
    className: "Class 8",
    subjects: subjectProgressData.filter(s => s.batchId === "batch-5"),
    overallProgress: 68,
    status: "on_track",
  },
  {
    batchId: "batch-6",
    batchName: "Class 11 - Section A (JEE)",
    className: "Class 11",
    subjects: [
      {
        batchId: "batch-6", batchName: "Class 11 - Section A (JEE)",
        subjectId: "phy", subjectName: "Physics",
        totalPlannedHours: 54, totalActualHours: 38,
        chaptersCompleted: 3, totalChapters: 5,
        currentChapter: "phy-11-4", currentChapterName: "Motion in a Plane",
        overallStatus: "on_track", percentComplete: 70, lostDays: 2,
        lostDaysReasons: [{ reason: "exam", count: 2 }],
      },
      {
        batchId: "batch-6", batchName: "Class 11 - Section A (JEE)",
        subjectId: "mat", subjectName: "Mathematics",
        totalPlannedHours: 40, totalActualHours: 32,
        chaptersCompleted: 3, totalChapters: 4,
        currentChapter: "mat-11-4", currentChapterName: "Principle of Mathematical Induction",
        overallStatus: "ahead", percentComplete: 80, lostDays: 0,
        lostDaysReasons: [],
      },
    ],
    overallProgress: 75,
    status: "ahead",
  },
  {
    batchId: "batch-7",
    batchName: "Class 11 - Section B (JEE)",
    className: "Class 11",
    subjects: [
      {
        batchId: "batch-7", batchName: "Class 11 - Section B (JEE)",
        subjectId: "phy", subjectName: "Physics",
        totalPlannedHours: 38, totalActualHours: 24,
        chaptersCompleted: 2, totalChapters: 4,
        currentChapter: "phy-11-3", currentChapterName: "Motion in a Straight Line",
        overallStatus: "on_track", percentComplete: 63, lostDays: 3,
        lostDaysReasons: [{ reason: "teacher_absent", count: 2 }, { reason: "holiday", count: 1 }],
      },
      {
        batchId: "batch-7", batchName: "Class 11 - Section B (JEE)",
        subjectId: "che", subjectName: "Chemistry",
        totalPlannedHours: 32, totalActualHours: 22,
        chaptersCompleted: 2, totalChapters: 3,
        currentChapter: "che-11-3", currentChapterName: "Classification of Elements",
        overallStatus: "on_track", percentComplete: 69, lostDays: 1,
        lostDaysReasons: [{ reason: "exam", count: 1 }],
      },
    ],
    overallProgress: 66,
    status: "on_track",
  },
  {
    batchId: "batch-8",
    batchName: "Class 12 - Section A (JEE)",
    className: "Class 12",
    subjects: [
      {
        batchId: "batch-8", batchName: "Class 12 - Section A (JEE)",
        subjectId: "phy", subjectName: "Physics",
        totalPlannedHours: 54, totalActualHours: 30,
        chaptersCompleted: 2, totalChapters: 4,
        currentChapter: "phy-12-3", currentChapterName: "Current Electricity",
        overallStatus: "lagging", percentComplete: 56, lostDays: 5,
        lostDaysReasons: [{ reason: "teacher_absent", count: 3 }, { reason: "exam", count: 2 }],
      },
      {
        batchId: "batch-8", batchName: "Class 12 - Section A (JEE)",
        subjectId: "mat", subjectName: "Mathematics",
        totalPlannedHours: 44, totalActualHours: 34,
        chaptersCompleted: 3, totalChapters: 4,
        currentChapter: "mat-12-4", currentChapterName: "Determinants",
        overallStatus: "on_track", percentComplete: 77, lostDays: 1,
        lostDaysReasons: [{ reason: "holiday", count: 1 }],
      },
      {
        batchId: "batch-8", batchName: "Class 12 - Section A (JEE)",
        subjectId: "che", subjectName: "Chemistry",
        totalPlannedHours: 30, totalActualHours: 22,
        chaptersCompleted: 2, totalChapters: 3,
        currentChapter: "che-12-3", currentChapterName: "Electrochemistry",
        overallStatus: "on_track", percentComplete: 73, lostDays: 1,
        lostDaysReasons: [{ reason: "student_event", count: 1 }],
      },
    ],
    overallProgress: 69,
    status: "on_track",
  },
];

// ============================================
// Pending Confirmations - 20+ entries across teachers
// Recent dates (last 3-5 days from Feb 7, 2025)
// ============================================

export const pendingConfirmations: PendingConfirmation[] = [
  // Feb 7, 2025 - Most recent (0-1 days overdue)
  { id: "pending-1", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "eco", subjectName: "Economics", teacherId: "teacher-9", teacherName: "Mr. Rahul Saxena", date: "2025-02-07", expectedPeriods: 1, daysOverdue: 0 },
  { id: "pending-2", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "cs", subjectName: "Computer Science", teacherId: "teacher-8", teacherName: "Dr. Sneha Reddy", date: "2025-02-07", expectedPeriods: 1, daysOverdue: 0 },
  
  // Feb 6, 2025 (1 day overdue)
  { id: "pending-3", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "mat", subjectName: "Mathematics", teacherId: "teacher-2", teacherName: "Mrs. Priya Sharma", date: "2025-02-06", expectedPeriods: 2, daysOverdue: 1 },
  { id: "pending-4", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "sst", subjectName: "Social Studies", teacherId: "teacher-7", teacherName: "Mr. Arun Mehta", date: "2025-02-06", expectedPeriods: 1, daysOverdue: 1 },
  { id: "pending-5", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "bio", subjectName: "Biology", teacherId: "teacher-4", teacherName: "Ms. Anjali Gupta", date: "2025-02-06", expectedPeriods: 1, daysOverdue: 1 },
  
  // Feb 5, 2025 (2 days overdue)
  { id: "pending-6", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "phy", subjectName: "Physics", teacherId: "teacher-1", teacherName: "Dr. Rajesh Kumar", date: "2025-02-05", expectedPeriods: 1, daysOverdue: 2 },
  { id: "pending-7", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "eng", subjectName: "English", teacherId: "teacher-5", teacherName: "Mr. Vikram Singh", date: "2025-02-05", expectedPeriods: 1, daysOverdue: 2 },
  { id: "pending-8", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "bio", subjectName: "Biology", teacherId: "teacher-4", teacherName: "Ms. Anjali Gupta", date: "2025-02-05", expectedPeriods: 1, daysOverdue: 2 },
  
  // Feb 4, 2025 (3 days overdue)
  { id: "pending-9", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "hin", subjectName: "Hindi", teacherId: "teacher-6", teacherName: "Mrs. Kavita Nair", date: "2025-02-04", expectedPeriods: 1, daysOverdue: 3 },
  { id: "pending-10", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "mat", subjectName: "Mathematics", teacherId: "teacher-2", teacherName: "Mrs. Priya Sharma", date: "2025-02-04", expectedPeriods: 1, daysOverdue: 3 },
  { id: "pending-11", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "mat", subjectName: "Mathematics", teacherId: "teacher-2", teacherName: "Mrs. Priya Sharma", date: "2025-02-04", expectedPeriods: 1, daysOverdue: 3 },
  { id: "pending-12", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sci", subjectName: "Science", teacherId: "teacher-10", teacherName: "Mrs. Geeta Iyer", date: "2025-02-04", expectedPeriods: 1, daysOverdue: 3 },
  
  // Feb 3, 2025 (4 days overdue - critical)
  { id: "pending-13", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "che", subjectName: "Chemistry", teacherId: "teacher-3", teacherName: "Mr. Suresh Verma", date: "2025-02-03", expectedPeriods: 1, daysOverdue: 4 },
  { id: "pending-14", batchId: "batch-3", batchName: "Class 9 - Section A", subjectId: "bio", subjectName: "Biology", teacherId: "teacher-4", teacherName: "Ms. Anjali Gupta", date: "2025-02-03", expectedPeriods: 1, daysOverdue: 4 },
  { id: "pending-15", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "eng", subjectName: "English", teacherId: "teacher-5", teacherName: "Mr. Vikram Singh", date: "2025-02-03", expectedPeriods: 1, daysOverdue: 4 },
  
  // Jan 31, 2025 (5+ days overdue - very critical)
  { id: "pending-16", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "phy", subjectName: "Physics", teacherId: "teacher-1", teacherName: "Dr. Rajesh Kumar", date: "2025-01-31", expectedPeriods: 2, daysOverdue: 5 },
  { id: "pending-17", batchId: "batch-4", batchName: "Class 9 - Section B", subjectId: "hin", subjectName: "Hindi", teacherId: "teacher-6", teacherName: "Mrs. Kavita Nair", date: "2025-01-31", expectedPeriods: 1, daysOverdue: 5 },
  { id: "pending-18", batchId: "batch-5", batchName: "Class 8 - Section A", subjectId: "sst", subjectName: "Social Studies", teacherId: "teacher-7", teacherName: "Mr. Arun Mehta", date: "2025-01-30", expectedPeriods: 1, daysOverdue: 6 },
  
  // Additional pending for variety
  { id: "pending-19", batchId: "batch-2", batchName: "Class 10 - Section B", subjectId: "eco", subjectName: "Economics", teacherId: "teacher-9", teacherName: "Mr. Rahul Saxena", date: "2025-01-30", expectedPeriods: 1, daysOverdue: 6 },
  { id: "pending-20", batchId: "batch-1", batchName: "Class 10 - Section A", subjectId: "cs", subjectName: "Computer Science", teacherId: "teacher-8", teacherName: "Dr. Sneha Reddy", date: "2025-01-29", expectedPeriods: 1, daysOverdue: 7 },
];
