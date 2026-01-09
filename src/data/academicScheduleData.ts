// Comprehensive Mock Data for Academic Schedule Tracking
// Aligned with cbseMasterData using consistent class IDs:
// "1" = Class 6, "2" = Class 7, "3" = Class 8, "4" = Class 9, "5" = Class 10, "6" = Class 11, "7" = Class 12
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
// Academic Schedule Setups - Aligned with cbseMasterData
// Class IDs: "1"=6, "2"=7, "3"=8, "4"=9, "5"=10, "6"=11, "7"=12
// Subject IDs: "1"=Physics, "2"=Chemistry, "3"=Math, "4"=Biology, "5"=History, "6"=Hindi
// ============================================

export const academicScheduleSetups: AcademicScheduleSetup[] = [
  // ========================
  // CLASS 6 (classId: "1") - Mathematics, History, Hindi
  // ========================
  {
    id: "setup-c6-mat",
    courseId: "cbse",
    classId: "1",
    subjectId: "3",
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-6-1", chapterName: "Knowing Our Numbers", plannedHours: 6, order: 1 },
      { chapterId: "mat-6-2", chapterName: "Whole Numbers", plannedHours: 5, order: 2 },
      { chapterId: "mat-6-3", chapterName: "Playing with Numbers", plannedHours: 6, order: 3 },
      { chapterId: "mat-6-4", chapterName: "Basic Geometrical Ideas", plannedHours: 5, order: 4 },
      { chapterId: "mat-6-5", chapterName: "Understanding Elementary Shapes", plannedHours: 6, order: 5 },
      { chapterId: "mat-6-6", chapterName: "Integers", plannedHours: 6, order: 6 },
      { chapterId: "mat-6-7", chapterName: "Fractions", plannedHours: 7, order: 7 },
      { chapterId: "mat-6-8", chapterName: "Decimals", plannedHours: 6, order: 8 },
      { chapterId: "mat-6-9", chapterName: "Data Handling", plannedHours: 5, order: 9 },
      { chapterId: "mat-6-10", chapterName: "Mensuration", plannedHours: 6, order: 10 },
      { chapterId: "mat-6-11", chapterName: "Algebra", plannedHours: 6, order: 11 },
      { chapterId: "mat-6-12", chapterName: "Ratio and Proportion", plannedHours: 5, order: 12 },
      { chapterId: "mat-6-13", chapterName: "Symmetry", plannedHours: 4, order: 13 },
      { chapterId: "mat-6-14", chapterName: "Practical Geometry", plannedHours: 5, order: 14 },
    ],
    totalPlannedHours: 78,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c6-his",
    courseId: "cbse",
    classId: "1",
    subjectId: "5",
    subjectName: "History",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "his-6-1", chapterName: "What, Where, How and When?", plannedHours: 4, order: 1 },
      { chapterId: "his-6-2", chapterName: "From Hunting-Gathering to Growing Food", plannedHours: 5, order: 2 },
      { chapterId: "his-6-3", chapterName: "In the Earliest Cities", plannedHours: 5, order: 3 },
      { chapterId: "his-6-4", chapterName: "What Books and Burials Tell Us", plannedHours: 4, order: 4 },
      { chapterId: "his-6-5", chapterName: "Kingdoms, Kings and an Early Republic", plannedHours: 5, order: 5 },
    ],
    totalPlannedHours: 23,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c6-hin",
    courseId: "cbse",
    classId: "1",
    subjectId: "6",
    subjectName: "Hindi",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "hin-6-1", chapterName: "वह चिड़िया जो", plannedHours: 4, order: 1 },
      { chapterId: "hin-6-2", chapterName: "बचपन", plannedHours: 4, order: 2 },
      { chapterId: "hin-6-3", chapterName: "नादान दोस्त", plannedHours: 5, order: 3 },
      { chapterId: "hin-6-4", chapterName: "चाँद से थोड़ी सी गप्पें", plannedHours: 4, order: 4 },
    ],
    totalPlannedHours: 17,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 7 (classId: "2") - Mathematics, History, Hindi
  // ========================
  {
    id: "setup-c7-mat",
    courseId: "cbse",
    classId: "2",
    subjectId: "3",
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-7-1", chapterName: "Integers", plannedHours: 6, order: 1 },
      { chapterId: "mat-7-2", chapterName: "Fractions and Decimals", plannedHours: 6, order: 2 },
      { chapterId: "mat-7-3", chapterName: "Data Handling", plannedHours: 5, order: 3 },
      { chapterId: "mat-7-4", chapterName: "Simple Equations", plannedHours: 6, order: 4 },
      { chapterId: "mat-7-5", chapterName: "Lines and Angles", plannedHours: 6, order: 5 },
      { chapterId: "mat-7-6", chapterName: "The Triangle and Its Properties", plannedHours: 6, order: 6 },
      { chapterId: "mat-7-7", chapterName: "Congruence of Triangles", plannedHours: 5, order: 7 },
      { chapterId: "mat-7-8", chapterName: "Comparing Quantities", plannedHours: 6, order: 8 },
      { chapterId: "mat-7-9", chapterName: "Rational Numbers", plannedHours: 6, order: 9 },
      { chapterId: "mat-7-10", chapterName: "Practical Geometry", plannedHours: 5, order: 10 },
      { chapterId: "mat-7-11", chapterName: "Perimeter and Area", plannedHours: 6, order: 11 },
      { chapterId: "mat-7-12", chapterName: "Algebraic Expressions", plannedHours: 6, order: 12 },
      { chapterId: "mat-7-13", chapterName: "Exponents and Powers", plannedHours: 5, order: 13 },
      { chapterId: "mat-7-14", chapterName: "Symmetry", plannedHours: 4, order: 14 },
      { chapterId: "mat-7-15", chapterName: "Visualising Solid Shapes", plannedHours: 4, order: 15 },
    ],
    totalPlannedHours: 82,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c7-his",
    courseId: "cbse",
    classId: "2",
    subjectId: "5",
    subjectName: "History",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "his-7-1", chapterName: "Tracing Changes Through a Thousand Years", plannedHours: 5, order: 1 },
      { chapterId: "his-7-2", chapterName: "New Kings and Kingdoms", plannedHours: 5, order: 2 },
      { chapterId: "his-7-3", chapterName: "The Delhi Sultans", plannedHours: 6, order: 3 },
      { chapterId: "his-7-4", chapterName: "The Mughal Empire", plannedHours: 6, order: 4 },
    ],
    totalPlannedHours: 22,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 8 (classId: "3") - Mathematics, History, Hindi
  // ========================
  {
    id: "setup-c8-mat",
    courseId: "cbse",
    classId: "3",
    subjectId: "3",
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-8-1", chapterName: "Rational Numbers", plannedHours: 6, order: 1 },
      { chapterId: "mat-8-2", chapterName: "Linear Equations in One Variable", plannedHours: 7, order: 2 },
      { chapterId: "mat-8-3", chapterName: "Understanding Quadrilaterals", plannedHours: 6, order: 3 },
      { chapterId: "mat-8-4", chapterName: "Practical Geometry", plannedHours: 5, order: 4 },
      { chapterId: "mat-8-5", chapterName: "Data Handling", plannedHours: 6, order: 5 },
      { chapterId: "mat-8-6", chapterName: "Squares and Square Roots", plannedHours: 6, order: 6 },
      { chapterId: "mat-8-7", chapterName: "Cubes and Cube Roots", plannedHours: 5, order: 7 },
      { chapterId: "mat-8-8", chapterName: "Comparing Quantities", plannedHours: 6, order: 8 },
      { chapterId: "mat-8-9", chapterName: "Algebraic Expressions and Identities", plannedHours: 7, order: 9 },
      { chapterId: "mat-8-10", chapterName: "Visualising Solid Shapes", plannedHours: 5, order: 10 },
      { chapterId: "mat-8-11", chapterName: "Mensuration", plannedHours: 7, order: 11 },
      { chapterId: "mat-8-12", chapterName: "Exponents and Powers", plannedHours: 5, order: 12 },
      { chapterId: "mat-8-13", chapterName: "Direct and Inverse Proportions", plannedHours: 5, order: 13 },
      { chapterId: "mat-8-14", chapterName: "Factorisation", plannedHours: 6, order: 14 },
      { chapterId: "mat-8-15", chapterName: "Introduction to Graphs", plannedHours: 5, order: 15 },
      { chapterId: "mat-8-16", chapterName: "Playing with Numbers", plannedHours: 5, order: 16 },
    ],
    totalPlannedHours: 92,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c8-his",
    courseId: "cbse",
    classId: "3",
    subjectId: "5",
    subjectName: "History",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "his-8-1", chapterName: "How, When and Where", plannedHours: 4, order: 1 },
      { chapterId: "his-8-2", chapterName: "From Trade to Territory", plannedHours: 5, order: 2 },
      { chapterId: "his-8-3", chapterName: "Ruling the Countryside", plannedHours: 5, order: 3 },
      { chapterId: "his-8-4", chapterName: "Tribals, Dikus and the Vision of a Golden Age", plannedHours: 5, order: 4 },
    ],
    totalPlannedHours: 19,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 9 (classId: "4") - Mathematics, Physics (placeholder), History, Hindi
  // ========================
  {
    id: "setup-c9-mat",
    courseId: "cbse",
    classId: "4",
    subjectId: "3",
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-9-1", chapterName: "Number Systems", plannedHours: 8, order: 1 },
      { chapterId: "mat-9-2", chapterName: "Polynomials", plannedHours: 7, order: 2 },
      { chapterId: "mat-9-3", chapterName: "Coordinate Geometry", plannedHours: 6, order: 3 },
      { chapterId: "mat-9-4", chapterName: "Linear Equations in Two Variables", plannedHours: 8, order: 4 },
      { chapterId: "mat-9-5", chapterName: "Introduction to Euclid's Geometry", plannedHours: 5, order: 5 },
      { chapterId: "mat-9-6", chapterName: "Lines and Angles", plannedHours: 6, order: 6 },
      { chapterId: "mat-9-7", chapterName: "Triangles", plannedHours: 8, order: 7 },
      { chapterId: "mat-9-8", chapterName: "Quadrilaterals", plannedHours: 6, order: 8 },
      { chapterId: "mat-9-9", chapterName: "Areas of Parallelograms and Triangles", plannedHours: 6, order: 9 },
      { chapterId: "mat-9-10", chapterName: "Circles", plannedHours: 7, order: 10 },
      { chapterId: "mat-9-11", chapterName: "Constructions", plannedHours: 5, order: 11 },
      { chapterId: "mat-9-12", chapterName: "Heron's Formula", plannedHours: 5, order: 12 },
      { chapterId: "mat-9-13", chapterName: "Surface Areas and Volumes", plannedHours: 8, order: 13 },
      { chapterId: "mat-9-14", chapterName: "Statistics", plannedHours: 6, order: 14 },
      { chapterId: "mat-9-15", chapterName: "Probability", plannedHours: 5, order: 15 },
    ],
    totalPlannedHours: 96,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c9-his",
    courseId: "cbse",
    classId: "4",
    subjectId: "5",
    subjectName: "History",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "his-9-1", chapterName: "The French Revolution", plannedHours: 8, order: 1 },
      { chapterId: "his-9-2", chapterName: "Socialism in Europe and the Russian Revolution", plannedHours: 7, order: 2 },
      { chapterId: "his-9-3", chapterName: "Nazism and the Rise of Hitler", plannedHours: 7, order: 3 },
      { chapterId: "his-9-4", chapterName: "Forest Society and Colonialism", plannedHours: 6, order: 4 },
      { chapterId: "his-9-5", chapterName: "Pastoralists in the Modern World", plannedHours: 5, order: 5 },
    ],
    totalPlannedHours: 33,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c9-hin",
    courseId: "cbse",
    classId: "4",
    subjectId: "6",
    subjectName: "Hindi",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "hin-9-1", chapterName: "दो बैलों की कथा", plannedHours: 5, order: 1 },
      { chapterId: "hin-9-2", chapterName: "ल्हासा की ओर", plannedHours: 5, order: 2 },
      { chapterId: "hin-9-3", chapterName: "उपभोक्तावाद की संस्कृति", plannedHours: 5, order: 3 },
      { chapterId: "hin-9-4", chapterName: "साँवले सपनों की याद", plannedHours: 4, order: 4 },
      { chapterId: "hin-9-5", chapterName: "नाना साहब की पुत्री देवी मैना को भस्म कर दिया गया", plannedHours: 5, order: 5 },
    ],
    totalPlannedHours: 24,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 10 (classId: "5") - Mathematics, History, Hindi
  // ========================
  {
    id: "setup-c10-mat",
    courseId: "cbse",
    classId: "5",
    subjectId: "3",
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-10-1", chapterName: "Real Numbers", plannedHours: 8, order: 1 },
      { chapterId: "mat-10-2", chapterName: "Polynomials", plannedHours: 6, order: 2 },
      { chapterId: "mat-10-3", chapterName: "Pair of Linear Equations in Two Variables", plannedHours: 10, order: 3 },
      { chapterId: "mat-10-4", chapterName: "Quadratic Equations", plannedHours: 10, order: 4 },
      { chapterId: "mat-10-5", chapterName: "Arithmetic Progressions", plannedHours: 8, order: 5 },
      { chapterId: "mat-10-6", chapterName: "Triangles", plannedHours: 10, order: 6 },
      { chapterId: "mat-10-7", chapterName: "Coordinate Geometry", plannedHours: 8, order: 7 },
      { chapterId: "mat-10-8", chapterName: "Introduction to Trigonometry", plannedHours: 10, order: 8 },
      { chapterId: "mat-10-9", chapterName: "Some Applications of Trigonometry", plannedHours: 6, order: 9 },
      { chapterId: "mat-10-10", chapterName: "Circles", plannedHours: 8, order: 10 },
      { chapterId: "mat-10-11", chapterName: "Constructions", plannedHours: 5, order: 11 },
      { chapterId: "mat-10-12", chapterName: "Areas Related to Circles", plannedHours: 7, order: 12 },
      { chapterId: "mat-10-13", chapterName: "Surface Areas and Volumes", plannedHours: 8, order: 13 },
      { chapterId: "mat-10-14", chapterName: "Statistics", plannedHours: 7, order: 14 },
      { chapterId: "mat-10-15", chapterName: "Probability", plannedHours: 6, order: 15 },
    ],
    totalPlannedHours: 117,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c10-his",
    courseId: "cbse",
    classId: "5",
    subjectId: "5",
    subjectName: "History",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "his-10-1", chapterName: "The Rise of Nationalism in Europe", plannedHours: 8, order: 1 },
      { chapterId: "his-10-2", chapterName: "Nationalism in India", plannedHours: 10, order: 2 },
      { chapterId: "his-10-3", chapterName: "The Making of a Global World", plannedHours: 7, order: 3 },
      { chapterId: "his-10-4", chapterName: "The Age of Industrialisation", plannedHours: 7, order: 4 },
      { chapterId: "his-10-5", chapterName: "Print Culture and the Modern World", plannedHours: 6, order: 5 },
    ],
    totalPlannedHours: 38,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c10-hin",
    courseId: "cbse",
    classId: "5",
    subjectId: "6",
    subjectName: "Hindi",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "hin-10-1", chapterName: "सूरदास के पद", plannedHours: 5, order: 1 },
      { chapterId: "hin-10-2", chapterName: "राम-लक्ष्मण-परशुराम संवाद", plannedHours: 6, order: 2 },
      { chapterId: "hin-10-3", chapterName: "आत्मकथ्य", plannedHours: 4, order: 3 },
      { chapterId: "hin-10-4", chapterName: "उत्साह और अट नहीं रही", plannedHours: 4, order: 4 },
      { chapterId: "hin-10-5", chapterName: "यह दंतुरहित मुस्कान और फसल", plannedHours: 4, order: 5 },
    ],
    totalPlannedHours: 23,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 11 (classId: "6") - Physics, Chemistry, Mathematics
  // ========================
  {
    id: "setup-c11-phy",
    courseId: "cbse",
    classId: "6",
    subjectId: "1",
    subjectName: "Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "phy-11-1", chapterName: "Physical World", plannedHours: 4, order: 1 },
      { chapterId: "phy-11-2", chapterName: "Units and Measurements", plannedHours: 8, order: 2 },
      { chapterId: "phy-11-3", chapterName: "Motion in a Straight Line", plannedHours: 10, order: 3 },
      { chapterId: "phy-11-4", chapterName: "Motion in a Plane", plannedHours: 12, order: 4 },
      { chapterId: "phy-11-5", chapterName: "Laws of Motion", plannedHours: 14, order: 5 },
      { chapterId: "phy-11-6", chapterName: "Work, Energy and Power", plannedHours: 12, order: 6 },
      { chapterId: "phy-11-7", chapterName: "System of Particles and Rotational Motion", plannedHours: 14, order: 7 },
      { chapterId: "phy-11-8", chapterName: "Gravitation", plannedHours: 10, order: 8 },
      { chapterId: "phy-11-9", chapterName: "Mechanical Properties of Solids", plannedHours: 8, order: 9 },
      { chapterId: "phy-11-10", chapterName: "Mechanical Properties of Fluids", plannedHours: 10, order: 10 },
      { chapterId: "phy-11-11", chapterName: "Thermal Properties of Matter", plannedHours: 10, order: 11 },
      { chapterId: "phy-11-12", chapterName: "Thermodynamics", plannedHours: 12, order: 12 },
      { chapterId: "phy-11-13", chapterName: "Kinetic Theory", plannedHours: 8, order: 13 },
      { chapterId: "phy-11-14", chapterName: "Oscillations", plannedHours: 10, order: 14 },
      { chapterId: "phy-11-15", chapterName: "Waves", plannedHours: 12, order: 15 },
    ],
    totalPlannedHours: 154,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c11-che",
    courseId: "cbse",
    classId: "6",
    subjectId: "2",
    subjectName: "Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "che-11-1", chapterName: "Some Basic Concepts of Chemistry", plannedHours: 10, order: 1 },
      { chapterId: "che-11-2", chapterName: "Structure of Atom", plannedHours: 12, order: 2 },
      { chapterId: "che-11-3", chapterName: "Classification of Elements and Periodicity in Properties", plannedHours: 10, order: 3 },
      { chapterId: "che-11-4", chapterName: "Chemical Bonding and Molecular Structure", plannedHours: 14, order: 4 },
      { chapterId: "che-11-5", chapterName: "States of Matter", plannedHours: 10, order: 5 },
      { chapterId: "che-11-6", chapterName: "Thermodynamics", plannedHours: 12, order: 6 },
      { chapterId: "che-11-7", chapterName: "Equilibrium", plannedHours: 14, order: 7 },
      { chapterId: "che-11-8", chapterName: "Redox Reactions", plannedHours: 8, order: 8 },
      { chapterId: "che-11-9", chapterName: "Hydrogen", plannedHours: 6, order: 9 },
      { chapterId: "che-11-10", chapterName: "The s-Block Elements", plannedHours: 8, order: 10 },
      { chapterId: "che-11-11", chapterName: "The p-Block Elements", plannedHours: 10, order: 11 },
      { chapterId: "che-11-12", chapterName: "Organic Chemistry - Some Basic Principles and Techniques", plannedHours: 14, order: 12 },
      { chapterId: "che-11-13", chapterName: "Hydrocarbons", plannedHours: 12, order: 13 },
      { chapterId: "che-11-14", chapterName: "Environmental Chemistry", plannedHours: 6, order: 14 },
    ],
    totalPlannedHours: 146,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c11-mat",
    courseId: "cbse",
    classId: "6",
    subjectId: "3",
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-11-1", chapterName: "Sets", plannedHours: 10, order: 1 },
      { chapterId: "mat-11-2", chapterName: "Relations and Functions", plannedHours: 12, order: 2 },
      { chapterId: "mat-11-3", chapterName: "Trigonometric Functions", plannedHours: 14, order: 3 },
      { chapterId: "mat-11-4", chapterName: "Principle of Mathematical Induction", plannedHours: 8, order: 4 },
      { chapterId: "mat-11-5", chapterName: "Complex Numbers and Quadratic Equations", plannedHours: 12, order: 5 },
      { chapterId: "mat-11-6", chapterName: "Linear Inequalities", plannedHours: 8, order: 6 },
      { chapterId: "mat-11-7", chapterName: "Permutations and Combinations", plannedHours: 12, order: 7 },
      { chapterId: "mat-11-8", chapterName: "Binomial Theorem", plannedHours: 10, order: 8 },
      { chapterId: "mat-11-9", chapterName: "Sequences and Series", plannedHours: 12, order: 9 },
      { chapterId: "mat-11-10", chapterName: "Straight Lines", plannedHours: 10, order: 10 },
      { chapterId: "mat-11-11", chapterName: "Conic Sections", plannedHours: 14, order: 11 },
      { chapterId: "mat-11-12", chapterName: "Introduction to Three Dimensional Geometry", plannedHours: 8, order: 12 },
      { chapterId: "mat-11-13", chapterName: "Limits and Derivatives", plannedHours: 14, order: 13 },
      { chapterId: "mat-11-14", chapterName: "Mathematical Reasoning", plannedHours: 6, order: 14 },
      { chapterId: "mat-11-15", chapterName: "Statistics", plannedHours: 8, order: 15 },
      { chapterId: "mat-11-16", chapterName: "Probability", plannedHours: 10, order: 16 },
    ],
    totalPlannedHours: 168,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c11-his",
    courseId: "cbse",
    classId: "6",
    subjectId: "5",
    subjectName: "History",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "his-11-1", chapterName: "From the Beginning of Time", plannedHours: 6, order: 1 },
      { chapterId: "his-11-2", chapterName: "Writing and City Life", plannedHours: 6, order: 2 },
      { chapterId: "his-11-3", chapterName: "An Empire Across Three Continents", plannedHours: 6, order: 3 },
      { chapterId: "his-11-4", chapterName: "The Central Islamic Lands", plannedHours: 6, order: 4 },
      { chapterId: "his-11-5", chapterName: "Nomadic Empires", plannedHours: 6, order: 5 },
    ],
    totalPlannedHours: 30,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // CLASS 12 (classId: "7") - Physics, Chemistry, Mathematics
  // ========================
  {
    id: "setup-c12-phy",
    courseId: "cbse",
    classId: "7",
    subjectId: "1",
    subjectName: "Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "phy-12-1", chapterName: "Electric Charges and Fields", plannedHours: 12, order: 1 },
      { chapterId: "phy-12-2", chapterName: "Electrostatic Potential and Capacitance", plannedHours: 12, order: 2 },
      { chapterId: "phy-12-3", chapterName: "Current Electricity", plannedHours: 14, order: 3 },
      { chapterId: "phy-12-4", chapterName: "Moving Charges and Magnetism", plannedHours: 12, order: 4 },
      { chapterId: "phy-12-5", chapterName: "Magnetism and Matter", plannedHours: 8, order: 5 },
      { chapterId: "phy-12-6", chapterName: "Electromagnetic Induction", plannedHours: 10, order: 6 },
      { chapterId: "phy-12-7", chapterName: "Alternating Current", plannedHours: 10, order: 7 },
      { chapterId: "phy-12-8", chapterName: "Electromagnetic Waves", plannedHours: 6, order: 8 },
      { chapterId: "phy-12-9", chapterName: "Ray Optics and Optical Instruments", plannedHours: 14, order: 9 },
      { chapterId: "phy-12-10", chapterName: "Wave Optics", plannedHours: 10, order: 10 },
      { chapterId: "phy-12-11", chapterName: "Dual Nature of Radiation and Matter", plannedHours: 8, order: 11 },
      { chapterId: "phy-12-12", chapterName: "Atoms", plannedHours: 8, order: 12 },
      { chapterId: "phy-12-13", chapterName: "Nuclei", plannedHours: 8, order: 13 },
      { chapterId: "phy-12-14", chapterName: "Semiconductor Electronics: Materials, Devices and Simple Circuits", plannedHours: 12, order: 14 },
    ],
    totalPlannedHours: 144,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c12-che",
    courseId: "cbse",
    classId: "7",
    subjectId: "2",
    subjectName: "Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "che-12-1", chapterName: "The Solid State", plannedHours: 10, order: 1 },
      { chapterId: "che-12-2", chapterName: "Solutions", plannedHours: 12, order: 2 },
      { chapterId: "che-12-3", chapterName: "Electrochemistry", plannedHours: 12, order: 3 },
      { chapterId: "che-12-4", chapterName: "Chemical Kinetics", plannedHours: 10, order: 4 },
      { chapterId: "che-12-5", chapterName: "Surface Chemistry", plannedHours: 6, order: 5 },
      { chapterId: "che-12-6", chapterName: "General Principles and Processes of Isolation of Elements", plannedHours: 6, order: 6 },
      { chapterId: "che-12-7", chapterName: "The p-Block Elements", plannedHours: 12, order: 7 },
      { chapterId: "che-12-8", chapterName: "The d- and f-Block Elements", plannedHours: 10, order: 8 },
      { chapterId: "che-12-9", chapterName: "Coordination Compounds", plannedHours: 12, order: 9 },
      { chapterId: "che-12-10", chapterName: "Haloalkanes and Haloarenes", plannedHours: 10, order: 10 },
      { chapterId: "che-12-11", chapterName: "Alcohols, Phenols and Ethers", plannedHours: 10, order: 11 },
      { chapterId: "che-12-12", chapterName: "Aldehydes, Ketones and Carboxylic Acids", plannedHours: 14, order: 12 },
      { chapterId: "che-12-13", chapterName: "Amines", plannedHours: 8, order: 13 },
      { chapterId: "che-12-14", chapterName: "Biomolecules", plannedHours: 8, order: 14 },
      { chapterId: "che-12-15", chapterName: "Polymers", plannedHours: 6, order: 15 },
      { chapterId: "che-12-16", chapterName: "Chemistry in Everyday Life", plannedHours: 4, order: 16 },
    ],
    totalPlannedHours: 150,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c12-mat",
    courseId: "cbse",
    classId: "7",
    subjectId: "3",
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "mat-12-1", chapterName: "Relations and Functions", plannedHours: 12, order: 1 },
      { chapterId: "mat-12-2", chapterName: "Inverse Trigonometric Functions", plannedHours: 10, order: 2 },
      { chapterId: "mat-12-3", chapterName: "Matrices", plannedHours: 14, order: 3 },
      { chapterId: "mat-12-4", chapterName: "Determinants", plannedHours: 14, order: 4 },
      { chapterId: "mat-12-5", chapterName: "Continuity and Differentiability", plannedHours: 14, order: 5 },
      { chapterId: "mat-12-6", chapterName: "Application of Derivatives", plannedHours: 12, order: 6 },
      { chapterId: "mat-12-7", chapterName: "Integrals", plannedHours: 18, order: 7 },
      { chapterId: "mat-12-8", chapterName: "Application of Integrals", plannedHours: 10, order: 8 },
      { chapterId: "mat-12-9", chapterName: "Differential Equations", plannedHours: 12, order: 9 },
      { chapterId: "mat-12-10", chapterName: "Vector Algebra", plannedHours: 10, order: 10 },
      { chapterId: "mat-12-11", chapterName: "Three Dimensional Geometry", plannedHours: 12, order: 11 },
      { chapterId: "mat-12-12", chapterName: "Linear Programming", plannedHours: 8, order: 12 },
      { chapterId: "mat-12-13", chapterName: "Probability", plannedHours: 12, order: 13 },
    ],
    totalPlannedHours: 158,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-c12-his",
    courseId: "cbse",
    classId: "7",
    subjectId: "5",
    subjectName: "History",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "his-12-1", chapterName: "Bricks, Beads and Bones", plannedHours: 7, order: 1 },
      { chapterId: "his-12-2", chapterName: "Kings, Farmers and Towns", plannedHours: 7, order: 2 },
      { chapterId: "his-12-3", chapterName: "Kinship, Caste and Class", plannedHours: 6, order: 3 },
      { chapterId: "his-12-4", chapterName: "Thinkers, Beliefs and Buildings", plannedHours: 6, order: 4 },
      { chapterId: "his-12-5", chapterName: "Through the Eyes of Travellers", plannedHours: 6, order: 5 },
    ],
    totalPlannedHours: 32,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },

  // ========================
  // JEE MAINS SETUPS (courseId: "jee-mains")
  // Uses same class IDs "6" and "7" for Class 11 and 12
  // JEE-specific subject IDs: jee_phy, jee_che, jee_mat
  // ========================
  {
    id: "setup-jee-11-phy",
    courseId: "jee-mains",
    classId: "6",
    subjectId: "jee_phy",
    subjectName: "Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-phy-11-1", chapterName: "Physical World", plannedHours: 4, order: 1 },
      { chapterId: "jee-phy-11-2", chapterName: "Units and Measurements", plannedHours: 10, order: 2 },
      { chapterId: "jee-phy-11-3", chapterName: "Motion in a Straight Line", plannedHours: 12, order: 3 },
      { chapterId: "jee-phy-11-4", chapterName: "Motion in a Plane", plannedHours: 14, order: 4 },
      { chapterId: "jee-phy-11-5", chapterName: "Laws of Motion", plannedHours: 16, order: 5 },
      { chapterId: "jee-phy-11-6", chapterName: "Work, Energy and Power", plannedHours: 14, order: 6 },
      { chapterId: "jee-phy-11-7", chapterName: "System of Particles and Rotational Motion", plannedHours: 18, order: 7 },
      { chapterId: "jee-phy-11-8", chapterName: "Gravitation", plannedHours: 12, order: 8 },
      { chapterId: "jee-phy-11-9", chapterName: "Mechanical Properties of Solids", plannedHours: 8, order: 9 },
      { chapterId: "jee-phy-11-10", chapterName: "Mechanical Properties of Fluids", plannedHours: 12, order: 10 },
      { chapterId: "jee-phy-11-11", chapterName: "Thermal Properties of Matter", plannedHours: 10, order: 11 },
      { chapterId: "jee-phy-11-12", chapterName: "Thermodynamics", plannedHours: 14, order: 12 },
      { chapterId: "jee-phy-11-13", chapterName: "Kinetic Theory", plannedHours: 10, order: 13 },
      { chapterId: "jee-phy-11-14", chapterName: "Oscillations", plannedHours: 12, order: 14 },
      { chapterId: "jee-phy-11-15", chapterName: "Waves", plannedHours: 14, order: 15 },
    ],
    totalPlannedHours: 180,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee-11-che",
    courseId: "jee-mains",
    classId: "6",
    subjectId: "jee_che",
    subjectName: "Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-che-11-1", chapterName: "Some Basic Concepts of Chemistry", plannedHours: 12, order: 1 },
      { chapterId: "jee-che-11-2", chapterName: "Structure of Atom", plannedHours: 14, order: 2 },
      { chapterId: "jee-che-11-3", chapterName: "Classification of Elements and Periodicity", plannedHours: 10, order: 3 },
      { chapterId: "jee-che-11-4", chapterName: "Chemical Bonding and Molecular Structure", plannedHours: 16, order: 4 },
      { chapterId: "jee-che-11-5", chapterName: "States of Matter", plannedHours: 10, order: 5 },
      { chapterId: "jee-che-11-6", chapterName: "Thermodynamics", plannedHours: 14, order: 6 },
      { chapterId: "jee-che-11-7", chapterName: "Equilibrium", plannedHours: 16, order: 7 },
      { chapterId: "jee-che-11-8", chapterName: "Redox Reactions", plannedHours: 8, order: 8 },
      { chapterId: "jee-che-11-9", chapterName: "Hydrogen", plannedHours: 6, order: 9 },
      { chapterId: "jee-che-11-10", chapterName: "The s-Block Elements", plannedHours: 8, order: 10 },
      { chapterId: "jee-che-11-11", chapterName: "The p-Block Elements", plannedHours: 12, order: 11 },
      { chapterId: "jee-che-11-12", chapterName: "Organic Chemistry Basics", plannedHours: 16, order: 12 },
      { chapterId: "jee-che-11-13", chapterName: "Hydrocarbons", plannedHours: 14, order: 13 },
      { chapterId: "jee-che-11-14", chapterName: "Environmental Chemistry", plannedHours: 4, order: 14 },
    ],
    totalPlannedHours: 160,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee-11-mat",
    courseId: "jee-mains",
    classId: "6",
    subjectId: "jee_mat",
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-mat-11-1", chapterName: "Sets", plannedHours: 10, order: 1 },
      { chapterId: "jee-mat-11-2", chapterName: "Relations and Functions", plannedHours: 14, order: 2 },
      { chapterId: "jee-mat-11-3", chapterName: "Trigonometric Functions", plannedHours: 16, order: 3 },
      { chapterId: "jee-mat-11-4", chapterName: "Mathematical Induction", plannedHours: 10, order: 4 },
      { chapterId: "jee-mat-11-5", chapterName: "Complex Numbers and Quadratic Equations", plannedHours: 16, order: 5 },
      { chapterId: "jee-mat-11-6", chapterName: "Linear Inequalities", plannedHours: 8, order: 6 },
      { chapterId: "jee-mat-11-7", chapterName: "Permutations and Combinations", plannedHours: 14, order: 7 },
      { chapterId: "jee-mat-11-8", chapterName: "Binomial Theorem", plannedHours: 12, order: 8 },
      { chapterId: "jee-mat-11-9", chapterName: "Sequences and Series", plannedHours: 14, order: 9 },
      { chapterId: "jee-mat-11-10", chapterName: "Straight Lines", plannedHours: 12, order: 10 },
      { chapterId: "jee-mat-11-11", chapterName: "Conic Sections", plannedHours: 18, order: 11 },
      { chapterId: "jee-mat-11-12", chapterName: "3D Geometry Introduction", plannedHours: 10, order: 12 },
      { chapterId: "jee-mat-11-13", chapterName: "Limits and Derivatives", plannedHours: 16, order: 13 },
      { chapterId: "jee-mat-11-14", chapterName: "Statistics", plannedHours: 8, order: 14 },
      { chapterId: "jee-mat-11-15", chapterName: "Probability", plannedHours: 12, order: 15 },
    ],
    totalPlannedHours: 190,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee-12-phy",
    courseId: "jee-mains",
    classId: "7",
    subjectId: "jee_phy",
    subjectName: "Physics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-phy-12-1", chapterName: "Electric Charges and Fields", plannedHours: 14, order: 1 },
      { chapterId: "jee-phy-12-2", chapterName: "Electrostatic Potential and Capacitance", plannedHours: 14, order: 2 },
      { chapterId: "jee-phy-12-3", chapterName: "Current Electricity", plannedHours: 16, order: 3 },
      { chapterId: "jee-phy-12-4", chapterName: "Moving Charges and Magnetism", plannedHours: 14, order: 4 },
      { chapterId: "jee-phy-12-5", chapterName: "Magnetism and Matter", plannedHours: 8, order: 5 },
      { chapterId: "jee-phy-12-6", chapterName: "Electromagnetic Induction", plannedHours: 12, order: 6 },
      { chapterId: "jee-phy-12-7", chapterName: "Alternating Current", plannedHours: 12, order: 7 },
      { chapterId: "jee-phy-12-8", chapterName: "Electromagnetic Waves", plannedHours: 6, order: 8 },
      { chapterId: "jee-phy-12-9", chapterName: "Ray Optics", plannedHours: 16, order: 9 },
      { chapterId: "jee-phy-12-10", chapterName: "Wave Optics", plannedHours: 12, order: 10 },
      { chapterId: "jee-phy-12-11", chapterName: "Dual Nature of Radiation and Matter", plannedHours: 10, order: 11 },
      { chapterId: "jee-phy-12-12", chapterName: "Atoms", plannedHours: 10, order: 12 },
      { chapterId: "jee-phy-12-13", chapterName: "Nuclei", plannedHours: 10, order: 13 },
      { chapterId: "jee-phy-12-14", chapterName: "Semiconductor Electronics", plannedHours: 14, order: 14 },
    ],
    totalPlannedHours: 168,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee-12-che",
    courseId: "jee-mains",
    classId: "7",
    subjectId: "jee_che",
    subjectName: "Chemistry",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-che-12-1", chapterName: "The Solid State", plannedHours: 12, order: 1 },
      { chapterId: "jee-che-12-2", chapterName: "Solutions", plannedHours: 14, order: 2 },
      { chapterId: "jee-che-12-3", chapterName: "Electrochemistry", plannedHours: 14, order: 3 },
      { chapterId: "jee-che-12-4", chapterName: "Chemical Kinetics", plannedHours: 12, order: 4 },
      { chapterId: "jee-che-12-5", chapterName: "Surface Chemistry", plannedHours: 8, order: 5 },
      { chapterId: "jee-che-12-6", chapterName: "Isolation of Elements", plannedHours: 6, order: 6 },
      { chapterId: "jee-che-12-7", chapterName: "The p-Block Elements", plannedHours: 14, order: 7 },
      { chapterId: "jee-che-12-8", chapterName: "The d- and f-Block Elements", plannedHours: 12, order: 8 },
      { chapterId: "jee-che-12-9", chapterName: "Coordination Compounds", plannedHours: 14, order: 9 },
      { chapterId: "jee-che-12-10", chapterName: "Haloalkanes and Haloarenes", plannedHours: 12, order: 10 },
      { chapterId: "jee-che-12-11", chapterName: "Alcohols, Phenols and Ethers", plannedHours: 12, order: 11 },
      { chapterId: "jee-che-12-12", chapterName: "Aldehydes, Ketones and Carboxylic Acids", plannedHours: 16, order: 12 },
      { chapterId: "jee-che-12-13", chapterName: "Amines", plannedHours: 10, order: 13 },
      { chapterId: "jee-che-12-14", chapterName: "Biomolecules", plannedHours: 8, order: 14 },
      { chapterId: "jee-che-12-15", chapterName: "Polymers", plannedHours: 6, order: 15 },
    ],
    totalPlannedHours: 170,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
  },
  {
    id: "setup-jee-12-mat",
    courseId: "jee-mains",
    classId: "7",
    subjectId: "jee_mat",
    subjectName: "Mathematics",
    academicYear: "2025-26",
    chapters: [
      { chapterId: "jee-mat-12-1", chapterName: "Relations and Functions", plannedHours: 14, order: 1 },
      { chapterId: "jee-mat-12-2", chapterName: "Inverse Trigonometric Functions", plannedHours: 12, order: 2 },
      { chapterId: "jee-mat-12-3", chapterName: "Matrices", plannedHours: 16, order: 3 },
      { chapterId: "jee-mat-12-4", chapterName: "Determinants", plannedHours: 16, order: 4 },
      { chapterId: "jee-mat-12-5", chapterName: "Continuity and Differentiability", plannedHours: 16, order: 5 },
      { chapterId: "jee-mat-12-6", chapterName: "Application of Derivatives", plannedHours: 14, order: 6 },
      { chapterId: "jee-mat-12-7", chapterName: "Integrals", plannedHours: 20, order: 7 },
      { chapterId: "jee-mat-12-8", chapterName: "Application of Integrals", plannedHours: 12, order: 8 },
      { chapterId: "jee-mat-12-9", chapterName: "Differential Equations", plannedHours: 14, order: 9 },
      { chapterId: "jee-mat-12-10", chapterName: "Vector Algebra", plannedHours: 12, order: 10 },
      { chapterId: "jee-mat-12-11", chapterName: "Three Dimensional Geometry", plannedHours: 14, order: 11 },
      { chapterId: "jee-mat-12-12", chapterName: "Linear Programming", plannedHours: 8, order: 12 },
      { chapterId: "jee-mat-12-13", chapterName: "Probability", plannedHours: 14, order: 13 },
    ],
    totalPlannedHours: 182,
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01",
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
    overallStatus: "in_progress", percentComplete: 58, lostDays: 3,
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
    overallStatus: "in_progress", percentComplete: 65, lostDays: 1,
    lostDaysReasons: [{ reason: "student_event", count: 1 }],
  },
  {
    batchId: "batch-1", batchName: "Class 10 - Section A",
    subjectId: "cs", subjectName: "Computer Science",
    totalPlannedHours: 38, totalActualHours: 20,
    chaptersCompleted: 2, totalChapters: 4,
    currentChapter: "cs-10-3", currentChapterName: "CSS Styling",
    overallStatus: "in_progress", percentComplete: 53, lostDays: 2,
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
    overallStatus: "in_progress", percentComplete: 62, lostDays: 2,
    lostDaysReasons: [{ reason: "exam", count: 2 }],
  },
  {
    batchId: "batch-2", batchName: "Class 10 - Section B",
    subjectId: "che", subjectName: "Chemistry",
    totalPlannedHours: 32, totalActualHours: 18,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "che-10-3", currentChapterName: "Metals and Non-metals",
    overallStatus: "in_progress", percentComplete: 56, lostDays: 3,
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
    overallStatus: "in_progress", percentComplete: 63, lostDays: 2,
    lostDaysReasons: [{ reason: "student_event", count: 2 }],
  },
  {
    batchId: "batch-3", batchName: "Class 9 - Section A",
    subjectId: "hin", subjectName: "Hindi",
    totalPlannedHours: 24, totalActualHours: 16,
    chaptersCompleted: 3, totalChapters: 4,
    currentChapter: "hin-9-4", currentChapterName: "साँवले सपनों की याद",
    overallStatus: "in_progress", percentComplete: 67, lostDays: 1,
    lostDaysReasons: [{ reason: "teacher_absent", count: 1 }],
  },
  {
    batchId: "batch-3", batchName: "Class 9 - Section A",
    subjectId: "sst", subjectName: "Social Studies",
    totalPlannedHours: 30, totalActualHours: 18,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "sst-9-3", currentChapterName: "Nazism and the Rise of Hitler",
    overallStatus: "in_progress", percentComplete: 60, lostDays: 2,
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
    overallStatus: "in_progress", percentComplete: 67, lostDays: 1,
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
    overallStatus: "in_progress", percentComplete: 70, lostDays: 1,
    lostDaysReasons: [{ reason: "student_event", count: 1 }],
  },
  {
    batchId: "batch-5", batchName: "Class 8 - Section A",
    subjectId: "hin", subjectName: "Hindi",
    totalPlannedHours: 16, totalActualHours: 10,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "hin-8-3", currentChapterName: "बस की यात्रा",
    overallStatus: "in_progress", percentComplete: 63, lostDays: 2,
    lostDaysReasons: [{ reason: "teacher_absent", count: 2 }],
  },
  {
    batchId: "batch-5", batchName: "Class 8 - Section A",
    subjectId: "sst", subjectName: "Social Studies",
    totalPlannedHours: 22, totalActualHours: 14,
    chaptersCompleted: 2, totalChapters: 3,
    currentChapter: "sst-8-3", currentChapterName: "Ruling the Countryside",
    overallStatus: "in_progress", percentComplete: 64, lostDays: 2,
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
        overallStatus: "in_progress", percentComplete: 70, lostDays: 2,
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
        overallStatus: "in_progress", percentComplete: 63, lostDays: 3,
        lostDaysReasons: [{ reason: "teacher_absent", count: 2 }, { reason: "holiday", count: 1 }],
      },
      {
        batchId: "batch-7", batchName: "Class 11 - Section B (JEE)",
        subjectId: "che", subjectName: "Chemistry",
        totalPlannedHours: 32, totalActualHours: 22,
        chaptersCompleted: 2, totalChapters: 3,
        currentChapter: "che-11-3", currentChapterName: "Classification of Elements",
        overallStatus: "in_progress", percentComplete: 69, lostDays: 1,
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
        overallStatus: "in_progress", percentComplete: 77, lostDays: 1,
        lostDaysReasons: [{ reason: "holiday", count: 1 }],
      },
      {
        batchId: "batch-8", batchName: "Class 12 - Section A (JEE)",
        subjectId: "che", subjectName: "Chemistry",
        totalPlannedHours: 30, totalActualHours: 22,
        chaptersCompleted: 2, totalChapters: 3,
        currentChapter: "che-12-3", currentChapterName: "Electrochemistry",
        overallStatus: "in_progress", percentComplete: 73, lostDays: 1,
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
