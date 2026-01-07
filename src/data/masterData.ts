import { Curriculum, Course, Chapter, CourseChapterMapping } from "@/types/masterData";

// ============================================
// CURRICULUMS
// ============================================
export const curriculums: Curriculum[] = [
  { 
    id: "cbse", 
    name: "CBSE", 
    code: "CBSE", 
    description: "Central Board of Secondary Education",
    isActive: true 
  },
  { 
    id: "icse", 
    name: "ICSE", 
    code: "ICSE", 
    description: "Indian Certificate of Secondary Education",
    isActive: true 
  },
  { 
    id: "igcse", 
    name: "IGCSE", 
    code: "IGCSE", 
    description: "Cambridge International General Certificate of Secondary Education",
    isActive: true 
  },
  { 
    id: "state-ap", 
    name: "AP State Board", 
    code: "APSB", 
    description: "Andhra Pradesh State Board of Intermediate Education",
    isActive: true 
  },
  { 
    id: "state-ts", 
    name: "Telangana State Board", 
    code: "TSSB", 
    description: "Telangana State Board of Intermediate Education",
    isActive: false 
  },
];

// ============================================
// COURSES (Competitive, Foundation, etc.)
// ============================================
export const courses: Course[] = [
  { 
    id: "jee-foundation", 
    name: "IIT-JEE Foundation", 
    code: "JEEF",
    description: "Foundation course for IIT-JEE preparation (Class 9-10)",
    courseType: "foundation",
    allowedCurriculums: ["cbse", "icse"],
    allowedClasses: ["4", "5"], // Class 9, 10
    status: "published",
    isActive: true
  },
  { 
    id: "jee-mains", 
    name: "IIT-JEE Mains", 
    code: "JEEM",
    description: "Joint Entrance Examination Main for engineering admissions",
    courseType: "competitive",
    allowedCurriculums: ["cbse", "icse"],
    allowedClasses: ["6", "7"], // Class 11, 12
    status: "published",
    isActive: true
  },
  { 
    id: "jee-advanced", 
    name: "IIT-JEE Advanced", 
    code: "JEEA",
    description: "Joint Entrance Examination Advanced for IIT admissions",
    courseType: "competitive",
    allowedCurriculums: ["cbse", "icse"],
    allowedClasses: ["6", "7"], // Class 11, 12
    status: "published",
    isActive: true
  },
  { 
    id: "neet", 
    name: "NEET", 
    code: "NEET",
    description: "National Eligibility cum Entrance Test for medical admissions",
    courseType: "competitive",
    allowedCurriculums: ["cbse", "icse"],
    allowedClasses: ["6", "7"], // Class 11, 12
    status: "published",
    isActive: true
  },
  { 
    id: "neet-foundation", 
    name: "NEET Foundation", 
    code: "NEETF",
    description: "Foundation course for NEET preparation (Class 9-10)",
    courseType: "foundation",
    allowedCurriculums: ["cbse", "icse"],
    allowedClasses: ["4", "5"], // Class 9, 10
    status: "published",
    isActive: true
  },
  { 
    id: "olympiad-math", 
    name: "Mathematics Olympiad", 
    code: "MATHO",
    description: "International Mathematical Olympiad preparation",
    courseType: "olympiad",
    allowedCurriculums: ["cbse", "icse", "igcse"],
    allowedClasses: ["4", "5", "6", "7"], // Class 9-12
    status: "draft",
    isActive: true
  },
  { 
    id: "olympiad-science", 
    name: "Science Olympiad", 
    code: "SCIO",
    description: "National/International Science Olympiad preparation",
    courseType: "olympiad",
    allowedCurriculums: ["cbse", "icse"],
    allowedClasses: ["1", "2", "3", "4", "5"], // Class 6-10
    status: "draft",
    isActive: true
  },
];

