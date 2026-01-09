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

// Enhanced LessonPlanBlock with workspace types alignment
export interface LessonPlanBlock {
  id: string;
  type: 'explain' | 'demonstrate' | 'quiz' | 'homework';
  title: string;
  content?: string;
  duration?: number; // in minutes
  source: 'library' | 'ai' | 'custom';
  sourceId?: string; // Reference to content/question ID
  sourceType?: 'video' | 'pdf' | 'ppt' | 'animation' | 'iframe';
  questions?: string[]; // Question IDs for quiz blocks
  questionCount?: number; // For display
  embedUrl?: string; // For custom embeds
  linkType?: 'youtube' | 'vimeo' | 'google-docs' | 'iframe';
  aiGenerated?: boolean;
}

// Enhanced LessonPlan interface
export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  subjectId: string;
  chapter: string;
  chapterId?: string;
  topics: string[]; // Array of topic names
  batchId: string;
  batchName: string;
  className: string;
  scheduledDate: string;
  periodNumber: number;
  status: 'draft' | 'ready' | 'used'; // Added 'used' status
  usedDate?: string; // When was it used in class
  totalDuration: number; // Pre-calculated total duration
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
      batchName: "10B",
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
      batchName: "10B",
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
      batchName: "10A",
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
      batchName: "11A",
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
      batchName: "10A",
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
      batchName: "10B",
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
      batchName: "11A",
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
      batchName: "10B",
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
      batchName: "10A",
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
      batchName: "11A",
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

// ============================================================================
// REALISTIC MOCK LESSON PLANS WITH HETEROGENEOUS CONTENT COMBINATIONS
// Each plan uses real educational resources: YouTube videos, PhET simulations,
// Google Slides, PDFs, animations, and AI-generated content
// ============================================================================

