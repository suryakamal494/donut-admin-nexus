// Teacher Stats and Pending Actions Mock Data
import { PendingAction } from './types';

// Pending actions for teacher
export const teacherPendingActions: PendingAction[] = [
  {
    id: "action-1",
    type: "homework",
    title: "Assign homework for 10A",
    description: "Yesterday's class on Newton's Laws",
    priority: "high",
    linkedId: "lp-1",
  },
  {
    id: "action-2",
    type: "review",
    title: "Review quiz results - 10B",
    description: "15 students completed the quiz",
    priority: "medium",
    linkedId: "assess-1",
  },
  {
    id: "action-3",
    type: "lesson_plan",
    title: "Create lesson plan for 10B",
    description: "Tomorrow's class - Period 3",
    priority: "medium",
  },
];

// Weekly stats
export const teacherWeeklyStats = {
  totalClasses: 12,
  completedClasses: 4,
  scheduledTests: 3,
  pendingHomework: 2,
  lessonPlansCreated: 8,
};

// Teacher profile stats
export const teacherProfileStats = {
  totalLessonPlans: 24,
  completedClasses: 156,
  assessmentsConducted: 18,
  homeworkAssigned: 32,
  averageClassRating: 4.7,
  yearsExperience: 8,
};

// Teacher content filters (for filtering content library)
export const teacherContentFilters = {
  subjectIds: ["phy"],
  classIds: ["class-10", "class-11", "class-12"],
};
