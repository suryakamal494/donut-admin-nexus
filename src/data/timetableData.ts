// Timetable Module Data Types and Mock Data

export interface PeriodStructure {
  id: string;
  periodsPerDay: number;
  breakAfterPeriod: number;
  workingDays: string[];
  timeMapping: { period: number; startTime: string; endTime: string }[];
  isConfigured: boolean;
}

// NEW: Period Types (Library, Lab, Sports, etc.)
export interface PeriodType {
  id: string;
  name: string;
  icon: string;
  color: string;
  requiresTeacher: boolean;
  isDouble: boolean;
  isDefault: boolean;
}

// NEW: Academic Term
export interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

// NEW: Batch Exam Schedule
export interface BatchExamSchedule {
  id: string;
  batchId: string;
  batchName: string;
  termId: string;
  examType: 'weekly' | 'monthly' | 'terminal' | 'annual';
  dates: string[];
  recurringDay?: string;
}

export interface TeacherLoad {
  teacherId: string;
  teacherName: string;
  subjects: string[];
  periodsPerWeek: number;
  assignedPeriods: number;
  avoidFirstPeriod: boolean;
  avoidLastPeriod: boolean;
  workingDays: string[];
  allowedBatches: { batchId: string; batchName: string; subject: string }[];
}

export interface TimetableEntry {
  id: string;
  day: string;
  periodNumber: number;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  batchId: string;
  batchName: string;
  periodType?: string;
  facilityId?: string;
  facilityName?: string;
  substituteTeacherId?: string;
  substituteTeacherName?: string;
  isSubstituted?: boolean;
}

export interface TimetableConflict {
  type: 'teacher_clash' | 'batch_clash' | 'overload' | 'constraint_violation' | 'facility_conflict' | 'preference_warning';
  severity: 'error' | 'warning';
  message: string;
  day: string;
  periodNumber: number;
  teacherId?: string;
  batchId?: string;
  facilityId?: string;
}

// NEW: Teacher Availability Constraints
export interface TeacherConstraint {
  teacherId: string;
  maxPeriodsPerDay: number;
  maxConsecutivePeriods: number;
  unavailableDays: string[];
  unavailablePeriods: { day: string; period: number }[];
  timeWindow?: {
    startPeriod: number;
    endPeriod: number;
  };
  preferenceLevel: 'hard' | 'soft';
}

// NEW: Facility/Resource Management
export interface Facility {
  id: string;
  name: string;
  type: 'lab' | 'sports' | 'special' | 'classroom';
  capacity?: number;
  duration: number; // Periods required (1 or 2)
  allowedClasses: string[];
  linkedPeriodType?: string;
  availability?: {
    days: string[];
    periods?: { start: number; end: number };
  };
}

// NEW: Teacher Absence for Substitution Management
export interface TeacherAbsence {
  id: string;
  teacherId: string;
  teacherName: string;
  date: string;
  absenceType: 'full_day' | 'partial';
  periods?: number[];
  reason?: string;
  createdAt: string;
}

// NEW: Substitution Assignment
export interface SubstitutionAssignment {
  id: string;
  absenceId: string;
  originalTeacherId: string;
  substituteTeacherId: string;
  substituteTeacherName: string;
  date: string;
  period: number;
  batchId: string;
  batchName: string;
  subject: string;
  status: 'pending' | 'assigned' | 'confirmed';
  isTemporary: boolean;
}

// Default period structure
export const defaultPeriodStructure: PeriodStructure = {
  id: 'ps-1',
  periodsPerDay: 8,
  breakAfterPeriod: 4,
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  timeMapping: [
    { period: 1, startTime: '08:00', endTime: '08:45' },
    { period: 2, startTime: '08:45', endTime: '09:30' },
    { period: 3, startTime: '09:30', endTime: '10:15' },
    { period: 4, startTime: '10:15', endTime: '11:00' },
    { period: 5, startTime: '11:30', endTime: '12:15' },
    { period: 6, startTime: '12:15', endTime: '13:00' },
    { period: 7, startTime: '14:00', endTime: '14:45' },
    { period: 8, startTime: '14:45', endTime: '15:30' },
  ],
  isConfigured: true,
};

