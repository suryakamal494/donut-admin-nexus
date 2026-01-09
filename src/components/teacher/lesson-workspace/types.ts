// Lesson Plan Workspace Types

export type BlockType = 'explain' | 'demonstrate' | 'quiz' | 'homework';
export type BlockSource = 'library' | 'ai' | 'custom';

export interface LessonPlanBlock {
  id: string;
  type: BlockType;
  title: string;
  content?: string;
  duration?: number;
  source: BlockSource;
  sourceId?: string;
  sourceType?: string;
  questions?: string[];
  attachmentUrl?: string;
  aiGenerated?: boolean;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  subjectId: string;
  chapter: string;
  topic: string;
  batchId: string;
  batchName: string;
  className: string;
  scheduledDate: string;
  periodNumber: number;
  status: 'draft' | 'ready' | 'completed';
  blocks: LessonPlanBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceContext {
  className: string;
  subject: string;
  chapter: string;
  scheduledDate: string;
  batchName: string;
  batchId: string;
  isFromTimetable: boolean;
}

export const blockTypeConfig: Record<BlockType, {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  tooltip: string;
}> = {
  explain: {
    icon: 'BookOpen',
    label: 'Explain',
    color: 'bg-[hsl(var(--donut-coral))]',
    bgColor: 'bg-[hsl(var(--donut-coral))]/5',
    borderColor: 'border-[hsl(var(--donut-coral))]/30',
    description: 'Teaching content like presentations, videos, or documents',
    tooltip: 'Add presentations, videos, or documents to explain concepts to students'
  },
  demonstrate: {
    icon: 'Play',
    label: 'Demonstrate',
    color: 'bg-[hsl(var(--donut-orange))]',
    bgColor: 'bg-[hsl(var(--donut-orange))]/5',
    borderColor: 'border-[hsl(var(--donut-orange))]/30',
    description: 'Solved examples, animations, or step-by-step walkthroughs',
    tooltip: 'Add solved examples, animations, or step-by-step demonstrations'
  },
  quiz: {
    icon: 'HelpCircle',
    label: 'Quiz',
    color: 'bg-[hsl(var(--donut-pink))]',
    bgColor: 'bg-[hsl(var(--donut-pink))]/5',
    borderColor: 'border-[hsl(var(--donut-pink))]/30',
    description: 'Questions for quick assessment during class',
    tooltip: 'Add questions from question bank or generate with AI for quick assessment'
  },
  homework: {
    icon: 'ClipboardList',
    label: 'Homework',
    color: 'bg-[hsl(var(--donut-purple))]',
    bgColor: 'bg-[hsl(var(--donut-purple))]/5',
    borderColor: 'border-[hsl(var(--donut-purple))]/30',
    description: 'Take-home assignments for students',
    tooltip: 'Assign take-home work for students to complete after class'
  }
};
