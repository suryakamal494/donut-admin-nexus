// Teacher Module Mock Data

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  avatar?: string;
  subjects: string[];
  assignedBatches: string[];
  assignedClasses: string[];
}

export interface TeacherTimetableSlot {
  id: string;
  day: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  subjectId: string;
  batchId: string;
  batchName: string;
  className: string;
  room?: string;
  hasLessonPlan: boolean;
  lessonPlanId?: string;
}

export interface LessonPlanBlock {
  id: string;
  type: 'explain' | 'demonstrate' | 'ask' | 'check' | 'practice' | 'homework';
  title: string;
  content?: string;
  duration?: number; // in minutes
  resources?: string[];
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

export interface TeacherAssessment {
  id: string;
  title: string;
  type: 'quiz' | 'test' | 'poll';
  subject: string;
  batchId: string;
  batchName: string;
  className: string;
  questionCount: number;
  duration?: number;
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'live' | 'completed';
  createdAt: string;
}

export interface TeacherHomework {
  id: string;
  title: string;
  subject: string;
  batchId: string;
  batchName: string;
  className: string;
  dueDate: string;
  assignedDate: string;
  status: 'assigned' | 'overdue' | 'completed';
  submissionCount: number;
  totalStudents: number;
  linkedLessonPlanId?: string;
}

export interface PendingAction {
  id: string;
  type: 'homework' | 'quiz' | 'lesson_plan' | 'review';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  linkedId?: string;
}

// Current logged-in teacher (mock)
export const currentTeacher: TeacherProfile = {
  id: "teacher-1",
  name: "Dr. Rajesh Kumar",
  email: "rajesh.kumar@school.edu",
  mobile: "+91 98765 43210",
  subjects: ["Physics"],
  assignedBatches: ["batch-10a", "batch-10b", "batch-11a"],
  assignedClasses: ["Class 10", "Class 11"],
};

// Today's date for demo
const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Teacher's timetable for today
export const teacherTodayTimetable: TeacherTimetableSlot[] = [
  {
    id: "slot-1",
    day: "Monday",
    periodNumber: 1,
    startTime: "08:00",
    endTime: "08:45",
    subject: "Physics",
    subjectId: "phy",
    batchId: "batch-10a",
    batchName: "10A",
    className: "Class 10",
    room: "Lab 1",
    hasLessonPlan: true,
    lessonPlanId: "lp-1",
  },
  {
    id: "slot-2",
    day: "Monday",
    periodNumber: 3,
    startTime: "09:45",
    endTime: "10:30",
    subject: "Physics",
    subjectId: "phy",
    batchId: "batch-10b",
    batchName: "10B",
    className: "Class 10",
    room: "Room 204",
    hasLessonPlan: false,
  },
  {
    id: "slot-3",
    day: "Monday",
    periodNumber: 5,
    startTime: "11:30",
    endTime: "12:15",
    subject: "Physics",
    subjectId: "phy",
    batchId: "batch-11a",
    batchName: "11A",
    className: "Class 11",
    room: "Lab 1",
    hasLessonPlan: true,
    lessonPlanId: "lp-2",
  },
];

// Sample lesson plans
export const teacherLessonPlans: LessonPlan[] = [
  {
    id: "lp-1",
    title: "Newton's Laws of Motion",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    topic: "Newton's First and Second Law",
    batchId: "batch-10a",
    batchName: "10A",
    className: "Class 10",
    scheduledDate: formatDate(today),
    periodNumber: 1,
    status: "ready",
    blocks: [
      {
        id: "block-1",
        type: "explain",
        title: "Introduction to Newton's Laws",
        content: "Video explaining the three laws of motion",
        duration: 10,
        resources: ["Newton's Laws Animation.mp4"],
      },
      {
        id: "block-2",
        type: "demonstrate",
        title: "Real-world Examples",
        content: "Demonstrate using ball and cart experiment",
        duration: 8,
      },
      {
        id: "block-3",
        type: "check",
        title: "Quick Understanding Check",
        content: "5 MCQs on First Law",
        duration: 5,
        aiGenerated: true,
      },
      {
        id: "block-4",
        type: "practice",
        title: "Numerical Problems",
        content: "Solve 3 problems on F=ma",
        duration: 15,
      },
    ],
    createdAt: "2024-01-06T10:00:00Z",
    updatedAt: "2024-01-06T14:30:00Z",
  },
  {
    id: "lp-2",
    title: "Electromagnetic Induction",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Electromagnetic Induction",
    topic: "Faraday's Law",
    batchId: "batch-11a",
    batchName: "11A",
    className: "Class 11",
    scheduledDate: formatDate(today),
    periodNumber: 5,
    status: "ready",
    blocks: [
      {
        id: "block-5",
        type: "explain",
        title: "Faraday's Experiments",
        content: "PPT on Faraday's discovery",
        duration: 12,
      },
      {
        id: "block-6",
        type: "ask",
        title: "Class Discussion",
        content: "Why does moving magnet induce current?",
        duration: 5,
      },
      {
        id: "block-7",
        type: "demonstrate",
        title: "Live Demo",
        content: "Coil and magnet experiment",
        duration: 10,
      },
    ],
    createdAt: "2024-01-05T16:00:00Z",
    updatedAt: "2024-01-06T09:00:00Z",
  },
];

// Sample assessments
export const teacherAssessments: TeacherAssessment[] = [
  {
    id: "assess-1",
    title: "Laws of Motion Quiz",
    type: "quiz",
    subject: "Physics",
    batchId: "batch-10a",
    batchName: "10A",
    className: "Class 10",
    questionCount: 10,
    duration: 15,
    status: "scheduled",
    scheduledFor: formatDate(today),
    createdAt: "2024-01-05T10:00:00Z",
  },
  {
    id: "assess-2",
    title: "Electromagnetic Induction Test",
    type: "test",
    subject: "Physics",
    batchId: "batch-11a",
    batchName: "11A",
    className: "Class 11",
    questionCount: 25,
    duration: 45,
    status: "draft",
    createdAt: "2024-01-04T14:00:00Z",
  },
];

// Sample homework
export const teacherHomework: TeacherHomework[] = [
  {
    id: "hw-1",
    title: "Practice Problems - Newton's Laws",
    subject: "Physics",
    batchId: "batch-10a",
    batchName: "10A",
    className: "Class 10",
    dueDate: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
    assignedDate: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    status: "assigned",
    submissionCount: 12,
    totalStudents: 35,
    linkedLessonPlanId: "lp-1",
  },
  {
    id: "hw-2",
    title: "Numerical Worksheet - Motion",
    subject: "Physics",
    batchId: "batch-10b",
    batchName: "10B",
    className: "Class 10",
    dueDate: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    assignedDate: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
    status: "overdue",
    submissionCount: 28,
    totalStudents: 32,
  },
];

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
