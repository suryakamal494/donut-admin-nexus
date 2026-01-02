// Mock data for Institute Panel

export interface Batch {
  id: string;
  name: string;
  classId: string;
  className: string;
  academicYear: string;
  subjects: string[];
  studentCount: number;
  teacherCount: number;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  mobile: string;
  username: string;
  subjects: string[];
  batches: { batchId: string; batchName: string; subject: string }[];
  status: "active" | "inactive";
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  username: string;
  rollNumber: string;
  batchId: string;
  batchName: string;
  className: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string;
  endTime: string;
  subject: string;
  subjectId: string;
  teacher: string;
  teacherId: string;
  batchId: string;
}

export interface InstituteExam {
  id: string;
  name: string;
  type: "unit_test" | "mid_term" | "final" | "practice";
  status: "draft" | "scheduled" | "live" | "completed";
  subjects: string[];
  totalQuestions: number;
  totalMarks: number;
  duration: number;
  batches: string[];
  scheduledDate?: string;
  uiType: "platform" | "real_exam";
  pattern?: string;
  createdAt: string;
}

// Sample Batches
export const batches: Batch[] = [
  {
    id: "batch-1",
    name: "Section A",
    classId: "class-10",
    className: "Class 10",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng", "cs", "eco"],
    studentCount: 45,
    teacherCount: 7,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-2",
    name: "Section B",
    classId: "class-10",
    className: "Class 10",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng", "cs", "eco"],
    studentCount: 42,
    teacherCount: 7,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-3",
    name: "Section A",
    classId: "class-9",
    className: "Class 9",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng", "hin", "sst"],
    studentCount: 48,
    teacherCount: 7,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-4",
    name: "Section B",
    classId: "class-9",
    className: "Class 9",
    academicYear: "2024-25",
    subjects: ["mat", "phy", "che", "bio", "eng", "hin"],
    studentCount: 46,
    teacherCount: 6,
    createdAt: "2024-04-01",
  },
  {
    id: "batch-5",
    name: "Section A",
    classId: "class-8",
    className: "Class 8",
    academicYear: "2024-25",
    subjects: ["mat", "sci", "eng", "hin", "sst"],
    studentCount: 50,
    teacherCount: 5,
    createdAt: "2024-04-01",
  },
];

