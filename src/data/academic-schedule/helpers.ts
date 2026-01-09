// Helper functions for academic schedule data manipulation

import type { 
  AcademicScheduleSetup, 
  WeeklyChapterPlan, 
  TeachingConfirmation,
  BatchProgressSummary 
} from "@/types/academicSchedule";

/**
 * Get setups filtered by course and class
 */
export const filterSetupsByCourse = (
  setups: AcademicScheduleSetup[],
  courseId: string,
  classId?: string
): AcademicScheduleSetup[] => {
  return setups.filter(s => 
    s.courseId === courseId && 
    (classId ? s.classId === classId : true)
  );
};

/**
 * Get setups filtered by subject
 */
export const filterSetupsBySubject = (
  setups: AcademicScheduleSetup[],
  subjectId: string
): AcademicScheduleSetup[] => {
  return setups.filter(s => s.subjectId === subjectId);
};

/**
 * Get weekly plans for a specific batch and week
 */
export const getPlansForBatchWeek = (
  plans: WeeklyChapterPlan[],
  batchId: string,
  weekStartDate: string
): WeeklyChapterPlan[] => {
  return plans.filter(p => 
    p.batchId === batchId && 
    p.weekStartDate === weekStartDate
  );
};

/**
 * Get weekly plans for a specific week across all batches
 */
export const getPlansForWeek = (
  plans: WeeklyChapterPlan[],
  weekStartDate: string
): WeeklyChapterPlan[] => {
  return plans.filter(p => p.weekStartDate === weekStartDate);
};

/**
 * Get confirmations for a specific batch
 */
export const getConfirmationsForBatch = (
  confirmations: TeachingConfirmation[],
  batchId: string
): TeachingConfirmation[] => {
  return confirmations.filter(c => c.batchId === batchId);
};

/**
 * Calculate completion percentage
 */
export const calculateCompletionPercentage = (
  completed: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Get batch status color based on progress
 */
export const getBatchStatusColor = (
  status: BatchProgressSummary['status']
): string => {
  switch (status) {
    case 'ahead':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'on_track':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'lagging':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'critical':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};