// Teacher loads with availability - 10 teachers with proper batch/subject assignments
export const teacherLoads: TeacherLoad[] = [
  {
    teacherId: 'teacher-1',
    teacherName: 'Dr. Rajesh Kumar',
    subjects: ['phy'],
    periodsPerWeek: 25,
    assignedPeriods: 12,
    avoidFirstPeriod: false,
    avoidLastPeriod: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Physics' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Physics' },
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Physics' },
    ],
  },
  {
    teacherId: 'teacher-2',
    teacherName: 'Mrs. Priya Sharma',
    subjects: ['mat'],
    periodsPerWeek: 30,
    assignedPeriods: 18,
    avoidFirstPeriod: true,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Mathematics' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Mathematics' },
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Mathematics' },
      { batchId: 'batch-4', batchName: 'Class 9 - Section B', subject: 'Mathematics' },
    ],
  },
  {
    teacherId: 'teacher-3',
    teacherName: 'Mr. Suresh Verma',
    subjects: ['che'],
    periodsPerWeek: 20,
    assignedPeriods: 10,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Chemistry' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Chemistry' },
    ],
  },
  {
    teacherId: 'teacher-4',
    teacherName: 'Ms. Anjali Gupta',
    subjects: ['bio'],
    periodsPerWeek: 22,
    assignedPeriods: 8,
    avoidFirstPeriod: false,
    avoidLastPeriod: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Biology' },
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Biology' },
      { batchId: 'batch-4', batchName: 'Class 9 - Section B', subject: 'Biology' },
    ],
  },
  {
    teacherId: 'teacher-5',
    teacherName: 'Mr. Vikram Singh',
    subjects: ['eng'],
    periodsPerWeek: 28,
    assignedPeriods: 15,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'English' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'English' },
      { batchId: 'batch-5', batchName: 'Class 8 - Section A', subject: 'English' },
    ],
  },
  // 5 NEW TEACHERS
  {
    teacherId: 'teacher-6',
    teacherName: 'Mrs. Kavita Nair',
    subjects: ['hin'],
    periodsPerWeek: 24,
    assignedPeriods: 10,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Hindi' },
      { batchId: 'batch-4', batchName: 'Class 9 - Section B', subject: 'Hindi' },
      { batchId: 'batch-5', batchName: 'Class 8 - Section A', subject: 'Hindi' },
    ],
  },
  {
    teacherId: 'teacher-7',
    teacherName: 'Mr. Arun Mehta',
    subjects: ['sst'],
    periodsPerWeek: 22,
    assignedPeriods: 12,
    avoidFirstPeriod: true,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    allowedBatches: [
      { batchId: 'batch-5', batchName: 'Class 8 - Section A', subject: 'Social Studies' },
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Social Studies' },
    ],
  },
  {
    teacherId: 'teacher-8',
    teacherName: 'Dr. Sneha Reddy',
    subjects: ['cs'],
    periodsPerWeek: 18,
    assignedPeriods: 6,
    avoidFirstPeriod: false,
    avoidLastPeriod: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Computer Science' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Computer Science' },
    ],
  },
  {
    teacherId: 'teacher-9',
    teacherName: 'Mr. Rahul Saxena',
    subjects: ['eco'],
    periodsPerWeek: 16,
    assignedPeriods: 4,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Economics' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Economics' },
    ],
  },
  {
    teacherId: 'teacher-10',
    teacherName: 'Mrs. Geeta Iyer',
    subjects: ['sci'],
    periodsPerWeek: 26,
    assignedPeriods: 14,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-5', batchName: 'Class 8 - Section A', subject: 'Science' },
    ],
  },
];

