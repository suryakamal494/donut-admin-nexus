// Academic Schedule Data - Main Entry Point
// This file re-exports commonly used items and provides lazy loading for heavy data

// Re-export types
export * from './types';

// Re-export week utilities (lightweight, always needed)
export { 
  academicWeeks, 
  currentWeekIndex, 
  generateAcademicWeeks,
  getWeekStatus,
  getWeekByIndex,
  getWeeksInRange
} from './weeks';

// Re-export helpers (lightweight, always needed)
export * from './helpers';

// ============================================
// Lazy Loading for Heavy Data
// These functions load data on-demand to reduce initial bundle size
// ============================================

/**
 * Lazy load academic schedule setups (heavy data)
 */
export const getAcademicScheduleSetups = async () => {
  const { academicScheduleSetups } = await import('@/data/academicScheduleData');
  return academicScheduleSetups;
};

/**
 * Lazy load weekly chapter plans (heavy data)
 */
export const getWeeklyChapterPlans = async () => {
  const { weeklyChapterPlans } = await import('@/data/academicScheduleData');
  return weeklyChapterPlans;
};

/**
 * Lazy load teaching confirmations (heavy data)
 */
export const getTeachingConfirmations = async () => {
  const { teachingConfirmations } = await import('@/data/academicScheduleData');
  return teachingConfirmations;
};

/**
 * Lazy load batch progress summaries (heavy data)
 */
export const getBatchProgressSummaries = async () => {
  const { batchProgressSummaries } = await import('@/data/academicScheduleData');
  return batchProgressSummaries;
};

/**
 * Lazy load subject progress data (heavy data)
 */
export const getSubjectProgressData = async () => {
  const { subjectProgressData } = await import('@/data/academicScheduleData');
  return subjectProgressData;
};

/**
 * Lazy load pending confirmations (heavy data)
 */
export const getPendingConfirmations = async () => {
  const { pendingConfirmations } = await import('@/data/academicScheduleData');
  return pendingConfirmations;
};

// ============================================
// Synchronous Re-exports (for backward compatibility)
// Import directly from academicScheduleData when sync access is required
// ============================================
// Note: For performance-critical paths, prefer the async versions above