// ============================================
// COURSE-OWNED CHAPTERS (The 20%)
// These chapters exist ONLY within courses, not in curriculum tree
// ============================================
export const courseOwnedChapters: Chapter[] = [
  // JEE Advanced specific chapters
  { 
    id: "jee-adv-mech", 
    name: "Advanced Mechanics - Problem Solving", 
    courseId: "jee-advanced",
    subjectId: "1", // Physics
    isCourseOwned: true,
    order: 1
  },
  { 
    id: "jee-adv-calc", 
    name: "Calculus-Based Physics Problems", 
    courseId: "jee-advanced",
    subjectId: "1", // Physics
    isCourseOwned: true,
    order: 2
  },
  { 
    id: "jee-adv-multi", 
    name: "Multi-Concept Practice Sets", 
    courseId: "jee-advanced",
    subjectId: "1", // Physics
    isCourseOwned: true,
    order: 3
  },
  
  // JEE Mains specific chapters
  { 
    id: "jee-math-tools", 
    name: "Mathematical Tools for JEE", 
    courseId: "jee-mains",
    subjectId: "3", // Mathematics
    isCourseOwned: true,
    order: 1
  },
  { 
    id: "jee-problem-strat", 
    name: "Problem Solving Strategies", 
    courseId: "jee-mains",
    subjectId: "3", // Mathematics
    isCourseOwned: true,
    order: 2
  },
  
  // JEE Foundation specific chapters
  { 
    id: "jeef-mental-math", 
    name: "Mental Mathematics & Shortcuts", 
    courseId: "jee-foundation",
    subjectId: "3", // Mathematics
    isCourseOwned: true,
    order: 1
  },
  { 
    id: "jeef-aptitude", 
    name: "Aptitude & Logical Reasoning", 
    courseId: "jee-foundation",
    subjectId: "3", // Mathematics
    isCourseOwned: true,
    order: 2
  },
  
  // NEET specific chapters
  { 
    id: "neet-bio-diagrams", 
    name: "Diagram-Based Questions in Biology", 
    courseId: "neet",
    subjectId: "4", // Biology (assuming ID)
    isCourseOwned: true,
    order: 1
  },
  { 
    id: "neet-assertion", 
    name: "Assertion-Reason Practice", 
    courseId: "neet",
    subjectId: "4", // Biology
    isCourseOwned: true,
    order: 2
  },
  
  // Olympiad specific chapters
  { 
    id: "oly-number-theory", 
    name: "Advanced Number Theory", 
    courseId: "olympiad-math",
    subjectId: "3", // Mathematics
    isCourseOwned: true,
    order: 1
  },
  { 
    id: "oly-combinatorics", 
    name: "Combinatorics & Counting", 
    courseId: "olympiad-math",
    subjectId: "3", // Mathematics
    isCourseOwned: true,
    order: 2
  },
  { 
    id: "oly-geometry", 
    name: "Advanced Euclidean Geometry", 
    courseId: "olympiad-math",
    subjectId: "3", // Mathematics
    isCourseOwned: true,
    order: 3
  },
];

