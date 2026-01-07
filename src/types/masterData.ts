// ===========================================
// MASTER DATA TYPE DEFINITIONS
// Curriculum + Course System
// ===========================================

// Curriculum (CBSE, ICSE, State Board, etc.)
export interface Curriculum {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

// Course (JEE Mains, NEET, Olympiad, etc.) - Curriculum-agnostic container
export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  courseType: 'competitive' | 'board' | 'foundation' | 'olympiad';
  allowedCurriculums: string[];  // Which curriculums can source content
  allowedClasses: string[];      // Which class levels this course covers
  status: 'draft' | 'published';
  isActive: boolean;
}

// Enhanced Chapter with Curriculum + Course ownership
export interface Chapter {
  id: string;
  name: string;
  nameHindi?: string;
  nameTransliterated?: string;
  
  // For Curriculum Chapters (80% case)
  curriculumId?: string;  // e.g., "cbse", "icse"
  classId?: string;
  subjectId: string;
  
  // For Course-Owned Chapters (20% case - exclusive to a course)
  courseId?: string;       // Only set for course-owned chapters
  isCourseOwned: boolean;  // true = belongs to course only, not in curriculum tree
  
  order: number;
}

// Topic structure remains the same
export interface Topic {
  id: string;
  name: string;
  nameHindi?: string;
  chapterId: string;
  order: number;
}

// Course-Chapter Mapping (links curriculum chapters to courses)
// This represents the 80% of content pulled from curriculum tree
export interface CourseChapterMapping {
  id: string;
  courseId: string;
  chapterId: string;
  sourceCurriculumId: string;  // Which curriculum this chapter comes from
  order: number;
}

// Content Visibility metadata for questions/content/exams
export interface ContentVisibility {
  visibleInCurriculum: boolean;       // Show in regular curriculum view
  visibleInCourses: string[];         // Array of course IDs where this is visible
}

// Source type for content creation flows
export type ContentSourceType = 'curriculum' | 'course';

// Combined chapter for UI display (includes both curriculum and course-owned)
export interface DisplayChapter extends Chapter {
  sourceLabel?: string;  // e.g., "CBSE Class 11" or "Course-Owned"
  isSelected?: boolean;  // For course builder UI
}
