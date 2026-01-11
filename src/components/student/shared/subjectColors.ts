// Shared Subject Color Configuration
// Single source of truth for subject-specific styling across all student components

import { 
  Calculator, 
  Atom, 
  FlaskConical, 
  Leaf, 
  BookOpen, 
  Code,
  type LucideIcon 
} from "lucide-react";

// ============ TYPES ============

export type SubjectPattern = "math" | "physics" | "chemistry" | "biology" | "english" | "cs";

export type SubjectColorKey = "blue" | "purple" | "green" | "red" | "amber" | "cyan";

export interface SubjectColorScheme {
  // Backgrounds & gradients
  gradient: string;
  headerGradient: string;
  iconBg: string;
  numberBg: string;
  progressBg: string;
  progressFill: string;
  progressBar: string;
  // Text colors
  textAccent: string;
  // Pattern & borders
  patternColor: string;
  border: string;
  // Pattern type
  pattern: SubjectPattern;
}

// ============ ICON MAPPING ============

export const subjectIconMap: Record<string, LucideIcon> = {
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  BookOpen,
  Code,
};

// ============ PATTERN MAPPING ============

export const subjectPatternMap: Record<string, SubjectPattern> = {
  math: "math",
  mathematics: "math",
  physics: "physics",
  chemistry: "chemistry",
  biology: "biology",
  english: "english",
  hindi: "english",
  cs: "cs",
  "computer-science": "cs",
};

// ============ COLOR SCHEMES ============

export const subjectColorSchemes: Record<SubjectColorKey, SubjectColorScheme> = {
  blue: {
    gradient: "from-blue-50/90 via-blue-100/50 to-white/80",
    headerGradient: "from-blue-500 to-blue-600",
    iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
    numberBg: "from-blue-500 to-blue-700",
    progressBg: "bg-blue-100",
    progressFill: "from-blue-400 to-blue-600",
    progressBar: "from-blue-500 to-blue-400",
    textAccent: "text-blue-600",
    patternColor: "text-blue-400",
    border: "border-blue-200/60",
    pattern: "math",
  },
  purple: {
    gradient: "from-violet-50/90 via-purple-100/50 to-white/80",
    headerGradient: "from-purple-500 to-violet-600",
    iconBg: "bg-gradient-to-br from-violet-400 to-purple-600",
    numberBg: "from-violet-500 to-purple-700",
    progressBg: "bg-violet-100",
    progressFill: "from-violet-400 to-purple-600",
    progressBar: "from-purple-500 to-purple-400",
    textAccent: "text-violet-600",
    patternColor: "text-violet-400",
    border: "border-purple-200/60",
    pattern: "physics",
  },
  green: {
    gradient: "from-emerald-50/90 via-green-100/50 to-white/80",
    headerGradient: "from-green-500 to-emerald-600",
    iconBg: "bg-gradient-to-br from-emerald-400 to-green-600",
    numberBg: "from-emerald-500 to-green-700",
    progressBg: "bg-emerald-100",
    progressFill: "from-emerald-400 to-green-600",
    progressBar: "from-emerald-500 to-emerald-400",
    textAccent: "text-emerald-600",
    patternColor: "text-emerald-400",
    border: "border-emerald-200/60",
    pattern: "chemistry",
  },
  red: {
    gradient: "from-rose-50/90 via-red-100/50 to-white/80",
    headerGradient: "from-rose-500 to-red-600",
    iconBg: "bg-gradient-to-br from-rose-400 to-red-500",
    numberBg: "from-rose-500 to-red-600",
    progressBg: "bg-rose-100",
    progressFill: "from-rose-400 to-red-500",
    progressBar: "from-rose-500 to-rose-400",
    textAccent: "text-rose-600",
    patternColor: "text-rose-400",
    border: "border-rose-200/60",
    pattern: "biology",
  },
  amber: {
    gradient: "from-amber-50/90 via-orange-100/50 to-white/80",
    headerGradient: "from-amber-500 to-orange-500",
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    numberBg: "from-amber-500 to-orange-600",
    progressBg: "bg-amber-100",
    progressFill: "from-amber-400 to-orange-500",
    progressBar: "from-amber-500 to-amber-400",
    textAccent: "text-amber-600",
    patternColor: "text-amber-400",
    border: "border-amber-200/60",
    pattern: "english",
  },
  cyan: {
    gradient: "from-cyan-50/90 via-teal-100/50 to-white/80",
    headerGradient: "from-cyan-500 to-teal-600",
    iconBg: "bg-gradient-to-br from-cyan-400 to-teal-500",
    numberBg: "from-cyan-500 to-teal-600",
    progressBg: "bg-cyan-100",
    progressFill: "from-cyan-400 to-teal-500",
    progressBar: "from-cyan-500 to-cyan-400",
    textAccent: "text-cyan-600",
    patternColor: "text-cyan-400",
    border: "border-cyan-200/60",
    pattern: "cs",
  },
};

// ============ HELPER FUNCTIONS ============

/**
 * Get color scheme for a subject by its color key
 */
export function getSubjectColors(colorKey: string): SubjectColorScheme {
  return subjectColorSchemes[colorKey as SubjectColorKey] || subjectColorSchemes.cyan;
}

/**
 * Get icon component for a subject by its icon name
 */
export function getSubjectIcon(iconName: string): LucideIcon {
  return subjectIconMap[iconName] || BookOpen;
}

/**
 * Get pattern type for a subject by its ID
 */
export function getSubjectPattern(subjectId: string): SubjectPattern {
  return subjectPatternMap[subjectId] || "math";
}