// ============================================
// COURSE-CHAPTER MAPPINGS (The 80%)
// Links curriculum chapters to courses
// ============================================
export const courseChapterMappings: CourseChapterMapping[] = [
  // JEE Mains - Physics from CBSE Class 11
  { id: "ccm-1", courseId: "jee-mains", chapterId: "phy-11-2", sourceCurriculumId: "cbse", order: 1 }, // Units and Measurements
  { id: "ccm-2", courseId: "jee-mains", chapterId: "phy-11-3", sourceCurriculumId: "cbse", order: 2 }, // Motion in a Straight Line
  { id: "ccm-3", courseId: "jee-mains", chapterId: "phy-11-4", sourceCurriculumId: "cbse", order: 3 }, // Motion in a Plane
  { id: "ccm-4", courseId: "jee-mains", chapterId: "phy-11-5", sourceCurriculumId: "cbse", order: 4 }, // Laws of Motion
  { id: "ccm-5", courseId: "jee-mains", chapterId: "phy-11-6", sourceCurriculumId: "cbse", order: 5 }, // Work, Energy and Power
  { id: "ccm-6", courseId: "jee-mains", chapterId: "phy-11-7", sourceCurriculumId: "cbse", order: 6 }, // System of Particles
  { id: "ccm-7", courseId: "jee-mains", chapterId: "phy-11-8", sourceCurriculumId: "cbse", order: 7 }, // Gravitation
  
  // JEE Mains - Physics from CBSE Class 12
  { id: "ccm-8", courseId: "jee-mains", chapterId: "phy-12-1", sourceCurriculumId: "cbse", order: 8 }, // Electric Charges and Fields
  { id: "ccm-9", courseId: "jee-mains", chapterId: "phy-12-2", sourceCurriculumId: "cbse", order: 9 }, // Electrostatic Potential
  { id: "ccm-10", courseId: "jee-mains", chapterId: "phy-12-3", sourceCurriculumId: "cbse", order: 10 }, // Current Electricity
  
  // JEE Mains - Chemistry from CBSE Class 11
  { id: "ccm-11", courseId: "jee-mains", chapterId: "che-11-1", sourceCurriculumId: "cbse", order: 11 }, // Some Basic Concepts
  { id: "ccm-12", courseId: "jee-mains", chapterId: "che-11-2", sourceCurriculumId: "cbse", order: 12 }, // Structure of Atom
  { id: "ccm-13", courseId: "jee-mains", chapterId: "che-11-3", sourceCurriculumId: "cbse", order: 13 }, // Periodic Table
  
  // JEE Mains - Mathematics from CBSE Class 11
  { id: "ccm-14", courseId: "jee-mains", chapterId: "mat-11-1", sourceCurriculumId: "cbse", order: 14 }, // Sets
  { id: "ccm-15", courseId: "jee-mains", chapterId: "mat-11-2", sourceCurriculumId: "cbse", order: 15 }, // Relations and Functions
  { id: "ccm-16", courseId: "jee-mains", chapterId: "mat-11-3", sourceCurriculumId: "cbse", order: 16 }, // Trigonometric Functions
  
  // JEE Advanced - inherits JEE Mains + more
  { id: "ccm-17", courseId: "jee-advanced", chapterId: "phy-11-3", sourceCurriculumId: "cbse", order: 1 },
  { id: "ccm-18", courseId: "jee-advanced", chapterId: "phy-11-4", sourceCurriculumId: "cbse", order: 2 },
  { id: "ccm-19", courseId: "jee-advanced", chapterId: "phy-11-5", sourceCurriculumId: "cbse", order: 3 },
  { id: "ccm-20", courseId: "jee-advanced", chapterId: "mat-12-5", sourceCurriculumId: "cbse", order: 4 }, // Continuity & Differentiability
  { id: "ccm-21", courseId: "jee-advanced", chapterId: "mat-12-7", sourceCurriculumId: "cbse", order: 5 }, // Integrals
  
  // NEET - Biology focused
  { id: "ccm-22", courseId: "neet", chapterId: "phy-11-3", sourceCurriculumId: "cbse", order: 1 },
  { id: "ccm-23", courseId: "neet", chapterId: "che-11-1", sourceCurriculumId: "cbse", order: 2 },
  { id: "ccm-24", courseId: "neet", chapterId: "che-11-12", sourceCurriculumId: "cbse", order: 3 }, // Organic Chemistry
  
  // JEE Foundation - from Class 9 & 10
  { id: "ccm-25", courseId: "jee-foundation", chapterId: "mat-9-1", sourceCurriculumId: "cbse", order: 1 }, // Number Systems
  { id: "ccm-26", courseId: "jee-foundation", chapterId: "mat-9-2", sourceCurriculumId: "cbse", order: 2 }, // Polynomials
  { id: "ccm-27", courseId: "jee-foundation", chapterId: "mat-10-4", sourceCurriculumId: "cbse", order: 3 }, // Quadratic Equations
  { id: "ccm-28", courseId: "jee-foundation", chapterId: "mat-10-8", sourceCurriculumId: "cbse", order: 4 }, // Trigonometry
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get curriculum by ID
export const getCurriculumById = (id: string): Curriculum | undefined => {
  return curriculums.find(c => c.id === id);
};

// Get course by ID
export const getCourseById = (id: string): Course | undefined => {
  return courses.find(c => c.id === id);
};

// Get all chapters for a course (both mapped and course-owned)
export const getChaptersForCourse = (courseId: string): string[] => {
  const mappedChapterIds = courseChapterMappings
    .filter(m => m.courseId === courseId)
    .map(m => m.chapterId);
  
  const ownedChapterIds = courseOwnedChapters
    .filter(c => c.courseId === courseId)
    .map(c => c.id);
  
  return [...mappedChapterIds, ...ownedChapterIds];
};

// Get course-owned chapters for a course
export const getCourseOwnedChapters = (courseId: string): Chapter[] => {
  return courseOwnedChapters.filter(c => c.courseId === courseId);
};

// Check if a chapter is part of a course
export const isChapterInCourse = (chapterId: string, courseId: string): boolean => {
  const inMapping = courseChapterMappings.some(
    m => m.chapterId === chapterId && m.courseId === courseId
  );
  const isOwned = courseOwnedChapters.some(
    c => c.id === chapterId && c.courseId === courseId
  );
  return inMapping || isOwned;
};

// Get active curriculums
export const getActiveCurriculums = (): Curriculum[] => {
  return curriculums.filter(c => c.isActive);
};

// Get active courses
export const getActiveCourses = (): Course[] => {
  return courses.filter(c => c.isActive);
};

// Get published courses
export const getPublishedCourses = (): Course[] => {
  return courses.filter(c => c.status === 'published' && c.isActive);
};

// Get courses by type
export const getCoursesByType = (type: Course['courseType']): Course[] => {
  return courses.filter(c => c.courseType === type && c.isActive);
};

// Stats
export const masterDataStats = {
  totalCurriculums: curriculums.filter(c => c.isActive).length,
  totalCourses: courses.filter(c => c.isActive).length,
  publishedCourses: courses.filter(c => c.status === 'published').length,
  draftCourses: courses.filter(c => c.status === 'draft').length,
  courseOwnedChapters: courseOwnedChapters.length,
  totalMappings: courseChapterMappings.length,
};
