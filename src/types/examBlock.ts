// Exam Block System Types
// Blocks are temporary rules that prevent normal classes from running

export type BlockType = 'exam' | 'assessment' | 'internal_test' | 'competition' | 'workshop' | 'other';

export type ScopeType = 'institution' | 'course' | 'class' | 'batch';

export type DateType = 'single_day' | 'multi_day' | 'recurring';

export type TimeType = 'full_day' | 'time_range' | 'periods';

export type BlockStrength = 'hard' | 'soft';

export interface RecurringConfig {
  dayOfWeek: string; // 'Monday', 'Tuesday', etc.
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface ExamBlock {
  id: string;
  name: string;
  description?: string;
  
  // What is this block for?
  blockType: BlockType;
  
  // Who is affected?
  scopeType: ScopeType;
  scopeId?: string; // ID of course/class/batch if applicable
  scopeName?: string; // Name for display
  
  // When does the block apply?
  dateType: DateType;
  dates: string[]; // Array of ISO date strings (for single/multi day)
  recurringConfig?: RecurringConfig; // For recurring blocks
  
  // Time specification
  timeType: TimeType;
  startTime?: string; // HH:mm format for time_range
  endTime?: string; // HH:mm format for time_range
  periods?: number[]; // Array of period numbers for periods type
  
  // How strong is this block?
  blockStrength: BlockStrength;
  
  // Metadata
  createdAt: string;
  isActive: boolean;
}

// Helper to check if a slot is blocked
export interface BlockCheckResult {
  blocked: boolean;
  blockName?: string;
  blockType?: BlockType;
  blockStrength?: BlockStrength;
}

// Block type display config
export const blockTypeConfig: Record<BlockType, { label: string; icon: string; color: string }> = {
  exam: { label: 'Exam', icon: 'FileText', color: 'red' },
  assessment: { label: 'Assessment', icon: 'ClipboardCheck', color: 'amber' },
  internal_test: { label: 'Internal Test', icon: 'FileEdit', color: 'orange' },
  competition: { label: 'Competition', icon: 'Trophy', color: 'purple' },
  workshop: { label: 'Workshop', icon: 'Wrench', color: 'blue' },
  other: { label: 'Other Activity', icon: 'Calendar', color: 'gray' },
};

// Scope type display config
export const scopeTypeConfig: Record<ScopeType, { label: string; description: string }> = {
  institution: { label: 'Entire Institution', description: 'Affects all batches and classes' },
  course: { label: 'Course / Stream', description: 'e.g., JEE, NEET, CBSE' },
  class: { label: 'Specific Class', description: 'e.g., Class 10, Class 12' },
  batch: { label: 'Specific Batch', description: 'e.g., Class 10 - Section A' },
};