export const teacherLessonPlans: LessonPlan[] = [
  // ===== LESSON PLAN 1: Newton's Laws of Motion (READY + USED) =====
  // Combination: YouTube video + PhET Simulation + Quiz (3 questions) + PDF + Homework
  {
    id: "lp-1",
    title: "Newton's Laws of Motion - Complete Introduction",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    chapterId: "ch-laws-motion",
    topics: [
      "Newton's First Law - Inertia",
      "Newton's Second Law - F=ma",
      "Real-world applications of Newton's Laws"
    ],
    batchId: "batch-10a",
    batchName: "10A",
    className: "Class 10",
    scheduledDate: weekDates.Monday,
    periodNumber: 1,
    status: "used",
    usedDate: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
    totalDuration: 43,
    blocks: [
      {
        id: "block-1-1",
        type: "explain",
        title: "Newton's Laws of Motion - Video Lecture",
        content: "Comprehensive video explaining all three laws with animations",
        duration: 12,
        source: "custom",
        sourceType: "video",
        linkType: "youtube",
        embedUrl: "https://www.youtube.com/embed/kKKM8Y-u7ds",
      },
      {
        id: "block-1-2",
        type: "demonstrate",
        title: "Forces & Motion - Interactive Simulation",
        content: "PhET simulation for exploring forces and motion",
        duration: 10,
        source: "library",
        sourceType: "animation",
        linkType: "iframe",
        embedUrl: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
      },
      {
        id: "block-1-3",
        type: "quiz",
        title: "Quick Check - Newton's First Law",
        content: "3 MCQ questions to check understanding",
        duration: 5,
        source: "library",
        questions: ["q-001", "q-004", "q-007"],
        questionCount: 3,
      },
      {
        id: "block-1-4",
        type: "explain",
        title: "NCERT Physics - Laws of Motion Chapter",
        content: "PDF reference from NCERT Class 11 Physics",
        duration: 8,
        source: "library",
        sourceType: "pdf",
        sourceId: "ncert-physics-ch5",
      },
      {
        id: "block-1-5",
        type: "homework",
        title: "Practice Problems - Newton's Laws",
        content: "Solve exercises 5.1 to 5.5 from NCERT textbook. Focus on numerical problems involving F=ma calculations.",
        duration: 8,
        source: "custom",
      },
    ],
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-06T14:30:00Z",
  },

  // ===== LESSON PLAN 2: Electromagnetic Induction Lab (READY) =====
  // Combination: Google Slides + AI Experiment Walkthrough + Quiz (1 question) + Animation
  {
    id: "lp-2",
    title: "Electromagnetic Induction - Faraday's Experiments",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Electromagnetic Induction",
    chapterId: "ch-em-induction",
    topics: [
      "Faraday's law of electromagnetic induction",
      "Magnetic flux and induced EMF",
      "Coil and magnet experiments"
    ],
    batchId: "batch-11a",
    batchName: "11A",
    className: "Class 11",
    scheduledDate: weekDates.Monday,
    periodNumber: 5,
    status: "ready",
    totalDuration: 38,
    blocks: [
      {
        id: "block-2-1",
        type: "explain",
        title: "Electromagnetic Induction - Lecture Slides",
        content: "Complete Google Slides presentation on EM Induction",
        duration: 15,
        source: "library",
        sourceType: "ppt",
        linkType: "google-docs",
        embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vR_demo_em_induction/embed",
        sourceId: "ppt-em-induction-001",
      },
      {
        id: "block-2-2",
        type: "demonstrate",
        title: "AI Lab Guide: Coil Experiment",
        content: "Step-by-step walkthrough of the coil and magnet experiment generated by AI",
        duration: 8,
        source: "ai",
        aiGenerated: true,
      },
      {
        id: "block-2-3",
        type: "quiz",
        title: "Assertion-Reasoning: Faraday's Law",
        content: "Quick conceptual check using assertion-reasoning format",
        duration: 5,
        source: "library",
        questions: ["q-007"],
        questionCount: 1,
      },
      {
        id: "block-2-4",
        type: "demonstrate",
        title: "Faraday's Law Visualization",
        content: "Interactive animation showing magnetic flux changes",
        duration: 10,
        source: "library",
        sourceType: "animation",
        linkType: "iframe",
        embedUrl: "https://www.animations.physics.unsw.edu.au/jw/EMC/EMC.htm",
      },
    ],
    createdAt: "2024-01-05T16:00:00Z",
    updatedAt: "2024-01-06T09:00:00Z",
  },

  // ===== LESSON PLAN 3: Work, Energy and Power (DRAFT) =====
  // Combination: YouTube embed + Quiz (5 questions) + PDF Worksheet
  {
    id: "lp-3",
    title: "Work, Energy and Power - Fundamentals",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Work Energy Power",
    chapterId: "ch-work-energy",
    topics: [
      "Definition of work in physics",
      "Work-Energy theorem derivation",
      "Types of energy and their transformations"
    ],
    batchId: "batch-10b",
    batchName: "10B",
    className: "Class 10",
    scheduledDate: weekDates.Monday,
    periodNumber: 3,
    status: "draft",
    totalDuration: 35,
    blocks: [
      {
        id: "block-3-1",
        type: "explain",
        title: "Work Energy Theorem - Video Explanation",
        content: "Detailed video on work-energy theorem with examples",
        duration: 15,
        source: "custom",
        sourceType: "video",
        linkType: "youtube",
        embedUrl: "https://www.youtube.com/embed/w4QFJb9a8vo",
      },
      {
        id: "block-3-2",
        type: "quiz",
        title: "Mixed Assessment - Work & Energy",
        content: "5 questions: 3 MCQ + 2 Numerical problems",
        duration: 12,
        source: "library",
        questions: ["q-001", "q-002", "q-003", "q-004", "q-005"],
        questionCount: 5,
      },
      {
        id: "block-3-3",
        type: "homework",
        title: "Numerical Worksheet - Energy Problems",
        content: "PDF worksheet with 10 numerical problems on kinetic and potential energy",
        duration: 8,
        source: "library",
        sourceType: "pdf",
        sourceId: "worksheet-energy-001",
      },
    ],
    createdAt: "2024-01-06T08:00:00Z",
    updatedAt: "2024-01-06T08:00:00Z",
  },

  // ===== LESSON PLAN 4: Friction and Applications (READY + USED) =====
  // Combination: Video + PhET Simulation + Quiz (3 questions) + AI Examples + Homework
  {
    id: "lp-4",
    title: "Friction - Types, Laws and Real-world Applications",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    chapterId: "ch-laws-motion",
    topics: [
      "Static and kinetic friction",
      "Laws of friction",
      "Coefficient of friction",
      "Real-world friction applications"
    ],
    batchId: "batch-10b",
    batchName: "10B",
    className: "Class 10",
    scheduledDate: weekDates.Monday,
    periodNumber: 8,
    status: "used",
    usedDate: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
    totalDuration: 42,
    blocks: [
      {
        id: "block-4-1",
        type: "explain",
        title: "Types of Friction Explained",
        content: "Video explaining static, kinetic, and rolling friction",
        duration: 10,
        source: "custom",
        sourceType: "video",
        linkType: "youtube",
        embedUrl: "https://www.youtube.com/embed/fo_pmp5rtzo",
      },
      {
        id: "block-4-2",
        type: "demonstrate",
        title: "Friction Basics - PhET Simulation",
        content: "Interactive simulation to explore friction concepts",
        duration: 8,
        source: "library",
        sourceType: "animation",
        linkType: "iframe",
        embedUrl: "https://phet.colorado.edu/sims/html/friction/latest/friction_en.html",
      },
      {
        id: "block-4-3",
        type: "quiz",
        title: "Friction Concepts Check",
        content: "3 questions: 1 easy, 1 medium, 1 hard",
        duration: 6,
        source: "library",
        questions: ["q-003", "q-001", "q-002"],
        questionCount: 3,
      },
      {
        id: "block-4-4",
        type: "explain",
        title: "AI: Real-world Friction Examples",
        content: "AI-generated examples of friction in daily life, sports, and engineering",
        duration: 8,
        source: "ai",
        aiGenerated: true,
      },
      {
        id: "block-4-5",
        type: "homework",
        title: "Research Project: Friction Applications",
        content: "List 5 applications of friction in daily life. Explain how friction helps and how it can be reduced when needed. Submit as a 1-page report.",
        duration: 10,
        source: "custom",
      },
    ],
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T14:00:00Z",
  },

  // ===== LESSON PLAN 5: Circular Motion Fundamentals (DRAFT) =====
  // Combination: Desmos animation (iframe) + Solved numericals video + Quiz (1 numerical)
  {
    id: "lp-5",
    title: "Circular Motion - Concepts and Numericals",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Motion in a Plane",
    chapterId: "ch-motion-plane",
    topics: [
      "Uniform circular motion",
      "Centripetal acceleration and force",
      "Angular velocity and period"
    ],
    batchId: "batch-10a",
    batchName: "10A",
    className: "Class 10",
    scheduledDate: weekDates.Tuesday,
    periodNumber: 2,
    status: "draft",
    totalDuration: 30,
    blocks: [
      {
        id: "block-5-1",
        type: "explain",
        title: "Circular Motion Animation",
        content: "Desmos interactive graph showing circular motion parameters",
        duration: 10,
        source: "custom",
        sourceType: "animation",
        linkType: "iframe",
        embedUrl: "https://www.desmos.com/calculator/fy2qzpkbte",
      },
      {
        id: "block-5-2",
        type: "demonstrate",
        title: "Solved Numericals - Centripetal Force",
        content: "Step-by-step solved problems on circular motion",
        duration: 12,
        source: "library",
        sourceType: "video",
        sourceId: "video-circular-numericals-001",
      },
      {
        id: "block-5-3",
        type: "quiz",
        title: "Numerical: Centripetal Force Calculation",
        content: "Calculate centripetal force for given parameters",
        duration: 8,
        source: "library",
        questions: ["q-004"],
        questionCount: 1,
      },
    ],
    createdAt: "2024-01-06T11:00:00Z",
    updatedAt: "2024-01-06T11:00:00Z",
  },

  // ===== LESSON PLAN 6: Lenz's Law Practical (READY) =====
  // Combination: PPT + YouTube Demo + Quiz (3 questions) + AI Homework
  {
    id: "lp-6",
    title: "Lenz's Law - Theory and Practical Demonstration",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Electromagnetic Induction",
    chapterId: "ch-em-induction",
    topics: [
      "Lenz's law statement and explanation",
      "Direction of induced current",
      "Conservation of energy in EM induction"
    ],
    batchId: "batch-11a",
    batchName: "11A",
    className: "Class 11",
    scheduledDate: weekDates.Tuesday,
    periodNumber: 7,
    status: "ready",
    totalDuration: 40,
    blocks: [
      {
        id: "block-6-1",
        type: "explain",
        title: "Lenz's Law - Presentation",
        content: "PowerPoint presentation on Lenz's Law with diagrams",
        duration: 12,
        source: "library",
        sourceType: "ppt",
        sourceId: "ppt-lenz-law-001",
      },
      {
        id: "block-6-2",
        type: "demonstrate",
        title: "Lenz's Law Demo - Falling Magnet",
        content: "YouTube video showing Lenz's Law demonstration with falling magnet through copper tube",
        duration: 8,
        source: "custom",
        sourceType: "video",
        linkType: "youtube",
        embedUrl: "https://www.youtube.com/embed/AhBN1bSS2SA",
      },
      {
        id: "block-6-3",
        type: "quiz",
        title: "Lenz's Law Assessment",
        content: "3 questions: 2 MCQ + 1 Assertion-Reasoning",
        duration: 8,
        source: "library",
        questions: ["q-002", "q-008", "q-003"],
        questionCount: 3,
      },
      {
        id: "block-6-4",
        type: "homework",
        title: "AI Practice Problems - Induced EMF",
        content: "AI-generated practice problems on calculating induced EMF using Lenz's Law",
        duration: 12,
        source: "ai",
        aiGenerated: true,
      },
    ],
    createdAt: "2024-01-04T14:00:00Z",
    updatedAt: "2024-01-06T10:00:00Z",
  },

  // ===== LESSON PLAN 7: Momentum and Collisions (READY) =====
  // Combination: Video + PhET Collision Lab + Quiz (4 questions)
  {
    id: "lp-7",
    title: "Momentum and Collisions - Conservation Laws",
    subject: "Physics",
    subjectId: "phy",
    chapter: "Laws of Motion",
    chapterId: "ch-laws-motion",
    topics: [
      "Linear momentum definition",
      "Conservation of momentum",
      "Elastic and inelastic collisions"
    ],
    batchId: "batch-10b",
    batchName: "10B",
    className: "Class 10",
    scheduledDate: weekDates.Wednesday,
    periodNumber: 1,
    status: "ready",
    totalDuration: 38,
    blocks: [
      {
        id: "block-7-1",
        type: "explain",
        title: "Momentum and Impulse - Concept Video",
        content: "Video explaining momentum, impulse, and their relationship",
        duration: 14,
        source: "custom",
        sourceType: "video",
        linkType: "youtube",
        embedUrl: "https://www.youtube.com/embed/XFhntPxow0U",
      },
      {
        id: "block-7-2",
        type: "demonstrate",
        title: "Collision Lab - PhET Simulation",
        content: "Interactive simulation for elastic and inelastic collisions",
        duration: 12,
        source: "library",
        sourceType: "animation",
        linkType: "iframe",
        embedUrl: "https://phet.colorado.edu/sims/html/collision-lab/latest/collision-lab_en.html",
      },
      {
        id: "block-7-3",
        type: "quiz",
        title: "Momentum Conservation Quiz",
        content: "4 questions on momentum conservation",
        duration: 12,
        source: "library",
        questions: ["q-001", "q-005", "q-006", "q-007"],
        questionCount: 4,
      },
    ],
    createdAt: "2024-01-05T09:00:00Z",
    updatedAt: "2024-01-05T15:00:00Z",
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
