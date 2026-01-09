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
  lessonPlanStatus?: 'ready' | 'draft' | 'none';
  topic?: string;
  periodType?: 'regular' | 'lab' | 'sports' | 'library';
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

// Helper to get dates for current week
const getWeekDates = () => {
  const dates: Record<string, string> = {};
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const d = new Date(today);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  
  dayNames.forEach((name, i) => {
    const date = new Date(d);
    date.setDate(d.getDate() + i);
    dates[name] = formatDate(date);
  });
  return dates;
};

const weekDates = getWeekDates();

// Realistic weekly schedule for Dr. Rajesh Kumar (Physics teacher)
// 5-7 periods per day across 3 batches
export const teacherWeeklySchedule: Record<string, TeacherTimetableSlot[]> = {
  [weekDates.Monday]: [
    {
      id: "slot-mon-1",
      day: "Monday",
      periodNumber: 1,
      startTime: "08:00",
      endTime: "08:45",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10a",
      batchName: "Class Tenth, Section A",
      className: "Class 10",
      room: "Room 201",
      hasLessonPlan: true,
      lessonPlanId: "lp-1",
      lessonPlanStatus: "ready",
      topic: "Newton's Laws of Motion - Introduction and First Law",
    },
    {
      id: "slot-mon-2",
      day: "Monday",
      periodNumber: 3,
      startTime: "09:45",
      endTime: "10:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10b",
      batchName: "Class Tenth, Section B",
      className: "Class 10",
      room: "Room 203",
      hasLessonPlan: true,
      lessonPlanId: "lp-3",
      lessonPlanStatus: "draft",
      topic: "Force and Linear Momentum Conservation",
    },
    {
      id: "slot-mon-3",
      day: "Monday",
      periodNumber: 5,
      startTime: "11:30",
      endTime: "12:15",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-11a",
      batchName: "Class Eleventh, Section A",
      className: "Class 11",
      room: "Physics Lab",
      hasLessonPlan: true,
      lessonPlanId: "lp-2",
      lessonPlanStatus: "ready",
      topic: "Electromagnetic Induction Fundamentals",
      periodType: "lab",
    },
    {
      id: "slot-mon-4",
      day: "Monday",
      periodNumber: 6,
      startTime: "12:15",
      endTime: "13:00",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10a",
      batchName: "Class Tenth, Section A",
      className: "Class 10",
      room: "Room 201",
      hasLessonPlan: false,
      lessonPlanStatus: "none",
      topic: "Newton's Second Law of Motion",
    },
    {
      id: "slot-mon-5",
      day: "Monday",
      periodNumber: 8,
      startTime: "14:30",
      endTime: "15:15",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10b",
      batchName: "Class Tenth, Section B",
      className: "Class 10",
      room: "Physics Lab",
      hasLessonPlan: true,
      lessonPlanId: "lp-4",
      lessonPlanStatus: "ready",
      topic: "Lab: Verification of Newton's Second Law",
      periodType: "lab",
    },
  ],
  [weekDates.Tuesday]: [
    {
      id: "slot-tue-1",
      day: "Tuesday",
      periodNumber: 2,
      startTime: "08:45",
      endTime: "09:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-11a",
      batchName: "Class Eleventh, Section A",
      className: "Class 11",
      room: "Room 301",
      hasLessonPlan: true,
      lessonPlanId: "lp-5",
      lessonPlanStatus: "ready",
      topic: "Faraday's Law of Electromagnetic Induction",
    },
    {
      id: "slot-tue-2",
      day: "Tuesday",
      periodNumber: 4,
      startTime: "10:45",
      endTime: "11:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10a",
      batchName: "Class Tenth, Section A",
      className: "Class 10",
      room: "Room 201",
      hasLessonPlan: false,
      lessonPlanStatus: "none",
      topic: "Newton's Third Law and Action-Reaction Pairs",
    },
    {
      id: "slot-tue-3",
      day: "Tuesday",
      periodNumber: 5,
      startTime: "11:30",
      endTime: "12:15",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10b",
      batchName: "Class Tenth, Section B",
      className: "Class 10",
      room: "Room 203",
      hasLessonPlan: true,
      lessonPlanId: "lp-6",
      lessonPlanStatus: "draft",
      topic: "Applications of Newton's Laws in Daily Life",
    },
    {
      id: "slot-tue-4",
      day: "Tuesday",
      periodNumber: 7,
      startTime: "13:45",
      endTime: "14:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-11a",
      batchName: "Class Eleventh, Section A",
      className: "Class 11",
      room: "Room 301",
      hasLessonPlan: false,
      lessonPlanStatus: "none",
      topic: "Self Inductance and Mutual Inductance",
    },
  ],
  [weekDates.Wednesday]: [
    {
      id: "slot-wed-1",
      day: "Wednesday",
      periodNumber: 1,
      startTime: "08:00",
      endTime: "08:45",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10b",
      batchName: "Class Tenth, Section B",
      className: "Class 10",
      room: "Room 203",
      hasLessonPlan: true,
      lessonPlanId: "lp-7",
      lessonPlanStatus: "ready",
      topic: "Friction - Types and Applications",
    },
    {
      id: "slot-wed-2",
      day: "Wednesday",
      periodNumber: 3,
      startTime: "09:45",
      endTime: "10:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10a",
      batchName: "Class Tenth, Section A",
      className: "Class 10",
      room: "Physics Lab",
      hasLessonPlan: true,
      lessonPlanId: "lp-8",
      lessonPlanStatus: "ready",
      topic: "Lab: Coefficient of Friction Experiment",
      periodType: "lab",
    },
    {
      id: "slot-wed-3",
      day: "Wednesday",
      periodNumber: 5,
      startTime: "11:30",
      endTime: "12:15",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-11a",
      batchName: "Class Eleventh, Section A",
      className: "Class 11",
      room: "Room 301",
      hasLessonPlan: false,
      lessonPlanStatus: "none",
      topic: "Alternating Current and Transformers",
    },
    {
      id: "slot-wed-4",
      day: "Wednesday",
      periodNumber: 6,
      startTime: "12:15",
      endTime: "13:00",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10b",
      batchName: "Class Tenth, Section B",
      className: "Class 10",
      room: "Room 203",
      hasLessonPlan: true,
      lessonPlanId: "lp-9",
      lessonPlanStatus: "draft",
      topic: "Static and Kinetic Friction Concepts",
    },
    {
      id: "slot-wed-5",
      day: "Wednesday",
      periodNumber: 8,
      startTime: "14:30",
      endTime: "15:15",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10a",
      batchName: "Class Tenth, Section A",
      className: "Class 10",
      room: "Room 201",
      hasLessonPlan: false,
      lessonPlanStatus: "none",
      topic: "Circular Motion and Centripetal Force",
    },
  ],
  [weekDates.Thursday]: [
    {
      id: "slot-thu-1",
      day: "Thursday",
      periodNumber: 1,
      startTime: "08:00",
      endTime: "08:45",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-11a",
      batchName: "Class Eleventh, Section A",
      className: "Class 11",
      room: "Physics Lab",
      hasLessonPlan: true,
      lessonPlanId: "lp-10",
      lessonPlanStatus: "ready",
      topic: "Lab: Study of Electromagnetic Induction",
      periodType: "lab",
    },
    {
      id: "slot-thu-2",
      day: "Thursday",
      periodNumber: 2,
      startTime: "08:45",
      endTime: "09:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10a",
      batchName: "Class Tenth, Section A",
      className: "Class 10",
      room: "Room 201",
      hasLessonPlan: true,
      lessonPlanId: "lp-11",
      lessonPlanStatus: "ready",
      topic: "Work, Energy and Power Concepts",
    },
    {
      id: "slot-thu-3",
      day: "Thursday",
      periodNumber: 4,
      startTime: "10:45",
      endTime: "11:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10b",
      batchName: "Class Tenth, Section B",
      className: "Class 10",
      room: "Room 203",
      hasLessonPlan: false,
      lessonPlanStatus: "none",
      topic: "Kinetic and Potential Energy",
    },
    {
      id: "slot-thu-4",
      day: "Thursday",
      periodNumber: 6,
      startTime: "12:15",
      endTime: "13:00",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-11a",
      batchName: "Class Eleventh, Section A",
      className: "Class 11",
      room: "Room 301",
      hasLessonPlan: true,
      lessonPlanId: "lp-12",
      lessonPlanStatus: "draft",
      topic: "Lenz's Law and Energy Conservation",
    },
    {
      id: "slot-thu-5",
      day: "Thursday",
      periodNumber: 7,
      startTime: "13:45",
      endTime: "14:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10a",
      batchName: "Class Tenth, Section A",
      className: "Class 10",
      room: "Room 201",
      hasLessonPlan: false,
      lessonPlanStatus: "none",
      topic: "Conservation of Mechanical Energy",
    },
  ],
  [weekDates.Friday]: [
    {
      id: "slot-fri-1",
      day: "Friday",
      periodNumber: 2,
      startTime: "08:45",
      endTime: "09:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10b",
      batchName: "Class Tenth, Section B",
      className: "Class 10",
      room: "Physics Lab",
      hasLessonPlan: true,
      lessonPlanId: "lp-13",
      lessonPlanStatus: "ready",
      topic: "Lab: Verification of Work-Energy Theorem",
      periodType: "lab",
    },
    {
      id: "slot-fri-2",
      day: "Friday",
      periodNumber: 3,
      startTime: "09:45",
      endTime: "10:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-11a",
      batchName: "Class Eleventh, Section A",
      className: "Class 11",
      room: "Room 301",
      hasLessonPlan: false,
      lessonPlanStatus: "none",
      topic: "Eddy Currents and Applications",
    },
    {
      id: "slot-fri-3",
      day: "Friday",
      periodNumber: 5,
      startTime: "11:30",
      endTime: "12:15",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10a",
      batchName: "Class Tenth, Section A",
      className: "Class 10",
      room: "Room 201",
      hasLessonPlan: true,
      lessonPlanId: "lp-14",
      lessonPlanStatus: "ready",
      topic: "Power and Energy Transformation",
    },
    {
      id: "slot-fri-4",
      day: "Friday",
      periodNumber: 7,
      startTime: "13:45",
      endTime: "14:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10b",
      batchName: "10B",
      className: "Class 10",
      room: "Room 203",
      hasLessonPlan: true,
      lessonPlanId: "lp-15",
      lessonPlanStatus: "draft",
      topic: "Law of Conservation of Energy",
    },
  ],
  [weekDates.Saturday]: [
    {
      id: "slot-sat-1",
      day: "Saturday",
      periodNumber: 1,
      startTime: "08:00",
      endTime: "08:45",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-11a",
      batchName: "Class Eleventh, Section A",
      className: "Class 11",
      room: "Room 301",
      hasLessonPlan: true,
      lessonPlanId: "lp-16",
      lessonPlanStatus: "ready",
      topic: "AC Generator - Working Principle",
    },
    {
      id: "slot-sat-2",
      day: "Saturday",
      periodNumber: 3,
      startTime: "09:45",
      endTime: "10:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10a",
      batchName: "10A",
      className: "Class 10",
      room: "Room 201",
      hasLessonPlan: false,
      lessonPlanStatus: "none",
      topic: "Simple Machines and Efficiency",
    },
    {
      id: "slot-sat-3",
      day: "Saturday",
      periodNumber: 4,
      startTime: "10:45",
      endTime: "11:30",
      subject: "Physics",
      subjectId: "phy",
      batchId: "batch-10b",
      batchName: "Class Tenth, Section B",
      className: "Class 10",
      room: "Physics Lab",
      hasLessonPlan: true,
      lessonPlanId: "lp-17",
      lessonPlanStatus: "ready",
      topic: "Lab: Verification of Conservation of Energy",
      periodType: "lab",
    },
  ],
};