// Existing timetable entries (sample data)
export const timetableEntries: TimetableEntry[] = [
  // Batch 1 (Class 10 - Section A) entries
  { id: 'entry-1', day: 'Monday', periodNumber: 1, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-2', day: 'Monday', periodNumber: 2, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-3', day: 'Monday', periodNumber: 3, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-4', day: 'Monday', periodNumber: 5, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-5', day: 'Tuesday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-6', day: 'Tuesday', periodNumber: 2, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-7', day: 'Tuesday', periodNumber: 3, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-8', day: 'Wednesday', periodNumber: 1, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-9', day: 'Wednesday', periodNumber: 2, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-10', day: 'Thursday', periodNumber: 1, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-11', day: 'Friday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-20', day: 'Wednesday', periodNumber: 3, subjectId: 'cs', subjectName: 'Computer Science', teacherId: 'teacher-8', teacherName: 'Dr. Sneha Reddy', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-21', day: 'Thursday', periodNumber: 2, subjectId: 'eco', subjectName: 'Economics', teacherId: 'teacher-9', teacherName: 'Mr. Rahul Saxena', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  
  // Batch 2 (Class 10 - Section B) entries
  { id: 'entry-12', day: 'Monday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'entry-13', day: 'Monday', periodNumber: 2, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'entry-22', day: 'Tuesday', periodNumber: 1, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'entry-23', day: 'Tuesday', periodNumber: 2, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'entry-24', day: 'Wednesday', periodNumber: 1, subjectId: 'cs', subjectName: 'Computer Science', teacherId: 'teacher-8', teacherName: 'Dr. Sneha Reddy', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  
  // Batch 3 (Class 9 - Section A) entries
  { id: 'entry-14', day: 'Monday', periodNumber: 3, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'entry-15', day: 'Monday', periodNumber: 4, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'entry-25', day: 'Tuesday', periodNumber: 4, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'entry-26', day: 'Wednesday', periodNumber: 4, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  
  // Batch 4 (Class 9 - Section B) entries
  { id: 'entry-16', day: 'Monday', periodNumber: 5, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'entry-27', day: 'Tuesday', periodNumber: 5, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'entry-28', day: 'Wednesday', periodNumber: 5, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  
  // Batch 5 (Class 8 - Section A) entries
  { id: 'entry-17', day: 'Monday', periodNumber: 6, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'entry-29', day: 'Tuesday', periodNumber: 6, subjectId: 'sci', subjectName: 'Science', teacherId: 'teacher-10', teacherName: 'Mrs. Geeta Iyer', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'entry-30', day: 'Wednesday', periodNumber: 6, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'entry-31', day: 'Thursday', periodNumber: 6, subjectId: 'sst', subjectName: 'Social Studies', teacherId: 'teacher-7', teacherName: 'Mr. Arun Mehta', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
];

// Subject colors for visual display
export const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
  mat: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  phy: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  che: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  bio: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  eng: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  hin: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  sci: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  sst: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  cs: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
  eco: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
};

// Holidays for the academic year
export const academicHolidays = [
  { date: '2025-01-26', name: 'Republic Day' },
  { date: '2025-03-14', name: 'Holi' },
  { date: '2025-04-14', name: 'Ambedkar Jayanti' },
  { date: '2025-08-15', name: 'Independence Day' },
  { date: '2025-10-02', name: 'Gandhi Jayanti' },
  { date: '2025-10-24', name: 'Diwali' },
  { date: '2025-12-25', name: 'Christmas' },
];

// NEW: Default Period Types
export const defaultPeriodTypes: PeriodType[] = [
  { id: 'regular', name: 'Regular Class', icon: 'BookOpen', color: 'bg-blue-100 text-blue-700', requiresTeacher: true, isDouble: false, isDefault: true },
  { id: 'library', name: 'Library', icon: 'Library', color: 'bg-amber-100 text-amber-700', requiresTeacher: false, isDouble: false, isDefault: true },
  { id: 'lab', name: 'Lab', icon: 'FlaskConical', color: 'bg-purple-100 text-purple-700', requiresTeacher: true, isDouble: true, isDefault: true },
  { id: 'sports', name: 'Sports', icon: 'Dumbbell', color: 'bg-green-100 text-green-700', requiresTeacher: true, isDouble: false, isDefault: true },
  { id: 'activity', name: 'Activity', icon: 'Palette', color: 'bg-pink-100 text-pink-700', requiresTeacher: true, isDouble: false, isDefault: true },
  { id: 'assembly', name: 'Assembly', icon: 'Users', color: 'bg-slate-100 text-slate-700', requiresTeacher: false, isDouble: false, isDefault: true },
  { id: 'free', name: 'Free Period', icon: 'Coffee', color: 'bg-gray-100 text-gray-700', requiresTeacher: false, isDouble: false, isDefault: true },
  { id: 'exam', name: 'Exam', icon: 'FileEdit', color: 'bg-red-100 text-red-700', requiresTeacher: true, isDouble: true, isDefault: true },
];

// NEW: Academic Terms
export const academicTerms: AcademicTerm[] = [
  { id: 'term-1', name: 'Term 1', startDate: '2025-04-01', endDate: '2025-09-30' },
  { id: 'term-2', name: 'Term 2', startDate: '2025-10-01', endDate: '2026-03-31' },
];

// NEW: Batch Exam Schedules (sample)
export const batchExamSchedules: BatchExamSchedule[] = [
  { id: 'sch-1', batchId: 'batch-1', batchName: 'Class 10 - Section A', termId: 'term-1', examType: 'weekly', dates: [], recurringDay: 'Saturday' },
  { id: 'sch-2', batchId: 'batch-1', batchName: 'Class 10 - Section A', termId: 'term-1', examType: 'monthly', dates: ['2025-04-28', '2025-05-26', '2025-06-30'] },
  { id: 'sch-3', batchId: 'batch-1', batchName: 'Class 10 - Section A', termId: 'term-1', examType: 'terminal', dates: ['2025-09-15', '2025-09-16', '2025-09-17'] },
];

// NEW: Default Facilities
export const defaultFacilities: Facility[] = [
  // Labs
  { id: 'lab-physics', name: 'Physics Lab', type: 'lab', capacity: 30, duration: 2, allowedClasses: ['Class 8', 'Class 9', 'Class 10'], linkedPeriodType: 'lab' },
  { id: 'lab-chemistry', name: 'Chemistry Lab', type: 'lab', capacity: 30, duration: 2, allowedClasses: ['Class 8', 'Class 9', 'Class 10'], linkedPeriodType: 'lab' },
  { id: 'lab-biology', name: 'Biology Lab', type: 'lab', capacity: 30, duration: 2, allowedClasses: ['Class 8', 'Class 9', 'Class 10'], linkedPeriodType: 'lab' },
  { id: 'lab-computer', name: 'Computer Lab', type: 'lab', capacity: 40, duration: 1, allowedClasses: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'] },
  
  // Sports
  { id: 'sports-field', name: 'Sports Field', type: 'sports', capacity: 60, duration: 1, allowedClasses: [], linkedPeriodType: 'sports' },
  { id: 'sports-indoor', name: 'Indoor Court', type: 'sports', capacity: 30, duration: 1, allowedClasses: [] },
  
  // Special Rooms
  { id: 'room-library', name: 'Library', type: 'special', capacity: 40, duration: 1, allowedClasses: [], linkedPeriodType: 'library' },
  { id: 'room-art', name: 'Art Room', type: 'special', capacity: 30, duration: 1, allowedClasses: [] },
  { id: 'room-music', name: 'Music Room', type: 'special', capacity: 25, duration: 1, allowedClasses: [] },
  { id: 'room-auditorium', name: 'Auditorium', type: 'special', capacity: 200, duration: 2, allowedClasses: [] },
  
  // Classrooms
  { id: 'classroom-a1', name: 'Classroom A1', type: 'classroom', capacity: 40, duration: 1, allowedClasses: [] },
  { id: 'classroom-a2', name: 'Classroom A2', type: 'classroom', capacity: 40, duration: 1, allowedClasses: [] },
  { id: 'classroom-b1', name: 'Classroom B1', type: 'classroom', capacity: 35, duration: 1, allowedClasses: [] },
];

// NEW: Default Teacher Constraints
export const defaultTeacherConstraints: TeacherConstraint[] = [
  { 
    teacherId: 'teacher-1', 
    maxPeriodsPerDay: 5, 
    maxConsecutivePeriods: 3, 
    unavailableDays: [], 
    unavailablePeriods: [], 
    preferenceLevel: 'soft' 
  },
  { 
    teacherId: 'teacher-2', 
    maxPeriodsPerDay: 6, 
    maxConsecutivePeriods: 4, 
    unavailableDays: ['Saturday'], 
    unavailablePeriods: [], 
    preferenceLevel: 'hard' 
  },
];

// NEW: Sample Teacher Absences
export const sampleTeacherAbsences: TeacherAbsence[] = [];

// NEW: Sample Substitution Assignments
export const sampleSubstitutionAssignments: SubstitutionAssignment[] = [];