// Sample Teachers - 10 teachers with consistent batch/subject assignments
export const teachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@dps.edu",
    mobile: "9876543210",
    username: "rajesh.kumar",
    subjects: ["phy"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Physics" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Physics" },
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Physics" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-2",
    name: "Mrs. Priya Sharma",
    email: "priya.sharma@dps.edu",
    mobile: "9876543211",
    username: "priya.sharma",
    subjects: ["mat"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Mathematics" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Mathematics" },
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Mathematics" },
      { batchId: "batch-4", batchName: "Class 9 - Section B", subject: "Mathematics" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-3",
    name: "Mr. Suresh Verma",
    email: "suresh.verma@dps.edu",
    mobile: "9876543212",
    username: "suresh.verma",
    subjects: ["che"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Chemistry" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Chemistry" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-4",
    name: "Ms. Anjali Gupta",
    email: "anjali.gupta@dps.edu",
    mobile: "9876543213",
    username: "anjali.gupta",
    subjects: ["bio"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Biology" },
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Biology" },
      { batchId: "batch-4", batchName: "Class 9 - Section B", subject: "Biology" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-5",
    name: "Mr. Vikram Singh",
    email: "vikram.singh@dps.edu",
    mobile: "9876543214",
    username: "vikram.singh",
    subjects: ["eng"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "English" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "English" },
      { batchId: "batch-5", batchName: "Class 8 - Section A", subject: "English" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  // 5 NEW TEACHERS
  {
    id: "teacher-6",
    name: "Mrs. Kavita Nair",
    email: "kavita.nair@dps.edu",
    mobile: "9876543215",
    username: "kavita.nair",
    subjects: ["hin"],
    batches: [
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Hindi" },
      { batchId: "batch-4", batchName: "Class 9 - Section B", subject: "Hindi" },
      { batchId: "batch-5", batchName: "Class 8 - Section A", subject: "Hindi" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-7",
    name: "Mr. Arun Mehta",
    email: "arun.mehta@dps.edu",
    mobile: "9876543216",
    username: "arun.mehta",
    subjects: ["sst"],
    batches: [
      { batchId: "batch-5", batchName: "Class 8 - Section A", subject: "Social Studies" },
      { batchId: "batch-3", batchName: "Class 9 - Section A", subject: "Social Studies" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-8",
    name: "Dr. Sneha Reddy",
    email: "sneha.reddy@dps.edu",
    mobile: "9876543217",
    username: "sneha.reddy",
    subjects: ["cs"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Computer Science" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Computer Science" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-9",
    name: "Mr. Rahul Saxena",
    email: "rahul.saxena@dps.edu",
    mobile: "9876543218",
    username: "rahul.saxena",
    subjects: ["eco"],
    batches: [
      { batchId: "batch-1", batchName: "Class 10 - Section A", subject: "Economics" },
      { batchId: "batch-2", batchName: "Class 10 - Section B", subject: "Economics" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
  {
    id: "teacher-10",
    name: "Mrs. Geeta Iyer",
    email: "geeta.iyer@dps.edu",
    mobile: "9876543219",
    username: "geeta.iyer",
    subjects: ["sci"],
    batches: [
      { batchId: "batch-5", batchName: "Class 8 - Section A", subject: "Science" },
    ],
    status: "active",
    createdAt: "2024-03-15",
  },
];

// Sample Students
export const students: Student[] = [
  { id: "student-1", name: "Aarav Patel", username: "aarav.patel", rollNumber: "001", batchId: "batch-1", batchName: "Section A", className: "Class 10", status: "active", createdAt: "2024-04-01" },
  { id: "student-2", name: "Diya Sharma", username: "diya.sharma", rollNumber: "002", batchId: "batch-1", batchName: "Section A", className: "Class 10", status: "active", createdAt: "2024-04-01" },
  { id: "student-3", name: "Arjun Singh", username: "arjun.singh", rollNumber: "003", batchId: "batch-1", batchName: "Section A", className: "Class 10", status: "active", createdAt: "2024-04-01" },
  { id: "student-4", name: "Ananya Gupta", username: "ananya.gupta", rollNumber: "004", batchId: "batch-1", batchName: "Section A", className: "Class 10", status: "active", createdAt: "2024-04-01" },
  { id: "student-5", name: "Vihaan Kumar", username: "vihaan.kumar", rollNumber: "005", batchId: "batch-2", batchName: "Section B", className: "Class 10", status: "active", createdAt: "2024-04-01" },
  { id: "student-6", name: "Ishaan Reddy", username: "ishaan.reddy", rollNumber: "001", batchId: "batch-3", batchName: "Section A", className: "Class 9", status: "active", createdAt: "2024-04-01" },
  { id: "student-7", name: "Saanvi Joshi", username: "saanvi.joshi", rollNumber: "002", batchId: "batch-3", batchName: "Section A", className: "Class 9", status: "active", createdAt: "2024-04-01" },
  { id: "student-8", name: "Reyansh Mehta", username: "reyansh.mehta", rollNumber: "001", batchId: "batch-5", batchName: "Section A", className: "Class 8", status: "active", createdAt: "2024-04-01" },
];

// Sample Timetable for Class 10 Section A
export const timetableSlots: TimetableSlot[] = [
  { id: "slot-1", day: "Monday", startTime: "08:00", endTime: "08:45", subject: "Mathematics", subjectId: "mat", teacher: "Mrs. Priya Sharma", teacherId: "teacher-2", batchId: "batch-1" },
  { id: "slot-2", day: "Monday", startTime: "08:45", endTime: "09:30", subject: "Physics", subjectId: "phy", teacher: "Dr. Rajesh Kumar", teacherId: "teacher-1", batchId: "batch-1" },
  { id: "slot-3", day: "Monday", startTime: "09:45", endTime: "10:30", subject: "Chemistry", subjectId: "che", teacher: "Mr. Suresh Verma", teacherId: "teacher-3", batchId: "batch-1" },
  { id: "slot-4", day: "Monday", startTime: "10:30", endTime: "11:15", subject: "English", subjectId: "eng", teacher: "Mr. Vikram Singh", teacherId: "teacher-5", batchId: "batch-1" },
  { id: "slot-5", day: "Tuesday", startTime: "08:00", endTime: "08:45", subject: "Physics", subjectId: "phy", teacher: "Dr. Rajesh Kumar", teacherId: "teacher-1", batchId: "batch-1" },
  { id: "slot-6", day: "Tuesday", startTime: "08:45", endTime: "09:30", subject: "Mathematics", subjectId: "mat", teacher: "Mrs. Priya Sharma", teacherId: "teacher-2", batchId: "batch-1" },
  { id: "slot-7", day: "Tuesday", startTime: "09:45", endTime: "10:30", subject: "Biology", subjectId: "bio", teacher: "Ms. Anjali Gupta", teacherId: "teacher-4", batchId: "batch-1" },
  { id: "slot-8", day: "Wednesday", startTime: "08:00", endTime: "08:45", subject: "Chemistry", subjectId: "che", teacher: "Mr. Suresh Verma", teacherId: "teacher-3", batchId: "batch-1" },
  { id: "slot-9", day: "Wednesday", startTime: "08:45", endTime: "09:30", subject: "English", subjectId: "eng", teacher: "Mr. Vikram Singh", teacherId: "teacher-5", batchId: "batch-1" },
  { id: "slot-10", day: "Thursday", startTime: "08:00", endTime: "08:45", subject: "Mathematics", subjectId: "mat", teacher: "Mrs. Priya Sharma", teacherId: "teacher-2", batchId: "batch-1" },
  { id: "slot-11", day: "Friday", startTime: "08:00", endTime: "08:45", subject: "Physics", subjectId: "phy", teacher: "Dr. Rajesh Kumar", teacherId: "teacher-1", batchId: "batch-1" },
];

// Sample Exams
export const instituteExams: InstituteExam[] = [
  {
    id: "exam-1",
    name: "Mid-Term Physics",
    type: "mid_term",
    status: "completed",
    subjects: ["phy"],
    totalQuestions: 30,
    totalMarks: 100,
    duration: 90,
    batches: ["batch-1", "batch-2"],
    scheduledDate: "2024-09-15",
    uiType: "platform",
    createdAt: "2024-09-01",
  },
  {
    id: "exam-2",
    name: "Unit Test - Chemistry",
    type: "unit_test",
    status: "scheduled",
    subjects: ["che"],
    totalQuestions: 20,
    totalMarks: 50,
    duration: 60,
    batches: ["batch-1"],
    scheduledDate: "2025-01-10",
    uiType: "platform",
    createdAt: "2024-12-20",
  },
  {
    id: "exam-3",
    name: "Practice Test - Mathematics",
    type: "practice",
    status: "live",
    subjects: ["mat"],
    totalQuestions: 25,
    totalMarks: 75,
    duration: 75,
    batches: ["batch-1", "batch-3"],
    uiType: "real_exam",
    createdAt: "2024-12-28",
  },
  {
    id: "exam-4",
    name: "Final Exam - All Subjects",
    type: "final",
    status: "draft",
    subjects: ["phy", "che", "mat", "bio", "eng"],
    totalQuestions: 100,
    totalMarks: 300,
    duration: 180,
    batches: ["batch-1", "batch-2"],
    uiType: "real_exam",
    pattern: "JEE",
    createdAt: "2024-12-30",
  },
];

// Dashboard Stats
export const dashboardStats = {
  setupStatus: {
    classesConfigured: true,
    batchesCreated: true,
    teachersAdded: true,
    studentsAdded: true,
  },
  todaySnapshot: {
    classesScheduled: 24,
    testsScheduledThisWeek: 3,
    pendingTestReviews: 2,
  },
  counts: {
    totalBatches: 5,
    totalTeachers: 10,
    totalStudents: 231,
    totalExams: 4,
  },
};

// Available classes from Super Admin master data
export const availableClasses = [
  { id: "class-6", name: "Class 6" },
  { id: "class-7", name: "Class 7" },
  { id: "class-8", name: "Class 8" },
  { id: "class-9", name: "Class 9" },
  { id: "class-10", name: "Class 10" },
  { id: "class-11", name: "Class 11" },
  { id: "class-12", name: "Class 12" },
];

// Available subjects from Super Admin master data
export const availableSubjects = [
  { id: "mat", name: "Mathematics" },
  { id: "phy", name: "Physics" },
  { id: "che", name: "Chemistry" },
  { id: "bio", name: "Biology" },
  { id: "eng", name: "English" },
  { id: "hin", name: "Hindi" },
  { id: "sci", name: "Science" },
  { id: "sst", name: "Social Studies" },
  { id: "cs", name: "Computer Science" },
  { id: "eco", name: "Economics" },
];
