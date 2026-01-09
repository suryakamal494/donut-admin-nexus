// Master Data - Main Entry Point
// This file re-exports commonly used items and provides lazy loading for heavy data

// Re-export types
export type { 
  Curriculum, 
  Course, 
  Chapter, 
  CourseChapterMapping 
} from '@/types/masterData';

// Re-export lightweight data (curriculums and courses are small)
export { curriculums, courses } from '@/data/masterData';

// ============================================
// Lazy Loading for Heavy Data
// ============================================

/**
 * Lazy load course-owned chapters
 */
export const getCourseOwnedChapters = async () => {
  const { courseOwnedChapters } = await import('@/data/masterData');
  return courseOwnedChapters;
};

/**
 * Lazy load course-owned chapter topics
 */
export const getCourseOwnedChapterTopics = async () => {
  const { courseOwnedChapterTopics } = await import('@/data/masterData');
  return courseOwnedChapterTopics;
};

/**
 * Lazy load course chapter mappings
 */
export const getCourseChapterMappings = async () => {
  const { courseChapterMappings } = await import('@/data/masterData');
  return courseChapterMappings;
};
