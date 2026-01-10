// Teacher Module Data - Barrel Export

// Types
export * from './types';

// Profile
export { currentTeacher } from './profile';

// Schedule
export { teacherWeeklySchedule, teacherTodayTimetable } from './schedule';

// Lesson Plans
export { teacherLessonPlans } from './lessonPlans';

// Assessments & Homework
export { teacherAssessments } from './assessments';
export { teacherHomework } from './homework';

// Stats & Actions
export { 
  teacherPendingActions, 
  teacherWeeklyStats, 
  teacherProfileStats, 
  teacherContentFilters 
} from './stats';

// Helpers (for internal use)
export { formatDate, today, weekDates, getWeekDates } from './helpers';
