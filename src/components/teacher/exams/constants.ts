// Teacher Exam Module Constants

// Exam Configuration Limits
export const EXAM_CONFIG = {
  QUESTION_MIN: 5 as number,
  QUESTION_MAX: 50 as number,
  QUESTION_DEFAULT: 20 as number,
  QUESTION_STEP: 5 as number,
  
  DURATION_MIN: 10 as number,
  DURATION_MAX: 180 as number,
  DURATION_DEFAULT: 30 as number,
  DURATION_STEP: 5 as number,
  
  MARKS_OPTIONS: [1, 2, 4, 5] as number[],
  MARKS_DEFAULT: 4 as number,
  
  NEGATIVE_MARKS_MIN: 0.25 as number,
  NEGATIVE_MARKS_DEFAULT: 1 as number,
  NEGATIVE_MARKS_STEP: 0.25 as number,
};

// Difficulty Distribution Defaults
export const DIFFICULTY_DEFAULTS = {
  EASY: 33 as number,
  MEDIUM: 34 as number,
  HARD: 33 as number,
};

// Question Bank Settings
export const QUESTION_BANK_CONFIG = {
  VIRTUALIZATION_THRESHOLD: 50, // Enable virtualization when questions exceed this
  ESTIMATED_ITEM_HEIGHT: 120, // Estimated height of each question card in pixels
  OVERSCAN: 5, // Number of items to render outside visible area
  SEARCH_DEBOUNCE_MS: 300,
};

// UI Touch Targets (minimum sizes for accessibility)
export const TOUCH_TARGETS = {
  MIN_HEIGHT: 44, // Minimum touch target height in pixels
  BUTTON_HEIGHT: 48,
  FAB_SIZE: 56,
};

// Status Colors (for reference - actual styling in components)
export const EXAM_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled", 
  LIVE: "live",
  COMPLETED: "completed",
} as const;

export type ExamStatus = typeof EXAM_STATUS[keyof typeof EXAM_STATUS];
