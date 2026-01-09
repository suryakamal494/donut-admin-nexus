// Timetable Data - Main Entry Point
// This file re-exports commonly used items and provides lazy loading for heavy data

// Re-export all types
export type {
  BreakConfig,
  PeriodStructure,
  PeriodType,
  AcademicTerm,
  BatchExamSchedule,
  TeacherLoad,
  TimetableEntry,
  TimetableConflict,
  TeacherConstraint,
  Facility,
  TeacherAbsence,
  SubstitutionAssignment,
} from '@/data/timetableData';

// Re-export lightweight config (always needed)
export { defaultPeriodStructure, defaultPeriodTypes } from '@/data/timetableData';

// ============================================
// Lazy Loading for Heavy Data
// ============================================

/**
 * Lazy load teacher loads data
 */
export const getTeacherLoads = async () => {
  const { teacherLoads } = await import('@/data/timetableData');
  return teacherLoads;
};

/**
 * Lazy load timetable entries
 */
export const getTimetableEntries = async () => {
  const { timetableEntries } = await import('@/data/timetableData');
  return timetableEntries;
};

/**
 * Lazy load holidays data
 */
export const getHolidays = async () => {
  const { academicHolidays } = await import('@/data/timetableData');
  return academicHolidays;
};

/**
 * Lazy load teacher constraints
 */
export const getTeacherConstraints = async () => {
  const { defaultTeacherConstraints } = await import('@/data/timetableData');
  return defaultTeacherConstraints;
};

/**
 * Lazy load facilities
 */
export const getFacilities = async () => {
  const { defaultFacilities } = await import('@/data/timetableData');
  return defaultFacilities;
};
