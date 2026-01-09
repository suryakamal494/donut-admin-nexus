// Academic Week Generation and Configuration
import { AcademicWeek } from "@/types/academicSchedule";

/**
 * Generate academic weeks starting from a given date
 * @param startDate - ISO date string for the first week's start
 * @param numWeeks - Number of weeks to generate
 * @returns Array of AcademicWeek objects
 */
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

// Week 4: Jan 27 - Feb 1, 2025 (Weeks 1-3 are past, 4 is current, 5-8 are future)
export const currentWeekIndex = 3;

/**
 * Get week status based on index relative to current week
 */
export const getWeekStatus = (weekIndex: number): 'past' | 'current' | 'future' => {
  if (weekIndex < currentWeekIndex) return 'past';
  if (weekIndex === currentWeekIndex) return 'current';
  return 'future';
};

/**
 * Get a specific week by index
 */
export const getWeekByIndex = (index: number): AcademicWeek | undefined => {
  return academicWeeks[index];
};

/**
 * Get weeks within a range
 */
export const getWeeksInRange = (startIndex: number, endIndex: number): AcademicWeek[] => {
  return academicWeeks.slice(startIndex, endIndex + 1);
};