// Teacher's timetable for today (legacy - keeping for backward compatibility)
export const teacherTodayTimetable: TeacherTimetableSlot[] = 
  teacherWeeklySchedule[formatDate(today)] || [];

// Sample lesson plans (extended with more plans linked to schedule)
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
    scheduledDate: weekDates.Monday,
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
    scheduledDate: weekDates.Monday,
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
  {
    id: "lp-3",
    title: "Force and Momentum",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    topic: "Force and Momentum",
    batchId: "batch-10b",
    batchName: "10B",
    className: "Class 10",
    scheduledDate: weekDates.Monday,
    periodNumber: 3,
    status: "draft",
    blocks: [
      {
        id: "block-8",
        type: "explain",
        title: "What is Momentum?",
        content: "Introduction to momentum concept",
        duration: 10,
      },
    ],
    createdAt: "2024-01-06T08:00:00Z",
    updatedAt: "2024-01-06T08:00:00Z",
  },
  {
    id: "lp-4",
    title: "Lab: Verify Newton's Second Law",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    topic: "Newton's Second Law Verification",
    batchId: "batch-10b",
    batchName: "10B",
    className: "Class 10",
    scheduledDate: weekDates.Monday,
    periodNumber: 8,
    status: "ready",
    blocks: [
      {
        id: "block-9",
        type: "explain",
        title: "Lab Objective",
        content: "Explain the experiment setup and objectives",
        duration: 5,
      },
      {
        id: "block-10",
        type: "demonstrate",
        title: "Setup Demo",
        content: "Show how to set up the pulley system",
        duration: 8,
      },
      {
        id: "block-11",
        type: "practice",
        title: "Student Experiment",
        content: "Students perform the experiment in groups",
        duration: 20,
      },
      {
        id: "block-12",
        type: "check",
        title: "Lab Report Discussion",
        content: "Review observations and calculate F=ma",
        duration: 10,
      },
    ],
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T14:00:00Z",
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
