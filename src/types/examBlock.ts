// Exam Schedule System Types
// Exams are temporary rules that prevent normal classes from running

export type ScopeType = 'institution' | 'course' | 'class' | 'batch';

export type DateType = 'single_day' | 'multi_day' | 'recurring';

export type TimeType = 'full_day' | 'time_range' | 'periods';

// Custom exam types that institutes can create
export interface ExamType {
  id: string;
  name: string;
  color?: string; // Optional color for visual distinction
  isDefault?: boolean; // System-provided types vs custom
}

export interface RecurringConfig {
  dayOfWeek: string; // 'Monday', 'Tuesday', etc.
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface ExamBlock {
  id: string;
  name: string;
  description?: string;
  
  // Exam type (references ExamType)
  examTypeId: string;
  
  // Who is affected?
  scopeType: ScopeType;
  scopeId?: string; // ID of course/class/batch if applicable
  scopeName?: string; // Name for display
  
  // When does the exam apply?
  dateType: DateType;
  dates: string[]; // Array of ISO date strings (for single/multi day)
  recurringConfig?: RecurringConfig; // For recurring exams
  
  // Time specification
  timeType: TimeType;
  startTime?: string; // HH:mm format for time_range
  endTime?: string; // HH:mm format for time_range
  periods?: number[]; // Array of period numbers for periods type
  
  // Metadata
  createdAt: string;
  isActive: boolean;
}

// Helper to check if a slot is blocked
export interface BlockCheckResult {
  blocked: boolean;
  blockName?: string;
  examTypeId?: string;
}

// Scope type display config
export const scopeTypeConfig: Record<ScopeType, { label: string; description: string }> = {
  institution: { label: 'Entire Institution', description: 'Affects all batches and classes' },
  course: { label: 'Course / Stream', description: 'e.g., JEE, NEET, CBSE' },
  class: { label: 'Specific Class', description: 'e.g., Class 10, Class 12' },
  batch: { label: 'Specific Batch', description: 'e.g., Class 10 - Section A' },
};
